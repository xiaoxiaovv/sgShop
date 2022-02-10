import * as React from 'react';
import { View, Text, TouchableOpacity, Image, NativeModules, Alert } from 'react-native';
import { List, Toast } from 'antd-mobile';
import CustomButton from 'rn-custom-btn1';
import { INavigation } from '../../interface';
import { ICustomContain } from '../../interface/index';
import { createAction, connect, debounce } from '../../utils/index';
import { submAlipay, submWeixin } from '../../dvaModel/orderModel';
import { getAppJSON, postAppJSON, postAppForm } from '../../netWork';
import Config from 'react-native-config';
import { NavigationActions } from 'react-navigation';
import URL from '../../config/url';
import { GET, POST_JSON, GET_P, POST_FORM} from '../../config/Http';
import CustomNaviBar from '../../components/customNaviBar';

let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

const Item = List.Item;
const Brief = Item.Brief;
const AlipayImage = require('../../images/zfb.png');
const WechatImage = require('../../images/wx.png');
const KuaijietongImage = require('../../images/kjt.gif');
const BankcardImage = require('../../images/bank_card.png');
const BaitiaoImage = require('../../images/baitiao_paylist.png');
const HuabeiImage = require('../../images/huabei.png');
const JianhangImage = require('../../images/ccb1.png');
const GuangdaImage = require('../../images/12ceb1.png');
const baitiaoText = '顺逛白条支付\n\n支付金额需大于等于600元';
interface ISPayment {
    selectPayment: boolean;
}
const mapStateToProps = (
    {
        payModel,
        order,
    },
) => {
    return { ...payModel, ...order };
};
@connect(mapStateToProps)
class Payment extends React.Component<ICustomContain> {
    public state: ISPayment;

    public constructor(props) {
        super(props);
        this.state = {
            selectPayment: true,
        };
    }
    public componentDidMount() {
        const { navigation : { state: {params: {orderSn}}} } = this.props;
        this.props.dispatch(createAction('order/initpay')({orderSn}));

    }

    public render() {
        const { payInfo: { paywayList= [], orders = {} }, bankList} = this.props;
        const { navigation : { state: {params: {orderSn}}} } = this.props;
        return (
            <View>
                <CustomNaviBar
                    navigation={this.props.navigation}
                    title={this.state.selectPayment ? '订单支付' : '银行卡选择'}
                    showBottomLine
                    rightTitle='订单中心'
                    rightAction={ () => this.props.navigation.navigate('OrderList', {orderFlag: 0, orderStatus: 0}) }
                />
                {
                    this.state.selectPayment ?
                        <List style={{height: height * 0.8}} renderHeader={() => this.ListHeader(48)}>
                            <PaymentOption
                                title='支付宝' image={AlipayImage}
                                onPress={() => {
                                    this.getAlipayInfo();
                                }}/>
                            <PaymentOption
                                onPress={() => {
                                    this.getWxinpayInfo();
                                }}
                                title='微信支付' image={WechatImage}/>
                            <PaymentOption
                                title='快捷通' image={KuaijietongImage}
                                onPress={
                                    debounce(() => this.checkKJT(), 3000)
                                }
                            />
                            <PaymentOption
                                onPress={ this.handleBankCardSelection }
                                title='银行卡支付' image={BankcardImage}/>
                            <PaymentOption title='白条支付' tips='支付金额需大于等于600元' image={BaitiaoImage}
                                           onPress={() => this.checkBaitiao()}/>
                            <PaymentOption title='花呗分期' image={HuabeiImage}
                                           onPress={() => {
                                               if (!this.isPriceValid()) {
                                                   return;
                                               }
                                               this.props.navigation.navigate('Huabei', {orderSn});
                                           }
                                           }/>
                        </List>
                        :
                        <List style={{height: height * 0.8}} renderHeader={() => this.ListHeader(24)}>
                            {
                                bankList.map(v => {
                                    switch (v.payTypeCode) {
                                        case 'ccb_fenqi':
                                            return (<PaymentOption title={v.payTypeName} tips={v.changeInformation} image={JianhangImage} onPress={() => this.toBankFenqi(v)} />);
                                        case 'ceb_fenqi':
                                            return (<PaymentOption title={v.payTypeName} tips={v.changeInformation} image={GuangdaImage} onPress={() => this.toBankFenqi(v)} />);
                                        case 'ccb_credit':
                                            return (<PaymentOption title={v.payTypeName} tips={v.changeInformation} image={GuangdaImage} onPress={() => this.toBankFenqi(v)} />);
                                        case 'ceb_credit':
                                            return (<PaymentOption title={v.payTypeName} tips={v.changeInformation} image={GuangdaImage} onPress={() => this.toBankFenqi(v)} />);
                                    }
                                })
                            }
                        </List>
                }
            </View>
        );
    }

    private checkBaitiao = async () => {
        if (!this.isPriceValid()) {
            return;
        }
        const { navigation : { state: {params: { orderSn }}} } = this.props;
        const { orderAmount: price } = this.props.payInfo.orders;

        if (price < 600) {
            Toast.info('白条支付满600可用', 2);
            return;
        }
        const param = {
            userId: dvaStore.getState().users.ucId,
            token: dvaStore.getState().users.accessToken,
        };
        const resp = await postAppJSON('v3/kjt/queryIousStatus.json' , param);
        const {data, success, message, errorCode} = resp;
        if ('100' === errorCode) {
            this.props.navigation.navigate('Login');
        }
        if (success) {
            const iousStatus = data.applyStatus;
            if (iousStatus === '2' || iousStatus === '3') {
                // 去申请白条
                this.props.dispatch(createAction('router/apply')({type: 'Navigation/NAVIGATE', routeName: 'BaiTiao'}));
            } else if (iousStatus === '0') {
                // 申请中直接打开消费金融
                const subParam = {
                    resultUrl: 'http://www.baidu.com', // 复制前端源码 ^_^
                    userId: dvaStore.getState().users.ucId,
                    token: dvaStore.getState().users.accessToken,
                };
                const subResp = await postAppJSON('v3/kjt/applyForOpen.json', subParam);
                if (subResp.success) {
                    this.props.navigation.navigate('CustomWebView', {
                        customurl: subResp.data.redirectUrl,
                        headerTitle: '白条支付',
                    });
                }
            } else if (iousStatus === '1') {
                // 已经有白条的额度
                const response = await getAppJSON('v3/h5/sg/orderPayCheckNew.html', {orderSn});
                const {errorCode: ecode, message: toastInfo} = response;
                if (ecode == -200) { // 判断库存
                    Toast.fail(toastInfo);
                } else {
                    const subParam = {
                        resultUrl: 'http://www.baidu.com', // 复制前端源码 ^_^
                        userId: dvaStore.getState().users.ucId,
                        token: dvaStore.getState().users.accessToken,
                        orderSn,
                    };

                    const subResp = await postAppForm(
                        `v3/kjt/payApply.json?orderSn=${subParam.orderSn}&resultUrl=${subParam.resultUrl}&token=${subParam.token}&userId=${subParam.userId}`,
                        subParam);

                    if (subResp.success) {
                        this.props.navigation.navigate('CustomWebView', {
                            customurl: subResp.data.redirectUrl,
                            headerTitle: '白条支付',
                            doNotModifyCustomUrl: true,
                        });
                    } else {
                        Toast.fail(subResp.message, 2);
                    }
                }
            }
        } else {
            Toast.info(message, 2);
        }
    }

    private toBankFenqi = (bank) => {
        // orderSn=&channel=sg&payType=ccb_fenqi&version=1&memberId=29659999
        const { navigation : { state: {params: { orderSn }}} } = this.props;
        let title = '银行卡支付';
        if ('ccb_fenqi' === bank.payTypeCode || 'ccb_credit' === bank.payTypeCode) {
            title = '建行信用卡分期';
        } else if ('ceb_fenqi' === bank.payTypeCode || 'ceb_credit' === bank.payTypeCode) {
            title = '光大信用卡分期';
        }
        this.props.navigation.navigate('BankFenqi', {orderSn, channel: 'sg', payType: bank.payTypeCode, version: 1, memberId: dvaStore.getState().users.mid, title});
    }

    private checkKJT = async () => {
        const { navigation : { state: {params: { orderSn }}} } = this.props;
        if (!this.isPriceValid()) {
            return;
        }
        const resp = await getAppJSON('v3/kjt/sg/withdrawSetting.html');

        if (resp.success) {
            if (resp.data.kjtAccount && resp.data.kjtAccount.memberKjtpayAccount) { // 已经绑定了快捷通
                // 库存校验 yl
                const rs = await GET(URL.PAYCHECK, {
                    orderSn: orderSn
                });
                if(!rs.success){ // 库存不足
                    Toast.info(rs.message, 2);
                    return
                }
                Log('跳转webview');
                const param = {
                    orderSn,
                    kjtAmount: resp.data.kjtAccount.memberKjtpayAccount,
                };
                const subResp = await getAppJSON('v3/h5/pay/kjtpay/request.json', param);
                if (subResp.errorCode == -200) { // 在支付时库存不足，极少出现的情况
                    Toast.info('库存不足，请稍后再试!');
                    return ;
                }
                if (subResp.success) {
                    this.props.navigation.navigate('CustomWebView', {customurl: subResp.data, headerTitle: '快捷通支付', noTitle: true});
                }
            } else {
                Alert.alert(
                    '提示',
                    '您还未绑定快捷通',
                    [
                        {text: '取消', onPress: () => Log('Cancel Pressed'), style: 'cancel'},
                        {text: '去绑定', onPress: () => this.props.navigation.navigate('CustomWebView', {customurl: `${Config.API_URL}v3/kjt/sg/kjtAccountBind.html?flag=${encodeURIComponent(dvaStore.getState().users.userToken.substring(6))}`, headerTitle: '绑定快捷通'}),
                        },
                    ],
                    { cancelable: true },
                );
            }
        } else {
            Toast.info(resp.message);
        }
    }

    private async getWxinpayInfo() {
        if (!this.isPriceValid()) {
            return;
        }
        // 库存校验 yl
        const { navigation : { state: {params: {orderSn}}} } = this.props;
        const rs = await GET(URL.PAYCHECK, {
            orderSn: orderSn
        });
        if(!rs.success){ // 库存不足
            Toast.fail(rs.message, 2);
            return
        }
        const json = await submWeixin();
        if (json) {
            // const command = [
            //     {
            //     sign: '9E29D4C512CB342F366857B97369B190',
            //     timestamp: '1520477658',
            //     noncestr : 'ADsdECcbl4Qg3pLuJfy8t3W0tsyj0jkw',
            //     partnerid: '1360071102',
            //     prepayid: 'wx2018030810541962eef29f3e0223412217',
            //     package: 'Sign=WXPay',
            //     appid: 'wxde9dd6325717e515'},
            // ];
            NativeModules.WxPayModule.pay([{...json.data}])
                .then(result => {
                    this.navigateToSuccessPage(result);
                })
                .catch((errorCode, domain, error) => {
                    this.navigateToFailPage();
                });
        }
        // 支付宝支付
    }

    private navigateToSuccessPage = (result) => {
        const { orderAmount: price } = this.props.payInfo.orders;
        const { navigation : { state: {params: {orderSn}}} } = this.props;

        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: 'PaymentResult',
                    params: { info: result , orderSn, price},
                }),
            ],
        });
        this.props.navigation.dispatch(resetAction);
    }

    private navigateToFailPage = () => {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: 'PaymentFailed',
                    params: null,
                }),
            ],
        });
        this.props.navigation.dispatch(resetAction);
    }

    private async getAlipayInfo() {
        const { navigation : { state: {params: {orderSn}}} } = this.props;
        const rs = await GET(URL.PAYCHECK, {
            orderSn,
        });
        if (!rs.success) { // 库存不足
            Toast.fail(rs.message, 2);
            return;
        }
        const json = await submAlipay();
        // 判断获取银联支付宝支付信息是否成功
        // if (json.success) {
        //     if (this.isPriceValid()) {
        //     // 发起支付宝银联支付
        //     NativeModules.UnifyPayModule.pay('02', JSON.stringify(json.data))
        //     .then(async result => {
        //         // 支付结束,请求支付结果接口
        //         const resule = await GET(URL.UNIONPAYRESULT, {
        //             orderSn,
        //         });
        //         // 判断支付结果
        //         if (resule.success) {
        //             if (resule.data) {
        //                 // Toast.info('支付宝支付成功');
        //                 this.navigateToSuccessPage(result);
        //             } else {
        //                 // Toast.info('支付宝支付失败');
        //                 this.navigateToFailPage();
        //             }
        //         } else {
        //             // 请求支付结果失败
        //             Toast.fail(resule.message);
        //         }
        //       });
        //     }
        // } else {
        //     Toast.fail(json.message);
        // }

        // 判断获取支付宝支付信息是否成功
        if (json && this.isPriceValid()) {
            NativeModules.AlipayModule.pay([{payInfo: json.result}])
            .then(result => {
                // Toast.info('支付宝支付成功');
                this.navigateToSuccessPage(result);
            })
            .catch((errorCode, domain, error) => {
                // Toast.fail('支付宝支付失败');
              this.navigateToFailPage();
            });
        }
    }
    private handleGoBack = () => {

        if ( this.state.selectPayment ) {
            this.props.navigation.goBack();
            // this.props.dispatch(createAction('router/apply')({
            //     type: 'Navigation/BACK', routeName: 'GoodsDetail',
            //   }));
        } else {
            this.setState({
                selectPayment: true,
            });
            this.props.navigation.setParams({
                selectPayment: true,
            });
        }
    }

    private handleBankCardSelection = () => {
        if (!this.isPriceValid()) {
            return;
        }
        this.setState({
            selectPayment: false,
        });
        this.props.navigation.setParams({
            selectPayment: false,
        });
        this.props.dispatch({
            type: 'payModel/fetchBankList',
            payload: {},
        });
    }

    private ListHeader = (hour) => {
        const { payInfo } = this.props;
        if (!payInfo) {
            return null;
        }
        const { orderAmount: price } = this.props.payInfo.orders;
        return (
            <View style={{backgroundColor: 'white', padding: 10, alignItems: 'center'}}>
                <Text>{`请在${hour}小时内完成支付，逾期订单自动取消`}</Text>
                <View style={{flexDirection: 'row', justifyContent: 'center', padding: 10}}>
                    <Text>应付金额:  </Text>
                    <Text style={{color: 'red'}}> {price.toString().indexOf('.') !== -1 ? `¥${price}` : `¥${price}.00`}</Text>
                </View>
            </View>
        );
    }
    private isPriceValid = (): boolean => {
        const { orderAmount: price } = this.props.payInfo.orders;
        if (price && price >= 0) {
            return true;
        }

        Toast.fail('价格异常，请至订单中心重新发起支付', 2);
        return false;
    }
    private getInstantPrice = (): void => {
        const { navigation : { state: {params: { orderSn }}} } = this.props;

    }
}

const PaymentOption = (props) => (
    <Item
        // style={{justifyContent: 'center', alignItems: 'center'}}
        arrow='horizontal'
        thumb={
            <View style={{padding: 5, height: 60, justifyContent: 'center'}}>
                <Image
                    style={{height: 40, width: 40, resizeMode: 'contain'}}
                    source={props.image}/>
            </View>
        }
        onClick={ props.onPress ? props.onPress : () => {}}
    >
        <View style={{padding: 15}}>
            <Text style={{marginBottom: 5}}>{props.title}</Text>
            {props.tips ? <Text style={{color: 'red'}}>{props.tips}</Text> : null}
        </View>
    </Item>
);

export default Payment;
