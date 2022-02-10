import * as React from 'react';
import { View, Text, Image, StyleSheet, } from 'react-native';
import {Color, Font} from 'consts';

export default class StorePrice extends React.Component<{commission: string |number}> {
  public render() {
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={require('../../images/hongbao.png')}/>
        <Text style={styles.text}>¥{Number(this.props.commission).toFixed(2)}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  image: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  text: {
    color: Color.ORANGE_3,
    fontSize: Font.SMALL_1,
    marginLeft: 4,
  },
});
