import * as React from 'react';
import {ScrollView, StyleSheet, ImageBackground, View, Text, Image, TouchableOpacity, Platform} from 'react-native';
import {List, Tabs, Card} from 'antd-mobile';
import {UltimateListView} from 'rn-listview';
import {ArticleListItem} from '../../../components/Mine/ArticleListItem';
import {INavigation} from '../../../interface/index';
import axios from 'axios';
import Config from 'react-native-config';
import Header from '../../../components/Header';
import {MessageWithBadge} from '../../../components/MessageWithBadge';
import {connect, createAction} from '../../../utils';

const {Item} = List;
const {Brief} = Item;

import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

interface IState {
    isEdit: boolean;
    data: any[];
}

const tabs = [
    {title: '产品知识', sub: '1'},
    {title: '售后服务', sub: '2'},
    {title: '销售分享', sub: '3'},
    {title: '行业资讯', sub: '4'},
    {title: '顺逛动态', sub: '5'},
];
/**
 * 顺逛微学堂
 */
@connect(({mine, users: {userName: user, mid: storeId, unread, gameId}}) => ({mine, user, storeId, unread, gameId}))
class ShunguangSchool extends React.Component<INavigation> {
    public static navigationOptions = ({navigation, screenProps}) => {
        return {
            header: <Header
                goBack={() => navigation.goBack()}
                title="顺逛微学堂">
                <View style={{position: 'absolute', right: 0}}>
                    <MessageWithBadge
                        navigation={navigation}
                        unread={screenProps.unread}
                        isWhite={false}
                        imageStyle={{width: 22, height: 22}}
                        hidingText={true}
                    />
                </View>
            </Header>
        }
    };


    public state: IState = {
        isEdit: false,
        data: [],
    };
    private listView?: any;

    public constructor(props) {
        super(props);
    }

    renderTabItem = (onFetch, item) => {
        return(
            <View>
                <UltimateListView
                    ref={(ref) => this.listView = ref}
                    onFetch={onFetch}
                    keyExtractor={(item, index) => `keys${index}`}
                    refreshableMode={Platform.OS === 'ios' ? 'advanced' : 'basic'} // basic or advanced
                    item={item}
                    numColumn={1}
                    footer={() => <View />}
                    // paginationAllLoadedView={() => <View />}
                    // paginationFetchingView={() => <View />}
                    emptyView={() =>
                        <View style={{height, justifyContent: 'center', alignItems: 'center', top: -40}}>
                            <Text style={{color: '#666', fontSize: 16}}>暂无项目</Text>
                        </View>
                    }
                />
            </View>
        );
    }

    public render(): JSX.Element {
        return (
            <View style={{flex: 1}}>
                <Tabs tabs={tabs}
                      initialPage={0}
                      renderTab={tab => <Text>{tab.title}</Text>}
                >
                {this.renderTabItem(this.onFetchProductKnowledge, this.renderProductKnowledgeUListItem)}
                {this.renderTabItem(this.onFetchAfterSalesService, this.renderAfterSalesServiceItem)}
                {this.renderTabItem(this.onFetchSailingShare, this.renderSailingShareItem)}
                {this.renderTabItem(this.onFetchIndustryNews, this.renderIndustryNewsItem)}
                {this.renderTabItem(this.onFetchShunguangNews, this.renderShunguangNewsItem)}
                </Tabs>
            </View>
        );
    }

    private sleep = (time) => new Promise(resolve => setTimeout(() => resolve(), time));
    private renderProductKnowledgeUListItem = (item, index) => {
        return (
            <ArticleListItem {...item} index={index} onClick={
                () => {
                    this.props.navigation.navigate('ShunguangSchoolDetail', item);
                }
            }/>
        );
    }
    private renderAfterSalesServiceItem = (item, index) => {
        return (
            <ArticleListItem {...item} index={index} onClick={
                () => {
                    this.props.navigation.navigate('ShunguangSchoolDetail', item);
                }
            }/>
        );
    }
    private renderSailingShareItem = (item, index) => {
        return (
            <ArticleListItem {...item} index={index} onClick={
                () => {
                    this.props.navigation.navigate('ShunguangSchoolDetail', item);
                }
            }/>
        );
    }
    private renderIndustryNewsItem = (item, index) => {
        return (
            <ArticleListItem {...item} index={index} onClick={
                () => {
                    this.props.navigation.navigate('ShunguangSchoolDetail', item);
                }
            }/>
        );
    }
    private renderShunguangNewsItem = (item, index) => {
        return (
            <ArticleListItem {...item} index={index} onClick={
                () => {
                    this.props.navigation.navigate('ShunguangSchoolDetail', item);
                }
            }/>
        );
    }

    private onFetchProductKnowledge = async (page = 1, startFetch, abortFetch) => {
        try {
            if(page === 1){
                let pageLimit = 100;
                const listUrl = Config.API_URL + Config.MICROSCHOOLGET;
                console.log(listUrl);
                axios(listUrl,
                    {
                        params: {
                            childId: 8,
                        }
                    }
                ).then(res => res.data)
                    .then((res) => {
                        this.setState({data: res.data});
                        startFetch(res.data, pageLimit);
                    })
            }else{
                abortFetch();
            }
        } catch (err) {
            abortFetch();
            Log(err);
        }
    };
    private onFetchAfterSalesService = async (page = 1, startFetch, abortFetch) => {
        try {
            if(page === 1){
            let pageLimit = 100;
            const listUrl = Config.API_URL + Config.MICROSCHOOLGET;
            axios(listUrl,
                {
                    params: {
                        childId: 9,
                    }
                }
            ).then(res => res.data)
                .then((res) => {
                    this.setState({data: res.data});
                    startFetch(res.data, pageLimit);
                })
            }else{
                abortFetch();
            }
        } catch (err) {
            abortFetch();
            Log(err);
        }
    };
    private onFetchSailingShare = async (page = 1, startFetch, abortFetch) => {
        try {
            if(page === 1){
            let pageLimit = 100;
            const listUrl = Config.API_URL + Config.MICROSCHOOLGET;
            axios(listUrl,
                {
                    params: {
                        childId: 25,
                    }
                }
            ).then(res => res.data)
                .then((res) => {
                    this.setState({data: res.data});
                    startFetch(res.data, pageLimit);
                })
        }else{
            abortFetch();
        }
    } catch (err) {
        abortFetch();
        Log(err);
    }
    };
    private onFetchIndustryNews = async (page = 1, startFetch, abortFetch) => {
        try {
            if(page === 1){
            let pageLimit = 100;
            const listUrl = Config.API_URL + Config.MICROSCHOOLGET;
            axios(listUrl,
                {
                    params: {
                        childId: 41,
                    }
                }
            ).then(res => res.data)
                .then((res) => {
                    this.setState({data: res.data});
                    startFetch(res.data, pageLimit);
                })
            }else{
                abortFetch();
            }
        } catch (err) {
            abortFetch();
            Log(err);
        }
    };
    private onFetchShunguangNews = async (page = 1, startFetch, abortFetch) => {
        try {
            if(page === 1){
            let pageLimit = 100;
            const listUrl = Config.API_URL + Config.MICROSCHOOLGET;
            axios(listUrl,
                {
                    params: {
                        childId: 55,
                    }
                }
            ).then(res => res.data)
                .then((res) => {
                    this.setState({data: res.data});
                    startFetch(res.data, pageLimit);
                })
            }else{
                abortFetch();
            }
        } catch (err) {
            abortFetch();
            Log(err);
        }
    };
}

export default ShunguangSchool;
