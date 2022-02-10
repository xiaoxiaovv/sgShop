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
  Modal,
  ImageBackground,
} from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import EStyleSheet from 'react-native-extended-stylesheet';
import { NavBar } from '../../components';
import { createAction, connect, generateRandomUUID, getPrevRouteName, isWdHost } from '../../utils';
import { getAppJSON, postAppJSON, postForm, postAppForm } from '../../netWork';
import Config from 'react-native-config';
import { NavigationActions } from 'react-navigation';
import { getUserInfo } from '../../dvaModel/userUtil';

const ToastModal = ({ show, toastMsg }) => {
  return (
    show &&
    <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 999, width: deviceWidth, height: deviceHeight, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: deviceWidth * 0.8, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', borderRadius: 4, paddingLeft: 4, paddingRight: 4, paddingTop: 10, paddingBottom: 10 }}>
        <Image source={require('../../images/fail.png')} />
        <Text style={{ lineHeight: 28, fontSize: 16, color: '#ffffff' }}>{toastMsg}</Text>
      </View>
    </View>
  );
};
const ToggleEye = ({ openOrClose, toggleFunc }) => {
  return (
    !openOrClose ? <TouchableOpacity onPress={toggleFunc} style={{ position: 'absolute', right: 16, top: 20 }}>
      <Image source={require('../../images/eye_close.png')}
        style={{ width: 24, height: 24 }}></Image>
    </TouchableOpacity> :
      <TouchableOpacity onPress={toggleFunc} style={{ position: 'absolute', right: 16, top: 20 }}>
        <Image source={require('../../images/eye_open.png')}
          style={{ width: 24, height: 24 }}></Image>
      </TouchableOpacity>
  );
};
interface IOpenStoreSuccess {
  passwordVisible: boolean; // 密码 弹窗
  password: string;
  toastMsg: string;
  eyeFlag: boolean;
  memberCount: number;
  giftBag: boolean;
  hiddenSetPassword: boolean;
}
import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

class OpenStoreSuccess extends React.Component<{ navigation: NavigationScreenProp, dispatch?: (func: any) => {} }> {
  public state: IOpenStoreSuccess;
  public constructor(props) {
    super(props);
    const {params} = this.props.navigation.state;
    this.state = {
      passwordVisible: false,
      password: '',
      toastMsg: '',
      eyeFlag: false,
      giftBag: true,
      memberCount: 888888,
      hiddenSetPassword: IS_NOTNIL(params.hiddenSetPassword) ? params.hiddenSetPassword : false,
    };
  }
  public componentDidMount() {
    this.getShopData();
  }
  public render() {
    return (
      <ScrollView
        keyboardShouldPersistTaps='always'
        keyboardDismissMode='on-drag'
        style={styles.container}>
        <View>
          <NavBar title={'顺逛用户注册'} defaultBack={false} />
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50, marginBottom: 30 }}>
            <Image style={{ width: 100, height: 100, borderRadius: 50 }} source={require('../../images/shopapplysuccess.png')} />
          </View>
          <View>
            <Text style={{ color: '#000000', fontSize: 20, textAlign: 'center' }}>恭喜开店成功!</Text>
          </View>
          <View style={{ paddingLeft: 56, paddingRight: 56, marginTop: 12, marginBottom: 50 }}>
            <Text style={{ fontSize: 14, color: '#666666', textAlign: 'center' }}>您是第<Text style={{ color: '#f40' }}>{this.state.memberCount}</Text>位进入顺逛的小主。请联系你的推荐人，开启你的顺逛之旅!</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Image style={{ width: 88, height: 88 }} source={require('../../images/ehaierwd.jpg')} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
            <Text style={{ fontSize: 12, color: '#8f8f8f' }}>关注微信公众号："</Text><Text style={{ fontSize: 12, color: '#2979ff' }}>顺逛微店</Text><Text style={{ fontSize: 12, color: '#8f8f8f' }}>"</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontSize: 12, color: '#8f8f8f' }}>享一手资讯，拿幸运好礼!</Text>
          </View>
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <TouchableOpacity style={{ width: deviceWidth, alignItems: 'center', justifyContent: 'center' }}
              onPress={() => { this.goHome(); }}>
              <View
                style={styles.loginButton}>
                <Text style={{ color: '#ffffff', fontSize: 17 }}>立即体验</Text>
              </View>
            </TouchableOpacity>
          </View>
          {
            !this.state.hiddenSetPassword &&
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 23 }}>
            <TouchableOpacity onPress={() => { this.setState({ passwordVisible: true }); }}>
              <Text style={{ color: '#2979ff', fontSize: 16, textAlign: 'center' }}>设置密码</Text>
            </TouchableOpacity>
          </View>
          }
        </View>
        {/* 设置密码弹窗 */}
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.passwordVisible}
        >
          <View style={{ width: deviceWidth, height: deviceHeight, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
            {/* <View style={{ width: deviceWidth, height: deviceHeight, backgroundColor: 'rgba(0,0,0,0.4)' }}> */}
            <View style={styles.passwordModal}>
              <TouchableOpacity onPress={() => { this.closePwdModal(); }} style={{ position: 'absolute', top: 8, right: 8 }}>
                <Image source={require('../../images/xxx.png')} style={{ width: 24, height: 24 }} />
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 22, paddingRight: 22 }}>
                <Text style={{ color: '#333333', fontSize: 16 }}>请输入您的登录密码</Text>
              </View>
              <View style={{ height: 54, flexDirection: 'row', alignItems: 'center', marginLeft: 22, marginRight: 22, marginTop: 10, borderColor: '#e4e4e4', borderBottomWidth: 1 }}>
                <TextInput
                  secureTextEntry={!this.state.eyeFlag}
                  placeholder='设置密码'
                  placeholderTextColor={'#999999'}
                  onChangeText={(text) => { this.onChangeText(text); }}
                  style={{ width: '100%' }}
                ></TextInput>
                <ToggleEye
                  openOrClose={this.state.eyeFlag}
                  toggleFunc={() => { this.setState({ eyeFlag: !this.state.eyeFlag }); }}></ToggleEye>
              </View>
              <View style={{ alignItems: 'center', marginTop: 14, marginBottom: 40 }}>
                <TouchableOpacity style={{ width: 261, alignItems: 'center', justifyContent: 'center' }}
                  onPress={() => { this.submit(); }}
                  activeOpacity={1}>
                  <View
                    style={[styles.submitButton, (this.state.password.length === 0) ? styles.unClickLoginButton : styles.canClickloginButton]}>
                    <Text style={{ color: '#ffffff', fontSize: 17 }}>提交</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* 密码输入错误的自定义弹窗 */}
          <ToastModal
            toastMsg={this.state.toastMsg}
            show={this.state.toastMsg.length !== 0}>
          </ToastModal>
        </Modal>
        {/* 新手大礼包弹窗 */}
        <Modal
          // 设置Modal组件的呈现方式
          animationType='slide'
          // 它决定 Modal 组件是否是透明的
          transparent
          // 它决定 Modal 组件何时显示、何时隐藏
          visible={this.state.giftBag}
          // 当 Modal组件在屏幕上完成显示后，这个回调函数将被执行
          onShow={() => Log('onShow')}
          // 这是 Android 平台独有的回调函数类型的属性
          // 开发者必须要写一个函数来处理当 Modal 显示在界面时且android物理返回键被按下时的业务逻辑
          onRequestClose={() => Log('onShow')}
        >
          <View
            style={styles.modalVst}>
            <ImageBackground
              source={require('../../images/im-quant.png')}
              style={styles.modalImag}>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => {
                  this.setState({ giftBag: false });
                }}
              >
                <Image style={{ width: 24, height: 24 }}
                  source={require('../../images/closeBtnWhite.png')} />
              </TouchableOpacity>
              <Text style={styles.modalText}>
                贵店开张，优惠券
                            <Text style={{ fontSize: 20, color: '#FFE447' }}>礼包</Text>
                放入你的钱包，供你任性消费！
                        </Text>
            </ImageBackground>
            <View style={styles.modalButton}>
              <TouchableOpacity
                style={styles.modalButtonC}
                onPress={() => {
                  this.setState({ giftBag: false });
                  this.props.navigation.navigate('MyCoupon');
                }}
              >
                <Text style={{ color: '#fff', fontSize: 16 }}>我的优惠券</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
  public async getShopData() {
    try {
      const UserInfo = await getUserInfo();
      const response = await getAppJSON(Config.SHOP_APPLY_SUCCESS, {});
      if (response.success) {
        this.setState({
          memberCount: response.data.openStoreRank,
        });
      }
    } catch (error) {
      Log(error);
    }
  }
  public toast = (msg, duration = 2000) => {
    this.setState({ toastMsg: msg });
    setTimeout(() => {
      this.setState({ toastMsg: '' });
    }, duration);
  }
  public closePwdModal = () => {
    this.setState({ passwordVisible: false, password: '' });
  }
  public goHome = () => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'RootTabs' })],
    });
    this.props.navigation.dispatch(resetAction);
  }
  public onChangeText = (value) => {
    this.setState({ password: value });
  }
  public submit = async () => {
    const passwordRegExp = global.passwordRegExp;
    if (this.state.password.length === 0) {
      return;
    } else if (!passwordRegExp.test(this.state.password)) {
      this.toast('密码为数字、字母、特殊符号中的两种组合，长度6位~20位(字母区分大小写)');
    } else {
      const params = {
        password: this.state.password,
      };
      // const response = await postAppForm(Config.SET_PASSWORD, params);
      const response = await postAppForm('v3/platform/web/member/setPassword.json', params);
      console.log('设置密码接口返回结果======', response);
      if (response.success) {
        this.toast('设置密码成功！');
        await global.setItem('User', { password: this.state.password });
        this.props.navigation.dispatch(createAction('users/saveUsersMsg')({
          password: this.state.password,
        }));
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'RootTabs' })],
        });
        this.props.navigation.dispatch(resetAction);
      } else if (response.message) {
        this.toast(response.message);
      } else {
        this.toast('设置密码失败！');
      }
    }
  }
}
const styles = EStyleSheet.create({
  container: {
    width: deviceWidth,
    height: deviceHeight,
    backgroundColor: '#ffffff',
  },
  loginButton: {
    width: '83%',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: '#2979FF',
  },
  passwordModal: {
    width: 304,
    height: 190,
    paddingTop: 39,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  submitButton: {
    width: 261,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: '#2979FF',
  },
  canClickloginButton: {
    backgroundColor: '#2979FF',
  },
  unClickLoginButton: {
    backgroundColor: '#75A8FF',
  },
  modalVst: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImag: {
    height: 185,
    width: 250,
    position: 'relative',
  },
  modalClose: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 99,
  },
  modalText: {
    color: '#fff',
    fontSize: 12,
    textShadowRadius: 1,
    textShadowColor: 'rgba(111, 0, 0, 0.75)',
    paddingTop: 32,
    paddingLeft: 24,
    paddingRight: 24,
    textAlign: 'center',
  },
  modalButton: {
    height: 79,
    paddingTop: 17,
    width: 250,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  modalButtonC: {
    height: 44,
    marginLeft: 21,
    marginRight: 21,
    backgroundColor: '#f40',
    borderRadius: 78,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default OpenStoreSuccess;
