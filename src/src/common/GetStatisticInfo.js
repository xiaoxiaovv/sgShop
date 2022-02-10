import {Platform,AsyncStorage} from 'react-native';
import config from '../config/index';
import {GET, POST_DSJ} from '../config/Http';
import URL from './../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
import DeviceInfo from "react-native-device-info";

//获取用户基本信息
export const  GetStatisticInfo = async function (title, toState, fromState, toParams) {
  const userInfo = dvaStore.getState().users;
  // const address = dvaStore.getState().address;

  // console.log(dvaStore.getState())



  var AppUsers = 'sg_app';//应用标识;
  var Host = 'rn';
  
  var ActiveUrl = Host + '/#/' + toState;  //当前url
  var PrevUrl = Host + '/#/' + fromState; //上一页url
  var Title = title||''; //页面标题

  var SystemOS = Platform.OS;//客户端设备

  var WinWidthHeight = width + '*' + height;//屏幕分辨率

  
  var date = FormatDate(new Date().getTime());//当前时间

  var cookieId = '';//游客登陆绑定Id

  var LanguageBrowser = navigator.language||'';//浏览器语言
  
  var operateOS = navigator.platform || '';//操作系统

  var mid = userInfo.mid || '';//用户id
  
  // var LoginType = $localstorage.get('IsThirdLoginType') || '';//登录渠道；
  var LoginType = (await global.setItem('IsThirdLoginType'))||'';  //客户登录时的渠道
  
  var isShare = '';//是否是分享
  var shareType = '';//分享类型
  // var lon = address.longitude,
  //     lat = address.latitude;//经纬度
  var userRole;//数据埋点，新增字段

  // LoginService.getRole()>0?userRole=1:userRole=0;
  userRole = (userInfo.isHost == 1?1:0);   //1 是微店主
  //大数据埋点页面链接
  // var get_statistic_ref='';
  // var preArr=$rootScope.xnFromState.url.split("/:");
  // if(preArr.length>0){
  //   for(var i=1;i<preArr.length;i++){
  //     get_statistic_ref+='/'+$rootScope.xnFromParams[preArr[i]]
  //   }
  //   PrevUrl=Host+'/www/index.html#/'+$rootScope.xnFromState.name+get_statistic_ref;
  // }
  // var get_statistic_url='';
  // var actArr=$rootScope.xnToState.url.split("/:");
  // if(actArr.length>0){
  //   for(var i=1;i<actArr.length;i++){
  //     get_statistic_url+='/'+$rootScope.xnToParams[actArr[i]]
  //   }
  //   ActiveUrl=Host+'/www/index.html#/'+$rootScope.xnToState.name+get_statistic_url;
  // }
  //地理位置

  // navigator.geolocation.getCurrentPosition(
  //   (position) => {
  //     const positionData = position.coords;
  //         // 经度：positionData.longitude
  //         // 纬度：positionData.latitude
  //       lon = positionData.longitude;
  //       lat = positionData.latitude;
  //   },
  //   (error) => console.log(error.message),
  //   {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
  // );
  
  // if(location.href.indexOf('?fs')!=-1){
  //   isShare = 'fromShare'
  // }else{
  //   isShare = ''
  // }

  if(await AsyncStorage.getItem('visitorId')){
    cookieId = await AsyncStorage.getItem('visitorId');
  }else{
    cookieId = generateUUID();
    await AsyncStorage.setItem('visitorId',cookieId);
  }
  
  // productId  【storeId-店铺id】
  let storeId = '';
  let productId ='';
  let hasStock = '';
  let goodDetailLoadStatus = '';
  if (toParams.storeId) {
    storeId = toParams.storeId;
  }
  if (toParams.productId) {
    productId = toParams.productId;
  }
  if (toParams.hasStock) {
    hasStock = 1;
  }else if(toParams.hasStock==false){
    hasStock = -1;
  }
  if(toParams.isFirstLoad){
    goodDetailLoadStatus = 1;
  }else if(toParams.isFirstLoad == false){
    goodDetailLoadStatus = 0;
  }
  // if (u.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
  //   shareType = 'wx';
  // } else if (u.toLowerCase().match(/WeiBo/i) == "weibo") {
  //   shareType = 'wb';
  // } else if (u.toLowerCase().match(/QQ/i) == "qq") {
  //   shareType = 'qq';
  // }

    // DeviceInfo.getIPAddress().then(ip => {
    //     // "92.168.32.44"
    // });
    let ip = '0.0.0.0';
  if (Platform.OS !== 'ios'){
      ip = await DeviceInfo.getIPAddress();
  }
    const uniqueId = DeviceInfo.getUniqueID();
    const userAgent = DeviceInfo.getUserAgent();

  var arr = [AppUsers, SystemOS, date, cookieId, mid, LoginType, storeId, productId, '', PrevUrl,
    ActiveUrl, Title, WinWidthHeight, '', LanguageBrowser, operateOS, '', isShare, shareType,
    userRole, hasStock, goodDetailLoadStatus,
      uniqueId, ip, userAgent,
  ];
  var str = arr.join('|');
  str = str.replace(/,/g,'');
  // var url = UrlService.getCPUrl('BIG_DATA') + '?data=' + encodeURIComponent(str);
  // jQuery.getScript(url,function(data){
  //   //console.log("已发送统计数据：",str);
  // });
  //  请求大数据接口  加时间戳解决缓存问题
    POST_DSJ(config.BIGDATADURY_HSOT+'?data=' + encodeURIComponent(str)+'&_='+(new Date().getTime()))
};
//生成访客唯一标识
const generateUUID = function(){
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x7|0x8)).toString(16);
  });
  return uuid;
};

//格式化时间
function FormatDate(time) {
  //补零函数
  function toDub(n) {
    return n > 9 ? n : '0' + n;
  }

  if (time) {
    var oDate = new Date();
    oDate.setTime(time);
    var y = oDate.getFullYear();
    var m = oDate.getMonth() + 1;
    var d = oDate.getDate();
    var h = oDate.getHours();
    var mm = oDate.getMinutes();
    var s = oDate.getSeconds();
    return y + '-' + toDub(m) + '-' + toDub(d) + ' ' + toDub(h) + ':' + toDub(mm) + ':' + toDub(s);
  }
}
//设置cookie
// function setCookie(name,value)
// {
//   var Days = 3650;
//   var exp = new Date();
//   exp.setTime(exp.getTime() + Days*24*60*60*1000);
//   window.document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
// }
//读取cookies
// function getCookie(name)
// {
//   var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
//   if(arr=window.document.cookie.match(reg)) return unescape(arr[2]);
//   else return null;
// }


