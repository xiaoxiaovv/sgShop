import { Text, WebView } from 'react-native';
import DeviceInfo from "react-native-device-info";

export const init = () => {
  // 关闭应用中字体适应系统字体变化的效果
  Text.defaultProps = { ...Text.defaultProps, allowFontScaling: false };
  WebView.defaultProps = { ...WebView.defaultProps, userAgent: `${DeviceInfo.getUserAgent()}ShunGuangRN`, dataDetectorTypes: ['none'], mixedContentMode: 'always'};
};