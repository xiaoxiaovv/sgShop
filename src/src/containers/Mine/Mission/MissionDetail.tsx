import * as React from 'react';
import { Tabs, Toast } from 'antd-mobile';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Modal,
  TouchableOpacity,
  TextInput,
  Clipboard,
  Keyboard,
  DeviceEventEmitter,
} from 'react-native';
import { getAppJSON } from '../../../netWork';
import { connect, createAction } from '../../../utils';
import { ICustomContain } from '../../../interface';
import EStyleSheet from 'react-native-extended-stylesheet';
import Config from 'react-native-config';
import Moment from 'moment';
import ShareModal from '../../../components/ShareModle';
import Button from 'rn-custom-btn1';
import {Font, Color} from 'consts';


import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

interface IMissionDetail {
  showShare: boolean;
  taskId: number;
  name: string;
  missionTitle: string;
  isFinished: boolean;
  showPasteHint: boolean;
  taskType: string;
  UserTaskStatus: any;
  taskAwards: any;
  taskAwardsContent: string;
  missionContent: any;
  configDataStr: string;
  configData: any;
  missionTitleArr: any;
  imgArr: any;
  shareContent: any;
}

class MissionDetail extends React.Component<ICustomContain> {
  private static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      headerStyle: { justifyContent: 'center' },
      headerTitleStyle: {fontSize: 18, flex: 1, textAlign: 'center', alignSelf: 'center'},
      headerBackTitle: null,
      title: '任务详情',
      headerRight: params.headerRight ? params.headerRight : <View></View>,
      headerLeft: (<Button
        style={{ width: 25, height: 25}}
        imageStyle={{ width: 25, height: 25, resizeMode: 'contain' }}
        image={require('../../../images/left.png')}
        onPress= { params.handleGoBack ? () => params.handleGoBack() : () => { navigation.goBack(); }}
    />),
    };
  }
  public state: IMissionDetail;
  constructor(props) {
    super(props);
    this.state = {
      showShare: false,
      taskId: 0,
      name: '',
      missionTitle: '',
      isFinished: false,
      showPasteHint: true,
      taskType: '',
      UserTaskStatus: undefined,
      taskAwardsContent: '',
      missionContent: null,
      configDataStr: '',
      configData: {},
      missionTitleArr: [],
      imgArr: [],
      shareContent: [],
      taskAwards: {},
    };
  }
  public componentWillMount() {
    this.setState({ taskId: this.props.navigation.state.params.taskId }, () => {
      this.getMissionDetail(this.state.taskId);
    });
  }
  public componentDidMount() {
    if (this.props.navigation.state.params.taskType !== '5') {
      this.props.navigation.setParams({
        headerRight: this.shareBtn(),
      });
    }
  }
  public render(): JSX.Element {
    return (
        <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}}  keyboardShouldPersistTaps="always" keyboardDismissMode="on-drag">
      <TouchableWithoutFeedback style={styles.container} onPress={ () => {
        this.lostBlur(); }}>
      <View style={styles.container}>
        <View style={styles.topBox}>
          <Text style={styles.missionTitle}>{this.state.missionTitle}</Text>
          {(this.state.taskType !== '5') && <Text style={styles.shareStatus}>分享成功+{this.state.taskAwardsContent}</Text>}
          {(this.state.isFinished && this.state.taskType !== '5') && <Text style={styles.shareStatus}>已完成</Text>}
          {(!this.state.isFinished && this.state.taskType !== '5') && <Text style={styles.shareStatus}>未完成</Text>}

          {(!this.state.isFinished && this.state.taskType === '5' && this.state.UserTaskStatus === undefined) && <Text style={styles.shareStatus}>胜利+{this.state.taskAwardsContent}</Text>}
          {(!this.state.isFinished && this.state.taskType === '5' && this.state.UserTaskStatus === undefined) && <Text style={styles.shareStatus}>未接招</Text>}

          {(!this.state.isFinished && this.state.taskType === '5' && this.state.UserTaskStatus === 0) && <Text style={styles.shareStatus}>胜利+{this.state.taskAwardsContent}</Text>}
          {(!this.state.isFinished && this.state.taskType === '5' && this.state.UserTaskStatus === 0) && <Text style={styles.shareStatus}>开战</Text>}

          {(this.state.isFinished && this.state.taskType === '5' && this.state.UserTaskStatus === 20) && <Text style={styles.shareStatus}>胜利+{this.state.taskAwardsContent}</Text>}
          {(this.state.isFinished && this.state.taskType === '5' && this.state.UserTaskStatus === 20) && <Text style={styles.shareStatus}>胜利</Text>}
          <Text style={styles.curTime}>{Moment().format('YYYY-MM-DD')}</Text>
        </View>
        <View style={styles.middleBox}>
          <View style={styles.contentTitle}>
            <Text style={styles.contentTitleItem} numberOfLines={1}>{this.state.name}</Text>
          </View>
          <View>
            <TextInput
              multiline={true}
              underlineColorAndroid='transparent'
              style={styles.multillineInput}
              value={this.state.editContent}
              onChangeText={(text) => { this.setState({ editContent: text }); }} />
          </View>
        </View>
        {/* 分享链接 */}
        {this.state.taskType === '4' &&
          <View style={styles.bottomBox}>
            <View style={styles.taskTitle}>
              <Text style={styles.taskTitleItem}>分享链接:</Text>
            </View>
            <View style={styles.copyLink}>
              <Text  numberOfLines={1} style={styles.copyLinkItem}>{this.state.linkUrl}</Text>
              <TouchableOpacity style={styles.copyLinkButton} onPress={() => { this.copyLink(); }}>
                <Text style={styles.copyLinkButtonItem}>复制链接</Text>
              </TouchableOpacity>
            </View>
            <View style={{ paddingBottom: 11 }}>
              <Image resizeMode={'cover'} source={{ uri: this.state.imgArr[0] }} style={styles.image} />
            </View>
          </View>
        }
        {/* 分享商品 图片 */}
        {this.state.taskType === '3' &&
          <View style={styles.bottomBox}>
            <View style={[styles.taskTitle, { marginBottom: 11 }]}>
              <Text style={styles.taskTitleItem}>分享商品:{this.state.productName}</Text>
            </View>
            <View style={{ paddingBottom: 11 }}>
              <Image resizeMode={'cover'} source={{ uri: this.state.imgArr[0] }} style={styles.image} />
            </View>
          </View>
        }
        {/* 分享任务图片 */}
        {(this.state.taskType === '1' || this.state.taskType === '2' || this.state.taskType === '6') &&
          <View style={styles.bottomBox}>
            <View style={[styles.taskTitle, { marginBottom: 11 }]}>
              <Text style={styles.taskTitleItem}>任务图片:</Text>
            </View>
            <View style={{ paddingBottom: 11 }}>
              <Image resizeMode={'cover'} source={{ uri: this.state.imgArr[0] }} style={styles.image} />
            </View>
          </View>
        }
        <ShareModal
          visible={this.state.showShare}
          onCancel={() => this.setState({ showShare: false })}
          content={this.state.shareContent}
          onSuccess={(platform) => {this.shareSuccessCallback(platform); }}
          hiddenCopyLink={true}
          hiddenEwm={true} />
      </View>
      </TouchableWithoutFeedback>
          <View style={{ marginBottom: 70}}/>
        </ScrollView>
            {this.state.taskType !== '5' && <TouchableOpacity style={styles.shareButton} onPress={() => { this.showShareModal(); }}>
                <Text style={{ fontSize: 16, color: '#ffffff' }}>分享</Text>
            </TouchableOpacity>}
        </View>
    );
  }
  public shareBtn = () => {
    return (
      <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', width: 30, height: 30 }} onPress={() => { this.showShareModal(); }}>
        <Image style={{ width: 24, height: 24, marginRight: 10 }} source={require('../../../images/share.png')} />
      </TouchableOpacity>
    );
  }
  public getQrCodeUrl = async (reqUrl) => {
    const params = {
      requestUrl: reqUrl,
    };
    const response = await getAppJSON(Config.GET_QRCODE, params);
    return response.data;
  }
  public getMissionDetail = async (id) => {
    const params = {
      taskId: id,
    };
    const response = await getAppJSON('v3/mstore/sg/task/findTaskDetail.html', params);
    if (response.success) {
      let tac = ''; // 奖励
      const missionTitleArr = ['', '早安', '晚安', '分享商品', '分享链接', '士兵突击', '图片分享', '晒战绩'];
      if (response.data.taskInfoWithStatusVO.taskAwards[0].awardType === 0) {
        tac = response.data.taskInfoWithStatusVO.taskAwards[0].awardNum + '金币';
      } else if (response.data.taskInfoWithStatusVO.taskAwards[0].awardType === 1) {
        tac = response.data.taskInfoWithStatusVO.taskAwards[0].awardNum + '积分';
      }
      this.setState({
        UserTaskStatus: response.data.taskInfoWithStatusVO.userTaskStatus,
        needTake: response.data.taskInfoWithStatusVO.needTake,
        missionContent: response.data,
        xyzTaskDestId: response.data.taskDestWithStatusVOs[0].id,
        name: response.data.taskInfoWithStatusVO.name,
        taskType: response.data.taskInfoWithStatusVO.taskType,
        isFinished: response.data.taskInfoWithStatusVO.isFinished,
        configDataStr: response.data.taskInfoWithStatusVO.configData,
        configData: JSON.parse(response.data.taskInfoWithStatusVO.configData),
        missionTitleArr: ['', '早安', '晚安', '分享商品', '分享链接', '士兵突击', '图片分享', '晒战绩'],
        missionTitle: missionTitleArr[response.data.taskInfoWithStatusVO.taskType],
        time: new Date(),
        editContent: response.data.taskInfoWithStatusVO.content,
        taskAwardsContent: tac,
      });

      if (JSON.parse(response.data.taskInfoWithStatusVO.configData).imageUrls) {
        this.setState({ imgArr: JSON.parse(response.data.taskInfoWithStatusVO.configData).imageUrls });
      }
      if (JSON.parse(response.data.taskInfoWithStatusVO.configData).productName) { // 如果是分享商品
        this.setState({ productName: JSON.parse(response.data.taskInfoWithStatusVO.configData).productName }); // 分享商品的名称
      }
      if (JSON.parse(response.data.taskInfoWithStatusVO.configData).linkUrl) { // 如是分享链接
        this.setState({ linkUrl: JSON.parse(response.data.taskInfoWithStatusVO.configData).linkUrl }); // 分享链接的名称
      }
    } else {
      Toast.info('发生未知错误');
    }
  }
  public copyLink = () => {
    Clipboard.setString(this.state.linkUrl);
    Toast.success('复制成功', 1);
  }
  public showShareModal = async () => {
    if (this.state.taskType === '7') {
      this.props.navigation.navigate('CustomWebView', { customurl: `${URL.H5_HOST}competition/${this.state.xyzTaskDestId}/${this.state.taskType}/`, flag: true, headerTitle: '会员竞争力' });
    } else {
      if (this.state.showPasteHint) {
        Toast.info('请直接粘贴分享文字内容', 1);
        this.setState({showPasteHint: false});
      }
      Clipboard.setString(this.state.editContent);
      let qrUrl = null;
      let requestUrl = '';
      const memberId = dvaStore.getState().users.mid;
      if (this.state.configData.qrcodeType === '1' || this.state.configData.qrcodeType === undefined) { // 店铺二维码
        qrUrl = this.state.missionContent.resultMap.qrCode;
      } else if (this.state.configData.qrcodeType === '2') { // 商品二维码
        requestUrl = `${URL.H5_HOST}productDetail/${this.state.configData.productId}/${this.state.configData.o2oType}/${this.state.configData.fromType}/${memberId}/${memberId}`;
        qrUrl = await this.getQrCodeUrl(escape(requestUrl));
      } else if (this.state.configData.qrcodeType === '3') { // 招募合伙人二维码
        requestUrl = `${URL.H5_HOST}register/0/${this.state.missionContent.resultMap.promotionCode}`;
        qrUrl = await this.getQrCodeUrl(escape(requestUrl));
      }
      this.shareToPlatform(qrUrl);
    }
  }
  public shareToPlatform = (qrUrl) => {
    // 目前任务目标不存在多个的情况，因此只取得第一个任务目标回传
    const memberId = dvaStore.getState().users.mid;
    const name = this.state.name;
    const editContent = this.state.editContent;
    let checkImgUrl = (this.state.imgArr && this.state.imgArr.length > 0) ? this.state.imgArr[0] : null;
    if (this.state.taskType === '4') { // 链接分享
      const url = this.state.configData.linkUrl;
      if (checkImgUrl === null) {
        checkImgUrl = 'http://www.ehaier.com/mstatic/wd/v2/img/icons/ic_default_avatar.png';
      }
      this.setState({shareContent: [name, editContent, checkImgUrl, url, 0, qrUrl]}, () => {this.setStateCallBack(); });
    } else if (this.state.taskType === '3') { // 分享商品
      const shareTitle = this.state.configData.productTitle || this.state.configData.productName;
      const shareUrl = `${URL.H5_HOST}productDetail/${this.state.configData.productId}/${this.state.configData.o2oType}/${this.state.configData.fromType}/${memberId}/${memberId}`;
      this.setState({shareContent: [this.state.configData.productName, shareTitle, checkImgUrl, shareUrl, 0, qrUrl]}, () => {this.setStateCallBack(); });
    } else { // 单图分享
      this.setState({shareContent: [name, editContent, checkImgUrl, null, 2, qrUrl]}, () => {this.setStateCallBack(); });
    }
  }
  public setStateCallBack = () => {
    this.setState({showShare: true});
    console.log(this.state.shareContent);
  }
  public shareSuccessCallback = async (platform) => {
        const shareTaskDestId = this.state.missionContent.taskDestWithStatusVOs[0].id;
        const params = {
            taskType: this.state.taskType,
            taskDestId: shareTaskDestId,
            sharePlatform: platform,
        };
        let data = await getAppJSON(Config.MISSION_SHARE, params);
        if(data.success){
            setTimeout(()=>{
                DeviceEventEmitter.emit('missionShareSuccess');
            }, 100);
            this.props.navigation.goBack();
        }else{
            Toast.fail('由于网络原因分享失败,请重试!', 2);
            // 文案有王海龙提供确认
        }
    }

  public lostBlur() {
    // 退出软件盘
    try {
       Keyboard.dismiss();
    } catch (error) {
      console.log(error);
    }
  }
}

const styles = EStyleSheet.create({
  container: {
    width: deviceWidth,
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  topBox: {
    height: 40,
    backgroundColor: '#ffffff',
    paddingLeft: 12,
    paddingRight: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  missionTitle: {
    fontSize: Font.LARGE_3,
    color: Color.BLACK_1,
  },
  shareStatus: {
    fontSize: Font.NORMAL_1,
    color: Color.ORANGE_1,
  },
  curTime: {
    fontSize: Font.SMALL_1,
    color: Color.GREY_2,
  },
  contentTitle: {
    fontSize: Font.LARGE_3,
    color: Color.BLACK_1,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: Color.GREY_4,
    height: 40,
  },
  contentTitleItem: {
    width: '100%',
    fontSize: 16,
    color: Color.BLACK_1,
    height: 40,
    lineHeight: 40,
  },
  middleBox: {
    paddingLeft: 12,
    paddingRight: 12,
    marginTop: 8,
    backgroundColor: '#ffffff',
  },
  bottomBox: {
    paddingLeft: 12,
    paddingRight: 12,
    marginTop: 8,
    backgroundColor: '#ffffff',
  },
  multillineInput: {
    fontSize: Font.NORMAL_1,
    color: Color.BLACK_1,
    padding: 0,
    textAlignVertical: 'top',
    height: 120,
  },
  taskTitle: {
    height: 40,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#e9e4e4',
  },
  taskTitleItem: {
    color: Color.BLACK_1,
    fontSize: Font.LARGE_3,
    height: 40,
    lineHeight: 40,
  },
  copyLink: {
    height: 40,
    marginBottom: 11,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  copyLinkItem: {
    color: Color.ORANGE_1,
    fontSize: Font.LARGE_3,
    lineHeight: 40,
    width: '70%',
  },
  copyLinkButton: {
    width: 86,
    height: 26,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: Color.GREY_4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyLinkButtonItem: {
    color: Color.GREY_1,
    fontSize: Font.NORMAL_1,
  },
  image: {
    width: '30%',
    height: 180,
  },
  shareButton: {
    width: '93%',
    height: 40,
    backgroundColor: Color.BLUE_1,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: '3%',
  },
});
export default MissionDetail;
