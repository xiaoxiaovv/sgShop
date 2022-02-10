import * as React from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, Platform, DeviceEventEmitter, Image, StyleSheet } from 'react-native';
import { List, Picker, Modal } from 'antd-mobile';
import SelectAddress from './SelectAddress';
import ProductInfo from './ProductInfo';
import BottomView from './BottomView';
import EStyleSheet from 'react-native-extended-stylesheet';
import { INavigation, ICustomContain } from '../../interface/index';
import { connect } from 'react-redux';
import { createAction, height, width, changeStyle } from '../../utils/index';
import { submitPayway } from '../../dvaModel/orderModel';
import { toFloat } from '../../utils/MathTools';
import CustomNaviBar from '../../components/customNaviBar';
import {Color, Font} from 'consts';
import Radio from '../../components/Radio/index'

// 修改 ant mobile 样式 yl
import listItemStyles from 'antd-mobile/lib/list/style/index';
const newStyle = {};
let myStyle = [
    {
        cssType: 'Item', // 要改的样式的类名字
        val: [
            { key: 'paddingLeft', value: 0},
        ]
    },
    {
        cssType: 'Line', // 要改的样式的类名字
        val: [
            { key: 'paddingRight', value: 0},
        ] 
    },
]
changeStyle(newStyle, listItemStyles, myStyle)

const prompt = Modal.prompt;
const alt = Modal.alert;
const Item = List.Item;
const RadioItem = Radio.RadioItem;
const deliMap = {
    '9:0000': '9:00-13:00',
    '130000': '13:00-18:00',
    '180000': '18:00-21:00',
};

interface IOrderProps {
    pageInfo: any;
    price: any;
    giftCardNumber: any;
    deliveryWay: any;
    disab: any;
}

const YouHuiItam: React.SFC<{ title: string; discount: string | number; }> = (props) => {
    return <View style={styles.youhuiitem}>
        <Text style={styles.itemTitle}>{props.title}</Text>
        <Text style={styles.priceText}>{`-￥${toFloat(props.discount)}`}</Text>
    </View>;
};

let skku, attrValueNames, o2oAttrId;
let benifitListener;
@connect(({ order }) => order)
class CommitOrder extends React.Component<ICustomContain & IOrderProps> {
    public state: { finalBenifit: any[]; value: string; pickerValue: any[]; visible: boolean;isFillCode: boolean; } = {
        finalBenifit: [],
        value: 'online',
        pickerValue: [],
        visible: false,
        isFillCode: false,
        disab: false,
    };
    public constructor(props) {
        super(props);
        this.MonSubmit = this.onSubmit.bind(this);
    }
    public onPayChange = async (value) => {
        // if(this.state.value == value){return}
        const json = await submitPayway(value);
        if (json.success) { // 切换支付方式成功
            this.setState({
                value,
            });
        }else{
            this.setState({
                value: 'online',
            });
        }
    }
    public componentDidMount() {
        benifitListener = DeviceEventEmitter.addListener('resetBenifit', (e) => {
            this.setState({ finalBenifit: [] });
        });
        const { state: { params } } = this.props.navigation;
        if (params && params.isRefresh) { // 需要更新结算页数据时
            this.props.dispatch(createAction('order/fetchPageInfo')());
        }
        // this.onPayChange('online');
    }
    public componentWillReceiveProps(nextProps){
        // 重置积分钻石的计算
        if(nextProps.isRefreshFlag){
            this.setState({ finalBenifit: [] });
            this.props.dispatch(createAction('order/isRefreshFlag')({ isRefreshFlag: false }))
        }

        if(nextProps.pageInfo != this.props.pageInfo){
            const { ordersCommitWrapM } = nextProps.pageInfo;
            const { value } = this.state;
            if(value !== 'online'){
                if(ordersCommitWrapM.payList.findIndex((item) => item.paymentCode === value) > 0) {
                    console.log('------存在货到付款------');
                    this.onPayChange(value);
                }else{
                    console.log('------不存在货到付款------');
                    this.setState({
                        value: 'online'
                    });
                }
            }
        }
    }
    public render(): JSX.Element {
        const { state: { params } } = this.props.navigation;
        console.log('--------params------');
        console.log(params);
        const { value } = this.state;
        const { pageInfo, price, giftCardNumber } = this.props;
        // const price = this.props.pageInfo;
        // console.log(this.props)
        // console.log(price.newBenefit)
        if (!pageInfo || !price) {
            return null;
        }
        const { ordersCommitWrapM } = pageInfo;
        // const isShow = (pageInfo.bigActivity && !pageInfo.isB2C && !pageInfo.isActivity && !pageInfo.isBooking);
        let deliveryTime = pageInfo.standardDeliveryDate;
        const mtime = ordersCommitWrapM.time;
        if (ordersCommitWrapM.delivery === 1) {
            deliveryTime = `${ordersCommitWrapM.date} ${deliMap[mtime]}`;
        }
        // if (ordersCommitWrapM.payList.length === 1 || ordersCommitWrapM.orderProductList.length > 2) {
        //     // 删除货到付款
        //     ordersCommitWrapM.payList = [{ paymentCode: 'online', paymentName: '在线支付' }];
        // }
        // // 如果没有在线支付
        // if ((ordersCommitWrapM.payList.findIndex((item) => item.value === 'online')) === -1 && ordersCommitWrapM.payList.length === 1) {
        //     ordersCommitWrapM.payList = [{ paymentCode: 'online', paymentName: '在线支付' }];
        // }
        return (
            <View style={{ flex: 1 }}>
             <CustomNaviBar
                navigation={this.props.navigation} title={'填写订单'}
                style={{zIndex: 1000,
                    borderBottomWidth: 1,
                    borderBottomColor: '#ccc',}}
                    leftAction={() =>
                        this.props.navigation.goBack()   
                    }
                />
                <ScrollView style={{ marginBottom: 45 }}>
                   {
                       this.props.pageInfo.orderType==7 ?
                       <View style={{width,height:40,backgroundColor:'#eee'}}>
                           <Text style={{fontSize:14,color:'#666',paddingLeft:12,paddingTop:12}}>温馨提示：购买成功后会发送短信到您的手机</Text>
                       </View>
                       :null
                   }
                    <Item arrow='horizontal'
                        onClick={() => this.props.navigation.navigate('Address', {
                            onSelect: (item) => {
                                this.props.dispatch(createAction('order/chooseAddress')({ addrId: item.id, skku, attrValueNames, o2oAttrId }));
                            }, from: 'commitOrder',
                        })}
                    >
                        <SelectAddress {...ordersCommitWrapM}/>
                    </Item>
                    <Image source={require('../../images/separator.png')} style={styles.separator} resizeMode='cover'/>
                    {
                        IS_NOTNIL(ordersCommitWrapM.orderProductList) && ordersCommitWrapM.orderProductList.map((mitem) => {
                            return (
                                <List key={mitem.sku} renderHeader={() => <View style={{ height: 10, backgroundColor: 'transparent' }} />}>
                                    <Item styles={StyleSheet.create(newStyle)}>
                                        <ProductInfo
                                            navigation={this.props.navigation}
                                            {...this.props.price.productSmallPrice.find((myitem) => myitem.productId === mitem.productId)}
                                            {...mitem}
                                            {...pageInfo}
                                            giftCardNumber={this.props.giftCardNumber}
                                            o2oStore={this.props.pageInfo.o2oStore}
                                            skkuInfo={params}
                                            itemData={mitem}
                                        />
                                    </Item>
                                </List>
                            );
                        })
                    }
                    <List renderHeader={() => <View style={{ height: 10, backgroundColor: 'transparent' }} />}>
                        {/*
                            {(pageInfo.canUseGiftCard && !pageInfo.useGiftCard) && <Item
                                extra={
                                    <View style={{marginRight: width / 3, flexDirection: 'row'}}>
                                        <TouchableOpacity style={styles.mbutton} onPress={() => {
                                            if (this.judgeCanGoGift(pageInfo)&&this.props.giftCardNumber == '请输入礼品卡券') {
                                                let giftCardPrompt = prompt('请输入礼品卡券', '  ',
                                                    [
                                                        {
                                                            text: '取消',
                                                        },
                                                        {
                                                            text: '兑换',
                                                            onPress: (value) => {
                                                                this.props.giftCardNumber === '请输入礼品卡券' && this.props.dispatch(createAction('order/checkGiftCard')({ cardCode: value, callback: closeGiftCardPrompt }))
                                                            },
                                                        },
                                                    ], 'default', null, [this.props.giftCardNumber]);
                                                const closeGiftCardPrompt = () =>{
                                                    giftCardPrompt.close();
                                                }
                                            } else {
                                                this.messageAlert('');
                                            }
                                        }}>
                                            <Text style={styles.kaquan}>{this.props.giftCardNumber}</Text>
                                        </TouchableOpacity>
                                        {this.props.giftCardNumber&&this.props.giftCardNumber != '请输入礼品卡券'&&
                                            <TouchableOpacity  onPress={() => {
                                                this.props.dispatch(createAction('order/cancelGiftCard')())
                                                }} style={{position:'absolute',right: 0,top:10,}}>
                                                <Text style={{fontSize:15}}>取消兑换</Text>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                }
                            >
                                礼品券码
                        </Item>
                            }
                        */}
                        <Item
                            arrow='horizontal'
                            onClick={() => {
                                // 判断是否可用通用优惠券
                                console.log('--------skku------');
                                console.log(skku);
                                if (this.judgeCanUseCouponList(pageInfo, 2)) {
                                    this.props.dispatch(createAction('router/apply')({
                                        type: 'Navigation/NAVIGATE', routeName: 'CanUseCouponList', params: { memberCouponId: pageInfo.ordersCommitWrapM.order.couponCode, skku, attrValueNames, o2oAttrId },
                                    }));
                                } else {
                                    this.messageAlert('');
                                }

                            }}
                        >
                        <View style={styles.couponContainer}>
                            <Text style={styles.itemTitle}>优惠券</Text>
                            <Text style={styles.itemValue}>
                                {ordersCommitWrapM.order.couponCodeValue?`${ordersCommitWrapM.order.couponCodeValue}元`:''}
                            </Text>
                        </View>
                    </Item>
                        <Item><Text style={styles.itemTitle}>支付方式</Text></Item>
                        <List style={{ marginLeft: 10 }}>
                            {IS_NOTNIL(ordersCommitWrapM.payList) && ordersCommitWrapM.payList.map(item => {
                                // console.log(ordersCommitWrapM.payList);
                                // console.log(item);
                                    return(
                                        <View>
                                            <RadioItem
                                                key={item.paymentCode}
                                                styles={styles.itemText}
                                                checked={value === item.paymentCode}
                                                onChange={() => this.onPayChange(item.paymentCode)}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ marginTop: 8 ,color:'#666'}}>{item.paymentName}</Text>
                                                </View>
                                            </RadioItem>

                                        </View>
                                    )
                            }
                            )}
                        </List>
                        {
                            pageInfo.sht &&
                            <Item
                                multipleLine={true}
                                wrap={true}
                                onClick={() => {
                                    this.props.dispatch(createAction('order/fetchDeliveryWay')());
                                    this.setState({ visible: true });
                                }}
                                arrow='horizontal'
                                extra={<Text style={[styles.itemValue,{width:0.65*width,textAlign:'right'}]}>{`${pageInfo.delivery == 0 ? '标准:预计于' : '您选择于:'}${pageInfo.standardDeliveryDate} 送达`}</Text>}
                            >
                                <Text style={styles.itemTitle}>配送时间</Text>
                        </Item>
                        }
                         {
                            this.props.pageInfo.orderType==7 ?
                            null
                            :
                            <Item
                                multipleLine={true}
                                wrap={true}
                                arrow='horizontal'
                                extra={<Text style={[styles.itemValue,{width:0.65*width,textAlign:'right'}]}>
                                    {`${ordersCommitWrapM.invoiceType === 2 ? '普通发票' + ' ' + ordersCommitWrapM.memberInvoices.invoiceTitle : '增值税专用发票' + ' ' + ordersCommitWrapM.billCompany}`}
                                </Text>}
                                onClick={() => {
                                    console.log('--------skku------');
                                    console.log(skku);
                                    this.props.navigation.navigate('Receipt', { skku, attrValueNames, o2oAttrId })}}>
                                <Text style={styles.itemTitle}>发票信息</Text>
                            </Item> 
                        }
                        {/*判断是否使用积分/钻石*/}
                        {
                           IS_NOTNIL(ordersCommitWrapM.benefitList) && ordersCommitWrapM.benefitList.map((mitem) => {
                                const isDimond = mitem.benefitType === 'diamond';
                                return <Item multipleLine={true} wrap={true} extra={<SwitchItem
                                    onclick={(checked) => {
                                        this.onClick(checked, price.newBenefit.find((item) => item.benefitType === mitem.benefitType));
                                    }}
                                    {...mitem}
                                    acount={price.newprice}
                                    {...price.newBenefit.find((item) => item.benefitType === mitem.benefitType)}
                                    checked={isDimond ? price.diamondStatus : (mitem.benefitType === 'insurance'?price.jinbiStatus :price.jifenStatus)}
                                />}>
                                    <Text style={styles.itemTitle}>
                                        {mitem.benefitType === 'seashell' ? '积分' : mitem.benefitType === 'diamond'?'钻石':'金币'}
                                    </Text>
                                </Item>;
                            })
                        }
                        {/* extra={<Text style={styles.priceText}>{`￥${price.commodityAmount.toString()}.00`}</Text>} */}
                        <Item>
                            <View style={{ flex: 1 }}>
                                <Item
                                    style={{ paddingLeft: 0, paddingRight: 0 }}
                                    extra={<Text style={styles.priceText}>
                                        {`￥${toFloat(price.commodityAmount.toString())}`}
                                    </Text>}>
                                    <Text style={styles.itemTitle}>商品金额</Text>
                         </Item>
                                {
                                    Number(price.itemShareAmount) > 0 && <YouHuiItam title='满减' discount={price.itemShareAmount} />
                                }
                                {/*判断是否使用优惠券*/}
                                {
                                    // (price.StoreCouponCodeValue !== 0) && <YouHuiItam title='优惠券' discount={price.StoreCouponCodeValue} />
                                }
                                {
                                    // (!pageInfo.isActivity && ordersCommitWrapM.order.couponCode != null) &&
                                    // <YouHuiItam title='优惠券' discount={ordersCommitWrapM.order.couponCodeValue} />
                                }
                                {
                                    (price.totalCouponValue) && <YouHuiItam title='优惠券' discount={price.totalCouponValue} />
                                }
                                {
                                    this.state.finalBenifit.map((item) => {
                                        return <YouHuiItam title={item.benefitType === 'diamond' ? '钻石' : item.benefitType === 'seashell' ? '积分' : '金币'} discount={item.pointDiscount} />;
                                    })
                                }
                            </View>
                        </Item>
                    </List>
                </ScrollView>
                <BottomView {...price} onSubmit={this.MonSubmit} disabled={this.state.disab} />
                <Picker
                    data={this.getDates()}
                    title='选择配送时间'
                    cascade={false}
                    extra='请选择(可选)'
                    itemStyle={{ fontSize: 17 }}
                    visible={this.state.visible}
                    value={this.state.pickerValue}
                    onChange={v => {
                        this.setState({ pickerValue: v });
                        this.props.dispatch(createAction('order/submitDeliveryTime')({ delivery: pageInfo.delivery, yuyueDay: v[0], yuyueTime: v[1], skku, attrValueNames, o2oAttrId }));
                    }
                    }
                    onOk={() => this.setState({ visible: false })}
                    onDismiss={() => this.setState({ visible: false })}
                />
            </View>
        );
    }
    public componentWillUnmount() {
        if(benifitListener){
            benifitListener.remove();
        }
        this.timer && clearTimeout(this.timer);
        console.log('-------CommitOrder---componentWillUnmount---------');
        const { landcb } = this.props.navigation.state.params;
        if (landcb) {
            // 刷新我的界面
            console.log('-------CommitOrder---componentWillUnmount------landcb------');
            landcb();
        }
        this.props.dispatch(createAction('order/clearOrder')());
    }
    private judgeCanGoGift(pageInfo) {
        // 通用已使用，礼品券不能用
        if (pageInfo.ordersCommitWrapM.order.couponCodeValue) {
            return false;
        }
        // 商品优惠已使用，礼品券不能用
        for (let i = 0; i < pageInfo.ordersCommitWrapM.orderProductList.length; i++) {
            if (pageInfo.ordersCommitWrapM.orderProductList[i].couponCodeValue) {
                return false;
            }
        }
        return true;
    }
    private judgeCanUseCouponList(pageInfo, type) {
        // 礼品券已使用，商品优惠不能用
        if (this.props.giftCardNumber !== '请输入礼品卡券' || pageInfo.useGiftCard == true) {
            return false;
        }
        // 通用券跳转 2通用， 1商品
        if (type === 1) {
            // 通用已使用，商品优惠不能用
            if (pageInfo.ordersCommitWrapM.order.couponCodeValue) {
                return false;
            }
        }
        if (type === 2) {
            // 商品优惠已使用，通用不能用
            for (let i = 0; i < pageInfo.ordersCommitWrapM.orderProductList.length; i++) {
                if (pageInfo.ordersCommitWrapM.orderProductList[i].couponCodeValue) {
                    return false;
                }
            }
        }
        return true;
    }
    private messageAlert(message) {
        const alert = Modal.alert;
        const msg1 = '礼品券不可与优惠券/卡券同时使用，请核对要使用的优惠券';
        alert(msg1, '', [
            { text: '知道了', onPress: () => Log('ok') },
        ]);
    }
    private commonFn = () => {
        const isBooking = this.props.pageInfo.isBooking;
        const benefitList = [];
        for (let index = 0; index < this.state.finalBenifit.length; index++) {
            const mitem = this.state.finalBenifit[index];
            benefitList.push({
                benefitType: mitem.benefitType,
                count: mitem.canUsePoint,
                amt: mitem.pointDiscount,
            });
        }
        const routeKey = this.props.navigation.state.key;
        if(!this.state.disab){
            console.log('提交订单 disab true');
            this.setState({disab: true}, ()=>{
                this.props.dispatch(createAction('order/submitOrder')({ isBooking, benefitList, routeKey ,callback: () => {
                        this.setState({disab: false});
                        console.log('提交订单 disab false');
                    }}));
            });
            this.timer = setTimeout(()=>{
                this.setState({disab: false});
            }, 2000);
        }
    }
    private onSubmit() {
        console.log(this.props.pageInfo.orderType)
        console.log(this.state.isFillCode)
        if(this.props.pageInfo.orderType==9){ // this.props.pageInfo.orderType==7 软装
            if(this.props.pageInfo.hbData && IS_NOTNIL(this.props.pageInfo.hbData.c)){ // 核销过
                this.commonFn();
                return;
            }else if(this.state.isFillCode){ // 点击返回没有填写 再次点击提交 不提示 直接去支付
                this.commonFn();
                return;
            }
            else{ // 没有核销过 也没有返回
                const altInt = alt('尚未验证特权码，无法获得家电赠品确定提交订单？',' ', [
                    { text: '返回填写', onPress: () => {console.log('cancel'); this.setState({isFillCode:true}) }, style: 'default' },
                    { text: '确定', onPress: () =>{this.commonFn()}},
                  ]);
            }
        }else{
            this.commonFn();
        }
        
  
    }
    // private onSubmit() {
    //     const isBooking = this.props.pageInfo.isBooking;
    //     const benefitList = [];
    //     for (let index = 0; index < this.state.finalBenifit.length; index++) {
    //         const mitem = this.state.finalBenifit[index];
    //         benefitList.push({
    //             benefitType: mitem.benefitType,
    //             count: mitem.canUsePoint,
    //             amt: mitem.pointDiscount,
    //         });
    //     }
    //     this.props.dispatch(createAction('order/submitOrder')({ isBooking, benefitList }));
    // }
    private onClick(checked, mitem) {
        if (checked) {
            const tempFinalBenifit = this.state.finalBenifit;
            tempFinalBenifit.push(mitem);
            this.setState({ finalBenifit: tempFinalBenifit }, () => {
                this.props.dispatch(createAction('order/countPoint')({ useBenfits: this.state.finalBenifit }));
            });
        } else {
            this.setState({ finalBenifit: [] }, () => {
                this.props.dispatch(createAction('order/countPoint')({ useBenfits: this.state.finalBenifit }));
            });
        }

    }
    private getDates(): any[] {
        const { deliveryWay } = this.props;
        const dates = [];
        for (let index = 0; index < deliveryWay.length; index++) {
            const element = deliveryWay[index];
            const item = { label: element, value: element };
            dates.push(item);
        }
        // return [[...dates], [{ value: '9:00-13:00', label: '9:00-13:00' },
        // { value: '13:00-18:00', label: '13:00-18:00' },
        // { value: '18:00-21:00', label: '18:00-21:00' }]];
        return [[...dates]];
    }
}

/* 积分组件 */
const SwitchItem: React.SFC<{ count: string, benefitType: string, canUsePoint: number, pointDiscount: number, checked: boolean, acount: string | number, onclick: (mb: boolean) => void }> = (props) => {
    return (<View style={{ flexDirection: 'row' }}>
        <Text
            style={[styles.extra, { marginLeft: 15, width: .55*width,lineHeight: 35, fontSize: 13 }]}
        >
            {`共${props.count}${props.benefitType === 'diamond'||props.benefitType === 'insurance' ? '个' : '积分'} 可用${props.canUsePoint}${props.benefitType === 'diamond'||props.benefitType === 'insurance' ? '个' : '积分'} 抵${props.pointDiscount}元`}
        </Text>
        <View style={{ paddingLeft: 5 }}>
            <Switch disabled={props.pointDiscount<=0} value={props.checked} onValueChange={(checked) => props.onclick(checked)} />
        </View>
    </View>);
};

const styles = EStyleSheet.create({
    itemText: {
        fontSize: 15,
        backgroundColor: 'red',
    },
    priceText: {
        color: Color.ORANGE_1,
        fontSize: Font.NORMAL_1,
    },
    extra: {
        fontSize: 15,
    },
    couponContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemTitle: {
        fontSize: Font.NORMAL_1,
        color: Color.BLACK_1,
    },
    itemValue: {
        fontSize: Font.SMALL_1,
        color: Color.GREY_2,
    },
    kaquan: {
        color: 'gray',
        height: 35,
        lineHeight: 35,
        width: 120,
        textAlign: 'center',
        backgroundColor: 'transparent',
    },
    youhuiitem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingRight: 10,
    },
    yuanquan: {
        position: 'absolute',
        height: 26,
        width: 26,
        backgroundColor: 'transparent',
        top: 4,
        right: -20,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: 'gray',
    },
    mbutton: {
        borderWidth: 0.5,
        height: 34,
        width: 120,
        borderRadius: 5,
        borderColor: 'gray',
    },
    separator: {
        width: width,
        height: 4,
    },
});
export default CommitOrder;
