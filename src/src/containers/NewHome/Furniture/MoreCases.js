



/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    ImageBackground,
    View, ScrollView,
    TouchableOpacity,
} from 'react-native';

import { connect } from 'react-redux';
import { action, createAction, NavigationUtils } from './../../../dva/utils';

import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

const Sip = StyleSheet.hairlineWidth;


import { UltimateListView, UltimateRefreshView } from 'rn-listview';
import { NavBar, SafeView, FooterView } from './../../../components';
import L from "lodash";
import {ctjjService} from "../../../dva/service";
const PAGE_SIZE = 10;
import {Color} from 'consts';

@connect()
export default class MoreCases extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            selected: 0,
            title: '',
            id: '',
        };
        this.header = this.header.bind(this);
        this.onFetch = this.onFetch.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }
    componentWillMount() {
        // 请求头部内容 dva 操作, header 数据
        const params = this.props.navigation.state.params;
        const id = L.get(params, 'id');
        const title = L.get(params, 'title');
        this.setState({id, title});
    }

    header = ()=>{
        return <View style={[styles.container]}>
            <View style={[styles.banner]}>
                    <Image source={{uri: cutImgUrl(this.state.imageUrl || '', 360, 360)}} style={[styles.banner]} resizeMode={'cover'}/>
            </View>
            <View style={[{backgroundColor: '#fff'}]}>
                <View style={[styles.aCenter, styles.row,{height: 44}]}>
                    <View style={{height: 13, width: 3, backgroundColor: '#2979FF', marginLeft: 16}}/>
                    <Text style={{fontSize: 14, marginLeft: 8, color: '#333'}}>解决方案</Text>
                </View>
            </View>
        </View>
            };

    render() {
        return (
            <SafeView>
                <View style={[styles.container]}>
                    <NavBar title={this.state.title ? this.state.title : ''}/>
                <UltimateListView
                    ref={ref => this.listView = ref}
                    header={this.header}
                    style={{backgroundColor: '#fff'}}
                    onFetch={this.onFetch}
                    keyExtractor={(item, index) => index} // this is required when you are using FlatList
                    refreshableMode={Platform.OS === 'ios' ? 'advanced' : 'basic'} // basic or advanced
                    item={this.renderItem} // this takes three params (item, index, separator)
                    numColumns={1} // to use grid layout, simply set gridColumn > 1
                    footer={()=>{return <FooterView textContainerStyle={styles.footer}/>}}
                />
            </View>
            </SafeView>
        );
    }

    onFetch = async (page = 1, startFetch, abortFetch)=>{
        try{
            const expert = await ctjjService.getProgramsList({channel: 1, id: this.state.id, pageIndex: page, pageSize: PAGE_SIZE});
            const success = L.get(expert, 'success', false);
            const data = L.get(expert, 'data', false);
            if(success && data){
                if(page === 1){
                    const imageUrl = L.get(data, 'imageUrl', '');
                    const name = L.get(data, 'name', '全套方案');
                    const details = L.get(data, 'details', []);
                    if(details.length > 0){
                        this.setState({data: details});
                    }
                    this.setState({imageUrl: imageUrl, title: name, data: details});
                }
                const details = L.get(data, 'details', []);
                startFetch(details, PAGE_SIZE);
            }else{
                abortFetch();
            }
        }catch (e) {
            console.log(e);
            abortFetch();
        }
    };
    renderItem = (item, index)=>{
        return <TouchableOpacity activeOpacity={0.9}  key={index} onPress={()=>{
            this.props.dispatch(NavigationUtils.navigateAction("CaseDetail", {
                id: item.id,
                title: item.name
            }));
        }}>
            <View style={{marginHorizontal: 16}}>
            <Image style={{height: SWidth * 160/343, width: SWidth - 32, marginTop: 4}} source={{uri: cutImgUrl(item.imageUrl || '', 200, 200)}} />
                <View style={[styles.jCenter, {height: 40,}]}>
                    <Text style={{fontSize: 14, color: '#333'}}>{item.name ? item.name : ''}</Text>
                </View>
            </View>
        </TouchableOpacity>
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
    },
    allCenter: {
        justifyContent: 'center', alignItems: 'center'
    },
    jCenter: {
        justifyContent: 'center'
    },
    aCenter: {
        alignItems: 'center'
    },
    row:{
        flexDirection: 'row'
    },
    banner: {
        width: SWidth, height: 0.48 * SWidth
    },
    footer: {
        backgroundColor: Color.WHITE
    },
});
