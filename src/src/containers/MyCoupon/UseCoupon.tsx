import * as React from 'react';
import { View } from 'react-native';
import { UltimateListView } from 'rn-listview';
import Config from 'react-native-config';
import CouponRowTop from './CouponRowTop';
import { ICouponCenterItem } from '../../interface';
import EStyleSheet from 'react-native-extended-stylesheet';
import { getAppJSON } from '../../netWork';
import { GoodCard } from '../Categories/GoodsList';

export interface IUseCouponState {
  coupon: ICouponCenterItem;
}

export default class UseCoupon extends React.Component<any, IUseCouponState> {
  constructor(props: IUseCouponProps) {
    super(props);

    this.state = {
      coupon: null,
    };
  }

  public render() {
    const { coupon } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {coupon && <CouponRowTop style={styles.top} {...coupon} />}
        <UltimateListView
          style={{ flex: 1 }}
          item={(item, index) => <GoodCard item={item} index={index} handlePress={this.handleGoodPress} /> }
          onFetch={this.onFetch}
          keyExtractor={(item, index) => `keys${index}`}
        />
      </View>
    );
  }

  private handleGoodPress = (item) => {
    this.props.navigation.navigate('GoodsDetail', { productId: item.productId, storeId: dvaStore.getState().users.mid });
  }

  private onFetch = async ( startIndex = 1, startFetch, abortFetch) => {
    try {
      const { couponId } = this.props.navigation.state.params;
      const pageSize = 5;
      const { productsList, coupon } = await getAppJSON(Config.COUPON_USE_LIST, { couponId, startIndex, pageSize });
      this.setState({ coupon });
      startFetch(productsList, pageSize);
    } catch (error) {
      abortFetch;
      Log(error);
    }
  }
}

const styles = EStyleSheet.create({
  top: {
    width: '375rem - 32',
    height: '140rem',
    margin: 16,
  },
});
