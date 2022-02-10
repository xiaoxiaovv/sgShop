import * as React from 'react';
import { View, Text, Image } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { width, height, naviBarHeight } from '../utils';

interface IEmptyProps {
  title?: string;
  image?: object;
  style?: object;
}

const Empty: React.SFC<IEmptyProps> = ({ title, style, image }) => {
  return (
    <View style={[styles.container, style]}>
      {image ? <Image
          style={styles.productImg}
          source={image}
        /> : null}
      <Text style={{ color: '#333333', lineHeight: 20, textAlign: 'center' }}>{title || '购物车是空的'}</Text>
    </View>
  );
};

export default Empty;

const styles = EStyleSheet.create({
  container: {
    width,
    height: height - naviBarHeight - 44,
    backgroundColor: '$lightgray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImg: {
    height: '150rem',
    width: '150rem',
    resizeMode: 'contain',
    marginTop: -200,
  },
});
