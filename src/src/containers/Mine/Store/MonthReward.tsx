import * as React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {INavigation} from '../../../interface';
import {getAppJSON} from '../../../netWork';
import {iPhoneXMarginTopStyle} from '../../../utils';
import Header from '../../../components/Header';
import {UltimateListView} from 'rn-listview';
import {priceFormatter} from './RevenueDetail';

/**
 * 月度奖励
 */
export default class MonthReward extends React.Component<INavigation> {
    private listView;
    private static navigationOptions = ({navigation}) => {
        return {header: <Header goBack={() => navigation.goBack()} title={navigation.state.params.title}/>};
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
                </View>
            </View>
        );
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
                    item.tallyAmount && <View style={styles.contentRow}>
                        <Text style={styles.label}>符合条件销售额：</Text>
                        <Text style={styles.content}>{priceFormatter(`${item.tallyAmount}`)}</Text>
                    </View>

                }
                <View style={styles.contentRow}>
                    <Text style={styles.label}>奖励金额：</Text>
                    <Text style={styles.content}>{priceFormatter(`${item.brokerageDeductAmount}`)}</Text>
                </View>
                {
                    item.gapAmount && <View style={styles.contentRow}>
                        <Text style={styles.label}>下一台阶差额：</Text>
                        <Text style={styles.content}>{priceFormatter(`${item.gapAmount}`)}</Text>
                    </View>
                }
                {
                    item.nextLevelAmount && <View style={styles.contentRow}>
                        <Text style={styles.label}>下一台阶最低奖励金额：</Text>
                        <Text style={styles.content}>{priceFormatter(`${item.nextLevelAmount}`)}</Text>
                    </View>
                }
            </View>
        </View>;
    }
    private onFetch = async (page = 0, startFetch, abortFetch) => {
        try {
            const rewardType = 'Y';
            const pageLimit = 10;
            const {code: type, earningType} = this.props.navigation.state.params;
            const params = {
                earningType,
                type,
                rewardType,
                page: page - 1,
                pageSize: pageLimit,
            };

            const resp = await getAppJSON('v3/mstore/sg/local/myRevenueList.json', params);
            const {success, data} = resp;

            if (!success || !data || !data.rewardY) {
                abortFetch();
                return;
            }

            const {rewardY: list} = data;
            startFetch(list, pageLimit);

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
});
