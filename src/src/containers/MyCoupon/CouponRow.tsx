import * as React from 'react';
import { View, ImageBackground, Text, TouchableOpacity, Alert } from 'react-native';
import Button from 'rn-custom-btn1';
import * as Progress from 'react-native-progress';
import EStyleSheet from 'react-native-extended-stylesheet';
import { ICouponCenterItem } from '../../interface';
import Countdown from '../../components/Countdown';
import CustomAlert from '../../components/CustomAlert';
import CouponRowTop from './CouponRowTop';
import { createAction } from '../../utils';
import { getCoupon, couponGiveOther } from '../../service/coupon';
import { getMemberById } from '../../service/common';

const detailText = '';
interface ICouponRowState {
  timeDiff: number;
  showDetail: boolean;
  percent: number;
  beGeted: boolean;
  showGiveOther: boolean;
  alertMessage: any;
}

interface ICouponRowProps {
  fromCenter: boolean;
  beUsed: boolean;
  beExpired: boolean;
  loadList: () => void;
}
class CouponRow extends React.Component<ICouponCenterItem & ICouponRowProps, ICouponRowState> {
  constructor(props: ICouponCenterItem & ICouponRowProps) {
    super(props);
    const timeDiff = props.activityStartTime * 1000 - Date.parse(String(new Date()));
    this.state = {
      timeDiff,
      showDetail: false,
      showGiveOther: false,
      alertMessage: '',
      percent: (props.displayType === '5') ? 100 : props.percent,
      beGeted:  !!props.CouponType || props.displayType === '2',
    };
  }
  public render() {
    const {
      activityStartTime, couponValue, minAmountDoc, platformCoupon, startTime, endTime, couponType, CouponType, fromCenter, beUsed, beExpired,
    } = this.props;
    const { percent, timeDiff, beGeted } = this.state;
    const bottomCenterView = (
      beGeted ? null :
      (
        this.state.timeDiff < 0 ?
        <Progress.Bar
          style={{ marginLeft: 4 }}
          progress={(percent % 100) / 100.00}
          width={80}
          height={8}
          borderWidth={0}
          color='#E04B51' unfilledColor='#E4E4E4'
        /> :
        <Countdown
          timeDiff={timeDiff}
          stop={() => this.setState({ timeDiff: -1 })}
        />
      )
    );
    let bottomCenterTitle = beGeted ? '' : ( timeDiff < 0 ? `??????${percent}%` : '???????????????');
    const bottomBtnStyle = beGeted ? [styles.bottomBtn, styles.giveOther] : styles.bottomBtn;
    const bottomBtnTextStyle = beGeted ? styles.giveOtherText : styles.bottomText;
    let bootomBtn = (
      <Button
        title={beGeted ? '????????????' : ( timeDiff < 0 ? '????????????' : '?????????')}
        style={bottomBtnStyle}
        textStyle={bottomBtnTextStyle}
        onPress={beGeted ? this.goUse : (timeDiff < 0 ? this.getCouponAction : this.remandMe)}
      />
    );
    if (beUsed || percent === 100) {
      bottomCenterTitle = '';
      bootomBtn = <Button title={beUsed ? '?????????' : '?????????'}
        style={[styles.bottomBtn, styles.bottomBtnNone]}
        textStyle={[styles.bottomText, { color: 'white' }]}
      />;
    }
    if (beExpired) {
      bottomCenterTitle = '';
      bootomBtn = <Button title={'?????????'}
        style={[styles.bottomBtn, styles.bottomBtnNone, { backgroundColor:'#E04B51'}]}
        textStyle={[styles.bottomText, { color: 'white' }]}
      />;
    }
    let bgImg: any = beGeted ? require('../../images/coupon_red_get.png') : require('../../images/coupon_red.png');
    if (couponType === 2 || CouponType === '?????????') {
      bgImg = beGeted ? require('../../images/coupon_blue_get.png') : require('../../images/coupon_blue.png');
    }
    return (
      <View style={styles.contain}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => this.setState({ showDetail: true })}>
          <View style={{ flex: 1 }}>
            <CouponRowTop bgImg={bgImg} style={styles.topView} {...this.props} />
            <ImageBackground style={styles.bottomView} source={require('../../images/coupon_bottom.png')}>
              <Text style={styles.bottomTitle}>??????</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.bottomCenterTitle}>{bottomCenterTitle}</Text>
                {bottomCenterView}
              </View>
              <View style={{ flexDirection: 'row' }}>
                {!fromCenter && !beUsed &&
                  <Button
                    title='??????'
                    style={[styles.bottomBtn, styles.giveOther]}
                    textStyle={styles.giveOtherText}
                    onPress={() => this.setState({ showGiveOther: true ,alertMessage: ''})}
                  />
                }
                {bootomBtn}
              </View>
            </ImageBackground >
          </View>
        </TouchableOpacity>
        {(beUsed || percent === 100) && <View style={styles.cover}/>}
        <CustomAlert
          visible={this.state.showGiveOther}
          alertMessage={this.state.alertMessage}
          onClose={() => this.setState({ showGiveOther: false })}
          confirm={this.giveOtherAction}
          detailText='??????????????????????????????ID'
          placeholder='??????ID'
        />
        <CustomAlert
          visible={this.state.showDetail}
          onClose={() => this.setState({ showDetail: false })}
          confirm={() => this.setState({ showDetail: false })}
        >
          <Text style={styles.detailTitle}>????????????</Text>
          <Text style={styles.detailText}>1?????????????????????????????????????????????????????????;</Text>
          <Text style={styles.detailText}>2????????????????????????????????????????????????????????????????????????????????????????????????????????????;</Text>
          <Text style={styles.detailText}>3???????????????????????????????????????????????????????????????????????????????????????O2O????????????;</Text>
          <Text style={styles.detailText}>4????????????????????????????????????????????????;</Text>
          <Text style={styles.detailText}>5?????????????????????????????????????????????????????????????????????????????????;</Text>
          <Text style={styles.detailText}>6?????????????????????????????????????????????????????????????????????????????????????????????????????????;</Text>
          <Text style={styles.detailText}>7???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????;</Text>
        </CustomAlert>
      </View>
    );
  }

  private getCouponAction = () => getCoupon(this.props.id, () => this.setState({ beGeted: true }));
  private giveOtherAction = async (memberId) => {
    // this.props.loadList();
    // return;
    getMemberById(memberId, (scsData) => {
      this.setState({ showGiveOther: false }, () => {
        setTimeout(() => {
          Alert.alert(
            '',
            `?????????????????????????????????${scsData.data}??????`,
            [
              {text: '??????'},
              {text: '??????', onPress: () => {
                couponGiveOther(memberId, this.props.memberCouponId, () => this.props.loadList());
              }},
            ],
            { cancelable: false },
          );
        }, 100);
      });
    },
    (scsData)=>{
      this.setState({ alertMessage: scsData.message});
    }
  );
  }
  private remandMe = () => {
    //
  }
  private goUse = () => {
    dvaStore.dispatch(createAction('router/apply')({
      type: 'Navigation/NAVIGATE', routeName: 'UseCoupon', params: { couponId: this.props.id },
    }));
  }
}

export default CouponRow;

import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;


const containWidth = width - 32;
const styles = EStyleSheet.create({
  contain: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  topView: {
    width: containWidth,
    height: containWidth / 690.0???*???236.0,
    backgroundColor: 'transparent',
    borderRadius: 0,
  },
  bottomView: {
    height: containWidth / 690.0???*???96.0,
    width: containWidth,
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  bottomTitle: {
    color: '$black',
    fontSize: '$fontSize3',
  },
  bottomCenterTitle: {
    color: '$black',
    fontSize: '$fontSize2',
    marginLeft: 4,
  },
  bottomBtn: {
    backgroundColor: '#E04B51',
    width: '85rem',
    height: '28rem',
    borderRadius: '14rem',
    padding: 0,
  },
  bottomBtnNone: {
    backgroundColor: '$lightblack',
  },
  bottomText: {
    color: 'white',
    fontSize: '$fontSize3',
    margin: 0,
  },
  giveOther: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E04B51',
    marginRight: 8,
  },
  giveOtherText: {
    color: '#E04B51',
    fontSize: '$fontSize3',
  },
  cover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  detailTitle: {
    alignSelf: 'flex-start',
    margin: 8,
    fontSize: '$fontSize4',
    color: '$darkblack',
  },
  detailText: {
    alignSelf: 'flex-start',
    margin: 8,
    fontSize: '$fontSize2',
    color: '$black',
  },
});
