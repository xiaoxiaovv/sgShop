import * as React from 'react';
import { View, StyleSheet, Text, Platform, Image } from 'react-native';
import Button from 'rn-custom-btn1';

import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;

const isiPhoneX =  (width === 375 && height === 812 && Platform.OS === 'ios');
interface ICustomNaviBarProps {
  navigation: { goBack?: () => {} };
  style?: any;
  containerStyle?: any;
  hiddenLeftBtn?: boolean;
  leftView?: JSX.Element;
  leftViewStyle?: any;
  leftViewImage?: any;
  leftAction?: () => void;
  titleView?: JSX.Element;
  title?: string;
  rightView?: JSX.Element;
  rightImage?: any;
  rightTitle?: string;
  rightAction?: () => void;
  local?: { titleStyle?: object, leftStyle?: object, rightStyle?: object };
  showBottomLine?: boolean;
  bottomLineStyle?: any;
}

const CustomNaviBar: React.SFC<ICustomNaviBarProps> = ({
  navigation,
  style,
  containerStyle,
  hiddenLeftBtn,
  leftView,
  leftViewStyle,
  leftViewImage,
  leftAction,
  titleView,
  title,
  rightView,
  rightImage,
  rightTitle,
  rightAction,
  local,
  showBottomLine,
  bottomLineStyle,
}) => {
  return (
    <View style={[{ backgroundColor: 'white' }, style]}>
    {/* 已适配iPhone X */}
      {Platform.OS === 'ios' && <View style={{ height: isiPhoneX ? 40 : 20}} />}
      <View style={[styles.container, containerStyle]}>
        {leftView || <Button
          image={leftViewImage || require('../../images/icon_back_gray.png')}
          local={{ imageWidth: 24, ...local.leftStyle }}
          style={[{ position: 'absolute', left: 0, bottom: 0, top: 0, paddingLeft: 12 }, leftViewStyle]}
          onPress={() => leftAction ? leftAction() : navigation.goBack()}
        />}
        {titleView || <Text style={[styles.titleStyle, local.titleStyle]}>{title}</Text>}
        <View style={{ position: 'absolute', right: 0, bottom: 0, top: 0, alignItems: 'center'}}>
          {rightView ||
            <Button 
            image={rightImage}
            title={rightTitle}
            onPress={rightAction}
            local={{ imageWidth: 24}}
            style={{ paddingRight: 12 }}
            />
          }
        </View>
      </View>
      {showBottomLine && <View style={[styles.bottomLine, bottomLineStyle]} />}
    </View>
  );
};

CustomNaviBar.defaultProps = {
  local: { titleStyle: {}, leftStyle: {}, rightStyle: {} },
  showBottomLine: false,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    width,
    backgroundColor: 'white',
  },
  titleStyle: {
    color: '#333333',
    alignSelf: 'center',
    fontSize: 17,
    letterSpacing: -0.41,
  },
  bottomLine: {
    width,
    height: 1,
    backgroundColor: '#d5d5d5',
  },
});

export default CustomNaviBar;
