import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import EStyleSheet from 'react-native-extended-stylesheet';
import {NavigationScreenProp} from 'react-navigation';
import { iPhoneXPaddingTopStyle, getPrevRouteName} from '../../utils';
import { NavigationActions } from 'react-navigation';

interface ILoginHeader {
  loginText: string;
  navigation: NavigationScreenProp;
  nextRoute: () => void; // 右上角按钮点击时将要跳转到的页面
}

export default class LoginHeader extends Component<ILoginHeader> {
  public render() {
    const prevRoute = getPrevRouteName();
    return (
    <LinearGradient
      colors={['#2979FF', '#295BFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}>
      <View style={[styles.topContainer, iPhoneXPaddingTopStyle]}>
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={() =>{
              if (prevRoute === 'TelChangeSuccess'){
                const resetAction = NavigationActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: 'RootTabs' })],
                });
                this.props.navigation.dispatch(resetAction);
              }else{
                this.props.navigation.goBack()
              }
          }}>
            <Image style={{ width: 24, height: 24 }}
              source={require('../../images/ic_back_white.png')}></Image>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.nextRoute()}>
            <Text style={{ color: '#ffffff', fontSize: 16 }}>{this.props.loginText}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Image style={{ width: 56, height: 56 }}
            source={require('../../images/sg_logo_white.png')}></Image>
          <Text style={{ color: '#ffffff', marginLeft: 15 }}>海尔官方社群交互平台</Text>
        </View>
      </View>
    </LinearGradient>
  );
}
}
const styles = EStyleSheet.create({
  topContainer: {
    height: 180,
    paddingTop: 20,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop:16
  },
  topHeader: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
