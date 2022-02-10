import * as React from 'react';
import {View, Image, Text, TouchableOpacity, Platform, StyleSheet} from 'react-native';
import {ICustomContain} from '../../interface/index';
import {Drawer} from 'antd-mobile';
import FilterList from '../../components/FilterList';
import {connect} from 'react-redux';
import {GoodCard} from '../../containers/Categories/GoodsList';
import SecondMenu from '../../components/secondMenu/index';
import {UltimateListView} from 'rn-listview';
import {fetchService, getAppJSON, postAppJSON} from '../../netWork';
import Config from 'react-native-config';
import noProduct from '../../images/no-product.png';
import TopActivites from './TopActivites';
import HomeBanner from '../Home/HomeBanner';
import MiddleMsgComp from './MiddleMsgComp';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import {NavBar} from '../../components/NavBar';
import {MessageWithBadge} from '../../components/MessageWithBadge';
import { createAction } from '../../utils';
import {Color, Font} from 'consts';

interface IFloor {
  bannerList: any[];
  id: number;
  link: string;
  productList: any[];
  title: string;
}

interface IState {
  drawerOpen: boolean;
    startFetch: boolean;
  filterData: string;
  qs: string;
  attributeId: string;
  productCateId: number;
  productCateIdType: string;
  contentDataList: any[];
  hasmore: boolean;
  midActivtyList: any[];
  topBannerList: any[];
  midBannerList: any[];
  floors: IFloor[];
  loading: boolean;
  showScrollToTopBtn: boolean;
}

interface IProps {
  regionName: string;
  provinceId: string;
  cityId: string;
  areaId: string;
  streetId: string;
  userId: string;
  mid: string;
  unread: number;
  CommissionNotice: boolean;
  isHost: number;
}

import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;

const mapStateToProps = ({
                           address: {
                             regionName,
                             provinceId,
                             cityId,
                             areaId,
                             streetId,
                           },
                           users: {
                             userId,
                             mid,
                             unread,
                             CommissionNotice,
                             isHost,
                           },
                         }) => ({
  regionName, provinceId, cityId, areaId, streetId,
  userId, mid, unread, CommissionNotice, isHost,
});

const datatypeNameArr = [
    {
        productCateId: 2729,
        name: '空调',
    }, {
        productCateId: 2725,
        name: '洗衣机',
    }, {
        productCateId: 2723,
        name: '冰箱',
    }, {
        productCateId: 2743,
        name: '彩电',
    }, {
    productCateId: 2741,
    name: '热水器',
  }, {
    productCateId: 2742,
    name: '厨房电器',
  }, {
    productCateId: 2726,
    name: '冷柜',
  }, {
    productCateId: 2973,
    name: '智能产品',
  }, {
    productCateId: 2737,
    name: '生活家电',
  }, {
    productCateId: 2774,
    name: '水家电',
  },
  //   {
  //   productCateId: 2862,
  //   name: '冰吧酒柜',
  //
  // },
  {
    productCateId: 2736,
    name: '家庭医疗',

  }, {
    productCateId: 2811,
    name: '家用中央空调',

  }];

/**
 * 家用电器
 */
@connect(mapStateToProps)
export default class HouseholdAppliances extends React.Component<ICustomContain & IProps, IState> {
  private button?: TouchableOpacity;
  private listView;

  public constructor(props) {
    super(props);
    const {state: {params = {}}} = this.props.navigation;
    this.state = {
      drawerOpen: false,
        startFetch: false,
      filterData: '',
      qs: 'isHotDesc',
      productCateId: params.productCateId || 2729,
      attributeId: params.attributeId || '',
      productCateIdType: '0',
      contentDataList: [],
      hasmore: false,
      midActivtyList: [],
      topBannerList: [],
      midBannerList: [],
      floors: [],
      loading: false,
      showScrollToTopBtn: false,
    };
  }
    public async componentWillMount() {
        let hasStock = await global.getItem('hasStock');
        let filterData = `${hasStock ? "hasStock":"all"}@all@0`;
        this.setState({filterData, startFetch: true}, () => {
            // 刷新
            this.listView.refresh();
        });

    }
  public componentDidMount() {
    this.getTopMsg();
    this.getMiddleMsg();
  }

  public render(): JSX.Element {
    const { navigation } = this.props;
    return (
      <View style={{flex: 1}}>
        <Drawer
          position='right'
          style={{height, zIndex: 3, backgroundColor: '#fff'}}
          sidebar={
            <FilterList
                key={'HouseholdAppliances'}
              attributeId={this.state.attributeId}
              categoryId={`${this.state.productCateId}`}
              close={(filterString) => this.handleDrawerClose(filterString)}/>
          }
          open={this.state.drawerOpen}
          onOpenChange={(isOpen) => {
            this.setState({drawerOpen: isOpen});
          }}
        >
          <NavBar
            title={'家用电器'}
            rightView={
              <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 6,}}>
                <TouchableOpacity activeOpacity={0.8}
                  onPress={() => navigation.navigate('Search', { searchKey: ''})}
                >
                  <Image
                     style={{height: 24, width: 24, marginLeft: 16, marginVertical: 10,}}
                     source={require('../../images/search.png')}/>
                </TouchableOpacity>
                <MessageWithBadge
                    badgeContainStyle={{top: 5, right: 5}}
                  imageStyle={{width: 22, height: 22}}
                  navigation={this.props.navigation}
                  unread={this.props.unread}
                  hidingText={true}
                  marginRightStyle={{marginRight: 0}}
                />
              </View>
            }
          />
          <UltimateListView
            ref={ref => this.listView = ref}
            // 头部视图
            header={
              () => <View style={{width}}>
                <HomeBanner
                  dataSource = {this.state.topBannerList}
                  height = {0.426 * width}
                />
                {this.state.midActivtyList.length > 0 && <TopActivites navigation={navigation} dataSource={this.state.midActivtyList} />}
                {
                  this.state.floors.map((floor, idx) => {
                    return <MiddleMsgComp
                      dataSource={floor}
                      navigation={navigation}
                      isHost={this.props.isHost}
                      CommissionNotice={this.props.CommissionNotice} />;
                  })
                }
                <ScrollableTabView
                  onChangeTab={async (item) => {
                    const productCateId = parseInt(item.ref.props.children, 10);
                    if (productCateId && productCateId !== this.state.productCateId) {
                        const hasStock = await global.getItem('hasStock');
                        const filterData = `${hasStock ? "hasStock":"all"}@all@0`;
                        this.setState({productCateId, filterData}, () => this.listView.refresh());
                    }
                  }}
                  locked={false}
                  initialPage={0}
                  style={{height: 40, justifyContent: 'center', borderWidth: 0}}
                  renderTabBar={
                    () => <ScrollableTabBar
                      activeTextColor={Color.BLUE_1}
                      inactiveTextColor={Color.GREY_2}
                      tabStyle={{width: width / 5.5}}
                      textStyle={{width: width / 5.5, textAlign: 'center', fontSize: Font.NORMAL_1}}
                    />
                  }
                >
                  {
                    datatypeNameArr.map((item, index) => <Text style={{height: 0}} key={index} tabLabel={item.name}>{item.productCateId}</Text>)
                  }
                </ScrollableTabView>
                <SecondMenu
                  attributeId={this.state.attributeId}
                  handleFilterDataUpdate={ (type) => { this.handleFilterDataUpdate(type); } }
                  handleDrawerOpen={() => this.openDrawer()}
                />
              </View>
            }
            onScroll={this.handleListViewScroll}
            onFetch={this.onFetch}
            keyExtractor={(item, index) => `${index} - ${item}`} // this is required when you are using FlatList
            refreshableMode={Platform.OS === 'ios' ? 'advanced' : 'basic'} // basic or advanced
            // item视图
            item={this.renderUListItem} // this takes three params (item, index, separator)
            numColumns={1} // to use grid layout, simply set gridColumn > 1
            // 尾部视图,当isFooter为true时,再设置footer视图,否则一直返回null
            // tslint:disable-next-line:max-line-length
            refreshableTitle='数据更新中……'
            refreshableTitleRelease='释放刷新'
            // 下拉刷新箭头图片的高度
            arrowImageStyle={{width: 20, height: 20, resizeMode: 'contain'}}
            dateStyle={{color: 'lightgray'}}
            // 刷新视图的样式(注意ios必须设置高度和top距离相等,android只需要设置高度)
            refreshViewStyle={Platform.OS === 'ios' ? {height: 80, top: -80} : {height: 80}}
            // 刷新视图的高度
            refreshViewHeight={80}
            // 视图滚动的方法
            separator={() => <View style={styles.line}/>}
            emptyView={() =>
              <View style={{ height, alignItems: 'center', backgroundColor: Color.WHITE}}>
                <Image source={noProduct} style={{width: 120, height: 150}} resizeMode={'contain'}/>
              </View>
            }
          />
          {/* 返回顶部的按钮 */}
          {
           this.state.showScrollToTopBtn && <TouchableOpacity
              style={[styles.toTopButton]}
              onPress={() => {
                this.listView.scrollToOffset(0, 0);
              }}
              ref={ref => this.button = ref}
              >
              <Image style={{height: 50, width: 50}} source={require('../../images/icon_totop.png')} />
          </TouchableOpacity>
          }
          {/* {this.state.loading && <Loading/>} */}
        </Drawer>
      </View>
    );
  }

  private handleListViewScroll = ( e ): void => {
      // 获取视图Y轴偏移量
      const offset = e.nativeEvent.contentOffset.y;
      if ( Platform.OS === 'ios' ) {
        if (offset > 64) {
          this.setState({showScrollToTopBtn: true});
        } else {
          this.setState({showScrollToTopBtn: false});
        }
      } else {
        if (offset > 110) {
          this.setState({showScrollToTopBtn: true});
        } else {
          this.setState({showScrollToTopBtn: false});
        }
      }
  }
  private serviceUrl = (page = 1, pageLimit = 10) => {
    const { provinceId, cityId, areaId, streetId } = this.props;
    return 'search/commonLoadItemNew.html?pholder=1&' +
      `provinceId=${provinceId}&cityId=${cityId}&` +
      `districtId=${areaId}&streetId=${streetId}` +
      `&pageIndex=${page}&pageSize=${pageLimit}&productCateId=${this.state.productCateId}&` +
      `memberId=${this.resolveStoreId()}&filterData=${this.state.filterData}&qs=${this.state.qs}&fromType=1&noLoading=true`;
  }

  private resolveStoreId = () => {
    const { params } = this.props.navigation.state;
    if (params && params.storeId) {
      return params.storeId;
    } else {
      return this.props.mid;
    }
  }

  private onFetch = async (page = 1, startFetch, abortFetch): void => {
    try {

        if(!this.state.startFetch){
            abortFetch();
        }else {

            const pageLimit = 5;

            this.setState({loading: true});
            const resp: any = await fetchService(this.serviceUrl(page, pageLimit), {}, Config.API_SEARCH_URL, true);
            const {success, data, totalCount} = await resp.json();
            this.setState({loading: false});
            if (!success || !data) {
                abortFetch();
                return;
            } else {
                let products = data.productList;
                if (totalCount) {
                    this.setState({totalCount});
                }
                if (!products || !products.length || products.length < 1) {
                    abortFetch();
                } else if (data.isCanSyncGetPrice && data.traceId) {
                    const respComission: any = await postAppJSON(`search/getPriceByProductList.html?traceId=${data.traceId}`,
                        data.traceId, Config.API_SEARCH_URL, null, true);
                    const {products: productPrices, success: comSuccess} = respComission;
                    if (comSuccess && productPrices && productPrices.length && productPrices.length > 0) {
                        products = products.map((item, index) => {
                            for (const p of productPrices) {
                                if (item.sku === p.sku) {
                                    item.finalPrice = p.finalPrice;
                                    item.o2oType = p.o2oType;
                                    item.commission = p.commission;
                                    break;
                                }
                            }
                            return item;
                        });
                    }
                }
                startFetch(products, pageLimit);
            }
        }
    } catch (err) {
      this.setState({loading: false});
      abortFetch(); // manually stop the refresh or pagination if it encounters network error
      Log(err);
    }
  }

  private openDrawer = () => this.setState({drawerOpen: true});
  private handleDrawerClose = (filterString) => {
    if (filterString) {
      this.setState({
        drawerOpen: false,
        filterData: filterString,
      }, () => {
        this.listView.refresh();
      });
    } else {
      this.setState({drawerOpen: false});
    }
  }
  private renderUListItem = (item, index) => {
    return (
      <GoodCard
        key={index}
        item={item}
        index={index}
        handlePress={this.handleGoodPress}
      />
    );
  }
  private handleGoodPress = (item) => {
    this.props.navigation.navigate('GoodsDetail',
      {
        productId: item.productId,
        productFullName: item.productFullName,
        swiperImg: item.defaultImageUrl,
        price: item.finalPrice || item.defaultPrice,
      });
  }

  private handleFilterDataUpdate( filterData ) {
    console.log(filterData);
    this.setState({
      // filterData: filterData + this.state.subFilter,
      qs: filterData,
    }, () => {
      this.listView.refresh();
    });
  }

  private getTopMsg = async (): void => {
    const { success, data }: any = await getAppJSON('sg/cms/electricalSecond.json');
    if (success && data) {
      const { midActivtyList, topBannerList, midBannerList } = data;
      if (midActivtyList && midActivtyList.length > 0) {
        this.setState({midActivtyList});
      }
      if (topBannerList && topBannerList.length > 0) {
        this.setState({topBannerList});
      }
      if (midBannerList && midBannerList.length > 0) {
        this.setState({midBannerList});
      }
    }
  }

  private getMiddleMsg = async (): void => {
    const {
      provinceId,
      cityId,
      areaId: districtId,
      streetId: street,
    } = this.props;
    const params = {
      provinceId,
      cityId,
      districtId,
      street,
      position: 1,
    };
    const {success, data}: any = await getAppJSON('sg/cms/floor.json', params);
    if (success && data) {
      const { floors } = data;
      if (floors && floors.length > 0) {
        this.setState({floors});
      }
    }
  }
}

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: Color.GREY_6,
  },
  toTopButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    height: 50,
    width: 50,
  },
});
