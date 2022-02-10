import * as React from 'react';
import {View, TextInput, ScrollView, Text, Image, TouchableOpacity, Dimensions} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import LoginHeader from '../Login/loginHeader';
import {NavigationScreenProp} from 'react-navigation';
import {Checkbox, Toast} from 'antd-mobile';
import {getAppJSON, postAppForm, postAppJSON} from '../../netWork';
import {width, mobileNumberRegExp, passwordRegExp} from '../../utils';
import Config from 'react-native-config';
interface ILoginHeader {
    loginText: string;
    navigation: NavigationScreenProp;
    nextRoute: void;
}
interface IRegister {
    identifyCodeImg: string;
    isShowPwd: boolean;
    pwdImg: any;
    mobile: string;
    captcha: string;
    identifyCode: string;
    password: string;
    isAgree: boolean;
    sentMessageText: string;
}

const AgreeItem = Checkbox.AgreeItem;
const second = 60;
let timerId = null;
export default class Register extends React.Component<ILoginHeader> {
    public state: IRegister;

    constructor(props) {
        super(props);
        this.state = {
            identifyCodeImg: '', // 验证码图片
            isShowPwd: false, // 是否显示密码
            pwdImg: require('../../images/eye_open.png'), // 显示密码图标
            mobile: null, // 注册手机号
            captcha: '', // 图片验证码
            identifyCode: null, // 短信验证码
            password: '', // 密码
            isAgree: false, // 是否勾选同意注册协议
            sentMessageText: '获取验证码', // 获取短信验证码文案
        };
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

    public componentWillUnmount() {
        clearInterval(timerId);
    }

    public async componentDidMount() {
        const token = await global.getItem('userToken');
        const initCaptcha = Config.SERVER_DATA + Config.GET_IMG_CAPTCHA + '?rnd='
            + Math.random() + '&flag=' + token.substring(6);
        this.setState({
            identifyCodeImg: initCaptcha,
        });
    }

    public render(): JSX.Element {
        return <ScrollView
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
            style={{backgroundColor: 'white'}}>
            <LoginHeader loginText='登录' navigation={this.props.navigation}
                         nextRoute={() => this.props.navigation.goBack()}/>
            <View>
                <View style={styles.inputBox}>
                    <TextInput style={[styles.inputItem, {width: width}]}
                               ref="mobile"
                               placeholder={'请输入手机号码'}
                               underlineColorAndroid='transparent'
                               autoCapitalize='none'
                               onChangeText={(value) => this.setState({mobile: value})}>
                    </TextInput>
                </View>
                <View style={styles.inputBox}>
                    <TextInput style={[styles.inputItem, {flex: 1}]}
                               ref="captcha"
                               placeholder={'输入验证码'}
                               underlineColorAndroid='transparent'
                               autoCapitalize='none'
                               onChangeText={(value) => this.setState({captcha: value})}>
                    </TextInput>
                    <TouchableOpacity onPress={() => this.getIdentifyImg()}>
                        <Image source={{uri: this.state.identifyCodeImg}}
                               style={{width: 88, height: 40}}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.inputBox}>
                    <TextInput style={[styles.inputItem, {flex: 1}]}
                               placeholder={'输入短信验证码'}
                               ref="identifyCode"
                               underlineColorAndroid='transparent'
                               autoCapitalize='none'
                               keyboardType='numeric'
                               onChangeText={(value) => this.setState({identifyCode: value})}>
                    </TextInput>
                    <TouchableOpacity onPress={() => this.getIdentifyCode()}
                                      activeOpacity={1}>
                        <View style={styles.identifyText}>
                            <Text style={{color: '#2979FF', marginVertical: 5}}>{this.state.sentMessageText}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.inputBox}>
                    <TextInput style={[styles.inputItem, {flex: 1}]}
                               placeholder={'输入密码'}
                               underlineColorAndroid='transparent'
                               ref="password"
                               autoCapitalize='none'
                               secureTextEntry={!this.state.isShowPwd}
                               onChangeText={(value) => this.setState({password: value})}>
                    </TextInput>
                    <TouchableOpacity onPress={() => this.togglePwd()}>
                        <Image source={this.state.pwdImg}
                               style={{width: 23, height: 23}}/>
                    </TouchableOpacity>
                </View>
                <Text style={{color: '#333', fontSize: 12, padding: 10}}>提示：密码为数字、字母、特殊符号中的两种组合，长度6位~20位(字母区分大小写)
                </Text>
            </View>
            <TouchableOpacity onPress={() => this.next()}>
                <View style={styles.nextButton}>
                    <Text style={{color: 'white'}}>下一步</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.agreement}>
                <View>
                    <AgreeItem onChange={e => this.setState({isAgree: e.target.checked})}>
                    </AgreeItem>
                </View>
                <View style={{flexDirection: 'row', flex: 1, flexWrap: 'wrap'}}>
                    <Text style={styles.agreementText}>注册即代表您同意</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('AgreementWebview',
                        {helpId: 1002, title: '《顺逛微店注册协议》'})}
                                      activeOpacity={1}>
                        <Text style={[styles.agreementText, {color: '#5E9AFF'}]}>《顺逛微店注册协议》</Text>
                    </TouchableOpacity>
                    <Text style={styles.agreementText}>和</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('AgreementWebview',
                        {helpId: 996, title: '《快捷通服务协议》'})}
                                      activeOpacity={1}>
                        <Text style={[styles.agreementText, {color: '#5E9AFF'}]}>《快捷通服务协议》</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>;
    }

    private async getIdentifyImg() {
        const token = await global.getItem('userToken');
        const TempIdentify = Config.SERVER_DATA + Config.GET_IMG_CAPTCHA + '?rnd='
            + Math.random() + '&flag=' + token.substring(6);
        this.setState({identifyCodeImg: TempIdentify});
    }

    private togglePwd() {
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

    private getIdentifyCode = async () => {
        if (this.state.sentMessageText !== '获取验证码' && this.state.sentMessageText !== '重发验证码') {
            return;
        }
        if (!mobileNumberRegExp.test(this.state.mobile)) {
            Toast.info('请输入正确的手机号码！');
            this.refs["mobile"].focus();
        } else if (this.state.captcha.length === 0) {
            Toast.info('请输入验证码！');
            this.refs["captcha"].focus();

        } else {
            try {
                const params = {
                    mobileNum: this.state.mobile,
                    captcha: this.state.captcha,
                };
                const response = await getAppJSON(Config.GET_IDENTIFY_CODE, params);
                Log('-------------------------------');
                Log('response: ', response);
                Log('-------------------------------');
                if (response.success) {
                    this.sentTimer();
                    this.refs["identifyCode"].focus();
                } else if (response.errorCode === '1102') {
                    this.refs["mobile"].blur();
                    this.refs["captcha"].blur();
                    this.refs["identifyCode"].blur();
                    this.refs["password"].blur();
                    Toast.info('该手机号已经注册过顺逛用户，请直接登录。', 1);
                } else if (response.message) {
                    this.refs["mobile"].blur();
                    this.refs["captcha"].blur();
                    this.refs["identifyCode"].blur();
                    this.refs["password"].blur();
                    Toast.fail(response.message, 1);
                } else {
                    this.refs["mobile"].blur();
                    this.refs["captcha"].blur();
                    this.refs["identifyCode"].blur();
                    this.refs["password"].blur();
                    Toast.fail('获取验证码失败！', 1);
                }
            } catch (error) {
                Log(error);
            }
        }
    }
    private next = async () => {
        if (!mobileNumberRegExp.test(this.state.mobile)) {
            Toast.info('请输入正确的手机号！', 1);
            this.refs["mobile"].focus();
        } else if (this.state.password.length === 0) {
            Toast.info('请输入密码！', 1);
            this.refs["password"].focus();
        } else if (!passwordRegExp.test(this.state.password)) {
            Toast.info('密码不符合规则！', 1);
            this.refs["password"].focus();
        } else if (this.state.identifyCode.length === 0) {
            Toast.info('请输入短信验证码！', 1);
            this.refs["identifyCode"].focus();
        } else if (this.state.isAgree === false) {
            Toast.info('请选择同意《顺逛微店注册协议》及《快捷通服务协议》！', 2);
        } else {
            try {
                const params = {
                    mobileNum: this.state.mobile,
                    captcha: this.state.identifyCode,
                    password: encodeURIComponent(this.state.password),
                    imgCaptcha: this.state.captcha,
                };

                const response = await postAppForm(Config.CHECK_REGISTER, params);
                if (response.success) {
                    if (response.data.isCanRegister) { // 注册成功
                        const registerObj = {
                            mobileNum: this.state.mobile,
                            password: this.state.password,
                            captcha: this.state.identifyCode,
                            imgCaptcha: this.state.captcha,
                        };

                        Log('jump to OpenStore page with params: ', registerObj);

                        // this.props.navigation.navigate('OpenStore', registerObj);
                        this.props.navigation.navigate('Login');
                    } else {
                        Log('原因是' + response.data.message);
                    }
                } else {
                    Toast.fail(response.message);
                }
            } catch (error) {
                Log(error);
            }
        }
    }
}
const styles = EStyleSheet.create({
    inputItem: {
        height: 56,
    },
    inputBox: {
        borderBottomWidth: .5,
        borderBottomColor: '#E4E4E4',
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    identifyText: {
        borderWidth: 1,
        borderColor: '#2979FF',
        width: 100,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextButton: {
        width: '343rem',
        height: 44,
        backgroundColor: '#2979FF',
        alignSelf: 'center',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 22,
    },
    agreement: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    agreementText: {
        fontSize: 12,
        marginVertical: 2,
    },
});
