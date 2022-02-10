import { 
    View,
    Text,
    StyleSheet,
} from 'react-native';
import React, { Component } from 'react';
import { TabNavigator } from 'react-navigation';

import All from './All';
import Source from './Source';
import Used from './Used';


const WorkTab = TabNavigator({
     All: {
        screen: All,
        navigationOptions: {
          tabBarLabel: '全部',
        }
    },
    Source: {
        screen: Source,
        navigationOptions: {
          tabBarLabel: '来源',
        }
    },
    Used: {
        screen: Used,
        navigationOptions: {
          tabBarLabel: '使用',
        }
    },
}, {
    ...TabNavigator.Presets.AndroidTopTabs,
    animationEnabled: false, // 切换页面时不显示动画
    tabBarPosition: 'top', // 显示在底端，android 默认是显示在页面顶端的
    swipeEnabled: false, // 禁止左右滑动
    backBehavior: 'none', // 按 back 键是否跳转到第一个 Tab， none 为不跳转
    tabBarOptions: {
        activeTintColor: '#0099ff', // 文字和图片选中颜色
        inactiveTintColor: '#b2b9be', // 文字和图片默认颜色
        showIcon: false, // android 默认不显示 icon, 需要设置为 true 才会显示,
        indicatorStyle: {
          backgroundColor:'#0099ff',
          width:80,
          height:1,
          alignItems:'center',
          alignSelf: 'center',
          justifyContent:'center',
          marginLeft:25,
        }, // android 中TabBar下面会显示一条线，高度设为 0 后就不显示线了
        style: {
            backgroundColor: '#fff', // TabBar 背景色
            height:40,
            borderColor:'#e6e6e6',
            borderBottomWidth:1,
        },
        labelStyle: {
            fontSize: 16, // 文字大小
            marginTop:2,
        },
    },
    // navigationOptions:({ navigation, screenProps }) =>({
    //   headerTitle:'客户',
    //   headerRight:(
    //       <Text style={{color:'#fff',fontSize:16,paddingRight:10}} onPress={()=>navigation.navigate('login')}>
    //           创建
    //       </Text>
    //   ),
    //   headerLeft:(<View/>)
    // }),
});

export default class Coin extends React.Component {
  render(){
    return (
      <View style={styles.wrap}>
          <WorkTab />
      </View>
    );
  }
};
const styles = StyleSheet.create({
  wrap:{
    flex:1
  }
});
