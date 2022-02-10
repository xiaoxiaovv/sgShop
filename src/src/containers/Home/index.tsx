// import liraries
import * as React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Platform,
  TouchableOpacity,
  NativeModules, TouchableHighlight,
  DeviceEventEmitter, EmitterSubscription,
} from 'react-native';
import { UltimateListView, UltimateRefreshView } from 'rn-listview';
// // 展示组件
import HomeNavBar from './SGHomeNavBar';
import HomeEleEquipment from './SGHomeEleEquipment';
import {postAppJSON, getAppJSON} from '../../netWork';
import { IHomesInterface, ICommonstate, IHomestate, IHomeProps } from './HomeInterface';
import Config from 'react-native-config';
import { connect } from 'react-redux';
import HomeListHeader from './HomeListHeader';
import HomeListFooter from './HomeListFooter';
import { ICustomContain } from '../../interface/index';
import { createAction } from '../../utils/index';
import { Advertisement } from './Advertisement';
// import { getLocationPermisson } from '../../utils/tools';

@connect(({home, users: {mid: storeId, isLogin, isHost, CommissionNotice}}) => ({home, storeId, isLogin,isHost, CommissionNotice}))
class Home extends React.Component<ICustomContain & IHomeProps, ICommonstate & IHomestate> {
    // 声明私有props
    private navbar?: HomeNavBar;
    private listView?: UltimateListView;
    private button?: TouchableOpacity;
    private loginSuccessListenner?: EmitterSubscription;
    private changeLocationListenner?: EmitterSubscription;
    private fCommunity?: any;
    public constructor(props) {
        super(props);
        // 初始化state
        this.state = {
            // 是否到达底部
            isFooter: false,
        };
        // 在方法中使用了 this 调用类方法属性的时候，那么这个方法必须绑定了this才可以了，否则方法里面不认识 this
        // this.onScroll = this.onScroll.bind(this);
    }
    public componentDidMount() {
        // 快捷通网址
        // console.log(`${Config.API_URL}v3/kjt/sg/kjtAccountBind.html?flag=${dvaStore.getState().users.userToken.substring(6)}`);
      this.getHomeData();
      this.loginSuccessListenner = DeviceEventEmitter.addListener('loginSuccess', (doNotFetchAdvertisement = false) => {
          // 加载信息弹窗
          // if (!doNotFetchAdvertisement) {
          //   this.props.dispatch(createAction('home/fetchAdvertisement')());
          // }
          this.getHomeData();
          this.getLikeData();
          this.listView.refresh();
     });
      this.changeLocationListenner = DeviceEventEmitter.addListener('changeLocation', (doNotFetchAdvertisement = false) => {
          // 加载信息弹窗
          console.log('------------changeLocation------------');
          // if (!doNotFetchAdvertisement) {
          //   this.props.dispatch(createAction('home/fetchAdvertisement')());
          // }
          this.getHomeData();
          this.getLikeData();
          this.listView.refresh();
     });
  }
  public getHomeData() {
    this.props.dispatch(createAction('home/fetchTopData')());
    this.props.dispatch(createAction('home/fetchMiddleImageConfig')());
    this.props.dispatch(createAction('home/fetchMsgCenter')());
    //this.props.dispatch(createAction('home/fetchFlashSales')());
    this.props.dispatch(createAction('home/fetchIconConfig')());
    this.props.dispatch(createAction('home/fetchBottomIconConfig')());
    this.props.dispatch(createAction('home/fetchFloors')());
    // getLocationPermisson();
  }
  public getLikeData() {
    //接受百分点推荐返回数据
    let productIds='';
    let bid = '';
    // ios
    if (Platform.OS === 'ios') {
       bid = 'rec_03459368_CB31_EBAB_AEA3_223C4E063A28';
    }else{
      //anzhuo
       bid = 'rec_5ED284B1_5A92_E609_9E4A_56242601746D';
    }
        NativeModules.BfendModule.recommend(bid,{uid:this.props.storeId.toString() || ''})
          .then((result) => {
                console.log('jsjsjsjsjsjs',result)
                const {feedback,rid} = result;
                feedback.map(a => 
                         productIds+= a.url.substring(1,a.url.indexOf('/',2))+'@'
                        );
                this.props.dispatch(createAction('home/fetchBottomData')({productIds:productIds.substring(0,productIds.length-1),rid})); 
          })
          .catch((errorCode, domain, error) => {
                    
          });
  }
  public componentWillUnmount() {
    this.loginSuccessListenner.remove();
    this.changeLocationListenner.remove();
  }
    public render(): JSX.Element {
      const { topData, middleImageConfig, iconConfig, msgCenter, flashSales, bottomData, rid, advertisement} = this.props.home;
      Log('h');
      return (
        <View style={styles.container}>
            <HomeNavBar key={'Home'}
              ref={(navbar) => this.navbar = navbar}
              navigation = {this.props.navigation}/>
            <UltimateListView
              ref={ref => this.listView = ref}
              // 头部视图
              header={() =>
                      <HomeListHeader
                            {...topData}
                            middleImageConfig={middleImageConfig}
                            iconConfig={iconConfig}
                            msgCenter={msgCenter}
                            flashSales={flashSales}
                            navigation={this.props.navigation}
                            isHost = {this.props.isHost}
                            CommissionNotice = { this.props.CommissionNotice }
                      />
                      }
              onFetch={this.onFetch}
              keyExtractor={(item, index) => `${index} - ${item}`} // this is required when you are using FlatList
              refreshableMode={Platform.OS === 'ios' ? 'advanced' : 'basic'} // basic or advanced
              // item视图
              item={ ( item, index) =>
                <HomeEleEquipment
                      dataSource = { item }
                      navigation = {this.props.navigation}
                      isHost = {this.props.isHost}
                      CommissionNotice = {this.props.CommissionNotice}
                  />
                } // this takes three params (item, index, separator)
              numColumns={1} // to use grid layout, simply set gridColumn > 1
              // 尾部视图,当isFooter为true时,再设置footer视图,否则一直返回null
              // tslint:disable-next-line:max-line-length
              footer={this.state.isFooter && (() =>
                         <HomeListFooter
                               CommissionNotice = {this.props.CommissionNotice}
                               isHost = {this.props.isHost}
                               bottomData = {bottomData}
                               rid = {rid}
                               fCommunity = {this.fCommunity}
                               navigation={this.props.navigation}
                          />)
                      }
              refreshableTitle='数据更新中……'
              refreshableTitleRelease='释放刷新'
              // 下拉刷新箭头图片的高度
              arrowImageStyle={{ width: 20, height: 20, resizeMode: 'contain' }}
              dateStyle={{ color: 'lightgray' }}
              // 刷新视图的样式(注意ios必须设置高度和top距离相等,android只需要设置高度)
              refreshViewStyle={Platform.OS === 'ios' ? { height: 80, top: -80 } : { height: 80 }}
              // 刷新视图的高度
              refreshViewHeight={80}
              // 视图滚动的方法
              onScroll={this.onScroll}
              separator={() => <View style={{height: 10, backgroundColor: '#f4f4f4'}}/>}
            />
            {/* 返回顶部的按钮 */}
            <TouchableOpacity
                style={styles.toTopButton}
                onPress={() => this.listView.scrollToOffset(0, 0)}
                ref={ref => this.button = ref}
                >
                <Image style={{height: 50, width: 50}} source={require('../../images/icon_totop.png')} />
            </TouchableOpacity>
            {/* {
              this.props.isLogin && <Advertisement
                navigation={this.props.navigation}
                advertisement={advertisement}
                storeId={this.props.storeId}
                onClose={(type) => {
                  if ('newPerson' === type) {
                    this.props.dispatch(createAction('home/clearAdvertisement')({
                      advertisement: {
                        bannerNewGriftJson: [],
                        erInfotJson: advertisement.bannerInfotJson,
                      },
                    }));
                  } else if ('noMsg' === type) {
                    this.props.dispatch(createAction('home/clearAdvertisement')({
                      advertisement: {
                        bannerInfotJson: [],
                        bannerNewGriftJson: advertisement.bannerNewGriftJson,
                      },
                    }));
                  }
                }}
              />
            } */}
          </View>
        );
    }
    private onScroll = ( e ): void => {
        // 获取视图Y轴偏移量
        const offset = e.nativeEvent.contentOffset.y;
        if ( Platform.OS === 'ios' ) {
          if (offset > 64) {
            // 直接设置导航栏颜色为白色,
            // setNativeProps 方法可以理解为web的直接修改dom。使用该方法修改 View 、 Text 等 RN自带的组件 触发局部的刷新 不会触发组件生命周期
            this.button.setNativeProps({ opacity: 1.0 });
            // 因为HomeNavBar组件里面用了connect() 所以要使用HomeNacBar实例必须在HomeNavBar组件内的connect方法设置了 { withRef: true } 然后使用 getWrappedInstance()来返回HomeNavBar组件实例
            this.navbar.getWrappedInstance().setNativePropsee({NavBgColor: 'rgba(255, 255, 255,' + 1.0 + ')', BarStyleLight: false});
           } else {
             // 直接设置导航栏颜色为透明
            this.button.setNativeProps({ opacity: 0 });
            this.navbar.getWrappedInstance().setNativePropsee({NavBgColor: 'rgba(255, 255, 255,' + 0 + ')', BarStyleLight: true});
          }
        } else {
          if (offset > 110) {
            this.button.setNativeProps({ opacity: 1.0 });
            this.navbar.getWrappedInstance().setNativePropsee({NavBgColor: 'rgba(255, 255, 255,' + 1.0 + ')', BarStyleLight: false});
           } else {
            this.button.setNativeProps({ opacity: 0 });
            this.navbar.getWrappedInstance().setNativePropsee({NavBgColor: 'rgba(255, 255, 255,' + 0 + ')', BarStyleLight: true});
          }
        }
    }
      // page为起始加载的数据页数
  private onFetch = async (page = 1, startFetch, abortFetch) => {
      this.getHomeData();
    try {
      // 每次执行onFetch page 数值会增加1
      // pageLimit 是每页展示几个item
      const pageLimit = 4;
      const url = Config.HOME_FLOOR;
      const {address} = dvaStore.getState();
      const params = {
          provinceId: address.provinceId,
          cityId: address.cityId,
          districtId: address.areaId,
          street: address.streetId,
      };
      const json = await getAppJSON(url, params, undefined, true);
      //this.props.dispatch(createAction('home/fetchFlashSales')()); // 逛逛页下来刷新的时候 重新调限时抢购接口
      const rowData = json.data.floors;
      this.fCommunity = json.data.fCommunity;
      const newRow = rowData.slice(
          (page - 1) * pageLimit,
          page * pageLimit >= rowData.length ?
          rowData.length :
          page * pageLimit);
      // isFooter = page*pageLimit>=rowData.length;
      this.setState({isFooter: page * pageLimit >= rowData.length});
      if(page * pageLimit >= rowData.length && page == 2){
        this.getLikeData();
      }
      startFetch(newRow, pageLimit );
    } catch (err) {
      abortFetch(); // manually stop the refresh or pagination if it encounters network error
      Log(err);
    }
  }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    toTopButton: {
        position: 'absolute',
        right: 10,
        bottom: 20,
        height: 50,
        width: 50,
        opacity: 0,
    },
  });

export default Home;
