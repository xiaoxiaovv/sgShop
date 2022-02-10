

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
} from 'react-native';

import { connect } from 'react-redux';
import CustomWebView from '../../webview/CustomWebView'
import URL from '../../../config/url';

@connect()
export default class BHCS extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            showRefreshBtn: false,
        };
      }
    componentDidMount() {
        console.log('-------componentDidMount----百货超市-----')
    }
    render() {
        const { params } = this.props.navigation.state;

        if (this.state.showRefreshBtn){
            return (
                    <View style={[styles.container, {justifyContent: 'center',alignItems: 'center',}]}>
                        <TouchableOpacity style={styles.refreshBtn} activeOpacity={0.7} 
                            onPress={() => {
                                // webView加载失败
                                this.setState({
                                    showRefreshBtn: false,
                                });
                            }}>
                            <Text style={{fontSize: 17, color: 'white'}}>刷新</Text>
                        </TouchableOpacity>
                    </View>
                );
        } else {
            return (
                <View style={styles.container}>
                    <CustomWebView
                    navigation={this.props.navigation}
                    customurl={`${URL.H5_HOST}NewsuperMarket`}
                    flag={true} 
                    headerTitle={'智家百货超市'}
                    hiddenHeader={true}
                    refreshCallBack={() => {
                        this.setState({
                            showRefreshBtn: true,
                        });
                    }}
                    />
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    refreshBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 44,
        width: '90%',
        backgroundColor: '#2979FF',
        borderRadius: 10,
    },
});
