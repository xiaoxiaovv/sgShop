import {ExperienceStoreService} from '../service'
import {action,} from "./../utils";


const initState = {
  data: {},
  bannerData: [],//轮播图
  storeData: {},//附近单个体验店  首页
  singleStoreData: {},//附近单个体验店  详情页
};

export default {
  namespace: 'ExperienceStoreModel',
  state: initState,
  reducers: {
    save(state, {payload}): any {
      return {...state, ...payload};
    },
  },
  effects: {
    /**
     * 初始化数据
     */* init({payload}, {call, put}) {
      try {
        yield put(action('ExperienceStoreModel/getNearbyTypes'));
        yield put(action('ExperienceStoreModel/getBanners'));
        yield put(action('ExperienceStoreModel/getNearbyStore', {type: 1}));

      } catch (e) {
        console.log(e)
      }
    },

    * getNearbyTypes({payload}, {call, put}) {
      try {
        const res = yield call(ExperienceStoreService.getNearbyTypes);
        if (res && res.success) {
          yield put(action("save", {data: res.data}));
        }
      } catch (e) {
        console.log(e)
      }
    },

    * getBanners({payload}, {call, put}) {
      try {
        const res = yield call(ExperienceStoreService.getBanners, {itemsId: 7});
        if (res && res.success) {
          yield put(action("save", {bannerData: res.data}));
        }
      } catch (e) {
        console.log(e)
      }
    },

    /**
     * 获取附近单个体验店
     * cityId 城市Id
     * itemsId  首页项目Id 1:成套家电 2:居家定制（当前业务中固定传1）
     * latitude 维度
     * longitude 经度
     * type 类型  1:首页 2:详情页
     */* getNearbyStore({payload: {cityId,type}}, {call, put, select}) {
      try {
        const address = yield select(state => state.address);
        let newCityId;
        if(cityId){
          newCityId=cityId;
        }else {
          newCityId=address.cityId;
        }
        const latitude = address.latitude;
        const longitude = address.longitude;
        const res = yield call(ExperienceStoreService.getNearbyStore, {
          cityId:newCityId,
          latitude,
          itemsId: 1,
          longitude,
          type: type
        });
        if (res && res.success) {
          yield put(action("save", {storeData: res.data}));
        }
      } catch (e) {
        console.log('getNearbyStore', e)
      }
    },

    /**
     * 获取附近单个体验店
     * cityId 城市Id
     * itemsId  首页项目Id 1:成套家电 2:居家定制（当前业务中固定传1）
     * latitude 维度
     * longitude 经度
     * type 类型  1:首页 2:详情页
     */* getNearbyDetialStore({payload: {type, nearbyType}}, {call, put, select}) {
      try {
        const address = yield select(state => state.address);
        const cityId = address.cityId;
        const latitude = address.latitude;
        const longitude = address.longitude;
        const res = yield call(ExperienceStoreService.getNearbyStore, {
          cityId,
          latitude,
          itemsId: 1,
          longitude,
          type: type,
          nearbyType
        });
        if (res && res.success) {
          yield put(action("save", {singleStoreData: res.data}));
        }
      } catch (e) {
        console.log('getNearbyStore', e)
      }
    }


  },
};
