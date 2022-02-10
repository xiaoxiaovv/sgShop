import * as React from 'react';
import {
    StyleSheet, View, Text, ImageBackground, Dimensions, Image,
    ScrollView, TouchableOpacity, InteractionManager, Platform, NativeModules, DeviceEventEmitter
} from 'react-native';
import {Button as AntButton, Toast} from 'antd-mobile';
import CustomButton from 'rn-custom-btn1';
import CustomGrid from '../../components/Mine/CustomGird';
import {iPhoneXMarginTopStyle, width, height} from '../../utils';
import { goToSQZBS } from '../../utils/tools';
import {ICustomContain} from '../../interface/index';
import {postAppJSON, getAppJSON, postAppForm} from '../../netWork';
import {connect} from 'react-redux';
import {createAction} from '../../utils/index';
import Config from 'react-native-config';
import EStyleSheet from 'react-native-extended-stylesheet';
import {MessageWithBadge} from '../../components/NewMessageWithBadge';
import DataSummary from './Store/DataSummary';
import {isiPhoneX} from "../../utils";
import CommonWebview from '../webview/CommonWebview';
import {Font, Color} from 'consts';

import URL from './../../config/url.js';
@connect(({mine, users: {userName: user, mid: storeId, unread, gameId, avatarImageFileId}, address}) => ({
    mine,
    user,
    storeId,
    unread,
    gameId,
    avatarImageFileId,
    ...address,
}))
class Detail extends React.Component<ICustomContain & { mine: any, user: '', storeId: '', unread: number, cityId: '' }> {
    public listener: any;
    constructor(props) {
        super(props);
    }

    public componentDidMount() {
        // 刷新界面请求数据
        this.refreshCurrentView();
        this.listener = DeviceEventEmitter.addListener('update_mine_data', (e) => {
            this.refreshCurrentView();
        });
    }

    public componentWillUnmount() {
        this.listener.remove();
    }

    public render(): JSX.Element {
        const {flagNum, myManageData, myJewelData, orderCountData, wdHostData, applyName, applyStatus, realNameAuthOpacity} = this.props.mine;
        // 我的钱包模块界面数据
        const walletData = IS_NOTNIL(myManageData) ? this.joinWalletData(myManageData, myJewelData) : null;
        const shopData = (IS_NOTNIL(myManageData) && IS_NOTNIL(wdHostData)) ? this.joinShopData(myManageData, wdHostData, applyName, applyStatus, realNameAuthOpacity) : null;
        const toolsData = IS_NOTNIL(myManageData) ? this.joinToolsData(myManageData) : null;

        // 安卓消息图标适配
        const iconMsg = Platform.OS === 'android' ? '{width: 22, height: 22}' : '{width: 80, height: 80}';
        return (
            IS_NOTNIL(myManageData) &&
            <ScrollView>
                {this.renderHeader(myManageData)}
                {/* 全部订单模块 */}
                <CustomGrid
                    tipData={orderCountData}
                    data={orderData}
                    columnSize={orderData.child.length}
                    hasLine={false}
                    headerClick={() => {
                        this.props.navigation.navigate('OrderList', {
                            orderFlag: 0, orderStatus: 0, callBack: () => {
                                // 当从订单列表界面返回时调用刷新Mine界面的订单数量数据
                                this.props.dispatch(createAction('mine/fetchOrderCountData')());
                            },
                        });
                    }}
                    onClick={(element, index) => {
                        this.props.navigation.navigate('OrderList', {
                            orderFlag: 1, orderStatus: index + 1, callBack: () => {
                                // 当从订单列表界面返回时调用刷新Mine界面的订单数量数据
                                this.props.dispatch(createAction('mine/fetchOrderCountData')());
                            },
                        });
                    }}
                />
                {/* 我的钱包模块 */}
                {
                    IS_NOTNIL(walletData) &&
                    <CustomGrid
                        data={walletData} columnSize={4} hasLine={false}
                        headerClick={() => {
                            this.props.navigation.navigate('Mywallet');
                        }}
                        onClick={(elm, idx) => this.routing(elm)}
                    />
                }
                {/* 我的店铺模块 */}
                {
                    IS_NOTNIL(shopData) &&
                    <CustomGrid
                        data={shopData} columnSize={4}
                        hasLine={false}
                        headerClick={() => {
                            this.myStore();
                        }}
                        onClick={(elm, idx) => this.routing(elm)}
                    />
                }
                {/* 常用功能模块 */}
                {
                    IS_NOTNIL(toolsData) &&
                    <CustomGrid
                        data={toolsData} columnSize={4} hasLine={false}
                        onClick={(elm, idx) => this.routing(elm)}
                    />
                }
            </ScrollView>
        );
    }

    renderHeader=(myManageData)=>{
        return(
            <ImageBackground source={require('../../images/personalbg.png')} style={styles.header}>
                {/* 导航部分 */}
                <View style={[styles.headerContainer, iPhoneXMarginTopStyle]}>
                    {/* 跳转到账户设置界面 */}
                    <CustomButton
                        style={styles.headerButton}
                        imageStyle={{width: 22, height: 22, resizeMode: 'contain'}}
                        image={require('../../images/mineSet.png') }
                        onPress={() => {
                            this.props.navigation.navigate('AccountSetUp');
                        }}
                    />
                    {/* 右边 */}
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <CustomButton
                            style={styles.headerButton}
                            imageStyle={{width: 22, height: 22, resizeMode: 'contain'}}
                            image={require('../../images/mineKeFu.png')}
                            onPress={() => {
                                // 客服按钮
                                this.goToKeFu();
                            }}
                        />
                        <MessageWithBadge
                            unread={this.props.unread}
                            badgeContainStyle={{top: 4, right: -7}}
                            navigation={this.props.navigation}
                            isWhite={true}
                            hidingText={true}
                        />
                    </View>
                </View>
                {/* 中间内容部分 */}
                <View style={styles.headerCenterContainer}>
                    <View style={styles.avatarTextContainer}>
                        {/* 头像和等级 */}
                        <View style={{padding: 4, borderRadius: 44, backgroundColor: '#5D9DFF'}}>
                            <Image source={{uri: cutImgUrl(this.props.avatarImageFileId, 100, 100, true)}} style={styles.avatar}/>
                        </View>
                        <View style={styles.centerTextContainer}>
                            {/* 名字 */}
                            <Text style={styles.userName} numberOfLines={1}>
                                {myManageData.isHost === 1 ? myManageData.storeName : this.props.user}
                            </Text>
                            {/* 等级 */}
                            {myManageData.isHost === 1 &&
                            <View style={styles.levelWrapper}>
                                <Text style={styles.level}>
                                    {`等级: ${levelArr[myManageData.level - 1]}`}
                                </Text>
                            </View>
                            }
                            {myManageData.isHost === 1 &&
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    // 跳转到H5的任务分享
                                    this.props.navigation.navigate('MissionShare', {
                                        callBack: () => {
                                            // 当从金币界面返回时调用刷新Mine界面的金币数据
                                            this.props.dispatch(createAction('mine/fetchManageData')());
                                        },
                                    });
                                }}
                            >
                                <View style={styles.todayWorkerContainer}>
                                    <Image
                                        style={styles.todayWorkerImg}
                                        source={require('../../images/today_worker.png')}
                                    />
                                    <Text style={styles.todayWorkerText}>今日任务</Text>
                                </View>
                            </TouchableOpacity>
                            }
                        </View>
                    </View>
                    {/* 进入店铺按钮 */}
                    {myManageData.isHost === 1 &&
                    <TouchableOpacity onPress={() => {this.myStore();}}>
                        <View style={styles.goStoreContainer}>
                            <Text style={styles.goStoreText} numberOfLines={1}>进入</Text>
                            <Text style={styles.goStoreText} numberOfLines={1}>店铺</Text>
                        </View>
                    </TouchableOpacity>
                    }
                </View>
            </ImageBackground>
        );
    }

    // 刷新当前界面
    private refreshCurrentView = () => {
        this.props.dispatch(createAction('mine/fetchMsgCenter')());
        this.props.dispatch(createAction('mine/fetchManageData')());
        this.props.dispatch(createAction('mine/fetchJewelData')());
        this.props.dispatch(createAction('mine/fetchOrderCountData')());
        this.props.dispatch(createAction('mine/fetchWdHostData')());
        this.props.dispatch(createAction('mine/fetchFindLatestGame')());
        this.props.dispatch(createAction('mine/fetchRealNameAuthStatus')());
        this.props.dispatch(createAction('mine/fetchApplyStatus')());
    };
    // 去店铺
    private myStore = () => {
        const {myManageData} = this.props.mine;
        if (myManageData.isHost === 1) { // 如果是微店主
            this.props.navigation.navigate('StoreHome', {storeId: this.props.storeId});
        }
    };

    private routing(elm): void {
        const {flagNum, myManageData, orderCountData, wdHostData, applyName, applyStatus, gameId} = this.props.mine;
        const elmTxt: string = elm.text;
        if (!elmTxt) {
            return;
        }
        switch (elmTxt) {
            // 我的钱包模块
            case '优惠券':
                this.props.navigation.navigate('MyCoupon', {
                    callBack: () => {
                        // 当从优惠卷界面返回时调用刷新Mine界面的优惠卷数据
                        this.props.dispatch(createAction('mine/fetchManageData')());
                    }
                });
                break;
            case '金币':
                this.props.navigation.navigate('MyGold', {
                    callBack: () => {
                        // 当从金币界面返回时调用刷新Mine界面的金币数据
                        this.props.dispatch(createAction('mine/fetchManageData')());
                    }
                });
                break;
            case '钻石':
                this.props.navigation.navigate('WalletDiamonds');
                break;
            case '顺逛白条':
                this.toApplyForWhite();
                break;
            // 我的店铺模块
            case '我要开店':
                this.goSetUpShop();
                break;
            case '我的营收':
                this.props.navigation.navigate('ShopRevenue');
                break;
            case '提现设置':
                this.props.navigation.navigate('CustomWebView', {
                    customurl: `${URL.H5_HOST}bankCard`, flag: true, headerTitle: '提现管理',
                    callBack: () => {
                        this.props.dispatch(createAction('mine/fetchManageData')());
                    },
                });
                break;
            case '店铺订单':
                this.props.navigation.navigate('OrderList', {
                    orderFlag: 0, orderStatus: 0, topTitle: '全部订单', callBack: () => {
                        // 当从订单列表界面返回时调用刷新Mine界面的订单数量数据
                        this.props.dispatch(createAction('mine/fetchOrderCountData')());
                    }
                });
                break;
            case '合伙人':
                this.props.navigation.navigate('TeamSupervise');
                break;
            case '社群争霸赛':
                goToSQZBS();
                break;
            case '店铺管理':
                this.props.navigation.navigate('Store', {
                    callBack: () => {
                        this.props.dispatch(createAction('mine/fetchManageData')());
                    },
                });
                break;
            case '微店课堂':
                this.props.navigation.navigate('ShunguangSchool');
                break;
            case '数据统计':
                this.props.navigation.navigate('CustomWebView', {
                    customurl: `${URL.H5_HOST}storeTeamOwner`,
                    flag: true,
                });
                // this.props.navigation.navigate('DataSummary');
                break;
            case '我的认证':
                this.props.navigation.navigate('Authentication');
                break;
            case '会员中心':
                this.props.navigation.navigate('CustomWebView', {
                    customurl: `${URL.H5_HOST}vip/${gameId}/`,
                    flag: true,
                    headerTitle: '会员中心',
                    callBack: () => {
                        this.props.dispatch(createAction('mine/fetchApplyStatus')());
                    }
                });
                break;
            // 常用功能模块
            case '我的投资':
                this.goToManageMoney(1);
                break;
            case '地址管理':
                this.props.navigation.navigate('Address', {from: 'zhsz'});
                break;
            case '我的收藏':
                this.props.navigation.navigate('MyCollect', {unread: this.props.unread});
                break;
            case '我的社区':
                global.sceneIndex = 2; // 把全局参数sceneIndex设置为2,代表进入社区界面
                this.props.navigation.navigate('Community');
                break;
            case '我的金融':
                this.goToManageMoney(0);
                break;
            // case '我的众筹':
            //     // alert('我的众筹');
            //     break;
            case '领券中心':
                this.props.navigation.navigate('CouponCenter');
                break;
            case '金币游戏':
                this.props.navigation.navigate('CustomWebView', {
                    customurl: `${URL.H5_HOST}goldgame/${gameId}`,
                    flag: true,
                    headerTitle: '金币游戏',
                    callBack: () => {
                        this.props.dispatch(createAction('mine/fetchManageData')());
                    },
                });
                break;
            case '充值缴费':
                this.goToCloudPay();
                break;
            case '顺逛学院':
                this.props.navigation.navigate('ClassRoom');
                break;
            case '我的预约':
                this.props.navigation.navigate('MyReserve');
                break;
            default:
                break;
        }
    }

    // 去充值缴费界面
    private goToCloudPay = () => {
        const systemType = Platform.OS === 'ios' ? 'ios' : 'android';
        const userToken = dvaStore.getState().users.userToken;
        const cityId = this.props.cityId;
        // 打开云缴费界面
        const LivingUrl = URL.LIVING + '?flag=' + userToken + '&systemType=' + systemType + '&cityId=' + cityId;
        NativeModules.ToolsModule.presentH5View([LivingUrl, '生活缴费']);
    }

    // 我的投资和我的金融按钮click
    private goToManageMoney = (isWdHost) => {
        if (isWdHost === 1) { // 开过店 1
            this.props.navigation.navigate('MyInvestment', {
                frontPage: 'Mine',
            });
        } else if (isWdHost === 0) { // 普通用户 没开过店 0
            this.goSetUpShop();
        } else {
            // 去登录页面
            this.props.navigation.navigate('Login');
        }
    }

    // 顺逛白条click
    private toApplyForWhite = async () => {
        if (!dvaStore.getState().users.accessToken) {
            Toast.fail('您的当前帐号暂时无法访问此服务,请使用关联手机号登录', 2);
            return;
        }
        const userId = dvaStore.getState().users.ucId;
        const token = dvaStore.getState().users.accessToken;
        const res = await postAppJSON(Config.WHITE_SHOWS_QUERY_STATUS, {userId, token});
        if (res.success) {
            if (res.data.applyStatus === 2 ||
                res.data.applyStatus === '2' ||
                res.data.applyStatus === '3' ||
                res.data.applyStatus === 3) {
                // 跳转到applyForWhite页面
                this.props.navigation.navigate('BaiTiao');
            } else {
                // 申请中直接打开消费金融
                const backUrl = `${Config.API_URL}index.html`;
                const resData = await postAppForm(
                    `${Config.WHITE_SHOWS_APPLY}?backUrl=${backUrl}&token=${token}&userId=${userId}`,
                    {backUrl, userId, token},
                );
                if (resData.success) {
                    // 打开顺逛白条H5
                    this.props.navigation.navigate('CustomWebView', {
                        customurl: resData.data.redirectUrl,
                        headerTitle: '顺逛白条',
                        flag: true,
                    });
                }
                if (resData.errorCode === '-100') {
                    // 去登录页面
                    this.props.navigation.navigate('Login');
                }
            }
        }
        if (res.errorCode === 100) {
            this.props.navigation.navigate('Login');
        }
    }
    // 客服帮助click
    private goToKeFu = async () => {
        // 小能客服
        const chatparams = {
            goods_id: '-1', // 消息页等其他页面商品id固定传-1  单品页传商品id正常传  订单传商品id正常传
            clientGoods_type: '1', // 传1
            // 0:客服端不展示商品信息;1：客服端以商品ID方式获取商品信息(goods_id:商品ID，clientGoods_type = 1时goods_id参数传值不能为空)
            appGoods_type: '0', // 单品页传1  订单传3 并吧三下面的四个参数传递过来
        };
        const command = [
            'hg_1000_1508927913371',
            '普通客服组',
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
    // 我要开店click
    private goSetUpShop = async () => {
        try {
            const json = await getAppJSON(Config.WD_APPLY);
            if (json.success) {
                if (json.data) { // 绑定过手机
                    // 有手机号,去完善信息页面
                    // alert('去完善信息页面');
                    // this.props.navigation.navigate('OpenStore');
                    this.props.navigation.navigate('NewRegister', {step: 2, hiddenSetPassword: true});
                } else { // 没绑定过手机
                    // 没有有手机号,去绑定手机号  hasHistory
                    // alert('去绑定手机号');
                    this.props.navigation.navigate('BindMobile', {hasHistory: 1});
                }
            } else { // 接口异常
                Toast.fail('服务端错误', 1);
            }
        } catch (err) {
            alert('网络错误');
        }
    }
    // 拼装我的钱包模块数据
    private joinWalletData = (myManageData, myJewelData) => {
        const tempArr = [];
        const card0 = {
            title: {
                text: (IS_NOTNIL(myManageData.coupon) ? myManageData.coupon : 0) + '张',
                style: styles.CouponBlue,
            },
            text: '优惠券',
        };
        const card1 = {
            title: {
                text: IS_NOTNIL(myManageData.gold) ? myManageData.gold : 0,
                style: styles.CoinRed,
            },
            text: '金币',
        };
        let usableDiamond = '0';
        if (IS_NOTNIL(myJewelData) && IS_NOTNIL(myJewelData.usableDiamond)) {
            if (myJewelData.usableDiamond > 9999) {
                usableDiamond = '9999+';
            } else {
                usableDiamond = myJewelData.usableDiamond;
            }
        } else {
            usableDiamond = '0';
        }
        const card2 = {
            title: {
                text: usableDiamond,
                style: styles.CardPurple,
            },
            text: '钻石',
        };
        const card3 = {
            icon: <Image source={require('../../images/baitiao_mine.png')}
                         style={{width: 20, height: 20}}/>,
            text: '顺逛白条',
        };
        tempArr.push(card0);
        if (myManageData.isHost === 1) {
            tempArr.push(card1);
        }
        tempArr.push(card2);
        tempArr.push(card3);
        return {
            header: {
                icon: require('../../images/wdqb.png'),
                title: '我的钱包',
                buttonImage: require('../../images/goorder.png'),
                buttonTitle: '查看全部',
            },
            child: tempArr,
        };
    };
    // 拼装我的店铺模块数据
    private joinShopData = (myManageData, wdHostData, applyName, applyStatus, realNameAuthOpacity) => {
        const tempArr = [];
        const card0 = {
            icon: <Image source={require('../../images/open_store.png')} style={styles.iconStyle}/>,
            text: '我要开店',
        };
        const card1 = {
            icon: <Image source={require('../../images/wdys.png')} style={styles.iconStyle}/>,
            text: '我的营收',
        };
        const card2 = {
            icon: <Image source={myManageData.card === 0 ? require('../../images/Notcard.png') : require('../../images/card.png')} style={styles.iconStyle}/>,
            text: '提现设置',
        };
        const card3 = {
            icon: <Image source={require('../../images/gfrz.png')} style={styles.iconStyle}/>,
            text: '我的认证',
        };
        const card4 = {
            icon: <Image source={require('../../images/hhr.png')} style={styles.iconStyle}/>,
            text: '合伙人',
        };
        const card5 = {
            icon: <Image source={require('../../images/dpgl.png')} style={styles.iconStyle}/>,
            text: '店铺管理',
        };
        // const card5 = {
        //     icon: <Image source={require('../../images/wdkt.png')} style={styles.iconStyle}/>,
        //     text: '微店课堂',
        // };
        const card6 = {
            icon: <Image source={require('../../images/sjtj.png')} style={styles.iconStyle}/>,
            text: '数据统计',
        };
        const card7 = {
            icon: (<View>
                {applyStatus === -2 &&
                <View style={{
                    flexDirection: 'row', position: 'absolute', top: -15,
                    right: -10, backgroundColor: 'red', borderRadius: 5
                }}>
                    <Text numberOfLines={1}
                          style={{color: '#fff', margin: 2, fontSize: 12}}>
                        {'申请' + applyName}
                    </Text>
                </View>
                }
                <Image source={require('../../images/hyjlb.png')}
                       style={[styles.iconStyle, {marginLeft: 15, marginRight: 15}]}/>
            </View>),
            text: '会员中心',
        };
        const card8 = {
            icon: <Image source={require('../../images/sgxt.png')} style={styles.iconStyle}/>,
            text: '顺逛学院',
        };
        myManageData.isHost === 0 ? tempArr.push(card0, card8) : null;
        if (myManageData.isHost === 1) {
            tempArr.push(card1);
            tempArr.push(card2);
            tempArr.push(card3);
            tempArr.push(card4);
            tempArr.push(card5);
            tempArr.push(card6);
        }
        // 是否是o2o用户
        let iso2o;
        if (wdHostData.o2o == null || wdHostData.o2o === true) {
            iso2o = true;
        } else {
            iso2o = false;
        }
        if (myManageData.isHost === 1) {
            tempArr.push(card7, card8);
        }
        return {
            header: {
                icon: require('../../images/wddp.png'),
                title: '我的店铺',
                buttonImage: require('../../images/goorder.png'),
            },
            child: tempArr,
        };
    }

    // 拼装常用功能模块数据
    private joinToolsData = (myManageData) => {
        const tempArr = [];
        const card0 = {
            icon: <Image source={require('../../images/lqzx.png')} style={styles.iconStyle}/>,
            text: '领券中心',
        };
        const card1 = {
            icon: <Image source={require('../../images/czjf.png')} style={styles.iconStyle}/>,
            text: '充值缴费',
        };
        const card2 = {
            icon: <Image source={require('../../images/dzgl.png')} style={styles.iconStyle}/>,
            text: '地址管理',
        };
        const card3 = {
            icon: <Image source={require('../../images/sqzbs.png')} style={styles.iconStyle}/>,
            text: '社群争霸赛',
        };
        const card4 = {
            icon: <Image source={require('../../images/wdgz.png')} style={styles.iconStyle}/>,
            text: '我的收藏',
        };
        const card5 = {
            icon: <Image source={require('../../images/jbyx.png')} style={styles.iconStyle}/>,
            text: '金币游戏',
        };
        const card6 = {
            icon: <Image source={require('../../images/wdyy.png')} style={styles.iconStyle}/>,
            text: '我的预约',
        };
        const card7 = {
            icon: <Image source={require('../../images/wdtz.png')} style={styles.iconStyle}/>,
            text: '我的投资',
        };
        // const card4 = {
        //     icon: <Image source={require('../../images/wdzc.png')} style={styles.iconStyle} />,
        //     text: '我的众筹',
        // };
        // const card7 = {
        //     icon: <Image source={require('../../images/my_community.png')} style={styles.iconStyle}/>,
        //     text: '我的社区',
        // };
        // const card8 = {
        //     icon: <Image source={require('../../images/xsbd.png')} style={styles.iconStyle}/>,
        //     text: '新手必读',
        // };
        // const card10 = {
        //     icon: <Image source={require('../../images/jrlc.png')} style={styles.iconStyle}/>,
        //     text: '我的金融',
        // };
        tempArr.push(card0);
        tempArr.push(card1);
        if (1 || myManageData.isHost === 1) {
            tempArr.push(card2);
        }

        // 隐藏我的众筹
        // if ( myManageData.isHost === 1 ) {
        //     tempArr.push(card4);
        // }
        tempArr.push(card3);
        tempArr.push(card4);
        tempArr.push(card5);
        tempArr.push(card6);

        // iOS Store 上线 隐藏我的投资
        if (URL.IS_STORE && Platform.OS === 'ios') {
            // 是在线上且是iOS,就隐藏投资,什么都不做
        } else {
            tempArr.push(card7);
        }
        // tempArr.push(card9);
        // if (myManageData.isHost === 0) {
        //     tempArr.push(card10);
        // }
        return {
            header: {
                icon: require('../../images/cygn.png'),
                title: '常用功能',
            },
            child: tempArr,
        };
    }
    private haierUniversity = async () => {
        const response = await getAppJSON(Config.GET_learningHaier);
        if (response.data !== -100 || response.data !== '-100') {
            const universityUrl = encodeURI(response.data);
            // alert(response.data);
            this.props.navigation.navigate('AgreementWebview', {url: universityUrl, title: '海尔大学'});
        } else {
            this.props.navigation.navigate('Login');
        }
    }
}

const styles = EStyleSheet.create({
    header: {
        width,
    },
    headerContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerButton: {
        width: '22rem',
        height: '22rem',
        marginLeft: 16,
        marginRight: 25,
    },
    headerCenterContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 4,
        marginBottom: 30,
    },
    avatarTextContainer:{
        flexDirection: 'row',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    centerTextContainer:{
        marginLeft: 20,
        marginRight: 5,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    levelWrapper: {
        backgroundColor: 'rgba(4,123,243,0.26)',
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 6,
        padding: 5,
        height: 21,
    },
    level: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 12,
        lineHeight: 17,
        fontFamily: 'PingFangSC-Medium',
    },
    levelProgress: {
        fontSize: 12,
        lineHeight: 17,
        fontFamily: 'PingFangSC-Regular',
        color: '#fff',
        maxWidth: 180,
    },
    userName: {
        fontSize: 18,
        lineHeight: 25,
        fontFamily: 'PingFangSC-Regular',
        color: '#fff',
        maxWidth: width - 187,
    },
    mineTishiImg: {
        marginLeft: 3,
        marginTop: 5,
        width: '41rem',
        height: '49rem',
        resizeMode: 'contain',
        marginRight: -5,
    },
    todayWorkerContainer:{
        height: 28,
        padding: 10,
        borderRadius: 14,
        backgroundColor: 'rgba(18,110,221,0.48)',
        borderColor: Color.BLUE_5,
        borderWidth: 1,
        marginTop: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    todayWorkerImg: {
        width: 12,
        height: 15,
        resizeMode: 'contain',
    },
    todayWorkerText:{
        fontSize: 14,
        color: Color.WHITE,
        marginLeft: 3,
        fontWeight: 'bold',
    },
    goStoreContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: Color.BLUE_1,
        backgroundColor:'rgba(255,255,255,0.65)',
    },
    goStoreText: {
        fontSize: 12,
        color: Color.BLUE_1,
        fontWeight: 'bold',
        lineHeight: 14,
    },
    GoDianpuImg: {
        width: '17rem',
        height: '17rem',
    },
    Black: {
        color: '#333333',
        fontSize: '16rem',
    },
    CouponBlue: {
        color: '#0FA7FF',
    },
    CoinRed: {
        color: '#FF573D',
    },
    CardPurple: {
        color: '#B63DF2',
    },
    jbyxIcon: {
        width: '30rem',
        height: '18rem',
        marginTop: '6rem',
        marginBottom: '6rem',
        resizeMode: 'contain',
    },
    iconStyle: {
        width: '30rem',
        height: '30rem',
        resizeMode: 'contain',
    },
    topRightIcon: {
        backgroundColor: 'red',
        position: 'absolute',
        width: '10rem',
        height: '10rem',
        borderRadius: 5,
        right: 2,
        top: 2,
    },
});

const levelArr = ['士兵', '班长', '排长', '连长', '营长', '团长', '旅长', '师长', '军长', '司令', '盟主'];

const orderData = {
    header: {
        title: '我的订单',
        buttonImage: require('../../images/goorder.png'),
        buttonTitle: '查看订单',
    },
    child: [{
        icon: <Image source={require('../../images/waitpay.png')}/>,
        text: '待付款',
    },
        {
            icon: <Image source={require('../../images/waitsend.png')}/>,
            text: '待发货',
        },
        {
            icon: <Image source={require('../../images/waitget.png')}/>,
            text: '待收货',
        },
        {
            icon: <Image source={require('../../images/waitjudge.png')}/>,
            text: '待评价',
        },
        {
            icon: <Image source={require('../../images/fixicon.png')}/>,
            text: '售后/维修',
        }],
};

export default Detail;
