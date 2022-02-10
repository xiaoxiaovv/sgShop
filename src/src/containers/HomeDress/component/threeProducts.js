import React from 'react';
import {View,TouchableOpacity,Image,StyleSheet} from 'react-native';
import {cutImgUrl, px, width} from "../../../utils";
import Separator from '../../../components/Separator';
import {Color} from 'consts';
import ScreenUtil from "../../Home/SGScreenUtil";

export default class ThreeProducts extends React.PureComponent{

  static defaultProps={
    products:[],
    imageKey:'imgUrl',
  }

  render(){
    const {products} = this.props;
    let top0 = null;
    let top1 = null;
    let top2 = null;
    if (products && products.length > 0) {
      top0 = products.length > 0 ? products[0] : null;
      top1 = products.length > 1 ? products[1] : null;
      top2 = products.length > 2 ? products[2] : null;
    }

    return(
      <View style={[styles.topContainer,this.props.containerStyle]}>
        <TouchableOpacity
          onPress={() => {
            this.props.onItemPress && this.props.onItemPress(top0)
          }}
          >
          <Image
            resizeMode='contain'
            style={styles.top1Image}
            source={{uri: cutImgUrl(top0[this.props.imageKey], 360 * ScreenUtil.ScaleX, 520 * ScreenUtil.ScaleX, true)}}/>

        </TouchableOpacity>
        <View style={styles.twoImageContainer}>
          {top1 ? <TouchableOpacity onPress={() => {
            this.props.onItemPress && this.props.onItemPress(top1)
          }}>
            <Image
              resizeMode='contain'
              style={styles.top2Image}
              source={{uri: cutImgUrl(top1[this.props.imageKey], 326 * ScreenUtil.ScaleX, 258 * ScreenUtil.ScaleX, true)}}/>
          </TouchableOpacity> : null}
          {top1 && top2 && <Separator style={styles.line}/>}
          {top2 ? <TouchableOpacity onPress={() => {
            this.props.onItemPress && this.props.onItemPress(top2)
          }}>
            <Image
              resizeMode='contain'
              style={styles.top2Image}
              source={{uri: cutImgUrl(top2[this.props.imageKey], 326 * ScreenUtil.ScaleX, 258 * ScreenUtil.ScaleX, true)}}/>
          </TouchableOpacity> : null}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  topContainer: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  top1Image: {
    height: width * 0.5 * 1.4,
    width: Math.ceil(width * 0.5),
    borderWidth: 1,
    borderColor: Color.GREY_6,
  },
  twoImageContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: width * 0.5 * 1.4,
  },
  top2Image: {
    height: width * 0.5 * 0.7 - 0.5,
    width: Math.ceil(width * 0.5),
  },
  line: {
    height: 1,
    width: Math.ceil(width * 0.5),
  },
});