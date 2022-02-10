import * as React from 'react';
import {View, Dimensions, WebView, DeviceEventEmitter} from 'react-native';
import {Toast} from 'antd-mobile';
import Config from 'react-native-config';
import {goGoodsDetail} from '../../../utils/tools';


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

export default class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showWebView: true,
            //url: "http://m.ehaier.com/www/#/imageAndWord/19087",
        };
    }

    private webview;

    render() {
        console.log(this.props.uri);
        if (this.state.showWebView) {
            return (<WebView
                style={{flex: 1, marginTop: -44}}
                ref={w => {
                    this.webview = w;
                }}
                source={{uri: this.props.uri}}
                // onLoadStart={() => Toast.loading('')}
                onMessage={(e) => {
                    const msg = e.nativeEvent.data;
                    const arr = msg.split('|');
                    goGoodsDetail(arr[0], arr[1]);
                }}
                onNavigationStateChange={(params) => {
                    const url = params.url;
                    // 如果是顺逛内部网页 进行逻辑处理
                    if (url.startsWith(Config.API_URL) || url.includes('ehaier.com')) {
                        // 如果是要跳转到详情页面
                        if (url.includes('productDetail')) {
                            const arr = url.split('/');
                            this.setState({showWebView: false});
                            this.props.navigation.navigate('GoodsDetail', {
                                productId: arr[arr.length - 5], storeId: arr[arr.length - 2], callBack: () => {
                                    this.setState({showWebView: true});
                                }
                            });
                        }
                    }
                }}
                injectedJavaScript={patchPostMessageJsCode}
            />)
        } else {
            return <View style={{flex: 1, marginTop: -44}}/>;
        }
    }
}
