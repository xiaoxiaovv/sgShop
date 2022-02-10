import {StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Modal, Platform } from 'react-native';
import * as React from 'react';
import { Toast } from 'antd-mobile';
import CustomButton from 'rn-custom-btn1';
import { UltimateListView } from 'rn-listview';
import { INavigation } from '../../../interface/index';
import { isiPhoneX } from '../../../utils';
import {postAppJSON, getAppJSON} from '../../../netWork';
import Config from 'react-native-config';
import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
import CustomNaviBar from '../../../components/customNaviBar';
import OrderCard from './OrderCard';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import { MessageWithBadge } from '../../../components/MessageWithBadge';
import { connect } from 'react-redux';
import { Color, Font } from 'consts';

interface IOrderListState {
    data: any[];
    orderFlag: number;
    initStatus: number;
    orderStatus: number;
    topTitle?: string;
    showTopMenu?: boolean;
}

const topMenus = [
    '全部订单',
    '我的订单',
    '用户订单',
  ];
@connect(({ users: { unread } }) => ({ unread}))
class OrderList extends React.Component<INavigation & {topTitle: '全部订单', unread: number}, IOrderListState> {

    private listView?: any;  // 售后维修界面
    private listView0?: any;
    private listView1?: any;
    private listView2?: any;
    private listView3?: any;
    private listView4?: any;

    public constructor(props) {
        super(props);
        // 初始化state
        const { params } = this.props.navigation.state;
        this.state = {
            data: [],
            orderFlag: params.orderFlag,
            // 初始化status
            initStatus: params.orderStatus,
            orderStatus: params.orderStatus,
            topTitle: params.topTitle ? params.topTitle : '全部订单',
            showTopMenu: false,
        };
    }

    public componentWillUnmount() {
        // 点击了返回,当前界面pop出栈,刷新前一个界面Mine
        const { callBack } = this.props.navigation.state.params;
        if (callBack) {
            // 刷新我的界面
            callBack();
        }
    }

    public render(): JSX.Element {
        const { params } = this.props.navigation.state;
        return (
                <View style={{backgroundColor: '#f1f1f1', flex: 1}}>
                    {/* 自定义导航栏 */}
                    <CustomNaviBar
                        navigation = { this.props.navigation }
                        hiddenLeftBtn = { false }
                        leftAction={() => {
                            if (params.routeKey) {
                                this.props.navigation.goBack(params.routeKey);
                            } else {
                                this.props.navigation.goBack();
                            }
                        }}
                        containerStyle = {{ backgroundColor: 'transparent' }}
                        showBottomLine = {true}
                        local = { {leftStyle: { width: 22, height: 22}}}
                        titleView = {
                            (params.orderStatus !== 5) ?
                            <TouchableOpacity
                                activeOpacity = {0.7}
                                onPress={() => { this.toggleMenu(); }}
                                >
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{color: 'black', fontSize: 17}}>
                                        {this.state.topTitle}
                                    </Text>
                                    <Image style={{
                                            width: 24,
                                            height: 24,
                                            marginRight: 5,
                                            }}
                                            source={this.state.showTopMenu ?
                                                require('../../../images/b_down.png') :
                                                require('../../../images/b_top.png')
                                                }/>
                                </View>
                            </TouchableOpacity> :
                            <Text style={{
                                    color: 'black',
                                    fontSize: 18}}>
                                    {'售后维修'}
                            </Text>
                        }
                        rightView = {
                            ((params.orderStatus !== 5) && (params.headerRight ? params.headerRight :
                                <View style={{flexDirection: 'row',
                                              justifyContent: 'flex-end',
                                              alignItems: 'center'}}>
                                    <CustomButton
                                        style={{width: 22, height: 22, marginRight: 10}}
                                        imageStyle={{ width: 22, height: 22, resizeMode: 'contain' } }
                                        image={require('../../../images/search.png')}
                                        onPress= { () => {
                                            // 跳转到订单搜索页面
                                            this.props.navigation.navigate('OrderSearch');
                                         } }
                                        />
                                    <MessageWithBadge
                                        messageBoxStyle={{justifyContent: 'center'}}
                                        badgeContainStyle={{top: 5, right: -5}}
                                        imageStyle={{ width: 22, height: 22}}
                                        navigation={this.props.navigation}
                                        unread={this.props.unread}
                                        isWhite={false}
                                        hidingText={true}
                                    />
                                </View>))
                        }
                    />
                    {/* 下拉菜单 */}
                    {this.state.showTopMenu &&
                        this.renderTopMenu()
                    }
                    {// 售后维修界面
                    (this.props.navigation.state.params.orderStatus === 5) ?
                    (<UltimateListView
                        style={{paddingTop: 10, marginBottom: 10}}
                        ref={(ref) => this.listView = ref}
                        onFetch={this.onFetch}
                        keyExtractor={(item, index) => `keys${index}`}
                        refreshableMode='advanced'
                        item={this.renderUListItem}
                        numColumn={1}
                        paginationAllLoadedView={() => <View />}
                        paginationFetchingView={() => <View/>}
                        emptyView={() =>
                            <View style={{ height, justifyContent: 'center',
                                    alignItems: 'center', top: -40}}>
                                <Text style={{color: '#666', fontSize: 16}}>暂无订单</Text>
                            </View>
                        }/>
                    ) :
                    (
                    <ScrollableTabView
                        initialPage={this.state.initStatus}
                        locked={true}
                        tabBarUnderlineStyle={{backgroundColor: Color.BLUE_1, height: 1}}
                        tabBarBackgroundColor='#FFFFFF'
                        tabBarActiveTextColor={Color.BLUE_1}
                        tabBarInactiveTextColor={Color.GREY_1}
                        tabBarTextStyle={{fontSize: 14}}
                        onChangeTab={(obj) => {
                            this.setState({
                                orderStatus: obj.i,
                            }, ( ) => {
                                switch (obj.i) {
                                    case 0:
                                        this.listView0.onRefresh();
                                        break;
                                    case 1:
                                        this.listView1.onRefresh();
                                        break;
                                    case 2:
                                        this.listView2.onRefresh();
                                        break;
                                    case 3:
                                        this.listView3.onRefresh();
                                        break;
                                    case 4:
                                        this.listView4.onRefresh();
                                        break;
                                    default:
                                        break;
                                }
                             });
                        }}
                        >
                    {/* 全部订单 */}
                    <View tabLabel = '全部'>
                            <UltimateListView
                            style={{paddingTop: 10, marginBottom: 10}}
                            ref={(ref) => this.listView0 = ref}
                            onFetch={this.onFetch1}
                            keyExtractor={(item, index) => `keys${index}`}
                            refreshableMode='advanced'
                            item={this.renderUListItem}
                            numColumn={1}
                            paginationAllLoadedView={() => <View />}
                            paginationFetchingView={() => <View/>}
                            emptyView={() =>
                                <View style={{ height, justifyContent: 'center',
                                        alignItems: 'center', top: -40}}>
                                    <Text style={{color: '#666', fontSize: 16}}>暂无订单</Text>
                                </View>
                            }/>
                    </View>
                    {/* 待付款订单 */}
                    <View tabLabel = '待付款'>
                            <UltimateListView
                            style={{paddingTop: 10, marginBottom: 10}}
                            ref={(ref) => this.listView1 = ref}
                            onFetch={this.onFetch2}
                            keyExtractor={(item, index) => `keys${index}`}
                            refreshableMode='advanced'
                            item={this.renderUListItem}
                            numColumn={1}
                            paginationAllLoadedView={() => <View />}
                            paginationFetchingView={() => <View/>}
                            emptyView={() =>
                                <View style={{ height, justifyContent: 'center',
                                        alignItems: 'center', top: -40}}>
                                    <Text style={{color: '#666', fontSize: 16}}>暂无订单</Text>
                                </View>
                            }/>
                    </View>
                    {/* 待发货订单 */}
                    <View tabLabel = '待发货'>
                            <UltimateListView
                            style={{paddingTop: 10, marginBottom: 10}}
                            ref={(ref) => this.listView2 = ref}
                            onFetch={this.onFetch3}
                            keyExtractor={(item, index) => `keys${index}`}
                            refreshableMode='advanced'
                            item={this.renderUListItem}
                            numColumn={1}
                            paginationAllLoadedView={() => <View />}
                            paginationFetchingView={() => <View/>}
                            emptyView={() =>
                                <View style={{ height, justifyContent: 'center',
                                        alignItems: 'center', top: -40}}>
                                    <Text style={{color: '#666', fontSize: 16}}>暂无订单</Text>
                                </View>
                            }/>
                    </View>
                    {/* 待收货订单 */}
                    <View tabLabel = '待收货'>
                            <UltimateListView
                            style={{paddingTop: 10, marginBottom: 10}}
                            ref={(ref) => this.listView3 = ref}
                            onFetch={this.onFetch4}
                            keyExtractor={(item, index) => `keys${index}`}
                            refreshableMode='advanced'
                            item={this.renderUListItem}
                            numColumn={1}
                            paginationAllLoadedView={() => <View />}
                            paginationFetchingView={() => <View/>}
                            emptyView={() =>
                                <View style={{ height, justifyContent: 'center',
                                        alignItems: 'center', top: -40}}>
                                    <Text style={{color: '#666', fontSize: 16}}>暂无订单</Text>
                                </View>
                            }/>
                    </View>
                    {/* 待评价订单 */}
                    <View tabLabel = '待评价'>
                            <UltimateListView
                            style={{paddingTop: 10, marginBottom: 10}}
                            ref={(ref) => this.listView4 = ref}
                            onFetch={this.onFetch5}
                            keyExtractor={(item, index) => `keys${index}`}
                            refreshableMode='advanced'
                            item={this.renderUListItem}
                            numColumn={1}
                            paginationAllLoadedView={() => <View />}
                            paginationFetchingView={() => <View/>}
                            emptyView={() =>
                                <View style={{ height, justifyContent: 'center',
                                        alignItems: 'center', top: -40}}>
                                    <Text style={{color: '#666', fontSize: 16}}>暂无订单</Text>
                                </View>
                            }/>
                    </View>
                    </ScrollableTabView>
                    )
                    }
                </View>
        );
    }

    public renderUListItem = (item, index) => {
        const listIndex =  this.state.orderStatus;
        // alert(listIndex);
        let listView: any;
        switch (listIndex) {
            case 0:
                listView = this.listView0;
                break;
            case 1:
                listView = this.listView1;
                break;
            case 2:
                listView = this.listView2;
                break;
            case 3:
                listView = this.listView3;
                break;
            case 4:
                listView = this.listView4;
                break;
            case 5:
                // 售后维修
                listView = this.listView;
                break;
            default:
                break;
        }
        return (
            <OrderCard
                orderStatus={listIndex}
                navigation = {this.props.navigation}
                item = {item}
                index = {index}
                superListView = {listView}
            />
        );
    }

    private renderTopMenu = () => {
        return (
            <View style={styles.renderStyle}>
                {topMenus.map((title, index) => {
                        return (
                            <TouchableOpacity
                                style={{flex: 1, width}}
                                activeOpacity = {0.7}
                                onPress={() => { this.clickMenu(index); }}
                                >
                                <View style={{flex: 1, width, justifyContent: 'center'}}>
                                    <Text style={{fontSize: 17, marginLeft: 10}}>{title}</Text>
                                </View>
                                <View style={styles.bottomLine}/>
                            </TouchableOpacity>
                        );
                    })}
            </View>
        );
    }
    // 获取售后维修订单数据
    private onFetch = async ( page = 1, startFetch, abortFetch) => {
        // console.log('zhaoxincheng>>获取售后维修订单数据');
        // alert('zhaoxincheng>>>this.state.orderFlag:' + this.state.orderFlag);
        // alert('zhaoxincheng>>>this.state.orderStatus:' + this.state.orderStatus);
        try {
            const pageLimit = 5;
            // 获取订单数据
            const json = await getAppJSON(Config.ORDER_LIST, {
                orderFlag: 0,
                orderStatus: 5,
                pageIndex: (page - 1),
                pageSize: 5,
            }, {}, true);
            if (json.success) {
                this.setState({data: json.data.orders}, () => {startFetch(json.data.orders, pageLimit); });
            } else {
                Toast.fail(json.message, 1);
            }
        } catch (err) {
            abortFetch(); // manually stop the refresh or pagination if it encounters network error
            Log(err);
        }
    }
    // 获取全部订单数据
    private onFetch1 = async ( page = 1, startFetch, abortFetch) => {
        // console.log('zhaoxincheng>>获取全部订单数据');
        // alert('zhaoxincheng>>>this.state.orderFlag:' + this.state.orderFlag);
        // alert('zhaoxincheng>>>this.state.orderStatus:' + this.state.orderStatus);
        try {
            const pageLimit = 5;
            // 获取订单数据
            const json = await getAppJSON(Config.ORDER_LIST, {
                orderFlag: this.state.orderFlag,
                orderStatus: 0,
                pageIndex: (page - 1),
                pageSize: 5,
            }, {}, true);
            if (json.success) {
                this.setState({data: json.data.orders}, () => {startFetch(json.data.orders, pageLimit); });
            } else {
                Toast.fail(json.message, 1);
            }
        } catch (err) {
            abortFetch(); // manually stop the refresh or pagination if it encounters network error
            Log(err);
        }
    }
    // 获取待付款订单数据
    private onFetch2 = async ( page = 1, startFetch, abortFetch) => {
        // console.log('zhaoxincheng>>获取待付款订单数据');
        // alert('zhaoxincheng>>>this.state.orderFlag:' + this.state.orderFlag);
        // alert('zhaoxincheng>>>this.state.orderStatus:' + this.state.orderStatus);
        try {
            const pageLimit = 5;
            // 获取订单数据
            const json = await getAppJSON(Config.ORDER_LIST, {
                orderFlag: this.state.orderFlag,
                orderStatus: 1,
                pageIndex: (page - 1),
                pageSize: 5,
            }, {}, true);
            if (json.success) {
                this.setState({data: json.data.orders}, () => {startFetch(json.data.orders, pageLimit); });
            } else {
                Toast.fail(json.message, 1);
            }
        } catch (err) {
            abortFetch(); // manually stop the refresh or pagination if it encounters network error
            Log(err);
        }
    }
    // 获取待发货订单数据
    private onFetch3 = async ( page = 1, startFetch, abortFetch) => {
        // console.log('zhaoxincheng>>获取待发货订单数据');
        // alert('zhaoxincheng>>>this.state.orderFlag:' + this.state.orderFlag);
        // alert('zhaoxincheng>>>this.state.orderStatus:' + this.state.orderStatus);
        try {
            const pageLimit = 5;
            // 获取订单数据
            const json = await getAppJSON(Config.ORDER_LIST, {
                orderFlag: this.state.orderFlag,
                orderStatus: 2,
                pageIndex: (page - 1),
                pageSize: 5,
            }, {}, true);
            if (json.success) {
                this.setState({data: json.data.orders}, () => {startFetch(json.data.orders, pageLimit); });
            } else {
                Toast.fail(json.message, 1);
            }
        } catch (err) {
            abortFetch(); // manually stop the refresh or pagination if it encounters network error
            Log(err);
        }
    }
    // 获取待收货订单数据
    private onFetch4 = async ( page = 1, startFetch, abortFetch) => {
        // console.log('zhaoxincheng>>获取待收货订单数据');
        // alert('zhaoxincheng>>>this.state.orderFlag:' + this.state.orderFlag);
        // alert('zhaoxincheng>>>this.state.orderStatus:' + this.state.orderStatus);
        try {
            const pageLimit = 5;
            // 获取订单数据
            const json = await getAppJSON(Config.ORDER_LIST, {
                orderFlag: this.state.orderFlag,
                orderStatus: 3,
                pageIndex: (page - 1),
                pageSize: 5,
            }, {}, true);
            // console.log('zhaoxincheng>>>', json);
            if (json.success) {
                this.setState({data: json.data.orders}, () => {startFetch(json.data.orders, pageLimit); });
            } else {
                Toast.fail(json.message, 1);
            }
        } catch (err) {
            abortFetch(); // manually stop the refresh or pagination if it encounters network error
            Log(err);
        }
    }
    // 获取待评价订单数据
    private onFetch5 = async ( page = 1, startFetch, abortFetch) => {
        // console.log('zhaoxincheng>>获取待评价订单数据');
        // alert('zhaoxincheng>>>this.state.orderFlag:' + this.state.orderFlag);
        // alert('zhaoxincheng>>>this.state.orderStatus:' + this.state.orderStatus);
        try {
            const pageLimit = 5;
            // 获取订单数据
            const json = await getAppJSON(Config.ORDER_LIST, {
                orderFlag: this.state.orderFlag,
                orderStatus: 4,
                pageIndex: (page - 1),
                pageSize: 5,
            }, {}, true);
            if (json.success) {
                this.setState({data: json.data.orders}, () => {startFetch(json.data.orders, pageLimit); });
            } else {
                Toast.fail(json.message, 1);
            }
        } catch (err) {
            abortFetch(); // manually stop the refresh or pagination if it encounters network error
            Log(err);
        }
    }

    // 点击了头部的切换按钮
    private  toggleMenu() {
       this.setState({
           showTopMenu: !this.state.showTopMenu,
       });
    }
    // 点击了menu按钮
    private  clickMenu(index) {
        if (this.state.topTitle === topMenus[index]) {
            // 如果当前显示的title等于点击的title,就直接隐藏菜单
            this.setState({
                showTopMenu: false,
            });
        } else {
            this.setState({
                orderFlag: index,
                topTitle: topMenus[index],
                showTopMenu: false,
            }, ( ) => {
                switch (this.state.orderStatus) {
                    case 0:
                        this.listView0.onRefresh();
                        break;
                    case 1:
                        this.listView1.onRefresh();
                        break;
                    case 2:
                        this.listView2.onRefresh();
                        break;
                    case 3:
                        this.listView3.onRefresh();
                        break;
                    case 4:
                        this.listView4.onRefresh();
                        break;
                    default:
                        break;
                }
             });
        }
     }
}

const styles = StyleSheet.create({
    topRightIcon: {
        backgroundColor: 'red',
        position: 'absolute',
        width: 5,
        height: 5,
        borderRadius: 2.5,
        right: 10,
        top: 2,
    },
    bottomLine: {
        width,
        height: 1,
        backgroundColor: '#d5d5d5',
      },
      renderStyle: {
        width,
        height: 130,
        backgroundColor: 'white',
        position: 'absolute',
        zIndex: 2,
        top: Platform.OS === 'ios' ? (isiPhoneX ? (45 + 40) : (45 + 20)) : 45,
        left: 0,
      },
});

export default OrderList;
