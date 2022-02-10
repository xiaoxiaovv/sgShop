import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    InteractionManager,
    Linking,
    Clipboard,
    NativeModules,
    Platform,
} from 'react-native';
import * as React from 'react';
import { Toast, Modal } from 'antd-mobile';
import { INavigation } from '../../../interface/index';
import {postAppJSON, getAppJSON} from '../../../netWork';
import Config from 'react-native-config';
import {IS_NOTNIL, isiPhoneX} from '../../../utils';
import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import { MessageWithBadge } from '../../../components/MessageWithBadge';
import { NavBar } from '../../../components/NavBar';


interface IOrderDetailProps {
    mid: number;
    cOrderSn: string;
    cOrderId: string;
    unread?: number;
}

interface IOrderDetailState {
    data: any;
}

// 获取从dva里获取mid
const mapStateToProps = ( { users: { mid, unread } } ) => ({ mid, unread });
@connect(mapStateToProps)
class OrderDetail extends React.Component<INavigation & IOrderDetailProps, IOrderDetailState> {

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
        const productData = this.state.data;
        const { mid } = this.props;
        const { params = {} } = this.props.navigation.state;
        return (
            <View style={{backgroundColor: '#f1f1f1', flex: 1}}>
                <NavBar title={'订单详情'}
                    rightView={
                        params.headerRight ? params.headerRight :
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <MessageWithBadge
                                messageBoxStyle={{justifyContent: 'flex-start', marginTop: 5}}
                                badgeContainStyle={{top: -4, right: -3}}
                                imageStyle={{ width: 22, height: 22}}
                                navigation={this.props.navigation}
                                unread={params.unread}
                                isWhite={false}
                                hidingText={true}
                            />
                        </View>
                    }
                />
                {
                    IS_NOTNIL(productData) &&
                    <View style={{backgroundColor: '#f1f1f1', flex: 1}}>
                    <ScrollView>
                        {/* 订单状态模块 */}
                        <View style={styles.topHeaderStyle}>
                            <Text style={[{marginLeft: 10, color: 'white'}, styles.fontSize14]}>
                                {productData.orderStatusName}
                                </Text>
                            <Image
                                resizeMode={'contain'}
                                style={styles.topStatuesImg}
                                source={
                                    {uri: 'http://www.ehaier.com/mstatic/wd/v2/img/pages/order/' + productData.iconName}}
                                    />
                        </View>
                        {/* 地址模块 */}
                        <View style={styles.addressStyle}>
                            <View>
                                <Image
                                    style = {styles.locationImg}
                                    source = {require('../../../images/ic_location.jpg')}
                                />
                            </View>
                            <View style={{padding: 5, flex: 1}}>
                                <View style={{flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                marginBottom: 5}}>
                                    <Text style={styles.textStyle}>收货人:{productData.consignee}</Text>
                                    <Text style={styles.textStyle}>{productData.mobile}</Text>
                                </View>
                                <Text
                                    numberOfLines={2}
                                    style={[styles.textStyle, {marginRight: 10}]}>
                                        收货地址：{productData.regionName + productData.address}
                                </Text>
                            </View>
                        </View>
                        {/* 提货门店信息 */}
                        {
                                IS_NOTNIL(productData.orderType) &&
                                (productData.orderType === 7 || productData.orderType === 8) &&
                                IS_NOTNIL(productData.sp) &&
                                <View style={styles.spStyContainer}>
                                    <View style={styles.sgHeaderCon}>
                                        <View style={styles.sgHeaderLeft}>
                                                <Image
                                                    style = {styles.spImg}
                                                    source = {require('../../../images/location-tsxx.png')}
                                                />
                                                <Text style={styles.sgTitle}>提货门店信息</Text>
                                        </View>
                                        <Text style={styles.sgHeaderRight}>{productData.sp.p}</Text>
                                    </View>
                                    <View style={styles.sgContentCon}>
                                        {IS_NOTNIL(productData.sp.pn) &&
                                        <Text style={[styles.sgContentText, {marginBottom: 4}]}>{productData.sp.pn}</Text>
                                        }
                                        { IS_NOTNIL(productData.sp.a) &&
                                        <Text style={styles.sgContentText}>提货门店地址：{productData.sp.a}</Text>
                                        }
                                    </View>
                                </View>
                        }
                        {/* o2o店铺 */}
                        {    !productData.pcProductFlag && productData.isO2o &&
                            <TouchableOpacity
                            activeOpacity = {0.7}
                            onPress={() => { this.goToStore(productData.o2oStoreId); }}
                            >
                                    <View style={styles.storeStyle}>
                                        <Image
                                            style = {styles.ic_home_Img}
                                            source = {require('../../../images/tab_ic_gg.png')}
                                        />
                                        <Text style={[styles.textStyle, {marginTop: 5, marginBottom: 5}]}>
                                            {productData.o2oStoreName}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                        }
                        {/* 商品模块 */}
                        <TouchableOpacity
                                    activeOpacity = {0.7}
                                    onPress={() => {
                                        if(productData.zActivityOrder === 1){
                                            //众筹商品
                                            this.props.navigation.navigate('CustomWebView', { customurl: `${URL.H5_HOST}crowd_funding_details/${productData.zActivityId}/`, flag: true, headerTitle: '众筹详情' });
                                        }else{
                                            this.goToProductDetail(productData.productId,
                                                productData.o2oType,
                                                productData.ckCode);
                                        }
                                    }}
                                    >
                                <View style={styles.productContainer}>
                                    <View style={styles.productStyle}>
                                            <View style={{ margin: 5}}>
                                                <Image
                                                    style= {styles.productImg}
                                                    source = {
                                                            {uri: productData.attrPic === null ?
                                                            productData.defaultImageUrl : productData.attrPic}}
                                                />
                                                {
                                                    productData.isBook === 1 && !(productData.zActivityOrder === 1) &&
                                                    <Text
                                                        style={styles.bookText}
                                                    >预订</Text>
                                                }
                                                {
                                                    (productData.zActivityOrder === 1) &&
                                                    <Text
                                                        style={styles.numerousText}
                                                    >
                                                    {
                                                        productData.zActivityStatus === 1 ? '众筹中' :
                                                        (productData.zActivityStatus === 2 ? '众筹成功' :
                                                        (productData.zActivityStatus === 100 ? '计算中' : '众筹失败'))}
                                                    </Text>
                                                }
                                        </View>
                                        <View style={{padding: 5, flex: 1}}>
                                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                                <Text numberOfLines={1} style={[styles.textStyle, styles.textMaxWidth160]}>{productData.productFullName}</Text>
                                                <Text style={styles.textStyle}>¥{productData.price.toFixed(2)}</Text>
                                            </View>
                                            <View style={{flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    marginTop: 5,
                                                    paddingBottom: 10}}>
                                                <Text numberOfLines={1} style={[styles.textStyle, styles.textMaxWidth160]}>{productData.productName}</Text>
                                                <Text style={styles.textStyle}>× {productData.number}</Text>
                                            </View>
                                            {/* 规格数量 */}
                                            {
                                                    productData.attrName !== null &&
                                                    <View style={{flexDirection: 'row',
                                                            marginTop: 5,
                                                            paddingBottom: 10}}>
                                                        <Text style={[styles.textStyle, {marginRight: 10}]}>已选</Text>
                                                        <Text style={styles.textStyle}>{productData.attrName}</Text>
                                                    </View>
                                                }
                                                {/* 超时免单半日达 */}
                                                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                                                    {
                                                        IS_NOTNIL(productData.isTimeoutFree) &&
                                                        productData.isTimeoutFree === 1 &&
                                                        <View style={{flexDirection: 'row', alignItems: 'center',
                                                                        marginRight: 10}}>
                                                            <Image
                                                                style={styles.freeImg}
                                                                source = {require('../../../images/ic_order_free.png')}
                                                            />
                                                            <Text style={[{
                                                                        color: '#C2830B', marginLeft: 2}, styles.fontSize14]}>
                                                                超时免单
                                                            </Text>
                                                        </View>
                                                    }
                                                    {
                                                        IS_NOTNIL(productData.isCod) && productData.isCod === 1 &&
                                                        <View style={{flexDirection: 'row',
                                                                alignItems: 'center', marginRight: 10}}>
                                                            <Image
                                                                style={styles.freeImg}
                                                                source = {require('../../../images/ic_cod.png')}
                                                            />
                                                            <Text style={[{color: '#C2830B',
                                                                    marginLeft: 2}, styles.fontSize14]}>货到付款</Text>
                                                        </View>
                                                    }
                                                </View>
                                        </View>
                                    </View>
                                    {/* 提示 */}
                                    {
                                        IS_NOTNIL(productData.orderType) &&
                                        productData.orderType === 7 &&
                                        <View style={styles.hintMessage}>
                                            <Text style={styles.hintText}>提示：每个阶段最终金额由家装E站三方合同确认后进行付款</Text>
                                        </View>
                                    }
                            </View>
                        </TouchableOpacity>
                        {/* 进度模块 */}
                        {
                                IS_NOTNIL(productData.orderType) &&
                                productData.orderType === 7 &&
                                IS_NOTNIL(productData.si) &&
                                IS_NOTNIL(productData.sia) &&
                                <View style={styles.progressContainer}>
                                        {/* 进度 */}
                                        { productData.si.map((item, index) =>
                                            (
                                            <View
                                                key={`${index}`}
                                                style={styles.progressCard}>
                                                    {/* 左边 */}
                                                    <View style={styles.progressLeft}>
                                                        <View style={styles.progressImgCon}>
                                                            <Image
                                                                style = {styles.spImg}
                                                                source = {item.ss === 2 ? require('../../../images/affirm.png') : require('../../../images/await.png')}
                                                            />
                                                            { index !== (productData.si.length - 1) &&
                                                            <View style={[styles.progressImgLine, {backgroundColor: item.ss === 2 ? '#FF6026' : '#E4E4E4'}]}></View>
                                                            }
                                                        </View>
                                                        <View style={{marginTop: -4}}>
                                                            <Text style={[{color: item.ss === 1 ? '#FF6026' : '#666666',  marginBottom: 2}, styles.progressImgText]}>{item.sn}</Text>
                                                            <Text style={[{color: item.ss === 1 ? '#FF6026' : '#666666', marginBottom: 3}, styles.progressImgText]}>¥{item.sa}</Text>
                                                            {
                                                                IS_NOTNIL(item.ac) &&
                                                                <Text style={styles.progressAc}>
                                                                        {item.ac}
                                                                </Text>
                                                            }
                                                        </View>
                                                    </View>
                                                    {/* 右边 */}
                                                    <View  style={{marginTop: -4, alignItems: 'flex-end'}}>
                                                        <View style={{borderWidth: 1, borderRadius: 10, backgroundColor: item.ss === 1 ? '#FF6026' : 'white' , borderColor: item.ss === 1 ? '#FF6026' : '#EEEEEE'}}>
                                                            <Text
                                                                onPress={() => {
                                                                    if (item.ss === 1) {
                                                                        this.payOrderClick(item.so, item.sa);
                                                                    }
                                                                }}
                                                                style={[{color: item.ss === 1 ? '#ffffff' : '#666666'}, styles.progressBtn]}>
                                                                {item.ss === 0 ? '待支付' : (item.ss === 1 ? '去支付' : (item.ss === 2 ? '已支付' : '已取消'))}
                                                            </Text>
                                                        </View>
                                                        {
                                                            IS_NOTNIL(item.st) &&
                                                            <Text style={styles.progressSt}>{item.st}</Text>
                                                        }
                                                    </View>
                                            </View>
                                            ),
                                            )
                                        }
                                    <View style={styles.progressFooterView}>
                                            <Text style={styles.progressFooterTextPre}>阶段合计金额：</Text>
                                            <Text style={styles.progressFooterText}>¥{(productData.sia - productData.totalAmount).toFixed(2)}</Text>
                                    </View>
                                    <View style={styles.progressFooterView}>
                                            <Text style={styles.progressFooterTextPre}>合计金额：</Text>
                                            <Text style={styles.progressFooterText}>¥{productData.sia.toFixed(2)}</Text>
                                    </View>
                                </View>
                        }
                        {/* 赠品信息模块 */}
                        {
                                IS_NOTNIL(productData.orderType) &&
                                productData.orderType === 9 &&
                                IS_NOTNIL(productData.gb) &&
                            <View style={{backgroundColor: 'white'}}>
                                    {/* 头部 */}
                                <View>
                                    <Text style={styles.giveHeader}>赠品信息</Text>
                                </View>
                                {/* 商品 */}
                                { productData.gb.map((item, index) =>
                                            (
                                            <View
                                                key={`${index}`}
                                                style={styles.giveProduceCard}>
                                                <View style={[styles.giveImg, {backgroundColor: 'white'}]}>
                                                    {
                                                    IS_NOTNIL(item.i) &&
                                                    <Image
                                                        style={styles.giveImg}
                                                        source={{uri: item.i}}
                                                        />
                                                    }
                                                </View>
                                                <View style={styles.giveProduceInfo}>
                                                    <Text style={styles.giveText}>{item.n}</Text>
                                                    <View style={styles.giveProduceInfoNum}>
                                                        <Text style={styles.giveInfoText}>{productData.productName}</Text>
                                                        <Text style={styles.giveInfoText}>x 1</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            ),
                                            )
                                        }
                            </View>
                        }
                        {/* 拨打电话 */}
                        <View style={styles.callPhoneContainerStyle}>
                            <TouchableOpacity
                                    activeOpacity = {0.7}
                                    onPress={() => { this.callPhone(productData.phoneNumber); }}
                                    >
                                <View style={styles.callPhoneStyle}>
                                        <Image
                                            style={styles.timgImg}
                                            source = {require('../../../images/timg.jpg')}
                                        />
                                        <Text style={[{
                                                        color: 'black',
                                                        fontWeight: 'bold',
                                                        marginLeft: 10}, styles.fontSize14]}>拨打电话</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {/* 发票相关 */}
                        {
                            IS_NOTNIL(productData.orderType) &&
                            productData.orderType !== 7 &&
                            <View style={styles.invoiceStyle} >
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text
                                            style={{color: (IS_NOTNIL(productData.invoicesUrl)) ? '#32BEFF' : 'black'}}
                                            onPress={() => {
                                                if (IS_NOTNIL(productData.invoicesUrl) ) {
                                                    // 跳转到发票链接
                                                    // this.invoice(productData.invoicesUrl);
                                                    Linking.openURL(productData.invoicesUrl);
                                                }
                                            }}
                                            >{productData.invoiceTypeName}</Text>
                                        {
                                            IS_NOTNIL(productData.invoicesUrl) &&
                                            <View style={[styles.borderLine, {marginLeft: 10}]}>
                                                    <Text style={[{color: '#333', margin: 3}, styles.fontSize13]}
                                                        onPress={() => { this.copyClick(productData.invoicesUrl); }}
                                                    >复制链接</Text>
                                            </View>
                                        }
                                    </View>
                                <Text>发票抬头：{productData.invoiceTitle}</Text>
                            </View>
                        }
                        {
                        IS_NOTNIL(productData.orderType) &&
                        productData.orderType !== 7 &&
                        <View style={styles.priceModuleStyle}>
                                <View style={styles.priceItem}>
                                    <Text style={styles.textStyle}>商品金额</Text>
                                    <Text style={styles.textStyle}>¥{productData.opProductAmount.toFixed(2)}</Text>
                                </View>
                                <View style={styles.priceItem}>
                                    <Text style={styles.textStyle}>运费</Text>
                                    <Text style={styles.textStyle}>¥{productData.shippingFee.toFixed(2)}</Text>
                                </View>
                            {
                                IS_NOTNIL(productData.couponAmount) && productData.couponAmount > 0 &&
                                    <View style={styles.priceItem}>
                                    <Text style={styles.textStyle}>优惠券</Text>
                                    <Text style={styles.textStyle}>-¥{productData.couponAmount.toFixed(2)}</Text>
                                    </View>
                            }
                            {
                                    IS_NOTNIL(productData.orderPromotionAmount) && productData.orderPromotionAmount > 0 &&
                                    <View style={styles.priceItem}>
                                    <Text style={styles.textStyle}>下单立减</Text>
                                    <Text style={styles.textStyle}>-¥{productData.orderPromotionAmount.toFixed(2)}</Text>
                                    </View>
                            }
                            {
                                    IS_NOTNIL(productData.itemShareAmount) && productData.itemShareAmount > 0 &&
                                    <View style={styles.priceItem}>
                                    <Text style={styles.textStyle}>满减</Text>
                                    <Text style={styles.textStyle}>-¥{productData.itemShareAmount.toFixed(2)}</Text>
                                    </View>
                            }
                            {
                                IS_NOTNIL(productData.seashellAmt) && productData.seashellAmt > 0 &&
                                    <View style={styles.priceItem}>
                                    <Text style={styles.textStyle}>积分</Text>
                                    <Text style={styles.textStyle}>-¥{productData.seashellAmt.toFixed(2)}</Text>
                                    </View>
                            }
                            {
                                // IS_NOTNIL(productData.insuranceAmt) && productData.insuranceAmt > 0 &&
                                //     <View style={styles.priceItem}>
                                //     <Text style={styles.textStyle}>保险积分</Text>
                                //     <Text style={styles.textStyle}>-¥{productData.insuranceAmt.toFixed(2)}</Text>
                                //     </View>
                            }
                            {
                                IS_NOTNIL(productData.diamondAmt) && productData.diamondAmt > 0 &&
                                    <View style={styles.priceItem}>
                                    <Text style={styles.textStyle}>钻石</Text>
                                    <Text style={styles.textStyle}>-¥{productData.diamondAmt.toFixed(2)}</Text>
                                    </View>
                            }
                            {
                                IS_NOTNIL(productData.insuranceAmt) && productData.insuranceAmt > 0 &&
                                    <View style={styles.priceItem}>
                                    <Text style={styles.textStyle}>金币</Text>
                                    <Text style={styles.textStyle}>-¥{productData.insuranceAmt.toFixed(2)}</Text>
                                    </View>
                            }
                            {
                                IS_NOTNIL(productData.bankBenefit) && productData.bankBenefit > 0 &&
                                    <View style={styles.priceItem}>
                                    <Text style={styles.textStyle}>银行优惠</Text>
                                    <Text style={styles.textStyle}>-¥{productData.bankBenefit.toFixed(2)}</Text>
                                    </View>
                            }
                            <View style={styles.priceItem}>
                                <Text style={styles.textStyle}>应付款(含运费)</Text>
                                <Text style={[styles.textStyle, {color: '#e72d2e'}]}>
                                ¥{productData.totalAmount.toFixed(2)}
                                </Text>
                            </View>
                        </View>
                        }
                        <View style={styles.orderModuleStyle}>
                            <View style={[styles.priceItem, {justifyContent: 'space-between'}]}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={styles.orderTextStyle}>订单编号：{productData.orderSn}</Text>
                                        {
                                            productData.isBook !== 0 &&
                                            !productData.zActivityOrder &&
                                            <Text style={[styles.orderTextStyle, {color: 'red'}]}>(预订订单)</Text>
                                        }
                                </View>
                                <View style={styles.borderLine}>
                                    <Text style={{fontSize: 13, color: '#333', margin: 3}}
                                        onPress={() => { this.copyClick(productData.orderSn); }}
                                    >复制</Text>
                                </View>
                            </View>
                            <View style={styles.priceItem}>
                                <Text style={styles.orderTextStyle}>创建时间：{productData.createTime}</Text>
                            </View>
                            <View style={styles.priceItem}>
                                <Text style={styles.orderTextStyle}>付款时间：{productData.payTime}</Text>
                            </View>
                            <View style={styles.priceItem}>
                                <Text style={styles.orderTextStyle}>发货时间：{productData.shippingTime}</Text>
                            </View>
                            {productData.orderStatusName === '已取消' &&
                                <View style={styles.priceItem}>
                                <Text style={styles.orderTextStyle}>取消时间：{productData.receiptOrRejectTime}</Text>
                                </View>
                            }
                            {productData.orderStatusName !== '已取消' &&
                                <View style={styles.priceItem}>
                                <Text style={styles.orderTextStyle}>签收时间：{productData.receiptOrRejectTime}</Text>
                                </View>
                            }
                        </View>
                        <View style={{padding: 10, alignItems: 'flex-end'}}>
                            {
                                productData.canConfirm &&
                                productData.canClickConfirm &&
                                !productData.orderRepairs &&
                                <Text style={[{color: '#666'}, styles.fontSize13]}>您的商品正在飞奔您的家中！</Text>
                            }
                            {
                                productData.canConfirm &&
                                productData.confirmException &&
                                !productData.orderRepairs &&
                                <Text style={[{color: '#666'}, styles.fontSize13]}>很抱歉，签收失败，请重新签收</Text>
                            }
                            {
                                productData.canConfirm &&
                                !productData.canClickConfirm &&
                                !productData.orderRepairs &&
                                <Text style={[{color: '#666'}, styles.fontSize13]}>正在签收订单</Text>
                            }
                            {
                                !productData.canConfirm &&
                                productData.canAssess &&
                                !productData.orderRepairs &&
                                <Text style={[{color: '#666'}, styles.fontSize13]}>您的商品已经签收完毕</Text>
                            }
                        </View>
                    </ScrollView>
                    {/* 按钮模块 */}
                    <View style={styles.bottomBar}>
                        <View style={{paddingLeft: 25, paddingRight: 25, alignItems: 'center'}}>
                            <TouchableOpacity
                                    style={{alignItems: 'center'}}
                                    activeOpacity = {0.7}
                                    onPress={() => {
                                        this.goToKeFu(productData);
                                        }}
                                    >
                                <Image
                                    style={[{marginBottom: 2}, styles.timgImg]}
                                    source={require('../../../images/ic_kf.png')}
                                />
                                <Text>客服</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginRight: 15}}>
                                {
                                    productData.canRepair &&
                                    productData.canSubmitRepaier &&
                                    !productData.orderRepairs &&
                                    mid === productData.memberId &&
                                    <View style={[styles.borderLine, styles.bottomBtn]}>
                                        <Text style={[{color: '#444', margin: 3}, styles.fontSize13]}
                                        onPress={() => { this.goApplyRefund(productData.cOrderSn, productData.canSubmitRepaier); }}
                                        >退款/退货
                                        </Text>
                                    </View>
                                }
                                {
                                    productData.canRepair &&
                                    !productData.canSubmitRepaier &&
                                    !productData.orderRepairs &&
                                    mid === productData.memberId &&
                                    <View style={[styles.borderLine, styles.bottomBtn]}>
                                        <Text style={[{color: '#ccc', margin: 3}, styles.fontSize13]}
                                        onPress={() => { this.goApplyRefund(productData.cOrderSn, false); }}
                                        >退款/退货
                                        </Text>
                                    </View>
                                }
                                {
                                    productData.orderRepairs &&
                                    <View style={[styles.borderLine, styles.bottomBtn]}>
                                        <Text style={[{color: '#444', margin: 3}, styles.fontSize13]}
                                        onPress={() => {
                                            this.refundDetail(productData.orderProductId, productData.loginMemberId); }}
                                        >退款详情
                                        </Text>
                                    </View>
                                }
                                {
                                    // orderType==7隐藏追踪订单按钮
                                    IS_NOTNIL(productData.orderType) &&
                                    productData.orderType !== 7 &&
                                    <View style={[styles.borderLine, styles.bottomBtn]}>
                                            <Text style={[{color: '#444', margin: 3}, styles.fontSize13]}
                                                onPress={() => { this.traceOrderClick(productData); }}
                                            >追踪订单</Text>
                                        </View>
                                }
                                {
                                    productData.canConfirm &&
                                    productData.canClickConfirm &&
                                    !productData.orderRepairs &&
                                    mid === productData.memberId &&
                                    <View style={[styles.borderLine, styles.bottomBtn]}>
                                        <Text style={[{color: '#444', margin: 3}, styles.fontSize13]}
                                            onPress={() => {
                                                this.confirmReceiveClick(productData.cOrderSn);
                                                    }}>
                                            确认收货
                                        </Text>
                                    </View>
                            }
                            {
                                    productData.canConfirm &&
                                    productData.confirmException &&
                                    !productData.orderRepairs &&
                                    mid === productData.memberId &&
                                    <View style={[styles.borderLine, styles.bottomBtn]}>
                                        <Text style={[{color: '#444', margin: 3}, styles.fontSize13]}
                                            onPress={() => {
                                                this.confirmReceiveClick(productData.cOrderSn);
                                                    }}>
                                            确认收货
                                        </Text>
                                    </View>
                            }
                            {
                                    productData.canConfirm &&
                                    !productData.canClickConfirm &&
                                    !productData.orderRepairs &&
                                    mid === productData.memberId &&
                                    <View style={[styles.borderLine, styles.bottomBtn,
                                                {backgroundColor: 'rgb(204, 204, 204)'}]}>
                                        <Text style={[{color: 'white', margin: 3}, styles.fontSize13]}>
                                            确认收货
                                        </Text>
                                    </View>
                            }
                                {
                                    !productData.canConfirm &&
                                    productData.canAssess &&
                                    (productData.orderRepairHandleStatus === null ||
                                    productData.orderRepairHandleStatus === 5) &&
                                    mid === productData.memberId &&
                                    <View style={[styles.borderLine, styles.bottomBtn]}>
                                        <Text style={[{color: '#444', margin: 3}, styles.fontSize13]}
                                            onPress={() => {
                                                this.goAssessClick(productData.orderId,
                                                                productData.cOrderSn,
                                                                productData.pcProductFlag);
                                                    }}>
                                            去评价
                                        </Text>
                                    </View>
                            }
                            {
                                !productData.canConfirm &&
                                productData.assessed &&
                                (productData.orderRepairHandleStatus === null ||
                                productData.orderRepairHandleStatus === 5) &&
                                mid === productData.memberId &&
                                <View style={[styles.borderLine, styles.bottomBtn]}>
                                        <Text style={[{color: '#444', margin: 3}, styles.fontSize13]}
                                            onPress={() => {
                                                this.lookAssessClick(productData.orderId, productData.cOrderSn); }}>
                                            查看评价
                                        </Text>
                                    </View>
                            }
                        </View>
                    </View>
                    </View>
                }
            </View>
        );
    }
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
                        price,
                    });
                }
            } else {
                Toast.fail(json.message, 1);
            }
        } catch (err) {
            Log(err);
        }
    }
    // 打电话
    private  callPhone = (mobile) => {
        // alert('打电话');
        Linking.canOpenURL('tel:' + mobile).then(supported => {
            if (!supported) {
              Toast.info('该设备不支持拨打电话功能', 2);
            } else {
                // 拨打电话
             return Linking.openURL('tel:' + mobile);
            }
          }).catch(err => console.error('An error occurred', err));
    }
    // 去店铺
    private  goToStore = (storeId) => {
        this.props.navigation.navigate('StoreHome', {storeId});
    }
    // 商品详情
    private  goToProductDetail = (productId, o2oType, storeId) => {
        this.props.navigation.navigate('GoodsDetail', { productId, o2oType, storeId});
    }

    // 跳转到发票链接
    private invoice = (invoicesUrl) => {
        this.props.navigation.navigate('CustomWebView', {
            customurl: invoicesUrl,
            headerTitle: '发票链接',
            flag: true,
            });
    }

    // 跳到商品评价页面
    private goAssessClick = (orderId, cOrderSn, pcProductFlag) => {
        this.props.navigation.navigate('OrderAssess', {
            cOrderSn,
            orderId,
            // routeKey: this.props.navigation.state.key,
            callBack: () => {
                this.getData();
            },
        });
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

    // 查看评价
    private  lookAssessClick = (orderId, cOrderSn) => {
        // alert('查看评价');
        this.props.navigation.navigate('LookAssess', {
            orderId,
            cOrderSn,
        });
    }

    // copy
    private  copyClick = (copyInfo) => {
        Clipboard.setString(copyInfo);
        Toast.info('复制成功', 1);
    }

    // 追踪订单
    private  traceOrderClick = (productData) => {
        // 跳转到追踪订单
        this.props.navigation.navigate('OrderTrack', {
            orderSn: productData.orderSn,
            cOrderSn: productData.cOrderSn,
            orderProductId: productData.orderProductId,
            productId: productData.productId,
            defaultImageUrl: productData.defaultImageUrl,
            totalAmount: productData.totalAmount,
            storeCode: productData.storeCode,
        });
    }
    // 退款/退货
    private  goApplyRefund = async (cOrderSn, canSubmitRepaier) => {

        if (!canSubmitRepaier) {
            Toast.info('退款受理中，请稍后刷新查看状态！', 2);
            return;
          }

         // 检测是否可以退换退款
        try {
            const json = await getAppJSON(Config.CHECK_REFUND, {
                cOrderSn,
            });
            // Log('zhaoxincheng****', json);
            if (json.success) {
                if (json.data) {
                  if (json.data.isPackage) {
                        // 弹窗提示
                        Modal.alert(
                            <Text style={{color: '#32BEFF', fontSize: 13}}>{json.data.packageMessage}</Text>,
                            <Text> </Text>,
                            [
                                {
                                    text: '取消',
                                    style: {color: '#32BEFF', fontSize: 14, paddingTop: 5},
                                    onPress: () => Log('cancel')},
                                {
                                    text: '确认',
                                    style: {color: '#32BEFF', fontSize: 14, paddingTop: 5},
                                    onPress:  () => {
                                        // 点击了确认按钮
                                        // 跳转到退款/退货
                                        this.props.navigation.navigate('ApplyRefund', {
                                            cOrderSn,
                                            callBack: () => {
                                                // 当从退款界面返回时调用刷新当前界面数据
                                                this.getData();
                                            },
                                        });
                            }},
                        ]);
                  } else {
                    // 跳转到退款/退货
                    this.props.navigation.navigate('ApplyRefund', {
                        cOrderSn,
                        callBack: () => {
                            // 当从退款界面返回时调用刷新当前界面数据
                            this.getData();
                        },
                    });
                  }
                } else {
                    // 跳转到退款/退货
                    this.props.navigation.navigate('ApplyRefund', {
                        cOrderSn,
                        callBack: () => {
                            // 当从退款界面返回时调用刷新当前界面数据
                            this.getData();
                        },
                    });
                }
              } else {
                Toast.fail(json.message, 1);
              }
        } catch (err) {
            Log(err);
        }
    }
    // 退款详情
    private  refundDetail = (orderProductId, loginMemberId) => {
        this.props.navigation.navigate('RefundDetail', {
            orderProductId,
            memberId: loginMemberId,
        });
    }
    // 客服
    private  goToKeFu = (productData) => {
        const { params } = this.props.navigation.state;
        // 咨询发起页url
        const baseUrl = Config.API_URL + 'www/index.html#'; // http://m.ehaier.com/www/index.html#
        const stateName = '/orderDetail/' +
                            productData.orderSn + '/' +
                            productData.cOrderSn + '/' +
                            productData.orderProductId;
        const goodOrderUrl = baseUrl + stateName;
        const chatparams = {
            startPageTitle: '订单详情', // 咨询发起页标题(必填)
            startPageUrl: goodOrderUrl, // 咨询发起页URL，必须以"http://"开头 （必填）
            matchstr: '', // 域名匹配,企业特殊需求,可不传  (android需要的参数)
            erpParam: '', // erp参数, 被用参数,小能只负责经由SDK传到客服端,不做任何处理
            kfuid: '', // 传入指定客服的格式：siteid_ISME9754_T2D_指定客服的id
            clicktoshow_type: 1, // 点击商品的动作 默认传递1   说明：  0 小能内打开， 1 顺逛内打开
            goods_id: productData.productId.toString(), // 消息页等其他页面商品id固定传-1  单品页传商品id正常传  订单传商品id正常传
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
            goods_imageURL: productData.defaultImageUrl,
            goodsTitle: '网单：' + params.cOrderSn,
            goodsPrice: '价格：' + productData.totalAmount,
            itemparam: '',
            isSingle: '0', // 0：请求客服组内客服；1：请求固定客服。(ios请求固定客服要求传入,android不需要)

        };
        let settingId = 'hg_1000_1508927913371';
        // const codeArray = [8800037114, 8800214045, 8800256530, 8800262941, 8800268232, 8800194779, 8800284360, 8800267165, 8800267162, 8700095500];
        const codeArray = URL.get_KFarr;
        for (const value of codeArray) {
            if (productData.storeCode !== null &&
                productData.storeCode == value) {
                settingId = 'hg_' + productData.storeCode + '_9999';
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

    // 获取数据
    private  getData = async () => {
        console.log('-------获取数据------');
        try {
            // 获取订单详情数据 navigation.state.params.
            const { params } = this.props.navigation.state;
            const json = await getAppJSON(Config.ORDER_DETAIL, {
                cOrderSn: params.cOrderSn,
                cOrderId: params.cOrderId,
            });
            console.log('zhaoxincheng>>>>>', json);
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
    topHeaderStyle: {
        backgroundColor: '#5fc5ff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        alignItems: 'center',
    },
    addressStyle: {
        flexDirection: 'row',
        padding: 10,
        marginBottom: 10,
        backgroundColor: 'white',
    },
    storeStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        padding: 5,
        backgroundColor: 'white',
    },
    spStyContainer: {
        padding: 16,
        marginTop: 5,
        marginBottom: 8,
        backgroundColor: 'white',
    },
    sgHeaderCon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 9,
    },
    sgHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    spImg: {
        width: '18rem',
        height: '18rem',
    },
    sgTitle: {
        color: '#FF6026',
        fontSize: '14rem',
        lineHeight: '20rem',
        marginLeft: 8,
    },
    sgHeaderRight: {
        color: '#000000',
        fontSize: '14rem',
        lineHeight: '20rem',
    },
    sgContentCon: {
        marginLeft: 26,
    },
    sgContentText: {
        color: '#000000',
        fontSize: '14rem',
        lineHeight: '20rem',
    },
    productContainer: {
        padding: 16,
        marginTop: 5,
    },
    productStyle: {
        flexDirection: 'row',
    },
    hintMessage: {
        marginTop: 8,
    },
    hintText: {
        color: '#666666',
        fontSize: '12rem',
        lineHeight: '17rem',
        letterSpacing: -0.29,
    },
    progressContainer: {
        backgroundColor: 'white',
        padding: 15,
    },
    progressCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        minHeight: '70rem',
    },
    progressLeft: {
        flexDirection: 'row',
    },
    progressImgCon: {
        alignItems: 'center',
        marginRight: 10,
    },
    progressImgLine: {
        flex: 1,
        width: 1,
    },
    progressImgText: {
        fontSize: '14rem',
        lineHeight: '20rem',
    },
    progressAc: {
        color: '#999999',
        fontSize: '12rem',
        lineHeight: '17rem',
        maxWidth: 0.613 * width,
        marginBottom: 10,
    },
    progressBtn: {
        fontSize: '12rem',
        lineHeight: '17rem',
        paddingLeft: 11,
        paddingRight: 11,
        paddingTop: 4,
        paddingBottom: 4 ,
    },
    progressSt: {
        color: '#999999',
        fontSize: '12rem',
        lineHeight: '17rem',
        marginTop: 2,
    },
    progressFooterView: {
        marginTop: 14,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    progressFooterTextPre: {
        color: '#333333',
        fontSize: '14rem',
        lineHeight: '20rem',
    },
    progressFooterText: {
        color: '#FF6026',
        fontSize: '14rem',
        lineHeight: '20rem',
    },
    giveProduceCard: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#EEEEEE',
        marginBottom: 4,
    },
    giveProduceInfo: {
        flex: 1,
    },
    giveProduceInfoNum: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    giveInfoText: {
        marginTop: 5,
        color: '#666',
        fontSize: '12rem',
    },
    giveHeader: {
        color: '#333333',
        fontSize: '14rem',
        lineHeight: '20rem',
        letterSpacing: -0.48,
        marginLeft: 16,
        marginTop: 12,
        marginBottom: 12,
    },
    giveImg: {
        width: '80rem',
        height: '80rem',
        marginRight: 9,
    },
    giveText: {
        color: '#333333',
        fontSize: '14rem',
        lineHeight: '16rem',
        maxWidth: 0.677 * width,
    },
    callPhoneContainerStyle: {
        backgroundColor: 'white',
        padding: 5,
        marginBottom: 10,
    },
    callPhoneStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        padding: 8,
        borderWidth: 1,
        borderColor: '#f5f5f5',
    },
    invoiceStyle: {
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        paddingTop: 15,
        paddingBottom: 15,
        marginBottom: 5,
    },
    priceModuleStyle: {
        backgroundColor: 'white',
        padding: 10,
        paddingTop: 15,
        paddingBottom: 10,
        marginBottom: 10,
    },
    priceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    orderModuleStyle: {
        backgroundColor: 'white',
        padding: 10,
        paddingTop: 15,
        paddingBottom: 10,
        marginBottom: 5,
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    borderLine: {
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 2,
        borderWidth: 1,
        marginLeft: 3,
        marginRight: 3,
        borderColor: '#eee',
    },
    orderTextStyle: {
        fontSize: '14rem',
        margin: 3,
        color: '#5e5e5e',
    },
    textStyle: {
        fontSize: '13rem',
        color: 'black',
    },
    bottomBar: {
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 5,
        paddingBottom: isiPhoneX ? (34 + 5) : 5,
        borderTopWidth: 1,
        borderColor: '#eee',
    },
    bottomBtn: {
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 6,
        justifyContent: 'center',
    },
    topStatuesImg: {
        width: '88rem',
        height: '60rem',
        marginTop: 30,
        marginBottom: 30,
        marginRight: 40,
      },
      locationImg: {
        width: '23rem',
        height: '23rem',
        marginTop: 7,
      },
      ic_home_Img: {
        width: '24rem',
        height: '24rem',
        marginRight: 10,
      },
      productImg: {
        width: '55rem',
        height: '60rem',
        backgroundColor: 'white',
      },
      freeImg: {
        width: '18rem',
        height: '18rem',
      },
      timgImg: {
        width: '20rem',
        height: '20rem',
      },
      bookText: {
        position: 'absolute',
        backgroundColor: 'rgba(256,0,0,0.5)',
        width: '100%',
        textAlign: 'center',
        lineHeight: '18rem',
        color: '#ffffff',
        fontSize: '13rem',
      },
      numerousText: {
        position: 'absolute',
        backgroundColor: 'rgba(256,0,0,0.5)',
        width: '100%',
        textAlign: 'center',
        lineHeight: '18rem',
        color: '#ffffff',
        fontSize: '13rem',
      },
      fontSize13: {
        fontSize: '13rem',
      },
      fontSize14: {
          fontSize: '14rem',
      },
      textMaxWidth160: {
        maxWidth: '160rem',
      },
});

export default OrderDetail;
