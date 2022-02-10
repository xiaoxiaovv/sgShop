import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Platform,
    Modal,
    Alert,
    Dimensions,
    DeviceEventEmitter,
} from 'react-native';
import { Modal as AntModal, List, Badge } from 'antd-mobile';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ScreenUtil from './../../containers/Home/SGScreenUtil';
import { createAction } from '../../utils';

import EStylesheet from 'react-native-extended-stylesheet';
import Address from './../../components/Address';
import { getLocation, stringToJson } from '../../utils/tools';
import { fetchDefaultSearch, fetchPosition } from '../../dvaModel/homeModel';
import { MessageWithBadge } from '../../components/MessageWithBadge';
import Permissions from 'react-native-permissions';
import AndroidOpenSettings from 'react-native-android-open-settings';
import {Color, Font} from 'consts';
import { addPosition } from '../../dvaModel/homeModel';


const malert = AntModal.alert;

import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;

const mapStateToProps = ({ address: { regionName }, users: { unread } }) => ({
    unread,
    regionName,
});

@connect(mapStateToProps)
export default class NewHomeNavBar extends Component {
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            BarStyleLight: true,
            NavBgColor: 'rgba(255, 255, 255,0)',
            defaultSearch: {hot_word: "Haier"},
        };
        this.rootView;
        this.setNativePropsee = this.setNativePropsee.bind(this);
    }
    setNativePropsee = (nativeProps)=> {
        this.setState({
            NavBgColor: nativeProps.NavBgColor,
            BarStyleLight: nativeProps.BarStyleLight,
        });
    };

    async componentDidMount() {
        try {
            const defaultSearch = await fetchDefaultSearch();
            if(defaultSearch){
                this.setState({ defaultSearch });
                this.props.dispatch(createAction('home/changeDefaultSearchHotWord')({defaultSearchHotWord: defaultSearch.hot_word}));
            }else{
                this.props.dispatch(createAction('home/changeDefaultSearchHotWord')({defaultSearchHotWord: "Haier"}));
            }
        }catch (e) {
            this.props.dispatch(createAction('home/changeDefaultSearchHotWord')({defaultSearchHotWord: "Haier"}));
        }
    }

    render() {
        const isWhite = false;
        const district = this.props.regionName.split('/')[0];
        return (
            <View
                ref={(root) => this.rootView = root}
                {...this.props}
                style={[{ backgroundColor: this.state.NavBgColor }, styles.container, this.props.isCategory ? styles.topBackground : null]}>
                {/* <StatusBar barStyle={this.props.BarStyleLight?'light-content':"default"}/> */}
                <TouchableOpacity style={{ flex: 2 }} activeOpacity={1.0} onPress={() => this.popLocationView()}>
                    <View style={styles.location}>
                        <Image style={styles.locationIcon} source={require('./../../images/locationAddress.png')} />  
                        <Text
                            numberOfLines={1}
                            // tslint:disable-next-line:no-bitwise
                            style={[styles.locationText, { color: '#666' }]}>
                            {district}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{flex: 5}} activeOpacity={0.7}
                    onPress={() => this.props.navigation.navigate('Search', { searchPlaceholder: IS_NOTNIL(this.state.defaultSearch.hot_word) ? this.state.defaultSearch.hot_word : ''})}
                >
                    <View style={[styles.searchBox, {backgroundColor: Color.GREY_6}]}>
                        <Image source={require('./../../images/search.png')} style={styles.searchIcon}/>
                        <Text style={styles.inputText} >{IS_NOTNIL(this.state.defaultSearch.hot_word) ? this.state.defaultSearch.hot_word : ''}</Text>
                    </View>
                </TouchableOpacity>
                <MessageWithBadge
                    badgeContainStyle={{top: 3, right: -5}}
                    hidingText
                    badgeContainStyle={{top: 3, right: -5}}
                    navigation={this.props.navigation}
                    unread={this.props.unread}
                    isWhite={isWhite}
                    imageStyle={{width: 24, height: 24}}
                />
                {/* 地址栏modal视图 */}
                <Modal
                    // 设置Modal组件的呈现方式
                    animationType='slide'
                    // 它决定 Modal 组件是否是透明的
                    transparent
                    // 它决定 Modal 组件何时显示、何时隐藏
                    visible={this.state.show}
                    // 当 Modal组件在屏幕上完成显示后，这个回调函数将被执行
                    onShow={() => Log('onShow')}
                    // 这是 Android 平台独有的回调函数类型的属性
                    // 开发者必须要写一个函数来处理当 Modal 显示在界面时且android物理返回键被按下时的业务逻辑
                    onRequestClose={() => Log('onShow')}
                >
                    <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                        <TouchableOpacity
                            style={{
                                position: 'absolute', top: 0, left: 0,
                                width: '100%', height: height - 400
                            }}
                            activeOpacity={1} onPress={() => this.dismissView()}>
                            <View style={{
                                position: 'absolute', top: 0, left: 0, width: '100%',
                                height: height - 400
                            }} />
                        </TouchableOpacity>
                        <Address
                            hasHeader={true}
                            onclick={() => this.setState({ show: false })}
                            onSelect={(location) => {
                                this.setState({ show: false, locationStr: location },() => {
                                    // 发通知
                                    DeviceEventEmitter.emit('locationChange');
                                    addPosition();
                                });
                            }}
                        />
                    </View>
                </Modal>
            </View>
        );
    }
    dismissView = ()=> {
        this.setState({
            show: false,
        });
    };
    popLocationView = async ()=> {
        this.setState({show: !this.state.show});
        // this.props.navigation.navigate('TestView', { titleName: '地址界面'})
        // Permissions.check('location').then(response => {
        //     // 如果已经打开定位权限 则进行定位
        //     if (response === 'authorized') {
        //         this.setState({show: true});
        //     } else {
        //         if (response === 'denied') {
        //             if (Platform.OS === 'ios') {
        //                 malert(
        //                     <Text style={{color: '#32BEFF', fontSize: 13}}>顺逛需要您打开地理定位权限</Text>,
        //                     <Text> </Text>,
        //                     [
        //                         {
        //                             text: '取消',
        //                             style: {color: '#32BEFF', fontSize: 14, paddingTop: 5},
        //                             onPress: () => Log('cancel'),
        //                         },
        //                         {
        //                             text: '确认',
        //                             style: {color: '#32BEFF', fontSize: 14, paddingTop: 5},
        //                             onPress: () => Permissions.openSettings().then(() => null),
        //                         },
        //                     ]);
        //             }} else {
        //             this._requestPermission();
        //         }
        //     }
        // });
    };
    _requestPermission = ()=> {
        // example
        Permissions.request('location', 'whenInUse').then(response => {
            if (response === 'restricted') {
                if (Platform.OS === 'android') {
                    malert(
                        <Text style={{color: '#32BEFF', fontSize: 13}}>顺逛需要您打开地理定位权限</Text>,
                        <Text> </Text>,
                        [
                            {
                                text: '取消',
                                style: {color: '#32BEFF', fontSize: 14, paddingTop: 5},
                                onPress: () => Log('cancel'),
                            },
                            {
                                text: '确认',
                                style: {color: '#32BEFF', fontSize: 14, paddingTop: 5},
                                onPress: () => AndroidOpenSettings.appDetailsSettings(),
                            },
                        ]);
                }
            }
            if (response === 'authorized') {
                this.setState({show: true});
            }
        });
    };
    handleNativeInterfaceMsg = (aMsg)=> {
        const msgObj = JSON.parse(aMsg);
    }

}

const styles = EStylesheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',  // 交叉轴方向上的对齐方式(这里作用是垂直居中)
        // height: ScreenUtil.isiPhoneX ? 88 : (Platform.OS === 'ios' ? 64 : 44),  // 处理ios状态栏,普通ios设备是68,iPhone X是92
        paddingTop: ScreenUtil.isiPhoneX ? 44 : (Platform.OS === 'ios' ? 20 : 0), // 处理ios状态栏,普通ios设备是20,iPhone X是44
        // 以下三个样式一起作用才能使得导航栏浮动固定在滚动列表视图上面
        width: '100%',   // 因为当前视图设置了absolute定位,必须有固定宽高,其子视图才不会错乱
        zIndex: 3,   // 提升当前组件层级(和下面的absolute定位配合使用实现导航栏透明效果)
        // position: 'absolute',   // 为了当前控件不占空间(只能做到让滚动视图全屏,无法提升当前组件层级)
        top: 0,
        borderBottomColor: 'lightgray',
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 64,
        '@media android': {
            height: 44,
        },
        '@media (width: 375) and (height: 812)': {
            height: 84,
        },
    },
    topBackground: {
        backgroundColor: 'white',
        borderBottomWidth: 0.3,
        borderBottomColor: 'lightgray',
        position: 'relative',
    },
    location: {
        flexDirection: 'row',
        alignItems: 'center',  // 使元素垂直居中排布, 当flexDirection为column时, 为水平居中
        marginLeft: ScreenUtil.scaleSize(16),
    },
    locationText: {
        width: (width - 45 - ScreenUtil.scaleSize(31))/7*2-24 -ScreenUtil.scaleSize(1),
        fontSize: Font.LARGE_4,
        color: Color.GREY_2,
        fontFamily: '.PingFangSC-Medium',
        backgroundColor: 'transparent',
        marginRight: ScreenUtil.scaleSize(1),
    },
    locationIcon: {
        height: 24,
        width: 24,
        resizeMode: 'contain',  // 设置拉伸模式
    },
    searchBox: {
        flex: 5,  // 相似于android中的layout_weight,设置为1即自己主动拉伸填充
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: ScreenUtil.scaleSize(5),
        marginRight: ScreenUtil.scaleSize(10),
        marginTop: ScreenUtil.scaleSize(8),
        marginBottom: ScreenUtil.scaleSize(8),
        height: ScreenUtil.scaleSize(28),
        borderRadius: ScreenUtil.scaleSize(15),  // 设置圆角边
    },
    searchIcon: {
        marginLeft: ScreenUtil.scaleSize(6),
        marginRight: ScreenUtil.scaleSize(6),
        height: 24,
        width: 24,
        resizeMode: 'contain',
    },
    inputText: {
        flex: 1,
        marginRight: ScreenUtil.scaleSize(2),
        backgroundColor: 'transparent',
        fontSize: ScreenUtil.scaleText(14),
        fontFamily: '.PingFangSC-Medium',
        color: Color.GREY_2,
        padding: 0,
    },
    messageBox: {
        flex: 1,
        alignItems: 'center',
        marginRight: ScreenUtil.scaleSize(16),
    },
    messageImage: {
        // 图标不要设置比例
        marginTop: ScreenUtil.scaleSize(3),
    },
    messageText: {
        fontSize: ScreenUtil.scaleText(10),
        marginTop: ScreenUtil.scaleSize(3),
        color: 'white',
        backgroundColor: 'transparent',
    },
    // messageRedPoint: {
    //   position: 'absolute',  // (绝对定位不占空间)
    //   width: ScreenUtil.scaleSize(6),
    //   height: ScreenUtil.scaleSize(6),
    //   borderRadius: ScreenUtil.scaleSize(3),  // 设置圆角边
    //   backgroundColor: 'red',
    //   top: ScreenUtil.scaleSize(5),
    //   right: ScreenUtil.scaleSize(3),
    // },
    badgeContain: {
        position: 'absolute',
        right: 0,
        top: 0,
        minWidth: 16,
        height: 16,
        paddingLeft: 2,
        paddingRight: 2,
        borderRadius: 8,
        backgroundColor: '#E62E25',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeTitle: {
        color: 'white',
        // width: 16,
        fontSize: 8,
        textAlign: 'center',
        marginBottom: 1,
    },
});
