import * as React from 'react';
import { View, Image, TextInput, Text, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Config from 'react-native-config';
import { INavigation } from '../../interface';
import { Toast } from 'antd-mobile';
import { getAppJSON, postAppForm, postAppJSON } from '../../netWork';
import { mobileNumberRegExp, passwordRegExp } from '../../utils';

interface IState {
    mobile: string;
    captureImage: string;
    pwdImg: any;
    captcha: string;
    identifyCode: string;
    isShowPwd: boolean;
    password: string;
    sentMessageText: string;
}
const second = 60;
let timerId = null;
export default class ResetPassword extends React.Component<INavigation, IState> {
    constructor(props) {
        super(props);
        this.state = {
            mobile: this.props.navigation.state.params.mobile,
            captureImage: '',
            pwdImg: require('../../images/eye_open.png'),
            captcha: '',
            identifyCode: '',
            isShowPwd: false,
            password: '',
            sentMessageText: '获取验证码',
        };
    }
    public async componentDidMount() {
        const token = await global.getItem('userToken');
        const initCaptcha = Config.SERVER_DATA + Config.GET_IMG_CAPTCHA + '?rnd='
            + Math.random() + '&flag=' + token.substring(6);
        this.setState({
            captureImage: initCaptcha,
        });
    }
    public render() {
        return <View style={styles.container}>
            <View style={styles.inputBox}>
                <Image source={require('../../images/ic_phone.png')}
                    style={{ width: 40, height: 50 }} />
                <TextInput style={styles.textInput}
                    placeholder='请输入您的手机号'
                    underlineColorAndroid='transparent'
                    autoCapitalize='none'
                    onChangeText={(value) => this.setState({ mobile: value })}
                    value={this.state.mobile}
                />
            </View>
            <View style={styles.inputBox}>
                <Image source={require('../../images/ic_message.png')}
                    style={{ width: 40, height: 50 }} />
                <TextInput style={styles.textInput}
                    placeholder='输入验证码'
                    underlineColorAndroid='transparent'
                    autoCapitalize='none'
                    onChangeText={(value) => this.setState({ captcha: value })}></TextInput>
                <TouchableOpacity onPress={() => this.getIdentifyImg()}>
                    <Image source={{ uri: this.state.captureImage }}
                        style={{ width: 80, height: 41 }} />
                </TouchableOpacity>
            </View>
            <View style={styles.inputBox}>
                <Image source={require('../../images/ic_message.png')}
                    style={{ width: 40, height: 50 }} />
                <TextInput style={styles.textInput}
                    placeholder='输入短信验证码'
                    underlineColorAndroid='transparent'
                    autoCapitalize='none'
                    keyboardType='numeric'
                    onChangeText={(value) => this.setState({ identifyCode: value })}></TextInput>
                <TouchableOpacity onPress={() => this.getIdentifyCode()}
                    activeOpacity={1}>
                    <View style={styles.btnIdentify}>
                        <Text style={{ color: 'white', fontSize: 12 }}>{this.state.sentMessageText}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.inputBox}>
                <Image source={require('../../images/ic_locker.png')}
                    style={{ width: 40, height: 50 }} />
                <TextInput style={styles.textInput}
                    placeholder='输入新密码'
                    underlineColorAndroid='transparent'
                    secureTextEntry={!this.state.isShowPwd}
                    autoCapitalize='none'
                    onChangeText={(value) => this.setState({ password: value })}></TextInput>
                <TouchableOpacity onPress={() => this.togglePwd()}>
                    <Image source={this.state.pwdImg}
                        style={{ width: 23, height: 23 }} />
                </TouchableOpacity>
            </View>
            <Text style={styles.pwdTip}>提示：密码为数字、字母、特殊符号中的两种组合，长度6位~20位(字母区分大小写)</Text>
            <TouchableOpacity onPress={() => this.passwordSubmit()}>
                <View style={styles.btnSubmit}>
                    <Text style={{ color: 'white' }}>确认提交</Text>
                </View>
            </TouchableOpacity>
        </View>;
    }
    public togglePwd() {
        if (this.state.isShowPwd) {
            this.setState({
                isShowPwd: false,
                pwdImg: require('../../images/eye_open.png'),
            });
        } else {
            this.setState({
                isShowPwd: true,
                pwdImg: require('../../images/eye_close.png'),
            });
        }
    }
    public async getIdentifyImg() {
        const token = await global.getItem('userToken');
        const TempIdentify = Config.SERVER_DATA + Config.GET_IMG_CAPTCHA + '?rnd='
            + Math.random() + '&flag=' + token.substring(6);
        this.setState({ captureImage: TempIdentify });
    }
    public getIdentifyCode = async () => {
        if (this.state.sentMessageText !== '获取验证码' && this.state.sentMessageText !== '重发验证码') { return; }
        if (!mobileNumberRegExp.test(this.state.mobile)) {
            Toast.info('请输入正确的手机号码！');
        } else if (this.state.captcha.length === 0) {
            Toast.info('请输入验证码！');
        } else {
            try {
                const params = {
                    mobileNum: this.state.mobile,
                    captcha: this.state.captcha,
                };
                const response = await getAppJSON(Config.GET_PASSWORD_CAPTCHA, params);
                if (response.success) {
                    this.sentTimer();
                } else if (response.message) {
                    Toast.info(response.message, 1);
                } else {
                    Toast.info('获取验证码失败！', 1);
                }
            } catch (error) {
                Log(error);
            }
        }
    }
    public sentTimer() {
        this.setState({
            sentMessageText: second + '秒后可重发',
        });
        let count: number = second;
        timerId = setInterval(() => {
            if (count <= 0) {
                this.setState({
                    sentMessageText: '重发验证码',
                });
                count = second;
                clearInterval(timerId);
            } else {
                count--;
                this.setState({
                    sentMessageText: count + '秒后可重发',
                });
            }
        }, 1000);
    }
    public async passwordSubmit() {
        if (this.state.mobile.length === 0) {
            Toast.info('请输入您的手机号！');
          } else if (!(passwordRegExp.test(this.state.password))) {
            Toast.info('密码为数字、字母、特殊符号中的两种组合，长度6位~20位(字母区分大小写)');
          } else if (this.state.identifyCode.length === 0) {
            Toast.info('获取验证码失败！');
          } else {
              try {
                  const params = {
                    mobileNum: this.state.mobile,
                    captcha: this.state.identifyCode,
                    password: encodeURIComponent(this.state.password),
                    imgCaptcha: this.state.captcha,
                  };
                  const response = await postAppForm(Config.REQUEST_PASSWORD, params);
                  if (response.success) {
                    Toast.info('修改成功', 1);
                    setTimeout(() => this.props.navigation.navigate('Login'), 1000);
                  } else if (response.message) {
                    Toast.info(response.message);
                    this.getIdentifyImg();
                  } else {
                    Toast.info('提交失败！');
                    this.getIdentifyImg();
                  }
              } catch (error) {
                  Log(error);
              }
          }
    }
    public componentWillUnmount() {
        clearInterval(timerId);
    }
}
const styles = EStyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        paddingHorizontal: 5,
    },
    inputBox: {
        height: 52,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    textInput: {
        flex: 1,
    },
    btnIdentify: {
        width: 80,
        height: 33,
        backgroundColor: '#32beff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    pwdTip: {
        color: '#333',
        fontSize: 12,
        padding: 10,
    },
    btnSubmit: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#32beff',
        height: 33,
        marginHorizontal: 10,
        borderRadius: 4,
        marginTop: 45,
    },
});
