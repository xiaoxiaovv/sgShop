import {homeDressService} from '../service'
import {action, createAction, NavigationActions} from "./../utils";


const initState = {
  tabbarData: [],//头部可滑动item
  bannerData: [],//轮播图
  topRecommendProducts: [],//推荐商品
  lowRecommendProducts: [],//其他推荐商品
};

export default {
  namespace: 'HomeDress',
  state: initState,
  reducers: {
    save(state, {payload}): any {
      return {...state, ...payload};
    },
  },
  effects: {
    * getTabbar({payload}, {call, put, select}) {
      try {
        const res = yield call(homeDressService.fetchProductCates);
        yield put(action("save", {tabbarData: res.data}));

        if (res.data && res.data.length > 0) {
          const parentCateId = res.data[0].id;
          console.log('parentCateId', parentCateId);
          yield put(action('getTopRecommendProducts', {parentCateId: parentCateId}));
          yield put(action('getLowRecommendProducts', {parentCateId: parentCateId}));
        }
      } catch (e) {
        console.log(e)
      }
    },

    * getAdornHomeBanner({payload}, {call, put}) {
      try {
        const res = yield call(homeDressService.fetchAdornHomeBanner);
        yield put(action("save", {bannerData: res.data}));
      } catch (e) {
        console.log(e)
      }
    },
    * getTopRecommendProducts({payload: {parentCateId}}, {call, put, select}) {
      try {
        yield put(action("save", {topRecommendProducts:[]}));

        const address = yield select(state => state.address);
        const streetId = address.streetId;
        const districtId = address.areaId;
        const cityId = address.cityId;
        const provinceId = address.provinceId;
        const res = yield call(homeDressService.fetchTopRecommendProducts, {
          parentCateId: parentCateId,
          provinceId,
          cityId,
          districtId,
          streetId
        });
        yield put(action("save", {topRecommendProducts: res.data.topRecommendProducts}));
      } catch (e) {
        console.log(e)
      }
    },

    * getLowRecommendProducts({payload: {parentCateId}}, {call, put, select}) {
      try {
        yield put(action("save", {lowRecommendProducts:[]}));

        const address = yield select(state => state.address);
        const streetId = address.streetId;
        const districtId = address.areaId;
        const cityId = address.cityId;
        const provinceId = address.provinceId;
        const res = yield call(homeDressService.fetchLowRecommendProducts, {
          parentCateId: parentCateId,
          provinceId,
          cityId,
          districtId,
          streetId
        });
        yield put(action("save", {lowRecommendProducts: res.data}));
      } catch (e) {
        console.log(e)
      }
    },
  },
};
