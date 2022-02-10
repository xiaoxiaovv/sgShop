



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
    TouchableOpacity,
    FlatList,Modal
} from 'react-native';

import { connect } from 'react-redux';
import { action, createAction, NavigationUtils } from './../../../dva/utils';
import { NavBar, SafeView, FooterView } from './../../../components';
import ShareModle from './../../../components/ShareModle';
import { ctjjService } from './../../../dva/service';
import L from 'lodash';
const PAGE_SIZE = 10;

const Sip = StyleSheet.hairlineWidth;
import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

import nodata from './../../../images/ic_haier_6.png';

import { UltimateListView, UltimateRefreshView } from 'rn-listview';
import {Color} from 'consts';


/*
* 根据商品ID查询方案列表
 */
@connect(({ctjjModel, users}) => ({...ctjjModel, ...users}))
export default class ProductCases extends Component {
    onFetch = async (page = 1, startFetch, abortFetch)=>{
        if (this.state.productId) {
            console.log('--------this.state.productId-------');
            console.log(this.state.productId);
            try{
                const list = await ctjjService.getProductList({channel: 1, productId: this.state.productId, pageIndex: page, pageSize: PAGE_SIZE});
                const success = L.get(list, 'success', false);
                const data = L.get(list, 'data.details', []);
                if(success){
                    if(data){
                        this.setState({data});
                        startFetch(data, PAGE_SIZE);
                    }else{
                        startFetch([], PAGE_SIZE);
                    }
                }else{
                    abortFetch();
                }
            }catch (e) {
                console.log(e);
                startFetch([], PAGE_SIZE);
            }
        }else{
            console.log('--------this.state.productId = null-------');
            startFetch([], PAGE_SIZE);
        }
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            productId: '',
            showShare: false,
            data: [],
        };

        this.onFetch = this.onFetch.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.getShareContent = this.getShareContent.bind(this);
    }

    componentWillMount() {

    }

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
        const title = this.state.title;
        const content = this.state.title;
        const pic = this.state.shareIcon;
        const url = `${URL.get_ctjj_share_fullhousesolution}${this.state.id}`;

        return [ title, content, pic, url, 0 ];
    };
    renderItem = (item, index)=>{
        return <View style={{marginHorizontal: 16}}>
            <TouchableOpacity activeOpacity={0.9} key={index} onPress={()=>{
                    this.props.dispatch(NavigationUtils.navigateAction("CaseDetail", {id: item.id, title: item.name}));
                }}>
                    <ImageBackground style={{height: SWidth * 160/343, width: SWidth - 32, marginTop: 4}} source={{uri: cutImgUrl(item.imageUrl || '', 200, 200)}}>
                        <View style={[styles.jCenter, {height: 28, backgroundColor: 'rgba(0,0,0,0.5)', position:'absolute', left:0, right:0, bottom:0}]}>
                            <Text style={{fontSize: 14, color: '#fff', marginLeft: 9}}>{item.name || ''}</Text>
                        </View>
                    </ImageBackground>
                </TouchableOpacity>
        </View>
    };

    componentDidMount() {
        // 请求头部内容 dva 操作, header 数据
        const params = this.props.navigation.state.params;
        const id = L.get(params, 'productId');
        this.setState({productId: id}, ()=>{
            this.listView.refresh();
        });
    }

    render() {
        return (
            <SafeView>
                <View style={[styles.container]}>
                <NavBar title={'家电成套解决方案'}
                //         rightFun={()=>{
                //     this.setState({onPause: true});
                //     if(this.props.isLogin){
                //         this.setState({showShare: true});
                //     }else {
                //         dvaStore.dispatch(createAction('router/apply')({
                //             type: 'Navigation/NAVIGATE', routeName: 'Login',
                //         }));
                //     }
                // }}
                />
                <UltimateListView
                    ref={ref => this.listView = ref}
                    // 头部视图
                    header={this.header}
                    style={{backgroundColor: '#fff'}}
                    onFetch={this.onFetch}
                    keyExtractor={(item, index) => `${index} - ${item}`} // this is required when you are using FlatList
                    refreshableMode={Platform.OS === 'ios' ? 'advanced' : 'basic'} // basic or advanced
                    item={this.renderItem} // this takes three params (item, index, separator)
                    numColumns={1} // to use grid layout, simply set gridColumn > 1
                    emptyView={() => { return <View style={[{height: SHeight - 64, width: width}, styles.allCenter]}>
                        <Image
                        style={{height: 200,width: 200, resizeMode: 'contain'}}
                        source={nodata}
                    />
                        <Text style={{ color: '#333333', lineHeight: 20, textAlign: 'center' }}>暂无数据</Text></View> }}
                    footer={()=>{return this.state.data.length > 0 && <FooterView textContainerStyle={styles.footer}/>}}
                />
                    <ShareModle
                        visible={this.state.showShare} content={this.getShareContent()}
                        onCancel={() => this.setState({ showShare: false })}
                        hiddenEwm
                    />
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
    row:{
        flexDirection: 'row'
    },
    banner: {
        width: SWidth, height: 0.48 * SWidth
    },
    footer: {
        backgroundColor: Color.WHITE,
    },
});
