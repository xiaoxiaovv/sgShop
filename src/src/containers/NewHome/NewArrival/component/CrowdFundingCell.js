import React, {Component} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  ImageBackground,
  Dimensions,
  View, ScrollView,
  TouchableOpacity, Modal
} from 'react-native';

import {px, width} from "../../../../utils";
import Config from "react-native-config/index";
import NavigationUtils from "../../../../dva/utils/NavigationUtils";


export default class CrowdFundingCell extends React.Component {

  render() {
    const item = this.props.item;
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.onTab1ItemPress && this.props.onTab1ItemPress();
        }}
        style={{flexDirection: 'row', padding: px(10),backgroundColor:'#fff'}}>
        <Image
          resizeMode='stretch'
          style={{width: px(120), height: px(120), borderWidth: 1, borderColor: '#000'}}
          source={{uri: item.imageUrl}}
        />
        <View style={{justifyContent: 'space-between', paddingVertical: px(20), marginLeft: px(10)}}>
          <Text>{item.activityName}</Text>
          {this.props.type !== 1 ?
            <View style={{flexDirection: 'row', marginTop: 6, width: width - px(160)}}>
              <View style={{backgroundColor: '#e4e4e4', width, height: 12, borderRadius: 8, flex: 1}}>
                <View style={{
                  width: '' + Math.ceil((item.raisedAmount / item.targetAmount) * 100) + '%',
                  maxWidth:width - px(210),
                  height: 12,
                  borderRadius: 50,
                  backgroundColor: '#F40'
                }}/>
              </View>
              <Text numberOfLines={1} style={{fontSize: 12, marginLeft: 10, marginRight: 10}}>{`${Math.ceil(parseFloat(item.schedule))}%`}</Text>
            </View> :
            <View style={{flexDirection: 'row', marginTop: 6, width: width - px(160)}}>
              <View style={{
                borderColor: '#F40',
                borderWidth: px(1),
                borderTopRightRadius: px(10),
                borderTopLeftRadius: px(10),
                borderBottomLeftRadius: px(10),
                width: px(60),
                height: px(20),
                alignItems: 'center', justifyContent: 'center',
              }}><Text style={{color: '#F40', fontSize: px(13)}}>预热中</Text></View>
              <Text style={{
                marginLeft: px(4),
                marginTop: px(2),
                color: '#666',
                fontSize: px(13)
              }}>{`目标金额:￥${item.targetAmount}`}</Text>
            </View>}
          {this.props.type !== 1 ? <View><Text style={{color: '#999'}}>
              已筹资
              <Text style={{color: '#F40'}}>{`￥${item.raisedAmount}`}</Text>
            </Text>
              <Text style={{color: '#999'}}>
                已有
                <Text style={{color: '#000'}}>{item.supportNum}</Text>
                人支持
              </Text></View> :
            <Text style={{color: '#999', fontSize: px(13)}}>距离开始时间还有：
              <Text style={{color: '#F40', fontSize: px(13)}}>{item.toStartTime}</Text>
            </Text>
          }
        </View>
      </TouchableOpacity>
    )
  }
}

