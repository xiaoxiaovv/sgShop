import React from 'react';
import {View, SafeAreaView, Image, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {MessageWithBadge} from '../../components/MessageWithBadge';
import {connect, createAction, px, width} from "../../utils";
import Tabbar from '../../components/TabBar'

import Swiper from 'react-native-swiper';
import {goBanner} from "../../utils/tools";
import RecommendProducts from "./component/recommendProducts";
import {action,} from './../../dva/utils';
import Banners from "../../components/banners";
import {SafeView, NavBar} from "../../components";



@connect(({users: {unread, isHost,CommissionNotice}, HomeDress: {tabbarData, bannerData, lowRecommendProducts, topRecommendProducts}}) =>
  ({
    isHost,
    CommissionNotice,
    unread,
    tabbarData,
    bannerData,
    topRecommendProducts,
    lowRecommendProducts,
  }))
export default class HomeDress extends React.Component {

  componentDidMount() {
    this.props.dispatch(action('HomeDress/getTabbar'));
    this.props.dispatch(action('HomeDress/getAdornHomeBanner'));
  }

  render() {
    return (
      <SafeView>
        <NavBar
          title={'家居家装'}
          rightView={
            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 6,}}>
              <TouchableOpacity activeOpacity={0.8}
                onPress={() => this.props.navigation.navigate('Search', { searchKey: ''})}
              >
                <Image
                 style={{height: 24, width: 24, marginLeft: 16, marginVertical: 10,}}
                 source={require('../../images/search.png')}
                 />
              </TouchableOpacity>
              <MessageWithBadge
                badgeContainStyle={{top: 5, right: 4}}
                hidingText={true}
                navigation={this.props.navigation}
                unread={this.props.unread}
                imageStyle={{width: 22, height: 22}}
                marginRightStyle={{marginRight: 0}}
              />
            </View>
          }
        />
        <ScrollView contentContainerStyle={{backgroundColor: '#fff'}}>
          <Banners
              style={{ width: width, height: 0.365 * width,}}
            onBarnnerPress={(item)=> goBanner(item, this.props.navigation)}
            bannerData={this.props.bannerData}
          />
          <Tabbar
            isDress
            tabbarData={this.props.tabbarData}
            onTabClick={(index) => {
              const parentCateId = this.props.tabbarData[index].id;
              this.props.dispatch(action('HomeDress/getTopRecommendProducts', {parentCateId: parentCateId}));
              this.props.dispatch(action('HomeDress/getLowRecommendProducts', {parentCateId: parentCateId}));
            }}
          />
          <RecommendProducts
            isHost={this.props.isHost>0&&this.props.CommissionNotice}//是否是微店主
            onItemPress={(item) => {
              this.props.navigation.navigate('GoodsDetail',
                {
                  productId: item.productId,
                  productFullName: item.productName,
                  swiperImg: item.imgUrl,
                  price: item.productPrice,
                });
            }}
            onMorePress={(item) => {
              this.props.navigation.navigate('GoodsList', {
                productCateId: item.productCateId, // 类目id  -- 有跳转类目页,必传
                // brandId: item, // 品牌 id  -- 没有不传
              });
            }}
            topRecommendProducts={this.props.topRecommendProducts}
            lowRecommendProducts={this.props.lowRecommendProducts}
          />
        </ScrollView>
      </SafeView>
    )
  }
}

const styles = StyleSheet.create({

  banner: {
    width: width,
    height: 0.365 * width,
  },
  menuStyle: {
    width,
    height: 90,
    marginTop: 9,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center'
  },
  aCenter: {
    justifyContent: 'center',
    alignItems: 'center'
  },

});


