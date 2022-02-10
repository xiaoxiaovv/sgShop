import * as React from 'react';
import {
    View,
    ScrollView,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Modal,
    TouchableHighlight,
} from 'react-native';
import {INavigation} from '../../../interface';
import {fetchService, getAppJSON, postAppJSON} from '../../../netWork';
import {UltimateListView} from 'rn-listview';
import {Flex} from 'antd-mobile';
import Header from '../../../components/Header';

import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

interface IState {
    beginDate: string;
    endDate: string;
    detailModalShowing: boolean;
    revenue: object;
}

class CommissionDetail extends React.Component<INavigation, IState> {
    private listView;

    public constructor(props) {
        super(props);
        const {start, end} = this.props.navigation.state.params;
        this.state = {
            beginDate: start || '',
            endDate: end || '',
            detailModalShowing: false,
            revenue: {},
        };
    }

    public render(): JSX.Element {
        return (
            <View style={{flex: 1, backgroundColor: '#F4F4F4'}}>
                <Header goBack={() => this.props.navigation.goBack()} title={this.props.navigation.state.params.title}/>
                <UltimateListView
                    ref={(ref) => this.listView = ref}
                    onFetch={this.onFetch}
                    keyExtractor={(item, index) => `keys${index}`}
                    refreshableMode='advanced'
                    item={this.renderItem}
                    numColumn={1}
                    separator={() => <View style={styles.line}/>}
                />
                <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={this.state.detailModalShowing}
                    onRequestClose={() => {
                        alert('Modal has been closed.');
                    }}>
                    <ModalContent
                        revenue={this.state.revenue}
                        closeModal={() => this.closeDetailModal()}
                        code={this.props.navigation.getParam('code')}
                    />
                </Modal>
            </View>
        );
    }

    private onFetch = async (page = 0, startFetch, abortFetch) => {
        try {
            const pageLimit = 10;
            const {title, code, earningType} = this.props.navigation.state.params;
            const params = {
                earningType,
                type: code,
                rewardType: '',
                page: page - 1,
                pageSize: pageLimit,
                beginDate: this.state.beginDate,
                endDate: this.state.endDate,
            };

            console.log('params is: ', params);

            const resp = await getAppJSON('v3/mstore/sg/local/myRevenueList.json', params);
            const {success, data} = resp;

            console.log('data is: ', data);

            if (!success || !data) {
                abortFetch();
                return;
            }

            const {list} = data;
            startFetch(list, pageLimit);

        } catch (err) {
            abortFetch(); // manually stop the refresh or pagination if it encounters network error
            Log(err);
        }
    }
    private renderItem = (item, index) => (
        <View style={{
            flexDirection: 'row',
            backgroundColor: 'white',
            padding: 10,
            marginTop: 10,
        }}>
            <Image
                style={{
                    width: 80,
                    height: 80,
                }}
                source={{uri: item.productImageUrl}}
            />
            <View style={{
                paddingLeft: 10,
                flex: 1,
                justifyContent: 'space-between',
            }}>
                <Text style={styles.title}>{item.productName}</Text>
                <Text style={styles.subTitle}>单号：{item.netSn}</Text>
                <Text style={styles.subTitle}>下单人： {item.mobile}</Text>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                    <Text style={[styles.title, styles.moneyText]}>佣金：
                        ¥{parseFloat(item.brokerageDeductAmount).toFixed(2)}</Text>
                    <TouchableOpacity onPress={() => this.setState({revenue: item, detailModalShowing: true})}>
                        <Text style={styles.subTitle}>查看详情</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
    private closeDetailModal = () => {
        this.setState({detailModalShowing: false});
    }
}

const ModalContent = ({revenue, closeModal, code}) => (
    <View
        style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }}
    >
        <View style={{
            width: width * 0.7,
            borderRadius: 15,
        }}>
            <View style={{
                paddingTop: 15,
                paddingBottom: 10,
                alignItems: 'center',
                backgroundColor: 'white',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                borderBottomColor: '#E4E4E4',
                borderBottomWidth: 1,
            }}>
                <Text style={{fontSize: 16, marginBottom: 10}}>佣金详情</Text>
                <Text style={{color: '#808080', fontSize: 14}}>{revenue.createTime}创建</Text>
            </View>
            <View style={{
                backgroundColor: 'white',
                paddingBottom: 15,
            }}>
                {
                    code === '1' &&
                    <View style={styles.commissionDetailRowView}>
                        <Flex>
                            <Flex.Item><Text style={styles.commissionDetailRowLeftText}>类型</Text></Flex.Item>
                            <Flex.Item><Text
                                style={styles.commissionDetailRowRightText}>{revenue.rewardTypeStr}</Text></Flex.Item>
                        </Flex>
                    </View>
                }
                <View style={styles.commissionDetailRowView}>
                    <Flex>
                        <Flex.Item><Text style={styles.commissionDetailRowLeftText}>状态</Text></Flex.Item>
                        <Flex.Item><Text
                            style={styles.commissionDetailRowRightText}>{revenue.nodeStateStr}</Text></Flex.Item>
                    </Flex>
                </View>
                <View style={styles.commissionDetailRowView}>
                    <Flex>
                        <Flex.Item><Text style={styles.commissionDetailRowLeftText}>商品数量</Text></Flex.Item>
                        <Flex.Item>
                            <Text style={styles.commissionDetailRowRightText}>{revenue.productCount}件</Text>
                        </Flex.Item>
                    </Flex>
                </View>
                <View style={styles.commissionDetailRowView}>
                    <Flex>
                        <Flex.Item><Text style={styles.commissionDetailRowLeftText}>金额</Text></Flex.Item>
                        <Flex.Item>
                            <Text style={styles.commissionDetailRowRightText}>
                                ¥{parseFloat(revenue.netActualPrice).toFixed(2)}
                            </Text>
                        </Flex.Item>
                    </Flex>
                </View>
                <View style={styles.commissionDetailRowView}>
                    <Flex>
                        <Flex.Item><Text style={styles.commissionDetailRowLeftText}>提成</Text></Flex.Item>
                        <Flex.Item>
                            <Text style={styles.commissionDetailRowRightText}>{revenue.brokeragePersent}%</Text>
                        </Flex.Item>
                    </Flex>
                </View>
                <View style={styles.commissionDetailRowView}>
                    <Flex>
                        <Flex.Item><Text style={styles.commissionDetailRowLeftText}>收益</Text></Flex.Item>
                        <Flex.Item>
                            <Text style={styles.commissionDetailRowRightText}>
                                ￥{parseFloat(revenue.brokerageDeductAmount).toFixed(2)}元
                            </Text>
                        </Flex.Item>
                    </Flex>
                </View>
                {
                    code !== '1' &&
                    revenue.sgDeductionDetails && revenue.sgDeductionDetails.length > 0 &&
                    <View style={styles.commissionDetailRowView}>
                        <Flex>
                            <Flex.Item><Text style={styles.commissionDetailRowLeftText}>抵扣金额</Text></Flex.Item>
                            <Flex.Item>
                                <Text style={styles.commissionDetailRowRightText}>
                                    ￥{parseFloat(revenue.deductionAmount).toFixed(2)}元
                                </Text>
                            </Flex.Item>
                        </Flex>
                    </View>
                }
                {
                    code !== '1' &&
                    revenue.sgDeductionDetails && revenue.sgDeductionDetails.length > 0 &&
                    <View style={{
                        borderTopColor: '#E4E4E4',
                        borderTopWidth: 1,
                        marginTop: 10,
                        height: 120,
                    }}>
                        <ScrollView showsVerticalScrollIndicator={true}>
                            {
                                revenue.sgDeductionDetails.map((item, index) => {
                                    return <View key={index}>
                                        <View style={styles.commissionDetailRowView}>
                                            <Flex>
                                                <Flex.Item><Text
                                                    style={styles.deductionDetailText}>抵扣单号</Text></Flex.Item>
                                                <Flex.Item>
                                                    <Text style={styles.deductionDetailText}>
                                                        {item.reverseNetSn}
                                                    </Text>
                                                </Flex.Item>
                                            </Flex>
                                        </View>
                                        <View style={styles.commissionDetailRowView}>
                                            <Flex>
                                                <Flex.Item><Text
                                                    style={styles.deductionDetailText}>抵扣类型</Text></Flex.Item>
                                                <Flex.Item>
                                                    <Text style={styles.deductionDetailText}>
                                                        {item.deductibleType}
                                                    </Text>
                                                </Flex.Item>
                                            </Flex>
                                        </View>
                                        <View style={styles.commissionDetailRowView}>
                                            <Flex>
                                                <Flex.Item><Text
                                                    style={styles.deductionDetailText}>此单抵扣</Text></Flex.Item>
                                                <Flex.Item>
                                                    <Text style={styles.deductionDetailText}>
                                                        ￥{parseFloat(item.deductibleAmount).toFixed(2)}元
                                                    </Text>
                                                </Flex.Item>
                                            </Flex>
                                        </View>
                                    </View>;
                                })
                            }
                        </ScrollView>
                    </View>
                }

            </View>
            <TouchableOpacity
                style={{
                    borderTopColor: '#E4E4E4',
                    borderTopWidth: 1,
                    padding: 15,
                    alignItems: 'center',
                    backgroundColor: 'white',
                    borderBottomLeftRadius: 15,
                    borderBottomRightRadius: 15,
                }}
                activeOpacity={0.9}
                onPress={() => closeModal()}
            >
                <Text style={{color: '#327EFB', fontSize: 16}}>确定</Text>
            </TouchableOpacity>
        </View>
    </View>
)

const styles = StyleSheet.create({
    line: {
        height: 0.5,
        backgroundColor: 'gray',
    },
    title: {
        fontSize: 14,
    },
    subTitle: {
        fontSize: 12,
        color: '#939393',
    },
    moneyText: {
        color: '#FC613F',
    },
    commissionDetailRowView: {
        paddingTop: 10,
    },
    commissionDetailRowLeftText: {
        marginLeft: 30,
        fontSize: 16,
        color: '#9F9F9F',
    },
    commissionDetailRowRightText: {
        marginLeft: 30,
        fontSize: 16,
    },
    deductionDetailText: {
        marginLeft: 30,
        color: '#7A87A3',
        fontSize: 14,
    },
    ballWrappingView: {
        width: 30,
        borderRadius: 15,
        backgroundColor: 'yellow',
    },
});

export default CommissionDetail;
