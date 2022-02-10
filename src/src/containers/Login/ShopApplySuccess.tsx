import * as React from 'react';
import { View, Image, Text, TouchableOpacity, Modal, ImageBackground } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { getAppJSON } from '../../netWork';
import { ICustomContain } from '../../interface';
import Config from 'react-native-config';
import { NavigationActions } from 'react-navigation';
import { width, height, naviBarHeight, createAction, connect } from '../../utils';

const scrrenHeight = height - naviBarHeight;
interface IState {
    memberCount: number;
    authenticationState: boolean;
    giftBag: boolean;
}
@connect()
export default class ShopApplySuccess extends React.Component<ICustomContain, IState> {
    private static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerBackTitle: null,
        };
    }
    constructor(props) {
        super(props);
        this.state = {
            memberCount: 888888,
            authenticationState: false,
            giftBag: true,
        };
    }
    public render() {
        return <View style={styles.container}>
            <Image style={{ width: scrrenHeight * 0.2, height: scrrenHeight * 0.2 }}
                source={require('../../images/shopapplysuccess.png')} />
            <Text style={{ fontSize: 20, color: '#333', marginVertical: scrrenHeight * 0.03 }}>恭喜开店成功!</Text>
            <Text style={{ width: 300, color: '#666' }}>您是第
            <Text style={{ color: 'red' }}>{this.state.memberCount}</Text>位进入顺逛的小主。请联系你的推荐人，开启你的顺逛之旅!</Text>
            <Image style={{ width: 88, height: scrrenHeight * 0.17, marginTop: scrrenHeight * 0.05 }}
                source={require('../../images/ehaierwd.jpg')} />
            <Text style={{ color: '#999', marginTop: scrrenHeight * 0.02, fontSize: 12 }}>关注微信公众号：“顺逛微店”，</Text>
            <Text style={{ color: '#999', marginBottom: scrrenHeight * 0.04, marginTop: scrrenHeight * 0.01, fontSize: 12 }}>享一手资讯，拿幸运好礼！</Text>
            <TouchableOpacity onPress={() => this.justGo()}>
                <View style={[styles.experience, { backgroundColor: '#2979FF' }]}>
                    <Text style={{ color: '#fff', fontSize: 16 }}>立即体验</Text>
                </View>
            </TouchableOpacity>
            {!this.state.authenticationState ?
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Authentication')}>
                    <View style={[styles.experience, { backgroundColor: '#e4e4e4' }]}>
                        <Text style={{ color: '#000', fontSize: 16 }}>实名认证</Text>
                    </View>
                </TouchableOpacity> : null}
            <Modal
                // 设置Modal组件的呈现方式
                animationType='slide'
                // 它决定 Modal 组件是否是透明的
                transparent
                // 它决定 Modal 组件何时显示、何时隐藏
                visible={this.state.giftBag}
                // 当 Modal组件在屏幕上完成显示后，这个回调函数将被执行
                onShow={() => Log('onShow')}
                // 这是 Android 平台独有的回调函数类型的属性
                // 开发者必须要写一个函数来处理当 Modal 显示在界面时且android物理返回键被按下时的业务逻辑
                onRequestClose={() => Log('onShow')}
            >
                <View
                    style={styles.modalVst}>
                    <ImageBackground
                        source={require('../../images/im-quant.png')}
                        style={styles.modalImag}>
                        <TouchableOpacity
                            style={styles.modalClose}
                            onPress={() => {
                                this.setState({ giftBag: false });
                            }}
                        >
                            <Image style={{ width: 24, height: 24 }}
                                source={require('../../images/closeBtnWhite.png')} />
                        </TouchableOpacity>
                        <Text style={styles.modalText}>
                            贵店开张，优惠券
                            <Text style={{ fontSize: 20, color: '#FFE447' }}>礼包</Text>
                            放入你的钱包，供你任性消费！
                        </Text>
                    </ImageBackground>
                    <View style={styles.modalButton}>
                        <TouchableOpacity
                            style={styles.modalButtonC}
                            onPress={() => {
                                this.setState({ giftBag: false });
                                this.props.navigation.navigate('MyCoupon');
                            }}
                        >
                            <Text style={{ color: '#fff', fontSize: 16 }}>我的优惠券</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>;
    }
    public justGo = () => {
        const routerState = dvaStore.getState().router;
        const routesArrlength = dvaStore.getState().router.routes.length;
        const preRouterName = routerState.routes[routesArrlength - 2].routeName;
        if (routerState.routes[routesArrlength - 3].routeName === 'Register') {
            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({
                        routeName: 'RootTabs',
                        params: null,
                    }),
                ],
            });
            this.props.navigation.dispatch(resetAction);
        } else {
            this.props.dispatch(createAction('mine/fetchMsgCenter')());
            this.props.dispatch(createAction('mine/fetchManageData')());
            this.props.dispatch(createAction('mine/fetchOrderCountData')());
            this.props.dispatch(createAction('mine/fetchWdHostData')());
            this.props.dispatch(createAction('mine/fetchFindLatestGame')());
            this.props.dispatch(createAction('mine/fetchRealNameAuthStatus')());
            this.props.dispatch(createAction('mine/fetchApplyStatus')());
            console.log('刷新了一堆数据');
            this.props.navigation.goBack(preRouterName);
        }
    }
    public async getShopData() {
        try {
            const response = await getAppJSON(Config.SHOP_APPLY_SUCCESS, {});
            if (response.success) {
                this.setState({
                    memberCount: response.data.openStoreRank,
                });
            }
        } catch (error) {
            Log(error);
        }
    }
    public async getAuthenticationState() {
        try {
            const response = await getAppJSON(Config.TRUE_REALNAMEAUTH);
            if (response.success) {
                this.setState({
                    authenticationState: response.data.isAuth,
                }); // 认证状态
            }
        } catch (error) {
            Log(error);
        }
    }
    public componentDidMount() {
        // this.getShopData();
        // this.getAuthenticationState();
    }
}
const styles = EStyleSheet.create({
    container: {
        alignItems: 'center',
        paddingTop: scrrenHeight * 0.06,
        backgroundColor: '#eee',
        flex: 1,
    },
    experience: {
        width: 264,
        height: scrrenHeight * 0.08,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: scrrenHeight * 0.03,
    },
    modalVst: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalImag: {
        height: 185,
        width: 250,
        position: 'relative',
    },
    modalClose: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 99,
    },
    modalText: {
        color: '#fff',
        fontSize: 12,
        textShadowRadius: 1,
        textShadowColor: 'rgba(111, 0, 0, 0.75)',
        paddingTop: 32,
        paddingLeft: 24,
        paddingRight: 24,
        textAlign: 'center',
    },
    modalButton: {
        height: 79,
        paddingTop: 17,
        width: 250,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    modalButtonC: {
        height: 44,
        marginLeft: 21,
        marginRight: 21,
        backgroundColor: '#f40',
        borderRadius: 78,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
