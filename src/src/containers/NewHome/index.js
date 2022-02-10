

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
    Text,Alert,
    ImageBackground,
    Dimensions,
    View, ScrollView,
    TouchableOpacity,NativeModules,
    DeviceEventEmitter,
} from 'react-native';
import Permissions from 'react-native-permissions';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import ScrollableTabBar from './../../components/ScrollableTabBar';
import HomeNavBar from './../../components/NavBar/HomeNavBar';
import { connect } from 'react-redux';
import { createAction } from '../../utils/index';
import { goToSQZBS } from '../../utils/tools';

import Ctjj from './Furniture/index';
import Jjdz from './BetterLife/index';
import Zcdz from './Personal/index';
// import Xpzc from './NewArrival/index';
import Xpzc from './NewArrival/index1';
import ExperienceStore from './ExperienceStore/index'

// import Bhcs from './SuperMarket/index';
import Bhcs from './SuperMarket/index2';
import Shfw from './MyServices/index';
import { GetStatisticInfo } from '../../common/GetStatisticInfo';
import {NavigationUtils,action} from "../../dva/utils";
import QRCodeScannerView from "../../components/QRCode";
import {GET} from "../../config/Http";
import URL from "../../config/url";
import { Advertisement } from '../Home/Advertisement';
import { addPosition } from '../../dvaModel/homeModel';
import L from 'lodash';

import { Toast } from 'antd-mobile';


@connect(({users:{isLogin, mid}, home, address}) => ({isLogin, mid, home, ...address}))
export default class NewHome extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            url: ''
        };
        this.navbar;
      }
      componentDidMount() {
        // 请求tabBarIcon
        this.props.dispatch(createAction('home/fetchBottomIconConfig')());
        // 大数据埋点 接口 yl
        GetStatisticInfo('NewHome', 'NewHome', '', {});

        //从AsyncStorage中初始化 是否打开 查看佣金功能
        global.getItem('CommissionNotice').then(res=>{
          console.log('CommissionNotice',res);
          if(res=='b'){
            console.log('componentDidMount CommissionNotice   res = b');
            this.props.dispatch(action('users/changeCommission', {CommissionNotice: false }));
          }else {
            console.log('componentDidMount CommissionNotice   res = a');
            this.props.dispatch(action('users/changeCommission', {CommissionNotice: true }));
          }
        });
        this.loginSuccessListenner = DeviceEventEmitter.addListener('loginSuccess', (doNotFetchAdvertisement = false) => {
            // 加载信息弹窗
            if (!doNotFetchAdvertisement) {
              this.props.dispatch(createAction('home/fetchAdvertisement')());
            }
       });
        this.changeLocationListenner = DeviceEventEmitter.addListener('changeLocation', (doNotFetchAdvertisement = false) => {
            // 加载信息弹窗
            console.log('------------changeLocation------------');
            if (!doNotFetchAdvertisement) {
              this.props.dispatch(createAction('home/fetchAdvertisement')());
            }
       });

          // const param = {
          //     productId: '',
          //     storeId: '',
          //     type: 3,
          // };
          // GET(URL.GET_IF_CIRCLEPAGE, param).then((res)=>{
          //     if(res.success){
          //         this.setState({url: res.data});
          //     }
          // }).catch((err)=>{
          //     console.log(err);
          // })
Permissions.check('location').then(response => {
              // 如果已经打开定位权限 则进行定位
              if (response === 'authorized') {
                  } else if (response === 'denied') {
                      Alert.alert(
                          null,
                          `顺逛需要您打开地理定位权限`,
                          [
                              {text: '取消', onPress: () => console.log('取消')},
                              {text: '确认', onPress: () => Permissions.openSettings().then(() => null)},
                              // {text: 'OK', onPress: () => console.log('OK Pressed')},
                          ],
                      );
          }
});

          addPosition();
    }
    componentWillUnmount() {
        this.loginSuccessListenner.remove();
        this.changeLocationListenner.remove();
      }
    render() {
          let current = 0;
          const { advertisement } = this.props.home;
        return (
            <View style={[styles.container , {alignItems: 'center', justifyContent:'center'}]}>
                <HomeNavBar key={'NewHome'}
                    ref={(navbar) => this.navbar = navbar}
                    navigation = {this.props.navigation}/>
                <ScrollableTabView
                    initialPage={current}
                    // page={current}
                    onChangeTab={(item)=>{
                        // 这里的注释不要打开,否则点击切换不了页面(切记切记)
                        // console.log('----onChangeTab------');
                        // console.log(item);
                        let tabLabel = L.get(item, 'ref.props.tabLabel');
                        // console.log(tabLabel);
                        // 坑位 点击
                        NativeModules.StatisticsModule.track('PitClick', {PitName: tabLabel, UserId: L.get(this.props, 'mid', '游客')});
                    }}
                    locked={false}
                    renderTabBar={() => <ScrollableTabBar activeTab={current} style={{height: 44, justifyContent: 'center'}} activeTextColor={'#2979FF'}
                        inactiveTextColor={'#666666'} tabStyle={{height: 44, paddingLeft: 10, paddingRight: 10, justifyContent: 'center'}} underlineStyle={{height: 0}}/>}
                >
                    <View tabLabel='成套家电' style={{flex: 1}}>
                        <Ctjj/>
                    </View>
                    <View tabLabel='居家定制' style={{flex: 1}}>
                        <Jjdz/>
                    </View>
                    {/*<View tabLabel='众创定制' style={{flex: 1}}>*/}
                        {/*<Zcdz isLogin={this.props.isLogin} navigation = {this.props.navigation}/>*/}
                    {/*</View>*/}
                    <View tabLabel='众创首发' style={{flex: 1}}>
                        <Xpzc navigation = {this.props.navigation}/>
                    </View>
                    <View tabLabel='百货超市' style={{flex: 1}}>
                            <Bhcs navigation = {this.props.navigation}/>
                    </View>
                    <View tabLabel='生活服务' style={{flex: 1}}>
                        <Shfw navigation = {this.props.navigation}/>
                    </View>
                  <View tabLabel='体验店' style={{flex: 1}}>
                    <ExperienceStore navigation = {this.props.navigation}/>
                  </View>
                </ScrollableTabView>


                {/*<TouchableOpacity style={{position: 'absolute', bottom:100, right:16, backgroundColor: 'red', width: 50, height: 50}}*/}
                                  {/*onPress={ async ()=>{*/}
                                      {/*// this.props.dispatch(NavigationUtils.navigateAction("CharaPage"));*/}
                                      {/*// this.props.dispatch(NavigationUtils.navigateAction("LocalSpecialty"));*/}
                                      {/*// this.props.dispatch(NavigationUtils.navigateAction("QRCodeScannerView"));*/}
                                      {/*// this.props.dispatch(NavigationUtils.navigateAction("AllLocalSpecialtyList"));*/}
                                      {/*// this.props.dispatch(NavigationUtils.navigateAction("AppHotStatus"));*/}
                                      {/*// this.props.dispatch(NavigationUtils.navigateAction("ProductCases", {productId: 1000213}));*/}

                                      {/*// goToSQZBS();*/}
                                      {/*// if(this.props.isLogin){*/}
                                      {/*//     // 什么鬼*/}
                                      {/*//     const host = `http://mobiletest.ehaier.com:38080/race/`;*/}
                                      {/*//*/}
                                      {/*//     let mid = this.props.mid;*/}
                                      {/*//     let latitude = this.props.latitude;*/}
                                      {/*//     let longitude = this.props.longitude;*/}
                                      {/*//     const token = await global.getItem('userToken');*/}
                                      {/*//     let url;*/}
                                      {/*//     if(host.indexOf('?') > -1){*/}
                                      {/*//         url = `${host}&token=${encodeURIComponent(token)}&mid=${encodeURIComponent(mid)}&latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`;*/}
                                      {/*//     }else{*/}
                                      {/*//         url = `${host}?token=${encodeURIComponent(token)}&mid=${encodeURIComponent(mid)}&latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`;*/}
                                      {/*//     }*/}
                                      {/*//     this.props.dispatch(NavigationUtils.navigateAction("CommunityWeb3", {url: url}));*/}
                                      {/*//*/}
                                      {/*//     // const host = `http://172.18.20.222:3000/race`;*/}
                                      {/*//     // GET(URL.SQZBS3).then(async res=>{*/}
                                      {/*//     //     if(res.success){*/}
                                      {/*//     //         let mid = res.data;*/}
                                      {/*//     //         const token = await global.getItem('userToken');*/}
                                      {/*//     //         let url;*/}
                                      {/*//     //         if(host.indexOf('?') > -1){*/}
                                      {/*//     //             url = `${host}&token=${encodeURIComponent(token)}&encMid=${encodeURIComponent(mid)}`;*/}
                                      {/*//     //         }else{*/}
                                      {/*//     //             url = `${host}?token=${encodeURIComponent(token)}&encMid=${encodeURIComponent(mid)}`;*/}
                                      {/*//     //         }*/}
                                      {/*//     //         this.props.dispatch(NavigationUtils.navigateAction("CommunityWeb3", {url: url}));*/}
                                      {/*//     //     }else{*/}
                                      {/*//     //         Toast.info('请求 encMid 异常');*/}
                                      {/*//     //     }*/}
                                      {/*//     //      }).catch(err=>{*/}
                                      {/*//     //     Toast.info('请求 encMid err 异常');*/}
                                      {/*//     //          console.log(err)*/}
                                      {/*//     // });*/}
                                      {/*//*/}
                                      {/*// }else {*/}
                                      {/*//     dvaStore.dispatch(createAction('router/apply')({*/}
                                      {/*//         type: 'Navigation/NAVIGATE', routeName: 'Login',*/}
                                      {/*//     }));*/}
                                      {/*// }*/}
                                      {/*// this.props.dispatch(NavigationUtils.navigateAction("CommunityWeb", {url: `http://m.ehaier.com/www/#/goldgame/b3fb1e2006ccbd27?sg_rn_app%7B%22home%22%3A%22shunguang-RN%22%2C%22userMsg%22%3A%7B%22CommissionNotice%22%3Atrue%2C%22ReflectedNotice%22%3Atrue%2C%22mobile%22%3A%2218558786767%22%2C%22rankName%22%3Anull%2C%22cartNumber%22%3A1%2C%22sessionKey%22%3A%22m_ehaier_sessionid%22%2C%22userId%22%3A29779341%2C%22token%22%3A%229eb44b784bf925209b78331dc1621f51%22%2C%22userName%22%3A%22I%20DO%22%2C%22mid%22%3A29779341%2C%22avatarImageFileId%22%3A%22http%3A%2F%2Fcdn50.ehaier.com%2Fmobile-app-platform-web%2Fimagev3controller%2Fimage%2F2018%2F07%2F27144aba5fa34424bf3252a3b73d8961.jpg%22%2C%22nickName%22%3A%22ferryvip%22%2C%22gender%22%3A0%2C%22email%22%3A%22%22%2C%22birthday%22%3A%221990-08-06%22%2C%22sessionValue%22%3A%22589ae39e-3149-4cf9-98f6-a77d35810d6d451%23gdXg0R9twcFqEBX2H90x724ExGZ%2FsCaqCJgT6YgRuuzhnWYJGER0s2iYVQbuw2Pl%22%2C%22loginName%22%3A%2218558786767%22%2C%22ucId%22%3A%229fb834a14e84dbe3193a267191f18f96%22%2C%22accessToken%22%3A%22568614ba-bd7d-4283-b963-efc77848527c%22%2C%22userToken%22%3A%22Bearer589ae39e-3149-4cf9-98f6-a77d35810d6d451%23gdXg0R9twcFqEBX2H90x74Z9am7JBeWIEwhUkHFr5XSlz%2FMxh81MGNwiAvWOXxP%2B%22%2C%22isLogin%22%3Atrue%2C%22isHost%22%3A1%2C%22unread%22%3A0%2C%22userCount%22%3A-1%2C%22password%22%3A%22%22%2C%22isNewUser%22%3Anull%2C%22isStoreMember%22%3A%22true%22%2C%22promotionCode%22%3A%2229779341%22%2C%22userAcount%22%3A%2218558786767%22%7D%2C%22addressInfo%22%3A%7B%22provinceId%22%3A%222%22%2C%22cityId%22%3A%22716%22%2C%22areaId%22%3A%22937%22%2C%22streetId%22%3A%2212024842%22%2C%22regionName%22%3A%22%E6%98%8C%E5%B9%B3%E5%8C%BA%2F%E5%9B%9E%E5%8D%97%E8%B7%AF%22%7D%7D`}));*/}
                                      {/*// NativeModules.ToolsModule.presentH5View(['https://m.ehaier.com/www/index_hs.html#/newHome', 'test']);*/}
                                      {/*// this.props.dispatch(NavigationUtils.navigateAction("CommunityWeb", {url: `https://cblog.ferryvip.com/?abc=2121`}));*/}
                                      {/*// this.props.dispatch({type: 'ADModel/show120'});*/}
                                      {/*// alert('code-push 热更新');*/}
                                      {/*// GET('http://localhost:7777')*/}
                {/*}}>*/}
                {/*<View style={{backgroundColor: 'red'}}>*/}
                    {/*<Text>App 社群 3 期入口</Text>*/}
                {/*</View>*/}
                {/*</TouchableOpacity>*/}

                {
                    this.props.isLogin && <Advertisement
                        navigation={this.props.navigation}
                        advertisement={advertisement}
                        storeId={this.props.storeId}
                        onClose={(type) => {
                        if ('newPerson' === type) {
                            this.props.dispatch(createAction('home/clearAdvertisement')({
                            advertisement: {
                                bannerNewGriftJson: [],
                                bannerInfotJson: advertisement.bannerInfotJson,
                            },
                            }));
                        } else if ('noMsg' === type) {
                            this.props.dispatch(createAction('home/clearAdvertisement')({
                            advertisement: {
                                bannerInfotJson: [],
                                bannerNewGriftJson: advertisement.bannerNewGriftJson,
                            },
                            }));
                        }
                        }}
                    />
                    }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    }
});
