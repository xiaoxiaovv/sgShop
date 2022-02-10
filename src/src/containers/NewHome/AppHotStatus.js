/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    ImageBackground,
    View, ScrollView,
    TouchableOpacity,
} from 'react-native';

import {connect} from 'react-redux';
import Config from './../../config';
const Sip = StyleSheet.hairlineWidth;
import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
const PAGE_SIZE = 10;

import CodePush from "react-native-code-push";
import DeviceInfo from "react-native-device-info";

import more from './../../images/arrow_right_w.png';
import { NavBar, SafeView } from './../../components';
import L from "lodash";

@connect(({ctjjModel}) => ({...ctjjModel}))
export default class AppHotStatus extends Component {
    infoToString = (info)=> {

        if(!info){
            return "";
        }

        /*

        appVersion: string;

        deploymentKey: string;

        description: string;


        // Indicates whether this update has been previously installed but was rolled back.

        failedInstall: boolean;

        label: string;

        packageHash: string;

        packageSize: number;

        */

        let {appVersion = "", label = "", description = ""} = info;

        return `ver:${appVersion},${label},${description}`;

    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            noUpdate: true,
            appVersion: 'appVersion',
            deploymentKey: 'deploymentKey',
            description: '更新描述',
            label: 'label',
            packageHash: 'packageHash',
            packageSize: 0,
            failedInstall: false,

            appName: '应用名称',
            bundleId: 'bundleId',
            buildNumber: 'buildNumber',
            systemName: 'systemName',
            systemVersion: 'systemVersion',
            version: 'version',


        };

    }

    componentDidMount() {
        const appName = DeviceInfo.getApplicationName(); // "Learnium Mobile"
        const bundleId = DeviceInfo.getBundleId(); // "com.learnium.mobile"
        const buildNumber = DeviceInfo.getBuildNumber();
        const systemName = DeviceInfo.getSystemName();
        const systemVersion = DeviceInfo.getSystemVersion();
        const version = DeviceInfo.getVersion();

        console.log(appName, bundleId, buildNumber, systemName, systemVersion, version);
        this.setState({appName, bundleId, buildNumber, systemName, systemVersion, version});
        CodePush.getUpdateMetadata(CodePush.UpdateState.RUNNING).then((update) => {
            console.log('-------CodePush.getUpdateMetadata--------');
            console.log(update);
            if (update) {
                let {
                    appVersion = "appVersion",
                    deploymentKey = "deploymentKey",
                    packageSize = "0",
                    packageHash = "packageHash",
                    label = "label",
                    description = "更新描述",
                    failedInstall = false
                } = update;
                this.setState({appVersion, deploymentKey, packageSize, packageHash, label, description, failedInstall, noUpdate: false});
            }
        });
    }

    render() {
        return (
            <View style={[styles.container]}>
                <NavBar title={'App 更新版本信息'} />
                <ScrollView>
                    <View style={[styles.allCenter, {height: 44, width: SWidth, backgroundColor: '#fff', marginTop: 5}]}>
                        <Text style={{fontSize: 16, color: '#222'}}>App 当前在 <Text style={{color: '#FF0000'}}>{Config.SET_ENV == "APP"?"正式线上":"测试"}</Text> 环境</Text>
                    </View>
                    <View style={[styles.allCenter, {height: 44, width: SWidth, backgroundColor: '#fff', marginTop: 5}]}>
                        <Text style={{fontSize: 16, color: '#222'}}>App 原生信息</Text>
                    </View>
                    <View style={[{height: 35, width: SWidth, backgroundColor: '#fff', marginTop: 1, justifyContent: 'space-between'}, styles.row, styles.aCenter]}>
                        <Text style={{fontSize: 16, marginLeft: 10, color: '#666'}}>App 名称</Text>
                        <Text style={{fontSize: 16, marginRight: 15, color: '#111'}}>{this.state.appName}</Text>
                    </View>
                    <View style={[{height: 35, width: SWidth, backgroundColor: '#fff', marginTop: 1, justifyContent: 'space-between'}, styles.row, styles.aCenter]}>
                        <Text style={{fontSize: 16, marginLeft: 10, color: '#666'}}>Bundle ID</Text>
                        <Text style={{fontSize: 16, marginRight: 15, color: '#111'}}>{this.state.bundleId}</Text>
                    </View>
                    <View style={[{height: 35, width: SWidth, backgroundColor: '#fff', marginTop: 1, justifyContent: 'space-between'}, styles.row, styles.aCenter]}>
                        <Text style={{fontSize: 16, marginLeft: 10, color: '#666'}}>系统及版本</Text>
                        <Text style={{fontSize: 16, marginRight: 15, color: '#111'}}>{`${this.state.systemName} ${this.state.systemVersion}`}</Text>
                    </View>
                    <View style={[{height: 35, width: SWidth, backgroundColor: '#fff', marginTop: 1, justifyContent: 'space-between'}, styles.row, styles.aCenter]}>
                        <Text style={{fontSize: 16, marginLeft: 10, color: '#666'}}>App 版本</Text>
                        <Text style={{fontSize: 16, marginRight: 15, color: '#111'}}>V{this.state.version}-Build{this.state.buildNumber}</Text>
                    </View>

                    <View style={[styles.allCenter, {height: 44, width: SWidth, backgroundColor: '#fff', marginTop: 5}]}>
                        <Text style={{fontSize: 16, color: '#222'}}>App 热更新信息</Text>
                    </View>
                    {this.state.noUpdate ? <View style={[styles.allCenter, {height: 44, width: SWidth, backgroundColor: '#fff', marginTop: 1}]}>
                        <Text style={{fontSize: 16, color: '#666'}}>App 当前暂无热更新</Text>
                    </View>:<View>
                        <View style={[{height: 35, width: SWidth, backgroundColor: '#fff', marginTop: 1, justifyContent: 'space-between'}, styles.row, styles.aCenter]}>
                            <Text style={{fontSize: 16, marginLeft: 10, color: '#666'}}>App 版本</Text>
                            <Text style={{fontSize: 16, marginRight: 15, color: '#111'}}>V{this.state.appVersion}</Text>
                        </View>
                        <View style={[{MinHeight: 35, width: SWidth, backgroundColor: '#fff', marginTop: 1, justifyContent: 'space-between'}, styles.row, styles.aCenter]}>
                            <Text style={{fontSize: 16, marginLeft: 10, color: '#666'}}>DeploymentKey</Text>
                            <View style={[styles.jCenter, {minHeight: 35, width: SWidth - 120}]}>
                                <Text style={{fontSize: 16, marginRight: 15, color: '#111', textAlign: 'right', maxWidth: SWidth - 120, marginVertical: 10}}>
                                    {this.state.deploymentKey}
                                </Text>
                            </View>
                        </View>
                        <View style={[{height: 35, width: SWidth, backgroundColor: '#fff', marginTop: 1, justifyContent: 'space-between'}, styles.row, styles.aCenter]}>
                            <Text style={{fontSize: 16, marginLeft: 10, color: '#666'}}>更新 Label</Text>
                            <Text style={{fontSize: 16, marginRight: 15, color: '#111'}}>{this.state.label}</Text>
                        </View>
                        <View style={[{MinHeight: 35, width: SWidth, backgroundColor: '#fff', marginTop: 1, justifyContent: 'space-between'}, styles.row, styles.aCenter]}>
                            <Text style={{fontSize: 16, marginLeft: 10, color: '#666'}}>PackageHash</Text>
                            <View style={[styles.jCenter, {minHeight: 35, width: SWidth - 120}]}>
                                <Text style={{fontSize: 16, marginRight: 15, color: '#111', textAlign: 'right', maxWidth: SWidth - 120, marginVertical: 10}}>
                                    {this.state.packageHash}
                                </Text>
                            </View>
                        </View>
                        <View style={[{height: 35, width: SWidth, backgroundColor: '#fff', marginTop: 1, justifyContent: 'space-between'}, styles.row, styles.aCenter]}>
                            <Text style={{fontSize: 16, marginLeft: 10, color: '#666'}}>PackageSize</Text>
                            <Text style={{fontSize: 16, marginRight: 15, color: '#111'}}>{(this.state.packageSize/1024/1024).toFixed(2)}M</Text>
                        </View>
                        <View style={[{height: 35, width: SWidth, backgroundColor: '#fff', marginTop: 1, justifyContent: 'space-between'}, styles.row, styles.aCenter]}>
                            <Text style={{fontSize: 16, marginLeft: 10, color: '#666'}}>是否更新失败</Text>
                            <Text style={{fontSize: 16, marginRight: 15, color: '#111'}}>更新{this.state.failedInstall ? "失败":"成功"}</Text>
                        </View>
                        <View style={[{MinHeight: 35, width: SWidth, backgroundColor: '#fff', marginTop: 1, justifyContent: 'space-between'}, styles.row, styles.aCenter]}>
                            <Text style={{fontSize: 16, marginLeft: 10, color: '#666'}}>更新内容描述</Text>
                            <View style={[styles.jCenter, {minHeight: 35, width: SWidth - 120}]}>
                                <Text style={{fontSize: 16, marginRight: 15, color: '#111', textAlign: 'right', maxWidth: SWidth - 120, marginVertical: 10}}>
                                    {this.state.description}
                                    </Text>
                            </View>
                        </View>
                    </View>}



                </ScrollView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
    },
    allCenter: {
        justifyContent: 'center', alignItems: 'center'
    },
    jCenter: {
        justifyContent: 'center'
    },
    aCenter: {
        alignItems: 'center'
    },
    row: {
        flexDirection: 'row'
    },
    banner: {
        width: SWidth, height: 0.533 * SWidth
    }
});
