import {
    View,
    Text,
    TextInput,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import React from 'react';
import ClearBtn from './ClearBtn';
import { Toast } from 'antd-mobile';
import axios from 'axios';
import Config from 'react-native-config';
import CustomNaviBar from '../../../components/customNaviBar';
import { connect } from '../../../utils';

var codeTime = 60;//倒计时60s设定

@connect()
class BindNewTel extends React.Component {
    public static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: '身份认证',
            header: null,
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            timerCount: codeTime,
            phone: '',
            code: '',
            btnBackColor: '#0076ff',
            text: '获取验证码',
            disabled: true,
            time: 60,
            smstext: '',
            onOff: false,
            userData: '',
        }
    }

    runTimer = () => {
        this.timer = setTimeout(
            () => {
                if (this.state.time >= 1) {
                    let time = this.state.time - 1;
                    this.setState({ disabled: true, time: time, text: time + "秒后重新获取" }, ()=>{
                        this.runTimer();
                    });
                } else {
                    this.timer && clearTimeout(this.timer);
                    this.setState({ disabled: false, time: 60, text: "获取验证码" });
                }
            },
            1000
        );
    }

    //获取验证码
    registerVcode = () => {
        const urlCode = Config.API_URL + Config.CHANGETELCODEGET;
        axios.get(urlCode, { params: { mobileNum: this.state.phone } })
            .then((res) => res.data)
            .then((res) => {
                if (res.success) {
                    Toast.info('验证码已发送，请查收');
                    this.setState({ disabled: true, time: 60, text: "60秒后重新获取" });
                    this.runTimer();
                } else {
                    Toast.info(res.message);
                }
            })
    }
    //下一步
    nextSubmit = () => {
        const { params } = this.props.navigation.state;
        const oldTel = dvaStore.getState().users.mobile;
        if (this.state.onOff){
            this.setState({ onOff: false});
            const urlChange = Config.API_URL + Config.CHANGEMOBILE;
            axios.get(urlChange, {
                params: {
                    mobileNum: params.mobile, captcha: this.state.smstext, oldMobileNo: oldTel, realName: params.realName, identityNo: params.identityNo
                }
            })
                .then((res) => res.data)
                .then((res) => {
                    if (res.success) {                        
                        Toast.info('手机号修改成功', 2);
                        this.setState({ onOff: false });
                        this.props.navigation.navigate('TelChangeSuccess', { mobile: params.mobile});
                    } else {
                        Toast.info(res.message);
                    }
                })
        }
    }


    componentWillMount() {
        // 从带过来的路由参数里面取值
        const { params } = this.props.navigation.state;
        this.setState({ phone: params.mobile });
    }
    componentDidMount() {
        if (this.state.disabled){
            this.registerVcode();
        }
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
    render() {

        const { onOff } = this.state;

        return (
            <View style={styles.wrapper}>
                <CustomNaviBar
                    style={{ backgroundColor: '#FFF' }}
                    navigation={this.props.navigation}
                    hiddenLeftBtn={false}
                    containerStyle={{ backgroundColor: 'transparent' }}
                    leftViewStyle={{ marginLeft: 5 }}
                    local={{ leftStyle: { width: 22, height: 22 } }}
                    titleView={
                        <Text style={{
                            color: '#000',
                            fontFamily: 'PingFangSC-Light',
                            fontSize: 20
                        }}>
                            身份认证
                                </Text>}
                />
                <View style={styles.textV}>
                    <Text style={styles.hint}>验证码已经发送到{this.state.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</Text>
                </View>
                <View style={styles.formGroup}>
                    <TextInput style={styles.input}
                        placeholder='请输入短信验证码'
                        underlineColorAndroid="transparent"
                        maxLength={6}
                        keyboardType="numeric"
                        onChangeText={(text) => {
                            (text.length == 6) ? this.setState({ onOff: true }) : this.setState({ onOff: false })
                            this.setState({ smstext: text })
                        }}
                        ref="smscode"
                    />
                    <TouchableOpacity
                        disabled={this.state.disabled}
                        onPress={() => this.registerVcode()}
                        style={styles.getBtn}>
                        <Text style={styles.btn}>{this.state.text}</Text>
                    </TouchableOpacity>

                </View>
                <TouchableOpacity
                    onPress={this.nextSubmit}>
                    <View style={[styles.btnone, { backgroundColor: (onOff ? "#2979FF" : "#C9C9C9") }, { shadowColor: (onOff ? "#2979FF" : "#C9C9C9") }]}>
                        <Text style={styles.texttwo}>下一步</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'center'
    },
    textV: {
        height: 64,
        justifyContent: 'center',
    },
    hint: {
        fontSize: 14,
        color: '#666',
    },
    formGroup: {
        height: 50,
        paddingLeft: 10,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#dfdfdf',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    input: {
        height: 50,
        color: '#282828',
        borderRadius: 3,
        paddingLeft: 15,
        fontSize: 17,
        flex: 1,
        borderRightWidth: 1,
        borderColor: '#dfdfdf',
    },
    getBtn: {
        width: 120,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 6,
        // borderLeftWidth:1,
        // borderColor:'#dfdfdf',
    },
    btn: {
        color: '#09f',
        fontSize: 15,
    },
    texttwo: {
        color: '#fff',
        fontSize: 16,
    },
    btnone: {
        marginTop: 60,
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 60,
        paddingRight: 60,
        // backgroundColor: '#2979FF',
        //backgroundColor: '#C9C9C9',
        borderRadius: 50,
        // shadowColor: 'rgba(41,121,255,.5)',
        //shadowColor: '#C9C9C9',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
});

export default BindNewTel;

