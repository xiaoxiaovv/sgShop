import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,  // 这种按钮点击没有透明度变化
} from 'react-native';
import ScreenUtil from './SGScreenUtil';
// 渐变色组件
import LinearGradient from 'react-native-linear-gradient';
import { ICommonInterface } from './HomeInterface';
import SectionTitle from './SectionTitle';
import { goBanner } from '../../utils/tools';
import { IS_NOTNIL, width, cutImgUrl } from '../../utils/index';
import Color from '../../consts/Color';

import Carousel from './../../components/Carousel';
import Swiper from 'react-native-swiper';

export default class HomeFavBanner extends Component<ICommonInterface> {
  // 设置属性默认值
  private static defaultProps = {
    dataSource: [],
  };  // 注意这里有分号
  public render() {
    return (
      <View style={{ width: ScreenUtil.ScreenWidth, flex: 1, marginTop: 10 }}>
        <SectionTitle title='优惠推荐' color={Color.BLACK} hasTitle={false} />
          <View style={{ height: 260 * ScreenUtil.ScaleX, width: width}}>
              <Swiper
                  autoplay={true}
                  loop={true}
                  autoplayTimeout={3}
                  pagingEnabled={true}
                  showsPagination={true}
                  paginationStyle={{bottom: 10}}
                  dot={<View style={{
                      backgroundColor: 'rgba(255,255,255,.5)',
                      width: 7,
                      height: 7,
                      borderRadius: 3.5,
                      marginRight: 8,
                  }}/>}
                  activeDot={<View style={{
                      backgroundColor: '#FFFFFF',
                      width: 9,
                      height: 9,
                      borderRadius: 4.5,
                      marginRight: 8,
                  }}/>}
              >
                  {
                      this.props.dataSource.map((item, i) => {
                          return (
                              <View key={i} style={{ height: 260 * ScreenUtil.ScaleX, width: width, flex: 1}}>
                              <View style={styles.imageViewStyle}>
                                  <TouchableWithoutFeedback onPress={() => goBanner(item[0], this.props.navigation)}>
                                      <View style={styles.LeftView}>
                                          {
                                              IS_NOTNIL(item[0]) ? <Image resizeMode='stretch' source={{ uri: cutImgUrl(item[0].pic, 180 * ScreenUtil.ScaleX, 260 * ScreenUtil.ScaleX) }} style={styles.leftImg} /> : <View style={styles.leftImg}></View>
                                          }
                                      </View>
                                  </TouchableWithoutFeedback>
                                  <View style={styles.rightView}>
                                      <TouchableWithoutFeedback onPress={() => goBanner(item[1], this.props.navigation)}>
                                          {
                                              IS_NOTNIL(item[1]) ? <Image resizeMode='stretch' source={{ uri: cutImgUrl(item[1].pic, 181 * ScreenUtil.ScaleX, 129 * ScreenUtil.ScaleX) }} style={styles.topImg} /> : <View style={styles.topImg}></View>
                                          }
                                      </TouchableWithoutFeedback>
                                      <TouchableWithoutFeedback onPress={() => goBanner(item[2], this.props.navigation)}>
                                          {
                                              IS_NOTNIL(item[2]) ? <Image resizeMode='stretch' source={{ uri: cutImgUrl(item[2].pic, 181 * ScreenUtil.ScaleX, 129 * ScreenUtil.ScaleX) }} style={styles.bottomImg} /> : <View style={styles.bottomImg}></View>
                                          }
                                      </TouchableWithoutFeedback>
                                  </View>
                                  </View>
                              </View>);
                      })
                  }
              </Swiper>
          </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  Container: {
    alignItems: 'center',  // 使元素垂直居中排布, 当flexDirection为column时, 为水平居中
  },
  imageViewStyle: {
    // 在安卓上如果不设置Swiper中item的的宽度,则轮播图不显示
    width: ScreenUtil.ScreenWidth,
    flexDirection: 'row',
    alignItems: 'center',
  },
  LeftView: {
    flex: 1,
    alignItems: 'center',
    marginLeft: ScreenUtil.scaleSize(6),
  },
  leftImg: {
    width: 180 * ScreenUtil.ScaleX,
    height: 260 * ScreenUtil.ScaleX,
  },
  rightView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: ScreenUtil.scaleSize(6),
  },
  topImg: {
    width: 181 * ScreenUtil.ScaleX,
    height: 129 * ScreenUtil.ScaleX,
    marginBottom: 1,
  },
  bottomImg: {
    width: 181 * ScreenUtil.ScaleX,
    height: 129 * ScreenUtil.ScaleX,
  },
});
