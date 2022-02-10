import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    InteractionManager,
    Clipboard,
    NativeModules,    
} from 'react-native';
import * as React from 'react';
import { Toast } from 'antd-mobile';
import { INavigation } from '../../../interface/index';
import { getAppJSON } from '../../../netWork';
import Config from 'react-native-config';
import EStyleSheet from 'react-native-extended-stylesheet';
import { NavBar } from '../../../components/NavBar';
import {getEnviroment} from '../../../config/index';
import URL from '../../../config/url.js';


interface IOrderTrackProps {
    orderSn: string;
}

interface IOrderTrackState {
    data: any;
}

class OrderTrack extends React.Component<INavigation & IOrderTrackProps, IOrderTrackState> {

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
        const orderTrackCard = ({ item, orderTrackCardIndex }) => {
            // 创建物流节点模块
            const orderWorkFlowCard = ({ index , orderWorkFlow }) => {
                return (
                    <View key = {index} style={{flexDirection: 'row'}}>
                        {/* 左边部分 */}
                        <View style={{alignItems: 'flex-end', width: '32%', paddingTop: 23, paddingBottom: 12, paddingRight: 17}}>
                            <Text style={[{color: (index === 0) ? '#000' : '#c1c1c1'}, styles.fonSize12]}>
                                {orderWorkFlow.val.slice(0, 10)}
                            </Text>
                            <Text style={[{color: (index === 0) ? '#000' : '#c1c1c1'}, styles.fonSize12]}>
                                {orderWorkFlow.val.slice(11, 19)}
                            </Text>
                        </View>
                        {/* 右边部分 */}
                        <View style={{flexDirection: 'row', alignItems: 'center' , width: '68%', paddingTop: 20, paddingRight: 26, paddingBottom: 12, paddingLeft: 20}}>
                            {/* 小圆圈 */}
                            <View style={{backgroundColor: 'white', paddingTop: 2, paddingBottom: 2, position: 'absolute', left: -7.5, top: 23}}>
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
                                {orderWorkFlow.name}
                            </Text>
                        </View>
                </View>
                );
            };
            const orderWorkFlows = [];
            // 逆序数组再遍历
            item.orderWorkFlowList.forEach( ( orderWorkFlow, index ) => {
                if (orderWorkFlow) {
                    const Card = orderWorkFlowCard({index , orderWorkFlow});
                    orderWorkFlows.push(Card);
                }
            });

            const { params } = this.props.navigation.state;
            return (
                <View key={orderTrackCardIndex} style={{backgroundColor: 'rgb(238, 238, 238)', marginBottom: 20}}>
                    {/* 上面一部分 */}
                    <View style={{backgroundColor: '#f8f8f8', paddingTop: 5, paddingBottom: 5, paddingLeft: 10}}>
                        <View style={styles.lineMenu}>
                            <Text style={styles.nameStyle}>订单号   </Text>
                            <Text style={styles.valueStyle} numberOfLines= {1}>{params.orderSn}</Text>
                        </View>
                        <View style={styles.lineMenu}>
                            <Text style={styles.nameStyle}>物流公司</Text>
                            <Text style={styles.valueStyle} numberOfLines= {1}>{item.expressName}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between',
                                        alignItems: 'center', paddingBottom: 10}}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={styles.nameStyle}>运单号码</Text>
                                    <Text style={styles.valueStyle} numberOfLines= {1}>{item.invoiceNumber}</Text>
                                </View>
                            {   item.invoiceNumber.length !== 0 &&
                                <View style={[styles.borderLine, {marginRight: 5}]}>
                                    <Text style={[{color: 'black', margin: 3}, styles.fonSize13]}
                                        onPress={() => {
                                            Clipboard.setString(item.invoiceNumber);
                                            Toast.info('复制成功', 1);
                                        }}
                                    >复制</Text>
                                </View>
                            }
                        </View>
                        {   item.netPointName &&
                            <View style={styles.lineMenu}>
                                <Text style={styles.nameStyle}>网点名称</Text>
                                <Text style={styles.valueStyle} numberOfLines= {1}>{item.netPointName}</Text>
                            </View>
                        }
                        {   item.netPointMobile &&
                            <View style={styles.lineMenu}>
                                <Text style={styles.nameStyle}>网点电话</Text>
                                <Text style={styles.valueStyle} numberOfLines= {1}>{item.netPointMobile}</Text>
                            </View>
                        }
                        {
                            item.expectTime.length !== 0 && item.bigActivity &&
                            <View style={styles.lineMenu}>
                                <Text style={[styles.valueStyle, {paddingLeft: 0}]} numberOfLines= {1}>{item.expectTime}</Text>
                            </View>
                        }
                        {   item.isShow && item.canClick &&
                            <View style={{backgroundColor: '#2FA1F4', paddingTop: 10, paddingBottom: 10,
                                paddingLeft: 15, paddingRight: 15, marginTop: 5,
                                borderRadius: 5, alignSelf: 'flex-start'}}>
                                    <Text style={[{color: 'white'}, styles.fonSize14]}
                                        onPress={() => {
                                            this.showTrajectory(item.isOJO, item.orderCode);
                                        }}
                                    >车辆轨迹</Text>
                            </View>
                        }
                        {   item.isShow && !item.canClick &&
                            <View style={{backgroundColor: '#A8A8A8', paddingTop: 10, paddingBottom: 10,
                                paddingLeft: 15, paddingRight: 15, marginTop: 5,
                                borderRadius: 5, alignSelf: 'flex-start'}}>
                                <Text style={[{color: 'white'}, styles.fonSize14]}
                                >车辆轨迹</Text>
                            </View>
                        }
                    </View>
                    {/* 下面一部分 */}
                    <View style={styles.bottomContainer}>
                        {/* 中间的一条流程线 */}
                        <View style={styles.flowLine}/>
                        {/* 流程View */}
                        {orderWorkFlows}
                    </View>
                </View>
            );
        };
        const orderTrackCards = [];
        if (this.state.data !== null) {
            const orderTrackingData =   this.state.data.orderWorkFlowsViewA;
            orderTrackingData.forEach( ( item, orderTrackCardIndex ) => {
                if (item) {
                    const Card = orderTrackCard({item, orderTrackCardIndex});
                    orderTrackCards.push(Card);
                }
            });
        }
        return (
            <View style={{backgroundColor: '#f1f1f1', flex: 1}}>
                <NavBar title={'追踪订单'}
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
                    this.state.data !== null &&
                    <View style={{backgroundColor: '#f1f1f1', flex: 1}}>
                    <ScrollView>
                        {orderTrackCards}
                    </ScrollView>
                    </View>
                }
            </View>
        );
    }

    // 调起客服页面
    private  goToKeFu = () => {
        const { params } = this.props.navigation.state;
        // 咨询发起页url
        const baseUrl = Config.API_URL + 'www/index.html#'; // http://m.ehaier.com/www/index.html#
        const stateName = '/orderTracking/' + params.orderSn;
        const goodOrderUrl = baseUrl + stateName;
        const chatparams = {
            startPageTitle: '订单详情', // 咨询发起页标题(必填)
            startPageUrl: goodOrderUrl, // 咨询发起页URL，必须以"http://"开头 （必填）
            matchstr: '', // 域名匹配,企业特殊需求,可不传  (android需要的参数)
            erpParam: '', // erp参数, 被用参数,小能只负责经由SDK传到客服端,不做任何处理
            kfuid: '', // 传入指定客服的格式：siteid_ISME9754_T2D_指定客服的id
            clicktoshow_type: 1, // 点击商品的动作 默认传递1   说明：  0 小能内打开， 1 顺逛内打开
            goods_id: params.productId.toString(), // 消息页等其他页面商品id固定传-1  单品页传商品id正常传  订单传商品id正常传
            clientGoods_type: '1', // 传1
            // 0:客服端不展示商品信息;1：客服端以商品ID方式获取商品信息(goods_id:商品ID，clientGoods_type = 1时goods_id参数传值不能为空)
            appGoods_type: '3', // 单品页传1  订单传3 并吧三下面的四个参数传递过来
                // * 0:APP端不展示商品信息;
                // * 1：APP端以商品ID方式获取商品信息(appGoods=1时goods_id参数传值才生效);
                // * 3：自定义传入商品数据，展示到APP端,appGoods_type＝3时下面的4参数传值才会生效
                // *   以下四个参数不需要
                //    chatparams.goods_imageURL(商品图片url，订单里面就是订单商品的imageURl ，多个网单取第一个)、
                // *  chatparams.goodsTitle(商品标题、订单id)、
                // *  chatparams.goodsPrice(商品价格、订单金额)、
                // *  chatparams.goods_URL(商品链接 、 订单页面url地址)
                // *  chatparams.itemparam (“storeMemberId,street”) storeMemberId+","+street注意此字段事两个拼接在一起的，单品页传递，订单不传递
            goods_imageURL: params.defaultImageUrl,
            goodsTitle: '网单：' + params.cOrderSn ,
            goodsPrice: '价格：' + params.totalAmount,
            itemparam: '',
            isSingle: '0', // 0：请求客服组内客服；1：请求固定客服。(ios请求固定客服要求传入,android不需要)

        };
        let settingId = 'hg_1000_1508927913371';
        // const codeArray = [8800037114, 8800214045, 8800256530, 8800262941, 8800268232, 8800194779, 8800284360, 8800267165, 8800267162, 8700095500];
        const codeArray = URL.get_KFarr;
        for (const value of codeArray) {
            if (params.storeCode !== null &&
                params.storeCode == value) {
                settingId = 'hg_' + params.storeCode + '_9999';
            }
        }
        // 小能客服
        const command = [
            settingId,
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

    // 车辆轨迹
    private  showTrajectory = async (isOJO, orderCode) => {
        try {
            // const json = await getAppJSON(Config.GET_CDK_TOKEN, {});
            // if (json.success) {
            //     const url = Config.CDK_URL + '?order_code=' + orderCode  + '&token=' + json.data.token;
            //     console.log('zhaoxincheng>>', url);
            //     /******注意要转码********/
            //     this.props.navigation.navigate('CustomWebView', {
            //         customurl: url,
            //         headerTitle: '车辆轨迹',
            //         flag: true,
            //         });
            // } else {
            //     Toast.fail(json.message, 1);
            // }
    
            //  yl
            let url = 'http://wx.rrskx.com/rrswx-test/view/order/orderDetail.jsp?orderId=';
            if (getEnviroment() == 1) { //正式环境
                url = 'http://wx.rrskx.com/rrswx/view/order/orderDetail.jsp?orderId=';
            }
            if(isOJO){ 
                url = url + 'JSG'+orderCode;
            }else{
                url = url + orderCode;
            }
            this.props.navigation.navigate('CustomWebView', {
                customurl: url,
                headerTitle: '车辆轨迹',
                flag: false,
                doNotModifyCustomUrl: true
            });
        } catch (err) {
            Log(err);
        }
    }
    // 获取数据
    private  getData = async () => {
        try {
            // 获取订单详情数据 navigation.state.params.
            const { params } = this.props.navigation.state;
            const json = await getAppJSON(Config.ORDER_TRACK, {
                orderSn: params.orderSn,
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
        maxWidth: '220rem',
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
        lineHeight: '16rem',
    },
    fonSize13: {
        fontSize: '13rem',
    },
    fonSize14: {
        fontSize: '14rem',
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

export default OrderTrack;
