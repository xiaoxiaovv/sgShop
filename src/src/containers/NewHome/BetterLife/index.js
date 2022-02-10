

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
    TouchableWithoutFeedback,
    TouchableOpacity,
    NativeModules,
} from 'react-native';
import { Toast } from 'antd-mobile';
import Swiper from 'react-native-swiper';
import EStyleSheet from 'react-native-extended-stylesheet';
import {action,createAction, NavigationUtils} from './../../../dva/utils';
import { connect } from 'react-redux';
import { UltimateListView } from 'rn-listview';
import Config from 'react-native-config';
import CaseYYModle from '../../../components/CaseYYModle';
import {FooterView} from '../../../components';
import URL from './../../../config/url';
import { GET, POST_JSON, GET_P, POST_FORM} from '../../../config/Http';
import { postAppJSON, getAppJSON, postAppForm } from '../../../netWork';
import {goBanner} from '../../../utils/tools';
import sjal from './../../../images/jjdz_sjal.png';
import sjmt from './../../../images/jjdz_sjmt.png';
import zxgl from './../../../images/jjdz_zxgl.png';
import jrfq from './../../../images/jrlc.png';
import gsc from './../../../images/market.png';
import yy from './../../../images/jjdz_yy.jpg';
import kf from './../../../images/jjdz_kf.png';
import more from './../../../images/arrow_right_w.png';
import bgbgbg from './../../../images/bgbgbg.png';
import zan from './../../../images/zan.png';
import defaultIcon from '../../../images/userIcon.jpg';

let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

const Sip = StyleSheet.hairlineWidth;

@connect(({users:{isLogin}}) => ({isLogin}))
export default class JJDZ extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            showYYModal:false,
            title1:'',
            data1:[],
            BannerData: null,
            first:true,
        };
        this.headerView = this.headerView.bind(this);
        this.onFetch = this.onFetch.bind(this);
        this.getData = this.getData.bind(this);
        this.getDataBanner = this.getDataBanner.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.toApplyForWhite = this.toApplyForWhite.bind(this);
      }

    componentDidMount() {
        this.init();
    }
    init = () => {
        this.getData();
        this.getDataBanner();
    };

    headerView = () => {
        const data1 = this.state.data1;
        return (
            <View style={styles.container}>
             
                <View style={[styles.banner]}>
                {
                    IS_NOTNIL(this.state.BannerData) &&
                    <Swiper
                        autoplay={true}
                        loop={true}
                        observer={true}
                        observeParents={false}
                        autoplayTimeout={3}
                        pagingEnabled={true}
                        showsPagination={true}
                        paginationStyle={{bottom: 10}}
                        dot={<View style={styles.dotStyle}/>}   
                        activeDot={<View style={styles.activeDotStyle}/>} 
                    >
                    { this.state.BannerData.map((item, index) =>(
                                <TouchableWithoutFeedback
                                    key={`${index}`}
                                    onPress={() => {
                                        goBanner(item, this.props.navigation)
                                    }}
                                    >
                                    <Image source={{uri: item.imageUrl}} style={[styles.banner]} resizeMode={'cover'}/>
                                </TouchableWithoutFeedback>
                                  ),)
                    }
                    </Swiper>
                    }
                </View>
             
                <View style={styles.menuStyle}>
                    <View style={{width,height:40,flexDirection: 'row', justifyContent:'space-around'}}>
                    <TouchableWithoutFeedback onPress={()=>{
                              this.props.dispatch(NavigationUtils.navigateAction("CaseList", {}));
                          }}> 
                          <Image style={{height: 40, width: 40}} source={sjal} />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>{
                              this.props.dispatch(NavigationUtils.navigateAction("StoryList", {group: 3,itemsId: 2}));
                          }}> 
                          <Image style={{height: 40, width: 40}} source={sjmt} />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>{
                             this.props.dispatch(NavigationUtils.navigateAction("StoryList", {group: 4,itemsId: 2}));
                          }}> 
                          <Image style={{height: 40, width: 40}} source={zxgl} />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>{
                            //   this.props.navigation.navigate('MyInvestment', {frontPage: ''})
                            this.props.isLogin ?
                            this.toApplyForWhite():
                            this.props.dispatch(NavigationUtils.navigateAction("Login", {}));
                          }}> 
                          <Image style={{height: 40, width: 40}} source={jrfq} />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>{
                             this.props.dispatch(NavigationUtils.navigateAction('HomeDress'));
                          }}> 
                          <Image style={{height: 40, width: 40}} source={gsc} />
                    </TouchableWithoutFeedback>
                    </View>
                    <View style={{width,flexDirection: 'row', justifyContent:'space-around'}}>
                    <Text style={{fontSize: 12 ,paddingTop: 7}}>设计案例</Text>
                    <Text style={{fontSize: 12 ,paddingTop: 7}}>晒家美图</Text> 
                    <Text style={{fontSize: 12 ,paddingTop: 7}}>装修攻略</Text>
                    <Text style={{fontSize: 12 ,paddingTop: 7}}>金融分期</Text>
                    <Text style={{fontSize: 12 ,paddingTop: 7}}>逛逛商场</Text>
                    </View>
                </View>
                {/* 预约设计 */}
                <TouchableWithoutFeedback  onPress={()=>{
                              this.setState({ showYYModal: true });
                }}>
                <ImageBackground  style={{height: 120, width,marginTop: 8,backgroundColor:'#fff'}} source={yy}/>
                 </TouchableWithoutFeedback>
                 {/* 家装设计师 */}
                 <View style={{width, height: 214, backgroundColor: "#ffffff", marginTop: 8}}>
                    <TouchableOpacity onPress={()=>{
                      this.props.dispatch(NavigationUtils.navigateAction("SjsList", {}));
                    }}>
                        <ImageBackground style={[styles.aCenter, {height: 50, width}]} source={bgbgbg}>
                           <Text style={{fontSize: 16 }}>{this.state.title1 || ''}</Text>
                           <Image source={more} style={{height: 15, width: 15, position: 'absolute', right: 15}} resizeMode={'contain'} />
                        </ImageBackground>
                    </TouchableOpacity>
                    <View style={{height: 160, flexDirection: 'row'}}>
                      {data1.map((item, index)=>{
                          return <TouchableWithoutFeedback onPress={()=>{
                            this.props.dispatch(NavigationUtils.navigateAction("SjsDetail", {designerId:item.designerId || ''}));
                            }}>
                          <View style={{height: 160, width: width / 3, justifyContent: 'center', alignItems: 'center'}} key={index}>
                              <Image style={{height: 100, width: 106}} source={{uri: item.imageUrl || ''}} />
                              <Text style={{width:106,marginTop: 5, fontSize: 14 ,textAlign:'left',}} numberOfLines={1} ellipsizeMode='tail'>{item.name || ''}</Text>
                              <View style={{height: 16, width: 106,flexDirection: 'row',paddingTop:2,alignItems:'center'}} >
                                  <Image style={{height: 16, width: 16,borderRadius: 8}} source={{uri: item.avatar || ''}} />
                                  <Text style={{width: 88,marginLeft: 5, fontSize: 12 ,textAlign:'left'}} numberOfLines={1} ellipsizeMode='tail'
                                 >{item.designerName}</Text>
                              </View>
                            </View>
                            </TouchableWithoutFeedback>
                         
                      })}
                    </View>
                </View>

                <View style={{height: 50, backgroundColor: "#fff", marginTop: 8}}>
                    <ImageBackground style={[styles.aCenter, {height: 50, width}]} source={bgbgbg}>
                        <Text style={{fontSize: 16 }}>猜你喜欢</Text>
                    </ImageBackground>
                </View>
            </View>
        );
    }


    render() {
        return (
            <View style={styles.container}>
                <UltimateListView
                    ref={ref => this.listView = ref}
                    header={!this.state.first && this.headerView}
                    onFetch={this.onFetch}
                    keyExtractor={(item, index) => `${index} - ${item}`} // this is required when you are using FlatList
                    refreshableMode={Platform.OS === 'ios' ? 'advanced' : 'basic'} // basic or advanced
                    // item视图
                    item={this.renderItem} // this takes three params (item, index, separator)
                    numColumns={2} // to use grid layout, simply set gridColumn > 1
                    // 尾部视图,当isFooter为true时,再设置footer视图,否则一直返回null
                    // tslint:disable-next-line:max-line-length
                    footer={()=>{return <FooterView/>}}
                    // 视图滚动的方法
                    onScroll={this.onScroll}
                />

                <TouchableOpacity style={{position: 'absolute',bottom:16,right:16}} onPress={()=>{
                    //小能客服
                    const chatparams = {
                        goods_id: '-1', // 消息页等其他页面商品id固定传-1  单品页传商品id正常传  订单传商品id正常传
                        clientGoods_type: '1', // 传1
                        // 0:客服端不展示商品信息;1：客服端以商品ID方式获取商品信息(goods_id:商品ID，clientGoods_type = 1时goods_id参数传值不能为空)
                        appGoods_type: '0', // 单品页传1  订单传3 并吧三下面的四个参数传递过来
                    };
                    const command = [
                        'hg_1000_1525835131844',
                        '家装客服组',
                        chatparams,
                    ];
                    NativeModules.XnengModule.NTalkerStartChat(command)
                    .then(result => {
                        Log('调起小能客服成功');
                    })
                    .catch((errorCode, domain, error) => {
                        Log('调起小能客服失败');
                    });
                    }}>
                    <Image style={{height: 50, width: 50}}
                   source={kf}/>
            </TouchableOpacity>
           
                <CaseYYModle
                    visible={this.state.showYYModal}
                    onCancel={() => this.setState({ showYYModal: false })}
                    hiddenEwm={true}
                    hidingTitle={true}
                    designerId={''}
                    detailsId={''}
                    itemsId={2}
                />
            </View>
        );
    }

    // 获取数据
    onFetch = async (page = 1, startFetch, abortFetch) => {
        try {
            if(page == 1){
                this.init();
            }
            const {data,success} = await GET(URL.get_topic,{
                group: 5,
                itemsId: 2,
                pageIndex: page,
                pageSize:10
            });
            if (success) {
                startFetch(data.storys, 10);
            } else {
                abortFetch();
            }
           
        } catch (err) {
            abortFetch();
        }
    }

   getData = async () => {
    try {
        const {data, success} = await GET(URL.DIY_HOME, null);
        if (success) {
            this.setState({
                title1: data.recommend.title,
                data1: data.recommend.recommends,
            });
        }
    } catch (err) {
        Log(err);
    }}

     // 请求banner数据
     getDataBanner =  async () => {
        try {
            const json = await GET(URL.LIFEBANNER, {
                itemsId: 2,
            });
            if (json.success) {
                this.setState({
                            BannerData: json.data,
                        });
            } else {
                Toast.fail(json.message, 1);
            }
            if(this.state.first){
                this.setState({first: false})
        }
        } catch (err) {
            Log(err);
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
        console.log('****' + res);
        if (res.success) {
            if (res.data.applyStatus === 2 ||
                res.data.applyStatus === '2' ||
                res.data.applyStatus === '3' ||
                res.data.applyStatus === 3) {
                // 跳转到applyForWhite页面
                this.props.dispatch(NavigationUtils.navigateAction("BaiTiao",{}));
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
            this.props.dispatch(NavigationUtils.navigateAction("Login",{}));
        }
    }

     cutImgUrl2 = (url, cutWidth, cutHeight) => {
        if (Config.API_URL === 'http://mobiletest.ehaier.com:38080/') {
            return url;
        }
        const pattern = /cdn[23][0-9].ehaier.com/;
        if (!pattern.test(url)) {
            return url;
        }
        const cutH = cutHeight || cutWidth || sceenHeight;
        const cutW = cutWidth || width;
        const supportW = [80, 100, 120, 150, 160, 180, 200, 225, 240, 250, 300, 360, 400, 450, 500, 750];
        const supportH = [80, 100, 140, 150, 160, 180, 200, 245, 280, 300, 320, 360, 400, 490, 600];
        const supCutW = supportW.find((w) => w >= cutW );
        const supCutH = supportH.find((h) => h >= cutH );
        if (supCutW && supCutH) {
            return `${url}@${supCutW}_${supCutH}`;
        } else {
            return url;
        }
    };
    renderItem = (item, index) => {
        return <View key={index} style={{
            width: 0.5 * (width - 15),
            height: 0.5 * (width - 15) * 226 / 180,
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
                <Image style={{height: 0.5 * (width - 15) * 158 / 180, width: 0.5 * (width - 15)}}
                       source={{uri: cutImgUrl(item.imageUrl || '', 200, 200)}}
                       resizeMode={'cover'}/>
                <View style={[styles.jCenter, {marginLeft: 8, marginTop: 7}]}>
                    <Text style={{maxWidth: 0.5 * (width - 15) - 16, fontSize: 14, lineHeight: 20}}
                          numberOfLines={1}>{item.storyName || ''}</Text>
                </View>
                <View style={[styles.aCenter, styles.row, {
                    height: 40,
                    marginLeft: 8,
                    marginTop: 1,
                    width: 0.5 * (width - 15) - 16,
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
                        <Text style={{fontSize: 12, marginLeft: 6, color: '#999', maxWidth: 0.5 * (width - 15) - 80}} numberOfLines={1}>{item.author || ""}</Text>
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
    calculatePraise = (praise) => {
        if (praise > 9999) {
            return `${(praise / 10000).toFixed(2)}w`;
        } else {
            return praise;
        }
    };
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    },
    allCenter: {
        justifyContent: 'center', alignItems: 'center'
    },
    jCenter: {
        justifyContent: 'center'
    },
    row: {
        flexDirection: 'row'
    },

    banner: {
        width: width,
        height: 0.533 * width,
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
    menuStyle:{
        width,
        height: 90,
        marginTop: 9,
        backgroundColor: '#FFFFFF',
        justifyContent:'center'
    },
    aCenter: {
        justifyContent: 'center',
        alignItems: 'center'
    },

});
