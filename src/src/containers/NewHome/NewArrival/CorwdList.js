import React, {Component} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  SafeAreaView,
  View, ScrollView,
  TouchableOpacity, Modal
} from 'react-native';

import {UltimateListView} from 'rn-listview';
import {connect} from 'react-redux';
import Config from 'react-native-config';
import {MessageWithBadge} from '../../../components/MessageWithBadge';


import ShareModle from '../../../components/ShareModle';

import {NavBar, SafeView} from './../../../components';
import Banners from "../../../components/banners";
import NavigationUtils from "../../../dva/utils/NavigationUtils";
import {px} from "../../../utils";
import IsLoginTouchableOpacity from "../../../common/IsLoginTouchableOpacity";
import URL from "../../../config/url";
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
import {action, NavigationActions} from "../../../utils";
import {CrowdFundingService} from "../../../dva/service";
import CrowdFundingCell from "./component/CrowdFundingCell";
import Empty from '../../../components/Empty';


@connect(({users, CrowdFundingModel}) =>
  ({...users, ...CrowdFundingModel}))
export default class CorwdList extends React.Component {


  state = {
    showShare: false,
    currentIndex: 0,
    currentType: 2,
    data: [],
  }

  init = () => {
    //智家众筹 传1 特产汇众筹传2
    const from = this.props.navigation.state.params ? this.props.navigation.state.params.from : 1;
    this.props.dispatch({
      type: 'CrowdFundingModel/getCrowdFundingIndex',
      payload: {type: 3, page: 1, from: from},
      callback: () => {

      }
    });
  }

  onFetch = async (page = 1, startFetch, abortFetch) => {
    const from = this.props.navigation.state.params ? this.props.navigation.state.params.from : 1;
    try {
      const res = await CrowdFundingService.getCrowdFundingList({type: this.state.currentType, page: page, from: from});
      if (res.success && res.data) {
        const list = res.data.zActivitylist;
        if (page === 1) {
          this.setState({data: list});
        }
        startFetch(list, 5);
      } else {
        abortFetch();
      }
    } catch (e) {
      console.log(e);
      abortFetch();
    }
  };

  componentDidMount() {
    this.init();
  }

  _goDetail = (item) => {
    // this.props.navigation.navigate('ArrivalDetail', {zActivityId: item.id})
      this.props.dispatch(NavigationUtils.navigateAction('CustomWebView', {
          customurl: `${URL.SHARE_HOST}/crowd_funding_details/${item.id}/${this.props.mid}`,
          flag: true,
          headerTitle: '众筹详情',
          callBack: () => {
          },
      }));

  }

  _onSharePress = () => {
    this.setState({
      showShare: true,
    })
  }

  /**
   * 需要修改
   *
   **/
  getShareContent = () => {
    const {mid} = this.props;
    const title = '顺逛众筹';
    const content = '顺逛众筹为您提供与众不同的品质生活';
    const pic = 'http://www.ehaier.com/mstatic/wd/v2/img/sg.png';//传默认图片
    const url = `${URL.CROWDFUNDING_SHARE}/${mid}/`;
    return [title, content, pic, url, 0];
  };

  render() {
    //智家众筹 传1 特产汇众筹传2
    const from = this.props.navigation.state.params ? this.props.navigation.state.params.from : 1;
    return (
      <SafeView>
        <NavBar
          title={'顺逛众筹'}
          rightView={<View style={{flexDirection: 'row'}}>
            <IsLoginTouchableOpacity
              onPress={() => this._onSharePress()}>
              <Image
                resizeMode='stretch'
                style={{
                  marginTop: 9,
                  width: 22,
                  height: 22,
                  marginRight: px(8),
                }}
                source={require('../../../images/icon_share_gray.png')}/>
            </IsLoginTouchableOpacity>
            <MessageWithBadge
              badgeContainStyle={{top: 3, right: -3}}
              hidingText={true}
              badgeContainStyle={{top: 3, right: -3}}
              navigation={this.props.navigation}
              unread={this.props.unread}
              imageStyle={{width: 22, height: 22}}
            />
          </View>}
        />

        <UltimateListView
          ref={(ref) => this.listView = ref}
          header={this.renderHeader}
          onFetch={this.onFetch}
          keyExtractor={(item, index) => `keys${index}`}
          refreshableMode={Platform.OS === 'ios' ? 'advanced' : 'basic'}
          pageLimit={5}
          item={this._renderItem}
          footer={() => {
            return (<Text style={{textAlign: 'center', lineHeight: px(40), height: px(40), backgroundColor: '#ccc'}}>
              更多顺逛项目敬请期待</Text>)
          }}
          emptyView={() => <Empty style={{width, height: 100}} title='暂时没有众筹项目'/>}
        />

        <ShareModle
          visible={this.state.showShare} content={this.getShareContent()}
          onCancel={() => this.setState({showShare: false})}
          hiddenEwm
        />
      </SafeView>
    )
  }

  renderHeader = () => {
    return (
      <View style={[styles.container]}>
        {this.props.bannerList && this.props.bannerList.length > 0 &&
        <Banners
          style={{backgroundColor: '#ccc'}}
          imageKey='imageUrl'
          onBarnnerPress={(item) => {
            this._goDetail(item);
          }
          }
          bannerData={this.props.bannerList}
        />
        }
        {
          this.props.recommendList && this.props.recommendList.length > 0 &&
          <View style={{backgroundColor: '#fff', marginVertical: px(8)}}>
            <View style={{width, height: 40, borderBottomColor: '#eee', borderBottomWidth: 1}}>
              <Text style={{width, textAlign: 'center', lineHeight: 40, color: '#333', fontSize: 14}}>人气推荐</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                marginBottom: 10
              }}>
              {
                this.props.recommendList.map((item, index) => {
                  if (index > 2) return null;
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        this._goDetail(item);
                      }}
                      style={{flexDirection: 'column', marginTop: 8}}>
                      <Image
                        style={{width: px(120), height: px(120), borderWidth: 1, borderColor: '#ccc'}}
                        source={{uri: item.imageUrl}}/>
                      <Text numberOfLines={1}
                            style={{fontSize: 12, textAlign: 'center', marginTop: 10}}>{item.activityName}</Text>
                    </TouchableOpacity>
                  )
                })
              }

            </View>
          </View>
        }
        <View style={{flexDirection: 'row', width: width, height: px(60)}}>
          {
            [{text: '最新上线', type: 2}, {text: '即将结束', type: 3}, {text: '即将上线', type: 1}].map((cell, index) => {
              return (
                <TouchableOpacity
                  style={[styles.tabItem, {borderWidth: this.state.currentIndex === index ? 1 : 0}]}
                  onPress={() => {
                    this.setState({
                      currentIndex: index,
                      currentType: cell.type,
                    }, () => {
                      this.listView.onRefresh();
                    })
                  }}>
                  <Text
                    style={[styles.tabItemText, {color: this.state.currentIndex === index ? '#2979FF' : '#333'}]}>{cell.text}</Text>
                </TouchableOpacity>
              )
            })
          }
        </View>
      </View>
    )
  }

  _renderItem = (item) => {
    const type = this.state.currentType
    return (<CrowdFundingCell
      type={type}
      onTab1ItemPress={() => {
        this._goDetail(item);
      }
      }
      item={item}
      navigation={this.props.navigation}
    />)

  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
  },


  tabItem: {
    height: px(60),
    flex: 1,
    borderBottomColor: '#2979FF',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemText: {
    color: '#2979FF',
    fontSize: px(15),
  }
});
