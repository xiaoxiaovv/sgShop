

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    View,
    SafeAreaView,
    Image,
    TouchableWithoutFeedback,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import {MessageWithBadge} from './../../../components/MessageWithBadge';
import {connect, createAction, px, width} from "./../../../utils";
import MenuBar from '../../../components/TabBar'
import Swiper from 'react-native-swiper';
import {goBanner} from "./../../../utils/tools";
import RecommendProducts from "./../../HomeDress/component/recommendProducts";
import {action,} from './../../../dva/utils';
import {NavigationUtils} from "../../../dva/utils";


@connect(({users: {unread, isHost, CommissionNotice}, SuperMaket: {tabbarData, bannerData, lowRecommendProducts, topRecommendProducts}}) =>
    ({
        unread,isHost,CommissionNotice,
        tabbarData,
        bannerData,
        topRecommendProducts,
        lowRecommendProducts,
    }))
export default class BHCS extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            showRefreshBtn: false,
        };
    }

    componentDidMount() {
        this.props.dispatch(action('SuperMaket/getTabbar'));
        this.props.dispatch(action('SuperMaket/getAdornHomeBanner'));

    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ScrollView style={{backgroundColor: '#fff'}}>
                    {this.props.bannerData.length > 0 && <View style={[styles.banner, {backgroundColor: "#fff"}]}>
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
                            {this.props.bannerData.map((item, index) => {
                                return <TouchableOpacity activeOpacity={0.9} key={index} style={{flex: 1}} onPress={()=>{
                                    goBanner(item, this.props.navigation)
                                    // this.props.dispatch(NavigationUtils.navigateAction('ScenePage',{scenesId: item.id}));
                                }}><View key={index} style={[styles.banner, styles.allCenter, {flex:1}]}>
                                    <Image source={{uri: item.imageUrl}} style={[styles.banner]} resizeMode={'stretch'}/>
                                </View>
                                </TouchableOpacity>
                            })}
                        </Swiper>
                    </View>}
                    <MenuBar
                        tabbarData={this.props.tabbarData}
                        onTabClick={(index) => {
                            const parentCateId = this.props.tabbarData[index].id;
                            this.props.dispatch(action('SuperMaket/getTopRecommendProducts', {parentCateId: parentCateId}));
                            this.props.dispatch(action('SuperMaket/getLowRecommendProducts', {parentCateId: parentCateId}));
                        }}
                    />
                    <View style={{flex: 1}}>
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
                    </View>
                </ScrollView>
            </View>
        )
    }

}

const styles = StyleSheet.create({

    banner: {
        width: width,
        height: 0.365 * width,
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