import * as React from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    ImageBackground,
    View, ScrollView,
    TouchableOpacity, Modal,FlatList
} from 'react-native';


import {createAction, connect, px, cutImgUrl} from '../../../../utils';
import { ICustomContain ,INavigation} from '../../../../interface/index';
import ScreenUtil from '../../../Home/SGScreenUtil';
import Color from '../../../../consts/Color';
import StorePrice from '../../../Home/StorePrice';
import { goBanner ,goGoodsDetail} from '../../../../utils/tools';
import { toFloat } from '../../../../utils/MathTools';
import SecondTitle from '../../../../components/SecondTitle';

import URL from './../../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

const mapStateToProps =(
   { users: {mid: storeId, isLogin, isHost, CommissionNotice}
    }
     )=>(
         {isLogin, isHost, CommissionNotice}
        );

@connect(mapStateToProps)
class SpecialtyFood extends React.Component<INavigation&ICustomContain&{dataSource:any}>{
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
        return (
            <View style={{flex:1,width,backgroundColor:'#fff'}}>
               {/* 头部 可编辑 */}
               {
                   IS_NOTNIL(this.props.dataSource.moduleTitle) && 
                   <SecondTitle title={this.props.dataSource.moduleTitle}/>
               }
               <View style={{width,}}>
               {/* 一张banner */}
                   {
                       IS_NOTNIL(this.props.dataSource.topBanner) && this.props.dataSource.topBanner.pic &&
                       <TouchableOpacity 
                          style={{width,}} 
                          onPress={()=>goBanner(this.props.dataSource.topBanner, this.props.navigation)}
                       >
                            <Image 
                                resizeMode='contain'
                                style={styles.imgHW} 
                                source={{uri:this.props.dataSource.topBanner.pic}}
                            />
                        </TouchableOpacity>
                   }
                    {(this.props.dataSource.productList && this.props.dataSource.productList.length !== 0) &&
                    <View style={{ flex: 1 }}>
                        {/* 楼层商品 */}
                        <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        style={styles.flatListStyle}
                        data={this.props.dataSource.productList}
                        keyExtractor={(item, index) => ('index' + index + item)}
                        renderItem={({ item }) => (
                            <TouchableOpacity activeOpacity={0.7} onPress={() => goGoodsDetail(item.id)}>
                            <View key={item.id} style={styles.item}>
                                <Image style={styles.imgStyle} resizeMode='contain' source={{ uri: cutImgUrl(item.imageUrl, 450, 450, true)}}/>
                                <View style={styles.titleContainer}><Text numberOfLines={2} style={styles.titleStyle}>{item.name}</Text></View>
                                <Text style={styles.priceStyle}>{'¥' + toFloat(item.price)}</Text>
                                {
                                (this.props.isHost > 0 && this.props.CommissionNotice) && <StorePrice commission={item.commission} />
                                }
                            </View>
                        </TouchableOpacity>
                        )}
                        getItemLayout={(data, index) => (
                            // 101 是被渲染 item 的高度/宽度(水平滑动的话) ITEM_HEIGHT。
                            { length: ScreenUtil.scaleSize(101), offset: (ScreenUtil.scaleSize(101 + 10)) * index, index }
                        )}
                        />
                    </View>
                        }
               </View>
                
            </View>
        )
   }

}

const styles = StyleSheet.create({
    Container: {
        alignItems: 'center',
      backgroundColor: 'white',
      // marginLeft: 10,
      // marginRight: 10,
    },
wrapper: {
        marginTop: ScreenUtil.scaleSize(10),
    },
wrapper_img: {
        width: ScreenUtil.ScreenWidth,
      height: ScreenUtil.scaleSize(187),
    },
flatListStyle: {
      marginTop: ScreenUtil.scaleSize(10),
      marginBottom: ScreenUtil.scaleSize(14),
      marginLeft: ScreenUtil.scaleSize(10),
      marginRight: ScreenUtil.scaleSize(4),
    },
item: {
  alignItems: 'center',
  marginRight: ScreenUtil.scaleSize(6),
  width: (width - 20) / 3.5,
},
imgStyle: {
  width: (width - 38) / 3.5,
  height: (width - 38) / 3.5,
},
titleContainer: {
  marginTop: ScreenUtil.scaleSize(5),
  minHeight: ScreenUtil.scaleSize(30),
  justifyContent: 'center',
},
titleStyle: {
      maxWidth: (width - 38) / 3.5,
      textAlign: 'center',
      fontSize: ScreenUtil.scaleText(13),
      lineHeight: ScreenUtil.scaleText(15),
      color: '#333333',
      fontFamily: '.PingFangSC-Regular',
},
priceStyle: {
      marginTop: ScreenUtil.scaleSize(10),
      fontSize: ScreenUtil.scaleText(15),
      lineHeight: ScreenUtil.scaleText(15),
      color: '#FF6026',
      fontFamily: '.PingFangSC-Regular',
},
zPriceStyle_box: {
        alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: ScreenUtil.scaleSize(7),
    },
zPriceStyle: {
        marginLeft: ScreenUtil.scaleSize(5),
      marginRight: ScreenUtil.scaleSize(5),
      marginTop: ScreenUtil.scaleSize(2.5),
      marginBottom: ScreenUtil.scaleSize(2.5),
      fontSize: ScreenUtil.scaleText(11),
      lineHeight: ScreenUtil.scaleText(11),
      color: '#FFFFFF',
      fontFamily: '.PingFangSC-Regular',
      backgroundColor: 'transparent',
    },
    line: {
        width: 40,
        height:1,
        backgroundColor: '#E66CE9',
    },
    imgHW: {
        flex: 1,
        width,
        height:px(160),
    }
});

export default SpecialtyFood;