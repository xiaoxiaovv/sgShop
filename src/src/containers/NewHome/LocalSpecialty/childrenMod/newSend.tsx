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


import { createAction,connect,createIdAction,px } from '../../../../utils';
import { ICustomContain ,INavigation} from '../../../../interface/index';
import { goBanner ,goGoodsDetail} from '../../../../utils/tools';
import Countdown from '../../../../components/Countdown';
import SecondTitle from '../../../../components/SecondTitle';


import URL from './../../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

class NewSend extends React.Component<INavigation&ICustomContain&{dataSource:any}>{
   private static defaultProps = {
     dataSource:[]
   } ;
   private timer?:any;
   constructor(props){
        super(props);
        
   }
   componentWillMount(){
   }
   componentDidMount(){
      
   }
   public render():JSX.Element {
    console.log(this.props)
    let TT = (Math.floor(new Date().getTime()/1000))*1000;
        return (
            <View style={{flex:1,width}}>
               <View style={{width,backgroundColor:'#fff'}}>
                   {/* 头部 */}
                   <SecondTitle title='新品预约'
                        onMorePress={()=>{
                            this.props.navigation.dispatch(createAction('router/apply')
                            ({type: 'Navigation/NAVIGATE', routeName: 'NewReservations'}))
                        }}
                    />
                   {/* 内容 */}
                    <View>
                        {
                            this.props.dataSource && this.props.dataSource.length>0 &&this.props.dataSource.map((item,index,arr)=>{
                                return (
                                    <View key={index}>
                                         <TouchableOpacity  onPress={()=>goGoodsDetail(item.productId)}>
                                            
                                                <ImageBackground 
                                                   //resizeMode='contain'
                                                    style={styles.imgHW}
                                                    source={{uri:item.imageUrl}}>
                                                    {
                                                        item.reserveEndTime && item.reserveEndTime > TT &&
                                                        <View style={{height:20,justifyContent:'center',alignItems:'center',flexDirection:'row',backgroundColor:'red',width:180}}>
                                                            <Text style={{color:'#fff',fontSize:12}}>剩余时间：</Text>
                                                            {!!item.reserveEndTime && item.reserveEndTime > TT * 1 &&
                                                                    <Countdown
                                                                       timeDiff={item.reserveEndTime - TT}  
                                                                       stop={() => this.props.dispatch(createAction('LocalSpecialtyModel/getNewAndLimit')()) }
                                                                    />
                                                            }
                                                        </View>
                                                    }
                                                    
                                                </ImageBackground>
                                           
                                            <View style={{marginTop:8}}>
                                                <Text style={{fontSize:14,width,paddingLeft:8,paddingRight:8}}>{item.productName}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{marginBottom:10,marginTop:14,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                                            <View style={{marginLeft:14}}>
                                                <View style={{flexDirection:'row',alignItems:'center',}}>
                                                    <Text style={{fontSize:14,marginRight:6}}>预约价:</Text>
                                                    <Text style={{color:'#f40',fontSize:24}}>¥{item.price}</Text>
                                                </View>
                                                <View style={{flexDirection:'row',alignItems:'center',}}>
                                                    <Text style={{fontSize:14,color:'#999',marginRight:6}}>已预约:</Text>
                                                    <Text style={{color:'#999',fontSize:12}}>{item.reserveNum}</Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity
                                                style={{width:100,height:34,justifyContent:'center',alignItems:'center',backgroundColor:'#2979ff',marginRight:20,borderRadius:17}}
                                                onPress={()=>goGoodsDetail(item.productId)}
                                            >
                                                <Text style={{color:'#fff',fontSize:14}}>立即预约</Text>
                                            </TouchableOpacity>
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
        width: 40,
        height:1,
        backgroundColor: '#3DCF78',
    },
    imgHW:{
      width,
      height:px(180)
    },
});

export default NewSend;