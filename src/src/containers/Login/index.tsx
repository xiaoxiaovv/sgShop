import * as React from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    Platform,
    TouchableOpacity,
    TextInput,
    ScrollView,
    NativeModules,
    DeviceEventEmitter,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import EStyleSheet from 'react-native-extended-stylesheet';
import {ITestLoginInterface} from './testloginInterface';
import {createAction, connect, generateRandomUUID, getPrevRouteName, isWdHost} from '../../utils';
import LoginHeader from './loginHeader';
import {getAppJSON, postAppJSON, postForm, postAppForm} from '../../netWork';
import Config from 'react-native-config';
import config from './../../config/index.js';
import {Toast} from 'antd-mobile';
import {NavigationActions} from 'react-navigation';
import {ICustomContain} from '../../interface';
import axios from 'axios';

interface ICJLogin {
    fastLogin: boolean; // 是否是快速登录
    showNormalCaptcha: boolean; // 是否显示普通登录的验证码
    userName: string;
    mobile: string;
    placeholderText: string;
    loginTypeText: string;
    password: string;
    captcha: string; // 验证码
    captchaNormal: string; // 普通账号密码登录的验证码
    captchaImg: string; // 快速登录的图片验证码url
    captchaImgNormal: string; // 普通登录的图片验证码
    iCode: string; // 短信验证码
    showPwd: boolean; // 密码是否可见
    showPwdImgUrl: string; // 密码是否可见的图片url
    getICodeText: string; // 获取短信验证码的文字提示、倒计时提示文字
    canGetICode: boolean; // 是否可以获取短信验证码
    canClick: boolean;
}
interface ILoginInput {
    placeholder: string;
    value: string;
    secureTextEntry: boolean;
}
const RefreshToken = {type: 13, tag: 'refresh_token'};

import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

let flag = 0;
// 缓存手机号 和 用户名
const getCacheMobile = async () => {
    const mobile = await global.getItem('CacheMobile');
    if (mobile) {
        return mobile.mobile;
    } else {
        return '';
    }
};
// 缓存手机号 和 用户名
const getCacheUserName = async () => {
    const userName = await global.getItem('CacheUserName');
    if (userName) {
        return userName.userName;
    } else {
        return '';
    }
};
const MyInput = ({placeholder, value, onChangeText, secureTextEntry = false, onSubmitEditing}) => {
    return (
        <TextInput
            style={{height: 56, borderBottomColor: '#e4e4e4', borderBottomWidth: 1}}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            onSubmitEditing={() => {
                if (onSubmitEditing) {
                    onSubmitEditing();
                }
            }}
            underlineColorAndroid='transparent'
        ></TextInput>
    );
};
// 获取快速登录的图片验证码
const GetCaptcha = ({isFastLogin, placeholder, value, onChangeText, getCaptchaImg, captchaImg}) => {
    return (
        isFastLogin &&
        <View>
            <TextInput
                style={{height: 56, borderBottomColor: '#e4e4e4', borderBottomWidth: 1}}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                underlineColorAndroid='transparent'

            ></TextInput>
            <TouchableOpacity onPress={getCaptchaImg} style={{height: 56, position: 'absolute', right: 0, top: 8}}>
                <Image
                    source={{uri: captchaImg}}
                    style={styles.captchaCss}></Image>
            </TouchableOpacity>
        </View>
    );
};
// 普通账号密码登录的图片验证码组件
const NormalCaptch = ({showNormalCaptcha, value, onChangeText, getCaptchaImgNormal, captchaImgNormal}) => {
    return (
        showNormalCaptcha &&
        <View>
            <TextInput
                style={{height: 56, borderBottomColor: '#e4e4e4', borderBottomWidth: 1}}
                placeholder='请输入验证码'
                value={value}
                onChangeText={onChangeText}
                underlineColorAndroid='transparent'
            ></TextInput>
            <TouchableOpacity onPress={getCaptchaImgNormal}
                              style={{height: 56, position: 'absolute', right: 0, top: 8}}>
                <Image
                    source={{uri: captchaImgNormal}}
                    style={styles.captchaCss}></Image>
            </TouchableOpacity>
        </View>
    );
};
const GetICode = ({showICodeBtn, getICodeOrToggleEye, style, showPwd, ICodeStyle, getICodeText}) => {
    const eyeTag = showPwd ? <Image source={require('../../images/eye_close.png')}
                                    style={{width: 24, height: 24}}></Image> :
        <Image source={require('../../images/eye_open.png')}
               style={{width: 24, height: 24}}></Image>;
    return (
        <TouchableOpacity onPress={getICodeOrToggleEye}
                          style={style}>
            {!showICodeBtn ? eyeTag
                : <Text style={ICodeStyle}>{getICodeText}</Text>}
        </TouchableOpacity>
    );
};
@connect()
class TestLogin extends React.Component<ITestLoginInterface & ICustomContain> {
    public state: ICJLogin;

    public constructor(props) {
        super(props);
        // 白条测试账号 15811596211 eHaier123456
        this.state = {
            fastLogin: false,
            showNormalCaptcha: false,
            mobile: '',
            userName: '',
            placeholderText: '请输入手机号',
            loginTypeText: '短信验证码登录',
            password: '',
            captcha: '', // 快速登录的验证码输入框的值
            captchaNormal: '', // 普通账号密码的验证码输入框的值
            captchaImg: '', // 快速登录的图片验证码url
            captchaImgNormal: '', // 普通账号密码登录的图片验证码url
            iCode: '',
            showPwd: true,
            showPwdImgUrl: '../../images/eye_close.png',
            getICodeText: '获取验证码',
            canGetICode: true, // 是否可以获取短信验证码
            canClick: false,
        };
    }

    public async componentWillMount() {
        this.getCaptchaImg();
        this.getCaptchaNormal();
        const mobile = await getCacheMobile();
        const userName = await getCacheUserName();
        console.log(mobile, userName);
        this.setState({mobile, userName});
        // config.SET_ENV === "DEV" ? this.setState({password: 'eHaier123456', userName: '17310030416'}) : this.setState({mobile, userName});
    }

    public render() {
        return (
            <ScrollView
                keyboardShouldPersistTaps="always"
                keyboardDismissMode="on-drag"
                style={styles.container}>
                <View>
                    <LoginHeader loginText='注册' navigation={this.props.navigation}
                                 nextRoute={() => this.props.navigation.navigate('NewRegister', {hiddenSetPassword: false})}/>
                    <View style={{paddingLeft: 16, paddingRight: 16}}>
                        <MyInput placeholder={this.state.fastLogin ? '请输入手机号' : '请输入手机号码/店铺码'}
                                 value={this.state.fastLogin ? this.state.mobile : this.state.userName}
                                 onChangeText={(text) => this.setUserName(text)}/>
                        <GetCaptcha isFastLogin={this.state.fastLogin}
                                    placeholder='请输入验证码'
                                    value={this.state.captcha}
                                    onChangeText={(text) => this.setCaptcha(text)}
                                    getCaptchaImg={() => this.getCaptchaImg()}
                                    captchaImg={this.state.captchaImg}></GetCaptcha>
                        <View>
                            <MyInput placeholder={this.state.fastLogin ? '输入短信验证码' : '请输入密码'}
                                     value={this.state.fastLogin ? this.state.iCode : this.state.password}
                                     onChangeText={(text) => this.setIcodeOrPwd(text)}
                                     onSubmitEditing={this.loginSG}
                                     secureTextEntry={this.state.fastLogin ? false : this.state.showPwd}/>
                            <GetICode
                                showICodeBtn={this.state.fastLogin}
                                getICodeOrToggleEye={() => this.getICodeOrToggleEye(this.state.showPwd)}
                                style={styles.commonPosition}
                                showPwd={this.state.showPwd}
                                ICodeStyle={this.state.canGetICode ? styles.identifyCodeActive : styles.identifyCode}
                                getICodeText={this.state.getICodeText}/>

                        </View>
                        <NormalCaptch showNormalCaptcha={this.state.showNormalCaptcha && !this.state.fastLogin}
                                      value={this.state.captchaNormal}
                                      onChangeText={(text) => this.setNormalCaptcha(text)}
                                      getCaptchaImgNormal={() => this.getCaptchaNormal()}
                                      captchaImgNormal={this.state.captchaImgNormal}></NormalCaptch>
                    </View>
                    {!this.state.fastLogin ?
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('ResetPassword',{mobile: this.state.fastLogin ? this.state.mobile : this.state.userName})}
                            activeOpacity={1}
                        >
                            <Text style={styles.forgetPassword}>忘记密码？</Text>
                        </TouchableOpacity> : null}
                    <View style={{alignItems: 'center', marginTop: 42}}>
                        <TouchableOpacity style={{width: deviceWidth, alignItems: 'center', justifyContent: 'center'}}
                                          onPress={this.loginSG}>
                            <View
                                style={[styles.loginButton, this.state.fastLogin && (this.state.mobile.length === 0 || this.state.iCode.length === 0 || this.state.captcha.length === 0) ? styles.unClickLoginButton : styles.canClickloginButton]}>
                                <Text style={{color: '#ffffff', fontSize: 17}}>登录</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{width: deviceWidth, alignItems: 'center', justifyContent: 'center'}}
                                          activeOpacity={1} onPress={() => this.toggleLoginType(this.state.fastLogin)}>
                            <View style={styles.anotherLogin}
                            >
                                <Text style={{color: '#2979FF', fontSize: 17}}>{this.state.loginTypeText}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{alignItems: 'center', marginLeft: 16, marginRight: 16, marginTop:30}}>
                        <Text style={{fontSize: 14, color: '#999999'}}>使用以下账号登录</Text>
                        <View style={styles.leftLine}></View>
                        <View style={styles.rightLine}></View>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 19, paddingBottom: 60}}>
                        <TouchableOpacity onPress={() => this.thirdLogin('wechat')}>
                            <Image style={styles.thirdLogin} source={require('../../images/btn_weixin.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.thirdLogin('sina')}>
                            <Image
                                style={[styles.thirdLogin, styles.middleThirdLogin]}
                                source={require('../../images/btn_weibo.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.thirdLogin('qq')}>
                            <Image style={styles.thirdLogin} source={require('../../images/btn_qq.png')}></Image>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        );
    }

    // 切换登录方式
    public toggleLoginType = (fastLogin) => {
        this.setState({fastLogin: !fastLogin});
        const tempLoginTypeText = this.state.fastLogin ? '短信验证码登录' : '账号密码登录';
        this.setState({loginTypeText: tempLoginTypeText});
    }
    // 点击获取短信验证码 或者 切换密码可见与否
    public getICodeOrToggleEye = async (showPwd) => {
        if (this.state.fastLogin) {
            if (!this.state.mobile || this.state.mobile.length === 0) {
                Toast.info('请输入手机号', 2);
            } else if (!global.mobileNumberRegExp.test(this.state.mobile)) {
                Toast.info('请输入正确的手机号格式', 2);
            } else if (this.state.captcha.length === 0 && this.state.fastLogin) {
                Toast.info('请输入图形验证码', 2);
            } else {
                const params = {
                    mobile: this.state.mobile,
                    imgCaptcha: this.state.captcha,
                };
                const headers = {
                    Authorization: 'open the gate',
                };
                try {
                    const res = await getAppJSON(Config.FAST_LOGIN_CAPTCHA, params, {headers});
                    if (!res.data) {
                        this.getCaptchaImg();
                        Toast.info(res.message);
                    } else if (res.data === -1 && this.state.captcha.length === 0) {
                        this.getCaptchaImg(); // 获取快速登录的图片验证码
                        Toast.info('请输入图形验证码', 2);
                    } else {
                        // 获取短信验证码
                        if (this.state.canGetICode) {
                            let timeCount = 60;
                            const timer = setInterval(() => {
                                if (timeCount - 1 < 0) {
                                    clearInterval(timer);
                                    this.setState({canGetICode: true});
                                    this.setState({getICodeText: '获取验证码'});
                                } else {
                                    timeCount--;
                                    this.setState({canGetICode: false});
                                    this.setState({getICodeText: '重发' + timeCount + 's'});
                                }
                            }, 1000);
                        }
                    }
                } catch (error) {
                    Log(error);
                }
            }
        } else {
            this.setState({showPwd: !showPwd});
        }
    }
    // 获取快速登录的 图片验证码
    public getCaptchaImg = async () => {
        try {
            const sgToken = await global.getItem('userToken');
            const captchaImgUrl = Config.SERVER_DATA + Config.GET_IMG_CAPTCHA + '?rnd=' + Math.random() +
                '&flag=' + sgToken.substring(6);
            this.setState({captchaImg: captchaImgUrl});
        } catch (error) {
            Log(error);
        }
    }
    // 获取普通登录的 图片验证码
    public getCaptchaNormal = async () => {
        try {
            const sgToken = await global.getItem('userToken');
            const captchaImgUrl = Config.SERVER_DATA + Config.GET_LOGIN_CAPTCHA + '?rnd=' + Math.random() +
                '&flag=' + sgToken.substring(6);
            this.setState({captchaImgNormal: captchaImgUrl});
        } catch (error) {
            Log(error);
        }
    }
    // 保存用户名或者手机号
    public setUserName = (text) => {
        if (this.state.fastLogin) {
            this.setState({mobile: text});
        } else {
            this.setState({userName: text});
        }
    }
    // 保存 快速登录的验证码
    public setCaptcha = (text) => {
        this.setState({captcha: text});
    }
    // 保存 普通登录的验证码
    public setNormalCaptcha = (text) => {
        this.setState({captchaNormal: text});
    }
    // 保存 短信验证码或者密码
    public setIcodeOrPwd = (text) => {
        if (this.state.fastLogin) {
            this.setState({iCode: text});
        } else {
            this.setState({password: text});
        }
    }
    public goBack = () => {
        this.props.navigation.goBack();
    }
    private loginSG = async () => {
        global.deleteUsersMsg = true; // 是否要注销用户信息
        if (this.state.fastLogin) { // 如果是快速登录
            if (this.state.mobile.length === 0 || this.state.iCode.length === 0 || this.state.captcha.length === 0) {
                return;
            }
            if (!this.state.mobile || this.state.mobile.length === 0) {
                Toast.info('请输入手机号', 2);
            } else if (!global.mobileNumberRegExp.test(this.state.mobile)) {
                Toast.info('请输入正确的手机号格式', 2);
            } else if (this.state.iCode.length === 0) {
                Toast.info('请输入短信验证码', 2);
            } else if (this.state.iCode.length !== 6) {
                Toast.info('短信验证码长度必须是6位', 2);
            } else {
                const params = {
                    mobile: this.state.mobile,
                    captcha: this.state.iCode,
                    imgCaptcha: this.state.captcha,
                };
                try {
                    // const res = await postAppJSON(Config.FAST_LOGIN, params, Config.API_URL);
                    // const res = await postForm(Config.FAST_LOGIN, params);
                    const res = await postAppForm(Config.FAST_LOGIN, params);
                    if (res.data) {

                        if (res.data.sessionValue) {
                            await global.setItem('userToken', 'Bearer' + res.data.sessionValue);
                            this.props.dispatch(createAction('users/saveUsersMsg')({
                                userToken: 'Bearer' + res.data.sessionValue,
                            }));
                            axios.defaults.headers['TokenAuthorization'] = 'Bearer' + res.data.sessionValue;
                        } else {
                            await global.setItem('userToken', 'Bearer' + generateRandomUUID());
                            this.props.dispatch(createAction('users/saveUsersMsg')({
                                userToken: 'Bearer' + generateRandomUUID(),
                            }));
                            axios.defaults.headers['TokenAuthorization'] = 'Bearer' + generateRandomUUID();
                        }
                        DeviceEventEmitter.emit('loginSuccess');
                        // 缓存用户手机号
                        await global.setItem('CacheMobile', {
                            mobile: this.state.mobile,
                        });
                        Toast.success('登录成功', 2);
                        // 社区登录交互相关:勿动调用社区传递过来的回调·
                        const { params } = this.props.navigation.state;
                        // 调用社区传递过来的回调,loginInfo请完善成为登录后的用户信息
                        const loginInfo = {token: 'Bearer' + res.data.sessionValue};
                        // 成功的回调
                        const info = {type: 2, tag: 'main', success: 1, token: loginInfo.token};
                        NativeModules.APICloudModule.RNCallNaviteMethod(info);
                        if (params && params.callBack) {
                            params.callBack(loginInfo);
                        }
                        const isHostWd = await isWdHost();
                        await global.setItem('User', {
                            ...res.data,
                            isLogin: true,
                            isHost: isHostWd,
                            userAcount: this.state.mobile,
                            password: '',
                        });
                        // 更新用户 token,发个通知告诉APICloud
                        NativeModules.APICloudModule.RNCallNaviteMethod(RefreshToken);
                        DeviceEventEmitter.emit('judge88Alert');
                        const memberId = res.data.mid;
                        this.props.dispatch(createAction('users/saveUsersMsg')({
                            ...res.data,
                            isLogin: true,
                            isHost: isHostWd,
                            userAcount: this.state.mobile,
                            password: ''
                        }));
                        // 快速登录:统计埋点代码 gio yl
                        NativeModules.StatisticsModule.setUserId(memberId.toString());
                        const userInfo = dvaStore.getState().users;
                        NativeModules.StatisticsModule.setPeopleVariable({
                            name: userInfo.userName||'',
                            mobile: userInfo.mobile||'',
                            email: userInfo.email||'',
                            gender: userInfo.gender||'',
                            birthday: userInfo.birthday||''
                          });
                          //baifend 埋点
                        NativeModules.BfendModule.onAddUser(memberId.toString(),{
                            name: userInfo.userName||'',
                            em: userInfo.email||'',
                            cp: userInfo.mobile||''
                        });
                        // 小熊客服 yl
                        NativeModules.XnengModule.NTalkerLogin([memberId.toString(), userInfo.userName||'', '0'])

                        const prevRoute = getPrevRouteName();
                        if (!prevRoute || prevRoute === 'guidePage' || prevRoute === 'register' || prevRoute === 'PasswordReset' || prevRoute === 'ResetPassword' || prevRoute === 'TelChangeSuccess') {
                            // this.props.navigation.navigate('RootTabs');
                            const resetAction = NavigationActions.reset({
                                index: 0,
                                actions: [NavigationActions.navigate({routeName: 'RootTabs'})],
                            });
                            this.props.navigation.dispatch(resetAction);
                        } else {
                            this.props.navigation.goBack();
                        }
                        // 是否开过店
                        const responseOfStore = await getAppJSON(Config.IS_HAS_STORE, memberId);
                        if (!responseOfStore.data) {
                            global.setItem('roleInfo', '0');
                            global.setItem('storeId', 20219251);
                        } else {
                            global.setItem('roleInfo', '1');
                            global.setItem('storeId', memberId);
                        }
                        this.props.dispatch({
                            type: 'cartModel/fetchCartList',
                        });
                    } else {
                        Toast.info(res.message, 2);
                    }
                } catch (error) {
                    Log(error);
                }
            }
        } else { // 如果是账号密码登录
            if (this.state.userName.length === 0) {
                Toast.info('请输入用户名', 2);
            } else if (this.state.password.length === 0) {
                Toast.info('密码为数字、字母、特殊符号中的两种组合，长度6位~20位(字母区分大小写)', 2);
            } else if (this.state.captchaNormal.length === 0 && this.state.showNormalCaptcha) {
                Toast.info('请输入验证码', 2);
            } else {
                // 屏蔽界面交互,防止用户多次点击
                Toast.loading('加载中...', 0, null, true);
                const params = {
                    userName: this.state.userName,
                    password: encodeURIComponent(this.state.password),
                    captcha: this.state.captchaNormal,
                    isNew: 1,
                    noLoading: true,
                };
                try {
                    const res = await getAppJSON(Config.LOGIN, params);
                    // 请求结束,解除屏蔽界面交互
                    Toast.hide();
                    if (res.success) {
                        // const { navigate, state: { params: { navigateRouteName: routeName, navigateParams: params  } } } = this.props.navigation;
                        // this.props.dispatch(createAction('router/loginSuccess')({ routeName, params }));
                        // 登录小能客服SDK,暂时先判断平台,防止android端未集成导致崩溃
                        // if (Platform.OS === 'ios') {
                        //   const {userName, mid} = res.data;
                        //   if (userName && mid) {
                        //     NativeModules.XnengModule.NTalkerLogin([mid.toString(), userName.toString(), '0']);
                        //   }
                        // }

                        // this.props.dispatch(createAction('users/saveUsersMsg')(res.data));
                        if (res.data.sessionValue) {
                            await global.setItem('userToken', 'Bearer' + res.data.sessionValue);
                            this.props.dispatch(createAction('users/saveUsersMsg')({
                                userToken: 'Bearer' + res.data.sessionValue,
                            }));
                            axios.defaults.headers['TokenAuthorization'] = 'Bearer' + res.data.sessionValue;
                        } else {
                            await global.setItem('userToken', 'Bearer' + generateRandomUUID());
                            this.props.dispatch(createAction('users/saveUsersMsg')({
                                userToken: 'Bearer' + generateRandomUUID(),
                            }));
                            axios.defaults.headers['TokenAuthorization'] = 'Bearer' + generateRandomUUID();
                        }
                        DeviceEventEmitter.emit('loginSuccess');
                        Toast.success('登录成功', 2);
                        // 缓存用户名
                        await global.setItem('CacheUserName', {
                            userName: this.state.userName,
                        });
                        // 社区登录交互相关:勿动调用社区传递过来的回调·
                        const { params } = this.props.navigation.state;
                        // 调用社区传递过来的回调,loginInfo请完善成为登录后的用户信息
                        const loginInfo = {token: 'Bearer' + res.data.sessionValue};
                        // 成功的回调
                        const info = {type: 2, tag: 'main', success: 1, token: loginInfo.token};
                        NativeModules.APICloudModule.RNCallNaviteMethod(info);
                        if (params && params.callBack) {
                            params.callBack(loginInfo);
                        }
                        const isHostWd = await isWdHost();
                        await global.setItem('User', {
                            ...res.data,
                            isLogin: true,
                            isHost: isHostWd,
                            userAcount: this.state.userName,
                            // password: this.state.password,
                            password: "",
                        });
                        // 更新用户 token,发个通知告诉APICloud
                        NativeModules.APICloudModule.RNCallNaviteMethod(RefreshToken);
                        DeviceEventEmitter.emit('judge88Alert');
                        this.props.dispatch(createAction('users/saveUsersMsg')({
                            ...res.data,
                            isLogin: true,
                            isHost: isHostWd,
                            userAcount: this.state.userName,
                            // password: this.state.password,
                            password: "",
                        }));
                        const memberId = res.data.mid;
                        // 账号密码登录:统计埋点代码   gio   yl
                        NativeModules.StatisticsModule.setUserId(memberId.toString());
                        const userInfo = dvaStore.getState().users;
                        NativeModules.StatisticsModule.setPeopleVariable({
                            name: userInfo.userName||'',
                            mobile: userInfo.mobile||'',
                            email: userInfo.email||'',
                            gender: userInfo.gender||'',
                            birthday: userInfo.birthday||''
                          });
                          //baifend 埋点
                        NativeModules.BfendModule.onAddUser(memberId.toString(),{
                            name: userInfo.userName||'',
                            em: userInfo.email||'',
                            cp: userInfo.mobile||''
                        });
                        // 小熊客服 yl
                        NativeModules.XnengModule.NTalkerLogin([memberId.toString(), userInfo.userName||'', '0'])

                        Log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&登录成功后的token&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
                        Log(dvaStore.getState().users.userToken);
                        // 判断是否绑定过手机号
                        const responseOfWdApply = await getAppJSON(Config.WD_APPLY);
                        if (responseOfWdApply.success) {
                            if (responseOfWdApply.data) { // 绑定过手机号
                                const prevRouteName = getPrevRouteName(); // 获取上一个页面的路由名
                                if (!prevRouteName || prevRouteName === 'guidePage' || prevRouteName === 'register' ||
                                    prevRouteName === 'PasswordReset' || prevRouteName === 'ResetPassword' || prevRouteName === 'TelChangeSuccess') {
                                    global.loginGoNum = 0;
                                    // this.props.navigation.navigate('RootTabs');
                                    const resetAction = NavigationActions.reset({
                                        index: 0,
                                        actions: [NavigationActions.navigate({routeName: 'RootTabs'})],
                                    });
                                    this.props.navigation.dispatch(resetAction);
                                } else {
                                    global.loginGoNum = 1;
                                    this.props.navigation.goBack();
                                }
                                const response = await getAppJSON(Config.HOMEPAGE_ISWDHOST);
                                // const isHost =  result.data.isHost;
                                if (response.success) {
                                    if (response.data.isHost === 1) { // 微店主
                                        global.setItem('roleInfo', '1');
                                        global.setItem('storeId', memberId);
                                        if (response.data.o2o === true || response.data.o2o === null) { //o2o情况 
                                            console.log('啊啊啊啊 啊啊啊啊啊 是o2o用户')
                                        } else {
                                            const url = 'v3/kjt/bank/isRealNameAuth.json';
                                            const res = await getAppJSON(url);
                                            console.log(res)
                                            if(res.success && res.data){
                                            if(res.data.identity!=null){ //已认证
                                                
                                                }else{
                                                    console.log('meiyourenzhen')
                                                    DeviceEventEmitter.emit('isFalseAuthentication');
                                                }
                                            }
                                        }
                                    } 
                                } else {
                                    Toast.info('获取数据信息失败！', 1);
                                }
                            } else { // 没绑定过手机号
                                const response = await getAppJSON(Config.HOMEPAGE_ISWDHOST);
                                // const isHost =  result.data.isHost;
                                if (response.success) {
                                    if (response.data.isHost === 1) { // 微店主
                                        global.setItem('roleInfo', '1');
                                        global.setItem('storeId', memberId);
                                        if (response.data.o2o === true || response.data.o2o === null) {
                                            //this.props.navigation.navigate('RootTabs');
                                            const resetAction = NavigationActions.reset({
                                                index: 0,
                                                actions: [NavigationActions.navigate({routeName: 'RootTabs'})],
                                            });
                                            this.props.navigation.dispatch(resetAction);
                                        } else {
                                            this.props.navigation.navigate('BindMobile'); // 去绑定手机号
                                        }
                                    } else { // 普通用户
                                        global.setItem('roleInfo', '0');
                                        global.setItem('storeId', 20219251);
                                        this.props.navigation.navigate('BindMobile'); // 去绑定手机号
                                    }
                                } else {
                                    Toast.info('获取数据信息失败！', 1);
                                }
                            }
                        } else {
                            Toast.info('服务器错误', 1);
                        }
                        const paramsCode ={
                            memberId: memberId
                        }
                        // 是否开过店
                        const responseOfStore = await getAppJSON(Config.IS_HAS_STORE, paramsCode);
                        
                        if (!responseOfStore.data) {
                            console.log('bushi')
                            global.setItem('roleInfo', '0');
                            global.setItem('storeId', 20219251);
                        } else {
                            global.setItem('roleInfo', '1');
                            global.setItem('storeId', memberId);
                        }
                       
                        // 刷新购物车
                        this.props.dispatch({
                            type: 'cartModel/fetchCartList',
                        });
                        // this.props.navigation.navigate('RootTabs');
                        // const { navigate, state: { params: { navigateRouteName: routeName, navigateParams: params  } } } = this.props.navigation;
                        // this.props.dispatch(createAction('router/loginSuccess')({}));
                    } else if (res.message) {
                        if (res.errorCode === 'forget_password') {
                            Toast.info(res.message);
                            setTimeout(() => {
                                this.props.navigation.navigate('ResetPassword');
                            }, 2000);
                        } else if (res.data === -1 || res.data === '-1') {
                            Toast.info(res.message);
                            Log(res.message);
                            this.setState({showNormalCaptcha: true});
                            this.getCaptchaNormal();
                            Log('显示验证码');
                        } else {
                            Toast.info(res.message);
                        }
                    } else {
                        Toast.info('登录失败', 1);
                    }
                } catch (error) {
                    Log(error);
                }
            }
        }
    }
    private thirdLogin = async (type) => {
        global.deleteUsersMsg = true; // 是否要注销用户信息
        this.umengLogin(type);
    }
    private umengLogin = async (type) => {
        // 设置登录渠道
        global.setItem('IsThirdLoginType', type);
        flag++;
        const typeKV = {
            'qq': 4,
            'sina': 6,
            'wechat': 7,
        };
        // 授权成功
        const authorizeSuccess = async (data) => {
            // const data = JSON.parse(result);
            // 微信头像是data.headimgurl //其他是data.profile_image_url
            const tempData = {
                uid: data.uid,
                source: typeKV[type],
                nickName: data.name,
                headerPic: data.profile_image_url ? data.profile_image_url : data.headimgurl,
                openid: data.openid,
                unionid: data.unionid,
            };
            if (tempData.uid) {
                const param = {
                    userId: tempData.uid,
                    userName: tempData.nickName,
                    loginType: typeKV[type],
                    icon: tempData.headerPic,
                    openid: tempData.openid,
                    unionid: tempData.unionid,
                };
                // 第三方授权后，发请求给后台
                try {
                    const response = await getAppJSON(Config.THIRD_PARTY_LOGINS, param);
                    if (response.success) { // 登录成功
                        if (response.data.sessionValue) {
                            await global.setItem('userToken', 'Bearer' + response.data.sessionValue);
                            this.props.dispatch(createAction('users/saveUsersMsg')({
                                userToken: 'Bearer' + response.data.sessionValue,
                            }));
                            // 社区登录交互相关:勿动调用社区传递过来的回调·
                            const { params } = this.props.navigation.state;
                            // 调用社区传递过来的回调,loginInfo请完善成为登录后的用户信息
                            const loginInfo = {token: 'Bearer' + response.data.sessionValue};
                            // 成功的回调
                            const info = {type: 2, tag: 'main', success: 1, token: loginInfo.token};
                            NativeModules.APICloudModule.RNCallNaviteMethod(info);
                            if (params && params.callBack) {
                                params.callBack(loginInfo);
                            }
                            // 更新用户 token,发个通知告诉APICloud
                            NativeModules.APICloudModule.RNCallNaviteMethod(RefreshToken);
                            axios.defaults.headers['TokenAuthorization'] = 'Bearer' + response.data.sessionValue;
                        } else {
                            await global.setItem('userToken', 'Bearer' + generateRandomUUID());
                            this.props.dispatch(createAction('users/saveUsersMsg')({
                                userToken: 'Bearer' + generateRandomUUID(),
                            }));
                            // 社区登录交互相关:勿动调用社区传递过来的回调·
                            const { params } = this.props.navigation.state;
                            // 调用社区传递过来的回调,loginInfo请完善成为登录后的用户信息
                            const loginInfo = {token: 'Bearer' + generateRandomUUID()};
                            // 成功的回调
                            const info = {type: 2, tag: 'main', success: 1, token: loginInfo.token};
                            NativeModules.APICloudModule.RNCallNaviteMethod(info);
                            if (params && params.callBack) {
                                params.callBack(loginInfo);
                            }
                            // 更新用户 token,发个通知告诉APICloud
                            NativeModules.APICloudModule.RNCallNaviteMethod(RefreshToken);
                            axios.defaults.headers['TokenAuthorization'] = 'Bearer' + generateRandomUUID();
                        }
                        DeviceEventEmitter.emit('loginSuccess');
                        const isHostWd = await isWdHost();
                        await global.setItem('User', {...response.data, isLogin: true, isHost: isHostWd});
                        DeviceEventEmitter.emit('judge88Alert');
                        const memberId = response.data.mid;
                        // 第三方登录:统计埋点代码
                        NativeModules.StatisticsModule.setUserId(memberId.toString());
                        global.loginMemberId = response.data.mid;
                        const userInfo = dvaStore.getState().users;
                        NativeModules.StatisticsModule.setPeopleVariable({
                            name: userInfo.userName||'',
                            mobile: userInfo.mobile||'',
                            email: userInfo.email||'',
                            gender: userInfo.gender||'',
                            birthday: userInfo.birthday||''
                          });
                           //baifend 埋点
                        NativeModules.BfendModule.onAddUser(memberId.toString(),{
                            name: userInfo.userName||'',
                            em: userInfo.email||'',
                            cp: userInfo.mobile||''
                        });
                        // 小熊客服 yl
                        NativeModules.XnengModule.NTalkerLogin([memberId.toString(), userInfo.userName||'', '0'])

                        // 是否开过店
                        const responseOfStore = await getAppJSON(Config.IS_HAS_STORE, memberId);
                        if (!responseOfStore.data) {
                            global.setItem('roleInfo', '0');
                            global.setItem('storeId', 20219251);
                        } else {
                            global.setItem('roleInfo', '1');
                            global.setItem('storeId', memberId);
                        }
                        this.props.dispatch(createAction('users/saveUsersMsg')({
                            ...response.data,
                            isLogin: true,
                            isHost: isHostWd
                        }));
                        // 判断是否绑定过手机号
                        const responseOfWdApply = await getAppJSON(Config.WD_APPLY);
                        if (responseOfWdApply.success) {
                            if (responseOfWdApply.data) { // 绑定过手机号
                                const prevRouteName = getPrevRouteName(); // 获取上一个页面的路由名
                                if (!prevRouteName || prevRouteName === 'guidePage' || prevRouteName === 'register' || prevRouteName === 'PasswordReset' || prevRouteName === 'ResetPassword' || prevRouteName === 'TelChangeSuccess') {
                                    global.loginGoNum = 0;
                                    const resetAction = NavigationActions.reset({
                                        index: 0,
                                        actions: [NavigationActions.navigate({routeName: 'RootTabs'})],
                                    });
                                    this.props.navigation.dispatch(resetAction);
                                } else {
                                    global.loginGoNum = 1;
                                    this.props.navigation.goBack();
                                }
                            } else { // 没绑定过手机号
                                this.props.navigation.navigate('BindMobile'); // 去绑定手机页面
                            }
                        } else {
                            Toast.info('服务器错误', 1);
                        }
                        this.props.dispatch({
                            type: 'cartModel/fetchCartList',
                        });
                    } else if (response.message) { // 登录失败
                        Toast.info(response.message, 2);
                    } else {
                        Toast.info('登录失败', 1);
                    }
                } catch (error) {
                    Log(error);
                }
            } else {
                if (flag > 3) {
                    Toast.info('授权失败，请稍后再试', 2);
                } else {
                    this.umengLogin(type);
                }
            }
        };
        // 授权失败
        const authorizeFail = (error) => {
            Toast.fail('第三方登录失败！', 2);
        };
        const command = [
            type,
        ];
        try {
            NativeModules.UmengModule.login(command)
                .then((result) => {
                    authorizeSuccess(result);
                })
                .catch((error) => {
                    authorizeFail(error);
                });
        } catch (error) {
            console.log(error);
        }
    }
}
const styles = EStyleSheet.create({
    container: {
        width: deviceWidth,
        height: deviceHeight,
        backgroundColor: '#ffffff',
    },
    topContainer: {
        height: 180,
        paddingTop: 20,
        paddingLeft: 16,
        paddingRight: 16,
    },
    topHeader: {
        height: 44,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    commonPosition: {
        position: 'absolute',
        right: 16,
        top: 20,
    },
    identifyCode: {
        color: '#666666',
    },
    identifyCodeActive: {
        color: '#2979FF',
    },
    loginButton: {
        width: '91%',
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
    },
    canClickloginButton: {
        backgroundColor: '#2979FF',
    },
    unClickLoginButton: {
        backgroundColor: '#75A8FF',
    },
    anotherLogin: {
        width: '91%',
        height: 44,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#2979FF',
        marginTop: 22,
    },
    leftLine: {
        position: 'absolute',
        top: 8,
        left: 0,
        width: 92,
        height: 1,
        backgroundColor: '#e4e4e4',
    },
    rightLine: {
        position: 'absolute',
        top: 8,
        right: 0,
        width: 92,
        height: 1,
        backgroundColor: '#e4e4e4',
    },
    thirdLogin: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    middleThirdLogin: {
        marginLeft: 54,
        marginRight: 54,
    },
    captchaCss: {
        width: 88,
        height: 40,
        resizeMode: 'stretch',
    },
    forgetPassword: {
        color: '#666',
        marginTop: 22,
        marginLeft: 15,
        fontSize: 14,
    },
});
export default TestLogin;
