


import { Toast } from "antd-mobile";
import L from 'lodash';
import { action, createAction, NavigationActions} from "./../utils";
import { ctjjService, } from './../service';

const initState = {
    videoTitle: '视频体验',
    menusTitle: '全屋解决方案',
    recommendsTitle: '成套家电推荐',
    banners: [],
    menus: [],
    scenes: [],
    recommendId: '',
    recommends: [],
    videos: [],
    nearby: false,
    nLongitude: "",
    nLatitude: "",
    nCityId: "",

    // 全套页面数据
    programsRecommendsTitle: '推荐方案',
    expertsTitle: '解决方案专家团队',
    programsBanners: [],
    programsRecommends: [],
    programsExperts: [],

    // 解决方案页数据
    autoPlay: true,
    programDetail: null,
    productsIds: null,
    completeList: [], // 成套清单

    // 体验店详情
    store: null,


};

export default {
    namespace: 'ctjjModel',
    state: initState,
    reducers: {
        save(state, {payload}) {
            return {...state, ...payload};
        }
    },
    subscriptions: {

    },
    effects: {
        * getMenuCases(_, {all, call, put, select}) {
            try{
                let menus_cases = yield call(ctjjService.getMenuCases);
                const success = L.get(menus_cases, 'success', false);
                const data = L.get(menus_cases, 'data', false);
                if(success && data){
                    const program = L.get(data, 'program');
                    const scenes = L.get(data, 'scenes', []);
                    let newScenes = scenes.slice(0,4);
                    const pTitle = L.get(program, 'title', "全屋解决方案");
                    const programs = L.get(program, 'programs', []);
                    // let da = {id: 0, iconUrl:  "http://cdn09.ehaier.com/shunguang/H5/www/img/homepage/hometry.png",
                    // name: '全景VR'};
                    let newMenus = programs.slice(0,8);
                    // newMenus.push(da);
                    const recommend = L.get(data, 'recommend');
                    const recommendId = L.get(recommend, 'id');
                    const rTitle = L.get(recommend, 'title', "成套家电推荐");
                    const recommends = L.get(recommend, 'recommends', []);
                    yield put(action("save", {menusTitle: pTitle, recommendsTitle: rTitle, menus: newMenus, recommends: recommends, recommendId, scenes: newScenes}));
                }
            }catch (e) {
                console.log(e)
            }
        },
        * getVideos(_, {all, call, put, select}) {
            try{
                const videos = yield call(ctjjService.getTopic, {group: 0, itemsId: 1, pageIndex: 1, pageSize: 3});
                const success = L.get(videos, 'success', false);
                const data = L.get(videos, 'data', false);
                if(success && data){
                    const title = L.get(data, 'title', "视频体验");
                    const storys = L.get(data, 'storys', []);
                    yield put(action("save", {videoTitle: title, videos: storys}));
                }
            }catch (e) {
                console.log(e)
            }
        },
        * getNearby(_, {all, call, put, select}) {
            const address = yield select(state => state.address);
            // const cityId = 716;
            const cityId = address.cityId;
            const latitude = address.latitude;
            const longitude = address.longitude;
            // console.log(`-getNearby--latitude--${latitude}-longitude--${longitude}`);
            const itemsId = 1;
            const type = 1; // 首页
            try{
                let nearby =  yield call(ctjjService.getNearby, {cityId: cityId, latitude: latitude, longitude: longitude, type, itemsId});
                const success = L.get(nearby, 'success', false);
                const data = L.get(nearby, 'data', null);
                if(success){
                    yield put(action("save", {nearby: data, nLongitude: longitude, nLatitude: latitude, nCityId: cityId}));
                }
            }catch (e) {
                console.log(e)
            }
        },
        * getStoreDetail(_, {all, call, put, select}) {
            const address = yield select(state => state.ctjjModel);
            // const cityId = 716;
            const cityId = address.nCityId;
            const latitude = address.nLatitude;
            const longitude = address.nLongitude;
            // console.log(`-getStoreDetail--latitude--${latitude}-longitude--${longitude}`);
            const itemsId = 1;
            const type = 2; // 详情
            try{
                let nearby =  yield call(ctjjService.getNearby, {cityId: cityId, latitude: latitude, longitude: longitude, type, itemsId});
                const success = L.get(nearby, 'success', false);
                const data = L.get(nearby, 'data', false);
                if(success && data){
                    yield put(action("save", {store: data}));
                }
            }catch (e) {
                console.log(e)
            }
        },
      /**
       * tabbar体验店跳转到 体验店详情
       */
      * getStoreDetailFromTab({payload: {nearbyId,latitude,longitude}}, {all, call, put}) {
        try{
          let nearby =  yield call(ctjjService.getNearbyDetail, { nearbyId,latitude,longitude});
          const success = L.get(nearby, 'success', false);
          const data = L.get(nearby, 'data', false);
          if(success && data){
            yield put(action("save", {store: data}));
          }
        }catch (e) {
          console.log(e)
        }
      },
        // 全屋方案页
        * getPrograms({type, payload: {id}}, {all, call, put, select}) {
            try{
                const programs = yield call(ctjjService.getPrograms, {id: id});
                const success = L.get(programs, 'success', false);
                const data = L.get(programs, 'data', false);
                if(success && data){
                    // banners expert -> experts title recommend -> recommends title
                    const programsBanners = L.get(data, 'banners', []);
                    const expert = L.get(data, 'expert');
                    const programsExperts = L.get(expert, 'experts');
                    const expertsTitle = L.get(expert, 'title', '解决方案专家团队');
                    const recommend = L.get(data, 'recommend');
                    const programsRecommends = L.get(recommend, 'recommends');
                    const programsRecommendsTitle = L.get(recommend, 'title', '推荐方案');
                    let autoPlay = true;
                    for(let i = 0; i < programsBanners.length; i++){
                        let type = L.get(programsBanners[i], "type", 1);
                       if(type == 1){
                           autoPlay = false;
                           break;
                       }
                    }
                    yield put(action("save", {programsBanners,programsExperts,expertsTitle,programsRecommends,programsRecommendsTitle, autoPlay}));
                }
            }catch (e) {
                console.log(e)
            }
        },
        // 解决方案页
        * getProgramsDetail({type, payload: {id}}, {all, call, put, select}) {
            try{
                const programs = yield call(ctjjService.getProgramsDetail, {id: id});
                const success = L.get(programs, 'success', false);
                const data = L.get(programs, 'data', false);
                if(success && data){
                    const productsIds = L.get(data, 'productsIds');
                    yield put(action("save", {productsIds, programDetail: data}));
                    /*
                    expert{
avatar "http://cdn21test.ehaier.com:8080/file/5ae9aea42c9bcc1f24db7369.png"
id 18
name "小明"
}
id 16
imageUrl "http://cdn21test.ehaier.com:8080/file/5af0132e4aa3a14d7c441e6b.png"
introduction "大家不好啊"
isRecommend 1
name "解决方案4"
productsIds "1000173,"
programsId 1
                     */

                    // 获取 productsIds 的列表 completeList
                    // yield put(action("getCompleteList", {productsIds}));
                }
            }catch (e) {
                console.log(e)
            }
        },
        // 获取 productsIds 的列表 completeList
        * getCompleteList({type, payload: {productsIds}}, {all, call, put, select}) {
            try{
                const address = yield select(state => state.address);
                const streetId = address.streetId;
                const programs = yield call(ctjjService.getCompleteList, {productsIds, streetId});
                const success = L.get(programs, 'success', false);
                const data = L.get(programs, 'data', false);
                if(success && data){
                    /*
bookable:1  0:不可预订 1:可预订
commission:null 佣金
id:1000173  商品Id
imageUrl:"http://cdn02.ehaier.com/product/4e2fbaa934198c4c7a00001e.jpg"
name:"Haier/海尔 空调 KFR-26GW/01FAQ23套机(红)"
price:null
stock:false 是否有货
title:"OJO测试商品003"
                     */
                    yield put(action("save", {completeList: data}));
                }
            }catch (e) {
                console.log(e)
            }
        },
        // 获取 专家详情
        * getExperts({type, payload: {id}}, {all, call, put, select}) {
            try{
                const channel = 1;
                const programs = yield call(ctjjService.getExperts, { channel, id, pageIndex: 1, pageSize: 10});
                const success = L.get(programs, 'success', false);
                const data = L.get(programs, 'data', false);
                if(success && data){
                    console.log('------------------------------------===== getExperts =====---------------------------------------');
                    console.log(data);
                    // yield put(action("save", {completeList: data}));
                }
            }catch (e) {
                console.log(e)
            }
        },

    }
}
