import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';
import * as React from 'react';
import { Toast, Modal} from 'antd-mobile';
import { UltimateListView } from 'rn-listview';
import { INavigation } from '../../../interface/index';
import {postAppJSON, getAppJSON} from '../../../netWork';
import Config from 'react-native-config';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';

import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

interface IOrderCardProps {
    unread?: number;
    mid?: number;
    orderStatus?: number;
    item: any;
    index: number;
    superListView?: UltimateListView;
}

// 获取从dva里获取mid
const mapStateToProps = ( { users: { mid, unread } } ) => ({ mid, unread });

const currentFontSize = 13;
@connect(mapStateToProps)
class OrderCard extends React.Component<INavigation & IOrderCardProps> {

    public constructor(props) {
        super(props);
    }

    public render(): JSX.Element {
        // 获取父视图传递过来的数据
        const { item = {}, index = 0 , orderStatus = 0, mid} = this.props;
        const productCard = ({ item, orderProduct }) => {
            return (
                <TouchableOpacity
                    key={orderProduct.productId}
                    onPress={() => { this.orderInfoClick(orderProduct); }}
                >
                    <View  style={styles.orderCardContent}>
                        <View style={{flexDirection: 'row', marginBottom: 10}}>
                            <View>
                                <Image
                                    style={styles.defaultImg}
                                    source={{uri: orderProduct.defaultImageUrl}}
                                />
                                {   orderProduct.isBook === 1 && !(item.zActivityOrder === 1) &&
                                    <Text
                                        style={styles.bookText}
                                    >预订</Text>
                                }
                                {   (item.zActivityOrder === 1) &&
                                    <Text
                                        style={styles.activityOrderText}
                                    >
                                    {
                                        item.zActivityStatus === 1 ? '众筹中' :
                                        (item.zActivityStatus === 2 ? '众筹成功' :
                                        (item.zActivityStatus === 100 ? '计算中' : '众筹失败'))}
                                    </Text>
                                }
                            </View>
                            <View style={{flex: 1, justifyContent: 'space-between', marginLeft: 5}}>
                                <View style={{marginBottom: 10}}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between',
                                    marginBottom: 5}}>
                                        <Text   numberOfLines={1}
                                                style={[{fontSize: currentFontSize}, styles.textMaxWidth161]}>
                                                {orderProduct.productFullName}</Text>
                                        <Text style={{fontSize: currentFontSize}}>
                                            ¥{orderProduct.price.toFixed(2)}
                                        </Text>
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text
                                                numberOfLines={1}
                                                style={[{fontSize: currentFontSize}, styles.textMaxWidth161]}>
                                                {orderProduct.productName} </Text>
                                        <Text style={{fontSize: currentFontSize}}>× {orderProduct.number}</Text>
                                    </View>
                                </View>
                                {orderProduct.attrName != null  &&
                                <View style={{flexDirection: 'row', marginBottom: 5}}>
                                    <Text style={{fontSize: currentFontSize}}>已选</Text>
                                    <Text style={{fontSize: currentFontSize, marginLeft: 20}}>
                                        {orderProduct.attrName}
                                    </Text>
                                </View>}
                                {orderProduct.couponCodeValue !== 0 &&
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5}}>
                                    <Text style={{fontSize: currentFontSize}}>商品优惠券:</Text>
                                    <Text style={{fontSize: currentFontSize}}>
                                        {'-¥' + orderProduct.couponCodeValue.toFixed(2)}
                                    </Text>
                                </View>}
                                {orderProduct.orderPromotionAmount !== null &&
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5}}>
                                    <Text style={{fontSize: currentFontSize}}>下单立减:</Text>
                                    <Text style={{fontSize: currentFontSize}}>
                                        {'-¥' + orderProduct.orderPromotionAmount.toFixed(2)}
                                    </Text>
                                </View>}
                                {orderProduct.couponAmount !== 0 &&
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5}}>
                                    <Text style={{fontSize: currentFontSize}}>卡券:</Text>
                                    <Text style={{fontSize: currentFontSize}}>
                                        {'-¥' + orderProduct.couponAmount.toFixed(2)}
                                    </Text>
                                </View>}
                            </View>
                        </View>
                    </View>
                    {/* 超时免单半日达 */}
                    {
                        false && orderProduct.bigActivity &&
                        <View style={[styles.orderCardContent, {flexDirection: 'row', flexWrap: 'wrap'}]}>
                            {IS_NOTNIL(orderProduct.freeOrder) &&  orderProduct.freeOrder &&
                            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
                                <Image
                                    style={styles.Img18}
                                    source = {require('../../../images/ic_order_free.png')}
                                />
                                <Text style={[{color: 'rgb(83,83,83)', marginLeft: 10}, styles.fontSize13]}>超时免单</Text>
                            </View>
                            }
                            {IS_NOTNIL(orderProduct.halfDay) && orderProduct.halfDay &&
                            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
                                <Image
                                    style={styles.Img18}
                                    source = {require('../../../images/ic_order_12.png')}
                                />
                                <Text style={[{color: 'rgb(83,83,83)', marginLeft: 10}, styles.fontSize13]}>半日达</Text>
                            </View>
                            }
                            {IS_NOTNIL(orderProduct.oneDay) && orderProduct.oneDay &&
                            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
                                <Image
                                    style={styles.Img18}
                                    source = {require('../../../images/ic_order_24.png')}
                                />
                                <Text style={[{color: 'rgb(83,83,83)', marginLeft: 10}, styles.fontSize13]}>24小时限时达</Text>
                            </View>
                            }
                        </View>
                    }
                </TouchableOpacity>
            );
        };
        const productCards = [];
        const orderProducts =  item.orderProducts;
        const memberId = mid;
        for (const orderProduct of item.orderProducts) {
            if (orderProduct) {
                const Card = productCard({ item , orderProduct});
                productCards.push(Card);
            }
        }
        return (
            <View key={item.orderSn} style={{backgroundColor: '#fff', marginBottom: 10}}>
                <View style={styles.orderCardHeader}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.orderText}>订单编号:</Text>
                        <Text style={styles.orderNumber}>{item.orderSn}</Text>
                    </View>
                    {
                        !item.isRightService && orderStatus != 5 &&
                        <Text style={[{color: '#e72d2e'}, styles.fontSize14]}>{item.orderStatusName}</Text>
                    }
                </View>
                <View>
                    {productCards}
                    {
                        !item.isRightService && orderStatus != 5 &&
                        <View style={{backgroundColor: '#f6f6f6', paddingRight: 10, paddingBottom: 10}}>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                                <Text style={[{color: '#666'}, styles.fontSize13]}>共{item.productTotalNo}件商品 合计:</Text>
                                <Text style={[{color: '#333'}, styles.fontSize13]}>¥{item.totalAmount.toFixed(2)}</Text>
                                <Text style={[{color: '#666'}, styles.fontSize13]}>
                                    (含运费: ¥{item.totalShippingFeeAmount.toFixed(2)}元)
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5}}>
                                <Text style={[{color: '#666'}, styles.fontSize13]}>下单时间:{item.addTime}</Text>
                            </View>
                            {
                                item.orderCouponAmount != null &&
                                <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5}}>
                                    <Text style={[{color: '#666'}, styles.fontSize13]}>通用优惠券:</Text>
                                    <Text style={[{color: '#333'}, styles.fontSize13]}>-¥{item.orderCouponAmount.toFixed(2)}</Text>
                                </View>
                            }
                        </View>
                    }
                </View>
                {
                    !item.isRightService && orderStatus != 5 &&
                    <View style={{width, padding: 10, paddingTop: 10}}>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10}}>
                            {
                                item.canConfirm && item.canClickConfirm &&
                                <Text style={[{color: '#000'}, styles.fontSize12]}>
                                    您的商品正在飞奔您的家中！
                                </Text>
                            }
                            {item.canConfirm && !item.canClickConfirm &&
                                <Text style={[{color: '#000'}, styles.fontSize12]}>
                                    正在签收订单
                                </Text>
                            }
                            {item.canConfirm && item.confirmException &&
                                <Text style={[{color: '#000'}, styles.fontSize12]}>
                                    很抱歉，签收失败请重新签收
                                </Text>
                            }
                            {item.goAssess && item.isMyOrder && item.memberId === memberId &&
                                <Text style={[{color: '#000'}, styles.fontSize12]}>
                                    您的商品已经签收完毕
                                </Text>
                            }
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                            {
                                (item.paymentCode != 'cod') &&
                                item.isMyOrder &&
                                item.paymentStatus == 100 &&
                                item.orderStatus == 200 &&
                                !item.payRelationOrder &&
                                item.memberId == memberId &&
                                <View style={[styles.borderLine, {borderColor: '#e72d2e'}]}>
                                <Text style={[{color: '#e72d2e', margin: 3}, styles.fontSize13]}
                                    onPress={() => { this.payOrderClick(item.orderSn, item.totalAmount); }}
                                >立即支付</Text>
                                </View>
                            }
                            {
                                (item.payRelationOrder &&
                                (item.paymentCode != 'cod') &&
                                ( item.orderStatus == 201 ||
                                item.orderStatus == 200 ) &&
                                item.memberId == memberId) &&
                                <View style={[styles.borderLine, {borderColor: '#e72d2e'}]}>
                                <Text style={[{color: '#e72d2e', margin: 3}, styles.fontSize13]}
                                    onPress={() => {
                                        this.payCouponClick(item.relationOrderSn,
                                                        item.relationOrderAmount, item.isPayCoupon, item.totalAmount);
                                    }}
                                >支付尾款</Text>
                                </View>
                            }
                            {   item.canCancel &&
                                item.isMyOrder &&
                                item.memberId == memberId &&
                                <View style={styles.borderLine}>
                                <Text style={[{color: '#444', margin: 3}, styles.fontSize13]}
                                    onPress={() => { this.cancelOrderClick(item.orderId); }}
                                >取消订单</Text>
                                </View>
                            }
                            {
                                item.orderType != 7 &&
                                !item.canDelete &&
                                <View style={styles.borderLine}>
                                    <Text style={[{color: '#444', margin: 3}, styles.fontSize13]}
                                        onPress={() => { this.traceOrderClick(item); }}
                                    >追踪订单</Text>
                                </View>
                            }
                            {
                                item.canConfirm &&
                                item.canClickConfirm &&
                                <View style={styles.borderLine}>
                                <Text style={[{color: '#444', margin: 3}, styles.fontSize13]}
                                    onPress={() => {
                                        this.confirmReceiveClick(item.isSingle,
                                                item.orderProducts[0].cOrderSn,
                                                item.orderId);
                                    }}
                                >确认收货</Text>
                                </View>
                            }
                            {   item.canConfirm &&
                                item.confirmException &&
                                <View style={styles.borderLine}>
                                <Text style={[{color: '#444', margin: 3}, styles.fontSize13]}
                                    onPress={() => {
                                        this.confirmReceiveClick(item.isSingle,
                                            item.orderProducts[0].cOrderSn, item.orderId);
                                    }}
                                >确认收货</Text>
                                </View>
                            }
                            {
                                item.canConfirm &&
                                !item.canClickConfirm &&
                                <View style={styles.borderLine}>
                                <Text style={[{color: '#CCCCCC', margin: 3}, styles.fontSize13]}
                                >确认收货</Text>
                                </View>
                            }
                            {   item.canDelete &&
                                <View style={styles.borderLine}>
                                    <Text style={[{color: '#444', margin: 3}, styles.fontSize13]}
                                        onPress={() => { this.deleteOrderClick(item.orderId); }}
                                    >删除</Text>
                                </View>
                            }
                        </View>
                    </View>
                }
            </View>
        );
    }

    // 查看某个订单的某个商品的订单详情
    private orderInfoClick = (orderProduct) => {
        // 跳转到订单详情页
        console.log('---orderInfoClick-跳转到订单详情页-----');
        this.props.navigation.navigate('OrderDetail', {
                    unread: this.props.unread,
                    cOrderSn: orderProduct.cOrderSn,
                    cOrderId: orderProduct.orderProductId,
                    callBack: () => {
                        const { superListView = null } = this.props;
                        if (superListView !== null) {
                            // 刷新当前视图的父列表视图
                            superListView.onRefresh();
                        }
                    },
                });

    };
    // 支付某个订单
    private payOrderClick = async (orderSn, price) => {
        try {
            const json = await getAppJSON(Config.ORDER_200PAYCHECK, {
                orderSn,
            });
            if (json.success) {
                if (json.errorCode === -200) {// 在支付时库存不足，极少出现的情况
                    Toast.fail(json.message, 1);
                } else {
                    // 跳转到支付页面
                    this.props.navigation.navigate('Payment', {
                        orderSn,
                    });
                }
            } else {
                Toast.fail(json.message, 1);
            }
        } catch (err) {
            Log(err);
        }
    };
    // 支付尾款订单
    private payCouponClick = async (relationOrderSn, relationOrderAmount, isPayCoupon, price) => {
        try {
            const json = await getAppJSON(Config.SELECT_GOODS_COUPONS0, {
                relationOrderSn,
            });
            if (json.success) {
                if (json.data !== null && json.data.couponList.length > 0) {
                  if (isPayCoupon) {// 如果支持优惠券
                    // 尾款支付可使用优惠券列表
                    this.props.navigation.navigate('Retainage', {
                        relationOrderSn,
                        callBack: () => {
                            const { superListView = null } = this.props;
                            if (superListView !== null) {
                                // 刷新当前视图的父列表视图
                                superListView.onRefresh();
                            }
                        },
                    });
                  } else {
                    this.props.navigation.navigate('Payment', {
                        orderSn: relationOrderSn,
                    });
                  }
                } else {
                    this.props.navigation.navigate('Payment', {
                        orderSn: relationOrderSn,
                    });
                }
            } else {
                Toast.fail(json.message, 1);
            }
        } catch (err) {
            Log(err);
        }
    };
    // 取消某个订单
    private cancelOrderClick = (orderId) => {

        Modal.alert(
            <Text style={{color: '#32BEFF', fontSize: 13}}>确认取消此订单?</Text>,
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

                const { superListView = null } = this.props;
                if (superListView !== null) {
                    try {
                        const json = await getAppJSON(Config.CANCELORDER, {
                            orderId,
                            cancelFlag: 'mstore',
                        });
                        // Log('zhaoxincheng****', json);
                        if (json.success) {
                            // 刷新当前视图的父列表视图
                            superListView.onRefresh();
                        } else {
                            Toast.fail(json.message, 1);
                        }
                    } catch (err) {
                        Log(err);
                    }
                }

            } } ]);
    };
    // 追踪某个订单
    private traceOrderClick = (item) => {
        // 跳转到订单详情页
        this.props.navigation.navigate('OrderTrack', {
            orderSn: item.orderSn,
            cOrderSn: item.orderProducts[0].cOrderSn,
            orderProductId:item.orderProducts[0].orderProductId,
            productId: item.orderProducts[0].productId,
            defaultImageUrl: item.orderProducts[0].defaultImageUrl,
            totalAmount: item.totalAmount,
        });
    };
    // 确认收货
    private confirmReceiveClick = (isSingle, cOrderSn, orderId) => {
        if (isSingle) {
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
                        const { superListView = null } = this.props;
                        if (superListView !== null) {
                            try {
                                const json = await getAppJSON(Config.CONFIRM_ORDERPRODUCT, {
                                    cOrderSn,
                                });
                                // Log('zhaoxincheng****', json);
                                if (json.success) {
                                    // 刷新当前视图的父列表视图
                                    superListView.onRefresh();
                                } else {
                                    Toast.fail(json.message, 1);
                                }
                            } catch (err) {
                                Log(err);
                            }
                        }
                    }},
                ]);
        } else {
            // 不是单个商品,跳转到confirmReceive页面
            this.props.navigation.navigate('ConfirmReceive', {
                orderId,
                callBack: () => {
                    const { superListView = null } = this.props;
                    if (superListView !== null) {
                        // 刷新当前视图的父列表视图
                        superListView.onRefresh();
                    }
                },
            });
        }
    };
    // 删除某个订单
    private deleteOrderClick = (orderId) => {

        Modal.alert(
        <Text style={{color: '#32BEFF', fontSize: 13}}>确认删除此订单?</Text>,
        <Text> </Text>,
        [
            { text: '取消', style: {color: '#32BEFF', fontSize: 14, paddingTop: 5}, onPress: () => Log('cancel')},
            { text: '确认', style: {color: '#32BEFF', fontSize: 14, paddingTop: 5}, onPress: async () => {

                const { superListView = null } = this.props;
                if (superListView !== null) {
                    try {
                        const json = await getAppJSON(Config.DELETE_ORDER, {
                            orderId,
                        });
                        // Log('zhaoxincheng****', json);
                        if (json.success) {
                            // 刷新当前视图的父列表视图
                            superListView.onRefresh();
                        } else {
                            Toast.fail(json.message, 1);
                        }
                    } catch (err) {
                        Log(err);
                    }
                }

            } } ]);

    }
}

const styles = EStyleSheet.create({
    orderCardHeader: {
        width,
        padding: 10,
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    orderText: {
        fontSize: '14rem',
        color: '#333',
    },
    orderNumber: {
        fontSize: '14rem',
        color: '#666',
        marginLeft: 5,
    },
    orderCardContent: {
        width,
        padding: 10,
        backgroundColor: '#f6f6f6',
    },
    borderLine: {
        borderRadius: 2,
        borderWidth: 1,
        marginLeft: 3,
        marginRight: 3,
        borderColor: '#eee',
    },
    defaultImg: {
        width: '67rem',
        height: '67rem',
      },
      bookText: {
        position: 'absolute',
        backgroundColor: 'rgba(256,0,0,0.5)',
        width: '100%',
        textAlign: 'center',
        lineHeight: '18rem',
        color: '#ffffff',
        fontSize: '15rem',
      },
      activityOrderText: {
        position: 'absolute',
        backgroundColor: 'rgba(256,0,0,0.5)',
        width: '100%',
        textAlign: 'center',
        lineHeight: '18rem',
        color: '#ffffff',
        fontSize: '15rem',
      },
      textMaxWidth161: {
        maxWidth: '161rem',
      },
      Img18: {
        width: '18rem',
        height: '18rem',
      },
      fontSize12: {
        fontSize: '12rem',
      },
      fontSize13: {
        fontSize: '13rem',
      },
      fontSize14: {
        fontSize: '14rem',
      },
});

export default OrderCard;
