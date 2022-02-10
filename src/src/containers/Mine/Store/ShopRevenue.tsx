import * as React from 'react';
import {Tabs, List, WhiteSpace} from 'antd-mobile';
import {
    ScrollView, View, Text, Dimensions, StyleSheet, Image, Platform, TouchableOpacity
} from 'react-native';
import Chars from '../../../components/Mine/Chars';
import {INavigation} from '../../../interface/index';
import {iPhoneXPaddingTopStyle, IS_NOTNIL} from '../../../utils';
import ScreenUtil from '../../Home/SGScreenUtil';
import {getAppJSON} from '../../../netWork';
import Config from 'react-native-config';
import moment from 'moment';
import { connect } from 'react-redux';
import {Color, Font} from 'consts';
import { Toast } from 'antd-mobile';
import { GET, POST_JSON, GET_P, POST_FORM} from '../../../config/Http';
import url from '../../../config/url';
import SelectBar from 'rn-select-bar';

import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

const barContent = ['佣金', '货款'];
const Item = List.Item;

interface IShopRevenueState {
    trendInfoA:any;
    trendInfo: any;
    range: number;
    earningType: string;
    expectAmount: number;
    canAmount: number;
    reflectAmount: number;
    getAmount: number;
    sumTrend: number;
    maxTrend: number;
    avgTrend: number;
    totalCommission: string;   // 快捷通金额
    notLoginKJTStr: string;   // 未登录快捷通展示的字符串
    KjtToken: string;        // 快捷通token
    bankCardCount: number;
    accountState: number;
    myInComeOut: any;
    pageIndex: boolean;
}

interface IProps {
    wdHostData: any;
}

let d7 = moment().format('MM-DD');
let d6 = moment().subtract(1, 'd').format('MM-DD');
let d5 = moment().subtract(2, 'd').format('MM-DD');
let d4 = moment().subtract(3, 'd').format('MM-DD');
let d3 = moment().subtract(4, 'd').format('MM-DD');
let d2 = moment().subtract(5, 'd').format('MM-DD');
let d1 = moment().subtract(6, 'd').format('MM-DD');

/**
 * 我的营收
 */
@connect(({ mine: { wdHostData } }) => ({ wdHostData }))
class ShopRevenue extends React.Component<INavigation & IProps, IShopRevenueState> {
    public state: IShopRevenueState;

    constructor(props) {
        super(props);
        this.state = {
            trendInfoA:null,
            trendInfo: null,
            range: 7,
            earningType: 'B',
            expectAmount: 0, // 预计收益
            canAmount: 0, // 可提现
            reflectAmount: 0, // 提现中
            getAmount: 0, // 已提现
            sumTrend: 0, // 7天收入
            maxTrend: 0, // 单日最高
            avgTrend: 0, // 日均
            totalCommission: '', // 理财/投资
            notLoginKJTStr: '',
            KjtToken: null,
            bankCardCount: 0, // 绑定银行卡张数
            accountState: 0, // 提现账户状态
            myInComeOut: null, // 是否需要跳转到绑定银行卡页面使用
            pageIndex: 0,
        };
    }

    public componentDidMount() {
        this.loadData();
        this.getTotalCommission();
        this.getBankCardCount();
        this.getAccountState();
    }

    public render(): JSX.Element {
        const {navigation, wdHostData} = this.props;
        console.log('this.setState',this.state);

        return (
            <View style={{flex: 1}}>
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        zIndex: 2,
                        paddingLeft: 16,
                        paddingRight: 10,
                        marginTop: 10 + (ScreenUtil.isiPhoneX ? 44 : (Platform.OS === 'ios' ? 20 : 0)),
                    }}
                    onPress={() => this.props.navigation.goBack()}
                >
                    <Image
                        style={{
                            width: 24,
                            height: 24,
                        }}
                        source={require('../../../images/icon_back_gray.png')}
                    />
                </TouchableOpacity>
                <View style={iPhoneXPaddingTopStyle}>
                    {this.renderTitleView(wdHostData)}
                </View>
                 <ScrollView> 
                    <View style={{flex: 3}}>
                    {this.state.pageIndex == 0 && this.renderTrendView(this.state.trendInfo)}
                    {this.state.pageIndex == 1 && this.renderTrendView(this.state.trendInfoA)}
                    </View>
                    <WhiteSpace/>
                    <View style={{
                        flex: 4,
                    }}>
                        <List>
                            <Item
                                arrow='horizontal'
                                thumb='http://cdn09.ehaier.com/shunguang/H5/www/img/yingshoufive.png'
                                extra={<ExtraText text={this.state.expectAmount}/>}
                                onClick={() => {
                                    this.props.navigation.navigate('RevenueDetail', {
                                        title: '预计收益',
                                        code: '1',
                                        earningType: this.state.earningType,
                                    });
                                }}
                            >
                                预计收益
                            </Item>
                            <Item
                                thumb='http://cdn09.ehaier.com/shunguang/H5/www/img/yingshoutwo.png'
                                extra={<ExtraText text={this.state.canAmount}/>}
                                arrow='horizontal' onClick={() => {
                                this.props.navigation.navigate('RevenueDetail', {
                                    title: '可提现',
                                    code: '2',
                                    earningType: this.state.earningType,
                                });
                            }}
                            >
                                可提现
                            </Item>
                            <Item
                                thumb='http://cdn09.ehaier.com/shunguang/H5/www/img/yingshouone.png'
                                extra={<ExtraText text={this.state.reflectAmount}/>}
                                arrow='horizontal' onClick={() => {
                                this.props.navigation.navigate('RevenueDetail', {
                                    title: '提现中',
                                    code: '3',
                                    earningType: this.state.earningType,
                                });
                            }}
                            >
                                提现中
                            </Item>
                            <Item
                                thumb='http://cdn09.ehaier.com/shunguang/H5/www/img/yingshouthree.png'
                                extra={<ExtraText text={this.state.getAmount}/>}
                                arrow='horizontal' onClick={() => {
                                this.props.navigation.navigate('RevenueDetail', {
                                    title: '已提现',
                                    code: '4',
                                    earningType: this.state.earningType,
                                });
                            }}
                            >
                                已提现
                            </Item>
                            <Item
                                thumb='http://cdn09.ehaier.com/shunguang/H5/www/img/yingshoufour.png'
                                extra={
                                    IS_NOTNIL(this.state.totalCommission) ?
                                    <ExtraText text={this.state.totalCommission}/> :
                                    <Text style={{color: '#FC4A23'}}>{this.state.notLoginKJTStr}</Text>}
                                arrow='horizontal'
                                onClick={() => {
                                    console.log('zhaoxincheng>>>跳转到快捷通界面>>this.state.KjtToken');
                                    this.props.navigation.navigate('MyKJT', {
                                        KjtToken: this.state.KjtToken,
                                        frontPage: 'ShopRevenue',
                                        callBack: () => {
                                            this.getTotalCommission();
                                        },
                                    });
                                }}>
                                快捷通</Item>
                        </List>
                        <TouchableOpacity
                            style={{
                                marginTop: 10,
                                paddingTop: 10,
                                paddingBottom: 10,
                                width: width - 40,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#307DFB',
                                alignSelf: 'center',
                                borderRadius: 3,
                            }}
                            onPress={() => {
                                if (this.state.accountState === 1 ||
                                    this.state.accountState === 2 ||
                                    this.state.accountState === 3 ||
                                    parseInt(`this.state.bankCardCount`, 10) > 0
                                ) {
                                    //navigation.navigate('BankCardManagement');
                                    this.props.navigation.navigate('CustomWebView', {
                                        customurl: `${URL.H5_HOST}mentionCenter/${this.state.canAmount}`,
                                        flag: true,
                                        headerTitle: '提现管理',
                                        callBack: ()=>{
                                            console.log('----------------callBack--------');
                                            this.loadData();
                                            this.getBankCardCount();
                                            this.getAccountState();
                                        }
                                    });
                                }
                            }}
                        >
                            <Text style={{color: 'white'}}>提现</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('AgreementWebview',
                                {helpId: 15, title: '营收结算规则'})}
                        >
                            <Text style={{
                                color: '#9EA8BB',
                                fontSize: 15,
                                textDecorationLine: 'underline',
                                alignSelf: 'center',
                                marginTop: 10,
                                marginBottom: 5,
                            }}>营收结算规则</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }

    renderTitleView=(wdHostData)=>{
        return(
            <SelectBar
                style={styles.naviTitle}
                selectTitleStyle={styles.selectTitleStyle}
                selectLineStyle={[styles.selectLineStyle, !(wdHostData && wdHostData.merchants)  && styles.singleTabLine]}
                content={(wdHostData && wdHostData.merchants) ? barContent : barContent.slice(0, 1)}
                selectedItem={barContent[this.state.pageIndex]}
                onPress={(item, index) => {
                    this.setState({pageIndex: index, earningType: 0 === index ? 'B' : 'A'},
                        () => this.loadData());
                }}
            />
        );
    }

    renderTrendView=(trendInfo)=>{
        return(
            <View style={{flex: 1}}>
                <View style={{flex: 7}}>
                    {trendInfo && <Chars lineData={trendInfo}/>}
                </View>
                <View style={styles.summaryBlock}>
                    <View>
                        <Text style={styles.summaryMoney}>{priceFormatter(this.state.sumTrend)}</Text>
                        <Text style={styles.summaryText}>7天收入</Text>
                    </View>
                    <View>
                        <Text style={styles.summaryMoney}>{priceFormatter(this.state.maxTrend)}</Text>
                        <Text style={styles.summaryText}>单日最高</Text>
                    </View>
                    <View>
                        <Text style={styles.summaryMoney}>{priceFormatter(this.state.avgTrend)}</Text>
                        <Text style={styles.summaryText}>日均</Text>
                    </View>
                </View>
            </View>
        );
    }

    private loadData = async () => {
        const res = await getAppJSON(
            '/v3/mstore/sg/local/wdRevenue.json',
            {
                range: this.state.range,
                earningType: this.state.earningType,
            },
        );

        if (res.success && res.data && res.data.myInComeOut) {
            this.setState({
                expectAmount: res.data.myInComeOut.expectAmount,
                canAmount: res.data.myInComeOut.canAmount,
                reflectAmount: res.data.myInComeOut.reflectAmount,
                getAmount: res.data.myInComeOut.getAmount,
                myInComeOut: res.data.myInComeOut,
            });
        }else {
            this.setState({
                expectAmount: 0,
                canAmount: 0,
                reflectAmount: 0,
                getAmount: 0,
                myInComeOut: 0,
            });
        }

        if (res.success && res.data && res.data.myTrendOut) {
            if(res.data.earningType==='A'){
                this.setState({
                    trendInfoA:res.data.myTrendOut.trendInfo,
                    sumTrend: res.data.myTrendOut.sumTrend,
                    maxTrend: res.data.myTrendOut.maxTrend,
                    avgTrend: res.data.myTrendOut.avgTrend,
                })
            }else {
                this.setState({
                    trendInfo: res.data.myTrendOut.trendInfo,
                    sumTrend: res.data.myTrendOut.sumTrend,
                    maxTrend: res.data.myTrendOut.maxTrend,
                    avgTrend: res.data.myTrendOut.avgTrend,
                });
            }
        } else {
            this.setState({
                trendInfo:null,
            });
        }
    }
    // 获取快捷通金额
    private getTotalCommission = async () => {
        try {
            // 获取快捷通token和金额
            const json = await GET(url.GETKJTACCOUNT, null, null, null, null, true);
            if (json.success) {
                // 登录过快捷通了
                console.log('zhaoxincheng>>getTotalCommission>', json);
                this.setState({
                    totalCommission: json.data.a, // 快捷通金额
                    KjtToken: json.data.t, // 快捷通token
                });
            } else {
                // 未登录快捷通
                this.setState({
                    notLoginKJTStr: json.message,
                    });
            }
        } catch (err) {
            Log(err);
        }
    }
    private getBankCardCount = async () => {
        const resp = await getAppJSON('v3/kjt/bank/bankCardCount.json');
        const {success, data} = resp;
        if (success && data) {
            this.setState({bankCardCount: data});
        }
    }
    private getAccountState = async () => {
        const params = {
            earningType: this.state.earningType,
        };
        const resp = await getAppJSON('v3/kjt/sg/wdWithdraw.html', params);
        const {success, data} = resp;
        if (success && data) {
            this.setState({accountState: data});
        }
    }
}

const priceFormatter = (price: number) => '¥' + numberWithCommas(parseFloat(`${price}`).toFixed(2));

export const ExtraText = ({text}) => {
    console.log('spring -> ExtraText -> text = ', text);
    return <Text style={{color: '#FC4A23'}}>¥{numberWithCommas(parseFloat(text || '0').toFixed(2))}</Text>
}

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const styles = StyleSheet.create({
    summaryBlock: {
        flex: 3,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: height * 3 / 7 * 0.2,
    },
    summaryMoney: {
        color: '#000000',
    },
    summaryText: {
        color: '#BABABA',
    },
    title: {
        color: Color.BLACK_1,
        fontSize: Font.LARGE_2,
    },
    naviTitle: {
        width: width,
        height: 44,
        backgroundColor: 'white',
        marginBottom: 1,
    },
    selectTitleStyle: {
        fontSize: Font.LARGE_3,
        color: Color.BLACK_1,
    },
    normalTitleStyle: {
        color: Color.BLACK_1,
    },
    selectLineStyle: {
        height: 1,
        width: width/2,
        backgroundColor: Color.BLUE_6,
    },
    singleTabLine: {
        width: width,
    },
});

export default ShopRevenue;
