import * as React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

import Echarts from 'shunguang-native-echarts';
import { INavigation } from '../../../interface/index';

import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

const option = {
  title: {
      text: '单位:次',
  },
  color: ['#6AACF6'],
  tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
      },
  },
  grid: {
    left: '3%',
    right: '3%',
    bottom: '10%',
    containLabel: true,
  },
  xAxis: [
      {
          type: 'category',
          axisLine: { show: false },
          axisTick: {
              show: false,
          },
          axisLabel: {
            rotate: 50,
            interval: 0,
        },
          data: ['分享店铺', '分享商品', '任务完成', '社区互动', '评价次数', '登录次数'],
      },
  ],
  yAxis: [
      {
          type: 'value',
          // 控制y轴线是否显示
          axisLine: { show: false },
          // 去除y轴上的刻度线
          axisTick: {
              show: false,
          },
      },
  ],
  series: [
      {

          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330],
      },
  ],
};

/**
 * 微店主数据分析
 */
class DataAnalysis extends React.Component<INavigation> {
  public static navigationOptions = ({ navigation, screenProps }) => ({
    title: '微店主数据分析',
    headerTintColor: 'white',
    headerStyle: {backgroundColor: '#0089FB', justifyContent: 'center'},
    headerTitleStyle: { color: 'white', alignSelf: 'center'},
    headerRight: (
      <TouchableOpacity style={{
        width: 56, flexDirection: 'row', justifyContent: 'center',
        alignItems: 'center',
      }}
        onPress={() => navigation.navigate('Mine')}
      >
        <Image
          style={{ height: 20, width: 20 }}
          source={require('../../../images/user.png')}
        />
      </TouchableOpacity>
    ),
    headerBackTitle: null,
  })
  public render(): JSX.Element {
    return (<ScrollView style={{ backgroundColor: '#F4F4F4' }}>
      <View style={{
        backgroundColor: 'white',
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10,
      }}>
        <Text>最新动态</Text>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <View style={styles.newsView}>
            <Image
              style={styles.newsImage}
              source={{uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/timeOrder@2x.png'}}
            />
            <Text>订单时间</Text>
          </View>
          <View style={styles.newsView}>
            <Image
              style={styles.newsImage}
              source={{uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/shopClassification@2x.png'}}
            />
            <Text>商品分类</Text>
          </View>
          <View style={styles.newsView}>
            <Image
              style={styles.newsImage}
              source={{uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/orderPrice@2x.png'}}
            />
            <Text>订单金额</Text>
          </View>
        </View>
      </View>
      <View style={{
        backgroundColor: 'white',
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 15,
        paddingBottom: 15,
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <View>
            <Text>销售商品分析</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <TouchableOpacity
              style={[
                styles.productAnaTab,
                {
                  borderBottomColor: '#639DFC',
                  borderBottomWidth: 2,
                },
              ]}
            >
              <Text style={{color: '#639DFC'}}>本月</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.productAnaTab}
            >
              <Text>累计</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{
          alignItems: 'center',
          paddingBottom: 40,
        }}>
          <View>
            <Image
              style={{
                width: 180,
                height: 180,
                marginLeft: 20,
              }}
              source={{uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/Coupon@2x.png'}}
            />
            <Text style={{
              color: '#BDBDBD',
              fontSize: 18,
            }}>销售：暂无数据，加油开张吧。</Text>
          </View>
        </View>
      </View>
      <View style={{
        backgroundColor: 'white',
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 15,
        paddingBottom: 15,
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <View>
            <Text>活跃度分析</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <TouchableOpacity
              style={[
                styles.productAnaTab,
                {
                  borderBottomColor: '#639DFC',
                  borderBottomWidth: 2,
                },
              ]}
            >
              <Text style={{color: '#639DFC'}}>本月</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.productAnaTab}
            >
              <Text>累计</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{
          alignItems: 'center',
          paddingBottom: 50,
        }}>
          <Echarts option={option} height={height * 3 / 7} width={width} />
        </View>
        <View style={styles.iconView}>
          <View style={styles.iconInnerView}>
            <Image
              style={styles.icon}
              source={{uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/loginNum.png'}}
            />
            <View style={styles.iconInnerColumnView}>
              <Text>15</Text>
              <Text>登录次数</Text>
            </View>
          </View>
          <View style={styles.iconInnerView}>
            <Image
              style={{
                width: 18,
                height: 18,
              }}
              source={{uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/commentNum.png'}}
            />
            <View style={styles.iconInnerColumnView}>
              <Text>0</Text>
              <Text>评价次数</Text>
            </View>
          </View>
        </View>
        <View style={styles.iconView}>
          <View style={styles.iconInnerView}>
            <Image
              style={styles.icon}
              source={{uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/interactiveNum.png'}}
            />
            <View style={styles.iconInnerColumnView}>
              <Text>15</Text>
              <Text>社区互动</Text>
            </View>
          </View>
          <View style={styles.iconInnerView}>
            <Image
              style={{
                width: 18,
                height: 18,
              }}
              source={{uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/carryNum.png'}}
            />
            <View style={styles.iconInnerColumnView}>
              <Text>0</Text>
              <Text>任务完成</Text>
            </View>
          </View>
        </View>
        <View style={styles.iconView}>
          <View style={styles.iconInnerView}>
            <Image
              style={styles.icon}
              source={{uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/shareShopNum.png'}}
            />
            <View style={styles.iconInnerColumnView}>
              <Text>15</Text>
              <Text>分享店铺</Text>
            </View>
          </View>
          <View style={styles.iconInnerView}>
            <Image
              style={{
                width: 18,
                height: 18,
              }}
              source={{uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/sahngNum.png'}}
            />
            <View style={styles.iconInnerColumnView}>
              <Text>0</Text>
              <Text>分享商品</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>);
  }
}

const styles = StyleSheet.create({
  newsView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  newsImage: {
    width: 10,
    height: 10,
    marginRight: 10,
  },
  productAnaTab: {
    marginLeft: 20,
    marginRight: 20,
    paddingBottom: 3,
  },
  iconView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
  },
  iconInnerView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iconInnerColumnView: {
    marginLeft: 10,
  },
  icon: {
    width: 18,
    height: 18,
  },
});

export default DataAnalysis;
