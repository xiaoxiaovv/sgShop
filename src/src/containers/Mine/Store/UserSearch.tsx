import * as React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Keyboard } from 'react-native';
import { INavigation } from '../../../interface';
import CustomNaviBar from '../../../components/customNaviBar';
import { UltimateListView } from 'rn-listview';
import { getAppJSON } from '../../../netWork';
import { connect } from 'react-redux';
import { Modal } from 'antd-mobile';
import { AuthenticatedFlag, RankLevel, timeConvertor } from './TeamSupervise';
import moment from 'moment';

import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

interface IProps {
  mid: number;
}

interface IState {
  keyword: string;
  showAlert: boolean;
}

/**
 * 用户搜索
 */
@connect(({users: { mid }}) => ({mid}))
class UserSearch extends React.Component<INavigation & IProps, IState> {
  private listView;
  public constructor(props) {
    super(props);
    this.state = {
      keyword: '',
      showAlert: false,
    };
  }
  public render(): JSX.Element {
    const { cascade, userTabFocused } = this.props.navigation.state.params;
    Log('springjphoenix -> renderItem -> args: ', { cascade, userTabFocused });

    return (
      <View style={{
        flex: 1,
        backgroundColor: '#F4F4F4',
      }}>
        <CustomNaviBar
          navigation = { this.props.navigation }
          hiddenLeftBtn = { false }
          containerStyle = {{ backgroundColor: 'transparent' }}
          showBottomLine = {true}
          leftViewStyle = {{marginLeft: 5}}
          local = { {leftStyle: { width: 22, height: 22}}}
          titleView = {
            <View style={styles.searchBox}>
              <Image source={require('../../../images/searchicon.png')}
                     style={styles.searchIcon}/>
              <TextInput style={styles.inputText}
                         underlineColorAndroid='transparent'
                         placeholder='请输入用户名称'
                         onChangeText={(text) => {
                           this.setState({keyword: text});
                         }}
                         onSubmitEditing={() => Keyboard.dismiss()}
                         onEndEditing={() => Keyboard.dismiss()}
              />
            </View>
          }
          rightView = {
            <TouchableOpacity
              activeOpacity = {0.7}
              onPress={() => {
                Keyboard.dismiss();
                if (this.state.keyword === null || this.state.keyword === '') {
                  // 把''转换成null
                  this.setState({keyword: null, showAlert: true},
                    () => { this.listView.onRefresh(); });
                } else {
                  // 说明搜索关键字不为空
                  this.listView.onRefresh();
                }
              }}
            >
              <View style={{ flex: 1, height: '100%', alignContent: 'center',
                marginTop: 12 , marginRight: 10}}>
                <Text style={{color: 'black', fontSize: 17}}>搜索</Text>
              </View>
            </TouchableOpacity>
          }
        />
        <UltimateListView
          style={{paddingTop: 10, marginBottom: 10}}
          ref={(ref) => this.listView = ref}
          onFetch={this.onFetch}
          keyExtractor={(item, index) => `keys${index}`}
          refreshableMode='advanced'
          item={this.renderItem}
          numColumn={1}
          paginationAllLoadedView={() => <View/>}
          paginationFetchingView={() => <View/>}
          emptyView={() =>
            // 未输入搜索内容显示的界面
            <View style={{ height, alignItems: 'center', top: -40}}>
              <Image
                style={{width: 0.7 * width, height: width * 0.7, marginTop: 10}}
                source={require('../../../images/coupon.png')}
              />
              <Text style={{color: 'gray'}}>暂无数据</Text>
            </View>
          }/>
        <Modal
          visible={this.state.showAlert}
          transparent
          onClose={this.closeAlertModal}
          title={'请填写搜索内容'}
          footer={[{ text: '确定', onPress: () => this.closeAlertModal() }]}
        />
      </View>
    );
  }
  private closeAlertModal = () => this.setState({showAlert: false})

  private renderItem = (item, index) => {
    const { cascade, userTabFocused } = this.props.navigation.state.params;
    Log('springjphoenix -> renderItem -> item: ', item);
    Log('springjphoenix -> renderItem -> args: ', { cascade, userTabFocused });

    return <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
      }}
      activeOpacity={0.9}
      onPress={() => {
        if (userTabFocused) {
          this.props.navigation.navigate('UserProfile', {
            memberId: item.memberId,
            name: item.userName,
            mobile: item.mobile,
            isTeamNum: item.isTeamNum,
          });
        } else {
          this.props.navigation.navigate('TeamateProfile', {memberId: item.memberId, type: cascade ? 1 : 0});
        }
      }}
    >
      <View style={{
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 15,
        paddingBottom: 15,
      }}>
        <Image
          style={{
            width: 46,
            height: 46,
            borderRadius: 23,
          }}
          source={{uri: item.avatarImageFileId}}
        />
      </View>
      <View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: 17,
            fontWeight: 'bold',
          }}>{userTabFocused ? item.userName : item.storeName}</Text>
          {
            userTabFocused ?
              (item.levelOrder > 0) && <RankLevel
                level={item.levelOrder}
                name={item.level}
                hasWhiteBg={false}
              />
              :
              <RankLevel
                level={item.levelOrder}
                name={item.levelName}
                hasWhiteBg={false}
              />
          }
          {
            item.isAuthenticated && <AuthenticatedFlag/>
          }
        </View>
        {
          userTabFocused ? <View>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
              marginBottom: 5,
            }}>
              <Text style={[styles.subTitle]}>商品数量： {item.purchasedNum} 件</Text>
            </View>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Text style={[styles.subTitle]}>最近一次购买时间：{moment(item.recentBuyingTime * 1000).format('YYYY-MM-DD HH:mm:ss')}</Text>
            </View>
          </View> : <View>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
              marginBottom: 5,
            }}>
              <Text style={[styles.subTitle]}>本月活跃：{item.isActive === true ? '是' : '否'} </Text>
              <Text style={[styles.subTitle]}> 合伙人：{item.subLevelNum} </Text>
              <Text style={[styles.subTitle]}> 团队：{item.teamSize}</Text>
            </View>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Text style={[styles.subTitle]}>开店时间：{moment(item.startTime * 1000).format('YYYY-MM-DD HH:mm:ss')}</Text>
            </View>
          </View>
        }
      </View>
    </TouchableOpacity>;
  }

  private onFetch = async ( page = 1, startFetch, abortFetch) => {
    const { userTabFocused } = this.props.navigation.state.params;
    try {
      const pageLimit = 10;
      let resp = null;

      Log('springjphoenix -> onFetch -> userTabFocused: ', userTabFocused);

      if (userTabFocused) {
        resp = await this.userSearch(page, pageLimit);
        Log('springjphoenix -> userSearch -> resp: ', resp);
      } else {
        resp = await this.teamSearch(page, pageLimit);
        Log('springjphoenix -> teamSearch -> resp: ', resp);
      }

      const { success, data } = resp;

      if (this.state.keyword === null || this.state.keyword.trim() === '' ||
        !success || !data || (!data.children && !data.rows)) {
        abortFetch();
        return;
      } else {
        startFetch(data.children || data.rows, pageLimit);
      }

    } catch (err) {
      abortFetch(); // manually stop the refresh or pagination if it encounters network error
      Log(err);
    }
  }
  private userSearch = async (page, pageLimit) => {
    const param = {
      memberId: this.props.mid,
      userName: encodeURI(this.state.keyword),
      pageNumber: page,
      pageSize: pageLimit,
      noLoading: true,
    };
    return await getAppJSON('v3/mstore/sg/mechanism/findOrderProductUserInfo.json', param);
  }
  private teamSearch = async (page, pageLimit) => {
    const { cascade } = this.props.navigation.state.params;
    const param = {
      memberId: this.props.mid,
      keyword: encodeURI(this.state.keyword),
      cascade,
      pageNumber: page,
      pageSize: pageLimit,
      noLoading: true,
    };

    return await getAppJSON('v3/mstore/sg/mechanism/pagingChildren.json', param);
  }
}

const styles = StyleSheet.create({
  searchBox: {
    width: 0.7 * width,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
    marginLeft: -10,
    marginTop: 2,
    marginBottom: 2,
    height: 36,
    borderRadius: 2,  // 设置圆角边
    backgroundColor: '#eaeaea',
  },
  searchIcon: {
    marginLeft: 6,
    marginRight: 6,
    resizeMode: 'stretch',
  },
  inputText: {
    flex: 1,
    marginRight: 2,
    backgroundColor: 'transparent',
    fontSize: 14,
    fontFamily: '.PingFangSC-Medium',
    color: '#666666',
    padding: 0,
  },
  subTitle: {
    color: '#6B6B6B',
    fontSize: 14,
  }
});

export default UserSearch;
