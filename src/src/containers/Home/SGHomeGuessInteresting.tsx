import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  NativeModules  // 这种按钮点击没有透明度变化
} from 'react-native';
import ScreenUtil from './SGScreenUtil';
import PropTypes from 'prop-types';
import { ICommonInterface} from './HomeInterface';
import SectionTitle from './SectionTitle';
import { postAppJSON } from '../../netWork';
import { goGoodsDetail } from '../../utils/tools';
import { keepInt, keepFloat } from '../../utils/MathTools';
import StorePrice from './StorePrice';
import {Color} from 'consts';
import FooterView from '../../components/FooterView';
import { width } from '../../utils';

interface IGuessInterface {
  topicTitle: string;
}
export default class HomeGuessInteresting extends Component<ICommonInterface & IGuessInterface> {
  public render(): JSX.Element {
      const { isHost, rid} = this.props;
      return (
              <FlatList
                showsVerticalScrollIndicator={false}
                horizontal={false}
                style={styles.flatListStyle}
                // 两列显示
                numColumns ={2}
                // columnWrapperStyle={{}}
                data={this.props.dataSource}
                keyExtractor = {(item, index) => ('index' + index + item)}
                renderItem={({item}) => (
                        <TouchableOpacity activeOpacity={1} onPress={()=>this.MdAndgoGoodsDetail(item.productId, undefined, item.productName, undefined, item.price, item.pic,rid,item.sku)}>
                          <View style={styles.item_Box}>
                              <Image style={styles.imgStyle} source={{uri: cutImgUrl(item.defaultImageUrl, 360, 360, true)}}></Image>
                              <View style={styles.productNameContainer}>
                                <Text numberOfLines={2}
                                      style={{fontSize: ScreenUtil.scaleText(13), lineHeight: ScreenUtil.scaleText(15),
                                              alignSelf: 'flex-start', maxWidth: 171 * ScreenUtil.ScaleX }}>{item.productFullName}</Text>
                              </View>
                              <View style={styles.bottom_Box}>
                                <View style={styles.price_styleBox}>
                                  <Text numberOfLines={1}
                                        style={{fontSize: ScreenUtil.scaleText(15), color: Color.ORANGE_1}}>
                                        {'￥' + item.finalPrice}</Text>
                                </View>
                                {(isHost > 0 && this.props.CommissionNotice) ? (
                                    IS_NOTNIL(item.commission) ? <View style={styles.price_styleBox}>
                                    <View style={styles.zhuan_Box}>
                                      <Text style={styles.zhuan_Text}>赚</Text>
                                    </View>
                                    <Text style={{fontSize: ScreenUtil.scaleText(15), color: Color.ORANGE_1}}>￥{keepInt(item.commission)}<Text style={{fontSize: ScreenUtil.scaleText(12), color: Color.ORANGE_1}}>{keepFloat(item.commission)}</Text></Text>
                                  </View>:<View style={styles.price_styleBox}>
                                        <Text style={{fontSize: ScreenUtil.scaleText(15), color: Color.ORANGE_1}}>佣金计算中</Text>
                                    </View>)
                                    : 
                                  null
                                  }
                              </View>
                          </View>
                        </TouchableOpacity>
                )}
                ListHeaderComponent={() =>  <SectionTitle title='猜你喜欢' color={Color.BLACK} backgroundColor={Color.WHITE} hasTitle={false}/>}
                getItemLayout={(data, index) => (
                    // 193 是被渲染 item 的高度 ITEM_HEIGHT。
                  {length: ScreenUtil.scaleSize(266), offset: (ScreenUtil.scaleSize(266 + 10)) * index, index}
                )}
                ListFooterComponent={()=>{return<FooterView textContainerStyle={styles.footer}/>}}
              />
      );
  }
  private  MdAndgoGoodsDetail= async (productId,a, productName, b, price,pic,rid,sku) => {
    //baifend 埋点
    const storeIds = await global.getItem('storeId');
    NativeModules.BfendModule.onFeedback([rid,sku],{uid: storeIds.toString() || ''})
    
    goGoodsDetail(productId,a, productName, b, price,pic)
  }
}

const styles = StyleSheet.create({
  flatListStyle: {
    flexDirection: 'column',  // 子元素垂直布局
    width: '100%',
    backgroundColor: '#f4f4f4',
    paddingBottom: ScreenUtil.scaleSize(10),
  },
  item_Box: {
    width: (width - 18)/2,
    height: 241 * ScreenUtil.ScaleX,
    flexDirection: 'column',  // 子元素垂直布局
    alignItems: 'center',  // 使元素垂直居中排布, 当flexDirection为column时, 为水平居中
    marginLeft: ScreenUtil.scaleSize(5),
    marginTop: ScreenUtil.scaleSize(5),
    backgroundColor: '#FFFFFF',
    // borderStyle: 'solid',     // 不设置边框类型在7Pluse有bug
    // borderWidth: 1,
    // borderColor: 'rgba(228, 228, 228, 0.5)',
  },
  imgStyle: {
    width: (width - 18)/2,
    height: 171 * ScreenUtil.ScaleX,
    resizeMode: 'stretch'
  },
  bottom_Box: {
    marginTop: ScreenUtil.scaleSize(6),
    marginLeft: ScreenUtil.scaleSize(8),
    marginRight: ScreenUtil.scaleSize(2),
    marginBottom: ScreenUtil.scaleSize(4),
    flexDirection: 'row',  // 子元素水平布局
    flexWrap: 'wrap' ,  // 允许换行
    width: '100%',
    backgroundColor: 'transparent',
  },
  productNameContainer: {
    marginTop: ScreenUtil.scaleSize(5),
    marginLeft: ScreenUtil.scaleSize(8),
    minHeight: ScreenUtil.scaleSize(30),
    justifyContent: 'center',
    width: 171 * ScreenUtil.ScaleX,
  },
  price_styleBox: {
    height: ScreenUtil.scaleSize(20),
    width: '50%',
    flexDirection: 'row',  // 子元素水平排布(默认垂直排布)
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  zhuan_Box: {
    alignItems: 'center',
    justifyContent: 'center',
    width: ScreenUtil.scaleSize(18),
    height: ScreenUtil.scaleSize(18),
    borderRadius: ScreenUtil.scaleSize(9),
    backgroundColor: Color.ORANGE_1,
    marginRight: 4,
  },
  zhuan_Text: {
    color: Color.WHITE,
    textAlign: 'center',
    fontSize: ScreenUtil.scaleText(11),
  },
  footer: {
    backgroundColor: Color.GREY_6,
},
});
