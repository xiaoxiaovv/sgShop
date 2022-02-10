import React from 'react';
import {View,Text,Dimensions} from 'react-native';
import {px} from "../../../../utils";
import PropTypes from 'prop-types';
import URL from "../../../../config/url";
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;



export default class ProgressBar extends React.PureComponent{

  static defaultProps={
    raisedAmount:1,
    targetAmount:1,
    schedule:1,
  }
  static propTypes = {
    raisedAmount:PropTypes.number,
    targetAmount:PropTypes.number,
    schedule:PropTypes.number,
  }

  render(){
    const {raisedAmount,targetAmount,schedule} = this.props;
    return(
      <View style={[{backgroundColor:'#fff',flexDirection: 'row', width: width},this.props.style]}>
        <View style={{backgroundColor: '#e4e4e4', width, height: 12, borderRadius: 8, flex: 1}}>
          <View style={{
            width: '' + Math.ceil((raisedAmount / targetAmount) * 100) + '%',
            maxWidth:width - px(210),
            height: 12,
            borderRadius: 50,
            backgroundColor: '#F40'
          }}/>
        </View>
        <Text numberOfLines={1} style={{fontSize: 12, marginLeft: 10, marginRight: 10}}>{`${Math.ceil(parseFloat(schedule))}%`}</Text>
      </View>
    )
  }
}
