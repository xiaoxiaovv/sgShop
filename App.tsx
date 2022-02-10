/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import * as React from 'react';
import SplashScreen from 'react-native-splash-screen';
import {
  DeviceEventEmitter,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import RootContainer from './src/containers/RootContainers/rootContainer';
import dva from './src/dvaModel';
import { isiPhoneX, getToken, isWdHost, cutImgUrl, createAction } from './src/utils';
import storage from './src/utils/storage';
import { getLocation } from './src/utils/tools';
// app entry

import URL from './src/config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

EStyleSheet.build({
  $rem: SWidth / 375.00,
  $xBottom: isiPhoneX ? 33 : 0,
  $darkblue: '#2979FF',
  $darkred: '#FF6026',
  $darkblack: '#333333',
  $black: '#666666',
  $gray: '#999999',
  $lightblack: '#E4E4E4',
  $lightgray: '#EEEEEE',
  $fontSize1: '10rem',
  $fontSize2: '12rem',
  $fontSize3: '14rem',
  $fontSize4: '16rem',
  $fontSize5: '17rem',
});
const Log = (...params: any[]) => { // 全局Log
  if (__DEV__) {
    // console.log(params);
  }
};

// 验证后台返回数据是否为 undefined 或 null  或  ''
const IS_NOTNIL = (value) => {
  if (value !== undefined && value !== null && value !== '') {
    // 非空
    return true;
  } else {
    // 空
    return false;
  }
};

global.getItem('ReflectedNotice')
  .then((res) => {
    if (res == null) {

      dvaStore.dispatch(createAction('users/changeReflectedNotice')({ ReflectedNotice: true }));
      global.setItem('ReflectedNotice', true);

      // global.CommissionNotice=false;
    } else {
      dvaStore.dispatch(createAction('users/changeReflectedNotice')({ ReflectedNotice: res }));
      // global.CommissionNotice=true;
    }
  })


global.getItem('firstInstallSg')
  .then((res) => {
    if (res === null) { // 是第一次安装
      global.setItem('firstInstallSg', 'true');
    } else {
      global.setItem('firstInstallSg', 'false');
    }
  })
const AsyncGetToken = async () => {
  await getToken(); // 获取登录相关的token
};
const AsyncIsHost = async () => {
  await isWdHost(); // 获取用户登录状态
};
const gpsCallback = (address) => {
  if (IS_NOTNIL(address)) {
    const maddress = Object.assign({}, address);
    const { provinceName, cityName } = address;
    if (provinceName.endsWith('市')) {
        maddress.provinceName = provinceName.substring(0, provinceName.length - 1);
    }
    if (cityName.length === 0) {
        maddress.cityName = address.provinceName;
    }
    dvaStore.dispatch(createAction('address/changeAddress')(maddress));
    DeviceEventEmitter.emit('locationChange');
  }
};
AsyncGetToken();
AsyncIsHost();
global.showLocationAlert = true; // 安卓定位权限没打开时 是否需要弹窗提示
global.autoPosition = false; // 自动定位成功的标志
getLocation(gpsCallback);
// 全局变量
global.Log = Log;
global.IS_NOTNIL = IS_NOTNIL;
global.rem = SWidth / 375.00;
global.mobileNumberRegExp = /^1([3578][0-9]|4[01356789]|66|9[89])\d{8}$/; // 全局手机号码校验正则
global.passwordRegExp = /^((?=.*?\d)(?=.*?[A-Za-z])|(?=.*?\d)(?=.*?[\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\]\^\_\`\{\|\}\~])|(?=.*?[A-Za-z])(?=.*?[\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\]\^\_\`\{\|\}\~]))[\dA-Za-z\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\]\^\_\`\{\|\}\~]{6,20}$/; // 全局密码校验正则
global.storage = storage;
global.cutImgUrl = cutImgUrl;

export default dva.start(<RootContainer />);
