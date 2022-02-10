import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
export default class login extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <TouchableOpacity 
            style={this.props.style}
            activeOpacity={0.5}
            onPress={this.props.onPress}>
            <Image style={styles.wrap} source={require('../../../images/clearbtn.png')} resizeMode="stretch" />
        </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  wrap:{
    width:16,
    height:16,
  },
});
