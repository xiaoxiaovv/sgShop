import * as React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface IGradeStep {
  levelOrder: number;
}

import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;

const nodes = [
  {
    levelOrder: 1,
    levelName: '士兵',
    logo: 'http://cdn09.ehaier.com/shunguang/H5/www/img/HeadImage1.png',
  },
  {
    levelOrder: 2,
    levelName: '班长',
    logo: 'http://cdn09.ehaier.com/shunguang/H5/www/img/HeadImage2.png',
  },
  {
    levelOrder: 3,
    levelName: '排长',
    logo: 'http://cdn09.ehaier.com/shunguang/H5/www/img/HeadImage3.png',
  },
  {
    levelOrder: 4,
    levelName: '连长',
    logo: 'http://cdn09.ehaier.com/shunguang/H5/www/img/HeadImage4.png',
  },
  {
    levelOrder: 5,
    levelName: '营长',
    logo: 'http://cdn09.ehaier.com/shunguang/H5/www/img/HeadImage5.png',
  },
  {
    levelOrder: 6,
    levelName: '团长',
    logo: 'http://cdn09.ehaier.com/shunguang/H5/www/img/HeadImage6.png',
  },
  {
    levelOrder: 7,
    levelName: '旅长',
    logo: 'http://cdn09.ehaier.com/shunguang/H5/www/img/HeadImage7.png',
  },
  {
    levelOrder: 8,
    levelName: '师长',
    logo: 'http://cdn09.ehaier.com/shunguang/H5/www/img/HeadImage8.png',
  },
  {
    levelOrder: 9,
    levelName: '军长',
    logo: 'http://cdn09.ehaier.com/shunguang/H5/www/img/HeadImage9.png',
  },
  {
    levelOrder: 10,
    levelName: '司令',
    logo: 'http://cdn09.ehaier.com/shunguang/H5/www/img/HeadImage10.png',
  },
];

const Line = () => (
  <View style={{
    height: 10,
    width: width / 4,
    marginBottom: 30,
  }}>
    <View style={{
      flex: 1,
      borderBottomColor: '#97BDFC',
      borderBottomWidth: 1,
    }}></View>
    <View style={{
      flex: 1,
    }}></View>
  </View>
);

const GradeStep = (props: IGradeStep): JSX.Element => (
  <View>
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
  }}>
    {nodes.map((ele, idx) => (
      0 === idx ?
      <View style={{alignItems: 'center'}} key={idx}>
        <Image
          style={props.levelOrder === idx ? styles.current : styles.normal}
          source={{uri: ele.logo}}
        />
        <Text style={{marginTop: 10, marginBottom: 10}}>{ele.levelName}</Text>
      </View>
      :
      <View style={{flexDirection: 'row', alignItems: 'center'}} key={idx}>
        <Line/>
        <View style={{alignItems: 'center'}}>
          <Image
            style={props.levelOrder === idx ? styles.current : styles.normal}
            source={{uri: ele.logo}}
          />
          <Text style={{marginTop: 10, marginBottom: 10}}>{ele.levelName}</Text>
        </View>
      </View>
    ))}
  </View>
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
  }}>
    {nodes.map((e, i) => (
      0 === i ?
      <View style={{
        width: props.levelOrder === i ? 80 : 50, height: 1,
      }} key={i}></View>
      :
      <View style={{
        flexDirection: 'row',
      }} key={i}>
        <View style={{
          height: 1,
          width: width / 4,
        }}></View>
        <View style={
          props.levelOrder === i - 1 ?
          {
            backgroundColor: 'white',
          } : {
            width: props.levelOrder === i ? 80 : 50,
          }
        }>
          {
            props.levelOrder === i - 1 ?
            <View>
              <Text>成长值：100</Text>
              <Text>网单：¥1000.00</Text>
            </View> : null
          }
        </View>
      </View>
    ))}
  </View>
  </View>
);

const styles = StyleSheet.create({
  normal: {
    width: 50,
    height: 50,
  },
  current: {
    width: 80,
    height: 80,
  },
});

export default GradeStep;
