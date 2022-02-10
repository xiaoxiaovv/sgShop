import * as React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import { Tabs, List } from 'antd-mobile';
import { INavigation } from '../../../interface';
import { UltimateListView } from 'rn-listview';
import { connect } from 'react-redux';
import { getAppJSON } from '../../../netWork';
import { iPhoneXPaddingTopStyle } from '../../../utils';
import URL from '../../../config/url';

import moment from 'moment';

const Item = List.Item;

import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;

const tabs = [
  { title: '全部', sub: '1' },
  { title: '待付款', sub: '2' },
  { title: '待发货', sub: '3' },
  { title: '待收货', sub: '4' },
  { title: '待评价', sub: '5' },
];

enum Tab {
  BasicInfo,
  Order,
}

interface IProps {
  mid: number;
}

interface IState {
  activeTab: Tab;
  orderStatus: number;
  memInfo: any;
}

/**
 * 团队成员基本信息
 */
@connect(({users: { mid }}) => ({mid}))
class TeamateProfile extends React.Component<INavigation & IProps, IState> {
  private listView;
  public constructor(props) {
    super(props);
    this.state = {
      activeTab: Tab.BasicInfo, // 最外层tab
      orderStatus: 0, // 订单里边的tab
      memInfo: {}, // 基本信息
    };
  }
  public componentDidMount() {
    this.loadMemberInfo();
  }
  public render() {
    const { navigation } = this.props;
    return (
      <View style={{flex: 1, backgroundColor: '#EEEEEE'}}>
        <View style={[
          {
            backgroundColor: '#307DFB',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 20,
          },
          iPhoneXPaddingTopStyle,
        ]}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}
                            style={{paddingLeft: 10, paddingRight: 10}}
          >
            <Image
              style={{
                width: 20,
                height: 20,
              }}
              source={require('../../../images/back.png')}
            />
          </TouchableOpacity>
          <View><Text style={{color: 'white', fontSize: 18}}>{`${navigation.state.params.type === 1 ? '团队成员' : '合伙人' }基本信息`}</Text></View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            {/*<TouchableOpacity*/}
              {/*activeOpacity={0.9}*/}
              {/*style={{ paddingLeft: 5, paddingRight: 5 }}*/}
              {/*onPress={() => navigation.pop()}*/}
            {/*>*/}
              {/*<Text style={{color: 'white'}}>首页</Text>*/}
            {/*</TouchableOpacity>*/}
          </View>
        </View>
        <View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: 30,
            paddingBottom: 30,
            paddingLeft: 20,
            paddingRight: 20,
            backgroundColor: '#307DFB',
          }}>
            <View style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 15,
            }}>
              <Image
                style={{
                  height: 60,
                  width: 60,
                  borderRadius: 30,
                }}
                source={{uri: this.state.memInfo.avatarImageFileId}}
              />
            </View>
            <View style={{
              justifyContent: 'center',
            }}>
              <Text style={{
                color: 'white',
                fontSize: 14,
                marginBottom: 5,
              }}>{this.state.memInfo.storeName}</Text>
              <Text style={[
                {
                  color: 'white',
                  fontSize: 14,
                },
              ]}>注册时间：{moment(this.state.memInfo.registerTime * 1000).format('YYYY-MM-DD HH:mm:ss')}</Text>
              {
                this.state.memInfo.installApp && <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{
                    color: 'white',
                    fontSize: 14,
                  }}>顺逛APP</Text>
                  <Image style={{
                    width: 15,
                    height: 15,
                    marginLeft: 5,
                  }} source={require('../../../images/checkmark.png')}/>
                </View>
              }
            </View>
          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#1E69E8',
          }}>
            <TouchableOpacity
              style={[
                styles.tabStyle,
                {

                },
              ]}
              activeOpacity={0.8}
              onPress={() => {
                this.setState({activeTab: Tab.BasicInfo});
              }}
            >
              <Text style={[
                styles.tabTextStyle,
                {
                  color: this.state.activeTab === Tab.BasicInfo ? 'white' : '#AFCAF7',
                },
              ]}>
                基本信息
              </Text>
              {this.renderTriangleUp(this.state.activeTab === Tab.BasicInfo)}
            </TouchableOpacity>
            <View style={{
              width: 1,
              backgroundColor: 'white',
            }}>
              <Text style={{color: 'white'}}>1</Text>
            </View>
            <TouchableOpacity
              style={styles.tabStyle}
              activeOpacity={0.8}
              onPress={() => {
                this.setState({activeTab: Tab.Order});
              }}
            >
              <Text style={[
                styles.tabTextStyle,
                {
                  color: this.state.activeTab === Tab.Order ? 'white' : '#AFCAF7',
                },
              ]}>
                TA的订单
              </Text>
              {this.renderTriangleUp(this.state.activeTab === Tab.Order)}
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flex: 1}}>
        {
          this.state.activeTab === Tab.BasicInfo ?
            this.renderBasicInfoTab()
            :
            this.renderOrderTab()
        }
        </View>
      </View>
    );
  }
  private renderBasicInfoTab = () => (
    <ScrollView>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            paddingLeft: 5,
            paddingRight: 5,
            paddingTop: 10,
            paddingBottom: 10,
          }}
          onPress={() => this.props.navigation.navigate('CustomWebView', { customurl: `${URL.H5_HOST}dataAnalysis/${this.state.memInfo.memberId}`, flag: true, headerTitle: '微店主数据分析',})}
        >
          <Text style={{
            color: '#4B8EFB',
            fontSize: 14,
            textDecorationLine: 'underline',
          }}>
            微店主数据分析
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{marginTop: 5}}>
        <List>
          <Item extra={this.state.memInfo.memberId}>
            店主ID
          </Item>
          <Item extra={this.state.memInfo.realName}>
            姓名
          </Item>
          <Item extra={this.state.memInfo.isAuthenticated ? '是' : '否'}>
            实名认证
          </Item>
          <Item extra={this.state.memInfo.teamLevelName}>
            舵主盟主
          </Item>
        </List>
      </View>
      <View style={{marginTop: 5}}>
        <List>
          <Item extra={
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={
                () => {
                  const url = `tel:${this.state.memInfo.mobile}`;
                  Linking.canOpenURL(url).then(supported => {
                    if (!supported) {
                      Log('Can\'t handle url: ' + url);
                    } else {
                      return Linking.openURL(url);
                    }
                  }).catch(err => console.error('An error occurred', err));
                }
              }
            >
              <Image style={{height: 25, width: 25}} source={require('../../../images/iphone_2x.png')}/>
            </TouchableOpacity>
          }
          >
            联系方式
          </Item>
          <Item extra={<Text style={styles.timeStyle}>{moment(this.state.memInfo.startTime * 1000).format('YYYY-MM-DD HH:mm:ss')}</Text>}>
            开店时间
          </Item>
          <Item extra={this.state.memInfo.subLevelNum || '0'}>
            合伙人
          </Item>
          <Item extra={this.state.memInfo.teamSize || '0'}>
            团队
          </Item>
        </List>
      </View>
      <View style={{marginTop: 5}}>
        <List>
          <Item extra={this.state.memInfo.isActive === true ? '是' : '否'}>
            本月活跃
          </Item>
          <Item extra={this.state.memInfo.teamVitality || '0'}>
            团队活跃度
          </Item>
          <Item extra={
              this.state.memInfo.firstOrderTime ?
                <Text style={styles.timeStyle}>{moment(this.state.memInfo.firstOrderTime * 1000).format('YYYY-MM-DD HH:mm:ss')}</Text>
                :
                '无'
          }>
            首单时间
          </Item>
          <Item extra={this.state.memInfo.userRank || '0'}>
            总排名
          </Item>
          <Item extra={this.state.memInfo.levelName}>
            等级
          </Item>
        </List>
      </View>
      <View style={{marginTop: 5}}>
        <List>
          <Item extra={
            <Text style={{
              fontSize: 12,
            }}>
              {this.state.memInfo.regionName}
            </Text>
          }>
            所在地
          </Item>
          <Item extra={
            <Text style={{
              fontSize: 12,
            }}>
              {moment(this.state.memInfo.lastLoginTime * 1000).format('YYYY-MM-DD HH:mm:ss')}
            </Text>
          }>
            最后登录时间
          </Item>
        </List>
      </View>
    </ScrollView>
  )
  private renderOrderTab = () => (
    <View>
      <MyTabs
        currentIndex={this.state.orderStatus}
        switchTab={
          (index) => {
            this.setState({orderStatus: index},
              () => this.listView.refresh());
          }
        }
      />
      <UltimateListView
        ref={(ref) => this.listView = ref}
        onFetch={this.onFetch}
        keyExtractor={(item, index) => `keys${index}`}
        refreshableMode='advanced' // basic or advanced
        item={this.renderItem}  // this takes two params (item, index)
        numColumn={1} // to use grid layout, simply set gridColumn > 1
        separator={() => <View style={{marginTop: 5}}/>}
        emptyView={() =>
          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 40,
          }}>
            <Text style={{color: '#666', fontSize: 16}}>暂无订单</Text>
          </View>
        }
      />
    </View>
  )
  private loadMemberInfo = async () => {
    const param = {
      memberId: this.props.navigation.state.params.memberId,
    };
    const resp = await getAppJSON('v3/mstore/sg/mechanism/findStoreMemberDetail.json', param);
    const { success, data } = resp;
    if (success && data) {
      this.setState({memInfo: data});
    }
  }
  private onFetch = async (page = 1, startFetch, abortFetch) => {
    try {
      const pageLimit = 10;
      const orderFlag = 3;

      const params = {
        orderFlag,
        orderStatus: this.state.orderStatus,
        queryMemberId: this.props.navigation.state.params.memberId,
        pageIndex: page - 1,
        pageSize: pageLimit,
      }

      const resp = getAppJSON('v3/h5/order/getOrderList.json', params);
      const { success, data } = await resp;

      if (!success || !data || !data.orders) {
        abortFetch();
        return;
      } else {

        startFetch(data.orders, pageLimit);
      }
    } catch (err) {
      abortFetch(); // manually stop the refresh or pagination if it encounters network error
      Log(err);
    }
  }

  private renderItem = (item) => (
    <View style={{
      backgroundColor: 'white',
      paddingLeft: 10,
      paddingRight: 10,
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: 10,
      }}>
        <Text>订单编号：{item.orderSn}</Text>
        <Text>{item.orderStatusName}</Text>
      </View>
      {
        item.orderProducts.map((ele, idx) => (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTopColor: '#F1F1F1',
            borderTopWidth: 1,
            paddingTop: 10,
            paddingBottom: 10,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Image
                style={{
                  height: 80,
                  width: 80,
                  marginLeft: 10,
                  marginRight: 10,
                }}
                source={{uri: ele.defaultImageUrl}}
              />
              <View style={{
                alignSelf: 'flex-start',
              }}>
                <Text style={{
                  marginBottom: 20,
                }}>{ele.productFullName}</Text>
                <Text>x{ele.number}</Text>
              </View>
            </View>
            <View>
              <Text>¥ {ele.price}</Text>
            </View>
          </View>
        ))
      }
      <View style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderTopColor: '#F1F1F1',
        borderTopWidth: 1,
        paddingTop: 10,
        paddingBottom: 10,
      }}>
        <Text>共{item.productTotalNo}件商品  合计：</Text>
        <Text style={{color: '#FC6E4F'}}>¥{item.productAmount}</Text>
      </View>
    </View>
  )

  /**
   * 标签页下边的三角形
   * @param shouldRender
   * @returns {any}
   */
  private renderTriangleUp = shouldRender => shouldRender && <Image
    style={{
      width: 10,
      height: 10,
      position: 'absolute',
      bottom:  0,
    }}
    source={require('../../../images/triangle_up.png')}
  />
}

const MyTabs = ({currentIndex, switchTab}) => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    width,
    backgroundColor: 'white',
    marginBottom: 5,
  }}>
    {
      tabs.map((tab, index) => (
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.tabsTitle,
            index === currentIndex && {
              borderBottomColor: '#307DFB',
              borderBottomWidth: 3,
            },
          ]}
          onPress={() => switchTab(index)}
          key={index}
        >
          <Text style={
            index === currentIndex ?
              styles.activeTabTitle : styles.normalTabTitle
          }>
            {tab.title}
          </Text>
        </TouchableOpacity>
      ))
    }
  </View>
)

const styles = StyleSheet.create({
  tabStyle: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
  },
  tabTextStyle: {
    fontSize: 15,
  },
  tabsTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
  },
  activeTabTitle: {
    fontSize: 14,
    color: '#5796FB',
  },
  normalTabTitle: {
    fontSize: 14,
  },
  timeStyle: {
    fontSize: 12,
  },
});

export default TeamateProfile;
