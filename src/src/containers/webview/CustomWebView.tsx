import * as React from 'react';
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
    ActivityIndicator
} from 'react-native';
import {INavigation} from '../../interface/index';
import Config from 'react-native-config';
import {NavigationActions} from 'react-navigation';
import {goGoodsDetail, navigationPush} from '../../utils/tools';
import {Modal} from 'antd-mobile';
import CustomNaviBar from '../../components/customNaviBar';
import Button from 'rn-custom-btn1';
import {NavBarConfig} from '../RootContainers/rootNavigator';
import {MessageWithBadge} from '../../components/MessageWithBadge';
import {connect} from 'react-redux';
import {NavigationActions} from 'react-navigation';
import {createAction, isiPhoneX} from '../../utils';
import EStyleSheet from 'react-native-extended-stylesheet';
import ShareModle from '../../components/ShareModle';
import Header from '../../components/Header';
import {Toast} from 'antd-mobile/lib/index';
import HeaderTitle from 'react-navigation/src/views/Header/HeaderTitle';
import Loading from '../../components/Loading';
import noservice from './../../images/noservice.png';
import {Toast} from 'antd-mobile'
import URL from '../../config/url';
import L from 'lodash';

let webUrl = '';
let showBackBtn = false;
let rightTitle;
let rightView;
let rightAction;
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
const ElectricRightIcon = (props) => {
    return (
        <View style={{width: 60, height: 44, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => props.toSearch()}>
                <Image source={require('./../../images/searchicon.png')} style={{width: 22, height: 22}}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => props.toMessage()}>
                <Image source={require('./../../images/messagelogogray.png')} style={{width: 22, height: 22}}/>
            </TouchableOpacity>
        </View>
    );
};
const mapStateToProps = (state) => {
    const {
        users: {unread}, home: {defaultSearchHotWord}, router
    } = state;
    return {
        defaultSearchHotWord,
        unread,
        router
    };
};

@connect(mapStateToProps)

class CustomWebView extends React.Component<INavigation & { customurl: string, headerTitle: string, flag: boolean, defaultSearchHotWord: string, unread: number, refreshCallBack: any }> {
    private static navigationOptions = ({navigation}) => {
        // const { params = {} } = navigation.state;
        return {
            header: null,
        };
    };
    private webview: WebView;

    public constructor(props) {
        super(props);
        const propsParams = this.props.customurl ? this.props : this.props.navigation.state.params;
        this.state = {
            urlArr: [],
            headerTitle: propsParams.headerTitle,
            showShareModal: false,
            shareContent: '',
            showBackBtn: false,
            urlErr: false,
            //forbidBack: true,//弹出层挡住返回按钮(快捷通倒计时页面使用)

        }
    }

    componentDidMount() {
        // alert(JSON.stringify(this.props.navigation));
        console.log('');
        console.log(JSON.stringify(this.props.navigation));
    }

    componentWillMount() {
        if (Platform.OS !== 'ios') {
            this.BackHandler = BackHandler.addEventListener('hardwareBackPress', this.goBack);
        }
    }

    componentWillUnmount() {
        if (Platform.OS !== 'ios') {
            BackHandler.removeEventListener('hardwareBackPress', this.goBack);
        }
    }

    // 拦截url
    private shouldStartLoadWithRequest = (params) => {
        //注意:params.loading 可能不会返回false
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
        console.log('页面跳转:', url);

        if (url.indexOf('/ClassifyMessageCenter') > 0) {
            dvaStore.dispatch(createAction('router/apply')({
                type: 'Navigation/NAVIGATE',
                routeName: 'MessageDetail',
            }));
            setTimeout(() => {
                this.webview.goBack();
            }, 100);

            return false;
        } // 跳转消息中心
        if (url.indexOf('/myStore') > 0) {
            let obj = url.substr(url.indexOf('#') + 1, url.length).split('/');
            dvaStore.dispatch(createAction('router/apply')({
                type: 'Navigation/NAVIGATE',
                routeName: 'StoreHome',
                params: {storeId: obj[2]},
            }));
            setTimeout(() => {
                this.webview.goBack();
            }, 100);

            return false;
        }//跳转小店

        setTimeout(() => {
            //console.log("开始注入js");
            let js = '$(\'[ng-click="goBack()"][hasClick!=1],#backhome[hasClick!=1],[ng-click="$ionicGoBack()"][hasClick!=1]\').on(\'click\', function () {window.postMessage(\'goback\')}).attr(\'hasClick\', 1);';

            if (Platform.OS === 'ios') {
                //只有ios有这个问题
                if (url.indexOf('helpDetail') !== -1) {
                    //我的页面，点击会员中心，进入会员中心页面，点击页面右上角的？功能，进入“金币（积分）说明”页面，该页面点击返回键,返回不了
                    js += '$(\'.nav__back[hasGoHistory!=1]\').unbind(\'click\').on(\'click\', function () {window.postMessage(\'gobackHistory\');}).attr(\'hasGoHistory\', 1);';
                }
            }
            if (url.indexOf('competition') !== -1) {
                //我的-今日任务-任务分享-晒战绩分享按钮后进入会员竞争力页面-分享
                js += '$(\'.nav-share[hasClick!=1]\').unbind(\'click\').on(\'click\', function () {window.postMessage(\'share|\'+$(\'.com-num\').html()+\'|\'+$(\'.store-name\').html()+\'|\'+$(\'.avat-img>img\').attr(\'src\'))}).attr(\'hasClick\', 1);';
            }
            if (url.indexOf('paymentxyz') !== -1) {
                //订单支付右上角"订单中心"    h5的方法名称是错误的"goCart"， 所以这里的代码没有问题，不要怀疑！！！！！
                js += '$(\'i[ng-click="goCart()"][hasClick!=1]\').unbind(\'click\').on(\'click\', function () {window.postMessage(\'orderList\')}).attr(\'hasClick\', 1);';
            }

            if (url.indexOf('crowdFunding') !== -1) {
                //智家-顺逛众筹，"去首页逛逛吧"按钮
                js += '$(\'.crowd_funding_index_btn[hasClick!=1]\').unbind(\'click\').on(\'click\', function () {window.postMessage(\'goguangguang\')}).attr(\'hasClick\', 1).attr("href","return false;");';
            }
            if (url.indexOf('/secondLevelStore/') !== -1 || url.indexOf('/SpecialtyVenueHome/') !== -1 || url.indexOf('/localSpecialtyHomePage/') !== -1) {
                //console.log('顺逛众筹，"去首页逛逛吧"按钮');
                //顺逛众筹，"去首页逛逛吧"按钮
                js += '$(\'.CommonShoppingCar[hasClick!=1]\').unbind(\'click\').on(\'click\', function () {window.postMessage(\'cart\')}).attr(\'hasClick\', 1);';
            }
            if (url.indexOf('/withdrawSuccess/') !== -1) {
                //提现成功后点击完成按钮，关闭webview
                js += '$(\'[ng-click="goBack()"][hasClick1!=1]\').unbind(\'click\').on(\'click\', function () {window.postMessage(\'closeWebView\')}).attr(\'hasClick1\', 1);';
            }
            //快捷通页面右上角"首页"
            if (url.indexOf('/bankCardDetail/') !== -1) {
                //点击"首页"
                js += '$(\'[ui-sref="homePage"][hasClick1!=1]\').unbind(\'click\').on(\'click\', function () {window.postMessage(\'gohome\')}).attr(\'hasClick1\', 1);';
            }

            // 特产汇去掉标题右边按钮
            if (params.url.indexOf('localSpecialtyHomePage') > 0 || params.url.indexOf('SpecialtyVenueHome') > 0 || params.url.indexOf('secondLevelStore') > 0) {
                js += '$(\'[ng-click="showMenu()"],[ng-click="showMoreInfo()"]\').unbind("click").html("");';
            }

            if (this.webview) {
                this.webview.injectJavaScript(js);
            }
            // 晒战绩分享页面加载比较慢,前面注入不了,这里再注入一次
            setTimeout(() => {
                if (this.webview) {
                    this.webview.injectJavaScript(js);
                }
                setTimeout(() => {
                    if (this.webview) {
                        this.webview.injectJavaScript(js);
                    }
                }, 4000);
            }, 2000);
            //console.log("注入了",js);
        }, 1000);


        //建行  从定向比较多
        if (this.state.headerTitle === '银行卡支付' && (url.includes('CCBIS/ccbMain?') || url.includes('B2CMainPlat_03_EPAY?CLIENTIP'))) {

        } else {
            if (!url.includes('productDetail') && !url.includes('react-js-navigation')) {
                if (this.state.urlArr.length > 0) {
                    if (this.state.urlArr.findIndex(item => decodeURIComponent(item).includes(decodeURIComponent(url).replace('&channelNo=46', ''))) < 0) {
                        this.state.urlArr.push(url);
                        console.log('push后', this.state.urlArr);
                    }
                } else {
                    this.state.urlArr.push(url);
                    console.log('push后', this.state.urlArr);
                }
            }
        }

        //h5跳转到首页的时候关闭webview页面
        if (url.includes('homePage') && this.props.router.routes[this.props.router.index].routeName !== 'RootTabs') {
            this.props.navigation.goBack();
        }

        // 快捷通解绑成功不能跳转
        if (params.url.indexOf('https://zm.kjtpay.com/bindmember/success') > 0 && params.url.indexOf('address=') > 0) {
            let url = unescape(url.substr(url.indexOf('address=') + 8));
            this.webview.injectJavaScript(`window.location.href="${url}"`);

            return true;
        } // 建行支付成功跳转
        if (params.url.indexOf('pay/callback.html?result=true&payment=ccbfenqimobile') > 0) {
            this.navigateToSuccessPage();
            return true;
        }

        // 快捷通支付成功
        if (params.url.indexOf('m.ehaier.com/www/index.html#/orderManage') > 0 && params.title === '支付结果') {
            this.navigateToSuccessPage();
            return true;
        }

        // 快捷通返回
        if (params.url.indexOf('/www/index.html#/orderManage/') > 0) {
            if (this.props.navigation.state.params && this.props.navigation.state.params.callBack) {
                this.props.navigation.state.params.callBack();
            }
            this.props.navigation.goBack();
            return true;
        }

        // 快捷通解绑成功,自动跳转后的页面(有时候会出现不会自动跳转,所以写下面的if)
        /*if (params.url.indexOf('kjtUnbindCallback') > 0) {
            if (this.props.navigation.state.params && this.props.navigation.state.params.callBack) {
                this.props.navigation.state.params.callBack();
            }
            this.props.navigation.goBack();
            return true;
        }*/

        //快捷通解倒计时的页面,============  解决方案:倒计时不跳转的问题由快捷通来处理,
        /*if (params.url.indexOf('kjtAccountBindResult.html') > 0) {
            setTimeout(() => {
                if (this.props.navigation.state.params && this.props.navigation.state.params.callBack) {
                    this.props.navigation.state.params.callBack();
                }
                this.props.navigation.goBack();
            }, 5000);
            return true;
        }*/

        /* if (params.url.indexOf('bankCardDetail') !== -1) {
             //快捷通倒计时页面,点击返回应该等页面跳转后才返回,用弹出层挡住返回按钮
             this.setState({forbidBack: true});
         } else {
             this.setState({forbidBack: false});
         }*/
        // 跳转到我的
        if (params.url.indexOf('personnalCenter') > 0) {
            this.props.navigation.goBack();
            return true;
        }

        // 白条失败
        if (params.url.indexOf('payByBt/payFail.html') > 0) {
            this.navigateToFailPage();
            return false;
        }

        // if (currentUrl === url) {
        //     return false;
        // } else {
        //     currentUrl = url;
        // }
        // 如果是顺逛内部网页 进行逻辑处理
        if (url.startsWith(Config.API_URL) || url.includes('ehaier.com')) {
            // 如果是要跳转到详情页面
            if (url.includes('productDetail')) {
                const arr = url.split('/');
                goGoodsDetail(arr[arr.length - 5], arr[arr.length - 2]);
                this.webview.goBack(); // ios端突然 拦截不了 web端H5的跳转了 所以加一个 goBack
                return false;
            }
            if (url.includes('haiercash.com')) {
                //navigationPush('CustomWebView', {customurl: url, headerTitle: '顺逛白条'});
                //this.webview.goBack();
                //return false;
            }
            if (url.includes('guidePage')) {
                if (this.state.urlArr.length <= 1) {
                    this.props.navigation.goBack();
                }
                this.webview.goBack();
                return false;
            }
            if (!params.canGoBack) {//表示webview第一加载页面
                return true;
            }

            return true;
        }
        return true;
    };

    private goBack = (webViewMsg) => {
        console.log('----goBack----');
        console.log(this.state.canGoBack);
        // if (this.props.router.routes[this.props.router.index].routeName !== 'CustomWebView') {
        //     console.log(this.props.router.routes[this.props.router.index].routeName);
        //     return false;
        // }

        if (this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.customurl && this.props.navigation.state.params.customurl.indexOf('m.kjtpay.com') !== -1) {
            this.showAlert();
        } else if (!showBackBtn) { // 如果是社群页面 返回按钮不做任何跳转处理
        } else {
            console.log('---else--goBack--');
            // if(this.state.canGoBack){
            //     console.log('---canGoBack----');
            //     this.webview.goBack();
            // }else{
            //     console.log('---goBack--callBack--');
            //     if (this.props.navigation.state.params && this.props.navigation.state.params.callBack) {
            //         this.props.navigation.state.params.callBack();
            //     }
            //     this.props.navigation.goBack();
            // }

            if (this.state.urlArr.length - 1 > 0) {
                this.state.urlArr.pop();
                console.log('pop后', this.state.urlArr);
                if (!webViewMsg) {
                    //h5的返回按钮有返回的功能，所有这里加个判断
                    console.log('webview.goBack');
                    this.webview.goBack();
                }
            } else {
                if (this.props.navigation.state.params && this.props.navigation.state.params.callBack) {
                    this.props.navigation.state.params.callBack();
                }
                this.props.navigation.goBack();
            }
        }
        return true;
    };

    private shouldOverrideUrlLoading = (event) => {

        const url = event.nativeEvent.url;
        // 如果是顺逛内部网页 进行逻辑处理
        if (url.startsWith(Config.API_URL) || url.includes('ehaier.com')) {
            // 如果是要跳转到详情页面
            if (url.includes('productDetail')) {
                const arr = url.split('/');
                goGoodsDetail(arr[arr.length - 5], arr[arr.length - 2]);
                this.webview.goBack(); // ios端突然 拦截不了 web端H5的跳转了 所以加一个 goBack
            }
            // if (url.includes('haiercash.com')) {
            //     navigationPush('CustomWebView', { customurl: url, headerTitle: '顺逛白条' });
            //     this.webview.goBack();
            //     return false;
            // }
            // if (url.includes('guidePage')) {
            //     this.props.navigation.goBack();
            //     this.webview.goBack();
            //     return false;
            // }
            return true;
        }
        return true;
    };

    private showAlert = () => {
        Alert.alert(
            '提示',
            '您确定要放弃支付吗？',
            [
                {text: '否', onPress: () => Log('Cancel Pressed'), style: 'cancel'},
                {text: '是', onPress: () => this.props.navigation.goBack()},
            ],
            {cancelable: false},
        );
    };

    public render(): JSX.Element {
        // 如果是通过anvigation跳转到当前界面,就从this.props.navigation.state.params中取得参数;
        // 如果是把当前组件当子组件,就从this.props获取父组件传递过来的参数
        // const { navigation: { state: { params = {} } } } = this.props;
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
        const propsParams = this.props.customurl ? this.props : this.props.navigation.state.params;
        if (propsParams.doNotModifyCustomUrl) {
            webUrl = propsParams.customurl;
        } else {
            webUrl = propsParams.customurl ? propsParams.customurl + '?sg_rn_app' + messageUrl : URL.H5_HOST + 'topic/qhot?sg_rn_app';
        }
        console.log('CustomWebView', this.state.headerTitle, webUrl);
        showBackBtn = webUrl.includes('topic/qhot') ? false : true;
        let top = 0;
        if (
            this.state.headerTitle !== '智家新品众筹' &&
            this.state.headerTitle !== '智家众创定制' &&
            this.state.headerTitle !== '智家百货超市'
        ) {
            if (Platform.OS === 'ios') {
                top = 20;
                if (isiPhoneX) {
                    top = 44;
                }
            }
        }


        let header = <View style={{height: top, width: '100%'}}></View>;

        const externalLinks = !webUrl.includes('ehaier.com') || webUrl.indexOf('ehaier.com') > 30;
        if (this.state.showBackBtn) {
            if (this.state.headerTitle === '顺逛白条' || this.state.headerTitle === '3D展示' || this.state.headerTitle === '白条支付' || this.state.headerTitle === '海尔大学' || this.state.headerTitle === '银行卡支付' || this.state.headerTitle === '新手必读') {
                header = <Header goBack={() => {
                    this.goBack();
                }} title={this.state.headerTitle}>
                    <View style={{position: 'absolute', right: 5, flexDirection: 'row'}}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingRight: 10,
                            }}
                            onPress={() => this.props.navigation.goBack()}>
                            <Text style={{color: '#666', fontSize: 25}}>×</Text>
                        </TouchableOpacity>
                    </View>
                </Header>
            } else if (externalLinks) {
                //外链固定显示header
                header = <Header
                    goBack={() => {
                        this.goBack()
                    }} title={this.state.headerTitle}>
                    <View style={{position: 'absolute', right: 5, flexDirection: 'row'}}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingRight: 10,
                            }}
                            onPress={() => this.props.navigation.goBack()}>
                            <Text style={{color: '#666', fontSize: 25}}>×</Text>
                        </TouchableOpacity>
                    </View>
                </Header>
            } else {
                header = [<View style={{height: top, width: '100%'}}></View>, <View style={{
                    position: 'absolute',
                    left: 5,
                    top: 7 + top,
                    zIndex: 1000,
                }}>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingLeft: 10,
                            width: 30,
                            height: 30,
                            zIndex: 1000,
                        }}
                        onPress={() => {
                            this.goBack();
                        }}>
                        <View style={{
                            borderLeftWidth: 3,
                            borderBottomWidth: 3,
                            width: 16,
                            height: 16,
                            borderColor: '#666',
                            zIndex: 1000,
                            transform: [{rotate: '45deg'}]
                        }}>
                        </View>
                    </TouchableOpacity>
                </View>];
            }
            if (externalLinks) {
                //外链固定显示header
                header = <Header
                    goBack={() => {
                        this.goBack()
                    }} title={this.state.headerTitle}>
                    <View style={{position: 'absolute', right: 5, flexDirection: 'row'}}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingRight: 10,
                            }}
                            onPress={() => this.props.navigation.goBack()}>
                            <Text style={{color: '#666', fontSize: 25}}>×</Text>
                        </TouchableOpacity>
                    </View>
                </Header>
            }

        } else if (externalLinks) {
            //外链固定显示header
            header = <Header
                goBack={() => {
                    this.goBack()
                }} title={this.state.headerTitle}>
                <View style={{position: 'absolute', right: 5, flexDirection: 'row'}}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingRight: 10,
                        }}
                        onPress={() => this.props.navigation.goBack()}>
                        <Text style={{color: '#666', fontSize: 25}}>×</Text>
                    </TouchableOpacity>
                </View>
            </Header>
        }

        return (
            <View
                style={{flex: 1}}>
                {/*<StatusBar*/}
                {/*barStyle={'dark-content'}*/}
                {/*/>*/}
                {header}
                {/* {propsParams.hiddenHeader ? <View></View> :
                 (propsParams.headerTitle !== '快捷通支付' ?
                 <CustomNaviBar
                 navigation={this.props.navigation}
                 titleView={
                 <Text style={{
                 color: 'black',
                 fontFamily: 'PingFangSC-Light',
                 fontSize: 18,
                 }}>
                 {showBackBtn ? (this.state.headerTitle ? this.state.headerTitle : '活动页面') : '顺逛社群'}
                 </Text>}
                 rightView={rightView ? rightView : null}
                 rightTitle={rightTitle ? rightTitle : null}
                 rightAction={rightAction ? rightAction : null}
                 leftView={<Button
                 image={require('../../images/left.png')}
                 local={{imageWidth: 24}}
                 style={[{position: 'absolute', left: 4, bottom: 0, top: 0, paddingLeft: 0}]}
                 onPress={() => this.goBack()}
                 />}
                 /> : <View style={{height: Platform.OS === 'ios' ? 20 : 0, backgroundColor: 'transparent'}}/>)} */}
                {/*//一旦加上onMessage属性模拟器就会报红色错误下面的injectedJavaScript是解决该报错的*/}
                <WebView
                    style={{flex: 1}}
                    ref={w => {
                        this.webview = w;
                    }}
                    onLoadStart={() => {
                        if (this.state.headerTitle === '银行卡支付') {
                            this.setState({showBackBtn: true});
                        } else if (this.state.headerTitle === '新手必读') {
                            this.setState({showBackBtn: true});
                        } else if (this.state.headerTitle === '海尔大学') {
                            this.setState({showBackBtn: true});
                        } else if (webUrl.indexOf('payByBt') !== -1) {
                            //白条支付
                            this.setState({showBackBtn: true});
                        } else if (webUrl.indexOf('/sgbt/') !== -1) {
                            //白条激活，https://testpm.haiercash.com:9002/sgbt/#!/applyQuota/amountNot.html?
                            this.setState({showBackBtn: true});
                        } else if (webUrl.indexOf('/3D/') !== -1) {
                            //3d展示
                            this.setState({showBackBtn: true});
                        } else if (webUrl.indexOf('quotaMerge') !== -1) {
                            //白条不显示加载中
                            this.setState({showBackBtn: true});
                        } else {
                            this.setState({showBackBtn: false});
                        }
                    }}
                    onNavigationStateChange={this.shouldStartLoadWithRequest}
                    onLoad={() => {
                        //加载成功时调用。
                        if (this.state.headerTitle === '银行卡支付') {
                            this.setState({showBackBtn: true});
                        } else if (this.state.headerTitle === '海尔大学') {
                            this.setState({showBackBtn: true});
                        } else if (this.state.headerTitle === '新手必读') {
                            this.setState({showBackBtn: true});
                        } else if (webUrl.indexOf('payByBt') !== -1) {
                            //白条支付
                            this.setState({showBackBtn: true});
                        } else if (webUrl.indexOf('/sgbt/') !== -1) {
                            //白条激活，https://testpm.haiercash.com:9002/sgbt/#!/applyQuota/amountNot.html?
                            this.setState({showBackBtn: true});
                        } else if (webUrl.indexOf('/3D/') !== -1) {
                            //3d展示
                            this.setState({showBackBtn: true});
                        } else if (webUrl.indexOf('quotaMerge') !== -1) {
                            //白条没有返回按钮,所以不隐藏返回按钮
                            this.setState({showBackBtn: true});
                        } else {
                            this.setState({showBackBtn: false});
                        }
                        this.setState({urlErr: false});
                    }}
                    renderError={(e) => {
                        console.log('-------=== renderError ===--------');
                        console.log(e);
                        if (e === 'WebKitErrorDomain') {
                            this.setState({urlErr: true});
                            // Toast.fail("url 解析错误!", 2);
                            this.goBack();
                            return
                        }
                    }}
                    onError={(e) => {
                        this.setState({urlErr: true});
                        console.log('-------=== onError ===--------');
                        console.log(e.nativeEvent);

                        // if (Platform.OS == 'ios') {
                        //     const domain = L.get(e, 'nativeEvent.domain', 'other');
                        //     if (domain == 'NSURLErrorDomain') {
                        //         //description A server with the specified hostname could not be found.
                        //         this.setState({urlErr: true});
                        //         Toast.fail("url 解析错误!", 2);
                        //     } else {
                        //         // description The Internet connection appears to be offline.
                        //         // 没有网络时,页面加载错误
                        //         if (this.props.refreshCallBack) {
                        //             this.props.refreshCallBack();
                        //         }
                        //         this.setState({showBackBtn: true});
                        //     }
                        // }else{
                        //
                        // }

                    }}
                    source={{uri: webUrl}}
                    onMessage={(e) => {
                        this.handleMessage(e);
                    }}
                    onLoadEnd={(e) => {
                        const nativeEvent = e.nativeEvent;
                        let canGoBack = L.get(nativeEvent, 'canGoBack');
                        this.setState({canGoBack});
                        let url = L.get(nativeEvent, 'url');

                        // if (this.state.headerTitle === '银行卡支付' && (url.includes('CCBIS/ccbMain?') || url.includes('B2CMainPlat_03_EPAY?CLIENTIP'))) {
                        //
                        // } else {
                        //     if (!url.includes('productDetail') && !url.includes('react-js-navigation')) {
                        //         if (this.state.urlArr.length > 0) {
                        //             if (this.state.urlArr.findIndex(item => decodeURIComponent(item).includes(decodeURIComponent(url).replace('&channelNo=46', ''))) < 0) {
                        //                 this.state.urlArr.push(url);
                        //                 console.log('push后', this.state.urlArr);
                        //             }
                        //         } else {
                        //             this.state.urlArr.push(url);
                        //             console.log('push后', this.state.urlArr);
                        //         }
                        //     }
                        // }

                    }}
                    javaScriptEnabled
                    injectedJavaScript={patchPostMessageJsCode}>
                </WebView>
                {
                    this.state.urlErr &&
                    <View style={{position: 'absolute', top: 100, left: 0, right: 0, bottom: 0, alignItems: 'center'}}>
                        <Image source={noservice} style={{height: 100, width: 130, marginTop: 50}}/>
                        <Text style={{color: '#999', fontSize: 14, marginTop: 20}}>您访问的地址不存在!</Text>
                        <TouchableOpacity onPress={() => {
                            this.goBack();
                        }}>
                            <Text style={{color: '#fff', fontSize: 14, marginTop: 20, padding: 5, backgroundColor: '#999'}}>关闭</Text>
                        </TouchableOpacity>

                    </View>
                }

                <ShareModle
                    visible={this.state.showShareModal}
                    content={this.state.shareContent}
                    onCancel={() => this.setState({showShareModal: false})}
                    hiddenEwm={true}
                    hidingTitle={true}
                    onSuccess={() => {
                        Alert.alert('提示:', '分享成功', [{text: '确定'}]);
                    }}
                />
                {/*{this.state.forbidBack ? <TouchableOpacity
                    onPress={() => {
                        Toast.info("页面跳转中,请稍后");
                    }}
                    style={{
                        position: 'absolute',
                        height: 100,
                        width: 50,
                        top: 0,
                        left: 0,
                        backgroundColor: "red"
                    }}></TouchableOpacity> : null}*/}
            </View>);
    }

    private handleNavigationChange = (navState) => {
        Log(navState);
        const url = navState.url;
        // if (currentUrl === url) {
        //     return false;
        // } else {
        //     currentUrl = url;
        // }
        // 如果是顺逛内部网页 进行逻辑处理
        if (url.startsWith(Config.API_URL) || url.includes('ehaier.com')) {
            // 如果是要跳转到详情页面
            if (url.includes('productDetail')) {
                const arr = url.split('/');
                this.webview.goBack();
                goGoodsDetail(arr[arr.length - 5], arr[arr.length - 2]);
                return false;
            }
            if (url.includes('haiercash.com')) {
                //顺逛白条
                //this.webview.goBack();
                //navigationPush('CustomWebView', {customurl: url, headerTitle: '顺逛白条'});
                //return false;
            }
            if (url.includes('guidePage')) {
                this.props.navigation.goBack();
                this.webview.goBack();
                return false;
            }
            return true;
        }

        return true;
    };
    // 给H5发送消息
    private sendMsg = async () => {
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
    };
    // 处理从H5收到的消息
    private handleMessage = async (e) => {
        // Log('&&&&&&&&&&&&&&&&&&&&&来自html的消息如下&&&&&&&&&&&&&&&&&&&&&');
        // Log(e.nativeEvent.data);
        // if (e.nativeEvent.data === 'from-sg-h5') {
        //     const userMsg = dvaStore.getState().users;
        //     Log(userMsg);
        //     // const flag = this.props.navigation.state.params.flag;
        //     const messageObj = {
        //         "home": "shunguang-RN",
        //         "userMsg": userMsg,
        //     };
        //     const message = JSON.stringify(messageObj);
        //     Log(message);
        //     this.webview.postMessage(message);
        //     Log('消息发送完毕');
        //     Toast.hide();
        // }
        // 如果打开的H5页面已经没有上一个页面了
        let msg = e.nativeEvent.data;
        console.log(msg);
        if (msg === 'goback') {
            this.goBack(true);
        } else if (msg === 'gobackHistory') {
            this.goBack();
        } else if (msg.includes('share')) {
            console.log(msg);
            const arr = msg.split('|');
            if (arr.length !== 4) {
                Alert.alert('提示:', `参数异常(${arr.length}),请重试`, [{text: '确定'}]);
                return;
            }
            if (arr[1] && arr[2] && arr[3]) {
                let url = this.state.urlArr[this.state.urlArr.length - 1];
                if (url.indexOf('?') !== -1) {
                    url = url.substr(0, url.indexOf('?'));
                }
                const Content = [arr[2] + '的综合竞争力指数', '综合竞争力指数全球排名' + arr[1] + '位,颤抖吧人类', arr[3], url, 0];
                console.log('分享参数', Content);
                this.setState({
                    shareContent: Content,
                    showShareModal: true,
                });
            } else {
                Toast.info(`请稍后`);
            }
        } else if (msg.includes('custPageShare')) {
            const arr = msg.split('|');
            const loginStatus = dvaStore.getState().users.isLogin;
            if(loginStatus){
                const Content = [arr[1], arr[2], arr[3], arr[4], 0];
                this.setState({
                    shareContent: Content,
                    showShareModal: true,
                });
            }else{
                Toast.info('请先登录，再分享');
            }
        }else if (msg === 'orderList') {
            //订单中心
            this.props.navigation.navigate('OrderList', {orderFlag: 0, orderStatus: 0})
        } else if (msg === 'goguangguang') {
            console.log(this.props.router);
            //新开一个轮播图页面的时候需要先返回
            if (this.props.router.routes.length > 1) {
                this.props.navigation.goBack(this.props.router.routes[1].key);
            }
            //众筹里面点击 去逛逛
            this.props.navigation.navigate('Home');
        } else if (msg === 'cart') {
            //点击h5中的购物车按钮
            this.props.navigation.navigate('Cart', {showCartBackBtn: true});
        } else if (msg === 'closeWebView') {
            if (this.props.navigation.state.params && this.props.navigation.state.params.callBack) {
                this.props.navigation.state.params.callBack();
            }
            //点击h5中的购物车按钮
            this.props.navigation.goBack();
        } else if (msg === 'gohome') {
            if (this.props.router.routes.length > 1) {
                this.props.navigation.goBack(this.props.router.routes[1].key);
            }
            //智家
            this.props.navigation.navigate('Mine');
        }
    };
    private navigateToSuccessPage = (result) => {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: 'PaymentResult',
                    params: {info: result},
                }),
            ],
        });
        this.props.navigation.dispatch(resetAction);
    };

    private navigateToFailPage = () => {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: 'PaymentFailed',
                    params: null,
                }),
            ],
        });
        this.props.navigation.dispatch(resetAction);
    }
}

const styles = EStyleSheet.create({
    iphoneXTop: {
        flex: 1,
        paddingTop: 44,
    },
    normalIosTop: {
        flex: 1,
        paddingTop: 20,
    },
    normalTop: {
        flex: 1,
        paddingTop: 0,
    },
});
export default CustomWebView;