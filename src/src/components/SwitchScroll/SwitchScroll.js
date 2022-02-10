/*
 * @Author: Aevit
 * @Desc:
 * @Date: 2017-09-19 10:41:24
 * @Last Modified by: Aevit
 * @Last Modified time: 2017-09-21 16:15:36
 */
'use strict'
/**
 * switchScroll.js
 *
 * @des scrollview 及 webview 上下切换
 * @author Aevit
 * Created at 2017/09/19
 * Copyright 2011-2017 touna.cn, Inc.
 */
'use strict'
import {
    Text,
    View,
    Animated,
    ScrollView,
    Platform,
    StatusBar,
    DeviceEventEmitter,
    WebView
} from 'react-native'
import React from 'react'
import SCWebView from './SCWebView'
import StyleSheet from 'react-native-extended-stylesheet';
import {Tabs,Toast} from 'antd-mobile';

import Config from 'react-native-config';
import {
    goGoodsDetail
} from '../../utils/tools';

import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
const ONEPARTHT = height - (Platform.OS === 'android' ? 56 + StatusBar.currentHeight : 64);

class switchScroll extends React.Component {
    static propTypes = {}

    static defaultProps = {}

    constructor(props) {
        super(props)
        this.state = {
            moveValue: new Animated.Value(0)
        }
    }

    // ----- life cycle
    componentWillMount() {
    }

    componentDidMount() {
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true
    }

    componentWillReceiveProps(nextProps) {
    }

    componentWillUpdate() {
    }

    componentDidUpdate() {
    }

    componentWillUnmount() {
    }

    // ----- public methods

    // ----- private methods
    _renderWebView(passScrollTopToWebView) {
        const tabsCanshu = [
            {title: '商品介绍', sub: '1'},
            {title: '产品参数', sub: '2'},
        ];
        return (
            <Tabs
                swipeable={false}
                tabs={tabsCanshu}
                initialPage={0}
                renderTab={tab => <Text>{tab.title}</Text>}
                onChange={(tab, index) => {
                }}
            >
                {/*<SCWebView
          boxStyle = {
            {
              marginTop: -44
            }
          }
          url={this.props.url}
          autoHeight={!passScrollTopToWebView}
          scrollToTop={
            passScrollTopToWebView ?
            () => {
              // this.scrollViewToTop(true);
            }
            : null
          }
          onNavigationStateChange = {
            (params) => {
              const url = params.url;
              // 如果是顺逛内部网页 进行逻辑处理
              if (url.startsWith(Config.API_URL) || url.includes('ehaier.com')) {
                // 如果是要跳转到详情页面
                if (url.includes('productDetail')) {
                  const arr = url.split('/');
                  goGoodsDetail(arr[arr.length - 5], arr[arr.length - 2]);
                  DeviceEventEmitter.emit('updateProduct', params.url);
                  // if (params.canGoBack) {//表示webview第一加载页面
                  //   this.webview.goBack();
                  // }
                }
              }
            }
          }
        />*/}

                <Detail {...this.props} uri={this.props.url}/>

                <SCWebView
                    boxStyle={
                        {
                            marginTop: -44
                        }
                    }
                    url={this.props.urlCanshu}
                    autoHeight={!passScrollTopToWebView}
                    scrollToTop={
                        passScrollTopToWebView ?
                            () => {
                                // this.scrollViewToTop(true);
                            }
                            : null
                    }
                    onNavigationStateChange={
                        (params) => {
                            const url = params.url;
                            // 如果是顺逛内部网页 进行逻辑处理
                            if (url.startsWith(Config.API_URL) || url.includes('ehaier.com')) {
                                // 如果是要跳转到详情页面
                                if (url.includes('productDetail')) {
                                    const arr = url.split('/');
                                    goGoodsDetail(arr[arr.length - 5], arr[arr.length - 2]);
                                    // if (params.canGoBack) {//表示webview第一加载页面
                                    //   this.webview.goBack();
                                    // }
                                }
                            }
                        }
                    }
                />
            </Tabs>
        )
    }

    scrollViewToTop = (toTop) => {
        const onePartHeight = this.props.height || ONEPARTHT;
        Animated.timing(this.state.moveValue, {
            toValue: toTop ? 0 : -onePartHeight
        }).start();
        this.props.contentToTop(toTop);
    }

    // ----- components
    render() {
        const onePartHeight = this.props.height || ONEPARTHT;
        return (
            <Animated.View style={{height: onePartHeight * 2, transform: [{translateY: this.state.moveValue}]}}>
                <ScrollView
                    keyboardShouldPersistTaps="always"
                    keyboardDismissMode="on-drag"
                    style={[styles.scrol, {maxHeight: onePartHeight}]}
                    onScrollEndDrag={(e) => {
                        const contentSizeH = e.nativeEvent.contentSize.height
                        const offsetY = e.nativeEvent.contentOffset.y
                        if (offsetY - (contentSizeH - onePartHeight) >= (Platform.OS === 'ios' ? 60 : -1)) {
                            this.scrollViewToTop(false);
                        }
                    }}
                >
                    <View style={[styles.scrollContentBox, {minHeight: onePartHeight}]}>
                        {this.props.renderContain()}
                    </View>
                    <View style={styles.loadMore}>
                        <Text style={styles.loadMoreText}>继续拖动查看图文详情</Text>
                    </View>
                </ScrollView>
                {
                    Platform.OS === 'android' && Platform.Version < 21 // 21 为 5.0 系统
                        ? <ScrollView style={{maxHeight: onePartHeight}}
                                      onScrollEndDrag={(e) => {
                                          const offsetY = e.nativeEvent.contentOffset.y
                                          if (offsetY <= 0) {
                                              this.scrollViewToTop(true);
                                          }
                                      }}>
                            {this._renderWebView(false)}
                        </ScrollView>
                        : this._renderWebView(true)
                }
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    scrollContentBox: {
        width: width,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    scrol: {
        backgroundColor: '$lightgray',
    },
    loadMore: {
        width,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadMoreText: {
        color: '$black',
        fontSize: '$fontSize3',
    }
})

export default switchScroll

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

class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showWebView: true,
            //url: props.uri,
            //url: "http://m.ehaier.com/www/#/imageAndWord/19087",
        };
    }

    render() {
        if (this.state.showWebView) {
            return (<WebView
                style={{flex: 1, marginTop: -44}}
                ref={w => {
                    this.webview = w;
                }}
                source={{uri: this.props.uri}}
                onLoadStart={() => Toast.loading('')}

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
