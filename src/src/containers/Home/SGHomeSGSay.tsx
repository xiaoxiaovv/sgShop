import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,   // 点击时有透明度变化
  TouchableWithoutFeedback,  // 无透明度变化
} from 'react-native';
import ScreenUtil from './SGScreenUtil';
import PropTypes from 'prop-types';
import { ICommonInterface } from './HomeInterface';
import EStyleSheet from 'react-native-extended-stylesheet';
import SectionTitle from './SectionTitle';
import { goBanner } from '../../utils/tools';
import Config from 'react-native-config';
import {Color, Font} from 'consts';
import SecondTitle from '../../components/SecondTitle';


import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

const UserInfo: React.SFC<any> = (props) => {
  return (<View style={styles.store}>
    <View style={styles.avatarNameContainer}>
      <View style={[styles.avatar, {backgroundColor: 'lightgray'}]}>
      <Image style={styles.avatar} source={{ uri: cutImgUrl((props.avatar === null) ? '' : props.avatar, 50, 50, true) }}/>
      </View>
      <Text numberOfLines={1} style={{ marginLeft: 5, fontSize: 12, color: '#666666', width: width / 2 - 53, }}>{props.storeName}</Text>
    </View>
    <TouchableOpacity style={styles.guanzhu}>
      {/* <Text style={{ color: '#2982FD' }}>+ 关注</Text> */}
      {/* <Image style={{width: 59, height: 19}} source={require('../../images/follow.png')}></Image> */}
    </TouchableOpacity>
  </View>);
};

export default class SGSay extends Component<ICommonInterface> {
  private static defaultProps = {
    dataSource: [],
  };  // 注意这里有分号
  public render() {
    const mwidth = width / 2 - 20;
    return (
      <View style={[styles.sgSay_Box, this.props.fromSpecial && styles.noneLine]}>
        {
          this.props.fromSpecial ? <SecondTitle title='逛客怎么说' onMorePress={this.clickMore}/> :
          <SectionTitle title='逛客怎么说' color={Color.BLACK} hasTitle clickMore={this.clickMore} />
        }
        <View style={{ flexDirection: 'row',  paddingBottom: 5, justifyContent: 'center', alignItems: 'center'}}>
          {
            this.props.dataSource.map((dataItem) => (
              <View style={styles.item} key={dataItem.id}>
                <TouchableOpacity onPress={() => {
                  goBanner(dataItem);
                }}>
                <View style={{justifyContent: 'center', alignItems: 'center', width: width / 2}}>
                  <View>
                    <Image
                      source={{ uri: cutImgUrl(dataItem.pic, mwidth, 0.6 * mwidth, true) }} resizeMode='stretch'
                      style={{ width: mwidth, height: (0.6 * mwidth)}} />
                    <Text style={{fontSize: 13, marginTop: 5,}}>{dataItem.title}</Text>
                  </View>
                </View>
                </TouchableOpacity>
                <View style={styles.line} />
                <UserInfo {...dataItem} />
              </View>
            ))
          }
        </View>
      </View>
    );
  }
  public goPersonalHome = (id) => {
    this.props.navigation.navigate('CustomWebView', { customurl: `${URL.H5_HOST}personalHomePageHe/${id}`, flag: true, headerTitle: '个人主页' });
  }
  // 点击逛客怎么说右上角的更多按钮跳转到社群首页
  public clickMore = () => {
    this.props.navigation.navigate('Community', {
      url: '/html/index.html',   // 去社区首页,直接这样跳转即可,不用穿其他参数
      },
    );
  }
}

const styles = EStyleSheet.create({
  noneLine: {
    marginTop: 0,
  },
  avatarNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guanzhu: {
    height: 25,
    width: 60,
    padding: 3,
    paddingLeft: 5,
  },
  avatar: {
    height: 28,
    width: 28,
    borderRadius: 14,
  },
  store: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'space-between',
    width: width / 2 - 20,
    paddingRight: 5,
  },
  sgSay_Box: {
    backgroundColor: 'white',
    marginTop: 10,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  line: {
    height: 1,
    backgroundColor: Color.GREY_4,
    width: width / 2 - 20,
    marginTop: 10,
  },
  headerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  guangke: {
    color: '#2982FD',
    fontSize: '18rem',
    marginLeft: '10rem',
    marginRight: '10rem',
    fontWeight: 'bold',
  },
  more: {
    color: '#2982FD',
    fontSize: '15rem',
    marginLeft: '10rem',
    marginRight: '10rem',
  },

});
