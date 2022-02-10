import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import empty from '../../images/empty.png';
export default class Newempty extends Component {
  render() {
      return (
        <View style={styles.container}>
          <Image style={[{height: 97, width: 124,}]} source={empty}/>
          <Text style={styles.textColor}>暂无消息</Text>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 100,
  },
  textColor: {
    color: '#999999',
    fontSize: 16,
    marginTop: 20,
  },
});