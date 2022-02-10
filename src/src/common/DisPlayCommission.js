import React from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';
import {connect} from "../utils";
import PropTypes from 'prop-types';


@connect(({users: {isHost, CommissionNotice}}) => ({isHost, CommissionNotice}))
export default class DisPlayCommission extends React.Component {

  static defaultProps={
    commission:0,
  }

  static propTypes={
    commission:PropTypes.number.isRequired,
  }

  render() {
    if (this.props.isHost > 0 && this.props.CommissionNotice) {
      const commission = this.props.commission;//佣金金额
      return (
        <View style={styles.commissionContainer}>
          {this.props.children}
          <Image style={styles.commissionImage} source={require('../images/hongbao.png')}/>
          <Text style={styles.commissionText}>{`￥${commission.toFixed(2)}`}</Text>
        </View>
      )
    } else return null;

  }
}

const styles = StyleSheet.create({
  commissionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  commissionImage: {
    marginLeft:8,
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  commissionText: {
    color: '#FF4400',
    fontSize: 13,
  },
})
