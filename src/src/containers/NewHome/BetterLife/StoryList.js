

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
import {action,createAction, NavigationUtils} from './../../../dva/utils';
import { connect } from 'react-redux';
import { UltimateListView } from 'rn-listview';
import URL from './../../../config/url';
import { GET, POST_JSON, GET_P, POST_FORM} from '../../../config/Http';
import more from './../../../images/arrow_right_w.png';
import bgbgbg from './../../../images/bgbgbg.png';
import zan from './../../../images/zan.png';
import defaultIcon from '../../../images/userIcon.jpg';
import { NavBar, SafeView, FooterView } from './../../../components';

let Swidth = URL.width;
let Sheight = URL.height;
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
const Sip = StyleSheet.hairlineWidth;

@connect()
export default class StoryList extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {

        };
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
                    onFetch={this.onFetch}
                    keyExtractor={(item, index) => `${index} - ${item}`} // this is required when you are using FlatList
                    refreshableMode={Platform.OS === 'ios' ? 'advanced' : 'basic'} // basic or advanced
                    // item视图
                    item={this.renderItem} // this takes three params (item, index, separator)
                    numColumns={2} // to use grid layout, simply set gridColumn > 1
                    // 尾部视图,当isFooter为true时,再设置footer视图,否则一直返回null
                    // tslint:disable-next-line:max-line-length
                    footer={()=>{return <FooterView/>}}
                    // 视图滚动的方法
                    onScroll={this.onScroll}
                />
            </View>
        );
    }

   // 获取数据
   onFetch = async (page = 1, startFetch, abortFetch) => {
    try {
        const { params } = this.props.navigation.state;
        const {data,success} = await GET(URL.get_topic,{
            group: params.group,
            itemsId: params.itemsId,
            pageIndex: page,
            pageSize:10
        });
        if (success) {
            startFetch(data.storys, 10);
        } else {
            abortFetch();
        }
       
    } catch (err) {
        abortFetch();
    }
}

    renderItem = (item, index)=>{
        return <View key={index} style={{width: 0.5*(Swidth - 15), height: 0.5*(Swidth - 15)*218/180, marginTop: 5, marginLeft: 5,backgroundColor: '#fff'}}>
            <TouchableOpacity key={index} onPress={async ()=>{
                const token = await global.getItem('userToken');
                this.props.dispatch(NavigationUtils.navigateAction('SuperSecondView', {
                    url: '/html/topic/topic_details.html',
                    id: Number(item.id),
                    token: token,
                    type: 2
                }));
            }}>
            <Image style={{height: 0.5*(Swidth - 15)*158/180, width: 0.5*(Swidth - 15)}}
                   source={{uri: item.imageUrl || ''}}
                   resizeMode={'cover'}/>
            
            <View style={{height: 20, marginLeft: 8,justifyContent: 'center'}}>
                <Text style={{maxWidth: 0.5*(Swidth - 15) - 16, fontSize: 14}} numberOfLines={1}>{item.storyName || ''}</Text>
            </View>
            <View style={{flexDirection: 'row',alignItems: 'center',height: 40, marginLeft: 8, width: 0.5*(Swidth - 15) - 16}}>
                <View style={{height: 40,alignItems: 'center',flexDirection: 'row'}}>
                    <View style={{height: 16, width: 16, borderRadius: 8}}>
                    {
                        item.avatar ? 
                        <Image style={{height: 16, width: 16, borderRadius: 8}}
                        source={{uri: cutImgUrl(item.avatar || '', 80, 80)}}
                        resizeMode={'cover'}/>:
                        <Image style={{height: 16, width: 16, borderRadius: 8}}
                         source={defaultIcon} resizeMode={'cover'}/>
                     }
                    </View>
                </View>
                <Text style={{flex:1, fontSize: 12, marginLeft: 6, color: '#999'}} numberOfLines={1}  ellipsizeMode='tail'>{item.author || ''}</Text>
                <View style={{height: 40,alignItems: 'center',flexDirection: 'row'}}>
                    <Image style={{height: 25, width: 25}}
                           source={zan}
                           resizeMode={'contain'}/>
                    <Text style={{fontSize: 12, color: '#999'}} numberOfLines={1}>{this.calculatePraise(item.praise) || '0'}</Text>
                </View>
  
            </View>
            </TouchableOpacity>
        </View>
      };
    calculatePraise = (praise) => {
        if (praise > 9999) {
            return `${(praise / 10000).toFixed(2)}w`;
        } else {
            return praise;
        }
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
    aCenter: {
        justifyContent: 'center',
        alignItems: 'center'
    },

});
