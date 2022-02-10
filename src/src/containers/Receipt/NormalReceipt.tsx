import * as React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import {Toast} from 'antd-mobile';
import Button from 'rn-custom-btn1';
import EStyleSheet from 'react-native-extended-stylesheet';

export interface INormalReceiptProps {
  handleCommit?: (value) => void;
  visible: boolean;
}

export interface INormalReceiptState {
  radio_props?: any[];
  receiptType: number;
  taxPayerNumber: string;
  billCompany: string;
  normalInvoiceType: number;
  visible: boolean;
  submitParams: any;
}

const radio_props = [{label: '个人', value: 0}, {label: '公司', value: 1}];
const selectBtnBg = require('../../images/ic_select.png');
const checkedBtnBg =  require('../../images/ic_check.png');

export default class App extends React.Component<INormalReceiptProps, INormalReceiptState> {
  constructor(props: INormalReceiptProps) {
    super(props);
    this.state = {
      receiptType: 0,  //普通发票类型 0 个人，1 公司
      taxPayerNumber: '', // 纳税人识别号
      billCompany: '', //可输入个人/单位名称
      normalInvoiceType: 1, //个人1   公司2
      visible: false,
      submitParams: {} //提交发票时的其它信息
    };
  }

  public componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    if (this.props.visible === nextProps.visible) {
        this.setState({
          receiptType : nextProps.memberInvoices.nit - 1 || 0,
          taxPayerNumber: nextProps.memberInvoices.tpn || '',
          billCompany: nextProps.memberInvoices.iti || '',
          normalInvoiceType: nextProps.memberInvoices.nit || 1,
          // visible:nextProps.visible,
          submitParams: nextProps.memberInvoices,
        });
    }
  }

  public render() {
    const { handleCommit, visible} = this.props;
    console.log(this.props)
    return (
      visible ?
      <ScrollView style={{backgroundColor: '#eeeeee'}}>
        <View style={{backgroundColor: 'white'}}>
          <Text style={{color: '#333333', backgroundColor: 'white', margin: 10}}>发票信息</Text>
        </View>
        <View style={{backgroundColor: 'white', flexDirection: 'row'}}>
          <Button
            title='个人'
            innerStyle={{flexDirection: 'row'}}
            style={styles.selectedBtn}
            image={this.state.receiptType === 0 ? selectBtnBg : checkedBtnBg}
            imageStyle={styles.selectedImg}
            onPress={() => this.setState({
              receiptType: 0,
              normalInvoiceType: 1,
            })}
          />
          <Button
            title='公司'
            innerStyle={{flexDirection: 'row'}}
            style={styles.selectedBtn}
            image={this.state.receiptType === 1 ? selectBtnBg : checkedBtnBg}
            imageStyle={styles.selectedImg}
            onPress={() => this.setState({
              receiptType: 1,
              normalInvoiceType: 2,
            })}
          />
        </View>
        <View style={{marginLeft: 10, height: 1, backgroundColor: '#EEEEEE', marginRight: 10}}/>
        <View style={{backgroundColor: 'white', flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{color: '#333333', backgroundColor: 'white', margin: 10, width: 90}}>发票抬头</Text>
          <TextInput
              onChangeText={ (text) => { this.handleTextChanged('billCompany', text); }}
              style={[styles.inputStyle, {borderTopWidth: 0}]}
              placeholder='可输入个人/单位名称'
              underlineColorAndroid='transparent'
              value={this.state.billCompany}
              defaultValue={this.state.billCompany}
              />
        </View>
        <View style={{marginLeft: 10, height: 1, backgroundColor: '#EEEEEE', marginRight: 10}}/>
        {
          this.state.receiptType === 1 &&
          <View
            style={{backgroundColor: 'white', flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: '#333333', backgroundColor: 'white', margin: 10, width: 90}}>纳税人识别号</Text>
            <TextInput
                onChangeText={ (text) => { this.handleTextChanged('taxPayerNumber', text); }}
                style={[styles.inputStyle, {borderTopWidth: 0}]}
                placeholder='长度为15位或18位或20位'
                underlineColorAndroid='transparent'
                value={this.state.taxPayerNumber}
                defaultValue={this.state.taxPayerNumber}
                />
          </View>
        }
        {
          this.state.receiptType === 1 &&
          <View style={{marginLeft: 10, height: 1, backgroundColor: '#EEEEEE', marginRight: 10}}/>
        }
        <Button
          title='确定'
          onPress={this.checkInfo}
          textStyle={{color: 'white', fontWeight: 'bold', fontSize: 14}}
          style={{margin: 20, height: 45, borderRadius: 40, backgroundColor: '#2979ff'}}
          />
      </ScrollView> :
      null
    );
  }

  private onRadioPress = (value): void => {
    Log('onRadioPress=======', value);
  }

  private handleTextChanged = (key, value): void => {
    this.setState({
        [key]: value,
    });
  }

  private checkInfo = (): void => {
    const { handleCommit } = this.props;

    if (this.state.receiptType === 0) {// 个人发票
      if (!( /^.[^&<>]{1,}$/.test(this.state.billCompany))) {
        Toast.info('发票抬头必填,且不能包含特殊字符', 2);
      } else {
        handleCommit({...this.state});
      }
    } else {// 企业发票
      if (!( /^.[^&<>]{1,}$/.test(this.state.billCompany))) {
        Toast.info('发票抬头必填,且不能包含特殊字符', 2);
      }else if (!(/^[0-9A-Za-z]{18}$|^[0-9A-Za-z]{15}$|^[0-9A-Za-z]{20}$/.test(this.state.taxPayerNumber))) {
        Toast.info('识别号为15位或18位或20位的数字或字母', 2);
      } else {
        handleCommit({...this.state});
      }
    }
  }
}

const styles = EStyleSheet.create({
  inputStyle: {
      flex:1,
      height: 40,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: 'lightgrey',
      paddingLeft: 15,
      paddingRight: 15,
      color: '#333333',
  },
  selectedBtn: {
    // height: '104rem',
    // width: 40,
    margin: 10,
  },
  selectedImg: {
    width: '16rem',
    height: '16rem',
  },
});
