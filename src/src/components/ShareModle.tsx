import * as React from 'react';
import { View, Modal, Dimensions, TouchableOpacity, Image, Text, NativeModules, Clipboard } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { width, sceenHeight } from '../utils';
import { getAppJSON } from '../netWork';
import Config from 'react-native-config';
import {connect} from 'react-redux';
import {Toast} from 'antd-mobile';

const height = sceenHeight;

export interface IShareModleProps {
  visible?: boolean;
  title?: string;
  hidingTitle?: boolean;
  content?: any;
  hiddenEwm?: boolean;
  hiddenCopyLink?: boolean;
  ewmPress?: () => void;
  onCancel?: () => void;
  onSuccess?: (platform) => void;
}

export interface IShareModleState {
  visible: boolean;
}

@connect(({users: {isLogin}}) => ({isLogin}))
export default class ShareModle extends React.PureComponent<IShareModleProps, IShareModleState> {
  constructor(props: IShareModleProps) {
    super(props);
    this.state = {
      visible: props.visible,
    };
  }

  public componentWillReceiveProps(nexpProps) {
    nexpProps.visible !== this.state.visible && this.setState({ visible: nexpProps.visible });
  }

  public componentWillUnmount() {
    Log('ShareModleUnmount');
  }

  public render(): JSX.Element {
    const { title, hiddenEwm, hidingTitle = false, hiddenCopyLink = false } = this.props;
    const iconList = [
      { text: '微信', image: require('../images/im_wx.png')},
      { text: '朋友圈', image: require('../images/im_pyq.png')},
      { text: 'QQ', image: require('../images/im_qq.png')},
      { text: 'QQ空间', image: require('../images/im_qzone.png')},
      { text: '微博', image: require('../images/im_wb.png')},
    ];
    if (!hiddenEwm) {
      iconList.push({ text: '二维码', image: require('../images/im_ewm.png')});
    }
    if (!hiddenCopyLink) {
      iconList.push({ text: '复制链接', image: require('../images/im_copy.png')});
    }
    const iconListView = iconList.map(({ text, image }) => (
      <TouchableOpacity key={`keys${text}`} style={styles.btnContainPress} onPress={() => this.sharePress(text)} >
        <View style={styles.btnContain}>
          <Image source={image} style={styles.btnImage}/>
          <Text style={styles.btnTitle}>{text}</Text>
        </View>
      </TouchableOpacity>
    ));
    return (
      <Modal
        animationType='fade'
        transparent={true}
        visible={this.state.visible}
      >
        <View style={styles.bg}>
          <TouchableOpacity style={styles.hiddenBtn} onPress={() => this.onClose()} />
          <View style={styles.bottomView}>
            { !hidingTitle && <Text style={styles.title}>{title || '您的好友通过分享购买，您将赚到不菲的佣金哦'}</Text> }
            <View style={styles.btnView}>
              {iconListView}
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  private onClose = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    } else {
      this.setState({ visible: false });
    }
  }

  private sharePress = (title) => {
    const { content } = this.props;
    switch (title) {
      case '微信': {
        NativeModules.UmengModule.shareToWechatSession(content)
        .then(result => {
            Log('分享成功', result);
            this.succeedsCallback('微信');
          })
          .catch(e => {
              Toast.info(e.message, 2);
          });
        break;
      }
      case '朋友圈': {
        NativeModules.UmengModule.shareToWechatTimeline(content)
        .then(result => {
            Log('分享成功', result);
            this.succeedsCallback('朋友圈');
          })
          .catch((e) => {
              Toast.info(e.message, 2);
          });
        break;
      }
      case 'QQ': {
        NativeModules.UmengModule.shareToQQ(content)
        .then(result => {
            Log('分享成功', result);
            this.succeedsCallback('QQ');
          })
            .catch(e => {
                Toast.info(e.message, 2);
            });
        break;
      }
      case 'QQ空间': {
        NativeModules.UmengModule.shareToQzone(content)
        .then(result => {
            Log('分享成功', result);
            this.succeedsCallback('QQ空间');
          })
            .catch(e => {
                Toast.info(e.message, 2);
            });
        break;
      }
      case '微博': {
        NativeModules.UmengModule.shareToSina(content)
        .then(result => {
            Log('分享成功', result);
            this.succeedsCallback('微博');
          })
            .catch(e => {
                Toast.info(e.message, 2);
            });
        break;
      }
      case '复制链接': {
        Clipboard.setString(content.length > 4 ? content[3] : '');
        break;
      }
      case '二维码': {
        this.props.ewmPress && this.props.ewmPress();
        break;
      }
      default:
        break;
    }
    if(title === '复制链接'){
      this.onClose();
      Toast.info('复制链接成功!', 1);
    }
  }
  private succeedsCallback = (platform) => {
    this.onClose();
    const { onSuccess } = this.props;
    if (onSuccess) {
      onSuccess(platform);
    } else {
      if (this.props.isLogin) {
          getAppJSON(Config.SHARE_SUCCESS)
              .then(res => {
                  if (res.success) {
                      Log('调用微店主金币接口成功');
                  }
              })
              .catch(err => Log('调用微店主金币接口失败'));
      }
    }
  }
}

const styles = EStyleSheet.create({
  bg: {
    position: 'absolute',
    width,
    height,
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
      zIndex: 3,
      // flexDirection: 'column-reverse',
  },
  hiddenBtn: {
    flex: 1,
    width: '375rem',
  },
  bottomView: {
    backgroundColor: 'white',
    width: '375rem',
    alignItems: 'center',
  },
  title: {
    margin: 8,
    color: '$darkblue',
    fontSize: '$fontSize1',
  },
  btnView: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: '375rem',
    // height: '100rem',
  },
  btnContainPress: {
    width: '93.75rem',
    height: '100rem',
    padding: 8,
  },
  btnContain: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnImage: {
    width: '50rem',
    height: '50rem',
    marginBottom: 8,
  },
  btnTitle: {
    fontSize: '$fontSize2',
    color: '$black',
  },
});
