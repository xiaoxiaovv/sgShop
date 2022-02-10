import * as React from 'react';
import { View, ScrollView, Modal, TouchableOpacity, Text,Platform } from 'react-native';
import GoodsHeader from './GoodsHeader';
import GoodsPrice from './GoodsPrice';
import GoodsCount from './GoodsCount';
import { connect, createAction, createIdAction, isLogin } from '../../../utils';
import Coupon from './Coupon';
import CountStyle, { CountStyleType } from './CountStyle';
import GoodsRemend from '../../../components/CustomAlert';
import GoodsFooter from './GoodsFooter';
import ShotEvaluate from './ShotEvaluate';
import ScreenUtil from '../../Home/SGScreenUtil';
import Address from '../../../components/Address';
import Store from './Store';
import BaiTiao from './BaiTiao';
import EStyleSheet from 'react-native-extended-stylesheet';
import Item from '../../../components/ArrowItem';
import Button from 'rn-custom-btn1';
import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;

export interface IGoodsProps {
  modelId: string;
  stroeMsgData: [];
  checkEvaluate: () => void;
  params: any;
  hasProgram?: any;
  navigation?: any;
}

interface IGoodsState {
  showRemend: boolean;
  show: boolean;
  showCouponList: boolean;
  showImgIndex: number;
  showStoreMsg: boolean,
}

export default class Goods extends React.Component<IGoodsProps, IGoodsState> {
  constructor(props: IGoodsProps) {
    super(props);
    this.state = {
      showRemend: false,
      show: false,
      showCouponList: false,
      showImgIndex: 0,
      showStoreMsg: false,
    };
  }

  public render(): JSX.Element {
    const { modelId, checkEvaluate, hasProgram, stroeMsgData, params } = this.props;
    return (
      <View style={{ flex: 1, width, backgroundColor: 'white' }}>
          <GoodsHeader modelId={modelId} />
          <GoodsPrice params={params} modelId={modelId} remendClick={() => this.setState({ showRemend: true })} />
          <Coupon modelId={modelId} />
          <GoodsCount modelId={modelId} />
          <GoodsFooter modelId={modelId} clickLocation={() => this.setState({ show: true ,showStoreMsg:false })} clickStoreMsg={()=>{ this.setState({showStoreMsg:true,show:false}); dvaStore.dispatch(createIdAction('goodsDetail/getStoreMsg')({modelId}));}}/>
          {hasProgram == 1 ? <Item>
          <TouchableOpacity style={styles.title} onPress={() => { this.props.navigation.navigate('ProductCases', { productId: params.productId}) }}>
                <Text style={styles.titleText}>[成套购买]</Text>
                <Text style={styles.positiveRate}>设计师推荐方案</Text>
              </TouchableOpacity>
          </Item> : null}
          <ShotEvaluate modelId={modelId} checkClick={checkEvaluate} />
          <Store modelId={modelId} />
          <CountStyle modelId={modelId} />
          <BaiTiao modelId={modelId} />
          <GoodsRemend visible={this.state.showRemend} onClose={() => this.setState({ showRemend: false })} />
          <Modal
            // 设置Modal组件的呈现方式
            animationType='slide'
            // 它决定 Modal 组件是否是透明的
            transparent
            // 它决定 Modal 组件何时显示、何时隐藏
            visible={this.state.show || this.state.showStoreMsg}
            // 当 Modal组件在屏幕上完成显示后，这个回调函数将被执行
            onShow={() =>  Log('onShow')  }
            // 这是 Android 平台独有的回调函数类型的属性
            // 开发者必须要写一个函数来处理当 Modal 显示在界面时且android物理返回键被按下时的业务逻辑
            onRequestClose={() => Log('onShow')}
           >
           {
             this.state.show && !this.state.showStoreMsg? 
             <View style={{width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
             <TouchableOpacity
               style={{position: 'absolute', top: 0, left: 0,
                       width: '100%', height: height - 400}}
               activeOpacity={1} onPress={() => this.setState({show: false})}>
               <View style={{position: 'absolute', top: 0, left: 0, width: '100%',
                     height: height - 400}}></View>
             </TouchableOpacity>
              <Address
                hasHeader={true}
                onclick={() => this.setState({show: false})}
                notStoreDva={true}
                onSelect = {({ province, city, district, street }) => this.setState({ show: false },  () => {
                  const pcrNm = `${province.text} ${city.text} ${district.text}/${street.text}`;
                  dvaStore.dispatch(createIdAction('goodsDetail/changePlace')({
                    modelId, pcrName: pcrNm, provinceId: province.value,
                    cityId: city.value, regionId: district.value, streetId: street.value,
                    isFirstLoad: false,
                  }));
                })}
              />
           </View>
           :
           <View style={{width: '100%', height: '100%'}}>
           <TouchableOpacity
             style={{position: 'absolute', top: 0, left: 0,
                     width: '100%', height: height - ScreenUtil.scaleSize(400)}}
             activeOpacity={0.4} onPress={() => this.setState({showStoreMsg: false})}>
             <View style={{position: 'absolute', top: 0, left: 0, width: '100%',backgroundColor:'rgba(0,0,0,0.5)',
                   height: height - ScreenUtil.scaleSize(400)}}></View>
           </TouchableOpacity>
           <View style={{height: ScreenUtil.scaleSize(400), width: '100%',position:'relative',
                       backgroundColor: 'white', marginTop: height - ScreenUtil.scaleSize(400)}}>
             
                <View style={{width:width,height:48,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomColor:'#eee',borderBottomWidth:1}}>
                    <Text></Text>
                    <Text style={{fontSize:18,color:'#333'}}>门店信息</Text>
                    <Button
                      imageStyle={{width:20,height:20,}}
                      image={require('../../../images/close_circle_black.png')}
                      onPress={() => this.setState({ showStoreMsg: false })}
                    />
                </View>
                {/* msg start */}
                <ScrollView>
                  <View style={{flexDirection:'column',width}}>
                    {
                    IS_NOTNIL(this.props.stroeMsgData) ? 
                    this.props.stroeMsgData.map((item,index)=>{
                            return (
                              <View key={index} style={{width:width-30,flexDirection:'row',marginLeft:16,marginRight:18,borderBottomColor:'#eee',borderBottomWidth:1}}>
                                  <Button
                                    imageStyle={{width:24,height:24,marginBottom:16}}
                                    image={require('../../../images/ic_location.jpg')}
                                  />
                                  <View style={{marginBottom:10}}>
                                    <Text style={{color:'#333',fontSize:14,marginTop:14,width:width-80}}>{item.pn}</Text>
                                    <Text style={[styles.ft,{marginTop:4,marginBottom:4}]}>{item.a}</Text>
                                    <Text style={styles.ft}>{item.p}</Text>
                                  </View>
                              </View>
                            )
                      })
                      :
                      <View style={{width:width,flexDirection:'column',justifyContent:'center',}}>
                           <View style={{marginBottom:16,marginTop:40}}>
                              <Button
                                        imageStyle={{width:120,height:88,}}
                                        image={require('../../../images/noStoreMsg.png')}
                                />
                           </View>
                           <View style={{justifyContent:'center',alignItems:'center'}}>
                              <Text style={{fontSize:14,color:'#999'}}>所选收货地址附近暂无门店信息</Text>
                              <Text style={{fontSize:14,color:'#999',paddingLeft:4}}>可修改收货地址查看其他地区</Text>
                           </View>
                           
                      </View>
                    }
                       
                   </View>
                </ScrollView>
                
                {/* msg end */}
                {/* <View style={{width,height:50,}}></View>
                <View style={{width,height:50,backgroundColor:'#FF6026',justifyContent:'center',alignItems:'center',position:'absolute',bottom:0}}>
                       <Text style={{color:'#fff',fontSize:14,textAlign:'center'}}>您可选择附近的任意门店使用特权码</Text>
                </View> */}
                 {
                  IS_NOTNIL(this.props.stroeMsgData)?
                  
                  <View style={{width,height:Platform.OS =='ios'?50:74}}>
                      <View style={{width,height:Platform.OS =='ios'?50:74,}}></View>
                      <View style={{width,height:50,backgroundColor:'#FF6026',justifyContent:'center',alignItems:'center',position:'absolute',bottom:Platform.OS =='ios'?0:24}}>
                            <Text style={{color:'#fff',fontSize:14,textAlign:'center'}}>您可选择附近的任意门店使用特权码</Text>
                      </View>
                  </View>
                  :
                  null
                }
            </View>
           
         </View>
           }
             
          </Modal>
        </View>
    );
  }
}

const styles = EStyleSheet.create({
  ft:{
    color:'#999',
    fontSize:12,
    width:width-80
  },
  goodsRemend: {
    fontSize: '$fontSize2',
    color: '$black',
    margin: 16,
  },
  title: {
    flex: 1,
    flexDirection: 'row',
    height: '48rem',
    alignItems: 'center',
    padding: 16,
  },
  titleText: {
    color: '$darkblack',
    fontSize: '$fontSize3',
    height: '48rem',
    lineHeight: '48rem',
  },
  positiveRate: {
    color: '$black',
    fontSize: '$fontSize2',
    height: '48rem',
    lineHeight: '48rem',
    paddingLeft: 10,
  },
});
