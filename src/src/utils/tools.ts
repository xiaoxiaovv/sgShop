import {getAppJSON, getJSONP} from '../netWork';
import {IBannerItem} from '../interface/index';
import {NavigationScreenProp} from 'react-navigation';
import Config from 'react-native-config';
import {createAction} from './index';
import GoodsDetail from '../containers/GoodsDetail/index';
import Permissions from 'react-native-permissions';
import {Platform, Text, Alert, PermissionsAndroid, NativeModules} from 'react-native';
import {Modal as AntModal} from 'antd-mobile';
import {Toast} from 'antd-mobile';
import AndroidOpenSettings from 'react-native-android-open-settings';
import {IS_NOTNIL} from '../utils';
import {NavigationUtils} from '../dva/utils';
import L from 'lodash';
import URL from './../config/url.js';

const malert = AntModal.alert;
const locationUrl = '/v3/geocode/regeo?key=7c964766c309377bc93c3d88470cd995&location=';
const locationBaseUrl = 'http://restapi.amap.com';
const getAddressIdUrl = 'v3/mstore/sg/getAddressId.html?provinceName=';

interface IAddress {
    cityId: string;
    provinceId: string;
    regionId: string;
    streetId: string;
}

export function stringToJson(input) {
    let result = [];

    input = input.replace(/^\[/, '');
    input = input.replace(/\]$/, '');

    input = input.replace(/},{/g, '};;;{');
    input = input.replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");
    // remove non-printable and other non-valid JSON chars
    input = input.replace(/[\u0000-\u0019]+/g, "");

    input = input.split(',');

    input.forEach(function (element) {
        // Log(JSON.stringify(element));
        result.push(JSON.parse(element));
    }, this);

    return result;
}

export async function getStreetName(detail: object, callback: (address: any) => void) {
    const {info, pois} = await getAppJSON('/v3/place/text?key=812fde4a1680f0a8da6f4224d7859790&children=1&offset=1&page=1&extensions=base', detail, {}, false, locationBaseUrl);
    if (info === 'OK' && pois.length > 0) {
        const {info: code, regeocode: {addressComponent: {township}}} = await getAppJSON(`${locationUrl}${pois[0].location}`, {}, {}, true, locationBaseUrl);
        if (code === 'OK') {
            callback(township);
        } else {
            callback('error');
        }
    } else {
        callback('error');
    }
}

export async function getLocation(callback: (address: any) => void) {
    if (Platform.OS === 'ios') {
        // Permissions.check('location').then(response => {
        //     // ?????????????????????????????? ???????????????
        //     if (response === 'authorized') {

                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const initialPosition = position;
                        const {longitude, latitude} = initialPosition.coords;
                        const json = await getAppJSON(`${locationUrl}${longitude},${latitude}`, {}, {}, true, locationBaseUrl);
                        // console.log('-------?????? ??????????????? - addressComponent ------');
                        let infocode = L.get(json, 'infocode');
                        if(infocode == "10000"){
                            const {addressComponent} = json.regeocode;
                            // console.log(json);
                            const url = `${getAddressIdUrl}${addressComponent.province}&cityName=${addressComponent.city}&regionName=${addressComponent.district}&streetName=${addressComponent.township}&gbCode=${addressComponent.adcode}`;
                            const addressJson = await getAppJSON(url);
                            const maddress = {
                                type: 'success',
                                provinceId: addressJson.data.provinceId,
                                cityId: addressJson.data.cityId,
                                areaId: addressJson.data.regionId,
                                streetId: addressJson.data.streetId,
                                provinceName: addressComponent.province,
                                cityName: addressComponent.city,
                                areaName: addressComponent.district,
                                streetName: addressComponent.township,
                                regionName: addressComponent.district + '/' + addressComponent.streetNumber.street,
                                longitude,
                                latitude,
                            };
                            global.autoPosition = true; // ???????????????????????????
                            callback(maddress);
                        }else{
                            callback();
                        }
                    },
                    (error) => {
                        Log('????????????');
                        console.log('-------------????????????---------------');
                        console.log(error);
                        // callback({type: "error"});
                        callback();
                    },
                    // timeout???????????????????????????????????????????????????????????????
                    // maximumAge????????????????????????????????????????????????????????????????????????????????????????????????????????? 0???????????????????????????????????????????????????
                    // enableHighAccuracy?????????????????????????????????????????????????????? false????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                    {enableHighAccuracy: true, timeout: 100000, maximumAge: 10000},
                );

    //         } else if (response === 'denied') {
    //             Alert.alert(
    //                 null,
    //                 `???????????????????????????????????????`,
    //                 [
    //                     {text: '??????', onPress: () => console.log('??????')},
    //                     {text: '??????', onPress: () => Permissions.openSettings().then(() => null)},
    //                     // {text: 'OK', onPress: () => console.log('OK Pressed')},
    //                 ],
    //             );
    // }
// });
    }else {
        // ???????????? cityName
        // ???????????? cityCode
        // ???????????? provinceName
        // ?????? districtName
        // ???????????? roadName
        // ?????? latitude
        // ?????? longitude
        NativeModules.ToolsModule.location()
            .then(async (position) => {
                const {longitude, latitude} = position;
                const json = await getAppJSON(`${locationUrl}${longitude},${latitude}`, {}, {}, true, locationBaseUrl);
                let infocode = L.get(json, 'infocode');
                if(infocode == "10000"){
                    const {addressComponent} = json.regeocode;
                    // console.log(json);
                    const url = `${getAddressIdUrl}${addressComponent.province}&cityName=${addressComponent.city}&regionName=${addressComponent.district}&streetName=${addressComponent.township}&gbCode=${addressComponent.adcode}`;
                    const addressJson = await getAppJSON(url);
                    const maddress = {
                        type: 'success',
                        provinceId: addressJson.data.provinceId,
                        cityId: addressJson.data.cityId,
                        areaId: addressJson.data.regionId,
                        streetId: addressJson.data.streetId,
                        provinceName: addressComponent.province,
                        cityName: addressComponent.city,
                        areaName: addressComponent.district,
                        streetName: addressComponent.township,
                        regionName: addressComponent.district + '/' + addressComponent.streetNumber.street,
                        longitude,
                        latitude,
                    };
                    global.autoPosition = true; // ???????????????????????????
                    callback(maddress);
                }else{
                    callback();
                }
            }, (error) => {
                console.log(error);
                // ?????? App ?????????????????????,??????????????????,????????????
                if (global.showLocationAlert) {
                    Alert.alert(
                        null,
                        `???????????????????????????????????????`,
                        [
                            {text: '??????', onPress: () => global.showLocationAlert = false},
                            {text: '??????', onPress: () => AndroidOpenSettings.appDetailsSettings()},
                        ],
                    );
                }
            })
            .catch((error) => {
                callback();
                Toast.fail('????????????');
                Alert.alert(
                    null,
                    `???????????????????????????????????????`,
                    [
                        {text: '??????', onPress: () => console.log('Ask me later pressed')},
                        {text: '??????', onPress: () => AndroidOpenSettings.appDetailsSettings()},
                    ],
                );
            });
    }

    // navigator.geolocation.getCurrentPosition(async (position) => {
    //     const initialPosition = position;
    //     const { longitude, latitude } = initialPosition.coords;
    //     const json = await getAppJSON(`${locationUrl}${longitude},${latitude}`, {}, {}, true, locationBaseUrl);
    //     const { addressComponent } = json.regeocode;
    //     const url = `${getAddressIdUrl}${addressComponent.province}&cityName=${addressComponent.city}&regionName=${addressComponent.district}&streetName=${addressComponent.township}&gbCode=${addressComponent.adcode}`;
    //     const addressJson = await getAppJSON(url);
    //     const maddress = {
    //         provinceId: addressJson.data.provinceId,
    //         cityId: addressJson.data.cityId,
    //         areaId: addressJson.data.regionId,
    //         streetId: addressJson.data.streetId,
    //         provinceName: addressComponent.province,
    //         cityName: addressComponent.city,
    //         areaName: addressComponent.district,
    //         streetName: addressComponent.township,
    //         regionName: addressComponent.district + '/' + addressComponent.streetNumber.street,
    //     };
    //     callback(maddress);
    // },
    //     (error) => {
    //         getLocation(callback);
    //         Log('====================================');
    //         Log('??????????????????');
    //         Log('====================================');
    //     });
}
export async function goBanner(item: IBannerItem, navigation?: NavigationScreenProp) {
    // const tempArr = item.link.split('&');
    console.log('goBanner=========', item);
    // ????????????/????????????/????????????/????????????/????????????/????????????????????????banner?????????
    const linkType = IS_NOTNIL(item.linkType) ? item.linkType : parseInt(item.hyperLinkType);
    const relationId = IS_NOTNIL(item.bannerId) ? item.bannerId : IS_NOTNIL(item.relationId) ? item.relationId :item.id;
    const linkTemp = item.url || item.link;
    const link = IS_NOTNIL(linkTemp) ? linkTemp : item.hyperLink;
    const titleStr = IS_NOTNIL(item.title) ? item.title : item.shareTitle;
    let tempArr = [];
    if (link !== undefined) {
       tempArr =  link.split('&');
    }
    switch (linkType) {
        case -1: // ????????????  -1????????????????????????relationId?????????
            const params = {
                bannerId: relationId,
                isHost: '1',
                backUrl: '',
            };
            const {data} = await getAppJSON('v3/mstore/sg/activity/toActivityPage.html', params);
            const {layout} = data;
            navigation ? navigation.navigate('BannerDaily', {bannerId:relationId,shareStoreId:'',layout:layout}) :
                navigation = dvaStore.dispatch(createAction('router/apply')({
                    type: 'Navigation/NAVIGATE',
                    routeName: 'BannerDaily',
                    params: {bannerId:relationId,shareStoreId:'',layout:layout}
                }));
            break;
        case 0: // ????????????
            if (titleStr === '?????????') {
             
                dvaStore.dispatch(createAction('router/apply')({
                    type: 'Navigation/NAVIGATE',
                    routeName: 'CustomWebView',
                    params: {customurl: `${URL.H5_HOST}microSchool`, flag: true, headerTitle: '?????????'}
                }));
            } else {
                navigation ? navigation.navigate('BannerTheme', {bannerId:relationId,shareStoreId:''}) :
                navigation = dvaStore.dispatch(createAction('router/apply')({
                    type: 'Navigation/NAVIGATE',
                    routeName: 'BannerTheme',
                    params: {bannerId:relationId,shareStoreId:''}
                }));
            }
            //navigation.navigate('CustomWebView', );
            break;
        case 1: // ?????????
            const productId = tempArr[0].slice(tempArr[0].indexOf('=') + 1);
            // navigation.navigate('GoodsDetail', { productId });
            navigation ? navigation.navigate('GoodsDetail', {productId: L.trim(productId)}) :
                navigation = dvaStore.dispatch(createAction('router/apply')({
                    type: 'Navigation/NAVIGATE',
                    routeName: 'GoodsDetail',
                    params: {productId: L.trim(productId)}
                }));
            break;
        case 2: // ????????????
            navigation ? navigation.navigate('CouponCenter') :
                navigation = dvaStore.dispatch(createAction('router/apply')({
                    type: 'Navigation/NAVIGATE',
                    routeName: 'CouponCenter'
                }));
            break;
        case 3: // ?????????
            const arr = link.split('=');
            const url = `${URL.H5_HOST}game/${arr[1]}//`;
            // navigation.navigate('CustomWebView', { customurl: url});
            navigation ? navigation.navigate('CustomWebView', {customurl: url, flag: true, headerTitle: '????????????'}) :
                navigation = dvaStore.dispatch(createAction('router/apply')({
                    type: 'Navigation/NAVIGATE',
                    routeName: 'CustomWebView',
                    params: {customurl: url, flag: true, headerTitle: '????????????'}
                }));
            break;
        case 4: // ?????????
            if (tempArr[0].slice(tempArr[0].indexOf('=') + 1) === '????????????') {
                const params = {
                    bannerId: tempArr[1].slice(tempArr[1].indexOf('=') + 1),
                    isHost: '1',
                    backUrl: '',
                };
                const {data} = await getAppJSON('v3/mstore/sg/activity/toActivityPage.html', params);
                const {layout} = data;
                navigation ? navigation.navigate('BannerDaily', {bannerId:tempArr[1].slice(tempArr[1].indexOf('=') + 1),shareStoreId:'',layout:layout}) :
                navigation = dvaStore.dispatch(createAction('router/apply')({
                    type: 'Navigation/NAVIGATE',
                    routeName: 'BannerDaily',
                    params: {bannerId:tempArr[1].slice(tempArr[1].indexOf('=') + 1),shareStoreId:'',layout:layout}
                }));
            } else if (tempArr[0].slice(tempArr[0].indexOf('=') + 1) === '????????????') {
                navigation ? navigation.navigate('BannerTheme', {bannerId:tempArr[1].slice(tempArr[1].indexOf('=') + 1),shareStoreId:''}) :
                navigation = dvaStore.dispatch(createAction('router/apply')({
                    type: 'Navigation/NAVIGATE',
                    routeName: 'BannerTheme',
                    params: {bannerId:tempArr[1].slice(tempArr[1].indexOf('=') + 1),shareStoreId:''}
                }));
            }
            break;
        case 5: // ??????????????????
            // if (link.indexOf('m.ehaier.com/www/index.html') !== -1) {
            //     var url = link.slice(link.indexOf('#/'));
            //     window.location.hash=url;
            // }else{
            //     window.emc.presentH5View(link, "");
            // }
            //????????????
            if(link.indexOf('productDetail') !== -1){
                let acturlstr = link.substr(link.indexOf('#')+1,link.length)
                    let obj = acturlstr.split('/');//cong  2  kaishi 
                    const params = {
                        productId: L.trim(obj[2]),
                  o2oType: obj[3],
                  fromType: obj[4],
                  storeId: obj[5],
                  shareStoreId: obj[6]
                    }
                    navigation ? navigation.navigate('GoodsDetail',params) :
                navigation = dvaStore.dispatch(createAction('router/apply')({
                    type: 'Navigation/NAVIGATE',
                    routeName: 'GoodsDetail',
                    params: params,
                }));
            }else if(link.indexOf('/myStore')!==-1){
                let acturlstr = link.substr(link.indexOf('#')+1,link.length)
                    let obj = acturlstr.split('/');
                    console.log(obj[2]);
                    navigation ? navigation.navigate('StoreHome',{storeId: obj[2]}) :
                navigation = dvaStore.dispatch(createAction('router/apply')({
                    type: 'Navigation/NAVIGATE',
                    routeName: 'StoreHome',
                    params: {storeId: obj[2]},
                }));
            }else if(link.indexOf('/circlePage')!==-1){
                let acturlstr = link.substr(link.indexOf('#')+1,link.length)
                    let obj = acturlstr.split('/');
                    console.log(obj[2]);
                    const token = await global.getItem('userToken');
                    dvaStore.dispatch(NavigationUtils.navigateAction("SuperSecondView", {
                        url: '/html/community/community_detial.html',
                        id: Number(obj[2]),
                        userToken: token
                    }));
                    
            }else if(link.indexOf('/race')!== -1){
                goToSQZBS();
                // dvaStore.dispatch(NavigationUtils.navigateAction('CommunityWeb', {url: link}))
            }else if(link.indexOf('thsq.ehaier.com')!== -1 || link.indexOf('mobiletest.ehaier.com:8880')!== -1){
                goToSQZBS();
                // dvaStore.dispatch(NavigationUtils.navigateAction('CommunityWeb', {url: link}))
            }else if(link.indexOf('/noteDetails')!==-1){
                // ????????????
                let acturlstr = link.substr(link.indexOf('#')+1,link.length)
                let obj = acturlstr.split('/');
                let id = obj[2];
                if (!id) {
                    dvaStore.dispatch(createAction('router/apply')({
                        type: 'Navigation/NAVIGATE',
                        routeName: 'Community',
                        params: {url: '/html/index.html'},
                    }));
                } else {
                    console.log(id);
                    const token = await global.getItem('userToken');
                    dvaStore.dispatch(createAction('router/apply')({
                        type: 'Navigation/NAVIGATE',
                        routeName: 'SuperSecondView',
                        params: {
                            url: '/html/topic/topic_details.html',
                            id: Number(id),
                            type: 1,
                            token
                        },
                    }));
                }
            }else if(link.indexOf('/classNoteDetails')!==-1){
                // ????????????
                let acturlstr = link.substr(link.indexOf('#')+1,link.length)
                let obj = acturlstr.split('/');
                let id = obj[2];
                console.log(id);
                if (!id) {
                    dvaStore.dispatch(createAction('router/apply')({
                        type: 'Navigation/NAVIGATE',
                        routeName: 'Community',
                        params: {url: '/html/index.html'},
                    }));
                } else {
                    console.log(id);
                    const token = await global.getItem('userToken');
                    dvaStore.dispatch(createAction('router/apply')({
                        type: 'Navigation/NAVIGATE',
                        routeName: 'SuperSecondView',
                        params: {
                            url: '/html/topic/topic_details.html',
                            id: Number(id),
                            type: 4,
                            token
                        },
                    }));
                }
            }
            // else if(link.indexOf('/CustomPage')!==-1){
            //     navigationPush('CustomPageWeb', {url: link});
            // }
            else if(link.indexOf('ehaier.com') !== -1 && link.indexOf('index.html') !== -1){
                dvaStore.dispatch(createAction('router/apply')({
                    type: 'Navigation/NAVIGATE',
                    routeName: 'CustomWebView',
                    params: {customurl: link, flag: true, headerTitle: titleStr},
                }));
            }else{
                dvaStore.dispatch(createAction('router/apply')({
                    type: 'Navigation/NAVIGATE',
                    routeName: 'CustomWebView',
                    params: {customurl: link, flag: true, headerTitle: titleStr,doNotModifyCustomUrl: true},
                }));
            }
            
            break;
        case 6: // ??????
            dvaStore.dispatch(createAction('router/apply')({
                type: 'Navigation/NAVIGATE',
                routeName: 'CorwdList',
            }));
            break;
        case 7: // ??????
            if (!link) {
                dvaStore.dispatch(createAction('router/apply')({
                    type: 'Navigation/NAVIGATE',
                    routeName: 'CrowdFunding',
                }));
                break;
            } else {
                const storeId = await global.getItem('storeId');
                dvaStore.dispatch(createAction('router/apply')({
                    type: 'Navigation/NAVIGATE',
                    routeName: 'GoodsDetail',
                    params: {productId: L.trim(link), storeId}
                }));
                break;
            }
        case 8: // ??????
            if (!link) {
                dvaStore.dispatch(createAction('router/apply')({
                    type: 'Navigation/NAVIGATE',
                    routeName: 'Community',
                    params: {url: '/html/index.html'},
                }));
            } else {

                // console.log('-------===  tempArr  ===------------');
                // console.log(tempArr);
                const mid = Number(tempArr[0].slice(tempArr[0].indexOf('=') + 1));
                const noteType = Number(tempArr[1].slice(tempArr[1].indexOf('=') + 1));
                // ??????tocken
                const token = await global.getItem('userToken');
                dvaStore.dispatch(createAction('router/apply')({
                    type: 'Navigation/NAVIGATE',
                    routeName: 'SuperSecondView',
                    params: {
                        url: '/html/topic/topic_details.html',
                        id: mid,
                        type: 1,
                        token,
                    },
                }));
            }
            break;
        default:
            break;
    }
}

export async function bannerClick(item) {
    console.log('-----------=bannerClick=----------------');
    console.log(item);
    if (item.type == '1') {
        if (item.activityType === '????????????') {
            dvaStore.dispatch(createAction('router/apply')({
                type: 'Navigation/NAVIGATE',
                routeName: 'BannerTheme',
                params: {bannerId: item.bannerId, shareStoreId: '', platformType: item.platformType},
            }));
        } else if (item.activityType === '????????????') {
            const params = {
                bannerId: item.bannerId,
                isHost: '1',
                backUrl: '',
                platformType: item.platformType
            };
            const {data} = await getAppJSON('v3/mstore/sg/activity/toActivityPage.html', params);
            const {layout} = data;
            dvaStore.dispatch(createAction('router/apply')({
                type: 'Navigation/NAVIGATE',
                routeName: 'BannerDaily',
                params: {bannerId: item.bannerId,layout: layout, shareStoreId: '', platformType: item.platformType},
            }));
        } else {
            console.log('????????????????????????');
        }
    } else if (item.type == '6') {
        // ???????????????
        dvaStore.dispatch(createAction('router/apply')({
            type: 'Navigation/NAVIGATE',
            routeName: 'CorwdList',
        }));
    } else {
        console.log('???????????????????????????');
    }
}
export function navigationPush(routeName, params?) {
    dvaStore.dispatch(createAction('router/apply')({type: 'Navigation/NAVIGATE', routeName, params}));
}

export async function goToSQZBS() {
    let state = dvaStore.getState();
    let isLogin = L.get(state, 'users.isLogin', false);
    let mid = L.get(state, 'users.mid', false);
    let latitude = L.get(state, 'address.latitude');
    let longitude = L.get(state, 'address.longitude');
    if(isLogin){
        // ?????????
        const host = URL.SQZBS3Q;

        const token = await global.getItem('userToken');
        let url;
        if(host.indexOf('?') > -1){
            url = `${host}&token=${encodeURIComponent(token)}&mid=${encodeURIComponent(mid)}&latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`;
        }else{
            url = `${host}?token=${encodeURIComponent(token)}&mid=${encodeURIComponent(mid)}&latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`;
        }

        dvaStore.dispatch(NavigationUtils.navigateAction("CommunityWeb3", {url: url}));
    }else {
        dvaStore.dispatch(createAction('router/apply')({
            type: 'Navigation/NAVIGATE', routeName: 'Login',
        }));
    }
}

export async function clickAdImage(advertisement, propsStoreId: any = '') {
    console.log('clickAdImage', advertisement);
    const {type, url} = advertisement;
    const typeStr = '' + type;
    if (typeStr && url) {
        const {
            productId,
            storeId,
            o2oType,
            fromType,
            fromUrl,
            id,
            gameId,
            activityType,
            bannerId,
            memberId,
            isShortStory,
            url: urlAlias,
            link: linkAlias,
        } = url;
        const link = urlAlias || linkAlias;
        let tempArr = [];
        if (link) {
            tempArr = link.split('&');
        }
        switch (typeStr) {
            case '1': // ?????????
                navigationPush('GoodsDetail', {
                    productId: L.trim(productId),
                    storeId: storeId ? storeId : propsStoreId,
                    o2oType,
                    fromType,
                    fromUrl,
                });
                break;
            case '2': // ????????????&??????????????????
                id ? navigationPush('CouponCenter', {
                    cId: id,
                    userID: propsStoreId,
                    type: 2,
                }) : navigationPush('CouponCenter');
                break;
            case '3': // ?????????
                const gameUrl = `${URL.H5_HOST}game/${gameId}//`;
                navigationPush('CustomWebView', {
                    customurl: gameUrl, flag: true, headerTitle: '????????????',
                });
                break;
            case '4': // ???????????????
                if ('????????????' === activityType) {
                    const params = {
                        bannerId: bannerId,
                        isHost: '1',
                        backUrl: '',
                    };
                    const {data} = await getAppJSON('v3/mstore/sg/activity/toActivityPage.html', params);
                    const {layout} = data;
                    navigationPush('BannerDaily', {
                        bannerId:bannerId,
                        shareStoreId:'',
                        layout:layout
                    });
                } else if ('????????????' === activityType) {
                    navigationPush('BannerTheme', {
                        bannerId: bannerId,
                        shareStoreId:''
                    });
                }
                break;
            case '5': // ??????????????????
            if(link.indexOf('productDetail') !== -1){
                let acturlstr = link.substr(link.indexOf('#')+1,link.length)
                    let obj = acturlstr.split('/');//cong  2  kaishi 
                    const params = {
                        productId: L.trim(obj[2]),
                        o2oType: obj[3],
                        fromType: obj[4],
                        storeId: obj[5],
                        shareStoreId: obj[6]
                        }
                    navigationPush('GoodsDetail', params); 
            }else if(link.indexOf('/myStore')!==-1){
                    let acturlstr = link.substr(link.indexOf('#')+1,link.length)
                    let obj = acturlstr.split('/');
                    navigationPush('StoreHome', {storeId: obj[2]});  
            }else if(link.indexOf('/race')!== -1){
                goToSQZBS();
                // dvaStore.dispatch(NavigationUtils.navigateAction('CommunityWeb', {url: link}))
            }else if(link.indexOf('thsq.ehaier.com')!== -1 || link.indexOf('mobiletest.ehaier.com:8880')!== -1){
                goToSQZBS();
                // dvaStore.dispatch(NavigationUtils.navigateAction('CommunityWeb', {url: link}))
            }else if(link.indexOf('/circlePage')!==-1){
                let acturlstr = link.substr(link.indexOf('#')+1,link.length)
                    let obj = acturlstr.split('/');
                    const token = await global.getItem('userToken');
                    dvaStore.dispatch(NavigationUtils.navigateAction("SuperSecondView", {
                        url: '/html/community/community_detial.html',
                        id: Number(obj[2]),
                        userToken: token
                    }));   
            }else if(link.indexOf('/noteDetails')!==-1){
                // ????????????
                let acturlstr = link.substr(link.indexOf('#')+1,link.length);
                let obj = acturlstr.split('/');
                let id = obj[2];
                if (!id) {
                    dvaStore.dispatch(createAction('router/apply')({
                        type: 'Navigation/NAVIGATE',
                        routeName: 'Community',
                        params: {url: '/html/index.html'},
                    }));
                } else {
                    console.log(id);
                    const token = await global.getItem('userToken');
                    dvaStore.dispatch(createAction('router/apply')({
                        type: 'Navigation/NAVIGATE',
                        routeName: 'SuperSecondView',
                        params: {
                            url: '/html/topic/topic_details.html',
                            id: Number(id),
                            type: 1,
                            token
                        },
                    }));
                }
            }else if(link.indexOf('/classNoteDetails')!==-1){
                // ????????????
                let acturlstr = link.substr(link.indexOf('#')+1,link.length)
                let obj = acturlstr.split('/');
                let id = obj[2];
                console.log(id);
                if (!id) {
                    dvaStore.dispatch(createAction('router/apply')({
                        type: 'Navigation/NAVIGATE',
                        routeName: 'Community',
                        params: {url: '/html/index.html'},
                    }));
                } else {
                    console.log(id);
                    const token = await global.getItem('userToken');
                    dvaStore.dispatch(createAction('router/apply')({
                        type: 'Navigation/NAVIGATE',
                        routeName: 'SuperSecondView',
                        params: {
                            url: '/html/topic/topic_details.html',
                            id: Number(id),
                            type: 4,
                            token
                        },
                    }));
                }
            }
            // else if(link.indexOf('/CustomPage')!==-1){
            //     navigationPush('CustomPageWeb', {url: link});
            // }
            else{
                navigationPush('CustomWebView', {
                    customurl: link, flag: true, headerTitle: '???????????????',
                });
            }  
                break;
            case '6': // ??????
                navigationPush('CustomWebView', {
                    customurl: `${URL.H5_HOST}crowdFunding//`, flag: true, headerTitle: '????????????',
                });
                break;
            case '7': // ??????
                if (!link) {
                    dvaStore.dispatch(createAction('router/apply')({
                        type: 'Navigation/NAVIGATE',
                        routeName: 'CrowdFunding',
                    }));
                    break;
                } else {
                    const storeIds = await global.getItem('storeId');
                    dvaStore.dispatch(createAction('router/apply')({
                        type: 'Navigation/NAVIGATE',
                        routeName: 'GoodsDetail',
                        params: {productId: L.trim(link), storeId: storeIds },
                    }));
                    break;
                }
            case '8': // ??????
                if (!id) {
                    dvaStore.dispatch(createAction('router/apply')({
                        type: 'Navigation/NAVIGATE',
                        routeName: 'Community',
                        params: {url: '/html/index.html'},
                    }));
                } else {
                    const token = await global.getItem('userToken');
                    dvaStore.dispatch(createAction('router/apply')({
                        type: 'Navigation/NAVIGATE',
                        routeName: 'SuperSecondView',
                        params: {
                            url: '/html/topic/topic_details.html',
                            id: Number(id),
                            type: 1,
                            token
                        },
                    }));
                }
                break;
            default:
                break;
        }
    }
}
export function goGoodsDetail(productId: number, storeId: number, productFullName?: string, productTitle?: string, price?: string, swiperImg?: string) {
    // const storeID = '';
    dvaStore.dispatch(createAction('router/apply')({
        type: 'Navigation/NAVIGATE',
        routeName: 'GoodsDetail',
        params: {productId: L.trim(productId), storeId, productFullName, productTitle, price, swiperImg}
    }));
}
export async function getLocationPermisson() {
    // this.props.navigation.navigate('TestView', { titleName: '????????????'})
    if (Platform.OS === 'ios') {
        getLocation((address) => {
            if (IS_NOTNIL(address)) {
                const maddress = Object.assign({}, address);
                const {provinceName, cityName} = address;
                if (provinceName.endsWith('???')) {
                    maddress.provinceName = provinceName.substring(0, provinceName.length - 1);
                }
                if (cityName.length === 0) {
                    maddress.cityName = address.provinceName;
                }
                dvaStore.dispatch(createAction('address/changeAddress')(maddress));
            }
        });
        // Permissions.check('location').then(response => {
        //     // ?????????????????????????????? ???????????????
        //     if (response === 'authorized') {
        //         getLocation((address) => {
        //             if (IS_NOTNIL(address)) {
        //                 const maddress = Object.assign({}, address);
        //                 const { provinceName, cityName } = address;
        //                 if (provinceName.endsWith('???')) {
        //                     maddress.provinceName = provinceName.substring(0, provinceName.length - 1);
        //                 }
        //                 if (cityName.length === 0) {
        //                     maddress.cityName = address.provinceName;
        //                 }
        //                 dvaStore.dispatch(createAction('address/changeAddress')(maddress));
        //             }
        //         });
        //     } else if (response === 'denied') {
        //                 Alert.alert(
        //                     null,
        //                     `???????????????????????????????????????`,
        //                     [
        //                       {text: '??????', onPress: () => console.log('??????')},
        //                       {text: '??????', onPress: () => Permissions.openSettings().then(() => null)},
        //                       // {text: 'OK', onPress: () => console.log('OK Pressed')},
        //                     ],
        //                   );
        //     } else { // ??????????????? ??????
        //             Alert.alert(
        //                 null,
        //                 `???????????????????????????????????????`,
        //                 [
        //                   {text: '??????', onPress: () => console.log('Ask me later pressed')},
        //                   {text: '??????', onPress: () => Permissions.openSettings().then(() => null)},
        //                 ],
        //               );
        //     }
        // });
    } else {
        // ????????????
        // const locationPmt = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        // if (true) { // ???????????????????????????????????????
        //     // ??????????????????
        //     // const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        //     //     title: '',
        //     //     message: '???????????????????????????????????????',
        //     // });
        //     const grantedObj = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION]);
        //     if (grantedObj.ACCESS_FINE_LOCATION === PermissionsAndroid.RESULTS.GRANTED || grantedObj.ACCESS_COARSE_LOCATION === PermissionsAndroid.RESULTS.GRANTED) { // ?????????????????????????????????
        //         getLocation((address) => {
        //             if (IS_NOTNIL(address)) {
        //                 const maddress = Object.assign({}, address);
        //                 const { provinceName, cityName } = address;
        //                 if (provinceName.endsWith('???')) {
        //                     maddress.provinceName = provinceName.substring(0, provinceName.length - 1);
        //                 }
        //                 if (cityName.length === 0) {
        //                     maddress.cityName = address.provinceName;
        //                 }
        //                 dvaStore.dispatch(createAction('address/changeAddress')(maddress));
        //             }
        //         });
        //     }
        // }
    }
}
// export function _requestPermission() {
//     // example
//     Permissions.request('location', 'whenInUse').then(response => {
//         if (response === 'restricted') {
//             if (Platform.OS === 'android') {
//                 Alert.alert(
//                     null,
//                     `???????????????????????????????????????`,
//                     [
//                       {text: '??????', onPress: () => console.log('Ask me later pressed')},
//                       {text: '??????', onPress: () => AndroidOpenSettings.appDetailsSettings()},
//                     ],
//                   );
//             } else {
//                 Alert.alert(
//                     null,
//                     `???????????????????????????????????????`,
//                     [
//                       {text: '??????', onPress: () => console.log('Ask me later pressed')},
//                       {text: '??????', onPress: () => Permissions.openSettings().then(() => null)},
//                     ],
//                   );
//             }
//         }
//     });
// }

// Base64????????????(??????)
export function Base64() {
    const _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    this.encode = function(input) {????
      var output = "";????
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;????
      var i = 0;????
      input = _utf8_encode(input);????
      while (i < input.length) {??????
        chr1 = input.charCodeAt(i++);??????
        chr2 = input.charCodeAt(i++);??????
        chr3 = input.charCodeAt(i++);??????
        enc1 = chr1 >> 2;??????
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);??????
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);??????
        enc4 = chr3 & 63;??????
        if (isNaN(chr2)) {????????
          enc3 = enc4 = 64;??????
        } else if (isNaN(chr3)) {????????
          enc4 = 64;??????
        }??????
        output = output + ??????_keyStr.charAt(enc1) + _keyStr.charAt(enc2) + ??????_keyStr.charAt(enc3) + _keyStr.charAt(enc4);????
      }????
      return output;??
    }
    _utf8_encode = function(string) {????
          string = string.replace(/\r\n/g, "\n");????
          var utftext = "";????
          for (var n = 0; n < string.length; n++) {??????
              var c = string.charCodeAt(n);??????
              if (c < 128) {????????
                  utftext += String.fromCharCode(c);??????
              } else if ((c > 127) && (c < 2048)) {????????
                  utftext += String.fromCharCode((c >> 6) | 192);????????
                  utftext += String.fromCharCode((c & 63) | 128);??????
              } else {
                  utftext += String.fromCharCode((c >> 12) | 224);????????
                  utftext += String.fromCharCode(((c >> 6) & 63) | 128);????????
                  utftext += String.fromCharCode((c & 63) | 128);??????
              }????
          }????
          return utftext;??
      }
  }