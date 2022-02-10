import React from 'react';
import {
  View, Modal, Animated,
  TouchableWithoutFeedback,
  StyleSheet, Dimensions,
  Easing,
} from 'react-native';

import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
const screen = {width,height};

export default class AnimateModal extends React.Component{

  static defaultProps ={
    animationType: 'slide-up',//'slide-up','slide-down','fade','none'
    animateAppear: false,
    animationDuration: 300,
    visible: false,
    maskClosable: true,
    onClose() {
    },
    onAnimationEnd(_visible: boolean) {

    },
  }

  animMask= undefined;
  animDialog= undefined;

  getPosition = (visible) => {
    if (visible) {
      return 0;
    }
    return this.props.animationType === 'slide-down' ? -screen.height : screen.height;
  }

  getScale = (visible) => {
    return visible ? 1 : 1.05;
  }
  getOpacity = (visible) => {
    return visible ? 1 : 0;
  }


  state = {
    position: new Animated.Value(this.getPosition(this.props.visible)),
    scale: new Animated.Value(this.getScale(this.props.visible)),
    opacity: new Animated.Value(this.getOpacity(this.props.visible)),
    modalVisible: this.props.visible,
  }


  onMaskClose = () => {
    if (this.props.maskClosable && this.props.onClose) {
      this.props.onClose();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.shouldComponentUpdate(nextProps, null)) {
      this.setState({
        modalVisible: true,
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.visible || this.props.visible !== nextProps.visible) {
      return true;
    }
    if (nextState) {
      if (nextState.modalVisible !== this.state.modalVisible) {
        return true;
      }
    }
    return false;
  }

  componentDidMount() {
    if (this.props.animateAppear && this.props.animationType !== 'none') {
      this.componentDidUpdate({});
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      this.animateDialog(this.props.visible);
    }
  }

  animateMask = (visible) => {
    this.stopMaskAnim();
    this.state.opacity.setValue(this.getOpacity(!visible));
    this.animMask = Animated.timing(
      this.state.opacity,
      {
        toValue: this.getOpacity(visible),
        duration: this.props.animationDuration,
      },
    );
    this.animMask.start(() => {
      this.animMask = null;
    });
  }

  stopMaskAnim = () => {
    if (this.animMask) {
      this.animMask.stop();
      this.animMask = null;
    }
  }
  stopDialogAnim = () => {
    if (this.animDialog) {
      this.animDialog.stop();
      this.animDialog = null;
    }
  }

  animateDialog = (visible) => {
    this.stopDialogAnim();
    this.animateMask(visible);

    let { animationType, animationDuration } = this.props;
    if (animationType !== 'none') {
      if (animationType === 'slide-up' || animationType === 'slide-down') {
        this.state.position.setValue(this.getPosition(!visible));
        this.animDialog = Animated.timing(
          this.state.position,
          {
            toValue: this.getPosition(visible),
            duration: animationDuration,
            easing: (visible ? Easing.elastic(0.8) : undefined) ,
          },
        );
      } else if (animationType === 'fade') {
        this.animDialog = Animated.parallel([
          Animated.timing(
            this.state.opacity,
            {
              toValue: this.getOpacity(visible),
              duration: animationDuration,
              easing: (visible ? Easing.elastic(0.8) : undefined) ,
            },
          ),
          Animated.spring(
            this.state.scale,
            {
              toValue: this.getScale(visible),
            },
          ),
        ]);
      }

      this.animDialog.start(() => {
        this.animDialog = null;
        if (!visible) {
          this.setState({
            modalVisible: false,
          });
        }
        if (this.props.onAnimationEnd) {
          this.props.onAnimationEnd(visible);
        }
      });
    } else {
      if (!visible) {
        this.setState({
          modalVisible: false,
        });
      }
    }
  }

  close = () => {
    this.animateDialog(false);
  }


  render(){
    if (!this.state.modalVisible) {
      return null;
    }

    const animationStyleMap = {
      none: {},
      'slide-up': { transform: [{ translateY: this.state.position }] },
      'slide-down': { transform: [{ translateY: this.state.position }] },
      fade: { transform: [{ scale: this.state.scale }], opacity: this.state.opacity },
    };
    return(
      <Modal
        visible={this.props.visible}
        transparent={true}
        onRequestClose={this.props.onClose}
        supportedOrientations={['portrait', 'landscape']}
      >
        <View style={[styles.wrap, this.props.wrapStyle]}>
          <TouchableWithoutFeedback
            onPress={ this.onMaskClose }>
            <Animated.View
              style={[styles.absolute, { opacity: this.state.opacity }]}
            >
              <View style={[styles.absolute, this.props.maskStyle]} />
            </Animated.View>
          </TouchableWithoutFeedback>
          <Animated.View
            style={[styles.content, this.props.style, animationStyleMap[this.props.animationType]]}
          >
            {this.props.children}
          </Animated.View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  } ,
  mask: {
    backgroundColor: 'black',
    opacity: .5,
  } ,
  content: {
    backgroundColor: 'white',
  } ,
  absolute: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
