import * as React from 'react';
import { View, Image, Text, TouchableOpacity, Platform } from 'react-native';
import { INavigation } from '../../interface';
import { iPhoneXPaddingTopStyle, isiPhoneX } from '../../utils';

import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

/**
 * 支付失败
 */
export default class PaymentFailed extends React.Component<INavigation> {
  public render(): JSX.Element {
    const { navigation } = this.props;
    return (
      <View style={{flex: 1, justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F5F4F4'}}>
        <View style={{
          paddingTop: Platform.OS === 'android' ? 70 : isiPhoneX ? 134 : 90,
          alignItems: 'center',
        }}>
          <Image
            style={{
              width: 105,
              height: 105,
            }}
            source={{uri: 'http://www.ehaier.com/mstatic//wd/img/pages/msg/pay.png'}}
          />
          <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 10}}>支付失败</Text>
        </View>
        <View style={{
          marginBottom: isiPhoneX ? 54 : 20,
        }}>
          <TouchableOpacity
            style={{
              width: width - 80,
              paddingTop: 15,
              paddingBottom: 15,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#FEC72F',
            }}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('OrderList', {orderStatus: 0, orderFlag: 0})}
          >
            <Text style={{color: 'white'}}>查看订单</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
