import { Platform , Dimensions} from 'react-native';
import config from './index';
const API_HOST = config.API_HOST;
const API_DETAIL_HOST = config.API_DETAIL_HOST;
const API_SEARCH_HOST = config.API_SEARCH_HOST;
const SERVER_DATA_HOST = config.SERVER_DATA_HOST;
const PAY_SERVER_HOST = config.PAY_SERVER_HOST;
const API_NEWHOME_HOST = config.API_NEWHOME_HOST;
const SHARE_HOST = config.SHARE_HOST;
const SERVER_TOP = config.SERVER_TOP;
const SQZBS3Q = config.SQZBS3Q;
const H5_HOST = config.H5_HOST;
const PAY_NO_S_SERVER_HOST = config.PAY_NO_S_SERVER_HOST;

const { height, width } = Dimensions.get('window');
let SWidth, SHeight;
if(height > width){
    SWidth = width;
    SHeight = height;
}else{
    SWidth = height;
    SHeight = width;
}

const IS_STORE = Platform.OS === 'ios' ? false : false;

const getFullUrl = (url, host = API_HOST)=>{
    return `${host}/${url}`;
};

const getRegionByPIdAndReType = `v3/mstore/sg/getRegionByPIdAndReType.html`; // 地理位置


const HOT_LIST = `search/search/hotSearch.html`; // 热搜列表 docs: http://gitlab.test.ehaier.com/front-end/618_interface/wikis/5%E3%80%81%E7%83%AD%E8%AF%8D%E6%90%9C%E7%B4%A2
const HOT_WORD = `search/search/defaultSearch.html`; // 热词 docs: http://gitlab.test.ehaier.com/front-end/618_interface/wikis/4%E3%80%81%E9%BB%98%E8%AE%A4%E6%90%9C%E7%B4%A2%E8%AF%8D
const KEYWORD_SEARCH = `search/wdCommonSearchNew.html`; // 关键词搜索 docs: http://gitlab.test.ehaier.com/front-end/618_interface/wikis/2%E3%80%81%E6%90%9C%E7%B4%A2%E6%8E%A5%E5%8F%A3
const SEARCH_STORE = `search/searchStore.json`;//搜索店铺
const CATEGORY_LIST = `search/commonLoadItemNew.html`; // 分类类目列表 docs: http://gitlab.test.ehaier.com/front-end/618_interface/wikis/1%E3%80%81%E5%95%86%E5%93%81%E5%88%97%E8%A1%A8
const FILTER_DATA = `search/wdMarketFiltrate.html`; // 筛选 docs: http://gitlab.test.ehaier.com/front-end/618_interface/wikis/6%E3%80%81%E7%AD%9B%E9%80%89
const GET_PRICE_BY_TRACEID = `search/getPriceByProductList.html`; // 后续获取价格 docs: http://gitlab.test.ehaier.com/front-end/618_interface/wikis/3%E3%80%81%E5%90%8E%E7%BB%AD%E8%8E%B7%E5%8F%96%E4%BB%B7%E6%A0%BC
const HOME_GUESS="search/loadFindProductIds.html"; //猜你喜欢  http://gitlab.test.ehaier.com/front-end/618_interface/wikis/5.5%E5%8F%91%E7%8E%B0%E9%A1%B5

// 百货超市
const GET_SUPERMARKET_TABS =`sg/cms/supermarket/productCates.json`;
const GET_SUPERMARKET_BANNER =`sg/cms/supermarket/supermarketBanner.json`;
const GET_SUPERMARKET_TOPRECOMMENDPRODUCTS =`sg/cms/supermarket/topRecommendProducts.json`;
// http://m.ehaier.com/sg/cms/supermarket/topRecommendProducts.json?parentCateId=3275&provinceId=16&cityId=173&districtId=2450&streetId=12036596
const GET_SUPERMARKET_LOWRECOMMENDPRODUCTS =`sg/cms/supermarket/lowRecommendProducts.json`;
// http://m.ehaier.com/sg/cms/supermarket/lowRecommendProducts.json?parentCateId=3275&provinceId=16&cityId=173&districtId=2450&streetId=12036596

// 特产汇
const GET_CHARA_CHARAINDEX = `sg/cms/chara/charaIndex.json`;
const GET_CHARA_CATEGORY = `sg/cms/navigation/getNavigations.json`;
const GET_CHARA_CITYCHARA = `sg/cms/chara/cityChara.json`;
const GET_CHARA_LOADITEM = `search/charaLoadItem.json`;
const GET_CHARA_DATA = `sg/cms/flashSales/chara.json`; //限时抢购 新品


const GET_CROWD_DATA = `activity/zhongchou/successZActivitys`; //众筹
const GET_CART_NUM = `v3/h5/cart/num.json`;
const GET_LINK_NAV = `sg/cms/chara/charaCate.json`; //猜你喜欢类目
const GET_LINK_DATA = `sg/cms/chara/charaProducts.json`; //猜你喜欢数据
const GET_ALL_SPECIALTY = `sg/cms/chara/charaRegions.json`;


// 广告
const ADV ="v3/platform/web/app/getBannerMovie.html";
const AD ="v3/platform/web/app/app_navigate_banner";
// 日常活动
const GET_BANNER_DAILY = `v3/mstore/sg/activity/dailyActivityProducts.json`;
const GET_BANNER_THEME = `v3/mstore/sg/activity/toActivityPage.html`;
const CTJJ_MENUS_CASES = `sg/cms/home/smart.json`; // 成套家具头部
const TOPIC = `sg/cms/home/storys.json`; // 话题接口 http://rap.test.ehaier.com/workspace/myWorkspace.do?projectId=10#282
const CTJJ_NEARBY = `sg/cms/home/nearby.json`; // 附近体验店
const CTJJ_NEARBY_DETAIL = `sg/cms/home/nearbyDetail.json`; // 附近体验店详情
const CTJJ_PROGRAMS = `sg/cms/home/programs.json`; // 全套方案
const CTJJ_PROGRAMS_DETAILS = `sg/cms/home/programs/details.json`; // 全套方案详情
const CTJJ_PROGRAMS_LIST = `sg/cms/home/programs/list.json`; // 全套方案列表
//const CTJJ_PRODUCTS_LIST = `sg/cms/home/programs/details/products.json`; // 解决方案成套列表  7.12更换为新接口 后台刘淇
const CTJJ_PRODUCTS_LIST = `sg/cms/home/programs/details/sequenceProducts.json`; // 解决方案成套列表
const CTJJ_EXPERTS = `sg/cms/home/experts.json`; // 专家详情
const CTJJ_PRODUCTIDLIST = `sg/cms/home/programs/listByProductId.json`; // 拥有商品的方案列表
// 全套解决详情 分享 http://mobiletest.ehaier.com:38081/www/index.html#/fullHouseSolution/1
// 解决方案详情 分享 http://mobiletest.ehaier.com:38081/www/index.html#/itSoluteDetail/1
const CTJJ_SHARE_FULLHOUSESOLUTION = `fullHouseSolution/`; // 全套解决详情
const CTJJ_SHARE_ITSOLUTEDETAIL = `itSoluteDetail/`; // 解决方案详情


const CHARA_SHARE_SECONDLEVELSTORE = `secondLevelStore`; // 特产汇 子场馆
const CHARA_SHARE_SPECIALTY = `localSpecialtyHomePage`; // 特产汇
const CHARA_SHARE_CHARPAGE = `SpecialtyVenueHome`; // 特产馆

const BANNER_THEME_SHARE = `bannerTheme/`;
const BANNER_DAILY_SHARE = `bannerDaily/`;
const DIY_HOME = 'sg/cms/home/diy.json'; // 居家定制首页
const DIY_CASELIST = 'sg/cms/home/case/list.json'; // 案例列表
const DIY_CASELABEL = 'sg/cms/home/case/label.json'; // 案例筛选
const DIY_CASEDETAILS = 'sg/cms/home/case/details.json'; // 案例详情
const DIY_DESIGNERLIST = 'sg/cms/home/designer/list.json'; // 设计师列表
const DIY_DESIGNERDETAILS = 'sg/cms/home/designer/details.json'; // 设计师详情-基本信息
const DIY_CASELIST_D = 'sg/cms/home/designer/case/list.json'; // 设计师详情－案例列表
const DIY_DESIGN = 'sg/cms/home/design.json'; //  预约设计
const DIY_CASE_SHARE = 'homeDetail/'; //  分享案例
const DIY_DESIGN_SHARE = 'designDetail/'; // 分享设计师
// 单品
const GOODS_DETAIL = 'item/purchase/'; //商品详情页接口
const GOODS_CHECKSTOCK = 'item/purchase/checkStock.json'; //单品页库存
const GOODS_IS_ATTRIBUTE = 'item/attribute/isShowAttr.json'; //是否展示规格参数
const GOODS_ATTRIBUTE = 'item/attribute/getSgStoreAttribute.json'; //商品规格参数
const GOODS_EVALUATE_COUNT = 'item/evaluation/'; //商品详情评价条数
const CHECKSTOCKFORNUM = 'item/purchase/checkStockForNum.json'; //立即购买前的校验
const SERVICE_PROMISE = 'item/purchase/getDes.json';
const GET_PROMOS = 'item/purchase/promos.json';  // 图文详情
const GET_SPECIFICATIONS = 'item/purchase/specifications.json';  // 规则参数
const GET_PRODUCTCATENAME = 'item/purchase/getProductCateName.json';// 类别名称
const GET_COMMENTSBYCONDITION = 'v3/h5/sg/getCommentsByCondition.json';  // 商品评价
const GET_TOASSESSLIST = 'v3/h5/sg/toAssessList.html';  // 好评率
const GET_PRODUCTIMPRESSIONS = 'v3/h5/sg//getProductImpressions.json';  // 印象






const TOKEN_GET = 'platform/web/member/queryAccessToken.json'; //Token获取(首页的生活服务需要token)
const LIFEBANNER = 'sg/cms/home/banner.json'; // 生活服务首页Banner
const LIFESERVE = 'sg/cms/home/life.json';  // 生活服务首页
const ZHSCENE= 'sg/cms/home/smart/scenes.json';   //智家场景页
const SPACE= 'sg/cms/home/smart/space.json';    //空间详情页
const HAOKANG = 'sg/h5/web/auth/mobile/homeking.json'; // 好糠之家
//结算页
const CREATORDER = 'v3/h5/order/createOrder.json'; //结算页主接口
const GETPAGEINFO = 'v3/h5/order/getPageInfo.json'; //更新结算页接口
const UPDATEPAY = 'v3/h5/order/updatePay.json';// 更新支付方式
const CHECKGIFT = 'v3/h5/order/checkGift.json'; //礼品券校验接口
const CANCELGIFT = 'v3/h5/order/cancelGift.json'; //取消礼品券
const SUBMITORDER = 'v3/h5/order/asynSubmitOrder.json'; //提交订单
const GETSTORECOUPON= 'v3/h5/order/getStoreCoupon.json'; //获取店铺券
const CHOICESTORECOUPON= 'v3/h5/order/choiceStoreCoupon.json'; //选择店铺券
const GETORDERCOUPON= 'v3/h5/order/getOrderCoupon.json';//获取平台券
const CHOICEORDERCOUPON= 'v3/h5/order/choiceOrderCoupon.json'; //选择平台券
const GETCANCHOICEDATE= 'v3/h5/order/getCanChoiceDate.json'; //获取可用预约送达时间
const CHOICEDATE= 'v3/h5/order/choiceDate.json'; //更新预计约送货时间
const TOINVOICE= 'v3/h5/order/toInvoice.json'; //获取发票信息
const SUBMITMEMINVOICE= 'v3/h5/order/submitMemInvoice.json'; //发票提交接口
const GIFTS = 'v3/h5/order/getGiftBag.json'; //获取赠品
const P_GIFTS = 'v3/h5/order/choiceGiftBag.json'; //保存赠品
const GET_INFO = 'item/purchase/specifications.json';//规格参数
//收获地址
const MEMBERADDRESSES= 'v3/h5/order/memberAddresses.json'; //收获地址列表
const INSERTADDRESS= 'v3/h5/order/insertAddress.json'; //新增收货地址
const DELITEADDRESS= 'v3/h5/order/deleteAddress.json';//删除收获地址
const DELETEBATCHADDRESS= 'v3/h5/order/deleteBatchAddress.json'; //批量删除收货地址
const UPDATEADDRESS= 'v3/h5/order/updateAddress.json'; //修改收货地址
const UPDATEDEFAULTADDRESS= 'v3/h5/order/updateDefaultAddress.json'; // 设置默认收获地址
const CHANGEADDRESS= 'v3/h5/order/changeAddress.json'; //选择收获地址
const ADDRESS= 'v3/h5/order/address.json'; //编辑收货地址获取信息

const UPLOAD_IMAGE="platform/web/app/uploadImage";//上传头像

const READ_ALL_MESSAGE="v3/mstore/sg/readAllMessage.json";//消息全部已读
// 支付
const PAYCHECK = 'v3/h5/sg/orderPayCheckNew.html'; //提交支付方式校验库存接口
const UNIONPAYREQUEST = 'paycenter/unionpay/request.html'  // 银联支付宝支付信息获取接口
const UNIONPAYRESULT = 'paycenter/json/unionpay/payResult'  // 银联支付结果查询接口
//家装家居
const PRODUC_CATES="sg/cms/adornhome/productCates.json";//tab栏项目
const ADORN_HOME_BANNER='sg/cms/adornhome/adornHomeBanner.json';//轮播图
const TOP_REMMEND_PRODUCTS = 'sg/cms/adornhome/topRecommendProducts.json?';//获取推荐商品
const LOW_REMMEND_PRODUCTS = '/sg/cms/adornhome/lowRecommendProducts.json?';//获取其他推荐商品
//百货超市
const SUPERMARKET_PRODUC_CATES="sg/cms/supermarket/productCates.json";//tab栏项目
const SUPERMARKET_ADORN_HOME_BANNER='sg/cms/supermarket/supermarketBanner.json';//轮播图
const SUPERMARKET_TOP_REMMEND_PRODUCTS = 'sg/cms/supermarket/topRecommendProducts.json?';//获取推荐商品
const SUPERMARKET_LOW_REMMEND_PRODUCTS = '/sg/cms/supermarket/lowRecommendProducts.json?';//获取其他推荐商品

//特产汇 特产馆页面
const CHARA_CHARAPAGE = 'sg/cms/chara/charaPage.json?';
const COLLECT_CANCEL = 'v3/mstore/sg/collectCancel.json?';
const COLLECT_STORE = 'v3/mstore/sg/collectStore.json?';


const CROWDFUNDING_BANNER = 'sg/cms/secondPageBanner.json';
const CROWDFUNDING_PRESALE = 'sg/cms/reserve/preSale.json';
const CROWDFUNDING_SUCCESSZACTIVITYSN = 'activity/zhongchou/successZActivitys';
const CROWDFUNDING_INDEXZACTIVITYS = 'activity/zhongchou/indexZActivitys';
const CROWDFUNDING_RESERVE = 'sg/cms/reserve/index.json'; // sg/cms/reserve/index.json?provinceId=16&cityId=173&districtId=2450&streetId=12036596&pageIndex=1&from=1

//众筹首页
const GET_CROWDFUNDING_INDEX = 'activity/zhongchou/index'; //banner 人气推荐
const GET_CROWDFUNDING_LIST = 'activity/zhongchou/indexZActivitys'; //最新上线
const CROWDFUNDING_SHARE ='crowdFunding';//顺逛众筹分享

//众筹详情
const GET_INDEX_ZACTIVITYS = 'activity/zhongchou/getZActivitySinglePage';
//选择档位列表
const GET_ZACTIVITY_SINGLE_PAGE = 'activity/zhongchou/getZStallsSinglePage';
const GET_ZHONGCHOU_CHECK = 'activity/zhongchou/check';
const GET_ORDER_PAGEINFO = 'activity/zhongchou/order/pageInfo';
const POST_SUBMIT_ORDER='activity/zhongchou/order/submitOrder';


const GET_MEMBER_INVOICESLIST='v3/h5/sg/order/getMemberInvoicesListsByMemberId.html';


const IF_CIRCLEPAGE='circle/getSqzbLink.ajax'; //社区争霸赛
const SQZBS3 ='v3/platform/web/member/getEnc.json'; //社区争霸赛

const NEARBY_TYPES='sg/cms/home/nearby/types.json';//体验店类型
const NEARBY_SOTRE='sg/cms/home/nearby.json';
const NEARBY_SOTRE_LIST='sg/cms/home/nearby/list.json';

const GETKJTACCOUNT='v3/kjt/getKjtAccount.json';  // 获取快捷通token和金额
const OFFICIAL_HRY_URL='http://cdn09.ehaier.com/shunguang/H5/'  // 快捷通回调链接
const MINE_PROMOTION='v3/mstore/sg/promotion.json';//推广图片信息接口

const OPEN_HOT_LOTTERY = 'mstore/sg/game/needRedirect.json';//开门红抽奖

/********** H5 的 url  start ***********/
const register_share_url = `register/0/`;
const goods_share_url = `productDetail/`;
const myStore_share_url = `myStore/`;
const couponsList_share_url = `getCouponsList/`;
const aboutUs_url = `aboutUs`;
const newHand_url = `newHand`;

/********** 分享出去 H5 的 url  end ***********/

const HOMEPAGE_FALSHSALES = "sg/cms/flashSales/indexsale.json";//首页限时抢购
const SPECIALTY_FALSHSALES = "sg/cms/flashSales/charasale.json";//特产汇限时抢购
const FALSHSALES = "sg/cms/flashSales/dockersale.json";//限时抢购列表页


export default url = {
    width: SWidth,
    height: SHeight,
    SHARE_HOST:SHARE_HOST,API_HOST,API_DETAIL_HOST,
    IS_STORE,H5_HOST, PAY_NO_S_SERVER_HOST, SQZBS3Q,API_NEWHOME_HOST,
    hot_list: getFullUrl(HOT_LIST, API_SEARCH_HOST),
    hot_word: getFullUrl(HOT_WORD, API_SEARCH_HOST),
    keyword_search: getFullUrl(KEYWORD_SEARCH, API_SEARCH_HOST),
    search_store: getFullUrl(SEARCH_STORE, API_SEARCH_HOST),
    category_list: getFullUrl(CATEGORY_LIST, API_SEARCH_HOST),
    filter_data: getFullUrl(FILTER_DATA, API_SEARCH_HOST),
    get_price_by_traceid: getFullUrl(GET_PRICE_BY_TRACEID, API_SEARCH_HOST),
    get_ctjj_menus_cases: getFullUrl(CTJJ_MENUS_CASES, API_NEWHOME_HOST),
    get_topic: getFullUrl(TOPIC, API_NEWHOME_HOST), // 话题,包括视频等
    get_ctjj_nearby: getFullUrl(CTJJ_NEARBY, API_NEWHOME_HOST),
    get_ctjj_nearbyDetail:getFullUrl(CTJJ_NEARBY_DETAIL,API_NEWHOME_HOST) ,
    get_ctjj_programs: getFullUrl(CTJJ_PROGRAMS, API_NEWHOME_HOST),
    get_ctjj_programs_details: getFullUrl(CTJJ_PROGRAMS_DETAILS, API_NEWHOME_HOST),
    get_ctjj_programs_list: getFullUrl(CTJJ_PROGRAMS_LIST, API_NEWHOME_HOST),
    get_ctjj_products_list: getFullUrl(CTJJ_PRODUCTS_LIST, API_NEWHOME_HOST),
    get_ctjj_experts: getFullUrl(CTJJ_EXPERTS, API_NEWHOME_HOST),
    get_ctjj_productlist: getFullUrl(CTJJ_PRODUCTIDLIST, API_NEWHOME_HOST),
    get_ctjj_share_fullhousesolution: getFullUrl(CTJJ_SHARE_FULLHOUSESOLUTION, SHARE_HOST),
    get_ctjj_share_itsolutedetail: getFullUrl(CTJJ_SHARE_ITSOLUTEDETAIL, SHARE_HOST),
    get_home_guess: getFullUrl(HOME_GUESS, API_SEARCH_HOST),
    //日常活动
    get_bannerdaily: getFullUrl(GET_BANNER_DAILY, API_HOST),
    //主题活动
    get_bannertheme_page:getFullUrl(GET_BANNER_THEME, API_HOST),
    //
    get_chara_share_secondlevelstore: getFullUrl(CHARA_SHARE_SECONDLEVELSTORE, SHARE_HOST),
    get_chara_share_specialtystore: getFullUrl(CHARA_SHARE_SPECIALTY, SHARE_HOST),
    get_chara_share_charpage: getFullUrl(CHARA_SHARE_CHARPAGE, SHARE_HOST),

    get_bannertheme: getFullUrl(BANNER_THEME_SHARE, SHARE_HOST),
    get_bannerdaily_share:getFullUrl(BANNER_DAILY_SHARE, SHARE_HOST),
    get_AD: getFullUrl(AD, API_HOST),
    get_ADV: getFullUrl(ADV, API_HOST),

    // 88 码 商家客服组
    get_KFarr: [8800037114, 8800214045, 8800256530, 8800262941, 8800268232, 8800194779, 8800284360, 8800267165, 8800267162, 8700095500, 8800241070],


    // 88 码 商家客服组
    get_KFarr: [8800037114, 8800214045, 8800256530, 8800262941, 8800268232, 8800194779, 8800284360, 8800267165, 8800267162, 8700095500, 8800241070],

    // 特产汇
    get_chara_charaindex: getFullUrl(GET_CHARA_CHARAINDEX, API_HOST),
    get_chara_category: getFullUrl(GET_CHARA_CATEGORY, API_HOST),
    get_chara_cityChara: getFullUrl(GET_CHARA_CITYCHARA, API_HOST),
    get_chara_loadItem: getFullUrl(GET_CHARA_LOADITEM, API_SEARCH_HOST),
    get_chara_data: getFullUrl(GET_CHARA_DATA, API_HOST),
    get_crowd_data: getFullUrl(GET_CROWD_DATA, API_HOST),
    get_cart_num: getFullUrl(GET_CART_NUM,API_HOST),
    get_link_nav: getFullUrl(GET_LINK_NAV,API_HOST),
    get_link_data: getFullUrl(GET_LINK_DATA,API_HOST),
    get_all_specialty: getFullUrl(GET_ALL_SPECIALTY,API_HOST),

    DIY_HOME: getFullUrl(DIY_HOME, API_NEWHOME_HOST),
    DIY_CASELIST: getFullUrl(DIY_CASELIST, API_NEWHOME_HOST),
    DIY_CASELABEL: getFullUrl(DIY_CASELABEL, API_NEWHOME_HOST),
    DIY_CASEDETAILS: getFullUrl(DIY_CASEDETAILS, API_NEWHOME_HOST),
    DIY_DESIGNERLIST: getFullUrl(DIY_DESIGNERLIST, API_NEWHOME_HOST),
    DIY_DESIGNERDETAILS: getFullUrl(DIY_DESIGNERDETAILS, API_NEWHOME_HOST),
    DIY_CASELIST_D: getFullUrl(DIY_CASELIST_D, API_NEWHOME_HOST),
    DIY_DESIGN: getFullUrl(DIY_DESIGN, API_NEWHOME_HOST),
    DIY_DESIGN_SHARE: getFullUrl(DIY_DESIGN_SHARE, SHARE_HOST),
    DIY_CASE_SHARE: getFullUrl(DIY_CASE_SHARE, SHARE_HOST),
    // 单品
    GOODS_DETAIL: getFullUrl(GOODS_DETAIL,API_DETAIL_HOST),
    GOODS_CHECKSTOCK: getFullUrl(GOODS_CHECKSTOCK, API_DETAIL_HOST),
    GOODS_IS_ATTRIBUTE: getFullUrl(GOODS_IS_ATTRIBUTE, API_DETAIL_HOST),
    GOODS_ATTRIBUTE: getFullUrl(GOODS_ATTRIBUTE, API_DETAIL_HOST),
    GOODS_EVALUATE_COUNT: getFullUrl(GOODS_EVALUATE_COUNT, API_DETAIL_HOST),
    CHECKSTOCKFORNUM: getFullUrl(CHECKSTOCKFORNUM, API_DETAIL_HOST),
    SERVICE_PROMISE: getFullUrl(SERVICE_PROMISE, API_DETAIL_HOST),
    GET_SPECIFICATIONS: getFullUrl(GET_SPECIFICATIONS, API_DETAIL_HOST),
    GET_PRODUCTCATENAME: getFullUrl(GET_PRODUCTCATENAME, API_DETAIL_HOST),
    GET_PROMOS: getFullUrl(GET_PROMOS, API_DETAIL_HOST),
    GET_COMMENTSBYCONDITION: getFullUrl(GET_COMMENTSBYCONDITION, API_HOST),
    GET_TOASSESSLIST: getFullUrl(GET_TOASSESSLIST, API_HOST),
    GET_PRODUCTIMPRESSIONS: getFullUrl(GET_PRODUCTIMPRESSIONS, API_HOST),

    TOKEN_GET: getFullUrl(TOKEN_GET, SERVER_DATA_HOST),
    LIFESERVE: getFullUrl(LIFESERVE, API_NEWHOME_HOST),
    LIFEBANNER: getFullUrl(LIFEBANNER, API_NEWHOME_HOST),
    ZHSCENE: getFullUrl(ZHSCENE, API_NEWHOME_HOST),
    SPACE: getFullUrl(SPACE, API_NEWHOME_HOST),
    HAOKANG: getFullUrl(HAOKANG, API_HOST),
    // 第三方链接
    LIVING: config.LIVING,     //云缴费URL
    SZD_URL: config.SZD_URL,   //水之道URL
    // 结算
    CREATORDER: getFullUrl(CREATORDER, API_HOST),
    // 结算
    UPLOAD_IMAGE: getFullUrl(UPLOAD_IMAGE, SERVER_DATA_HOST),
    GETPAGEINFO: getFullUrl(GETPAGEINFO, API_HOST),
    UPDATEPAY: getFullUrl(UPDATEPAY, API_HOST),
    CHECKGIFT: getFullUrl(CHECKGIFT, API_HOST),
    CANCELGIFT: getFullUrl(CANCELGIFT, API_HOST),
    SUBMITORDER: getFullUrl(SUBMITORDER, API_HOST),
    GETSTORECOUPON: getFullUrl(GETSTORECOUPON, API_HOST),
    CHOICESTORECOUPON: getFullUrl(CHOICESTORECOUPON, API_HOST),
    GETORDERCOUPON: getFullUrl(GETORDERCOUPON, API_HOST),
    CHOICEORDERCOUPON: getFullUrl(CHOICEORDERCOUPON, API_HOST),
    GETCANCHOICEDATE: getFullUrl(GETCANCHOICEDATE, API_HOST),
    CHOICEDATE: getFullUrl(CHOICEDATE, API_HOST),
    TOINVOICE: getFullUrl(TOINVOICE, API_HOST),
    SUBMITMEMINVOICE: getFullUrl(SUBMITMEMINVOICE, API_HOST),
    //赠品信息
    GIFTS:getFullUrl(GIFTS,API_HOST),
    P_GIFTS:getFullUrl(P_GIFTS,API_HOST),
    GET_INFO:getFullUrl(GET_INFO,API_DETAIL_HOST),


    // 收获地址
    MEMBERADDRESSES: getFullUrl(MEMBERADDRESSES, API_HOST),
    INSERTADDRESS: getFullUrl(INSERTADDRESS, API_HOST),
    DELITEADDRESS: getFullUrl(DELITEADDRESS, API_HOST),
    DELETEBATCHADDRESS: getFullUrl(DELETEBATCHADDRESS, API_HOST),
    UPDATEADDRESS: getFullUrl(UPDATEADDRESS, API_HOST),
    UPDATEDEFAULTADDRESS: getFullUrl(UPDATEDEFAULTADDRESS, API_HOST),
    CHANGEADDRESS: getFullUrl(CHANGEADDRESS, API_HOST),
    ADDRESS: getFullUrl(ADDRESS, API_HOST),
    READ_ALL_MESSAGE: getFullUrl(READ_ALL_MESSAGE, API_HOST),

    // 支付
    PAYCHECK: getFullUrl(PAYCHECK, API_HOST),
    // 银联支付宝支付数据请求接口
    UNIONPAYREQUEST: getFullUrl(UNIONPAYREQUEST, PAY_SERVER_HOST),
    UNIONPAYRESULT: getFullUrl(UNIONPAYRESULT, PAY_SERVER_HOST),
    OFFICIAL_KQT_URL: config.OFFICIAL_KQT_URL,  // 打开快捷通的链接
    GETKJTACCOUNT: getFullUrl(GETKJTACCOUNT, API_NEWHOME_HOST),  // 获取快捷通token和金额
    OFFICIAL_HRY_URL: OFFICIAL_HRY_URL, // 快捷通回调链接
    OFFICIAL_KQT_URL_LOGIN: config.OFFICIAL_KQT_URL_LOGIN,  // 快捷通统一授权登录页面
    //家装家居
    PRODUCT_CATES:getFullUrl(PRODUC_CATES, API_HOST),
    ADORN_HOME_BANNER:getFullUrl(ADORN_HOME_BANNER,API_HOST),
    TOP_REMMEND_PRODUCTS:getFullUrl(TOP_REMMEND_PRODUCTS,API_HOST),
    LOW_REMMEND_PRODUCTS:getFullUrl(LOW_REMMEND_PRODUCTS,API_HOST),

    //百货超市
    SUPERMARKET_PRODUC_CATES:getFullUrl(SUPERMARKET_PRODUC_CATES, API_HOST),
    SUPERMARKET_ADORN_HOME_BANNER:getFullUrl(SUPERMARKET_ADORN_HOME_BANNER,API_HOST),
    SUPERMARKET_TOP_REMMEND_PRODUCTS:getFullUrl(SUPERMARKET_TOP_REMMEND_PRODUCTS,API_HOST),
    SUPERMARKET_LOW_REMMEND_PRODUCTS:getFullUrl(SUPERMARKET_LOW_REMMEND_PRODUCTS,API_HOST),
    GET_REGIONBYPIDANDRETYPE:getFullUrl(getRegionByPIdAndReType,API_HOST),

    //特产汇
    CHARA_CHARAPAGE:getFullUrl(CHARA_CHARAPAGE,API_HOST),
    COLLECT_CANCEL:getFullUrl(COLLECT_CANCEL,API_HOST),
    COLLECT_STORE:getFullUrl(COLLECT_STORE,API_HOST),

    get_crowdfunding_banner:getFullUrl(CROWDFUNDING_BANNER, API_HOST),
    get_crowdfunding_presale:getFullUrl(CROWDFUNDING_PRESALE, API_HOST),
    get_crowdfunding_successzactivitysn:getFullUrl(CROWDFUNDING_SUCCESSZACTIVITYSN, API_HOST),
    get_crowdfunding_indexzactivitys:getFullUrl(CROWDFUNDING_INDEXZACTIVITYS, API_HOST),
    get_crowdfunding_reserve:getFullUrl(CROWDFUNDING_RESERVE, API_HOST),
    get_crowdfunding_index:getFullUrl(GET_CROWDFUNDING_INDEX, API_HOST),
    get_crowdfunding_list:getFullUrl(GET_CROWDFUNDING_LIST, API_HOST),

    //众筹分享
    CROWDFUNDING_SHARE: getFullUrl(CROWDFUNDING_SHARE, SHARE_HOST),
    GET_INDEX_ZACTIVITYS:getFullUrl(GET_INDEX_ZACTIVITYS,API_HOST),
    GET_ZACTIVITY_SINGLE_PAGE:getFullUrl(GET_ZACTIVITY_SINGLE_PAGE,API_HOST),
    GET_ZHONGCHOU_CHECK:getFullUrl(GET_ZHONGCHOU_CHECK,API_HOST),
    GET_ORDER_PAGEINFO:getFullUrl(GET_ORDER_PAGEINFO,API_HOST),
    POST_SUBMIT_ORDER:getFullUrl(POST_SUBMIT_ORDER,API_HOST),


    //获取发票列表
    GET_MEMBER_INVOICESLIST:getFullUrl(GET_MEMBER_INVOICESLIST,API_HOST),

    GET_IF_CIRCLEPAGE: getFullUrl(IF_CIRCLEPAGE, SERVER_TOP),
    HOMEPAGE_FALSHSALES: getFullUrl(HOMEPAGE_FALSHSALES, API_HOST),//首页限时抢购
    SPECIALTY_FALSHSALES: getFullUrl(SPECIALTY_FALSHSALES, API_HOST),//特产汇限时抢购
    FALSHSALES: getFullUrl(FALSHSALES, API_HOST),//限时抢购列表页
    SQZBS3: getFullUrl(SQZBS3, API_HOST),

    //体验店
    NEARBY_TYPES:getFullUrl(NEARBY_TYPES,API_HOST),
    NEARBY_SOTRE:getFullUrl(NEARBY_SOTRE,API_HOST),
    NEARBY_SOTRE_LIST:getFullUrl(NEARBY_SOTRE_LIST,API_HOST),
    //推广图片接口
    MINE_PROMOTION:getFullUrl(MINE_PROMOTION,API_HOST),

    //认证
    OPEN_HOT_LOTTERY: getFullUrl(OPEN_HOT_LOTTERY, SERVER_DATA_HOST),


    /********** 分享出去 H5 的 url  start ***********/
    GET_REGISTER_SHARE_URL: getFullUrl(register_share_url, SHARE_HOST),
    GET_GOODS_SHARE_URL: getFullUrl(goods_share_url, SHARE_HOST),
    GET_MY_STORE_SHARE_URL: getFullUrl(myStore_share_url, SHARE_HOST),
    GET_COUPONS_LIST_SHARE_URL: getFullUrl(couponsList_share_url, SHARE_HOST),
    GET_ABOUT_US_URL: getFullUrl(aboutUs_url, SHARE_HOST),
    GET_NEW_HAND_URL: getFullUrl(newHand_url, SHARE_HOST),

    /********** 分享出去 H5 的 url  end ***********/
}
