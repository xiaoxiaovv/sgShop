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
    View, ScrollView,
    TouchableOpacity,
    NativeModules,
    DeviceEventEmitter,
} from 'react-native';

import {connect} from 'react-redux';
import {action, createAction, NavigationUtils,} from './../../../dva/utils';

import {UltimateListView, UltimateRefreshView} from 'rn-listview';

import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

const Sip = StyleSheet.hairlineWidth;
const PAGE_SIZE = 10;


import more from './../../../images/arrow_right_w.png';
import defaultIcon from '../../../images/userIcon.jpg';
import bg from './../../../images/bgbgbg.png';
import location from './../../../images/location_ct.png';
import zan from './../../../images/zan.png';
import playicon from './../../../images/playicon.png';
import {ctjjService} from "../../../dva/service";
import L from "lodash";
import {FooterView,Banners} from '../../../components';

@connect(({ctjjModel, users, address}) => ({...ctjjModel, ...users, ...address}))
export default class CTJJ extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            title: '我的智慧生活',
            data: [],
            first: true,
        };
        this.swiper;
        this.listView;
        this.locationChangeListenner;
        this.init = this.init.bind(this);
        this.header = this.header.bind(this);
        this.onFetch = this.onFetch.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.calculatePraise = this.calculatePraise.bind(this);
        this.renderPagination = this.renderPagination.bind(this);
    }

    componentDidMount() {
        // console.log('-------componentDidMount----成套家电-----');
        // 请求头部内容 dva 操作
        // this.props.dispatch(action('ADModel/getADs'));
        this.init();
        // 初始化加载, banner 视频 附近 体验店
        // 后续做 loding 页时,在还没有数据时,先显示 Loading Placeholder
        // this.locationChangeListenner = DeviceEventEmitter.addListener('locationChange', () => {
        //     // 加载信息弹窗
        //     this.props.dispatch({
        //         type: 'ctjjModel/getNearby',
        //         payload: {},
        //         callback: () => {
        //             this.setState({first: true}, ()=>{
        //                 this.setState({first: false});
        //             });
        //         }
        //     });
        // });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.cityId!==this.props.cityId) {
            this.props.dispatch(action('ctjjModel/getNearby'));
        }
    }

    componentWillUnmount() {
        // this.locationChangeListenner.remove();
    }

    init = () => {
        console.log('-------init-----');
        this.props.dispatch(action('ctjjModel/getVideos'));
        // this.props.dispatch(action('ctjjModel/getNearby'));
        this.props.dispatch({
            type: 'ctjjModel/getMenuCases',
            payload: {},
            callback: () => {
                if(this.state.first){
                        console.log('------first-init-----');
                        // this.listView.refresh();
                        this.setState({first: false})
                }
            }
        });
    };


    renderPagination = (indexSelect, total) => {
        const { scenes } = this.props;
        return (
                <View style={[styles.row, styles.allCenter, {
                    height: 30,
                    position: 'absolute',
                    bottom: -1,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(255,255,255,0.4)'
                }]}>
                    {scenes.map((item, index) => {
                        return <View key={index} style={[styles.allCenter, {
                            width: SWidth / scenes.length,
                            height: 28,
                            backgroundColor: indexSelect == index ? 'rgba(41,121,255,0.7)' : 'rgba(255,255,255,0.4)'
                        }]}>

                                <View style={[styles.allCenter, {
                                    width: SWidth / scenes.length,
                                    height: 14,
                                    borderLeftWidth: (index > 0 && indexSelect != index && (indexSelect+1) != index) ? 1 : 0,
                                    borderLeftColor: '#999999',
                                }]}>
                                    <Text style={{
                                        color: indexSelect == index  ? "#fff" : "#666666",
                                        fontSize: 13,
                                        maxWidth: SWidth / scenes.length
                                    }} numberOfLines={1}>{item.name || ''}</Text>
                                </View>

                        </View>
                    })}
                </View>
        )
    };
    header = () => {
        const {menus, menusTitle, recommendsTitle, recommends, videoTitle, videos, nearby, recommendId, scenes} = this.props;
        return <View style={[styles.container]}>
          <Banners
            renderDots={(current,count)=>this.renderPagination(current,count)}
            style={styles.banner}
            onBarnnerPress={(item) => {
              this.props.dispatch(NavigationUtils.navigateAction('ScenePage',{scenesId: item.id}));
              NativeModules.StatisticsModule.track('Zhipitclick', {Modulename: item.name, UserId: L.get(this.props, 'mid', '游客')});
            }
            }
            bannerData={scenes}
          />

            {menus.length > 0 && <View style={{backgroundColor: "#fff", marginTop: 8}}>
                <ImageBackground style={[styles.allCenter, {height: 50, width: SWidth}]} source={bg}>
                    <Text style={{fontSize: 16, color: '#333'}}>{menusTitle || ''}</Text>
                </ImageBackground>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingBottom: 10}}>
                    {menus.map((item, index) => {
                        return <TouchableOpacity activeOpacity={0.9} key={index} onPress={() => {
                            // this.props.dispatch(action('home/onShowTab'));
                            if(index === 7){
                                this.props.dispatch(NavigationUtils.navigateAction("Familytry"));
                                NativeModules.StatisticsModule.track('Zhimoduleclick', {PitName: '全景VR', UserId: L.get(this.props, 'mid', '游客')});
                            }else{
                                this.props.dispatch(NavigationUtils.navigateAction("AllCases", {
                                    id: item.id,
                                    title: item.name,
                                    imageUrl: item.iconUrl || ''
                                }));
                                NativeModules.StatisticsModule.track('Zhimoduleclick', {PitName: item.name, UserId: L.get(this.props, 'mid', '游客')});
                            }
                        }}><View
                            style={{height: 85, width: SWidth * 0.25, justifyContent: 'center', alignItems: 'center'}}>
                            <Image style={{height: 50, width: 50, borderRadius: 5}} source={{uri: cutImgUrl(item.iconUrl || '', 80, 80)}}/>
                            <Text style={{marginTop: 5, fontSize: 12, color: '#666', maxWidth: SWidth * 0.25 - 10}} numberOfLines={1}>{item.name || ""}</Text>
                        </View>
                        </TouchableOpacity>
                    })}
                </View>
            </View>}

            {videos.length > 0 && <View style={{height: 200, backgroundColor: "#fff", marginTop: 8}}>
                <TouchableOpacity activeOpacity={0.9} onPress={() => {
                    // alert(`社区正在开发中---视频体验更多-不用提 bug`);
                    // author
                    // avatar
                    //     "http://cdn22.devehaier.com/file/5a3c9e1d246116421b7f4c60.png"
                    // id
                    // imageUrl
                    // praise
                    // storyName
                }}>
                    <ImageBackground style={[styles.allCenter, {height: 50, width: SWidth}]} source={bg}>
                        <Text style={{fontSize: 16, color: '#333'}}>视频体验</Text>
                        {/*<Image source={more} style={{height: 15, width: 15, position: 'absolute', right: 10}} resizeMode={'contain'}/>*/}
                    </ImageBackground>
                </TouchableOpacity>
                <View style={{height: 150, flexDirection: 'row'}}>
                    {videos.map((item, index) => {
                        return <TouchableOpacity activeOpacity={0.9} key={index} onPress={async () => {
                            // alert(`社区正在开发中-不用提 bug--${item.storyName}`);
                            // this.props.dispatch(NavigationUtils.navigateAction("SuperSecondView", {
                            //     // url: '/html/mine/mine.html',
                            //     url: '/html/topic/topic_details.html',
                            //     id: item.id,
                            //     type: 3
                            // }));
                            const token = await global.getItem('userToken');
                            this.props.dispatch(NavigationUtils.navigateAction("SuperSecondView", {
                                url: '/html/topic/topic_details.html',
                                id: Number(item.id),
                                token: token,
                                type: 1
                            }));
                        }}>
                            <View style={{
                                height: 150,
                                // width: SWidth * 0.5,
                                // justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <View style={{height: 150, width: 0.5 * (SWidth - 45), marginLeft: 15}}>
                                    <ImageBackground
                                        style={[{width: 0.5 * (SWidth - 45), height: 0.5 * (SWidth - 45) * 100 / 165}, styles.allCenter]}
                                        source={{uri: cutImgUrl(item.imageUrl || '', 200, 200)}}>
                                        <Image source={playicon} style={{height: 35, width: 35}}
                                               resizeMode={'contain'}/>
                                    </ImageBackground>
                                    <Text style={{fontSize: 14, color: '#333333', width: 0.5 * (SWidth - 45), marginTop: 10, lineHeight: 20}}
                                          numberOfLines={1}>{item.storyName}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    })}
                </View>
            </View>}

            {nearby && <TouchableOpacity activeOpacity={0.9} onPress={() => {
                this.props.dispatch(action('ctjjModel/getStoreDetail'));
                this.props.dispatch(NavigationUtils.navigateAction('StoreDetail', {title: nearby.name}));
            }}>
                <View style={{height: 150, backgroundColor: "#fff", marginTop: 8}}>
                    <ImageBackground style={[styles.allCenter, {height: 50, width: SWidth}]} source={bg}>
                        <Text style={{fontSize: 16, color: '#333'}}>{nearby.title || ""}</Text>
                    </ImageBackground>
                    <View style={{height: 100, flexDirection: 'row'}}>
                        <Image source={{uri: cutImgUrl(nearby.imageUrl || '', 200, 200)}} style={{height: 80, width: 166, marginLeft: 16}}/>
                        <View style={[{marginLeft: 9}]}>
                            <View style={[styles.row, {height: 17}]}>
                                <View style={[styles.allCenter, {
                                    backgroundColor: '#2979FF',
                                    height: 17,
                                    paddingHorizontal: 5
                                }]}>
                                    <Text style={{color: '#fff', fontSize: 12}}>{nearby.typeValue || ''}</Text>
                                </View>
                            </View>
                            <Text style={{color: '#333', fontSize: 14, maxWidth: SWidth - 190, marginTop: 7}}
                                  numberOfLines={1}>{nearby.name || ''}</Text>
                            <Text style={{color: '#999', fontSize: 12, maxWidth: SWidth - 190, marginTop: 4}}
                                  numberOfLines={1}>{nearby.address || ''}</Text>
                            <View style={[styles.aCenter, styles.row, {marginTop: 6}]}>
                                <Image source={location} style={{height: 15, width: 15}} resizeMode={'contain'}/>
                                <Text style={{color: '#999', fontSize: 12, marginLeft: 2}}>{nearby.distance || "" }</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>}

            {recommends.length > 0 && <View style={{backgroundColor: "#fff", marginTop: 8}}>
                <TouchableOpacity activeOpacity={0.9} onPress={() => {
                    this.props.dispatch(NavigationUtils.navigateAction("MoreCases", {id: recommendId, title: recommendsTitle}));
                }}>
                    <ImageBackground style={[styles.allCenter, {height: 50, width: SWidth}]} source={bg}>
                        <Text style={{fontSize: 16, color: '#333'}}>{recommendsTitle || ''}</Text>
                        <Image source={more} style={{height: 15, width: 15, position: 'absolute', right: 10}}
                               resizeMode={'contain'}/>
                    </ImageBackground>
                </TouchableOpacity>
                <View style={{marginHorizontal: 16, marginBottom: 16}}>
                    {recommends.map((item, index) => {
                        return <TouchableOpacity activeOpacity={0.9} key={index} onPress={() => {
                            this.props.dispatch(NavigationUtils.navigateAction("CaseDetail", {
                                id: item.id,
                                title: item.name
                            }));
                            NativeModules.StatisticsModule.track('Zhichengtaoclick', {Modulename: item.name, UserId: L.get(this.props, 'mid', '游客')});
                        }}>
                            <ImageBackground style={{height: SWidth * 160 / 343, width: SWidth - 32, marginTop: 4}}
                                             source={{uri: cutImgUrl(item.imageUrl || '', 360, 360)}}>
                                <View style={[styles.jCenter, {
                                    height: 28,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    position: 'absolute',
                                    left: 0,
                                    right: 0,
                                    bottom: 0
                                }]}>
                                    <Text style={{fontSize: 14, color: '#fff', marginLeft: 9}}>{item.name || ''}</Text>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    })}
                </View>
            </View>}
            <View style={{height: 50, backgroundColor: "#fff", marginTop: 8}}>
                <ImageBackground style={[styles.allCenter, {height: 50, width: SWidth}]} source={bg}>
                    <Text style={{fontSize: 16, color: '#333'}}>{this.state.title || ''}</Text>
                </ImageBackground>
            </View>
        </View>
    };
    onScroll = () => {

    };
    onFetch = async (page = 1, startFetch, abortFetch) => {
        if(page == 1){
            this.init();
        }
        try {
            const list = await ctjjService.getTopic({group: 1, itemsId: 1, pageIndex: page, pageSize: PAGE_SIZE});
            const success = L.get(list, 'success', false);
            const data = L.get(list, 'data', false);

            if (success && data) {
                const storys = L.get(data, 'storys');
                if (page === 1) {
                    this.setState({data: storys});
                }
                const title = L.get(data, 'title', false);
                title && this.setState({title});
                startFetch(storys, PAGE_SIZE);
            } else {
                abortFetch();
            }
        } catch (e) {
            console.log(e);
            abortFetch();
        }
    };
    calculatePraise = (praise) => {
        if (praise > 9999) {
            return `${(praise / 10000).toFixed(2)}w`;
        } else {
            return praise;
        }
    };
    renderItem = (item, index) => {
        return <View key={index} style={{
            width: 0.5 * (SWidth - 15),
            height: 0.5 * (SWidth - 15) * 226 / 180,
            marginTop: 5,
            marginLeft: 5,
            backgroundColor: '#fff'
        }}>
            <TouchableOpacity activeOpacity={0.9} onPress={async ()=>{
                // alert(`社区正在开发中-不用提 bug-我的智慧生活--${item.storyName}`);
                //
                // this.props.dispatch(NavigationUtils.navigateAction("SuperSecondView", {
                //     // url: '/html/mine/mine.html',
                //     url: '/html/topic/topic_details.html',
                //     id: item.id,
                //     type: 1
                // }));
                const token = await global.getItem('userToken');
                this.props.dispatch(NavigationUtils.navigateAction("SuperSecondView", {
                    url: '/html/topic/topic_details.html',
                    id: Number(item.id),
                    token: token,
                    type: 1
                }));

            }}>
            <Image style={{height: 0.5 * (SWidth - 15) * 158 / 180, width: 0.5 * (SWidth - 15)}}
                   source={{uri: cutImgUrl(item.imageUrl || '', 200, 200)}}
                   resizeMode={'cover'}/>
            <View style={[styles.jCenter, {marginLeft: 8, marginTop: 7}]}>
                <Text style={{maxWidth: 0.5 * (SWidth - 15) - 16, fontSize: 14, lineHeight: 20}}
                      numberOfLines={1}>{item.storyName || ''}</Text>
            </View>
            <View style={[styles.aCenter, styles.row, {
                height: 40,
                marginLeft: 8,
                marginTop: 1,
                width: 0.5 * (SWidth - 15) - 16,
                justifyContent: 'space-between'
            }]}>
                <View style={[styles.row, styles.aCenter, {height: 40,}]}>
                    <View style={{height: 16, width: 16, borderRadius: 8}}>
                        {item.avatar ? <Image style={{height: 16, width: 16, borderRadius: 8}}
                                              source={{uri: cutImgUrl(item.avatar || '', 80, 80)}}
                                              resizeMode={'cover'}/>:<Image style={{height: 16, width: 16, borderRadius: 8}}
                                                                            source={defaultIcon}
                                                                            resizeMode={'cover'}/>}
                    </View>
                    <Text style={{fontSize: 12, marginLeft: 6, color: '#999', maxWidth: 0.5 * (SWidth - 15) - 80}} numberOfLines={1}>{item.author || ""}</Text>
                </View>
                <View style={[styles.row, styles.aCenter, {height: 40,}]}>
                    <Image style={{height: 25, width: 25}}
                           source={zan}
                           resizeMode={'contain'}/>
                    <Text style={{fontSize: 12, color: '#999'}}
                          numberOfLines={1}>{this.calculatePraise(item.praise)  || '0'}</Text>
                </View>

            </View>
            </TouchableOpacity>
        </View>
    };

    render() {
        console.log('-------render-----');
        return (
            <View style={[styles.container]}>
                <UltimateListView
                    ref={ref => this.listView = ref}
                    // 头部视图
                    header={!this.state.first && this.header}
                    onFetch={this.onFetch}
                    keyExtractor={(item, index) => `${index} - ${item}`} // this is required when you are using FlatList
                    refreshableMode={Platform.OS === 'ios' ? 'advanced' : 'basic'} // basic or advanced
                    // item视图
                    item={this.renderItem} // this takes three params (item, index, separator)
                    numColumns={2} // to use grid layout, simply set gridColumn > 1
                    // 尾部视图,当isFooter为true时,再设置footer视图,否则一直返回null
                    // tslint:disable-next-line:max-line-length
                    footer={() => {return this.state.data.length > 0 && <FooterView/>}}
                    // refreshableTitle='数据更新中……'
                    // refreshableTitleRelease='释放刷新'
                    // 下拉刷新箭头图片的高度
                    // arrowImageStyle={{ width: 80, height: 80, resizeMode: 'contain' }}
                    // dateStyle={{ color: 'lightgray' }}
                    // 刷新视图的样式(注意ios必须设置高度和top距离相等,android只需要设置高度)
                    // refreshViewStyle={Platform.OS === 'ios' ? { height: 180, top: 100 } : { height: 180 }}
                    // 刷新视图的高度
                    // refreshViewHeight={80}
                    // 视图滚动的方法
                    onScroll={this.onScroll}
                    // separator={() => <View style={{height: 10, backgroundColor: '#f4f4f4'}}/>}
                />
            </View>
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
        width: SWidth, height: 0.533 * SWidth
    }
});
