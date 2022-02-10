import {postAppJSON, getAppJSON} from '../netWork';
import Config from 'react-native-config';
import {createAction, IS_NOTNIL} from '../utils/index';

import URL from './../config/url';
import host from './../config/index';
import {homeService} from './../dva/service';
import {GET, GET_P, POST_FORM, POST_JSON} from './../config/Http';
import {DeviceEventEmitter, NativeModules, Platform } from 'react-native';
import L from 'lodash';

export const fetchPriceByProductList = async (traceId) => {
    try {
        const respComission = await GET(host.API_SEARCH_HOST + "/" + Config.ASYNC_ACCESS_PRICE1 + "?traceId=" + traceId);
        return respComission;
    } catch (error) {
    }
};

export const fetchUnread = async () => {
    try {
        // // 请求首页尾部数据,存储在常量footer中
        const json = await getAppJSON(Config.UNRED_MESSAGE, {}, Config.API_URL);
        return json.data;
    } catch (error) {
        Log('输出error' + error);
    }
};
export const fetchDefaultSearch = async () => {
    try {
        const json = await GET(URL.hot_word, {platform: 3});
        if(json.success) {
            return json.data;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
};

export const addPosition = async () => {
    try {


        const provinceId = dvaStore.getState().address.provinceId;
        const cityId = dvaStore.getState().address.cityId;
        const areaId = dvaStore.getState().address.areaId;
        const streetId = dvaStore.getState().address.streetId;
        const regionName = encodeURIComponent(dvaStore.getState().address.regionName);

        const json = await getAppJSON(`v3/mstore/sg/addPositionToCookie.json?provinceId=${provinceId}&cityId=${cityId}&areaId=${areaId}&regionName=${regionName}&streetId=${streetId}&noLoading=true`);
        return json;
    } catch (error) {
        Log('输出error' + error);
    }
};
export const fetchPosition = async () => {
    try {
        const json = await getAppJSON('v3/mstore/sg/getPositionFromCookie.json');
        return json;
    } catch (error) {
        Log('输出error' + error);
    }
};

export interface ITop {
    askEvery: any;
    crowdFunding: any;
    good: any;
    midActivtyList: any[];
    midBannerList: any[];
    midCommList: any[];
    mustBuy: any;
    topBannerList: any[];
    wiki: any;
}

const initTopData: ITop = {
    askEvery: {},
    crowdFunding: [],
    good: {},
    midActivtyList: [],
    midBannerList: [],
    midCommList: [],
    mustBuy: {},
    topBannerList: [],
    wiki: {},
};
const initState = {
    topData: initTopData,
    showTab: true,
    bottomData: {},
    rid: '',
    floorsData: {floors: [], fCommunity: undefined},
    middleImageConfig: {},
    msgCenter: {},
    flashSales: {},
    advertisement: {},
    iconConfig: {},
    bottomIconConfig: {
        iconImageConfig: {},
        iconFontConfig: {},
    },
    navBarStyle: {
        BarStyleLight: true,
        NavBgColor: 'rgba(255, 255, 255,0)',
    },
    defaultSearchHotWord: '',
};
export default {
    namespace: 'home',
    state: initState,
    reducers: {
        changeFloorData(state, {payload}): any {
            return {...state, ...payload};
        },
        changeHomeTop(state, {payload}): any {
            return {...state, ...payload};
        },
        changeMiddleImageConfig(state, {payload}): any {
            return {...state, ...payload};
        },
        changeHomeBottom(state, {payload}): any {
            return {...state, ...payload};
        },
        changeMsgCenter(state, {payload}): any {
            return {...state, ...payload};
        },
        changeFlashSales(state, {payload}): any {
            return {...state, ...payload};
        },
        changeAdvertisement(state, {payload}): any {
            return {...state, ...payload};
        },
        changeIconConfig(state, {payload}): any {
            return {...state, ...payload};
        },
        changeBottomIconConfig(state, {payload}): any {
            return {...state, ...payload};
        },
        changeNavBarStyle(state, {payload}): any {
            return {...state, navBarStyle: {...payload}};
        },
        clearAdvertisement(state, {payload}): any {
            // Log('clearAdvertisement -> state: ', { ...state, ...payload });
            return {...state, ...payload};
        },
        changeDefaultSearchHotWord(state, {payload}): any {
            return {...state, ...payload};
        },
    },
    effects: {
        // 首页头部接口请求
        * fetchTopData({payload}, {call, put}) {
            try {
                const {data} = yield call(getAppJSON, Config.HOMEPAGE_TOP);
                yield put(createAction('changeHomeTop')({
                    topData: data,
                }));
            } catch (error) {
                Log(error);
            }
        },
        // 首页底部图标配置
        * fetchBottomIconConfig({payload}, {call, put}) {
            try {
                const {data = []} = yield call(getAppJSON, `${Config.ACTIVITY_ICON_TABS_NEW}?iconType=2`);
                if (IS_NOTNIL(data)) {
                    yield put(createAction('changeBottomIconConfig')({bottomIconConfig: data}));
                }
            } catch (error) {
                Log(error);
            }
        },
        // 首页中部图标配置
        * fetchIconConfig({payload}, {call, put}) {
            try {
                const {data = []} = yield call(getAppJSON, `${Config.ACTIVITY_ICON_TABS_NEW}?iconType=1`);
                yield put(createAction('changeIconConfig')({iconConfig: data}));
            } catch (error) {
                Log(error);
            }
        },
        // 首页中通图配置
        * fetchMiddleImageConfig({payload}, {call, put}) {
            try {
                const {data} = yield call(getAppJSON, Config.ACTIVITY_BG);
                yield put(createAction('changeMiddleImageConfig')({
                    middleImageConfig: data,
                }));
            } catch (error) {
                Log(error);
            }
        },
        // 尾部视图接口请求百分点推荐
        * fetchBottomData({payload}, {call, put, select}) {
            try {
                const address = yield select(state => state.address);
                const users = yield select(state => state.users);
                const storeId = L.get(users, 'mid', 20219251);
                const streetId = address.streetId;
                const districtId = address.areaId;
                const cityId = address.cityId;
                const provinceId = address.provinceId;
                const productIds = payload.productIds;
                const data = yield call(homeService.getHomeGuess, {provinceId, cityId, districtId, streetId, storeId,productIds});
                const isCanSyncGetPrice = L.get(data, 'isCanSyncGetPrice', false);
                const traceId = L.get(data, 'traceId');
                let footerDataSource = [];
                const products = [];
                if (isCanSyncGetPrice) {

                    footerDataSource = yield call(GET, URL.get_price_by_traceid, {traceId});
                    
                    if (footerDataSource.firstVo) {
                        products.push(footerDataSource.firstVo);
                    }
                    if (footerDataSource.secondList) {
                        for (const item of footerDataSource.secondList) {
                            products.push(item);
                        }
                    }
                    if (footerDataSource.normalList) {
                        for (const item of footerDataSource.normalList) {
                            products.push(item);
                        }
                    }
                } else {
                    if (data.firstVo) {
                        products.push(data.firstVo);
                    }
                    if (data.secondList) {
                        for (const item of data.secondList) {
                            products.push(item);
                        }
                    }
                    if (data.normalList) {
                        for (const item of data.normalList) {
                            products.push(item);
                        }
                    }
                }
                // // console.log("changeHomeBottom", products);
                yield put(createAction('changeHomeBottom')({bottomData: products,rid:payload.rid}));
            } catch (error) {
                Log(error);
            }
        },
        // 限时抢购接口请求
        * fetchFlashSales({payload}, {call, put}) {
            try {
                const {address} = dvaStore.getState();
                const url = `${Config.HOMEPAGE_FALSHSALES}?provinceId=${address.provinceId}&cityId=${address.cityId}&districtId=${address.areaId}&streetId=${address.streetId}`;
                const {data} = yield call(
                    getAppJSON,
                    url,
                );
                yield put(createAction('changeFlashSales')({
                    flashSales: data,
                }));
                DeviceEventEmitter.emit('flashSaleFresh', {flashSales: data});
            } catch (error) {
                Log(error);
            }
        },
        // 顺逛公告接口请求
        * fetchMsgCenter({payload}, {call, put}) {
            try {
                const {data} = yield call(getAppJSON, Config.MESSAGECENTER_INIT);
                yield put(createAction('changeMsgCenter')({
                    msgCenter: data,
                }));
            } catch (error) {
                Log(error);
            }
        },
        * fetchFloors({payload}, {call, put}) {
            try {
                const {address} = dvaStore.getState();
                const params = {
                    provinceId: address.provinceId,
                    cityId: address.cityId,
                    districtId: address.areaId,
                    street: address.streetId,
                };
                const res = yield call(
                    getAppJSON,
                    Config.HOME_FLOOR,
                    params,
                    undefined,
                    true,
                );
                console.log(res);
                const {data} = res;
                if (IS_NOTNIL(data)) {
                    yield put(createAction('changeFloorData')({floorsData: data}));
                    console.log(dvaStore.getState().home.floorsData);
                }
            } catch (error) {
                Log(error);
            }
        },
        // 首页广告弹窗请求
        * fetchAdvertisement({payload}, {call, put}) {
            try {
                const res = yield call(
                    getAppJSON,
                    Config.GET_NEW_PERSON,
                );
                const {data} = res;
                // Log('home model -> advertisement array: ', data);
                if (data && Object.keys(data).length > 0 &&
                    ((data.bannerInfotJson && data.bannerInfotJson.length > 0) ||
                        (data.bannerNewGriftJson && data.bannerNewGriftJson.length > 0))) {
                    yield put(createAction('changeAdvertisement')({
                        advertisement: data,
                    }));
                }
            } catch (error) {
                Log(error);
            }
        },
        // 关闭 tab bar
        * onShowTab({payload: {isShowTab}}, {call, put, select}) {
            try {
                const {showTab} = yield select(state => state.home);
                if (showTab !== isShowTab) {
                    yield put(createAction('changeAdvertisement')({
                        showTab: isShowTab,
                    }));
                }
            } catch (error) {
                Log(error);
            }
        },
    },
};
