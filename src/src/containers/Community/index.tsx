import * as React from 'react';
import { StatusBar, Platform, Text, NativeAppEventEmitter, DeviceEventEmitter, NativeModules, View} from 'react-native';
import { INavigation } from '../../interface/index';
import { createAction, connect, IS_NOTNIL } from '../../utils/index';
import Orientation from 'react-native-orientation';
import {action, NavigationUtils} from './../../dva/utils';


import { goToSQZBS } from '../../utils/tools';

// ios端的APICloud的SuperWebView
const SuperView = require('./SuperView.js');
// android端的APICloud的SuperWebView

const SuperWebview = require('./SuperWebview.js');
interface ICollectState {
    keyboardHeight: number;
}

@connect(({users:{isLogin, mid}, home, address}) => ({isLogin, mid, home, ...address}))
class Community extends React.Component<INavigation , ICollectState> {
    private subscriptionNaviteCallRNMethod: any;

    public componentDidMount() {
        const emitter = Platform.OS === 'ios' ? NativeAppEventEmitter : DeviceEventEmitter;
        this.subscriptionNaviteCallRNMethod = emitter.addListener(
            'NaviteCallRNMethod',
            (pageInfo) =>  {
                if (global.sceneIndex === 2 && !global.isPageTwo) {
                    this.NaviteCallRNMethod(pageInfo);
                }
            },
          );
    }
    public componentWillUnmount() {
        this.subscriptionNaviteCallRNMethod.remove();
    }
    public render(): JSX.Element {
        return (
            Platform.OS === 'ios' ?
            <SuperView pageParam={
                {url: 'widget://html/main.html'}
                // {url: 'widget://index.html'}
            }/> :
            <View style={{flex: 1, backgroundColor: 'white'}}>
            <SuperWebview
                // url='file:///android_asset/widget/index.html'
                url='file:///android_asset/widget/html/main.html'
            />
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
        } else if (pageInfo.type === 5 && global.sceneIndex === 2) {
            // APICloud自己跳自己界面,通知RN是否隐藏TabBar add global.sceneIndex＝＝2 只限再点击社区后做显示隐藏操作
            if (pageInfo.isShowTabBar === 1) {
                // 显示tabBar
                this.props.dispatch(createAction('home/onShowTab')({ isShowTab: true }));
            } else if (pageInfo.isShowTabBar === 0) {
                // 隐藏tabBar
                if(!global.isPageTwo){
                    this.props.dispatch(createAction('home/onShowTab')({ isShowTab: false }));
                }
            }
        } else if (pageInfo.type === 26 && global.sceneIndex === 2) {
            global.sceneIndex = 0;
            this.props.dispatch(NavigationUtils.navigateAction('NewHome'));
        } else if  (pageInfo.type === 10) {
            // 横竖屏
            if (pageInfo.command[0] === '1') {
                StatusBar.setHidden(false, 'fade');
                // 竖屏
                Orientation.getOrientation((err, orientation) => {
                    if (orientation !== 'PORTRAIT') {
                        Orientation.lockToLandscape();
                        Orientation.lockToPortrait();
                    }
                    // console.log(`Current Device Orientation: ${orientation}`);
                });
            } else {
                    StatusBar.setHidden(true, 'fade');
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
export default Community;
