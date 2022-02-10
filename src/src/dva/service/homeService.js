
import Config from './../../config';
import URL from './../../config/url';
import { GET, GET_P, POST_FORM, POST_JSON } from './../../config/Http';

const getHomeGuess = (query) => {
    return  GET(URL.get_home_guess, query);
};



export default {
    getHomeGuess,
}