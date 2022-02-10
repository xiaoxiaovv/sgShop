import L from 'lodash';
import {action, createAction, NavigationActions, getPrevRouteName} from "./../utils";
import {CrowdFundingService, LocalSpecialtyService} from './../service';
import {List, fromJS} from "immutable";

const initState = {
  acReserveList: List(),//新品预约列表
  preSaleList: List(),//预售商品

  topBanner: [],
  others: [],

  NCrowdFunding: { //众筹
    zcold: [],
    zcnow: [],
    zcpre: []
  },


  bannerList: [],
  recommendList: [],
  productList: [],

  crowdDetail: {},//众筹详情数据
  zstallsSinglePageViews: [],//众筹我要去支持的列表数据
  limit: 1,// 众筹选择档位 限制的数量
  num:0,//还剩余数量
  showModal: false,//下部弹出框是否打开
  currentSingle: {},//众筹选择档位 去支持

  orderPageInfo: {},//填写订单页数据
  invoiceType: 2,//2普通，1增值税发票
  billCompany: '',//发票名称

  memberName: '',//收货地址 姓名
  memberId: 111,
  mobile: 11111,//收货地址 手机号
  regionName: '',//收货地址 地区名
  address: '',//收货地址 地址名
  orderSn: '',//返回的订单号
};

export default {
  namespace: 'CrowdFundingModel',
  state: initState,
  reducers: {
    save(state, {payload}) {
      return {...state, ...payload};
    }
  },
  subscriptions: {},
  effects: {
    * getCrowdFundingBanner(_, {all, call, put, select}) {
      try {
        // const routerName = getPrevRouteName();
        // const from = 1;
        // if(routerName == 'LocalSpecialty'){
        //   from = 2;
        // }
        let index = yield call(CrowdFundingService.getCrowdFundingBanner, {type: 1});
        const success = L.get(index, 'success', false);
        const data = L.get(index, 'data', false);
        if (success && data) {
          const topBanner = L.get(data, 'topBanner', []);
          const others = L.get(data, 'others', []);
          yield put(action("save", {topBanner, others}));
        }
      } catch (e) {
        console.log(e)
      }
    },
    * getCrowdFundingPreSale({payload: {pageIndex, pageSize}}, {all, call, put}) {
      try {

        const res = yield call(CrowdFundingService.getCrowdFundingPreSale, {pageIndex, pageSize});
        if (res && res.success) {
          yield put(action("save", {preSaleList: fromJS(res.data)}));
        }
      } catch (e) {
        console.log(e)
      }
    },
    * getSuccessZactivitys({payload: {from}}, {all, call, put, select}) {
      try {
        // 众筹
        let result = yield call(LocalSpecialtyService.getCrowdData, {from: from});
        const suc = L.get(result, 'success', false);
        const ret = L.get(result, 'data', false);
        if (suc && ret) {
          if (ret.zActivityBeginningList.length != 0 || ret.zActivitySuccessList.length != 0 || ret.zActivityToBeginList.length != 0) {
            let zcold = ret.zActivitySuccessList;
            let zcnow = ret.zActivityBeginningList;
            let zcpre = ret.zActivityToBeginList;
            yield put(action('save', {
              NCrowdFunding: {zcold, zcnow, zcpre}
            }))
          } else {
            yield put(action('save', {
              NCrowdFunding: {zcold: [], zcnow: [], zcpre: []}
            }))
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    * getCrowdFundingReserve({payload: {pageIndex, pageSize, from}}, {all, call, put, select}) {
      try {

        const address = yield select(state => state.address);
        const streetId = address.streetId;
        const districtId = address.areaId;
        const cityId = address.cityId;
        const provinceId = address.provinceId;
        // provinceId=16&cityId=173&districtId=2450&streetId=12036596&pageIndex=1&from=1
        const res = yield call(CrowdFundingService.getCrowdFundingReserve, {
          provinceId,
          cityId,
          districtId,
          streetId,
          pageIndex,
          from,
          pageSize
        });
        if (res && res.success) {
          yield put(action("save", {acReserveList: fromJS(res.data.acReserveList)}));
        }
      } catch (e) {
        console.log(e)
      }
    },
    * getCrowdFundingIndex({payload: {type, page, from}}, {all, call, put, select}) { //众筹首页
      try {
        let index = yield call(CrowdFundingService.getCrowdFundingIndex, {from: from});
        const success = L.get(index, 'success', false);
        const data = L.get(index, 'data', false);
        console.log(data)
        if (success && data) {
          const bannerList = L.get(data, 'zBannerList');
          const recommendList = L.get(data, 'top3ZActivity');
          yield put(action("save", {bannerList, recommendList}));
        }
      } catch (e) {
        console.log(e)
      }
    },
    * getCrowdFundingList({payload: {type, page, from}}, {all, call, put, select}) {
      try {
        let index = yield call(CrowdFundingService.getCrowdFundingList, {type, page, from});
        const success = L.get(index, 'success', false);
        const data = L.get(index, 'data', false);
        if (success && data) {
          // const topBanner = L.get(data, 'zBannerList', []);
          // const others = L.get(data, 'top3ZActivity', []);
          // yield put(action("save", {topBanner, others}));
        }
      } catch (e) {
        console.log(e)
      }
    },
    /**
     * 获取众筹详情
     */* getCrowdFundingDetail({payload: {zActivityId}}, {call, put}) {
      try {
        const res = yield call(CrowdFundingService.getCrowdFundingDetail, {zActivityId});
        if (res && res.success) {
          yield put(action("save", {crowdDetail: res.data}));
        }
      } catch (e) {
        console.log(e)
      }
    },
    /**
     * 获取档位列表
     */* getZActivitySinglePage({payload: {zActivityId}}, {call, put}) {
      try {
        const res = yield call(CrowdFundingService.getZActivitySinglePage, {zActivityId});
        if (res && res.success) {
          yield put(action("save", {zstallsSinglePageViews: res.data.zstallsSinglePageViews}));
        }
      } catch (e) {
        console.log(e)
      }
    },
    /**
     * 获取支持的限购数量,更新弹出框的内容信息，显示modal
     */* getZhongchouCheck({payload: {zStallsId, currentSingle}}, {call, put}) {
      try {
        const res = yield call(CrowdFundingService.getZhongchouCheck, {zStallsId, currentSingle});
        if (res && res.success) {
          yield put(action("save", {limit: res.data.limit,num:res.data.num, currentSingle: currentSingle, showModal: true}));
        }
      } catch (e) {
        console.log(e)
      }
    },
    /**
     * 关闭弹出框，并初始化信息
     */* closeModal({payload}, {call, put}) {
      try {
        console.log('save  closeModal',)
        yield put(action("save", {limit: 1, currentSingle: {}, showModal: false}));
      } catch (e) {
        console.log(e)
      }
    },
    /**
     * 获取填写订单页面 数据信息
     */* getOrderPageInfo({payload: {number, zStallsId}}, {call, put}) {
      try {
        const res = yield call(CrowdFundingService.getOrderPageInfo, {number, zStallsId});
        if (res && res.success) {
          const memberAddress = res.data.memberAddress;
          yield put(action("save", {
            orderPageInfo: res.data,
            invoiceType: res.data.invoiceType,
            billCompany: res.data.billCompany,
            memberName: memberAddress.consignee,
            memberId: memberAddress.memberId,
            mobile: memberAddress.mobile,
            regionName: memberAddress.regionName,
            address: memberAddress.address,
          }))
        }
      } catch (e) {
        console.log(e)
      }
    },
    /**
     * 改变收货地址
     */* saveAddress({payload: {memberName, mobile, regionName, address}}, {call, put}) {
      try {
        yield put(action("save", {
          memberName: memberName,
          mobile: mobile,
          regionName: regionName,
          address: address,
        }));
      } catch (e) {
        console.log(e)
      }
    },
    /**
     * 确认订单，生成订单号
     */* submitOrder({payload: {invoiceType, number, sharePeopleId, zStallsId}}, {call, put}) {
      try {
        const res = yield call(CrowdFundingService.submitOrder, {invoiceType, number, sharePeopleId, zStallsId});
        if (res && res.success) {
          yield put(action("save", {orderSn: res.data,}))
        }
      } catch (e) {
        console.log(e)
      }
    },
    /**
     * 改变当前的订单的 发票信息
     */* changeInvoice({payload: {invoiceType, billCompany,}}, {call, put}) {
      try {
        yield put(action("save", {invoiceType, billCompany}))
      } catch (e) {
        console.log(e)
      }
    }


  }
}
