import React, { Component } from 'react';
import {
    View,
    Text,
    WebView,
    Alert,
    Platform,
    StatusBar,
    TouchableOpacity,
    Image,
    BackHandler,
    StyleSheet,
    NativeModules,
    Keyboard,
} from 'react-native';
import L from 'lodash';
import { connect } from 'react-redux';
import noservice from './../../images/noservice.png';
import { NavBar, SafeView, IsIphoneX } from './../../components';
import {createAction, resetLoginMsg} from "../../utils";
import NavigationUtils from "../../dva/utils/NavigationUtils";
import ShareModle from './../../components/ShareModle';


const Sip = StyleSheet.hairlineWidth;
import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

// fix https://github.com/facebook/react-native/issues/10865
let patchPostMessageJsCode = `(${String(function () {
    let originalPostMessage = window.postMessage;
    let patchedPostMessage = function (message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer);
    };
    patchedPostMessage.toString = function () {
        return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')
    };
    window.postMessage = patchedPostMessage;
})})();`;

// 海尔家电隐私权政策
@connect(({router, users})=>({router, ...users}))
export default class CustomPageWeb extends Component {
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
        const title = this.state.title;
        const content = this.state.title;
        const pic = "";
        const url = this.state.webUrl;
        return [ title, content, pic, url, 0 ];
    };
    _onLoaddStart = async (params) => {
        const url = params.url;
        console.log('-----_onLoaddStart-----:', url);
        if(this.state.urlErr){
            this.setState({urlErr: false});
        }
        if (url.includes('productDetail')) {
            const arr = url.split('/');

            this.props.dispatch(NavigationUtils.navigateAction("GoodsDetail", {
                productId: arr[arr.length - 5],
                storeId: arr[arr.length - 2]
            }));

            this.webview.goBack();
            return false;
        }



    };
    handleMessage = (e)=>{
        console.log('------------------发消息了- handleMessage ------------------');
        try {
            let message = L.get(e.nativeEvent, 'data');
            let obj = JSON.parse(message);
            console.log(message);
            let type = L.get(obj, 'type', 'none');
            if(type === 'login'){
                let secritId = L.get(obj, 'data.secritId');
                // 获取到 secritId
                console.log(secritId);
                resetLoginMsg(secritId);
                // 开始做登录操作
            }
        }catch (e) {
            console.log(e);
        }
    };
    goBack = (webViewMsg) => {
          console.log('----goBack----');
          console.log(this.state.canGoBack);
        if (this.props.router.routes[this.props.router.index].routeName !== 'CustomPageWeb') {
            return false;
        }

        if(this.state.canGoBack){
            this.webview.goBack();
        }else{
            this.props.navigation.goBack();
        }
        return true;
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            title: '',
            urlErr: false,
            showShare: false,
            canGoBack: true,
            webUrl: '',
            lastUrl: '',
            keyboardHeight: 0
        };
        this.goBack = this.goBack.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
        this._onLoaddStart = this._onLoaddStart.bind(this);
        this._keyboardDidShow = this._keyboardDidShow.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
    }

    componentDidMount() {
    }

    componentWillMount() {
        const params = this.props.navigation.state.params;
        const webUrl = L.get(params, 'url');
        const title = L.get(params, 'title');
        this.setState({webUrl: `${webUrl}`, title}, ()=>{
            console.log(this.state.webUrl);
        });
        if (Platform.OS !== 'ios') {
            this.BackHandler = BackHandler.addEventListener('hardwareBackPress', this.goBack);
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
        }
    }

    _keyboardDidShow(e) {
        this.setState({
            keyboardHeight: e.endCoordinates.height,
        });
    }

    _keyboardDidHide(e) {
        this.setState({
            keyboardHeight: 0,
        });
    }

    componentWillUnmount() {
        if (Platform.OS !== 'ios') {
            BackHandler.removeEventListener('hardwareBackPress', this.goBack);
            this.keyboardDidShowListener.remove();
            this.keyboardDidHideListener.remove();
        }
    }

    render() {

        return (
            <SafeView>
            <View style={[styles.container]}>
                <NavBar title={this.state.title}
                        // navBgColor={'transparent'}
                        // headerStyle={{position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10}}
                        defaultBack={false}
                        leftFun={this.goBack}
                />
                <WebView
                    style={[{flex: 1}, {marginBottom: this.state.keyboardHeight}]}
                    ref={w => {
                        this.webview = w;
                    }}
                    onNavigationStateChange={this._onLoaddStart}
                    // onLoadStart={}
                    onLoad={(e) => {
                        console.log('-------=== onLoad ===--------');
                        console.log(e.nativeEvent);

                    }}
                    renderError={ (e) => {
                        console.log('-------=== renderError ===--------');
                        console.log(e);
                        if (e === 'WebKitErrorDomain') {
                            if(!this.state.urlErr){
                                this.setState({urlErr: true});
                            }
                        }
                    }}
                    onError={(e) => {
                        if(!this.state.urlErr){
                            this.setState({urlErr: true});
                        }
                        console.log('-------=== onError ===--------');
                        console.log(e.nativeEvent);
                    }}
                    source={{uri: this.state.webUrl}}
                    onMessage={(e) => {
                        this.handleMessage(e);
                    }}
                    onLoadEnd={(e) => {
                        console.log('-------=== onLoadEnd ===--------');
                        console.log(e.nativeEvent);
                        const nativeEvent = e.nativeEvent;
                        let title = L.get(nativeEvent, 'title');
                        let url = L.get(nativeEvent, 'url');
                        let canGoBack = L.get(nativeEvent, 'canGoBack');
                        this.setState({title, canGoBack}, ()=>{
                        });
                    }}
                    javaScriptEnabled
                    injectedJavaScript={patchPostMessageJsCode}>
                </WebView>
                <ShareModle
                    visible={this.state.showShare} content={this.getShareContent()}
                    onCancel={() => this.setState({ showShare: false })}
                    hiddenEwm
                    hidingTitle
                    onSuccess={() => {
                        Alert.alert('提示:', '分享成功', [{text: '确定'}]);
                    }}
                />
                {
                    this.state.urlErr && <View style={{position: 'absolute', top: 100, left: 0, right: 0, bottom: 0, alignItems: 'center'}}>
                        <Image source={noservice} style={{height: 100, width: 130, marginTop: 50}}/>
                        <Text style={{color: '#999', fontSize: 14, marginTop: 20}}>您访问的地址不存在!</Text>
                    </View>
                }
                </View>
            </SafeView>
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
});