



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
} from 'react-native';

import { connect } from 'react-redux';
import { action, createAction, NavigationUtils } from './../../../dva/utils';

import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
const Sip = StyleSheet.hairlineWidth;
const PAGE_SIZE = 10;
import export_bg from './../../../images/export_bg.png';
import Call from './../../../images/call.png';

import { UltimateListView, UltimateRefreshView } from 'rn-listview';
import { NavBar, SafeView,FooterView } from './../../../components';
import L from "lodash";
import {ctjjService} from "../../../dva/service";
import {Color} from 'consts'


@connect()
export default class ExpertDetail extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            avatar: '',
            name: '',
            introduction: '',
            mobile: '',
            data: [],
        };
        this.header = this.header.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.onFetch = this.onFetch.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }
    componentWillMount() {
        // 请求头部内容 dva 操作, header 数据
        const params = this.props.navigation.state.params;
        const id = L.get(params, 'id');
        this.setState({id});
    }

    header = ()=>{
        return <View style={[styles.container]}>
            <ImageBackground style={[{ width: SWidth, height: 0.426 * SWidth}, styles.row]} source={export_bg}>
                <View style={{marginLeft: 18, marginTop: 26, height: 66, width:66, borderRadius:33, borderWidth:1, borderColor: '#C9CBCC'}}>
                    <Image style={[{height: 64, width: 64, borderRadius: 32}]} source={{uri: cutImgUrl(this.state.avatar || '', 80, 80)}}/>
                </View>
                <View style={{marginTop: 30, marginLeft: 18, marginRight: 16}}>
                    <View style={[styles.row, styles.aCenter, {
                        justifyContent: 'space-between', height: 30,
                        width: SWidth - 118
                    }]}>
                        <Text style={{color: '#333', fontSize: 18}}>{this.state.name || ''}</Text>
                        <View style={[styles.row, {height: 30, alignItems: 'flex-end'}]}>
                            <Image style={[{height: 15, width: 15}]} source={Call}/>
                            <Text style={{color: '#2979FF', fontSize: 14, marginLeft: 5}}>{this.state.mobile || ''}</Text>
                        </View>
                    </View>
                    <View style={[{width: SWidth - 118}]}>
                        <Text style={{color: "#666", fontSize:12, marginTop: 6, maxWidth: SWidth - 118, maxHeight: 0.2 * SWidth}} numberOfLines={5}>{this.state.introduction || ''}</Text>
                    </View>
                    </View>
            </ImageBackground>
            <View style={[{backgroundColor: '#fff'}]}>
                <View style={[styles.aCenter, styles.row,{height: 44}]}>
                    <View style={{height: 13, width: 3, backgroundColor: '#2979FF', marginLeft: 16}}/>
                    <Text style={{fontSize: 14, marginLeft: 8, color: '#333'}}>成功方案</Text>
                </View>
            </View>
        </View>
            };

    render() {
        return (
            <SafeView>
                <View style={[styles.container]}>
                    <NavBar title={'解决方案专家'}/>
                <UltimateListView
                    ref={ref => this.listView = ref}
                    // 头部视图
                    header={this.header}
                    style={{backgroundColor: '#fff'}}
                    onFetch={this.onFetch}
                    keyExtractor={(item, index) => `${index} - ${item}`} // this is required when you are using FlatList
                    refreshableMode={Platform.OS === 'ios' ? 'advanced' : 'basic'} // basic or advanced
                    // item视图
                    item={this.renderItem} // this takes three params (item, index, separator)
                    numColumns={1} // to use grid layout, simply set gridColumn > 1
                    // 尾部视图,当isFooter为true时,再设置footer视图,否则一直返回null
                    // tslint:disable-next-line:max-line-length
                    footer={()=>{return this.state.data.length > 0 && <FooterView textContainerStyle={styles.footer}/>}}
                    refreshableTitle='数据更新中……'
                    refreshableTitleRelease='释放刷新'
                    // // 下拉刷新箭头图片的高度
                    // arrowImageStyle={{ width: 80, height: 80, resizeMode: 'contain' }}
                    // dateStyle={{ color: 'lightgray' }}
                    // // 刷新视图的样式(注意ios必须设置高度和top距离相等,android只需要设置高度)
                    // refreshViewStyle={Platform.OS === 'ios' ? { height: 180, top: 100 } : { height: 180 }}
                    // // 刷新视图的高度
                    // refreshViewHeight={80}
                    // 视图滚动的方法
                    onScroll={this.onScroll}
                />


            </View>
            </SafeView>
        );
    }

    onScroll = ()=>{

    };
    onFetch = async (page = 1, startFetch, abortFetch)=>{
        try{
            const expert = await ctjjService.getExperts({channel: 1, id: this.state.id, pageIndex: page, pageSize: PAGE_SIZE});
            const success = L.get(expert, 'success', false);
            const data = L.get(expert, 'data', false);
            if(success && data){
                if(page === 1){
                    const avatar = L.get(data, 'avatar');
                    const name = L.get(data, 'name', '');
                    const introduction = L.get(data, 'introduction', '');
                    const mobile = L.get(data, 'mobile', '');
                    const details = L.get(data, 'details', []);
                    if(details.length > 0){
                        this.setState({data: details});
                    }
                    this.setState({avatar,name,introduction,mobile});
                }
                const details = L.get(data, 'details', []);
                startFetch(details, PAGE_SIZE);
            }else{
                abortFetch();
            }
        }catch (e) {
            console.log(e);
            abortFetch();
        }

    };
    renderItem = (item, index)=>{
        return <TouchableOpacity activeOpacity={0.9}  key={index} onPress={()=>{
            this.props.dispatch(NavigationUtils.navigateAction("CaseDetail", {id: item.id, title: item.name}));
        }}>
            <ImageBackground style={{height: SWidth * 160/343, width: SWidth - 32, marginTop: 4, marginHorizontal: 16}} source={{uri: cutImgUrl(item.imageUrl || '', 200, 200)}}>
                <View style={[styles.jCenter, {height: 28, backgroundColor: 'rgba(0,0,0,0.5)', position:'absolute', left:0, right:0, bottom:0}]}>
                    <Text style={{fontSize: 14, color: '#fff', marginLeft: 9}}>{item.name || ''}</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    };
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
