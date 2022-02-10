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
    DeviceEventEmitter, TouchableWithoutFeedback, WebView,
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
import IsIphoneX from "../../../components/NavBar/IsIphoneX";

// fix https://github.com/facebook/react-native/issues/10865
let patchPostMessageJsCode = `(${String(function () {
    var originalPostMessage = window.postMessage;
    var patchedPostMessage = function (message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer);
    };
    patchedPostMessage.toString = function () {
        return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')
    };
    window.postMessage = patchedPostMessage;
})})();`;

@connect(() => ({}))
export default class DetailsWeb extends Component {
  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      details: [],
        isVideo: false,
        videoData: {},
        onPause: true,
        lazy: true,
        webViewHeight: 2 * SHeight - 10,
        count: 0
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
            // details.push({type: 'video', data: JSON.parse(video)});
              this.setState({isVideo: true, videoData: JSON.parse(video)});
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
      this.webInjectJavaScript();
  }

  webInjectJavaScript = ()=>{
      this.timer = setTimeout(()=>{
          const jsCode = this._injectAutoHeightJS();
          this.webRef && this.webRef.injectJavaScript(jsCode);
          this.webInjectJavaScript();
      }, 1000);
  };

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
    _injectAutoHeightJS () {
        var getHeightFunc = function () {
            var height = 0
            if (document.documentElement.clientHeight > document.body.clientHeight) {
                height = document.documentElement.clientHeight
            } else {
                height = document.body.clientHeight
            }
            var action = { type: 'changeWebviewHeight', params: { height: height } }
            window.postMessage(JSON.stringify(action))
        }
        var str = '(' + String(getHeightFunc) + ')();'
        return str
    }

    _injectPostMsgJS () {
        // 不加这段在 iOS 上点击一些网页会报错
        var patchPostMessageFunc = function () {
            var originalPostMessage = window.postMessage
            var patchedPostMessage = function (message, targetOrigin, transfer) {
                originalPostMessage(message, targetOrigin, transfer)
            }
            patchedPostMessage.toString = function () {
                return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')
            }
            window.postMessage = patchedPostMessage
        }
        var str = '(' + String(patchPostMessageFunc) + ')();'
        return str
    }

    _injectJSString () {
        return this._injectPostMsgJS() + this._injectAutoHeightJS();
    }

    handleMessage = async (e)=> {
        console.log('------------------发消息了- handleMessage ------------------');
        try {
            let message = L.get(e.nativeEvent, 'data');
            let obj = JSON.parse(message);
            console.log(obj);
            let type = L.get(obj, 'type', 'none');
            if(type === 'goProduct') {
                let id = L.get(obj, 'id');
                this.props.dispatch(NavigationUtils.navigateAction("GoodsDetail", {productId: id}));
            }else if(type === 'changeWebviewHeight') {
                if(this.state.webViewHeight != obj.params.height){
                    this.setState({
                        webViewHeight: obj.params.height
                    })
                }
            }
        }catch (e) {
          console.log(e);
        }
    };

   render() {

    let tpl =  '';
    let details =  this.state.details;
      for(let i = 0; i < details.length; i++){
          if(details[i].type == 'product'){
            let data = details[i].data;
            if(data.length === 1){
              tpl += `<li><img src="${details[i].data[0].url}" onclick="postMsg(${details[i].data[0].productId})" alt="" style="display: block;width: 100%;"></li>`
            }else {
              tpl += `<li style="overflow: hidden;">
                  <img src="${details[i].data[0].url}" onclick="postMsg(${details[i].data[0].productId})" alt="" style="display: block;width: 50%;float: left;">
                  <img src="${details[i].data[1].url}" onclick="postMsg(${details[i].data[1].productId})" alt="" style="display: block;width: 50%;float: left;">
                </li>`;
            }
          }else{
              tpl += `<li><img src="${details[i].data}" alt="" style="display: block;width: 100%;"></li>`
          }
      }
    const html = `<!doctype html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" name="viewport" />
    <style>
      *{
        margin: 0;
        padding: 0;
      }
      ul,li{
        list-style: none;
        margin: 0;
        padding: 0;
      }
    </style>
    <script>
   function postMsg(id) {
        var dd = {
            type: 'goProduct',
            id: id
        };
                  window.postMessage(JSON.stringify(dd));
              }
               function onload() {
                if(document.body.clientHeight){
                    // alert(document.body.clientHeight)
                     var tt = {
                    type: 'changeWebviewHeight',
                    params: {height: document.body.clientHeight}
                };
                          window.postMessage(JSON.stringify(tt));
                }
                
                      }
</script>
  </head>
  <body onload="onload()">
    <div id="product-detail-container">
      <ul id="product-detail-content">
      ${tpl}
      </ul>
    </div>
  </body>
</html>
`;
    const jsCode = this._injectJSString();
    return (
      <View style={[styles.container]}>
      <ScrollView
        ref={ref => this.scrollView = ref}
        style={[styles.container]}>
          {
            this.state.isVideo && <View style={[styles.banner]}>
                <VideoPlayer index={0} onPause={this.state.onPause} placeholder={this.state.videoData.img} url={this.state.videoData.video} style={styles.banner}
                             inlineOnly={true}/>
            </View>
          }
        {!this.state.details.length > 0 && <View style={[{marginTop: 40, width,}, styles.allCenter]}>
          <Image2 style={{height: 130, width: 200}} source={noData} resizeMode={'contain'}/>
          <Text style={{marginTop: 20, fontSize: 16}}>暂时没有图文详情</Text>
        </View>}
          <View style={{flex:1}}>
              <WebView
                  key={this.props.productId}
                  ref={ref => this.webRef = ref}
                  automaticallyAdjustContentInsets
                  javaScriptEnabled={true}
                  setVerticalScrollBarEnabled={true}
                  domStorageEnabled
                  mixedContentMode={'always'}
                  injectedJavaScript={(jsCode)}
                  scalesPageToFit
                  onMessage={(e) => {
                      this.handleMessage(e);
                  }}
                  style={{width: SWidth, height: this.state.webViewHeight}}
                  // style={{width: SWidth, flex: 1}}
                  source={{html: html, baseUrl: ''}}
              />
          </View>

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
    width: width, height: 0.48 * width, flex: 1
  }
});
