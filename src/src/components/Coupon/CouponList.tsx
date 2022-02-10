import * as React from 'react';
import { View, FlatList, Modal, Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Button from 'rn-custom-btn1';
import CouponRow from './CouponRow';
import { UltimateListView } from 'rn-listview';
import { getDetailJSON,  getAppJSON } from '../../netWork';
import Config from 'react-native-config';
import Empty from './Empty';
import { createAction, isLogin } from '../../utils';

export interface ICouponListProps {
  productId: string;
  brandId: string;
  cateId: string;
  price: number;
  o2oStoreId: string;

  modalVisible: boolean;
  close?: () => void;
}

export interface ICouponListState {
  visible: boolean;
}

export default class CouponList extends React.Component<ICouponListProps, ICouponListState> {

  private listView: any;

  constructor(props: ICouponListProps) {
    super(props);
    this.state = {
      visible: props.modalVisible,
    };
  }

  public componentWillReceiveProps(nextProps) {
    if (this.state.visible !== nextProps.modalVisible) {
      this.setState({
        visible: nextProps.modalVisible,
      });
    }
  }

  public render(): JSX.Element {
    const { modalVisible, close, doLogin } = this.props;
    return (
      <Modal
        animationType='slide'
        transparent={true}
        visible={this.state.visible}
        onRequestClose={() => null}
      >
        <View style={styles.bg}>
          <View style={styles.container}>
            <View style={styles.titleContain}>
              <View style={styles.titleBtn}/>
              <Text style={styles.title}>优惠券</Text>
              <Button style={styles.titleBtn} image={require('../../images/close.png')} onPress={close} local={{imageWidth: 24}}/>
            </View>
            <Text style={styles.canGet}>可领优惠券</Text>
            <UltimateListView
              ref={ref => this.listView = ref}
              item={(item) => <CouponRow {...item} closeList={close} />}
              onFetch={this.onFetch}
              keyExtractor={(item, index) => `keys${index}`}
              emptyView={() =>  <Empty />}
              allLoadedText=''
            />
          </View>
        </View>
      </Modal>
    );
  }

  private onFetch = async (page = 1, startFetch, abortFetch) => {
    try {
      const pageLimit = 10;
      const { productId, brandId, cateId, price, o2oStoreId, isFromOrder } = this.props;
      // 如果是订单提交进来 并且是选择平台优惠券
      // if (isFromOrder) {
      //   const { data } = await getAppJSON('v3/h5/sg/coupons/selectCouponsForOrderIncludeUnable.html');
      //   const listDatas = !data ? [] : data;
      //   startFetch(listDatas, pageLimit);
      //   return;
      // }
      const { data } = await getDetailJSON(Config.GOODS_COUPON_LIST, {
        productId,
        brandId,
        cateId,
        price,
        startIndex: page,
        pageSize: pageLimit,
        o2oStoreId,
      });
      Log(data);
      const listDatas = !data ? [] : data;
      startFetch(listDatas, pageLimit);
    } catch (error) {
      Log(error);
      abortFetch();
    }
  }
}

const styles = EStyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
});
