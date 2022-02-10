import * as React from 'react';
import { ImageBackground , Image, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { INavigation } from '../../../interface/index';
import { Modal, Tabs } from 'antd-mobile';
import CustomizedTab, { ORDER } from './CustomizedTab';
import { getAppJSON } from '../../../netWork';
import { UltimateListView } from 'rn-listview';
import moment from 'moment';
import Config from 'react-native-config';
import URL from './../../../config/url.js';
import { connect } from 'react-redux';
import TeamateProfile from './TeamateProfile';
import {createAction, iPhoneXPaddingTopStyle, isiPhoneX} from '../../../utils';
import ShareModle from '../../../components/ShareModle';
import { MessageWithBadge } from '../../../components/MessageWithBadge';
import CustomNaviBar from '../../../components/customNaviBar';
import {Color, Font} from 'consts';

let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
import CardModle from '../../../components/CardModle';


interface IProps {
    mid: number;
    unread: number;
    flagNum: number;
}

enum Filter {
    AuthenticatedFTR,
    UnauthenticatedFTR,
    ActiveFTR,
    InactiveFTR,
}

interface IState {
    subTabsArray: CustomizedTab[][];
    cascade: boolean;
    typeList: string[];
    activePartnerTypeIndex: number;
    activeTeamTypeIndex: number;
    userList: string[];
    activeUserIndex: number;
    order: string;
    isActive: boolean;
    isAuthenticated: boolean;
    userTabFocused: boolean;
    owner: any;
    parent: any;
    authenticatedCount: number;
    unAuthenticatedCount: number;
    activeNumber: number;
    notActiveNumber: number;
    filter: Filter;
    tabs: Array<{title: 'string', sub: 'string'}>;
    showRecommenderModal: boolean;
    showShareModal: boolean;
    showCardModal: boolean;
}

const subTabsArray = [
    [
        new CustomizedTab('开店时间', true, ORDER.DESC, true),
        new CustomizedTab('实名认证'),
        new CustomizedTab('盟主舵主'),
        new CustomizedTab('本月活跃'),
    ], [
        new CustomizedTab('开店时间', true, ORDER.DESC, true),
        new CustomizedTab('实名认证'),
        new CustomizedTab('盟主舵主'),
        new CustomizedTab('本月活跃'),
    ], [
        new CustomizedTab('微店主', false, ORDER.DESC, true),
        new CustomizedTab('商品数量'),
        new CustomizedTab('最近一次购买时间', true),
    ]
];

@connect(({users: { mid, unread }, mine: { flagNum, gameId }}) => ({mid, unread, flagNum, gameId}))
class TeamSupervise extends React.Component<INavigation & IProps, IState> {
    private listView;
    public constructor(props) {
        super(props);
        this.state = {
            subTabsArray,
            cascade: false, // false 合伙人 true 团队
            typeList: ['startTime', 'isAuthenticated', 'teamLevelOrder', 'isActive'], // 团队合伙人 排序
            activePartnerTypeIndex: 0, // 合伙人当前激活的标签
            activeTeamTypeIndex: 0, // 团队当前激活的标签
            userList: ['shopKeepers', 'purchasedNum', 'recentBuyingTime'], // 用户 排序
            activeUserIndex: 0, // 用户当前激活的标签
            order: 'desc',
            isActive: false,
            isAuthenticated: false,
            userTabFocused: false, // 用户标签被激活
            owner: {},
            parent: {},
            authenticatedCount: 0, // 已认证数
            unAuthenticatedCount: 0, // 未认证数
            activeNumber: 0, // 活跃数
            notActiveNumber: 0, // 未活跃数
            filter: null, // 实名认证和活跃度过滤
            tabs: [
                { title: '合伙人（0）', sub: '1' },
                { title: '团队（0）', sub: '2' },
                { title: '用户（0）', sub: '3' },
            ],
            showRecommenderModal: false,
            showShareModal: false,
            showCardModal: false,
        };
    }
    public componentDidMount() {
        // 设置用户标签的数量
        this.queryUserData(1, 10, true)
            .then((json) => {
                const { success, data } = json;
                if (success && data && data.total) {
                    this.resolveOuterUserTabCount(data.total);
                }
            })
            .catch((err) => Log(err));
    }
    public render(): JSX.Element {
        return (<View style={{flex: 1, backgroundColor: 'white', paddingBottom: isiPhoneX ? 34 : 0}}>
                <UltimateListView
                    ref={(ref) => this.listView = ref}
                    header={this.renderHeader}
                    onFetch={this.onFetch}
                    keyExtractor={(item, index) => `keys${index}`}
                    refreshableMode={Platform.OS === 'ios' ? 'advanced' : 'basic'}
                    item={this.renderItem}
                    numColumn={1}
                    separator={() => <View style={styles.line}/>}
                    paginationAllLoadedView={() => <View />}
                    paginationFetchingView={() => <View/>}
                    arrowImageStyle={{ width: 20, height: 20, resizeMode: 'contain' }}
                    dateStyle={{ color: 'lightgray' }}
                    refreshViewStyle={Platform.OS === 'ios' ? { height: 80, top: -80 } : { height: 80 }}
                    refreshViewHeight={80}
                />
                <Modal
                    visible={this.state.showRecommenderModal}
                    transparent
                    maskClosable={false}
                    onClose={this.closeModal}
                    title={'推荐人信息'}
                    style={{width: width * 3 / 4}}
                    footer={[{
                        text: '确定', onPress: () => {
                            this.closeModal();
                        },
                    }]}>
                    <View style={[styles.modalRow, {paddingTop: 10}]}>
                        <Text>推荐人：</Text>
                        <Text style={{paddingLeft: 12}}>{this.state.parent.realName}</Text>
                    </View>
                    <View style={styles.modalRow}>
                        <Text>推荐人ID：</Text>
                        <Text>{this.state.parent.memberId}</Text>
                    </View>
                    <View style={styles.modalRow}>
                        <Text>手机号码：</Text>
                        <Text>{this.state.parent.mobile}</Text>
                        <TouchableOpacity
                            style={{
                                paddingLeft: 10,
                                paddingRight: 10,
                            }}
                            activeOpacity={0.9}
                            onPress={() => {
                                const url = `tel:${this.state.parent.mobile}`;
                                Linking.canOpenURL(url).then(supported => {
                                    if (!supported) {
                                        Log('Can\'t handle url: ' + url);
                                    } else {
                                        return Linking.openURL(url);
                                    }
                                }).catch(err => console.error('An error occurred', err));
                            }}
                        >
                            <Image
                                style={{
                                    height: 20,
                                    width: 20,
                                }}
                                source={require('../../../images/headerphone.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </Modal>
                <ShareModle
                    visible={this.state.showShareModal} content={this.resolveSharingCommand()}
                    onCancel={() => this.setState({ showShareModal: false })}
                    hiddenEwm={true}
                    hidingTitle={true}
                    onSuccess={() => this.shareSucceeded()}
                />
                <CardModle
                    visible={this.state.showCardModal}
                    onCancel={() => this.setState({ showCardModal: false })}
                    onShare={() => this.setState({showShareModal: true})}
                />
            </View>
        );
    }
    private shareSucceeded = () => {
        const successBaseUrl = Config.SHARE_SUCCESS;
        const paramArray = [];
        const command = this.resolveSharingCommand();

        for (const key of command) {
            paramArray.push(key + '=' + command[key]);
        }

        getAppJSON(`${successBaseUrl}?${paramArray.join('&')}`)
            .then(res => {
                if (res.success) {
                    Log('调用微店主金币接口成功');
                }
            })
            .catch(err => Log('调用微店主金币接口失败'));
    }

    private resolveSharingCommand = (): any[] => {
        const title = '亲,送你一个360元+礼包,点这里免费领取哦!'; // 分享标题
        const content = '海尔官方平台，海量正品，来顺逛一起瓜分亿元佣金吧！'; // 分享内容
        const pic = this.state.owner.avatarImageFileId; // 分享图片，写绝对路径
        const url = `${URL.GET_REGISTER_SHARE_URL}${this.state.owner.promotionCode}`;

        return [ title, content, pic, url, 0 ];
    }
    private closeModal = () => {
        this.setState({showRecommenderModal: false});
    }
    private resetActive = (i: number, j: number): void => {
        // 如果点击的项目不是高亮项目，则进行高亮处理，并且处理完成就结束
        if (!this.state.subTabsArray[i][j].isActive()) {
            const newSubArray = [];
            const subArray = this.state.subTabsArray[i];
            subArray.map((item, index) => {
                index === j ? item.setActive(true) : item.setActive(false);
                newSubArray.push(item);
            });

            const newArray = [];
            this.state.subTabsArray.map((ele, idx) => {
                idx === i ? newArray.push(newSubArray) : newArray.push(ele);
            });

            let nextActivePartnerTypeIndex = this.state.activePartnerTypeIndex;
            let nextActiveTeamTypeIndex = this.state.activeTeamTypeIndex;
            let nextActiveUserIndex = this.state.activeUserIndex;
            let nextCascade = this.state.cascade;
            let nextFilter = this.state.filter;

            if (i < 2) {
                if (i < 1) {
                    nextActivePartnerTypeIndex = j;
                    nextCascade = false;
                } else {
                    nextActiveTeamTypeIndex = j;
                    nextCascade = true;
                }
            } else {
                nextActiveUserIndex = j;
            }

            let order = this.state.order;
            if (!this.state.subTabsArray[i][j].ifShowImage()) {
                order = 'desc';
            } else {
                order = this.state.subTabsArray[i][j].getOrder() === ORDER.ASC ? 'asc' : 'desc';
            }

            if (!nextCascade && 0 !== nextActivePartnerTypeIndex && 3 !== nextActivePartnerTypeIndex) {
                nextFilter = null;
            } else if (nextCascade && 0 !== nextActiveTeamTypeIndex && 3 !== nextActiveTeamTypeIndex) {
                nextFilter = null;
            }

            this.setState({
                    subTabsArray: newArray,
                    activePartnerTypeIndex: nextActivePartnerTypeIndex,
                    activeTeamTypeIndex: nextActiveTeamTypeIndex,
                    activeUserIndex: nextActiveUserIndex,
                    cascade: nextCascade,
                    order,
                    filter: nextFilter,
                }, () => this.listView.refresh(),
            );
            return;
        }
        // 如果点击的项目本来就是高亮项目，并且是带排序图标的，则进行排序切换处理
        if (this.state.subTabsArray[i][j].isActive() && this.state.subTabsArray[i][j].ifShowImage()) {
            const newSubArray = [];
            const subArray = this.state.subTabsArray[i];
            let order = 'desc';
            subArray.map((item, index) => {
                if (index === j) {
                    item.setOrder(item.getOrder() === ORDER.ASC ? ORDER.DESC : ORDER.ASC);
                    order = item.getOrder() === ORDER.ASC ? 'asc' : 'desc';
                }
                newSubArray.push(item);
            });

            const newArray = [];
            this.state.subTabsArray.map((ele, idx) => {
                idx === i ? newArray.push(newSubArray) : newArray.push(ele);
            });

      this.setState({subTabsArray: newArray, order}, () => this.listView.refresh());
    }
  }
  private renderFilter = (item, index): JSX.Element => {
    if (!this.state.userTabFocused) {
      if ((this.state.cascade && 1 === this.state.activeTeamTypeIndex) || (!this.state.cascade && 1 === this.state.activePartnerTypeIndex)) {
        return (<View style={{flexDirection: 'row', paddingLeft: 16, paddingTop: 16, paddingBottom: 16}}>
            <TouchableOpacity activeOpacity={0.9} onPress={() => this.setState({filter: Filter.UnauthenticatedFTR}, () => this.listView.refresh())}>
              <Text style={this.state.filter === Filter.UnauthenticatedFTR ? styles.acitveFilterText : styles.filterText}>未认证：{this.state.unAuthenticatedCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{marginLeft: 20}} activeOpacity={0.9} onPress={() => this.setState({filter: Filter.AuthenticatedFTR}, () => this.listView.refresh())}>
              <Text style={this.state.filter === Filter.AuthenticatedFTR ? styles.acitveFilterText : styles.filterText}>已认证：{this.state.authenticatedCount}</Text>
            </TouchableOpacity>
          </View>);
      } else if ((this.state.cascade && 3 === this.state.activeTeamTypeIndex) || (!this.state.cascade && 3 === this.state.activePartnerTypeIndex)) {
        return (<View style={{flexDirection: 'row', paddingLeft: 16, paddingTop: 16, paddingBottom: 16}}>
            <TouchableOpacity activeOpacity={0.9} onPress={() => this.setState({filter: Filter.InactiveFTR},() => this.listView.refresh())}>
              <Text style={this.state.filter === Filter.InactiveFTR ? styles.acitveFilterText : styles.filterText}>未活跃：{this.state.notActiveNumber}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{marginLeft: 20}} activeOpacity={0.9} onPress={() => this.setState({filter: Filter.ActiveFTR},() => this.listView.refresh())}>
              <Text style={this.state.filter === Filter.ActiveFTR ? styles.acitveFilterText : styles.filterText}>活跃：{this.state.activeNumber}</Text>
            </TouchableOpacity>
          </View>
        );
      }
    }
  }
  private renderItem = (item, index): JSX.Element => {
    return (
      <View>{0 === index && this.renderFilter(item, index)}
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center',}}
          activeOpacity={0.9}
          onPress={() => {
              if (this.state.userTabFocused) {
                this.props.navigation.navigate('UserProfile', {
                  memberId: item.memberId,
                  name: item.userName,
                  mobile: item.mobile,
                  isTeamNum: item.isTeamNum,
                  avatarImageFileId: item.avatarImageFileId,
                });
              } else {
                this.props.navigation.navigate('TeamateProfile', {memberId: item.memberId, type: this.state.cascade ? 1 : 0});
              }
            }
          }>
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
              <View style={{
                width: width * 1 / 5,
                justifyContent: 'center',
              }}>
                <Text style={{fontSize: Font.LARGE_3, color: Color.BLACK}} numberOfLines={1} ellipsizeMode='tail'>{this.state.userTabFocused ? item.userName : item.storeName}</Text>
              </View>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>{this.state.userTabFocused ? ((item.levelOrder > 0) && <RankLevel
                      level={item.levelOrder}
                      name={item.level}
                      hasWhiteBg={false}
                    />) : <RankLevel
                      level={item.levelOrder}
                      name={item.levelName}
                      hasWhiteBg={false}
                    />}
                {item.isAuthenticated && <AuthenticatedFlag/>}
              </View>
            </View>
            {this.state.userTabFocused ? <View>
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
                }}><Text style={[styles.subTitle]}>最近一次购买时间：{moment(item.recentBuyingTime * 1000).format('YYYY-MM-DD HH:mm:ss')}</Text></View>
              </View> : <View>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 5,
                  marginBottom: 5,
                }}>
                  <Text style={[styles.subTitle]}>本月活跃：{item.isActive ? '是' : '否'} </Text>
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
        </TouchableOpacity>
      </View>
    );
  }
  private onFetch = async (page = 1, startFetch, abortFetch) => {
    try {
      this.setState({
        authenticatedCount: 0,
        unAuthenticatedCount: 0,
        activeNumber: 0,
        notActiveNumber: 0,
      });
      const pageLimit = 10;

            let resp = null;
            if (this.state.userTabFocused) {
                resp = await this.queryUserData(page, pageLimit);
            } else {
                resp = await this.pagingChildren(page, pageLimit);
            }
            const { success, data } = await resp;

      if (!success || !data ) {
        abortFetch();
        return;
      } else {

        if (!this.state.userTabFocused) { // 请求的是pagingChildren方法
          let parent = this.state.parent; // 设置我的推荐人
          if (data.parent) {
            parent = data.parent;
          }
          if (data.owner) { // 设置合伙人、团队标签的数量
            if(page == 1){
                const newTabs = [];
                this.state.tabs.map((item, index) => {
                    if (0 === index) {
                        newTabs.push({title: `合伙人（${data.owner.subLevelNum || 0}）`, sub: '1'});
                    } else if (1 === index) {
                        newTabs.push({title: `团队（${data.owner.teamSize || 0}）`, sub: '2'});
                    } else {
                        newTabs.push(item);
                    }
                });
                this.setState({
                    tabs: newTabs,
                });
            }

            this.setState({
              owner: data.owner,
            });

            this.setState({
                  authenticatedCount: data.authenticatedNum || 0,
                  unAuthenticatedCount: data.unAuthenticatedNum || 0,
                  activeNumber: data.activeNum || 0,
                  notActiveNumber: data.unActiveNum || 0,
                  parent,
            });

          } else { // 设置用户标签的数量
              if (page == 1) {
                  if (data.total) {
                      this.resolveOuterUserTabCount(data.total);
                  }
              }
          }
          startFetch(data.children, pageLimit);
        } else {
            startFetch(data.rows, pageLimit);
        }
      }
    } catch (err) {
      abortFetch(); // manually stop the refresh or pagination if it encounters network error
      Log(err);
    }
  }
  private resolveOuterUserTabCount(total) {
    const newTabs = [];
    this.state.tabs.map((item, index) => {
      if (2 === index) {
        newTabs.push({title: `用户（${total}）`, sub: '1'});
      } else {
        newTabs.push(item);
      }
    });
    this.setState({tabs: newTabs});
  }
  private resolveSort = (): string => {
    if (this.state.userTabFocused) {
      return this.state.userList[this.state.activeUserIndex];
    }
    if (this.state.cascade) { // team
      return this.state.typeList[this.state.activeTeamTypeIndex];
    } else { // partner
      return this.state.typeList[this.state.activePartnerTypeIndex];
    }
  }
  private pagingChildren = async (page, pageSize) => {
    const { mid: memberId } = this.props;
    // memberId, cascade, page, pageSize, sort, order, isActive, isAuthenticated
    const params = {
      withParent: true,
      memberId,
      cascade: this.state.cascade,
      pageNumber: page,
      pageSize,
      sort: this.resolveSort(),
      order: this.state.order,
    };

        if (this.state.filter === Filter.UnauthenticatedFTR) {
            params.isAuthenticated = false;
        } else if (this.state.filter === Filter.AuthenticatedFTR) {
            params.isAuthenticated = true;
        } else if (this.state.filter === Filter.InactiveFTR) {
            params.isActive = false;
        } else if (this.state.filter === Filter.ActiveFTR) {
            params.isActive = true;
        }

        return await getAppJSON('v3/mstore/sg/mechanism/pagingChildren.json', params, {}, true);
    }
    /**
     * 请求用户标签的数据
     * @param {number} page
     * @param {number} pageSize
     * @param {boolean} forceSortToShopKeepers 强制指定用户标签请求数据时sort参数为"shopKeepers"，页面初始化时需要获取用户标签上的数量
     * @returns {Promise<any>}
     */
    private queryUserData = async (page: number, pageSize: number, forceSortToShopKeepers: boolean = false) => {
        const { mid: memberId } = this.props;
        const params = {
            memberId,
            pageNumber: page,
            pageSize,
            sort: forceSortToShopKeepers ? 'shopKeepers' : this.resolveSort(),
            order: this.state.order,
        };

        return await getAppJSON('v3/mstore/sg/mechanism/findOrderProductUserInfo.json', params, {}, true);
    }
    private renderHeader = () => (
        <View>
            <ImageBackground source={require('../../../images/ic_hhr_bg.png')}
                             style={{width}}>
                <CustomNaviBar
                    navigation={this.props.navigation}
                    style={{backgroundColor: Color.transparent}}
                    containerStyle={{backgroundColor: Color.transparent}}
                    local = {{titleStyle: {color: Color.WHITE}}}
                    title={'团队管理'}
                    leftViewImage={require('../../../images/ic_back_white.png')}
                    leftAction={() =>this.props.navigation.goBack()}
                    rightView={(
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <MessageWithBadge
                                badgeContainStyle={{top: 5, right: 2}}
                                imageStyle={{ width: 22, height: 22}}
                                navigation={this.props.navigation}
                                unread={this.props.unread}
                                isWhite={true}
                                hidingText={true}
                                marginRightStyle={{marginRight: 0}}
                            />
                            <TouchableOpacity
                                style={{paddingRight: 16}}
                                activeOpacity={0.8}
                                onPress={
                                    () => this.props.navigation.navigate('UserSearch', {
                                        cascade: this.state.cascade,
                                        userTabFocused: this.state.userTabFocused,
                                    })
                                }
                            >
                                <Image style={{height: 24, width: 24}} source={require('../../../images/search_white.png')}/>
                            </TouchableOpacity>
                        </View>
                    )}
                />
                <View style={{
                    paddingTop: 30,
                    paddingBottom: 20,
                    paddingLeft: 14,
                    paddingRight: 14,
                }}>
                    <View style={{flexDirection: 'row' , alignItems: 'center'}}>
                        <Image
                            style={{ width: 60, height: 60, borderRadius: 30}}
                            source={{uri: this.state.owner.avatarImageFileId}}/>
                        <TouchableOpacity
                            style={{paddingLeft: 16, flexDirection: 'column' , flex: 1}}
                            activeOpacity={0.9}
                            onPress={() => {
                                // this.props.navigation.navigate('VIPCenter')
                                this.props.navigation.navigate('CustomWebView', {
                                    customurl: `${URL.H5_HOST}vip/${this.props.gameId}/`,
                                    flag: true,
                                    headerTitle: '会员中心',
                                    callBack: () => {
                                        this.props.dispatch(createAction('mine/fetchApplyStatus')());
                                    }
                                });
                            }}>
                            <Text style={[styles.whiteText, {fontSize: 18}]} numberOfLines={1}
                                  ellipsizeMode='tail'>{this.state.owner.storeName}</Text>
                            {this.state.owner.isAuthenticated ?
                                <Image
                                    style={{ width: 45, height: 16.3 , marginTop: 2, marginBottom: 2}}
                                    source={require('../../../images/ic_hhr_renz.png')}/> :
                                null}
                            {/* <RankLevel
            level={this.state.owner.levelOrder}
            name={this.state.owner.levelName}
            hasWhiteBg={true}/> */}
                            {/* {this.state.owner.isAuthenticated && <AuthenticatedFlag />} */}
                            {this.state.owner.promotionCode ?
                                <Text style={[styles.whiteText, {fontSize: 12}]}>推广码：{this.state.owner.promotionCode}</Text> : null}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{width: 44, height: 44}}
                            activeOpacity={0.9}
                            onPress={() => {
                                this.setState({ showCardModal: true });
                            }}>
                            <Image style={{width: 24, height: 24 , margin: 10}}
                                   source={require('../../../images/ic_hhr_qr.png')}/>
                        </TouchableOpacity>
                    </View>
                    {/* <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 2,
            paddingBottom: 2,
            borderRadius: 15,
            marginTop: 10,
          }}
          onPress={() => this.setState({showShareModal: true})}
          activeOpacity={0.9}
        >
          <Image
            style={{
              width: 11,
              height: 11,
              marginRight: 5,
            }}
            source={require('../../../images/share_b_2x.png')}
          />
          <Text style={{fontSize: 14, color: '#307DFB'}}>我的推广码：{this.state.owner.promotionCode}</Text>
        </TouchableOpacity> */}
                    <View style={{flexDirection: 'row' , alignItems: 'center' , paddingTop: 15}}>
                        {this.state.parent.realName ? <TouchableOpacity
                            activeOpacity={0.9}
                            style={{
                                width: 92, height: 30, marginRight: 15,
                                justifyContent: 'center', alignItems: 'center',
                                borderRadius: 15, borderColor: 'white', borderWidth: 1,
                            }}
                            onPress={() => this.setState({showRecommenderModal: true})}
                        >
                            {/* <Text style={{fontSize: 14, color: 'white'}}>我的推荐人：{this.state.parent.realName}</Text> */}
                            <Text style={{fontSize: 12, color: 'white'}}>联系推荐人</Text>
                        </TouchableOpacity> : null}
                        {this.state.owner.storeName ?
                            <TouchableOpacity
                                activeOpacity={0.9}
                                style={{
                                    width: 92, height: 30, marginRight: 15,
                                    justifyContent: 'center', alignItems: 'center',
                                    borderRadius: 15, borderColor: 'white', borderWidth: 1,
                                }}
                                onPress={() => this.setState({showShareModal: true})}
                            >
                                <Text style={{fontSize: 12, color: 'white'}}>邀请合伙人</Text>
                            </TouchableOpacity> : null}

                    </View>
                </View>
            </ImageBackground>
            <View>
                <Tabs tabs={this.state.tabs}
                      initialPage={0}
                      tabBarPosition= 'top'
                      tabBarUnderlineStyle={{backgroundColor: '#2292E6'}}
                      tabBarActiveTextColor='#2292E6'
                      renderTabBar = {this.renderTabBar}
                      onChange={(tab, index) => {
                          let order = this.state.order;
                          if (index < 2) { // 合伙人和团队之间的切换
                              let nextCascade = this.state.cascade;
                              if (index > 0) {
                                  nextCascade = true;
                              } else {
                                  nextCascade = false;
                              }

                              // 如果切换到的标签页高亮选项是带排序的，则先取出该高亮选项的排序并设置为当前排序
                              if (0 === index && 0 === this.state.activePartnerTypeIndex) {
                                  order = this.state.subTabsArray[0][0].getOrder() === ORDER.ASC ? 'asc' : 'desc';
                              } else if (1 === index && 0 === this.state.activeTeamTypeIndex) {
                                  order = this.state.subTabsArray[1][0].getOrder() === ORDER.ASC ? 'asc' : 'desc';
                              }

                              // 合伙人 和 团队 两个标签切换，则刷新
                              if (nextCascade !== this.state.cascade) {
                                  this.listView.updateDataSource([]);
                                  this.setState({userTabFocused: false, cascade: nextCascade, order}, () => this.listView.refresh());
                              } else if (this.state.userTabFocused) { // 从用户标签切换回来
                                  this.listView.updateDataSource([]);
                                  this.setState({userTabFocused: false, order}, () => this.listView.refresh());
                              }
                          } else { // 点击的是用户标签
                              this.listView.updateDataSource([]);
                              this.setState({userTabFocused: true}, () => this.listView.refresh());
                          }
                      }}
                >
                    <View style={{flex: 1}}>
                        <RenderTabs
                            subArray={this.state.subTabsArray[0]}
                            iterI={0}
                            resetActive={this.resetActive}
                        />
                    </View>
                    <View>
                        <RenderTabs
                            subArray={this.state.subTabsArray[1]}
                            iterI={1}
                            resetActive={this.resetActive}
                        />
                    </View>
                    <View>
                        <RenderTabs
                            subArray={this.state.subTabsArray[2]}
                            iterI={2}
                            resetActive={this.resetActive}
                        />
                    </View>
                </Tabs>
            </View>
        </View>
    )
    private renderTabBar = (props) => {
        return (
            <Tabs.DefaultTabBar
                tabs={this.state.tabs}
                animated= {false}
                {...props}
            />
        );
    }
}

export const timeConvertor = (timestamp) => {
    // // 比如需要这样的格式 yyyy-MM-dd hh:mm:ss
    // const date = new Date(parseInt(`${timestamp}`, 10) * 1000);
    // const Y = date.getFullYear();
    // const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    // const D = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    // const h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    // const m = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    // const s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    // // 输出结果：2014-04-23 18:55:49
    // return `${Y}-${M}-${D} ${h}:${m}:${s}`;
    return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
}

const RenderTabs = ({subArray, iterI, resetActive}): JSX.Element => (
    <View style={[
        styles.rowView,
        {
            backgroundColor: '#EEEEEE',
            width,
            paddingTop: 15,
            paddingBottom: 15,
        },
    ]}>
        {subArray.map((e, i) => (
            <TouchableOpacity style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }} onPress={() => resetActive(iterI, i)}>
                <Text style={e.isActive() ? {color: '#5894F8'} : {}}>{e.getText()}</Text>
                {(e.ifShowImage() && e.getOrder() === ORDER.ASC) ? <Image
                    style={{
                        width: 8,
                        height: 14,
                    }}
                    source={require('../../../images/sortt.png')}
                /> : null}
                {(e.ifShowImage() && e.getOrder() === ORDER.DESC) ? <Image
                    style={{
                        width: 8,
                        height: 14,
                    }}
                    source={require('../../../images/sortf.png')}
                /> : null}
            </TouchableOpacity>
        ))}
    </View>
);

export const RankLevel = ({hasWhiteBg, level, name}: { hasWhiteBg: boolean, level: number, name: string }): JSX.Element => {
    const levelImage = hasWhiteBg ? require('../../../images/bluev.png') : require('../../../images/whitev.png');
    return <View style={[
        styles.rowView,
        {
            borderColor: hasWhiteBg ? 'white' : '#307DFB',
            borderWidth: 1,
            borderRadius: 2,
            marginLeft: 5,
            marginRight: 5,
        },
    ]}>
        <View style={[
            styles.rowView,
            {
                justifyContent: 'center',
                backgroundColor: hasWhiteBg ? 'white' : '#307DFB',
                paddingLeft: 3,
                paddingRight: 3,
            },
        ]}>
            <Image
                style={{
                    height: 6,
                    width: 6,
                }}
                source={levelImage}
            />
            <Text style={{
                color: hasWhiteBg ? '#307DFB' : 'white',
                paddingLeft: 3,
                paddingRight: 3,
                fontSize: 12,
            }}>{level}</Text>
        </View>
        <Text style={[
            {
                color: hasWhiteBg ? 'white' : '#307DFB',
                paddingLeft: 3,
                paddingRight: 3,
                fontSize: 12,
            },
        ]}>{name}</Text>
    </View>;
}
export const AuthenticatedFlag = () => (
    <View style={[
        styles.rowView,
        {
            alignItems: 'center',
            backgroundColor: '#F19835',
            paddingTop: 2,
            paddingBottom: 2,
            paddingLeft: 5,
            paddingRight: 5,
            borderRadius: 2,
        },
    ]}>
        <Image
            style={{
                width: 10,
                height: 10,
            }}
            source={require('../../../images/icon_rz_2x.png')}
        />
        <Text style={[styles.whiteText, {fontSize: 12}]}> 认证</Text>
    </View>
)

const styles = StyleSheet.create({
    outerViewPadding: {
        paddingTop: 10,
        paddingLeft: 5,
        paddingRight: 5,
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    whiteText: {
        color: 'white',
    },
    line: {
        height: 0.5,
        backgroundColor: '#E4E4E4',
    },
    subTitle: {
        color: Color.GREY_1,
        fontSize: Font.NORMAL_2,
    },
    filterText: {
        color: '#B1B1B1',
        fontSize: 12,
    },
    acitveFilterText: {
        color: '#3B84FB',
        fontSize: 12,
    },
    modalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: width * 1 / 10,
        marginTop: 10,
    },
});

export default TeamSupervise;
