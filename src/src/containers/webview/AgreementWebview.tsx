import * as React from 'react';
import { View, Text, WebView, Platform } from 'react-native';
import { INavigation } from '../../interface/index';
import Header from '../../components/Header';
import {isiPhoneX} from '../../utils';
import URL from '../../config/url';


var patchPostMessageJsCode = `(${String(function () {
    var originalPostMessage = window.postMessage;
    var patchedPostMessage = function (message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer);
    };
    patchedPostMessage.toString = function () {
        return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')
    };
    window.postMessage = patchedPostMessage;
})})();`;

// h5页面所需的登录信息 yl
const messageData = () => {
    const userMsg = dvaStore.getState().users;
    const addressMsg = dvaStore.getState().address;
    const messageObj = {
        'home': 'shunguang-RN',
        'userMsg': userMsg,
        'addressInfo': { // 地址信息必须放在messageObj对象的最后一项，如果不是最后一项，对应的H5端获取RN传递过去的地址代码（在AppRun.js）也需要改动
            provinceId: addressMsg.provinceId,
            cityId: addressMsg.cityId,
            areaId: addressMsg.areaId,
            streetId: addressMsg.streetId,
            regionName: addressMsg.regionName,
        },
    };
    const messageUrl = encodeURIComponent(JSON.stringify(messageObj));
    return messageUrl;
}
class AgreementWebview extends React.Component<INavigation & { customurl: string }> {
    public static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            header: null,
        };
    }
    public webview: WebView;

    constructor(props) {
        super(props);


        const { navigation: { state: { params } } } = this.props;
        // jscode 去掉顺逛帮助类型页面的navbar,并上移页面，！！仅适用于顺逛帮助页面！！
        // const jsCode = `document.getElementsByClassName('help')[0].style.marginTop = 0;
        // document.getElementsByClassName('nav')[0].style.display = 'none';`;
        const jsCode = '';
        let url = `${URL.API_NEWHOME_HOST}/v3/mstore/sg/helpDetail.html?id=` + params.helpId + '&sg_rn_app' + messageData();
        console.log('AgreementWebview', url);
        this.state = {
            loading: true,
            url: url,
            jsCode: jsCode,
            urlArr: [],
            isSendMsg: false, //yl
            direction: 'none',
        };
    }

    public render(): JSX.Element {

        let goBack = (flag) => {
            console.log(this.state.urlArr)

            if (flag) {
                this.webview.goBack();
            } else {
                this.props.navigation.goBack();
            }
            return true;
        }
        let shouldStartLoadWithRequest = (params) => {

            let url = params.url;
            // console.log(url)
            if (!this.state.isSendMsg && url && url.indexOf('http://m.ehaier.com/www/index.html#/') > -1) {
                url = url + (url.indexOf('?') > -1 ? '&' : '?') + 'sg_rn_app' + messageData();
                this.setState({
                    isSendMsg: true,
                    url: url
                })
            }
            if (url && url.indexOf('http://m.ehaier.com/www/index.html#/circlePage') > -1) {
                this.setState({
                    url: url,
                })
            }
            setTimeout(() => {
                //console.log("开始注入js");
                let js = '$(\'[ng-click="goBack()"][hasClick!=1],#backhome[hasClick!=1],[ng-click="$ionicGoBack()"][hasClick!=1]\').on(\'click\', function () {window.postMessage(\'goback\')}).attr(\'hasClick\', 1);';

                if (url.indexOf('mstore/sg/helpDetail.html') > -1) { // 新手必读页 后端反的页面
                    js += '$(\'.nav__back\').on(\'click\', function () {window.postMessage(\'goback\')}).attr(\'hasClick\', 1);';
                }
                if (url.indexOf('http://learn.ihaier.me/') > -1) { // 学习中心
                    js += '$(\'#return\').on(\'click\', function () {window.postMessage(\'goback\')}).attr(\'hasClick\', 1);';
                }

                if (this.webview) {
                    this.webview.injectJavaScript(js);
                }
                setTimeout(() => {
                    if(this.webview) {
                        this.webview.injectJavaScript(js);
                    }
                }, 2000)
                //console.log("注入了",js);
            }, 1000);
        }
        let top = 0;
        if (Platform.OS === 'ios') {
            top = 20;
            if (isiPhoneX) {
                top = 44;
            }
        }
        return (
            <View style={{ flex: 1 }}>

                <View style={{ height: top, width: '100%' ,backgroundColor: '#fff'}}></View>
                {false &&
                    <Header {...this.props}
                        goBack={() => {
                            goBack()
                        }}
                        title={this.props.navigation.state.params.title ? this.props.navigation.state.params.title : '说明'} />
                }


                <WebView
                    ref={(ref) => this.webview = ref}
                    source={{ uri: this.state.url }}
                    onLoadEnd={() => {
                        this.setState({ loading: false });
                        //  this.webview.injectJavaScript('$(".scroll-content").css({"z-index": 1,top: 0})');
                        //  if(this.state.url && this.state.url.indexOf('http://m.ehaier.com/www/index.html#/circlePage') > -1){
                        //     this.webview.injectJavaScript(`document.getElementsByClassName('view-container')[0].style.top = '-44px';`);
                        // }else{

                        // }

                    }}
                    onLoadStart={() => {
                        this.setState({ loading: false });
                    }}
                    onMessage={(event) => {
                        console.log('onMessage->event.nativeEvent.data:');
                        console.log(event.nativeEvent);
                        if (event.nativeEvent.data == 'goback') {
                            goBack(event.nativeEvent.canGoBack)
                        }
                    }}
                    onNavigationStateChange={shouldStartLoadWithRequest}
                    injectedJavaScript={patchPostMessageJsCode} />
                {this.state.loading ?
                    <View style={{
                        position: 'absolute',
                        width: "100%",
                        height: "100%",
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: "#fff",
                        opacity: 1
                    }}>
                        <Text>加载中...</Text>
                    </View> : null}

            </View>);
    }
}

export default AgreementWebview;
