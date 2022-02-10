import React from 'react';
import { requireNativeComponent, NativeAppEventEmitter, DeviceEventEmitter, Platform} from 'react-native';

import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;

var RCTSuper = requireNativeComponent('RCTSuper', SuperView);

class SuperView extends React.Component {
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            superWebViewWidth: width,
            superWebViewHeight: height,
        };
    }
    componentDidMount() {
        const emitter = Platform.OS === 'ios' ? NativeAppEventEmitter : DeviceEventEmitter;
        this.subscriptionNaviteCallRNMethod = emitter.addListener(
            'NaviteCallRNMethod',
            (pageInfo) =>  this.NaviteCallRNMethod(pageInfo),
          );
    }
    componentWillUnmount() {
        this.subscriptionNaviteCallRNMethod.remove();
    }
    render() {
        return <RCTSuper {...this.props} style={{width: this.state.superWebViewWidth, height: this.state.superWebViewHeight}}/>
    }
    // 原生调用-->RN的方法
     NaviteCallRNMethod = async (pageInfo) => {
        if  (pageInfo.type === 10) {
            // 横竖屏
            if (pageInfo.command[0] === '1') {
                // 竖屏
                this.setState({
                    superWebViewWidth: width,
                    superWebViewHeight: height,
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

module.exports = SuperView;