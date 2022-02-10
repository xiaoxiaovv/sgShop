import * as React from 'react';
import { View, ScrollView, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Platform, WebView } from 'react-native';
import { INavigation } from '../../../interface/index';
import Config from 'react-native-config';
import { goGoodsDetail, navigationPush } from '../../../utils/tools';
import { Toast, Modal } from 'antd-mobile';
import CustomNaviBar from '../../../components/customNaviBar';
import Button from 'rn-custom-btn1';
import { NavBarConfig } from '../../RootContainers/rootNavigator';
let currentUrl = '';
// fix https://github.com/facebook/react-native/issues/10865

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

class VIPCenterWeb extends React.Component<INavigation & { customurl: string, headerTitle: string, flag: boolean }> {
    private webview: WebView;
    public static navigationOptions = ({ navigation, screenProps }) => (
        {
            header: null,
        }
    )
    public constructor(props) {
        super(props);
    }
    public state: IState = {
        visible: true,
        isMore: false,
    }
    public _onClick = () => {
        const isMore = this.state.isMore;
        console.log(this.state.isMore + '11111111111111111111111111');
        this.setState({ isMore: !isMore });
    }
    public componentDidMount() {
        this.props.navigation.setParams({ navigatePress: this._onClick });
    }

    public render(): JSX.Element {
        const { navigation: { state: { params } } } = this.props;
        console.log('---------params.customurl----------');
        console.log(params.customurl);
        return (
            <View style={{ flex: 1 }}>
                {/*<CustomNaviBar*/}
                {/*navigation = { this.props.navigation }*/}
                {/*titleView = {*/}
                {/*<Text style={{*/}
                {/*color: 'black',*/}
                {/*fontFamily: 'PingFangSC-Light',*/}
                {/*fontSize: 18}}>*/}
                {/*{params.headerTitle ? params.headerTitle : '活动页面'}*/}
                {/*</Text>}*/}
                {/*/>*/}
                {/* {
                    this.state.isMore ?
                        <View style={{ flexDirection: 'column', position: 'absolute', right: 6, top: 14, zIndex: 99999 }}>
                            <View style={styles.triangle}></View>
                            <View style={styles.rightBox}>
                                <TouchableOpacity style={styles.smBox} onPress={() => {
                                    const isMore = this.state.isMore;
                                    this.setState({ isMore: !isMore })
                                    this.props.navigation.navigate('StoreHome', { storeId: dvaStore.getState().users.mid })
                                }
                                }>
                                    <Image source={{ uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/Store2x.png' }}
                                        style={styles.pic}
                                    />
                                    <Text>小店</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.smBox} onPress={() => {
                                    const isMore = this.state.isMore;
                                    this.setState({ isMore: !isMore })
                                    this.props.navigation.navigate('MessageDetail')
                                }
                                }>
                                    <Image source={{ uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/Message2x.png' }}
                                        style={styles.pic}
                                    />
                                    <Text>消息</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        :
                        null
                } */}
                <WebView
                    style={{ flex: 1 }}
                    ref={w => {
                        this.webview = w;
                    }}
                    onLoadStart={() => {
                        Toast.loading('加载中');
                    }}
                    // onLoad = {() => this.sendMsg()}
                    // onLoadEnd = {() => this.sendMsg(params.flag)}
                    // source={{ uri: params.customurl + '?sg_rn_app' }}
                    source={{ uri: params.customurl}}
                    // 一旦加上 onMessage属性 模拟器就会报红色错误 下面的injectedJavaScript 是解决该报错的
                    onMessage={(e) => {
                        this.handleMessage(e);
                    }}
                    javaScriptEnabled
                    injectedJavaScript={patchPostMessageJsCode}
                    onShouldStartLoadWithRequest={this.shouldStartLoadWithRequest}
                >

                </WebView>
            </View>)
            ;
    }

    // 拦截url
    public shouldStartLoadWithRequest(params) {
        //{"target":1186,"canGoBack":false,"lockIdentifier":3923336679,
        // "loading":false,"title":"顺逛微店","canGoForward":false,
        // "navigationType":"other","
        // url":"https://webapi.amap.com/html/geolocate.html?key=2c32eb44ce0ecd452ce7c7b9fd020e83"}
        // const parmams
        // API_URL=http://m.ehaier.com/
        // API_DETAIL_URL=http://detail.ehaier.com/
        // SERVER_DATA=http://m.ehaier.com/v3/
        Log('====================================');
        Log(JSON.stringify(params));
        Log('====================================');
        const url = params.url;
        if (currentUrl === url) {
            return false;
        } else {
            currentUrl = url;
        }
        // 如果是顺逛内部网页 进行逻辑处理
        if (url.startsWith(Config.API_URL) || url.startsWith(Config.API_DETAIL_URL)) {
            // 如果是要跳转到详情页面
            if (url.includes('productDetail')) {
                const arr = url.split('/');
                goGoodsDetail(arr[arr.length - 5], arr[arr.length - 2]);
                return false;
            }
            if (url.includes('haiercash.com')) {
                navigationPush('CustomWebView', { customurl: url, headerTitle: '顺逛白条' });
                return false;
            }
            return true;
        }

        return true;
    }

    // 给H5发送消息
    public sendMsg = async () => {
        // 发送给H5的信息格式如下
        // home是标识 是否是在RN里打开的<H5></H5>
        // userMsg 需要传递给H5的用户信息
        // otherMsg 需要传递给H5的其他信息
        // Log('&&&&&&&&&&&&&&&&&&&&&&&&&&&发送消息给H5&&&&&&&&&&&&&&&&&&&&&&&&&&');
        // const userMsg = await global.getItem('User');
        // Log(userMsg);
        // const messageObj = {
        //     "home": flag ? "shunguang-RN" : "otherLink",
        //     "userMsg": userMsg,
        // };
        // const message = JSON.stringify(messageObj);
        // Log(messageObj);
        // this.webview.postMessage(message);
        // alert('消息发送完毕');
        // Toast.hide();
        this.webview.postMessage('onload');
    }
    // 处理从H5收到的消息
    public handleMessage = async (e) => {
        // Log('&&&&&&&&&&&&&&&&&&&&&来自html的消息如下&&&&&&&&&&&&&&&&&&&&&');
        // Log(e.nativeEvent.data);
        // if (e.nativeEvent.data === 'from-sg-h5') {
        //     const userMsg = dvaStore.getState().users;
        //     console.log(userMsg);
        //     const flag = this.props.navigation.state.params.flag;
        //     const messageObj = {
        //         "home": "shunguang-RN",
        //         "userMsg": userMsg,
        //     };
        //     const message = JSON.stringify(messageObj);
        //     console.log(message);
        //     this.webview.postMessage(message);
        //     console.log('消息发送完毕');
        //     console.log('123');
        //     Toast.hide();
        // }
        if (e.nativeEvent.data === 'goback') {
            this.props.navigation.goBack();
        }
    }
}

const styles = StyleSheet.create({
    contextStyle: {
        flex: 1,
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 12,
        borderRightWidth: 12,
        borderBottomWidth: 26,
        borderTopWidth: 12,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: 'transparent',
        borderBottomColor: '#fff',
        position: 'absolute',
        top: -24,
        right: 4,
        // borderLeftColor: '#fff',
        // borderRightColor: 'transparent',
        // borderTopColor: 'transparent',
        // borderBottomColor: 'transparent',
    },
    rightBox: {
        width: 118,
        height: 100,
        backgroundColor: '#fff',
        flexDirection: 'column',
    },
    pic: {
        width: 24,
        height: 24,
        margin: 6,
    },
    smBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
    },
    menuContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // paddingHorizontal: 5,
        // paddingVertical: 10,
    },
    triggerStyle: {
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    overlayStyle: {
        // left: 90,
        flex: 1,
        // position: 'absolute',
        // top: Header.HEIGHT / 2,
        backgroundColor: 'blue',
    },
    androidOverlayStyle: {
        borderWidth: 1,
        borderColor: '#ccc',
    },
    outerViewPadding: {
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    halfBorderRadiusView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        backgroundColor: '#1556C9',
        paddingTop: 10,
    },
    labelText: {
        color: 'white',
        paddingBottom: 10,
    },
    authorityView: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
export default VIPCenterWeb;
