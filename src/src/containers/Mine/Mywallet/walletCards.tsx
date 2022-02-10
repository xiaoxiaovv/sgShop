import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { INavigation } from '../../../interface/index';

export default (
  {text, total, consume, duct, crdComAmt, crdComAvailAmt}:
    { text: any; total: any; consume: any; duct: any, crdComAmt: number, crdComAvailAmt: number },
  ) => (
  <View style={{marginTop: 16}}>
    <Text style={{marginBottom: 5, color: '#666'}}>{text}</Text>
    <View style={{
      height: 120,
      backgroundColor: 'white',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: 16,
      paddingRight: 16,
      borderRadius: 3,
    }}>
      {renderLabel(text)}
      {renderContent(text, consume, duct, total, crdComAmt, crdComAvailAmt)}
      <Image source={require('../../../images/goorder.png')}/>
    </View>
  </View>
);

const renderLabel = (text: string): JSX.Element => {
  if ('积分' === text) {
    return <Image source={require('../../../images/haibeijf.png')} style={{width: 56, height: 40}}/>;
  } else if ('钻石' === text) {
    return <Image source={require('../../../images/zuanshijf.png')} style={{width: 56, height: 40}}/>;
  } else {
    return <Image source={require('../../../images/baitiaojf.png')} style={{width: 56, height: 40}}/>;
  }
}

const renderContent = (text, consume, duct, total, crdComAmt, crdComAvailAmt) => {
  if ('顺逛白条' !== text) {
    return <View style={{flex: 1, paddingLeft: 22}}>
      {
        text === '积分' ?
          (<Text style={{fontSize: 16, lineHeight: 20}}>{total}分</Text>)
          :
          (<Text style={{fontSize: 16, lineHeight: 20}}>{total}钻</Text>)
      }
      <Text style={{fontSize: 12, color: '#666', lineHeight: 20}}>累计消费：{consume}</Text>
      <Text style={{fontSize: 12, color: '#666', lineHeight: 20}}>已抵现：{duct}元</Text>
    </View>;
  } else {
    return <View style={{flex: 1, paddingLeft: 22}}>
      <Text style={{fontSize: 16, lineHeight: 20}}>可用额度：{crdComAvailAmt}</Text>
      <Text style={{fontSize: 12, color: '#666', lineHeight: 20}}>总额度：{crdComAmt}</Text>
    </View>;
  }
}
