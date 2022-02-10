import React from 'react';
import {View, Text, Image,TouchableOpacity} from 'react-native';
import {px, width} from "../../../../utils";
import {NavigationUtils} from "../../../../dva/utils";
import {connect} from "react-redux";

@connect()
export default class PreSaleProduct extends React.PureComponent {

  render() {
    const item = this.props.item;
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={()=> {
          this.props.dispatch(NavigationUtils.navigateAction("GoodsDetail", {
            productId: item.productId,
            productFullName: item.productName,
            swiperImg: item.imageUrl,
            price: item.price,
          }));
        }}
        style={{width: width, flexDirection: 'row', backgroundColor: '#fff',padding:px(15)}}>
        <Image
          resizeMode='stretch'
          style={{width: px(130), height: px(120)}}
          source={{uri: item.imageUrl}}
        />
        <View style={{flex:1, justifyContent: 'space-between',marginLeft:px(10)}}>
          <Text style={{fontSize: px(15)}}>{item.productName}</Text>
          <View style={{flexDirection: 'row',alignItems: 'center'}}>
            <Text style={{fontSize: px(15)}}>订金</Text>
            <Text style={{color:'#F40',textAlign:'center'}}>{`￥${item.advance}`}</Text>
            <Text style={{fontSize:px(12),color:'#999',marginLeft:px(10)}}>{`商城价：${item.price}`}</Text>
          </View>

          <View
            style={{
             height: px(30), borderRadius: px(30),width:px(80),marginLeft:px(100),
            backgroundColor: '#2979ff', justifyContent: 'center', alignItems: 'center',
          }}>
            <Text style={{
              fontWeight: 'bold',
              fontSize: px(14), color: '#fff',
            }}>立即预订</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}
