import React from 'react';
import {View, SafeAreaView, Text, Image, ImageBackground, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {connect, createAction, px, width} from "../../utils";
import {goBanner} from "../../utils/tools";
import {action,} from './../../dva/utils';
import Banners from "../../components/banners";
import Title from "./component/title";
import Grids from "./component/grids";
import ThreeProducts from "./component/threeProducts";
import {moneyDisplay} from '../../components/moneyDisplay.js';
import GkGrids from "./component/gkGrids";
import SingleProduct from "./component/singleProduct";
import L from "lodash";
import {NavigationUtils} from '../../dva/utils';
import TitleModal from "./component/titleModal";
import URL from "../../config/url";
import ShareModle from './../../components/ShareModle';

import cart from './../../images/shop_cart_gray.png';
import IsLoginTouchableOpacity from "../../common/IsLoginTouchableOpacity";
import {SafeView, NavBar, SecondTitle} from "../../components";

@connect(({users: {unread, isHost, CommissionNotice, mid}, CharaPage, cartModel: {cartSum}}) => ({
  isHost, mid,
  CommissionNotice, ...CharaPage, cartSum
}))
export default class CharaPage extends React.Component {

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {showShare: false};
  }

  componentWillMount() {

  }

  componentDidMount() {
    const params = this.props.navigation.state.params;
    console.log(params);
    const regionId = L.get(params, 'regionId');
    this.setState({regionId});
    this.props.dispatch({
      type: 'CharaPage/getData',
      payload: {regionId: regionId},
    });
  }

  componentWillUnmount() {
    this.props.dispatch(action('CharaPage/clearData'))
    if (this.props.navigation.state.params && this.props.navigation.state.params.callBack) {
      this.props.navigation.state.params.callBack();
    }
  }

  _onSharePress = () => {
    this.setState({
      showShare: true,
    })
  }

  getShareContent = () => {
    const {mid} = this.props;
    const title = this.props.pageTitle;
    const content = '找特产，来顺逛，质量可靠价格亲民，特产汇欢迎您的到来';
    const pic = this.props.simplePicUrl;
    const url = `${URL.get_chara_share_charpage}/${this.props.navigation.state.params.regionId}//${mid}`;
    return [title, content, pic, url, 0];
  };


  onScroll = (e) => {
    const offset = e.nativeEvent.contentOffset.y;
    if (offset > 110) {
      this.button.setNativeProps({opacity: 1.0});
    } else {
      this.button.setNativeProps({opacity: 0});
    }
  }

  render() {
    return (
      <SafeView>
        <NavBar
          title={this.props.pageTitle}
          rightView={
            <IsLoginTouchableOpacity
              onPress={()=>this._onSharePress()}>
              <Image
                resizeMode='stretch'
                style={{
                  width: px(26),
                  height: px(26),
                  marginRight: px(16),
                }}
                source={require('../../images/icon_share_gray.png')}/>
            </IsLoginTouchableOpacity>}
        />
        <ScrollView
          onScroll={this.onScroll}
          ref={(ref) => this.scrollViewRef = ref}
          style={{flex: 1}}>
          <ImageBackground
            resizeMode='stretch'
            source={{uri: this.props.topImageUrl ? this.props.topImageUrl : ''}}
            style={{width: width, height: px(140)}}
          >
            <TouchableOpacity
              onPress={() => {
                if (this.props.isHost === -1) {
                  this.props.navigation.navigate('Login');
                } else {
                  this.props.dispatch(action('CharaPage/collect', {type: 2, collectId: this.state.regionId}));
                }
              }}
              style={{
                flexDirection: 'row',
                position: 'absolute',
                bottom: px(10),
                right: px(10),
                width: px(70),
                height: px(20),
                alignItems: 'center', justifyContent: 'center',
                borderRadius: px(10),
                backgroundColor: 'rgba(255,68,0,0.59)',
              }}
            >
              <Image
                resizeMode='stretch'
                style={{width: px(10), height: px(10)}}
                source={this.props.isCollected === 0 ? require('../../images/ic_shoucang_1.png') : require('../../images/ic_shoucang_0.png')}/>
              <Text style={{color: '#fff', fontSize: px(10)}}>{this.props.isCollected === 0 ? '收藏' : ' 已收藏 '}</Text>
              <Text style={{color: '#fff', fontSize: px(10)}}>{this.props.collects}</Text>

            </TouchableOpacity>
          </ImageBackground>
          {this.props.cities && this.props.cities.length > 0 && <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{padding: px(20), flexDirection: 'row', width: width}}
          >

            {
              this.props.cities.map((item, index) => {
                return (
                  <Text
                    onPress={() => {
                      this.props.dispatch(NavigationUtils.navigateAction("SecondLevelStore", {regionId: item.regionId}));
                    }}
                    style={{
                      paddingHorizontal:px(3), height: px(30), fontSize: px(10), color: '#000', marginRight: px(20),
                      backgroundColor: '#fff', lineHeight: px(30), textAlign: 'center'
                    }}>{item.regionName}</Text>
                )
              })
            }

          </ScrollView>}
          {
            this.props.topBanners && this.props.topBanners.length > 0 && <Banners
              imageKey='pic'
              style={{width, height: 0.426 * width}}
              onBarnnerPress={(item) => goBanner(item, this.props.navigation)}
              bannerData={this.props.topBanners}
            />
          }
          <SecondTitle title={'全部商品'} onMorePress={
            (item) => {
              this.props.dispatch(NavigationUtils.navigateAction("AllLocalSpecialtyList", {regionId: this.state.regionId}));
            }}/>
          {/*全部商品*/}
          {this.props.recommendProducts && this.props.recommendProducts.length > 0 &&
          <Grids
            onItemPress={(item) => {
              console.log('onItemPress', item);
              this.props.navigation.navigate('GoodsDetail',
                {
                  productId: item.id,
                  productFullName: item.name,
                  swiperImg: item.imageUrl,
                  price: item.price,
                });
            }}
            products={this.props.recommendProducts}/>
          }

          {/*馆长推荐*/}
          {this.props.recommendations && this.props.recommendations.length > 0 &&
          <View style={{overflow: 'hidden',}}>
            <SecondTitle title={'馆长推荐'}/>
            <ThreeProducts
              products={this.props.recommendations[0]}
              onItemPress={(item) => {
                goBanner(item, this.props.navigation)
              }
              }
              containerStyle={{backgroundColor: '#fff'}}
              imageKey={'pic'}
            />
          </View>
          }

          {/*热卖特产*/}
          {this.props.hotProducts && this.props.hotProducts.length > 0 && <View style={{overflow: 'hidden',}}>
            <SecondTitle title={'热卖特产'}/>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{backgroundColor: '#fff', paddingBottom: px(10), paddingTop: px(10)}}
            >
              {this.props.hotProducts.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      this.props.navigation.navigate('GoodsDetail',
                        {
                          productId: item.id,
                          productFullName: item.name,
                          swiperImg: item.imageUrl,
                          price: item.price,
                        });
                    }}>
                    <Image
                      resizeMode='stretch'
                      style={{width: px(100), height: px(100)}}
                      source={{uri: item.imageUrl}}/>
                    <Text style={{width: px(100), fontSize: px(13), marginHorizontal: px(4)}}
                          numberOfLines={2}>{item.name}</Text>
                    {item.price&&moneyDisplay(item.price, 0)}
                    {this.props.isHost > 0 && this.props.CommissionNotice &&(typeof item.commission==='number')? <ImageBackground
                      resizeMode='stretch'
                      source={require('../../images/zhuan.png')}
                      style={{
                        paddingTop: px(2),
                        paddingLeft: px(15),
                        width: px(80),
                        height: px(20),
                      }}
                    >
                      {moneyDisplay(item.commission?item.commission:0)}
                    </ImageBackground> : null}
                  </TouchableOpacity>
                )
              })}
            </ScrollView>
          </View>
          }
          {/*逛客怎么说*/}
          {
            this.props.communities && this.props.communities.length > 0 &&
            <View style={{overflow: 'hidden',}}>
              <SecondTitle title={'逛客怎么说'}
                onMorePress={(item) => {
                  this.props.navigation.navigate('Community', {url: '/html/index.html',},);
              }}/>
              <GkGrids
                onItemPress={(item) => {
                  goBanner(item, this.props.navigation);
                }}
                gkItem={this.props.communities}/>
            </View>
          }
          {/*精品精选*/}
          {
            this.props.competitiveProducts && this.props.competitiveProducts.length > 0 &&
            <View style={{overflow: 'hidden',}}>
              <SecondTitle title={'精品精选'}/>
              {
                this.props.competitiveProducts.map((item, index) => {
                  return (<SingleProduct
                    key={index}
                    onItemPress={() => {
                      console.log('onItemPress', item);
                      this.props.navigation.navigate('GoodsDetail',
                        {
                          productId: item.id,
                          productFullName: item.name,
                          swiperImg: item.imageUrl,
                          price: item.price,
                        });
                    }
                    }
                    product={item}
                  />)
                })
              }
            </View>
          }
        </ScrollView>
        <TouchableOpacity
          ref={(ref) => this.button = ref}
          style={styles.toTopButton}
          onPress={() => this.scrollViewRef && this.scrollViewRef.scrollTo(0)}
        >
          <Image style={{height: 50, width: 50}} source={require('../../images/icon_totop.png')}/>
        </TouchableOpacity>

        <TouchableOpacity
          style={[{
            bottom: 150,
            position: 'absolute',
            right: 10,
            height: 50,
            width: 50,
            backgroundColor: '#faf0e4',
            borderRadius: 25
          }, styles.allCenter]}
          onPress={() => {
            this.props.dispatch(createAction('router/apply')({type: 'Navigation/NAVIGATE', routeName: 'Cart', params: {showCartBackBtn: true}}))
          }}
        >
          <Image style={{height: 40, width: 40, marginTop: 8, marginLeft: 5}}
                 source={cart}/>
          <View style={{
            width: 20,
            minHeight: 20,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 8,
            right: 0,
            borderRadius: 10,
            backgroundColor: '#F40',
            overflow: 'hidden'
          }}>
            <Text
              style={{fontSize: 8, color: '#fff', alignSelf: 'center', textAlign: 'center'}}
              numberOfLines={1}
            >
              {this.props.cartSum <= 99 ? this.props.cartSum : '99+'}
            </Text>
          </View>
        </TouchableOpacity>
        <ShareModle
          visible={this.state.showShare} content={this.getShareContent()}
          onCancel={() => this.setState({showShare: false})}
          hiddenEwm
        />
      </SafeView>
    )
  }
}

const styles = StyleSheet.create({
  toTopButton: {
    position: 'absolute',
    right: 10,
    bottom: 60,
    height: 50,
    width: 50,
    opacity: 0,
  },
});
