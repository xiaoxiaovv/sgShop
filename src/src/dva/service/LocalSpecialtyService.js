
import URL from './../../config/url';
import { GET, GET_P, POST_FORM, POST_JSON } from './../../config/Http';
// 主接口
const getCharaIndex = (query) => {
    return  GET(URL.get_chara_charaindex, query);
};
//限时抢购 新品
const getCharaData = (query) => {
    return  GET(URL.get_chara_data, query);
};
//众筹
const getCrowdData = (query)=>{
    return GET(URL.get_crowd_data, query)
}
const getCartNum = (query)=>{
    return GET(URL.get_cart_num, query)
}
const getLinkNav = (query)=>{
    return GET(URL.get_link_nav, query)
}
const getLinkData = (query)=>{
    return GET(URL.get_link_data, query)
}
const getAllSpecialty = (query)=>{
    return GET(URL.get_all_specialty, query)
}



export default {
    getCharaIndex,
    getCharaData,
    getCrowdData,
    getCartNum,
    getLinkNav,
    getLinkData,
    getAllSpecialty,
}