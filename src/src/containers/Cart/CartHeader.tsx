import * as React from 'react';
import { Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export interface IReceipHeaderProps {
  goodsCount: number;
}

export default class CartHeader extends React.Component<IReceipHeaderProps, any> {

  public constructor(props) {
    super(props);

  }

  public render() {
    const { goodsCount } = this.props;
    return (
      <Text style={styles.tips}>
        {`总共${goodsCount}件商品`}
      </Text>
    );
  }
}

const styles = EStyleSheet.create({
  tips: {
    flex: 1,
    width: '375rem',
    height: 40,
    lineHeight: 40,
    fontSize: 14,
    backgroundColor: '#F4F4F4',
    textAlignVertical: 'center',
    alignSelf: 'center',
    textAlign: 'left',
    margin: 0,
    paddingLeft: 10,
  },
});
