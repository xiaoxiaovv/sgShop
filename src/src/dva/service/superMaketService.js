import {GET} from "../../config/Http";
import URL from "../../config/url";

const fetchProductCates =  () => {
  return GET(URL.SUPERMARKET_PRODUC_CATES ,{}, {});
};

const fetchAdornHomeBanner =  () => {
  return GET(URL.SUPERMARKET_ADORN_HOME_BANNER ,{}, {});
};

const fetchTopRecommendProducts =(query)=>{
  return GET(URL.SUPERMARKET_TOP_REMMEND_PRODUCTS ,query);
}

const fetchLowRecommendProducts = (query)=>{
  return GET(URL.SUPERMARKET_LOW_REMMEND_PRODUCTS ,query);
}




export default {
  fetchProductCates,
  fetchAdornHomeBanner,
  fetchTopRecommendProducts,
  fetchLowRecommendProducts
}