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
              }}>??????????????????</Text>
              <TouchableOpacity  style={{position: 'absolute', right: 8, marginTop: 11}} onPress={ () => {
                              this.onClose();
                          }}>
              <Image style={{height: 25, width: 25}} source={require('../images/code_btn.png')}
              resizeMode={'contain'}/>
              </TouchableOpacity>
              <View style={styles.textInputView}>
              <Text style={{fontSize: 14, color: '#333'}}>????????????</Text>
              <TextInput style={styles.textInput} numberOfLines={1} placeholder={'?????????????????????'} underlineColorAndroid='transparent'
              maxLength={10} blurOnSubmit autoFocus onChangeText={(text) => this.setState({ name: text })}/>
              </View>
              <View style={styles.textInputView}>
              <Text style={{fontSize: 14, color: '#333'}}>????????????</Text>
              <TextInput style={styles.textInput} numberOfLines={1} placeholder={'?????????????????????'} underlineColorAndroid='transparent'
              maxLength={11} keyboardType={'numeric'} blurOnSubmit onChangeText={(text) => this.setState({ phone: text })}/>
              </View>
              <TouchableOpacity onPress={ () => {
                              this.setState({ show: true });
                          }}>
              <View style={[{width: width - 80, paddingTop: 10, flexDirection: 'row', alignItems: 'center' }]}>
              <Image style={{height: 30, width: 30 }} source={require('../images/address.png')}
              resizeMode={'contain'}/>
              <Text style={{flex: 1, fontSize: 14, color: '#000', paddingLeft: 5}}>???????????? ({position})</Text>
                <Image style={{height: 25, width: 25}} source={require('../images/arrowdown.png')}
              resizeMode={'contain'}/>
              </View>
              </TouchableOpacity>
              <TouchableOpacity   onPress={ () => {
                              this.goSubData();
                          }}>
              <View style={{width: width - 100, height: 44, backgroundColor: '#2979FF', alignItems: 'center', justifyContent: 'center',
               borderRadius: 22, marginTop: 20 , marginLeft: 10}}>
              <Text style={{fontSize: 17, color: '#fff'}}>????????????</Text>
              </View>
              </TouchableOpacity>
              </ScrollView>
          </View>
          <TouchableWithoutFeedback style={{width, flex: 1 }} onPress={ () => {
            this.lostBlur();
          }}><View/></TouchableWithoutFeedback>
          {/* ?????????modal?????? */}
        <Modal
          // ??????Modal?????????????????????
          animationType='slide'
          // ????????? Modal ????????????????????????
          transparent
          // ????????? Modal ?????????????????????????????????
          visible={this.state.show}
          // ??? Modal??????????????????????????????????????????????????????????????????
          onShow={() => Log('onShow')}
          // ?????? Android ??????????????????????????????????????????
          // ????????????????????????????????????????????? Modal ?????????????????????android??????????????????????????????????????????
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
    // ???????????????
      console.log('---lostBlur---');
    try {
      Keyboard.dismiss();
    } catch (error) {
      console.log(error);
    }
  }

  public goSubData = async () => {
      if (!this.state.name || this.state.name.length === 0) {
        // alert('?????????????????????');
          Alert.alert(
              '????????????:',
              '?????????????????????',
              [
                  { text: '??????', onPress: () =>  Log('?????? Pressed')},
              ],
          );
          return ;
      } else if (!this.state.phone || this.state.phone.length === 0) {
        // alert('?????????????????????');
          Alert.alert(
              '????????????:',
              '?????????????????????',
              [
                  { text: '??????', onPress: () =>  Log('?????? Pressed')},
              ],
          );
          return ;
      } else if (!global.mobileNumberRegExp.test(this.state.phone)) {
        // alert('?????????????????????????????????');
          Alert.alert(
              '????????????:',
              '?????????????????????????????????',
              [
                  { text: '??????', onPress: () =>  Log('?????? Pressed')},
              ],
          );
          return ;
      } else if (this.props.provinceName.length === 0) {
        // alert('???????????????');
          Alert.alert(
              '????????????:',
              '???????????????',
              [
                  { text: '??????', onPress: () =>  Log('?????? Pressed')},
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
          Toast.success('????????????' , 2);
          this.setState({ name: '' , phone: '' });
          // alert('????????????');
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
