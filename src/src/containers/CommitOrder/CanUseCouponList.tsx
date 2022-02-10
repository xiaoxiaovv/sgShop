import * as React from 'react';
import { View, FlatList, Modal, Text, TouchableOpacity, Image } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Button from 'rn-custom-btn1';
import { UltimateListView } from 'rn-listview';
import { getDetailJSON, getAppJSON ,postAppForm} from '../../netWork';
import Config from 'react-native-config';
import Empty from '../../components/Coupon/Empty';
import CanUserCouponRow from './CanUserCouponRow';
import { createAction, naviBarHeight } from '../../utils/index';
import { ICustomContain } from '../../interface/index';
import URL from '../../config/url';
import { GET, POST_JSON, GET_P, POST_FORM } from '../../config/Http';
import Color from '../../consts/Color';
let width = URL.width;
let height = URL.height;
let productId = '';


import newEmpty from '../../images/ic_haier_2.png';

export interface ICouponListProps {
  productId: string;
  brandId: string;
  cateId: string;
  price: number;
  o2oStoreId: string;
  modalVisible: boolean;
  close?: () => void;
}

// export interface ICouponListState {
// }
let currentItem;
export default class CanUseCouponList extends React.Component<ICouponListProps & ICustomContain> {
  private static navigationOptions = ({ navigation }) => {
    // Log(navigation.state);
    const { params = {} } = navigation.state;
    if (params.productId) {
      productId = params.productId;
    }
    const skku = params.skku;
    const sku = params.sku;
    const attrValueNames = params.attrValueNames;
    const o2oAttrId = params.o2oAttrId;
    return {
      title: '可用优惠券',
      headerTitleStyle: {
        color: '#333333',
        flex: 1,
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 17,
        letterSpacing: -0.41
      },
      headerTintColor: '#878787',
      headerBackTitle: null,
      headerLeft:(<Button
        style={{ width: 25, height: 40}}
        imageStyle={{ width: 25, height: 25, resizeMode: 'contain' }}
        image={require('../../images/left.png')}
        onPress= { params.handleGoBack ? () => params.handleGoBack() : () => { navigation.goBack(); }}/>),
      headerRight: (
        <TouchableOpacity
          style={{ width: 40 }}
          onPress={
            () =>{
              if(navigation.getParam('hasList')){ // 有列表 yl
                dvaStore.dispatch(createAction('order/selectedCouponNew')({
                  memberCouponId: params.memberCouponId,
                  productId, skku, attrValueNames, o2oAttrId,
                  sku,
                  type: params.type,
                }))
              }else{
                navigation.goBack()
              }
            }
          }>
          <Text style={styles.decideText}>确定</Text>
        </TouchableOpacity>),
    };
  }

  private listView: any;
  constructor(props: ICouponListProps) {
    super(props);
    this.state = {
      checkItem: { memberCouponId: '', productId: '', seleted: false },
      first: true,
    };
    this.props.navigation.setParams({
      hasList: false
    })
  }
  public render(): JSX.Element {
    const mstate = this.state.checkItem;
    return (
      <UltimateListView
        ref={ref => this.listView = ref}
        item={(item) => {
          if(item.canUse){
            let ischecked = (item.isForUse === 1) && this.state.first;
            if (ischecked) {
              currentItem = item;
            }
            // 如果用户没有选择 则使用默认
            if (mstate.memberCouponId) {
              ischecked = mstate.memberCouponId === item.memberCouponId;
            }
            return <CanUserCouponRow ischecked={ischecked} {...item} onPress={(mitem) => this.onPress(mitem)} />;
          }else{
            return null
          }
        }}
        onFetch={this.onFetch}
        keyExtractor={(item, index) => `keys${index}`}
        emptyView={() => {
          return (
            <View style={styles.emptyContainer}>
              <Image style={[{height: 120, width: 120, marginBottom: 20}]} source={newEmpty}/>
              <Text style={{ color: '#333333',marginBottom: 15 }}>您目前没有可用的优惠券!</Text>
              <Text style={{ color: '#333333',marginBottom: 20 }}>快去领券吧!</Text>
              <TouchableOpacity
                style={styles.comfirmBtn}
                onPress={
                  () => this.props.navigation.goBack()
                }>
                  <Text style={{ color: '#ffffff', fontSize: 16 }}>确定</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    );
  }
  private onPress(mitem) {
    if (mitem.memberCouponId === this.state.checkItem.memberCouponId || (currentItem && mitem.memberCouponId === currentItem.memberCouponId)) {
      this.setState({ checkItem: { memberCouponId: '', productId: '', seleted: false }, first: false });
      currentItem = { checkItem: { memberCouponId: '', productId: '', seleted: false }, first: false };
      this.props.navigation.setParams({ memberCouponId: '', productId: '' });
    } else {
      this.setState({ checkItem: mitem, first: false });
      currentItem = mitem;
      this.props.navigation.setParams({ memberCouponId: mitem.memberCouponId, productId: mitem.productId });
    }
  }
  private onFetch = async (page = 1, startFetch, abortFetch) => {
    try {
      const pageLimit = 100;
      const { navigation: { state: { params } } } = this.props;
      if (params.productId) {
        // const url = `v3/h5/order/getStoreCoupon.json?product=${params.productId}`;
        const { data } = await POST_JSON(URL.GETSTORECOUPON+'?product='+params.productId);
        const listDatas = !data ? [] : data;
        startFetch(listDatas, pageLimit);
        if(data && data.length > 0){
          this.props.navigation.setParams({
            hasList: true
          })
        }else{
          this.props.navigation.setParams({
            hasList: false
          })
        }
        return;
      }
      const { data } = await POST_JSON(URL.GETORDERCOUPON);
      const listDatas = !data ? [] : data;
      startFetch(listDatas, pageLimit);
      if(data && data.length > 0){
        this.props.navigation.setParams({
          hasList: true
        })
      }else{
        this.props.navigation.setParams({
          hasList: false
        })
      }
    } catch (error) {
      Log(error);
      abortFetch();
    }
  }
}

const styles = EStyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flexDirection: 'column-reverse',
  },
  container: {
    height: '535rem',
    width: '375rem',
    backgroundColor: '#EEEEEE',
  },
  titleContain: {
    width: '375rem',
    height: '44rem',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleBtn: {
    width: '60rem',
    height: '44rem',
  },
  title: {
    fontSize: '17rem',
  },
  canGet: {
    margin: 16,
    fontSize: '14rem',
    color: '#333333',
  },
  decideText: {
    color: Color.GREY_1,
    fontSize: 16,
  },
  emptyContainer: {
    width,
    height: height - naviBarHeight - 100,
    backgroundColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  comfirmBtn: {
    backgroundColor: '#2979ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    width: '300rem',
    height: '44rem',
  },
});
