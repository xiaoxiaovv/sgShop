import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
    RefreshControl,
} from 'react-native';
import React from 'react';
import axios from 'axios';
import ListItem from './ListItem';
import Config from 'react-native-config';
import Header from '../../components/Header';
import url from '../../config/url';
import {GET} from '../../config/Http';
import {Toast} from 'antd-mobile';
import Newempty from './Newempty';


class memberMsg extends React.Component {
    private page = 0;

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: [],
            page: 1,
            seed: 1,
            error: null,
            refreshing: false,
            users: [],
            truedata: [],
            startindex: 1,//默认页数
            isRefreshing: false,
            emptydata: false,
        };
        this.renderUserItem = this.renderUserItem.bind(this);
        this.onUserItemPress = this.onUserItemPress.bind(this);
    }

    public static navigationOptions = ({navigation}) => {
        return {
            header: <Header goBack={() => navigation.goBack()} title={"会员动态"}>
                <View style={{position: 'absolute', right: 5, flexDirection: 'row'}}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingRight: 10,
                        }}
                        onPress={() => {
                            GET(url.READ_ALL_MESSAGE).then(data => {
                                Toast.success('已读成功', 2);
                            })
                        }}
                    >
                        <Text style={{color: 'gray'}}>全部已读</Text>
                    </TouchableOpacity>
                </View>
            </Header>
        };
    }

    renderLoading() {
        const {loading} = styles
        return (
            <View style={loading}>
                <ActivityIndicator size="large"/>
            </View>
        )
    }

    renderUserItem({item}) {
        return <ListItem user={item} onPress={() => this.onUserItemPress({user: item})}/>;
    }

    onUserItemPress({user}) {
        const {navigation} = this.props;

        if (user.type == 0) {
            navigation.navigate('MyGold');
        } else if (user.type == -11 || user.type == -12) {
            navigation.navigate('MyCoupon');
        } else if (user.type == -13 || user.type == -21) {
            navigation.navigate('ShopRevenue');
        } else if (user.type == -5) {
            //订单退货消息
            navigation.navigate('RefundDetail', {memberId: user.memberId, orderProductId: user.relationId});
        } else if (user.type == -6) {
            // 跳转全部订单
            navigation.navigate('OrderList', {orderFlag: 0, orderStatus: 0});
        } else if (user.type == -3) {
            // 跳转评价列表
            console.log(user);
            navigation.navigate('Evaluate', {modelId: user.relationId});
        }
    }

    public componentWillUnmount() {
        // 点击了返回,当前界面pop出栈,刷新前一个界面
        const {callBack} = this.props.navigation.state.params;
        if (callBack) {
            // 刷新我的界面
            callBack();
        }
    }

    componentDidMount() {
        this.loadData(true);
    }

    render() {
        const {isRefreshing} = this.state;
        const refershControl = (<RefreshControl
            onRefresh={() => {
                // console.log('这个是下拉加载')
                this.setState({isRefreshing: true});
                setTimeout(() => {
                    this.setState({isRefreshing: false});
                    // console.log('加载过程中需要执行的函数')
                }, 3000);
            }}
            refreshing={isRefreshing}
            title={'刷新中'}
            colors={['#EFEFEF']}
            progressBackgroundColor={"#DFDFDF"}/>);
        return (
            <View style={styles.wrapper}>
                {!this.state.truedata.length
                    ? (this.state.emptydata ? <Newempty /> : this.renderLoading() )
                    : <FlatList
                        data={this.state.truedata}
                        keyExtractor={(item, index) => {
                            return index + "";
                        }}
                        renderItem={this.renderUserItem}
                        contentContainerStyle={styles.container}
                        onEndReachedThreshold={0.5}
                        onEndReached={this.loadData.bind(this)}
                    />
                }
            </View>
        )
    }
    
    loadData(init) {
        if(this.page >= this.state.startindex){
            return;
        }

        this.page = this.state.startindex;
        const userToken = dvaStore.getState().users.userToken;
        const url = `${Config.API_URL}v3/mstore/sg/messageCenter.html?messageType=2&page=${this.page}&size=10`;
        // 进入页面首先请求接口数据
        axios({
            method: "get",
            url: url,
            headers: {
                "TokenAuthorization": userToken
            }
        })
        .then(response => {
            const memberMesagesList = response.data.data.memberMesagesList;
            if (memberMesagesList != null ) {
                this.setState({
                    truedata: this.state.truedata.concat(memberMesagesList),
                    startindex: this.state.startindex + 1,
                });
            } else if(init) {
                this.setState({emptydata: true})
            };
        })
        .catch(error => Log(error));
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingTop: 14,
        backgroundColor: "#f2f2f2",
    },
    hints: {
        marginTop: 12,
        marginLeft: 20,
        marginRight: 20,
        fontSize: 15,
        color: '#333333',
        lineHeight: 22,
    },
    loading: {
        flex: 1,
        justifyContent: 'center'
    },
});


export default memberMsg;