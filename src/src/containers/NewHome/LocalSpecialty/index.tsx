
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

import { UltimateListView, UltimateRefreshView } from 'rn-listview';
import { connect } from 'react-redux';
import IsLoginTouchableOpacity from "../../../common/IsLoginTouchableOpacity";


const Sip = StyleSheet.hairlineWidth;
import ShareModle from './../../../components/ShareModle';
import URL from './../../../config/url';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

import cart from '../../../images/shop_cart_gray.png';
import { NavBar, SafeView } from './../../../components';
import L from "lodash";
import {ctjjService} from "../../../dva/service";
import {Toast} from "antd-mobile/lib/index";
import RightCommon from './rightMore'; 
import {createAction, px} from '../../../utils';
import { ICustomContain ,INavigation} from '../../../interface/index';
import SpecialtyDetail from './specialtyDetail/homePageDetail';



@connect(({ctjjModel, address, users, cartModel}) => ({...ctjjModel, ...address, ...users, ...cartModel}))
export default class LocalSpecialty extends Component<ICustomContain&INavigation> {
   
    private listView?: UltimateListView;
    private button?: TouchableOpacity;
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            showShare:false,
            isShow: false,
            isFooter: false,
        };
    }
    componentWillMount() {
        // 请求头部内容 dva 操作, header 数据
    }
    componentDidMount() {
        // this.listView.refresh();
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
        const { mid } = this.props;
        const title = '顺逛·特产汇 汇集全国优质特产';
        const content = '找特产，来顺逛，质量更可靠，价格更亲民，特产汇欢迎您的到来';
        const pic = 'http://cdn09.ehaier.com/shunguang/H5/www/img/specialty_share_pic.png';
        const url = `${URL.get_chara_share_specialtystore}/${mid}`;

        return [ title, content, pic, url, 0 ];
    };


    private onScroll = ( e ): void => {
        // 获取视图Y轴偏移量
        const offset = e.nativeEvent.contentOffset.y;

        if (offset > 110) {
            this.button.setNativeProps({ opacity: 1.0 });
            //   this.navbar.getWrappedInstance().setNativePropsee({NavBgColor: 'rgba(255, 255, 255,' + 1.0 + ')', BarStyleLight: false});
        } else {
            this.button.setNativeProps({ opacity: 0 });
            //      this.navbar.getWrappedInstance().setNativePropsee({NavBgColor: 'rgba(255, 255, 255,' + 0 + ')', BarStyleLight: true});
        }

    }
   
    render() {
        return (
            <SafeView>
                <View style={[styles.container]}>
                   <NavBar
                       title={'特产汇'}
                       rightView={
                        <View style={{flexDirection: 'row',alignItems: 'center',}}>
                          <TouchableOpacity activeOpacity={0.8}
                            onPress={() => this.props.navigation.navigate('Search', { searchKey: ''})}
                          >
                            <Image style={styles.searchImage} source={require('../../../images/search.png')}/>
                          </TouchableOpacity>
                          <IsLoginTouchableOpacity
                               onPress={()=>this.setState({showShare: true})}>
                               <Image resizeMode='stretch' style={styles.shareImage}
                                    source={require('../../../images/icon_share_gray.png')}/>
                               </IsLoginTouchableOpacity>
                        </View>
                       }
                    />
                <View style={[styles.container]}>
                    <ScrollView
                        ref={(ref) => { this.listView = ref }}
                        onScroll={this.onScroll}
                    >
                       <SpecialtyDetail navigation={this.props.navigation} from = {2}/>
                    </ScrollView>
                    <TouchableOpacity
                        style={[{bottom: 116, position: 'absolute', right: 10, height: 50, width: 50, backgroundColor: '#faf0e4', borderRadius:25}, styles.allCenter]}
                        onPress={() => {
                            this.props.dispatch(createAction('router/apply')({type: 'Navigation/NAVIGATE', routeName: 'Cart', params: {showCartBackBtn: true}}))
                        }}
                    >
                        <Image style={{height: 40, width: 40, marginLeft: -2, marginBottom: -2}}
                               source={cart}/>
                        <View style={{
                            width: 20,
                            minHeight: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                            top: 8,
                            right: 0,
                            borderRadius: 10,
                            backgroundColor: '#F40',
                            overflow: 'hidden'
                        }}>
                            <Text
                                style={{fontSize: 8, color: '#fff', alignSelf: 'center', textAlign: 'center'}}
                                numberOfLines={1}
                            >
                                {this.props.cartSum <= 99 ? this.props.cartSum : '99+'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{position: 'absolute', bottom: 50, right: 10, opacity: 0,}}
                        onPress={() => this.listView && this.listView.scrollTo({x: 0, y: 0, animated: true})}
                        ref={ref => this.button = ref}
                    >
                        <Image style={{height: 50, width: 50}} source={require('../../../images/icon_totop.png')} />
                    </TouchableOpacity>


                </View>
                </View>
                <ShareModle
                    visible={this.state.showShare} content={this.getShareContent()}
                    onCancel={() => this.setState({ showShare: false })}
                    hiddenEwm
                />
            </SafeView>
        );
    }
    
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
    },
    searchImage: {
        height: 24,
        width: 24,
        marginLeft: 16,
        marginRight: 5,
        marginVertical: 10,
    },
    shareImage:{
        width: 24,
        height: 24,
        marginRight: 16,
        marginVertical: 10,
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
    },
    imgs: {
        width: 16,
        height: 16,
        marginRight: 8,
    },
    toTopButton: {
        position: 'absolute',
        right: 10,
        bottom: 100,
        height: 50,
        width: 50,
        opacity: 0,
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
