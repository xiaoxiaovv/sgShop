import * as React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Modal, ScrollView} from 'react-native';
import {INavigation} from '../../../interface';
import {getAppJSON} from '../../../netWork';
import {Flex} from 'antd-mobile';
import {UltimateListView} from 'rn-listview';
import {priceFormatter} from './RevenueDetail';
import {width, height} from '../../../utils';
import Header from '../../../components/Header';


interface IState {
    detailModalShowing: boolean;
    sgDeductionDetails: any[];
}

/**
 * 非预计收益奖励
 */
export default class SomeReward extends React.Component<INavigation, IState> {
    private static navigationOptions = ({navigation}) => {
        return {header: <Header goBack={() => navigation.goBack()} title={navigation.state.params.title}/>};
    }
    private listView;

    public constructor(props) {
        super(props);
        this.state = {
            detailModalShowing: false,
            sgDeductionDetails: [],
        };
    }

    public render(): JSX.Element {
        return (
            <View style={{
                flex: 1,
                backgroundColor: '#F4F4F4',
            }}>
                <View style={[
                    {
                        paddingLeft: 10,
                        paddingRight: 10,
                    },
                ]}>
                    <UltimateListView
                        ref={(ref) => this.listView = ref}
                        onFetch={this.onFetch}
                        keyExtractor={(item, index) => `keys${index}`}
                        refreshableMode='advanced'
                        item={this.renderItem}
                        numColumn={1}
                        separator={() => <View />}
                    />
                    <Modal
                        animationType={'fade'}
                        transparent={true}
                        visible={this.state.detailModalShowing}
                        onRequestClose={() => {this.closeDetailModal()}}
                    >
                        <ModalContent
                            detail={this.state.sgDeductionDetails}
                            closeModal={() => this.closeDetailModal()}
                        />
                    </Modal>
                </View>
            </View>
        );
    }

    private closeDetailModal = () => {
        this.setState({detailModalShowing: false});
    }
    private renderItem = (item): JSX.Element => {
        return <View style={{
            padding: 10,
            backgroundColor: 'white',
            borderRadius: 10,
            marginTop: 10,
        }}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomColor: '#E5E5E5',
                borderBottomWidth: 2,
                paddingBottom: 10,
            }}>
                <Text style={styles.label}>月份：</Text>
                <Text style={styles.content}>{dateFormatter(item.nodeUpdateTime)}</Text>
            </View>
            <View style={{paddingTop: 10}}>
                {
                    item.netActualPrice && <View style={styles.contentRow}>
                        <Text style={styles.label}>金额：</Text>
                        <Text style={styles.content}>{priceFormatter(`${item.netActualPrice}`)}</Text>
                    </View>

                }
                {
                    item.brokerageDeductAmount && <View style={styles.contentRow}>
                        <Text style={styles.label}>奖励：</Text>
                        <Text style={styles.content}>{priceFormatter(`${item.brokerageDeductAmount}`)}</Text>
                    </View>

                }
                {
                    item.sgDeductionDetails && item.sgDeductionDetails.length > 0 && <View
                        style={[
                            styles.contentRow,
                            {justifyContent: 'space-between'},
                        ]}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.label}>抵扣金额：</Text>
                            <Text
                                style={[styles.content, {color: '#FC461E'}]}>{priceFormatter(`${item.deductionAmount}`)}</Text>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => this.setState({sgDeductionDetails: item.sgDeductionDetails},
                                () => this.setState({detailModalShowing: true}))
                            }
                        >
                            <Text style={styles.label}>查看抵扣金额</Text>
                        </TouchableOpacity>
                    </View>

                }
            </View>
        </View>;
    }
    private onFetch = async (page = 0, startFetch, abortFetch) => {
        try {
            const pageLimit = 10;
            const {code: type, earningType, rewardType} = this.props.navigation.state.params;
            const params = {
                earningType,
                type,
                rewardType,
                page: page - 1,
                pageSize: pageLimit,
            };

            const resp = await getAppJSON('v3/mstore/sg/local/myRevenueList.json', params);
            const {success, data} = resp;

            if (!success || !data || !data[`reward${rewardType}`]) {
                abortFetch();
                return;
            }

            startFetch(data[`reward${rewardType}`], pageLimit);

        } catch (err) {
            abortFetch(); // manually stop the refresh or pagination if it encounters network error
            Log(err);
        }
    }
}

const dateFormatter = (timestamp): string => {
    if (!timestamp) {
        return '';
    }

    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthString = month < 10 ? `0${month}` : month;

    return `${year}-${monthString}`;
}

const ModalContent = ({detail, closeModal}) => (
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
            height: height * 0.5,
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
            </View>
            <View style={{
                backgroundColor: 'white',
                paddingBottom: 15,
                paddingRight: 10,
            }}>
                <ScrollView>
                    {
                        detail.map((ele, idx) => (
                            <View key={idx} style={{marginTop: 20}}>
                                <Flex>
                                    <Flex.Item style={[styles.leftTitle]}><Text
                                        style={styles.label}>此单抵扣</Text></Flex.Item>
                                    <Flex.Item
                                        style={styles.rightContent}><Text>{priceFormatter(ele.deductibleAmount)}</Text></Flex.Item>
                                </Flex>
                                <Flex>
                                    <Flex.Item style={[styles.leftTitle]}><Text
                                        style={styles.label}>抵扣单号</Text></Flex.Item>
                                    <Flex.Item style={styles.rightContent}><Text>{ele.reverseNetSn}</Text></Flex.Item>
                                </Flex>
                                <Flex>
                                    <Flex.Item style={[styles.leftTitle]}><Text
                                        style={styles.label}>抵扣类型</Text></Flex.Item>
                                    <Flex.Item style={styles.rightContent}><Text>{ele.deductibleType}</Text></Flex.Item>
                                </Flex>
                            </View>
                        ))
                    }
                </ScrollView>
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
    label: {
        color: '#A0A0A0',
        fontSize: 15,
    },
    content: {
        fontSize: 15,
    },
    contentRow: {
        flexDirection: 'row',
        paddingBottom: 5,
    },
    line: {
        height: 0.5,
        backgroundColor: 'gray',
    },
    leftTitle: {
        marginLeft: 15,
    },
    rightContent: {
        marginLeft: -5,
    },
});
