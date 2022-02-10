import * as React from 'react';
import {
    View,
    Image,
    Text,
    Modal,
    FlatList,
    NativeModules,
    TouchableWithoutFeedback,//加载指示器
    TouchableOpacity
} from 'react-native';
import Address from './../../components/Address';
import { connect } from 'react-redux';
import { NavBar, SafeView } from './../../components';
import ShareModle from '../../components/ShareModle';
import { INavigation } from '../../interface/index';
import { Toast } from 'antd-mobile';
import URL from './../../config/url';
import { toFloat } from '../../utils/MathTools';
import { ctjjService } from './../../dva/service';
import { width, sceenHeight } from '../../utils';
const Swidth = width;
const height = sceenHeight;
interface IState {
    shareStoreId:string|number,
    bannerId:string|number,
    layout:string,
    platformType:string|number,
    showShare:boolean,
    show:boolean,
    storeId:string|number,
    shareInfo?:{title?:string,content?:string,imgUrl?:string},
    productsList:Array<{}>,
}
const mapStateToProps = ({ address: {provinceId, cityId, areaId, streetId, provinceName, cityName, areaName, streetName}}) => ({
    provinceId,
    cityId,
    areaId,
    streetId,
    provinceName,
    cityName,
    areaName,
    streetName,
  });
  
  @connect(mapStateToProps)
class CustomPage extends React.Component<IState & INavigation> {
    
    public state: IState;
        private getShareContent = ()=>{

          const { title , content , imgUrl}  = this.state.shareInfo;
            const pic = imgUrl?imgUrl:'http://www.ehaier.com/mstatic/wd/v2/img/sg.png';
            const url = `${URL.get_bannerdaily_share}${this.state.bannerId}/${this.state.layout}/${dvaStore.getState().users.mid}/${this.state.platformType}`;
            return [ title, content, pic, url, 0 ];
        }
    private goshare = async () => {
        const loginStatus = dvaStore.getState().users.isLogin;
        if(loginStatus){
            this.setState({showShare: true})
            try {
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
                const res = await ctjjService.getBannerTheme(
                    params
                );
                if(res.success){
                    this.setState({
                        shareInfo:res.data
                    })
                }
            } catch (error) {
                console.log(error);
            }
        }else{
            Toast.show('请先登录，再分享');
        }

    }
    public render(): JSX.Element {
        const position = this.props.areaName;
        return (
            <SafeView>
            <View style={{flex:1}}>
            <NavBar title={"活动"} 
            rightView={
            <View style={{flex:1,justifyContent:'center',flexDirection: 'row',alignItems:'center',marginRight:14}}>
                <TouchableOpacity style={{justifyContent:'center',flexDirection: 'row',alignItems:'center'}} onPress={ () => {
                              this.setState({ show: true });
                          }}>
                    <Text style={{fontSize:14}}>{position}</Text>
                    <Image source={require('./../../images/location_ct.png')} style={{width:16,height:16}}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.goshare}>
                    <Image source={require('./../../images/share.png')} style={{width:20,height:20,marginLeft:10}}/>
                </TouchableOpacity>
            </View>
            }/>
                <View style={{flex:1}}>
                {
                    this.state.layout=='layout-colum2'?
                    <FlatList       key={1}
                                    data={this.state.productsList}
                                    renderItem={this._renderItem}
                                    onEndReachedThreshold={0.1}
                                    horizontal={false}
                                    numColumns={2}
                        />
                        :
                        <FlatList   key={2}
                                    data={this.state.productsList}
                                    renderItem={this._renderBPItem}
                                    onEndReachedThreshold={0.1}
                                    horizontal={false}
                                    numColumns={1}
                        />
                }
                </View> 
                <ShareModle
                    visible={this.state.showShare} content={this.getShareContent()}
                    onCancel={() => this.setState({ showShare: false })}
                    hiddenEwm
                />
                <Modal
          // 设置Modal组件的呈现方式
          animationType='slide'
          // 它决定 Modal 组件是否是透明的
          transparent
          // 它决定 Modal 组件何时显示、何时隐藏
          visible={this.state.show}
          // 当 Modal组件在屏幕上完成显示后，这个回调函数将被执行
          onShow={() => Log('onShow')}
          // 这是 Android 平台独有的回调函数类型的属性
          // 开发者必须要写一个函数来处理当 Modal 显示在界面时且android物理返回键被按下时的业务逻辑
          onRequestClose={() => Log('onShow')}
        >
          <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
            <TouchableOpacity
              style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: height - 400,
              }}
              activeOpacity={1} onPress={() => this.dismissView()}>
              <View style={{
                position: 'absolute', top: 0, left: 0, width: '100%',
                height: height - 400,
              }}></View>
            </TouchableOpacity>
            <Address
              hasHeader={true}
              onclick={() => this.setState({ show: false })}
              onSelect={(location: string) => this.setState({ show: false, address: location })}
            />
          </View>
        </Modal>     
            </View>  
    </SafeView>                 
        );
    }
    public dismissView() {
        this.setState({
          show: false,
        });
      }
      public componentWillReceiveProps(nextProps) {
            this.loadData(nextProps.provinceId,nextProps.cityId,nextProps.areaId,nextProps.streetId,nextProps.provinceName,nextProps.cityName,nextProps.areaName)
      }

    constructor(props) {
        super(props);
        this.state = {
            productsList:[],
            shareStoreId:'',
            bannerId:'',
            show:false,
            shareInfo:{},
            platformType:'',
            showShare:false,
            storeId:'',
            layout:'layout-colum2',
        }
    this.getShareContent = this.getShareContent.bind(this);
    }
        private _renderItem = ({ item }) => (
            <TouchableWithoutFeedback onPress={() => this.goproductDetail(item)}>
            <View style={{width:0.5*Swidth,backgroundColor:'white',padding:5,marginBottom:8,borderRightWidth:1,borderRightColor:'#eee'}}>
                <View style={{justifyContent:'center',flexDirection:'row',paddingTop:25,paddingBottom:25}}>
                    <Image source={{ uri: item.defaultImageUrl}} style={{width:0.39*Swidth,height:0.39*Swidth}} resizeMode={'stretch'}/>
                </View>
                <Text>{item.productFirstName}</Text>
                <Text style={{marginTop:8}}>{item.productSecondName}</Text>
                <Text style={{marginTop:8,marginBottom:15}}>{item.productTitle}</Text>
                <View style={{justifyContent:'flex-start',flexDirection:'row',alignItems:'center',paddingBottom:15}}>
                    <Text style={{color:'#999',marginRight:8}}>微价:</Text>
                    <Text style={{color:'#FF3030',marginRight:15}}>{`￥${toFloat(item.finalPrice)}`}</Text>
                    <Text style={{color:'#999'}}>{item.hasStock}</Text>
                </View>
            </View>
            </TouchableWithoutFeedback>                
        );
        private _renderBPItem = ({ item }) => (
            <TouchableWithoutFeedback onPress={() => this.goproductDetail(item)}>
            <View style={{width:Swidth,backgroundColor:'white',padding:5,marginBottom:8}}>
                <View style={{justifyContent:'center',flexDirection:'row',paddingTop:35,paddingBottom:35}}>
                    <Image source={{ uri: item.defaultImageUrl}} style={{width:0.83*Swidth,height:0.83*Swidth}} resizeMode={'stretch'}/>
                </View>
                <Text style={{paddingLeft:7}}>{item.productFirstName}</Text>
                <Text style={{marginTop:8,paddingLeft:7}}>{item.productSecondName}</Text>
                <Text style={{marginTop:8,paddingLeft:7,marginBottom:15}}>{item.productTitle}</Text>
                <View style={{justifyContent:'flex-start',flexDirection:'row',alignItems:'center',paddingBottom:15,paddingLeft:7}}>
                    <Text style={{color:'#999',marginRight:8}}>微价:</Text>
                    <Text style={{color:'#FF3030',marginRight:15}}>{`￥${toFloat(item.finalPrice)}`}</Text>
                    <Text style={{color:'#999'}}>{item.hasStock}</Text>
                </View>
            </View>
            </TouchableWithoutFeedback>                
        );
        private goproductDetail(item){
            const storId = this.state.storeId;
            console.log(item);
            const params = {
                productId: item.productId,
              o2oType: item.o2oType,
              fromType: item.fromType?item.fromType:'',
              storeId: storId?storId:'20219251',
              shareStoreId: this.state.shareStoreId
            }
            this.props.navigation.navigate('GoodsDetail',params)
        }

    public componentDidMount() {
        const params = this.props.navigation.state.params;
        this.setState({
            shareStoreId:params.shareStoreId,
            bannerId:params.bannerId,
            layout:params.layout,
            platformType:params.platformType?params.platformType:''
        },
        () =>this.loadData(this.props.provinceId,this.props.cityId,this.props.areaId,this.props.streetId,this.props.provinceName,this.props.cityName,this.props.areaName)
    )
    }

    private async loadData(provinceId,cityId,areaId,streetId,provinceName,cityName,areaName) {
                const storeId = this.state.shareStoreId ? this.state.shareStoreId : await global.getItem('storeId');
                this.setState({
                    storeId:storeId
                });
                NativeModules.StatisticsModule.track('ActivityView',{
                    bannerId: this.state.bannerId,
                    bannerName:	'bannerDaily',
                    storeId: storeId
                })
               try{
                   let params;
                   if(this.state.platformType){
                       params = {
                        memberId:storeId,
                        provinceId:provinceId,
                        cityId:cityId,
                        districtId:areaId,
                        streetId:streetId,
                        provinceName:provinceName,
                        cityName:cityName,
                        districtName:areaName,
                        bannerId:this.state.bannerId,
                        platformType:this.state.platformType
                    }
                   }else{
                    params = {
                        memberId:storeId,
                        provinceId:provinceId,
                        cityId:cityId,
                        districtId:areaId,
                        streetId:streetId,
                        provinceName:provinceName,
                        cityName:cityName,
                        districtName:areaName,
                        bannerId:this.state.bannerId,
                    }
                   }
                    const res = await ctjjService.getBannerDaily(
                        params
                    );
                    if(res.productsList){
                        this.setState({
                            productsList:res.productsList
                        })
                    }
                    console.log(res.productsList);
               }catch(e){
                    console.log(e);
               }


        }
    
}

export default CustomPage;