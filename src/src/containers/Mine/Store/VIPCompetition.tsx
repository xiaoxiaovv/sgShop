import * as React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Echarts from 'shunguang-native-echarts';
import { NavigationScreenProp } from 'react-navigation';
import { NoticeBar } from 'antd-mobile';

import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

const option = {
  radar: {
    // shape: 'circle',
    name: {
      textStyle: {
        color: '#fff',
        backgroundColor: '#999',
        borderRadius: 3,
        padding: [3, 5],
      },
    },
    indicator: [
      { name: '社区互动0次'},
      { name: '登录42次'},
      { name: '分享4次'},
      { name: '进行评价0次'},
      { name: '招募结识了0个伙伴'},
      { name: '店铺单数0单'},
    ],
  },
  series: [{
    name: '',
    type: 'radar',
    // areaStyle: {normal: {}},
    data: [
      {
        value: [0, 42, 4, 0, 0, 0],
        name: '预算分配',
      },
    ],
  }],
};

class VIPCompetition extends React.Component {
  public render(): JSX.Element {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{ backgroundColor: '#1C365E' }}>
          <View style={[
            styles.rowView,
            styles.outerViewPadding,
            {
              justifyContent: 'space-between',
            },
          ]}>
            <View style={[
              styles.rowView,
            ]}>
              <Image
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  marginRight: 15,
                }}
                source={{ uri: 'http://www.ehaier.com/mstatic/wd/v2/img/icons/ic_default_avatar.png' }}
              />
              <View>
                <Text style={[styles.whiteText]}>Spring</Text>
                <View style={[
                  styles.rowView,
                ]}>
                  <View style={[
                    styles.rowView,
                  ]}>
                    <Image
                      style={{
                        width: 10,
                        height: 10,
                      }}
                      source={{ uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/V@2x.png' }}
                    />
                    <Text style={[styles.whiteText]}>1</Text>
                  </View>
                  <Text style={[styles.whiteText]}>士兵</Text>
                </View>
              </View>
            </View>
            <View>
              <Text style={[styles.whiteText]}>综合竞争力排名</Text>
              <Text style={{ color: 'yellow' }}>118122</Text>
            </View>
          </View>
          <View style={[
            styles.outerViewPadding,
            {
              marginTop: 20,
              marginBottom: 30,
              alignItems: 'center',
            },
          ]}>
            <Echarts option={option} height={height / 2} width={width - 40} />
          </View>
        </ScrollView>
        <View style={{
          position: 'absolute',
          bottom: 0,
          width,
        }}>
          <View style={[
            styles.rowView,
            styles.outerViewPadding,
            {
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            },
          ]}>
            <Text style={{ color: 'yellow', fontSize: 16 }}>总收入：0.00</Text>
            <TouchableOpacity
              style={{
                borderColor: 'yellow',
                borderWidth: 1,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 15,
                paddingRight: 15,
              }}
            >
              <Text style={{ color: 'yellow' }}>进入店铺</Text>
            </TouchableOpacity>
          </View>
          <NoticeBar>
            Notice: The arrival time of incomes and transfers of Yu &#39;E Bao will be delayed during National Day.
        </NoticeBar>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outerViewPadding: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  whiteText: {
    color: 'white',
  },
});

export default VIPCompetition;
