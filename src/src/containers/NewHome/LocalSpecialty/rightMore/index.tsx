import React, { Component } from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    ImageBackground,
    View, ScrollView,
    TouchableOpacity, Modal
} from 'react-native';

import { UltimateListView } from 'rn-listview';
import { connect } from 'react-redux';



const Sip = StyleSheet.hairlineWidth;


import ShareModle from './../../../../components/ShareModle';
import URL from './../../../../config/url';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
import { NavBar, SafeView } from './../../../../components';
import L from "lodash";
import {ctjjService} from "../../../../dva/service";
import {Toast} from "antd-mobile/lib/index";
import { createAction } from '../../../../utils';
import { ICustomContain ,INavigation} from '../../../../interface/index';

export default class rightCommon extends Component<INavigation & ICustomContain> {
    // 设置属性默认值
    // private static defaultProps = {
    //     show: false,
    // };  // 注意这里有分号
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            showShare: false,
            show:dvaStore.getState().LocalSpecialtyModel.show,
        };
        this.getShareContent = this.getShareContent.bind(this);
    }
    componentWillMount() {
        // 请求头部内容 dva 操作, header 数据
    }
    componentDidMount() {
        // 请求头部内容 dva 操作
        // this.props.dispatch({
        //     type: 'LocalSpecialtyModel/getCharaIndex',
        //     payload: {},
        //     callback: () => {
        //         // 设置列表刷新
        //     }
        // });
    }

    getShareContent = () => {
        /**
         * 分享到微信好友
         * @param command 数组
         * @param title {String} 分享标题
         * @param content {String} 分享内容
         * @param pic {String} 分享图片url
         * @param url {String} 分享内容跳转链接
         * @param type {Integer} 分享类型 0 链接分享 1 多图分享（目前仅支持微信和微博，且无成功回调） 2 单图分享
         * 回调Promises
         */
        const { programDetail, mid } = this.props;
        const title = this.state.title;
        const content = this.state.title;
        const pic = L.get(programDetail, "imageUrl", '');
        const url = `${URL.get_ctjj_share_itsolutedetail}${this.state.id}/${mid}`;

        return [ title, content, pic, url, 0 ];
    };
     

    render() {
    //  console.log(dvaStore.getState().LocalSpecialtyModel.show)
    console.log(this.state.show)
        return (
            <View style={{width,height,position:'relative'}}>
            {dvaStore.getState().LocalSpecialtyModel.show &&
             <TouchableOpacity style={{width,height,backgroundColor:'rgba(0,0,0,0)',position:'absolute',left:0,right:0,top:0,bottom:0,}} onPress={()=>{
               const show = dvaStore.dispatch(createAction('LocalSpecialtyModel/isShow')());
               this.setState({show:!show});
            }}>
                  <View style={{width:120,backgroundColor:'rgba(0,0,0,0.5)',position:'absolute',top:10,right:20}}>
                    <TouchableOpacity 
                          onPress={()=>{
                              this.setState({showShare: true,})
                          }}
                               
                          style={styles.info}
                    >
                        <Image 
                            style={[styles.selectedImg,{marginLeft:6}]}
                            source={require('../../../../images/toshare.png')}/> 
                        <Text style={[styles.txt,{}]}>去分享</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.info} onPress={this.onRightClick}>
                        <Image 
                            style={styles.selectedImg}
                            source={require('../../../../images/gohomePage.png')}/> 
                        <Text style={styles.txt}>首页</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.info} onPress={()=>{}}>
                        <Image 
                            style={styles.selectedImg}
                            source={require('../../../../images/custom.png')}/> 
                        <Text style={styles.txt}>客服</Text>
                    </TouchableOpacity>
                </View>
                
                </TouchableOpacity>
            }
              <ShareModle
                    visible={this.state.showShare} content={this.getShareContent()}
                    onCancel={() => this.setState({ showShare: false })}
                    hiddenEwm
                />
            </View>
            // <SafeView>
            //     <View style={[styles.container]}>
            //         {/* <NavBar title={'特产汇'} rightFun={()=>{
            //             this.setState({showShare: true});
            //         }}/> */}
            //         <NavBar title={'特产汇'} rightView={rightView()}/>
                
            //     <View style={{width,height:100,backgroundColor:'red'}}>

            //     </View>
            //     </View>
               
            //     <ShareModle
            //         visible={this.state.showShare} content={this.getShareContent()}
            //         onCancel={() => this.setState({ showShare: false })}
            //         hiddenEwm
            //     />
                
            // </SafeView>
        );
    }
     onRightClick = ()=>{
        this.props.navigation.navigate('Home');
    }
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
    selectedBtn: {
        height: 23,
        width: 22,
        // paddingLeft: 10,
        // backgroundColor: 'red',
    },
    selectedImg: {
        width: 16,
        height: 16,
        marginRight:8,
    },
    txt: {
        color:'#fff',
        fontSize:14
    },
    info: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        height:28,
    }

});
