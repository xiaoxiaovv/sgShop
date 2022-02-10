import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {Color, Font} from 'consts';
import {width} from '../../utils';

export default class FooterView extends Component {
  static defaultProps = {
    containerStyle: null,
    lineStyle: null,
    textContainerStyle: null,
    textStyle: null,
  };

  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <View style={[styles.line, this.props.lineStyle]}/>
        <View style={[styles.textContainer, this.props.textContainerStyle]}>
            <Text style={[styles.text, this.props.textStyle]}>已经到底了，只能帮你到这里啦</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  line: {
    backgroundColor: Color.BLACK_2,
    width: width-32,
    height: 1,
    position: 'absolute',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 240,
    height: 40,
    backgroundColor:Color.GREY_5,
  },
  text:{
    fontSize: Font.NORMAL_1,
    color: Color.GREY_1,
  },
});