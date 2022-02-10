

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
    TouchableWithoutFeedback,
    TouchableOpacity,
} from 'react-native';
import Swiper from 'react-native-swiper';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import { connect } from 'react-redux';
import { UltimateListView } from 'rn-listview';
import {action,createAction, NavigationUtils} from './../../../dva/utils';
import URL from './../../../config/url';
import { GET, POST_JSON, GET_P, POST_FORM} from '../../../config/Http';
import { NavBar, SafeView } from './../../../components';
let Swidth = URL.width;
let Sheight = URL.height;
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
const Sip = StyleSheet.hairlineWidth;

/**
 *   设计师列表
 */
@connect()
export default class SjsList extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {

        };
        this.headerView = this.headerView.bind(this);
        this.onFetch = this.onFetch.bind(this);
        this.renderItem = this.renderItem.bind(this);
      }

    componentDidMount() {
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar title={'列表'}/>
                <UltimateListView
                    ref={ref => this.listView = ref}
                    header={this.headerView}
                    onFetch={this.onFetch}
                    keyExtractor={(item, index) => `${index} - ${item}`} // this is required when you are using FlatList
                    refreshableMode={Platform.OS === 'ios' ? 'advanced' : 'basic'} // basic or advanced
                    // item视图
                    item={this.renderItem} // this takes three params (item, index, separator)
                    numColumns={1} // to use grid layout, simply set gridColumn > 1
                    // 视图滚动的方法
                    onScroll={this.onScroll}
                />
            </View>
        );
    }

    headerView = () => {

        return (
            <View style={{width:Swidth,height:44, justifyContent:'center', backgroundColor:'#eeeeee'}}>
                <Text style={{fontSize: 14,color:'#666666',paddingLeft:15}}>修美美的家，在顺逛找萌萌的设计师</Text>
            </View>
        );
    }

    // 获取案例列表数据
    onFetch = async (page = 1, startFetch, abortFetch) => {
        try {
            const json = await GET(URL.DIY_DESIGNERLIST,{
                pageIndex: page,
                pageSize:10
            });
            console.log('json' + json);
            if (json.success) {
                console.log('json' + json);
                startFetch(json.data, 10);
            } else {
                abortFetch();
            }
           
        } catch (err) {
            abortFetch();
        }
    }

    renderItem = (item, index)=>{
            return <View key={index} style={{width:Swidth,padding: 10,backgroundColor: '#fff'}}>
            <View  style={{width:Swidth -20,height:90,flexDirection:'row'}}>
                {
                        item.cases.map((child, index) => (
                            <TouchableWithoutFeedback onPress={()=>{
                                this.props.dispatch(NavigationUtils.navigateAction("CaseDetailjj", {caseid: child.id}));
                            }}> 
                            <Image style={{height: 90, width: 110,marginRight:(Swidth-350)/2}} source={{uri:  child.imageUrl || ''}}
                            resizeMode={'cover'}/>
                             </TouchableWithoutFeedback>
                      ))
                }
            </View>
            <TouchableWithoutFeedback onPress={()=>{
                              this.props.dispatch(NavigationUtils.navigateAction("SjsDetail", {designerId:item.id}));
                          }}> 
            <View style={{width:Swidth - 20,height:40,flexDirection:'row',alignItems:'center',backgroundColor:'#fff',marginTop:10}}>
            <Image style={{height: 40, width: 40,borderRadius:20}}
                   source={{uri: item.avatar || ''}}
                   resizeMode={'cover'}/>
            <Text style={{fontSize: 14,color:'#333333',marginLeft:7}}>{item.name || ''}</Text>
            <Text style={{fontSize: 12,color:'#999999',position: 'absolute',right:15}}>{item.area || ''}</Text>
            </View>
            </TouchableWithoutFeedback>
        </View>
      };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    },

    bannerStyle: {
        width: Swidth,
        height: 0.5 * Swidth,
    },
    unPointStyle: { 
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
        backgroundColor: 'rgba(255,255,255,.5)',
    },
    pointStyle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
        backgroundColor: '#FFFFFF',
    },
    menuStyle:{
        width: Swidth,
        height: 90,
        marginTop: 9,
        backgroundColor: '#FFFFFF',
        justifyContent:'center'
    },

});
