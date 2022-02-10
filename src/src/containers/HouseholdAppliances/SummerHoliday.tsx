import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import ScreenUtil from '../Home/SGScreenUtil';
import SectionTitle from '../Home/SectionTitle';
import {width, height, cutImgUrl} from '../../utils/index';
import {goBanner} from '../../utils/tools';
import HomeBanner from '../Home/HomeBanner';
import Color from '../../consts/Color';

interface ICommonInterface {
  navigation: any;
  midBannerList: any;
  crowdFunding: any;
}

/**
 * 夏日清凉节
 */
export default class SummerHoliday extends Component<ICommonInterface> {
  private static defaultProps = {
    midBannerList: [],
    crowdFunding: [],
  };

  public render(): JSX.Element {
    return (
      <View style={{marginTop: 10, marginBottom: 10}}>
        <SectionTitle title='夏日清凉节' color={Color.BLACK} hasTitle={false}/>
        <View style={{overflow: 'hidden'}}>
          <HomeBanner
            dataSource={this.props.midBannerList}
            key='feature'
            height={ScreenUtil.scaleSize(187)}
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
                <Image source={{uri: cutImgUrl(item.pic, width / 3, 1.2 * width / 3)}} style={{width: width / 3, height: 1.2 * width / 3}}/>
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
    height: 125 * ScreenUtil.ScaleX,
  },
});
