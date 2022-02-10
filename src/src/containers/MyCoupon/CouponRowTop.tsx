import * as React from 'react';
import { View, Text, ImageBackground } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { ICouponCenterItem } from '../../interface';

interface ICouponRowTopProps {
  style?: object;
  bgImg?: any;
}

const CouponRowTop: React.SFC<ICouponRowTopProps & ICouponCenterItem> = ({
  couponValue, platformCoupon, minAmountDoc, startTime, endTime, style, bgImg, couponType, CouponType,
}) => {
  const defaultbg: any = (couponType === 2 || CouponType === '店铺券') ?
    require('../../images/couponblue.png') :
    require('../../images/couponred.png');
  return (
    <ImageBackground
      source={bgImg || defaultbg}
      // defaultSource={defaultbg}
      style={[styles.topView, style]}
    >
      <View style={styles.moneyContain}>
        <Text style={styles.fuhao}>￥</Text>
        <Text style={styles.money}>{couponValue}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.condition}>{platformCoupon}</Text>
        <Text style={styles.condition}>{minAmountDoc}</Text>
        <Text style={styles.condition}>{`${startTime}-${endTime}`}</Text>
      </View>
    </ImageBackground>
  );
};

export default CouponRowTop;

const styles = EStyleSheet.create({
  topView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  moneyContain: {
    flexDirection: 'row',
    height: '50rem',
    marginLeft: 32,
  },
  fuhao: {
    alignSelf: 'flex-end',
    color: 'white',
    marginBottom: 12,
  },
  money: {
    color: 'white',
    fontSize: '40rem',
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
  },
  content: {
    justifyContent: 'space-around',
    marginLeft: 32,
    flex: 1,
    marginRight: 16,
  },
  condition: {
    color: 'white',
    fontSize: '$fontSize2',
    margin: 2,
  },
});
