import * as React from 'react';
import {View, Text, Alert, NativeModules, Platform,Image} from 'react-native';
import { ICustomContain } from '../../interface';
import { UltimateListView } from 'rn-listview';
import CartRow from './CartRow';
import CartFooter from './CartFooter';
import HomeGuessInteresting from './../../containers/Home/SGHomeGuessInteresting';
import { getAppJSON } from '../../netWork';
import Empty from '../../components/Empty';
import { connect, createAction} from '../../utils';
import CouponList from '../../components/Coupon/CouponList';
import { Toast } from 'antd-mobile';
import EStyleSheet from 'react-native-extended-stylesheet';
import { NavBar } from '../../components';
import L from 'lodash';

import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;

interface ICartState {
    edited: boolean;
    seletedRows: string[];
    listData: Array<{ productId: string }>;
    totalPrice: number;
    first: boolean;
    show: boolean;
    price: number;
    brandId: string;
    productId: string;
    productCateId: string;
    footerTitle: string;
    o2oStoreId: string;
    o2oAttrId: string;
    hasRightView: boolean; // 头部是否有右边的按钮
}
@connect(({ home: {bottomData,rid}, users: {mid: storeId, isHost, CommissionNotice}, order, cartModel}) => ({bottomData, rid, storeId, isHost, CommissionNotice, ...order , ...cartModel}))
class Cart extends React.Component<ICustomContain, ICartState> {
    // private static navigationOptions = ({ navigation }) => {
    //     const { params = {} } = navigation.state;
    //     const backShow = getPrevRouteName() == null ? false : true;
    //     return {
    //         header: <Header isShowBackBtn={backShow} goBack={() => navigation.goBack()} title={"购物车"}>
    //             <View style={{ position: 'absolute', right: 5, flexDirection: 'row' }}>
    //                 {params.headerRight ? params.headerRight : null}
    //             </View>
    //         </Header>
    //     };
    private listView: UltimateListView;
    // }
    public constructor(props) {
        super(props);
        this.state = {
            edited: false,
            showCartBackBtn: false,
            seletedRows: [],
            listData: [],
            totalPrice: 0.00,
            show: false,
            price: 0,
            brandId: '',
            productId: '',
            productCateId: '',
            o2oStoreId: '',
            o2oAttrId: '',
            footerTitle: '全选',
            hasRightView: true,
            first: true,
        };
    }

    public componentWillReceiveProps(nextProps) {
        // 切换底部标签初始化购物车选中状态 但是点击右上角的 编辑或者 完成 按钮 不进行初始化
        // this.setState({seletedRows: []});
        // this.calculateTotalPrice();
        // if (this.props.cartList !== nextProps.cartList) {
        //     this.refreshList(nextProps.cartList);
        //     (nextProps.cartList && nextProps.cartList.length > 0) ?
        //         this.props.navigation.setParams({
        //             headerRight: <Button textStyle={{ color: '#666666' }} title={this.state.edited ? '完成' : '编辑'} onPress={this.rightAction} />,
        //         }) :
        //         this.props.navigation.setParams({
        //             headerRight: <View />,
        //         });
        // }
        // if (!nextProps.navigation.state.params.edit) {
        //     if (nextProps.cartList && nextProps.cartList.length > 0) {
        //         this.setState({
        //             edited: false,
        //         }, () => {
        //             this.props.navigation.setParams({
        //                 edit: true,
        //                 headerRight: <Button textStyle={{ color: '#666666' }} title={this.state.edited ? '完成' : '编辑'} onPress={this.rightAction} />,
        //             });
        //         });
        //     }
        // }


        console.log('----componentWillReceiveProps-------');
        console.log(nextProps);
        // this.calculateTotalPrice();
        if (this.props.cartList !== nextProps.cartList) {
            this.refreshList(nextProps.cartList);
            (nextProps.cartList && nextProps.cartList.length > 0) ?
                this.setState({hasRightView: true}) :
                this.setState({hasRightView: false});
        }

        // if (!nextProps.navigation.state.params.edit) {
        //     if (nextProps.cartList && nextProps.cartList.length > 0) {
        //         this.setState({
        //             edited: false,
        //         });
        //     }
        // }
    }

    public componentWillMount() {
        const params = this.props.navigation.state.params;
        const show = L.get(params, 'showCartBackBtn', false);
        this.setState({showCartBackBtn: show});
        // this.props.navigation.setParams({
        //     headerRight: <Button textStyle={{ color: '#666666' }} title={this.state.edited ? '完成' : '编辑'} onPress={this.rightAction} />,
        // });
        // this.fetchList();
        // gio 进入购物车埋点 yl
        NativeModules.StatisticsModule.track('ScView', {});
        //接受百分点推荐返回数据
            let productIds='';
            let bid = '';
            if(Platform.OS === 'ios'){
                bid = 'rec_1709E44E_D612_684E_D33B_34B84DEF194B';
            }else{
                bid = 'rec_C1F146CC_A02E_1C1D_66FE_1695C87587EC';
            }
             NativeModules.BfendModule.recommend(bid,{uid:this.props.storeId.toString() || ''})
                .then((result) => {
                        console.log('jsjsjsjsjsjs',result)
                        const {feedback,rid} = result;
                        feedback.map(a => 
                                productIds+= a.url.substring(1,a.url.indexOf('/',2))+'@'
                                );
                        this.props.dispatch(createAction('home/fetchBottomData')({productIds:productIds.substring(0,productIds.length-1),rid})); 
                })
                .catch((error) => {
                                    
                });
          
            }
    private onFetch = async (page = 1, startFetch, abortFetch) => {
        this.fetchList();
        // abortFetch();
        try {
            const pageLimit = 200;
            let listData = this.state.listData;
            page === 1 && (listData = []);
            const { data: { carts } } = await getAppJSON('v3/h5/cart/list.html');
            Log('carts=====', carts);
            const cartDatas = !carts ? [] : carts;
            listData.push(...cartDatas);
            this.setState({ listData, hasRightView: listData.length > 0 ? true : false }, () => {
                startFetch(cartDatas, pageLimit);
                if (this.state.first) {
                    console.log('---------');
                    this.selectAll(false);
                } else {
                    this.updateData(listData);
                }
            });
        } catch (error) {
            abortFetch();
            // this.props.navigation.setParams({
            //     headerRight: <View />,
            // });
        }
    }
    private selectAll = (selected: boolean): void => {
        this.setState({ seletedRows: selected ? [] : this.state.listData.map(({ productId, skku }) => productId + skku), first: false }
            , () => { this.updateData(this.state.listData); });
    }

    private handleCouponShow = (params) => {
        const { brandId, productId, nowPrice, productCateId, o2oAttrId } = params;
        this.setState({ show: true, brandId, price: nowPrice, productId, productCateId, o2oStoreId: o2oAttrId });
    }



    private rightAction = (): void => {
        // this.setState({
        //     edited: !this.state.edited,
        // },
        //     () => this.props.navigation.setParams({
        //         headerRight: <Button textStyle={{ color: '#666666' }} title={this.state.edited ? '完成' : '编辑'} onPress={this.rightAction} />,
        //     }),
        // );
        this.state.hasRightView && this.setState({edited: !this.state.edited});
    }

    private showDeleteAlert = (productId: number | string, sku: string) => {
        Alert.alert(
            '提示',
            '您确定要删除吗？',
            [
                { text: '取消', onPress: () => Log('Cancel Pressed'), style: 'cancel' },
                { text: '确定', onPress: () => this.deleteItem(productId, sku) },
            ],
            { cancelable: false },
        );
    }

    private deleteItem = async (productId: number | string, sku: string) => {
        const { success } = await getAppJSON('v3/h5/cart/delect.json', { productId, sku });
        if (success) {
            this.fetchList();
            //百分点埋点
            NativeModules.BfendModule.onRmCart(sku,{uid:dvaStore.getState().users.mid?dvaStore.getState().users.mid.toString():''})
        } else {
            //失败提示
        }
    }

    private fetchList = () => {
        this.props.dispatch({
            type: 'cartModel/fetchCartList',
            payload: {},
        });
    }

    private saveSelected = (payload) => {
        this.props.dispatch({
            type: 'cartModel/saveSelect',
            payload,
        });
    }

    private toOrder = () => {
        const { seletedRows, listData } = this.state;
        if (!dvaStore.getState().users.isLogin) {
            this.props.navigation.navigate('Login');
        }
        if (seletedRows.length <= 0) {
            Toast.info('您还没有选择产品', 2);
            return;
        }

        // 调转到订单填写页面所需参数  yl
        let orderInitParams = {
            "proList": [],
            "street": ''
        };
        for (let item of listData) {
            if (seletedRows.indexOf(item.productId + item.skku) !== -1) {
                if (item.attrValueNames) {
                    orderInitParams.proList.push({
                        "proId": item.productId,
                        "num": item.number,
                        "sku": item.skku,
                        "name": item.attrValueNames
                    })
                } else {
                    orderInitParams.proList.push({
                        "proId": item.productId,
                        "num": item.number
                    })
                }
            }
        }
        // gio 购物车结算 埋点 yl
        NativeModules.StatisticsModule.track('ScCheckout', {});
        let payload = {
            orderInitParams
        };
        this.props.dispatch({
            type: 'order/putPageInfo',
            payload,
        });
    }

    private refreshList = (carts) => {
        Log('refresh carts===========', carts);
        let listData = [];
        const cartDatas = !carts ? [] : carts;
        listData.push(...cartDatas);
        this.setState({ listData }, () => this.updateData(listData));
    }

    private updateData = (listData): void => {
        this.listView.updateDataSource(listData);
        this.calculateTotalPrice();
    };

    // private refreshList = async () => {
    //     let listData = [];
    //     const { data: { carts } } = await getAppJSON('v3/h5/cart/list.html');
    //     const cartDatas = !carts ? [] : carts;
    //     listData.push(...cartDatas);
    //     this.setState({ listData }, this.listView.updateDataSource(listData));
    //     this.calculateTotalPrice();
    // }

    private selectAction = (selected, productId: string, skku: string): void => {
        const seletedRows: string[] = this.state.seletedRows;
        const index = seletedRows.indexOf(productId + skku);
        if (selected) {
            index !== -1 && seletedRows.splice(index, 1);
        } else {
            index === -1 && seletedRows.push(productId + skku);
        }
        this.setState({ seletedRows }, () => this.calculateTotalPrice());
    }

    public render(): JSX.Element {
        console.log('this.state.listData.length', this.state.listData.length, this.state.listData.length > 0);
        const { totalCount } = this.props;
        const bottomData = this.props.bottomData;
        const rid = this.props.rid; 
        const gussess = {marginTop:10};
        const emptyImage = require('../../images/ic_haier_6.png');
        const emptyTips = '您的购物车暂无商品\n马上去挑选您钟情的商品吧';
        return (
            <View style={{ flex: 1, backgroundColor: '#EEEEEE' }}>
                <NavBar title={'购物车'}
                    defaultBack={this.state.showCartBackBtn}
                        rightTitleColor={'#666'}
                        rightTitle={this.state.hasRightView ? (this.state.edited ? '完成' : '编辑'):" "}
                        rightFun={this.rightAction}
                        />
                <UltimateListView
                    style={{ flex: 1 }}
                    item={(item) => (
                        <CartRow
                            {...item}
                            selected={this.state.seletedRows.indexOf(item.productId + item.skku) !== -1}
                            edited={this.state.edited}
                            deleteItem={this.showDeleteAlert}
                            selectAction={this.selectAction}
                            handleCouponShow={this.handleCouponShow}
                            refreshList={this.fetchList}
                        />
                    )}
                    ref={(ref) => this.listView = ref}
                    onFetch={this.onFetch}
                    // separator={() => <View style={styles.line} />}
                    keyExtractor={(item, index) => `keys${index}`}
                    emptyView={() => { return <View style={{
                        backgroundColor: '$lightgray',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingBottom:30,
                        paddingTop:30
                        }}>
                            <Image source={emptyImage} style={{height: 0.4*width,width: 0.4*width,resizeMode: 'contain'}}/>
                            <Text style={{ color: '#333333', lineHeight: 20, textAlign: 'center' }}>{emptyTips}</Text>
                        </View> }}
                    footer={()=>{return JSON.stringify(bottomData)!="{}" && <View style={gussess}><HomeGuessInteresting
                        CommissionNotice = {this.props.CommissionNotice}
                        isHost = {this.props.isHost}
                        rid = {rid}
                        navigation={this.props.navigation}
                        dataSource={bottomData}
                        topicTitle = {'猜你喜欢'}
                   /></View>}}
                    refreshableMode={Platform.OS === 'ios' ? 'advanced' : 'basic'}
                // header={() => <CartHeader goodsCount={totalCount} />}
                />
               
                {this.state.listData.length > 0 &&
                    <CartFooter
                        title={this.state.footerTitle}
                        totalPrice={this.state.totalPrice}
                        selectAction={this.selectAll}
                        selected={this.state.seletedRows.length === this.state.listData.length}
                        // settleAction={() => this.props.navigation.navigate('Payment') }
                        settleAction={() => this.toOrder()}
                    />
                }
                <CouponList
                    modalVisible={this.state.show}
                    close={() => this.setState({ show: false })}
                    productId={this.state.productId}
                    brandId={this.state.brandId}
                    cateId={this.state.productCateId}
                    price={this.state.price}
                    o2oStoreId={this.state.o2oStoreId}
                />
            </View>
        );
    }

    private calculateTotalPrice = () => {

        const data = this.state.listData;
        const selectedRows = this.state.seletedRows;
        let sum = 0.00;
        for (const item of data) {
            const index = selectedRows.indexOf(item.productId + item.skku);
            sum += (index > -1 ? Number(item.nowPrice) * Number(item.number) : 0.00);
        }
        this.setState({
            totalPrice: sum,
            footerTitle: selectedRows.length > 0 ? `已选（${selectedRows.length}件)` : '全选',
        });
    }
}
const styles = EStyleSheet.create({
    line: {
        marginLeft: '48rem',
        width,
        height: 1,
        backgroundColor: '#E4E4E4',
    },
});

export default Cart;
