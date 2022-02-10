import { postAppJSON, getAppJSON, postAppForm } from '../netWork';
import { createAction, createIdAction, isLogin, IS_NOTNIL } from '../utils/index';

import { NavigationActions } from 'react-navigation';

import { IProductInfo } from '../interface';
import { accAdd, accMul, accSub } from '../utils/MathTools';
import { Toast } from 'antd-mobile';
import { Alert, DeviceEventEmitter, NativeModules } from 'react-native';
import { CountStyleType } from '../containers/GoodsDetail/Goods/CountStyle';
import URL from '../config/url';
import { GET, POST_JSON, GET_P, POST_FORM } from '../config/Http';
import Message from '../components/Message/index';
import Config from 'react-native-config';
import url from '../config/url';


// 数据json格式化
let formatComponentData = (data = [], callback) => {
    let arr = [];
    if (data && data.length) {
        // console.log(data)
        data.map((o, i) => {
            arr.push(
                callback(o)
            );
        });
        return arr;
    }
};
let formatComponentDataToJson = (data = [], callback) => {
    let json = {};
    if (data && data.length) {
        // console.log(data)
        data.map((o, i) => {
            json = Object.assign(json, callback(o))
        });
        return json;
    }
};
interface IOrder {
    pageInfo: any;
    productInfo: IProductInfo;
}
function initPoint(payAmount, mitem, standardPrice): any {
    //standardPrice  除去优惠后的基准金额
    if(standardPrice){ //点击切换按钮时
        let canUsePoint = 0;
        let pointDiscount = 0;
        if(payAmount >= mitem.pointDiscount){ // 最新价大于可用限额
            payAmount = standardPrice;
            // 当前总价
            canUsePoint = 0;
            // 当前打折金额
            pointDiscount = accMul(payAmount, mitem.quota);
            if (pointDiscount > payAmount) {
                pointDiscount = payAmount;
            }
            // 取整数
            canUsePoint = Math.floor(accMul(pointDiscount, mitem.proportion));
            pointDiscount = canUsePoint / mitem.proportion;
            if (canUsePoint > mitem.count) {
                // 可用积分大于总积分，取总积分，并重新计算抵扣金额
                canUsePoint = mitem.count;
                pointDiscount = canUsePoint / mitem.proportion;
            }
        }else{
            pointDiscount =mitem.benefitType == 'diamond'?Math.floor(payAmount): payAmount; // 钻石要向下取整数

            canUsePoint = Math.floor(accMul(pointDiscount, mitem.proportion)); //由抵扣计算出可用   
            pointDiscount = canUsePoint / mitem.proportion; // 再用可用计算抵扣， 以防止可用有小数 取整后   可用和抵扣不统一的bug   yl
            if (canUsePoint > mitem.count) {
                // 可用积分大于总积分，取总积分，并重新计算抵扣金额
                canUsePoint = mitem.count;
                pointDiscount = canUsePoint / mitem.proportion;
            }
        }
        const item = { canUsePoint, pointDiscount, isSelected: false };
        return { ...item };
    }else{//初始化
        // 当前总价
        let canUsePoint = 0;
        // 当前打折金额
        let pointDiscount = accMul(payAmount, mitem.quota);
        if (pointDiscount > payAmount) {
            pointDiscount = payAmount;
        }
        // 取整数
        canUsePoint = Math.floor(accMul(pointDiscount, mitem.proportion));
        pointDiscount = canUsePoint / mitem.proportion;
        if (canUsePoint > mitem.count) {
            // 可用积分大于总积分，取总积分，并重新计算抵扣金额
            canUsePoint = mitem.count;
            pointDiscount = canUsePoint / mitem.proportion;
        }
        const item = { canUsePoint, pointDiscount, isSelected: false };
        return { ...item };
    }
}

const initState = {
    standardDeliveryDate: '',
    deliveryWay: [],
    giftCardNumber: '请输入礼品卡券',
    pageInfo: {
        commodityAmount: 0,
        o2oStore: {},
        mid:'',
        ordersCommitWrapM: {
            benefitList: [],
            orderProductList: [{ productId: 'init', orderPromotionAmount: 0, couponCode: null }], // 初的始值  防止地址新增崩溃
            invoiceType: '',
            billCompany: '',
            memberInvoices: {
                invoiceTitle: '',
            },
            order: {
                couponCodeValue: 0,
                couponCode: null,
            },
            payList: [],
        },
        hbData: {}, //赠品包商品
    },
    submitOrder: {},
    payInfo: { orders: { orderAmount: 0 } },
    price: {// 每件商品的小计 信息
        productSmallPrice: [],
        // 使用钻石、积分 数组
        newBenefit: [],
        // 订单总金额
        commodityAmount: 0,
        // 优惠后的订单总金额
        newprice: 0,
        // 通用优惠券 使用金额
        couponCodeValue: 0,
        // 是否可用优惠券
        canUsecoupon: false,
        // 店铺优惠券总金额
        StoreCouponCodeValue: 0,
        // 是否使用钻石
        diamondStatus: false,
        // 是否使用积分
        jifenStatus: false,
        // 是否使用金币
        jinbiStatus: false,
        // 下单满减
        itemShareAmount: 0,
    },
    isRefreshFlag: false,
    giftsList:[],//赠品
    productInfoList:[],
};
export const submAlipay = async () => {
    // 银联支付宝支付请求接口
    // try {
    //     const { order: { payInfo: { orders: { orderSn } } } } = dvaStore.getState();
    //     // 银联支付宝支付数据请求接口: URL.UNIONPAYREQUEST
    //     const json = await GET(URL.UNIONPAYREQUEST, {
    //         orderSn,
    //         type: 'APP',
    //         callback: 'NOT_CALLBACK',
    //     });
    //     return json;
    // } catch (error) {
    //     Log('输出error' + error);
    // }
    
    // 支付宝支付请求接口
    try {
        const { order: { payInfo: { orders: { orderSn: outTradeno, orderAmount } } } } = dvaStore.getState();
        const params = {
            tradeNo: outTradeno,
            subject: '海尔顺逛微店',
            body: '顺逛微店-订单号:' + outTradeno,
            price: orderAmount,
            notifyUrl: `${Config.ALIPAY_NOTIFY_DOMAIN}h5/pay/app/alipay/notify.html`,
        };
        const url = 'v3/h5/sg/orderSign.html';
        const json = await postAppForm(url, params);
        return json;
    } catch (error) {
        Log('输出error' + error);
    }
};

export const submWeixin = async () => {
    try {
        const { order: { payInfo: { orders: { orderSn, orderAmount } } } } = dvaStore.getState();
        const params = {
            orderSn,
        };
        const url = 'v3/h5/pay/wxpay.html?orderSn=' + orderSn;
        const json = await getAppJSON(url);
        return json;
    } catch (error) {
        Log('输出error' + error);
    }
};
export const submitPayway = async (value) => {
    try {
        let params = {};
        if (value == 'online') {
            params = {
                code: 'online',
                name: '在线支付'
            }
        } else if (value == 'cod') {
            params = {
                code: 'cod',
                name: '货到付款'
            }
        }
        const json = await POST_JSON(URL.UPDATEPAY, params);
        return json;
    } catch (error) {
        Log('输出error' + error);
    }
};
export default {
    namespace: 'order',
    state: initState,
    reducers: {
        clearOrder(state, { payload }): any {
            return { ...initState };
        },
        // 计算原始积分使用情况
        initPay(state, { payload }): any {
            return { ...state, payInfo: { ...payload } };
        },
        // 计算原始积分使用情况
        initPrice(state, { payload }): any {
            console.log(payload)
            // const { oringindata: { benefit = [], itemShareAmount, commodityAmount, ordersCommitWrapM: { orderProductList, order: { couponCodeValue } } } } = payload;
            const { pageData: {
                pageInfo: {
                    benefit = [],
                    itemShareAmount,
                    commodityAmount,
                    mid,
                    ordersCommitWrapM: {
                        benefitList,
                        orderProductList,
                        order: {
                            couponCodeValue
                        }
                    },
                    price:{
                        newprice,
                    }
                }
            } } = payload;
            console.log(payload.pageData.pageInfo.price)
            // let newprice = commodityAmount;
            // let StoreCouponCodeValue = 0;
            // // 减去满减金额
            // if (Number(itemShareAmount) > 0) {
            //     newprice = accSub(newprice, itemShareAmount);
            // }
            // 最终使用的优惠方式
            const finalbenefit = [];
            const newBenefit = [];
            const productSmallPrice = [];
            // 计算店铺优惠券
            // for (let index = 0; index < orderProductList.length; index++) {
            //     const element = orderProductList[index];
            //     let newSmallPrice = element.productAmount;
            //     if (element.couponCodeValue !== null && element.couponCodeValue !== undefined) {
            //         newSmallPrice = accSub(newSmallPrice, element.couponCodeValue);
            //         newprice = accSub(newprice, element.couponCodeValue);
            //         StoreCouponCodeValue = accAdd(StoreCouponCodeValue, element.couponCodeValue);
            //     }
            //     productSmallPrice.push({
            //         // 使用店铺优惠后的小计
            //         newSmallPrice,
            //         // 原商品 小计
            //         productAmount: element.productAmount,
            //         // 店铺优惠金额
            //         couponCodeValue: element.couponCodeValue,
            //         productId: element.productId
            //     });
            // }
            // // 先计算通用优惠券
            // if (couponCodeValue) {
            //     if (couponCodeValue !== 0) {
            //         // 总金额等于总金额减去通用优惠券的金额
            //         newprice = accSub(newprice, couponCodeValue);
            //     }
            // }
            // if (Number(newprice) < 0) {
            //     newprice = 0.01;
            // }
            if(benefitList){
                benefitList.map((item) => {
                    newBenefit.push({ ...item, ...initPoint(newprice, item) });
                });
            }
            // const priceWrap = {
            //     ...payload.pageData.pageInfo.price,
            //     newBenefit,
            //     commodityAmount,
            //     newprice,
            //     finalbenefit,
            //     couponCodeValue,
            //     StoreCouponCodeValue,
            //     productSmallPrice,
            //     itemShareAmount,
            // };
            return { ...state, price: Object.assign(payload.pageData.pageInfo.price,{newBenefit})};
        },
        changeSubmitOrder(state, { payload }): any {
            return { ...state, submitOrder: { ...payload } };
        },
        countPoint(state, { payload }): any {
            const { commodityAmount, newprice, itemShareAmount, newBenefit, couponCodeValue, StoreCouponCodeValue } = state.price;
            const { useBenfits } = payload;
            const price = state.price;
            let mnewprice = commodityAmount;
            // 减去满减金额
            if (Number(itemShareAmount) > 0) {
                mnewprice = accSub(mnewprice, itemShareAmount);
            }
            // 减去店铺优惠券
            if (Number(StoreCouponCodeValue)) {
                mnewprice = accSub(mnewprice, StoreCouponCodeValue);
            }
            // 先计算通用优惠券
            if (couponCodeValue) {
                if (couponCodeValue !== 0) {
                    // 总金额等于总金额减去通用优惠券的金额
                    mnewprice = accSub(mnewprice, couponCodeValue);
                }
            }
            const tempPrice = mnewprice; // 记录使用积分钻石前的支付金额，为了取消时恢复原始的数据
            const mnewBenefit = [];
            if (useBenfits.length > 0) {
                // 判断是否使用积分
                if (useBenfits.find((myitem) => myitem.benefitType === 'seashell')) {
                    useBenfits.map((myiitem) => {
                        if (myiitem.benefitType === 'seashell') {
                            if (Number(accSub(mnewprice, myiitem.pointDiscount)) < 0) {
                                price.jifenStatus = false;
                            } else {
                                mnewprice = accSub(mnewprice, myiitem.pointDiscount);
                                mnewBenefit.push(myiitem);
                                price.jifenStatus = true;
                            }
                        }
                    });
                    const mindex = mnewBenefit.findIndex((item) => item.benefitType === 'diamond');
                    const nindex = useBenfits.findIndex((item) => item.benefitType === 'diamond');
                    // 如果当前没有选择使用积分，如果已经选用积分 不做处理
                    if (mindex !== -1 && nindex === -1) {
                        mnewBenefit.splice(mindex, 1);
                        const item = newBenefit.find((myitem) => myitem.benefitType === 'diamond');
                        mnewBenefit.push({ ...item, ...initPoint(mnewprice, item,tempPrice) });
                    }
                    const xindex = mnewBenefit.findIndex((item) => item.benefitType === 'insurance');
                    const yindex = useBenfits.findIndex((item) => item.benefitType === 'insurance');
                    // 如果当前没有选择使用积分，如果已经选用积分 不做处理
                    if (xindex !== -1 && yindex === -1) {
                        mnewBenefit.splice(xindex, 1);
                        const item = newBenefit.find((myitem) => myitem.benefitType === 'insurance');
                        mnewBenefit.push({ ...item, ...initPoint(mnewprice, item,tempPrice) });
                    }
                } else {
                    newBenefit.map((mmmitem) => {
                        // 如果当前不是积分，则重新计算积分使用数量
                        if (mmmitem.benefitType === 'seashell') {
                            mnewBenefit.push({ ...mmmitem, ...initPoint(mnewprice, mmmitem,tempPrice) });
                        }
                    });
                    price.jifenStatus = false;
                }
                // 判断是否使用钻石
                if (useBenfits.find((myitem) => myitem.benefitType === 'diamond')) {
                    useBenfits.map((myiitem) => {
                        if (myiitem.benefitType === 'diamond') {
                            if (Number(accSub(mnewprice, myiitem.pointDiscount)) < 0) {
                                price.diamondStatus = false;
                            } else {
                                mnewprice = accSub(mnewprice, myiitem.pointDiscount);
                                mnewBenefit.push(myiitem);
                                price.diamondStatus = true;
                            }
                        }
                    });
                    const mindex = mnewBenefit.findIndex((item) => item.benefitType === 'seashell');
                    const nindex = useBenfits.findIndex((item) => item.benefitType === 'seashell');
                    // 如果当前没有选择使用积分，如果已经选用积分 不做处理
                    if (mindex !== -1 && nindex === -1) {
                        mnewBenefit.splice(mindex, 1);
                        const item = newBenefit.find((myitem) => myitem.benefitType === 'seashell');
                        mnewBenefit.push({ ...item, ...initPoint(mnewprice, item,tempPrice) });
                    }
                    const xindex = mnewBenefit.findIndex((item) => item.benefitType === 'insurance');
                    const yindex = useBenfits.findIndex((item) => item.benefitType === 'insurance');
                    // 如果当前没有选择使用积分，如果已经选用积分 不做处理
                    if (xindex !== -1 && yindex === -1) {
                        mnewBenefit.splice(xindex, 1);
                        const item = newBenefit.find((myitem) => myitem.benefitType === 'insurance');
                        mnewBenefit.push({ ...item, ...initPoint(mnewprice, item,tempPrice) });
                    }
                } else {
                    price.diamondStatus = false;
                    newBenefit.map((mmmitem) => {
                        // 如果当前不是钻石，则重新计算钻石使用数量
                        if (mmmitem.benefitType === 'diamond') {
                            mnewBenefit.push({ ...mmmitem, ...initPoint(mnewprice, mmmitem,tempPrice) });
                        }
                    });
                }
                // 判断是否使用金币
                if (useBenfits.find((myitem) => myitem.benefitType === 'insurance')) {
                    useBenfits.map((myiitem) => {
                        if (myiitem.benefitType === 'insurance') {
                            if (Number(accSub(mnewprice, myiitem.pointDiscount)) < 0) {
                                price.jinbiStatus = false;
                            } else {
                                mnewprice = accSub(mnewprice, myiitem.pointDiscount);
                                mnewBenefit.push(myiitem);
                                price.jinbiStatus = true;
                            }
                        }
                    });
                    const mindex = mnewBenefit.findIndex((item) => item.benefitType === 'seashell');
                    const nindex = useBenfits.findIndex((item) => item.benefitType === 'seashell');
                    // 如果当前没有选择使用积分，如果已经选用积分 不做处理
                    if (mindex !== -1 && nindex === -1) {
                        mnewBenefit.splice(mindex, 1);
                        const item = newBenefit.find((myitem) => myitem.benefitType === 'seashell');
                        mnewBenefit.push({ ...item, ...initPoint(mnewprice, item,tempPrice) });
                    }
                    const xindex = mnewBenefit.findIndex((item) => item.benefitType === 'diamond');
                    const yindex = useBenfits.findIndex((item) => item.benefitType === 'diamond');
                    // 如果当前没有选择使用积分，如果已经选用积分 不做处理
                    if (xindex !== -1 && yindex === -1) {
                        mnewBenefit.splice(xindex, 1);
                        const item = newBenefit.find((myitem) => myitem.benefitType === 'diamond');
                        mnewBenefit.push({ ...item, ...initPoint(mnewprice, item,tempPrice) });
                    }
                } else {
                    price.jinbiStatus = false;
                    newBenefit.map((mmmitem) => {
                        // 如果当前不是金币，则重新计算金币使用数量
                        if (mmmitem.benefitType === 'insurance') {
                            mnewBenefit.push({ ...mmmitem, ...initPoint(mnewprice, mmmitem,tempPrice) });
                        }
                    });
                }
            } else {
                // 取消勾选处理
                price.diamondStatus = false;
                price.jifenStatus = false;
                price.jinbiStatus = false;
                mnewprice = tempPrice; // 获取优惠前的数据
                newBenefit.map((item) => {
                    mnewBenefit.push({ ...item, ...initPoint(mnewprice, item) });
                });
            }
            if (Number(mnewprice) < 0) {
                mnewprice = 0.01;
            }
            price.newBenefit = mnewBenefit,
                price.newprice = mnewprice;
            return { ...state, price: { ...price } };
        },
        changePageInfo(state, { payload }): IOrder {
            return { ...state, ...payload };
        },
        changeGiftCardNumber(state, { payload }): IOrder {
            return { ...state, ...payload };
        },
        changeDeliveryWay(state, { payload }): any {
            return { ...state, ...payload };
        },
        isRefreshFlag(state, { payload }): any {
            return { ...state, ...payload };
        },
        getGifts(state,{payload}):any{
            return {...state , ...payload}
        }
    },
    effects: {
        *submitDeliveryTime({ payload: { delivery, yuyueDay, yuyueTime, skku, attrValueNames, o2oAttrId } }, { call, put }) {
            try {
                // const oringinUrl = 'v3/h5/sg/order/submitDeliveryway.html?delivery=';
                // const url = `${oringinUrl}${delivery}&yuyueDay=${yuyueDay}&yuyueTime=${yuyueTime}`;
                // const { success } = yield call(postAppJSON, url);
                // 更新预计约送货时间接口         cd  0:标准配送，1：预约配送
                delivery = 1; // 只可以修改预约配送时间
                const {success} = yield POST_JSON(URL.CHOICEDATE + '?cd=' + delivery + '&day=' + (yuyueDay ? yuyueDay.split('(')[0] : '') + '&time=' + yuyueTime);
                if (success) {
                    yield put(createAction('fetchPageInfo')({ isRefresh: true }));
                }

            } catch (error) {
                Log(error);
            }
        },
        *submitOrder({ payload: { isBooking, benefitList, routeKey } }, { call, put, select ,take}) {
            try {
                const params = {
                    remark: '',
                    isBooking,
                    benefitList,
                };
                
                // const url = 'v3/h5/sg/order/orderSubmitBenefitMixture.html';
                // const { success, data } = yield call(postAppJSON, url, params);
                // 提交订单接口
                const { success, data } = yield POST_JSON(URL.SUBMITORDER, params);
                // const {newprice: oa, orderSn: os, paymentCode: pyc} = data;
                if (success) {
                    yield put(createAction('changeSubmitOrder')({ ...data }));
                    // const { price: { newprice }, submitOrder: { order: { orderSn, paymentCode } } } = yield select(state => state.order);
                    let num = 0;
                    let itemId = [];
                    let baifendprice = [];
                    let baifendnumber = [];
                    const productList = dvaStore.getState().order.pageInfo.ordersCommitWrapM.orderProductList;
                    console.log(productList,data);
                    if(productList){
                        for(var i = 0; i<productList.length;i++){
                            num = num + parseInt(productList[i].number);
                            itemId[i]= productList[i].sku + '';
                            baifendprice[i]= Number(productList[i].price);
                            baifendnumber[i]= Number(productList[i].number);
                        }
                    }
                    console.log(itemId,baifendprice,baifendnumber);
                    const params = {
                        uid: dvaStore.getState().order.pageInfo.mid + '',
                        total: data.oa + ''
                      }
                    if (data.ps == 101) { //已经支付 yl  
                        // yield put(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'OrderList', params: {orderFlag: 0, orderStatus: 0} }));
                        yield put(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'PaymentResult', params: { orderSn: data.os, price: data.oa } })); 
                    }else{
                        if (data.pyc === 'online') {
                            yield put(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'Payment', params: { price: data.oa, orderSn: data.os } }));
                        } else {
                            NativeModules.BfendModule.onPay([dvaStore.getState().order.pageInfo.mid + '',data.os + '',itemId,baifendprice,baifendnumber,Number(data.oa)],params)
                            // yield put(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'PaymentResult', params: { orderSn: data.os, price: data.oa } })); 
                            yield put(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'CommitSuccess', params: { orderSn: data.os, price: data.oa , routeKey} })); 
                        }
                    }
                    //成功后刷新购物车列表
                    yield put(createAction('cartModel/fetchCartList')());

                    // gio 提交订单成功 埋点 yl
                    NativeModules.StatisticsModule.track('SubmitOrder', {
                        paymentMethod: data.pyc,
                        totalPrice: data.oa,
                        productCount: num,
                    });
                    //百分点埋点
                    NativeModules.BfendModule.onOrder([ data.os+'', itemId, baifendprice, baifendnumber,Number(data.oa)],params);
                    // 小熊客服  yl
                    /**
                    * 订单页轨迹标准接口
                    * @param command 数组
                            * @param title 商品页的名字
                            * @param url 商品页的url
                            * @param ref 上一页url
                            * @param sellerid 商户id
                            * @param orderid 订单id
                            * @param orderprice 订单价格
                    */
                    NativeModules.XnengModule.NTalkerOrderAction([
                        '提交订单',
                        'rn:#/CommitOrder',
                        '',
                        '',
                        (data.os+''),
                        (data.oa+''),
                    ])
                }
            } catch (error) {
                Toast.fail(error);
            }
        },
        *selectedCouponNew({ payload: { memberCouponId = null, productId = '', skku = '', attrValueNames = '', o2oAttrId = '' ,sku, type} }, { call, put }) {
            try {
                let url = '';
                if (type == 'store') { // 店铺
                    url = URL.CHOICESTORECOUPON+'?c='+(memberCouponId||'')+'&p='+sku;
                } else { // 平台
                    url = URL.CHOICEORDERCOUPON+'?c='+memberCouponId||'';
                }
                // const { success, data } = yield call(postAppJSON, url);
                const {success, data} = yield POST_JSON(url);
                if (success) {
                    DeviceEventEmitter.emit('resetBenifit', '');
                    yield put(createAction('router/apply')({ type: 'Navigation/BACK' }));
                    yield put(createAction('fetchPageInfo')({ isRefresh: true }));
                }
            } catch (error) {
                Log(error);
            }
        },
        *initpay({ payload }, { call, put }) {
            try {
                // tslint:disable-next-line:no-shadowed-variable
                const { orderSn } = payload;
                const url = `v3/h5/sg/order/toOrderSubmitSuccess.html?orderSn=${orderSn ? orderSn : dvaStore.getState().order.submitOrder.order.orderSn}`;
                const { data } = yield call(getAppJSON, url);
                yield put(createAction('initPay')({ ...data }));
            } catch (error) {
                Log(error);
            }
        },
        *chooseAddress({ payload: { addrId, skku, attrValueNames, o2oAttrId } }, { call, put }) {
            try {
                // const url = `v3/h5/sg/shippingAddress/chooseAddr.html?addrId=${addrId}`;
                // const { success } = yield call(getAppJSON, url);
                const {success} = yield POST_JSON(URL.CHANGEADDRESS + '?address=' + addrId);
                if (success) {
                    yield put(createAction('fetchPageInfo')({ isRefresh: true }));
                }
            } catch (error) {
                Log(error);
            }
        },
        *fetchDeliveryWay({ payload }, { call, put }) {
            try {
                // const url = 'v3/h5/sg/order/toChooseDeliveryWay.html?toUrl=2';
                // const { data } = yield call(getAppJSON, url);
                const {data} = yield POST_JSON(URL.GETCANCHOICEDATE);
                yield put(createAction('changeDeliveryWay')({ deliveryWay: data }));
            } catch (error) {
                Log(error);
            }
        },
        *putPageInfo({ payload }, { call, put, select }) {
            let { orderInitParams, isRefresh} = payload;
            try {
                // 单品页主接口 yl
                const { data, success, message } = yield POST_JSON((isRefresh ? URL.GETPAGEINFO : URL.CREATORDER), orderInitParams);
                yield put(createIdAction('goodsDetail/changeUIState')({ modelId: payload.modelId, showCountType: CountStyleType.None }));
                if (success) {
                    // 更新state树
                    let pageData = {
                        pageInfo: {
                            orderType: data.ot,//订单类型（默认0）0 普通订单。1：定金尾款，3：特权码订单，5：软装订单
                            commodityAmount: data.pam,
                            mid:data.mid,
                            o2oStore: formatComponentDataToJson(data.ops, (o) => {
                                return {
                                    [`${o.proId}`]: o.osName,
                                }
                            }),
                            canUseGiftCard: data.cl,// 是否可以使用礼品券   o2o两件以上
                            useGiftCard: data.lpq, // 礼品券码
                            sht: data.sht, // 是否显示预计送达时间
                            delivery: data.cd, //预计送达模式0：标准，1：预约 
                            standardDeliveryDate: data.dd + (data.dt || ''), // 送达时间
                            ordersCommitWrapM: {
                                benefitList: data.bl,
                                orderProductList: formatComponentData(data.ops, (o) => {
                                    return {
                                        productId: o.proId,
                                        couponCode: o.ca,
                                        sku: o.sku,
                                        productName: o.proN,
                                        price: o.price,
                                        number: o.num,
                                        attrPic: o.image || '',
                                        productAmount: o.opa, //网单总价=单价*数量-优惠券-满减-立减
                                        orderPromotionAmount: o.pma || 0,  //下单立减金额
                                        attrValueName: o.an, // 规格属性
                                    }
                                }),
                                // 发票
                                invoiceType: data.inv.it || '', // 发票类型 1：增票2：普票
                                billCompany: data.inv.bc || '', // bc
                                memberInvoices: {
                                    invoiceTitle: data.inv.iti||'', //发票抬头
                                },
                                order: {
                                    couponCodeValue: data.coAmt, //data.coAmt 平台优惠券金额
                                    couponCode: data.coId,   // 平台优惠券Id
                                    // 收获地址
                                    consignee: data.coN, //收货人姓名
                                    mobile: data.mb,
                                    address: data.addr, // 详细收获地址
                                    regionName: data.rn, //省市区街道名称
                                },
                                payList: formatComponentData(data.pays, (o, i) => ({
                                    paymentName: o.name,
                                    paymentCode: o.code, // online cod
                                }
                                )),
                        
                            },
                            // 各种活动类型
                            // bigActivity: ,
                            // isB2C: ,
                            // isActivity: ,
                            isBooking: data.book,  //是否预定
                            // 价格
                            price: {// 每件商品的小计 信息
                                productSmallPrice: [],
                                // 使用钻石、积分 数组
                                newBenefit: [],
                                // 订单总金额
                                commodityAmount: data.pam,
                                // 优惠后的订单总金额
                                newprice: data.oam,
                                // 通用优惠券 使用金额
                                couponCodeValue: data.coAmt,
                                // 是否可用优惠券
                                canUsecoupon: false,
                                // 店铺优惠券总金额
                                StoreCouponCodeValue: data.tca-data.coAmt,
                                totalCouponValue: data.tca, //总优惠券金额
                                // 是否使用钻石
                                // diamondStatus: false,
                                // // 是否使用积分
                                // jifenStatus: false,
                                // 下单满减
                                itemShareAmount: data.ipm,
                            },
                            // 赠品包商品  
                            hbData:{
                                c: data.hb?data.hb.c:'',//已使用特权码特权码
                                p: data.hb?data.hb.p:''
                            },
                        }
                    };
                    yield put(createAction('changePageInfo')(pageData));
                    yield put(createAction('initPrice')({ pageData }));
                    console.log(isRefresh)
                    if(!isRefresh){
                        console.log('跳转 CommitOrder 页面');
                        yield put(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'CommitOrder', params: { isRefresh } })); //正向购物流
                        // yield put(NavigationActions.navigate({routeName: 'SearchList', params: {}}));
                        // yield put(NavigationActions.navigate({routeName: 'SearchList'}));
                    }
                } else {
                    Toast.info(message);
                }
            } catch (error) {
                Log(error);
            }
        },
        *checkGiftCard({ payload }, { call, put, select }) {
            const { cardCode = '', callback} = payload;
            try {
                // const { result, success } = yield call(
                //     postAppJSON,
                //     `v3/h5/sg/order/checkGiftCard.json?amount=${o2oNumber}&cardCode=${cardCode}&customId=${giftCardCustomerId}&number=${o2oNumber}`,
                // );
                const { result, success } = yield POST_JSON(URL.CHECKGIFT+'?cardCode='+cardCode);
                if (success) {
                    const { failedReason, flag } = result;
                    if (flag === 'N') {
                        Toast.show(failedReason);
                        yield put(createAction('changeGiftCardNumber')({ giftCardNumber: '请输入礼品卡券' }));
                    } else {
                        yield put(createAction('changeGiftCardNumber')({ giftCardNumber: cardCode }));
                    }
                }
                if(callback){callback()} //关闭弹窗
            } catch (error) {
                Log(error);
            }
        },
        *cancelGiftCard({ payload }, { call, put, select }) {
            try {
                const {success,message } = yield POST_JSON(URL.CANCELGIFT);
                if (success) {
                    yield put(createAction('changeGiftCardNumber')({ giftCardNumber: '请输入礼品卡券' }));
                }else{
                    Toast.show(message);
                }
            } catch (error) {
                Log(error);
            }
        },
        // 更新页面接口
        *fetchPageInfo({ payload }, { call, put }) {
            const { isRefresh } = payload;
            try {
                // const { data, success } = yield call(
                //     getAppJSON,
                //     `v3/h5/order/pageInfo.json?isFromInvoices=${isFromInvoices}&version=1&attrValueNames=${attrValueNames}&skku=${skku}&o2oAttrId=${o2oAttrId}`,
                // );
                // if (success) {
                // yield put(createAction('changePageInfo')({ pageInfo: data }));
                // yield put(createAction('initPrice')({ oringindata: data }));
                // }
                yield put(createAction('putPageInfo')({ isRefresh }));
                // 充值积分钻石 金币 支付标示
                yield put(createAction('isRefreshFlag')({isRefreshFlag: isRefresh}));
            } catch (error) {
                Log(error);
            }
        },
        // 选择赠品
        * choiceGift({payload},{call,put}){
          try{
            const {success,result} = yield POST_JSON(URL.GIFTS);
            console.log(success)
            if(success && result!=null){
                yield put(createAction('getGifts')({giftsList:result}));
            }else{
                yield put(createAction('getGifts')({giftsList:[]}));
            }
          }catch(err){
              console.log(err)
          }
        },
        //保存赠品
        * preservationGift({payload},{call,put}){
            try{
                const p = payload;
                const {success,result,message} = yield POST_JSON(URL.P_GIFTS,p);
                console.log(success,result)
                if(success && result){
                    if(message){
                        Toast.info(message);
                    }else{
                        Toast.info('修改成功');
                    }
                    yield put(createAction('fetchPageInfo')({ isRefresh: true }));
                    yield put(createAction('router/apply')({ type: 'Navigation/BACK' }));
                }else{
                    if(message){
                        Toast.info(message);
                    }else{
                        Toast.info('修改失败，请稍后');
                    }
                }
            }catch(err){
                console.log(err)
            }
        },
        // 规格参数  item/purchase/specifications.json
        * getDefaultInfo({payload},{call,put}){
            try{
                const pid = payload.pid;
                const {success,data} = yield GET(URL.GET_INFO + '?productId=' + pid);
                console.log(data)
                if(success && data!=null){
                    console.log('有数据')
                    yield put(createAction('getGifts')({productInfoList:data.productAttrs}));
                }else{
                    console.log('meiyou')
                    yield put(createAction('getGifts')({productInfoList:[]}));
                }
            }catch(err){
                console.log(err)
            }
    },
    },
};
