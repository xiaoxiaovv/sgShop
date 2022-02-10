

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    ImageBackground,
    View,
    WebView,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Swiper from 'react-native-swiper';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import { connect } from 'react-redux';
import ScreenUtil from './../../Home/SGScreenUtil';
import { UltimateListView } from 'rn-listview';
import CaseYYModle from '../../../components/CaseYYModle';
import URL from './../../../config/url';
import { GET, POST_JSON, GET_P, POST_FORM} from '../../../config/Http';
import SCWebView from './../../../components/SwitchScroll/SCWebView'
import ShareModle from '../../../components/ShareModle';
import {action,createAction, NavigationUtils} from './../../../dva/utils';
let Swidth = URL.width;
let Sheight = URL.height;
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
import { NavBar } from '../../../components/NavBar';
const Sip = StyleSheet.hairlineWidth;
import share from './../../../images/share.png';
import { isiPhoneX } from '../../../utils';
/**
 * 案例详情
 */
@connect(({users}) => ({...users}))
export default class CaseDetail extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            showYYModal:false,
            showShare:false,
            data:[],
            name:'',
            imageUrl:'',
            avatar:'',
            area:'',
            designerName:'',
            introduction:'',
            multiple:1,
            marginSize:'0px',
            
        };
        this.getData = this.getData.bind(this);
        this.getShareContent = this.getShareContent.bind(this);
      }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        this.getData(params.caseid);
        Platform.OS === 'ios' ?
        this.setState({multiple: 2.5, marginSize:'10px'}):
        this.setState({multiple: 1, marginSize:'0px'})
    }

    render() {
        const data = this.state.data;

        const htmlD = '<body>'+'<img src="'+this.state.imageUrl+'" width="100%">'+
        '<div style="position: relative;margin-bottom: 10px;margin-top: 10px;">' +
        '<div style="display: inline-block;height: '+30*this.state.multiple+'px;position: relative;width: 50%;" onclick="window.postMessage(0);">'+
          '<img src="'+this.state.avatar+'" width="'+30*this.state.multiple+'px" height="'+30*this.state.multiple+'px" style="border-radius: 50%;" >'+
          '<span style="position: absolute;display: inline-block;height: '+30*this.state.multiple+'px;top: '+5*this.state.multiple+'px;left: '+35*this.state.multiple+'px; font-size: '+(14*this.state.multiple)+';">'+this.state.designerName+'</span>'+
        '</div>'+
         '<span style="float: right;margin-top: '+5*this.state.multiple+'px;margin-right: 10px; font-size: '+(12*this.state.multiple)+';">'+this.state.area+'</span>'+
      '</div>'+
      '<div style="width: 100%;height: 5px;background-color: #EEEEEE"></div>'+
      '<div style="width: 100%;font-size:'+13*this.state.multiple+';padding:'+this.state.marginSize +'">'+this.state.introduction+'</div>' +
        '</body>';


        const html = `<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
</head>
<body>
<img src=${this.state.imageUrl} width="100%">
<div style="position: relative;margin-bottom: 10px;margin-top: 10px;">
<div style="display: inline-block;height: 30px; position: relative;width: 50%;" onclick="window.postMessage(0);">
<img src=${this.state.avatar} width="30px" height="30px" style="border-radius: 50%;" >
<span style="position: absolute; display: inline-block; height: 30px;top: 8px;left: 35px; font-size: 13;">${this.state.designerName}</span>
</div>
<span style="float: right;margin-top: 5px; margin-right: 10px; font-size: 12;">${this.state.area}</span>
</div>
<div style="width: 100%;height: 5px;background-color: #EEEEEE"></div>
<div style="width: 100%;">${this.state.introduction}</div>
</body>
</html>`

        return (
        <View style={styles.container}>
       
       <NavBar title={this.state.name} 
               rightIcon={share}
               rightIconStyle={styles.rightIcon}
               rightFun={()=>{
                   if(this.props.isLogin){
                       IS_NOTNIL(this.state.data) && this.setState({showShare:true})
                   }else {
                       dvaStore.dispatch(createAction('router/apply')({
                           type: 'Navigation/NAVIGATE', routeName: 'Login',
                       }));
                   }
               }}
               />
      
            {/* //  http://cdn21test.ehaier.com:8080/file/5b026a7a002c19737af4b066.png" style="max-width:100%;"><br></p><p><br></p><p><br></p><p>主要材料：复合地板<br><br>项目介绍：旅行，让人找到家的感觉</p><p><img src="http://cdn21test.ehaier.com:8080/file/5b026a7f002c19737af4b069.png" style="max-width:100%;"><br></p><p>主要材料：复合地板<br><br>项目介绍：旅行，让人找到家的感觉</p><p><img src="http://cdn21test.ehaier.com:8080/file/5b026a8a002c19737af4b06c.png" style="max-width:100%;"><br></p><p>主要材料：复合地板&nbsp; &nbsp;<br><br>项目介绍：旅行，让人找到家的感觉</p> */}
        <WebView
            automaticallyAdjustContentInsets
            javaScriptEnabled={true}  
            setVerticalScrollBarEnabled={true}
            scalesPageToFit
            style={{
                Swidth,flex:1,
                backgroundColor:'#ffffff',
                borderColor:'#ffffff',
                
              }}
            source={{ html: html, baseUrl: ''}}
            onMessage={this.onMessage.bind(this)}
        />
        <TouchableOpacity style={{width:Swidth,height:44,backgroundColor:'#2979FF',justifyContent:'center',alignItems:'center', marginBottom:isiPhoneX ? 34 : 0}} onPress={()=>{
                       this.setState({ showYYModal: true })
                    }}>
            <Text style={{fontSize: 16,color:'#FFFFFF'}}>预约免费设计</Text>
        </TouchableOpacity>

          <CaseYYModle
                    visible={this.state.showYYModal}
                    onCancel={() => this.setState({ showYYModal: false })}
                    hiddenEwm={true}
                    hidingTitle={true}
                    designerId={data.designerId}
                    detailsId={data.id}
                    itemsId={2}/>
            <ShareModle
                hiddenEwm
          visible={this.state.showShare} content={this.getShareContent()}
          onCancel={() => this.setState({ showShare: false })}/>
        </View>
        );
    }

    getShareContent = () => {
        /**
         * 分享到微信好友
         * @param command 数组
         * @param title {String} 分享标题
         * @param content {String} 分享内容
         * @param pic {String} 分享图片url
         * @param url {String} 分享内容跳转链接
         * @param type {Integer} 分享类型 0 链接分享 1 多图分享（目前仅支持微信和微博，且无成功回调） 2 单图分享
         * 回调Promises
         */
        const data = this.state.data;
        const title = data.designerName;
        const content = data.name;
        const pic = data.imageUrl;
        const url = `${URL.DIY_CASE_SHARE}${data.id}`;

        return [ title, content, pic, url, 0 ];
    };

    onMessage = (id) => {
       const data = this.state.data;
       this.props.dispatch(NavigationUtils.navigateAction("SjsDetail", {designerId:data.designerId}));
    }

     // 请求数据
   getData = async (id) => {
    try {
        const {data, success} = await GET(URL.DIY_CASEDETAILS,{id:id});
        if (success) {
            this.setState({
                    data: data,
                    introduction: data.introduction.split('max-width').join('width'),
                    name:data.name,
                    imageUrl: data.imageUrl,
                    avatar: data.avatar,
                    area:data.area,
                    designerName:data.designerName,
            });
        } else {
            Toast.fail('请求数据失败', 2);
        }
    } catch (err) {
        Log(err);
    }
}

 toDengin = async (id) => {
    this.props.dispatch(NavigationUtils.navigateAction("SjsDetail", {designerId:id}));
}

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    rightIcon: {
        width: 24,
        height: 24,
    },
});
