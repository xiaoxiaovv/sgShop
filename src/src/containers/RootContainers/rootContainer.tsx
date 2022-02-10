import React, { Component } from 'react';
import {View, Text, StyleSheet, Image, Platform, Dimensions, BackHandler, NativeModules, Animated, AsyncStorage, DeviceEventEmitter} from 'react-native';
import { IGuideProps } from '../../interface';
import NavigationRouter from '../../dvaModel/navigationHelper';
import { createAction, connect } from '../../utils';
import { action } from '../../dva/utils';
import { ICustomContain, ShowAdType } from '../../interface/index';
import {getAppJSON, postAppJSON} from '../../netWork';
import Config from 'react-native-config';
import Advertisement from '../Advertisement/Advertisement';
import { Stomp } from 'stompjs/lib/stomp';
import Orientation from 'react-native-orientation';
import Authentication from '../Mine/Store/authenticationModal';
import { Tips120 } from './../../components';

const { height, width } = Dimensions.get('window');
let SWidth, SHeight;
if(height > width){
    SWidth = width;
    SHeight = height;
}else{
    SWidth = height;
    SHeight = width;
}

import NetWorkModal from "./../../../src/components/NetWorkModal";


@connect(({ADModel}) => ({...ADModel}))
class RootContainer extends Component<IGuideProps&ICustomContain> {
    constructor(props) {
        super(props);
        this.state = {
            socketMessage : '',
            opacity: new Animated.Value(0),
        };
    }
    public async componentWillMount() {
        // // 每次启动应用,读取本地存储的用户信息 ---不要删除---
        // const userMsg = await global.getItem('User');
        // // 存储到dva中   ---不要删除---
        // this.props.dispatch(createAction('users/saveUsersMsg')({...userMsg}));
        // 刚进入应用时,只允许竖屏
        Orientation.lockToPortrait();
        const openSecond = await AsyncStorage.getItem('openSecond');
        if (openSecond) {
            // 加载广告顺序
            console.log('------------------加载广告相关-----------------');
            this.props.dispatch(action('ADModel/getADs'));
        } else {
            console.log('------------------第一次进入启动页-----------------');
            this.props.dispatch(action('ADModel/showGuide'));
        }
        this.props.dispatch(createAction('mainReducer/appBegin')());

    }
    public async componentDidMount() {
        const config = {
          openLogEnable: true,
          umeng_appkey: '55e2d8a367e58e9e2700050f',   // 顺逛iOS端在友盟的appkey
          wechat_appkey: 'wxde9dd6325717e515',
          wechat_appsecret: 'f9bf1b31c2c34e4d943e33a42c361712',
          sina_appkey: '1919773535',
          sina_appsecret: '5ff2cf4e8ccb19fb9dc4ba358f127ed3',
          qq_appkey: '1104761357',
          qq_appsecret: 'yjhHLYeZx9ZHImpn',
        };
        if (Platform.OS === 'ios') {
            // 注册友盟Appkey
            NativeModules.UmengModule.registerAppInfo(config);
            // 注册微信支付Appkey
            NativeModules.WxPayModule.registerApp({wechat_appkey: 'wxde9dd6325717e515'});
        }

        this.isAuthentication = DeviceEventEmitter.addListener('isFalseAuthentication', async ()=>{
            console.log('>>>>>>>>>>>>>有收到消息')
            await dvaStore.dispatch(createAction('mainReducer/stateChange')({isTrueAuthentication: true}));
            // console.log(dvaStore.getState().mainReducer.isTrueAuthentication)
        });

        // this.initWebSocket();
        // const json = await fetchPosition();
        // if (json.data) {
        //   let address = {};
        //   if (typeof json.data === 'string') {
        //     address = eval('(' + json.data + ')')[0];
        //   } else {
        //     address = json.data[0];
        //   }
        //   this.props.dispatch(createAction('address/changeAddress')(address));
        // }
        // else {
        //     getLocation((address) => {
        //     this.props.dispatch(createAction('address/changeAddress')(address));
        //     });
        // }

    }
    public render() {
        const { showAdType, doLoading, isTrueAuthentication } = this.props;
        // console.log(this.props)
        return (
            <View style={{flex: 1}}>
                <NavigationRouter/>
                {isTrueAuthentication && <Authentication navigation={this.props.navigation}/>}
                {(showAdType !== ShowAdType.None) && <Advertisement navigation={this.props.navigation}/>}
                {this.props.show120 && <Tips120 close={()=>{
                    console.log('--------this.props.show120------close----------');
                    this.props.dispatch({type: 'ADModel/close120'});
                }}/>}
                {/* {doLoading && <Progress />} */}
              <NetWorkModal/>
                {this.state.socketMessage ? <Text style={{backgroundColor: 'rgba(0, 0, 0, 0.3)', position: 'absolute', top: Platform.OS === 'ios' ? 20 : 0, width: SWidth, textAlign: 'center', padding: 5}}>{this.state.socketMessage}</Text> : null}
            </View>
        );

    }
    public componentWillUnmount() {
        // 当根容器被从视图移除时,移除安卓物理返回键的监听
        BackHandler.removeEventListener('hardwareBackPress', null);
        // ws.close();
        this.isAuthentication.remove();
    }

    private initWebSocket = async () => {
        const data = await postAppJSON('mstore/sg/registMessageToken.html', null, Config.SERVER_DATA);
        if (data.success) {
            const token = data.data;
            const routingKey = token;
            const client = Stomp.over(ws);
            const onConnect = () => {
            const queueName = 'stomp-subscription-' + uuid();
            const subscribe = client.subscribe(
                '/exchange/message_topic_exchange/' + routingKey,
                (d) => {
                    console.log('recv:' + d.body);
                // mqCallback(JSON.parse(d.body));
                },
                {'x-queue-name': queueName},
            );
            // 群推消息
            // console.log("订阅群发消息...");
            client.subscribe(
                '/exchange/message_fanout_exchange',
                (d) => {
                 console.log('recv:' + d.body);
                    // mqCallback(JSON.parse(d.body));
                },
                {'x-queue-name': queueName},
            );
            };
            const onError = () => {
                console.log('failed!');
            };
            const username = 'task';
            const password = 'task';
            client.connect(username, password, onConnect, onError, '/');
          } else {
            // console.error("获得MessageToken失败:" + JSON.stringify(data));
            // me.destroyWebSocket();
          }
    }

    // private uuid = () => {
    //     const s = [];
    //     const hexDigits = '0123456789abcdef';
    //     for (let i = 0; i < 36; i++) {
    //       s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    //     }
    //     s[14] = '4';  // bits 12-15 of the time_hi_and_version field to 0010
    //     s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    //     s[8] = s[13] = s[18] = s[23] = '-';
    //     const uuid = s.join('');
    //     return uuid;
    //   }
}
function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
    }
// const ws = new WebSocket(Config.SERVER_MQ_WEBSOCKET);
// const mapStateToProps = ({ mainReducer: { showAdType, doLoading, isTrueAuthentication } }) => {
//     return { showAdType, doLoading, isTrueAuthentication };
// };
const mapStateToProps = ({ mainReducer: { doLoading, isTrueAuthentication }, ADModel: {showAdType} }) => {
    return { showAdType, doLoading, isTrueAuthentication };
};
export default connect(
  mapStateToProps,
)(RootContainer);
