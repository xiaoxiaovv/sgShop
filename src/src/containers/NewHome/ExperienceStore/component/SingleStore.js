import React from 'react';
import {View, Image, Text, Platform, TouchableOpacity} from 'react-native';
import {px, width} from "../../../../utils";
import SingleStoreItem from "./SingleStoreItem";
import {SecondTitle} from "../../../../components";

export default class SingleStore extends React.PureComponent {

  render() {
    const storeData = this.props.storeData;
    if (storeData) {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.onPress && this.props.onPress()
          }}>
          <SecondTitle title={'附近体验店'} containerStyle={{backgroundColor: '#fff'}}/>

          <Image
            resizeMode={'stretch'}
            style={{width, height: px(180)}}
            source={{uri: storeData.imageUrl || ''}}/>
          <SingleStoreItem
            onPress={() => {
              this.props.onPress && this.props.onPress()
            }}
            showArrow={false}
            storeData={storeData}/>
        </TouchableOpacity>
      )
    } else {
      return (
        <View style={{width, height: px(230), alignItems: 'center', justifyContent: 'center'}}>
          <SecondTitle title={'附近体验店'} containerStyle={{backgroundColor: '#fff'}}/>

          <Image
            resizeMode={'stretch'}
            style={{width: px(100), height: px(100)}}
            source={require('../../../../images/noStoreMsg.png')}/>
          <Text style={{color: '#999', fontSize: px(14)}}>{this.props.emptyText}</Text>
        </View>
      )
    }
  }
};
