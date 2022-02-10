import {GET} from "../../config/Http";
import URL from "../../config/url";

 const fetchCharaPage =  (query) => {
    return GET(URL.CHARA_CHARAPAGE ,query);
};

const collectCancel =  (query) => {
  return GET(URL.COLLECT_CANCEL ,query);
};

const collectStore = (query)=>{
  return GET(URL.COLLECT_STORE ,query);
}

export default {
  fetchCharaPage,
  collectCancel,
  collectStore,
}