import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import ScreenUtil from '../Home/SGScreenUtil';
import { NavigationScreenProp } from 'react-navigation';
import SectionTitle from '../Home/SectionTitle';
import {goBanner} from '../../utils/tools';
import {IS_NOTNIL, width, cutImgUrl} from '../../utils/index';
import Color from '../../consts/Color';
import Swiper from 'react-native-swiper';

interface IProps {
  dataSource: any[];
  navigation: NavigationScreenProp;
}

/**
 * 家用电器 - 热门活动
 */
export default class TopActivites extends Component<IProps> {
  public constructor(props) {
    super(props);
  }
  public render() {
    const { navigation, dataSource } = this.props;
    return (
      <View style={{width: ScreenUtil.ScreenWidth, flex: 1, marginTop: 8}}>
        <SectionTitle title='热门活动' color={Color.BLACK} hasTitle={false}/>
          <View style={{ height: 260 * ScreenUtil.ScaleX, width: ScreenUtil.ScreenWidth, flex: 1}}>
              <Swiper
                  autoplay={true}
                  loop={true}
                  observer={true}
                  // observeParents={false}
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
                      dataSource.map((item, i) => {
                          return (
                              <View key={i} style={{ height: 260 * ScreenUtil.ScaleX, width: ScreenUtil.ScreenWidth, flex: 1}}>
                                  <View style={[styles.imageViewStyle, { height: 260 * ScreenUtil.ScaleX, width: ScreenUtil.ScreenWidth}]}>
                                      <TouchableWithoutFeedback onPress={() => goBanner(item[0], navigation)}>
                                          <View style={styles.LeftView}>
                                              {
                                                  IS_NOTNIL(item[0]) ? <Image resizeMode='stretch' source={{uri: cutImgUrl(item[0].pic, 360 * ScreenUtil.ScaleX, 520 * ScreenUtil.ScaleX, true)}} style={styles.leftImg}/> : <View style={styles.leftImg}></View>
                                              }
                                          </View>
                                      </TouchableWithoutFeedback>
                                      <View style={styles.rightView}>
                                          <TouchableWithoutFeedback onPress={() => goBanner(item[1], navigation)}>
                                              {
                                                  IS_NOTNIL(item[1]) ? <Image resizeMode='stretch' source={{uri: cutImgUrl(item[1].pic, 326 * ScreenUtil.ScaleX, 258 * ScreenUtil.ScaleX, true)}} style={styles.topImg}/> : <View style={styles.topImg}></View>
                                              }
                                          </TouchableWithoutFeedback>
                                          <TouchableWithoutFeedback onPress={() => goBanner(item[2], navigation)}>
                                              {
                                                  IS_NOTNIL(item[2]) ? <Image resizeMode='stretch' source={{uri: cutImgUrl(item[2].pic, 326 * ScreenUtil.ScaleX, 258 * ScreenUtil.ScaleX, true)}} style={styles.bottomImg}/> : <View style={styles.bottomImg}></View>
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
