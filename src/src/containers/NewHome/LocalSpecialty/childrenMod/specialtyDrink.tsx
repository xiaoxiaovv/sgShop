import * as React from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    ImageBackground,
    View, ScrollView,
    TouchableOpacity, Modal,TouchableWithoutFeedback
} from 'react-native';


import {cutImgUrl, px} from '../../../../utils';
import {bannerClick, goBanner} from '../../../../utils/tools';
import { ICustomContain ,INavigation} from '../../../../interface/index';
import ScreenUtil from '../../../Home/SGScreenUtil';
import Swiper from 'react-native-swiper';
import SecondTitle from '../../../../components/SecondTitle';

import URL from './../../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

class SpecialtyDrink extends React.Component<INavigation&ICustomContain&{dataSource:any}>{
   private static defaultProps = {
     dataSource:{} 
   } ;
   constructor(props){
        super(props);

   }
   componentWillMount(){
   }
   componentDidMount(){
      
   }
   public render():JSX.Element {
        console.log(this.props)
        return (
            <View style={{flex:1,width,backgroundColor:'#fff'}}>
               {/* 头部 可编辑 */}
               {
                   IS_NOTNIL(this.props.dataSource.moduleTitle) && 
                   <SecondTitle title={this.props.dataSource.moduleTitle}/>
               }
               {/* 内容 */}
               <View style={{width,}}>
                   {/* 一张banner */}
                   {
                       IS_NOTNIL(this.props.dataSource.topBanner) && this.props.dataSource.topBanner.pic &&
                       <TouchableOpacity 
                          style={styles.imgHW} 
                          onPress={()=>goBanner(this.props.dataSource.topBanner, this.props.navigation)}
                       >
                            <Image 
                                resizeMode='contain'
                                style={styles.imgHW} 
                                source={{uri:this.props.dataSource.topBanner.pic}}
                            />
                        </TouchableOpacity>
                   }
                   
                   {/* 轮播 */}
                   {
                    IS_NOTNIL(this.props.dataSource.bannerList) && this.props.dataSource.bannerList.length!=0 ?
                   <View style={{ width: ScreenUtil.ScreenWidth, height: 260 * ScreenUtil.ScaleX, flex: 1,marginTop:8}}>
                       <Swiper
                           autoplay={true}
                           loop={true}
                           observer={true}
                           observeParents={false}
                           autoplayTimeout={3}
                           pagingEnabled={true}
                           showsPagination={true}
                           paginationStyle={{bottom: 10}}
                           dot={<View style={{
                               backgroundColor: 'rgba(255,255,255,.5)',
                               width: 7,
                               height: 7,
                               borderRadius: 3.5,
                               marginRight: 8,
                           }}/>}
                           activeDot={<View style={{
                               backgroundColor: '#FFFFFF',
                               width: 9,
                               height: 9,
                               borderRadius: 4.5,
                               marginRight: 8,
                           }}/>}
                       >
                           {
                               this.props.dataSource.bannerList &&
                               this.props.dataSource.bannerList.map((item,i)=>{
                                   return (
                                       <View key={i} style={styles.imageViewStyle}>
                                           <TouchableWithoutFeedback onPress={() => goBanner(item[0], this.props.navigation)}>
                                               <View style={styles.LeftView}>
                                                   {
                                                       IS_NOTNIL(item[0]) ? <Image resizeMode='stretch' source={{ uri: cutImgUrl(item[0].pic, 360 * ScreenUtil.ScaleX, 520 * ScreenUtil.ScaleX, true) }} style={styles.leftImg} /> : <View style={styles.leftImg}></View>
                                                   }
                                               </View>
                                           </TouchableWithoutFeedback>
                                           <View style={styles.rightView}>
                                               <TouchableWithoutFeedback onPress={() => goBanner(item[1], this.props.navigation)}>
                                                   {
                                                       IS_NOTNIL(item[1]) ? <Image resizeMode='stretch' source={{ uri: cutImgUrl(item[1].pic, 326 * ScreenUtil.ScaleX, 258 * ScreenUtil.ScaleX, true) }} style={styles.topImg} /> : <View style={styles.topImg}></View>
                                                   }
                                               </TouchableWithoutFeedback>
                                               <TouchableWithoutFeedback onPress={() => goBanner(item[2], this.props.navigation)}>
                                                   {
                                                       IS_NOTNIL(item[2]) ? <Image resizeMode='stretch' source={{ uri: cutImgUrl(item[2].pic, 326 * ScreenUtil.ScaleX, 258 * ScreenUtil.ScaleX, true) }} style={styles.bottomImg} /> : <View style={styles.bottomImg}></View>
                                                   }
                                               </TouchableWithoutFeedback>
                                           </View>
                                       </View>
                                   )
                               })
                           }
                       </Swiper>
                   </View>
                   :
                   null
                  }
               </View>
                
            </View>
        )
   }
   

}

const styles = StyleSheet.create({
    Container: {
        alignItems: 'center',  // 使元素垂直居中排布, 当flexDirection为column时, 为水平居中
      },
      imageViewStyle: {
        // 在安卓上如果不设置Swiper中item的的宽度,则轮播图不显示
        width: ScreenUtil.ScreenWidth,
        flexDirection: 'row',
        alignItems: 'center',
      },
      LeftView: {
        flex: 1,
        alignItems: 'center',
        marginLeft: ScreenUtil.scaleSize(4),
        marginRight: 4,
      },
      leftImg: {
        width: 180 * ScreenUtil.ScaleX,
        height: 260 * ScreenUtil.ScaleX,
      },
      rightView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: ScreenUtil.scaleSize(4),
      },
      topImg: {
        width: 181 * ScreenUtil.ScaleX,
        height: 129 * ScreenUtil.ScaleX,
        marginBottom: 1,
      },
      bottomImg: {
        width: 181 * ScreenUtil.ScaleX,
        height: 129 * ScreenUtil.ScaleX,
      },
    line: {
        width: 40,
        height:1,
        backgroundColor: '#13DBEB',
    },
    imgHW: {
        width,
        height:px(160),
    }
});

export default SpecialtyDrink;