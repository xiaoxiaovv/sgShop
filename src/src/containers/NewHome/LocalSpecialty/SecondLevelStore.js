

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
    View, ScrollView,
    TouchableOpacity, Modal,
    BackHandler, FlatList
} from 'react-native';

import { UltimateListView } from 'rn-listview';
import { connect } from 'react-redux';
import ShareModle from '../../../components/ShareModle';

import {Drawer, List} from 'antd-mobile';
import FilterList from '../../../components/FilterList';

import {GET} from '../../../config/Http';
import URL from '../../../config/url';

const Sip = StyleSheet.hairlineWidth;
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

import arrow0 from '../../../images/arrow_state_0.png';
import arrow1 from '../../../images/arrow_state_1.png';
import arrow2 from '../../../images/arrow_state_2.png';
import noProduct from '../../../images/nothing.png';

import filter0 from '../../../images/filter_state_0.png';
import filter1 from '../../../images/filter_state_1.png';
import cart from '../../../images/shop_cart_gray.png';
import zhuan from '../../../images/zhuan.png';

import CustomButton from 'rn-custom-btn1';

import { NavBar, SafeView, IsIphoneX } from '../../../components/index';
import L from "lodash";
import {cutImgUrl, px} from "../../../utils/index";
import {NavigationUtils} from "../../../dva/utils/index";
import {createAction} from "../../../utils";

const PAGE_LIMIT = 10;


@connect(({ctjjModel, LocalSpecialtyModel, address, users, cartModel}) => ({...ctjjModel, ...LocalSpecialtyModel, ...address, ...users, ...cartModel}))
export default class SecondLevelStore extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            title: '特产馆',
            menuBtns: [],
            sharePic: '',

            showShare: false,
            docked: false,
            selectIndex: 2,
            headerData: [],
            data: [],
            regionId: 0,
            YJArrow: 1,
            JGArrow: 1,
            selectFilter: 1,
            productCateId: 0,
            attributeId: '',


            qs: 'saleDesc',
            filterData: '',

        };
        this.menuList;
        this.handleDrawerClose = this.handleDrawerClose.bind(this);
        this.loadData = this.loadData.bind(this);
        this.renderItemView = this.renderItemView.bind(this);

    }
    componentWillMount() {
        // 请求头部内容 dva 操作, header 数据
        const params = this.props.navigation.state.params;
        const regionId = L.get(params, 'regionId', 77);
        this.setState({regionId}, ()=>{
            this.loadData();
        });
    }
    componentDidMount() {
        // 请求头部内容 dva 操作
        BackHandler.addEventListener('hardwareBackPress', this.backHandle);

    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backHandle);
    }

    loadData = async () => {
        try {
            // 加载 顶部 按钮

            let regionId = this.state.regionId;
            const { success, data } = await GET(URL.get_chara_cityChara, {regionId});
            if (!success || !data) { return; }
            let classify = L.get(data, 'classify', []);
            let pathName = L.get(data, 'pathName');
            let sPic = L.get(data, 'sPic');
            let menuBtns = JSON.parse(classify);
            this.setState({ title: pathName, menuBtns, productCateId: menuBtns[0]['cId'], sharePic: sPic }, () => {
                this.goodsListView.refresh();
            });
        } catch (error) {
            Log(error);
        }
    };

    getShareContent = () => {
        /**
         * 分享到微信好友
         * @param command 数组
         * @param title {String} 分享标题
         * @param content {String} 分享内容
         * @param pic {String} 分享图片url
         * @param url {String} 分享内容跳转链接
         * @param type {Integer} 分享类型 0 链接分享 1 多图分享（目前仅支持微信和微博，且无成功回调） 2 单图分享
         * 回调Promises
         */
        const { programDetail, mid } = this.props;
        const title = this.state.title;
        const content = '找特产,来顺逛,质量可靠价格亲民,特产汇欢迎您的到来~';
        const pic = this.state.sharePic;
        const url = `${URL.get_chara_share_secondlevelstore}/${this.state.regionId}/${mid}`;

        return [ title, content, pic, url, 0 ];
    };
    backHandle = ()=>{
        if (this.state.docked) {
            this.setState({
                docked: false,
            });
            return true;
        }
        return false;
    };
    handleMenuItemClicked = (index) => {
        if(index == 1){
            // 佣金
            if(this.state.selectIndex == index){
                // 再次点击
                this.setState({selectIndex: index, qs: this.state.YJArrow == 2 ? "commission":"commissionDesc", YJArrow: this.state.YJArrow == 1 ? 2: 1}, ()=>{
                    console.log(this.state.qs);
                    this.goodsListView.refresh();
                });
            }else{
                this.setState({selectIndex: index, YJArrow: 2, qs: "commissionDesc"}, ()=>{
                    console.log(this.state.qs);
                    this.goodsListView.refresh();
                });
            }
        }else if(index == 2){
            // 销量
            if(this.state.selectIndex != index){
                this.setState({selectIndex: index, qs: 'saleDesc'}, ()=>{
                    console.log(this.state.qs);
                    this.goodsListView.refresh();
                });
            }
        }else if(index == 3){
            // 价格
            if(this.state.selectIndex == index){
                // 再次点击
                this.setState({selectIndex: index, qs: this.state.JGArrow == 2 ? "price":"priceDesc", JGArrow: this.state.JGArrow == 1 ? 2: 1}, ()=>{
                    console.log(this.state.qs);
                    this.goodsListView.refresh();
                });
            }else{
                this.setState({selectIndex: index, JGArrow: 2, qs: "priceDesc"}, ()=>{
                    console.log(this.state.qs);
                    this.goodsListView.refresh();
                });
            }
        }else if(index == 4){
            // 筛选
            this.setState({docked: true});
        }
    };
    renderItemView = ({item, index})=>{
      return <View style={[{height: 40, marginLeft: 10}, styles.allCenter]}>
          <TouchableOpacity onPress={()=>{
              this.setState({ productCateId: item.cId }, () => {
                  this.goodsListView.refresh();
              });
          }}>
          <View style={[{height: 28, paddingHorizontal: 16, borderRadius: 15, borderWidth: Sip, borderColor: this.state.productCateId == item.cId ?"#2979FF":'#999'}, styles.jCenter, this.state.productCateId == item.cId && {backgroundColor: '#2979FF'}]}>
          <Text style={{color: this.state.productCateId == item.cId ?"#fff":"#999", fontSize: 12}}>{item.name}</Text>
          </View>
          </TouchableOpacity>
      </View>
    };
    renderMenu = ()=>{
        const mWidth = (this.props.isHost > 0 ? 0.25: 0.33) * SWidth;
        return <View>
            <View style={[styles.jCenter, {height: 40,}]}>
                <FlatList
                    ref={(ref)=>{this.menuList = ref}}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    data={this.state.menuBtns}
                    keyExtractor={(item, index) => {return index}}
                    renderItem={this.renderItemView}
                    extraData={this.state}
                />
            </View>
            <View style={[{height: 40, backgroundColor: '#fff'}, styles.row, styles.aCenter]}>
                {this.props.isHost > 0 && <View style={[{height: 30, width: mWidth}, styles.allCenter]}>
                    <CustomButton
                        title={'佣金'}
                        style={[styles.menuitem, this.state.selectIndex === 1 && styles.menuitemSelected]}
                        innerStyle={{flexDirection: 'row-reverse'}}
                        textStyle={this.state.selectIndex === 1 ? {color: '#fff'} : {}}
                        imageStyle={{marginLeft: -2, width: 10, height: 10, resizeMode: 'contain'}}
                        image={this.state.selectIndex === 1 ? (this.state.YJArrow === 1 ? arrow1 : arrow2) : arrow0}
                        onPress={() => {
                            this.handleMenuItemClicked(1)
                        }}
                    />
                </View>}
                <View style={[{height: 30, width: mWidth}, styles.allCenter]}>
                    <CustomButton
                        title={'销量'}
                        style={[styles.menuitem, this.state.selectIndex === 2 && styles.menuitemSelected]}
                        innerStyle={{flexDirection: 'row-reverse'}}
                        textStyle={this.state.selectIndex === 2 ? {color: '#fff'} : {}}
                        imageStyle={{marginLeft: -2, width: 10, height: 10, resizeMode: 'contain'}}
                        onPress={() => {
                            this.handleMenuItemClicked(2)
                        }}
                    />
                </View>
                <View style={[{height: 30, width: mWidth}, styles.allCenter]}>
                    <CustomButton
                        title={'价格'}
                        style={[styles.menuitem, this.state.selectIndex === 3 && styles.menuitemSelected]}
                        innerStyle={{flexDirection: 'row-reverse'}}
                        textStyle={this.state.selectIndex === 3 ? {color: '#fff'} : {}}
                        imageStyle={{marginLeft: -2, width: 10, height: 10, resizeMode: 'contain'}}
                        image={this.state.selectIndex === 3 ? (this.state.JGArrow === 1 ? arrow1 : arrow2) : arrow0}
                        onPress={() => {
                            this.handleMenuItemClicked(3)
                        }}
                    />
                </View>
                <View style={[{height: 30, width: mWidth}, styles.allCenter]}>
                    <CustomButton
                        title={'筛选'}
                        style={[styles.menuitem, this.state.selectIndex === 4 && styles.menuitemSelected]}
                        innerStyle={{flexDirection: 'row-reverse'}}
                        textStyle={this.state.selectIndex === 4 ? {color: '#fff'} : {}}
                        imageStyle={{marginLeft: -2, width: 10, height: 10, resizeMode: 'contain'}}
                        image={this.state.selectIndex === 4 ? filter1 : filter0}
                        onPress={() => {
                            this.handleMenuItemClicked(4)
                        }}
                    />
                </View>
            </View>
        </View>
    };
    handleDrawerClose = (filterString) => {
        if (filterString) {
            this.setState({
                selectIndex: 4,
                docked: false,
                filterData: filterString,
                subFilter: filterString,
            }, () => {
                this.goodsListView.refresh();
            });
        } else {
            this.setState({docked: false});
        }
    };

    onGoodsFetch = async (page = 1, startFetch, abortFetch)=>{

        try {

            let query = {
                pageIndex: page,
                pageSize: PAGE_LIMIT,
                storeMemberId: this.props.mid,
                qs: this.state.qs,
                filterData: this.state.filterData,

                productCateId: this.state.productCateId,
                provinceId: this.props.provinceId,
                cityId: this.props.cityId,
                districtId: this.props.areaId,
                streetId: this.props.streetId,
                pageId: this.state.regionId,
            };

            const result = await GET(URL.get_chara_loadItem, query);

            let products = [];

            if (result.success) {
                if (result.data.productCateIds) {
                    this.setState({productCateId: result.data.productCateIds});
                }
                if (result.data.isCanSyncGetPrice) {
                    // 查询价格在渲染列表
                    const priceList = await GET(URL.get_price_by_traceid, {traceId: result.data.traceId}, {}, 25000, true);
                    const {success: comSuccess} = priceList;
                    let productList1 = priceList.products;
                    if (!comSuccess || !productList1) {
                        return abortFetch();
                    }
                    let productList0 = result.data.productList;
                    for (let i = 0; i < productList0.length; i++) {
                        let item0 = productList0[i];
                        for (let j = 0; j < productList1.length; j++) {
                            let item1 = productList1[j];
                            if (item0['productId'] == item1['productId']) {
                                products.push(Object.assign({}, item0, item1));
                                break;
                            }
                        }
                    }

                } else {
                    products = result.data.productList;
                }
                startFetch(products, PAGE_LIMIT);
            }else{
                abortFetch();
            }
            // abortFetch();
        } catch (err) {
            abortFetch(); // manually stop the refresh or pagination if it encounters network error
            Log(err);
        }

    };
    renderGoodsItem = (item, index) => {
        return (
            <TouchableOpacity activeOpacity={0.9} onPress={()=>{
                this.props.navigation.navigate('GoodsDetail',
                    {
                        productId: item.productId,
                        productFullName: item.productFullName,
                        swiperImg: item.defaultImageUrl,
                        price: item.finalPrice || item.defaultPrice,
                    });
            }}><View key={index} style={{
                width: 0.5 * (SWidth - 15),
                // height: 0.5 * (SWidth - 15) * 226 / 180,
                marginTop: 5,
                marginLeft: 5,
                backgroundColor: '#fff',
            }}>
                <Image style={{height: 0.5 * (SWidth - 15) - 32, width: 0.5 * (SWidth - 15) - 32, marginTop: 16,
                    marginLeft:16}}
                       source={{uri: cutImgUrl(item.defaultImageUrl || '', 200, 200, true)}}
                       resizeMode={'cover'}/>
                <View style={[styles.jCenter, {marginLeft: 16, marginTop: 16}]}>
                    <Text style={{maxWidth: 0.5 * (SWidth - 15) - 32, fontSize: 14, lineHeight: 20, color: '#333'}}
                          numberOfLines={1}>{item.productFirstName || ''}</Text>
                    <Text style={{maxWidth: 0.5 * (SWidth - 15) - 32, fontSize: 12, lineHeight: 20, color: '#333'}}
                          numberOfLines={1}>{item.productSecondName || ''}</Text>
                    <Text style={{maxWidth: 0.5 * (SWidth - 15) - 32, fontSize: 14, lineHeight: 20, color: '#f40'}}
                          numberOfLines={1}>{`¥ ${item.finalPrice || item.defaultPrice}`}</Text>
                    {this.props.isHost > 0 ? this.props.CommissionNotice && <ImageBackground
                        resizeMode='stretch'
                        source={zhuan}
                        style={{
                            paddingLeft: 17,
                            paddingTop: 2,
                            width: 80,
                            marginLeft: 2,
                            height: 20,
                            marginBottom: 8
                        }}
                    >
                        <Text style={{maxWidth: 0.5 * (SWidth - 15) - 72, fontSize: 14, lineHeight: 20, color: '#fff'}}
                              numberOfLines={1}>{`¥ ${item.commission}`}</Text>
                    </ImageBackground> : null}
                </View>
            </View>
            </TouchableOpacity>
        );
    };
    onScroll = ( e ) => {
        // 获取视图Y轴偏移量
        const offset = e.nativeEvent.contentOffset.y;


        if (offset > 110) {
            this.button.setNativeProps({ opacity: 1.0 });
            //   this.navbar.getWrappedInstance().setNativePropsee({NavBgColor: 'rgba(255, 255, 255,' + 1.0 + ')', BarStyleLight: false});
        } else {
            this.button.setNativeProps({ opacity: 0 });
            //      this.navbar.getWrappedInstance().setNativePropsee({NavBgColor: 'rgba(255, 255, 255,' + 0 + ')', BarStyleLight: true});
        }

    };
    render() {
        return (
            <SafeView>
                <View style={[styles.container]}>

                    <Drawer
                        position='right'
                        style={{height, zIndex: 3, backgroundColor: '#fff'}}
                        sidebar={<FilterList
                            attributeId={this.state.attributeId}
                            categoryId={this.state.productCateId}
                            keyword={''}
                            close={(filterString) => this.handleDrawerClose(filterString)}/>}
                        open={this.state.docked}
                        onOpenChange={(isopen) => {
                            this.setState({
                                docked: isopen,
                            });
                        }}
                    >
                        <NavBar title={this.state.title || '特产馆'} rightFun={()=>{
                            if(this.props.isLogin){
                                this.setState({showShare: true});
                            }else {
                                dvaStore.dispatch(createAction('router/apply')({
                                    type: 'Navigation/NAVIGATE', routeName: 'Login',
                                }));
                            }
                        }}/>

                        {this.renderMenu()}
                        <UltimateListView
                            ref={(ref) => this.goodsListView = ref}
                            onFetch={this.onGoodsFetch}
                            keyExtractor={(item, index) => `keys${index}`}
                            refreshableMode={Platform.OS === 'ios' ? 'advanced' : 'basic'}
                            item={this.renderGoodsItem}
                            numColumns={2}
                            emptyView={() =>
                                <View style={{alignItems: 'center', width: '100%'}}>
                                    <View  style={{alignItems: 'center', width: '100%', marginTop: 30}}>
                                        <Image source={noProduct} style={{width: 100, height: 120}} resizeMode={'contain'}/>
                                        <Text style={{marginTop: 30, color: '#999', fontSize: 16}}>暂无特产</Text>
                                    </View>
                                </View>
                            }
                            onScroll={this.onScroll}
                        />
                        <TouchableOpacity
                            style={[{bottom: 116, position: 'absolute', right: 10, height: 50, width: 50, backgroundColor: '#faf0e4', borderRadius:25}, styles.allCenter]}
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
                        <TouchableOpacity
                            style={{position: 'absolute', bottom: 50, right: 10, opacity: 0,}}
                            onPress={() => this.goodsListView.scrollToOffset(0, 0)}
                            ref={ref => this.button = ref}
                        >
                            <Image style={{height: 50, width: 50}} source={require('../../../images/icon_totop.png')} />
                        </TouchableOpacity>
                    </Drawer>
                </View>
                <ShareModle
                    visible={this.state.showShare} content={this.getShareContent()}
                    onCancel={() => this.setState({ showShare: false })}
                    hiddenEwm
                />
            </SafeView>
        );
    }
}

const LEFTWIDTH = 90;
const RIGHTITEMWIDTH = (width - 90 - 2) / 3.0;
const barHeight = IsIphoneX ? 122 : 64;
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
    row:{
        flexDirection: 'row'
    },
    banner: {
        width: SWidth, height: 0.48 * SWidth
    },
    selectedBtn: {
        height: 23,
        width: 22,
        // paddingLeft: 10,
        // backgroundColor: 'red',
    },
    selectedImg: {
        width: 16,
        height: 16,
    },
    menuitem: {
        height: 26,
        borderTopLeftRadius: 13,
        borderTopRightRadius: 13,
        borderBottomLeftRadius: 13,
        borderBottomRightRadius: 13,
    },
    menuitemSelected: {
        backgroundColor: '#2979ff',
    },


    categoryContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    viewForTextStyle: {
        height: 50,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'orange',
    },
    textStyle: {
        fontFamily: 'Cochin',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000',
    },
    leftList: {
        width: LEFTWIDTH,
        height: height - barHeight,
        borderRightColor: '#D3D3D3',
        borderRightWidth: 0.5,
    },
    leftRow: {
        width: LEFTWIDTH,
        height: 50,
        alignItems: 'center',
        // justifyContent: 'center',
    },
    leftRowLine: {
        width: 3,
        height: 20,
        backgroundColor: '#2D69FA',
        marginRight: 5,
        marginLeft: 5,
    },
    leftNormalLine: {
        width: 3,
        height: 20,
        marginRight: 5,
        marginLeft: 5,
    },
    selectText: {
        color: '#2D69FA',
        fontSize: 15,
    },
    leftRowText: {
        color: '#333333',
        fontSize: 13,
        marginRight: 6,
    },
    rightRow: {
        width: width - LEFTWIDTH,
    },
    topView: {
        width: width - LEFTWIDTH,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    rightTopLine: {
        width: 30,
        height: 1,
        backgroundColor: 'black',
    },
    topText: {
        fontWeight: '300',
        fontSize: 13,
        marginLeft: 16,
        marginRight: 16,
        textAlign: 'center',
    },
    rightRowBottom: {
        width: width - LEFTWIDTH,
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    rightRowItem: {
        width: RIGHTITEMWIDTH,
    },
});
