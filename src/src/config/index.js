/*
* 颜色
* */
const tBlue = "#2979FF"; // 主题蓝  需强调相对次要的按钮或是特殊页面
const tOrange = "#FF6026"; // 主题橙 小面积使用，用于特别需要强调和突出的文字、按钮  或特殊模块使用，例如：社区
const Font3 = "#333"; // 文字 #333 用于重要级文字信息、标题、正文等
const Font6 = "#666"; // 文字 #666  用于次要级内容、列表文字
const Font9 = "#999"; // 文字 #999  辅助次要文字、普通图标
const FontB8 = "#B8B8B8"; // 文字 #B8B8B8 需要弱化的文字
const SipE4 = "#E4E4E4"; // 深色背景上的分割线
const SipEEE = "#EEE"; // 浅色背景上的分割线 和  页面空白区域底色


/*
* 服务器接口
* */
import { Platform } from 'react-native';
import DeviceInfo from "react-native-device-info";
const DEV = "DEV"; // 测试
const APP = "APP"; // 线上
let API_HOST,
    API_DETAIL_HOST,
    API_SEARCH_HOST,
    SERVER_DATA_HOST,
    PAY_SERVER_HOST,
    API_NEWHOME_HOST,
    LIVING,
    SHARE_HOST,
    SZD_URL,
    H5_HOST,
    PAY_NO_S_SERVER_HOST,
    OFFICIAL_KQT_URL_LOGIN,
    OFFICIAL_KQT_URL,
    KJT_PARTNERID,
    SERVER_TOP, // 社区争霸赛
    SQZBS3Q, // 社区争霸赛3期
    BIGDATADURY_HSOT;
/*******------设置发布状态------**********/

const SET_ENV = 'APP';
const IS_DEBUG = false; // false 本地调试设置为 true
// const IS_DEBUG = true; // false 本地调试设置为 true

/*******------设置发布状态------**********/
if(!IS_DEBUG) {
    console.log = () => {};
}

if(SET_ENV === DEV){
    API_HOST=`http://mobiletest.ehaier.com:38080`;
    API_DETAIL_HOST=`http://detailtest.ehaier.com:38080`;
    API_SEARCH_HOST=`http://stest.ehaier.com:38080`;
    API_NEWHOME_HOST=`http://mobiletest.ehaier.com:38080`;
    SERVER_DATA_HOST=`http://mobiletest.ehaier.com:38080/v3`;
    PAY_SERVER_HOST=`http://mobiletest.ehaier.com:58093`;
    PAY_NO_S_SERVER_HOST=`http://mobiletest.ehaier.com:58093/`;
    // SHARE_HOST=`http://mobiletest.ehaier.com:38080/www/index.html#/`;
    H5_HOST=`http://mobiletest.ehaier.com:38080/www/index.html#`;
    SHARE_HOST=`http://mobiletest.ehaier.com:38080/www/index.html#`;
    BIGDATADURY_HSOT = 'http://jxh.ehaier.com:1188/jslog'; //大数据埋点 yl
    SERVER_TOP=`http://mobiletest.ehaier.com:38081/v3/thirdparty/app`;//社区争霸赛
    SQZBS3Q=`http://mobiletest.ehaier.com:38080/race/`;//社区争霸赛3期
} else {
        API_HOST=`https://m.ehaier.com`;
        API_DETAIL_HOST=`https://detail.ehaier.com`;
        API_SEARCH_HOST=`https://s.ehaier.com`;
        API_NEWHOME_HOST=`https://m.ehaier.com`;
        SERVER_DATA_HOST=`https://m.ehaier.com/v3`;
        // PAY_SERVER_HOST=`https://pay.ehaier.com`;
        // PAY_NO_S_SERVER_HOST=`http://pay.ehaier.com/`;
        // SHARE_HOST=`http://m.ehaier.com/www/#`;
        // H5_HOST=`http://m.ehaier.com`;

        PAY_SERVER_HOST=`https://pay.ehaier.com`;
        PAY_NO_S_SERVER_HOST=`http://pay.ehaier.com/`;
        // SHARE_HOST=`https://m.ehaier.com/www/index_hs.html#`;
        // H5_HOST=`https://m.ehaier.com/www/index_hs.html#/`;

        const systemVersion = DeviceInfo.getSystemVersion();

        let tempArr =  systemVersion.split('.');
        if(Platform.OS === 'ios' && tempArr.length > 0 && tempArr[0] < 10){
            H5_HOST=`http://m.ehaier.com/www/#/`;
            SHARE_HOST=`http://m.ehaier.com/www/#`;
        }else{
            H5_HOST=`https://m.ehaier.com/www/index_hs.html#/`;
            SHARE_HOST=`https://m.ehaier.com/www/index_hs.html#`;
        }

        BIGDATADURY_HSOT = 'http://crmxjz.ehaier.com:1188/jslog'; //大数据埋点 yl
        SERVER_TOP=`http://store.ehaier.com/appapi`;//社区争霸赛
        SQZBS3Q=`https://m.ehaier.com/race/`;//社区争霸赛3期
}

// 第三方链接
if(SET_ENV === DEV){
    LIVING=`https://cdn09.ehaier.com/shunguang/livingPaytest/www/index.html`;  // 云缴费测试环境
    SZD_URL = 'http://203.187.186.136:8130/haiercms/waterQuality'; //水之道URL测试
    OFFICIAL_KQT_URL_LOGIN='https://zmgs.kjtpay.com/mgs/common/page.htm'; // 快捷通授权登录页面测试环境
    OFFICIAL_KQT_URL='https://zwallet-h5.kjtpay.com/index'; // 登陆成功后打开快捷通的链接测试环境
    KJT_PARTNERID='200000055141';  //快捷通商户ID准生产环境
} else {
    // LIVING=`https://cdn09.ehaier.com/shunguang/livingPay/www/index.html`;  // 云缴费正式环境
    LIVING=`https://m.ehaier.com/lifepay/`;  // 云缴费正式环境
    SZD_URL = 'http://uhome.haier.net:8280/watercms/waterQuality'; //水之道URL正式
    OFFICIAL_KQT_URL_LOGIN='https://mgs.kjtpay.com/mgs/common/page.htm';  // 快捷通授权登录页面正式环境
    OFFICIAL_KQT_URL='https://wallet-h5.kjtpay.com/index'; // 登陆成功后打开快捷通的链接正式
    KJT_PARTNERID='200000030019';  //快捷通商户ID生产环境
}

/*******------设置某些第三个SDK的key------**********/



/*******------设置某些第三个SDK的key------**********/


export default config = {
    SET_ENV,IS_DEBUG,
    H5_HOST, PAY_NO_S_SERVER_HOST, SQZBS3Q,
    Color: {tBlue,tOrange,Font3,Font6,Font9,FontB8,SipE4,SipEEE},
    API_HOST,
    API_DETAIL_HOST,
    API_SEARCH_HOST,
    SERVER_DATA_HOST,
    PAY_SERVER_HOST,
    API_NEWHOME_HOST,
    SHARE_HOST,
    BIGDATADURY_HSOT,
    SERVER_TOP,
    // 第三方链接
    LIVING,
    SZD_URL,
    OFFICIAL_KQT_URL_LOGIN,
    OFFICIAL_KQT_URL,
    KJT_PARTNERID,
};

// 获取生活服务模块的环境
export const getEnviroment = ()=>{
    return SET_ENV === DEV?0:1; // 正式环境返回 1 ，其他环境返回0
};