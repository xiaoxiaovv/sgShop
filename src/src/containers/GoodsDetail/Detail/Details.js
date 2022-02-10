/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Image as Image2,
  ImageBackground,
  View, ScrollView,
  TouchableOpacity, RefreshControl,
  DeviceEventEmitter, TouchableWithoutFeedback,
} from 'react-native';

import Image from 'react-native-scalable-image';
import {connect} from 'react-redux';
import VideoPlayer from 'react-native-af-video-player';
import {GET,} from './../../../config/Http.js';
import URL from './../../../config/url.js';

let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
const Sip = StyleSheet.hairlineWidth;

import noData from './../../../images/ic_haier_6.png';

import L from "lodash";
import {NavigationUtils} from "../../../dva/utils";

@connect(() => ({}))
export default class Details extends Component {
  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      details: [],
        isVideo: false,
        onPause: true,
    };
  }

  componentWillMount() {
    let id = L.get(this.props, 'productId', false);
    // let id = L.get(this.props, 'productId', 21669);
    // let id = L.get(this.props, 'productId', 14725);
    if (id) {
      GET(URL.GET_PROMOS, {productId: id}).then(res => {
        if (res.success) {
          let data = res.data;
          let details = [];
          let video = L.get(data, 'mp4FileId2', false);
          let detail = L.get(data, 'detailImgs', false);
          if (video) {
            details.push({type: 'video', data: JSON.parse(video)});
              this.setState({isVideo: true});
            // {"img":"http://ihaier.me/video/180309/tgxjz.jpg","video":"http://ihaier.me/video/180309/tgxjz.mp4"}
          }
          if (detail) {
            //正则 A 标签
            const a_Reg2 = /<a.*?(?:>)([\s\S]*?)<\/a>/gi; //获取A标签列表
            const a_href = /href=[\'\"]?([^\'\"]*)[\'\"]?/i; //获取A标签的url
            const imgReg = /<img.*?(?:>|\/>)/gi;
            const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;

            let productArr = [];
            let iarr = [];
            if (detail.indexOf('/productDetail/') > -1) {
              // 说明有关联商品  -> 关联的商品都是 左右两张图一样大,挤压全宽
              const a_arr = detail.match(a_Reg2); //获取A标签的数组
              for (let i = 0; i < a_arr.length; i++) {
                let a_img = a_arr[i].match(imgReg); //获取a标签里面的img
                let a_img_url = a_img[0].match(srcReg); //获取图片的URL
                let href = a_arr[i].match(a_href); //获取A标签的链接
                let pid = href[1].split('/')[2]; //获取商品ID

                if (pid != undefined) {
                  iarr.push(a_img_url[1]);
                  productArr.push({'productId': pid, 'url': a_img_url[1]}); //装载数据
                }
              }
              // console.log(iarr);
              // console.log(productArr);

              const arr = detail.match(imgReg);
              let SrcArr = [];
              for (let i = 0; i < arr.length; i++) {
                let src = arr[i].match(srcReg);
                if(src){
                  SrcArr.push(src[1]);
                }
              }
              // console.log(SrcArr);
              let index = L.indexOf(SrcArr, iarr[0]);
              let narr = L.fill(SrcArr, productArr, index, index + 1);
              // console.log(narr);
              let newArr = L.pullAll(SrcArr, iarr);
              // console.log(index);
              // console.log('------说明有关联商品-------');
              // console.log(newArr);

              for (let i = 0; i < narr.length; i++) {
                let item = narr[i];
                if (typeof item === "string") {
                  details.push({
                    type: "image",
                    data: item
                  });
                } else {
                  details.push({
                    type: "product",
                    data: item
                  });
                }
              }

            } else {

              const arr = detail.match(imgReg);

              for (let i = 0; i < arr.length; i++) {
                let src = arr[i].match(srcReg);
                //获取图片地址
                if (src && src[1]) {
                  details.push({
                    type: "image",
                    data: src[1]
                  });
                }
              }
            }


          }

          this.setState({details});
        }
      }).catch(err => {
        console.log(err)
      });
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

    componentWillReceiveProps(nextProps) {
        if(nextProps.onPause != this.props.onPause){
            this.setState({onPause: false}, ()=>{
                this.setState({onPause: true})
            })
        }
    }

  goTop=()=> {
      this.timer = setTimeout(() => {
          this.scrollView && this.scrollView.scrollTo({x: 0, y: 0, animated: true});
      }, 50);
  }

  touchEnd=(event)=>{
    this.endX=event.nativeEvent.locationX;
    const contentOffset = this.endX-this.startX;
      this.props.offset&&this.props.offset(contentOffset);

  }

  render() {
    return (
      <View style={[styles.container]}>
      <ScrollView
        ref={ref => this.scrollView = ref}
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
        {!this.state.details.length > 0 && <View style={[{marginTop: 40, width,}, styles.allCenter]}>
          <Image2 style={{height: 130, width: 200}} source={noData} resizeMode={'contain'}/>
          <Text style={{marginTop: 20, fontSize: 16}}>暂时没有图文详情</Text>
        </View>}
        {this.state.details.map((item, index) => {
          if (item.type === 'video') {
            return <View key={index} style={[styles.allCenter, styles.banner]}>
              <VideoPlayer onPause={this.state.onPause} placeholder={item.data.img} url={item.data.video} style={styles.banner}
                           inlineOnly={true}/>
            </View>
          } else if (item.type === 'image') {
            return <Image key={index} width={width} source={{uri: item.data}}/>
          } else {
            return <View key={index} style={[{flex: 1, width: width}, styles.row]}>
              {item.data.map((itt, index2) => {
                return <TouchableWithoutFeedback key={index2} onPress={() => {
                  // 跳转商品 itt.productId
                  //     alert(itt.productId);
                  this.props.dispatch(NavigationUtils.navigateAction("GoodsDetail", {productId: itt.productId,}));

                }}>
                  <Image width={width * 0.5} source={{uri: itt.url}}/>
                </TouchableWithoutFeedback>
              })}
            </View>
          }
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
