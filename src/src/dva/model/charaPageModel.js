import {charaPageService} from '../service'
import {action, createAction, NavigationActions} from "./../utils";
import {Toast} from 'antd-mobile';

const initState = {
  pageTitle: '',//头部标题
  topImageUrl: '',//头部image
  topBanners: [],//轮播图
  recommendProducts: [],//推荐商品
  recommendations: [],//馆长推荐
  hotProducts: [],//热卖
  competitiveProducts: [],//精品精选
  communities: [],//逛客怎么说
  collects: 0,//收藏数量
  cities: [],//特产城市
  isCollected: 0,//0否 1 是
  simplePicUrl: '',// 微信分享的url
};

export default {
  namespace: 'CharaPage',
  state: initState,
  reducers: {
    save(state, {payload}): any {
      return {...state, ...payload};
    },
  },
  effects: {
    * getData({payload: {regionId}}, {call, put, select}) {
      try {
        const address = yield select(state => state.address);
        const streetId = address.streetId;
        const res = yield call(charaPageService.fetchCharaPage, {regionId, streetId});
        if (res.success) {
          yield put(action("save", {
            pageTitle: res.data.pageTitle,//头部标题
            topImageUrl: res.data.topImageUrl,
            topBanners: res.data.topBanners,
            recommendProducts: res.data.recommendProducts,
            recommendations: res.data.recommendations,
            hotProducts: res.data.hotProducts,
            competitiveProducts: res.data.competitiveProducts,
            communities: res.data.communities,
            collects: res.data.collects,
            cities: res.data.cities,
            isCollected: res.data.isCollected,
          }));
        }
      } catch (e) {
        console.log(e)
      }
    },

    * collect({payload: {type, collectId}}, {call, put, select}) {
      try {
        const count = yield select(state => state.CharaPage.collects);
        const isCollected = yield select(state => state.CharaPage.isCollected);
        console.log('isCollected', isCollected);

        if (isCollected === 1) {
          yield call(charaPageService.collectCancel, {type, collectId});
          Toast.info('取消成功');
          yield put(action("save", {collects: Number.parseInt(count) - 1, isCollected: 0}));
        } else {
          yield call(charaPageService.collectStore, {type, collectId});
          Toast.info('收藏成功');
          yield put(action("save", {collects: Number.parseInt(count) + 1, isCollected: 1}));
        }

      } catch (e) {
        console.log(e)
      }
    },

    * clearData({payload}, {call, put,}) {
      try {

        yield put(action("save", initState));
      } catch (e) {
        console.log(e)
      }
    },
  }
}
