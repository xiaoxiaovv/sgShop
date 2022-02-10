import * as React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export interface IListItem {
  iconUrl: string;
  nickName: string;
  source: string;
  browseTime: string;
}

import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;

const DataSummaryTwoRowListItem = (props: IListItem): JSX.Element => {
  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomColor: '#E7E7E7',
      borderBottomWidth: 1,
      width,
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 8,
      paddingBottom: 8,
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <Image
          borderRadius={20}
          style={{
            width: 40,
            height: 40,
            marginRight: 10,
          }}
          source={{uri: props.iconUrl}}
        />
        <Text>{props.nickName}</Text>
      </View>
      <View style={{
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}>
        <Text style={styles.greyText}>{props.browseTime}浏览</Text>
        <Text style={styles.greyText}>来自{props.source}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  greyText: {
    color: '#BABABA',
  },
});

export default DataSummaryTwoRowListItem;
