import URL from './../../config/url';
import { GET, GET_P, POST_FORM, POST_JSON } from './../../config/Http';



const getBanners =  (query) => {
  return GET(URL.LIFEBANNER ,query);
};

const getNearbyTypes =  (query) => {
  return GET(URL.NEARBY_TYPES ,query);
};

const getNearbyStore =  (query) => {
  return GET(URL.NEARBY_SOTRE ,query);
};

const getNearbyList= (query) => {
  return GET(URL.NEARBY_SOTRE_LIST ,query);
};


export default {
  getBanners,
  getNearbyTypes,
  getNearbyStore,
  getNearbyList,
}