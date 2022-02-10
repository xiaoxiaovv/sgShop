import * as React from 'react';
import { View, Text } from 'react-native';
import Button from 'rn-custom-btn1';
import EStyleSheet from 'react-native-extended-stylesheet';

interface ICartFooterProps {
  totalPrice: number;
  selected?: boolean;
  title?: string;
  selectAction: (selected: boolean) => void;
  settleAction: () => void;
}

const CartFooter: React.SFC<ICartFooterProps> = ({ totalPrice, selected, selectAction, settleAction, title}) => {
  const selectBtnBg = selected ? require('../../images/ic_select.png') : require('../../images/ic_check.png');
  const p = totalPrice;
  return (
    <View style= {styles.contain}>
      <Button
        title={title}
        style={styles.select}
        image={selectBtnBg}
        innerStyle={{ flexDirection: 'row', justifyContent: 'flex-start' }}
        textStyle={styles.selectText}
        imageStyle={styles.selectImg}
        onPress={() => selectAction(selected)}
      />
      {/* <View style={{ flex: 1 }}/> */}
      <Text style={styles.price}>{
        `￥${p.toFixed(2)}`
      }</Text>
      <Button
        style={styles.settle}
        title='结算'
        textStyle={styles.settleText}
        onPress={settleAction}
      />
    </View>
  );
};

export default CartFooter;

const styles = EStyleSheet.create({
  contain: {
    width: '375rem',
    height: '48rem',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E9E4E4',
    // marginBottom: '$xBottom',
  },
  select: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    // backgroundColor: 'red',
    // marginLeft: 16,
  },
  selectText: {
    textAlign: 'left',
    fontSize: '14rem',
    color: '#999999',
    marginRight: 8,
    // width: '110rem',
  },
  selectImg: {
    width: '16rem',
    height: '16rem',
  },
  price: {
    width: '110rem',
    textAlign: 'right',
    fontSize: '14rem',
    color: '$darkred',
    paddingRight: 20,
  },
  settle: {
    width: '110rem',
    backgroundColor: '#2979FF',
  },
  settleText: {
    fontSize: '14rem',
    color: 'white',
  },
});
