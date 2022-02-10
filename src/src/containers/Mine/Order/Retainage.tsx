import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Platform,
    InteractionManager,
    ImageBackground,
} from 'react-native';
import * as React from 'react';
import { Button, Toast, TextareaItem} from 'antd-mobile';
import { ICustomContain } from '../../../interface/index';
import { isiPhoneX, width, height, createAction } from '../../../utils';
import {postAppJSON, getAppJSON} from '../../../netWork';
import EStyleSheet from 'react-native-extended-stylesheet';
import Config from 'react-native-config';
import { NavBar } from '../../../components/NavBar';
import {Color, Font} from 'consts';
import { connect } from 'react-redux';

interface IRetainageProps {
    relationOrderSn: string;
}

interface IRetainageState {
    data: any;
    selectedCouponIndex: number;
}

@connect()
class Retainage extends React.Component<ICustomContain & IRetainageProps, IRetainageState> {

    public constructor(props) {
        super(props);

        this.state = {
            data: null,
            selectedCouponIndex: -1,  // 默认不选中任何优惠卷
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

        const optionCard = ({item, Index }) => {
            return (
               <ImageBackground style={[styles.rowContain]} resizeMode='contain' source={require('../../../images/conpon_row_bg.png')}>
                    {/* 左边的单选框 */}
                    <View style={{flex: 1, padding: 5, alignItems: 'center', justifyContent: 'center', opacity: item.canUse ? 1.0 : 0.4}}>
                        <TouchableOpacity  key={Index} onPress={() => this.selectCoupon(item, Index, item.canUse)}>
                            <Image style={{height: 25, width: 25}}
                             source={this.state.selectedCouponIndex === Index ? require('../../../images/ic_select.png') :
                              require('../../../images/ic_check.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    {/* 右边的优惠卷详情 */}
                    <View style={{flex: 4.2, padding: 5, backgroundColor: 'transparent', opacity: item.canUse ? 1.0 : 0.4}}>
                        <View style={{flexDirection: 'row', margin: 2, alignItems: 'flex-end'}}>
                            <Text style={styles.amountStyle}>¥ {item.amount}</Text>
                            <Text style={styles.fullCutPriceDocStyle} >{item.fullCutPriceDoc}</Text>
                        </View>
                        <View style={{flexDirection: 'row', margin: 2, marginTop: 0,}}>
                            <Text style={[styles.tenTextStyle, {color: '#fff', marginRight: 10}]}>{item.userCouponType}</Text>
                            <Text style={[styles.tenTextStyle, {color: '#fff', maxWidth: '85%'}]}>{item.amountDoc}</Text>
                        </View>
                        <View style={{flexDirection: 'row', margin: 2}}>
                            <Text style={[styles.tenTextStyle, {color: '#fff'}]}>使用时间: {item.beginTimeShow} -- </Text>
                            <Text style={[styles.tenTextStyle, {color: '#fff', maxWidth: '60%'}]}>{item.endTimeShow}</Text>
                        </View>
                    </View>
               </ImageBackground>
            );
        };
        const optionCards = [];
        if (this.state.data !== null) {
            const couponListData =   this.state.data.couponList;
            couponListData.forEach( ( item, Index ) => {
                if (item) {
                    const Card = optionCard({item, Index});
                    optionCards.push(Card);
                }
            });
        }

        return (
            <View style={{backgroundColor: '#f1f1f1', flex: 1}}>
                <NavBar title={'可用优惠卷'} />
                {
                    this.state.data !== null &&
                        <View style={{backgroundColor: '#f1f1f1', flex: 1}}>
                        <ScrollView contentContainerStyle={{paddingBottom: 20}} style={{backgroundColor: '#f1f1f1', flex: 1}}>
                        <View style={{alignItems: 'center', padding: 10, marginBottom: 20}}>
                            {/* 优惠卷 */}
                                {optionCards}
                                <View style={{ flex: 1, marginBottom: 25, marginTop: 20, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={[styles.twelveTextStyle, {color: Color.GREY_2}]}>请选择尾款支付优惠券（*选择后将不能更改）</Text>
                                </View>
                                <View style={{ width: '100%', marginBottom: 34, alignItems: 'center', justifyContent: 'center'}}>
                                    <TouchableOpacity
                                        style={{width: '90%'}}
                                        onPress={() => { this.confirm(); }}
                                    >
                                        <View style={styles.submitBtn}>
                                            <Text style={{fontSize: Font.LARGE_2, color: '#fff'}}>确定</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                        </View>
                        </ScrollView>
                        </View>
                }
             </View>
        );
    }
    // 选择优惠卷
    private  selectCoupon = async (item, index, canUse) => {
        if (canUse) {
            // 该优惠卷能使用
            if (this.state.selectedCouponIndex === index) {
                 // 把选择的优惠卷置为-1(取消选中优惠卷)
                this.setState({
                    selectedCouponIndex: -1,
                });
            } else {
                this.setState({
                    selectedCouponIndex: index,
                });
            }
          } else {
            //   把选择的优惠卷置为-1
            this.setState({
                selectedCouponIndex: -1,
            });
          }
    }

    // 确定按钮
    private  confirm = async () => {
        // 获取选中的优惠卷id
        let couponID = '';
        if (this.state.selectedCouponIndex !== -1) {
            // 选中了优惠卷
            const selectedCoupon = this.state.data.couponList[this.state.selectedCouponIndex];
            couponID = selectedCoupon.memberCouponId;
        }

        // 提交
        try {
            const { params } = this.props.navigation.state;
            const fullUrl =  `${Config.SELECT_GOODS_COUPONS1}?relationOrderSn=${params.relationOrderSn}&memberCouponId=${couponID}`;
            const json = await postAppJSON(fullUrl, {});
            console.log('spring -> json = ', json);
            // console.log('zhaoxincheng****', json);
            if (json.success) {
                // 减少“我的”页面上的优惠券数量
                this.props.dispatch(createAction('mine/revokeCoupon')());
                const price = json.data.orderAmount;
                const orderSn = json.data.relationOrderSn;
                const {callBack: refreshOrderList} = params;
                if (refreshOrderList) {
                    refreshOrderList();
                }
                // 跳转到支付页面
                this.props.navigation.navigate('Payment', {
                    orderSn,
                    price,
                });
            } else {
                // 在这里开启发表评价按钮可点击功能
                Toast.fail(json.message, 2);
            }
        } catch (err) {
            // 在这里开启发表评价按钮可点击功能
            alert('使用优惠券失败');
        }
    }

    // 获取数据
    private  getData = async () => {
        try {
            // 查询尾款支付商品优惠券列表
            const { params } = this.props.navigation.state;
            const json = await getAppJSON(Config.SELECT_GOODS_COUPONS0, {
                relationOrderSn: params.relationOrderSn,
            });
            if (json.success) {
                this.setState({data: json.data});
            } else {
                Toast.fail(json.message, 1);
            }
        } catch (err) {
            console.log(err);
        }
    }
}

const styles = EStyleSheet.create({
    rowContain: {
        flexDirection: 'row',
        width: width - 10,
        height: '90rem',
        margin: 4,
        marginLeft: 5,
      },
    amountStyle: {
        fontSize: Font.LARGE,
        fontFamily: 'Helvetica',
        color: '#fff',
        marginRight: 5,
    },
    fullCutPriceDocStyle: {
        fontSize: '12rem',
        color: '#fff',
        maxWidth: '85%',
    },
    selectedView: {
        width: '20rem',
        height: '20rem',
    },
    submitBtn: {
        backgroundColor: Color.BLUE_1,
        borderRadius: 40,
        height: '44rem',
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitBtnText: {
        fontSize: '20rem',
        lineHeight: '50rem',
        color: '#fff',
    },
    tenTextStyle: {
        fontSize: Font.SMALL_1,
    },
    twelveTextStyle: {
        fontSize: '12rem',
    },
});

export default Retainage;
