import * as React from 'react';
import { View, Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { width, height, naviBarHeight } from '../../utils';

interface IEmptyProps {
  title?: string;
}

const Empty: React.SFC<IEmptyProps> = (props) => {
  return (
    <View style={styles.container}>
      <Text style={{ color: '#333333' }}>没有优惠券</Text>
    </View>
  );
};

export default Empty;

const styles = EStyleSheet.create({
  container: {
    width,
    height: height - naviBarHeight - 44,
    backgroundColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
