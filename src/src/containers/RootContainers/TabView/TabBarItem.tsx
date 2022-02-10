import * as React from 'react';
import { connect, width } from '../../../utils';
import { Image, View, Text } from 'react-native';
import { IS_NOTNIL } from '../../../utils/index';
import { Color } from 'consts';

export interface ITabBarItemProps {
  totalCount: number;
  focused: boolean;
  style: [any];
  mykey: string;
  iconImageConfig: any;
  iconFontConfig: any;
  title: string;
  titleStyle: any;
}

@connect(({cartModel, home: {bottomIconConfig : {iconFontConfig, iconImageConfig}}}) => ({...cartModel,iconFontConfig,iconImageConfig}))
export default class TabBarItem extends React.Component<ITabBarItemProps, any> {
  /**
   * getImage
   */
 // source={focused ? require('../../images/tab_ic_mine_hover.png') : require('../../images/tab_ic_mine.png')}
 // source={focused ? require('../../images/tab_ic_community_hover.png') : require('../../images/tab_ic_community.png')} 
 // source={focused ? require('../../images/tab_ic_category_hover.png') : require('../../images/tab_ic_category.png')}
 // source={focused ? require('../../images/tab_ic_home_hover.png') : require('../../images/tab_ic_home.png')}
 public getImage(focused) {
    let myIcon = {};
    switch (this.props.mykey) {
      // 智家
      case 'sg':
      myIcon = focused ? require('../../../images/tab_ic_zj_hover.png') : require('../../../images/tab_ic_zj.png');
      break;
      case 'fl':
      myIcon = focused ? require('../../../images/tab_ic_gg_hover.png') : require('../../../images/tab_ic_gg.png');
      break;
      // case 'fl':
      //   myIcon = focused ? require('../../../images/tab_ic_category_hover.png') : require('../../../images/tab_ic_category.png');
      //   break;
        // 社区
      case 'sq':
        myIcon = focused ? require('../../../images/tab_ic_community_hover.png') : require('../../../images/tab_ic_community.png');
        break;
        // 购物车
      case 'gwc':
        myIcon = focused ? require('../../../images/tab_ic_cart_hover.png') : require('../../../images/tab_ic_cart.png');
        break;
        // 我的
      case 'wd':
        myIcon = focused ? require('../../../images/tab_ic_mine_hover.png') : require('../../../images/tab_ic_mine.png');
        break;
      default:
        break;
    }
    return myIcon;
  }
  public render() {
    const { cartSum, focused, style} = this.props;
    // url和hoverUrl 是 配置了首页的活动图标和活动背景时 用来存储图片url
    let url = '';
    let hoverUrl = '';
    // 默认没有配置活动时的文字颜色样式
    let textColor = focused ? this.props.titleStyle? Color.ORANGE_1:'#2577e3' : 'gray';
    if (IS_NOTNIL(this.props.iconImageConfig)) {
        url = this.props.iconImageConfig[this.props.mykey];
        hoverUrl = this.props.iconImageConfig[`${this.props.mykey}Hover`];
    }
    if (IS_NOTNIL(this.props.iconFontConfig )) {
      if (focused) {
        if (IS_NOTNIL(this.props.iconFontConfig[`${this.props.mykey}HoverFontColor`])) {
          textColor = this.props.iconFontConfig[`${this.props.mykey}HoverFontColor`];
        }
      } else {
        if (IS_NOTNIL(this.props.iconFontConfig[`${this.props.mykey}FontColor`])) {
          textColor = this.props.iconFontConfig[`${this.props.mykey}FontColor`];
        }
      }
    }
    return (
      <View style={{justifyContent: 'center', width: 36, height: 36, alignItems: 'center'}}>
        {
           (url !== '' && IS_NOTNIL(url)) ?
           <Image
              style={{width: 24, height: 24}}
              source={{uri: cutImgUrl(focused ? hoverUrl : url, 30)}}
           />
           :
           <Image
              style={{width: 24, height: 24}}
              source={this.getImage(this.props.focused)}
            />

        }
       <Text style={{fontSize: 10, marginTop: 2, color: textColor }}>{this.props.title}</Text>
        {
          (this.props.mykey === 'gwc' && cartSum > 0) ?
          <View style={{minWidth: 16, minHeight: 16, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, right: 0, borderRadius: 10, backgroundColor: Color.ORANGE_1, overflow: 'hidden'}}>
            <Text
              style={{fontSize: 8, color: 'white', alignSelf: 'center', textAlign: 'center'}}
              numberOfLines={1}
              // adjustsFontSizeToFit={true}
            >
              {cartSum <= 99 ? cartSum : '99+'}
            </Text>
          </View> : null
        }
      </View>
    );
  }
}
