import React from 'react';
import {ScrollView, Dimensions, View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import {action} from "../../../dva/utils";
import {connect} from 'react-redux';
import {NavBar, SafeView} from './../../../components';
import {px} from "../../../utils";
import SupportModal from "./component/SupportModal";
import IsLoginTouchableOpacity from "../../../common/IsLoginTouchableOpacity";
import DisPlayCommission from "../../../common/DisPlayCommission";

import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;


@connect(({CrowdFundingModel: {zstallsSinglePageViews}}) => ({zstallsSinglePageViews}))
export default class SupportList extends React.Component {
  componentDidMount() {
    const zActivityId = this.props.navigation.state.params.zActivityId;
    this.props.dispatch(action('CrowdFundingModel/getZActivitySinglePage', {zActivityId: zActivityId}));
  }

  _renderItem = () => {
    return this.props.zstallsSinglePageViews.map((item, index) => {
      return (
        <View
          key={index}
          style={{
            width, height: px(180), backgroundColor: '#fff',
            padding: px(15), justifyContent: 'space-between', marginTop: px(1)
          }}>
          <View style={{
            marginHorizontal: px(0),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: px(5),
          }}>


            <DisPlayCommission commission={item.commissionRate * item.amount}>
              <Text style={{color: '#FF4400', fontSize: px(20)}}>{`￥${item.amount}`}</Text>
            </DisPlayCommission>
            <IsLoginTouchableOpacity
              onPress={() => {
                this.props.dispatch(action('CrowdFundingModel/getZhongchouCheck',
                  {zStallsId: item.id, currentSingle: item}));
              }}
              style={{
                height: px(30), width: px(100), borderRadius: px(15),
                alignItems: 'center', justifyContent: 'center', backgroundColor: '#2979FF'
              }}>
              <Text style={{color: '#fff', fontSize: px(16)}}>去支持</Text>
            </IsLoginTouchableOpacity>
          </View>
          {item.isLottery && <View style={{
            borderTopLeftRadius: px(10),
            borderTopRightRadius: px(13),
            borderBottomLeftRadius: px(10),
            borderColor: '#FF4400',
            width: px(60),
            height: px(20),
            borderWidth: px(1), alignItems: 'center', justifyContent: 'center'
          }}><Text style={{
            color: '#FF4400', fontSize: px(10)
          }}>{'抽奖档'}</Text></View>}
          <Text style={[styles.text1, {color: '#000'}]}>{item.returnContent}</Text>
          <Text style={[styles.text1]}>{item.freight === 0 ? '配送费用：免运费' : item.freight.toFixed(2)}</Text>
          <Text style={[styles.text1]}>{`预计回报发放时间：项目重抽成功后${item.returnTime}天内`}</Text>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={{
                tintColor: '#2979FF',
                width: px(15), height: px(15), marginRight: px(10),
              }}
              resizeMode={'stretch'}
              source={require('../../../images/history.png')}/>
            <Text style={[styles.text1, {color: '#2979FF'}]}>
              {`已有${item.supportNum}人支持  剩余份数：${item.remainingNum !== -1 ? item.remainingNum : '无限量'}`}</Text>
          </View>
        </View>

      )
    })

  }

  render() {
    const zstallsSinglePageViews = this.props.zstallsSinglePageViews;

    if (!zstallsSinglePageViews && zstallsSinglePageViews.length === 0) return null;
    return (
      <SafeView>
        <NavBar
          title={'选择档位'}
        />
        <ScrollView style={{backgroundColor: '#ccc'}}>
          {
            this._renderItem()
          }
        </ScrollView>

        <SupportModal
          navigation={this.props.navigation}
        />
      </SafeView>
    )
  }
}

const styles = StyleSheet.create({
  text1: {
    fontSize: px(12),
    color: '#333333'
  }
})
