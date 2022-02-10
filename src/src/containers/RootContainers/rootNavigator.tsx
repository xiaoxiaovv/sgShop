import * as React from 'react';
import { View, Image, Text, Platform, StyleSheet, Easing, Animated } from 'react-native';
import Home from '../Home';
import SeeMore from '../Home/SeeMore/SeeMore';
import ApplyForCard from '../Home/SeeMore/ApplyForCard';
import Familytry from '../Home/SeeMore/Familytry';
import Cart from '../Cart';
import Mine from '../Mine';
import Community from '../Community';
import SuperSecondView from '../Community/SuperSecondView';
import CommunityWeb from '../Community/CommunityWeb';
import CommunityWeb3 from '../Community/CommunityWeb3';
import Category from '../Categories';
import { StackNavigator } from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import Evaluate from '../GoodsDetail/Evaluate/Evaluate';
import RootTabs from './rootTabs';
import Address from '../Mine/Address';
import ClassRoom from '../Mine/ClassRoom';
import NewAddress from '../Mine/NewAddress';
import EditAddress from '../Mine/EditAddress';
import TabMain from './rootTabs';
import GoodsDetail from '../GoodsDetail';
import GoodsList from '../Categories/GoodsList';
import PasswordReset from '../Mine/Password/PasswordReset';
import orderMsg from '../Message/orderMsg';
import platformMsg from '../Message/platformMsg';
import MsgItemDetail from '../Message/MsgItemDetail';
import memberMsg from '../Message/memberMsg';
import communityMsg from '../Message/communityMsg';
import MessageDetail from '../Message/MessageDetail';
import Coin from '../Message/Coin/Coin';
import AccountSafty from '../Mine/Password/Account';
import TelVerify from '../Mine/Password/TelVerify';
import BindNewTel from '../Mine/Password/BindNewTel';
import TelChangeSuccess from '../Mine/Password/TelChangeSuccess';
import TelSecond from '../Mine/Password/TelSecond';
import myIdCardAuthen from '../Mine/Password/myIdCardAuthen';
import TelThird from '../Mine/Password/TelThird';
import TelPhone from '../Mine/Password/TelPhone';
import Store from '../Mine/Store/Store';
import QRCodeScannerView from '../../components/QRCode';
import ShopRevenue from '../Mine/Store/ShopRevenue';
import MyKJT from '../Mine/MyKJT';
import DataSummary from '../Mine/Store/DataSummary';
import DataSummaryWeb from '../Mine/Store/DataSummaryWeb';
import ShunguangSchool from '../Mine/Store/ShunguangSchool';
import ShunguangSchoolDetail from '../Mine/Store/ShunguangSchoolDetail';
import StoreInfo from '../Mine/Store/StoreInfo';
import RevenueDetail from '../Mine/Store/RevenueDetail';
import Search from '../Search';
import AccountSetUp from '../Mine/AccountSetUp';
import Login from '../Login';
import DataAnalysis from '../Mine/Store/DataAnalysis';
import VIPCenter from '../Mine/Store/VIPCenter';
import VIPCenterWeb from '../Mine/Store/VIPCenterWeb'; // H5
import OrderList from '../Mine/Order';
import OrderSearch from '../Mine/Order/OrderSearch';
import OrderDetail from '../Mine/Order/OrderDetail';
import Retainage from '../Mine/Order/Retainage';
import OrderTrack from '../Mine/Order/OrderTrack';
import ConfirmReceive from '../Mine/Order/ConfirmReceive';
import RefundDetail from '../Mine/Order/RefundDetail';
import OrderAssess from '../Mine/Order/OrderAssess';
import LookAssess from '../Mine/Order/LookAssess';
import ChaseAssess from '../Mine/Order/ChaseAssess';
import AssessSuccess from '../Mine/Order/AssessSuccess';
import ApplyRefund from '../Mine/Order/ApplyRefund';
import VIPCompetition from '../Mine/Store/VIPCompetition';
import CommitOrder from '../CommitOrder/index';
import TeamSupervise from '../Mine/Store/TeamSupervise';
import CustomWebView from '../webview/CustomWebView';
import Authentication from '../Mine/Store/Authentication';
import HaierStaffAuthentication from '../Mine/Store/HaierStaffAuthentication';
import IdentityAuthenticated from '../Mine/Store/IdentityAuthenticated';
import IdentityAuthentication from '../Mine/Store/IdentityAuthentication';
import HaierStaffAuthenticated from '../Mine/Store/HaierStaffAuthenticated';
import Payment from '../Payment/';
import PaymentResult from '../Payment/PaymentResult';
import CommitSuccess from '../Payment/CommitSuccess';
import Receipt from '../Receipt/index';
import NickName from '../Mine/SetUp/NickName';
import Gender from '../Mine/SetUp/Gender';
import SetUpOne from '../Mine/SetUp/SetUpOne';
import MyCollect from '../Mine/MyCollect';
import MyReserve from '../Mine/MyReserve';
// import CouponsCenter from '../Mine/Coupons/CouponsCenter';
// import CouponDetail from '../Mine/Coupons/CouponDetail';
// import CouponGoods from '../Mine/Coupons/CouponGoods';
import StoreHome from '../Mine/Store/StoreHome';
import StoreHomeType from '../Mine/Store/StoreHomeType';
import RevenueRule from '../Mine/Store/RevenueRule';
import Register from '../Login/Register';
import AgreementWebview from '../webview/AgreementWebview';
import HelpWebview from '../webview/HelpWebview';
import OpenStore from '../Login/OpenStore';
import ShopApplySuccess from '../Login/ShopApplySuccess';
import ResetPassword from '../Login/ResetPassword';
import MyInvestment from '../Mine/MyInvestment';
import ManageMoney from '../Mine/ManageMoney';
import CommonUnion from '../Login/CommonUnion';
import CommissionDetail from '../Mine/Store/CommissionDetail';
import MyCoupon from '../MyCoupon';
import MyGold from '../Mine/MyGold';
import Mywallet from '../Mine/Mywallet';
import WalletIntegral from '../Mine/Mywallet/walletIntegral';
import WalletDiamonds from '../Mine/Mywallet/walletDiamonds';
import UseCoupon from '../MyCoupon/UseCoupon';
import CouponCenter from '../MyCoupon/CouponCenter';
import CanUseCouponList from '../CommitOrder/CanUseCouponList';
import ChoiceGifts from '../CommitOrder/choiceGifts';

import BindMobile from '../Acount/bineMobile';
import Huabei from '../Huabei';
import BankFenqi from '../BankFenqi';
import MonthReward from '../Mine/Store/MonthReward';
import SomeReward from '../Mine/Store/SomeReward';
import OtherReward from '../Mine/Store/OtherReward';
import MissionShare from '../Mine/Mission/MissionShare';
import HistoryMission from '../Mine/Mission/HistoryMission';
import MissionDetail from '../Mine/Mission/MissionDetail';
import WithdrawManagement from '../Mine/Store/WithdrawManagement';
import BankCardManagement from '../Mine/Store/BankCardManagement';
import SupportingBanks from '../Mine/Store/SupportingBanks';
import BaiTiao from '../BaiTiao';
import VideoPlayer from '../VideoPlayer';
import TeamateProfile from '../Mine/Store/TeamateProfile';
import UserSearch from '../Mine/Store/UserSearch';
import UserProfile from '../Mine/Store/UserProfile';
import ShopRenovate from '../Mine/Store/ShopRenovate';
import ChoosingShopTemplate from '../Mine/Store/ChoosingShopTemplate';
import SetShopCover from '../Mine/Store/SetShopCover';
import ScenePage from '../NewHome/Furniture/ScenePage';
import HouseholdAppliances from '../HouseholdAppliances';
import NewRegister from '../Register';
import OpenStoreSuccess from '../Register/openStoreSuccess';

import BannerTheme from '../BannerActivity/BannerTheme';
import BannerDaily from '../BannerActivity/BannerDaily';
import CustomPage from '../BannerActivity/CustomPage';
import ReceiptList from '../Receipt/ReceiptList'
const NavColor = '#f6f6f6';

import NewHomeNAV from './../NewHome/pages';
import PaymentFailed from '../Payment/PaymentFailed';
import HomeDress from '../HomeDress/HomeDress';
import SuperMaket from '../HomeDress/SuperMarcket';
import CharaPage from '../HomeDress/CharaPage';
import FlashSale from '../FlashSale';
import CommonWebview from '../webview/CommonWebview';
import CustomPageWeb from '../webview/CustomPageWeb';
import MyLearn from "../Mine/MyLearn";

export const NavBarConfig = {
    headerStyle: { backgroundColor: NavColor, justifyContent: 'center' },
    headerTitleStyle: { color: '#333333',
                        flex: 1,
                        textAlign: 'center',
                        alignSelf: 'center',
                        fontSize: 17,
                        fontWeight: 'normal',
                        letterSpacing: -0.41},
    headerRight: (<View style = {{width: 40}}/>),
    headerTintColor: '#878787',
    headerBackTitle: null,
};

const Routes = {
    RootTabs: {
        screen: RootTabs,
        navigationOptions: {
          // 让TabBar控制的五个页面默认没有返回按钮
          headerLeft: null,
        },
    },
    ...NewHomeNAV,

    Receipt: {
        name: '开具发票',
        screen: Receipt,
        // navigationOptions: {
        //   title: '开具发票',
        //   ...NavBarConfig,
        //   headerRight:null,
        // },
    },
    ReceiptList:{
        navigationOptions: {
            header: null,
        },
        name: '选择发票抬头',
        screen: ReceiptList,
    },
    CommitOrder: {
        screen: CommitOrder,
        navigationOptions: {
            header: null,
        //   title: '填写订单',
           ...NavBarConfig,
        },
    },
    Home: {
        screen: Home,
        navigationOptions: {
            header: null,
        },
    },
    SeeMore: {
        title: '更多服务',
        screen: SeeMore,
        navigationOptions: {
            header: null,
        },
    },
    ApplyForCard: {
        title: '联名卡申请',
        screen: ApplyForCard,
        navigationOptions: {
            header: null,
        },
    },
    Familytry: {
        title: '智慧家庭',
        screen: Familytry,
        navigationOptions: {
            header: null,
        },
    },
    NewRegister: {
        screen: NewRegister,
        navigationOptions: {
            header: null,
        },
    },
    OpenStoreSuccess: {
        screen: OpenStoreSuccess,
        navigationOptions: {
            header: null,
        },
    },
    Login: {
        screen: Login,
        navigationOptions: {
            header: null,
        },
    },
    BannerTheme: {
        screen: BannerTheme,
        navigationOptions: {
            header: null,
        },
    },
    BannerDaily: {
        screen: BannerDaily,
        navigationOptions: {
            header: null,
        },
    },
    CustomPage: {
        screen: CustomPage,
        navigationOptions: {
            header: null,
        },
    },
    Search: {
        screen: Search,
        navigationOptions: {
            header: null,
        },
    },
    Category: {
        name: '分类',
        screen: Category,
        navigationOptions: {
            header: null,
            // title: '分类',
            // ...NavBarConfig,
        },
    },
    Evaluate: {
        name: '评价',
        screen: Evaluate,
        navigationOptions: {
            header: null,
            // title: '分类',
            // ...NavBarConfig,
        },
    },
    BindMobile: {
        name: '绑定手机号',
        screen: BindMobile,
        navigationOptions: {
            title: '绑定手机号',
            ...NavBarConfig,
        },
    },
    CustomWebView: {
        name: '活动页面',
        screen: CustomWebView,
        navigationOptions: {
            header: null,
            gesturesEnabled: false,
        },
    },
    Cart: {
      name: '购物车',
        screen: Cart,
        navigationOptions: {
            // title: '购物车',
            // ...NavBarConfig,
            header: null,
        },
    },
    Payment: {
      name: '订单支付',
      screen: Payment,
      navigationOptions: {
        header: null,
      },
    },
    PaymentResult: {
        name: '付款成功',
        screen: PaymentResult,
        navigationOptions: {
            header: null,
        },
      },
    CommitSuccess: {
      name: '提交成功',
      screen: CommitSuccess,
      navigationOptions: {
          title: '提交成功',
          ...NavBarConfig,
      },
    },
    Mine: {
        name: '个人中心',
        screen: Mine,
        navigationOptions: {
            title: '个人中心',
            ...NavBarConfig,
            header: null,
        },
    },
    QRCodeScannerView: {
        name: '二维码扫描',
        screen: QRCodeScannerView,
        navigationOptions: {
            header: false,
        },
    },
    Community: {
        name: '社区',
        screen: Community,
        navigationOptions: {
            title: '社区',
            ...NavBarConfig,
        },
    },
    SuperSecondView: {
        name: '社区',
        screen: SuperSecondView,
        navigationOptions: {
            header: false,
        },
    },
    CommunityWeb: {
        name: '社区争霸赛 Web',
        screen: CommunityWeb,
        navigationOptions: {
            header: null,
        },
    },
    CommunityWeb3: {
        name: '社区争霸赛 Web 3 期',
        screen: CommunityWeb3,
        navigationOptions: {
            header: null,
        },
    },
    Address: {
        name: '管理收货地址',
        screen: Address,
    },
    ClassRoom: {
        name: '顺逛学院',
        screen: ClassRoom,
        navigationOptions: {
            title: '顺逛学院',
            ...NavBarConfig,
        },
    },
    NewAddress: {
        name: '新建收货地址',
        screen: NewAddress,
    },
    EditAddress: {
        name: '修改收货地址',
        screen: EditAddress,
    },
    GoodsDetail: {
        name: '商品详情',
        screen: GoodsDetail,
        navigationOptions: {
            header: false,
            gesturesEnabled: false,
        },
    },
    // 搜索结果列表
    GoodsList: {
        name: '商品列表',
        screen: GoodsList,
        navigationOptions: {
            title: '商品列表',
            ...NavBarConfig,
        },
    },
    AccountSetUp: {
        name: '账户设置',
        screen: AccountSetUp,
        navigationOptions: {
            title: '账户设置',
            header: false,
            ...NavBarConfig,
        },
    },
    Store: {
        name: '店铺管理',
        screen: Store,
        navigationOptions: {
            header: null,
            // title: '店铺管理',
            // ...NavBarConfig,
        },
    },
    StoreInfo: {
        name: '店铺信息',
        screen: StoreInfo,
        navigationOptions: {
            title: '店铺信息',
            ...NavBarConfig,
        },
    },
    ShopRevenue: {
        name: '我的营收',
        screen: ShopRevenue,
        navigationOptions: {
            title: '我的营收',
            header: false,
            ...NavBarConfig,
        },
    },
    PasswordReset: {
        name: '密码重置',
        screen: PasswordReset,
        navigationOptions: {
            title: '密码重置',
            ...NavBarConfig,
        },
    },
    AccountSafty: {
        name: '账户安全',
        screen: AccountSafty,
        navigationOptions: {
            title: '账户安全',
            ...NavBarConfig,
        },
    },
    TelPhone: {
        name: '手机号管理',
        screen: TelPhone,
        navigationOptions: {
            title: '手机号管理',
            ...NavBarConfig,
        },
    },
    TelVerify: {
        name: '身份认证',
        screen: TelVerify,
        navigationOptions: {
            title: '身份认证',
            ...NavBarConfig,
        },
    },
    BindNewTel: {
        name: '身份认证',
        screen: BindNewTel,
        navigationOptions: {
            title: '身份认证',
            ...NavBarConfig,
        },
    },
    TelChangeSuccess: {
        name: '手机绑定',
        screen: TelChangeSuccess,
        navigationOptions: {
            title: '手机绑定',
            ...NavBarConfig,
        },
    },
    TelSecond: {
        name: '身份认证',
        screen: TelSecond,
        navigationOptions: {
            title: '身份认证',
            ...NavBarConfig,
        },
    },
    myIdCardAuthen: {
        name: '身份认证',
        screen: myIdCardAuthen,
        navigationOptions: {
            title: '身份认证',
            ...NavBarConfig,
        },
    },
    TelThird: {
        name: '身份认证',
        screen: TelThird,
        navigationOptions: {
            title: '身份认证',
            ...NavBarConfig,
        },
    },
    MessageDetail: {
        name: '消息中心',
        screen: MessageDetail,
        navigationOptions: {
           header: null,
        },
    },
    Coin: {
        name: '金币记录',
        screen: Coin,
        navigationOptions: {
            title: '金币记录',
            ...NavBarConfig,
        },
    },
    orderMsg: {
        name: '订单消息',
        screen: orderMsg,
        navigationOptions: {
            title: '订单消息',
            ...NavBarConfig,
        },
    },
    platformMsg: {
        name: '平台消息',
        screen: platformMsg,
        navigationOptions: {
            title: '平台消息',
            ...NavBarConfig,
        },
    },
    MsgItemDetail: {
        name: '话题详情',
        screen: MsgItemDetail,
        navigationOptions: {
            title: '话题详情',
            ...NavBarConfig,
        },
    },
    memberMsg: {
        name: '会员动态',
        screen: memberMsg,
        navigationOptions: {
            title: '会员动态',
            ...NavBarConfig,
        },
    },
    communityMsg: {
        name: '社区动态',
        screen: communityMsg,
        navigationOptions: {
            title: '社区动态',
            ...NavBarConfig,
        },
    },
    RevenueRule: {
        name: '营收结算规则',
        screen: RevenueRule,
        navigationOptions: {
            header: false,
        },
    },
    RevenueDetail: {
        name: '预计收益',
        screen: RevenueDetail,
    },
    MonthReward: {
        name: '月度奖励',
        screen: MonthReward,
        navigationOptions: {
            title: '月度奖励',
            ...NavBarConfig,
        },
    },
    SomeReward: {
        name: '非预计收益奖励',
        screen: SomeReward,
    },
    OtherReward: {
        name: '其他奖励',
        screen: OtherReward,
        navigationOptions: {
            title: '其他奖励',
            ...NavBarConfig,
        },
    },
    BankCardManagement: {
        name: '提现管理',
        screen: BankCardManagement,
    },
    WithdrawManagement: {
        name: '提现',
        screen: WithdrawManagement,
        navigationOptions: {
            title: '提现',
            ...NavBarConfig,
        },
    },
    SupportingBanks: {
        name: '支持银行',
        screen: SupportingBanks,
        navigationOptions: {
            title: '支持银行',
            ...NavBarConfig,
        },
    },
    ShunguangSchool: {
        name: '微店课堂',
        screen: ShunguangSchool,
        navigationOptions: {
            title: '顺逛微学堂',
            ...NavBarConfig,
        },
    },
    ShunguangSchoolDetail: {
        name: '微学堂详情',
        screen: ShunguangSchoolDetail,
        navigationOptions: {
            title: '微学堂详情',
            ...NavBarConfig,
        },
    },
    DataSummary: {
        name: '数据统计',
        screen: DataSummaryWeb,
        // screen: DataSummary,
        // navigationOptions: {
        //     title: '店铺管理',
        //     ...NavBarConfig,
        // },
    },
    DataAnalysis: {
        name: '微店主数据分析',
        screen: DataAnalysis,
    },
    VIPCenter: {
        name: '会员中心',
        screen: VIPCenterWeb,
        // screen: VIPCenter,
    },
    TeamSupervise: {
        name: '团队管理',
        screen: TeamSupervise,
        navigationOptions: {
            header: null,
        },
    },
    TeamateProfile: {
        name: '团队成员基本信息',
        screen: TeamateProfile,
        navigationOptions: {
            header: null,
        },
    },
    UserProfile: {
        name: '用户详细信息',
        screen: UserProfile,
        navigationOptions: {
            header: null,
        },
    },
    UserSearch: {
        name: '用户搜索',
        screen: UserSearch,
        navigationOptions: {
        header: null,
        },
    },
    VIPCompetition: {
        name: '会员竞争力',
        screen: VIPCompetition,
        navigationOptions: {
            title: '会员竞争力',
            ...NavBarConfig,
        },
    },
    OrderList: {
        name: '全部订单',
        screen: OrderList,
        //  打开链接为: shunguang://orderList/0/1
        path: 'orderList/:orderFlag/:orderStatus',
        navigationOptions: {
            header: null,
        },
    },
    OrderDetail: {
        name: '订单详情',
        screen: OrderDetail,
        navigationOptions: {
            header: null,
        },
    },
    Retainage: {
        name: '可用优惠卷',
        screen: Retainage,
        navigationOptions: {
            header: null,
        },
    },
    OrderSearch: {
        name: '搜索订单',
        screen: OrderSearch,
        navigationOptions: {
            header: null,
        },
    },
    OrderTrack: {
        name: '追踪订单',
        screen: OrderTrack,
        navigationOptions: {
            header: null,
        },
    },
    RefundDetail: {
        name: '退款详情',
        screen: RefundDetail,
        navigationOptions: {
            header: null,
        },
    },
    OrderAssess: {
        name: '订单评价',
        screen: OrderAssess,
        navigationOptions: {
            header: null,
        },
    },
    ConfirmReceive: {
        name: '确认收货',
        screen: ConfirmReceive,
        navigationOptions: {
            header: null,
        },
    },
    ChaseAssess: {
        name: '追加评价',
        screen: ChaseAssess,
        navigationOptions: {
            header: null,
        },
    },
    AssessSuccess: {
        name: '评价成功',
        screen: AssessSuccess,
        navigationOptions: {
            header: null,
        },
    },
    LookAssess: {
        name: '查看评价',
        screen: LookAssess,
        navigationOptions: {
            header: null,
        },
    },
    ApplyRefund: {
        name: '申请退款',
        screen: ApplyRefund,
        navigationOptions: {
            header: null,
        },
    },
    Authentication: {
        name: '我的认证',
        screen: Authentication,
        navigationOptions: {
            header: null,
            },
    },
    HaierStaffAuthentication: {
        name: '海尔员工认证（未认证）',
        screen: HaierStaffAuthentication,
        navigationOptions: {
            header: null,
            },
    },
    HaierStaffAuthenticated: {
        name: '海尔员工认证（已认证）',
        screen: HaierStaffAuthenticated,
        navigationOptions: {
            header: null,
            },
    },
    IdentityAuthentication: {
        name: '身份证认证（未认证）',
        screen: IdentityAuthentication,
        navigationOptions: {
            header: null,
            },
    },
    IdentityAuthenticated: {
        name: '身份证认证（已认证）',
        screen: IdentityAuthenticated,
        navigationOptions: {
            header: null,
            },
    },
    NickName: {
        name: '昵称',
        screen: NickName,
    },
    Gender: {
        name: '性别',
        screen: Gender,
    },
    SetUpOne: {
        name: '通用设置',
        screen: SetUpOne,
    },
    MyCollect: {
        name: '我的收藏',
        screen: MyCollect,
    },
    MyReserve: {
        name: '我的预约',
        screen: MyReserve,
    },
    // CouponsCenter: {
    //     name: '领券中心',
    //     screen: CouponsCenter,
    //     navigationOptions: {
    //         title: '领券中心',
    //         ...NavBarConfig,
    //     },
    // },
    // CouponDetail: {
    //     name: '优惠券详情',
    //     screen: CouponDetail,
    //     navigationOptions: {
    //         title: '优惠券详情',
    //         ...NavBarConfig,
    //     },
    // },
    // CouponGoods: {
    //     name: '商品列表',
    //     screen: CouponGoods,
    //     navigationOptions: {
    //         title: '商品列表',
    //         ...NavBarConfig,
    //     },
    // },
    StoreHome: {
        name: '我的店铺首页',
        screen: StoreHome,
        navigationOptions: {
            header: null,
        },
    },
    StoreHomeType: {
        name: '分类',
        screen: StoreHomeType,
        navigationOptions: {
            title: '分类',
            ...NavBarConfig,
        },
    },
    ShopRenovate: {
        name: '店铺装修',
        screen: ShopRenovate,
        navigationOptions: {
            title: '店铺装修',
            ...NavBarConfig,
        },
    },
    ChoosingShopTemplate: {
        name: '选择店铺模版',
        screen: ChoosingShopTemplate,
        navigationOptions: {
            header: null,
        },
    },
    SetShopCover: {
        name: '设置店铺封面',
        screen: SetShopCover,
      navigationOptions: {
        title: '设置店铺封面',
        ...NavBarConfig,
      },
    },
    Register: {
        name: '注册',
        screen: Register,
        navigationOptions: {
            header: null,
        },
    },
    AgreementWebview: {
        name: '顺逛帮助',
        screen: AgreementWebview,
        navigationOptions: {
            ...NavBarConfig,
        },
    },
    HelpWebview: {
        name: '顺逛帮助',
        screen: HelpWebview,
        navigationOptions: {
            ...NavBarConfig,
        },
    },
    OpenStore: {
        name: '申请开店',
        screen: OpenStore,
        navigationOptions: {
            title: '完善信息',
            ...NavBarConfig,
        },
    },
    CommonUnion: {
        name: '联盟分类',
        screen: CommonUnion,
        navigationOptions: {
            title: '联盟分类',
            ...NavBarConfig,
        },
    },
    ShopApplySuccess: {
        name: '开店成功',
        screen: ShopApplySuccess,
        navigationOptions: {
            title: '开店申请',
            headerLeft: null,
            ...NavBarConfig,
        },
    },
    ResetPassword: {
        name: '忘记密码',
        screen: ResetPassword,
        navigationOptions: {
            title: '找回密码',
            ...NavBarConfig,
        },
    },
    MyKJT: {  // 我的营收进入这个快捷通界面
        name: '快捷通',
        screen: MyKJT,
        navigationOptions: {
            title: '快捷通',
            header: null,
        },
    },
    MyInvestment: {
        name: '我的投资',
        screen: MyInvestment,
        navigationOptions: {
            title: '投资',
            header: null,
        },
    },
    MyKJT: {  // 我的营收进入这个快捷通界面
        name: '快捷通',
        screen: MyKJT,
        navigationOptions: {
            title: '快捷通',
            header: null,
        },
    },
    ManageMoney: {
        name: '我的投资',
        screen: ManageMoney,
        navigationOptions: {
            title: '投资',
            // header: null,
        },
    },
    CommissionDetail: {
        name: '佣金',
        screen: CommissionDetail,
        navigationOptions: {
            title: '佣金',
            ...NavBarConfig,
            header: null,
        },
    },
    MyCoupon: {
        name: '我的优惠券',
        screen: MyCoupon,
        navigationOptions: {
            header: null,
        },
    },
    MyGold: {
        name: '金币记录',
        screen: MyGold,
        navigationOptions: {
            header: null,
        },
    },
    Mywallet: {
        name: '我的钱包',
        screen: Mywallet,
        navigationOptions: {
            title: '我的钱包',
            header: false,
            ...NavBarConfig,
        },
    },
    WalletIntegral: {
        name: '积分明细',
        screen: WalletIntegral,
        navigationOptions: {
            title: '积分明细',
            ...NavBarConfig,
        },
    },
    WalletDiamonds: {
        name: '钻石明细',
        screen: WalletDiamonds,
        navigationOptions: {
            header: null,
        },
    },
    UseCoupon: {
        name: '使用优惠券',
        screen: UseCoupon,
        navigationOptions: {
            title: '商品列表',
            ...NavBarConfig,
        },
    },
    CouponCenter: {
        name: '领券中心',
        screen: CouponCenter,
    },
    CanUseCouponList: {
        name: '可用优惠券',
        screen: CanUseCouponList,
    },
    Huabei: {
        name: '花呗分期',
        screen: Huabei,
        navigationOptions: {
            title: '花呗分期',
            ...NavBarConfig,
        },
    },
    BankFenqi: {
        name: '银行卡支付',
        screen: BankFenqi,
    },
    MissionShare: {
        name: '任务分享',
        screen: MissionShare,
    },
    HistoryMission: {
        name: '历史任务',
        screen: HistoryMission,
        navigationOptions: {
            title: '历史任务',
            ...NavBarConfig,
        },
    },
    MissionDetail: {
        name: '任务详情',
        screen: MissionDetail,
    },
    VideoPlayer: {
        name: '视频播放',
        screen: VideoPlayer,
        navigationOptions: {
            header: null,
        },
    },
    BaiTiao: {
        name: '白条',
        screen: BaiTiao,
        navigationOptions: {
            title: '顺逛白条',
            ...NavBarConfig,
        },
    },
    ScenePage: {
        name: '智家场景',
        screen: ScenePage,
        navigationOptions: {
            header: null,
        },
    },
    PaymentFailed: {
        name: '支付失败',
        screen: PaymentFailed,
      navigationOptions: {
        title: '支付失败',
        ...NavBarConfig,
        headerLeft: null,
        headerRight: null,
      },
    },
    HouseholdAppliances: {
        name: '家用电器',
        screen: HouseholdAppliances,
        navigationOptions: {
            header: null,
        },
    },
    HomeDress:{
        name:'HomeDress',
        screen:HomeDress,
        navigationOptions: {
            header: null,
        },
    },
    SuperMaket:{
        name:'SuperMaket',
        screen:SuperMaket,
        navigationOptions: {
            header: null,
        },
    },
    FlashSale: {
        name: '限时抢购',
        screen: FlashSale,
        navigationOptions: {
            header: null,
        },
    },
    CharaPage:{
        name:'省场馆',
        screen:CharaPage,
        navigationOptions: {
            header: null,
        },
    },
    ChoiceGifts:{
        name:'选择赠品',
        screen:ChoiceGifts,
        navigationOptions:{
            header:null,
        }
    },
    MyLearn:{
        name:'新手必读',
        screen:MyLearn,
    },
    CommonWebview:{
        name:'',
        screen:CommonWebview,
        navigationOptions:{
            header:null,
        }
    },
    CustomPageWeb: {
        name: 'CustomPageWeb',
        screen:CustomPageWeb,
        navigationOptions:{
            header:null,
        }
    }
};
// 根导航组件
const RootNavigator = StackNavigator(
    { ...Routes },
    {
        // 初始化的路由名称
        initialRouteName: 'RootTabs',
        // initialRouteName: 'NewRegister',
        // initialRouteName: 'OpenStoreSuccess',
        // initialRouteName: 'OpenStore',
        headerMode: 'float',
        navigationOptions: () => ({
            ...NavBarConfig,
        }),
        // 让安卓界面push动画与ios相同
        transitionConfig: () => ({
            screenInterpolator: CardStackStyleInterpolator.forHorizontal,
        }),
        // 界面切换发生前的回调函数
        onTransitionStart: ({navigation}) => {
            // Log('navigationStart:', navigation);
            // Log('navigation params: ', navigation.params);
        },
        // 界面切换完成后的回调函数
        onTransitionEnd: ({navigation}) => {
            // Log('navigationEnd:', navigation);
        },
    },
);

// 导出根导航组件
export default RootNavigator;
