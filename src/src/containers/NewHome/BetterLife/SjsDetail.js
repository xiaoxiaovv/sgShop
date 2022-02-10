

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
    TouchableWithoutFeedback,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Swiper from 'react-native-swiper';
import ScreenUtil from './../../Home/SGScreenUtil';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import { connect } from 'react-redux';
import { UltimateListView } from 'rn-listview';
import URL from './../../../config/url';
import { GET, POST_JSON, GET_P, POST_FORM} from '../../../config/Http';
import SCWebView from './../../../components/SwitchScroll/SCWebView'
import {action,createAction, NavigationUtils} from './../../../dva/utils';
import ShareModle from '../../../components/ShareModle';
import { NavBar } from '../../../components/NavBar';
import share from './../../../images/share_w.png';
import back from './../../../images/back.png';
import top from './../../../images/sjstop.png';
import IsIphoneX from './../../../components/NavBar/IsIphoneX';
let Swidth = URL.width;
let Sheight = URL.height;
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
const Sip = StyleSheet.hairlineWidth;

/**
 * 设计师详情
 */
@connect(({users}) => ({...users}))
export default class SjsDetail extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            data:[],
            showShare:false,
        };
        this.headerView = this.headerView.bind(this);
        this.onFetch = this.onFetch.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.getData = this.getData.bind(this);
        this.getShareContent = this.getShareContent.bind(this);
      }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        this.getData(params.designerId);
    }

    render() {
        return (
            <View style={styles.container}>
            <UltimateListView
                ref={ref => this.listView = ref}
                header={this.headerView}
                onFetch={this.onFetch}
                keyExtractor={(item, index) => `${index} - ${item}`} // this is required when you are using FlatList
                refreshableMode={Platform.OS === 'ios' ? 'advanced' : 'basic'} // basic or advanced
                // item视图
                item={this.renderItem} // this takes three params (item, index, separator)
                numColumns={1} // to use grid layout, simply set gridColumn > 1
                // 尾部视图,当isFooter为true时,再设置footer视图,否则一直返回null
                // tslint:disable-next-line:max-line-length
                // footer={()=>{return <View style={[styles.aCenter, {height: 40}]}>
                //     <View style={{backgroundColor: '#979797', width: Swidth-32, height: 1,position: 'absolute'}}/>
                //     <View style={[styles.aCenter, {width: 240, height: 40, backgroundColor:'#eee'}]}>
                //         <Text style={{fontSize: 14, color: '#666'}}>已经到底了，只能帮你到这里啦</Text>
                //     </View>
                //     </View>}}
                refreshableTitle='数据更新中……'
                refreshableTitleRelease='释放刷新'
                // 下拉刷新箭头图片的高度
                arrowImageStyle={{ width: 80, height: 80, resizeMode: 'contain' }}
                dateStyle={{ color: 'lightgray' }}
                // 刷新视图的样式(注意ios必须设置高度和top距离相等,android只需要设置高度)
                refreshViewStyle={Platform.OS === 'ios' ? { height: 180, top: 100 } : { height: 180 }}
                // 刷新视图的高度
                refreshViewHeight={80}
                // 视图滚动的方法
                onScroll={this.onScroll}
                separator={() => <View style={{height: 10, backgroundColor: '#f4f4f4'}}/>}
            />
        </View>
        );
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
        const data = this.state.data;
            const title = data.name;
            const content = data.introduction;
            const pic = data.avatar;
            const url = `${URL.DIY_DESIGN_SHARE}${data.id}`;
            return [ title, content, pic, url, 0 ];
    };
    headerView = () => {
        const data = this.state.data;
        return (
            <View style={{ backgroundColor: '#ffffff'}}>
                <Image style={{height: Swidth*14/25, width: Swidth }}
                   source={IS_NOTNIL(data.imageUrl) ? {uri: data.imageUrl}:top}
                   resizeMode={'cover'}/>
                <TouchableWithoutFeedback onPress={()=>{
                          this.props.navigation.goBack();
                      }}>
                    <View  style={{position: 'absolute', left: 15, top: IsIphoneX ? 44 : Platform.OS === 'ios' ? 20:0, backgroundColor: 'rgba(0,0,0,0.2)',
                        height: 32,
                        width: 32,
                        borderRadius: 16,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                <Image style={{height: 20, width: 20, left: -2}}
                   source={back} 
                   resizeMode={'contain'}/>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={()=>{
                    if(this.props.isLogin){
                        IS_NOTNIL(this.state.data) && this.setState({showShare:true})
                    }else {
                        dvaStore.dispatch(createAction('router/apply')({
                            type: 'Navigation/NAVIGATE', routeName: 'Login',
                        }));
                    }
                      }}>
                    <View  style={{position: 'absolute', right: 15, top: IsIphoneX ? 44 : Platform.OS === 'ios' ? 20:0, backgroundColor: 'rgba(0,0,0,0.2)',
                        height: 32,
                        width: 32,
                        borderRadius: 16,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                <Image style={{height: 24, width: 24, left: -2}}
                   source={share} 
                   resizeMode={'contain'}/>
                    </View>
                </TouchableWithoutFeedback>
                <View style={{width:Swidth,height:64,flexDirection:'row',alignItems:'flex-end',backgroundColor:'rgba(30, 30, 30, 0)',position: 'absolute',top:(Swidth*14/25) - 32}}>
                    <Image style={{height: 64, width: 64,marginLeft:15,borderRadius:32}}
                     source={{uri: data.avatar}} resizeMode={'cover'}/>
                    <Text style={{fontSize: 14,color:'#333333',marginLeft:7}}>{data.name || ''}</Text>
                    <Text style={{fontSize: 12,color:'#999999',position: 'absolute',right:15}}>{data.area || ''}</Text>
                </View>
                <View style={{width:Swidth,backgroundColor:'#fff',marginTop:32,padding:16}}>
                    <Text style={{fontSize: 12,color:'#666666'}}>{data.introduction || ''}</Text>
                </View>
                <Text style={{width:Swidth,height:4,backgroundColor:'#eeeeee'}}/>
                <View style={{width:Swidth,backgroundColor:'#fff',flexDirection:'row',paddingLeft:16,paddingTop:16,alignItems:'center'}}>
                    <Text style={{width:3,height:16 ,backgroundColor:'#2979FF'}}/>
                    <Text style={{fontSize:16,fontWeight:'bold' ,color:'#333333',paddingLeft:8}}>设计案例</Text>
                </View>
                <ShareModle
                    hiddenEwm
                visible={this.state.showShare} content={this.getShareContent()}
                onCancel={() => this.setState({ showShare: false })}/>
            </View>
        );
    }
    renderItem = (item, index)=>{
        return <View key={index} style={{width:Swidth,padding: 16,backgroundColor: '#fff'}}>
        <TouchableWithoutFeedback onPress={()=>{
                          this.props.dispatch(NavigationUtils.navigateAction("CaseDetailjj", {caseid: item.id}));
                      }}> 
            <Image style={{height: 160, width: Swidth-32}} source={{uri: item.imageUrl || ''}}
               resizeMode={'cover'}/>
        </TouchableWithoutFeedback>
        
        <View style={{height: 30,width: Swidth-32,margin: 16, position: 'absolute', top: 130, backgroundColor: 'rgba(30, 30, 30, 0.3)',flexDirection:'row',alignItems:'center'}}>
            <Text style={{fontSize: 12,color:'#fff',position: 'absolute',right:8}}>{item.area || ''}</Text>
        </View>
        <Text style={{fontSize: 14,paddingTop:12}}>{item.name || ''}</Text>
        <View  style={{width:Swidth - 32,flexDirection:'row' , flexWrap: 'wrap'}}>
                 {item.label.split(' ').map((item, index)=>{
                          return <View  style={{height:22,borderRadius:11,backgroundColor:'#E4E4E4',justifyContent:'center',alignItems:'center',marginRight:6,marginTop:6, paddingLeft: 10, paddingRight:10 }}>
                          <Text style={{fontSize: 12,color:'#666666'}}>{item}</Text>
                          </View>
                      })}
            </View>
    </View>
  };

    // 请求数据
    getData = async (id) => {
        try {
            const {data, success} = await GET(URL.DIY_DESIGNERDETAILS,{id:id});
            if (success) {
                this.setState({
                            data: data,
                        });
            } else {
                Toast.fail('请求数据失败', 2);
            }
        } catch (err) {
            Log(err);
        }
    }


    // 获取案例列表数据
    onFetch = async (page = 1, startFetch, abortFetch) => {
        try {
            const { params } = this.props.navigation.state;
            const json = await GET(URL.DIY_CASELIST_D,{
                id: params.designerId,
                pageIndex: page,
                pageSize:10
            });
            console.log('json' + json);
            if (json.success) {
                console.log('json' + json);
                startFetch(json.data, 10);
            } else {
                abortFetch();
            }
           
        } catch (err) {
            abortFetch();
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    },

    bannerStyle: {
        width: Swidth,
        height: 0.5 * Swidth,
    },
    unPointStyle: { 
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
        backgroundColor: 'rgba(255,255,255,.5)',
    },
    pointStyle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
        backgroundColor: '#FFFFFF',
    },
    menuStyle:{
        width: Swidth,
        height: 90,
        marginTop: 9,
        backgroundColor: '#FFFFFF',
        justifyContent:'center'
    },
    headerNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: Swidth,
        paddingTop: ScreenUtil.isiPhoneX ? 44 : (Platform.OS === 'ios' ? 20 : 0), // 处理ios状态栏,普通ios设备是20,iPhone X是44
        height: 44,
        backgroundColor:'#fff'
    },

});
