


import L from 'lodash';
import { action, createAction, } from "./../utils";
import { LocalSpecialtyService, } from './../service';
import {DeviceEventEmitter} from 'react-native';
//import {getPrevRouteName} from '../../utils/index';

const initState = {
    community_moduleTitle: '',
    community_modulePosition: '',
    show: false, //显示模版
    bannerList: [], //banner
    navList: [], // 头部导航
    flash: {}, //限时
    newSendList: [], //新品
    CrowdFunding: { //众筹
        zcold:[],
        zcnow:[],
        zcpre:[]
    },
    drinkList: {}, //特产饮品
    foodList: {}, //特产吃食
    communityList: {}, //逛客怎么说
    cartNum: 0,
    allSpecialtyList: [],
    linkNavData: [],
    linkData: [], //猜你喜欢数据
    
};

export default {
    namespace: 'LocalSpecialtyModel',
    state: initState,
    reducers: {
        save(state, {payload}) {
            return {...state, ...payload};
        }
    },
    subscriptions: {

    },
    effects: {
        * getCharaIndex(_, {all, call, put, select}) {
            try{
                const address = yield select(state => state.address);
                const streetId = address.streetId;
                let index = yield call(LocalSpecialtyService.getCharaIndex, {streetId});
                const success = L.get(index, 'success', false);
                const data = L.get(index, 'data', false);
                console.log('特产惠数据>>>>>>>>>>>>')
                console.log(data)
                if(success && data){
                    const data = L.get(index, 'data');
                     yield put(action("save",{
                         bannerList:data.topBannerList.bannerList,
                         navList:data.regionList.regionList,
                         drinkList:data.drinkList,
                         foodList:data.foodList,
                         communityList: data.communityList,
                        }));

                }else{

                }
            }catch (e) {
                console.log(e)
            }
        },
        * isShow(_, {all, call, put, select}){
            try{
               // yield put(action("save",{show:true}));
               console.log('a a a a a  a a ')
               console.log(dvaStore.getState().LocalSpecialtyModel.show)
                if(dvaStore.getState().LocalSpecialtyModel.show){
                    yield put(action("save",{show:false}));
                }else{
                    yield put(action("save",{show:true}));
                }
            }catch (e) {
                console.log(e)
            }
         },
         * getNewAndLimit(_, {all, call, put, select}){
             try{
                const routerState = dvaStore.getState().router;
                const routesArrlength = dvaStore.getState().router.routes.length;
                const routerName = routerState.routes[routesArrlength - 1].routeName;
                
                // 新品 限时 众筹
                const address = yield select(state => state.address);
                console.log(address)
                const params = {
                    provinceId: address.provinceId,
                    cityId: address.cityId,
                    districtId: address.areaId,
                    streetId: address.streetId,
                }
                // 新品 限时
                let index = yield call(LocalSpecialtyService.getCharaData, params);
                const success = L.get(index, 'success', false);
                const data = L.get(index, 'data', false);
                console.log('----------------------'+'限时抢购')
                console.log(data)
                if(success && data){
                    const res = L.get(index,'data');
                    console.log(res)
                    if(res.flash!=null){
                        yield put(action("save",{
                            flash: res.flash
                        }))
                        DeviceEventEmitter.emit('flash', {flash: res.flash});
                    }else{
                        yield put(action("save",{
                            flash: null
                        }))
                    }
                    if(res.reverse!=null){
                        yield put(action("save",{
                            newSendList: res.reverse.acReserveList
                        }))
                    }

                }
                
                // 众筹
                const from = 1;
                if(routerName == 'LocalSpecialty'){
                    from = 2;
                }
                
                let result = yield call(LocalSpecialtyService.getCrowdData, {from});
                const suc = L.get(result, 'success', false);
                const ret = L.get(result, 'data', false);
                if(suc && ret){
                    const res =L.get(result,'data');
                    console.log('>>>>>>>>-------->>>>>>>>>')
                    console.log(res)
                    if(res.zActivityBeginningList.length!=0 || res.zActivitySuccessList.length!=0 || res.zActivityToBeginList.length!=0){
                        let zcold = res.zActivitySuccessList;
                        let zcnow = res.zActivityBeginningList;
                        let zcpre = res.zActivityToBeginList;
                        yield put(action('save',{
                            CrowdFunding: {zcold,zcnow,zcpre}
                        }))
                    }
                    else{
                        yield put(action('save',{
                            CrowdFunding: {zcold:[],zcnow:[],zcpre:[]}
                        }))
                    }

                }
             }catch(err){
                console.log('限时抢购和新品接口获取失败')
             }
         },
         * getFooterList (_, {all, call, put, select}){
             try{
               
                //购物车数量
                let index = yield call(LocalSpecialtyService.getCartNum);
                const success = L.get(index,'success',false);
                const data = L.get(index,'data',false);
                if(success && data){
                    let res = L.get(index,'data');
                    console.log(res)
                    yield put(action('save',{
                        cartNum: res.data
                    }))
                }

             }catch(err){
                 console.log('请求购物车数量和猜你喜欢类目报错')
             }
         },
         * getAllSpecialty(_, {all, call, put, select}){
           try{
            let index = yield call(LocalSpecialtyService.getAllSpecialty);
            const success = L.get(index,'success',false);
            const data = L.get(index,'data',false);
            if(success && data){

                yield put(action('save',{
                    allSpecialtyList: data
                }))
            }
           }catch(err){
               console.log('获取全部特产馆失败')
           }
         },
         * getLinkList(_, {all, call, put, select}){
           try{
                const cateId = 0;
                 //猜你喜欢类目
                let type =3;
                let index = yield call(LocalSpecialtyService.getLinkNav, {type});
                const success = L.get(index,'success',false);
                const result = L.get(index,'data',false);
                console.log(result)

                if(success && result){
                    let ret = L.get(index,'data');
                    cateId = ret[0].cId;

                     console.log('>>>>>========>>>>>>>')
                     console.log(ret)
                     let linkNavData = ret;
                    yield put(action('save',{
                       linkNavData:linkNavData
                    }))

                     //     //猜你喜欢数据
                     const address = yield select(state => state.address);
                     const params = {
                         type:3,
                         cateId: cateId,
                         pId: address.provinceId,
                         cId: address.cityId,
                         rId: address.areaId,
                         sId: address.streetId,
                     }
                     let ind = yield call(LocalSpecialtyService.getLinkData, params);
                     const suc = L.get(ind,'success',false);
                     const res = L.get(ind,'data',false);
                     console.log(result)
                     if(suc && res){
                         let source = L.get(ind,'data');
                         console.log('>>>>>========>>>>>>>')
                         console.log(source)
                         let linkData = source;
                         yield put(action('save',{ 
                            linkData:linkData
                         }))
                     }
                }


           }catch(err){
               console.log('猜你喜欢类目报错')
           }
         },
         * getLinkArr ({payload}, {all, call, put,select}){
           try{
             
             const address = yield select(state => state.address);
             const params = {
                 type:3,
                 cateId: payload.cId,
                 pId: address.provinceId,
                 cId: address.cityId,
                 rId: address.areaId,
                 sId: address.streetId,
             }
             
             let index = yield call(LocalSpecialtyService.getLinkData, params);
             const success = L.get(index,'success',false);
             const result = L.get(index,'data',false);
             console.log('>>>>>>>>>>>>>>>>>================>>>>>>>>>>>>>>>')
             console.log(result)
             if(success && result){
                 let source = L.get(index,'data');
                 console.log('>>>>>========>>>>>>>')
                 console.log(source)
                 let linkData = source;
                 yield put(action('save',{ 
                    linkData:linkData
                 }))
             }else{
                 console.log('出错了出错了')
             }  
           } catch(err){

           }
        }
    }
}
