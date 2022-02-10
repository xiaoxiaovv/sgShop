import React from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {goBanner} from "../utils/tools";
import Swiper from 'react-native-swiper';
import {width} from "../utils/index";
import Carousel from "./Carousel/index";
import PropTypes from 'prop-types'

export default class Banners extends React.Component {

  static propTypes={
    bannerData:PropTypes.array.isRequired
  }
  static defaultProps = {
    bannerData: [],
    imageKey: 'imageUrl',
    dots:true,
  }

  render() {
    console.log('Banners render',this.props.bannerData.length);
    if(this.props.bannerData&&this.props.bannerData.length===0){
      return null;
    }
    if(this.props.bannerData&&this.props.bannerData.length===1){
      return(
        <TouchableOpacity
          style={[styles.banner, this.props.style]}
          activeOpacity={0.9}
          onPress={() => this.props.onBarnnerPress && this.props.onBarnnerPress(this.props.bannerData[0])}
        >
          <Image
            source={{uri:this.props.imageKey==='key'? this.props.bannerData[0]:(this.props.bannerData[this.props.imageKey] || '')}}
            style={[styles.banner, this.props.style]}
            resizeMode={'stretch'}/>

        </TouchableOpacity>
      )
    }else {
      return (
        <View style={[styles.banner, this.props.style]}>
          <Carousel
            renderDots={(current,count)=>this.props.renderDots&&this.props.renderDots(current,count)}
            dots={this.props.dots}
            autoplay={true}
            infinite={true}
            autoplayInterval={3000}
            dotStyle={styles.dotStyle}
            dotActiveStyle={styles.activeDotStyle}
          >
            {(this.props.bannerData || []).map((item, i) => {
              return(
                <TouchableOpacity
                  key={i}
                  style={[styles.banner, this.props.style]}
                  activeOpacity={0.9}
                  onPress={() => this.props.onBarnnerPress && this.props.onBarnnerPress(item)}
                >
                  <Image
                    source={{uri: this.props.imageKey==='key'?item:(item[this.props.imageKey] || '')}}
                    style={[styles.banner, this.props.style]}
                    resizeMode={'stretch'}/>

                </TouchableOpacity>
              )
            })
            }
          </Carousel>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({

  banner: {
    width: width,
    height: 0.485 * width,
  },
  dotStyle: {
    backgroundColor: 'rgba(255,255,255,.5)',
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 8,
  },
  activeDotStyle: {
    //选中的圆点样式
    backgroundColor: '#FFFFFF',
    width: 9,
    height: 9,
    borderRadius: 4.5,
    marginRight: 8,
  },

});
