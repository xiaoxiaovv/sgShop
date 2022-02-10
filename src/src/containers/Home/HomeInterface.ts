import {NavigationScreenProp} from 'react-navigation';

// *******************************声明props接口*******************************
export interface ICommonInterface {
    navigation: NavigationScreenProp;
    dataSource: any;
    rid?: string;
    isHost?: number;
    CommissionNotice?: boolean;
}

export interface IHomesInterface {
    navigation: NavigationScreenProp;
    name?: string;
    CommissionNotice: boolean;
    isHost: number;
    rid: string;
    bottomData: any;
    middleImageConfig: any;
    iconConfig: any;
    msgCenter?: any;
    flashSales?: any;
    midCommList?: any;
    Community?: any;
    fCommunity?: any;
}

interface IAdvertisementStruct {
  image: string;
  type: string;
  url: string;
}

export interface IAdvertisement {
  bannerInfotJson: IAdvertisementStruct[];
  bannerNewGriftJson: IAdvertisementStruct[];
}

export interface IHomeProps {
  home: any;
  advertisement: IAdvertisement;
  storeId: number;
  isLogin: boolean;
  isHost: number;
  CommissionNotice: boolean;
}

// *******************************声明state接口****************************
export interface ICommonstate {
    // 存储数据
    dataSource?: any;
}

export interface IHomestate {
    // 存储首页尾部数据
    FooterDataSource?: object;
    // 是否到达底部
    isFooter: boolean;
}

export interface IHomeNavBarstate {
    show: boolean;
    BarStyleLight: boolean;
    NavBgColor: string;
    unread: number;
    defaultSearch: any;
    // locationStr: string;
}
