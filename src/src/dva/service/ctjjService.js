
import URL from './../../config/url';
import { GET, GET_P, POST_FORM, POST_JSON } from './../../config/Http';


const getMenuCases = () => {
    return  GET(URL.get_ctjj_menus_cases);
};
const getTopic = (query) => {
    return  GET(URL.get_topic, query);
};

const getNearby = (query) => {
    return  GET(URL.get_ctjj_nearby, query);
};
const getNearbyDetail = (query) => {
  return  GET(URL.get_ctjj_nearbyDetail, query);
};

const getBannerDaily = (query) =>{
    return GET(URL.get_bannerdaily,query);
};
const getBannerTheme = (query) =>{
    return GET(URL.get_bannertheme_page,query);
};
const getServicePromise = (query) =>{
    return GET(URL.SERVICE_PROMISE,query);
};
const getPrograms = (query) => {
    return  GET(URL.get_ctjj_programs, query);
};
const getProgramsDetail = (query) => {
    return  GET(URL.get_ctjj_programs_details, query);
};

const getProgramsList = (query) => {
    return  GET(URL.get_ctjj_programs_list, query);
};

const getCompleteList = (query) => {
    return  GET(URL.get_ctjj_products_list, query);
};
const getExperts = (query) => {
    return  GET(URL.get_ctjj_experts, query);
};
const getProductList = (query) => {
    return  GET(URL.get_ctjj_productlist, query);
};


export default {
    getTopic,
    getNearby,
  getNearbyDetail,
    getBannerDaily,
    getBannerTheme,
    getServicePromise,
    getMenuCases,
    getPrograms,
    getProgramsDetail,
    getProgramsList,
    getCompleteList,
    getExperts,
    getProductList,
}