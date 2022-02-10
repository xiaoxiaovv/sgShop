


import { Toast } from "antd-mobile";
import L from 'lodash';
import moment from 'moment';
import { action, createAction, NavigationActions} from "./../utils";
import { ADService } from './../service';
import {
    AsyncStorage, Image, Platform
} from 'react-native';
import RNFS from 'react-native-fs';
import {ShowAdType} from "../../interface";
import SplashScreen from "react-native-splash-screen";
const localPath = `${RNFS.DocumentDirectoryPath}/adVideo.mp4`;

const initState = {
    showAdType: ShowAdType.None,
    adData: null,
    videoUrl: localPath,
    show120: false,
};


export default {
    namespace: 'ADModel',
    state: initState,
    reducers: {
        save(state, {payload}) {
            return {...state, ...payload};
        }
    },
    subscriptions: {

    },
    effects: {
        * showGuide(_, {all, call, put, select}) {
            console.log('------------------------------------===== 设置引导页 =====---------------------------------------');
            yield put(action('save', {showAdType: ShowAdType.Guide}));
            SplashScreen.hide();
        },
        * closeAll(_, {all, call, put, select}) {
            console.log('------------------------------------===== 关闭广告 =====---------------------------------------');
            yield put(action('save', {showAdType: ShowAdType.None}));
            SplashScreen.hide();
        },
        * getADs(_, {all, call, put, select}) {
            try {
                console.log('------------------------------------===== getADs =====---------------------------------------');
                const video = yield call(ADService.getADV);
                const image = yield call(ADService.getAD);
                let successV = L.get(video, 'success', false);
                let successI = L.get(image, 'success', false);
                if(successV){
                    let url = L.get(video, 'data.url', false);
                    if(url){
                        // 判断 url
                        console.log('----------有视频广告---------');
                        if(successI){
                            let data = L.get(image, 'data', false);
                            if(data && data.length > 0){
                                yield put(action('setVideo', {url: url, imageObj: data}));
                            }else{
                                yield put(action('setVideo', {url: url, imageObj: null}));
                            }
                        }else{
                            yield put(action('setVideo', {url: url, imageObj: null}));
                        }
                    }else{
                        console.log('----------没有视频广告---------');
                        if(successI){
                            let data = L.get(image, 'data', false);
                            if(data && data.length > 0){
                                yield put(action('setImage', {imageObj: data}))
                            }else{
                                SplashScreen.hide();
                            }
                        }else{
                            SplashScreen.hide();
                        }
                    }
                }else{
                    console.log('----------视频获取错误---------');
                    if(successI){
                        let data = L.get(image, 'data', false);
                        if(data && data.length > 0){
                            yield put(action('setImage', {imageObj: data}))
                        }else{
                            SplashScreen.hide();
                        }
                    }else{
                        SplashScreen.hide();
                    }
                }
            }
            catch (e) {
                console.log(e);
                SplashScreen.hide();
            }
        },
        * setVideo({type, payload:{url, imageObj}}, {all, call, put, select}) {
            try{
                const video = yield call(AsyncStorage.getItem, 'video-key');
                if(video){
                    //
                    let videoData = JSON.parse(video);
                    let videoUrl = L.get(videoData, 'url');
                    if(videoUrl == url){
                        let date = L.get(videoData, 'date');
                        let now = moment().format('YYYY-MM-DD');
                        if(moment(date).isBefore(now)){
                         // 设置播放
                            yield put(action('save', {showAdType: ShowAdType.Video}));
                            let videoObj = {
                                date: now,
                                url: url
                            };
                            AsyncStorage.setItem('video-key', JSON.stringify(videoObj));
                            SplashScreen.hide();
                        }else{
                            // 设置图像广告
                            if(imageObj){
                                yield put(action('setImage', {imageObj: imageObj}));
                            }else {
                                SplashScreen.hide();
                            }
                        }
                    }else{
                        // 设置图像广告
                        if(imageObj){
                            yield put(action('setImage', {imageObj: imageObj}));
                            // 缓存视频到本地
                            RNFS.downloadFile({ fromUrl: url, toFile: localPath }).promise.then(() => {
                                let videoData = {
                                    date: moment().subtract(1, 'd').format('YYYY-MM-DD'),
                                    url: url
                                };
                                AsyncStorage.setItem('video-key', JSON.stringify(videoData));
                            });
                        }else{
                            SplashScreen.hide();
                            // 缓存视频到本地
                            RNFS.downloadFile({ fromUrl: url, toFile: localPath }).promise.then(() => {
                                let videoData = {
                                    date: moment().subtract(1, 'd').format('YYYY-MM-DD'),
                                    url: url
                                };
                                AsyncStorage.setItem('video-key', JSON.stringify(videoData));
                            });
                        }
                    }
                }else{
                    // 设置图像广告
                    if(imageObj){
                        yield put(action('setImage', {imageObj: imageObj}));
                        // 缓存视频到本地
                        RNFS.downloadFile({ fromUrl: url, toFile: localPath }).promise.then(() => {
                            let videoData = {
                                date: moment().subtract(1, 'd').format('YYYY-MM-DD'),
                                url: url
                            };
                            AsyncStorage.setItem('video-key', JSON.stringify(videoData));
                        });
                    }else{
                        SplashScreen.hide();
                        // 缓存视频到本地
                        RNFS.downloadFile({ fromUrl: url, toFile: localPath }).promise.then(() => {
                            let videoData = {
                                date: moment().subtract(1, 'd').format('YYYY-MM-DD'),
                                url: url
                            };
                            AsyncStorage.setItem('video-key', JSON.stringify(videoData));
                        });
                    }
                }

            }catch (e) {
                console.log(e);
                SplashScreen.hide();
            }
        },
        * setImage({type, payload:{imageObj}}, {all, call, put, select}) {
            try{
                console.log('------setImage------');
                const image = yield call(AsyncStorage.getItem, 'image-key');
                if (image) {
                    // console.log(image);
                    let imageData = JSON.parse(image);
                    let imageStorage = L.get(imageData, 'imageObj');
                    if (L.isEqual(imageObj, imageStorage)) {
                        console.log('----------------- 和上一次一样 -----------------');
                        let date = L.get(imageData, 'date');
                        let now = moment().format('YYYY-MM-DD');
                        if (moment(date).isBefore(now)) {
                            // 今天第一次
                            // alert('今天 first 展示图片');
                            console.log('----------------- 今天第一次 -----------------');
                            yield put(action('save', {showAdType: ShowAdType.Image, adData: imageObj}));
                            let imageData = {
                                imageObj: imageObj,
                                date: now,
                                times: 1
                            };
                            yield call(AsyncStorage.setItem, 'image-key', JSON.stringify(imageData));
                            SplashScreen.hide();
                        } else {
                            // 今天不止第一次
                            let times = L.get(imageData, 'times');
                            if (times < 3) {
                                let t = times + 1;
                                console.log(`----------------- 今天 3 次内 -- ${t}---------------`);
                                // alert(`今天第${t}次展示图片`);
                                yield put(action('save', {showAdType: ShowAdType.Image, adData: imageObj}));
                                let imageData = {
                                    imageObj: imageObj,
                                    date: now,
                                    times: t
                                };
                                yield call(AsyncStorage.setItem, 'image-key', JSON.stringify(imageData));
                                SplashScreen.hide();
                            } else {
                                console.log(`----------------- 今天 大于 3 次 --------------`);
                                SplashScreen.hide();
                            }
                        }
                    } else {
                        // 展示图片
                        console.log('----------------新广告页-全新 first 展示图片-----------------');
                        // 缓存图片次数
                        let img = imageObj[0]['image'];
                        yield call(Image.prefetch, img);
                        yield put(action('save', {showAdType: ShowAdType.Image, adData: imageObj}));
                        let imageData = {
                            imageObj: imageObj,
                            date: moment().format('YYYY-MM-DD'),
                            times: 1
                        };
                        yield call(AsyncStorage.setItem, 'image-key', JSON.stringify(imageData));
                        SplashScreen.hide();
                    }
                } else {
                    // 展示图片
                    console.log('-----------------全新 first 展示图片-----------------');
                    // 缓存图片次数
                    let img = imageObj[0]['image'];
                    yield call(Image.prefetch, img);
                    yield put(action('save', {showAdType: ShowAdType.Image, adData: imageObj}));
                    let imageData = {
                        imageObj: imageObj,
                        date: moment().format('YYYY-MM-DD'),
                        times: 1
                    };
                    yield call(AsyncStorage.setItem, 'image-key', JSON.stringify(imageData));
                    SplashScreen.hide();
                }

            }catch (e) {
                console.log(e);
                SplashScreen.hide();
            }
        },
        * show120(_, {all, call, put, select}) {
            yield put(action('save', {show120: true}));
        },
        * close120(_, {all, call, put, select}) {
            yield put(action('save', {show120: false}));
        },

    }
}
