import * as React from 'react';
import { View, Text, WebView, Platform } from 'react-native';
import { INavigation } from '../../interface/index';
import Header from '../../components/Header';
import {isiPhoneX} from '../../utils';

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
    console.log('userMsg', userMsg);
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
class CommonWebview extends React.Component {
    // public static navigationOptions = ({ navigation }) => {
    //     const { params } = navigation.state;
    //     return {
    //         header: null,
    //     };
    // }
    // public webview: WebView;

    constructor(props) {
        super(props);

        const { navigation: { state: { params } } } = this.props;
        // jscode 去掉顺逛帮助类型页面的navbar,并上移页面，！！仅适用于顺逛帮助页面！！
        // const jsCode = `document.getElementsByClassName('help')[0].style.marginTop = 0;
        // document.getElementsByClassName('nav')[0].style.display = 'none';`;
        const jsCode = '';
        // let url = 'http://m.ehaier.com/v3/mstore/sg/helpDetail.html?id=' + params.helpId + '&sg_rn_app' + messageData();
        let url = params.url;

        console.log('AgreementWebview', url);
        console.log(params)
        this.state = {
            loading: true,
            url: url,
            jsCode: jsCode,
            urlArr: [],
            isSendMsg: false, //yl
        };
    }

    render() {
        const { navigation: { state: { params } } } = this.props;
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

            // let url = params.url;
            // // console.log(url)
            // if (!this.state.isSendMsg && url && url.indexOf('http://m.ehaier.com/www/index.html#/') > -1) {
            //     url = url + (url.indexOf('?') > -1 ? '&' : '?') + 'sg_rn_app' + messageData();
            //     this.setState({
            //         isSendMsg: true,
            //         url: url
            //     })
            // }
            // if (url && url.indexOf('http://m.ehaier.com/www/index.html#/circlePage') > -1) {
            //     this.setState({
            //         url: url,
            //     })
            // }
            // console.log('push后', url);
            // if (this.state.urlArr.findIndex(item => decodeURIComponent(item).includes(decodeURIComponent(url))) < 0) {
            //     this.state.urlArr.push(url);
            //     console.log('push后', this.state.urlArr);
            // } 
            // setTimeout(() => {
            //     //console.log("开始注入js");
            //     let js = '$(\'[ng-click="goBack()"][hasClick!=1],#backhome[hasClick!=1],[ng-click="$ionicGoBack()"][hasClick!=1]\').on(\'click\', function () {window.postMessage(\'goback\')}).attr(\'hasClick\', 1);';

            //     if (url.indexOf('mstore/sg/helpDetail.html') > -1) { // 新手必读页 后端反的页面
            //         js += '$(\'.nav__back\').on(\'click\', function () {window.postMessage(\'goback\')}).attr(\'hasClick\', 1);';
            //     }
            //     if (url.indexOf('http://learn.ihaier.me/') > -1) { // 学习中心
            //         js += '$(\'#return\').on(\'click\', function () {window.postMessage(\'goback\')}).attr(\'hasClick\', 1);';
            //     }

            //     if (this.webview) {
            //         this.webview.injectJavaScript(js);
            //     }
            //     setTimeout(() => {
            //         if(this.webview) {
            //             this.webview.injectJavaScript(js);
            //         }
            //     }, 2000)
            //     //console.log("注入了",js);
            // }, 1000);
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

                <View style={{ height: 0, width: '100%' ,backgroundColor: '#fff'}}></View>
                { params.isShowTitle &&
                    <Header {...this.props}
                        goBack={() => {
                            goBack()
                        }}
                        title={this.props.navigation.state.params.title ? this.props.navigation.state.params.title : ''} />
                }


                <WebView
                    ref={(ref) => this.webview = ref}
                    source={{ uri: this.state.url }}
                    onLoadEnd={() => {
                        this.setState({ loading: false });
           
                    }}
                    onLoadStart={() => {
                        this.setState({ loading: false });
                    }}
                    onError={(e)=>{
                     
                    }}
                    onMessage={(event) => {
                        console.log('onMessage->event.nativeEvent.data:');
                        console.log(event.nativeEvent);
                        if (event.nativeEvent.data == 'goback') {
                            goBack(event.nativeEvent.canGoBack)
                        }
                    }}
                    domStorageEnabled={true}
                    javaScriptEnabled={true}
                    onNavigationStateChange={shouldStartLoadWithRequest}
                    injectedJavaScript={patchPostMessageJsCode} />

            </View>);
    }
}

export default CommonWebview;
