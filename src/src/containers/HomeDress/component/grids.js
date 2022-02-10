import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {width, px,} from "../../../utils";

const margin = px(6);

export default class Grids extends React.Component {

  static defaultProps = {
    products: [],
    horizeNum: 2,//默认横向item数
  }

  render() {

    const cellWith = Math.floor(width / this.props.horizeNum);
    return (
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: width,
        marginLeft:px(3),
      }}>
        {this.props.products.map((cell, index) => {
          if (index > 3) return null;
          return (
            <TouchableOpacity
              onPress={() => {
                this.props.onItemPress && this.props.onItemPress(cell)
              }}
              key={index} style={{
                alignItems:'center',justifyContent:'center',backgroundColor:'#fff',
                width: cellWith-margin, height: cellWith , margin: margin/4}}>
              <Image
                resizeMode='contain'
                source={{uri: cell.imageUrl}}
                style={{width: px(150), height: px(150)}}/>
            </TouchableOpacity>
          )
        })
        }
      </View>
    )
  }
}

