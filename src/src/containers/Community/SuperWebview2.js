import React from 'react';
import {requireNativeComponent,View,StatusBar, Keyboard,Platform, Text, NativeAppEventEmitter, DeviceEventEmitter, NativeModules} from 'react-native';
import PropTypes from 'prop-types';

import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
var iface = {
    name: 'SuperWebview2',
    propTypes:{
        url2:PropTypes.string,
        ...View.propTypes,
    }
}

var RCTSuperWebview = requireNativeComponent('SuperWebview2', iface);
class SuperWebview2 extends React.Component {
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            superWebViewWidth: width,
            superWebViewHeight: height- StatusBar.currentHeight,
        };
    }
    
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    componentDidMount() {
        const emitter = Platform.OS === 'ios' ? NativeAppEventEmitter : DeviceEventEmitter;
        this.subscriptionNaviteCallRNMethod = emitter.addListener(
            'NaviteCallRNMethod',
            (pageInfo) =>  this.NaviteCallRNMethod(pageInfo),
          );
    }

     componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }
     _keyboardDidShow(e) {
        this.setState({
            superWebViewHeight: height - e.endCoordinates.height-StatusBar.currentHeight,
        });
    }
     _keyboardDidHide(e) {
        this.setState({
            superWebViewHeight: height -StatusBar.currentHeight,
        });
    }
  render() {
      return <RCTSuperWebview {...this.props} style={{width: this.state.superWebViewWidth, height: this.state.superWebViewHeight}}/>
  }

  // 原生调用-->RN的方法
  NaviteCallRNMethod = async (pageInfo) => {
    if  (pageInfo.type === 10) {
        // 横竖屏
        if (pageInfo.command[0] === '1') {
            // 竖屏
            this.setState({
                superWebViewWidth: width,
                superWebViewHeight: height-StatusBar.currentHeight,
            });
        } else {
                // 只允许横屏
                this.setState({
                    superWebViewWidth: height,
                    superWebViewHeight: width,
                });
        }
    }
 }
}
module.exports = SuperWebview2;