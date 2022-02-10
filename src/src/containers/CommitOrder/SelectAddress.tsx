import * as React from 'react';
import { View, TouchableOpacity, Text, BackHandler, Image } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Color, Font} from 'consts'
import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;

interface IOrdersCommitWrapM{
    order:any;
}
class SelectAddress extends React.Component<IOrdersCommitWrapM> {
    public render(): JSX.Element {
        if (this.props.order===undefined) {
            return null;
        }
        const shouhuoren = IS_NOTNIL(this.props.order.consignee) ? this.props.order.consignee : '';
        const mobile = IS_NOTNIL(this.props.order.mobile) ? this.props.order.mobile : '';
        const address = IS_NOTNIL(this.props.order.address) ? this.props.order.address : '';
        const regionName = IS_NOTNIL(this.props.order.regionName) ? this.props.order.regionName : '';


        return (
        <View style={styles.header}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 24}}>
                <Text style={styles.textTitle}>{`收货人：${shouhuoren}`}</Text>
                <Text style={styles.textTitle}>{mobile}</Text>
            </View>
            <View style={{flexDirection:'row', marginTop: 8, marginRight: 25,}}>
                <Image
                    source={require('../../images/locationAddress.png')}
                    style={{width:24,height:24}}
                    />
                <Text style={styles.address}>{`收货地址: ${regionName}${address}`}</Text>
            </View>
        </View>);
    }
}
const styles = EStyleSheet.create({
   header: {
       width: width - 50,
       paddingVertical: 14,
   },
   textTitle: {
      fontSize: Font.LARGE_3,
      color: Color.BLACK,
   },
   address: {
    fontSize: Font.NORMAL_1,
    color: Color.BLACK_1,
   },
   addressValue: {
    flex:1,
    fontSize: Font.NORMAL_1,
    color: Color.GREY_1,
   },
});
export default SelectAddress;
