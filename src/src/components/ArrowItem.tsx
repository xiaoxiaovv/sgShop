import * as React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { TouchableOpacity, View, Text, Image } from 'react-native';

interface IArrowItemProps {
  onClick?: () => void;
  title?: string;
  titleStyle?: object;
  style?: object;
}

const ArrowItem: React.SFC<IArrowItemProps> = ({ onClick, title, titleStyle, style, children }) => {
  return (
    <TouchableOpacity disabled={!onClick} onPress={onClick} style={[styles.contain, style]}>
      <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
          {children || <Text style={styles.itemTitle}>{title}</Text>}
        </View>
        <Image source={require('../images/clear.png')} style={styles.arrow}/>
      </View >
    </TouchableOpacity>
  );
};

export default ArrowItem;

const styles = EStyleSheet.create({
  contain: {
    height: '48rem',
    width: '375rem',
  },
  itemTitle: {
    color: '$darkblack',
    fontSize: '14rem',
    marginLeft: 16,
  },
  arrow: {
    width: '24rem',
    height: '24rem',
    marginRight: 16,
  },
});
