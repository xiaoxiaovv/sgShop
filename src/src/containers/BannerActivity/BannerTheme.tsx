import React, { Component } from 'react';
import {
    View,
    NativeModules,
    FlatList,
    TouchableWithoutFeedback,//加载指示器
    TouchableOpacity
} from 'react-native';
import { NavigationUtils} from './../../dva/utils';
import { getAppJSON } from '../../netWork';
import Config from 'react-native-config';
import URL from '../../config/url';
import {connect} from 'react-redux';
import ShareModle from '../../components/ShareModle';
import { INavigation,ICustomContain } from '../../interface/index';
import Image from 'react-native-scalable-image';
import { Toast } from 'antd-mobile';
import {GET} from '../../config/Http';
import {goToSQZBS} from '../../utils/tools';
let Swidth = URL.width;
let Sheight = URL.height;
interface IState {
    activityImageList:Array<{}>,
    shareStoreId:string|number,
    bannerId:string|number,
    platformType:string|number,
    showShare:boolean,
    shareInfo?:{title?:string,content?:string,imgUrl?:string}
    storeId:string|number,
}
@connect()
class BannerTheme extends Component<IState & INavigation & ICustomContain> {
    
    public state: IState;
        private getShareContent = ()=>{
        const { title , content , imgUrl}  = this.state.shareInfo;
        const pic = imgUrl?imgUrl:'http://www.ehaier.com/mstatic/wd/v2/img/sg.png';
        const url = `${URL.get_bannertheme}${this.state.bannerId}/${dvaStore.getState().users.mid}/${this.state.platformType}`;

         return [ title, content, pic, url, 0 ];
        }

    constructor(props) {
        super(props);
        this.state = {
            activityImageList:[],
            shareInfo:{},
            shareStoreId:'',
            bannerId:'',
            platformType:'',
            showShare:false,
            storeId:'',
        }
    this.getShareContent = this.getShareContent.bind(this);
    }

    public componentDidMount() {
        const params = this.props.navigation.state.params;
        this.setState({
            shareStoreId:params.shareStoreId,
            bannerId:params.bannerId,
            platformType: params.platformType?params.platformType:''
        },
        () =>this.loadData()
    )
    }
        private _renderItem = ({ item }) => (
            <TouchableWithoutFeedback onPress={()=>this.goDetail(item)}>
            <View>
                <Image width={Swidth/2} source={{uri:item.imageUrl}} />
            </View>
            </TouchableWithoutFeedback>                
        );

    private async loadData() {
                const storeId = this.state.shareStoreId ? this.state.shareStoreId : await global.getItem('storeId');
                this.setState({
                    storeId:storeId
                });
                NativeModules.StatisticsModule.track('ActivityView',{
                    bannerId: this.state.bannerId,
                    bannerName:	'bannerTheme',
                    storeId: storeId
                })
                let params;
                if(this.state.platformType){
                     params = {
                        bannerId: this.state.bannerId,
                        isHost: '1',
                        backUrl: '',
                        platformType:this.state.platformType
                    }
                }else{
                     params = {
                        bannerId: this.state.bannerId,
                        isHost: '1',
                        backUrl: '',
                    }
                }
                const res = await getAppJSON(
                    Config.GET_BANNER_THEME,
                    params,
                    {},
                    true,
                );
                console.log('vvvvvvvv',res.data.productList)
                if(res.success){
                    this.setState({
                        activityImageList: res.data.productList,
                        shareInfo:res.data
                    }
                    )
                }
        }
        private async goDetail(productInfo){
            console.log(productInfo);
            const storId = this.state.storeId;
            if (productInfo.productId) {
                const params = {
                    productId: productInfo.productId,
                  o2oType: productInfo.o2oType,
                  fromType: '',
                  storeId: storId?storId:'20219251',
                  shareStoreId: this.state.shareStoreId
                }
                this.props.navigation.navigate('GoodsDetail',params)
              } else if (productInfo.activityUrl) {
                if (productInfo.activityUrl.indexOf('VRshop') != -1) {
                  let serverHead = Config.SERVER_DATA.replace('v3', 'www'), openUrl = serverHead + 'index.html#/VrPage/'; 
                  NativeModules.ToolsModule.presentH5View([openUrl, 'VR']);
                } else if (productInfo.activityUrl.indexOf('coupon/toList') != -1) {
                    this.props.navigation.navigate('CouponCenter',{shareStoreId:this.state.shareStoreId})
                }else if(productInfo.activityUrl.indexOf('index.html#/bannerTheme') != -1) {
                    let obj = this.slicestr(productInfo.activityUrl);
                    this.props.navigation.navigate('BannerTheme',{bannerId:obj['2'],shareStoreId:obj['3']});
                }else if(productInfo.activityUrl.indexOf('index.html#/bannerDaily') != -1) {
                    let obj = this.slicestr(productInfo.activityUrl);
                    this.props.navigation.navigate('BannerDaily',{bannerId:obj['2'],layout:obj['3'],shareStoreId:obj['4']});
                }else if(productInfo.activityUrl.indexOf('noteDetails') != -1){
                    let obj = this.slicestr(productInfo.activityUrl);
                    this.props.dispatch(NavigationUtils.navigateAction("SuperSecondView", {
                        url: '/html/topic/topic_details.html',
                        id: Number(obj['2']),
                        type: 2
                    }));
                }
                // else if( productInfo.activityUrl.indexOf('thsq.ehaier.com') !== -1 || productInfo.activityUrl.indexOf('mobiletest.ehaier.com:8880') !== -1 ) {
                //     const param = {
                //         productId: '',
                //         storeId: '',
                //         type: 3,
                //     };
                //     GET(URL.GET_IF_CIRCLEPAGE, param).then((res)=>{
                //         if(res.success){
                //             this.props.dispatch(NavigationUtils.navigateAction('CommunityWeb', {url: res.data}));
                //         }
                //     }).catch((err)=>{
                //         console.log(err);
                //     });
                //
                // }

                else if(productInfo.activityUrl.indexOf('/race')!== -1){
                    goToSQZBS();
                    // dvaStore.dispatch(NavigationUtils.navigateAction('CommunityWeb', {url: link}))
                }else if(productInfo.activityUrl.indexOf('thsq.ehaier.com')!== -1 || productInfo.activityUrl.indexOf('mobiletest.ehaier.com:8880')!== -1){
                    goToSQZBS();
                    // dvaStore.dispatch(NavigationUtils.navigateAction('CommunityWeb', {url: link}))
                }
                else if(productInfo.activityUrl.indexOf('/familytry') != -1){
                    this.props.navigation.navigate('Familytry');
                }else if (productInfo.activityUrl.indexOf('index.html') != -1) {
                //   let gotoUrl = productInfo.activityUrl.slice(productInfo.activityUrl.indexOf('#/'));
                  //window.location.hash = gotoUrl;
                  //暂时这样写
                  this.props.navigation.navigate('CustomWebView', {
                    customurl: productInfo.activityUrl, flag: true, headerTitle:'',
                });
                 // NativeModules.ToolsModule.presentH5View([productInfo.activityUrl, '顺逛微店']);
                } else {
                      NativeModules.ToolsModule.presentH5View([productInfo.activityUrl, '顺逛微店']);
                }
              } else {
                console.log('未关联相关活动');
              }
    }
    private slicestr(str){
            return str.substr(str.indexOf('#')+1,str.length).split('/');    
    }
    private goshare = () => {
        const loginStatus = dvaStore.getState().users.isLogin;
        if(loginStatus){
            this.setState({showShare: true})
        }else{
            Toast.show('请先登录，再分享');
        }
        
    }
    public render(): JSX.Element {

        return (
            <View style={{ height: '100%'}}>
                <TouchableOpacity 
                onPress={()=>{this.props.navigation.goBack()}}
                style={{position:'absolute',top:38,left:0,zIndex:99,padding:12}}
                activeOpacity={0.7}
                >
                    <Image
                            source={
                                require('../../images/fanhui1.png')
                              }
                            width={26}
                        />
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={this.goshare}
                style={{position:'absolute',top:38,right:0,zIndex:99,padding:12}}
                activeOpacity={0.7}
                >
                    <Image
                            source={
                                require('../../images/fenxiang_1.png')
                              }
                              width={26}
                        />
                </TouchableOpacity> 
                <View>
                    <FlatList
                                    data={this.state.activityImageList}
                                    renderItem={this._renderItem}
                                    onEndReachedThreshold={0.1}
                                    horizontal={false}
                                    numColumns={2}
                        />
                </View> 
                <ShareModle
                    visible={this.state.showShare} content={this.getShareContent()}
                    onCancel={() => this.setState({ showShare: false })}
                    hiddenEwm
                />     
            </View>

        );
    }
}

export default BannerTheme;