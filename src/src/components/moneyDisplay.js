import {px} from "../utils/index";
import React from 'react';
import {View,Text} from 'react-native';

/**
 *
 * @param money
 * @param type 标志不同的颜色
 * @returns {*}
 */
export const moneyDisplay = (money, type) => {
  const res = (money.toFixed(2) + '').split('.');
  return (
    <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end'}}>
    <Text style={{color: type !== 0 ? '#fff' : '#F40', fontSize: px(10), marginBottom: 2}}>￥</Text>
      <Text style={{color: type !== 0 ? '#fff' : '#F40', fontSize: px(14)}}>{`${res[0]}.`}</Text>
      <Text style={{color: type !== 0 ? '#fff' : '#F40', fontSize: px(14)}}>{res[1]}</Text>
    </View>)
}