import { createAction, isLogin, logout, IS_NOTNIL } from '../utils';
import { AsyncStorage, DeviceEventEmitter, NativeModules, Platform, Alert, AppState } from 'react-native';
import { fetchUnread } from './homeModel';
import SplashScreen from 'react-native-splash-screen';
import { ShowAdType } from '../interface';
import moment from 'moment';
import { Toast } from 'antd-mobile';
import RNFS from 'react-native-fs';
import {getAppJSON} from '../netWork';
import Config from 'react-native-config';

import JPushModule from 'jpush-react-native';

export default {
    namespace: 'mainReducer',
    state: {
        doLoading: false,
        showAdType: ShowAdType.None,
        firstLoading: false,
        unread: 0, // 未读消息
        isTrueAuthentication: false, //认证
    },
    reducers: {
        stateChange(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    effects: {
        *appBegin({ payload }, { call, put, take }) {
            try {
                // 每次启动应用,读取本地存储的用户信息
                const userMsg = yield call(global.getItem, 'User');
                // 初始化店铺id
                const storeId = yield global.getItem('storeId');
                if (!storeId) {
                    global.setItem('storeId', 20219251); // 官方店铺id
                }
                // 添加登录成功的监听 登录成功后调接口 调完接口移除监听
                const judge88AlertListenner = DeviceEventEmitter.addListener('judge88Alert', async () => {
                    // 未认证的88码用户 需要弹窗提示
                    const userInfo = await global.getItem('User');
                    const memberIds = userInfo.mid;
                    const params = {
                        memberId: memberIds,
                    };
                    const response = await getAppJSON(Config.IS_HAS_STORE, params);
                    if (response.data) {
                        const res = await getAppJSON(Config.HOMEPAGE_ISWDHOST);
                        if (res.success) {
                            if (res.data.isHost === 1) {
                                if (res.data.o2o === true && IS_NOTNIL(res.message)) {
                                    Alert.alert(
                                        null,
                                        res.message,
                                        [
                                            {text: '退出', onPress: () => logout()},
                                        ],
                                        );
                                }
                            }
                        } else {
                            Toast.fail('获取数据信息失败', 2);
                        }
                    }
                    // judge88AlertListenner.remove();
               });
                // 上传设备DeviceToken(只在真机上能获取到DeviceToken)
                // 上传 v3/platform/web/app/saveDeviceToken.json 后台报错，暂时功能去掉，功能然并卵  --  何兴
                if (userMsg.isLogin) { // 登录以后再调获取设备token的接口
                    // 友盟的推送就不用了
                    // NativeModules.UmengModule.getDeviceToken()
                    // .then(result => {
                    //     // 获取DeviceToken成功
                    //     getAppJSON(Config.DEVICE_INFO, {
                    //         member_id: userMsg.mid,
                    //         device_token: result,
                    //         device_type: Platform.OS === 'ios' ? 'ios' : 'android',
                    //     });
                    // })
                    // .catch((errorCode, domain, error) => {
                    //     Log('未获取到DeviceToken');
                    // });
                    if (Platform.OS === 'ios') {
                        NativeModules.ToolsModule.getDeviceToken()
                        .then(result => {
                            // 获取DeviceToken成功
                            getAppJSON(Config.DEVICE_INFO, {
                                member_id: userMsg.mid,
                                device_token: result,
                                device_type: 'ios',
                            });
                        })
                        .catch((errorCode, domain, error) => {
                            Log('未获取到DeviceToken');
                        });
                    } else {
                        JPushModule.getInfo(map => {
                            if (IS_NOTNIL(map.myDeviceId)) {
                                getAppJSON(Config.DEVICE_INFO, {
                                    member_id: userMsg.mid,
                                    device_token: map.myDeviceId,
                                    device_type: 'android',
                                });
                            }
                        });
                    }
                    // 未认证的88码用户 需要弹窗提示
                    const memberIds = userMsg.mid;
                    const params = {
                        memberId: memberIds,
                    };
                    const response = yield getAppJSON(Config.IS_HAS_STORE, params);
                    if (response.data) {
                        const res = yield getAppJSON(Config.HOMEPAGE_ISWDHOST);
                        if (res.success) {
                            if (res.data.isHost === 1) {
                                if (res.data.o2o === true && IS_NOTNIL(res.message)) {
                                    Alert.alert(
                                        null,
                                        res.message,
                                        [
                                            {text: '退出', onPress: () => logout()},
                                        ],
                                        );
                                }
                            }
                        } else {
                            Toast.fail('获取数据信息失败', 2);
                        }
                    }
                }
                const userInterceptedListenner = DeviceEventEmitter.addListener('userIntercepted', async (data) => {
                    logout('Login');
                });
                // wei认证弹窗

                // 存储到dva中
                yield put(createAction('users/saveUsersMsg')({...userMsg}));
                DeviceEventEmitter.emit('loginSuccess', {doNotFetchAdvertisement: true});

                // yield put(createAction('adModel/loadAd')());
                // yield put(createAction('adModel/loadAdImg')());
                // yield take('adModel/loadAd/@@end');
                // yield take('adModel/loadAdImg/@@end');
                //
                // // 查看本地是否存储的有first字段,第一次安装应用result返回空
                // // const result = yield call(AsyncStorage.getItem, 'first');
                // // 是否是第一次安装app
                // const jsFirstInstallSg = yield global.getItem('firstInstallSg');
                // const firstInstallSg = jsFirstInstallSg === 'true' ? true : false;
                // yield put(createAction('stateChange')({ firstLoading: firstInstallSg }));
                // yield put(createAction('showAdView')());
                //
                // // 检查服务器广告页和视频接口是否更新
                // yield put(createAction('adModel/checkSeverAd')());

                yield put(createAction('users/getUnreadMessage')());
                yield put(createAction('cartModel/fetchCartList')());
                yield put(createAction('mine/fetchGoldRecord')()); // 启动app时调用金币记录接口
                AppState.addEventListener('change', async (appState) => {
                    if (appState === 'active') {
                        // await getAppJSON(Config.GOLD_RECORD);
                        try {
                            await getAppJSON('v3/h5/sg/member/appLoginRecord.json');
                        } catch (error) {
                            console.log(error);
                        }
                    }
                });
            } catch (error) {
                Log(error);
                // SplashScreen.hide();
            }
        },
        *getAd({ payload }, { call, put, select }) {
            try {
                // 1. 获取广告服务,超时3秒,关闭启动页
                yield put(createAction('adModel/loadAd')());
                yield put(createAction('adModel/loadAdImg')());

            } catch (error) {
                Log(error);
                // SplashScreen.hide();
            }
        },
        *showAdView({ payload }, { call, put, select }) {
            try {
                const { adModel: { adData, videoUrl }, mainReducer: { firstLoading } } = yield select(state => state);
                if (videoUrl) {
                    yield put(createAction('stateChange')({ showAdType: ShowAdType.Video }));
                } else if (adData && adData.length > 0) {
                    yield put(createAction('stateChange')({ showAdType: ShowAdType.Image }));
                } else if (firstLoading) {
                    yield put(createAction('stateChange')({ showAdType: ShowAdType.Guide }));
                } else { // 首页广告信息弹窗
                    yield put(createAction('home/fetchAdvertisement')());
                }
                // SplashScreen.hide();
                // 有视频的时候在视频加载完成时在隐藏SplashScreen
                // if (!videoUrl) {
                //     SplashScreen.hide();
                // }

            } catch (error) {
                Log(error);
                // SplashScreen.hide();
            }
        },
        *adViewNext({ payload }, { call, put, select }) {
            try {
                // Toast.hide(); // 奇怪的用户未登录toast 不显示却挡住了引导页导致点不了
                const { adModel: { adData, videoUrl }, mainReducer: { firstLoading, showAdType } } = yield select(state => state);
                const preShowType = showAdType;
                if (preShowType === ShowAdType.Video) {
                    // 存储视频今天是否播放的状态
                    const todayStr = moment().format('YYYY-MM-DD');
                    AsyncStorage.setItem('videoUrlSeeDate', todayStr);

                    let nextShowType = ShowAdType.None;
                    if (firstLoading) {
                        nextShowType = ShowAdType.Guide;
                    } else if (adData && adData.length > 0) {
                        nextShowType = ShowAdType.Image;
                    }
                    yield put(createAction('stateChange')({ showAdType: nextShowType }));
                } else if (preShowType === ShowAdType.Guide) {
                    AsyncStorage.setItem('first', 'false');
                    yield put(createAction('stateChange')({ showAdType: ShowAdType.None }));
                } else if (preShowType === ShowAdType.Image) {
                    yield put(createAction('stateChange')({ showAdType: ShowAdType.None }));
                    yield put(createAction('home/fetchAdvertisement')());
                }
            } catch (error) {
                Log(error);
                yield put(createAction('stateChange')({ showAdType: ShowAdType.None }));
            }
        },
       
    },
};
