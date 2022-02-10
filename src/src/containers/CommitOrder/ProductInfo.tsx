import * as React from 'react';
import { View, TouchableOpacity, Text, BackHandler, Image, TextInput, FlatList, StyleSheet } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { List, Modal, Toast } from 'antd-mobile';
import { createAction, IS_NOTNIL , changeStyle} from '../../utils/index';
import { ICustomContain } from '../../interface/index';
import { toFloat } from '../../utils/MathTools';
import { postAppJSON, postForm, postAppForm } from '../../netWork';
import { Font, Color } from 'consts';
const Item = List.Item;

// 修改 ant mobile 样式 yl
import listItemStyles from 'antd-mobile/lib/list/style/index';
const newStyle = {};
let myStyle = [
    {
        cssType: 'Item', // 要改的样式的类名字
        val: [
            { key: 'marginTop', value: 10},
            { key: 'borderTopWidth', value: 0.5 },
            { key: 'borderTopColor', value: '#dddddd'},
        ] // 要更改或添加的样式 key 为样式名称, value为值
    },
    {
        cssType: 'Line', // 要改的样式的类名字
        val: [
            { key: 'borderBottomWidth', value: 0 },
        ] // 要更改或添加的样式 key 为样式名称, value为值
    },
    {
        cssType: 'Content', // 要改的样式的类名字
        val: [
            { key: 'fontSize', value: 14 },
            { key: 'color', value: '#333333' },
        ] // 要更改或添加的样式 key 为样式名称, value为值
    },
]
changeStyle(newStyle, listItemStyles, myStyle)
// item title
const newItemStyle = {};
let myItemStyle = [
    {
        cssType: 'Content',
        val: [
            { key: 'fontSize', value: 14 },
            { key: 'color', value: '#333333' },
        ]
    },
]
changeStyle(newItemStyle, listItemStyles, myItemStyle)

import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;

interface IProduct {
    sku: string;
    productName: string;
    price: number;
    number: number;
    attrPic: string;
    productAmount: number;
    orderPromotionAmount: number;

}
class ProductInfo extends React.Component<IProduct & ICustomContain> {
    public constructor(props) {
        super(props);
        this.state = {
            code: '',
            isWriteOff: true,
            txt: '验证',
        }
    }
    componentWillUnmount() {
        console.log('>>>>>????????>>>>>>>>>')
        this.setState({ code: '', isWriteOff: true, txt: '验证' })
    }
    public render(): JSX.Element {
        const o = this.props.itemData;
        console.log(this.props)
        return (
            <View>
                {
                    this.props.o2oStore[this.props.productId] &&
                    <Item styles={StyleSheet.create(newItemStyle)} >{this.props.o2oStore[this.props.productId]}</Item>
                }
                <View style={[styles.header,{paddingLeft: 15, paddingRight: 15, paddingTop: 11}]}>
                    <Image
                        style={styles.image}
                        source={{ uri: this.props.attrPic }}
                        resizeMode='contain'
                    />
                    <View style={styles.contentContainer}>
                        <View>
                            <Text style={styles.productName} numberOfLines={2}>{this.props.productName}</Text>
                            {
                                IS_NOTNIL(this.props.attrValueName) && <Text style={styles.textTitle}>已选:  {this.props.attrValueName}</Text>
                            }
                            <View style={styles.priceNumberContainer}>
                                <Text style={styles.textTitle}>￥{toFloat(o.price)}</Text>
                                <Text style={styles.textTitle}>x{this.props.number}</Text>
                            </View>
                            <View style={[styles.line,{marginTop: 3}]} />
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.textTitle}>小计: </Text>
                                {
                                    this.props.orderPromotionAmount > 0 && <Text style={styles.textTitle}>下单立减{this.props.orderPromotionAmount}元</Text>
                                }
                            </View>
                            {/*  暂时使用优惠前的小计  */}
                            <Text
                                style={[styles.textTitle, { color: '#666' },
                                { textDecorationLine: (toFloat(o.price * o.number) > toFloat(o.productAmount)) ? 'line-through' : 'none' }]}>
                                ￥{toFloat(o.price * o.number)}
                            </Text>
                        </View>
                        {
                            (toFloat(o.price * o.number) > toFloat(o.productAmount)) && <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text />
                                {/*  暂时使用优惠前的小计  */}
                                <Text style={[styles.textTitle, styles.productAmount]}>￥{toFloat(o.productAmount)}</Text>
                            </View>
                        }
                    </View>
                </View>
                {this.props.orderType == 9 && <View style={styles.line} />}
                {/* 必须要满足是软装 this.state.isWriteOff    */}
                {
                    this.props.orderType == 9 ?
                        <View style={{marginLeft:18}}>
                            {
                                this.state.isWriteOff ?
                                    <View style={{ flexDirection: 'row', width: width, height: 40, backgroundColor: '#fff', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ width: 50 ,}}>
                                            <Text style={{ color: '#333', fontSize: 14, }}>特权码</Text>
                                        </View>
                                        <View style={{ flex: 1, marginLeft: 8, marginRight: 8 }}>
                                            <TextInput
                                                underlineColorAndroid={'transparent'}
                                                style={{ fontSize: 14 }}
                                                placeholder='请输入已核销的硬装特权码'
                                                placeholderTextColor='#999'
                                                onChangeText={(code) => this.setState({ code })}
                                            />
                                        </View>
                                        <View style={{ marginRight: 28, width: 64, }}>
                                            <TouchableOpacity onPress={this.onClick} style={{ width: 64, height: 28, borderColor: '#FF6026', borderWidth: 1, borderRadius: 100, alignItems: 'center' }}>
                                                <Text style={{ color: '#FF6026', textAlign: 'center', lineHeight: 24 }}>验证</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    :
                                    <View style={{ flexDirection:'row', width:width,height:40,backgroundColor:'#fff',justifyContent:'space-between',alignItems:'center'}}>
                                    <View>
                                        <Text style={{color:'#333',fontSize:14,}}>特权码</Text>
                                        </View>
                                    <View style={{flex:1}}>
                                        <Text style={{paddingLeft:14,color:'#333',fontSize:14,}}>{this.state.code}</Text>
                                    </View>
                                    <View style={{marginRight:40}}>
                                        <TouchableOpacity  style={{width:68,height:28,borderColor:'#eee',borderWidth:1,borderRadius:100,alignItems:'center'}}>
                                                <Text style={{color:'#333',textAlign:'center',lineHeight:24}}>已验证</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                 }
                             </View>
                            :
                            null
                       }
                       
                       

                {

                    //必须要有数据  && IS_NOTNIL(this.props.hbData.p) 
                    !this.state.isWriteOff ?
                        <View style={{ flexDirection: 'column', width: width }}>
                            <View style={[styles.line, { marginRight: 28 }]} />
                            <View  style={{ height: 44, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 16}}>
                                <Text style={{ fontSize: 14, color: '#333', }}>赠品信息</Text>
                                <View style={{ marginRight: 20 }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.navigate('ChoiceGifts')
                                        }}
                                        style={{ flexDirection: 'row' ,alignItems: 'center',}}
                                    >
                                        <Text style={{ color: '#999' }}>修改</Text>
                                        <Image
                                            style={{ width: 20, height: 20, }}
                                            source={require('../../images/moreRight.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <FlatList
                                style={styles.flatListStyle}
                                data={this.props.hbData.p}
                                horizontal={true}
                                keyExtractor={(item, index) => item}
                                showsHorizontalScrollIndicator={false}
                                renderItem={this.dataList}
                            />
                        </View>
                        :
                        null
                }
                {
                    this.props.o2oStore[this.props.productId] &&
                    <Item
                        extra={o.couponCode ? (o.couponCode + '元') : ''}
                        onClick={
                            () => {
                                if (this.judgeCanUseCouponList(this.props, 1)) {
                                    this.props.navigation.navigate('CanUseCouponList',
                                        {
                                            productId: this.props.productId,
                                            productNum: this.props.number,
                                            memberCouponId: this.props.couponCode,
                                            sku: o.sku,
                                            type: 'store',
                                        });
                                } else {
                                    const alert = Modal.alert;
                                    const msg1 = '礼品券不可与优惠券/卡券同时使用，请核对要使用的优惠券';
                                    alert(msg1, '', [
                                        { text: '知道了', onPress: () => Log('ok') },
                                    ]);
                                }
                            }
                        }
                        arrow='horizontal' 
                        styles={StyleSheet.create(newStyle)}>店铺优惠券
             </Item>
                }
            </View>
        );
    }
    dataList = (item) => {
        return (
            <TouchableOpacity>
                <View key={item.index} style={{ flexDirection: 'column', marginRight: 16, width: 118 ,marginLeft:10}}>
                    <View>
                        <Image style={{ width: 120, height: 120 }} source={{ uri: item.item.i }} />
                    </View>
                    <View style={{ width: 120 }}>
                        <Text style={{ color: '#666', fontSize: 14, paddingTop: 4, paddingBottom: 10,}}>{item.item.n}</Text>
                    </View>
                </View>
            </TouchableOpacity>

        )
    }
    private onClick = async () => {
        console.log(this.state)
        if (this.state.code != '' && this.state.isWriteOff) {
            console.log('you zhi ')
            var params = {
                c: this.state.code
            }
            const res = await postAppForm('v3/h5/order/checkCodeAndGift.json?c=' + params.c, params.c)
            console.log(res)
            if (res.result) {
                console.log(this.props)
                console.log(dvaStore)
                Toast.info('验证成功', 2);
                this.setState({ isWriteOff: false, code: params.c });
                dvaStore.dispatch(createAction('order/fetchPageInfo')({ isRefresh: true }));

            } else {
                Toast.info(res.message, 2)
            }

        } else {
            console.log('meiyou zhi')
            Toast.info('请输入有效的特权码', 2);
        }

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
}

const styles = EStyleSheet.create({
    header: {
        flexDirection: 'row',
    },
    productTitle: {
        fontSize: Font.NORMAL_1,
        color: Color.BLACK,
        marginLeft: -15,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 10,
    },
    productName: {
        fontSize: 14,
        color: '#333333',
        lineHeight: 16,
    },
    textTitle: {
        marginTop: 2,
        // color: Color.GRAY_1,
        color: '#666',
        fontSize: Font.SMALL_1,
    },
    image: {
        height: 80,
        width: 80,
        backgroundColor: 'lightgray',
        padding: 2,
    },
    priceNumberContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    productAmount: {
        color: Color.ORANGE_1,
    },
    line: {
        width,
        backgroundColor: Color.GREY_4,
        height: 0.5,
        marginLeft: 18,
    },
    flatListStyle: {
        backgroundColor: '#fff',
    },
});
export default ProductInfo;
