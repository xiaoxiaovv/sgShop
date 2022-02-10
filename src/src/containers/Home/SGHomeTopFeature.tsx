import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,  // 这种按钮点击没有透明度变化
} from 'react-native';
import PropTypes from 'prop-types';
import ScreenUtil from './SGScreenUtil';
// 渐变色组件
import LinearGradient from 'react-native-linear-gradient';
import SectionTitle from './SectionTitle';
import { Carousel } from 'antd-mobile';
import { goBanner, goGoodsDetail } from '../../utils/tools';
import HomeBanner from './HomeBanner';
import Color from '../../consts/Color';

import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

interface ICommonInterface {
  navigation: any;
  midBannerList: any;
  crowdFunding: any;
}
export default class HomeTopFeature extends Component<ICommonInterface> {
  private static defaultProps = {
    midBannerList: [],
    crowdFunding: [],
  };
  public render(): JSX.Element {

      return (
        <View style={{marginTop: 10, marginBottom: 10}}>
          <SectionTitle title='主题特色' color={Color.BLACK} hasTitle={false}/>
          <View style={{overflow: 'hidden'}}>
            <HomeBanner
                dataSource = {this.props.midBannerList}
                key = 'feature'
                height={Math.round(width*0.365)}
                />
          </View>
          <View style={{flexDirection: 'row', paddingBottom: 15, backgroundColor: 'white'}}>
            {
              this.props.crowdFunding.map((item, i) => {
                return (<TouchableOpacity
                              activeOpacity={1.0}
                              key={i}
                              onPress={() => goBanner(item, this.props.navigation)}
                              >
                          <Image source={{ uri: cutImgUrl(item.pic, width / 3, 1.2 * width / 3) }} style={{width: width / 3, height: 1.2 * width / 3}}/>
                        </TouchableOpacity>);
              })
            }
          </View>
        </View>
    );
  }

}

const styles = StyleSheet.create({
  Container: {
    alignItems: 'center',  // 使元素垂直居中排布, 当flexDirection为column时, 为水平居中
  },
  wrapper_img: {
    width: ScreenUtil.ScreenWidth,
    height: ScreenUtil.scaleSize(187),
  },
  Box: {
    alignItems: 'center',
  },
  topImage: {
    width: 363 * ScreenUtil.ScaleX,
    height: 146 * ScreenUtil.ScaleX,
  },
  bottomImageView: {
    marginBottom: ScreenUtil.scaleSize(6),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomImage: {
    width: 121 * ScreenUtil.ScaleX,
    height: 125  * ScreenUtil.ScaleX,
  },
});
