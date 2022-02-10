import React, {Component} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  SafeAreaView,
  Dimensions,
  View, ScrollView,
  TouchableOpacity, NativeModules
} from 'react-native';

import {connect} from 'react-redux';

import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

import {NavBar, SafeView} from './../../../components';
import {px} from "../../../utils";
import {action} from "../../../dva/utils";
import Carousel from "../../../components/Carousel";
import ProgressBar from "./component/ProgressBar";


@connect(({CrowdFundingModel: {crowdDetail}}) => ({crowdDetail}))
export default class ArrivalDetail extends React.Component {


  componentDidMount() {
    this.zActivityId = this.props.navigation.state.params.zActivityId;
    this.props.dispatch(action('CrowdFundingModel/getCrowdFundingDetail', {zActivityId: this.zActivityId}));
  }

  _goSupportList = () => {
    this.props.navigation.navigate('SupportList', {zActivityId: this.zActivityId})
  }

  _goToKeFu = () => {
    // 小能客服
    const chatparams = {
      goods_id: '-1', // 消息页等其他页面商品id固定传-1  单品页传商品id正常传  订单传商品id正常传
      clientGoods_type: '1', // 传1
      // 0:客服端不展示商品信息;1：客服端以商品ID方式获取商品信息(goods_id:商品ID，clientGoods_type = 1时goods_id参数传值不能为空)
      appGoods_type: '0', // 单品页传1  订单传3 并吧三下面的四个参数传递过来
    };
    const command = [
      'hg_1000_1508927913371',
      '客服', // yl
      chatparams,
    ];
    NativeModules.XnengModule.NTalkerStartChat(command)
      .then(result => {
        Log('调起小能客服成功');
      })
      .catch((errorCode, domain, error) => {
        Log('调起小能客服失败');
      });
  }

  render() {
    if (!this.props.crowdDetail) return null;
    const crowdDetail = this.props.crowdDetail;
    return (
      <SafeView>
        <NavBar
          title={'众筹详情'}
        />
        <ScrollView style={{backgroundColor: '#fff'}}>
          <Carousel
            autoplay={true}
            infinite={true}
            autoplayInterval={5000}
            dotStyle={styles.dotStyle}
            dotActiveStyle={styles.activeDotStyle}
          >
            {
              crowdDetail.imageUrls && (crowdDetail.imageUrls || []).map((item, i) => (
                <Image
                  key={i}
                  source={{uri: item || ''}}
                  style={[styles.banner]}
                  resizeMode={'stretch'}/>
              ))
            }
          </Carousel>
          <View style={{
            flexDirection: 'row',
            padding: px(5),
            alignItems: 'center',
          }}>
            <View style={{
              borderTopLeftRadius: px(10),
              borderTopRightRadius: px(13),
              borderBottomLeftRadius: px(10),
              borderColor: '#FF4400',
              width: px(60),
              height: px(20),
              borderWidth: px(1), alignItems: 'center', justifyContent: 'center'
            }}><Text style={{
              color: '#FF4400', fontSize: px(10)
            }}>{crowdDetail.activityStatus === 1 && '众筹中'}</Text></View>
            <Text style={{
              color: '#000',
              fontSize: px(15), marginLeft: px(18)
            }}>{crowdDetail.activityName}</Text>
          </View>
          <Text
            numberOfLines={1}
            style={[styles.text1, {
              paddingHorizontal: px(5),
              paddingVertical: px(8),
              height: px(30),
            }]}>{crowdDetail.activityDsp}</Text>

          {/*分割线*/}
          <View style={{marginHorizontal: px(5), backgroundColor: '#eee', height: px(2),}}/>

          <View style={{flexDirection: 'row', padding: px(5)}}>
            <Text style={styles.progressText1}>{crowdDetail.supportNum}<Text
              style={styles.progressText2}>人支持</Text></Text>
            <Text style={[styles.progressText2, {marginLeft: px(30)}]}>已筹资<Text
              style={styles.progressText1}>{`￥${crowdDetail.raisedAmount}`}</Text></Text>
          </View>
          <ProgressBar
            style={{padding: px(5)}}
            raisedAmount={crowdDetail.raisedAmount}
            targetAmount={crowdDetail.targetAmount}
            schedule={crowdDetail.schedule}
          />

          <View style={{
            marginTop: px(10),
            width: width,
            flexDirection: 'row',
            padding: px(5),
            justifyContent: 'space-between'
          }}>
            <Text style={styles.progressText2}>剩余：<Text style={styles.progressText3}>{crowdDetail.remainingDays}</Text></Text>
            <Text style={styles.progressText2}>目标：<Text
              style={styles.progressText3}>{`￥${crowdDetail.targetAmount}`}</Text></Text>
          </View>

          {/*分割线*/}
          <View style={{width, backgroundColor: '#eee', height: px(6),}}/>

          <TouchableOpacity
            onPress={() => {
              this._goSupportList();
            }}
          >
            <View style={{
              paddingHorizontal: px(5),
              paddingVertical: px(10),
              width: width,
              flexDirection: 'row',
              padding: px(5),
              justifyContent: 'space-between',
            }}>
              <Text style={styles.text1}>热门回报档位</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.text1}>更多档位</Text>
                <Image
                  resizeMode='stretch'
                  style={{marginLeft: px(5), width: px(5), height: px(12)}}
                  source={require('../../../images/arrow_right_w.png')}/>
              </View>
            </View>
            <View style={{
              width: width,
              flexDirection: 'row',
              paddingHorizontal: px(5),
              paddingVertical: px(10),
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: px(5),
            }}>
              <Text style={{color: '#FF4400', fontSize: px(20)}}>{`￥${crowdDetail.zstallsAmount}`}</Text>
              <Text style={{color: '#000', fontSize: px(10)}}>{`支持者${crowdDetail.zstallsSupportNum}`}</Text>
            </View>
          </TouchableOpacity>


          {/*分割线*/}
          <View style={{width, backgroundColor: '#eee', height: px(6),}}/>

          <View style={{padding: px(10)}}>
            <View style={{
              height: px(25),
              borderBottomColor: '#2979FF',
              width: px(50),
              borderBottomWidth: 2,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text style={{height: px(15), color: '#2979FF'}}>项目详情</Text>
            </View>
            <View style={{flexDirection: 'row', width: width,}}>
              <Image
                source={{uri: crowdDetail.adderAvatar}}
                style={{width: px(50), height: px(50), borderRadius: px(25), padding: px(10)}}
                resizeMode={'stretch'}
              />
              <View style={{justifyContent: 'space-between', marginVertical: px(6),}}>
                <Text style={{fontSize: px(14), fontWeight: 'bold', color: '#000',}}>{crowdDetail.adder}</Text>
                <Text style={styles.text2}>{crowdDetail.adderDsp}</Text>
              </View>
            </View>
            <Text style={[styles.text2, {marginHorizontal: px(10)}]}>{crowdDetail.activityDetails}</Text>
          </View>
        </ScrollView>

        <View style={{width: width, height: px(50), flexDirection: 'row'}}>
          <TouchableOpacity
            style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}
            activeOpacity={0.7}
            onPress={() => {
              this._goToKeFu();
            }}
          >
            <Image
              style={{width: px(20), height: px(20)}}
              source={require('../../../images/ic_kf.png')}
            />
            <Text style={styles.text2}>客服</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 3, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2979FF'}}
            activeOpacity={0.7}
            onPress={() => {
              this._goSupportList();
            }}
          >
            <Text style={{color: '#fff', fontSize: px(16),}}>我要去支持</Text>
          </TouchableOpacity>
        </View>
      </SafeView>
    )
  }

}


const styles = StyleSheet.create({

  banner: {
    width: width,
    height: 0.48 * width,
  },
  dotStyle: {
    backgroundColor: 'rgba(0,0,0,.5)',
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 8,
  },
  activeDotStyle: {
    //选中的圆点样式
    backgroundColor: '#000',
    width: 9,
    height: 9,
    borderRadius: 4.5,
    marginRight: 8,
  },
  progressText1: {
    color: '#FF4400',
    fontSize: px(12)
  },
  progressText2: {
    color: '#333',
    fontSize: px(12),
  },
  progressText3: {
    fontSize: px(14),
    color: '#333',
  },
  text1: {
    fontSize: px(14),
    color: '#666',
  },
  text2: {
    fontSize: px(10),
    color: '#000',
  }

});

