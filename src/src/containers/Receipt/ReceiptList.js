import React from 'react';
import {TouchableOpacity, Text, ScrollView} from 'react-native';
import {NavBar, SafeView} from "../../components";
import {action} from "../../dva/utils";
import {connect} from 'react-redux'

import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

@connect(({receiptModel: {receiptList}}) => ({receiptList}))
export default class ReceiptList extends React.Component {

  componentDidMount() {
    this.props.dispatch(action('receiptModel/getMemberInvoicesListsByMemberId'))
  }

  render() {
    const {receiptList} = this.props;
    const {onSelect} = this.props.navigation.state.params;
    return (
      <SafeView>
        <NavBar
          title={'选择发票抬头'}/>
        <ScrollView>
        {
          receiptList.length > 0 && receiptList.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  this.props.navigation.goBack();
                  onSelect(item)
                }}
                style={{marginVertical: 1, width, backgroundColor: '#fff', justifyContent: 'center', padding: 10}}>
                <Text style={{fontSize: 16, color: '#333'}}>{item.invoiceTitle}</Text>
              </TouchableOpacity>
            )
          })
        }
        </ScrollView>

      </SafeView>
    )
  }
}
