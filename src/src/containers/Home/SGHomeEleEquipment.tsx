import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    Platform,
    TouchableWithoutFeedback,  // 这种按钮点击没有透明度变化
    TouchableOpacity,
} from 'react-native';

import ScreenUtil from './SGScreenUtil';
import { ICommonInterface } from './HomeInterface';
// 渐变色组件
import LinearGradient from 'react-native-linear-gradient';
import SectionTitle from './SectionTitle';
import { goGoodsDetail, goBanner } from '../../utils/tools';
import { toFloat } from '../../utils/MathTools';
import StorePrice from './StorePrice';
import { width } from '../../utils';
import HomeBanner from './HomeBanner';
import Color from '../../consts/Color';
import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

export default class HomeEleEquipment extends PureComponent<ICommonInterface> {
  public render(): JSX.Element {
    const { isHost } = this.props;
    return (
      <View style={styles.Container}>
        {/* 楼层标题 */}
        <SectionTitle title={this.props.dataSource.title} color={Color.BLACK} hasTitle={false} />
        {(this.props.dataSource.bannerList && this.props.dataSource.bannerList.length !== 0) &&
          <View style={{ height:Math.round(deviceWidth*0.365) }}>
            {/* 楼层轮播 */}
            <HomeBanner
              dataSource={this.props.dataSource.bannerList}
              height={Math.round(deviceWidth*0.365)}
              key={this.props.dataSource.title}
            />
          </View>}
        {(this.props.dataSource.productList && this.props.dataSource.productList.length !== 0) &&
          <View style={{ flex: 1 }}>
            {/* 楼层商品 */}
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              style={styles.flatListStyle}
              data={this.props.dataSource.productList}
              keyExtractor={(item, index) => ('index' + index + item)}
              renderItem={({ item }) => (
                <TouchableOpacity activeOpacity={0.7} onPress={() => goGoodsDetail(item.relationId)}>
                  <View key={item.id} style={styles.item}>
                    <Image style={styles.imgStyle} resizeMode='contain' source={{ uri: cutImgUrl(item.pic, 200, 200, true)}}></Image>
                    <View style={styles.titleContainer}><Text numberOfLines={2} style={styles.titleStyle}>{item.productName}</Text></View>
                    <Text style={styles.priceStyle}>{'¥' + toFloat(item.price)}</Text>
                    {
                      (isHost > 0 && this.props.CommissionNotice) && <StorePrice commission={item.commission} />
                    }
                  </View>
                </TouchableOpacity>
              )}
              getItemLayout={(data, index) => (
                // 101 是被渲染 item 的高度/宽度(水平滑动的话) ITEM_HEIGHT。
                { length: ScreenUtil.scaleSize(101), offset: (ScreenUtil.scaleSize(101 + 10)) * index, index }
              )}
            />
        </View>
            }
      </View>
      );
    }
  }

const styles = StyleSheet.create({
          Container: {
          alignItems: 'center',
        backgroundColor: 'white',
        // marginLeft: 10,
        // marginRight: 10,
      },
  wrapper: {
          marginTop: ScreenUtil.scaleSize(10),
      },
  wrapper_img: {
          width: ScreenUtil.ScreenWidth,
        height: ScreenUtil.scaleSize(187),
      },
  flatListStyle: {
        marginTop: ScreenUtil.scaleSize(10),
        marginBottom: ScreenUtil.scaleSize(14),
        marginLeft: ScreenUtil.scaleSize(10),
        marginRight: ScreenUtil.scaleSize(4),
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
        textAlign: 'center',
        fontSize: ScreenUtil.scaleText(13),
        lineHeight: ScreenUtil.scaleText(15),
        color: '#333333',
        fontFamily: '.PingFangSC-Regular',
  },
  priceStyle: {
        marginTop: ScreenUtil.scaleSize(10),
        fontSize: ScreenUtil.scaleText(15),
        lineHeight: ScreenUtil.scaleText(15),
        color: '#FF6026',
        fontFamily: '.PingFangSC-Regular',
  },
  zPriceStyle_box: {
          alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: ScreenUtil.scaleSize(7),
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
