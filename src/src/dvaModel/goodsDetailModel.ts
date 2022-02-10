import { getAppJSON, getDetailJSON, postAppJSON, postAppForm, getDetailNoLoading, getAppNoLoading } from '../netWork';
import { NativeModules, Alert } from 'react-native';
import { createAction, createIdAction, isLogin, saveImg, mobileNumberRegExp } from '../utils';
import { IPreferential, IEvaluateCount, IEvaluateAbstract, IO2OStore, GoodsBuyType } from '../interface';
import Config from 'react-native-config';
import { fromJS, Map, List } from 'immutable';
import { Toast } from 'antd-mobile';
import { CountStyleType } from '../containers/GoodsDetail/Goods/CountStyle';

import URL from '../config/url';
import { GET, POST_JSON, GET_P, POST_FORM} from '../config/Http';
// import { showLoading } from './index';
import { GetStatisticInfo } from '../common/GetStatisticInfo'; //yl

function queue(arr, size) {
  if (size > arr.length) { return; }
  var allResult = [];

  (function (arr, size, result) {
    if (result.length == size) {
      allResult.push(result);
    } else {
      for (var i = 0, len = arr.length; i < len; i++) {
        var newArr = [].concat(arr),
          curItem = newArr.splice(i, 1);
        arguments.callee(newArr, size, [].concat(result, curItem));
      }
    }
  })(arr, size, []);

  return allResult;
}


Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

export const initState = {
  productId: '',
  data: { product: {} },
  url: '',
  urlCanshu: '',
  pfData: { commissionRate: 0, loadingPF: false },
  attData: null,
  evaluate: {
    evaluateData: [],
    evaluateRefresh: false,
    shortEvaluate: {},
    evaluateCount: { commentTotal: 0, positiveRate: 0, totalNum: 0 },
    evaluateAbstract: { hasPicNum: 0, negativeNum: 0, neutralNum: 0, positiveNum: 0, productId: 0, totalNum: 0 },
    evaluateImpression: [],
  },
  O2OSData: {},
  couponList: null,
  uiState: { showCountType: CountStyleType.None, loadingPF: false, buyBtnType: 0, showOrder: false, goodsShare: { shareImg: '', shareVisible: false } },
  baiTiao: { showBaitiao: false, isRefresh: false, costInfo: [], crdComAvailAmt: '', feeInfo: '' },
  productInfo: {
    number: 1,
    location: { pcrName: ''},
    attrValueNames: {},
    productAttInfo: { attrValueName: '' },
    stroeMsgData:[],
  },
  hasProgram: 0,
  sqzbsData:{
    communityUrl: '',
    showSQZBS: false,
  },
};

export default {
  namespace: 'goodsDetail',
  state: Map({}),
  reducers: {
    initState(state, { modelId, payload }) {
      return state.merge({ [modelId]: { ...initState, ...payload } })
    },
    changeState(state, {  modelId, payload  }) {
        console.log('modelId',modelId);
        console.log('payload.pfData',payload);
        console.log('{[modelId]: payload}',{[modelId]: payload})
      if (!state.get(modelId)) {return state; }
        return state.mergeDeep({[modelId]: payload})
    },
    changeProgram(state, {  modelId, payload  }) {
      if (!state.get(modelId)) {return state; }
      return state.setIn([modelId, 'hasProgram'], payload.hasProgram);
    },
    esqzbsChange(state, {  modelId, payload  }) {
      if (!state.get(modelId)) { return state; }
      const mergePayload = { [modelId]: { sqzbsData: payload.sqzbsData } };

      return state.mergeDeep(mergePayload);
    },
      closeBaiTiao(state, {  modelId  }){
          if (!state.get(modelId)) {return state; }
          return state.setIn([modelId, 'baiTiao','showBaitiao'], false);
      },
    loadingFinish(state, { modelId, payload }) {
      if (!state.get(modelId)) {return state; }
      const mergePayload = { [modelId]: {
        ...payload,
      } };
      return state.mergeDeep(mergePayload);
    },
    loadEvaluateFinish(state, { modelId, payload: { evaluateData, evaluateRefresh } }) {
      if (!state.get(modelId)) {return state; }
      return state.setIn([modelId, 'evaluate', 'evaluateRefresh'], evaluateRefresh)
               .setIn([modelId, 'evaluate', 'evaluateData'], evaluateData);
    },
    changeEvaluate(state, { modelId, payload }) {
      if (!state.get(modelId)) {return state; }
      const mergePayload = { [modelId]: { evaluate: payload } };
      return state.mergeDeep(mergePayload);
    },
    changeUIState(state, { modelId, payload }) {
      if (!state.get(modelId)) {return state; }
      const mergePayload = { [modelId]: { uiState: payload } };
      return state.mergeDeep(mergePayload);
    },
    loadBaiTiaoFinish(state, { modelId, payload }) {
      if (!state.get(modelId)) {return state; }
      return state.mergeDeep({ [modelId]: { baiTiao: payload} })
              .setIn([modelId, 'baiTiao', 'costInfo'], fromJS(payload.costInfo)); // 数组不能merge需要重新赋值
    },
    loadPFFinish(state, { modelId, payload }) {
      if (!state.get(modelId)) {return state; }
      const mergePayload = { [modelId]: {
        pfData: payload.pfData,
        loadingPF: payload.loadingPF,
      } };
      return state.mergeDeep(mergePayload);
    },
    changeProductInfo(state, { modelId, payload }) {
      if (!state.get(modelId)) {return state; }
      const mergePayload = { [modelId]: { productInfo: payload } };

      return state.mergeDeep(mergePayload);
    },
    changeAttData(state, { modelId, payload }) {
      if (!state.get(modelId)) {return state; }
      return state.setIn([modelId, 'attData'], fromJS(payload));
    },
    changeProductAttSkku(state, { modelId, payload }) {
      if (!state.get(modelId)) { return state; }
      return state.setIn([modelId, 'productInfo', 'isChoseSkku'], payload);
    },
    changeProductAtt(state, { modelId, payload }) {
      if (!state.get(modelId)) {return state; }
      const { attrValueNames, productAttInfo } = payload;
      return state.mergeDeep({ [modelId]: { productInfo: payload } })
              .setIn([modelId, 'productInfo', 'productAttInfo'], productAttInfo)
              .setIn([modelId, 'productInfo', 'attrValueNames'], attrValueNames);
    },
    changeL(state, { modelId, payload }) {
      if (!state.get(modelId)) {return state; }
      return state.setIn([modelId, 'pfData', 'l'], fromJS(payload.pfData.l)); // 数组不能merge需要重新赋值
    },
    clear(state, { modelId, payload }) {
      return state.delete(modelId);
    },
  },

  effects: {
    *loadingData({ modelId, payload }, { call, put, select, take }) {
      try {
        console.log(payload)
        const mSid = yield select(state => state.users.mid);
        const { productId, storeId = mSid, productFullName, productTitle, swiperImg, price,
          isFirstLoad } = payload;
        // 初始化
        yield put(createIdAction('initState')({
          modelId,
          productId,
          data: { product: { productFullName, productTitle }, swiperImgs: [swiperImg || ''] },
        }));
        // 加载商品信息
        yield put(createIdAction('loadingProductData')({ modelId, productId, storeId }));
        yield put(createIdAction('hasProgram')({ modelId, productId }));
        // 评价条数 好评率
        yield put(createIdAction('loadingEvaluateCount')({ modelId, productId }));
        // 评价简介 商品印象
        yield put(createIdAction('loadingEvaluateAbstract')({ modelId, productId }));
        yield take('loadingProductData/@@end');
        const {
          goodsDetail,
          address: { provinceId, provinceName, cityId, cityName, areaId: regionId, areaName, streetId, streetName },
        } = yield select(state => state);
        const sku = goodsDetail.getIn([modelId, 'data', 'product', 'sku']);
        const memberId = goodsDetail.getIn([modelId, 'data', 'storeId']);
        const swiperImgs = goodsDetail.getIn([modelId, 'data', 'swiperImgs']);
        // 初始化订单信息
        yield put(createIdAction('changeProductInfo')({
          modelId,
          productId,
          number: 1,
          isFromInvoice: 'false', // 是否发票页跳转
          sku,
          productDefaultIcon: swiperImgs.size > 0 ? swiperImgs.toJS()[0] : '',
          productAttInfo: {},
        }));

        const pcrName = provinceName + ' ' + cityName + ' ' + areaName + '/' + streetName;
        yield put(createIdAction('changePlace')({
          modelId, provinceId, cityId, regionId, streetId, memberId, number: 1, pcrName,
          provinceName, cityName, areaName, streetName, isFirstLoad,
        }));
        // 加载O2O店铺信息 yl
        yield take('loadingPreferential/@@end');
        // yield put(createIdAction('sqzbsData')({ modelId, productId, storeId: dvaStore.getState().goodsDetail.getIn([modelId, 'O2OSData', 'o2oStoreId']) || '' }));
        // gio 埋点 yl
        NativeModules.StatisticsModule.track('ProdView', {
          productId: productId,
          productFirstName: '',
          productSecondName: '',
          o2oType: dvaStore.getState().goodsDetail.getIn([modelId, 'data','o2oType'])||'',
          storeId: dvaStore.getState().goodsDetail.getIn([modelId, 'O2OSData','o2oStoreId'])||''
        });
         //baifend 埋点
         NativeModules.BfendModule.onVisit(sku,{
          uid: memberId.toString(),
      });
      } catch (error) {
        Log(error);
      }
    },

    // 商品详情
    *loadingProductData({ modelId, payload }, { call, put }) {
      try {
        const { productId, storeId } = payload;
        // const { data: goodsData } = yield call(
        //   getDetailNoLoading,
        //   `${Config.GOODS_DETAIL}/${productId}.html`,
        //   { o2oType: 0, fromUrl: undefined, fromType: '', type: 1, storeId },
        // );
        // 商品详情主接口 yl
        const {success, message, data: goodsData} = yield call(GET, URL.GOODS_DETAIL+productId+'.json', {storeId});
        if(success){
          let swiperResource = [];
          if (goodsData && goodsData.hasOwnProperty('mp4FileId1')) {
            const videoJSON = JSON.parse(goodsData.mp4FileId1);
            goodsData.swiperVideo = videoJSON;
            swiperResource.push({ video: videoJSON.video, image: videoJSON.img, type: 1 });
          }

          if(goodsData && goodsData.hasOwnProperty('swiperImgs')){
            goodsData.swiperImgs.forEach((image) => swiperResource.push({ video: null, image, type: 2 }));
          }

          goodsData.swiperResource=swiperResource;

          yield put(createIdAction('loadingFinish')({
            modelId,
            data: goodsData,
            url: `${URL.H5_HOST}/imageAndWord/${productId}`,
            urlCanshu: `${URL.H5_HOST}/specifications/${productId}`,
          }));
          console.log(dvaStore.getState().users)
    
          // NativeModules.BfendModule.onVisit(goodsData.product.sku,{
          //   uid: dvaStore.getState().users.mid
          // })
        }else{
          Toast.info(message, 1);
        }
      } catch (error) {
        Log(error);
      }
    },

    // 成套家店推荐
    *hasProgram({ modelId, payload }, { call, put }) {
      try {
        const { productId } = payload;
        const channel = 1;
        const { success, message, data: programData } = yield call(GET, Config.API_URL + Config.HAS_PROGRAM, { productId, channel});
        if (success) {
          const hasProgram = programData;
          yield put(createIdAction('changeProgram')({ modelId, hasProgram}));
          return;
        } else {
          Toast.info(message, 1);
        }
      } catch (error) {
        Log(error);
      }
    },
    *sqzbsData({ modelId, payload }, { call, put }) {
      try {
        const { productId, storeId } = payload;
        const type = 2;
        const { success, message, data } = yield call(GET, URL.GET_IF_CIRCLEPAGE, { productId, storeId, type});
        if (success && data) {
          const sqzbsData = {
            showSQZBS: true,
            communityUrl: data,
          };
          yield put(createIdAction('esqzbsChange')({ modelId, sqzbsData}));
          return;
        } else if (!success) {
          Toast.info(message, 1);
        }
      } catch (error) {
        Log(error);
      }
    },

      //关闭弹窗
      *closeBaiTiaoModle({ modelId, payload }, { call, put }) {
          try {
              yield put(createIdAction('closeBaiTiao')({ modelId }));
          } catch (error) {
              Log(error);
          }
          },

    //  改变地址
    *changePlace({ modelId, payload }, { call, put, select, take }) {
      const goodsDetail = yield select(state => state.goodsDetail);
      const productId = goodsDetail.getIn([modelId, 'productId']);
      const memberId = goodsDetail.getIn([modelId, 'data', 'storeId']);
      const sku = goodsDetail.getIn([modelId, 'data', 'product', 'sku']);
      const number = goodsDetail.getIn([modelId, 'productInfo', 'number']);
      const { provinceId, cityId, regionId, streetId, pcrName, isFirstLoad } = payload;
      // 更新订单信息
      yield put(createIdAction('changeProductInfo')({
        modelId,
        location: { provinceId, cityId, regionId, streetId, pcrName },
      }));
      // 加载优惠信息
      yield put(createIdAction('loadingPreferential')({ modelId }));

      //加载O2O店铺信息
      // yield put(createIdAction('loadingO2OStoreInfo')({
      //   modelId, sku, provinceId, cityId, regionId, streetId,
      // }));
      // yield take('loadingO2OStoreInfo/@@end');
      // 加载O2O店铺信息 yl
      yield take('loadingPreferential/@@end');
      const nowGD = yield select(state => state.goodsDetail);
      const o2oStoreId = nowGD.getIn([modelId, 'O2OSData', 'o2oStoreId']);
      const O2OStoreName = nowGD.getIn([modelId, 'O2OSData', 'o2OStoreName']);
      const finalPrice = nowGD.getIn([modelId, 'data', 'product', 'finalPrice']);
      const hasStock = nowGD.getIn([modelId, 'pfData', 'hasStock']);
      // 更新订单信息
      yield put(createIdAction('changeProductInfo')({
        modelId,
        O2OStoreName,
        o2oStoreId,
      }));

      yield put(createIdAction('loadingGoodsCoupon')({
        modelId, sku, prodId: productId, number, finalPrice, memberId, o2oStoreId,
      }));

      // 店铺信息变化要重新商品规格参数
      yield put(createAction('loadingAttribute')({
        modelId, productId, storeId: o2oStoreId || '', sku: payload.sku,
      }));
      // 大数据埋点 yl
      let pre = ''; // 上一个路由
      const state = dvaStore.getState().router;
      if(state.routes[state.routes.length-2].routeName !='RootTabs'){
        pre = state.routes[state.routes.length-2].routeName;
      }else{
        pre = state.routes[state.routes.length-2].routes[state.routes[state.routes.length-2].index].routeName;
      }
      GetStatisticInfo('GoodsDetail', 'GoodsDetail', pre, {
        productId: productId,
        storeId: o2oStoreId,
        hasStock: hasStock,
        isFirstLoad: isFirstLoad,
      });

      // 小熊客服埋点 yl
      /**
      * 商品详情页轨迹标准接口
      * @param command 数组
              * @param title 商品详情页的名字
              * @param url 商品详情页的url
              * @param ref 上一页url(可选参数,没有就传"")
              * @param sellerid 商户id
      */
      NativeModules.XnengModule.NTalkerGoodsDetailAction(['商品详情', ('rn:#/productDetail/'+productId+'/'+(dvaStore.getState().goodsDetail.getIn([modelId, 'data','o2oType'])||'')+'//'+o2oStoreId+'/'), ('rn:#/'+pre), o2oStoreId]);
    },

    // 优惠详情
    *loadingPreferential({ modelId, payload }, { call, put, select }) {
      try {
        const goodsDetail = yield select(state => state.goodsDetail);
        console.log(JSON.parse(JSON.stringify(goodsDetail.getIn([modelId]))));
        const productId = goodsDetail.getIn([modelId, 'productId']);
        const productActivityDeposit = goodsDetail.getIn([modelId, 'data', 'productActivityDeposit']);
        const activityEndTime = goodsDetail.getIn([modelId, 'data', 'activityEndTime']);
        const memberId = goodsDetail.getIn([modelId, 'data', 'storeId']);
        const bookable = goodsDetail.getIn([modelId, 'data', 'product', 'bookable']);
        const productCatePath = goodsDetail.getIn([modelId, 'data', 'product', 'productCatePath']);
        const productFullName = goodsDetail.getIn([modelId, 'data', 'product', 'productFullName']);
        const sku = goodsDetail.getIn([modelId, 'data', 'product', 'sku']);
        const number = goodsDetail.getIn([modelId, 'productInfo', 'number']);
        const provinceId = goodsDetail.getIn([modelId, 'productInfo', 'location', 'provinceId']);
        const cityId = goodsDetail.getIn([modelId, 'productInfo', 'location', 'cityId']);
        const regionId = goodsDetail.getIn([modelId, 'productInfo', 'location', 'regionId']);
        const streetId = goodsDetail.getIn([modelId, 'productInfo', 'location', 'streetId']);
        const pcrName = goodsDetail.getIn([modelId, 'productInfo', 'location', 'pcrName'])||'';
        // const { data: pfData } = yield call(
        //   getDetailJSON,
        //   Config.GOODS_PREFERENTIAL,
        //   { sku, prodId: productId,  provinceId, cityId, regionId, streetId, memberId, pcrName, number },
        // );
        // 单品页库存接口 yl
        const { data: pfData }=  yield call(GET, URL.GOODS_CHECKSTOCK,{ sku, prodId: productId,  provinceId, cityId, regionId, streetId, memberId, pcrName:encodeURIComponent(pcrName),number});

        const { hasStock, isFlashsales, isAcReserve, acReserveType, flashsalesEndTime, acReserveEndTime, isActivityProduct, actualPrice ,stockNum} = pfData;
        let buyBtnType = GoodsBuyType.Buy;
        let isBooking = 0; // 是否预定
        /**
         *           弹窗      条件
         * 立即购买            上架 有货
         * 立即抢购            显示抢购活动 上架 有货
         * 
         * 马上预订            上架 无货 支持预定
         * 
         * 到货通知   有       上架 无货 不支持预定 toNotice
         * 开抢通知   有                         startNotice
         * 立即预约   有                         nowOrder
         * 
         * 马上抢购            上架 有货 
         */
        if (hasStock && !productActivityDeposit && !isFlashsales && !isAcReserve) { // 立即购买
          buyBtnType = GoodsBuyType.Buy;
        } else if (hasStock && !productActivityDeposit && isFlashsales) { //立即抢购
          buyBtnType = GoodsBuyType.Rush;
          pfData.activityEndTime = flashsalesEndTime;
        } else if (!hasStock &&  bookable && !productActivityDeposit && (!(isAcReserve && acReserveType === 1 ))) { //马上预定
          buyBtnType = GoodsBuyType.Book;
          isBooking = 1;
        } else if (!hasStock && !bookable && !productActivityDeposit && (!(isAcReserve && acReserveType === 1))) { //到货通知
          buyBtnType = GoodsBuyType.StockNoti;
        } else if (productActivityDeposit) { //开抢通知
          buyBtnType = GoodsBuyType.RushNoti;
        } else if (isAcReserve && acReserveType === 1 && !productActivityDeposit) { //立即预约
          buyBtnType = GoodsBuyType.Date;
          isBooking = 1;
          pfData.activityEndTime = acReserveEndTime;
        } else if ( hasStock && isAcReserve && acReserveType === 2 && !productActivityDeposit) { //马上抢购
          buyBtnType = GoodsBuyType.RushNow;
          pfData.activityEndTime = acReserveEndTime;
        }
        if (isActivityProduct) {
          pfData.activityEndTime = activityEndTime * 1000;
        }
        if (isFlashsales) {
          pfData.activityEndTime = flashsalesEndTime;
        }
        yield put(createIdAction('changeState')({
          modelId,
          pfData,
          uiState: { loadingPF: true, buyBtnType },
          productInfo: { 
            isBooking,
          },
          O2OSData: pfData.o2OStoreInfo  // 存储o2o店铺信息
        }));
        //更新服务承诺信息
        yield put(createIdAction('changeL')({
          modelId,
          pfData,
        }));
  
        // gio 校验库存埋点 yl
        const regionName =  pcrName.split(' ')[2];
        NativeModules.StatisticsModule.track('stockInfo', {
          productId: productId,
          productFirstName:'',
          hasStock: hasStock,
          ReceivingProvince: pcrName.split(' ')[0],
          ReceivingCity: pcrName.split(' ')[1]||'',
          ReceivingDistrict:regionName?regionName.substring(0,regionName.indexOf('/')):'',
          ReceivingStreet:regionName?regionName.substring(regionName.indexOf('/')+1):''
        });
         //baifend 埋点
         try{
          const cat = yield call(GET, URL.GET_PRODUCTCATENAME, {productCateIds:productCatePath});
          const {data: evaluateCount} =   yield call(GET, URL.GOODS_EVALUATE_COUNT+productId+'.json',{productId});
          if(cat.success){
            const params = {
              uid:memberId.toString(),
              del:false,
              name:productFullName,
              seller_lnk:"/"+productId+"/"+dvaStore.getState().goodsDetail.getIn([modelId, 'data','o2oType'])||''+"/"+dvaStore.getState().goodsDetail.getIn([modelId, 'data','fromType'])||''+"/"+memberId+"/",
              cmp:goodsDetail.getIn([modelId, 'data', 'product', 'productActivityInfo']) || '',
              typ:'shop',
              img:goodsDetail.getIn([modelId, 'data', 'product', 'defaultImageUrl']),
              memp:actualPrice,
              ratecnt:evaluateCount.totalNum,
              cat:cat.data,
              brd:goodsDetail.getIn([modelId, 'data', 'product', 'brandName']),
              stk:stockNum.toString()
            };
            NativeModules.BfendModule.onAddItem(sku,params);
          }
         } catch (error) {
          Log(error);
         }
        // Log(pfData);
      } catch (error) {
        Log(error);
        yield put(createIdAction('loadPFFinish')({ modelId: payload.modelId, loadingPF: false }));
      }
    },

    // O2O店铺
    // *loadingO2OStoreInfo({ modelId, payload }, { call, put, select }) {
    //   try {
    //     const { data: O2OStoreData  } = yield call(
    //       getDetailNoLoading,
    //       Config.GOODS_O2OSTORE_INFO,
    //       payload,
    //     );
    //     const { productId, sku } = payload;
    //     const O2OSData = O2OStoreData || { o2oStoreId : '' };
    //     yield put(createIdAction('changeState')({ modelId, O2OSData }));
    //   } catch (error) {
    //     Log(error);
    //   }
    // },

    // 商品规格参数
    *loadingAttribute({ payload: { modelId, productId, storeId, sku }  }, { call, put }) {
      try {
        // const { result } = yield call(
        //   getDetailNoLoading,
        //   Config.GOODS_IS_ATTRIBUTE,
        //   { productId, storeId },
        // );
        // 是否展示规格参数是否展示接口 yl
        const {result} = yield call(GET, URL.GOODS_IS_ATTRIBUTE, { productId, storeId })
        if (result) {
          // Log(result);
          // const { data: attData } = yield call(
          //   getDetailNoLoading,
          //   Config.GOODS_ATTRIBUTE,
          //   { productId, storeId, sku },
          // );
          // 商品规格参数 yl
          const { data: attData} = yield call(GET, URL.GOODS_ATTRIBUTE, { productId, storeId, sku })
          const speciesArray = [];
          const { sgAttribute, sgStoreAttribute } = attData;
          const sgAttributeArr = Object.keys(sgAttribute).map((key) => {
            const sgAkeyArr = sgAttribute[key];
            if (sgAkeyArr && sgAkeyArr.length > 0) {
              const [firstObj] = sgAkeyArr;
              const attItemArr = sgAkeyArr.map((attItem) => attItem.sgAttribute);
              speciesArray.push(firstObj.attrName);
              return { attrCode: key, attrName: firstObj.attrName, attItemArr };
            } else {
              return null;
            }
          });
          let hasStockSgItems = '';
          const hasStockSItem = [];
          const skkuArray = [];
          const attrArray = [];
          const sgAttributeMap = sgStoreAttribute.reduce((backResulte, item, index, array) => {
            const { attrIds, attrValueIds, num, skku} = item;
            const newkey = attrIds + ',' + attrValueIds;
            const attrIdsArr = attrIds.split(',');
            const attrValueIdsArr = attrValueIds.split(',');
            // const thisHasStockArr = attrIdsArr.map((ids, idx) => (attrValueIdsArr[idx]));
            if (num > 0) {
              skkuArray.push(skku);
              attrArray.push(attrValueIds);
              // hasStockSgItems.push(newkey);
              hasStockSItem.push(queue(attrValueIds.split(','), attrValueIds.split(',').length).join(','));
              hasStockSgItems =',' + hasStockSItem.join(',');
            }
            backResulte[skku] = item;
            return backResulte;
          }, {});
          yield put(createIdAction('changeAttData')({
            modelId,
            sgAttributeArr, // 属性
            sgAttributeMap, // 属性组合信息
            hasStockSgItems, // 用来判断是否可点击的数组
            attrArray,// 属性组合信息的完全拼配
            skkuArray,// 规格参数skku的组合
            speciesArray,//种类的存储
          }));
        }
      } catch (error) {
        Log(error);
      }
    },

    // 评价
    *loadingEvaluate({ modelId, payload }, { call, put, select }) {
      try {
        const { commentType, pageIndex } = payload;
        const goodsDetail = yield select(state => state.goodsDetail);
        let evaluateData = goodsDetail.getIn([modelId, 'evaluate', 'evaluateData']);
        const productId = goodsDetail.getIn([modelId, 'productId']);
        yield put(createIdAction('changeEvaluate')({ modelId, evaluateRefresh: true }));
        !evaluateData && (evaluateData = List());
        const { data: resultData } = yield call(
          getAppNoLoading,
          Config.GOODS_EVALUATE,
          {
            productId,
            ...payload,
          }, {}, true,
        );
        if (pageIndex === 1) {
          evaluateData = List();
        }
        evaluateData = evaluateData.push(...resultData);
        if (commentType === 'all' && pageIndex === 1) {
          const shortEvaluate = resultData && resultData.length > 0 ? resultData[0] : null;
          yield put(createIdAction('changeEvaluate')({ modelId, shortEvaluate }));
          yield put(createIdAction('loadEvaluateFinish')({ modelId, evaluateData, evaluateRefresh: false }));
        } else {
          yield put(createIdAction('loadEvaluateFinish')({ modelId, evaluateData, evaluateRefresh: false }));
        }
      } catch (error) {
        Log(error);
        yield put(createIdAction('changeEvaluate')({ modelId, evaluateRefresh: false }));
      }
    },

    // 评价条数 好评率
    *loadingEvaluateCount({ modelId, payload: { productId } }, { call, put }) {
      try {
        // const { data: evaluateCount } = yield call(getDetailNoLoading, `${Config.GOODS_EVALUATE_COUNT}${productId}.html`);
        //商品详情评价条数接口 yl
        const {data: evaluateCount} =   yield call(GET, URL.GOODS_EVALUATE_COUNT+productId+'.json',{productId})
        yield put(createIdAction('changeEvaluate')({ modelId, evaluateCount }));
      } catch (error) {
        Log(error);
      }
    },

    // 评价商品印象
    *loadingEvaluateAbstract({ modelId, payload: { productId } }, { call, put }) {
      try {
        const { data: evaluateAbstract } = yield call(getAppNoLoading, Config.GOODS_EVALUATE_ABSTRACT, { productId });
        const { data: evaluateImpressionArr } = yield call(getAppNoLoading, Config.GOODS_IMPRESSIONS, { productId });
        const evaluateImpression = evaluateImpressionArr.map(({ impressionName, labelNum }) => (
          { title: labelNum > 0 ? `${impressionName}(${labelNum})` : impressionName }
        ));
        yield put(createIdAction('changeEvaluate')({ modelId, evaluateAbstract, evaluateImpression }));
      } catch (error) {
        Log(error);
      }
    },
        // 硬装店铺门店信息
     *getStoreMsg({ modelId, payload }, { call, put, select}){
          try{
            const goodsDetail = yield select(state => state.goodsDetail);
            console.log(JSON.parse(JSON.stringify(goodsDetail.getIn([modelId])))) 
            console.log(goodsDetail)
               const s = goodsDetail.getIn([modelId, 'O2OSData', 'storeCode']);
               const c = goodsDetail.getIn([modelId, 'productInfo', 'location', 'cityId']);
                const {data:stroeMsgData}  = yield call(GET,Config.API_DETAIL_URL+'item/home/point.json',{s,c});
               yield put(createIdAction('changeState')({ modelId, productInfo: {
                stroeMsgData
              }}));
             
              
          }catch(err){
            Log(err);
          }
      },

    // 白条信息
    *loadingBaiTiao({ modelId, payload }, { call, put, select }) {
      try {
        // finalPrice
        let payAmt;
        const goodsDetail = yield select(state => state.goodsDetail);
        const productId = goodsDetail.getIn([modelId, 'productId']);
        const finalPrice = goodsDetail.getIn([modelId, 'pfData', 'finalPrice']);
        const isActivityProduct = goodsDetail.getIn([modelId, 'pfData', 'isActivityProduct']);
        const actualPrice = goodsDetail.getIn([modelId, 'pfData', 'actualPrice']);
        const proGroup = goodsDetail.getIn([modelId, 'data', 'product', 'department']);
        const sku = goodsDetail.getIn([modelId, 'data', 'product', 'sku']);
        const preCost = goodsDetail.getIn([modelId, 'baiTiao', 'costInfo']);
        const token = dvaStore.getState().users.accessToken;
        if (isActivityProduct) {
          payAmt = finalPrice;
        } else {
          payAmt = actualPrice;
        }
        if (preCost && preCost.size > 0) {
          yield put(createIdAction('changeState')({ modelId, baiTiao: { showBaitiao: true } }));
          return;
        }
        yield put(createIdAction('changeState')({ modelId, baiTiao: { isRefresh: true } }));
        const { data = {}, success } = yield call(getAppJSON, Config.GOODS_COST, {
          payAmt, proGroup, sku, token,
        });
        if (success) {
          const listData = [{ num: 0 }];
          const { costInfo, crdComAvailAmt, feeInfo } = data;
          listData.push(...costInfo);
          yield put(createIdAction('loadBaiTiaoFinish')({ modelId, costInfo: listData, crdComAvailAmt, feeInfo, isRefresh: false, showBaitiao: true }));
        }
      } catch (error) {
        Log(error);
        yield put(createIdAction('changeState')({ modelId, baiTiao: { isRefresh: false, showBaitiao: false } }));
      }
    },

    // 优惠券信息
    *loadingGoodsCoupon({ modelId, payload }, { call, put }) {
      try {
        const { data: { couponList } } = yield call(getAppNoLoading, Config.GOODS_COUPON, payload);
        yield put(createIdAction('changeState')({ modelId, productId: payload.prodId, couponList }));
      } catch (error) {
        Log(error);
      }
    },

    *pressProductAtt({ modelId, payload }, { call, put, select }) {
      try {
        const goodsDetail = yield select(state => state.goodsDetail);
        const preAttrValueMap = goodsDetail.getIn([modelId, 'productInfo', 'attrValueNames']);
        const number = goodsDetail.getIn([modelId, 'productInfo', 'number']);
        let skku = goodsDetail.getIn([modelId, 'productInfo', 'isChoseSkku']);
        let attrValueNames = '';
        for (let key in payload) {
          if (payload[key].id) {
            attrValueNames = preAttrValueMap.merge(payload);
          } else {
            attrValueNames = preAttrValueMap.delete(key);
          }
        }
        let keyName = '';
        let valueName = '';
        let attrValueName = [];
        let speciesAIndex = [];
        let productAttInfoMap = '';
        attrValueNames.map((value, key) => {
          if (value && value.get('id')) {
            keyName = keyName + key + ',';
            valueName = valueName + value.get('id') + ',';
          }
        });
        for (let key in attrValueNames.toJS()) {
          attrValueName.push(attrValueNames.toJS()[key].attrValueName);
          speciesAIndex.push(attrValueNames.toJS()[key].indexAVN);
        }
        let keyValue = (keyName + valueName);
        keyValue = keyValue.substring(0, keyValue.length - 1);
        if (skku && skku.isChoseSkku.isChoseSkku) {
          productAttInfoMap = goodsDetail.getIn([modelId, 'attData', 'sgAttributeMap', skku.isChoseSkku.isChoseSkku]) || Map({ });
        }else{
          productAttInfoMap = goodsDetail.getIn([modelId, 'attData', 'sgAttributeMap', undefined]) || Map({});
        }
        const productAttInfo = productAttInfoMap.merge(
          { attrValueName: attrValueName.join(',')},
          { speciesAIndex: speciesAIndex },
      );
        const stockNum = productAttInfo.get('num') || 1;
        let productNumber = Math.max(number, 1);
        productNumber = Math.min(productNumber, stockNum);

          yield put(createIdAction('changeProductAtt')({ modelId, attrValueNames, productAttInfo, number: productNumber}));
      } catch (error) {
        Log(error);
      }
    },

    *pressProductAttrSkku({ modelId, payload }, { call, put, select }) {
      try {
        const isChoseSkku = payload || '';//用来存储选择完毕的skku的值（产品唯一标识）
        yield put(createIdAction('changeProductAttSkku')({ modelId, isChoseSkku }));
      } catch (error) {
        Log(error);
      }
    },

    // 收藏
    *collection({ modelId, payload: { beCollected } }, { call, put, select }) {
      if (!isLogin()) { return; }
      const goodsDetail = yield select(state => state.goodsDetail);
      const productId = goodsDetail.getIn([modelId, 'productId']);
      const productName = goodsDetail.getIn([modelId, 'data', 'product', 'productFullName']);
      const sku = goodsDetail.getIn([modelId, 'data', 'product', 'sku']);
      const imageUrl = goodsDetail.getIn([modelId, 'data', 'swiperImgs', 0]);
      const PCGName = goodsDetail.getIn([modelId, 'productInfo', 'location', 'pcrName']);

      const url = beCollected ? Config.GOODS_CANCELCOLLECTION : Config.GOODS_COLLECTION;
      const formData = beCollected ? { productId } : { productId, productName, imageUrl, sku, PCGName, beCollected };
      try {
        const { success: collectionResult, data } = yield call(postAppForm, url, formData);
        if (collectionResult) {
          if (data === 'SUCCESS') {
            Toast.show(beCollected ? '取消收藏成功' : '收藏成功', 1);
            yield put(createIdAction('loadingFinish')({ modelId, data: { isCollected: beCollected ? 0 : 1 } }));
            if(!beCollected){
                NativeModules.BfendModule.onEvent("onAddFav",{
                  uid:dvaStore.getState().users.mid.toString() || '',
                  iid:sku,
                });
            }
          } else {
            Toast.show(data);
          }
        }
      } catch (error) {
        Log(error);
      }
    },

    // 加入购物车
    *addCart({ modelId }, { call, put, select, take }) {
      // if (!isLogin()) { return; }
      try {
        let valiNum = true;
        const { data: { carts } } = yield call(getAppJSON, 'v3/h5/cart/list.html', 
        {}, {}, true);

        const address = yield select(state => state.address);
        const goodsDetail = yield select(state => state.goodsDetail);
        const productId = goodsDetail.getIn([modelId, 'productId']) || '';
        const speciesArray = goodsDetail.getIn([modelId, 'attData', 'speciesArray']);
        const speciesAIndex = goodsDetail.getIn([modelId, 'productInfo', 'productAttInfo', 'speciesAIndex']);
        const showCountType = goodsDetail.getIn([modelId, 'uiState', 'showCountType']);
        const o2oAttrId = goodsDetail.getIn([modelId, 'O2OSData', 'o2oStoreId']) || '';
        const o2omap = goodsDetail.getIn([modelId, 'productInfo', 'o2omap']) || '';
        const o2oStoreName = goodsDetail.getIn([modelId, 'productInfo', 'o2oStoreName']) || '';
        const sku = goodsDetail.getIn([modelId, 'data', 'product', 'sku']) || '';
        const actualPrice = goodsDetail.getIn([modelId, 'pfData', 'actualPrice']);
        const number = goodsDetail.getIn([modelId, 'productInfo', 'number']) || '';
        const attData = goodsDetail.getIn([modelId, 'attData']) || '';
        let skku = goodsDetail.getIn([modelId, 'productInfo', 'isChoseSkku'])||'';
        const attrValueNames = goodsDetail.getIn([modelId, 'productInfo', 'productAttInfo', 'attrValueName']) || '';
        const buyBtnType = goodsDetail.getIn([modelId, 'uiState', 'buyBtnType']);

        const stockType = goodsDetail.getIn([modelId, 'pfData', 'stockType']);
        const memberId = goodsDetail.getIn([modelId, 'data', 'storeId']);
        const streetId = goodsDetail.getIn([modelId, 'productInfo', 'location', 'streetId']);
        const regionId = goodsDetail.getIn([modelId, 'productInfo', 'location', 'regionId']);
        const o2oStoreId = goodsDetail.getIn([modelId, 'productInfo', 'o2oStoreId']);
        const storeCode = goodsDetail.getIn([modelId, 'O2OSData', 'storeCode']);
        const stockNum=goodsDetail.getIn([modelId, 'pfData', 'stockNum'])
        //购物车同个商品最大数量到100
        if (carts && carts.length > 0) {
          carts.forEach(function(v,k) { 
            if(v.productId && v.productId === productId){
              if (v.number + number > Math.min(100, stockNum)){
                return valiNum = false;
              }
            }
          });
        }
          // 校验库存
          let params = {
            stockType: stockType,
            productId,
            memberId,
            number,
            streetId,
          };
          if (stockType == 'WA') {
            params = Object.assign(params, {
              regionId
            });
          } else if (stockType == 'O2O') {
            params = Object.assign(params, {
              o2oStoreId,
              storeCode,
            });
          }

        if (attData) { //有规格参数的商品
          if (skku && skku.isChoseSkku.isChoseSkku) { //选择了多属性
            skku = skku.isChoseSkku.isChoseSkku;
            params = Object.assign(params, {
              sku: skku
            });
          } else {
            if (showCountType === CountStyleType.None) {
              yield put(createIdAction('changeUIState')({ modelId, showCountType: CountStyleType.AddCart }));
              return;
            } else {
              let toastMessage = '';
              let speciesDataA = speciesArray.toJS();
              let speciesDataI = speciesAIndex && speciesAIndex.toJS();
              if (speciesArray){
                toastMessage = speciesDataA.join(',');
              }
              if (speciesArray && speciesAIndex){
                for (let a = 0; a < speciesDataI.length; a++){
                  speciesDataA.remove(speciesDataI[a]);
                } 
                toastMessage = speciesDataA.join(',');
              }
              Alert.alert(
                '',
                `请选择: ${toastMessage}`,
                [
                  { text: '确定' },
                ],
                { cancelable: true },
              );
              return;
            }
          }
        }
        if (!valiNum) {
          Toast.show(`最多购买${Math.min(100, stockNum)}件`);
          return;
        }
        const rs = yield call(GET, URL.CHECKSTOCKFORNUM, params);
        if (rs.data.hasStock) { // 有货
          const { success } = yield call(
            getAppJSON,
            Config.GOODS_ADDCART,
            { productId, sku, o2oAttrId, attrValueNames, o2omap, number, skku, o2oStoreName, streetId: streetId },
          );
          if (success) {
            yield put(createIdAction('changeUIState')({ modelId, showCountType: CountStyleType.None }));
            yield put(createAction('cartModel/fetchCartList')());
            yield take('cartModel/fetchCartList/@@end');
            Toast.show('加入购物车成功', 1);

            // gio 进入单品页埋点 yl
            NativeModules.StatisticsModule.track('ScAdd', {
              productId: productId,
              productFirstName: '',
              productSecondName: '',
              o2oType: dvaStore.getState().goodsDetail.getIn([modelId, 'data','o2oType'])||'',
              storeId: dvaStore.getState().goodsDetail.getIn([modelId, 'O2OSData','o2oStoreId'])||''
            });
            NativeModules.BfendModule.onAddCart([sku,actualPrice,number],{uid:memberId.toString() || ''});
          }            
        }else{
          Alert.alert(
            '',
            '库存不足',
            [
              { text: '确定' },
            ],
            { cancelable: true },
          );
          }
      } catch (error) {
        Log(error);
      }
    },

    // 预约通知
    *notifyMe({ modelId, payload: { productId, mobile } }, { call, put, select }) {
      try {
        if (!(mobileNumberRegExp.test(mobile))) {
          Toast.info('请输入正确的手机号码！', 1);
          return;
        }

        const goodsDetail = yield select(state => state.goodsDetail);
        const o2oAttrId = goodsDetail.getIn([modelId, 'productInfo', 'o2oAttrId']);
        const sku = goodsDetail.getIn([modelId, 'data', 'product', 'sku']);
        const number = goodsDetail.getIn([modelId, 'productInfo', 'number']);
        const provinceId = goodsDetail.getIn([modelId, 'productInfo', 'location', 'provinceId']);
        const cityId = goodsDetail.getIn([modelId, 'productInfo', 'location', 'cityId']);
        const regionId = goodsDetail.getIn([modelId, 'productInfo', 'location', 'regionId']);
        const streetId = goodsDetail.getIn([modelId, 'productInfo', 'location', 'streetId']);
        const productName = goodsDetail.getIn([modelId, 'data', 'product', 'productFullName']);

        const { success } = yield call(getAppJSON, Config.GOODS_NOTIFY, {
          productId,
          mobile,
          provinceId,
          cityId,
          areaId: regionId,
          streetId,
          sku,
          productName,
          o2oStoreId: o2oAttrId,
        });
        if (success) {
          Toast.show('设置成功');
        } else {
          Toast.show('网络错误');
        }
      } catch (error) {
        Log(error);
      }
    },

    // 到货通知
    *arrivalNotice({ modelId, payload: { productId, mobile } }, { call, put, select }) {
      try {
        if (!(mobileNumberRegExp.test(mobile))) {
          Toast.info('请输入正确的手机号码！', 1);
          return;
        }
        const goodsDetail = yield select(state => state.goodsDetail);
        const o2oStoreId = goodsDetail.getIn([modelId, 'O2OSData', 'o2oStoreId']);
        const sku = goodsDetail.getIn([modelId, 'data', 'product', 'sku']);
        const productFullName = goodsDetail.getIn([modelId, 'data', 'product', 'productFullName']);
        const provinceId = goodsDetail.getIn([modelId, 'productInfo', 'location', 'provinceId']);
        const cityId = goodsDetail.getIn([modelId, 'productInfo', 'location', 'cityId']);
        const areaId = goodsDetail.getIn([modelId, 'productInfo', 'location', 'regionId']);
        const streetId = goodsDetail.getIn([modelId, 'productInfo', 'location', 'streetId']);
        const pcrName = goodsDetail.getIn([modelId, 'productInfo', 'location', 'pcrName']);
        const provinceName = pcrName ? pcrName.split(' ')[0] : '';
        const cityName = pcrName ? pcrName.split(' ')[1] : '';
        const areaName = pcrName ? pcrName.split(' ')[2] : '';

        const productName = goodsDetail.getIn([modelId, 'data', 'product', 'productFullName']);

        const { result } = yield call(getAppJSON, Config.GOODS_CHECKONLY, {
          productId, mobile, provinceId, cityId, areaId, streetId,
        });
        if (result === 0) {
          const { success } = yield call(getAppJSON, Config.GOODS_NOTIFY, {
            productId,
            mobile,
            provinceId,
            cityId,
            areaId,
            streetId,
            sku,
            productName: productFullName,
            provinceName,
            cityName,
            areaName,
            o2oStoreId,
          },{},false, Config.API_DETAIL_URL);
          if (success) {
            Toast.show('您的资料已经提交，到货后我们会第一时间通知您！');
          }
        } else {
          Toast.show('该手机号在该地区已经申请到货通知，不能重复申请！');
        }
      } catch (error) {
        Log(error);
      }
    },

    *checkOrder({ modelId, payload }, { call, put, select }) {
      try {
        if (!dvaStore.getState().users.isLogin) {
          yield put(createIdAction('changeUIState')({ modelId, showCountType: CountStyleType.None }));
          yield put(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'Login', params: {} }));
          return;
        }
        const goodsDetail = yield select(state => state.goodsDetail);
        const productId = goodsDetail.getIn([modelId, 'productId']);
        const acReserveId = goodsDetail.getIn([modelId, 'pfData', 'acReserveId']);

        const { success, data } = yield call(getAppJSON, Config.GOODS_CHECK_RES, { acReserveId, productId });
        if (data && success) {
          yield put(createIdAction('changeUIState')({ modelId, showOrder: true }));
        }
      } catch (error) {
        Log(error);
      }
    },

    *orderGoods({ modelId, payload }, { call, put, select }) {
      try {
        const { mobile, vertifyStr } = payload;
        const goodsDetail = yield select(state => state.goodsDetail);
        const productId = goodsDetail.getIn([modelId, 'productId']);
        const acReserveId = goodsDetail.getIn([modelId, 'pfData', 'acReserveId']);
        const provinceId = goodsDetail.getIn([modelId, 'productInfo', 'location', 'provinceId']);
        const cityId = goodsDetail.getIn([modelId, 'productInfo', 'location', 'cityId']);
        const districtId = goodsDetail.getIn([modelId, 'productInfo', 'location', 'regionId']);
        const streetId = goodsDetail.getIn([modelId, 'productInfo', 'location', 'streetId']);

        const { success, data } = yield call(getAppJSON, Config.GOODS_SENDRES, {
          acReserveId, productId, mobile, mobileCode: vertifyStr,
          provinceId, cityId, districtId, streetId,
        });
        if (success && data) {
          yield put(createIdAction('changeUIState')({ modelId, showOrder: false }));
          Toast.show('商品预约成功，可在个人中心-我的预约中查看预约商品');
          return;
        }
        yield put(createIdAction('changeUIState')({ modelId, showOrder: false }));
      } catch (error) {
        Log(error);
      }
    },
    // 立即购买的校验 yl
    *checkStockForNum({ modelId, payload }, { call, put, select }) {
      try {
        const { modelId} = payload;
        // 判断是否登录 
        if (!dvaStore.getState().users.isLogin) {
            yield put(createIdAction('changeUIState')({ modelId, showCountType: CountStyleType.None }));
            yield put(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'Login', params: { } }));
            return
          }
        const goodsDetail = yield select(state => state.goodsDetail);
        const number = goodsDetail.getIn([modelId, 'productInfo', 'number']);
        if (number>100){
          Toast.show('最多购买100件');
          return;
        }
        const productId = goodsDetail.getIn([modelId, 'productId']);
        const buyBtnType = goodsDetail.getIn([modelId, 'uiState', 'buyBtnType']);
  
        const stockType = goodsDetail.getIn([modelId, 'pfData','stockType']);
        const memberId = goodsDetail.getIn([modelId, 'data', 'storeId']);
        const streetId = goodsDetail.getIn([modelId, 'productInfo', 'location', 'streetId']);
        const regionId = goodsDetail.getIn([modelId, 'productInfo', 'location', 'regionId']);
        const o2oStoreId = goodsDetail.getIn([modelId, 'productInfo', 'o2oStoreId']);
        const storeCode = goodsDetail.getIn([modelId, 'O2OSData', 'storeCode']);
        const showCountType = goodsDetail.getIn([modelId, 'uiState', 'showCountType']);
        
        const attData = goodsDetail.getIn([modelId, 'attData']);
        const attrValueNames = goodsDetail.getIn([modelId, 'productInfo', 'productAttInfo', 'attrValueName']);
        const skku = goodsDetail.getIn([modelId, 'productInfo', 'isChoseSkku']);
        const speciesArray = goodsDetail.getIn([modelId, 'attData', 'speciesArray']);
        const speciesAIndex = goodsDetail.getIn([modelId, 'productInfo', 'productAttInfo', 'speciesAIndex']);
         // 调转到订单填写页面所需参数  yl
         let orderInitParams = {};
        if (attData &&skku && skku.isChoseSkku.isChoseSkku) {
            orderInitParams = {
            "proList": [{
                "proId": productId,
                "num": number,
                'sku': skku.isChoseSkku.isChoseSkku,
                'name': attrValueNames
            }],
            "street": streetId
            }
        } else {
            orderInitParams = {
            "proList": [{
                "proId": productId,
                "num": number,
            }],
            "street": streetId
            }
        }
        // Buy立即购买  Rush立即抢购  RushNow马上抢购  需要校验库存
        if(buyBtnType == 0 || buyBtnType == 1 || buyBtnType == 6){
          // 立即购买校验接口存在 yl
          let params = {
            stockType: stockType,
            productId,
            memberId,
            number,
            streetId,
          };
          if(stockType == 'WA'){
            params = Object.assign(params, {
              regionId
            });
          }else if(stockType == 'O2O'){
            params = Object.assign(params, {
                o2oStoreId,
                storeCode,
            });
          }
          if(attData){ //有规格参数的商品
            if (skku&&skku.isChoseSkku.isChoseSkku){ //选择了多属性
              params = Object.assign(params, {
                sku: skku.isChoseSkku.isChoseSkku
              });
            }else{
                if(showCountType === CountStyleType.None) {
                  yield put(createIdAction('changeUIState')({ modelId, showCountType: CountStyleType.BuyNow }));
                  return;
                } else {
                  let toastMessage = '';
                  let speciesDataA = speciesArray.toJS();
                  let speciesDataI = speciesAIndex && speciesAIndex.toJS();
                  if (speciesArray) {
                    toastMessage = speciesDataA.join(',');
                  }
                  if (speciesArray && speciesAIndex) {
                    for (let a = 0; a < speciesDataI.length; a++) {
                      speciesDataA.remove(speciesDataI[a]);
                    }
                    toastMessage = speciesDataA.join(',');
                  }
                  Alert.alert(
                    '',
                    `请选择: ${toastMessage}`,
                    [
                      { text: '确定' },
                    ],
                    { cancelable: true },
                  );
                  return;
                }
            }
          }
          const rs = yield call(GET, URL.CHECKSTOCKFORNUM,params);
          if (rs.data.hasStock) { // 有货
            // gio 埋点 yl
            NativeModules.StatisticsModule.track('BuyNow', {
              productId: productId,
              productFirstName: '',
              productSecondName: '',
              o2oType: goodsDetail.getIn([modelId, 'data','o2oType'])||'',
              storeId: goodsDetail.getIn([modelId, 'productInfo', 'o2oStoreId'])||''
            });
            yield put(createAction('order/putPageInfo')({ modelId, orderInitParams })) 
          }else{
            Alert.alert(
              '',
              '库存不足',
              [
                { text: '确定' },
              ],
              { cancelable: true },
            );
          }
        }else{
          // gio 埋点 yl
          NativeModules.StatisticsModule.track('BuyNow', {
            productId: productId,
            productFirstName: '',
            productSecondName: '',
            o2oType: goodsDetail.getIn([modelId, 'data','o2oType'])||'',
            storeId: goodsDetail.getIn([modelId, 'productInfo', 'o2oStoreId'])||''
          });
          yield put(createAction('order/putPageInfo')({ modelId, orderInitParams })) 
        }

      } catch (error) {
        Log(error);
      }
    },
    // 显示分享二维码
    *showShareImg({ modelId, payload }, { call, put }) {
      try {
        const { productId, storeId } = payload;
        const { data: shareImg, success } = yield call(getDetailJSON, Config.GOODS_SHAREEWM, payload);
        Log(shareImg, success);
        if (success && shareImg) {
          yield put(createIdAction('changeUIState')({ modelId, goodsShare: { shareImg, shareVisible: true } }));
        }
      } catch (error) {
        Log(error);
      }
    },

    // 保存到手机
    *saveShareImg({ modelId, payload: { productId, shareImg } }, { call, put }) {
      yield put(createIdAction('changeUIState')({ modelId, goodsShare: { shareVisible: false } }));
      yield call(saveImg, shareImg);
    },
  },
};