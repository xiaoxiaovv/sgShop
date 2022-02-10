///<reference path="../../../../../node_modules/@types/react-redux/index.d.ts"/>
import * as React from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    ImageBackground,
    View, ScrollView,
    TouchableOpacity, Modal
} from 'react-native';


import { createAction,connect,px } from '../../../../utils';
import { ICustomContain ,INavigation} from '../../../../interface/index';
import {NavigationUtils} from '../../../../dva/utils';
import SecondTitle from '../../../../components/SecondTitle';
import Separator from '../../../../components/Separator';
import URL from './../../../../config';

let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

@connect(({users}) =>
    ({...users}))
class CrowdFunding extends React.Component<INavigation&ICustomContain&{dataSource:any}>{
   private static defaultProps = {
     dataSource:{} //{[],[],[]}
   } ;
   constructor(props){
        super(props);

   }
   componentWillMount(){
   }
   componentDidMount(){

   }
   public render():JSX.Element {
       console.log('CrowdFunding',this.props.from)
        return (
            <View style={{flex:1,width}}>
                  <View style={{width,backgroundColor:'#fff'}}>
                        {/* 头部 */}
                        <SecondTitle title='众筹'
                         onMorePress={()=>{
                             this.props.dispatch(NavigationUtils.navigateAction("CorwdList",{from:this.props.from}));}
                         }

                        />
                        {/* 内容 */}
                        <View>
                            {/* 立即支持 */}
                            {
                                this.props.dataSource.zcnow && this.props.dataSource.zcnow.length>0 && this.props.dataSource.zcnow.map((item,index)=>{
                                    return (
                                        <View>
                                            <ImageBackground
                                                //resizeMode='contain'
                                                style={styles.imgH}
                                                source={{uri:item.customImage==null?item.imageUrl:item.customImage}}
                                            >
                                                <Text style={{color:'#fff',backgroundColor:'red',width:180,height:20,fontSize:12,lineHeight:20,paddingLeft:6}}>剩余时间:{item.toEndTime}</Text>
                                            </ImageBackground>
                                            <View style={{flexDirection:'row',width,}}>
                                                <View style={{marginTop:8,marginLeft:6,flex:1,marginBottom:10,flexDirection: 'row'}}>
                                                    <View style={{flex:1}}>
                                                        <Text numberOfLines={1} style={{fontSize:12,alignSelf: 'center'}}>{item.activityName}</Text>
                                                        <View style={{backgroundColor:'#e4e4e4',height:12,borderRadius:8, marginTop:6, flex:1,overflow:'hidden'}}>
                                                            <View style={{width:''+Math.ceil((item.raisedAmount/item.targetAmount)*100)+'%',height:12,borderRadius:50,backgroundColor:'#F40'}}></View>
                                                        </View>
                                                    </View>
                                                    <Text numberOfLines={1} style={{fontSize:12,marginLeft:10,marginRight:10, alignSelf: 'flex-end',}}>{`${Math.ceil(parseFloat(item.schedule))}%`}</Text>
                                                </View>
                                                <TouchableOpacity onPress={()=>{
                                                    // this.props.dispatch(NavigationUtils.navigateAction('ArrivalDetail', {zActivityId: item.id}));

                                                    this.props.dispatch(NavigationUtils.navigateAction('CustomWebView', {
                                                        customurl: `${URL.SHARE_HOST}/crowd_funding_details/${item.id}/${this.props.mid}`,
                                                        flag: true,
                                                        headerTitle: '众筹详情',
                                                        callBack: () => {
                                                        },
                                                    }));


                                                }} style={{width:80,height:28,borderRadius:17,backgroundColor:'#F40',marginRight:10,marginTop:8,justifyContent:'center',alignItems:'center'}}>
                                                    <Text style={{fontSize:14,color:'#fff'}}>立即支持</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <Separator style={styles.line}/>
                                            <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',flex:1,marginBottom:10,marginTop:8}}>
                                                <View style={{justifyContent:'center',alignItems:'center'}}>
                                                    <Text style={{color:'#333',fontSize:12,textAlign:'center'}}>{item.targetAmount}</Text>
                                                    <Text style={{color:'#999',fontSize:12,textAlign:'center',paddingTop:4}}>目标金额</Text>
                                                </View>
                                                <Separator style={styles.verticalLine}/>
                                                <View style={{justifyContent:'center',alignItems:'center'}}>
                                                    <Text style={{color:'#333',fontSize:12,textAlign:'center'}}>{item.raisedAmount}</Text>
                                                    <Text style={{color:'#999',fontSize:12,textAlign:'center',paddingTop:4}}>已筹金额</Text>
                                                </View>
                                                <Separator style={styles.verticalLine}/>
                                                <View style={{justifyContent:'center',alignItems:'center'}}>
                                                    <Text style={{color:'#333',fontSize:12,textAlign:'center'}}>{item.supportNum}</Text>
                                                    <Text style={{color:'#999',fontSize:12,textAlign:'center',paddingTop:4}}>支持人数</Text>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                            {/* 预约 */}
                            {
                                 this.props.dataSource.zcpre && this.props.dataSource.zcpre.length>0 && this.props.dataSource.zcpre.map((item,index)=>{
                                    return (
                                        <View style={{marginTop:6}}>
                                            <ImageBackground
                                                //resizeMode='contain'
                                                style={styles.imgH}
                                                source={{uri:item.customImage==null?item.imageUrl:item.customImage}}
                                            >
                                                <Text style={{color:'#fff',backgroundColor:'#02AD58',width:180,height:20,fontSize:12,lineHeight:20,paddingLeft:6}}>开始倒计时:{item.toStartTime}</Text>
                                            </ImageBackground>
                                            <View style={{flexDirection:'row',width,}}>
                                                <View style={{marginTop:8,marginLeft:6,flex:1,marginBottom:10, flexDirection: 'row'}}>
                                                    <View style={{flex:1}}>
                                                        <Text numberOfLines={1} style={{fontSize:12, alignSelf: 'center'}}>{item.activityName}</Text>
                                                        <View style={{backgroundColor:'#e4e4e4',height:12,borderRadius:8,flex:1,marginTop:6}}/>
                                                    </View>
                                                    <Text style={{fontSize:12,marginLeft:10,marginRight:10, alignSelf: 'flex-end'}}>未开始</Text>
                                                </View>
                                                <TouchableOpacity  onPress={()=>{
                                                    this.props.dispatch(NavigationUtils.navigateAction('CustomWebView', {
                                                        customurl: `${URL.SHARE_HOST}/crowd_funding_details/${item.id}/${this.props.mid}`,
                                                        flag: true,
                                                        headerTitle: '众筹详情',
                                                        callBack: () => {
                                                        },
                                                    }));
                                                }}  style={{width:80,height:28,borderRadius:17,backgroundColor:'#02AD58',marginRight:10,marginTop:8,justifyContent:'center',alignItems:'center'}}>
                                                    <Text style={{fontSize:14,color:'#fff'}}>预热中</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <Separator style={styles.line}/>
                                            <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',flex:1,marginBottom:10,marginTop:8}}>
                                                <View style={{justifyContent:'center',alignItems:'center'}}>
                                                    <Text style={{color:'#333',fontSize:12,textAlign:'center'}}>{item.targetAmount}</Text>
                                                    <Text style={{color:'#999',fontSize:12,textAlign:'center',paddingTop:4}}>目标金额</Text>
                                                </View>
                                                <Separator style={styles.verticalLine}/>
                                                <View style={{justifyContent:'center',alignItems:'center'}}>
                                                    <Text style={{color:'#333',fontSize:12,textAlign:'center'}}>{item.raisedAmount}</Text>
                                                    <Text style={{color:'#999',fontSize:12,textAlign:'center',paddingTop:4}}>已筹金额</Text>
                                                </View>
                                                <Separator style={styles.verticalLine}/>
                                                <View style={{justifyContent:'center',alignItems:'center'}}>
                                                    <Text style={{color:'#333',fontSize:12,textAlign:'center'}}>{item.supportNum}</Text>
                                                    <Text style={{color:'#999',fontSize:12,textAlign:'center',paddingTop:4}}>支持人数</Text>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                            {/* 成功 */}
                            {
                              this.props.dataSource.zcold && this.props.dataSource.zcold.length>0 && this.props.dataSource.zcold.map((item,index)=>{
                                    return (
                                        <View style={{marginTop:6}}>
                                            <ImageBackground
                                                //resizeMode='contain'
                                                style={styles.imgH}
                                                source={{uri:item.customImage==null?item.imageUrl:item.customImage}}
                                            >
                                            </ImageBackground>
                                            <View style={{flexDirection:'row',width,}}>
                                                <View style={{marginTop:12,marginLeft:6,flex:1,marginBottom:12, flexDirection:'row'}}>
                                                    <View style={{flex:1,marginRight:6}}>
                                                        <Text numberOfLines={1} style={{fontSize:12,alignSelf: 'center'}}>{item.activityName}</Text>
                                                        <View style={{backgroundColor:'#e4e4e4',height:12,borderRadius:8,flex:1,marginTop:6,overflow:'hidden'}}>
                                                            <View style={{flex:1,height:12,borderRadius:50,backgroundColor:'#F40'}}/>
                                                        </View>
                                                    </View>
                                                    <Text numberOfLines={1} style={{fontSize:12,textAlign:'center',paddingLeft:6,alignSelf:'flex-end'}}>{`${Math.ceil(parseFloat(item.schedule))}%`}</Text>
                                                </View>
                                                <TouchableOpacity  onPress={()=>{
                                                    this.props.dispatch(NavigationUtils.navigateAction('CustomWebView', {
                                                        customurl: `${URL.SHARE_HOST}/crowd_funding_details/${item.id}/${this.props.mid}`,
                                                        // flag: true,
                                                        headerTitle: '众筹详情',
                                                        callBack: () => {
                                                        },
                                                    }));
                                                }}  style={{width:80,height:28,borderRadius:17,backgroundColor:'#F43531',marginRight:10,marginTop:8,justifyContent:'center',alignItems:'center'}}>
                                                    <Text style={{fontSize:14,color:'#fff'}}>众筹成功</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <Separator style={styles.line}/>
                                            <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',flex:1,marginBottom:10,marginTop:8}}>
                                                <View style={{justifyContent:'center',alignItems:'center'}}>
                                                    <Text style={{color:'#333',fontSize:12,textAlign:'center'}}>{item.targetAmount}</Text>
                                                    <Text style={{color:'#999',fontSize:12,textAlign:'center',paddingTop:4}}>目标金额</Text>
                                                </View>
                                                <Separator style={styles.verticalLine}/>
                                                <View style={{justifyContent:'center',alignItems:'center'}}>
                                                    <Text style={{color:'#333',fontSize:12,textAlign:'center'}}>{item.raisedAmount}</Text>
                                                    <Text style={{color:'#999',fontSize:12,textAlign:'center',paddingTop:4}}>已筹金额</Text>
                                                </View>
                                                <Separator style={styles.verticalLine}/>
                                                <View style={{justifyContent:'center',alignItems:'center'}}>
                                                    <Text style={{color:'#333',fontSize:12,textAlign:'center'}}>{item.supportNum}</Text>
                                                    <Text style={{color:'#999',fontSize:12,textAlign:'center',paddingTop:4}}>支持人数</Text>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                   </View>

            </View>
        )
   }

}

const styles = StyleSheet.create({
    line: {
        height:1,
    },
    verticalLine: {
        height:20.7,
        width: 1,
    },
    imgH: {
        height:px(140),
        width,
    },
});

export default CrowdFunding;