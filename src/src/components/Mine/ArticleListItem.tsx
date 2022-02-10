import * as React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface IItem {
  thumbnail: string;
  title: string;
  subhead: string;
  index: number;
  onClick: () => any;
  addTime?: number;
}

const unixTimeStampToDateConvertor = (unixTimeStamp: number): string => {
  const date = new Date(unixTimeStamp);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDay();

  return '' + year + '-' + month + '-' + day;
};

/**
 * 顺逛微学堂列表项
 * @param props
 */
export const ArticleListItem = (props: IItem) => {
  return (<TouchableOpacity onPress={() => props.onClick()}>
  <View style={
    0 === props.index ? {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 15,
      paddingBottom: 15,
      backgroundColor: 'white',
      paddingRight: 10,
    } : {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 15,
      paddingBottom: 15,
      backgroundColor: 'white',
      borderTopColor: '#EEEEEE',
      borderTopWidth: 1,
      paddingRight: 10,
    }}
    >
    <Image
      style={{
        width: 100,
        height: 100,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: 'transparent',
      }}
      source={{uri: props.thumbnail}}
    />
    <View style={{flex: 1, justifyContent: 'space-around'}}>
      <View style={[styles.wrappingTextViewWrapper, {marginTop: 10}]}>
        <Text style={{
          color: '#585858',
        }}>{props.title}</Text>
      </View>
      <View style={styles.wrappingTextViewWrapper}>
        <Text style={{
          color: '#B7B7B7',
          paddingTop: 5,
        }}>{props.subhead}</Text>
      </View>
      <View style={styles.wrappingTextViewWrapper}>
        {props.addTime ? <Text style={{
          color: '#585858',
          marginTop: 10,
        }}>{unixTimeStampToDateConvertor(props.addTime)}</Text> : null}
      </View>
    </View>
  </View>
  </TouchableOpacity>);
};

const styles = StyleSheet.create({
  wrappingTextViewWrapper: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
});
