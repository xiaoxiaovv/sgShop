import * as React from 'react';
import { View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { connect } from '../../../utils';
import CouponList from '../../../components/Coupon/CouponList';

interface ICouponProps {
  modelId: string;
  couponArr?: string[];
  showLast?: boolean;

  finalPrice?: number;
  productId?: string;
  brandId?: string;
  productCateId?: string;
  o2oStoreId?: string;
}

interface ICouponState {
  showCouponList: boolean;
}

const mapStateToProps = (
  {
    goodsDetail,
  },
  { modelId },
) => {
  try {
    const couponList = goodsDetail.getIn([modelId, 'couponList']);
    return {
      couponArr: couponList,
      showLast: couponList && couponList.size >= 3,
      finalPrice: goodsDetail.getIn([modelId, 'pfData', 'finalPrice']),
      productId: goodsDetail.getIn([modelId, 'productId']),
      productCateId: goodsDetail.getIn([modelId, 'data', 'product', 'productCateId']),
      brandId: goodsDetail.getIn([modelId, 'data', 'product', 'brandId']),
      o2oStoreId: goodsDetail.getIn([modelId, 'O2OSData', 'o2oStoreId']),
    };
  } catch (error) {
    Log(error);
    return {};
  }
};

@connect(mapStateToProps)
export default class Coupon extends React.PureComponent<ICouponProps, ICouponState> {
  constructor(props) {
    super(props);
    this.state = {
      showCouponList: false,
    };
  }

  public render(): JSX.Element {
    if (!this.props.couponArr) { return null; }
    const { couponArr, showLast, productCateId, brandId, productId, finalPrice, o2oStoreId } = this.props;
    if (!couponArr || couponArr.length <= 0) { return null; }
    return (
      <View style={styles.container}>
        <Text style={styles.getCp}>领券</Text>
        <View style={styles.couponsStyle}>
          {couponArr.map((title , index) => (
            <TouchableOpacity
              key={`key${index}`}
              style={styles.couponBgContain}
              onPress={() => this.setState({ showCouponList: true })}
            >
              <ImageBackground style={styles.couponBg} source={require('../../../images/couponbg.png')}>
                <Text style={styles.couponTitle}>{title}</Text>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
        {showLast && <TouchableOpacity onPress={() => this.setState({ showCouponList: true })}><Image style={styles.last} source={require('../../../images/moreCp.png')} /></TouchableOpacity>}
        {!!finalPrice &&
          <CouponList
            modalVisible={this.state.showCouponList}
            close={() => this.setState({ showCouponList: false})}
            productId={productId}
            brandId={brandId}
            cateId={productCateId}
            price={finalPrice}
            o2oStoreId={o2oStoreId}
          />
        }
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  // $conponWith: '375rem '
  container: {
    height: '48rem',
    width: '375rem - 32',
    borderBottomWidth: 1,
    borderColor: '$lightgray',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16,
  },
  getCp: {
    fontSize: '14rem',
    color: '#666666',
  },
  couponBgContain: {
    alignItems: 'center',
    justifyContent: 'center',
    // width: '90rem',
    height: '48rem',
    marginLeft: '6rem',
  },
  couponBg: {
    alignItems: 'center',
    justifyContent: 'center',
    // minWidth: '100rem',
    height: '18rem',
    paddingLeft: '8rem',
    paddingRight: '8rem',
  },
  couponTitle: {
    fontSize: '$fontSize2',
    color: 'white',
  },
  last: {
    width: '24rem',
    height: '24rem',
  },
  couponsStyle: {
    flexWrap: 'wrap', 
    overflow: 'hidden',
    flex: 1,
    paddingRight: 16, 
    height: '48rem',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
