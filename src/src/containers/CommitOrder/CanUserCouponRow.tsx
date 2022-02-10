import * as React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Image } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { ICoupon } from '../../interface';
import { getAppJSON } from '../../netWork';
import Config from 'react-native-config';

interface ICouponRowState {
  beGeted?: boolean;
}

class CanUserCouponRow extends React.Component<ICoupon, ICouponRowState> {

  constructor(props) {
    super(props);
    this.state = {
      checkItem: {id:''},
    };
  }

 public render(): JSX.Element {
    const {
      ischecked, id: couponID, amount: couponValue, fullCutPriceDoc, couponType, amountDoc, beginTimeShow, endTimeShow
      ,
    } = this.props;
    let mfullCutPriceDoc = fullCutPriceDoc;
    if ( !IS_NOTNIL(fullCutPriceDoc)) {
      mfullCutPriceDoc = '';
    }
    let mcouponType = couponType;
    if (!IS_NOTNIL(couponType)) {
      mcouponType = '';
    }
    let mamountDoc = amountDoc;
    if (!IS_NOTNIL(amountDoc)) {
      mamountDoc = '';
    }
    const conponBg = (couponType && couponType != 2 && couponType != '店铺券') ?
     require('../../images/conpon_row_bg.png') : require('../../images/conpon_row_blue.png');

    return (
      <ImageBackground style={styles.rowContain} resizeMode='contain' source={conponBg}>
          <TouchableOpacity style={styles.getBtn} onPress={() => this.props.onPress(this.props)}>
            <Image style={{height: 25, width: 25}} source={ischecked ? require('../../images/ic_select.png') : require('../../images/ic_check.png')}/>
          </TouchableOpacity>
        <View style={{ flex: 1}}>
          <View style={styles.moneyContain}>
            <Text style={styles.fuhao}>￥</Text>
            <Text style={styles.money}>{couponValue}</Text>
            <Text style={[styles.guanquan, {marginLeft: 10, marginTop: 15}]}>{mfullCutPriceDoc}</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.condition}>{`${mcouponType}  ${mamountDoc}`}</Text>
            <Text style={styles.condition}>{`使用时间:${beginTimeShow}--${endTimeShow}`}</Text>
          </View>
        </View>
      </ImageBackground>
    );
  }
  private receiveCoupon = async (couponId) => {
    try {
      const { data } = await getAppJSON(Config.GOODS_RECEIVE_COUPON, { couponId });
      if (data) { this.setState({ beGeted: true }); }
    } catch (error) {
      Log(error);
    }
  }
}

export default CanUserCouponRow;

const styles = EStyleSheet.create({
  rowContain: {
    flexDirection: 'row',
    width: '375rem - 10',
    height: '90rem',
    margin: 4,
    marginLeft: 5,
    // backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  moneyContain: {
    flexDirection: 'row',
    height: '35rem',
    marginLeft: 10,
    alignItems: 'center',
  },
  fuhao: {
    alignSelf: 'flex-end',
    color: 'white',
  },
  money: {
    color: 'white',
    fontSize: '30rem',
    fontFamily: 'Helvetica',
  },
  content: {
    justifyContent: 'space-around',
    height: '50rem',
    margin: 10,
    marginTop: 0,
  },
  guanquan: {
    color: 'white',
    fontSize: '12rem',
  },
  condition: {
    color: 'white',
    fontSize: '12rem',
    backgroundColor: 'transparent'
  },
  getBtn: {
    width: '69rem',
    height: '90rem',
    alignItems: 'center',
    justifyContent: 'center',
  },
  getText: {
    fontSize: '18rem',
    color: 'white',
    width: '40rem',
    backgroundColor: 'transparent'
  },
});
