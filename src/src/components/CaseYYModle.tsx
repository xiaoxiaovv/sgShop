import * as React from 'react';
import { View, Modal, Alert, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Image, Text, Keyboard, ScrollView, TextInput, NativeModules, Clipboard, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { width, sceenHeight } from '../utils';
import { Toast } from 'antd-mobile';
import Address from './Address';
import ScreenUtil from './../containers/Home/SGScreenUtil';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import URL from './../config/url';
import { GET, POST_JSON, GET_P, POST_FORM} from '../config/Http';
import {postAppJSON, getAppJSON, getJSONP, postForm} from '../netWork';
const height = sceenHeight;

export interface ICaseModleProps {
  visible?: boolean;
  title?: string;
  content?: any;
  designerId?: number;
  detailsId?: number;
  itemsId?: number;
  ewmPress?: () => void;
  onCancel?: () => void;
  onSuccess?: () => void;
  provinceId?: number;
  cityId?: number;
  areaId?: number;
  streetId?: number;
  provinceName?: string;
  cityName?: string;
  areaName?: string;
  streetName?: string;
}

export interface ICaseModleState {
  visible: boolean;
  name: string;
  phone: string;
  address: string;
  show: boolean;
  keyboardShow: boolean;
}

const mapStateToProps = ({ address: {provinceId, cityId, areaId, streetId, provinceName, cityName, areaName, streetName}}) => ({
  provinceId,
  cityId,
  areaId,
  streetId,
  provinceName,
  cityName,
  areaName,
  streetName,
});

@connect(mapStateToProps)
export default class CaseYYModle extends React.PureComponent<ICaseModleProps, ICaseModleState> {
  constructor(props: ICaseModleProps) {
    super(props);
    this.state = {
      visible: props.visible,
      name: '',
      phone: '',
      address: '',
      show: false,
      keyboardShow: false,
    };
  }

 public componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

 public componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  public _keyboardDidShow() {
  }

  public _keyboardDidHide() {
  }

  public componentWillReceiveProps(nexpProps) {
    nexpProps.visible !== this.state.visible && this.setState({ visible: nexpProps.visible });
  }

  public render(): JSX.Element {
    const position = this.props.provinceName + ' ' + this.props.cityName + ' ' + this.props.areaName;
    return (
        this.state.visible ? <View style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}
      >
          <TouchableWithoutFeedback style={{flex: 1}} onPress={ () => {
              this.lostBlur(); }}>
        <View style={styles.bg}>
          <View style={styles.centerView}>
              <ScrollView keyboardDismissMode={'on-drag'} keyboardShouldPersistTaps={'handled'}>
              <Text style={{width: width - 80, fontSize: 16, color: '#333', textAlign: 'center', paddingTop: 11}} numberOfLines={1}
              onPress={ () => {
                this.lostBlur();
              }}>预约免费设计</Text>
              <TouchableOpacity  style={{position: 'absolute', right: 8, marginTop: 11}} onPress={ () => {
                              this.onClose();
                          }}>
              <Image style={{height: 25, width: 25}} source={require('../images/code_btn.png')}
              resizeMode={'contain'}/>
              </TouchableOpacity>
              <View style={styles.textInputView}>
              <Text style={{fontSize: 14, color: '#333'}}>您的姓名</Text>
              <TextInput style={styles.textInput} numberOfLines={1} placeholder={'请输入您的姓名'} underlineColorAndroid='transparent'
              maxLength={10} blurOnSubmit autoFocus onChangeText={(text) => this.setState({ name: text })}/>
              </View>
              <View style={styles.textInputView}>
              <Text style={{fontSize: 14, color: '#333'}}>手机号码</Text>
              <TextInput style={styles.textInput} numberOfLines={1} placeholder={'请输入手机号码'} underlineColorAndroid='transparent'
              maxLength={11} keyboardType={'numeric'} blurOnSubmit onChangeText={(text) => this.setState({ phone: text })}/>
              </View>
              <TouchableOpacity onPress={ () => {
                              this.setState({ show: true });
                          }}>
              <View style={[{width: width - 80, paddingTop: 10, flexDirection: 'row', alignItems: 'center' }]}>
              <Image style={{height: 30, width: 30 }} source={require('../images/address.png')}
              resizeMode={'contain'}/>
              <Text style={{flex: 1, fontSize: 14, color: '#000', paddingLeft: 5}}>当前位置 ({position})</Text>
                <Image style={{height: 25, width: 25}} source={require('../images/arrowdown.png')}
              resizeMode={'contain'}/>
              </View>
              </TouchableOpacity>
              <TouchableOpacity   onPress={ () => {
                              this.goSubData();
                          }}>
              <View style={{width: width - 100, height: 44, backgroundColor: '#2979FF', alignItems: 'center', justifyContent: 'center',
               borderRadius: 22, marginTop: 20 , marginLeft: 10}}>
              <Text style={{fontSize: 17, color: '#fff'}}>立即预约</Text>
              </View>
              </TouchableOpacity>
              </ScrollView>
          </View>
          <TouchableWithoutFeedback style={{width, flex: 1 }} onPress={ () => {
            this.lostBlur();
          }}><View/></TouchableWithoutFeedback>
          {/* 地址栏modal视图 */}
        <Modal
          // 设置Modal组件的呈现方式
          animationType='slide'
          // 它决定 Modal 组件是否是透明的
          transparent
          // 它决定 Modal 组件何时显示、何时隐藏
          visible={this.state.show}
          // 当 Modal组件在屏幕上完成显示后，这个回调函数将被执行
          onShow={() => Log('onShow')}
          // 这是 Android 平台独有的回调函数类型的属性
          // 开发者必须要写一个函数来处理当 Modal 显示在界面时且android物理返回键被按下时的业务逻辑
          onRequestClose={() => Log('onShow')}
        >
          <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
            <TouchableOpacity
              style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: height - 400,
              }}
              activeOpacity={1} onPress={() => this.dismissView()}>
              <View style={{
                position: 'absolute', top: 0, left: 0, width: '100%',
                height: height - 400,
              }}></View>
            </TouchableOpacity>
            <Address
              hasHeader={true}
              onclick={() => this.setState({ show: false })}
              onSelect={(location: string) => this.setState({ show: false, address: location })}
            />
          </View>
        </Modal>
        </View>

          </TouchableWithoutFeedback>

      </View> : null
    );
  }

  public dismissView() {
    this.setState({
      show: false,
    });
  }

  public lostBlur() {
    // 退出软件盘
      console.log('---lostBlur---');
    try {
      Keyboard.dismiss();
    } catch (error) {
      console.log(error);
    }
  }

  public goSubData = async () => {
      if (!this.state.name || this.state.name.length === 0) {
        // alert('请输入您的姓名');
          Alert.alert(
              '温馨提示:',
              '请输入您的姓名',
              [
                  { text: '确定', onPress: () =>  Log('确定 Pressed')},
              ],
          );
          return ;
      } else if (!this.state.phone || this.state.phone.length === 0) {
        // alert('请输入手机号码');
          Alert.alert(
              '温馨提示:',
              '请输入手机号码',
              [
                  { text: '确定', onPress: () =>  Log('确定 Pressed')},
              ],
          );
          return ;
      } else if (!global.mobileNumberRegExp.test(this.state.phone)) {
        // alert('请输入正确的手机号格式');
          Alert.alert(
              '温馨提示:',
              '请输入正确的手机号格式',
              [
                  { text: '确定', onPress: () =>  Log('确定 Pressed')},
              ],
          );
          return ;
      } else if (this.props.provinceName.length === 0) {
        // alert('请选择地址');
          Alert.alert(
              '温馨提示:',
              '请选择地址',
              [
                  { text: '确定', onPress: () =>  Log('确定 Pressed')},
              ],
          );
          return ;
      }

      // const json = await postForm('sg/cms/home/design.json', {
      const json = await POST_FORM(URL.DIY_DESIGN, null, {
        channel: 1,
        provinceId: this.props.provinceId,
        cityName: this.props.cityName,
        cityId: this.props.cityId,
        regionId: this.props.areaId,
        name: this.state.name,
        mobile: this.state.phone,
        designerId: this.props.designerId,
        detailsId: this.props.detailsId,
        itemsId: this.props.itemsId,
      });
      if (json.success) {
          Toast.success('预约成功' , 2);
          this.setState({ name: '' , phone: '' });
          // alert('预约成功');
          this.onClose();
          const { onSuccess } = this.props;
          onSuccess();
      } else {
          Toast.fail(json.message, 2);
      }
  }

  private onClose = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    } else {
      this.setState({ visible: false });
    }
  }
}
const styles = EStyleSheet.create({
  bg: {
    width,
    height,
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerView: {
    backgroundColor: 'white',
    width: width - 50,
    borderRadius: 5,
    paddingLeft: 15,
    paddingBottom: 20,
  },
  textInputView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width - 80,
    paddingTop: Platform.OS === 'ios' ? 20 : 5,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    paddingLeft: 13,
  },
});
