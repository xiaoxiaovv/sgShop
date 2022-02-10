import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
    ScrollView,
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
import {NavigationUtils} from '../../dva/utils';
import {connect} from 'react-redux';

@connect()
class communityMsg extends React.Component {
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
            header: <Header goBack={() => navigation.goBack()} title={"社区动态"}>
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
                        }}>
                        <Text style={{color: 'gray'}}>全部已读</Text>
                    </TouchableOpacity>
                </View>
            </Header>
        };
    };

    renderUserItem({item}) {
        return <ListItem user={item} onPress={() => this.onUserItemPress({user: item})}/>;
    }

    onUserItemPress = async ({user}) => {


        console.log(user);
        const type = user.type;
        const content = user.content;
        // 凡是content含有'删除'的消息,就跳转到金币详情
        if (content.indexOf('删除') !== -1) {
            // 跳转到金币详情页面
            this.props.navigation.navigate('MyGold');
            return;
        }
        if(type == 601 || type == 602){
            const token = await global.getItem('userToken');
            this.props.dispatch(NavigationUtils.navigateAction("SuperSecondView", {
                url: '/html/topic/topic_details.html',
                id: Number(user.relationId),
                token: token,
                type: 1
            }));
        }

        if(type == 603){
            const token = await global.getItem('userToken');
            this.props.dispatch(NavigationUtils.navigateAction("SuperSecondView", {
                url: '/html/topic/topic_details.html',
                id: Number(user.relationId),
                token: token,
                type: 4
            }));
        }

        if(type == 604){
            const token = await global.getItem('userToken');
            this.props.dispatch(NavigationUtils.navigateAction("SuperSecondView", {
                url: '/html/mine/my_fans_win.html',
                token: token
            }));
        }

        if (type === 605) {
            const token = await global.getItem('userToken');
            this.props.dispatch(NavigationUtils.navigateAction("SuperSecondView", {
                url: '/html/collect/collect_detail2.html',
                id: Number(user.relationId),
                token: token,
            }));
        }




        // 关注 跳转我的粉丝列表 -> type 604
        // content:"UH515d3f5dcda873关注了您"
        // createTime:1531988819
        // date:"2018-07-19"
        // id:60605302
        // isDelete:1
        // isPush:1
        // memberId:29779341
        // relationId:29829357
        // title:"社区消息"
        // type:604


        // 普通话题信息 是否 删除 isDelete 话题被删除 跳金币明细列表 不是删除 就跳转普通话题详情页(type: 1, 话题 id)
        // content:"游客赞了您的话题"
        // createTime:1531928475
        // date:"2018-07-18"
        // id:60047856
        // isDelete:1
        // isPush:1
        // memberId:29779341
        // relationId:229726
        // title:"社区消息"
        // type:601  602

        // 商学院信息 是否 删除 isDelete 话题被删除 跳金币明细列表 不是删除 就跳转商学院话题详情页(type: 4, 话题 id)
        // content:"游客赞了您的话题"
        // createTime:1531928475
        // date:"2018-07-18"
        // id:60047856
        // isDelete:1
        // isPush:1
        // memberId:29779341
        // relationId:229726
        // title:"社区消息"
        // type:603

        // this.props.navigation.navigate('SuperSecondView',  {
        //     url: '/html/topic/topic_details.html',
        //     id: user.id,
        //     type: 3
        // });
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

    renderBoss() {
        const {renderStyle} = styles
        return (
            <View style={renderStyle}>
                <ActivityIndicator size="large"/>
            </View>
        )
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
                    ? (this.state.emptydata ? <Newempty /> : this.renderBoss() )
                    : <FlatList
                        data={this.state.truedata}
                        keyExtractor={(item, index) => {
                            return index + "";
                        }}
                        renderItem={this.renderUserItem}
                        onEndReachedThreshold={0.5}
                        onEndReached={this.loadData.bind(this)}
                    />
                }
            </View>
        );
    }

    loadData(init) {
        if(this.page >= this.state.startindex){
            return;
        }

        const userToken = dvaStore.getState().users.userToken;
        this.page = this.state.startindex;
        const url = `${Config.API_URL}v3/mstore/sg/messageCenter.html?messageType=4&page=${this.page}&size=10`;
        console.log(url);
        axios({
            method: "get",
            url: url,
            headers: {
                "TokenAuthorization": userToken,
            }
        })
            .then(response => {
                const communityMesagesList = response.data.data.communityMesagesList;
                if(communityMesagesList){
                    this.setState({
                        truedata: this.state.truedata.concat(communityMesagesList),
                        startindex: this.state.startindex + 1,
                    });
                }else if(init){
                    this.setState({emptydata: true});
                }
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
    renderStyle: {
        flex: 1,
        justifyContent: 'center'
    },
});
export default communityMsg;