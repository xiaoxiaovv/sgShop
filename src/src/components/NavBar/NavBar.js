'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    StatusBar,
    Dimensions,
    Platform,
} from 'react-native';

import IsIphoneX from './IsIphoneX';
import PropTypes from 'prop-types';
import back_gray from '../../images/icon_back_gray.png';
import back_white from './img/icon_back_white.png';
import share_gray from './img/icon_share_gray.png';
import share_white from './img/icon_share_white.png';

const { height, width } = Dimensions.get('window');
let D_HEIGHT, D_WIDTH;
if(height > width){
    D_WIDTH = width;
    D_HEIGHT = height;
}else{
    D_WIDTH = height;
    D_HEIGHT = width;
}
import {NavigationActions} from "./../../dva/utils";

import {connect} from 'react-redux';

const NOTNIL = (value) => {
    if (value !== undefined && value !== null && value !== '') {
        // 非空
        return true;
    } else {
        // 空
        return false;
    }
};

// 全空的 Bar 提供高度自定义
@connect()
export default class NavBar extends Component {

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
          this.defaultBack = this.defaultBack.bind(this);
          this.leftFun = this.leftFun.bind(this);
      }

    static defaultProps = {
        isTransparent: false, // 安卓状态栏 半透明
        defaultBack: true, // 默认返回
        statusBarStyle: "dark-content",
        statusBgColor: "#fff",
        navBgColor: '#fff',
        sipColor: '#eee',
        title: 'title',
    };
    static propTypes = {
        isTransparent: PropTypes.bool,
        defaultBack: PropTypes.bool,
        isSip: PropTypes.bool,
        statusBarStyle: PropTypes.string,
        headerStyle: PropTypes.object,  // 头部 view style
        navBgColor: PropTypes.string,
        statusBgColor: PropTypes.string,
        sipColor: PropTypes.string,
        title: PropTypes.string,
        titleColor: PropTypes.string,
        titleSize: PropTypes.number,
        centerView: PropTypes.element,

        leftFun: PropTypes.func,
        leftTitle: PropTypes.string,
        leftTitleColor: PropTypes.string,
        leftTitleSize: PropTypes.number,
        leftIcon: PropTypes.object, // 图片对象 {uri: ""} 或者是 require()
        leftIconStyle: PropTypes.object,  // 图片样式对象
        leftView: PropTypes.element,  // 左边区域自定义组件

        rightFun: PropTypes.func,
        rightTitle: PropTypes.string,
        rightTitleColor: PropTypes.string,
        rightTitleSize: PropTypes.number,
        rightIcon: PropTypes.object, // 图片对象 {uri: ""} 或者是 require()
        rightIconStyle: PropTypes.object, // 图片样式对象
        rightView: PropTypes.element, // 右边区域自定义组件
    };
    leftFun = ()=>{
            if(this.props.defaultBack){
                this.defaultBack();
            }else{
                this.props.leftFun();
            }
    };

    defaultBack = ()=>{
        this.props.dispatch(NavigationActions.back());
    };
    render() {
        return (
            <View style={[
                {
                    height: IsIphoneX ? 88 : Platform.OS === 'ios' ? 64:44 ,
                    backgroundColor: this.props.isTransparent ? 'transparent' : this.props.navBgColor,
                    borderBottomColor: this.props.sipColor,
                    borderBottomWidth: this.props.isTransparent ? 0 : StyleSheet.hairlineWidth
                }, this.props.headerStyle]}>
                {/***** Title 标题 区域 *****/}
                {this.props.centerView && <View style={[styles.centerView]}>{this.props.centerView}</View>}
                {!this.props.centerView && NOTNIL(this.props.title) && <View style={[styles.titleView]}>
                    <Text style={[
                        styles.title,
                        {color: this.props.isTransparent ? '#FFF' : "#000"},
                        this.props.titleColor ? {color: this.props.titleColor} : null,
                        this.props.titleSize ? {fontSize: this.props.titleSize} : null,
                    ]}
                          allowFontScaling={false} numberOfLines={1}>{this.props.title}</Text>
                </View>}

                {/***** left 左边区域 *****/}
                {!this.props.leftView && this.props.leftFun && NOTNIL(this.props.leftTitle) && !this.props.defaultBack ? <TouchableOpacity onPress={this.props.leftFun}
                                      style={[styles.leftTitleView]}>
                        <Text allowFontScaling={false}
                              style={[
                                  styles.leftTitle,
                                  {color: this.props.isTransparent ? '#FFF' : '#333'},
                                  this.props.leftTitleColor ? {color: this.props.leftTitleColor} : null,
                                  this.props.leftTitleSize ? {fontSize: this.props.leftTitleSize} : null,
                              ]}
                              numberOfLines={1}>{this.props.leftTitle}</Text>
                    </TouchableOpacity>:null}
                {!this.props.leftView && this.props.leftFun && !this.props.leftTitle && !this.props.defaultBack && <TouchableOpacity style={[styles.leftIconView]}
                                                                                                          onPress={this.props.leftFun}>
                        <Image source={this.props.leftIcon ? this.props.leftIcon: this.props.isTransparent ? back_white:back_gray}
                               style={[styles.icon, this.props.leftIconStyle]}/>
                    </TouchableOpacity>}

                    {this.props.defaultBack && <TouchableOpacity style={[styles.leftIconView]}
                                                                 onPress={this.defaultBack}>
                        <Image source={this.props.leftIcon ? this.props.leftIcon: this.props.isTransparent ? back_white:back_gray}
                               style={[styles.icon, this.props.leftIconStyle]}/>
                    </TouchableOpacity>}
                {this.props.leftView && <View style={[styles.leftView]}>{this.props.leftView}</View>}

                {/***** right 右边区域 *****/}
                {!this.props.rightView && this.props.rightFun && NOTNIL(this.props.rightTitle) ? <TouchableOpacity onPress={this.props.rightFun}
                                      style={[styles.rightTitleView, ]}>
                        <Text style={[
                            styles.rightTitle,
                            {
                            color: this.props.isTransparent ? '#FFFFFF' : '#333333',
                        },
                            this.props.rightTitleColor ? {color: this.props.rightTitleColor} : null,
                            this.props.rightTitleSize ? {fontSize: this.props.rightTitleSize} : null,
                        ]}
                              allowFontScaling={false}
                              numberOfLines={1}>{this.props.rightTitle}</Text>
                    </TouchableOpacity>:null}
                {!this.props.rightView && this.props.rightFun && !this.props.rightTitle && <TouchableOpacity onPress={this.props.rightFun}
                                      style={[styles.rightIconView]}>
                        <Image source={this.props.rightIcon ? this.props.rightIcon: this.props.isTransparent ? share_white:share_gray} style={[styles.icon, this.props.rightIconStyle]}/>
                    </TouchableOpacity>}

                {this.props.rightView && <View style={[styles.rightView]}>{this.props.rightView}</View>}

                {/*<StatusBar
                    // translucent={this.props.isTransparent}
                    translucent={false}
                    backgroundColor={this.props.statusBgColor}
                    barStyle={this.props.statusBarStyle}/>*/}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 17,
        fontWeight: 'bold',
        backgroundColor: 'transparent',
        maxWidth: 0.6 * D_WIDTH
    },
    titleView: {
        height: 44,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    centerView: {
        height: 44,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {height: 25, width: 25},

    leftTitleView: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 44,
        minWidth: 57,
        justifyContent: 'center'
    },
    leftTitle: {
        fontSize: 16,
        marginLeft: 16,
        maxWidth: 0.25 * D_WIDTH,
        backgroundColor: 'transparent',
    },
    leftIconView: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 44,
        width: 57,
        justifyContent: 'center',
        alignItems: 'center'
    },
    leftView: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 44,
        maxWidth: 0.25 * D_WIDTH,
        justifyContent: 'center',
    },

    rightTitleView: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        height: 44,
        minWidth: 57,
        justifyContent: 'center'
    },
    rightTitle: {
        fontSize: 16,
        marginRight: 16,
        maxWidth: 0.25 * D_WIDTH,
        backgroundColor: 'transparent'
    },
    rightIconView: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        height: 44,
        width: 57,
        justifyContent: 'center',
        alignItems: 'center'
    },
    rightView: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        height: 44,
        maxWidth: 0.25 * D_WIDTH,
        justifyContent: 'center',
    },
});
