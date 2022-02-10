/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    View,
    Dimensions,
    PixelRatio,
    NativeModules,
    DeviceInfo,
    Platform
} from 'react-native';

const { isIPhoneX_deprecated } = DeviceInfo;
const X_WIDTH = 375;
const X_HEIGHT = 812;
const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get('window');

const { PlatformConstants = {} } = NativeModules;
const { minor = 0 } = PlatformConstants.reactNativeVersion || {};

export const isIPhoneX = (() => {
    if (minor >= 50) {
        return isIPhoneX_deprecated;
    }
    return (
        Platform.OS === 'ios' &&
        ((D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
            (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT))
    );
})();


export default class CSafeView extends Component {

    static defaultProps = {
        bottomColor: '#fff',
        showBottom: false,
    };  // 注意这里有分号

    render() {
        return (
            <View style={[{flex: 1, borderBottomWidth: this.props.showBottom ? (isIPhoneX ? 34 : 0): 0, borderBottomColor: this.props.bottomColor}, this.props.top && {marginTop: isIPhoneX ? 44: 20}]} {...this.props}>{this.props.children}</View>
        );
    }
}


