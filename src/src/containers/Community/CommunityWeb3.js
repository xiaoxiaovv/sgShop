import React, { Component } from 'react';
import {
    View,
    Text,
    WebView,
    Alert,
    Platform,
    StatusBar,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    BackHandler,
    StyleSheet,
    NativeModules,
    Keyboard,
} from 'react-native';
import L from 'lodash';
import { connect } from 'react-redux';
import noservice from './../../images/noservice.png';
import close from './../../images/close.png';
import { NavBar, SafeView, IsIphoneX } from './../../components';
import {createAction, resetLoginMsg} from "../../utils";
import NavigationUtils from "../../dva/utils/NavigationUtils";
import URL from "../../config/url";
import SYImagePicker from 'react-native-syan-image-picker';

import ShareModle from './../../components/ShareModle';
import {Toast} from "antd-mobile/lib/index";
import Config from "react-native-config";

const Sip = StyleSheet.hairlineWidth;
let width = URL.width;
let height = URL.height;

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

@connect(({router,})=>({router}))
export default class CommunityWeb3 extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            title: '社群争霸赛',
            urlErr: false,
            showSheet: false,
            canGoBack: true,
            showShare: false,
            shareUrl: '',
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


        console.log('--------------', Math.random(0, 21));
        global.Web3Key = this.props.navigation.state.key;
        console.log(global.Web3Key)
    }


    async componentWillMount() {
        const params = this.props.navigation.state.params;
        const webUrl = L.get(params, 'url');
        this.setState({webUrl: webUrl}, ()=>{
            console.log(this.state.webUrl);
        });
        if (Platform.OS !== 'ios') {
            this.BackHandler = BackHandler.addEventListener('hardwareBackPress', this.goBack);
            }
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));

    }
    _keyboardDidShow(e) {
        this.setState({
            keyboardHeight: e.endCoordinates.height,
        });
    };
    _keyboardDidHide(e) {
        this.setState({
            keyboardHeight: 0,
        });
    };
    getShareContent = ()=>{
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
        const content = this.state.content;
        const pic = this.state.pic;
        const url = this.state.shareUrl;
        return [ title, content, pic, url, 0 ];
    };
    componentWillUnmount() {
        global.WebKey = false;
        if (Platform.OS !== 'ios') {
            BackHandler.removeEventListener('hardwareBackPress', this.goBack);
        }
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
    _onLoaddStart = async (e) => {

    };

    postMessage = (str)=>{
        console.log(str);
        this.webview.postMessage(str);
    };
    handleMessage = async (e)=>{
        console.log('------------------发消息了- handleMessage ------------------');
        try {
            let message = L.get(e.nativeEvent, 'data');
            let obj = JSON.parse(message);
            console.log(message);


            // {type: "", data: {}}

            let type = L.get(obj, 'type', 'none');
            let data = L.get(obj, 'data', {});
            if(type === 'login'){

            }else if(type === 'share'){
                const title = L.get(data, 'title', '社群争霸赛');
                const content = L.get(data, 'content', '社群争霸赛内容');
                const pic = L.get(data, 'pic', '显示的缩略图');
                const url = L.get(data, 'url', '分享的链接地址');
                this.setState({title, content, pic, shareUrl: url}, ()=>{
                    this.setState({showShare: true});
                });
                // this.showSheet();
            }else if(type === 'goCircle'){
                // 去圈子
                const id = L.get(data, 'id', '圈子id');
                const token = await global.getItem('userToken');
                this.props.dispatch(NavigationUtils.navigateAction("SuperSecondView", {
                    url: '/html/community/community_detial.html',
                    id:  Number(id),
                    userToken: token
                }));
            }else if(type === 'goProduct'){
                // 去具体商品页
                const id = L.get(data, 'id', '商品id');
                this.props.dispatch(NavigationUtils.navigateAction("GoodsDetail", {
                    productId:  Number(id),
                }));
            }else if(type === 'goDetail'){
                // 去社区详情页
                const id = L.get(data, 'id', '社区详情id');
                const token = await global.getItem('userToken');
                this.props.dispatch(NavigationUtils.navigateAction("SuperSecondView", {
                    url: '/html/topic/topic_details.html',
                    id: Number(id),
                    token: token,
                    type: 1
                }));
            }else if(type === 'postImg'){
                // 调取 APICloud 去发送图文
                const id = L.get(data, 'id', '724');
                const topicId = L.get(data, 'topicId', '圈子id');
                const topicName = L.get(data, 'topicName', '圈子名称');
                const token = await global.getItem('userToken');
                this.props.dispatch(NavigationUtils.navigateAction("SuperSecondView", {
                    url: '/html/topic/edit_topic.html',
                    topicId: Number(topicId),
                    topicName: topicName,
                    taskId:  Number(id),
                    userToken: token,
                    topicType: 'image'
                }));
            }else if(type === 'postVideo'){
                // 调取 APICloud 去发送视频
                const id = L.get(data, 'id', '724');
                const topicId = L.get(data, 'topicId', '圈子id');
                const topicName = L.get(data, 'topicName', '圈子名称');
                if(Platform.OS == 'ios'){
                    const token = await global.getItem('userToken');
                    this.props.dispatch(NavigationUtils.navigateAction("SuperSecondView", {
                        url: '/html/topic/video_record.html',
                        topicId: Number(topicId),
                        topicName: topicName,
                        taskId:  Number(id),
                        userToken: token,
                        topicType: 'video'
                    }));
                }else {

                    NativeModules.ToolsModule.Permission(
                        [
                            'android.permission.WRITE_EXTERNAL_STORAGE',
                            'android.permission.READ_EXTERNAL_STORAGE',
                            'android.permission.CAMERA',
                            'android.permission.RECORD_AUDIO']
                        , "相机读写").
                    then(async (res)=>{
                        if(res === 'success'){
                            const id = L.get(data, 'id', '724');
                            const topicId = L.get(data, 'topicId', '圈子id');
                            const topicName = L.get(data, 'topicName', '圈子名称');
                            const token = await global.getItem('userToken');
                            this.props.dispatch(NavigationUtils.navigateAction("SuperSecondView", {
                                url: '/html/topic/video_record.html',
                                topicId: Number(topicId),
                                topicName: topicName,
                                taskId:  Number(id),
                                userToken: token,
                                topicType: 'video'
                            }));
                        }else{
                            alert('没有相应的相机拍摄权限,不能进行视频发布');
                        }
                    });

                }
            }else if(type === 'goBack'){
                // 返回上一页
                this.goBack();
            }else if(type === 'close'){
                // 关闭当前 社群争霸赛页面
                this.props.navigation.goBack();
            }else if(type === 'appImage'){

                // if(Platform.OS == 'android'){
                    this.showSheet();
                // }

            }
        }catch (e) {
            console.log(e);
        }
    };

    openCamera = ()=>{
        console.log('-----------openCamera');
        if (Platform.OS === 'android') {

            NativeModules.ToolsModule.Permission(
                [
                    'android.permission.WRITE_EXTERNAL_STORAGE',
                    'android.permission.READ_EXTERNAL_STORAGE',
                    'android.permission.CAMERA']
                , "相机读写").
            then(async (data)=>{
                console.log('-----------openCamera---success');
                if(data === 'success'){

                    const options = {
                        isCrop: false,
                        quality: 80,
                        enableBase64: true,
                    };
                    NativeModules.PhotoModule.openCamera(options, (err, pictureItems) => {
                        console.log(pictureItems);
                        this.uploadImage(pictureItems[0]);
                    });


                }else{
                    alert('没有相应的相机拍摄权限!');
                }
            });

        } else {
            const options = {
                isCrop:  true,
                quality: 80,
                CropW: width,
                CropH: width,
                enableBase64: true,
            };
            SYImagePicker.openCamera(options, (err, pictureItems) => {
                if(!err) {
                    console.log('-----------SYImagePicker.openCamera---success');
                    this.uploadImage(pictureItems[0]);
                }
            });

        }

    };

    showSheet = ()=>{
        this.setState({showSheet: true});
    };

    uploadImage = async (item)=> {

        const url = `${Config.API_URL}${Config.UPLOAD_ASSESS_IMG_NEW}`;

        const userToken = await global.getItem('userToken');

        let uri = L.get(item, 'uri');
        let Iwidth = L.get(item, 'width', width);
        let Iheight = L.get(item, 'height', width);
        const imagePaths = [uri];

        // if (this.state.photosData.length > 0) {
        //     this.state.photosData.forEach((phtotoItem, index) => {
        //         if (phtotoItem) {
        //             const uri = phtotoItem.uri;
        //             imagePaths.push(uri);
        //         }
        //     });
        //
        // }

        const command = [url, userToken, Iwidth, Iheight, 50, imagePaths];
        // Toast.loading('正在上传图片...');
        NativeModules.PhotoModule.uploadImg(command)
            .then(result => {
                console.log(result);
                console.log('-----上传图片成功...--返回 H5-------');
                let data = {
                    type: "images",
                    data: result
                };
                let str = JSON.stringify(data);
                this.postMessage(str);
            })
            .catch((errorCode, domain, error) => {
                console.log('图片上传失败');
                // Toast.hide();
                // Toast.fail('图片上传失败', 2);
            });
    };

    asyncShowImagePicker = async ()=>{

        if (Platform.OS === 'android') {

            NativeModules.ToolsModule.Permission(
                [
                    'android.permission.WRITE_EXTERNAL_STORAGE',
                    'android.permission.READ_EXTERNAL_STORAGE',
                    'android.permission.CAMERA']
                , "相机读写").
            then(async (data)=>{
                if(data === 'success'){

                    const options1 = {
                        imageCount: 1,
                        isCamera: false,
                        isCrop: false,
                        quality: 80,
                        isGif: false,
                        enableBase64: true,
                    };
                    NativeModules.PhotoModule.asyncShowImagePicker(options1)
                        .then(result => {

                            console.log(result);
                            this.uploadImage(result[0]);
                        })
                        .catch((errorCode, domain, error) => {
                            // Log('失败');


                        });

                }else{
                    alert('没有相应的相机拍摄权限!');
                }
            });
        } else {
            const options = {
                imageCount: 1,
                isCamera: false,
                isCrop: true,
                quality: 80,
                isGif: false,
                CropW: width,
                CropH: width,
                enableBase64: true,
            };
            try {
                const photos = await SYImagePicker.asyncShowImagePicker(options);
                this.uploadImage(photos[0]);
            } catch (err) {
               console.log(err);
            }
        }
    };


    goBack = (webViewMsg) => {
          console.log('----goBack----');
          console.log(this.state.canGoBack);
        if (this.props.router.routes[this.props.router.index].routeName !== 'CommunityWeb3') {
            return false;
        }

        if(this.state.canGoBack){
            this.webview.goBack();
        }else{
            this.props.navigation.goBack();
        }

        return true;
    };

    render() {
        return (
            <SafeView>
            <View style={[styles.container]}>
                <WebView
                    style={[{flex: 1, marginTop: IsIphoneX ? 44: (Platform.OS == 'ios' ? 20: 0)}, {marginBottom: this.state.keyboardHeight}]}
                    ref={w => {
                        this.webview = w;
                    }}
                    onLoadStart={this._onLoaddStart}
                    // onLoadStart={(e) => {
                    //     console.log('-------=== onLoadStart ===--------');
                    //     console.log(e.nativeEvent);
                    // }}
                    // onShouldStartLoadWithRequest={this.shouldStartLoadWithRequest}
                    onNavigationStateChange={(params)=>{
                        console.log('-------=== onNavigationStateChange ===--------');
                        console.log(params);
                    }}
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
                        const nativeEvent = e.nativeEvent;
                        let title = L.get(nativeEvent, 'title');
                        let url = L.get(nativeEvent, 'url');
                        let canGoBack = L.get(nativeEvent, 'canGoBack');
                        this.setState({title, canGoBack});
                    }}
                    javaScriptEnabled
                    injectedJavaScript={patchPostMessageJsCode}>
                </WebView>
                {
                    this.state.urlErr && <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center'}}>
                        <Image source={noservice} style={{height: 100, width: 130, marginTop: 50}}/>
                        <Text style={{color: '#999', fontSize: 14, marginTop: 20}}>您访问的地址不存在!</Text>
                    </View>
                }
                {
                    this.state.showSheet && <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    }}>
                        <View style={{flex: 1}}>
                            <TouchableWithoutFeedback style={{flex: 1}} onPress={()=>{
                                this.setState({showSheet: false});
                            }}>
                                <View style={{flex: 1, width, height: height - 20 - 224}}/>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={[{height: 224, backgroundColor: '#fff', width}, styles.allCenter]}>
                            <View style={[{height: 44, width, borderBottomWidth: Sip, borderBottomColor: "#eee"}, styles.allCenter]}>
                                <Text style={{fontSize: 16, color: '#333'}}>从以下选取图片</Text>
                            </View>
                            <TouchableWithoutFeedback  onPress={()=>{
                                this.setState({showSheet: false});
                                this.openCamera();
                            }}>
                                <View style={[{height: 60, width: width - 20, backgroundColor: '#fff', borderBottomWidth: Sip, borderBottomColor: "#eee"}, styles.allCenter]}>
                                    <Text style={{fontSize: 15, color: '#666'}}>拍照选取</Text>
                            </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback  onPress={()=>{
                                // 调取安卓
                                this.setState({showSheet: false});
                                this.asyncShowImagePicker();
                            }}>
                                <View style={[{height: 60, width: width - 20, backgroundColor: '#fff', borderBottomWidth: Sip, borderBottomColor: "#eee"}, styles.allCenter]}>
                                    <Text style={{fontSize: 15, color: '#666'}}>从相册选取</Text>
                            </View>
                            </TouchableWithoutFeedback><TouchableWithoutFeedback  onPress={()=>{
                                this.setState({showSheet: false});
                            }}>
                            <View style={[{height: 60, width, backgroundColor: '#fff', }, styles.allCenter]}>
                                <Text style={{fontSize: 15, color: '#FF6026'}}>取消</Text>
                            </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                }
                {this.state.showShare && <ShareModle
                    visible={this.state.showShare} content={this.getShareContent()}
                    onSuccess={(platform)=>{
                        console.log('------分享成功-----');
                        let data = {
                            type: "shareSuccess",
                            data: {platform: platform}
                        };
                        let str = JSON.stringify(data);
                        this.postMessage(str);
                    }}
                    onCancel={() => this.setState({ showShare: false })}
                    hiddenEwm
                    hidingTitle
                />}
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
        width: width, height: 0.48 * width
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