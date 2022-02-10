import * as React from 'react';
import { View, Image, Text } from 'react-native';

export interface IVisitCount {
  count: number;
  iconPath: string;
  text: string;
}

export interface IPersonalCount {
  count: number;
  icon: string;
  text: string;
}

const VisitCount = (props: IVisitCount): JSX.Element => {
  return <View style={{
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  }}>
    <Image
      style={{
        width: 50,
        height: 50,
      }}
      source={{uri: props.iconPath}}
    />
    <Text>{props.count}</Text>
    <Text>{props.text}</Text>
  </View>;
};

export default VisitCount;
