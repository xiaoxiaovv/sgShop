import * as React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Progress } from 'antd-mobile';

import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

interface IDataSummaryProgress {
  label: string;
  onClick?: () => any;
  clickText?: string;
  numerator: number;
  denominator: number;
  unit: string;
  percent: number;
}

const DataSummaryProgress = (props: IDataSummaryProgress): JSX.Element => {
  return (
    <View style={{
      flexDirection: 'row',
      width: width - 20,
      alignSelf: 'center',
      alignItems: 'center',
    }}>
    <View style={{
      justifyContent: 'space-around',
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 10,
      paddingBottom: 15,
      width: width - 20,
      borderBottomColor: '#E7E7E7',
      borderBottomWidth: 1,
    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Text>{props.label}</Text>
        <TouchableOpacity onPress={() => props.onClick()}>
          <Text style={{color: '#639DFC'}}>{props.clickText}</Text>
        </TouchableOpacity>
      </View>
      <View style={{
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
      }}>
        <Text style={{color: '#639DFC'}}>{props.numerator}{props.unit === '%' ? props.unit : ''}</Text>
        <Text>/{props.denominator}{props.unit}</Text>
      </View>
      <View style={{
        width: width - 40,
      }}>
        <Progress percent={props.percent} position='normal' />
      </View>
    </View>
    </View>
  );
};

export default DataSummaryProgress;
