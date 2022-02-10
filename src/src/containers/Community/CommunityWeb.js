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
import close from './../../images/close.png';
import { NavBar, SafeView, IsIphoneX } from './../../components';
import {createAction, resetLoginMsg} from "../../utils";
import NavigationUtils from "../../dva/utils/NavigationUtils";

const Sip = StyleSheet.hairlineWidth;
import URL from './../../config/url.js';
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

@connect(({router,})=>({router}))
export default class CommunityWeb extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            title: '社群争霸赛',
            urlErr: false,
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


        console.log('--------------', Math.random(0, 21));
        global.WebKey = this.props.navigation.state.key;
        console.log(global.WebKey)
    }


    componentWillMount() {
        const params = this.props.navigation.state.params;
        const webUrl = L.get(params, 'url');
        this.setState({webUrl: `${webUrl}&openType=app`}, ()=>{
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
        global.WebKey = false;
        if (Platform.OS !== 'ios') {
            BackHandler.removeEventListener('hardwareBackPress', this.goBack);
            this.keyboardDidShowListener.remove();
            this.keyboardDidHideListener.remove();
        }
    }
    _onLoaddStart = async (e) => {
        const url = e.nativeEvent.url;
        console.log('-----_onLoaddStart-----:', url);
        if(this.state.urlErr){
            this.setState({urlErr: false});
        }

        //跳转个人主页处理
        if (url.indexOf('heIssue') > -1 || url.indexOf('share/ta_page.html') > -1) {
            console.log('-------跳转我得发布页-------');
            this.props.dispatch(NavigationUtils.navigateAction("SuperSecondView", {
                url: '/html/mine/my_publish.html'
            }));
            return;
        }


        // "http://mobiletest.ehaier.com:38080/share/community_detail.html?eyJjaXJjbGVJZCI6NjYyfQ==?secritId=8b6402a7f4b7f4ffe25c937af5e2fc23&token=32809f53-540d-438b-8e75-56f7c79d7741%2317N8xphJfa9NpkMaaxuFd1%2B%2BXOi%2FBUP5zrShs0lo2ohPTYakkYzgflRIxEpk4Kgj"
        if (url.indexOf('productDetail') > -1) {

            // 设置跳转 rn
            let a = url.substring(url.indexOf('productDetail/'));
            let b = a.substring(14);
            let positions = this.searchSubStr(b,"/");
            let num1=b.substring(0,positions[0]);
            let num2=b.substring(positions[0]+1,positions[1]);
            let num3=b.substring(positions[1]+1,positions[2]);
            let num4=b.substring(positions[3]+1,positions[4]);
            let num5=b.substring(positions[4]+1,b.indexOf('?'));
            let urls=url.substring(url.indexOf('?'));
            let tokens = this.GetQueryString('secritId',urls);
            let _urlToken = decodeURI(tokens);// 截取secritId,用于获取用户信息

            // $state.go('productDetail',{
            //     productId:num1,            //     o2oType:num2,
            //     fromType:num3,
            //     storeId:num4,
            //     shareStoreId:num5
            // })
            console.log('-------跳转单品页-------');
            this.props.dispatch(NavigationUtils.navigateAction("GoodsDetail", {
                productId: num1
            }));

            return;
        }

        // 跳转普通帖子话题详情页面处理
        if (url.indexOf('noteDetails') > -1) {
            let tempArr = url.split('/'); // 通过 '/'来分割url,以便取出其中的话题ID
            // $state.go('noteDetails', {noteId: tempArr[6], isShortStory: 1});
            // return false;
            const token = await global.getItem('userToken');
            this.props.dispatch(NavigationUtils.navigateAction("SuperSecondView", {
                url: '/html/topic/topic_details.html',
                id: Number(tempArr[6]),
                token: token,
                type: 1
            }));

            return;
        }


        // 跳转圈子 目前只有出题才有跳转圈子 662
        if (url.indexOf('community_detail.html') > -1) {
            const token = await global.getItem('userToken');
            this.props.dispatch(NavigationUtils.navigateAction("SuperSecondView", {
                url: '/html/community/community_detial.html',
                id: 662,
                userToken: token
            }));
            // 进入社区的圈子,目前还有问题
            return;
        }

        // 跳转圈子 目前只有出题才有跳转圈子 662
        if (url.indexOf('circlePage/662') > -1) {
            const token = await global.getItem('userToken');
            this.props.dispatch(NavigationUtils.navigateAction("SuperSecondView", {
                url: '/html/community/community_detial.html',
                id: 662,
                userToken: token
            }));
            // 进入社区的圈子,目前还有问题
            return;
        }


        //跳转发话题
        if (url.indexOf('publishCircle') > -1) {
            // $rootScope.topss=true;
            let urls=url.substring(url.indexOf('?'));
            let a=url.substring(url.indexOf('publishCircle/'));
            let b=a.substring(14);
            let positions = this.searchSubStr(b,"/");
            console.log(urls);
            let taskId = this.GetQueryString('taskId',urls);


            let num1=b.substring(0,positions[0]);
            let num2=b.substring(positions[0]+1,positions[1]);
            let num3=b.substring(positions[1]+1,b.indexOf('?'));
            if(num3==1){
                // $state.go('publishCircle',{
                //     identifierCode:'',
                //     topicId:665,
                //     topicStyle:1,
                //
                // })

                // 跳转图文
                console.log('-------跳转图文-------', taskId);

                const token = await global.getItem('userToken');
                this.props.dispatch(NavigationUtils.navigateAction("SuperSecondView", {
                    url: '/html/topic/edit_topic.html',
                    topicId: 665,
                    topicName: '任务区',
                    taskId: Number(taskId),
                    userToken: token,
                    topicType: 'image'
                }));

            }else if(num3==3){
                // 跳转视频
                console.log('-------跳转视频-------', taskId);
                if(Platform.OS == 'ios'){
                    const token = await global.getItem('userToken');
                    this.props.dispatch(NavigationUtils.navigateAction("SuperSecondView", {
                        url: '/html/topic/video_record.html',
                        topicId: 665,
                        topicName: '任务区',
                        taskId: Number(taskId),
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
                    then(async (data)=>{
                        if(data === 'success'){
                            const token = await global.getItem('userToken');
                            this.props.dispatch(NavigationUtils.navigateAction("SuperSecondView", {
                                url: '/html/topic/video_record.html',
                                topicId: 665,
                                topicName: '任务区',
                                taskId: Number(taskId),
                                userToken: token,
                                topicType: 'video'
                            }));
                        }else{
                            alert('没有相应的相机拍摄权限,不能进行视频发布');
                        }
                    });

                }
                // if (window.medias) {
                //     window.medias.StartMedias('5s', '30s', '10', '50', function (success) {
                //         $state.go('publishCircle', { identifierCode: '', topicId: 665, topicStyle: 3 });
                //         console.log(success);
                //         let jsonVideo = JSON.parse(success);
                //         let videoString = jsonVideo.videoFile;
                //         let videoimg = jsonVideo.imageFile;
                //         console.log(typeof videoString === 'undefined' ? 'undefined' : _typeof(videoString));
                //         let vv = videoString.replace('\\', '');
                //         let vi = videoimg.replace('\\', '');
                //         // $scope.mediaurl=success.videoFile.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
                //         $rootScope.mediaurla = vv;
                //         $rootScope.mediaImga = vi;
                //     }, function (error) {
                //         $state.go('circlePage',{circleId:665})
                //     });
                // }
            }
            return;
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
        if (this.props.router.routes[this.props.router.index].routeName !== 'CommunityWeb') {
            return false;
        }

        if(this.state.canGoBack){
            this.webview.goBack();
        }else{
            this.props.navigation.goBack();
        }


        return true;
    };
    GetQueryString = (name, url)=>{

        let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        let r = url.substr(1).match(reg);
        if(r!=null) {
            return  unescape(r[2]);
        }else{
            return '';
        }
    };

    searchSubStr = (str, subStr)=> {
        let positions = [];
        let pos = str.indexOf(subStr);
        while (pos > -1) {
            positions.push(pos);
            pos = str.indexOf(subStr, pos + 1);
        }
        return positions;
    };



    render() {
        return (
            <SafeView>
            <View style={[styles.container]}>
                <NavBar title={this.state.title || '社群争霸赛'}
                        defaultBack={false}
                        leftFun={this.goBack}
                        rightIcon={close}
                        rightFun={()=>{
                            this.props.navigation.goBack();
                            }}

                />
                <WebView
                    style={[{flex: 1}, {marginBottom: this.state.keyboardHeight}]}
                    ref={w => {
                        this.webview = w;
                    }}
                    onLoadStart={this._onLoaddStart}
                    // onLoadStart={(e) => {
                    //     console.log('-------=== onLoadStart ===--------');
                    //     console.log(e.nativeEvent);
                    // }}
                    // onShouldStartLoadWithRequest={this.shouldStartLoadWithRequest}
                    // onNavigationStateChange={this.shouldStartLoadWithRequest}
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

                            if (url.indexOf('/login') > -1) {
                                console.log('----onLoadEnd---跳转到登录---this.webview.goBack();----');
                                this.webview.goBack();
                            }
                            if (url.indexOf('productDetail') > -1) {
                                console.log('----onLoadEnd---跳转个人主页处理---this.webview.goBack();----');
                                this.webview.goBack();
                            }
                            // 跳转圈子 目前只有出题才有跳转圈子 662
                            if (url.indexOf('community_detail.html') > -1) {
                                console.log('----onLoadEnd---跳转圈子 目前只有出题才有跳转圈子 662---this.webview.goBack();----');
                                this.webview.goBack();
                            }
                            // 跳转圈子 目前只有出题才有跳转圈子 662
                            if (url.indexOf('circlePage/662') > -1)  {
                                console.log('----onLoadEnd---跳转圈子 目前只有出题才有跳转圈子 662---this.webview.goBack();----');
                                this.webview.goBack();
                            }
                            //跳转个人主页处理
                            if (url.indexOf('heIssue') > -1 || url.indexOf('share/ta_page.html') > -1) {
                                if(!this.state.lastUrl.indexOf('heIssue') > -1){
                                    console.log('----onLoadEnd---跳转个人主页处理---this.webview.goBack();----');
                                    this.setState({lastUrl: url}, ()=>{
                                        this.webview.goBack();
                                    });
                                    return;
                                }
                            }
                            if (url.indexOf('noteDetails') > -1) {
                                console.log('----onLoadEnd---跳转帖子话题详情页面处理---this.webview.goBack();----');
                                this.webview.goBack();
                            }
                            //跳转发话题
                            if (url.indexOf('publishCircle') > -1) {
                                console.log('----onLoadEnd---跳转发话题---this.webview.goBack();----');
                                this.webview.goBack();
                            }

                            this.setState({lastUrl: url});
                        });
                    }}
                    javaScriptEnabled
                    injectedJavaScript={patchPostMessageJsCode}>
                </WebView>
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