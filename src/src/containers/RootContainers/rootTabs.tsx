import * as React from 'react';
import { View, Image, Text, Platform, StyleSheet, TextInput, NativeModules,
  DeviceEventEmitter } from 'react-native';
import Home from '../Home';
// import NewHome from '../Home';
import NewHome from '../NewHome';
import Category from '../Categories';
import TCart from '../Cart';
import Mine from '../Mine';
import BindMobile from '../Acount/bineMobile';
import Community from '../Community';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import Categories from '../Categories';
import { width, createAction, IS_NOTNIL } from '../../utils/index';
import CommitOrder from '../CommitOrder/index';
import CustomTabBarBottom from './TabView/CustomTabBarBottom';
import TabBarItem from './TabView/TabBarItem';
import Config from 'react-native-config';
import CustomWebView from '../webview/CustomWebView';
import {Color} from 'consts';
import L from 'lodash';

const tabBarHeight = Platform.select({
    ios: 49,
    android: 54,
  });
const info = {type: 11, tag: 'leave', success: 1};

const RootTabs = TabNavigator({
        NewHome: {
            screen: NewHome,
            navigationOptions: {
                tabBarLabel: '智家',
                title: 'NewHome',
                tabBarIcon: ({ tintColor, focused }) => (
                    <TabBarItem
                        style={[{tintColor}, styles.iconStyle]}
                        focused={focused}
                        mykey = 'sg'
                        title ='智家'
                    />
                    // <Image
                    //   source={focused ? require('../../images/tab_ic_home_hover.png') : require('../../images/tab_ic_home.png')}
                    //   style={[{tintColor}, styles.iconStyle]}
                    // />
                ),
                header: null,
                tabBarOnPress: ({previousScene, scene, jumpToIndex}) => {
                  jumpToIndex(scene.index);
                  if (global.sceneIndex === 2) {
                    global.sceneIndex = scene.index;
                    NativeModules.APICloudModule.RNCallNaviteMethod(info);
                  }
                  NativeModules.StatisticsModule.track('PitClick', {PitName: '智家', UserId: L.get(dvaStore.getState(), 'users.mid', '游客')});
                },
            },
        },
        Home: {
          screen: Home,
          navigationOptions: {
            tabBarLabel: '逛逛',
            title: 'Home',
            tabBarIcon: ({ tintColor, focused }) => (
              <TabBarItem
                  style={[{tintColor}, styles.iconStyle]}
                  focused={focused}
                  mykey = 'fl'
                  title ='逛逛'
                />
              // <Image
              //   source={focused ? require('../../images/tab_ic_home_hover.png') : require('../../images/tab_ic_home.png')}
              //   style={[{tintColor}, styles.iconStyle]}
              // />
            ),
            header: null,
            tabBarOnPress: ({previousScene, scene, jumpToIndex}) => {
              DeviceEventEmitter.emit('update_flash_sale');
              jumpToIndex(scene.index);
              if (global.sceneIndex === 2) {
                global.sceneIndex = scene.index;
                NativeModules.APICloudModule.RNCallNaviteMethod(info);
              }
                NativeModules.StatisticsModule.track('PitClick', {PitName: '逛逛', UserId: L.get(dvaStore.getState(), 'users.mid', '游客')});
            },
          },
        },
    // Category: {
    //   screen: Category,
    //   navigationOptions: {
    //     tabBarLabel: '分类',
    //     title: 'Category',
    //     tabBarIcon: ({ tintColor, focused }) => (
    //       <TabBarItem
    //         style={[{tintColor}, styles.iconStyle]}
    //         focused={focused}
    //         mykey = 'fl'
    //         title ='分类'
    //       />
    //       // <Image
    //       //   source={focused ? require('../../images/tab_ic_category_hover.png') :
    //       //   require('../../images/tab_ic_category.png')}
    //       //   style={[{tintColor}, styles.iconStyle]}
    //       // />
    //     ),
    //     header: null,
    //   },
    // },
    Community: {
      screen: Community,
      navigationOptions: {
        header: null,
        tabBarLabel: '社区',
        headerLeft: null,
        tabBarIcon: (props) => {
          // if (dvaStore) {
          //   const { iconConfig: {iconImageConfig, iconFontConfig}} = dvaStore.getState().home;
          // }
          const { tintColor, focused } = props;
          Log('====================================');
          Log();
          Log('====================================');
          return (
            <TabBarItem
              style={[{tintColor}, styles.iconStyle]}
              focused={focused}
              mykey = 'sq'
              title ='社区'
              titleStyle={{color:Color.ORANGE_1}}
          />
            // <Image
            //   // tslint:disable-next-line:max-line-length
            //   source={focused ? require('../../images/tab_ic_community_hover.png') : require('../../images/tab_ic_community.png')}
            //   style={[{tintColor}, styles.iconStyle]}
            // />
          );
        },
        tabBarOnPress: async ({previousScene, scene, jumpToIndex}) => {
          // 跳转到社区界面
          jumpToIndex(scene.index);
          if (global.sceneIndex >= 0 && global.sceneIndex !== 2) {
            const back = {type: 11, tag: 'back', success: 1};
            NativeModules.APICloudModule.RNCallNaviteMethod(back);
          }
          global.sceneIndex = scene.index;
          // // 每次点击社区 的 Tab标签都要传递token给APICloud界面
          // // 获取tocken, 如果登录,就把登录后带#号的token传过去,没登录就把未登录的token传过去
          // const token = await global.getItem('userToken');
          // // 成功的回调
            NativeModules.StatisticsModule.track('PitClick', {PitName: '社区', UserId: L.get(dvaStore.getState(), 'users.mid', '游客')});
        },
      },
    },
        TCart: {
      screen: TCart,
      navigationOptions: {
        // title: '购物车',
        // tabBarLabel: '购物车',
        // headerTitleStyle: {
        //   color: '#333333',
        //   flex: 1,
        //   textAlign: 'center',
        //   alignSelf: 'center',
        //   fontSize: 17,
        //   fontWeight: 'normal',
        //   letterSpacing: -0.41,
        //   marginLeft: 60,
        // },
        header: null,
        tabBarIcon: ({ tintColor, focused }) => (
          <TabBarItem
            style={[{tintColor}, styles.iconStyle]}
            focused={focused}
            mykey = 'gwc'
            title ='购物车'
          />
        ),
        tabBarOnPress: ({previousScene, scene, jumpToIndex}) => {
          jumpToIndex(scene.index);
          if (global.sceneIndex === 2) {
            global.sceneIndex = scene.index;
            NativeModules.APICloudModule.RNCallNaviteMethod(info);
          }
            NativeModules.StatisticsModule.track('PitClick', {PitName: '购物车', UserId: L.get(dvaStore.getState(), 'users.mid', '游客')});
        },
      },
    },

    Mine: {
      screen: Mine,
      navigationOptions: {
        tabBarLabel: '我的',
        tabBarIcon: ({ tintColor, focused }) => (
          <TabBarItem
          style={[{tintColor}, styles.iconStyle]}
          focused={focused}
          mykey = 'wd'
          title ='我的'
        />
          // <Image
          //   source={focused ? require('../../images/tab_ic_mine_hover.png') : require('../../images/tab_ic_mine.png')}
          //   style={[{tintColor}, styles.iconStyle]}
          // />
        ),
        header: null,
        tabBarOnPress: ({previousScene, scene, jumpToIndex}) => {
          // 跳转到Mine界面
          jumpToIndex(scene.index);
          // 如果已经登录,就请求数据
          if (dvaStore.getState().users.isLogin) {
            // 每次点击Mine 的 Tab标签都要刷新Mine界面
            // dvaStore.dispatch(createAction('mine/fetchMsgCenter')());
            // dvaStore.dispatch(createAction('mine/fetchManageData')());
            // dvaStore.dispatch(createAction('mine/fetchOrderCountData')());
            // dvaStore.dispatch(createAction('mine/fetchWdHostData')());
            // dvaStore.dispatch(createAction('mine/fetchFindLatestGame')());
            // dvaStore.dispatch(createAction('mine/fetchRealNameAuthStatus')());

            // 刷新通知也要在登录成功
            DeviceEventEmitter.emit('update_mine_data');
          }
          if (global.sceneIndex === 2) {
            NativeModules.APICloudModule.RNCallNaviteMethod(info);
            if (dvaStore.getState().users.isLogin) {
              //  当上个界面是社区界面，且已登录把sceneIndex设置scene.index，
              // 未登录不设置是因为登陆成功后自动跳转社区，此时不执行社区点击按钮操作
              global.sceneIndex = scene.index;
            }
          }
            NativeModules.StatisticsModule.track('PitClick', {PitName: '我的', UserId: L.get(dvaStore.getState(), 'users.mid', '游客')});
        },
      },
    },
  },
  {
    tabBarComponent: CustomTabBarBottom,
    tabBarPosition: 'bottom',
    lazy: true,
      show: true,
    showLabel: false,
    swipeEnabled: false,          // 是否允许通过手势划动来切换标签页
    animationEnabled: false,      // 标签页切换时是否有动画效果
    backBehavior: true,           // 点击返回键 返回第一个tab
    tabBarOptions: {              // JS 对象，用来配置标签栏
      activeTintColor: 'red', // 文字和图片选中颜色
      inactiveTintColor: '#999',  // 文字和图片未选中颜色
      showIcon: true,             // android 默认不显示 icon, 需要设置为 true 才会显示
      indicatorStyle: {
            height: 0,             // 如TabBar下面显示有一条线，可以设高度为0后隐藏
        },
      style: {
          // flexDirection: 'column',
          // justifyContent: 'flex-end',
          // margin: 10,
          // padding: 10,
          // alignItem: 'flex-end',
          backgroundColor: Color.WHITE,
          height: tabBarHeight,
        },
      labelStyle: {
          fontSize: 10,       // 文字大小
          // marginBottom: 5,
          // alignSelf: 'flex-end',
          // justifyContent: 'flex-end',
          // flexDirection: 'column',
      },
      iconStyle: {            // 图标的样式
        // marginBottom: 10,
        // justifyContent: 'flex-end',
        // flexDirection: 'column',
        // marginTop: 10,
      },
    },
  });

const styles = StyleSheet.create({
    iconStyle: {
        width: 30,
        height: 30,
    },
});
export default RootTabs;
