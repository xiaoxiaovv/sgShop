import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import axios from 'axios';
import ListItem from './ListItem';
import Config from 'react-native-config';
import Header from '../../components/Header';
import url from '../../config/url';
import {GET} from '../../config/Http';
import {Toast} from 'antd-mobile';
import Newempty from './Newempty';


class platformMsg extends React.Component {
    private page = 0;
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            page: 1,
            refreshing: false,
            truedata: [],
            newdata: [],
            startindex: 1,//默认页数
            isRefreshing: false,
            emptydata: false,
        };
        this.renderItem = this._renderItem.bind(this);
        this.onPress = this._onPress.bind(this);
    }

    public static navigationOptions = ({navigation}) => {
        return {
            header: <Header goBack={() => navigation.goBack()} title={"平台消息"}>
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

    renderLoad() {
        const {loadContain} = styles;
        return (
            <View style={loadContain}>
                <ActivityIndicator size="large"/>
            </View>
        )
    }

    _renderItem = ({item}) => {
        return <ListItem user={item} onPress={() => this.onPress({user: item})}/>;
    }

    _onPress({user}) {
        console.log(user);
        // 消息种类还没有判断完 后续待添加
        const {navigation} = this.props;
        if (user.type == 1) {//平台消息, 跳转webview
            navigation.navigate('MsgItemDetail', {user});
        } else if (user.type == 2) {//金币消息 跳转原生
            navigation.navigate('MyGold');
        } else if (user.type == 3) {
            navigation.navigate('MsgItemDetail', {user});
        } else if (user.type == 4) {// 微学堂消息
            navigation.navigate('MsgItemDetail', {user});
        } else if (user.type == 5) {
            navigation.navigate('MsgItemDetail', {user});
        } else if (user.type == 7) {
            navigation.navigate('MsgItemDetail', {user});
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
                this.setState({isRefreshing: true});
                setTimeout(() => {
                    this.setState({isRefreshing: false});
                }, 3000);
            }}
            refreshing={isRefreshing}
            title={'刷新中'}
            colors={['#EFEFEF']}
            progressBackgroundColor={"#DFDFDF"}/>);
        
        return (
            <View style={styles.wrapper}>
                {!this.state.truedata.length
                    ? (this.state.emptydata ? <Newempty /> : this.renderLoad() )
                    : <FlatList
                        data={this.state.truedata}
                        keyExtractor={(item, index) => {
                            return index + "";
                        }}
                        renderItem={this._renderItem}
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
        const url = `${Config.API_URL}v3/mstore/sg/messageCenter.html?messageType=3&page=${this.page}&size=10`;
        // 进入页面首先请求接口数据
        axios({
            method: "get",
            url: url,
            headers: {
                "TokenAuthorization": userToken
            }
        })
        .then(response => {
            const platformMesagesList = response.data.data.platformMesagesList;
            if (platformMesagesList != null ) {
                this.setState({
                    truedata: this.state.truedata.concat(platformMesagesList),
                    startindex: this.state.startindex + 1,
                });
            } else if (init){
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
    loadContain: {
        flex: 1,
        justifyContent: 'center'
    },
});
export default platformMsg;