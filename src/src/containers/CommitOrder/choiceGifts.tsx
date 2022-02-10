import * as React from 'react';
import { View, TouchableOpacity, Text, BackHandler,Platform, Image ,ScrollView} from 'react-native';
import { ICustomContain,INavigation } from '../../interface/index';
import EStyleSheet from 'react-native-extended-stylesheet';
import { NavBar, SafeView } from './../../components';
import { createAction,connect ,px} from '../../utils';
import { List, Picker, Modal,Toast } from 'antd-mobile';
import CustomNaviBar from '../../components/customNaviBar';
import ScreenUtil from '../Home/SGScreenUtil';
import Button from 'rn-custom-btn1';
const alt = Modal.alert;

import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;

const mapStateToProps =(
    {order:{giftsList,productInfoList},}
     )=>(
         {giftsList,productInfoList}
        );

@connect(mapStateToProps)
class ChoiceGifts extends React.Component<INavigation&ICustomContain>{
  
   constructor(props){
       super(props);
       this.state = {
          num:0,
          isShow:false,
          checkArr:[], 
          data:[],
       }
   }  
   componentDidMount(){
        this.props.dispatch(createAction('order/choiceGift')());  
   }
   componentWillReceiveProps(nextProps){
    this.setState({data:nextProps.giftsList}); 
   }
   public render():JSX.Element{
       const p= [];
        return (
            <SafeView>
                <View style={{flex:1,width,height,backgroundColor:'#eee'}}>
                     {/* <NavBar
                       title='选择赠品'
                     /> */}
                     <CustomNaviBar
                        navigation={this.props.navigation} title={'选择赠品'}
                        style={{zIndex: 1000,
                            borderBottomWidth: 1,
                            borderBottomColor: '#ccc',}}
                            leftAction={() =>{
                                 if(this.state.num>0){
                                    const altInt = alt('返回后将不会保存您的操作',' ', [
                                        { text: '确定', onPress: () =>{
                                            this.props.navigation.goBack();
                                            this.setState({num:0})
                                        }},
                                        { text: '返回修改', onPress: () => {console.log('cancel');}, style: 'default' },
                                      ]);
                                 }else{
                                    this.props.navigation.goBack();
                                 }
                            }
                        }
                        />
                    {/* 内容 */}
                    <ScrollView style={{flex:1,backgroundColor:'#eee'}}>
                      {
                          this.state.data && this.state.data.length>0 &&
                           <View style={{height:30,backgroundColor:'#eee'}}>
                            <Text style={{color:'#666',lineHeight:30,paddingLeft:20}}>提示：每个分类仅可选择一个赠品。</Text>
                           </View>
                      }
                        {
                            this.state.data && this.state.data.length>0 && this.state.data.map((item,index)=>{
                                 return (
                                    <View style={{marginBottom:10,width,backgroundColor:'#fff'}}>
                                       {
                                           item && item.map((i,ind,arr)=>{
                                               return (
                                                <View style={{flexDirection:'row',width,}}>
                                                    <TouchableOpacity
                                                       style={{width:48,height:104,alignItems:'center',justifyContent:'center'}}
                                                       onPress={()=>{this.isCheck(i.isDefault,ind,arr)}}
                                                    >
                                                        <Image 
                                                            style={{width:16,height:16}}
                                                            source={i.isDefault==1?require('../../images/ic_select.png'):require('../../images/ic_check.png')}/>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                       style={{borderBottomColor:'#e4e4e4',borderBottomWidth:1,flexDirection:'row',flex:1}}
                                                       onPress={()=>{
                                                           this.setState({isShow:true});
                                                           this.props.dispatch(createAction('order/getDefaultInfo')({pid:i.pid}));
                                                       }}
                                                    >
                                                        <View style={{marginTop:12,marginBottom:12,marginRight:10,width:80,height:80}}>
                                                            <Image
                                                               style={{width:80,height:80}}
                                                               source={{uri:i.productPic}} 
                                                               resizeMode='contain'
                                                            />
                                                        </View>
                                                        <View style={{flex:1,marginRight:18}}>
                                                            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:12,marginBottom:4}}>
                                                                 <Text numberOfLines={1} style={{fontSize:14,color:'#333'}}>{i.productName}</Text>
                                                                 <Text style={{fontSize:12,color:'#666'}}>x1</Text>
                                                            </View>
                                                            <View>
                                                                <Text numberOfLines={2} style={{fontSize:14,color:'#666'}}>{i.title}</Text>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>   
                                               )
                                           })
                                       }
                                        
                                    </View>
                                 )
                            })
                           
                        }
                        {
                            this.state.data && this.state.data.length<=0 &&
                            <View style={{width,height:40,alignItems:'center',justifyContent:'center',marginTop:20}}>
                                <Text style={{fontSize:14,color:'#666'}}>暂无数据!</Text>
                            </View>
                        }
                        
                    </ScrollView>

                  { this.state.data && this.state.data.length>0 && <View>
                        <TouchableOpacity 
                           style={{width,height:48,justifyContent:'center',alignItems:'center',backgroundColor:'#2979FF'}}
                           onPress={()=>{
                               this.state.data && this.state.data.length>0 && this.state.data.map((item,index)=>{
                                    item && item.map((i,ind)=>{
                                     //   console.log(i)
                                        if(this.state.data[index][ind].isDefault == "1"){
                                            p.push({
                                               "g":this.state.data[index][ind].group,
                                               "s":this.state.data[index][ind].spu,
                                            });
                                          
                                        }
                                    })
                               })
                               if(p){
                                this.props.dispatch(createAction('order/preservationGift')({p:p}));
                              }
                               console.log(p)
                           }}
                        >
                            <Text style={{color:'#fff',fontSize:14,textAlign:'center',lineHeight:48}}>保存修改</Text>
                        </TouchableOpacity>
                    </View>
                  }
                    <Modal
                      popup
                      visible={this.state.isShow}
                      onClose={this.onClose}
                      animationType="slide-up"
                      style={{backgroundColor:'transparent'}}
                    >
                        <View style={{width: '100%', height: '100%',backgroundColor:'rgba(0,0,0,0.5)'}}>
                        <TouchableOpacity
                            style={{position: 'absolute', top: 0, left: 0,
                                    width: '100%', height: height - ScreenUtil.scaleSize(400)}}
                            activeOpacity={0.4} onPress={() => this.setState({isShow: false})}>
                            <View style={{position: 'absolute', top: 0, left: 0, width: '100%',backgroundColor:'rgba(0,0,0,0.5)',
                                height: height - ScreenUtil.scaleSize(400)}}></View>
                        </TouchableOpacity>
                        <View style={{height: ScreenUtil.scaleSize(400), width: '100%',position:'relative',
                                    backgroundColor: 'white', marginTop: height - ScreenUtil.scaleSize(400),borderRadius:10}}>
                            
                                <View style={{width:width,height:48,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomColor:'#eee',borderBottomWidth:1,}}>
                                    <Text></Text>
                                    <Text style={{fontSize:18,color:'#333'}}>规格参数</Text>
                                <Button
                                imageStyle={{width:20,height:20,marginRight:10}}
                                image={require('../../images/code_btn.png')}
                                onPress={() => this.setState({ isShow: false })}
                                />
                            </View>
                            {/* msg start */}
                            <ScrollView>
                            <View style={{flexDirection:'column',width}}>
                                {
                                    this.props.productInfoList && this.props.productInfoList.length>0 && this.props.productInfoList.map((item,index)=>{
                                         return (
                                             <View style={{flexDirection:'row',height:50,alignItems:'center'}}>
                                                 <Text style={[styles.txt,{paddingLeft:12,lineHeight:50}]}>{item.attrName}:</Text>
                                                 <Text style={[styles.txt,{marginLeft:18,lineHeight:50}]}>{item.attrValue}</Text>
                                             </View>
                                         )
                                    })
                                }
                                {
                                    this.props.productInfoList && this.props.productInfoList.length<=0 && 
                                    <View style={{width,height:40,justifyContent:'center',alignItems:'center',marginTop:20}}>
                                        <Text style={{fontSize:14,color:'#999'}}>暂无数据！</Text>
                                    </View>
                                }
                            </View>
                            </ScrollView>
                            
                            <View style={{width,height:48}}>
                                <TouchableOpacity
                                   style={{width,height:48,backgroundColor:'#2979FF',justifyContent:'center',alignItems:'center',}}
                                   onPress={()=>{
                                       this.setState({isShow:false})
                                   }}
                                >
                                   <Text style={{color:'#fff',fontSize:14,textAlign:'center'}}>确定</Text>
                                </TouchableOpacity>
                            </View>
                            
                        </View>
           
                  </View>
                    </Modal>
                </View>
            </SafeView>
        )
    }
    onClose = ()=>{
        this.setState({isShow:false})
    }
    // 选择
    isCheck = (isChecked,index,arr)=>{
        this.setState({num:1});
        if(isChecked == "1"){
            Toast.info('您已选中此商品',2);
        }else{
            for(var i=0;i<arr.length;i++){
                arr[i].isDefault = "0";
            }
            arr[index].isDefault = "1";
            console.log(this.state.data)
        }
      
    }
    
}

const styles = EStyleSheet.create({
   txt: {
       color:'#666',
       fontSize: 14,
       flex: 1,
   }
});

export default ChoiceGifts;