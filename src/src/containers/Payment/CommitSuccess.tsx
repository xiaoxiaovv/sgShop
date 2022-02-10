import * as React from 'react';
import {View, Image, Text, TouchableOpacity, Platform, ScrollView, TouchableWithoutFeedback} from 'react-native';
import { INavigation } from '../../interface';
import { isiPhoneX } from '../../utils';

import sqzbs3 from './../../images/sqzbs3.jpg';

import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

import { goToSQZBS } from '../../utils/tools';

/**
 * 提交成功
 */
export default class CommitSuccess extends React.Component<INavigation> {
  public render(): JSX.Element {
    const { navigation } = this.props;
    const { orderSn, price } = navigation.state.params;
    return (
      <View style={{flex: 1, justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F5F4F4'}}>
          <ScrollView >
        <View style={{
          paddingTop: Platform.OS === 'android' ? 70 : isiPhoneX ? 134 : 90,
          alignItems: 'center', width,
        }}>
          <Image
            style={{
              width: 105,
              height: 105,
            }}
            source={{uri: 'http://www.ehaier.com/mstatic/wd/v2/img/pages/msg/order.png'}}
          />
          <Text style={{fontSize: 16, marginTop: 10}}>订单提交成功</Text>
          <Text style={{
            fontSize: 16,
            marginTop: 15,
          }}>
            订单编号：{orderSn}
          </Text>
          <Text style={{
            color: '#FA9471',
            fontSize: 15,
            marginTop: 10,
          }}>
            宝物金额：¥{price}
          </Text>
        </View>
        <View style={{
          marginBottom: isiPhoneX ? 54 : 20, alignItems: 'center',
        }}>
          <TouchableOpacity
            style={{
              width: width - 80,
                marginTop: 20,
                paddingTop: 15,
              paddingBottom: 15,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#3CBFFC',
            }}
            activeOpacity={0.8}
            onPress={() => {
              // 跳转到订单列表页面
             navigation.navigate('OrderList',
                {orderStatus: 0,
                  orderFlag: 0,
                  // 上上一个界面的key
                  routeKey: navigation.state.params.routeKey,
                });
              }
              }
          >
            <Text style={{color: 'white'}}>查看订单</Text>
          </TouchableOpacity>
        </View>
              <View style={{marginTop: 20}}>
                  <TouchableWithoutFeedback  onPress={()=>{
                      goToSQZBS();
                  }} >
                      <Image style={{width: width, height: 0.32*width}} source={sqzbs3}/>
                  </TouchableWithoutFeedback>
              </View>

          </ScrollView>
      </View>
    );
  }
}
