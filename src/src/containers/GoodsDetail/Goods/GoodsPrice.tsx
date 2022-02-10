import * as React from 'react';
import { Text, View, Image } from 'react-native';
import moment from 'moment';
import StyleSheet from 'react-native-extended-stylesheet';
import Countdown from '../../../components/Countdown';
import LinearGradient from 'react-native-linear-gradient';
import Button from 'rn-custom-btn1';
import { IPreferential, GoodsBuyType } from '../../../interface';
import { createIdAction, connect, width } from '../../../utils';
import {Color, Font} from 'consts';
import L from 'lodash';

interface IGoodsPriceProps {
  modelId: string;
  params: any;
  remark?: string;
  activityEndTime?: number;
  activityStartTime?: number;
  activityNowTime?: number;
  type?: GoodsBuyType;
  showHongbao?: boolean;
  remendClick?: () => void;
}

const mapStateToProps = (
  {
    goodsDetail,
    users,
  },
  { modelId },
) => {
  try {
    const { isHost, CommissionNotice } = users || { isHost : 0, CommissionNotice: false };
    return {
      storeId: users.mid,
      showHongbao: isHost > 0 && CommissionNotice,
      finalPrice: goodsDetail.getIn([modelId, 'pfData', 'finalPrice']),
      commission: goodsDetail.getIn([modelId, 'pfData', 'commission']),
      actualPrice: goodsDetail.getIn([modelId, 'pfData', 'actualPrice']),
      originalPrice: goodsDetail.getIn([modelId, 'pfData', 'originalPrice']),
      isActivityProduct: goodsDetail.getIn([modelId, 'pfData', 'isActivityProduct']),
      isFlashsales: goodsDetail.getIn([modelId, 'pfData', 'isFlashsales']),
      isAcReserve: goodsDetail.getIn([modelId, 'pfData', 'isAcReserve']),
      acReserveType: goodsDetail.getIn([modelId, 'pfData', 'acReserveType']),
      activityEndTime: goodsDetail.getIn([modelId, 'pfData', 'activityEndTime']),
      acReserveNum: goodsDetail.getIn([modelId, 'pfData', 'acReserveNum']),
      acPurchaseNum: goodsDetail.getIn([modelId, 'pfData', 'acPurchaseNum']),
      giftInfo: goodsDetail.getIn([modelId, 'pfData', 'giftInfo']),
      activityNowTime: goodsDetail.getIn([modelId, 'data', 'activityNowTime']),
      remark: goodsDetail.getIn([modelId, 'data', 'product', 'productActivityInfo']),
      type: goodsDetail.getIn([modelId, 'uiState', 'buyBtnType']),
    };
  } catch (error) {
    Log('====GOODSPRICE===', error);
    return { finalPrice: null };
  }
};

@connect(mapStateToProps)
class GoodsPrice extends React.PureComponent<IGoodsPriceProps & IPreferential> {
  public static defaultProps: IGoodsPriceProps & IPreferential;
  constructor(props: IGoodsPriceProps & IPreferential) {
    super(props);
  }

  public render(): JSX.Element {
    const {
      finalPrice,
      commission,
      actualPrice,
      originalPrice,
      isActivityProduct,
      isFlashsales,
      isAcReserve,
      acReserveType,
      activityEndTime,
      giftInfo,
      remark,
      remendClick,
      activityStartTime,
      activityNowTime,
      showHongbao,
      type,
      modelId,
      params,
      storeId,
      acReserveNum,
      acPurchaseNum,
    } = this.props;
    if (!finalPrice) { return null; }
    const { preferentialStyle, colors, priceColorStyle, orgPriceStyle, hongbaoStyle,
      behindContain, hongbaoImg, timeTitle, peopleTitle, frontContain } = this.getStyles();
    let activityEndTimeX = (activityEndTime && typeof (activityEndTime) === 'string') ? new Date(activityEndTime.replace(/-/g, '/')).getTime() : activityEndTime;
    // (!productModel.isActivityProduct)&&isAcReserve&&(acReserveType==1)
    let price;
    if (isActivityProduct) {
      price = finalPrice;
    // } else if (!isActivityProduct && ( isFlashsales || ( isAcReserve && acReserveType === 2))) {
    //   price = actualPrice; // 抢购价
    // } else if (!isActivityProduct && isAcReserve && acReserveType === 1) {
    //   price = actualPrice; // 预约价
    } else {
      price = actualPrice;
      // price = finalPrice;
    }
    return (
      <View>
        <View style={preferentialStyle}>
          <LinearGradient
            start={{x: 0, y: 0.5}} end={{x: 1.0, y: 0.5}}
            colors={colors}
            style={frontContain}>
            <View style={styles.priceContain}>
              <Text style={[styles.priceSB, priceColorStyle]}>{'￥ '}</Text>
              <Text style={[styles.price, priceColorStyle]}>{price && price.toFixed(2)}</Text>
              {!!showHongbao && commission >= 0 && [
                <View style={hongbaoStyle}>
                  <Image style={styles.hongbaoImage} source={hongbaoImg} resizeMode='contain'/>
                </View>,
                <Text style={[styles.hongbaoPrice, priceColorStyle]}>{`￥${commission}`}</Text>,
              ]}
            </View>
            <View style={{ flexDirection: 'row'}}>
              {(!isActivityProduct && originalPrice && (isFlashsales || isAcReserve)) ?
                <Text style={[orgPriceStyle, { marginRight: 16, textDecorationLine: 'line-through' }]}>
                  {`￥${originalPrice}`}
                </Text> : null
              }
              {(actualPrice && isActivityProduct) && <Text style={orgPriceStyle}>{`预付金：￥${actualPrice}`}</Text>}
              {!!peopleTitle && <Text style={orgPriceStyle}>{peopleTitle}</Text>}
            </View>
          </LinearGradient>
          {activityEndTime && activityEndTimeX > activityNowTime * 1000 &&
            <View style={behindContain}>
              <Text style={styles.timeTitle}>{timeTitle}</Text>
            {!!activityEndTimeX && activityEndTimeX > activityNowTime * 1000 &&
              <Countdown
                timeDiff={activityEndTimeX - activityNowTime * 1000}
                stop={() => dvaStore.dispatch(createIdAction('goodsDetail/loadingData')({ ...params,
                  modelId: this.props.modelId, storeId: params.storeId || storeId, isFirstLoad: false })) }
              />
              }
            </View>
          }
        </View>
        {!!remark && <Text style={styles.remark}>{L.trimEnd(remark,'\n')}</Text>}
        {!!giftInfo && <Text style={styles.goodsRemend}>{`商家备注：${giftInfo}`}</Text>}
        <View style={styles.sperator}/>

      </View>
    );
  }

  private getStyles = () => {
    const { type, activityEndTime, acReserveNum, acPurchaseNum, activityNowTime } = this.props;
    let activityEndTimeY = (activityEndTime && typeof (activityEndTime) === 'string') ? new Date(activityEndTime.replace(/-/g, '/')).getTime() : activityEndTime;
    let colors: string[] = ['white', 'white'];
    let priceColorStyle: object = { color: '#FF6026' };
    let hongbaoStyle: object = styles.hongbao;
    let orgPriceStyle: object = [styles.orgPrice, { color: '#999999' }];
    let behindContain: object = [styles.behindContain, { alignItems: 'flex-end', paddingRight: 16 }];
    let hongbaoImg = require('../../../images/hongbao.png');
    let timeTitle = '';
    let peopleTitle = '';
    let preferentialStyle = styles.preferential;
    let frontContain = styles.frontContain;
    if (activityEndTime && activityEndTimeY - activityNowTime * 1000 > 0) {
      colors = ['#FF6026', '#FF7F28'];
      priceColorStyle = {};
      preferentialStyle = [styles.preferential, {marginTop: 16, marginBottom: 8}],
      frontContain = [styles.frontContain, {height: 56}],
      hongbaoStyle = styles.hongbao;
      orgPriceStyle = styles.orgPrice;
      behindContain = styles.behindContain;
      hongbaoImg = require('../../../images/hongbao_white.png');
      timeTitle = '距抢购结束还剩：';
      // moment(activityStartTime).format('预计MM月DD日HH:mm开始')
    }
    switch (type) {
      case GoodsBuyType.Date:
        timeTitle = '距预约结束还剩：';
        peopleTitle = acReserveNum ? `已有${acReserveNum}人预约` : '';
        break;
      case GoodsBuyType.RushNow:
        timeTitle = '距抢购结束还剩：';
        peopleTitle = acPurchaseNum ? `已有${acPurchaseNum}人抢购` : '';
        break;
      default:
        break;
    }
    return { preferentialStyle, colors, priceColorStyle, orgPriceStyle, hongbaoStyle,
      behindContain, hongbaoImg, timeTitle, peopleTitle, frontContain };
  }
}

const styles = StyleSheet.create({
  preferential: {
    width: '375rem',
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
  },
  frontContain: {
    justifyContent: 'center',
    width: '250rem',
    paddingLeft: '16rem',
  },
  priceContain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceSB: {
    fontSize: '12rem',
    color: 'white',
    paddingTop: '4rem',
    fontWeight: '500',
  },
  price: {
    fontSize: '23rem',
    fontWeight: '500',
    color: 'white',
  },
  hongbao: {
    width: '18rem',
    height: '18rem',
    borderRadius: '9rem',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  hongbaoImage: {
    width: '18rem',
    height: '18rem',
  },
  hongbaoPrice: {
    fontSize: '12rem',
    color: '#F6C6AF',
    marginLeft: 4,
  },
  orgPrice: {
    fontSize: '12rem',
    color: '#F6C6AF',
    lineHeight: 20,
  },
  behindContain: {
    justifyContent: 'space-around',
    height: 56,
    minWidth: '125rem',
    alignItems: 'center',
    backgroundColor: Color.ORANGE_10,
  },
  timeTitle: {
    fontSize: '12rem',
    color: Color.ORANGE_1,
  },
  remark: {
    fontSize: Font.SMALL_1,
    paddingHorizontal: 16,
    paddingTop: 4,
    marginBottom: 0,
    color: Color.ORANGE_1,
    lineHeight: 17,
  },
  sperator: {
    width: '375rem',
    height: 8,
    marginTop: 13,
    backgroundColor: '$lightgray',
  },
  goodsRemend: {
    paddingTop: 4,
    paddingHorizontal: 16,
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
});

export default GoodsPrice;
