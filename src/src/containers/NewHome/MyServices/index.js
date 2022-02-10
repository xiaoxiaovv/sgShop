

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    ImageBackground,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
    FlatList,
    NativeModules,
    DeviceEventEmitter,
} from 'react-native';

import { Toast } from 'antd-mobile';
import { connect } from 'react-redux';
import { UltimateListView } from 'rn-listview';
import EStyleSheet from 'react-native-extended-stylesheet';
import Swiper from 'react-native-swiper';
import StorePrice from '../../../containers/Home/StorePrice';
import { toFloat } from '../../../utils/MathTools';
import {postAppJSON, getAppJSON, postAppForm} from '../../../netWork';
import Config from 'react-native-config';
import {goBanner} from '../../../utils/tools';

import { getEnviroment } from '../../../config';
import URL from '../../../config/url';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
import { GET, POST_JSON, GET_P, POST_FORM} from '../../../config/Http';
import {NavigationUtils} from "../../../dva/utils";
// 默认
let MenuData = [
    {title: '家政服务', icon: require('../../../images/jzfw.png')},
    {title: '售后服务', icon: require('../../../images/shfw_icon.png')},
    {title: '充值缴费', icon: require('../../../images/yjf_icon.png')},
    {title: '投资', icon: require('../../../images/lc_icon.png')},
    {title: '联名卡', icon: require('../../../images/lmk_icon.png')},
    {title: '顺逛白条', icon: require('../../../images/sgbt_icon.png')},    
];
if (URL.IS_STORE && Platform.OS === 'ios') {
    // 如果是上架包且是iOS平台,隐藏投资入口
    MenuData = [
        {title: '家政服务', icon: require('../../../images/jzfw.png')},
        {title: '售后服务', icon: require('../../../images/shfw_icon.png')},
        {title: '充值缴费', icon: require('../../../images/yjf_icon.png')},
        // {title: '投资', icon: require('../../../images/lc_icon.png')},
        {title: '联名卡', icon: require('../../../images/lmk_icon.png')},
        {title: '顺逛白条', icon: require('../../../images/sgbt_icon.png')},    
    ];
}

@connect(({users, address}) => ({...users, ...address}))
export default class Life extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            BannerData: null,
            LifeData: null,
            refreshingTag: false,
        };
      }
    componentDidMount() {
        console.log('-------componentDidMount----生活服务-----')
        this.loginSuccessListenner = DeviceEventEmitter.addListener('loginSuccess', () => {            
            // 请求数据
            this.getDataBanner();
            this.getDataLife();
       });
       this.locationChangeListenner = DeviceEventEmitter.addListener('locationChange', () => {            
        // 请求数据
        this.getDataBanner();
        this.getDataLife();
        });
        // 请求数据
        this.getDataBanner();
        this.getDataLife();
    }
    componentWillUnmount() {
        this.loginSuccessListenner.remove();
        this.locationChangeListenner.remove();
      }
    renderHeaderView = () => {
        // menu
        const menuCard = ({ menuItem, index }) => {
            return (
                <View key = {index} style={styles.menuCard}>
                    <TouchableOpacity
                        style={{alignItems: 'center'}}
                        onPress = {() => {
                            this.menuClick(menuItem);
                        }}>
                        <Image
                            style={styles.menuImg}
                            source = {menuItem.icon}
                        />
                        <Text style={styles.menuTitle}>{menuItem.title}</Text>
                    </TouchableOpacity>
                </View>
            );
        };
        const Menus = [];
        if (MenuData.length > 0) {
            MenuData.forEach( ( menuItem, index ) => {
                if (menuItem) {
                    const Card = menuCard({menuItem, index});
                    Menus.push(Card);
                }
            });
        }
        const easyLifeData = (IS_NOTNIL(this.state.LifeData) && this.state.LifeData.length>0) ? this.state.LifeData[0] : null;
        const VIPserveData = (IS_NOTNIL(this.state.LifeData) && this.state.LifeData.length>1) ? this.state.LifeData[1] : null;
        return (
            <View style={styles.headerContainer}>
                {/* banner */}

                    <View style={[styles.banner]}>
                    {
                    IS_NOTNIL(this.state.BannerData) &&
                        <Swiper
                            autoplay={true}
                            loop={true}
                            autoplayTimeout={3}
                            pagingEnabled={true}
                            showsPagination={true}
                            paginationStyle={{bottom: 10}}
                            dot={<View style={styles.dotStyle}/>}  // 未选中的圆点样式
                            activeDot={<View style={styles.activeDotStyle}/>} // 选中的圆点样式
                        >
                        { this.state.BannerData.map((item, index) =>
                                    (
                                    <TouchableWithoutFeedback
                                        key={`${index} + ${item.id}`}
                                        onPress={() => {
                                            goBanner(item, this.props.navigation)
                                        }}>
                                            <View>
                                                <Image source={{uri: item.imageUrl}} style={[styles.banner]} resizeMode={'cover'}/>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    ),
                                    )
                        }
                        </Swiper>
                    }
                    </View>
                {/* menu */}
                <View style={styles.menuContianer}>
                    {Menus}
                </View>
                {/* 轻松家 */}
                {
                    IS_NOTNIL(easyLifeData) &&
                    IS_NOTNIL(easyLifeData.products) &&
                    <View style={{backgroundColor: '#fff', marginBottom: 8}}>
                        <View style={styles.easyHomeHeader}>
                            <View style={styles.easyHomeHeaderLeft}>
                                <Text style={styles.prefixTitle}>轻松</Text>
                                <Text style={styles.suffixTitle}>家</Text>
                            </View>
                            <TouchableOpacity
                                activeOpacity = {0.8}
                                onPress={() => {
                                    this.props.navigation.navigate('GoodsList',{
                                        productCateId: '3315',
                                        }
                                    );
                                }}
                            >
                                <View style={styles.easyHomeHeaderRight}>
                                    <Text style={styles.moreTitle}>更多</Text>
                                    <Image source={require('../../../images/more.png')}
                                        style={[styles.moreImg]}
                                        resizeMode={'cover'}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {/* 轻松家轮播商品 */}
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            style={styles.flatListStyle}
                            data={easyLifeData.products}
                            keyExtractor = {(item, index) => ('index' + index + item)}
                            renderItem={({item}) => (
                                <TouchableOpacity activeOpacity={0.7} onPress={() => {
                                    this.goToProductDetail(item.id);
                                }}>
                                    <View style={styles.itemSty} key={item.id}>
                                        <Image style={styles.imgStyle} resizeMode = 'contain' source={{ uri: cutImgUrl(item.imageUrl, width / 4, width / 4) }}></Image>
                                        <Text numberOfLines={1} style={styles.titleStyle}>{item.name}</Text>
                                        <Text style={styles.priceStyle}>{'¥' + toFloat(item.price)}</Text>
                                        {this.props.isHost>0&&this.props.CommissionNotice&& <View style={styles.zhuanContainer}>
                                                <View style={styles.zhuanView}>
                                                <Text style={styles.zhuanText}>赚</Text>
                                                </View>
                                                <Text style={styles.zhuanPrice}>{'¥' + toFloat(item.commission)}</Text>
                                            </View>}
                                    </View>
                                </TouchableOpacity>
                            )}
                            getItemLayout={(data, index) => (
                                // 101 是被渲染 item 的高度/宽度(水平滑动的话)。
                            {length: 115, offset: 125 * index, index}
                            )}
                        />
                    </View>
                }
                {/* 专享服务头部 */}
                {
                    IS_NOTNIL(VIPserveData) &&
                    IS_NOTNIL(VIPserveData.products) &&
                    <View style={styles.easyHomeHeader}>
                        <View style={styles.easyHomeHeaderLeft}>
                            <Text style={styles.prefixTitle}>专享</Text>
                            <Text style={styles.suffixTitle}>服务</Text>
                        </View>
                    </View>
                }
            </View>
        );
    }

    render() {
          console.log(this.props.isHost);
        const VIPserveData = (IS_NOTNIL(this.state.LifeData) && this.state.LifeData.length>1) ? this.state.LifeData[1] : null;
        const products = (IS_NOTNIL(VIPserveData) && IS_NOTNIL(VIPserveData.products)) ? VIPserveData.products : [];
        return (
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={products}
                    keyExtractor = {(item, index) => ('index' + index + item)}
                    ListHeaderComponent={this.renderHeaderView()}
                    refreshing={this.state.refreshingTag}
                    onRefresh={() => {
                        this.getDataBanner();
                        this.getDataLife();
                    }}
                    // 分割线
                    ItemSeparatorComponent={() => (<View style={styles.ItemSeparatorSty}></View>)}
                    ListFooterComponent={() => (<View style={styles.ListFooterSty}></View>)}
                    ListEmptyComponent={() => (
                                        <View style={{flex: 1, alignItems: 'center'}}>
                                            <TouchableOpacity style={styles.refreshSty} activeOpacity={0.7} onPress={() => {
                                                            // 请求数据
                                                            this.getDataBanner();
                                                            this.getDataLife();
                                                }}>
                                                <Text style={{fontSize: 17, color: 'white'}}>重新请求数据</Text>
                                            </TouchableOpacity>
                                        </View>)}
                    renderItem={({item}) => (
                            <TouchableWithoutFeedback
                            key={`${item.id}`}
                            onPress={() => {
                                this.goToProductDetail(item.id);
                            }}
                            >
                            <View style={styles.vipContainer}>
                                <View>
                                    <Image style={styles.vipImg} source={{uri: item.imageUrl}} resizeMode={'cover'}/>
                                </View>
                                <Text numberOfLines={2} style={styles.vipTitle}>{item.name}</Text>
                                <View style={styles.vipPriceContainer}>
                                    <Text style={styles.vipPrice}>{'¥' + toFloat(item.price)}</Text>
                                    {this.props.isHost>0&&this.props.CommissionNotice && <View style={styles.zhuanContainer}>
                                            <View style={styles.zhuanView}>
                                            <Text style={styles.zhuanText}>赚</Text>
                                            </View>
                                            <Text style={styles.zhuanPrice}>{'¥' + toFloat(item.commission)}</Text>
                                        </View>}
                                </View>
                            </View>
                            </TouchableWithoutFeedback>
                )}
                    getItemLayout={(data, index) => (
                        // 101 是被渲染 item 的高度/宽度(水平滑动的话)。
                    {length: 0.693 * width, offset: 0.693 * width * index, index}
                    )}
                />
        );
    }
    // 商品详情
    goToProductDetail = (productId) => {
        this.props.navigation.navigate('GoodsDetail', { productId: productId });
    }
    menuClick = (menuItem) => {
        const title = menuItem.title;
        switch (title) {
            // 家政服务
            case '家政服务':
                this.props.navigation.navigate('GoodsList',{
                    productCateId: '3315',
                    }
                );
                break;
            // 售后服务
            case '售后服务':
                this.props.isLogin ?  this.goToEmc() : this.props.navigation.navigate('Login');
                break;
            // 云缴费
            case '充值缴费':
            this.props.isLogin ?  this.goToCloudPay() : this.props.navigation.navigate('Login');
                break;
            // 投资
            case '投资':
                this.props.isLogin ?  this.toManage() : this.props.navigation.navigate('Login');
            break;
            // 联名卡
            case '联名卡':
                // 联名卡按钮在iOS上因为审核原因需要隐藏
                this.goToApplyForCard();
                break;
            // 顺逛白条
            case '顺逛白条':
                this.props.isLogin ?  this.toApplyForWhite() : this.props.navigation.navigate('Login');
                break;
            default:
                break;
        }
    }
    // 去售后服务(原生活服务)界面
    goToEmc = async () => {
        if (this.props.isHost == -1) {
            this.props.navigation.navigate('Login');
        } else {
            try {
                // 获取生活服务的token
                const json =  await POST_JSON(URL.TOKEN_GET,null);
                if (json.success) {
                    const access_token = json.data;
                    if (access_token) {
                    /**
                     *调转视图方法
                        * @param1 isOffical {Integer} （1:正式环境；0:测试环境）
                        * @param2 access_token {String} 用户中心返回的access_token
                        * @param3 entryPoint {String} 进入EMC后直接进入某功能，例如“OldforNew”,可传空字符串""
                        */
                       NativeModules.ToolsModule.presentEmcView([getEnviroment(), access_token, '']);
                    } else {
                        Toast.fail('您当前账号暂无法访问此服务,请使用关联手机号登录。', 2);
                    }
                }else {
                    Toast.fail('您当前账号暂无法访问此服务,请使用关联手机号登录。', 2);
                }
              } catch (error) {
                Log(error);
              }
        }
    }
    // 去云缴费界面
    goToCloudPay = () => {
        const systemType = Platform.OS === 'ios' ? 'ios' : 'android';
        const userToken = dvaStore.getState().users.userToken;
        const cityId = this.props.cityId;
        // 打开云缴费界面
        const LivingUrl = URL.LIVING + '?flag='+userToken+'&systemType='+systemType+'&cityId='+cityId;
        console.log(LivingUrl);
        NativeModules.ToolsModule.presentH5View([LivingUrl, "生活缴费"]);
    }
    // 去理财界面
    toManage = () => {
        this.props.navigation.navigate('MyInvestment', { frontPage: 'Home' });
    }
    // 联名卡
    goToApplyForCard = () => {
        if (this.props.isHost == -1) {
            this.props.navigation.navigate('Login');
        } else {
            // 跳转到联名卡界面
            this.props.navigation.navigate('ApplyForCard');
        }
    }
    // 顺逛白条click
    toApplyForWhite = async () => {
        if (!dvaStore.getState().users.accessToken) {
            Toast.fail('您的当前帐号暂时无法访问此服务,请使用关联手机号登录', 2);
            return;
        }
        const userId = dvaStore.getState().users.ucId;
        const token = dvaStore.getState().users.accessToken;
        const res = await postAppJSON(Config.WHITE_SHOWS_QUERY_STATUS, {userId, token});
        if (res.success) {
            if (res.data.applyStatus === 2 ||
                res.data.applyStatus === '2' ||
                res.data.applyStatus === '3' ||
                res.data.applyStatus === 3) {
                // 跳转到applyForWhite页面
                this.props.navigation.navigate('BaiTiao');
            } else {
                // 申请中直接打开消费金融
                const backUrl = `${Config.API_URL}index.html`;
                const resData = await postAppForm(
                    `${Config.WHITE_SHOWS_APPLY}?backUrl=${backUrl}&token=${token}&userId=${userId}`,
                    {backUrl, userId, token},
                );
                if (resData.success) {
                    // 打开顺逛白条H5
                    this.props.dispatch(NavigationUtils.navigateAction("CustomWebView", {
                        customurl: resData.data.redirectUrl,
                        headerTitle: '顺逛白条',
                        flag: true,
                    }));
                }
                if (resData.errorCode === '-100') {
                    // 去登录页面
                    this.props.dispatch(NavigationUtils.navigateAction("Login",{}));
                }
            }
        }
        if (res.errorCode === 100) {
            this.props.navigation.navigate('Login');
        }
    }
    // 请求banner数据
    getDataBanner =  async () => {
        try {
            const json = await GET(URL.LIFEBANNER, {
                itemsId: 6,
            });
            if (json.success) {
                this.setState({
                            BannerData: json.data,
                        });
            } else {
                Toast.fail(json.message, 1);
            }
        } catch (err) {
            Log(err);
        }
    }
    // 请求Life数据
    getDataLife = async () => {

        try {
            // 请求数据
            this.setState({
                refreshingTag: true,
            });
            const json = await GET(URL.LIFESERVE, {
                provinceId: this.props.provinceId,
                cityId: this.props.cityId,
                regionId: this.props.areaId,
                streetId: this.props.streetId,
            });
            console.log('zhaoxincheng>>getDataLife:', json);
            this.setState({
                refreshingTag: false,
            });
            if (json.success) {

                this.setState({
                            LifeData: json.data,
                        });
            } else {
                Toast.fail(json.message, 1);
            }
        } catch (err) {
            Log(err);
        }
    }
}

const styles = EStyleSheet.create({
    ItemSeparatorSty: {
        width: width,
        height: '5rem',
        backgroundColor: '#eee',
    },
    ListFooterSty: {
        width: width,
        height: '8rem',
        backgroundColor: '#eee',
    },
    allCenter: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        backgroundColor: '#eee',
    },
    banner: {
        width: width,
        height: 0.48 * width,
    },
    dotStyle: { //未选中的圆点样式
        backgroundColor: 'rgba(255,255,255,.5)',
        width: '7rem',
        height: '7rem',
        borderRadius: 4.5,
        marginRight: 8,
    },
    activeDotStyle: {
        //选中的圆点样式
        backgroundColor: '#FFFFFF',
        width: '9rem',
        height: '9rem',
        borderRadius: 4.5,
        marginRight: 8,
    },
    menuContianer: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: 5,
        paddingBottom: 5,
        marginBottom: 9,
    },
    menuCard: {
        width: width / 3,
        height: '64rem',
        marginTop: 9,
        marginBottom: 9,
        alignItems: 'center'
    },
    menuImg: {
        width: '46rem',
        height: '46rem',
    },
    menuTitle: {
        marginTop: 6,
        fontSize: '12rem',
        color: '#666666',
    },
    easyHomeHeader: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderColor: '#eee',
    },
    easyHomeHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 16,
    },
    prefixTitle: {
        fontSize: '16rem',
        lineHeight: '20rem',
        color: '#FF6026',
        fontFamily: 'PingFangSC-Semibold',
    },
    suffixTitle: {
        fontSize: '16rem',
        lineHeight: '20rem',
        color: '#000000',
        fontFamily: 'PingFangSC-Semibold',
    },
    easyHomeHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16, 
    },
    moreTitle: {
        fontSize: '14rem',
        lineHeight: '20rem',
        color: '#999999',
        marginRight: -8,
    },
    moreImg: {
        width: '24rem',
        height: '24rem',
    },
    flatListStyle: {
        backgroundColor: '#fff',
        marginLeft: 10,
        marginRight: 4,
    },
    itemSty: {
        marginTop: 5,
        marginBottom: 5,
        marginRight: 5,
        borderWidth: 0.5,
        borderColor: '#E4E4E4',
    },
    imgStyle: {
        width: '113rem',
        height: '113rem',
    },
    titleStyle: {
        fontSize: '14rem',
        color: '#333333',
        maxWidth: '115rem',
        marginTop: 6,
        marginLeft: 5,
        fontFamily: 'PingFangSC-Medium',
    },
    priceStyle: {
        marginTop: 5,
        marginLeft: 5,
        fontSize: '15rem',
        color: '#FF6026',
        fontFamily: 'PingFangSC-Medium',
    },
    zhuanContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    zhuanView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 6,
        marginLeft: 5,
        marginBottom: 5,
        width: '18rem',
        height: '18rem',
        borderRadius: 9,
        backgroundColor: '#FF6026',
    },
    zhuanText: {
        fontSize: '9rem',
        color: '#FFF',
    },
    zhuanPrice: {
        marginLeft: 3,
        fontSize: '13rem',
        color: '#FF6026',
    },
    vipContainer: {
        width: width,
        padding: 16,
        backgroundColor: '#fff',
    },
    vipImg: {
        width: 0.915 * width,
        height: 0.453 * width,
    },
    vipTitle: {
        fontSize: '16rem',
        color: '#333333',
        maxWidth: 0.915 * width,
        marginTop: 10,
    },
    vipPriceContainer: {
        marginTop: 11,
        flexDirection: 'row',
        alignItems: 'center',
    },
    vipPrice: {
        fontSize: '20rem',
        color: '#FF6026',
        fontFamily: 'PingFangSC-Medium',
        marginRight: 8,
    },
    refreshSty: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '44rem',
        width: '90%',
        backgroundColor: '#2979FF',
        borderRadius: 10,
    },
});
