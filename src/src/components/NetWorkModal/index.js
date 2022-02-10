import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Text,
  Animated,
  Easing,
  InteractionManager,DeviceEventEmitter
} from 'react-native';
import PropTypes from 'prop-types';
import {px, width, height} from './../../utils/index';
import NetInfoDecorator from "../../decorator/NetInfoDecorator";
import Orientation from 'react-native-orientation';



@NetInfoDecorator
export default class NetWorkModal extends React.PureComponent {
  state = {
      timer:null,
    disableNetwork:false,
    width:width,
    height:height,
  };

  modalClose = () => {
    if(this.state.timer){
        clearTimeout(this.state.timer);
        this.state.timer=null;

    }
    this.setState({
          modalVisible: false,
        });
  };

  modalOpen = () => {
    Orientation.getOrientation((err, orientation) => {
      if (orientation == 'PORTRAIT') {
        this.state.timer=setTimeout(() => {
          this.setState({
            modalVisible: true,
            width:width,
            height:height,
          })
        }, 5000);
      }else {
        this.state.timer=setTimeout(() => {
          this.setState({
            modalVisible: true,
            width:height,
            height:width,
          })
        }, 5000);
      }

    });

  };


  componentWillReceiveProps(nextProps) {
     !nextProps.isConnected ? this.modalOpen() : this.modalClose();
  }


  render() {
    const {modalVisible} = this.state;
    if(!modalVisible){
      return null
    }else
    return (

        <View
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            width: this.state.width,
            height: this.state.height,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
            <TouchableOpacity
              style={styles.carouselImg}
              activeOpacity={0.9}
              onPress={() => {
                this.modalClose();
              }}
            >
              <Image
                resizeMode='stretch'
                source={require('./../../images/no_wlbsc.png')}
                style={styles.image}/>
              <Text
                style={{
                  marginTop: px(16),
                  fontSize: px(14),
                  width: px(154),
                  height: px(20),
                  color: '#fff'
                }}>哦哦，网络不太顺畅哦~</Text>
              <Text style={{
                marginTop: px(16),
                fontSize: px(12),
                width: px(52),
                height: px(17),
                color: '#fff'
              }}>点击刷新</Text>
            </TouchableOpacity>
          </View>
    );
  }
}

const styles = StyleSheet.create({
  carouselImg: {
    alignItems: 'center',
    justifyContent: 'center',
    width: px(308),
    height: px(340),
  },

  closeIcon: {
    color: '#fff',
  },
  image: {
    width: px(124),
    height: px(97),
  }
});