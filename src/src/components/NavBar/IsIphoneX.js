

'use strict';

import React, {Component} from 'react';
import {
    Dimensions,
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
const isIPhoneX = (() => {
    if (minor >= 50) {
        return isIPhoneX_deprecated;
    }
    return (
        Platform.OS === 'ios' &&
        ((D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
            (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT))
    );
})();

export default isIPhoneX;