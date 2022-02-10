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
import LinearGradient from 'react-native-linear-gradient';
import EStyleSheet from 'react-native-extended-stylesheet';
import Address from '../../components/Address';
import { SafeView, IsIphoneX } from './../../components';
import { createAction, connect, generateRandomUUID, getPrevRouteName, isWdHost } from '../../utils';
import { getAppJSON, postAppJSON, postForm, postAppForm } from '../../netWork';
import Config from 'react-native-config';
import { Toast } from 'antd-mobile';
import { NavigationActions } from 'react-navigation';
import { iPhoneXPaddingTopStyle, IS_NOTNIL } from '../../utils';
import axios from 'axios';
interface INewRegister {
  mobile: string; // 手机号
  iCode: string; // 短信验证码
  captcha: string; // 图形验证码
  getICodeText: string; // 短信验证码的按钮文字信息
  captchaImg: string; // 登录的图片验证码图片url
  canGetICode: boolean; // 是否可以获取短信验证码
  showCaptcha: boolean; // 是否要展示图形验证码
  step: number; // 1：注册顺逛普通会员成功前 2：注册成功普通会员后、申请微店主成功前
  ceVisible: boolean; // 佣金演示modal是否展示
  promotionVisible: boolean; // 推荐人信息 modal是否展示
  unionInfo: { label: string, value: string }; // 联盟分类信息
  showAddressModal: boolean; // 地址modal是否显示
  backToStep1: boolean; // 地址modal是否显示
    showAgreement: boolean; // 新协议
  provinceName: string;
  cityName: string;
  areaName: string;
  provinceId: number;
  cityId: number;
  areaId: number;
  baseAddress: string; // 省市区地址
  promotionCode: string; // 推荐码
  realName: string; // 推荐人姓名
  promotionMobile: string; // 推荐人手机号
  hrCode: string; // 上岗证号
  hiddenSetPassword: boolean;
}
// 输入框
const MyInput = ({ placeholder, autoFocus, value, onChangeText, secureTextEntry = false, onSubmitEditing = null }) => {
  return (
    <TextInput
      style={{ height: 56, borderBottomColor: '#e4e4e4', borderBottomWidth: 1 }}
      placeholder={placeholder}
      placeholderTextColor={'#999999'}
      value={value}
      autoFocus={autoFocus}
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
// 短信验证码
const GetICode = ({ getICode, style, getICodeText }) => {
  return (
    <TouchableOpacity onPress={getICode}
      style={style}>
      <Text style={{ color: '#2979FF' }}>{getICodeText}</Text>
    </TouchableOpacity>
  );
};
// 登录的图片验证码
const GetCaptcha = ({ show, placeholder, value, onChangeText, getCaptchaImg, captchaImg }) => {
  return (
    show &&
    <View>
      <TextInput
        style={{ height: 56, borderBottomColor: '#e4e4e4', borderBottomWidth: 1 }}
        placeholder={placeholder}
        placeholderTextColor={'#999999'}
        value={value}
        onChangeText={onChangeText}
        underlineColorAndroid='transparent'

      ></TextInput>
      <TouchableOpacity onPress={getCaptchaImg} style={{ height: 56, position: 'absolute', right: 0, top: 8 }}>
        <Image
          source={{ uri: captchaImg }}
          style={styles.captchaCss}></Image>
      </TouchableOpacity>
    </View>
  );
};
let addressFlag = 3; // 1自己已经选择地址  2自己没有选择地址但是有定位的地址 3定位失败或者没有自己选择地址
let addressInfo = '';
import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

const mapStateToProps = ({ address: { regionName, areaName, provinceName, cityName, areaId, provinceId, cityId } }) => ({
  regionName, areaName, provinceName, cityName, areaId, provinceId, cityId,
});

@connect(mapStateToProps)
class NewRegister extends React.Component<{ navigation: NavigationScreenProp, dispatch?: (func: any) => {} }> {
  public state: INewRegister;

  public constructor(props) {
    super(props);
    let initialStep;
    const { params } = this.props.navigation.state;
    if (params) {
      if (params.step) {
        initialStep = params.step;
      } else {
        initialStep = 1;
      }
    } else {
      initialStep = 1;
    }
    this.state = {
      mobile: '',
      iCode: '',
      baseAddress: '', // 省市区地址
      getICodeText: '获取验证码',
      canGetICode: true, // 是否可以获取短信验证码
      captcha: '', // 图形验证码
      showCaptcha: false,
      ceVisible: false,
      promotionVisible: false,
      step: initialStep,
      unionInfo: { label: '会员类型', value: '' }, // 联盟分类信息
      showAddressModal: false,
      provinceId: null,
      cityId: null,
      areaId: null,
      provinceName: '',
      cityName: '',
      areaName: '',
      promotionCode: '',
      hrCode: '',
      backToStep1: false,
        showAgreement: true,
    };
  }
  public render() {
    if (this.state.baseAddress) {
      addressFlag = 1; // 自己手动选择了地址
      addressInfo = this.state.baseAddress;
    } else if (this.props.areaName.length !== 0 && global.autoPosition) {
      addressFlag = 2; // 定位成功
      addressInfo = `${this.props.provinceName} ${this.props.cityName} ${this.props.areaName}`;
    } else {
      addressFlag = 3; // 定位失败 或者 自己没有选择地址
      addressInfo = '地址获取失败,请选择';
    }
    return (
        <SafeView style={{flex: 1}}>
          <View style={{flex: 1}}>
      <ScrollView
        keyboardShouldPersistTaps='handled'
        keyboardDismissMode='on-drag'
        style={styles.container}>
        <View>
          <LinearGradient
            colors={['#2979FF', '#295BFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}>
            <View style={[styles.topContainer, iPhoneXPaddingTopStyle]}>
              <View style={styles.topHeader}>
                <TouchableOpacity onPress={() => { this.goBack(); }}>
                  <Image style={{ width: 24, height: 24, marginVertical: 10, marginHorizontal: 16}}
                    source={require('../../images/ic_back_white.png')}></Image>
                </TouchableOpacity>
                <Text style={{ color: '#ffffff', fontSize: 18 }}>{this.state.step === 1 ? '顺逛用户注册' : '完善信息'}</Text>
                <Text style={{width: 24}}/>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Image style={{ width: 56, height: 56 }}
                  source={require('../../images/sg_logo_white.png')}></Image>
                <View>
                  <Text style={{ color: '#ffffff', marginLeft: 15, fontSize: 16 }}>海尔官方社群交互平台</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          {this.state.step === 1 &&
            <View style={{ paddingLeft: 16, paddingRight: 16 }}>
              {/* 手机号 */}
              <MyInput
                placeholder={'请输入手机号'}
                value={this.state.mobile}
                onChangeText={(text) => this.setState({ mobile: text })} />
              {/* 图形验证码 */}
              <GetCaptcha
                show={this.state.showCaptcha && this.state.step === 1}
                placeholder='请输入验证码'
                value={this.state.captcha}
                onChangeText={(text) => this.setState({ captcha: text })}
                getCaptchaImg={() => this.getCaptchaImg()}
                captchaImg={this.state.captchaImg}></GetCaptcha>
              {/* 短信验证码 */}
              <View>
                <MyInput
                  placeholder={'输入短信验证码'}
                  value={this.state.iCode}
                  onChangeText={(text) => this.setState({ iCode: text })} />
                <GetICode
                  getICode={() => this.getICode()}
                  style={styles.commonPosition}
                  getICodeText={this.state.getICodeText} />
              </View>
              {/* 登录按钮 */}
              <View style={{ alignItems: 'center', marginTop: 42 }}>
                <TouchableOpacity style={{ width: deviceWidth, alignItems: 'center', justifyContent: 'center' }}
                                  onPress={this.loginSG}>
                  <View
                    style={[styles.loginButton]}>
                    <Text style={{ color: '#ffffff', fontSize: 17 }}>登录</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          }
          {/* 注册成功的弹窗 */}
          <Modal
            animationType={'fade'}
            transparent={true}
            visible={this.state.ceVisible}
          >
            <View style={{ width: deviceWidth, height: deviceHeight, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', }}>
              <View style={styles.registerSucs}>
                <TouchableOpacity onPress={() => this.goHome()} style={{ position: 'absolute', top: 8, right: 8 }}>
                  <Image source={require('../../images/xxx.png')} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: '#333333', fontSize: 16 }}>恭喜您成为顺逛会员</Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 14, marginBottom: 20 }}>
                  <Text style={{ color: '#666666', fontSize: 14 }}>升级微店主领佣金，可享更多权益</Text>
                </View>
                <Image style={{ width: '100%', height: 90 }} source={require('../../images/commissionExample.png')} />
                <View style={{ alignItems: 'center', marginTop: 20 }}>
                  <TouchableOpacity style={{ width: 304, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => this.registerNext()}>
                    <View
                      style={[styles.loginButton]}>
                      <Text style={{ color: '#ffffff', fontSize: 17 }}>立即升级为微店主</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          {/* 顺逛协议 */}
          {
            // this.state.step === 1 &&
            // <View style={{ marginTop: 22, justifyContent: 'center', alignItems: 'center', width: deviceWidth }}>
            //   <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            //     <Text style={styles.agreementText}>登录即代表同意</Text>
            //     <TouchableOpacity onPress={() => this.props.navigation.navigate('AgreementWebview',
            //       { helpId: 1002, title: '《顺逛微店注册协议》' })}
            //       activeOpacity={1}>
            //       <Text style={[styles.agreementText, { color: '#5E9AFF' }]}>《顺逛微店注册协议》</Text>
            //     </TouchableOpacity>
            //     <Text style={styles.agreementText}>和</Text>
            //     <TouchableOpacity onPress={() => this.props.navigation.navigate('AgreementWebview',
            //             {helpId: 996, title: '《快捷通服务协议》'})}
            //       activeOpacity={1}>
            //       <Text style={[styles.agreementText, { color: '#5E9AFF' }]}>《快捷通服务协议》</Text>
            //     </TouchableOpacity>
            //   </View>
            // </View>
          }


          {/* 会员类型 */}
          {this.state.step === 2 &&
            <View>
              <View style={styles.openStoreContainer}>
                <TouchableOpacity style={styles.openStoreBox} onPress={() => { this.chooseUnion() }}>
                  <Text style={this.state.unionInfo.label === '会员类型' ? styles.fontCss : styles.fontCssActive}>{this.state.unionInfo.label}</Text>
                  <Image source={require('../../images/flash_sale_more.png')} />
                </TouchableOpacity>
              </View>
              {/* 上岗证号 */}
              {this.state.unionInfo.label.substring(0, 4) === '人人服务' &&
                <View style={{ paddingLeft: 16, paddingRight: 16 }}>
                  <MyInput
                    placeholder={'上岗证号'}
                    value={this.state.hrCode}
                    onChangeText={(text) => this.setState({ hrCode: text })} />
                </View>
              }
              {/* 选择地址 */}
              <View style={styles.openStoreContainer}>
                <TouchableOpacity style={styles.openStoreBox} onPress={() => { this.setState({ showAddressModal: true }); }}>
                  <Text style={addressFlag === 3 ? styles.fontCss : styles.fontCssActive}>{addressInfo}</Text>
                  <Image source={require('../../images/flash_sale_more.png')} />
                </TouchableOpacity>
              </View>
              {/* 推荐码 */}
              <View style={{ paddingLeft: 16, paddingRight: 16 }}>
                <MyInput
                  placeholder={'推荐码'}
                  value={this.state.promotionCode}
                  onChangeText={(text) => this.setState({ promotionCode: text })} />
              </View>
              {/* 提交 */}
              <View style={{ alignItems: 'center', marginTop: 40, marginBottom: 40 }}>
                <TouchableOpacity style={{ width: deviceWidth, alignItems: 'center', justifyContent: 'center' }}
                  onPress={() => { this.submit(); }}
                  activeOpacity={1}>
                  <View
                    style={[styles.loginButton,
                     (this.state.unionInfo.label === '会员类型' || addressFlag === 3 || !this.state.promotionCode || (this.state.unionInfo.label.substring(0, 4) === '人人服务' && !this.state.hrCode)) ? styles.unClickLoginButton : styles.canClickloginButton]}>
                    <Text style={{ color: '#ffffff', fontSize: 17 }}>提交</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <Text style={{ textAlign: 'center', color: '#666666', fontSize: 14 }}>若无推荐码,系统可为您分配,点击获取</Text>
              </View>
              <View style={{ alignItems: 'center', marginTop: 14 }}>
                <TouchableOpacity onPress={() => { this.getPromotionCode() }} style={{ width: 70 }}><Text style={{ textAlign: 'center', color: '#2979FF', fontSize: 14 }}>点击获取</Text></TouchableOpacity>
              </View>
            </View>
          }
          {/* 推荐人信息 弹窗 */}
          <Modal
            animationType={'fade'}
            transparent={true}
            visible={this.state.promotionVisible}
          >
            <View style={{ width: deviceWidth, height: deviceHeight, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
              <View style={styles.promotionPerson}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: '#333333', fontSize: 16 }}>请确认您的推荐人信息</Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 12 }}>
                  <Text style={{ color: '#000000', fontSize: 22 }}>{this.state.promotionCode}</Text>
                </View>
                <ImageBackground style={{ justifyContent: 'center', alignSelf: 'center', width: 231, height: 84, alignItems: 'flex-start', paddingLeft: 20 }} source={require('../../images/promotionBack.png')}>
                  <Text style={{ fontSize: 16, color: '#666666', marginTop: 10 }}>推荐人信息:{this.state.realName}</Text>
                  <Text style={{ fontSize: 16, color: '#666666' }}>推荐人电话:{this.state.promotionMobile}</Text>
                </ImageBackground>
                <Text style={{ fontSize: 12, color: '#666666', marginTop: 25, marginRight: 16, marginBottom: 25, marginLeft: 16 }}>推荐人将成为您的服务导师,助您快速创业,请谨慎填写,一旦提交无法修改！</Text>
                <View style={{ flexDirection: 'row', position: 'absolute', bottom: 0, width: 304 }}>
                  <TouchableOpacity onPress={() => { this.setState({ promotionVisible: false }); }} style={{ width: '50%', height: 45, borderColor: '#eeeeee', borderTopWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#2979ff', fontSize: 17 }}>取消</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { this.confirm(); }} style={{ width: '50%', height: 45, backgroundColor: '#2979ff', justifyContent: 'center', alignItems: 'center', borderBottomRightRadius: 8 }}>
                    <Text style={{ color: '#ffffff', fontSize: 17 }}>确定</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        {/* 地址栏modal视图 */}
        <Modal
          // 设置Modal组件的呈现方式
          animationType='slide'
          // 它决定 Modal 组件是否是透明的
          transparent
          // 它决定 Modal 组件何时显示、何时隐藏
          visible={this.state.showAddressModal}
          // 当 Modal组件在屏幕上完成显示后，这个回调函数将被执行
          onShow={() => Log('onShow')}
          // 这是 Android 平台独有的回调函数类型的属性
          // 开发者必须要写一个函数来处理当 Modal 显示在界面时且android物理返回键被按下时的业务逻辑
          onRequestClose={() => Log('onShow')}
        >
          <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
            <TouchableOpacity
              style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: deviceHeight - 400,
              }}
              activeOpacity={1} onPress={() => this.setState({ showAddressModal: false })}>
              <View style={{
                position: 'absolute', top: 0, left: 0, width: '100%',
                height: deviceHeight - 400,
              }}></View>
            </TouchableOpacity>
            <Address
              hasHeader={true}
              notSelectStreet={true}
              onclick={() => this.setState({ showAddressModal: false })}
              onSelect={(addressObj) => {
                Log('onSelect -> addressObj', addressObj);
                this.addressFinished(addressObj);
              }}
              onFinish={(addressObj) => {
                Log('onFinish -> addressObj', addressObj);
                this.setState({
                  showAddressModal: false,
                  baseAddress: `${addressObj.province.text} ${addressObj.city.text} ${addressObj.district.text}`,
                });
              }}
            />
          </View>
        </Modal>

      </ScrollView>
              {/* 新协议 */}
              {
                  (this.state.step === 1 && this.state.showAgreement) && <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0, 0.3)"}}>
                    <View style={{backgroundColor: "#fff", position: 'absolute', left: 0, right: 0, bottom: IsIphoneX ? 34 : 0, height: deviceHeight - 150}}>
                      <View style={{height: 50, alignItems: 'center', justifyContent: 'center', borderBottomColor: '#999', borderBottomWidth: StyleSheet.hairlineWidth}}>
                        <Text style={{fontSize: 18}}>注册协议及隐私政策</Text>
                      </View>
                      <View style={{flex: 1, backgroundColor: '#E4E4E4', marginBottom: 50}}>
                      <ScrollView style={{marginHorizontal: 16, marginTop: 5}}>
                        <Text style={{fontSize: 15, lineHeight: 25}}>【审慎阅读】您在申请注册流程中点击同意前，应当认真阅读以下协议。请您务必审慎阅读、充分理解协议中相关条款内容，其中包括：</Text>
                        <Text style={{fontSize: 15, lineHeight: 25, marginLeft: 10, marginTop: 10}}>1、与您约定免除或限制责任的条款；</Text>
                        <Text style={{fontSize: 15, lineHeight: 25, marginLeft: 10, marginTop: 5}}>2、与您约定法律适用和管辖的条款；</Text>
                        <Text style={{fontSize: 15, lineHeight: 25, marginLeft: 10, marginTop: 5}}>3、其他以粗体下划线标识的重要条款。</Text>
                        <Text style={{fontSize: 15, lineHeight: 25, marginTop: 10}}>如您对协议有任何疑问，可向平台客服咨询。</Text>
                        <Text style={{fontSize: 15, lineHeight: 25, marginTop: 10}}>【特别提示】当您按照注册页面提示填写信息、阅读并同意协议且完成全部注册程序后，即表示您已充分阅读、理解并接受协议的全部内容。</Text>
                        <Text style={{fontSize: 15, lineHeight: 25, marginTop: 10}}>阅读协议的过程中，如果您不同意相关协议或其中任何条款约定，您应立即停止注册程序。</Text>
                        <Text style={{fontSize: 17, lineHeight: 25, marginTop: 20, textDecorationLine: 'underline', color: "#5E9AFF"}} onPress={() => this.props.navigation.navigate('AgreementWebview',
                            { helpId: 1002, title: '《顺逛用户服务协议》' })}>《顺逛用户服务协议》</Text>
                        <Text style={{fontSize: 17, lineHeight: 25, marginTop: 10, textDecorationLine: 'underline', marginBottom: 10, color: "#5E9AFF"}} onPress={() => this.props.navigation.navigate('CustomPageWeb',
                            { url: 'http://account.haier.com/html/privacypolicy.html', title: '《海尔家电隐私权政策》' })}>《海尔家电隐私权政策》</Text>
                      </ScrollView>
                      </View>
                      <View style={{height: 50, position: 'absolute', bottom: 0, left: 0, right: 0, borderTopColor: '#999', borderTopWidth: StyleSheet.hairlineWidth, backgroundColor: '#fff', flexDirection: 'row'}}>
                          <TouchableOpacity style={{flex: 1}} activeOpacity={0.9}
                                            onPress={() => {
                                                this.props.dispatch(NavigationActions.back());
                                            }}>
                              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}><Text style={{fontSize: 17}}>取 消</Text></View></TouchableOpacity>
                          <TouchableOpacity style={{flex: 1}} activeOpacity={0.9}onPress={()=>{
                              this.setState({showAgreement: false});
                          }}><View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#5E9AFF'}}><Text style={{color: '#fff', fontSize: 17}}>同意并继续</Text></View></TouchableOpacity>
                      </View>
                    </View>
                  </View>
              }
          </View>
        </SafeView>
    );
  }
  private goBack = () => {
    if (this.state.step === 2 && this.state.backToStep1 === true) {
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'RootTabs' })],
      });
      this.props.navigation.dispatch(resetAction);
    } else {
      this.props.navigation.goBack();
    }
  }
  private setMobile = (vallue) => {
    this.setState({ mobile: vallue });
  }
  // 获取短信验证码
  private getICode = async () => {
    if (!this.state.mobile || this.state.mobile.length === 0) {
      Toast.info('请输入手机号', 2);
    } else if (!global.mobileNumberRegExp.test(this.state.mobile)) {
      Toast.info('请输入正确的手机号格式', 2);
    } else if (this.state.captcha.length === 0 && this.state.showCaptcha) {
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
        const res = await getAppJSON(Config.FAST_LOGIN_CAPTCHA, params, { headers });
        if (!res.data) {
          this.getCaptchaImg();
          this.setState({ showCaptcha: true });
          Toast.info(res.message);
        } else if (res.data === -1 && this.state.captcha.length === 0) {
          this.getCaptchaImg(); // 获取快速登录的图片验证码
          this.setState({ showCaptcha: true });
          Toast.info('请输入图形验证码', 2);
        } else {
          // 获取短信验证码
          if (this.state.canGetICode) {
            let timeCount = 60;
            const timer = setInterval(() => {
              if (timeCount - 1 < 0) {
                clearInterval(timer);
                this.setState({ canGetICode: true });
                this.setState({ getICodeText: '获取验证码' });
              } else {
                timeCount--;
                this.setState({ canGetICode: false });
                this.setState({ getICodeText: '重新获取(' + timeCount + 's)' });
              }
            }, 1000);
          }
        }
      } catch (error) {
        Log(error);
      }
    }
  }
  // 图片验证码
  private getCaptchaImg = async () => {
    try {
      const sgToken = await global.getItem('userToken');
      const captchaImgUrl = Config.SERVER_DATA + Config.GET_IMG_CAPTCHA + '?rnd=' + Math.random() +
        '&flag=' + sgToken.substring(6);
      this.setState({ captchaImg: captchaImgUrl });
      console.log('图形验证码地址====', captchaImgUrl);
    } catch (error) {
      Log(error);
    }
  }
  // 登录
  private loginSG = async () => {
    if (this.state.mobile.length === 0) {
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
          Toast.success('登录成功', 2);
          // 社区登录交互相关:勿动调用社区传递过来的回调·
          const { params } = this.props.navigation.state;
          if (params && params.callBack) {
            // 调用社区传递过来的回调,loginInfo请完善成为登录后的用户信息
            const loginInfo = { token: 'Bearer' + res.data.sessionValue };
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
          this.props.dispatch(createAction('users/saveUsersMsg')({
            ...res.data,
            isLogin: true,
            isHost: isHostWd,
            userAcount: this.state.mobile,
            password: '',
          }));
          DeviceEventEmitter.emit('judge88Alert');
          const memberId = res.data.mid;
          if (isHostWd === 1) {
            global.setItem('roleInfo', '1');
            global.setItem('storeId', memberId);
            const resetAction = NavigationActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: 'RootTabs' })],
            });
            this.props.navigation.dispatch(resetAction);
            this.props.dispatch({
              type: 'cartModel/fetchCartList',
            });
          } else {
            global.setItem('roleInfo', '0');
            global.setItem('storeId', 20219251);
            this.setState({ ceVisible: true });
          }
          // 快速登录:统计埋点代码
          NativeModules.StatisticsModule.setUserId(memberId.toString());

          // NativeModules.StatisticsModule.setPeopleVariable({
          //     name: this.state.userName,
          //     mobile: this.state.mobile,
          //     email: this.state.email,
          //     gender: UserService.getUser().gender,
          //     birthday: UserService.getUser().birthday
          //   });
          // const prevRoute = getPrevRouteName();
          // if (!prevRoute || prevRoute === 'guidePage' || prevRoute === 'register' || prevRoute === 'PasswordReset' || prevRoute === 'ResetPassword' || prevRoute === 'TelChangeSuccess') {
          //   // this.props.navigation.navigate('RootTabs');
          //   const resetAction = NavigationActions.reset({
          //     index: 0,
          //     actions: [NavigationActions.navigate({ routeName: 'RootTabs' })],
          //   });
          //   this.props.navigation.dispatch(resetAction);
          // } else {
          //   this.props.navigation.goBack();
          // }
          // 是否开过店
          // const responseOfStore = await getAppJSON(Config.IS_HAS_STORE, memberId);
          // if (!responseOfStore.data) {
          //   global.setItem('roleInfo', '0');
          //   global.setItem('storeId', 20219251);
          // } else {
          //   global.setItem('roleInfo', '1');
          //   global.setItem('storeId', memberId);
          // }
        } else {
          Toast.info(res.message, 2);
        }
      } catch (error) {
        Log(error);
      }
    }
  }
  // 跳转到首页
  private goHome = () => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'RootTabs' })],
    });
    this.props.navigation.dispatch(resetAction);
  }
  // 立即升级为微店主
  private registerNext = () => {
    this.setState({ step: 2, ceVisible: false, backToStep1: true });
  }
  // 选择会员类型
  private chooseUnion = () => {
    this.props.navigation.navigate('CommonUnion', { callback: (data) => this.setState({ unionInfo: data }) });
  }
  // 地址选择回传方法
  private addressFinished(addressInfo) {
    this.setState({
      provinceId: addressInfo.province.value,
      cityId: addressInfo.city.value,
      areaId: addressInfo.district.value,
      provinceName: addressInfo.province.text,
      cityName: addressInfo.city.text,
      areaName: addressInfo.district.text,
    });
  }
  // 获取推荐码
  private getPromotionCode = async () => {
    const { provinceId, cityId, areaId, promotionCode } = this.state;
    if (addressFlag === 3) {
      Toast.info('请选择地址');
    } else {
      if (promotionCode.length !== 0) {
        Toast.info('您已有推荐码，快快完成注册吧。');
      } else {
        try {
          const params = {
            regionId: areaId ? areaId : this.props.areaId, // 如果用户没有自己选择地址 就 用自动定位的地址
          };
          const response = await postAppForm(Config.GET_PROMOTION_CODE, params);
          if (response.success) {
            if (IS_NOTNIL(response.data)) {
              this.setState({
                promotionCode: response.data,
              });
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
  // 提交
  private submit = async () => {
    if ((this.state.unionInfo.label === '会员类型' || addressFlag === 3 || !this.state.promotionCode || (this.state.unionInfo.label.substring(0, 4) === '人人服务' && !this.state.hrCode))) {
      return;
    }
    const { provinceId: autoProvinceId, cityId: autoPcityId, regionId: autoPegionId } = this.props;
    const { baseAddress, unionInfo, promotionCode, provinceId, cityId, areaName,
      areaId, hrCode,
    } = this.state;
    console.log(unionInfo.label !== '会员类型');
    if (addressFlag === 3) {
      Toast.info('请选择所在地区！');
    } else if (unionInfo.label === '会员类型') {
      Toast.info('请选择会员类别！');
    } else if (!(/^(HR|hr|Hr|hR).{6,18}$/.test(hrCode)) && unionInfo.value === '10') {
      Toast.info('上岗证号必须为HR开头，总长度8-20位！');
    } else if (promotionCode.length === 0) {
      Toast.info('请填写推荐码!');
    } else {
      // 先调获取推荐人信息的接口 然后进行展示
      const promotionCodeParams = {
        promotionCode: this.state.promotionCode,
      };
      // const result = await getAppJSON(Config.PROMOTION_PERSON, promotionCodeParams);
      const result = await getAppJSON('v3/platform/web/member/getPromotionUserInfo.json', promotionCodeParams);
      console.log(result);
      if (result.success) {
        this.setState({ promotionVisible: true, realName: result.data.realName, promotionMobile: result.data.mobile });
      } else {
        Toast.fail(result.message, 2);
      }
    }
  }
  // 确定
  private confirm = async () => {
    try {
      const { users } = dvaStore.getState();
      const { baseAddress, unionInfo, promotionCode, provinceId, cityId, areaName,
        areaId, hrCode,
      } = this.state;
      const { provinceId: autoProvinceId, cityId: autoPcityId, areaId: autoPegionId } = this.props;
      let params = {};
      if (addressFlag === 1) { // 用户自己选择的地址
        params = {
          memberId: users.mid,
          // storeName: '',
          memberType: unionInfo.value,
          promotionCode,
          hrCode,
          provinceId,
          cityId,
          regionId: areaId,
          regionName: baseAddress,
          // address: '',
        };
      } else { // 自动定位的地址
        params = {
          memberId: users.mid,
          // storeName: '',
          memberType: unionInfo.value,
          promotionCode,
          hrCode,
          provinceId: autoProvinceId,
          cityId: autoPcityId,
          regionId: autoPegionId,
          regionName: addressInfo,
          // address: '',
        };
      }
      console.log('参数=====', params);
      const response = await postAppForm(Config.SHOP_STORE, params);
      console.log(response);
      if (response.success) {
        // 存用户信息
        await global.setItem('User', { memberId: response.data.memberId, isLogin: true, isHost: 1, userAcount: this.state.mobile, password: '' });
        this.props.dispatch(createAction('users/saveUsersMsg')({
          memberId: response.data.memberId,
          isLogin: true,
          isHost: 1,
          userAcount: this.state.mobile,
          password: '',
        }));
        global.setItem('roleInfo', '1');
        global.setItem('storeId', response.data.memberId);
        console.log('用户信息==========', dvaStore.getState().users);
        // 统计埋点代码 gio yl
        const userInfo = dvaStore.getState().users;
        const memberId = userInfo.mid || '';
        NativeModules.StatisticsModule.setUserId(memberId.toString());
        NativeModules.StatisticsModule.setPeopleVariable({
          name: userInfo.userName || '',
          mobile: userInfo.mobile || '',
          email: userInfo.email || '',
          gender: userInfo.gender || '',
          birthday: userInfo.birthday || '',
        });
         //baifend 埋点
         NativeModules.BfendModule.onAddUser(memberId.toString(),{
          name: userInfo.userName||'',
          em: userInfo.email||'',
          cp: userInfo.mobile||'',
      });
        // // 更新token
        // await global.setItem('userToken', 'Bearer' + response.data.member.sessionValue);
        // this.props.dispatch(createAction('users/saveUsersMsg')({
        //   userToken: response.data.member.sessionValue,
        // }));
        this.setState({ promotionVisible: false });
        const paramss = this.props.navigation.state.params;
        Toast.success('开店成功', 2, () => this.props.navigation.navigate('OpenStoreSuccess', {
          hiddenSetPassword: IS_NOTNIL(paramss.hiddenSetPassword) ? paramss.hiddenSetPassword : false,
        }));
      }
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
    marginTop: 16,
  },
  topHeader: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButton: {
    width: '91%',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: '#2979FF',
    // elevation: 5,
    // shadowOffset: { width: 0, height: 3 },
    // shadowColor: 'rgba(41,121,255,0.50)',
    // shadowOpacity: 1,
    // shadowRadius: 5,
  },
  canClickloginButton: {
    backgroundColor: '#2979FF',
  },
  unClickLoginButton: {
    backgroundColor: '#75A8FF',
  },
  agreementText: {
    fontSize: 12,
    marginVertical: 2,
    color: '#8f8f8f',
  },
  registerSucs: {
    width: 304,
    height: 277,
    paddingTop: 36,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  promotionPerson: {
    width: 304,
    height: 297,
    paddingTop: 30,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  commonPosition: {
    position: 'absolute',
    right: 16,
    top: 20,
  },
  fontCss: {
    fontSize: 14,
    color: '#999999',
  },
  fontCssActive: {
    fontSize: 14,
    color: '#000000',
  },
  openStoreBox: {
    width: '100%',
    height: 56,
    borderBottomColor: '#e4e4e4',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  openStoreContainer: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  captchaCss: {
    width: 88,
    height: 40,
    resizeMode: 'stretch',
  },
});
export default NewRegister;
