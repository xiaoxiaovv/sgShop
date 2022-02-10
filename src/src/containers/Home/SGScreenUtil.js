/**
 * Created by zhaoxincheng on 2017/11/18.
 * 屏幕工具类
 * ui设计基准,iphone 6
 * width:750 px
 * height:1334px
 */

/*
 设备的像素密度，例如：
 PixelRatio.get() === 1          mdpi Android 设备 (160 dpi)
 PixelRatio.get() === 1.5        hdpi Android 设备 (240 dpi)
 PixelRatio.get() === 2          iPhone 4, 4S,iPhone 5, 5c, 5s,iPhone 6,iPhone 6s,iPhone 7,iPhone 7s,iPhone 8,iPhone 8s,xhdpi Android 设备 (320 dpi)
 PixelRatio.get() === 3          iPhone 6 plus,iPhone 7 plus,iPhone 8 plus , xxhdpi Android 设备 (480 dpi)
 PixelRatio.get() === 3.5        Nexus 6       */
import React, { Component } from 'react';
import {
    Dimensions,
    Platform,
    PixelRatio,
    ActivityIndicator,    //loading等待组件
    View,
} from 'react-native';

import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;

export const deviceWidth = width;      //设备的宽度
export const deviceHeight = height;    //设备的高度


let fontScale = PixelRatio.getFontScale();                      //返回字体大小缩放比例
let pixelRatio = PixelRatio.get();      //当前设备的像素密度

//px转换成dp(6的屏幕时750px*1334px = 375pt*667pt)
const w2 = 375;   //单位pt
const h2 = 667;   //单位pt

const defaultPixel = 2;

// 获取宽高缩放比例较小的那个
const scale = Math.min(deviceHeight / h2, deviceWidth / w2);   //获取缩放比例

export default {
  //屏幕宽高,单位都是pt
  ScreenWidth:deviceWidth,
  ScreenHeight:deviceHeight,
  //屏幕适配:以6为基准,求屏幕宽高比例
  ScaleX:deviceWidth / 375,
  ScaleY:deviceHeight / 667,
  Scale:scale,
  //loading 效果
  loadingView: <View style={{width:deviceWidth,height:deviceHeight,backgroundColor:'transparent',flexDirection:'column',justifyContent:'center',alignItems:'center',}}><ActivityIndicator/></View>,
  //判断是否是iPhone X
  isiPhoneX:(deviceWidth==375 && deviceHeight==812 && Platform.OS === 'ios')?true:false,
  /**
   * 设置视图为dp
   * @param size pt/dp(点)
   * return number pt/dp(点)
   */
  scaleSize(size: number) {

      size = Math.round(size * scale + 0.5);
      return size;
  },
  /**
   * 设置text为sp
   * @param size px
   * return number px
   */
  scaleText(size: number) {
      return size * scale;
  }
}
