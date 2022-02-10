
import Config from './../../config';
import URL from './../../config/url';
import { GET, GET_P, POST_FORM, POST_JSON } from './../../config/Http';

const getAD = () => {
    return  GET(URL.get_AD, {}, {}, 3000);
};
const getADV = () => {
    return  GET(URL.get_ADV, {}, {}, 3000);
};


export default {
    getAD,
    getADV,
}