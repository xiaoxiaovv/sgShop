import {
    View,
    Text,
    ScrollView,
    Button,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    NativeModules,
    Platform,
} from 'react-native';
import * as React from 'react';
import {Toast, Grid} from 'antd-mobile';
import {INavigation} from '../../interface/index';
import axios from 'axios';
import Config from 'react-native-config';
import Header from '../../components/Header';
import ScrollTableView from 'react-native-scrollable-tab-view';
import Newempty from './Newempty';
import {createAction} from '../../utils';

interface IMessageDetailState {
    loading: boolean;
    data: [
        { name: '订单消息', code: 0, image: {}, url: 'orderMsg' },
        { name: '平台消息', code: 0, image: {}, url: 'platformMsg' },
        { name: '会员动态', code: 0, image: {}, url: 'memberMsg' },
        { name: '社区动态', code: 0, image: {}, url: 'communityMsg' }
        ];
    error: object;
    refreshing: boolean;
    users: object;
    msgContent: string;
    msgTime: string;
    chatList: any[];
    showDefaultFlag: boolean;
}

class MessageDetail extends React.Component<INavigation, IMessageDetailState> {
    // 这个页面分为上下两个模块， 上面的4个item都会跳转不同的页面
    // 下面的为客服聊天记录部分，后面看看小能怎么嵌入

    // http://m.ehaier.com/v3/mstore/sg/messageCenter.html?messageType=3&page=1&size=10
    //
    // messageType: 0      消息中心的接口
    //
    // messageType: 1       订单消息
    //
    // messageType: 2       会员动态消息
    //
    // messageType: 3       平台消息
    //
    // messageType: 4       社区消息
    //
    //
    // 1. 消息类型为1的时候跳顺逛帮助；
    // 2. 2的时候跳我的营收；
    // 3. 3和51跳我的详情；
    // 4. 4跳微学堂；
    // 5. 5订单列表；
    // 6. 1有relationid社区话题详情，无跳金币纪录；
    //    2跳话题详情；
    //    3有relationid微学堂话题详情，无跳金币纪录；
    //    4我的粉丝页面；
    //    0跳金币纪录；
    // -3 跳商品评价页面；
    // -4 跳订单追踪；
    // -5 跳退换货追踪页面；
    // -6 订单列表；
    // -11or-12跳我的优惠券；
    // -12、or-15、or-21我的营收；
    // -14跳钻石明细；
    constructor(props) {

        super(props);

        this.state = {
            loading: false,
            // 最上面四个按钮数据
            data: [
                {
                    name: '订单消息',
                    code: 0,
                    image: {uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/ic_messageOrder.png'},
                    url: 'orderMsg'
                },
                {
                    name: '平台消息',
                    code: 0,
                    image: {uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/ic_messageMessage.png'},
                    url: 'platformMsg'
                },
                {
                    name: '会员动态',
                    code: 0,
                    image: {uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/ic_messsageMember.png'},
                    url: 'memberMsg'
                },
                {
                    name: '社区动态',
                    code: 0,
                    image: {uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/ic_messsageCommunity.png'},
                    url: 'communityMsg'
                },
            ],
            error: null,
            refreshing: false,
            users: [],
            msgContent: '',
            msgTime: '',
            chatList: [],   // 消息列表
            showDefaultFlag: false,  // 默认的平台客服是否显示
        };
    }

    public componentDidMount() {
        // 获取最上面四个消息的数据
        this.makeRemoteRequest();
        // 获取下面的消息数据
        NativeModules.XnengModule.NtalkerMessageList((error, result) => {
            console.log('zhaoxincheng>>>', result);
            if (result === 0) {
                // 如果消息列表数据为0,显示默认的平台客服
                this.setState({
                    showDefaultFlag: true,
                    msgContent: '点击联系顺逛官方在线客服',
                });
            } else {
                // 消息列表有数据
                const chatListData = Platform.OS === 'ios' ? result : JSON.parse(result);
                console.log(chatListData);
                for (let i = 0; i < chatListData.length; i++) {
                    if (chatListData[i].settingid === 'hg_1000_1508927913371') {
                        // 移除第i个元素,stt是删除第i个元素后的数组
                        const stt = chatListData.splice(i, 1);
                        console.log(chatListData);
                        // 向chatList开头添加一个元素
                        chatListData.unshift(stt[0]);
                        console.log(chatListData);
                        break;
                    }
                }
                console.log(chatListData);
                const chatListSt = chatListData;
                if (chatListSt[0].settingid !== 'hg_1000_1508927913371') {
                    this.setState({
                        showDefaultFlag: true,
                    });
                } else {
                    this.setState({
                        showDefaultFlag: false,
                    });
                }
                this.setState({
                    chatList: chatListData,
                });

                // 旧逻辑
                let lastcontent = '';
                let lasttime = '';
                // 消息列表  yl
                if (Platform.OS === 'android') {
                    result = JSON.parse(result);
                }
                if (result && result.length) {
                    for (let k = 0; k < result.length; k++) {
                        console.log(k);
                        if (result[k].settingid === 'hg_1000_1508927913371') { // 平台消息
                            lastcontent =  result[k].content;
                            lasttime = this.lasttest(result[k].msgtime);
                        }
                    }
                }
                if (lastcontent.length > 12) {
                    lastcontent = lastcontent.substring(0, 12) + '...';
                }
                this.setState({
                    msgContent: lastcontent,
                    msgTime: lasttime,
                });
            }
        });
    }
    // 获取最上面四个消息的数据
    public makeRemoteRequest = () => {
        const urlUpdate = Config.API_URL + Config.MESSAGEGET;
        this.setState({loading: true});
        axios(urlUpdate,
            {
                params: {
                    messageType: 0,
                },
            },
        ).then(res => res.data)
            .then(res => {
                if (res.success) {
                    this.state.data[0].code = res.data.orderNum > 99 ? 99 : res.data.orderNum;
                    this.state.data[1].code = res.data.platformNum > 99 ? 99 : res.data.platformNum;
                    this.state.data[2].code = res.data.memberNum > 99 ? 99 : res.data.memberNum;
                    this.state.data[3].code = res.data.communityNum > 99 ? 99 : res.data.communityNum;
                    this.setState({
                        data: this.state.data,
                        loading: false,
                    });
                } else {
                    this.setState({loading: false});
                    // alert(res.message);
                }
            })
            .catch(error => {
                this.setState({error, loading: false});
            });
    }
    // 弹出客服界面
    public goToKeFu = async (settingid) => {
        // 小能客服
        const chatparams = {
            goods_id: '-1', // 消息页等其他页面商品id固定传-1  单品页传商品id正常传  订单传商品id正常传
            clientGoods_type: '1', // 传1
            // 0:客服端不展示商品信息;1：客服端以商品ID方式获取商品信息(goods_id:商品ID，clientGoods_type = 1时goods_id参数传值不能为空)
            appGoods_type: '0', // 单品页传1  订单传3 并吧三下面的四个参数传递过来
        };
        const command = [
            settingid,
            '客服', // yl
            chatparams,
        ];
        NativeModules.XnengModule.NTalkerStartChat(command)
            .then(result => {
                Log('调起小能客服成功');
            })
            .catch((errorCode, domain, error) => {
                Log('调起小能客服失败');
            });
    }
    // 渲染加载指示器
    public lastRender() {
        const {loadingBaby} = styles;
        return (
            <View style={loadingBaby}>
            {/* 加载指示器 */}
                <ActivityIndicator size='large'/>
            </View>
        );
    }
    // 渲染下面的Cell
    public testRender() {
        // 商家客服Cell
        const itemCell = ({item, index}) => {
            // console.log('zhaoxincheng>>>', index);
            // console.log('zhaoxincheng>>>', item);
            let uri;
            let username;
            if (item.settingid === 'hg_1000_1508927913371') {
                uri = 'http://cdn09.ehaier.com/shunguang/H5/www/img/ic_service.png';
                username = '顺逛客服';
            } else {
                uri = item.kefuIcon;
                username = item.username.length > 9 ? item.username.substring(0, 9) + '...' : item.username;
            }
            return (
                <TouchableOpacity onPress={() => {
                    this.goToKeFu(item.settingid);
                }}>
                    <View style={styles.list}>
                        <View style={styles.subItem}>
                            <View style={styles.leftp}>
                                <Image style={styles.newImg}
                                    source={{uri}}></Image>
                            </View>
                            <View style={styles.rightp}>
                                <View style={styles.topp}>
                                    <Text style={styles.newtitle}>{username}</Text>
                                    {item.settingid === 'hg_1000_1508927913371' &&
                                    <View style={styles.wrapLogo}>
                                        <Text style={styles.logo}>平台</Text>
                                    </View>
                                    }
                                </View>
                                <Text style={styles.botdes}>{item.content.length > 12 ? item.content.substring(0, 12) + '...' : item.content}</Text>
                            </View>
                            <Text style={styles.timelogo}>{this.lasttest(item.msgtime)}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        };
        const itemCells = [];
        if (this.state.chatList.length > 0) {
            this.state.chatList.forEach((item, index) => {
                if (item) {
                    const cell = itemCell({item, index});
                    itemCells.push(cell);
                }
            });
        }
        return (
            <View>
                {/* 平台客服 */}
                {
                    this.state.showDefaultFlag &&
                    <TouchableOpacity onPress={() => {
                        this.goToKeFu('hg_1000_1508927913371');
                    }}>
                        <View style={styles.list}>
                            <View style={styles.subItem}>
                                <View style={styles.leftp}>
                                    <Image style={styles.newImg}
                                        source={{uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/ic_service.png'}}></Image>
                                </View>
                                <View style={styles.rightp}>
                                    <View style={styles.topp}>
                                        <Text style={styles.newtitle}>顺逛客服</Text>
                                        <View style={styles.wrapLogo}>
                                            <Text style={styles.logo}>官方</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.botdes}>{this.state.msgContent}</Text>
                                </View>
                                <Text style={styles.timelogo}>{this.state.msgTime}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                }
                {/* 商家客服 */}
                {itemCells}
            </View>
        );
    }

    public render() {
        return (
            <View style={styles.wrapper}>
                {/* 导航部分 */}
                <Header
                    {...this.props}
                    title={'消息'}
                    goBack={() => {
                        this.props.navigation.goBack();
                        this.props.navigation.dispatch(createAction('mine/fetchMsgCenter')());
                        }}
                />
                <ScrollView style={styles.scrollViewStyle}>
                    {/* 最上面的四个消息按钮 */}
                    <Grid
                        data={this.state.data}
                        hasLine={false}
                        itemStyle={styles.gridView}
                        renderItem={item => (
                            <TouchableOpacity onPress={() => this.props.navigation.navigate(item.url, {
                                callBack: () => {
                                    this.makeRemoteRequest();
                                },
                            })}>
                                <View style={[styles.itemContainer, {backgroundColor: '#ffffff'}]}>
                                    <Image style={styles.img} source={item.image}></Image>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    {
                                        item.code > 0 ? <View style={styles.numStyle}>
                                            <Text style={styles.numText}>{item.code}</Text>
                                        </View> : null
                                    }
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                    {/* 渲染下面的列表部分 */}
                    {this.state.loading ? this.lastRender() : this.testRender()}
                </ScrollView>
            </View>
        );
    }
    public lasttest(value) {
        // const date = new Date(parseInt(timestamp));
        // const hours = date.getHours();
        // const minutes = "0" + date.getMinutes();
        // const formattedTime = hours + ':' + minutes.substr(-2);
        // return formattedTime;

        // 今天显示时间段    之前显示年月日 yl
        value = Number(value);
        const chatyear = new Date(value).getFullYear();
        const chatmonth = new Date(value).getMonth();
        const chatday = new Date(value).getDate();
        const nowyear = new Date().getFullYear();
        const nowmonth = new Date().getMonth();
        const nowdate = new Date().getDate();
        if (chatyear >= nowyear && chatmonth >= nowmonth && chatday >= nowdate) {
            value = new Date(value).getHours() + ':' + (new Date(value).getMinutes() > 9 ? new Date(value).getMinutes() : ('0' + new Date(value).getMinutes()));
        } else {
            if (value == null || value === '') {
                value = '';
            } else {
                value = chatyear + '年' + (chatmonth + 1) + '月' + chatday + '日';
            }
        }
        return value;
    }
}

const styles = StyleSheet.create({
    numStyle: {
        position: 'absolute',
        height: 20,
        width: 20,
        right: 3,
        top: 0,
        backgroundColor: 'red',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    numText: {
        color: '#fff',
        fontSize: 10,
    },
    wrapper: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    scrollViewStyle: {
        marginTop: 6,
    },
    gridView: {
        height: 110,
        backgroundColor: '#fff',
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    list: {
        flex: 1,
        marginTop: 12,
    },
    subItem: {
        backgroundColor: '#fff',
        marginLeft: 10,
        marginRight: 10,
        padding: 12,
        borderRadius: 6,
        flexDirection: 'row',
        marginBottom: 8,
    },
    lpart: {
        flex: 6,
    },
    topp: {
        flexDirection: 'row',
    },
    botdes: {
        marginTop: 16,
    },
    leftp: {},
    rightp: {
        marginLeft: 14,
        marginTop: 4,
    },
    logo: {
        color: '#fff',
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 4,
        paddingRight: 4,
        fontSize: 12,
    },
    timelogo: {
        position: 'absolute',
        top: 14,
        right: 12,
    },
    wrapLogo: {
        backgroundColor: 'red',
        borderRadius: 10,
        marginLeft: 8,
    },
    newtitle: {
        fontSize: 16,
    },
    rpart: {
        flex: 2,
        justifyContent: 'flex-end',
    },
    ltitle: {
        color: '#333',
        fontSize: 16,
        marginBottom: 10,
    },
    border: {
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
    },
    lcontent: {
        color: '#32BEFF',
        fontSize: 14,
        paddingTop: 10,
    },
    img: {
        width: 46,
        height: 46,
        marginBottom: 16,
    },
    newImg: {
        width: 56,
        height: 56,
    },
    itemContainer: {
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 5,
        padding: 10,
        height: 80,
    },
    itemName: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
    },
    itemCode: {
        fontWeight: '600',
        fontSize: 12,
        color: '#fff',
    },
    loadingBaby: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default MessageDetail;
