import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,   // 点击时有透明度变化
  TouchableWithoutFeedback,  // 无透明度变化
  FlatList,
} from 'react-native';
import ScreenUtil from './SGScreenUtil';
import PropTypes from 'prop-types';
// 渐变色组件
import LinearGradient from 'react-native-linear-gradient';
import CountDownTimer from './CountDownReact';
import { ICommonInterface } from './HomeInterface';
import { goGoodsDetail } from '../../utils/tools';
import { createAction,getPrevRouteName } from '../../utils';
import Config from 'react-native-config';
import { toFloat } from '../../utils/MathTools';
import StorePrice from './StorePrice';
import {Color,Font} from 'consts';

import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

interface IFlash {
  startTime: number;
  systemTime: number;
  isWarm: boolean;
  isWd: boolean;
  flashTime: string;
  nextFlashTime: string;
  preheatingTime: number;
  endTime: number;
  flashProductList: any[];
}
export default class FlashSale extends Component<ICommonInterface & IFlash> {
  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      mstring: '',
    };
  }
  public render(): JSX.Element {
    if (this.props.flashProductList === undefined || this.props.flashProductList.length === 0 ||
      this.props.systemTime - new Date(this.props.flashProductList[0].endTime).getTime() > -1000 ||
      this.props.systemTime < this.props.preheatingTime) {
      return null;
    }
    // tslint:disable-next-line:max-line-length
    const mdate = this.props.startTime > this.props.systemTime ? this.props.startTime : this.props.endTime;
    const flashFlag = this.props.startTime > this.props.systemTime ? 1 : 2; // 1表示在预热中 2表示在进行中
    const nowMinute = new Date(this.props.flashTime).getMinutes().toString();
    let whichHour = '';
    if (nowMinute === '0') {
      whichHour = new Date(this.props.flashTime).getHours() + '点场';
    } else {
      whichHour = new Date(this.props.flashTime).getHours() + '点半场';
    }
    return (
      <View style={styles.flashSale_Box}>
        <View style={styles.flashSaleTopBox}>
          <View style={styles.flashSaleRightContainer}>
            <Image style={styles.flashSaleTitleImage} source={require('../../images/flash_sale_time.png')} resizeMode='contain'/>
            <Text style={styles.flashSaleTitleText}>限时抢购</Text>
          </View>
          <View style={styles.flashSaleLeftContainer}>
            <View style={styles.flashSaleTimeContainer}>
              <Text style={styles.whichHour}>{whichHour}</Text>
              <CountDownTimer
                //  date={new Date(mdate)}
                systemTime={this.props.systemTime}
                startTime={this.props.startTime}
                endTime={this.props.endTime}
                flag={flashFlag}
                onEnd={() => { 
                  if(this.props.navigation.state.routeName == 'Home'){
                    dvaStore.dispatch(createAction('home/fetchFlashSales')()); 
                  }else{
                    dvaStore.dispatch(createAction('LocalSpecialtyModel/getNewAndLimit')());
                  }

                }}
                changeTips={() => { this.setState({mstring: '结束'}); }}
                setTips={(value) => {this.setState({mstring: value}); }}
                navigation={this.props.navigation}
                />
              <Text style={styles.flashSaleStatusText}>{this.state.mstring}</Text>
            </View>
            <TouchableOpacity style={styles.more} onPress={() => this.props.navigation.navigate('FlashSale')}>
              <Image style={styles.flashSaleMoreImage} source={require('../../images/flash_sale_more.png')} />
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          style={styles.flatListStyle}
          data={this.props.flashProductList}
          keyExtractor={(item, index) => ('index' + index + item)}
          renderItem={this.renderItemView}
          getItemLayout={(data, index) => (
            // 81 是被渲染 item 的高度/宽度(水平滑动的话) ITEM_HEIGHT。
            { length: ScreenUtil.scaleSize(81), offset: (ScreenUtil.scaleSize(283)) * index, index }
          )}
        />
      </View>
    );
  }
  public renderItemView = ({ item }): JSX.Element => {
    const { isHost } = this.props;
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={() => goGoodsDetail(item.productId, undefined, item.productName, undefined, item.price, item.pic)}>
        <View key={item.productId} style={styles.item}>
          <Image style={styles.imgStyle} source={{ uri: cutImgUrl(item.imageUrl, 300, 300, true) }} />
          <View style={styles.titleContainer}><Text numberOfLines={1} style={styles.titleStyle}>{item.productName}</Text></View>
          <Text style={styles.priceStyle}>{`￥${toFloat(item.flashsalePrice)}`}</Text>
          {
            (isHost > 0 && this.props.CommissionNotice ) && (IS_NOTNIL(item.commission) ? <StorePrice commission={item.commission} /> : <View style={{marginTop: 6}}><Text style={{color: Color.ORANGE_3, fontSize: Font.SMALL_1}}>佣金计算中</Text></View>)
          }
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  flashSale_Box: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
  more: {
    height: 40,
    justifyContent: 'center',
  },
  flatListStyle: {
    marginTop: ScreenUtil.scaleSize(5),
    marginBottom: ScreenUtil.scaleSize(14),
    marginLeft: ScreenUtil.scaleSize(10),
    marginRight: ScreenUtil.scaleSize(4),
  },
  flashSaleTopBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: ScreenUtil.ScreenWidth,
    height: 40,
  },
  flashSaleRightContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 10,
  },
  flashSaleTitleImage: {
    height: 16,
    width: 16,
  },
  flashSaleTitleText: {
    fontSize: 16,
    color: Color.ORANGE_1,
    margin: 4,
  },
  flashSaleLeftContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  whichHour: {
    backgroundColor: Color.ORANGE_1,
    color: Color.WHITE,
    padding: 2,
    fontSize: 10,
    marginRight: 6,
  },
  flashSaleTimeContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Color.ORANGE_1,
    paddingRight: 4,
    borderRadius: 2,
  },
  flashSaleStatusText: {
    color: Color.GREY_1,
    fontSize: 8,
    marginLeft: 2,
  },
  flashSaleMoreImage: {
    height: 24,
    width: 24,
    marginRight: 10,
  },
  item: {
    alignItems: 'center',
    marginRight: ScreenUtil.scaleSize(6),
    width: (width - 20) / 3.5,
  },
  imgStyle: {
    width: (width - 38) / 3.5,
    height: (width - 38) / 3.5,
  },
  titleContainer: {
    marginTop: ScreenUtil.scaleSize(5),
    minHeight: ScreenUtil.scaleSize(30),
    justifyContent: 'center',
  },
  titleStyle: {
    maxWidth: (width - 38) / 3.5,
    alignSelf: 'flex-start',
    marginTop: ScreenUtil.scaleSize(6),
    fontSize: ScreenUtil.scaleText(13),
    textAlign: 'center',
    color: '#333333',
    fontFamily: '.PingFangSC-Regular',
  },
  priceStyle: {
    marginTop: 6,
    fontSize: ScreenUtil.scaleText(13),
    color: '#FF6026',
    fontFamily: '.PingFangSC-Regular',
  },
  zPriceStyle: {
    marginLeft: ScreenUtil.scaleSize(5),
    marginRight: ScreenUtil.scaleSize(5),
    marginTop: ScreenUtil.scaleSize(2.5),
    marginBottom: ScreenUtil.scaleSize(2.5),
    fontSize: ScreenUtil.scaleText(11),
    lineHeight: ScreenUtil.scaleText(11),
    color: '#FFFFFF',
    fontFamily: '.PingFangSC-Regular',
    backgroundColor: 'transparent',
  },
});
