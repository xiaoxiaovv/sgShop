import {GET} from "../../config/Http";
import URL from "../../config/url";

 const fetchProductCates =  () => {
    return GET(URL.PRODUCT_CATES ,{}, {});
};

const fetchAdornHomeBanner =  () => {
  return GET(URL.ADORN_HOME_BANNER ,{}, {});
};

const fetchTopRecommendProducts =(query)=>{
  return GET(URL.TOP_REMMEND_PRODUCTS ,query);
}

const fetchLowRecommendProducts = (query)=>{
  return GET(URL.LOW_REMMEND_PRODUCTS ,query);
}




export default {
  fetchProductCates,
  fetchAdornHomeBanner,
  fetchTopRecommendProducts,
  fetchLowRecommendProducts
}