import * as React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { submitOrder } from '../../dvaModel/orderModel';
import {Color} from 'consts';

class BottomView extends React.Component<{toatal: number}> {
    public render(): JSX.Element {
        const isDisCount = this.props.commodityAmount!== this.props.newprice;
        let mstr = this.props.newprice.toString();
        if (!mstr.includes('.')) {
            mstr = `${mstr}.00`;
        }
        let mcommodityAmount = this.props.commodityAmount.toString();
        if (!mcommodityAmount.includes('.')) {
            mcommodityAmount = `${mcommodityAmount}.00`;
        }
        return (
        <View style={styles.bottom}>
          <View style={{flexDirection: 'row'}}>
           <Text style={styles.text}>合计:</Text>
           <Text style={{fontSize: 16, color: Color.ORANGE_1}}>{isDisCount ? `￥${mstr}` : `￥${mcommodityAmount}`}</Text>
           </View>
           <TouchableOpacity disabled={this.props.disabled}  onPress={() => this.props.onSubmit()} style={{backgroundColor: 'red', width: 90, height: '100%'}}>
               <Text style={styles.button}>提交订单</Text>
           </TouchableOpacity>
        </View>);
    }
}
const styles = EStyleSheet.create({
    bottom: {
        "position": 'absolute',
        height: 44,
        "bottom": 0,
        "left": 0,
        "right": 0,
        "flexDirection": 'row',
        "backgroundColor": 'white',
        "justifyContent": 'space-between',
        "alignItems": 'center',
        '@media (width:375) and (height:812)': {
            bottom: 34,
          },
    },
    text: {
        paddingLeft: 16,
        fontSize: 14,
    },
    button: {
        fontSize: 16,
        lineHeight: 44,
        height: 44,
        textAlign: 'center',
        width: '100%',
        color: 'white',
    },
});
export default BottomView;
