import {
    Platform,
} from 'react-native';
import URL from './../../../config/url.js';
let DefaultMenuData1 = [];
let HostMenuData1 = [];

// if (URL.IS_STORE  && Platform.OS === 'ios') {
//     // 是线发市场且是iOS系统才隐藏投资按钮
//     DefaultMenuData1 = [
//         {pic: require('../../../images/jydq.png'), showText: '家用电器', tag: 'jydq', showTip: false},
//         {pic: require('../../../images/fitting.png'), showText: '家居家装', tag: 'jjjz', showTip: false},
//         {pic: require('../../../images/market.png'), showText: '百货超市', tag: 'bhcs', showTip: false},
//         {pic: require('../../../images/icon_specialty.png'), showText: '特产汇', tag: 'shfw', showTip: false},
//         {pic: require('../../../images/openstore.png'), showText: '我要开店', tag: 'wddp', showTip: false},
//         {pic: require('../../../images/zcsf.png'), showText: '众创首发', tag: 'zcsf', showTip: false},
//         {pic: require('../../../images/gd.png'), showText: '更多', tag: 'xpzc', showTip: false},
//         {pic: require('../../../images/fl.png'), showText: '分类', tag: 'gd', showTip: false},
//     ];
//     HostMenuData1 = [
//         {pic: require('../../../images/jydq.png'), showText: '家用电器', tag: 'jydq', showTip: false},
//         {pic: require('../../../images/fitting.png'), showText: '家居家装', tag: 'jjjz', showTip: false},
//         {pic: require('../../../images/market.png'), showText: '百货超市', tag: 'bhcs', showTip: false},
//         {pic: require('../../../images/icon_specialty.png'), showText: '特产汇', tag: 'shfw', showTip: false},
//         {pic: require('../../../images/openstore.png'), showText: '我的店铺', tag: 'wddp', showTip: false},
//         {pic: require('../../../images/zcsf.png'), showText: '众创首发', tag: 'zcsf', showTip: false},
//         {pic: require('../../../images/gd.png'), showText: '更多', tag: 'xpzc', showTip: false},
//         {pic: require('../../../images/fl.png'), showText: '分类', tag: 'gd', showTip: false},
//     ];
// } else {
//     DefaultMenuData1 = [
//         {pic: require('../../../images/jydq.png'), showText: '家用电器', tag: 'jydq', showTip: false},
//         {pic: require('../../../images/fitting.png'), showText: '家居家装', tag: 'jjjz', showTip: false},
//         {pic: require('../../../images/market.png'), showText: '百货超市', tag: 'bhcs', showTip: false},
//         {pic: require('../../../images/icon_specialty.png'), showText: '特产汇', tag: 'shfw', showTip: false},
//         {pic: require('../../../images/openstore.png'), showText: '我要开店', tag: 'wddp', showTip: false},
//         {pic: require('../../../images/jrlc.png'), showText: '投资', tag: 'jrlc', showTip: false},
//         {pic: require('../../../images/gd.png'), showText: '更多', tag: 'xpzc', showTip: false},
//         {pic: require('../../../images/fl.png'), showText: '分类', tag: 'gd', showTip: false},
//     ];
//     HostMenuData1 = [
//         {pic: require('../../../images/jydq.png'), showText: '家用电器', tag: 'jydq', showTip: false},
//         {pic: require('../../../images/fitting.png'), showText: '家居家装', tag: 'jjjz', showTip: false},
//         {pic: require('../../../images/market.png'), showText: '百货超市', tag: 'bhcs', showTip: false},
//         {pic: require('../../../images/icon_specialty.png'), showText: '特产汇', tag: 'shfw', showTip: false},
//         {pic: require('../../../images/openstore.png'), showText: '我的店铺', tag: 'wddp', showTip: false},
//         {pic: require('../../../images/jrlc.png'), showText: '投资', tag: 'jrlc', showTip: false},
//         {pic: require('../../../images/gd.png'), showText: '更多', tag: 'xpzc', showTip: false},
//         {pic: require('../../../images/fl.png'), showText: '分类', tag: 'gd', showTip: false},
//     ];
// }

DefaultMenuData1 = [
    {pic: require('../../../images/jydq.png'), showText: '家用电器', tag: 'jydq', showTip: false},
    {pic: require('../../../images/fitting.png'), showText: '家居家装', tag: 'jjjz', showTip: false},
    {pic: require('../../../images/market.png'), showText: '百货超市', tag: 'bhcs', showTip: false},
    {pic: require('../../../images/icon_specialty.png'), showText: '特产汇', tag: 'shfw', showTip: false},
    {pic: require('../../../images/openstore.png'), showText: '我要开店', tag: 'wddp', showTip: false},
    {pic: require('../../../images/shfw.png'), showText: '充值缴费', tag: 'shjf', showTip: false},
    {pic: require('../../../images/gd.png'), showText: '更多', tag: 'xpzc', showTip: false},
    {pic: require('../../../images/fl.png'), showText: '分类', tag: 'gd', showTip: false},
];
HostMenuData1 = [
    {pic: require('../../../images/jydq.png'), showText: '家用电器', tag: 'jydq', showTip: false},
    {pic: require('../../../images/fitting.png'), showText: '家居家装', tag: 'jjjz', showTip: false},
    {pic: require('../../../images/market.png'), showText: '百货超市', tag: 'bhcs', showTip: false},
    {pic: require('../../../images/icon_specialty.png'), showText: '特产汇', tag: 'shfw', showTip: false},
    {pic: require('../../../images/openstore.png'), showText: '我的店铺', tag: 'wddp', showTip: false},
    {pic: require('../../../images/shfw.png'), showText: '充值缴费', tag: 'shjf', showTip: false},
    {pic: require('../../../images/gd.png'), showText: '更多', tag: 'xpzc', showTip: false},
    {pic: require('../../../images/fl.png'), showText: '分类', tag: 'gd', showTip: false},
];

export const DefaultMenuData = DefaultMenuData1;
export const HostMenuData = HostMenuData1;