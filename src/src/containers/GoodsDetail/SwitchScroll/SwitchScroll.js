/*
 * @Author: Aevit
 * @Desc:
 * @Date: 2017-09-19 10:41:24
 * @Last Modified by: Aevit
 * @Last Modified time: 2017-09-21 16:15:36
 */
'use strict'
/**
 * switchScroll.js
 *
 * @des scrollview 及 webview 上下切换
 * @author Aevit
 * Created at 2017/09/19
 * Copyright 2011-2017 touna.cn, Inc.
 */
'use strict'
import {
  Text,
  View,
  Animated,
  ScrollView,
  Platform,
  StatusBar,
  DeviceEventEmitter,TouchableOpacity,
  WebView, BackHandler
} from 'react-native'
import React from 'react'
import StyleSheet from 'react-native-extended-stylesheet';
import {Tabs, Toast} from 'antd-mobile';

import Details from "../Detail/Details";
import DetailsWeb from "../Detail/DetailsWeb";
import Specifications from "../Detail/Specifications";

import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
import ScrollableTabView from 'react-native-scrollable-tab-view';
const ONEPARTHT = height - (Platform.OS === 'android' ? 56 + StatusBar.currentHeight : 64);

class switchScroll extends React.Component {
  static propTypes = {}

  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {
        show: false,
      moveValue: new Animated.Value(0)
    }
  }

  // ----- life cycle
  componentWillMount() {
  }

  componentDidMount() {

  }

    shouldComponentUpdate(nextProps, nextState) {
        return true
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.onPause != this.props.onPause) {
            this.stopVideo();
        }
    }

    componentWillUpdate() {
    }

    componentDidUpdate() {
    }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }


    _onBack=()=>{
        console.log('_onBack');
      this.props.onReachTop&&this.props.onReachTop(true);
      return true
    }

    stopVideo = ()=>{
        this.setState({onPause: false}, ()=>{
            this.setState({onPause: true})
        })
    };

    // ----- public methods

  _renderWebView() {
    const tabsCanshu = [
      {title: '商品介绍', sub: '1'},
      {title: '产品参数', sub: '2'},
    ];

    return(
        this.state.show ? <ScrollableTabView
        initialPage={0}
        onChangeTab={(item)=>{
        }}
        locked={true}
        tabBarUnderlineStyle={{height: 2, backgroundColor: '#2979FF'}}
        tabBarActiveTextColor={'#2979FF'}
        tabBarTextStyle={{fontSize: 16}}
        tabBarInactiveTextColor={'#666666'}
        >
        {Platform.OS === 'ios' ? <DetailsWeb tabLabel='商品介绍'
                                             onReachTop={() => {
                                                 this._onBack();
                                             }}
                                             onPause={this.state.onPause}
                                             productId={this.props.productId}/>:<Details tabLabel='商品介绍'
                                                                                            onReachTop={() => {
                                                                                                this._onBack();
                                                                                            }}
                                                                                            onPause={this.state.onPause}
                                                                                            productId={this.props.productId}/>}

        <Specifications tabLabel='产品参数'
                        productId={this.props.productId}/>
    </ScrollableTabView>:<View/>);
  }

  scrollViewToTop = (toTop) => {
    const onePartHeight = this.props.height || ONEPARTHT;
    Animated.timing(this.state.moveValue, {
      toValue: toTop ? 0 : - onePartHeight
    }).start();
    this.props.contentToTop(toTop);

    console.log('--------商品 false 显示商品详情 true 隐藏商品详情-------------', toTop);
    if (toTop) {
      this.timer = setTimeout(() => {
        this.scrollView.scrollTo({x: 0, y: 0, animated: true});
      }, 50);

      if (Platform.OS === 'android') {
        BackHandler.removeEventListener('backPress', this._onBack);
      }
    } else {
      if(!this.state.show){
          console.log('----false----商品开始显示-------------');
          this.setState({show: true});
      }
      if (Platform.OS === 'android') {
        BackHandler.addEventListener('backPress', this._onBack);
      }
    }
  }

  // ----- components
  render() {
    const onePartHeight = this.props.height || ONEPARTHT;
    return (
      <Animated.View style={{height: onePartHeight * 2, transform: [{translateY: this.state.moveValue}]}}>
        <ScrollView
          ref={ref => this.scrollView = ref}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          style={[styles.scrol, {maxHeight: onePartHeight}]}
          onScrollEndDrag={(e) => {
            const contentSizeH = e.nativeEvent.contentSize.height
            const offsetY = e.nativeEvent.contentOffset.y
            console.log('offsetY - (contentSizeH - onePartHeight)', offsetY - (contentSizeH - onePartHeight))
            if (offsetY - (contentSizeH - onePartHeight) >= (Platform.OS === 'ios' ? 60 : -1)) {
              this.scrollViewToTop(false);
            }
          }}
        >
          <View style={[styles.scrollContentBox, {minHeight: onePartHeight}]}>
            {this.props.renderContain()}
          </View>
          <TouchableOpacity
            onPress={()=>{
              this.scrollViewToTop(false);
            }}
            style={styles.loadMore}>
            <Text style={styles.loadMoreText}>继续拖动或点击查看图文详情</Text>
          </TouchableOpacity>
        </ScrollView>
        {
          Platform.OS === 'android' && Platform.Version < 21 // 21 为 5.0 系统
            ? <ScrollView
              style={{maxHeight: onePartHeight}}
              onScrollEndDrag={(e) => {
                const offsetY = e.nativeEvent.contentOffset.y
                if (offsetY <= 0) {
                  this.scrollViewToTop(true);
                }
              }}>
              {this._renderWebView(false)}
            </ScrollView>
            : this._renderWebView(true)
        }
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  scrollContentBox: {
    width: width,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scrol: {
    backgroundColor: '$lightgray',
  },
  loadMore: {
    width,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadMoreText: {
    color: '$black',
    fontSize: '$fontSize3',
  }
})

export default switchScroll
