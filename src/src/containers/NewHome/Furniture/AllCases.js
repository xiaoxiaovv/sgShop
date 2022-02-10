



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
    View, ScrollView,NativeModules,
    TouchableOpacity,
    FlatList,Modal
} from 'react-native';

import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import { action, createAction, NavigationUtils } from './../../../dva/utils';
import { NavBar, SafeView, FooterView } from './../../../components';
import ShareModle from './../../../components/ShareModle';
import URL from './../../../config/url';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
import { ctjjService } from './../../../dva/service';
import L from 'lodash';
const PAGE_SIZE = 10;
const Sip = StyleSheet.hairlineWidth;
import VideoPlayer from 'react-native-af-video-player';
import ImageViewer from 'react-native-image-zoom-viewer';

import more from './../../../images/arrow_right_w.png';
import VIP from './../../../images/jiav.png';

import { UltimateListView, UltimateRefreshView } from 'rn-listview';
import {Color} from 'consts';

const renderPagination = (index, total, context) => {
    return (
        <View style={[styles.allCenter, {height: 24, width:24, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.6)',borderWidth:Sip, borderColor: 'rgba(255,255,255,0.8)',position: 'absolute', bottom: 16, right: 16}]}>
            <Text style={{ color: 'white', fontSize: 10}}>{index + 1}/{total}</Text>
            </View>
    )
};
/*
* 全套解决方案页
 */
@connect(({ctjjModel, users}) => ({...ctjjModel, ...users}))
export default class AllCases extends Component {
    header = ()=>{
        const { programsBanners, programsRecommends, programsExperts, expertsTitle, programsRecommendsTitle, autoPlay  } = this.props;
        return <View style={[styles.container]}>
            {programsBanners.length > 0 && <View style={[styles.banner]}>
                <Swiper
                    autoplay={autoPlay}
                    loop={true}
                    autoplayTimeout={4}
                    // pagingEnabled={true}
                    renderPagination={renderPagination}
                    onIndexChanged={(index)=>{
                        this.setState({onPause: true});
                        this.setState({selected: index});
                        // console.log('-------index--------');
                        // console.log(index);
                    }}
                >
                    {programsBanners.map((item, index)=>{
                        return <View style={[styles.banner, styles.allCenter]} key={index}>
                            {item.type == 0 && <TouchableOpacity activeOpacity={0.9} onPress={()=>{
                                this.setState({url: item.imageUrl || '',
                                    showImageViewer: true});
                            }}><Image source={{uri: cutImgUrl(item.imageUrl || '', 360, 360)}} style={[styles.banner]} resizeMode={'cover'}/></TouchableOpacity>}
                            {item.type == 1 && <View style={[styles.allCenter, styles.banner]}>
                                <VideoPlayer onPause={this.state.onPause} placeholder={item.imageUrl} url={item.videoUrl} style={styles.banner} inlineOnly={true}/>
                            </View>}
                        </View>
                    })}
                </Swiper>
            </View>}

            {programsExperts.length > 0 && <View style={[{backgroundColor: '#fff', marginTop: 4}]}>
                <View style={[styles.aCenter, styles.row,{height: 44}]}>
                    <View style={{height: 13, width: 3, backgroundColor: '#2979FF', marginLeft: 16}}/>
                    <Text style={{fontSize: 14, marginLeft: 8, color: '#333'}}>{expertsTitle || ''}</Text>
                </View>
                <View style={[{height: 110}]}>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        data={programsExperts}
                        keyExtractor={(item, index) => {return index}}
                        renderItem={this.renderItemView}
                    />
                </View>
            </View>}


            {programsRecommends.length > 0 && <View style={[{backgroundColor: '#fff', marginTop: 4}]}>
                <TouchableOpacity activeOpacity={0.9} onPress={()=>{
                    this.props.dispatch(NavigationUtils.navigateAction("MoreCases", {id: this.state.id}));
                }}>
                <View style={[styles.aCenter, styles.row, {justifyContent: 'space-between'}]}>
                    <View style={[styles.aCenter, styles.row,{height: 44}]}>
                        <View style={{height: 13, width: 3, backgroundColor: '#2979FF', marginLeft: 16}}/>
                        <Text style={{fontSize: 14, marginLeft: 8, color: '#333'}}>{programsRecommendsTitle || ''}</Text>
                    </View>
                    <View style={[styles.aCenter, styles.row,{height: 44, marginRight: 16}]}>
                        <Text style={{fontSize: 14, marginLeft: 8, color: '#999'}}>更多</Text>
                        <Image source={more} style={{height: 12, width: 12}} resizeMode={'contain'} />
                    </View>
                </View>
                </TouchableOpacity>
                <View style={{marginHorizontal: 16, marginBottom: 16}}>
                    {programsRecommends.map((item, index)=>{
                        return <TouchableOpacity activeOpacity={0.9} key={index} onPress={()=>{
                            // alert(item);
                            this.setState({onPause: true});
                            this.props.dispatch(NavigationUtils.navigateAction("CaseDetail", {id: item.id, title: item.name}));
                            NativeModules.StatisticsModule.track('Zhichengtaoclick', {Modulename: item.name, UserId: L.get(this.props, 'mid', '游客')});
                        }}>
                            <ImageBackground style={{height: SWidth * 160/343, width: SWidth - 32, marginTop: 4}} source={{uri: cutImgUrl(item.imageUrl || '', 200, 200)}}>
                                <View style={[styles.jCenter, {height: 28, backgroundColor: 'rgba(0,0,0,0.5)', position:'absolute', left:0, right:0, bottom:0}]}>
                                    <Text style={{fontSize: 14, color: '#fff', marginLeft: 9}}>{item.name || ''}</Text>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    })}
                </View>
            </View>}
            {this.state.allTitle && this.state.data.length > 0 &&  <View style={[{backgroundColor: '#fff', marginTop: 4}]}>
                <View style={[styles.aCenter, styles.row,{height: 44}]}>
                    <View style={{height: 13, width: 3, backgroundColor: '#2979FF', marginLeft: 16}}/>
                    <Text style={{fontSize: 14, marginLeft: 8, color: '#333'}}>{this.state.allTitle || ''}</Text>
                </View>
            </View>}
        </View>
    };

    componentWillMount() {
        // 请求头部内容 dva 操作, header 数据
        const params = this.props.navigation.state.params;
        const id = L.get(params, 'id');
        const title = L.get(params, 'title');
        const shareIcon = L.get(params, 'imageUrl');
        this.setState({title, id, shareIcon});
        this.props.dispatch(action('ctjjModel/getPrograms', {id: id}));
    }
    componentDidMount() {
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
    renderItemView = ({item, index})=>{
        return <TouchableOpacity activeOpacity={0.9} id={index} onPress={()=>{
            this.setState({onPause: true});
            this.props.dispatch(NavigationUtils.navigateAction("ExpertDetail", {id: item.id}));
        }}>
        <View style={{height: 110, width: 73, marginLeft: 16}}>
            <ImageBackground style={{height: 73, width: 73}} source={{uri: cutImgUrl(item.avatar || '', 80, 80)}}>
                    <Image style={{position: 'absolute', right:0, bottom:0, height: 16, width:16}} source={VIP}/>
            </ImageBackground>
            <View style={[styles.allCenter, {width: 73, height: 37}]}>
                <Text style={{maxWidth: 73, fontSize: 12, color: '#333'}}>{item.name || ''}</Text>
            </View>
        </View>
        </TouchableOpacity>
    };
    renderItem = (item, index)=>{
        return <TouchableOpacity activeOpacity={0.9} onPress={async ()=>{
            // alert(`社区正在开发中-全屋案例--${item.storyName}`);
            this.setState({onPause: true});
            const token = await global.getItem('userToken');
            this.props.dispatch(NavigationUtils.navigateAction("SuperSecondView", {
                url: '/html/topic/topic_details.html',
                id: Number(item.id),
                token: token,
                type: 1
            }));
            // this.props.dispatch(NavigationUtils.navigateAction("SuperSecondView", {
            //     // url: '/html/mine/mine.html',
            //     url: '/html/topic/topic_details.html',
            //     id: item.id,
            //     type: 2
            // }));
        }}><View key={index} style={{width: 0.5*(SWidth - 30), height: 0.5*(SWidth - 30) + 28, marginTop: 10, marginLeft: 10,backgroundColor: '#fff'}}>
            <Image style={{height: 0.87*0.5*(SWidth - 30), width: 0.5*(SWidth - 30)}}
                   source={{uri: cutImgUrl(item.imageUrl || '', 300, 300)}}
                   resizeMode={'cover'}/>
            <View style={[styles.jCenter, {height: 28}]}>
                <Text style={{maxWidth: 0.5*(SWidth - 30), fontSize: 14}} numberOfLines={1}>{item.storyName || ''}</Text>
            </View>
        </View>
        </TouchableOpacity>
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            selected: 0,
            title: '',
            allTitle: null,
            id: '',
            data: [],
            play: false,
            showImageViewer: false,
            showShare: false,
            url: '',
            shareIcon: '',
            paused: false,
            onPause: true,
        };

        this.header = this.header.bind(this);
        this.renderItemView = this.renderItemView.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.onFetch = this.onFetch.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.getShareContent = this.getShareContent.bind(this);
    }

    onScroll = ()=>{

    };
    onFetch = async (page = 1, startFetch, abortFetch)=>{

        try{
            const list = await ctjjService.getTopic({group: 2, itemsId: 1, programsId: this.state.id, pageIndex: page, pageSize: PAGE_SIZE});
            const success = L.get(list, 'success', false);
            const data = L.get(list, 'data', false);

            if(success && data){
                const storys = L.get(data, 'storys');
                const allTitle = L.get(data, 'title', false);
                if(page === 1){
                    this.setState({data: storys});
                }
                allTitle && this.setState({allTitle});
                startFetch(storys, PAGE_SIZE);
            }else{
                abortFetch();
            }
        }catch (e) {
            console.log(e);
            abortFetch();
        }
        // abortFetch();
        // startFetch(products, PAGE_LIMIT);
    };

    render() {
        return (
            <SafeView>
                <View style={[styles.container]}>
                <NavBar title={this.state.title || ''} rightFun={()=>{
                    this.setState({onPause: true});
                    if(this.props.isLogin){
                        this.setState({showShare: true});
                    }else {
                        dvaStore.dispatch(createAction('router/apply')({
                            type: 'Navigation/NAVIGATE', routeName: 'Login',
                        }));
                    }
                }}/>
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
                    numColumns={2} // to use grid layout, simply set gridColumn > 1
                    // 尾部视图,当isFooter为true时,再设置footer视图,否则一直返回null
                    // tslint:disable-next-line:max-line-length
                    footer={()=>{return this.state.data.length > 0 && <FooterView textContainerStyle={styles.footer}/>}}
                    // refreshableTitle='数据更新中……'
                    // refreshableTitleRelease='释放刷新'
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
                    <Modal visible={this.state.showImageViewer} transparent={true}>
                        <ImageViewer
                            imageUrls={[{url: this.state.url || ''}]}
                            onClick={() => this.setState({ showImageViewer: false })}
                        />
                    </Modal>
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
