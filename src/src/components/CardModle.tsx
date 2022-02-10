import * as React from 'react';
import { View, PixelRatio , Modal, UIManager, CameraRoll, Alert, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Image, Text , TextInput, NativeModules, Clipboard, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { width, sceenHeight } from '../utils';
import { Toast } from 'antd-mobile';
import URL from './../config/url';
import { GET, POST_JSON, GET_P, POST_FORM} from '../config/Http';
import {postAppJSON, getAppJSON, getJSONP, postForm} from '../netWork';
import ShareModle from '../components/ShareModle';
import { captureRef } from 'react-native-view-shot';
import Config from 'react-native-config';

const height = sceenHeight;

export interface ICaseModleProps {
  visible?: boolean;
  onCancel?: () => void;
  onShare?: () => void;
}

export interface ICaseModleState {
  visible: boolean;
  data: any;
  isOk: boolean;
  mshowShareModal: boolean;
}

export default class CardModle extends React.PureComponent<ICaseModleProps, ICaseModleState> {
  constructor(props: ICaseModleProps) {
    super(props);
    this.state = {
      visible: props.visible,
      data: {},
      isOk: false,
      mshowShareModal: false,
    };
  }

  public componentDidMount() {
    this.goData();
}

  public componentWillReceiveProps(nexpProps) {
    nexpProps.visible !== this.state.visible && this.setState({ visible: nexpProps.visible });
  }

  public render(): JSX.Element {
    return (
      <Modal
        animationType='fade'
        transparent={true}
        visible={this.state.visible}
      >
      <View style={styles.bg}>
      {this.state.isOk ?
      <View style={styles.centerView}>
      <View ref='full' style={[styles.centerView]}>
        {/* 第一行view */}
        <View style={{width: width - 70, height: mHeight * 0.16 , alignItems: 'center' , justifyContent: 'center', marginBottom: mHeight * 0.048 ,
         backgroundColor: '#2979FF' , borderTopLeftRadius: 5 , borderTopRightRadius : 5}}>
          <Text style={{fontSize: 20 , color: 'white' }} >海尔官方社群交互平台</Text>
          {/* <Image
            style={{ width: 60, height: 60, borderRadius: 30}}
            source={{uri: this.state.data.m}}/>
          <View
          style={{paddingLeft: 16, flexDirection: 'column' , flex: 1}}>
            <Text style={{fontSize: 18 , color: '#333333' }}  numberOfLines={1}
            ellipsizeMode='tail'>{this.state.data.n}</Text>
            <View style={{flexDirection: 'row' , alignItems: 'center' }}>
            <Image
            style={{ width: 12, height: 12 , resizeMode: 'contain'}}
            source={require('../images/ic_hhr_gfrz.png')}/>
            <Text style={{fontSize: 12 , color: '#2979FF' , paddingLeft: 6}}>官方认证</Text>
            </View>
            <Text style={{fontSize: 12 , color: '#666666'}}>推广码：{this.state.data.p}</Text>
          </View> */}
        </View>
        {/* 二维码view */}
        <View style={{width: width - 70, height: mHeight * 0.5, alignItems: 'center' , justifyContent: 'center'}}>
        <Image
            style={{ width: mHeight * 0.4, height: mHeight * 0.4}}
            source={{uri: this.state.data.u}}/>
        <Image
            style={{ width: 20, height: 20 , resizeMode: 'contain' , position: 'absolute', left: mRwidth, top: mTheight}}
            source={require('../images/ic_hhr_brais1.png')}/>
        <Image
            style={{ width: 20, height: 20 , resizeMode: 'contain' , position: 'absolute', right: mRwidth, top: mTheight}}
            source={require('../images/ic_hhr_brais2.png')}/>
        <Image
            style={{ width: 20, height: 20 , resizeMode: 'contain' , position: 'absolute', left: mRwidth, bottom: mTheight}}
            source={require('../images/ic_hhr_brais3.png')}/>
        <Image
            style={{ width: 20, height: 20 , resizeMode: 'contain' , position: 'absolute', right: mRwidth, bottom: mTheight}}
            source={require('../images/ic_hhr_brais4.png')}/>
        </View>
        {this.state.data.i ?
         <Text style={{width: width - 70 , fontSize: 13 , color: '#333333 ' , textAlign: 'center'}}>{this.state.data.n} ({this.state.data.i})</Text> :
         <Text style={{width: width - 70 , fontSize: 13 , color: '#333333 ' , textAlign: 'center'}}>{this.state.data.n}</Text>
        }
        <Text style={{width: width - 70 , fontSize: 16 , color: '#2979FF' , textAlign: 'center' , marginTop:  mHeight * 0.05}}>扫一扫和我一起创业</Text>
        <View style={{flex: 1}}/>
      </View>
      <View style={{width: width - 70, flexDirection: 'row', justifyContent: 'space-around' , position: 'absolute' , bottom: mHeight * 0.03}}>
        <TouchableOpacity
         style={{
          width: 110, height: 40,
          justifyContent: 'center', alignItems: 'center',
          borderRadius: 20, borderColor: '#2979FF', borderWidth: 1,
         }}
         onPress={() => { this.snapshot(); }
         } >
         <Text style={{fontSize: 16, color: '#2979FF'}}>保存二维码</Text>
        </TouchableOpacity>
        <TouchableOpacity
         style={{
          width: 110, height: 40,
          justifyContent: 'center', alignItems: 'center',
          borderRadius: 20, borderColor: '#FF6026', borderWidth: 1,
         }}
         onPress={() =>
          // this.onShare()
          this.setState({mshowShareModal: true})
          } >
         <Text style={{fontSize: 16, color: '#FF6026'}}>分享给好友</Text>
        </TouchableOpacity>
      </View>
      </View> :
      <View style={[styles.centerView, { alignItems: 'center',
      justifyContent: 'center' , height: width}]}>
        <Text style={{fontSize: 14, color: '#333333' , paddingBottom: 24}}>抱歉，二维码加载失败</Text>
        <TouchableOpacity
         style={{
          width: 100, height: 40,
          justifyContent: 'center', alignItems: 'center',
          borderRadius: 20 , backgroundColor: '#999999 ',
         }}
         onPress={() => { this.goData(); }
         } >
         <Text style={{fontSize: 17, color: '#2979FF'}}>刷新</Text>
        </TouchableOpacity>
      </View>
     }
      <TouchableOpacity
         onPress={() =>
          this.onClose()
         } >
      <Image
          style={{ width: 40, height: 40, borderRadius: 20, borderColor: 'white', borderWidth: 1 , marginTop: 20}}
          source={require('../images/closeBtnWhite.png')}/>
      </TouchableOpacity>
      <ShareModle
          visible={this.state.mshowShareModal} content={this.mresolveSharingCommand()}
          onCancel={() => this.setState({ mshowShareModal: false })}
          hiddenEwm={true}
          hidingTitle={true}
          onSuccess={() => this.mshareSucceeded()}
        />
    </View>
      </Modal>
    );
  }

  private mshareSucceeded = () => {
    const successBaseUrl = Config.SHARE_SUCCESS;
    const paramArray = [];
    const command = this.mresolveSharingCommand();

    for (const key of command) {
      paramArray.push(key + '=' + command[key]);
    }

    getAppJSON(`${successBaseUrl}?${paramArray.join('&')}`)
      .then(res => {
        if (res.success) {
          Log('调用微店主金币接口成功');
        }
      })
      .catch(err => Log('调用微店主金币接口失败'));
  }

  private mresolveSharingCommand = (): any[] => {
    const title = '亲,送你一个360元+礼包,点这里免费领取哦!'; // 分享标题
    const content = '海尔官方平台，海量正品，来顺逛一起瓜分亿元佣金吧！'; // 分享内容
    const pic = this.state.data.m; // 分享图片，写绝对路径
    const url = `${URL.GET_REGISTER_SHARE_URL}${this.state.data.p}`;

    return [ title, content, pic, url, 0 ];
  }

  private snapshot = () => {
      captureRef(this.refs.full, {
        width: 600 / PixelRatio.get(),
        height: 900 / PixelRatio.get(),
        format: 'png',
        quality: 1,
      })
      .then(
        uri => this.saveImg(uri),
        error => this.alertShow('保存失败'),
      );
   }
   private alertShow = (msg) => {
    Alert.alert(
      '',
      msg,
      [
          { text: '确定', onPress: () =>  Log('确定 Pressed')},
      ],
    );
   }

   private saveImg = (uri) => {
       if (Platform.OS === 'android') {
        NativeModules.ToolsModule.Permission(
          [
              'android.permission.WRITE_EXTERNAL_STORAGE']
          , '存储')
        .then((contact) => {
          const promise = CameraRoll.saveToCameraRoll(uri, 'photo');
          promise
              .then((result) => {
                this.alertShow('保存成功');
              })
              .catch((error) => {
                this.alertShow('保存失败');
              });
        })
        .catch((errorCode, domain, error) => {
          this.alertShow('保存失败');
        });
       } else {
        const promise = CameraRoll.saveToCameraRoll(uri, 'photo');
        promise
            .then((result) => {
              this.alertShow('保存成功');
            })
            .catch((error) => {
              this.alertShow('保存失败');
            });
       }
   }

   private goData = async () => {
      const json = await GET(URL.MINE_PROMOTION, null);
      if (json.success) {
        if (IS_NOTNIL(json.data)) {
          this.setState({
            data: json.data,
            isOk: true,
          });
        }
      } else {
        this.setState({
          isOk: false,
        });
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

  private onShare = () => {
    if (this.props.onShare) {
      this.props.onShare();
    }
  }
}

const mHeight = (width - 70) * 1.5;
const mRwidth = (width - 70 - mHeight * 0.4) / 2 - 10;
const mTheight = (mHeight * 0.1) / 2 - 10;

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
    width: width - 70,
    height:  mHeight,
    borderRadius: 5,
  },
});
