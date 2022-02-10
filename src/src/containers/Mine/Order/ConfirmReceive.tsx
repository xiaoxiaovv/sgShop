import {
    StyleSheet,
    View,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    InteractionManager,
} from 'react-native';
import * as React from 'react';
import { Toast, Modal } from 'antd-mobile';
import { INavigation } from '../../../interface/index';
import {postAppJSON, getAppJSON} from '../../../netWork';
import Config from 'react-native-config';
import EStyleSheet from 'react-native-extended-stylesheet';
import { NavBar } from '../../../components/NavBar';

interface IConfirmReceiveProps {
    orderId: string;
}

interface IConfirmReceiveState {
    data: any;
}

class ConfirmReceive extends React.Component<INavigation & IConfirmReceiveProps, IConfirmReceiveState> {

    public constructor(props) {
        super(props);

        this.state = {
            data: null,
        };
    }

    public componentDidMount() {
        // 可以让导航切换页面动画完成后再执行请求数据的操作
        // InteractionManager.runAfterInteractions( () => {
        //     // 请求数据
        //
        // });
        this.getData();
    }

    public componentWillUnmount() {
        // 点击了返回,当前界面pop出栈,刷新前一个界面
        const { callBack } = this.props.navigation.state.params;
        if (callBack) {
            // 刷新我的界面
            callBack();
        }
    }
    public render(): JSX.Element {

        // 商品Card
        const procuctCard = ({ item, index }) => {
            return (
                <View key = {index} style={{marginBottom: 5, backgroundColor: 'white'}}>
                    <View style={{flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee'}}>
                        <Image
                            source = {{uri: item.defaultImageUrl}}
                            style={styles.productImg}
                        />
                        <View style={{flex: 1, paddingTop: 10, paddingBottom: 10, justifyContent: 'center', marginRight: 5}}>
                            <Text style={styles.productFullNameSty}>{item.productFullName}</Text>
                            <Text style={styles.productNameSty}>{item.productName}</Text>
                            <View style={{flexDirection: 'row', paddingBottom: 5}}>
                                <Text style={styles.amountSty}>¥{item.amount.toFixed(2)}</Text>
                                <Text style={styles.fontSize14}> {item.number}件</Text>
                            </View>
                        </View>
                    </View>
                    {
                        item.canConfirm && item.canClickConfirm &&
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 10}}>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: 5, marginLeft: 10, justifyContent: 'space-between'}}>
                                <Text numberOfLines={1} style={[{color: '#999999'}, styles.fontSize14]}>您的家电正飞奔至您的家中！</Text>
                                <Text style={[{marginRight: 5, color: '#0076FC'}, styles.fontSize14]}>待收货</Text>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <View style={{backgroundColor: '#0076FC', borderRadius: 4, marginRight: 5}}>
                                    <Text style={[{padding: 5, color: 'white'}, styles.fontSize14]}
                                        onPress ={() =>  {
                                            this.confirmReceiveClick(item.cOrderSn);
                                        }}
                                    >确认收货</Text>
                                </View>
                            </View>
                        </View>
                    }
                    {
                        item.canConfirm && !item.canClickConfirm &&
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 10}}>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: 5, marginLeft: 10, justifyContent: 'space-between'}}>
                                <Text numberOfLines={1} style={[{color: '#999999'}, styles.fontSize14]}>正在签收订单中···</Text>
                                <Text style={[{marginRight: 5, color: '#0076FC'}, styles.fontSize14]}>待收货</Text>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <View style={{backgroundColor: '#CCCCCC', borderRadius: 4, marginRight: 5}}>
                                    <Text style={[{padding: 5, color: '#FFF'}, styles.fontSize14]}
                                    >确认收货</Text>
                                </View>
                            </View>
                        </View>
                    }
                    {
                        item.canAssess && !item.canConfirm &&
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 10}}>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: 5, marginLeft: 10, justifyContent: 'space-between'}}>
                                <Text numberOfLines={1} style={[{color: '#999999'}, styles.fontSize14]}>您的家电已配送安装完成</Text>
                                <Text style={[{marginRight: 5, color: '#0076FC'}, styles.fontSize14]}>已签收</Text>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <View style={{backgroundColor: '#0076FC', borderRadius: 4, marginRight: 5}}>
                                    <Text style={[{padding: 5, color: '#FFF'}, styles.fontSize14]}
                                            onPress ={() =>  {
                                                this.goAssessClick(item.cOrderSn);
                                            }}
                                    >去评价</Text>
                                </View>
                            </View>
                        </View>
                    }
                    {
                        item.assessed && !item.canConfirm &&
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 10}}>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: 5, marginLeft: 10, justifyContent: 'space-between'}}>
                                <Text numberOfLines={1} style={[{color: '#999999'}, styles.fontSize14]}></Text>
                                <Text style={[{marginRight: 5, color: '#0076FC'}, styles.fontSize14]}>已评价</Text>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <View style={{backgroundColor: '#0076FC', borderRadius: 4, marginRight: 5}}>
                                    <Text style={[{padding: 5, color: '#FFF'}, styles.fontSize14]}
                                            onPress ={() =>  {
                                                this.lookAssessClick(item.cOrderSn);
                                            }}
                                    >查看评价</Text>
                                </View>
                            </View>
                        </View>
                    }
                    {
                        item.canConfirm && item.confirmException &&
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 10}}>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: 5, marginLeft: 10, justifyContent: 'space-between'}}>
                                <Text numberOfLines={1} style={[{color: '#999999'}, styles.fontSize14]}>很抱歉，签收失败请重新签收</Text>
                                <Text style={[{marginRight: 5, color: '#0076FC'}, styles.fontSize14]}>待收货</Text>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <View style={{backgroundColor: '#0076FC', borderRadius: 4, marginRight: 5}}>
                                    <Text style={[{padding: 5, color: '#FFF'}, styles.fontSize14]}
                                            onPress ={() =>  {
                                                this.confirmReceiveClick(item.cOrderSn);
                                            }}
                                    >确认收货</Text>
                                </View>
                            </View>
                        </View>
                    }
                </View>
            );
        };
        const Product = [];
        if (IS_NOTNIL(this.state.data) && this.state.data.orderProductList.length > 0) {
            this.state.data.orderProductList.forEach( ( item, index ) => {
                if (item) {
                    const Card = procuctCard({item, index});
                    Product.push(Card);
                }
            });
        }
        return (
            <View style={{backgroundColor: 'rgb(241,241,241)', flex: 1}}>
                <NavBar title={'确认收货'} />
                {
                    IS_NOTNIL(this.state.data) &&
                    <View style={{backgroundColor: 'rgb(241,241,241)', flex: 1}}>
                    <ScrollView>
                        <View style={styles.headerContainer}>
                                <View style={styles.headerSty}></View>
                                <Text style={styles.numberCountSty}>共{this.state.data.numberCount}件商品</Text>
                        </View>
                        {Product}
                    </ScrollView>
                    </View>
                }
            </View>
        );
    }

    // 确认收货
    private confirmReceiveClick = (cOrderSn) => {
            // 弹窗提示
            Modal.alert(
                <Text style={{color: '#32BEFF', fontSize: 13}}>"确认收货"将代表您已收到所购商品！</Text>,
                <Text> </Text>,
                [
                    {
                        text: '取消',
                        style: {color: '#32BEFF', fontSize: 14, paddingTop: 5},
                        onPress: () => Log('cancel')},
                    {
                        text: '确认',
                        style: {color: '#32BEFF', fontSize: 14, paddingTop: 5},
                        onPress: async () => {
                    // 发送确认订单的请求
                        try {
                            const json = await getAppJSON(Config.CONFIRM_ORDERPRODUCT, {
                                cOrderSn,
                            });
                            // Log('zhaoxincheng****', json);
                            if (json.success) {
                                // 刷新当前视图
                                this.getData();
                            } else {
                                Toast.fail(json.message, 1);
                            }
                        } catch (err) {
                            Log(err);
                        }
                }},
            ]);

    }

    // 跳到商品评价页面
    private goAssessClick = (cOrderSn) => {
        const { params } = this.props.navigation.state;

        this.props.navigation.navigate('OrderAssess', {
            cOrderSn,
            orderId: params.orderId,
            callBack: () => {
                this.getData();
            },
        });
    }

    // 查看评价
    private  lookAssessClick = (cOrderSn) => {
        const { params } = this.props.navigation.state;
        this.props.navigation.navigate('LookAssess', {
            orderId: params.orderId,
            cOrderSn,
        });
    }

    // 获取数据
    private  getData = async () => {
        try {
            const { params } = this.props.navigation.state;
            const json = await getAppJSON(Config.GET_CONFIRM_RECEIVE_LIST, {
                orderId: params.orderId,
            });
            // Log('zhaoxincheng****', json);
            if (json.success) {
                this.setState({data: json.data});
            } else {
                Toast.fail(json.message, 1);
            }
        } catch (err) {
            Log(err);
        }
    }
}

const styles = EStyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        marginTop: 5,
        marginBottom: 5,
        padding: 5,
        paddingRight: 0,
    },
    productImg: {
        margin: 10,
        width: '60rem',
        height: '60rem',
    },
    productFullNameSty: {
        fontSize: '15rem',
        paddingBottom: 5,
    },
    productNameSty: {
        fontSize: '14rem',
        paddingBottom: 5,
    },
    amountSty: {
        fontSize: '14rem',
        color: '#0176fe',
    },
    fontSize14: {
        fontSize: '14rem',
    },
    headerSty: {
        width: '5rem',
        height: '20rem',
        backgroundColor: '#80DAFF',
    },
    numberCountSty: {
        fontSize: '13rem',
        marginLeft: 5,
    },
});

export default ConfirmReceive;
