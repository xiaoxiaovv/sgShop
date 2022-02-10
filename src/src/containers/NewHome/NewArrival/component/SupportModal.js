import React from 'react';
import {
  Text, TouchableOpacity,
  View, Dimensions, Image, StyleSheet, Platform
} from 'react-native';

import URL from './../../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

import {AnimateModal, InputNumber} from '../../../../components/index';
import {connect} from "react-redux";
import {action} from "../../../../dva/utils";
import {px} from "../../../../utils";
import {Toast} from "antd-mobile";


@connect(({CrowdFundingModel: {currentSingle, showModal, limit,num}}) => ({currentSingle, showModal, limit,num}))
export default class SupportModal extends React.Component {
  state = {value: 1}

  onChange = (v) => {
    this.setState({
      value: v,
    });
  }

  _closeModal = () => {
    this.setState({
      value:1,
    })
    this.props.dispatch(action('CrowdFundingModel/closeModal'));
  }

  render() {
    const currentSingle = this.props.currentSingle;
    console.log('SupportModal',currentSingle);
    return (
      <AnimateModal
        visible={this.props.showModal}
        animationType="slide-up"
        wrapStyle={{
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
        style={{
          width: width,
        }}
      >
        <View style={{height: px(300)}}>

          <View style={{flex: 1, width,padding:px(20)}}>
            <View style={{width:width-px(40),flexDirection:'row',justifyContent:'space-between'}}>
              <Text style={{color: '#FF4400', fontSize: px(20)}}>{`￥${currentSingle.amount}`}</Text>
              <TouchableOpacity
                onPress={() => this._closeModal()}>
                <Image
                  resizeMode={'stretch'}
                  style={{width: px(20), height: px(20)}}
                  source={require('../../../../images/cross.png')}
                />
              </TouchableOpacity>
            </View>
            <Text style={[styles.text1]}>配送费用：免运费</Text>
            <Text style={[styles.text1]}>{`预计回报发放时间：项目重抽成功后${currentSingle.returnTime}天内`}</Text>
            <Text style={{
              marginTop:px(20),
              fontSize: px(12),
              color: '#000'
            }}>{`支持数量（单人限购数量${this.props.limit}）`}</Text>
            <InputNumber
              min={1}
              max={this.props.limit}
              precision={0}//保留的小数点位数
              value={this.state.value}
              style={{backgroundColor: 'white',height:px(60), width:px(100)}}
              readOnly={false}
              onChange={this.onChange}
              disabled={this.state.value>=this.props.num}
              keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}/>
            {
              (this.state.value>=this.props.num)&&
              <Text style={{color: '#FF4400', fontSize: px(10)}}>
                您已达到购买的限购数量！
              </Text>
            }
          </View>
          <TouchableOpacity
            style={{width, height: px(40), justifyContent: 'center', alignItems: 'center', backgroundColor: '#2979FF'}}
            activeOpacity={0.7}
            onPress={() => {
              if(this.state.value>=this.props.num){
                Toast.info('您已达到购买限制数量');
                return;
              }
              this.props.navigation.navigate('OrderInfo', {number:this.state.value,zStallsId:currentSingle.id})
              this._closeModal();
            }}
          >
            <Text style={{color: '#fff', fontSize: px(16),}}>去支持</Text>
          </TouchableOpacity>
        </View>
      </AnimateModal>
    );
  }
}

const styles = StyleSheet.create({
  text1: {
    fontSize: px(14),
    color: '#666'
  }
})