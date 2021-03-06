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
          // ???TabBar?????????????????????????????????????????????
          headerLeft: null,
        },
    },
    ...NewHomeNAV,

    Receipt: {
        name: '????????????',
        screen: Receipt,
        // navigationOptions: {
        //   title: '????????????',
        //   ...NavBarConfig,
        //   headerRight:null,
        // },
    },
    ReceiptList:{
        navigationOptions: {
            header: null,
        },
        name: '??????????????????',
        screen: ReceiptList,
    },
    CommitOrder: {
        screen: CommitOrder,
        navigationOptions: {
            header: null,
        //   title: '????????????',
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
        title: '????????????',
        screen: SeeMore,
        navigationOptions: {
            header: null,
        },
    },
    ApplyForCard: {
        title: '???????????????',
        screen: ApplyForCard,
        navigationOptions: {
            header: null,
        },
    },
    Familytry: {
        title: '????????????',
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
        name: '??????',
        screen: Category,
        navigationOptions: {
            header: null,
            // title: '??????',
            // ...NavBarConfig,
        },
    },
    Evaluate: {
        name: '??????',
        screen: Evaluate,
        navigationOptions: {
            header: null,
            // title: '??????',
            // ...NavBarConfig,
        },
    },
    BindMobile: {
        name: '???????????????',
        screen: BindMobile,
        navigationOptions: {
            title: '???????????????',
            ...NavBarConfig,
        },
    },
    CustomWebView: {
        name: '????????????',
        screen: CustomWebView,
        navigationOptions: {
            header: null,
            gesturesEnabled: false,
        },
    },
    Cart: {
      name: '?????????',
        screen: Cart,
        navigationOptions: {
            // title: '?????????',
            // ...NavBarConfig,
            header: null,
        },
    },
    Payment: {
      name: '????????????',
      screen: Payment,
      navigationOptions: {
        header: null,
      },
    },
    PaymentResult: {
        name: '????????????',
        screen: PaymentResult,
        navigationOptions: {
            header: null,
        },
      },
    CommitSuccess: {
      name: '????????????',
      screen: CommitSuccess,
      navigationOptions: {
          title: '????????????',
          ...NavBarConfig,
      },
    },
    Mine: {
        name: '????????????',
        screen: Mine,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
            header: null,
        },
    },
    QRCodeScannerView: {
        name: '???????????????',
        screen: QRCodeScannerView,
        navigationOptions: {
            header: false,
        },
    },
    Community: {
        name: '??????',
        screen: Community,
        navigationOptions: {
            title: '??????',
            ...NavBarConfig,
        },
    },
    SuperSecondView: {
        name: '??????',
        screen: SuperSecondView,
        navigationOptions: {
            header: false,
        },
    },
    CommunityWeb: {
        name: '??????????????? Web',
        screen: CommunityWeb,
        navigationOptions: {
            header: null,
        },
    },
    CommunityWeb3: {
        name: '??????????????? Web 3 ???',
        screen: CommunityWeb3,
        navigationOptions: {
            header: null,
        },
    },
    Address: {
        name: '??????????????????',
        screen: Address,
    },
    ClassRoom: {
        name: '????????????',
        screen: ClassRoom,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    NewAddress: {
        name: '??????????????????',
        screen: NewAddress,
    },
    EditAddress: {
        name: '??????????????????',
        screen: EditAddress,
    },
    GoodsDetail: {
        name: '????????????',
        screen: GoodsDetail,
        navigationOptions: {
            header: false,
            gesturesEnabled: false,
        },
    },
    // ??????????????????
    GoodsList: {
        name: '????????????',
        screen: GoodsList,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    AccountSetUp: {
        name: '????????????',
        screen: AccountSetUp,
        navigationOptions: {
            title: '????????????',
            header: false,
            ...NavBarConfig,
        },
    },
    Store: {
        name: '????????????',
        screen: Store,
        navigationOptions: {
            header: null,
            // title: '????????????',
            // ...NavBarConfig,
        },
    },
    StoreInfo: {
        name: '????????????',
        screen: StoreInfo,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    ShopRevenue: {
        name: '????????????',
        screen: ShopRevenue,
        navigationOptions: {
            title: '????????????',
            header: false,
            ...NavBarConfig,
        },
    },
    PasswordReset: {
        name: '????????????',
        screen: PasswordReset,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    AccountSafty: {
        name: '????????????',
        screen: AccountSafty,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    TelPhone: {
        name: '???????????????',
        screen: TelPhone,
        navigationOptions: {
            title: '???????????????',
            ...NavBarConfig,
        },
    },
    TelVerify: {
        name: '????????????',
        screen: TelVerify,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    BindNewTel: {
        name: '????????????',
        screen: BindNewTel,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    TelChangeSuccess: {
        name: '????????????',
        screen: TelChangeSuccess,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    TelSecond: {
        name: '????????????',
        screen: TelSecond,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    myIdCardAuthen: {
        name: '????????????',
        screen: myIdCardAuthen,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    TelThird: {
        name: '????????????',
        screen: TelThird,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    MessageDetail: {
        name: '????????????',
        screen: MessageDetail,
        navigationOptions: {
           header: null,
        },
    },
    Coin: {
        name: '????????????',
        screen: Coin,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    orderMsg: {
        name: '????????????',
        screen: orderMsg,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    platformMsg: {
        name: '????????????',
        screen: platformMsg,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    MsgItemDetail: {
        name: '????????????',
        screen: MsgItemDetail,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    memberMsg: {
        name: '????????????',
        screen: memberMsg,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    communityMsg: {
        name: '????????????',
        screen: communityMsg,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    RevenueRule: {
        name: '??????????????????',
        screen: RevenueRule,
        navigationOptions: {
            header: false,
        },
    },
    RevenueDetail: {
        name: '????????????',
        screen: RevenueDetail,
    },
    MonthReward: {
        name: '????????????',
        screen: MonthReward,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    SomeReward: {
        name: '?????????????????????',
        screen: SomeReward,
    },
    OtherReward: {
        name: '????????????',
        screen: OtherReward,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    BankCardManagement: {
        name: '????????????',
        screen: BankCardManagement,
    },
    WithdrawManagement: {
        name: '??????',
        screen: WithdrawManagement,
        navigationOptions: {
            title: '??????',
            ...NavBarConfig,
        },
    },
    SupportingBanks: {
        name: '????????????',
        screen: SupportingBanks,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    ShunguangSchool: {
        name: '????????????',
        screen: ShunguangSchool,
        navigationOptions: {
            title: '???????????????',
            ...NavBarConfig,
        },
    },
    ShunguangSchoolDetail: {
        name: '???????????????',
        screen: ShunguangSchoolDetail,
        navigationOptions: {
            title: '???????????????',
            ...NavBarConfig,
        },
    },
    DataSummary: {
        name: '????????????',
        screen: DataSummaryWeb,
        // screen: DataSummary,
        // navigationOptions: {
        //     title: '????????????',
        //     ...NavBarConfig,
        // },
    },
    DataAnalysis: {
        name: '?????????????????????',
        screen: DataAnalysis,
    },
    VIPCenter: {
        name: '????????????',
        screen: VIPCenterWeb,
        // screen: VIPCenter,
    },
    TeamSupervise: {
        name: '????????????',
        screen: TeamSupervise,
        navigationOptions: {
            header: null,
        },
    },
    TeamateProfile: {
        name: '????????????????????????',
        screen: TeamateProfile,
        navigationOptions: {
            header: null,
        },
    },
    UserProfile: {
        name: '??????????????????',
        screen: UserProfile,
        navigationOptions: {
            header: null,
        },
    },
    UserSearch: {
        name: '????????????',
        screen: UserSearch,
        navigationOptions: {
        header: null,
        },
    },
    VIPCompetition: {
        name: '???????????????',
        screen: VIPCompetition,
        navigationOptions: {
            title: '???????????????',
            ...NavBarConfig,
        },
    },
    OrderList: {
        name: '????????????',
        screen: OrderList,
        //  ???????????????: shunguang://orderList/0/1
        path: 'orderList/:orderFlag/:orderStatus',
        navigationOptions: {
            header: null,
        },
    },
    OrderDetail: {
        name: '????????????',
        screen: OrderDetail,
        navigationOptions: {
            header: null,
        },
    },
    Retainage: {
        name: '???????????????',
        screen: Retainage,
        navigationOptions: {
            header: null,
        },
    },
    OrderSearch: {
        name: '????????????',
        screen: OrderSearch,
        navigationOptions: {
            header: null,
        },
    },
    OrderTrack: {
        name: '????????????',
        screen: OrderTrack,
        navigationOptions: {
            header: null,
        },
    },
    RefundDetail: {
        name: '????????????',
        screen: RefundDetail,
        navigationOptions: {
            header: null,
        },
    },
    OrderAssess: {
        name: '????????????',
        screen: OrderAssess,
        navigationOptions: {
            header: null,
        },
    },
    ConfirmReceive: {
        name: '????????????',
        screen: ConfirmReceive,
        navigationOptions: {
            header: null,
        },
    },
    ChaseAssess: {
        name: '????????????',
        screen: ChaseAssess,
        navigationOptions: {
            header: null,
        },
    },
    AssessSuccess: {
        name: '????????????',
        screen: AssessSuccess,
        navigationOptions: {
            header: null,
        },
    },
    LookAssess: {
        name: '????????????',
        screen: LookAssess,
        navigationOptions: {
            header: null,
        },
    },
    ApplyRefund: {
        name: '????????????',
        screen: ApplyRefund,
        navigationOptions: {
            header: null,
        },
    },
    Authentication: {
        name: '????????????',
        screen: Authentication,
        navigationOptions: {
            header: null,
            },
    },
    HaierStaffAuthentication: {
        name: '?????????????????????????????????',
        screen: HaierStaffAuthentication,
        navigationOptions: {
            header: null,
            },
    },
    HaierStaffAuthenticated: {
        name: '?????????????????????????????????',
        screen: HaierStaffAuthenticated,
        navigationOptions: {
            header: null,
            },
    },
    IdentityAuthentication: {
        name: '??????????????????????????????',
        screen: IdentityAuthentication,
        navigationOptions: {
            header: null,
            },
    },
    IdentityAuthenticated: {
        name: '??????????????????????????????',
        screen: IdentityAuthenticated,
        navigationOptions: {
            header: null,
            },
    },
    NickName: {
        name: '??????',
        screen: NickName,
    },
    Gender: {
        name: '??????',
        screen: Gender,
    },
    SetUpOne: {
        name: '????????????',
        screen: SetUpOne,
    },
    MyCollect: {
        name: '????????????',
        screen: MyCollect,
    },
    MyReserve: {
        name: '????????????',
        screen: MyReserve,
    },
    // CouponsCenter: {
    //     name: '????????????',
    //     screen: CouponsCenter,
    //     navigationOptions: {
    //         title: '????????????',
    //         ...NavBarConfig,
    //     },
    // },
    // CouponDetail: {
    //     name: '???????????????',
    //     screen: CouponDetail,
    //     navigationOptions: {
    //         title: '???????????????',
    //         ...NavBarConfig,
    //     },
    // },
    // CouponGoods: {
    //     name: '????????????',
    //     screen: CouponGoods,
    //     navigationOptions: {
    //         title: '????????????',
    //         ...NavBarConfig,
    //     },
    // },
    StoreHome: {
        name: '??????????????????',
        screen: StoreHome,
        navigationOptions: {
            header: null,
        },
    },
    StoreHomeType: {
        name: '??????',
        screen: StoreHomeType,
        navigationOptions: {
            title: '??????',
            ...NavBarConfig,
        },
    },
    ShopRenovate: {
        name: '????????????',
        screen: ShopRenovate,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    ChoosingShopTemplate: {
        name: '??????????????????',
        screen: ChoosingShopTemplate,
        navigationOptions: {
            header: null,
        },
    },
    SetShopCover: {
        name: '??????????????????',
        screen: SetShopCover,
      navigationOptions: {
        title: '??????????????????',
        ...NavBarConfig,
      },
    },
    Register: {
        name: '??????',
        screen: Register,
        navigationOptions: {
            header: null,
        },
    },
    AgreementWebview: {
        name: '????????????',
        screen: AgreementWebview,
        navigationOptions: {
            ...NavBarConfig,
        },
    },
    HelpWebview: {
        name: '????????????',
        screen: HelpWebview,
        navigationOptions: {
            ...NavBarConfig,
        },
    },
    OpenStore: {
        name: '????????????',
        screen: OpenStore,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    CommonUnion: {
        name: '????????????',
        screen: CommonUnion,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    ShopApplySuccess: {
        name: '????????????',
        screen: ShopApplySuccess,
        navigationOptions: {
            title: '????????????',
            headerLeft: null,
            ...NavBarConfig,
        },
    },
    ResetPassword: {
        name: '????????????',
        screen: ResetPassword,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    MyKJT: {  // ???????????????????????????????????????
        name: '?????????',
        screen: MyKJT,
        navigationOptions: {
            title: '?????????',
            header: null,
        },
    },
    MyInvestment: {
        name: '????????????',
        screen: MyInvestment,
        navigationOptions: {
            title: '??????',
            header: null,
        },
    },
    MyKJT: {  // ???????????????????????????????????????
        name: '?????????',
        screen: MyKJT,
        navigationOptions: {
            title: '?????????',
            header: null,
        },
    },
    ManageMoney: {
        name: '????????????',
        screen: ManageMoney,
        navigationOptions: {
            title: '??????',
            // header: null,
        },
    },
    CommissionDetail: {
        name: '??????',
        screen: CommissionDetail,
        navigationOptions: {
            title: '??????',
            ...NavBarConfig,
            header: null,
        },
    },
    MyCoupon: {
        name: '???????????????',
        screen: MyCoupon,
        navigationOptions: {
            header: null,
        },
    },
    MyGold: {
        name: '????????????',
        screen: MyGold,
        navigationOptions: {
            header: null,
        },
    },
    Mywallet: {
        name: '????????????',
        screen: Mywallet,
        navigationOptions: {
            title: '????????????',
            header: false,
            ...NavBarConfig,
        },
    },
    WalletIntegral: {
        name: '????????????',
        screen: WalletIntegral,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    WalletDiamonds: {
        name: '????????????',
        screen: WalletDiamonds,
        navigationOptions: {
            header: null,
        },
    },
    UseCoupon: {
        name: '???????????????',
        screen: UseCoupon,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    CouponCenter: {
        name: '????????????',
        screen: CouponCenter,
    },
    CanUseCouponList: {
        name: '???????????????',
        screen: CanUseCouponList,
    },
    Huabei: {
        name: '????????????',
        screen: Huabei,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    BankFenqi: {
        name: '???????????????',
        screen: BankFenqi,
    },
    MissionShare: {
        name: '????????????',
        screen: MissionShare,
    },
    HistoryMission: {
        name: '????????????',
        screen: HistoryMission,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    MissionDetail: {
        name: '????????????',
        screen: MissionDetail,
    },
    VideoPlayer: {
        name: '????????????',
        screen: VideoPlayer,
        navigationOptions: {
            header: null,
        },
    },
    BaiTiao: {
        name: '??????',
        screen: BaiTiao,
        navigationOptions: {
            title: '????????????',
            ...NavBarConfig,
        },
    },
    ScenePage: {
        name: '????????????',
        screen: ScenePage,
        navigationOptions: {
            header: null,
        },
    },
    PaymentFailed: {
        name: '????????????',
        screen: PaymentFailed,
      navigationOptions: {
        title: '????????????',
        ...NavBarConfig,
        headerLeft: null,
        headerRight: null,
      },
    },
    HouseholdAppliances: {
        name: '????????????',
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
        name: '????????????',
        screen: FlashSale,
        navigationOptions: {
            header: null,
        },
    },
    CharaPage:{
        name:'?????????',
        screen:CharaPage,
        navigationOptions: {
            header: null,
        },
    },
    ChoiceGifts:{
        name:'????????????',
        screen:ChoiceGifts,
        navigationOptions:{
            header:null,
        }
    },
    MyLearn:{
        name:'????????????',
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
// ???????????????
const RootNavigator = StackNavigator(
    { ...Routes },
    {
        // ????????????????????????
        initialRouteName: 'RootTabs',
        // initialRouteName: 'NewRegister',
        // initialRouteName: 'OpenStoreSuccess',
        // initialRouteName: 'OpenStore',
        headerMode: 'float',
        navigationOptions: () => ({
            ...NavBarConfig,
        }),
        // ???????????????push?????????ios??????
        transitionConfig: () => ({
            screenInterpolator: CardStackStyleInterpolator.forHorizontal,
        }),
        // ????????????????????????????????????
        onTransitionStart: ({navigation}) => {
            // Log('navigationStart:', navigation);
            // Log('navigation params: ', navigation.params);
        },
        // ????????????????????????????????????
        onTransitionEnd: ({navigation}) => {
            // Log('navigationEnd:', navigation);
        },
    },
);

// ?????????????????????
export default RootNavigator;
