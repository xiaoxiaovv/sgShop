/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    ImageBackground,
    View, ScrollView,
    TouchableOpacity,
    Linking, Alert, Modal, WebView,
} from 'react-native';

import {connect} from 'react-redux';
import Swiper from 'react-native-swiper';
import {NavBar, SafeView,Banners} from './../../../components';
import ImageViewer from 'react-native-image-zoom-viewer';

const Sip = StyleSheet.hairlineWidth;

import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

import L from "lodash";

import MapTool from './MapTool';
import {action, createAction, NavigationUtils,} from './../../../dva/utils';

import location from './../../../images/location_ct.png';
import {ActionSheet} from 'antd-mobile';
import SCWebView from './../../../components/SwitchScroll/SCWebView'
import {goBanner} from "../../../utils/tools";


@connect(({ctjjModel}) => ({...ctjjModel}))
export default class StoreDetail extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            selected: 0,
            index: 0,
            showImageViewer: false,
        };
        this.goMap = this.goMap.bind(this);
    }

    componentWillMount() {
        // 请求头部内容 dva 操作, header 数据
    }

    componentDidMount() {
        // 请求头部内容 dva 操作
    }

    goMap = () => {
        const {store} = this.props;
        const latitude = L.get(store, "latitude", 36.1146544721);
        const longitude = L.get(store, "longitude", 120.4633782991);
        const name = L.get(store, "name", '到店体验店');
        const BUTTONS = ['百度地图', '高德地图', '取消'];

        ActionSheet.showActionSheetWithOptions({
                options: BUTTONS,
                cancelButtonIndex: BUTTONS.length - 1,
                // title: 'title',
                message: '选择导航App',
                maskClosable: true,
                'data-seed': 'logId',
            },
            (buttonIndex) => {
                if (buttonIndex == 0) {
                    MapTool.turn2MapApp(longitude, latitude, 'baidu', name);
                } else if (buttonIndex == 1) {
                    MapTool.turn2MapApp(longitude, latitude, 'gaode', name);
                }
            });
    };


    render() {

// <script>
// document.getElementsByTagName('html')[0].onclick = function(e){
//     if(e.target.tagName == 'a'){
//         // alert(e.target.href)
//         e.preventDefault();
//     }
// }
// </script>


        const {store} = this.props;
        const imageUrls = L.get(store, "imageUrls", []);
        const address = L.get(store, "address", '');
        const introduction = L.get(store, "introduction", '');
        const imageUrl = L.get(store, "imageUrl", '');
        const distance = L.get(store, "distance", '');
        const name = L.get(store, "name", 'title');
        const title = L.get(store, "title", '');
        const typeValue = L.get(store, "typeValue", '');
        const mobile = L.get(store, "mobile", '');
        const storeId = L.get(store, "storeId");
        const html = `<html lang="en">
<head>
    <meta http-equiv=Content-Type content="text/html;charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
</head>
<body>
<div style="width: 100%;">${introduction}</div>
</body>
</html>`;

        return (
            <View style={[styles.container]}>
                <SafeView showBottom={true}>
                    <View style={[styles.container]}>
                        <NavBar title={name}/>
                        <View>
                            {imageUrls.length > 0 &&
                            <Banners
                                dots={false}
                                imageKey={'key'}
                                onBarnnerPress={(item) => this.setState({
                                    index: item.key,
                                    showImageViewer: true
                                })}
                                bannerData={imageUrls}
                            />
                            }
                            <View style={{height: 100, backgroundColor: '#fff'}}>
                                <View style={[{marginLeft: 16, marginTop: 9}]}>
                                    <View style={[styles.row, {height: 17}]}>
                                        <View style={[styles.allCenter, {
                                            backgroundColor: '#2979FF',
                                            height: 17,
                                            paddingHorizontal: 5
                                        }]}>
                                            <Text style={{color: '#fff', fontSize: 12}}>{typeValue || ''}</Text>
                                        </View>
                                    </View>
                                    <Text style={{color: '#333', fontSize: 14, maxWidth: SWidth - 125, marginTop: 7}}
                                          numberOfLines={1}>{name || ''}</Text>
                                    <Text style={{color: '#999', fontSize: 12, maxWidth: SWidth - 125, marginTop: 4}}
                                          numberOfLines={1}>{address || ''}</Text>
                                    <View style={[styles.aCenter, styles.row, {marginTop: 6}]}>
                                        <Image source={location} style={{height: 15, width: 15}} resizeMode={'contain'}/>
                                        <Text style={{color: '#999', fontSize: 12, marginLeft: 2}}>{distance || ''}</Text>
                                    </View>
                                </View>
                            </View>

                        </View>
                        <View style={[{backgroundColor: '#fff', marginTop: 4}]}>
                            <View style={[styles.aCenter, styles.row, {height: 44}]}>
                                <View style={{height: 13, width: 3, backgroundColor: '#2979FF', marginLeft: 16}}/>
                                <Text style={{fontSize: 14, marginLeft: 8}}>体验店简介</Text>
                            </View>
                            <View

                                style={[{marginBottom: 16, minHeight: 0.5 * SHeight}, styles.allCenter]}>
                                <WebView
                                    ref={ref => this.webRef = ref}
                                    automaticallyAdjustContentInsets
                                    javaScriptEnabled={true}
                                    setVerticalScrollBarEnabled={true}
                                    domStorageEnabled
                                    mixedContentMode={'always'}
                                    scalesPageToFit
                                    style={{width: SWidth - 16, flex: 1,}}
                                    source={{html: html, baseUrl: ''}}
                                />
                            </View>
                        </View>

                    </View>
                    {imageUrls.length > 0 && <Modal visible={this.state.showImageViewer} transparent={true}>
                        <ImageViewer
                            imageUrls={imageUrls.map((item) => {
                                return {url: item || ''}
                            })}
                            index={this.state.index}
                            onClick={() => this.setState({showImageViewer: false})}
                        />
                    </Modal>}
                </SafeView>
                <View style={[styles.row, {
                    height: 48,
                    backgroundColor: '#fff',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderTopColor: '#E4E4E4',
                    borderTopWidth: Sip,
                    borderBottomColor: '#E4E4E4',
                    borderBottomWidth: Sip,
                }]}>
                    <TouchableOpacity activeOpacity={0.9} style={{flex: 1}} onPress={() => {
                        this.props.dispatch(NavigationUtils.navigateAction('StoreHome', {storeId: storeId ? storeId : 20219251}));
                    }}>
                        <View style={[styles.allCenter, {flex: 1}]}>
                            <Text style={{fontSize: 14, color: '#333'}}>官方微店</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.9} style={{flex: 1}} onPress={() => {
                        Linking.canOpenURL(`tel:${mobile}`).then(supported => {
                            if (supported) {
                                Linking.openURL(`tel:${mobile}`)
                                // Alert.alert(
                                //     `拨打我们的预约电话:${mobile}`,
                                //     null,
                                //     [
                                //         {text: '取消', onPress: () => console.log('Cancel Pressed!')},
                                //         {text: '立即拨打', onPress: () => Linking.openURL(`tel:${mobile}`)},
                                //     ]
                                // )
                            } else {
                                alert('目前不能拨打电话!');
                            }
                        });
                    }}>
                        <View
                            style={[styles.allCenter, {flex: 1, borderLeftColor: '#E4E4E4', borderLeftWidth: Sip}]}>
                            <Text style={{fontSize: 14, color: '#333'}}>预约联系</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.9} style={{flex: 1}} onPress={() => {
                        this.goMap();
                    }}>
                        <View
                            style={[styles.allCenter, {flex: 1, borderLeftColor: '#E4E4E4', borderLeftWidth: Sip}]}>
                            <Text style={{fontSize: 14, color: '#333'}}>导航到店</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
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
    row: {
        flexDirection: 'row'
    },
    banner: {
        width: SWidth, height: 0.48 * SWidth
    }
});
