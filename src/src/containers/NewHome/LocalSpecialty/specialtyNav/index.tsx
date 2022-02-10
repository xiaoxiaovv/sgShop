import * as React from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    ImageBackground,
    View, ScrollView,
    TouchableOpacity, Modal,FlatList,StatusBar
} from 'react-native';


import { createAction,connect ,iPhoneXMarginTopStyle} from '../../../../utils';
import { ICustomContain ,INavigation} from '../../../../interface/index';
import {NavigationUtils} from '../../../../dva/utils';
import {Font, Color} from 'consts';

import URL from './../../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

import { NavBar, SafeView, IsIphoneX } from '../../../../components/index';

@connect(({LocalSpecialtyModel}) => ({...LocalSpecialtyModel}))
export default class SpecialtyNav extends React.Component<INavigation&ICustomContain&{dataSource:any}>{
   private static defaultProps = {
     dataSource:[]
   } ;
   constructor(props){
        super(props);
        this.state = {
            show:false,
            data:[],
            index:0,
        }
   }
   componentWillMount(){
   }
   componentDidMount(){
      
   }

   
   public render():JSX.Element {
      console.log(dvaStore.getState().LocalSpecialtyModel.allSpecialtyList)
        return (
            
               <View style={{flex:1,width,}}>
                {
                   this.props.dataSource && this.props.dataSource.length>0 && 
                     <View style={{flex:1,width,height:100,flexDirection:'row',backgroundColor:'#fff'}}>
                        {
                            this.props.dataSource.map((item,index)=>{
                                const arrImg = [require(`../../../../images/specialty0.png`),require(`../../../../images/specialty1.png`),require(`../../../../images/specialty2.png`)]
                                return (
                                    <TouchableOpacity style={styles.btn} onPress={() => {
                                        console.log(item.regionId);
                                        this.props.dispatch(NavigationUtils.navigateAction("CharaPage", {regionId: item.regionId}));
                                    }}>
                                        <ImageBackground 
                                        style={styles.imgStyle}
                                        source={arrImg[index]}>
                                        <Text style={styles.txt}>{item.simpleName}</Text>
                                        </ImageBackground>
                                        <Text numberOfLines={1} style={styles.text}>{item.regionName}</Text>
                                    </TouchableOpacity> 
                                )
                            })
                        }
                            <TouchableOpacity style={styles.btn}
                              onPress={()=>{
                                  const show = this.state.show;
                                  this.setState({show:!show});
                                  this.props.dispatch({
                                    type: 'LocalSpecialtyModel/getAllSpecialty',
                                    payload: {},
                                    callback: () => {
                                        if(this.props.allSpecialtyList){
                                            this.setState({data:this.props.allSpecialtyList})
                                        }
                                        
                                    }
                                });
                                }}
                             >
                                <ImageBackground 
                                style={styles.imgStyle}
                                source={require('../../../../images/specialtyMore.png')}>
                                </ImageBackground>
                                <Text  numberOfLines={1} style={styles.text}>更多特产</Text>
                            </TouchableOpacity>
                            
                     </View>
                }
                
             
                 <Modal
                    // 设置Modal组件的呈现方式
                    animationType='fade'
                    // 它决定 Modal 组件是否是透明的
                    transparent
                    // 它决定 Modal 组件何时显示、何时隐藏
                    visible={this.state.show}
                    // 当 Modal组件在屏幕上完成显示后，这个回调函数将被执行
                    onShow={() =>  Log('onShow')  }
                    // 这是 Android 平台独有的回调函数类型的属性
                    // 开发者必须要写一个函数来处理当 Modal 显示在界面时且android物理返回键被按下时的业务逻辑
                    onRequestClose={() => Log('onShow')}
                >
                  <View style={{width: '100%', height: Platform.OS === 'ios' ? height : height - StatusBar.currentHeight,position:'relative'}}>
                    <TouchableOpacity
                        style={{position: 'absolute', top: 0, left: 0,
                                width: '100%', height,}}
                        activeOpacity={0.4} onPress={() => this.setState({show: false})}>
                        <View style={{position: 'absolute', top: 0, left: 0, width: '16%',backgroundColor:'rgba(0,0,0,0.5)',
                            height,}}></View>
                    </TouchableOpacity>
                    <View style={{height, width: '84%',position:'absolute',right:0,top:0,
                            backgroundColor: '#eee', }}>
                        <NavBar title={'全部特产场馆'} defaultBack={false} leftFun={()=>{
                            this.setState({show:false});
                        }}/>
                    
                        <View style={{width,height,marginTop:20,backgroundColor:'#fff'}}>
                             <View style={{backgroundColor:'#eee',flex:1,marginRight:4,height}}>
                                 <Text style={{marginLeft:10,marginTop:10,color:'#666'}}>全国地区</Text>
                                 <View style={{marginTop:10,flexWrap: 'wrap',flexDirection:'row',width: '84%',height}}>
                                     {
                                         this.state.data && this.state.data.length>0 && this.state.data.map((item,index)=>{
                                             return (
                                                <View>
                                                    <TouchableOpacity
                                                    style={[{marginLeft:6,marginRight:6,marginTop: 8,paddingLeft:10,paddingRight:10,height:28,flexWrap: 'wrap',borderRadius:6,backgroundColor:'#fff'},this.state.index == index?{backgroundColor:'#2979FF',}:{backgroundColor:'#fff'}]}
                                                    onPress={()=>{
                                                        this.setState({show:false,index:index});
                                                        this.props.dispatch(NavigationUtils.navigateAction("CharaPage", {regionId: item.regionId}));
                                                    }}>
                                                        <Text style={[{fontSize:12,height:28,lineHeight:28,textAlign:'center'},this.state.index == index?{color:'#fff'}:{color:'#333'}]}>{item.regionName}</Text>
                                                    </TouchableOpacity>
                                                </View> 
                                                
                                             )
                                         })
                                     }
                                    
                                 </View>
                             </View>
                        </View>
                    </View>
                   </View>
                </Modal> 
                
              </View>
           
        )
   }

   

}


const styles = StyleSheet.create({
    imgStyle: {
        width:40,
        height:40,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn: {
        flex:1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    txt: {
        color:'#fff',
        textAlign:'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    text: {
        color: Color.GREY_2,
        fontSize: Font.NORMAL_1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        // paddingBottom: 10,
        height: 40,
        // paddingTop: 10,
        backgroundColor: '#fff',
    },
});
