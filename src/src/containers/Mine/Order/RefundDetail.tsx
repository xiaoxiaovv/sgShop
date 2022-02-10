import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    InteractionManager,
    Clipboard,
    StatusBar,
    NativeModules,
} from 'react-native';
import * as React from 'react';
import { Toast } from 'antd-mobile';
import { INavigation } from '../../../interface/index';
import { getAppJSON } from '../../../netWork';
import Config from 'react-native-config';
import EStyleSheet from 'react-native-extended-stylesheet';
import { NavBar } from '../../../components/NavBar';


interface IRefundDetailProps {
    orderProductId: string;
    memberId: string;
}

interface IRefundDetailState {
    data: any;
}

class RefundDetail extends React.Component<INavigation & IRefundDetailProps, IRefundDetailState> {

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

    public render(): JSX.Element {
        // 创建物流节点模块
        const orderWorkFlowCard = ({ index , item }) => {
            return (
                <View key = {index} style={{flexDirection: 'row'}}>
                    {/* 左边部分 */}
                    <View style={{alignItems: 'flex-end', width: '32%',
                            paddingTop: 23, paddingBottom: 12, paddingRight: 17}}>
                        <Text style={[{lineHeight: 16, color: (index === 0) ?
                                '#000' : '#c1c1c1'}, styles.fonSize12]}>
                            {item.val.slice(0, 10)}
                        </Text>
                        <Text style={[{lineHeight: 16, color: (index === 0) ?
                                '#000' : '#c1c1c1'}, styles.fonSize12]}>
                            {item.val.slice(11, 19)}
                        </Text>
                    </View>
                    {/* 右边部分 */}
                    <View style={{flexDirection: 'row', alignItems: 'center' ,
                            width: '68%', paddingTop: 20, paddingRight: 26,
                                paddingBottom: 12, paddingLeft: 20}}>
                        {/* 小圆圈 */}
                        <View style={{backgroundColor: 'white', paddingTop: 2,
                        paddingBottom: 2, position: 'absolute', left: -7.5, top: 23}}>
                            <Image
                                resizeMode = {'contain'}
                                style={styles.circleImg}
                                source = { index === 0 ? require('../../../images/circle1.png') :
                                            require('../../../images/circle2.png')}
                            />
                        </View>
                        <Text
                            style={[{color: (index === 0) ? '#000' : '#c1c1c1'}, styles.fonSize15]}
                            numberOfLines = {0}>
                            {item.name}
                        </Text>
                    </View>
            </View>
            );
        };

        const orderTD = this.state.data;

        const orderWorkFlows = [];
        if (orderTD !== null) {
            orderTD.orderWorkFlowList.reverse().forEach( ( item, index ) => {
            if (item) {
                const Card = orderWorkFlowCard({index , item});
                orderWorkFlows.push(Card);
            }
        });
    }
        return (
            <View style={{backgroundColor: '#f1f1f1', flex: 1}}>
                <StatusBar
                    barStyle={"dark-content"}/>
                <NavBar title={'退换货追踪'}
                    rightView={
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <TouchableOpacity
                                        style={{alignItems: 'center', paddingBottom: 2, paddingRight: 10}}
                                        activeOpacity = {0.7}

                                        onPress={() => { this.goToKeFu(); }}
                                        >
                                    <Image
                                        style={styles.kefuImg}
                                        source={require('../../../images/service.png')}
                                    />
                            </TouchableOpacity>
                        </View>
                    }
                />
                {
                    orderTD !== null &&
                    <View style={{backgroundColor: '#f1f1f1', flex: 1}}>
                    <ScrollView>
                            <View style={{backgroundColor: 'rgb(238, 238, 238)', marginBottom: 20}}>
                                {/* 上面一部分 */}
                                <View style={{backgroundColor: '#f8f8f8', paddingTop: 5,
                                    paddingBottom: 5, paddingLeft: 10}}>
                                    <View style={styles.lineMenu}>
                                        <Text style={styles.nameStyle}>订单号</Text>
                                        <Text style={styles.valueStyle}>
                                            {orderTD.refundCode && orderTD.refundCode}
                                        </Text>
                                    </View>
                                    <View style={styles.lineMenu}>
                                        <Text style={styles.nameStyle}>店铺名称</Text>
                                        <Text style={styles.valueStyle}>
                                            {orderTD.shopName && orderTD.shopName}
                                        </Text>
                                    </View>
                                    <View style={styles.lineMenu}>
                                        <Text style={styles.nameStyle}>退款类型</Text>
                                        <Text style={styles.valueStyle}>
                                            {orderTD.refundType && orderTD.refundType}
                                        </Text>
                                    </View>
                                    <View style={styles.lineMenu}>
                                        <Text style={styles.nameStyle}>退款金额</Text>
                                        <Text style={styles.valueStyle}>
                                            {orderTD.refundMoney && orderTD.refundMoney}
                                        </Text>
                                    </View>
                                    <View style={styles.lineMenu}>
                                        <Text style={styles.nameStyle}>退款原因</Text>
                                        <Text style={styles.valueStyle}>
                                            {orderTD.reason && orderTD.reason}
                                        </Text>
                                    </View>
                                    <View style={styles.lineMenu}>
                                        <Text style={styles.nameStyle}>退款说明</Text>
                                        <Text style={styles.valueStyle}>
                                            {orderTD.describe && orderTD.describe}
                                        </Text>
                                    </View>
                                </View>
                                {/* 下面一部分 */}
                                <View style={styles.bottomContainer}>
                                    {/* 中间的一条流程线 */}
                                    <View style={styles.flowLine}/>
                                    {/* 流程View */}
                                    {orderWorkFlows}
                                </View>
                            </View>
                    </ScrollView>
                    </View>
                }
             </View>
        );
    }

    // 调起客服页面
    private  goToKeFu = () => {
        const chatparams = {
            goods_id: '-1', // 消息页等其他页面商品id固定传-1  单品页传商品id正常传  订单传商品id正常传
            clientGoods_type: '1', // 传1
            // 0:客服端不展示商品信息;1：客服端以商品ID方式获取商品信息(goods_id:商品ID，clientGoods_type = 1时goods_id参数传值不能为空)
            appGoods_type: '0', // 单品页传1  订单传3 并吧三下面的四个参数传递过来
          };
        // 小能客服
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

    // 获取数据
    private  getData = async () => {
        try {
            // 获取退货详情
            const { params } = this.props.navigation.state;
            const json = await getAppJSON(Config.REFUND_DETAIL, {
                orderProductId: params.orderProductId,
                memberId: params.memberId,
            });
            // Log('zhaoxincheng****', json);
            if (json.success) {
                this.setState({data: json.data});
            } else if (json.message) {
                Toast.fail(json.message, 2);
              } else {
                Toast.fail('获取物流信息失败！', 2);
              }
        } catch (err) {
            Log(err);
        }
    }
}

const styles = EStyleSheet.create({
    nameStyle: {
        fontSize: '14rem',
        color: 'black',
    },
    valueStyle: {
        fontSize: '13rem',
        color: '#999',
        paddingLeft: 25,
    },
    lineMenu: {
        flexDirection: 'row',
        paddingBottom: 10,
        alignItems: 'center',
    },
    borderLine: {
        borderRadius: 2,
        borderWidth: 1,
        marginLeft: 3,
        marginRight: 3,
        borderColor: '#eee',
    },
    bottomContainer: {
        backgroundColor: '#fff',
        paddingTop: 27,
        marginTop: 8,
    },
    flowLine: {
        position: 'absolute',
        width: '3rem',
        backgroundColor: '#d3d3d3',
        left: '32%',
        marginTop: 27,
        height: '100%',
    },
    fonSize12: {
        fontSize: '$fontSize2',
    },
    fonSize15: {
        fontSize: '15rem',
    },
    circleImg: {
        width: '18rem',
        height: '18rem',
    },
    kefuImg: {
        width: '24rem',
        height: '24rem',
    },
});

export default RefundDetail;
