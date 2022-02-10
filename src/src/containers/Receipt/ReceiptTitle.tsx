import * as React from 'react';
import { View, Text } from 'react-native';
import { Radio, SegmentedControl } from 'antd-mobile';
import Button from 'rn-custom-btn1';
import ReceiptList from './ReceiptList';

const RadioItem = Radio.RadioItem;

export interface IReceiptProps {
    showNotice?: () => void;
    changeReceiptType?: (val) => void;
    invoiceType: number;
}
class ReceiptTitle extends React.Component<IReceiptProps> {

    constructor(props: IReceiptProps ) {
        super(props);
      }

    public render(): JSX.Element {
        const { showNotice, changeReceiptType, invoiceType,goReceiptList } = this.props;
        console.log('ReceiptTitle',this.props.invoiceType)
        return (
            <View>
                <View style={{flexDirection: 'row', backgroundColor: 'white'}}>
                    <Text style={{margin: 10, color: '#333333'}}>发票类型</Text>
                </View>
                <View
                    style={{backgroundColor: 'white', flexDirection: 'row'}}>
                    <Button
                        style={{borderRadius: 5, borderWidth: 1, borderColor: invoiceType === 2 ? '#ed6031' : '#666666', marginLeft: 16, marginBottom: 10, height: 35, width: 100, alignItems: 'center', justifyContent: 'center'}}
                        title='普通发票'
                        textStyle={{color: invoiceType === 2 ? '#ed6031' : '#666666'}}
                        onPress={() => changeReceiptType('普通发票')}
                        />
                    <Button
                        style={{borderRadius: 5, borderWidth: 1, borderColor: invoiceType === 1 ? '#ed6031' : '#666666', marginLeft: 20, marginBottom: 10, height: 35, width: 100, alignItems: 'center', justifyContent: 'center'}}
                        title='增值税发票'
                        textStyle={{color: invoiceType === 1 ? '#ed6031' : '#666666'}}
                        onPress={() => changeReceiptType('增值税发票')}
                        />
                    {this.props.invoiceType===1&&<Button
                        style={{ marginLeft: 20, marginBottom: 10, height: 35, width: 100, alignItems: 'center', justifyContent: 'center'}}
                        title='选择'
                        textStyle={{color:'#e72d2e'}}
                        onPress={() => goReceiptList('增值税发票')}
                    />}
                </View>
                <View style={{backgroundColor: '#eeeeee', height: 8}}/>
            </View>
        );
    }
}

export default ReceiptTitle;
