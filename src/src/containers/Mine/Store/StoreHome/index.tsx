import * as React from 'react';
import { Image, Modal, NativeModules, StyleSheet, Text, TouchableOpacity, View, Platform, Alert} from 'react-native';
import { ICustomContain } from '../../../../interface/index';
import ScreenUtil from '../../../Home/SGScreenUtil';
import { ActivityIndicator, Drawer, Modal as AntModal, Toast } from 'antd-mobile';
import { UltimateListView } from 'rn-listview';
import FilterList from '../../../../components/FilterList';
import Address from '../../../../components/Address';
import { connect } from 'react-redux';
import { fetchService, getAppJSON, postAppJSON } from '../../../../netWork/index';
import Cart from '../../../Cart/index';
import { createAction } from '../../../../utils/index';
import Config from 'react-native-config';
import { StoreHomeBanner } from '../StoreHomeBanner';
import { NavBar } from './NavBar';
import ShareModle from '../../../../components/ShareModle';
import { TabBar } from './TabBar';
import { TitleTemplateOne } from './TitleTemplateOne';
import { TitleTemplateThree } from './TitleTemplateThree';
import { TitleTemplateTwo } from './TitleTemplateTwo';
import { ListTemplateOne } from './ListTemplateOne';
import { ListTemplate, TitleTemplate } from '../../../../dvaModel/storeModel';
import { ListTemplateThree } from './ListTemplateThree';
import { ListTemplateFour } from './ListTemplateFour';
import { ListTemplateTwo } from './ListTemplateTwo';
import URL from '../../../../config/url';
let width = URL.width;
let height = URL.height;

export const SALEDESC = 'saleDesc';
export const ISHOTDESC = 'isHotDesc';

interface IState {
  expanding: boolean;
  data: object[];
  isTogglingTab: boolean;
  isLoading: boolean;
  drawerOpen: boolean;
  productCateId: string;
  filterData: string;
  qs: string;
  showPositionModal: boolean;
  showQrCodeModal: boolean;
  storeName: string;
  userCreditWithLevelName: string;
  userCurrentLevelId: number;
  coverUrl: string;
  qrcode: string;
  gameId: string;
  banner: any[];
  showShare: boolean;
    startFetch: boolean;
  totalCount: number;
  resetFilterOption: boolean;
    header: boolean;
  avatarImageFileId: string;
  tabBarFocusedOn: string; // ?????????????????????
}

interface IStoreHome {
  regionName: string;
  provinceId: string;
  cityId: string;
  areaId: string;
  streetId: string;
  rankName: string;
  userId: string;
  userName: string;
  avatarImageFileId: string;
  nickName: string;
  loginName: string;
  mid: string;
  banner: any[];
  unread: number;
  titleTemplate: TitleTemplate;
  listTemplate: ListTemplate;
  CommissionNotice: boolean;
}

const mapStateToProps = ({
                           address: {
                             regionName,
                             provinceId,
                             cityId,
                             areaId,
                             streetId,
                           },
                           users: {
                             rankName,
                             userId,
                             userName,
                             avatarImageFileId,
                             nickName,
                             loginName,
                             mid,
                               isHost,
                             unread,
                             CommissionNotice,
                           },
                           store: {
                             banner,
                             titleTemplate,
                             listTemplate,
                           },
                         }) => ({
  regionName, provinceId, cityId, areaId, streetId,
  rankName, userId, userName, avatarImageFileId, nickName, loginName, mid, unread, isHost, CommissionNotice, banner,
  titleTemplate, listTemplate,
});

const address = {
  provinceId: '',
  cityId: '',
  areaId: '',
  streetId: '',
};

@connect(mapStateToProps)
class StoreHome extends React.Component<ICustomContain & IStoreHome, IState> {
  private listView: UltimateListView;
  public constructor(props) {
    super(props);
    this.state = {
      expanding: false,
      data: [],
      isTogglingTab: false,
      isLoading: false,
      drawerOpen: false,
      productCateId: '0',
      qs: SALEDESC,
      filterData: '',
      showPositionModal: false,
      showQrCodeModal: false,
        startFetch: false,
      storeName: '',
      userCreditWithLevelName: '',
      userCurrentLevelId: 1,
      coverUrl: '',
      qrcode: '',
      gameId: 'f265383f0538834f',
      banner: [],
      showShare: false, // ??????????????????
      totalCount: 0,
      resetFilterOption: true,
        header: false,
      avatarImageFileId: this.props.avatarImageFileId,
      tabBarFocusedOn: SALEDESC,
    };
    address.provinceId = this.props.provinceId;
    address.cityId = this.props.cityId;
    address.areaId = this.props.areaId;
    address.streetId = this.props.streetId;
  }

  public componentWillReceiveProps(nextProps) {
    if (this.props.provinceId !== nextProps.provinceId ||
      this.props.cityId !== nextProps.cityId ||
      this.props.areaId !== nextProps.areaId ||
      this.props.streetId !== nextProps.streetId ) {
      address.provinceId = nextProps.provinceId;
      address.cityId = nextProps.cityId;
      address.areaId = nextProps.areaId;
      address.streetId = nextProps.streetId;

      this.listView.refresh();
    }
  }
    public async componentWillMount() {
        let hasStock = await global.getItem('hasStock');
        let filterData = `${hasStock ? "hasStock":"all"}@all@0`;
        this.setState({filterData, startFetch: true}, () => {
            // ??????
            this.listView.refresh();
        });

    }
  public async componentDidMount() {
    this.props.dispatch(createAction('store/fetchBanner')());

    const storeRes = await getAppJSON('v3/mstore/sg/manage.json', {storeId: this.resolveStoreId()});
    const { success, data } = storeRes;

    if (success && data) {
      const { storeName, coverUrl, qrcode, banner, titleLayout, listLayout, avatarImageFileId } = data;
      if (titleLayout) {
        for (const key of Object.keys(TitleTemplate)) {
          const titleTemp: string = TitleTemplate[key];
          if (titleTemp === titleLayout) {
            this.props.dispatch(createAction('store/loadData')({
              titleTemplate: titleTemp,
              storeId: data.storeId,
              storeName: data.storeName,
            }));

            break;
          }
        }
      }
      if (listLayout) {
        for (const key of Object.keys(ListTemplate)) {
          const listTemp: string = ListTemplate[key];
          if (listTemp === listLayout) {
            this.props.dispatch(createAction('store/loadData')({
              listTemplate: listTemp,
            }));

            break;
          }
        }
      }
      this.setState({storeName, coverUrl, qrcode, banner, avatarImageFileId, header: true}, ()=>{
          this.setState({ header: false});
      });
    }

    const gameIdRes = await getAppJSON('v3/mstore/sg/findLatestGame.json');
    const { success: gameIdSuccess, data: gameIdData } = gameIdRes;

    let gameId = this.state.gameId;

    if (gameIdSuccess && gameIdData) {
      gameId = gameIdData;
      this.setState({gameId});
    }

    const creditRes =
      await getAppJSON('v3/mstore/sg/credit/getUserCreditInfo.html', {gameId, memberId: this.resolveStoreId()});
    const { success: creditSuccess, data: creditData } = creditRes;
    if (creditSuccess && creditData) {
      if (creditData.userCreditWithLevel) {
        creditData.userCreditWithLevel.order && this.setState({
          userCurrentLevelId: creditData.userCreditWithLevel.order,
        });
        creditData.userCreditWithLevel.name && this.setState({
          userCreditWithLevelName: creditData.userCreditWithLevel.name,
        });
      }
    }
    // gio ??????????????? ?????? yl
    let addressData = await getAppJSON('v3/mstore/sg/getPositionFromCookie.json');
    let addressInfo = eval(addressData.data)
    if(data.storeName){
      NativeModules.StatisticsModule.track('ShopView', {
        storeId:	data.storeId,					//	??????	ID
        storeName:	data.storeName,//	??????	Name
        storeCredit:	creditData.userCreditWithLevel.order,
        storeProvince:	addressInfo[0].provinceId,
        storeCity:	addressInfo[0].cityId,
        storeDistrict:	addressInfo[0].areaId,
        storeStreet:	addressInfo[0].streetId
      });
    }
  }

  public render(): JSX.Element {
    const {titleTemplate, listTemplate} = this.props;
    Log('titleTemplate, listTemplate,', {titleTemplate, listTemplate});
    return (
      <View style={{flex: 1}}>
        <Drawer
          position='right'
          style={{ height, zIndex: 3, backgroundColor: '#fff'}}
          sidebar={
            <FilterList
                key={'StoreHome'}
                attributeId={this.state.filterData}
                categoryId={this.state.productCateId}
                // keyword={this.state.keyword}
                close={(filterString) => this.handleDrawerClose(filterString)}/>
          }
          open={this.state.drawerOpen}
          onOpenChange={(isOpen) => { this.setState({ drawerOpen: isOpen }); }}
        >
          <UltimateListView
            ref={(ref) => this.listView = ref}
            header={!this.state.header && this.renderHeader}
            onFetch={this.onFetch}
            keyExtractor={(item, index) => `keys${index}`}
            refreshableMode={ Platform.OS === 'ios' ? 'advanced' : 'basic'}
            item={this.renderItem}  // this takes two params (item, index)
            numColumns={this.props.listTemplate === ListTemplate.THREE ? 2 : 1} // to use grid layout, simply set gridColumn > 1
            columnWrapperStyle={
              this.props.listTemplate === ListTemplate.THREE ? {
                borderTopWidth: 1,
                borderTopColor: '#CCCCCC',
              } : null
            }
            separator={() => this.renderSeparator()}
          />

          {
            this.state.expanding && <TouchableOpacity
              style={{
                position: 'absolute',
                right: 10,
                bottom: 90,
              }}
              onPress={() => this.props.navigation.navigate('Search', { searchKey: ''})}
            >
              <Image
                style={{
                  height: 40,
                  width: 40,
                }}
                source={require('../../../../images/ic_search.png')}
              />
            </TouchableOpacity>
          }
          {
            this.state.expanding && <TouchableOpacity
              style={{
                position: 'absolute',
                right: 70,
                bottom: 60,
              }}
              onPress={() => this.props.navigation.navigate('Cart', {showCartBackBtn: true})}
            >
              <Image
                style={{
                  height: 40,
                  width: 40,
                }}
                source={require('../../../../images/ic_cart.png')}
              />
            </TouchableOpacity>
          }
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 10,
              bottom: 20,
            }}
            onPress={() => { this.setState({expanding: !this.state.expanding}); }}
          >
            <Image
              style={{
                height: 40,
                width: 40,
              }}
              source={require('../../../../images/ic_plus.png')}
            />
          </TouchableOpacity>
          <ActivityIndicator
            toast
            text='?????????...'
            animating={this.state.isLoading}
          />
          <Modal
            // ??????Modal?????????????????????
            animationType='slide'
            // ????????? Modal ????????????????????????
            transparent
            // ????????? Modal ?????????????????????????????????
            visible={this.state.showPositionModal}
            // ??? Modal??????????????????????????????????????????????????????????????????
            onShow={() =>  Log('onShow')  }
            // ?????? Android ??????????????????????????????????????????
            // ????????????????????????????????????????????? Modal ?????????????????????android??????????????????????????????????????????
            onRequestClose={() => Log('onShow')}
          >
            <View style={{width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
              <TouchableOpacity
                style={{position: 'absolute', top: 0, left: 0,
                  width: '100%', height: height - 400}}
                activeOpacity={1} onPress={() => this.setState({showPositionModal: false})}>
                <View style={{position: 'absolute', top: 0, left: 0, width: '100%',
                  height: height - 400}}/>
              </TouchableOpacity>
              <Address
                onclick={() => {
                  this.setState({showPositionModal: false});
                }}
                onSelect = {(addressObj) => {
                  this.setState({showPositionModal: false});
                }}
                hasHeader={true}
              />
            </View>
          </Modal>
          <AntModal
            popup
            visible={this.state.showQrCodeModal}
            animationType='slide-up'
          >
            <View>
              <View
                style={{
                  height: 50,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderBottomColor: '#F2F2F2',
                  borderBottomWidth: 1,
                }}
              >
                <Text style={{fontSize: 16}}>??????????????????????????????????????????</Text>
                <TouchableOpacity
                  style={{position: 'absolute', top: 15, right: 10}}
                  onPress={() => { this.setState({showQrCodeModal: false}); }}>
                  <Image
                    style={{width: 20, height: 20}}
                    source={require('../../../../images/code_btn.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={{flex: 1, alignItems: 'center', margin: 10, paddingBottom: 20}}>
                <Image
                  style={{width: 200, height: 200}}
                  source={{uri: this.state.qrcode}}
                />
                <TouchableOpacity
                  style={{
                    width: 180,
                    height: 30,
                    backgroundColor: '#3CBFFC',
                    marginTop: 10,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  activeOpacity={0.8}
                  onPress={() => {
                      if(this.state.qrcode) {
                          this.setState({showQrCodeModal: false});
                          this.saveImg(this.state.qrcode);
                      }else {
                          Alert.alert('?????????', '????????????????????????', [{text: '??????'}] );
                      }
                  }}
                >
                  <Text style={{color: 'white', fontSize: 14}}>???????????????</Text>
                </TouchableOpacity>
              </View>
            </View>
          </AntModal>
          <ShareModle
            visible={this.state.showShare} content={this.resolveSharingCommand()}
            onCancel={() => this.setState({ showShare: false })}
            hiddenEwm={true}
            hidingTitle={true}
          />
        </Drawer>
      </View>
    );
  }
  private resolveSharingCommand = () => {
    const title = this.state.storeName + '???????????????'; // ????????????
    // const content = '???????????????????????????????????????????????????????????????????????????????????????~'; // ????????????
    const content = '???????????????????????????????????????????????????';// ???????????? darcywang
    const pic = this.state.avatarImageFileId; // ??????????????????????????????
    // const url = `${Config.API_URL}www/index.html#/myStore/${this.resolveStoreId()}/${this.props.mid}/?fs`;
    const url = `${URL.GET_MY_STORE_SHARE_URL}${this.resolveStoreId()}/${this.props.userId}/?fs`;
    return [ title, content, pic, url, 0 ];
  }
  private saveImg = (img) => {
    const command = [img];
    Toast.loading('?????????????????????');
    NativeModules.PhotoModule.downloadImg(command)
      .then((result) => {
        Toast.success('????????????!', 2);
      })
      .catch((error) => {
        Toast.fail('????????????!', 2);
        // this.setState({showQrCodeModal: false});
      });
  }
  private handleDrawerClose(filterString) {
      console.log('-----handleDrawerClose')
      console.log(filterString)
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
  private setProductCateId = async (productCateId: string): void => {
    // this.props.dispatch(createAction('store/resetFirstOption')({hasStock: 0}));
      let hasStock = await global.getItem('hasStock');
      let filterData = `${hasStock ? "hasStock":"all"}@all@0`;
    this.setState({productCateId, resetFilterOption: true, filterData}, () => this.listView.refresh());
  }

  private serviceUrl = (page = 1, pageLimit = 10) => {
    return 'search/commonLoadItemNew.html?pholder=1&' +
      `provinceId=${address.provinceId}&cityId=${address.cityId}&` +
      `districtId=${address.areaId}&streetId=${address.streetId}` +
      `&pageIndex=${page}&pageSize=${pageLimit}&productCateId=${this.state.productCateId}&` +
      `memberId=${this.resolveStoreId()}&filterData=${this.state.filterData}&qs=${this.state.qs}&fromType=2&noLoading=true`;
  }

  private onFetch = async (page = 1, startFetch, abortFetch) => {
      try {

          if(!this.state.startFetch){
              abortFetch();
          }else {
              const pageLimit = 10;

              const resp = await fetchService(this.serviceUrl(page, pageLimit), {}, Config.API_SEARCH_URL, true);
              const {success, data, totalCount} = await resp.json();
              if (!success || !data) {
                  abortFetch();
                  return;
              } else {
                  let products = data.productList;
                  if (!products || !products.length || products.length < 1) {
                      abortFetch();
                  } else if (data.isCanSyncGetPrice && data.traceId) {
                      const respComission = await postAppJSON(`search/getPriceByProductList.html?traceId=${data.traceId}`,
                          data.traceId, Config.API_SEARCH_URL);

                      const {products: productPrices, success: comSuccess} = respComission;
                      if (comSuccess && productPrices && productPrices.length && productPrices.length > 0) {

                          products = products.map((item, index) => {
                              for (const p of productPrices) {
                                  if (item.sku === p.sku) {
                                      item.finalPrice = p.finalPrice;
                                      item.o2oType = p.o2oType;
                                      item.commission = p.commission;
                                      if (p.defaultImageUrl) {
                                          item.defaultImageUrl = p.defaultImageUrl;
                                      }
                                      break;
                                  }
                              }

                              return item;
                          });

                      }
                  }
                  /*
                  if (this.props.listTemplate === ListTemplate.THREE) {
                    const chunkedArray = [];
                    for (const [i, p] of products.entries()) {
                      let j = 0;
                      if (i % 2 === 0) {
                        j = i / 2;
                      } else {
                        j = (i - 1) / 2;
                      }
                      if (!chunkedArray[j]) {
                        chunkedArray[j] = [];
                      }
                      chunkedArray[j].push(p);
                    }
                    products = [...chunkedArray];
                  }
                  */
                  console.log(products);
                  startFetch(products, pageLimit);

                  if (page === 1) {
                      if (totalCount) {
                          this.setState({totalCount});
                      } else {
                          this.setState({totalCount: 0});
                      }
                  }
              }
          }
    } catch (err) {
      abortFetch(); // manually stop the refresh or pagination if it encounters network error
      Log(err);
    }
  }

  private renderHeader = () => {
    const areaName = this.props.regionName.split('/')[0];
    return <View style={{flex: 1}}>
      <View>
        {
          TitleTemplate.ONE === this.props.titleTemplate ?
            <TitleTemplateOne
              coverUrl={this.state.coverUrl}
              navigation={this.props.navigation}
              unread={this.props.unread}
              areaName={areaName}
              showShare={() => dvaStore.getState().users.isLogin?this.setState({showShare: true}):this.props.navigation.navigate('Login')}
              showQrCode={() => dvaStore.getState().users.isLogin?this.setState({showQrCodeModal: true}):this.props.navigation.navigate('Login')}
              showPosition={() => this.setState({showPositionModal: true})}
              avatarImageFileId={this.state.avatarImageFileId}
              storeName={this.state.storeName}
              userCreditWithLevelName={this.state.userCreditWithLevelName}
              userCurrentLevelId={this.state.userCurrentLevelId}
            /> : TitleTemplate.TWO === this.props.titleTemplate ?
            <TitleTemplateTwo
              coverUrl={this.state.coverUrl}
              navigation={this.props.navigation}
              unread={this.props.unread}
              areaName={areaName}
              showShare={() => dvaStore.getState().users.isLogin?this.setState({showShare: true}):this.props.navigation.navigate('Login')}
              showQrCode={() => dvaStore.getState().users.isLogin?this.setState({showQrCodeModal: true}):this.props.navigation.navigate('Login')}
              showPosition={() => this.setState({showPositionModal: true})}
              avatarImageFileId={this.state.avatarImageFileId}
              storeName={this.state.storeName}
              userCreditWithLevelName={this.state.userCreditWithLevelName}
              userCurrentLevelId={this.state.userCurrentLevelId}
            /> : <TitleTemplateThree
              coverUrl={this.state.coverUrl}
              navigation={this.props.navigation}
              unread={this.props.unread}
              areaName={areaName}
              showShare={() => dvaStore.getState().users.isLogin?this.setState({showShare: true}):this.props.navigation.navigate('Login')}
              showQrCode={() => dvaStore.getState().users.isLogin?this.setState({showQrCodeModal: true}):this.props.navigation.navigate('Login')}
              showPosition={() => this.setState({showPositionModal: true})}
              avatarImageFileId={this.state.avatarImageFileId}
              storeName={this.state.storeName}
              userCreditWithLevelName={this.state.userCreditWithLevelName}
              userCurrentLevelId={this.state.userCurrentLevelId}
            />
        }
      </View>
      <NavBar
        navigation={this.props.navigation}
        productCateId={this.state.productCateId}
        totalCount={this.state.totalCount}
        setProductCateId={this.setProductCateId}
      />
      <TabBar
        filterData={this.state.tabBarFocusedOn}
        setStateAndRefresh={this.setStateAndRefresh}
      />
      <StoreHomeBanner
        dataSource = {this.props.banner.length!==0?this.props.banner:this.state.banner}
        height = {0.38*width}
      />
    </View>;
  }
  private setStateAndRefresh = (state, refreshing = false) => {
    this.setState(state, () => {
      if (refreshing) {
        this.listView.refresh();
      } else {
        this.setState({tabBarFocusedOn: '@@'});
      }
    });
  }
  private resolveStoreId = () => {
    const { params } = this.props.navigation.state;
    if (params && params.storeId) {
      return params.storeId;
    } else {
      return this.props.mid;
    }
  }
  private renderItem = (item, index) => {
    const { params } = this.props.navigation.state;
    const { isHost, CommissionNotice } = this.props;
    if (ListTemplate.ONE === this.props.listTemplate) {
      return <ListTemplateOne
        item={item}
        navigation={this.props.navigation}
        commissionNotice={isHost > 0 && CommissionNotice}
      />;
    } else if (ListTemplate.TWO === this.props.listTemplate) {
      return <ListTemplateTwo
        item={item}
        navigation={this.props.navigation}
        commissionNotice={isHost > 0 && CommissionNotice}
      />;
    } else {
      return <ListTemplateFour
        item={item}
        navigation={this.props.navigation}
        commissionNotice={isHost > 0 && CommissionNotice}
      />;
    }
  }
  private renderSeparator = () => {
    if (ListTemplate.ONE === this.props.listTemplate) {
      return <View style={styles.line}/>;
    } else if (ListTemplate.TWO === this.props.listTemplate) {
      return <View style={{marginTop: 10}}/>;
    } else {
      return <View style={styles.line}/>;
    }
  }
}

const styles = StyleSheet.create({
  line: {
    height: 0.5,
    backgroundColor: '#CCCCCC',
  },
});

export default StoreHome;
