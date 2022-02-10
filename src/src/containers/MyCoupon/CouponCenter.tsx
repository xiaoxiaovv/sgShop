import * as React from 'react';
import {View, ScrollView, TouchableOpacity, Text} from 'react-native';
import SelectBar from 'rn-select-bar';
import EStyleSheet from 'react-native-extended-stylesheet';
import CouponList from './CouponList';
import {getAppJSON} from '../../netWork';
import Config from 'react-native-config';
import {NavBarConfig} from '../RootContainers/rootNavigator';
import {connect} from '../../utils';
import Button from 'rn-custom-btn1';
import ShareModle from '../../components/ShareModle';
import Header from '../../components/Header';
import URL from '../../config/url';

let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

const styles = EStyleSheet.create({
    naviTitle: {
        width: '375rem',
        height: 44,
        backgroundColor: 'white',
    },
    selectBar: {
        width: '375rem',
        height: 44,
        backgroundColor: 'white',
    },
    naviRight: {
        width: 100,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'red',
    },
    naviRightBtn: {
        height: 44,
        width: 44,
    },
    naviRightImg: {
        width: 30,
        height: 30,
    },
});

export interface ICouponCenterProps {
    unread: number;
}

export interface ICouponCenterState {
    pageIndex: number;
    listData: any;
    headerData: any;
    showShare: boolean;
}

const mapStateToProps = ({ address: { streetId } }) => ({
    streetId
});

@connect(mapStateToProps)

export default class MyCoupon extends React.Component<ICouponCenterProps, ICouponCenterState> {

    private static navigationOptions = ({navigation}) => {
        return {header: null};
    }

    private list: any;

    constructor(props: ICouponCenterState) {
        super(props);

        this.state = {
            pageIndex: 0,
            listData: [],
            headerData: [],
            showShare: false,
        };

    }

    public componentWillMount() {
        this.loadHeader();
    }

    public render() {
        const barContent = ['全部', '未使用', '已使用'];
        const command = [
            '顺逛领券频道,优惠券等您来抢',
            '给您推荐顺逛领券频道,超值优惠券每日限量抢,不可错过哦!',
            'http://www.ehaier.com/mstatic/wd/v2/img/sg.png',
            `${URL.GET_COUPONS_LIST_SHARE_URL}${dvaStore.getState().users.mid}`,
            0,
        ];
        const unread = dvaStore.getState().mainReducer.unread;

        return (
            <View style={{flex: 1}}>
                <Header {...this.props} title="领券中心">
                    <View style={{position: 'absolute', right: 5, flexDirection: 'row'}}>
                        <Button
                            image={require('../../images/share.png')}
                            style={{height: 44, width: 44, marginRight: 8}}
                            imageStyle={{width: 30, height: 30}}
                            onPress={() => {
                                if (dvaStore.getState().users.isHost === -1){
                                    this.props.navigation.navigate('Login');
                                }else{
                                    this.setState({showShare: true})} }
                                }
                        />
                        <Button
                            image={require('../../images/message_gray.png')}
                            style={{height: 44, width: 44}}
                            imageStyle={{width: 25, height: 25}}
                            badge={unread ? ( unread > 99 ? '99+' : unread) : null}
                            onPress={() => this.props.navigation.navigate('MessageDetail')}
                        />
                    </View>
                </Header>

                <SelectBar
                    itemWidth={width / 4}
                    style={styles.selectBar}
                    content={this.state.headerData}
                    selectedItem={this.state.headerData[this.state.pageIndex]}
                    showContent={item => item.cateName}
                    onPress={(item, index) => this.setState({pageIndex: index})}
                />
                <CouponList
                    ref={(list) => this.list = list}
                    key={`key${this.state.pageIndex}`}
                    style={{flex: 1}}
                    loadFunc={this.loadFunc}
                    fromCenter
                    pagination={false}
                />
                <ShareModle
                    visible={this.state.showShare} content={command}
                    hiddenEwm
                    onCancel={() => this.setState({showShare: false})}
                />
            </View>
        );
    }

    private loadHeader = async () => {
        const {data: headerData} = await getAppJSON(Config.COUPON_HEADER, {}, {}, true);
        this.setState({headerData}, () => this.list.onRefresh());
    }
    private loadFunc = async (startIndex: number = 1, pageSize: number) => {
        return await getAppJSON(Config.COUPON_CENTER, {
            startIndex, pageSize, couponCateId: this.state.headerData[this.state.pageIndex].id, streetId: this.props.streetId,
        }, {}, true, Config.API_URL, true);
    }
}
