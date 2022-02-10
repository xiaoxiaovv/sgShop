import React from 'react';
import {Dimensions, View, Text, Image, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';

import {px} from "../../../utils";

import {NavBar, SafeView, Checkbox} from './../../../components';
import {action, NavigationUtils} from "../../../dva/utils";
import {List,} from 'antd-mobile';
import URL from "../../../config/url";
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;


const Item = List.Item;


@connect(({CrowdFundingModel: {orderPageInfo,memberId, memberName, mobile, regionName, address, orderSn, invoiceType, billCompany}}) =>
  ({orderPageInfo,memberId, memberName, mobile, regionName, address, orderSn, invoiceType, billCompany}))
export default class OrderInfo extends React.Component {

  state = {
    checked: true,
      disab: false,
  }

  componentDidMount() {
    this.number = this.props.navigation.state.params.number;
    this.zStallsId = this.props.navigation.state.params.zStallsId;
    this.props.dispatch(action('CrowdFundingModel/getOrderPageInfo', {number: this.number, zStallsId: this.zStallsId}));
  }


  render() {
    const {orderPageInfo, memberName, mobile, regionName, address, invoiceType, billCompany} = this.props;
    const memberAddress = orderPageInfo.memberAddress;
    if (!memberAddress) return null;
    return (
      <SafeView>
        <NavBar
          title={'填写订单'}
        />
        {
          memberAddress && <ScrollView>
            <Item arrow='horizontal'
                  onClick={() => this.props.navigation.navigate('Address', {
                    onSelect: (item) => {
                      this.props.dispatch(action('CrowdFundingModel/saveAddress', {
                        memberName: item.co,
                        mobile: item.mo,
                        regionName: item.rn,
                        address: item.ar,
                      }));
                    },
                  })}
            >
              <View style={styles.header}>
                <Image source={require('../../../images/separator.png')} style={styles.separator} resizeMode='cover'/>

                <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: px(10)}}>
                  <Text style={styles.text}>{`收货人：${memberName}`}</Text>
                  <Text style={styles.text}>{mobile}</Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 8, marginRight: 25,}}>
                  <Image
                    source={require('../../../images/locationAddress.png')}
                    style={{width: px(14), height: px(14)}}
                  />
                  <Text style={styles.text4}>{`收货地址: ${regionName}${address}`}</Text>
                </View>
              </View>
            </Item>

            <View style={{
              marginTop: px(10),
              backgroundColor: '#fff',
              padding: px(10),
              height: px(180),
              justifyContent: 'space-between'
            }}>
              <Text style={styles.text1}>支持单价：<Text
                style={[styles.text1, {
                  color: '#F40',
                  opacity: 0.5
                }]}>{`    ￥${(orderPageInfo.zStallsAmount).toFixed(2)}`}</Text></Text>
              <Text style={styles.text2}>{`项目名称：${orderPageInfo.activityName}`}</Text>
              <Text style={styles.text2}>{`商品数量：${orderPageInfo.purchaseNum}`}</Text>
              <Text style={styles.text3}>{orderPageInfo.returnContent}</Text>
              <Text
                style={[styles.text3, {marginTop: px(20)}]}>{`配送费用：${parseInt(orderPageInfo.freight) > 0 ? orderPageInfo.freight : '免运费'}`}</Text>
              <Text style={styles.text3}>{`预计回报发放时间：项目众筹成功后${orderPageInfo.returnTime}天内`}</Text>
            </View>

            <Item
              style={{marginTop: px(10)}}
              multipleLine={true}
              wrap={true}
              arrow='horizontal'
              extra={<Text style={[styles.text2, {width: 0.65 * width, textAlign: 'right'}]}>
                {`${invoiceType === 2 ? '普通发票' + ' ' + billCompany : '增值税专用发票' + ' ' + billCompany}`}
              </Text>}
              onClick={() => this.props.navigation.navigate('Receipt',
                {
                  callBack: (msg) => {
                    console.log('callBack ', msg);
                    this.props.dispatch(action('CrowdFundingModel/changeInvoice',
                      {
                        invoiceType: msg.invoiceType,
                        billCompany:msg.billCompany,
                      }));

                  }
                })}>
              <Text style={styles.text2}>发票信息</Text>
            </Item>

            <View style={{
              backgroundColor: '#fff',
              marginVertical: px(2),
              padding: px(10),
              height: px(100),
              justifyContent: 'space-between'
            }}>
              <View style={styles.lineContainer}>
                <Text style={styles.text4}>支持数量</Text>
                <Text style={styles.text4}>{orderPageInfo.purchaseNum}</Text>
              </View>
              <View style={styles.lineContainer}>
                <Text style={styles.text4}>支持单价</Text>
                <Text style={styles.text4}>{`￥${orderPageInfo.zStallsAmount}`}</Text>
              </View>
              <View style={styles.lineContainer}>
                <Text style={styles.text4}>配送费用</Text>
                <Text style={styles.text4}>{`￥${orderPageInfo.freight}`}</Text>
              </View>

              <View style={styles.lineContainer}>
                <Text style={styles.text4}>支持总金额</Text>
                <Text style={[styles.text4, {color: '#F40'}]}>{`￥${orderPageInfo.orderAmount}`}</Text>
              </View>
            </View>

            <Item
              multipleLine={true}
              wrap={true}
              arrow='horizontal'
              onClick={() => {

                this.props.dispatch(NavigationUtils.navigateAction('CustomWebView', {
                  customurl: `${URL.SHARE_HOST}/RiskDescription`,
                  flag: true,
                  headerTitle: '风险说明',
                  callBack: () => {
                  },
                }));
              }}
            >
              <Text style={[styles.text4, {color: '#F40'}]}>风险说明</Text>
            </Item>

            <View>
              <Checkbox
                checked={this.state.checked}
                onChange={(event) => {
                  const check = event.target.checked;
                  this.setState({checked: check});
                }}
                style={{borderWidth: 1, borderColor: '#999', margin: 10}}
              >

                <Text style={styles.text1}>同意并阅读<Text
                  onPress={() => {

                    this.props.dispatch(NavigationUtils.navigateAction('CustomWebView', {
                      customurl: `${URL.SHARE_HOST}/SupportersAgreement`,
                      flag: true,
                      headerTitle: '支持者协议',
                      callBack: () => {
                      },
                    }));
                  }}
                  style={{color: '#1C77BF'}}>《支持者协议》</Text></Text>
              </Checkbox>
            </View>
          </ScrollView>
        }
        <View style={{width, flexDirection: 'row'}}>
          <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff'
          }}>
            <Text style={styles.text}>总计金额</Text>
            <Text
              style={[styles.text, {color: '#F40'}]}>{`￥${orderPageInfo && (orderPageInfo.orderAmount + orderPageInfo.freight).toFixed(2)}`}</Text>
          </View>
          <TouchableOpacity
            style={{
              flex: 1,
              height: px(50),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#2979FF'
            }}
            disabled={this.state.disab}
            activeOpacity={0.7}
            onPress={() => {

              if(!this.state.disab){
                  this.setState({disab: true}, ()=>{
                      console.log('提交订单 disab true');
                      this.props.dispatch({
                          type: 'CrowdFundingModel/submitOrder',
                          payload: {
                              invoiceType: orderPageInfo.invoiceType,
                              number: this.number,
                              sharePeopleId: this.props.memberId,
                              zStallsId: this.zStallsId
                          },
                          callback: () => {
                              this.setState({disab: false});
                              console.log('提交订单 disab false');
                              this.props.navigation.navigate('Payment', {
                                  orderSn: this.props.orderSn,
                              });
                          }
                      });

                  });
              }

            }}
          >
            <Text style={{color: '#fff', fontSize: px(16),}}>提交订单</Text>
          </TouchableOpacity>
        </View>

      </SafeView>)
  }
}

const styles = StyleSheet.create({
  header: {
    width: width - px(50),
    paddingVertical: px(14),
  },
  text: {
    fontSize: px(18),
    color: '#000',
  },
  separator: {
    width: width,
    height: 4,
  },
  text1: {
    fontSize: px(20),
    color: '#999'
  },
  text2: {
    fontSize: px(16),
    color: '#333'
  },
  text3: {
    fontSize: px(15),
    color: '#999'
  },
  lineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text4: {
    fontSize: px(12),
    color: '#333'
  },

})