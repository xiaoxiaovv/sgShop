import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import {Color} from 'consts';

export default class Separator extends Component {

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={styles.separator} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 8,
    backgroundColor: Color.GREY_6,
  },
  separator: {
    flex: 1,
  },
});