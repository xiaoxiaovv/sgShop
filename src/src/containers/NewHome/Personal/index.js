

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    ImageBackground,
    Dimensions,
    View, ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';

import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';

import CustomWebView from '../../webview/CustomWebView'
import Config from 'react-native-config';



export default class ZCDZ extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            showRefreshBtn: false,
        };
      }

    componentDidMount() {
        console.log('-------componentDidMount----创众定制-----')
    }
    render() {
            if (this.state.showRefreshBtn){
                return (
                        <View style={[styles.container, {justifyContent: 'center',alignItems: 'center',}]}>
                            <TouchableOpacity style={styles.refreshBtn} activeOpacity={0.7}
                                onPress={() => {
                                    this.setState({
                                        showRefreshBtn: false,
                                    });
                                }}>
                                <Text style={{fontSize: 17, color: 'white'}}>刷新</Text>
                            </TouchableOpacity>
                        </View>
                    );
            } else {
                // if (this.props.isLogin){
                    const flag= dvaStore.getState().users.userToken.substring(6);
                    return (
                        <View style={[styles.container ]}>
                            <CustomWebView
                                navigation={this.props.navigation}
                                customurl={`http://m.ehaier.com/v3/sgcommunity/diy/login/request.ajax?flag=${flag}`}
                                flag={true}
                                headerTitle={'智家众创定制'}
                                hiddenHeader={true}
                                refreshCallBack={() => {
                                    this.setState({
                                        showRefreshBtn: true,
                                    });
                                }}
                                />
                        </View>
                    );
                // } else {
                //     this.props.navigation.navigate('Login');
                //     // 未登录
                //     return (
                //         <View style={[styles.noLogin]}>
                //               <TouchableOpacity style={styles.goToLoginBtn} activeOpacity={0.7} onPress={() => this.props.navigation.navigate('Login')}>
                //                     <Text style={{fontSize: 17, color: 'white'}}>去登录</Text>
                //                 </TouchableOpacity>
                //         </View>
                //     )
                // }
        }
    }
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    noLogin: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    goToLoginBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '44rem',
        width: '90%',
        backgroundColor: '#2979FF',
        borderRadius: 10,
    },
    refreshBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '44rem',
        width: '90%',
        backgroundColor: '#2979FF',
        borderRadius: 10,
    },
});
