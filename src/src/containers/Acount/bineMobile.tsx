import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { NavigationScreenProp, NavigationActions } from 'react-navigation';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Checkbox, Toast } from 'antd-mobile';
import { getAppJSON, postAppJSON } from '../../netWork';
import Config from 'react-native-config';
import { getPrevRouteName, createAction } from '../../utils';
interface IBindMobile {
  verificationCode: number;
  verificationTips: string; // 短信验证码提示文字
  showPwd: boolean;
  agreeProtocol: boolean;
  navigation: NavigationScreenProp;
  mobile: string;
  captcha: string;
  password: string;
  captchaPicUrl: string;
  canGetICode: boolean;
}
import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

const AgreeItem = Checkbox.AgreeItem;

const EyeOpen = ({showPwd}) => {
  return (
    showPwd ? <Image style={styles.openEye} source={require('../../images/eye_open.png')} /> :
    <Image style={styles.openEye} source={require('../../images/eye_close.png')} />
  );
};
export default class BindMobile extends Component<IBindMobile> {
  public constructor(props) {
    super(props);
    this.state = {
      verificationCode: '',
      verificationTips: '获取验证码',
      showPwd: false,
      agreeProtocol: false,
      mobile: '',
      captcha: '',
      password: '',
      captchaPicUrl: '',
      canGetICode: true, // 是否可以点击获取短信验证码
    };
  }
  public componentDidMount() {
    this.getCaptcha();
  }
  public render() {
    global.deleteUsersMsg = true; // 是否要注销用户信息
    return (
    <View style={styles.container}>
      <View style={styles.topTips}>
        <Text style={{fontSize: 12, textAlign: 'center'}}>为更好的保障店主权益,开店需要绑定手机号,绑定手机后直接手机号登录</Text>
      </View>
      <View style={styles.inputBox}>
        <Image style={styles.inputIcon} source={require('../../images/ic_personal.png')}/>
        <TextInput style={styles.mobileInput} placeholder='请输入您的手机号'
          onChangeText={(value) => this.setState({ mobile: value })}></TextInput>
      </View>
      <View style={styles.inputBox}>
        <Image style={styles.inputIcon} source={require('../../images/ic_message.png')}/>
        <TextInput style={styles.mobileInput} placeholder='输入验证码'
          onChangeText={(value) => this.setState({ captcha: value })}></TextInput>
        <TouchableOpacity style={styles.captchaBox} onPress={() => this.getCaptcha()}>
          <Image style={styles.captcha} source={{uri: this.state.captchaPicUrl}} />
        </TouchableOpacity>
      </View>
      <View style={styles.inputBox}>
        <Image style={styles.inputIcon} source={require('../../images/ic_message.png')}/>
        <TextInput style={styles.mobileInput} placeholder='输入短信验证码'
          onChangeText={(value) => this.setState({ verificationCode: value })}
          ></TextInput>
        <TouchableOpacity style={styles.unSendedVCode} onPress={() => this.getVCode()}>
          <View>
            <Text style={this.state.canGetICode ? styles.unSendedColor : styles.hasSendedColor}>
            {this.state.verificationTips}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.inputBox}>
        <Image style={styles.inputIcon} source={require('../../images/ic_locker.png')}/>
        <TextInput style={styles.mobileInput} placeholder='输入密码'
          onChangeText={(value) => this.setState({ password: value })}
          secureTextEntry={this.state.showPwd ? false : true }></TextInput>
        <TouchableOpacity style={styles.showPwd} onPress={() => this.setState({showPwd: !this.state.showPwd})}>
          <EyeOpen showPwd={this.state.showPwd}></EyeOpen>
        </TouchableOpacity>
      </View>
      <View style={styles.tips}>
        <Text style={{fontSize: 12, color: '#333333'}}>提示：密码为数字、字母、特殊符号中的两种组合，长度6位~20位(字母区分大小写)</Text>
      </View>
      <View style={styles.protocol}>
        <View>
          <AgreeItem onChange={e => this.setState({agreeProtocol: e.target.checked})}></AgreeItem>
        </View>
        <Text>同意</Text>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('AgreementWebview',
                        { helpId: 1002, title: '《顺逛微店注册协议》' })}
                        activeOpacity={1}>
          <Text style={{color: '#40c2ff', fontSize: 12}}>《顺逛微店注册协议》</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('AgreementWebview',
                        { helpId: 996, title: '《快捷通服务协议》' })}
                        activeOpacity={1}>
          <Text style={{color: '#40c2ff', fontSize: 12}}>《快捷通服务协议》</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => this.bindMobile()}>
        <View style={styles.bind}>
          <Text style={{color: '#ffffff', fontSize: 12}}>绑定</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
// 获取短信验证码
public getVCode = async () => {
  if (this.state.canGetICode) {
    if (!(global.mobileNumberRegExp.test(this.state.mobile))) {
      Toast.info('请输入正确的手机号码！', 1);
    } else if (this.state.captcha.length === 0) {
      Toast.info('请输入验证码！', 1);
    } else {
      const params = {
        mobileNum: this.state.mobile,
        captcha: this.state.captcha,
      };
      const result = await getAppJSON(Config.GET_IDENTIFY_CODE, params);
      if (result.success) {
        let timeCount = 60;
        const timer = setInterval(() => {
          if (timeCount - 1 < 0) {
            clearInterval(timer);
            this.setState({canGetICode: true});
            this.setState({verificationTips: '获取验证码'});
          } else {
            timeCount--;
            this.setState({canGetICode: false});
            this.setState({verificationTips: '重发' + timeCount + 's'});
          }
        }, 1000);
      } else if (result.errorCode === '1102') {
         Toast.info('亲，此手机号已注册过顺逛账户，请改用其他手机号。', 1);
      } else if (result.message) {
        Toast.info(result.message);
      } else {
        Toast.info('获取验证码失败！');
      }
    }
  } else {
    return ;
  }
}
// 获取图片验证码
public getCaptcha = () => {
  const sgToken = dvaStore.getState().users.userToken;
  const imgUrl = Config.SERVER_DATA + Config.GET_IMG_CAPTCHA + '?rnd=' + Math.random() +
    '&flag=' + sgToken.substring(6);
  this.setState({captchaPicUrl: imgUrl});
}
// 绑定手机号
private bindMobile = async () => {
  const mobileNumberRegExp = global.mobileNumberRegExp;
  const passwordRegExp = global.passwordRegExp;
  if (!mobileNumberRegExp.test(this.state.mobile)) {
    Toast.info('请输入在正确的手机号！', 1);
  } else if (this.state.password.length === 0) {
    Toast.info('请输入密码！', 1);
  } else if (!passwordRegExp.test(this.state.password)) {
    Toast.info('密码不符合规则！', 1);
  } else if (this.state.captcha.length === 0) {
    Toast.info('请输入验证码！', 1);
  } else if (this.state.verificationCode.length === 0) {
    Toast.info('请输入短信验证码！', 1);
  } else if (!this.state.agreeProtocol) {
    Toast.info('请选择同意《顺逛微店注册协议》及《快捷通服务协议》!', 1);
  } else {
    const params = {
      mobileNum: this.state.mobile,
      captcha: this.state.captcha,
      password: encodeURIComponent(this.state.password),
      imgCaptcha: this.state.verificationCode,
      isNew: 1,
    };
    const header = {
      Authorization: 'open the gate',
    };
    const newUrl = `${Config.BIND_MOBILE}?mobileNum=${params.mobileNum}&captcha=${params.imgCaptcha}&password=${params.password}&imgCaptcha=${params.captcha}&isNew=${params.isNew}`;
    const response = await postAppJSON(newUrl, {}, Config.API_URL);
    if (response.success) {
      if (response.data) {
        console.log('绑定手机号成功！');
        // 小能客服
        // 绑定成功后，把手机号存入usersmodel里的mobile字段
        this.props.navigation.dispatch(createAction('users/saveUsersMsg')({mobile: this.state.mobile}));
        if (global.loginGoNum === 0) {
          const resetAction = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'RootTabs'})],
          });
          this.props.navigation.dispatch(resetAction);
        } else {
          global.deleteUsersMsg = false;
          this.props.navigation.goBack(); // 通过 navigationhelper.txs 返回到上上页面
        }
      } else {
        Toast.info(response.message, 2);
      }
    } else if (response.message === '该手机已被注册！') {
      Toast.info('亲，此手机号已注册过顺逛账户，请改用其他手机号。', 1);
    } else if (response.message) {
      Toast.info(response.message, 2);
    } else {
      Toast.info('注册失败！', 2);
    }
  }
}
}
const styles = EStyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  topTips: {
    width: width,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  inputIcon: {
    width: 44,
    height: 50
  },
  inputBox: {
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd'
  },
  mobileInput: {
    flex: 1,
  },
  captchaBox: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  captcha: {
    height: 41,
    width: 80,
  },
  hasSendedVCode: {

  },
  unSendedVCode: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: 78,
    height: 31,
    backgroundColor: '#32beff',
    borderColor: 'transparent',
    borderRadius: 4,
    right: 5,
    top: 10,
  },
  unSendedColor: {
    color: '#ffffff',
  },
  hasSendedColor: {
    color: '#666666',
  },
  showPwd: {
    position: 'absolute',
    right: 5,
    top: 14,
  },
  openEye: {
    width: 24,
    height: 24,
  },
  tips: {
    marginTop: 10,
    paddingLeft: 31,
    paddingRight: 31,
  },
  protocol: {
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
 bind: {
   height: 31,
   marginLeft: 10,
   marginRight: 10,
   marginTop: 20,
   backgroundColor: '#32beff',
   justifyContent: 'center',
   alignItems: 'center',
   borderRadius: 4,
 },
});
