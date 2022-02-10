

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
import ScreenUtil from './../../Home/SGScreenUtil';
import ScreenModle from '../../../components/ScreenModle';
import URL from './../../../config/url';
import { GET, POST_JSON, GET_P, POST_FORM} from '../../../config/Http';
import {getAppJSON} from '../../../netWork';
import { NavBar } from '../../../components/NavBar';

let Swidth = URL.width;
let Sheight = URL.height;
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

/**
 * 案例列表
 */
@connect()
export default class CaseList extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            showScreenModal:false,
            ids:[],
        };
        this.rightFun = this.rightFun.bind(this);
        this.onFetch = this.onFetch.bind(this);
        this.renderItem = this.renderItem.bind(this);
      }

    componentDidMount() {
    }

    rightFun = ()=>{
        this.setState({ 
            showScreenModal: true }) 
    }
    render() {
        
        return (
            <View style={styles.container} >
               <NavBar title={'案例列表'} rightView={<TouchableOpacity onPress={this.rightFun} ><View style={{ marginRight: 8 ,flexDirection:'row',alignItems:'center'}}>
                 <Text style={{color:'#6f6f6f', fontSize: 18}}>筛选</Text>
                 <Image source={require('../../../images/screen.png')}
                 style={{ width: 20, height: 20 ,marginLeft: 5}}/>
               </View>
               </TouchableOpacity>
               } 
               />
                <View style={{height: 1,width:Swidth ,backgroundColor:'#EEEEEE'}}/>
                <UltimateListView
                    
                    ref={ref => this.listView = ref}
                    onFetch={this.onFetch}
                    keyExtractor={(item, index) => `${index} - ${item}`} // this is required when you are using FlatList
                    refreshableMode={Platform.OS === 'ios' ? 'advanced' : 'basic'} // basic or advanced
                    // item视图
                    item={this.renderItem} // this takes three params (item, index, separator)
                    numColumns={1} // to use grid layout, simply set gridColumn > 1
                    // 视图滚动的方法
                    onScroll={this.onScroll}
                />
                 <ScreenModle
                    visible={this.state.showScreenModal}
                    onCancel={() => this.setState({ showScreenModal: false })}
                    hiddenEwm={true}
                    hidingTitle={true}
                    onSelect={(ids) => {
                        // this.setState({ ids: ids});
                        const length = ids.length;
                        const id = [];
                        for (let index = 0; index < length; index++) {
                            if(ids[index] !== 0){
                                id.push(ids[index]);
                            }
                        }
                        this.setState({
                                ids: id.concat(),
                            }, () => {
                               this.listView.onRefresh();
                            });
                    }}
                />
            </View>
        );
    }

    // 获取案例列表数据
    onFetch = async (page = 1, startFetch, abortFetch) => {
        try {
            const json = await GET(URL.DIY_CASELIST,{
                ids:this.state.ids,
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
            return <View key={index} style={{width:Swidth,padding: 16,backgroundColor: '#fff'}}>
            <TouchableWithoutFeedback onPress={()=>{
                              this.props.dispatch(NavigationUtils.navigateAction("CaseDetailjj", {caseid: item.id}));
                          }}> 
                <Image style={{height: 160, width: Swidth-32}} source={{uri: item.imageUrl || ''}}
                   resizeMode={'cover'}/>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={()=>{
                              this.props.dispatch(NavigationUtils.navigateAction("SjsDetail", {designerId:item.designerId}));
                          }}> 
            <View style={{height: 30,width: Swidth-32,margin: 16, position: 'absolute', top: 130, backgroundColor: 'rgba(30, 30, 30, 0.3)',flexDirection:'row',alignItems:'center'}}>
                <Image style={{height: 20, width: 20,borderRadius:10,marginLeft:8,marginRight:6}}
                   source={{uri: item.avatar || ''}}
                   resizeMode={'cover'}/>
                <Text style={{fontSize: 12,color:'#fff'}}>{item.designerName || ''}</Text>
                <Text style={{fontSize: 12,color:'#fff',position: 'absolute',right:8}}>{item.area || ''}</Text>
            </View>
            </TouchableWithoutFeedback>
            <Text style={{fontSize: 14,paddingTop:12}}>{item.name || ''}</Text>
            <View  style={{width:Swidth - 32,flexDirection:'row' , flexWrap: 'wrap'}}>
                 {item.label.split(' ').map((item, index)=>{
                          return <View  style={{height:22,borderRadius:11,backgroundColor:'#E4E4E4',justifyContent:'center',alignItems:'center',marginRight:6,marginTop:6, paddingLeft: 10, paddingRight:10 }}>
                          <Text style={{fontSize: 12,color:'#666666'}}>{item}</Text>
                          </View>
                      })}
            </View>
        </View>
      };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    },
    
    headerNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: Swidth,
        paddingTop: ScreenUtil.isiPhoneX ? 44 : (Platform.OS === 'ios' ? 20 : 0), // 处理ios状态栏,普通ios设备是20,iPhone X是44
        height: 44,
        backgroundColor:'#fff'
    },
    
    
});
