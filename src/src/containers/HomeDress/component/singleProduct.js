import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, ImageBackground} from 'react-native';
import {width, px,} from "../../../utils";


export default class SingleProduct extends React.Component {

  render() {
    const product = this.props.product;
    return (
      <TouchableOpacity onPress={() => this.props.onItemPress && this.props.onItemPress(product)}>
        <ImageBackground
          resizeMode='contain'
          source={{uri: product.imageUrl?product.imageUrl:''}}
          style={{width: width, height: px(180), backgroundColor: '#fff'}}>
          <Text style={{
            paddingHorizontal: px(20),
            color:'#fff',
            marginTop: px(140),
            backgroundColor: 'rgba(0,0,0,0.35)',
            width: width, height: px(40), textAlign: 'left',
            lineHeight: px(40),
          }}>{product.title}</Text>
        </ImageBackground>
        <View style={{width: width, height: px(50),justifyContent:'center'}}>
          <Text
            numberOfLines={2}
            style={{
              fontSize: px(12),
              paddingHorizontal: px(20),
              textAlign: 'left'
            }}>{product.describe}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({});
