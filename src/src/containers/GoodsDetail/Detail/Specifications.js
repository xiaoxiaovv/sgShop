/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
  Platform, RefreshControl,
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  View, ScrollView,
  TouchableOpacity,
  DeviceEventEmitter, TouchableWithoutFeedback,
} from 'react-native';

import {GET,} from './../../../config/Http.js';
import URL from './../../../config/url.js';
import noData from './../../../images/ic_haier_6.png';

let width = URL.width;
let height = URL.height;
const Sip = StyleSheet.hairlineWidth;

import L from "lodash";

export default class Specifications extends Component {
  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      productAttrs: [],
    };
  }

  componentWillMount() {
    let id = L.get(this.props, 'productId', false);
    // let id = L.get(this.props, 'productId', 21669);
    // let id = L.get(this.props, 'productId', 14725);
    if (id) {
      GET(URL.GET_SPECIFICATIONS, {productId: id}).then(res => {
        if (res.success) {
          let data = res.data;
          console.log(data);
          this.setState({productAttrs: data.productAttrs});
        }
      }).catch(err => {
        console.log(err)
      });
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <View style={[styles.container]}>
      <ScrollView
        refreshControl={<RefreshControl
          onRefresh={() => {
            this.props.onReachTop && this.props.onReachTop();
          }}
          refreshing={false}
          title={'松手返回'}
          tintColor={'transparent'}
          titleColor={'transparent'}
          colors={['transparent']}
          progressBackgroundColor={"transparent"}/>}
        style={[styles.container]}>

        {!this.state.productAttrs.length > 0 && <View style={[{marginTop: 40, width,}, styles.allCenter]}>
          <Image style={{height: 130, width: 200}} source={noData} resizeMode={'contain'}/>
          <Text style={{marginTop: 20, fontSize: 16}}>还没有相关规格参数</Text>
        </View>}
        {this.state.productAttrs.map((item, index) => {
          return <View
            style={[{borderBottomColor: '#eee', borderBottomWidth: 1, minHeight: 40}, styles.row, styles.aCenter]}>
            <View style={{flex: 1}}>
              <Text style={{marginLeft: 10, fontSize: 12}}>{item.attrName}</Text>
            </View>
            <View style={[{flex: 1, minHeight: 40, borderLeftColor: '#eee', borderLeftWidth: 1,}, styles.jCenter]}>
              <Text style={{marginLeft: 10, fontSize: 12, lineHeight: 16}}>{item.attrValue}</Text>
            </View>
          </View>
        })}

      </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  allCenter: {
    justifyContent: 'center', alignItems: 'center'
  },
  jCenter: {
    justifyContent: 'center'
  },
  aCenter: {
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row'
  },
  banner: {
    width: width, height: 0.48 * width
  }
});
