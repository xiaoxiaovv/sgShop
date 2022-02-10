import * as React from 'react';
import { View, WebView, Text, Platform } from 'react-native';
import { GET, POST_JSON, GET_P, POST_FORM} from '../../config/Http';
import config from '../../config/index';
import url from '../../config/url';
import { INavigation } from '../../interface';
import { createAction, iPhoneXPaddingTopStyle, IS_NOTNIL } from '../../utils/index';
import { getAppJSON, postAppJSON, postAppForm, postForm } from '../../netWork';
import Config from 'react-native-config';
interface IState {
    KjtToken: string;   // 快捷通token
    loadUrl: string;
    loadType: number;
}
const serverHead = config.API_NEWHOME_HOST + '/www/';
const patchPostMessageJsCode = `(${String(function () {
    const originalPostMessage = window.postMessage;
    const patchedPostMessage = function (message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer);
    };
    patchedPostMessage.toString = function () {
        return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')
    };
    window.postMessage = patchedPostMessage;
})})();`;
export default class MyKJT extends React.Component<INavigation, IState> {
    private web?: any;  // 售后维修界面
    constructor(props) {
        super(props);
        const { params } = this.props.navigation.state;
        console.log('zhaoxincheng>>KjtToken>', params);
        this.state = {
            loadUrl: '',
            KjtToken: params.KjtToken,
            loadType: 0,
        };
    }
    public componentDidMount() {
        const { params } = this.props.navigation.state;
        if (params.frontPage !== 'manageMoney') {
            // 前一个界面不是manageMoney,就把前一个界面frontPage更新一下
            dvaStore.dispatch(createAction('investmentInfo/updateFrontPage')({ frontPage: params.frontPage }));
        }
        // 检测登录
        this.checkLogin();
    }

    public componentWillUnmount() {
        // 点击了返回,当前界面pop出栈,刷新前一个界面
        const { callBack } = this.props.navigation.state.params;
        if (callBack) {
            // 刷新我的界面
            callBack();
        }
    }

    public checkLogin = async () => {
            console.log('zhaoxincheng>>KjtToken>', this.state.KjtToken);
            if (IS_NOTNIL(this.state.KjtToken)) {
                // 已登录
                this.goToKJTTwo(this.state.KjtToken);
            } else {
                // 未登录,去快捷通界面
                this.goToKJT();
            }
    }

    // 已登录
    public goToKJTTwo = (token) => {
        // 登录过,有token
        const kjtUrlTwo = url.OFFICIAL_KQT_URL + '/' + encodeURIComponent(token) + `?partner_id=${config.KJT_PARTNERID}`;
        console.log('zhaoxincheng>>kjtUrlTwo>', kjtUrlTwo);
        this.setState({
            loadUrl: kjtUrlTwo,
        });
    }
    // 未登录
    public goToKJT = () => { // 未登录，请求快捷通页面授权登录
         // 未登录过,跳转到快捷通授权登录界面
         const backUrl = serverHead + 'index.html#/' + dvaStore.getState().investmentInfo.frontPage;
         const callBackUrl = url.OFFICIAL_HRY_URL + 'hryLoading.html' + '?page=' + backUrl;
         const encodeUrl = escape(callBackUrl);
         const kjtUrl = url.OFFICIAL_KQT_URL_LOGIN + '?page=authorizeMain&partner_id=' + config.KJT_PARTNERID + '&return_url=' + encodeUrl;
         console.log('zhaoxincheng>>>>授权登录url', kjtUrl);
         this.setState({
             loadUrl: kjtUrl,
         });
    }
    // 获取快捷通登录token
    public getToken = async (value, event) => { // 获取快捷通登录token
        try {
            const params = {
                authCode: value,
            };
            const response = await postForm(Config.GET_KJT_TOKEN, params);
            console.log('zhaoxincheng>>getToken>', response);
            console.log('zhaoxincheng>>event>', event);
            if (response.success && IS_NOTNIL(response.data)) {
                // 获取token成功
                this.goToKJTTwo(response.data.token);
            } else {
                // 登录失败,去快捷通登录界面
                this.web.goBack();
            }
        } catch (error) {
            Log(error);
        }
    }
    // 拦截url改变时
    public urlChangeListener = (event) => {
            console.log('zhaoxincheng>>>*****urlChangeListener:*', event.url);
            // goToKJT 拦截处理
            const loadUrl = unescape(event.url);
            // 如果触发了返回按钮的链接，返回，还有就是出发了金融中心的结束返回
            // 这个时候需要关闭webview并且回到首页或者其它页面
            if (event.url.indexOf(dvaStore.getState().investmentInfo.frontPage) !== -1 && event.url.indexOf('partner_id') === -1) {
                if (event.canGoBack) {
                    this.props.navigation.goBack();
                }
            }
            if (event.url.indexOf('auth_code') !== -1) {
                const authCodeIndex = event.url.indexOf('auth_code');
                const authCode = event.url.substr(authCodeIndex + 10, 32);
                if (this.state.loadType === 0) {
                    console.log('zhaoxincheng>>>******', event.url);
                    this.setState({
                        loadType: 1,
                    }, () => {
                        this.getToken(authCode, event);
                    });

                }
            }
    }
    public renderLoading = () => {
        return (<View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 17, marginTop: 150 }}>正在进入快捷通模块，请稍等......</Text>
        </View>);
    }
    public render() {
        return (<View style={[{ flex: 1}, iPhoneXPaddingTopStyle]}>
            <WebView
                ref={(webView) => this.web = webView}
                style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}
                source={{uri: this.state.loadUrl}}
                onMessage={(e) => {
                    // console.log('zhaoxincheng>>>>:postMessage', e);
                    this.onMyMessage(e);
                }}
                javaScriptEnabled={true}// 指定WebView中是否启用JavaScript
                injectedJavaScript={patchPostMessageJsCode}
                startInLoadingState={true} // 强制WebView在第一次加载时先显示loading视图
                renderLoading={() => this.renderLoading()}
                onNavigationStateChange={(e) => this.urlChangeListener(e)}
            />
        </View>);
    }

    // 接收来自H5的消息
    private onMyMessage = (e) => {
        // token失效：TokenLose  返回顶级页面：GoBackRNPage
        // 接受RN发送过来的数据
        let params = e.nativeEvent.data;
        params = JSON.parse(params);
        if (params.type === 'TokenLose') {
            // token失效了
            // 未登录,去快捷通界面
            this.goToKJT();
        } else if (params.type === 'GoBackRNPage') {
            // 关闭webView
            this.props.navigation.goBack();
        }
        console.log('zhaoxincheng>>>>:收到H5参数 json后：', params);
    }
}
