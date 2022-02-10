import * as React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Image } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { ICoupon } from '../../interface';
import { getAppJSON } from '../../netWork';
import { isLogin, createAction } from '../../utils';
import Config from 'react-native-config';
import { Toast } from 'antd-mobile';

interface ICouponRowState {
  beGeted?: boolean;
}

interface ICouponRowProps {
  closeList: () => void;
}

class CouponRow extends React.Component<ICoupon & ICouponRowProps, ICouponRowState> {

  constructor(props) {
    super(props);
    this.state = {
      beGeted: props.displayType === 2,
    };
  }

 public render(): JSX.Element {
    const {
      id: couponID, couponValue, displayType, platformCoupon, minAmountDoc, limitProductDoc, timeDoc,
    } = this.props;
    return (
      <ImageBackground style={styles.rowContain} source={require('../../images/conponrowbg.png')}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.moneyContain}>
            <Text style={styles.fuhao}>￥</Text>
            <Text style={styles.money}>{couponValue}</Text>
          </View>
          <View style={styles.content}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.guanquan}>逛券</Text>
              <Text style={styles.condition}>{minAmountDoc}</Text>
            </View>
            <Text style={styles.shiYong}>{limitProductDoc}</Text>
            <Text style={styles.time}>{timeDoc}</Text>
          </View>
        </View>
        {this.state.beGeted ?
          <Image style={styles.getBtn} resizeMode='contain' source={require('../../images/coupon_yl.png')} /> :
          <TouchableOpacity style={styles.getBtn} onPress={() => this.receiveCoupon(couponID)}>
            <Text style={styles.getText}>点击</Text>
            <Text style={styles.getText}>领取</Text>
          </TouchableOpacity>
        }
      </ImageBackground>
    );
  }
  private receiveCoupon = async (couponId) => {
    if (!isLogin(() => {
      this.props.closeList();
      dvaStore.dispatch(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'Login' }));
    })) { return; }
    try {
      const { data, message, success } = await getAppJSON(Config.GOODS_RECEIVE_COUPON, { couponId });
      if (data && success) {
        this.setState({ beGeted: true });
      } else {
        this.props.closeList();
        Toast.show(message);
      }
    } catch (error) {
      Log(error);
    }
  }
}

export default CouponRow;

const styles = EStyleSheet.create({
  rowContain: {
    flexDirection: 'row',
    width: '375rem - 32',
    height: '90rem',
    margin: 4,
    marginLeft: 16,
  },
  moneyContain: {
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: -5,
  },
  fuhao: {
    alignSelf: 'flex-end',
    color: '#F56767',
    marginBottom: '5rem',
  },
  money: {
    color: '#F56767',
    fontSize: '25rem',
    width: '83rem',
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
  },
  content: {
    justifyContent: 'space-around',
    height: '82rem',
    flex:1,
  },
  guanquan: {
    borderWidth: 1,
    borderColor: '#F56767',
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 2,
    paddingBottom: 2,
    color: '#F56767',
    fontSize: '12rem',
  },
  condition: {
    color: '#F56767',
    fontSize: '12rem',
    marginLeft: 4,
  },
  shiYong: {
    color: '#333333',
    fontSize: '12rem',
  },
  time: {
    color: '#999',
    fontSize: '12rem',
  },
  getBtn: {
    width: '69rem',
    height: '90rem',
    alignItems: 'center',
    justifyContent: 'center',
  },
  getText: {
    fontSize: '$fontSize3',
    color: 'white',
  },
});
