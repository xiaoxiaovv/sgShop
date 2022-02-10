import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {width, px,} from "../../../utils";

export default class Title extends React.Component {

  static defaultProps = {
    title: '商品',
    titleColor: '#000',
  }

  render() {
    return (
      <View style={[{
        marginTop:px(10),
         backgroundColor: '#fff',
        flexDirection: 'row', justifyContent: 'center', width: width, height: px(40)
      },this.props.containerStyle]}>
        <Text style={{
          marginVertical: px(10),
          color: this.props.titleColor
        }}>{` ——    ${this.props.title}   ——`}</Text>
        {this.props.onMorePress&&<TouchableOpacity
          onPress={() => {
            this.props.onMorePress && this.props.onMorePress(this.props.item)
          }}
          style={{
            position: 'absolute',
            right:px(10),
            top:px(15),
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            }}>
          <Text style={{color: this.props.titleColor,fontSize:px(10)}}>更多</Text>
          <Image
            resizeMode='stretch'
            style={{width: px(10), height: px(10), marginLeft: px(5),tintColor:this.props.titleColor}}
            source={require('./../../../images/toseemorered.png')}/>
        </TouchableOpacity>}
      </View>

    )
  }
}

const styles = StyleSheet.create({});
