import * as React from 'react';
import { BackHandler, Animated, Easing, Platform, StatusBar, NativeModules, Linking, ToastAndroid, BackAndroid } from 'react-native';
import {
  addNavigationHelpers,
  NavigationActions,
} from 'react-navigation';
import {
  createReduxBoundAddListener,
} from 'react-navigation-redux-helpers';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import RootNavigator from '../containers/RootContainers/rootNavigator';
import { getUserInfo } from './userUtil';
import { getAppJSON, postAppJSON } from '../netWork';
import Config from 'react-native-config';
import { isWdHost, createAction, logout, resetLoginMsg, GetQueryString } from '../utils';
import Orientation from 'react-native-orientation';
import {goBanner} from '../utils/tools';
import { GetStatisticInfo } from '../common/GetStatisticInfo'; // yl
import { action, NavigationUtils } from './../dva/utils';

import JPushModule from 'jpush-react-native';
const openNotificationEvent = 'openNotification';
const android = Platform.OS == 'android';
let waitingFlag = false;
// 获取当前屏幕显示界面的路由名称
export function getCurrentScreen(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  if (route.routes) {
    return getCurrentScreen(route);
  }
  return route.routeName;
}
// 获取当前路由的index
function getCurrentRouteIndex(navigationState, currentRouteName) {
  if (!navigationState) {
    return -1;
  }
  let foundIndex = -1;
  navigationState.routes.every((thisRoute, index) => {
    if (thisRoute.routeName === currentRouteName) {
      foundIndex = index;
      return false;
    } else if (thisRoute.routes) {
      const routerIndex = getCurrentRouteIndex(thisRoute, currentRouteName);
      if (routerIndex !== -1) {
        foundIndex = index;
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  });
  return foundIndex;
}

class NavigationRouter extends React.Component<any> {
  get backHandle(): () => (boolean) {
    return this._backHandle;
  }

  set backHandle(value: () => (boolean)) {
    this._backHandle = value;
  }
  private subscriptionidH5OpenRNToPageKey: any;
    _orientationDidChange = (e)=>{
        // console.log(e);
        // console.log('-------_orientationDidChange----智家场景---route--');
        let route = getCurrentScreen(this.props.router);
        console.log(route);
        // 不是社区界面才走下面的逻辑
        if (route !== 'Community' && route !== 'SuperSecondView') {
          if (route == 'ScenePage') {
              //
              Orientation.getOrientation((err, orientation) => {
                  console.log(orientation);
                  if (orientation == 'PORTRAIT') {
                      // console.log('在 ScenePage 里');
                      // Orientation.lockToPortrait();
                      // Orientation.lockToLandscape();
                      // console.log('-------== ScenePage ==----_orientationDidChange---lockToLandscapeRight------');
                      Orientation.lockToLandscapeRight();
                  }
                  // console.log(`Current Device Orientation: ${orientation}`);
              });

          } else {
              Orientation.getOrientation((err, orientation) => {
                  console.log(orientation);
                  if (orientation != 'PORTRAIT') {
                      // console.log('在 ScenePage 里');
                      Orientation.lockToPortrait();
                      // Orientation.lockToLandscape();
                      // console.log('-------== ScenePage ==----_orientationDidChange---lockToLandscapeRight------');
                      // Orientation.lockToLandscapeRight();
                  }
                  // console.log(`Current Device Orientation: ${orientation}`);
              });
          }
        }
    };
  public componentWillMount() {
    // 监听安卓物理返回键
    BackHandler.addEventListener('hardwareBackPress', this._backHandle);
  }

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {};
    this._backHandle = this._backHandle.bind(this);
    this._orientationDidChange = this._orientationDidChange.bind(this);
  }

  public componentDidMount() {
    // 监听跳转到特定界面
    Linking.addEventListener('url', this.handleOpenURL);
    if (Platform.OS === 'android') {
      NativeModules.ToolsModule.getSchemeUrl()
      .then((result) => {
        this.handleOpenURL(result);
      });
    }
    if (Platform.OS === 'ios') {
        Orientation.addOrientationListener(this._orientationDidChange);
        Orientation.addSpecificOrientationListener(this._orientationDidChange);
    }
    if (Platform.OS === 'android') {
      JPushModule.initPush();
      // JPushModule.getInfo(map => {
      //   this.setState({
      //     appkey: map.myAppKey,
      //     imei: map.myImei,
      //     package: map.myPackageName,
      //     deviceId: map.myDeviceId,
      //     version: map.myVersion,
      //   });
      // });
      JPushModule.notifyJSDidLoad(resultCode => {
        if (resultCode === 0) {
          // demo中没写
        }
      });
    } else {
      JPushModule.setupPush();
    }
    JPushModule.addReceiveOpenNotificationListener(map => {
      if (Platform.OS === 'android') {
        const msg = JSON.parse(map.extras);
        goBanner(msg, this.props.navigation);
      } else {
        goBanner(map.extras, this.props.navigation);
      }
      // this.props.dispatch(NavigationUtils.navigateAction(msg.routeName, {...msg, token: tk}));
    });
  }

  public componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._backHandle);
    Linking.removeEventListener('url', this.handleOpenURL);

    if (Platform.OS === 'ios') {
        Orientation.removeOrientationListener(this._orientationDidChange);
        Orientation.removeSpecificOrientationListener(this._orientationDidChange);
    }
    JPushModule.removeReceiveOpenNotificationListener(openNotificationEvent);
    JPushModule.clearAllNotifications();
  }

  // H5跳转到RN特定界面
  public handleOpenURL = (e) => {
    // 解码URL
    const LinkUrl = decodeURIComponent(e.url);
    const fdStart = LinkUrl.indexOf('shunguang://');
    if (fdStart === 0) {
      // 说明链接是以shunguang://开头的
      const arr = LinkUrl.split('|');  // 以|分割字符串
      if (arr.length < 2) {
        // 说明没有|后面的内容,认为是无效链接
        return;
      }
      const link = arr[1];
      const secritId = GetQueryString('secritId', arr[0]);
      // console.log('zhaoxincheng>>secritId>>', secritId);
      const linkArr = link.split('&');  // 以&分割字符串
      linkArr.map((item, index) => {
        console.log('zhaoxincheng>>>>item', item);
        console.log('zhaoxincheng>>>>index', index);
        console.log('zhaoxincheng>>>>-----------------------');
      });
      if (linkArr.length > 0) {
        let routerName = '';
        // 截取参数
        const params = {};
        linkArr.map((item, index) => {
          if (index === 0) {
            const paramKeyAndValue = item.split('=');
            routerName = paramKeyAndValue[1];
          } else {
            const paramKeyAndValue = item.split('=');
            if (paramKeyAndValue[0] === 'userToken') {
              // 因为旧版ionic使用token来获取token,所以新版RN的token用userToken传递token值
              const key = 'token';
              params[key] = paramKeyAndValue[1];
            } else {
              params[paramKeyAndValue[0]] = paramKeyAndValue[1];
            }
          }
        });
        console.log('zhaoxincheng>>路由名称>>', routerName);
        console.log('zhaoxincheng>>参数>>', params);
        if (LinkUrl.indexOf('publishCircle') !== -1) {
          // resetLoginMsg(secritId); // 重置登录信息
        }

        if (params.url.indexOf('video_record') !== -1) {
          if (Platform.OS === 'android') {
              NativeModules.ToolsModule.Permission(
                  [
                      'android.permission.WRITE_EXTERNAL_STORAGE',
                      'android.permission.READ_EXTERNAL_STORAGE',
                      'android.permission.CAMERA',
                      'android.permission.RECORD_AUDIO']
                  , '相机读写').
              then(async (data) => {
                  if (data === 'success') {
                      this.props.dispatch(NavigationUtils.navigateAction(routerName, {
                          url: params.url,
                          topicId: params.topicId,
                          topicName: params.topicName,
                          taskId: Number(params.activityId),
                          userToken: params.token,
                          topicType: 'video',
                      }));
                  }
              });
          } else {
              this.props.dispatch(NavigationUtils.navigateAction(routerName, {
                  url: params.url,
                  topicId: params.topicId,
                  topicName: params.topicName,
                  taskId: Number(params.activityId),
                  userToken: params.token,
                  topicType: 'video',
              }));
          }
        } else {
          // 跳转到任意界面
            console.log('----------跳转到任意界面-------------');
            console.log(`routerName: ${routerName},params: ${JSON.stringify(params)} `);
          this.props.dispatch(NavigationUtils.navigateAction(routerName, { ...params }));
        }
      }
    }
  }
  public render(): JSX.Element {
    // 解构从dva中注入到当前组件props中的dispatch和router
    const { dispatch, router } = this.props;
    const addListener = createReduxBoundAddListener('root');
    // 不加addListener: () => {}在新版本的react-navigation中会报错
    const navigation = addNavigationHelpers({ dispatch, state: router, addListener });
    // // 渲染根导航组件
    return <RootNavigator navigation={navigation} />;
  }

  // 点击android物理返回按钮调用的方法
  private _backHandle = () => {
    if (this.props.router) {
      // 获取当前路由名称
      const currentScreen = getCurrentScreen(this.props.router);
      if ((currentScreen === 'Login' && global.sceneIndex !== 2)
        || currentScreen === 'Home'
        || currentScreen === 'TCart'
        || currentScreen === 'Mine'
        || currentScreen === 'NewHome'
        || currentScreen === 'Community'
        || currentScreen === 'GoodsDetail'
        || currentScreen === 'CustomWebView'
        || currentScreen === 'VIPCenterWeb'
        || currentScreen === 'SuperSecondView'
      ) {
        // 点击物理返回按钮无效
        // return true;
        if (currentScreen === 'Home'
          || currentScreen === 'Mine'
          || currentScreen === 'TCart'
        ) {
          // 返回到 智家首页
          //   this.props.dispatch(NavigationActions.navigate('NewHome'));
          this.props.dispatch(NavigationUtils.navigateAction('NewHome'));
          return true;
        } else if (currentScreen === 'NewHome') {
          if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            //最近2秒内按过back键，可以退出应用。
              BackHandler.exitApp();
            return false;
          }
          this.lastBackPressed = Date.now();
          ToastAndroid.show('再按一次退出应用', 50);
          return true;
        } else if (currentScreen === 'Community') {
          NativeModules.APICloudModule.GoBack(1);
          return true;
        } else if (currentScreen === 'SuperSecondView') {
          NativeModules.APICloudModule.GoBack(2);
          return true;
        } else {
          return true;
        }
      } else {
        // 正常返回
        this.props.dispatch(NavigationActions.back());
        return true;
      }
    }
    return false;
  }

}
// 注入router到当前组件,router在navigationModel中定义
const mapStateToProps = (state) => {
  // Log('====================================');
  // Log('输出state' + JSON.stringify(state));
  // Log('====================================');
  return ({
    router: state.router,
  });
};
// 导出导航Router组件
export default connect(mapStateToProps)(NavigationRouter);

export function routerReducer(state?, action: any = {}) {
  // getUserInfo().then(json => Log('user info', json));
  // 点击 订单支付页面的返回               yl
  if (action.type === 'Navigation/BACK' && ((state.routes[state.index].routeName === 'Payment') || state.routes[state.index].routeName === 'PaymentResult' || state.routes[state.index].routeName === 'CommitSuccess')) {
    if (action.type === 'Navigation/BACK' && state.routes[state.index - 1].routeName && (state.routes[state.index - 1].routeName === 'CommitOrder')) { //从结算页来

      let goodsDetailIndex = 0;
      state.routes.map((o, i) => {
        if (o.routeName == 'GoodsDetail') {
          goodsDetailIndex = i
        }
      })
      return RootNavigator.router.getStateForAction({ type: 'Navigation/BACK', key: state.routes[goodsDetailIndex + 1].key }, state);
    } else {
      RootNavigator.router.getStateForAction(action, state);
    }
    // return RootNavigator.router.getStateForAction({ type: 'Navigation/BACK', key: state.routes[state.index - 1].key }, state);
  }
  // 如果路由数组里只有一个登陆路由
  if (action.type === 'Navigation/BACK' && (!(state.routes[state.index - 1]) && (state.routes[state.index].routeName === 'Login'))) {
    return RootNavigator.router.getStateForAction(
      NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ type: NavigationActions.NAVIGATE, routeName: 'RootTabs' })],
      }), state,
    );
  }
  if (action.type === 'Navigation/BACK' && ((state.routes[state.index - 1].routeName === 'RootTabs'))) {
    dvaStore.dispatch(createAction('users/getUnreadMessage')());
  }
  // 返回到 我的 页面时 调个人信息接口
  if (action.type === 'Navigation/BACK' && ((state.routes[state.index - 1].index === 4))) {
    dvaStore.dispatch(createAction('mine/fetchManageData')());
  }
  // 如果在绑定手机号页面,上一个页面是登录页面,用户没有绑定手机号 直接点击返回按钮时 需要注销用户信息 并且返回到登录页面的上一个页面 还有 点击绑定按钮时 返回上上个页面的处理
  if (action.type === 'Navigation/BACK' && state.routes[state.index - 1].routeName === 'Login' && state.routes[state.index].routeName === 'BindMobile') {
    if (global.deleteUsersMsg) {
      logout(); // 注销用户信息
    }
    return RootNavigator.router.getStateForAction({ type: 'Navigation/BACK', key: state.routes[state.index - 1].key }, state);
  }

  if (action.type === 'Navigation/BACK' &&
    ((state.routes[state.index - 1].routeName === 'PaymentResult') ||
      (state.routes[state.index - 1].routeName === 'PaymentFailed')
    )) {
    return RootNavigator.router.getStateForAction(
      NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ type: NavigationActions.NAVIGATE, routeName: 'RootTabs' })],
      }), state,
    );
  }

  if (action.type === 'Navigation/BACK' && (state.routes[state.index].routeName === 'GoodsList')) {
    let count = -1;
    for (const item of state.routes) {
      item.routeName === 'GoodsList' ? count++ : null;
      item.routeName === 'Search' ? count++ : null;
    }
    return RootNavigator.router.getStateForAction({ type: 'Navigation/BACK', key: state.routes[state.index - count].key }, state);
  }

  if (action.type === 'Navigation/BACK' && (state.routes[state.index - 1].routeName === 'GoodsDetail')) {
    return backToGoodsDetail(state, action);
  }

  if (
    (
      action.type === 'Navigation/BACK' &&
      action.key &&
      action.key.indexOf('id-') === -1 &&
      state.routes[state.index].routeName !== 'RootTabs' &&
      state.routes[state.index].routeName !== action.key
    ) ||
    (action.type === 'backTo' && action.key)
  ) {
    // 获取当前界面的路由索引
    let routeIndex = getCurrentRouteIndex(state, action.key);
    // navigationAction back是backFrom, backTo需要加1
    action.type === 'backTo' && (routeIndex = routeIndex + 1);
    routeIndex = Math.min(routeIndex, state.routes.length);
    // 做返回操作
    return RootNavigator.router.getStateForAction({ type: 'Navigation/BACK', key: state.routes[routeIndex].key }, state);
  }
  // 判断是否是跳转操作
  if (action.type === 'Navigation/NAVIGATE') {
    if (!waitingFlag) {
      waitingFlag = true;
      setTimeout(() => {
        waitingFlag = false;
      }, 1000);
      return navigateJudgeLogin(state, action);
    } else {
      return state;
    }
  }
  // action.type不是上面两种类型,就直接触发action
  return RootNavigator.router.getStateForAction(action, state);
}

export function conditionNavigate(state?, action: any = {}) {
  if (state.routes.length <= 2) { return state; }
  const conditionName = state.routes[state.index - 1].routeName;
  // if (conditionName) {
  //   return RootNavigator.router.getStateForAction({ routeName: "Category", type: "Navigation/NAVIGATE" }, state);
  // }
}
// 导航跳转判断用户是否登录
export function navigateJudgeLogin(state?, action: any = {}) {
  const { routeName, params } = action;

  // 防止重复跳转
  const { routeName: preRoutName, params: preParams } = state.routes[state.index];
  if (routeName === preRoutName && JSON.stringify(params) === JSON.stringify(preParams)) {
    return state;
  }
  // 大数据 埋点    yl
  let pre = ''; // 上一个路由
  if (state.routes[state.routes.length - 1].routeName != 'RootTabs') {
    pre = state.routes[state.routes.length - 1].routeName;
  } else {
    pre = state.routes[state.routes.length - 1].routes[state.routes[state.routes.length - 1].index].routeName;
  }
  let next = routeName || ''; //当前路由
  if (next != 'GoodsDetail') { //单品页单独处理
    GetStatisticInfo(next, next, pre, {
      productId: params && params.productId ? params.productId : '',
      storeId: params && params.storeId ? params.storeId : ''
    });
  }


  if (routeName == 'ScenePage') {
    StatusBar.setHidden(true, 'fade');
    // 只允许横屏
    if (android) {
      Orientation.lockToLandscape();
    } else {
      // Orientation.lockToPortrait();
      // Orientation.lockToLandscape();
      Orientation.lockToLandscapeRight();
    }
  } else {
    StatusBar.setHidden(false, 'fade');
    Orientation.getOrientation((err, orientation) => {
      if (orientation !== 'PORTRAIT') {
        // Orientation.lockToLandscape();
        Orientation.lockToPortrait();
      }
      // console.log(`Current Device Orientation: ${orientation}`);
    });
  }
  // 所有需要登录以后才能访问的页面路由
  const needLoginRouters = [
    'CommitOrder', // 提交订单页
    'Mine', // 我的页面
    'MessageDetail', // 消息中心
    // 'Cart', // 购物车
  ];
  // 查看当前要跳转的界面是否在强制登录列表里面
  if (needLoginRouters.indexOf(routeName) !== -1) {
    // 如果在,就判断用户是否登录
    console.log('helper======== 是否已经登录-----' + dvaStore.getState().users.isLogin);
    if (!dvaStore.getState().users.isLogin) {
      // 如果没登录,就跳转到登录页面
      return RootNavigator.router.getStateForAction({
        routeName: 'Login',
        type: 'Navigation/NAVIGATE',
        params: { navigateRouteName: routeName, navigateParams: params }
      },
        state);
    } else {
      // 如果已经登录,就直接做跳转操作
      // 只允许竖屏
      // Orientation.lockToLandscape();
      // Orientation.lockToPortrait();
      return RootNavigator.router.getStateForAction(action, state);
    }
  } else {
    // 不在强制登录列表里,就直接做跳转操作
    if (routeName === 'Cart') {
      if ((state.index >= 3) && (state.routes[state.index - 1].routeName === 'Cart')) {
        return RootNavigator.router.getStateForAction({ type: 'Navigation/BACK', params: { showCartBackBtn: false } }, state);
        // return RootNavigator.router.getStateForAction({ type: 'Navigation/NAVIGATE', key: state.routes[state.index - 1].key }, state);
      }
      const cartAction = { ...action, params: { ...action.params, edit: false } };
      return RootNavigator.router.getStateForAction(cartAction, state);
    } else {
      return RootNavigator.router.getStateForAction(action, state);
    }
  }
}

function backToGoodsDetail(state, action) {
  if (state.routes.length > 5) { // 超过5个返回时可以删除一些栈内的route
    const firstIndex = state.routes.findIndex((item) => item.routeName === 'GoodsDetail');
    if (firstIndex + 1 < state.index) {
      return RootNavigator.router.getStateForAction({ type: 'Navigation/BACK', key: state.routes[firstIndex + 1].key }, state);
    }
  }
  return RootNavigator.router.getStateForAction(action, state);
}

// export function loginSuccess(state?, action: any = {}) {
//   const { key } = state.routes[state.routes.length - 1];

//   // const successAction = {
//   //   type: 'Navigation/REPLACE',
//   //   key,
//   //   routeName: action.routeName,
//   // };

//   if (state.routes.length > 1 && state.index > 0) {
//     const oldIndex = state.index;
//     // 移除替换
//     state.routes.splice(oldIndex, 1);
//     // index现在就减少了一个
//     state.index = oldIndex - 1;
//   }
//   // return RootNavigator.router.getStateForAction({ routeName: action.routeName, type: 'Navigation/NAVIGATE' }, state);
//   return RootNavigator.router.getStateForAction(action, state);
// }

// export default AppWithNavigationState;
