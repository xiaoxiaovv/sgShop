import * as React from 'react';
import { View, WebView, Text, Platform } from 'react-native';
import { getAppJSON, postAppJSON, postAppForm, postForm } from '../../netWork';
import Config from 'react-native-config';
import { INavigation } from '../../interface';
import { createAction, iPhoneXPaddingTopStyle } from '../../utils/index';

interface IState {
    loadType: number;
    loadUrl: string;
}
const serverHead = Config.API_URL + 'www/';
const partnerId = 200000030019; // 快捷通商户ID准生产
export default class MyInvestment extends React.Component<INavigation, IState> {
    constructor(props) {
        super(props);
        this.state = {
            loadType: 0,
            loadUrl: '',
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
    public checkLogin = async () => {
        try {
            const response = await getAppJSON(Config.CHECK_KJT_LOGIN);
            if (response.data.isLogin) {
                // 已登录,去海融易界面
                this.goToHRY(response.data.token);
            } else {
                // 未登录,去快捷通界面
                this.goToKJT();
            }
        } catch (error) {
            Log(error);
        }
    }
    // 打开海融易界面
    public goToHRY(token) {// 打开海融易页面
        const hryUrl = Config.OFFICIAL_HRY_URL + 'hryLoading.html?appToken=' + token + '&returnUrl=' + serverHead + 'index.html#/' + dvaStore.getState().investmentInfo.frontPage;
        this.setState({
            loadType: 0,
            loadUrl: hryUrl,
        });
    }
    // 打开快捷通界面
    public goToKJT = () => { // 未登录，请求快捷通页面授权登录
        const backUrl = serverHead + 'index.html#/' + dvaStore.getState().investmentInfo.frontPage;
        const callBackUrl = Config.OFFICIAL_HRY_URL + 'hryLoading.html' + '?page=' + backUrl;
        const encodeUrl = escape(callBackUrl);
        const kjtUrl = Config.OFFICIAL_KQT_URL + '?page=authorizeMain&partner_id=' + partnerId + '&return_url=' + encodeUrl;
        this.setState({
            loadType: 1,
            loadUrl: kjtUrl,
        });
    }
    // 获取快捷通登录token
    public getToken = async (value) => { // 获取快捷通登录token
        try {
            const params = {
                authCode: value,
            };
            const response = await postForm(Config.GET_KJT_TOKEN, params);
            this.goToHRY(response.data.token);
        } catch (error) {
            Log(error);
        }
    }
    // url改变时
    public urlChangeListener = (event) => {
        if (this.state.loadType === 0) {
            // goToHRY 拦截处理
            const { params } = this.props.navigation.state;
            if (event.url.indexOf(dvaStore.getState().investmentInfo.frontPage) !== -1 && event.url.indexOf('appToken') === -1 && event.url.indexOf('financialMoney') === -1) {
                if (event.canGoBack) {
                    this.props.navigation.goBack(); return;
                }
            }
            if (event.url.indexOf('manageMoney') !== -1) {
                this.props.navigation.navigate('ManageMoney');
            }
        } else {
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
                this.getToken(authCode);
            }
        }
    }
    public renderLoading = () => {
        return (<View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 17, marginTop: 150 }}>正在进入投资模块，请稍等......</Text>
        </View>);
    }
    public render() {
        return (<View style={[{ flex: 1}, iPhoneXPaddingTopStyle]}>
            <WebView source={{ uri: this.state.loadUrl }}
                startInLoadingState={true}
                renderLoading={() => this.renderLoading()}
                onNavigationStateChange={(e) => this.urlChangeListener(e)} />
        </View>);
    }
}
