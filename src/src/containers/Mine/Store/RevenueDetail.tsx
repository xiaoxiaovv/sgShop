import * as React from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {INavigation} from '../../../interface';
import Header from '../../../components/Header';
import {List, Modal} from 'antd-mobile';
import {ExtraText} from './ShopRevenue';
import {getAppJSON} from '../../../netWork';
import CommissionDetail from './CommissionDetail';
import OtherReward from './OtherReward';
import {Calendar} from 'react-native-calendars';

const Item = List.Item;
const Brief = Item.Brief;

interface IReward {
    expectBrokerage: string;
    expectMonth: string;
    nowGapAmount: string;
    nextLevelAmount: string;
    expectOpen: string;
    expectOpenCommend: string;
    expectRecommend: string;
    expectDzLeader: string;
    expectLeader: string;
    expectXyAmount: string;
    expectThreeLevel: string;
    expectOtherAmount: string;
}

interface IRewardO {
    expectBrokerage: string;
    expectMonth: string;
    expectOpen: string;
    expectOpenCommend: string;
    expectRecommend: string;
    expectDzLeader: string;
    expectLeader: string;
    expectXyAmount: string;
    expectThreeLevel: string;
    expectOtherAmount: string;
}

interface IState {
    total: string;
    reward: IReward;
    rewardO: IRewardO;
    isRewardA: boolean;
    isRewardB: boolean;
    isRewardC: boolean;
    isRewardY: boolean;
    isRewardZ: boolean;
    isRewardTZ: boolean;
    isRewardD: boolean;
    isRewardXY: boolean;
    beginDate: string;
    endDate: string;
    pageIsEmpty: boolean;
    showDateModal: boolean;
    currentSelectedDate: any;
    calendarBeginDate: any;
    calendarEndDate: any;
}

enum DateSwitch {
    StartDate,
    EndDate,
}

class RevenueDetail extends React.Component<INavigation, IState> {
    public static navigationOptions = ({navigation, screenProps}) => ({
        header: null
    })
    private dateSwitch = DateSwitch.StartDate;

    public constructor(props) {
        super(props);
        this.state = {
            total: '0',
            reward: { // ??????????????????
                expectMonth: null,
                nowGapAmount: '0',
                nextLevelAmount: '0',
                expectBrokerage: null,
                expectOpen: null, // ????????????
                expectOpenCommend: null, // ??????????????????
                expectRecommend: null, // ?????????????????????
                expectDzLeader: null, // ????????????
                expectLeader: null, // ????????????
                expectXyAmount: null, // ????????????
                expectThreeLevel: null, // ????????????
                expectOtherAmount: null, // ????????????
            },
            rewardO: { // ?????????????????????
                expectBrokerage: null, // ??????
                expectMonth: null, // ????????????
                expectOpen: null, // ????????????
                expectOpenCommend: null, // ??????????????????
                expectRecommend: null, // ?????????????????????
                expectDzLeader: null, // ????????????
                expectLeader: null, // ????????????
                expectXyAmount: null, // ????????????
                expectThreeLevel: null, // ????????????
                expectOtherAmount: null, // ????????????
            },
            isRewardA: false,
            isRewardB: false,
            isRewardC: false,
            isRewardY: false,
            isRewardZ: false,
            isRewardTZ: false,
            isRewardD: false,
            isRewardXY: false,
            beginDate: getStartTime(),
            endDate: getDesignatedTime(new Date()),
            pageIsEmpty: false,
            showDateModal: false, // ?????????????????????
            currentSelectedDate: new Date(),
            calendarBeginDate: undefined, // ??????????????????????????????????????????????????????????????????
            calendarEndDate: undefined, // ????????????????????????
        };
    }

    public componentDidMount() {
        this.loadData();
    }

    public render(): JSX.Element {
        const {title, code, earningType} = this.props.navigation.state.params;
        const {navigation} = this.props;
        let commissionIcon = null;
        switch (code) {
            case '1':
                commissionIcon = require('../../../images/yingshoufive.png');
                break;
            case '2':
                commissionIcon = require('../../../images/yingshoutwo.png');
                break;
            case '3':
                commissionIcon = require('../../../images/yingshouone.png');
                break;
            default:
                commissionIcon = require('../../../images/yingshouthree.png');
                break;
        }
        return (
            <View style={{flex: 1}}>
                <Header {...this.props} title={this.props.navigation.state.params.title}/>
                {
                    this.state.pageIsEmpty ? <View style={{
                        flex: 1,
                    }}>
                        <View style={{flex: 1}}/>
                        <View style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Image source={require('../../../images/zhanweitu.png')}/>
                            <Text style={{marginTop: 10}}>?????????????????????0???????????????????????????</Text>
                        </View>
                        <View style={{flex: 2}}/>
                    </View>
                        :
                        <ScrollView style={{backgroundColor: '#EEEEEE', flex: 1}}>
                            <List renderHeader={() => (
                                '4' === code ?
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingLeft: 16,
                                        paddingRight: 16,
                                        paddingTop: 10,
                                        paddingBottom: 10,
                                    }}>
                                        <Text>{`?????????${priceFormatter(this.state.total)}`}</Text>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}>
                                            <TouchableOpacity
                                                style={styles.datePicker}
                                                activeOpacity={0.8}
                                                onPress={
                                                    () => {
                                                        this.dateSwitch = DateSwitch.StartDate;
                                                        this.setState({
                                                            showDateModal: true,
                                                            currentSelectedDate: this.state.calendarBeginDate ?
                                                                this.state.calendarBeginDate : this.state.currentSelectedDate,
                                                        });
                                                    }
                                                }
                                            >
                                                <Text>{timeFilterForAngularJs(this.state.beginDate)}</Text>
                                            </TouchableOpacity>
                                            <Text style={{color: '#CACACA'}}> - </Text>
                                            <TouchableOpacity
                                                style={styles.datePicker}
                                                activeOpacity={0.8}
                                                onPress={
                                                    () => {
                                                        this.dateSwitch = DateSwitch.EndDate;
                                                        this.setState({
                                                            showDateModal: true,
                                                            currentSelectedDate: this.state.calendarEndDate ?
                                                                this.state.calendarEndDate : this.state.currentSelectedDate,
                                                        });
                                                    }
                                                }
                                            >
                                                <Text>{timeFilterForAngularJs(this.state.endDate)}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    :
                                    `?????????${priceFormatter(this.state.total)}`
                            )}>
                                {/* ?????????????????? */}
                                {
                                    this.state.reward.expectBrokerage && <Item
                                        arrow='horizontal'
                                        thumb={<Image style={styles.itemIconStyle} source={commissionIcon}/>}
                                        extra={<ExtraText text={this.state.reward.expectBrokerage}/>}
                                        onClick={() => {
                                            navigation.navigate('CommissionDetail', {
                                                code,
                                                title: '??????',
                                                earningType,
                                            });
                                        }}>
                                        ??????
                                    </Item>
                                }
                                {
                                    '1' === code && <Item
                                        arrow='horizontal'
                                        thumb={<Image style={styles.itemIconStyle}
                                                      source={require('../../../images/yingshoufive.png')}/>}
                                        extra={<ExtraText text={this.state.reward.expectMonth || ''}/>}
                                        multipleLine
                                        onClick={() => {
                                            if (this.state.reward.expectMonth) {
                                                navigation.navigate('MonthReward', {
                                                    code,
                                                    title: '????????????',
                                                    earningType,
                                                });
                                            } else {
                                                Log('?????????');
                                            }
                                        }}
                                    >
                                        ????????????
                                        <Brief style={{fontSize: 12}}>
                                            ???????????????{priceFormatter(this.state.reward.nowGapAmount)}?????????????????????{
                                            priceFormatter(this.state.reward.nextLevelAmount)}????????????
                                        </Brief>
                                    </Item>
                                }
                                {this.renderListItem(this.state.reward.expectOpen, '????????????')}
                                {this.renderListItem(this.state.reward.expectOpenCommend, '??????????????????')}
                                {this.renderListItem(this.state.reward.expectRecommend, '?????????????????????')}
                                {this.renderListItem(this.state.reward.expectDzLeader, '????????????')}
                                {this.renderListItem(this.state.reward.expectLeader, '????????????')}
                                {this.renderListItem(this.state.reward.expectXyAmount, '????????????')}
                                {this.renderListItem(this.state.reward.expectThreeLevel, '????????????')}
                                {this.renderListItem(this.state.reward.expectOtherAmount, '????????????')}
                                {/* ????????????????????? */}
                                {
                                    this.renderRewardListItem(this.state.rewardO.expectBrokerage,
                                        '??????',
                                        () => this.props.navigation.navigate('CommissionDetail', {
                                            code,
                                            title: '??????',
                                            earningType,
                                            start: this.state.beginDate,
                                            end: this.state.endDate,
                                        }),
                                        this.state.rewardO.expectBrokerage,
                                    )
                                }
                                {
                                    this.renderRewardListItem(this.state.isRewardY,
                                        '????????????',
                                        () => this.props.navigation.navigate('MonthReward', {
                                            code,
                                            title: '????????????',
                                            earningType,
                                        }),
                                        this.state.rewardO.expectMonth,
                                    )
                                }
                                {
                                    this.renderRewardListItem(this.state.isRewardA,
                                        '????????????',
                                        () => this.props.navigation.navigate('SomeReward', {
                                            code,
                                            title: '????????????',
                                            earningType,
                                            rewardType: 'A',
                                        }),
                                        this.state.rewardO.expectOpen,
                                    )
                                }
                                {
                                    this.renderRewardListItem(this.state.isRewardB,
                                        '??????????????????',
                                        () => this.props.navigation.navigate('SomeReward', {
                                            code,
                                            title: '??????????????????',
                                            earningType,
                                            rewardType: 'B',
                                        }),
                                        this.state.rewardO.expectOpenCommend,
                                    )
                                }
                                {
                                    this.renderRewardListItem(this.state.isRewardZ,
                                        '?????????????????????',
                                        () => this.props.navigation.navigate('SomeReward', {
                                            code,
                                            title: '?????????????????????',
                                            earningType,
                                            rewardType: 'Z',
                                        }),
                                        this.state.rewardO.expectRecommend,
                                    )
                                }
                                {
                                    this.renderRewardListItem(this.state.isRewardD,
                                        '????????????',
                                        () => this.props.navigation.navigate('SomeReward', {
                                            code,
                                            title: '????????????',
                                            earningType,
                                            rewardType: 'D',
                                        }),
                                        this.state.rewardO.expectDzLeader,
                                    )
                                }
                                {
                                    this.renderRewardListItem(this.state.isRewardC,
                                        '????????????',
                                        () => this.props.navigation.navigate('SomeReward', {
                                            code,
                                            title: '????????????',
                                            earningType,
                                            rewardType: 'C',
                                        }),
                                        this.state.rewardO.expectLeader,
                                    )
                                }
                                {
                                    this.renderRewardListItem(this.state.isRewardXY,
                                        '????????????',
                                        () => this.props.navigation.navigate('SomeReward', {
                                            code,
                                            title: '????????????',
                                            earningType,
                                            rewardType: 'XY',
                                        }),
                                        this.state.rewardO.expectXyAmount,
                                    )
                                }
                                {
                                    this.renderRewardListItem(this.state.isRewardTZ,
                                        '????????????',
                                        () => this.props.navigation.navigate('SomeReward', {
                                            code,
                                            title: '????????????',
                                            earningType,
                                            rewardType: 'TZ',
                                        }),
                                        this.state.rewardO.expectThreeLevel,
                                    )
                                }
                                {
                                    this.renderRewardListItem(this.state.rewardO.expectOtherAmount,
                                        '????????????',
                                        () => this.props.navigation.navigate('OtherReward', {
                                            code,
                                            title: '????????????',
                                            earningType,
                                        }),
                                        this.state.rewardO.expectOtherAmount,
                                    )
                                }
                            </List>
                            <Modal
                                visible={this.state.showDateModal}
                                transparent
                                maskClosable={false}
                                onClose={this.closeDateModal}
                                title={<Text style={{color: '#00adf5', fontSize: 14}}>???????????????</Text>}
                                footer={[{
                                    text: <Text style={{color: '#00adf5', fontSize: 14}}>??????</Text>,
                                    onPress: () => this.closeDateModal()
                                }]}
                            >
                                <Calendar
                                current={this.state.currentSelectedDate}
                                Default={undefined}
                                maxDate={new Date()}
                                onDayPress={(day) => this.onSelectDate(day)}
                                onDayLongPress={(day) => Log('selected day', day)}
                                monthFormat={'yyyy MM'}
                                onMonthChange={(month) => Log('month changed', month)}
                                hideArrows={false}
                                hideExtraDays={true}
                                disableMonthChange={true}
                                firstDay={1}
                                hideDayNames={true}
                                showWeekNumbers={true}
                                onPressArrowLeft={substractMonth => substractMonth()}
                                onPressArrowRight={addMonth => addMonth()}
                                theme={{
                                    backgroundColor: '#ffffff',
                                    calendarBackground: '#ffffff',
                                    textSectionTitleColor: '#b6c1cd',
                                    selectedDayBackgroundColor: '#00adf5',
                                    selectedDayTextColor: '#ffffff',
                                    todayTextColor: '#00adf5',
                                    dayTextColor: '#2d4150',
                                    textDisabledColor: '#d9e1e8',
                                    dotColor: '#00adf5',
                                    selectedDotColor: '#ffffff',
                                    arrowColor: '#00adf5',
                                    monthTextColor: '#00adf5',
                                    textDayFontSize: 16,
                                    textMonthFontSize: 16,
                                    textDayHeaderFontSize: 16,
                                }}
                            />
                        </Modal>
                    </ScrollView>
                }
            </View>
        );
    }

    private closeDateModal = () => this.setState({showDateModal: false})
    private onSelectDate = (date) => {
        if (DateSwitch.StartDate === this.dateSwitch) {
            this.setState({
                beginDate: getDesignatedTime(new Date(date.timestamp)),
                showDateModal: false,
                calendarBeginDate: date,
            }, () => this.loadData());
        } else {
            this.setState({
                endDate: getDesignatedTime(new Date(date.timestamp)),
                showDateModal: false,
                calendarEndDate: date,
            }, () => this.loadData());
        }
    }

    private async loadData() {
        const rewardType = 'all';
        const page = 0;
        const pageSize = 10;

        const {code, earningType} = this.props.navigation.state.params;
        const param: any = {
            earningType,
            type: code,
            rewardType,
            page,
            pageSize,
        };

        if ('4' === code) {
            param.beginDate = this.state.beginDate;
            param.endDate = this.state.endDate;
        }

        const res = await getAppJSON('v3/mstore/sg/local/myRevenueList.json', param);

        try {
            const {success, data} = res;

            if (success && data) {
                const {
                    total,
                    reward,
                    rewardO,
                    rewardA,
                    rewardB,
                    rewardC,
                    rewardY,
                    rewardZ,
                    rewardTZ,
                    rewardD,
                    rewardXY,
                } = data;

                this.setState({total});

                if (reward) {
                    this.setState({reward});
                }

                if (rewardO) {
                    this.setState({rewardO});
                }

                if (rewardA) {
                    this.setState({isRewardA: true});
                }
                if (rewardB && rewardB.length !== 0) {
                    this.setState({isRewardB: true});
                }
                if (rewardC && rewardC.length !== 0) {
                    this.setState({isRewardC: true});
                }
                if (rewardY && rewardY.length !== 0) {
                    this.setState({isRewardY: true});
                }
                if (rewardZ && rewardZ.length !== 0) {
                    this.setState({isRewardZ: true});
                }
                if (rewardTZ && rewardTZ.length !== 0) {
                    this.setState({isRewardTZ: true});
                }
                if (rewardD && rewardD.length !== 0) {
                    this.setState({isRewardD: true});
                }
                if (rewardXY && rewardXY.length !== 0) {
                    this.setState({isRewardXY: true});
                }

                if (1 !== code && '0' === total && '' === rewardO.expectBrokerage &&
                    '' === rewardO.expectMonth && '' === rewardO.expectOpen && '' === rewardO.expectOpenCommend &&
                    '' === rewardO.expectRecommend && '' === rewardO.expectLeader && '' === rewardO.expectDzLeader &&
                    '' === rewardO.expectXyAmount && '' === rewardO.expectThreeLevel) {
                    this.setState({pageIsEmpty: true});
                }
            }

            Log('loadData -> res: ', res);
        } catch (err) {
            Log('loadData -> err: ', err);
        }
    }

    private renderListItem(property: string, text: string): JSX.Element {
        if (property) {
            return <Item
                thumb={<Image style={styles.itemIconStyle} source={require('../../../images/yingshoufive.png')}/>}
                extra={<Text>{priceFormatter(property)}</Text>}
                onClick={() => {
                }}>
                {text}
            </Item>;
        }

        return null;
    }

    private renderRewardListItem(property: string | boolean,
                                 text: string,
                                 callback: () => void,
                                 price: string): JSX.Element {
        const {title, code, earningType} = this.props.navigation.state.params;

        if (property) {
            return <Item
                arrow='horizontal'
                thumb={
                    <Image
                        style={styles.itemIconStyle}
                        source={
                            '2' === code ? require('../../../images/yingshoutwo.png') :
                                '3' === code ? require('../../../images/yingshouone.png') :
                                    require('../../../images/yingshouthree.png')
                        }
                    />
                }
                extra={<ExtraText text={price}/>}
                onClick={() => callback()}>
                {text}
            </Item>;
        }

        return null;
    }
}

/**
 * ????????????????????????
 * @returns {string}
 */
const getStartTime = () => {
    const Nowdate = new Date();
    let vYear = Nowdate.getFullYear();
    let vMon = Nowdate.getMonth() + 1;
    let vMonStr = '';
    let vDay = Nowdate.getDate();
    let vDayStr = '';
    const daysInMonth = new Array(0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    if (vMon === 1) {
        vYear = Nowdate.getFullYear() - 1;
        vMon = 12;
    } else {
        vMon = vMon - 1;
    }
    if (vYear % 4 === 0 && vYear % 100 !== 0 || vYear % 400 === 0) {
        daysInMonth[2] = 29;
    }
    if (daysInMonth[vMon] < vDay) {
        vDay = daysInMonth[vMon];
    }
    if (vDay < 10) {
        vDayStr = `0${vDay}`;
    } else {
        vDayStr = `${vDay}`;
    }
    if (vMon < 10) {
        vMonStr = `0${vMon}`;
    } else {
        vMonStr = `${vMon}`;
    }

    return `${vYear}???${vMonStr}???${vDayStr}???`;
}

/**
 * ????????????????????????
 * 2018/01/01?????????2018???01???01???
 * new data?????????2018/01/01
 * @param date
 * @returns {string}
 */
const getDesignatedTime = (date) => {
    return `${date.getFullYear()}???${((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1)))
    + '???' + (date.getDate() > 9 ? date.getDate() : ('0' + date.getDate()))}???`;
}

const timeFilterForAngularJs = (timeStr: string) => {
    return `${timeStr}`.replace('???', '/').replace('???', '/').replace('???', '');
}

export const priceFormatter = (price: string) => `??${numberWithCommas(parseFloat(price).toFixed(2))}`;

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const styles = StyleSheet.create({
    itemIconStyle: {
        height: 25,
        width: 25,
        marginRight: 10,
    },
    datePicker: {
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 8,
        paddingRight: 8,
        borderColor: '#CACACA',
        borderWidth: 1,
    },
});

export default RevenueDetail;
