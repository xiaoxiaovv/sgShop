import * as React from 'react';
import { Platform, View , Text, NativeAppEventEmitter, DeviceEventEmitter, NativeModules, BackHandler} from 'react-native';
import { INavigation } from '../../interface/index';
import { createAction, connect, IS_NOTNIL } from '../../utils/index';
import Orientation from 'react-native-orientation';
import {action, NavigationUtils} from './../../dva/utils';
import {GET} from '../../config/Http';
import {Toast} from 'antd-mobile';
import URL from '../../config/url';
// ios端的APICloud的SuperWebView
const SuperView = require('./SuperView.js');
// android端的APICloud的SuperWebView


import { goToSQZBS } from '../../utils/tools';

const SuperWebview = require('./SuperWebview2.js');

interface ISuperSecondViewProps {
    // 要跳转到的APICloud的url例如: /index.html或   /main/main.html
    url: string;
}
// 该组件用于RN要跳转到APICloud的特定界面
@connect(({users:{isLogin, mid}, home, address}) => ({isLogin, mid, home, ...address}))
class SuperSecondView extends React.Component<INavigation & ISuperSecondViewProps> {

    private subscriptionNaviteCallRNMethod: any;
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            first: false,
        };
      }
    public componentDidMount() {
        global.isPageTwo = true;
        const emitter = Platform.OS === 'ios' ? NativeAppEventEmitter : DeviceEventEmitter;
        this.subscriptionNaviteCallRNMethod = emitter.addListener(
            'NaviteCallRNMethod',
            (pageInfo) =>  this.NaviteCallRNMethod(pageInfo),
          );
    }

    public componentWillUnmount() {
        // 这个界面退出时无论怎样都要显示tabBar
        this.props.dispatch(createAction('home/onShowTab')({ isShowTab: true }));
        this.subscriptionNaviteCallRNMethod.remove();
        global.isPageTwo = false;
        if (Platform.OS === 'android') {
            NativeModules.APICloudModule.remove2();

        }
    }

    public render(): JSX.Element {
        const { params } = this.props.navigation.state;
        let url = '';
        if (IS_NOTNIL(params) && IS_NOTNIL(params.url)) {
            // 说明是从其他RN界面跳转到社群特定页面
            url = Platform.OS === 'ios' ? `widget:/${params.url}` : `file:///android_asset/widget${params.url}`;
        } else {
            // params.url为空,设置成默认首页
            url = Platform.OS === 'ios' ? 'widget://html/main.html' : 'file:///android_asset/widget/html/main.html';
        }
        return (
            Platform.OS === 'ios' ?
            <SuperView pageParam={{...params, url}}/> :
            // <Text> apicloud的初始化在模拟器中崩溃，经查其缺少x86 so引用，方便在模拟器中调试其他功能注释掉apicloud引用</Text>
            <View style={{flex: 1, backgroundColor: 'white'}}>
             <SuperWebview url2={url}/>
            </View>
        );
    }
    // 原生调用-->RN的方法
    private NaviteCallRNMethod = async (pageInfo) => {
        // 判断是否是APICloud跳转RN界面功能
        if (pageInfo.type === 1) {
            let params = {};
            if (IS_NOTNIL(pageInfo.toPageParams)) {
                params = pageInfo.toPageParams;
            }
            if(pageInfo.toPageName === 'CommunityWeb'){

                // 跳转争霸赛页面

                console.log(global.WebKey);

                if ( global.WebKey ) {
                    console.log('-------replace------');
                    this.props.navigation.back();
                    return;
                } else {

                    // 跳转3期社群争霸赛
                    goToSQZBS();

                }
            } else {
                // 不是跳转争霸赛页面
                console.log('---------no return----------');
                // 是跳转RN界面的功能
                this.props.navigation.navigate(pageInfo.toPageName, {
                    ...params,
                    callBack: (userInfo) => {
                        // 是否需要回调
                        if ( pageInfo.canCallBack === 1) {
                            if (IS_NOTNIL(userInfo.token)) {
                                // 获取token成功
                                const info = {type: 1, tag: pageInfo.tag, success: 1, token: userInfo.token};
                                NativeModules.APICloudModule.RNCallNaviteMethod(info);
                            } else if (userInfo.tag === 'OpenStore' && userInfo.success === 1) {
                                const info = {type: 1, tag: 'OpenStore', success: 1};
                                NativeModules.APICloudModule.RNCallNaviteMethod(info);
                            } else {
                                // 获取token失败
                                const info = {type: 1, tag: pageInfo.tag, success: 0, message: '获取token失败'};
                                NativeModules.APICloudModule.RNCallNaviteMethod(info);
                            }
                        }
                    },
                });

            }
        } else if (pageInfo.type === 2) {
            // 获取tocken
            const token = await global.getItem('userToken');
            // 是否需要回调
            if ( pageInfo.canCallBack === 1) {
                if (IS_NOTNIL(token)) {
                    // 成功的回调
                    const info = {type: 2, tag: pageInfo.tag, success: 1, token};
                    NativeModules.APICloudModule.RNCallNaviteMethod(info);
                } else {
                    // 失败的回调
                    const info = {type: 2, tag: pageInfo.tag, success: 0, message: '获取token失败'};
                    NativeModules.APICloudModule.RNCallNaviteMethod(info);
                }
             }
        } else if (pageInfo.type === 6) {
            // 是APICloud的顶层界面要返回RN界面的操作
            if (!this.state.first) {
                this.setState({first: true}, () => {
                    this.props.navigation.goBack();
                });
            }
        } else if (pageInfo.type === 26) {
            // 是APICloud的顶层界面要返回RN界面的操作android
            if (!this.state.first) {
                this.setState({first: true}, () => {
                    this.props.navigation.goBack();
                });
            }
        } else if (pageInfo.type === 8) {
            try {
                const { params } = this.props.navigation.state;
                NativeModules.APICloudModule.RNCallNaviteMethodAndroid(params);
            } catch (e) {
                //
            }
        } else if  (pageInfo.type === 10) {
            // 横竖屏
            if (pageInfo.command[0] === '1') {
                // 竖屏
                Orientation.getOrientation((err, orientation) => {
                    if (orientation !== 'PORTRAIT') {
                        Orientation.lockToLandscape();
                        Orientation.lockToPortrait();
                    }
                    // console.log(`Current Device Orientation: ${orientation}`);
                });
            } else {
                    // 只允许横屏
                    if (Platform.OS === 'android') {
                        Orientation.lockToLandscape();
                    } else {
                        Orientation.lockToLandscape();
                        Orientation.lockToLandscapeRight();
                    }
            }
        }
    }
}
export default SuperSecondView;
