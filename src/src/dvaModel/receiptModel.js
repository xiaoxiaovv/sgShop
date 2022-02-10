import {Toast} from 'antd-mobile';
import {createAction} from '../utils/index';
import URL from '../config/url';
import {GET, POST_JSON, GET_P, POST_FORM} from '../config/Http';
import {action,} from "./../dva/utils";


export default {
    namespace: 'receiptModel',
    state: {
        listLoading: false,
        ordersCommitWrapM: {
            memberInvoices: {}
        },
        receiptList: [],
        invoiceTitle: '',//公司名称，
        taxPayerNumber: '',//纳税人识别号
        registerAddress: '',//注册地址
        registerPhone: '',//注册电话
        bankName: '',//开户银行
        bankCardNumber: '',//开户账号
        // receiptConsignee:'',//收件人姓名
        // //收件人邮编
        // //收件人电话
    },
    reducers: {
        saveReceipt(state, action) {
            return {
                ...state,
                ordersCommitWrapM: action.payload,
            };
        },
        save(state, {payload}) {
            return {...state, ...payload};
        },
    },
    effects: {
        * fetchReceipt({payload}, {call, put}) {
            // let url = 'v3/h5/sg/order/toInvoice.html';
            try {
                // const resp = yield call(getAppJSON,url, payload);
                // Log('resp=======',resp);
                const resp = yield POST_JSON(URL.TOINVOICE);
                if (resp.success) {
                    yield put(createAction('saveReceipt')({memberInvoices: resp.data} ||
                        {memberInvoices: {}})
                    );
                    // yield put(createAction('order/fetchPageInfo')({isFromInvoices:1}));
                } else {
                    Toast.info(`message:${resp.message};errorCode:&${resp.errorCode}`)
                }
            } catch (error) {
                Log('error=======', error);
            }
        },
        * commitReceipt({payload: {params, skku, attrValueNames, o2oAttrId}}, {call, put}) {
            try {
                /**
                 * "cbn":"", //银行卡号
                 "bn ":"", //开户行
                 "bc ": params.billCompany, //发票抬头（增值税发票为公司名称）
                 "iti": params.billCompany, //发票标题（增值税发票为公司名称）
                 "it ": params.invoiceType, //1：增值税，2：普票
                 "rca":"", //发票邮寄地址
                 "rcc":"", //发票邮寄收件人
                 "rcm":"", //发票邮寄电话
                 "rcz":"", //发票邮寄邮编
                 "nit":params.normalInvoiceType, //1个人发票，2公司发票
                 "rga":"", //公司注册地
                 "rgp":"", //公司注册电话
                 "tpn":params.taxPayerNumber //公司注册税号
                 */
                let paramsWrap = {};
                // 普通发票 iti对应的时发票抬头          增值税发票 公司名 对应的时 bc
                if (params.invoiceType == 2) { //普通发票
                    console.log('params.submitParams',params.submitParams)
                    paramsWrap = Object.assign(params.submitParams, {
                        "it": 2, //1：增值税，2：普票
                        "nit": params.normalInvoiceType, //1个人发票，2个人发票
                        "iti": params.billCompany, //发票抬头（增值税发票为公司名称）
                        "tpn": params.taxPayerNumber //公司注册税号
                    })
                } else { // 增值税发票
                    console.log('params.submitParams',params.submitParams)

                    //发票邮寄地址
                    let receiptAddress = '';
                    if (params && params.locationInfo) {
                        receiptAddress = (params.locationInfo.province ? params.locationInfo.province.text : '') +
                            (params.locationInfo.city ? params.locationInfo.city.text : '') +
                            (params.locationInfo.district ? params.locationInfo.district.text : '') +
                            (params.locationInfo.street ? params.locationInfo.street.text : '') +
                            (params.receiptAddress || '');
                    }
                    paramsWrap = Object.assign(params.submitParams, {
                        "cbn": params.bankCardNumber, //银行卡号
                        "bn": params.bankName, //开户行
                        "bc": params.invoiceTitle, //发票标题（增值税发票为公司名称）
                        "it": params.invoiceType, //1：增值税，2：普票
                        "rca": receiptAddress, //发票邮寄地址
                        "rcc": params.receiptConsignee, //发票邮寄收件人
                        "rcm": params.receiptMobile, //发票邮寄电话
                        "rcz": params.receiptZipcode, //发票邮寄邮编
                        "rga": params.registerAddress, //公司注册地
                        "rgp": params.registerPhone, //公司注册电话
                        "tpn": params.taxPayerNumber //公司注册税号
                    })
                }
                const resp = yield POST_JSON(URL.SUBMITMEMINVOICE, paramsWrap)
                if (resp.success) {
                    Toast.info('提交发票成功', 2);
                    yield put(createAction('router/apply')({type: 'Navigation/BACK'}));
                    yield put(createAction('order/fetchPageInfo')({
                        isFromInvoices: 1,
                        skku,
                        attrValueNames,
                        o2oAttrId,
                        isRefresh: true
                    }));
                } else {
                    Toast.info(`message:${resp.message};errorCode:&${resp.errorCode}`)
                }
            } catch (error) {
                console.log('error=======', error);
            }
        },
        /**
         * 获取增值税列表
         */* getMemberInvoicesListsByMemberId({payload}, {call, put}) {
            try {
                const res = yield GET(URL.GET_MEMBER_INVOICESLIST)
                if (res.success) {
                    yield put(action("save", {receiptList: res.data}));
                }
            } catch (e) {

            }
        },


        * saveChange({payload: {key, value}}, {call, put}) {
            try {
                console.log('saveChange',{[key]: value})
                yield put(action("save", {[key]: value}));
            } catch (e) {
            }
        },

        *clearData({payload}, {call, put}) {
            try {
                console.log('clearData',);
                yield put(action("save", {
                    listLoading: false,
                    ordersCommitWrapM: {
                        memberInvoices: {}
                    },
                    receiptList: [],
                    invoiceTitle: '',//公司名称，
                    taxPayerNumber: '',//纳税人识别号
                    registerAddress: '',//注册地址
                    registerPhone: '',//注册电话
                    bankName: '',//开户银行
                    bankCardNumber: '',//开户账号
                }));
            } catch (e) {
            }
        }

    },
};
