
import URL from './../../config/url';
import { GET, GET_P, POST_FORM, POST_JSON } from './../../config/Http';


// banner
const getCrowdFundingBanner = (query) => {
    return  GET(URL.get_crowdfunding_banner, query);
};

// 预售
const getCrowdFundingPreSale = (query) => {
    return  GET(URL.get_crowdfunding_presale, query);
};

// 众筹
const getSuccessZactivitysn = (query) => {
    return  GET(URL.get_crowdfunding_successzactivitysn, query);
};

// 众筹列表
const getIndexZactivitys = (query) => {
    return  GET(URL.get_crowdfunding_indexzactivitys, query);
};
// 预约列表
const getCrowdFundingReserve = (query) => {
    return  GET(URL.get_crowdfunding_reserve, query);
};

const getCrowdFundingIndex = (query) => {
    return  GET(URL.get_crowdfunding_index, query);
};
const getCrowdFundingList = (query) => {
    return  GET(URL.get_crowdfunding_list, query);
};

const getCrowdFundingDetail = (query) => {
  return  GET(URL.GET_INDEX_ZACTIVITYS, query);
};

const getZActivitySinglePage = (query) => {
  return  GET(URL.GET_ZACTIVITY_SINGLE_PAGE, query);
};

const getZhongchouCheck=(query) => {
  return  GET(URL.GET_ZHONGCHOU_CHECK, query);
};
const getOrderPageInfo=({number, zStallsId}) => {
  return  POST_JSON(`${URL.GET_ORDER_PAGEINFO}?number=${number}&zStallsId=${zStallsId}`);
};
const submitOrder=({invoiceType,number,sharePeopleId,zStallsId})=>{
  return  POST_JSON(`${URL.POST_SUBMIT_ORDER}?invoiceType=${invoiceType}&number=${number}&sharePeopleId=${sharePeopleId}&zStallsId=${zStallsId}`,{invoiceType,number,sharePeopleId,zStallsId});
}





export default {
    getCrowdFundingBanner,
    getCrowdFundingPreSale,
    getSuccessZactivitysn,
    getCrowdFundingReserve,
    getCrowdFundingIndex,
    getCrowdFundingList,
  getCrowdFundingDetail,
  getZActivitySinglePage,
  getZhongchouCheck,
  getOrderPageInfo,
  submitOrder
}