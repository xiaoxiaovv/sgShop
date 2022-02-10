/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  ImageBackground,
  Dimensions,NativeModules,
  View, ScrollView,
  TouchableOpacity, FlatList, RefreshControl
} from 'react-native';

import {connect} from 'react-redux';
import {action, createAction, NavigationUtils,} from '../../../dva/utils/index';

const Sip = StyleSheet.hairlineWidth;
import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
const sw = (SWidth - 10) * 0.5;
const sh = sw * 0.546;
const PAGE_SIZE = 10;
import NewReservateProduct from "./component/NewReservateProduct";
import PreSaleProduct from "./component/PreSaleProduct";
import CrowdFundingCell from "./../LocalSpecialty/childrenMod/crowdFunding";

import Swiper from 'react-native-swiper';

import yy from '../../../images/res_yy.png';
import ys from '../../../images/res_ys.png';
import zc from '../../../images/res_zc.png';
import dz from '../../../images/res_dz.png';

import go_Crowdfunding from '../../../images/go_Crowdfunding.png';

const menu = [
  {title: "预约", icon: yy},
  {title: "预售", icon: ys},
  {title: "众筹", icon: zc},
  {title: "定制", icon: dz},
];

import {goBanner} from "../../../utils/tools";
import {NavBar, SafeView} from "../../../components";

// 新品众筹首页
@connect(({users, CrowdFundingModel}) =>
  ({...users, ...CrowdFundingModel}))
export default class CrowdFunding extends Component {
  init = () => {
    this.props.dispatch(action('CrowdFundingModel/getCrowdFundingBanner'));
    this.props.dispatch(action('CrowdFundingModel/getSuccessZactivitys', {from: 1}));
    this.props.dispatch({
      type: 'CrowdFundingModel/getCrowdFundingReserve',
      payload: {
        pageIndex: 1,
        pageSize: 3,
        from: 1,
      },
      callback: () => {
        this.setState({
          isRefresh: false
        })
      }
    });
    this.props.dispatch({
      type: 'CrowdFundingModel/getCrowdFundingPreSale',
      payload: {
        pageIndex: 1,
        pageSize: 3,
      },
      callback: () => {
        this.setState({
          isRefresh: false
        })
      }
    });
  };
  renderItemView = ({item, index}) => {
    return <View style={[{marginRight: 10}, styles.allCenter]}>
      <TouchableOpacity onPress={() => {
        goBanner(item, this.props.navigation)
      }}>
        <View style={{height: sh, width: sw, backgroundColor: '#fff'}}>
          <Image source={{uri: item.imageUrl}} style={{height: sh, width: sw}} resizeMode={'contain'}/>
        </View>
      </TouchableOpacity>
    </View>
  };

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      selected: 0,
      title: '我的智慧生活',
      data: [],
      first: true,
      isRefresh: false,
    };
    this.renderItemView = this.renderItemView.bind(this);

  }

  componentDidMount() {
    this.init();

  }

  render() {
    return (
      <SafeView>
        <View style={[styles.container]}>
          <NavBar title={'新品众筹'}/>
          <ScrollView
            refreshControl={<RefreshControl
              onRefresh={() => {
                this.setState({isRefresh: true}, () => {
                  this.init();
                });
              }}
              refreshing={this.state.isRefresh}
              title={'刷新中'}
              colors={['#EFEFEF']}
              progressBackgroundColor={"#DFDFDF"}/>}
          >
            {this.props.topBanner.length > 0 && <View style={[styles.banner, {backgroundColor: "#fff"}]}>
              <Swiper
                autoplay={true}
                loop={true}
                ref={ref => this.swiper = ref}
                autoplayTimeout={10}
                pagingEnabled={true}
                showsPagination={true}
                paginationStyle={{bottom: 10}}
                dot={<View style={styles.dotStyle}/>}
                activeDot={<View style={styles.activeDotStyle}/>}
              >
                {this.props.topBanner.map((item, index) => {
                  return <TouchableOpacity activeOpacity={0.9} key={index} style={{flex: 1}} onPress={() => {
                    goBanner(item, this.props.navigation)
                  }}><View key={index} style={[styles.banner, styles.allCenter, {flex: 1}]}>
                    <Image source={{uri: cutImgUrl(item.imageUrl || '', 360, 360)}} style={[styles.banner]}
                           resizeMode={'stretch'}/>

                  </View>
                  </TouchableOpacity>
                })}
              </Swiper>
            </View>}
            <View style={[{height: 90, backgroundColor: '#fff'}, styles.row]}>
              {menu.map((item, index) => {
                return <TouchableOpacity key={index} activeOpacity={0.9} style={{flex: 1}} onPress={() => {
                  if (index == 0) {
                    this.props.dispatch(NavigationUtils.navigateAction("NewReservations"));
                  } else if (index == 1) {
                    this.props.dispatch(NavigationUtils.navigateAction("QualityPreSale"));
                  } else if (index === 2) {
                    this.props.navigation.navigate('CorwdList', {from: 1});
                  } else {
                    // this.props.navigation.navigate('Personal');
                    const flag = dvaStore.getState().users.userToken.substring(6);
                    const DINGZHI_ZHONGCHUANGHUI = 'http://m.ehaier.com/v3/mstore/sg/diy/login/request.html' + '?flag=' + flag;
                    NativeModules.ToolsModule.presentH5View([DINGZHI_ZHONGCHUANGHUI, '众创定制']);
                  }
                }}><View style={[styles.allCenter, {flex: 1}]}>
                  <Image style={{height: 45, width: 45}} source={item.icon}/>
                  <Text style={{marginTop: 8, fontSize: 12}}>{item.title}</Text>
                </View>
                </TouchableOpacity>
              })}
            </View>
            {this.props.others.length > 0 && <View style={{marginTop: 10}}>
              <FlatList
                ref={(ref) => {
                  this.menuList = ref
                }}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                data={this.props.others}
                keyExtractor={(item, index) => {
                  return index
                }}
                renderItem={this.renderItemView}
              />
            </View>}
            {/* 新品预约 */}
            {this.props.acReserveList.toJS().length > 0 && <View>
              <View style={{width, height: 56, marginTop: 10, position: 'relative'}}>
                <View style={{
                  width,
                  height: 56,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  backgroundColor: '#fff'
                }}>
                  <Text style={[styles.line, {marginRight: 8}]}></Text>
                  <Text style={{color: '#FC459D'}}>新品预约</Text>
                  <Text style={[styles.line, {marginLeft: 8}]}></Text>
                </View>
                <TouchableOpacity style={{position: 'absolute', top: 20, right: 16,}} onPress={() => {
                  this.props.dispatch(NavigationUtils.navigateAction("NewReservations"));
                }}>
                  <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: '#FC459D', fontSize: 14, marginRight: 6}}>更多</Text>
                    <Image
                      style={{width: 16, height: 16}}
                      source={go_Crowdfunding}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              {this.props.acReserveList.toJS().map((item, index) => {
                if (index > 0) return null;
                return <NewReservateProduct key={index}
                                            hidden
                                            index={index}
                                            isHost={this.props.isHost > 0 && this.props.CommissionNotice}
                                            item={item}/>
              })}
            </View>}
            {/* 品质预售 */}
            {this.props.preSaleList.toJS().length > 0 && <View>
              <View style={{width, height: 56, marginTop: 10, position: 'relative'}}>
                <View style={{
                  width,
                  height: 56,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  backgroundColor: '#fff'
                }}>
                  <Text style={[styles.line, {marginRight: 8}]}></Text>
                  <Text style={{color: '#FC459D'}}>品质预售</Text>
                  <Text style={[styles.line, {marginLeft: 8}]}></Text>
                </View>
                <TouchableOpacity style={{position: 'absolute', top: 20, right: 16,}} onPress={() => {
                  this.props.dispatch(NavigationUtils.navigateAction("QualityPreSale"));
                }}>
                  <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: '#FC459D', fontSize: 14, marginRight: 6}}>更多</Text>
                    <Image
                      style={{width: 16, height: 16}}
                      source={go_Crowdfunding}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              {this.props.preSaleList.toJS().map((item, index) => {
                if (index > 0) return null;
                return <PreSaleProduct key={index}
                                       item={item}/>
              })}
            </View>}

            {/* 众筹 */}
            {
              this.props.NCrowdFunding && ((this.props.NCrowdFunding.zcnow && this.props.NCrowdFunding.zcnow.length > 0) || (this.props.NCrowdFunding.zcold && this.props.NCrowdFunding.zcold.length > 0) || (this.props.NCrowdFunding.zcpre && this.props.NCrowdFunding.zcpre.length > 0)) &&
              <CrowdFundingCell
                from={1}
                dataSource={this.props.NCrowdFunding}/>
            }

          </ScrollView>
        </View>
      </SafeView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  allCenter: {
    justifyContent: 'center', alignItems: 'center'
  },
  jCenter: {
    justifyContent: 'center'
  },
  aCenter: {
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row'
  },
  banner: {
    width: SWidth, height: 0.365 * SWidth
  },
  dotStyle: {
    backgroundColor: 'rgba(255,255,255,.5)',
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 8,
  },
  activeDotStyle: {
    //选中的圆点样式
    backgroundColor: '#FFFFFF',
    width: 9,
    height: 9,
    borderRadius: 4.5,
    marginRight: 8,
  },
  line: {
    width: 40,
    height: 1,
    backgroundColor: '#FC459D',
  },
});
