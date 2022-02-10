import * as React from 'react';
import { View, Image, Text } from 'react-native';

export const Level = ({userCreditWithLevelName, userCurrentLevelId, isWhiteFont = false}) => (
  <View style={{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  }}>
    <Image
      style={{width: 12, height: 12, marginLeft: 5, marginRight: 5}}
      source={require('../../../../images/official.png')}
    />
    <Text style={isWhiteFont ? {color: 'white'} : null}>官方认证</Text>
    <Image
      style={{width: 12, height: 14, marginLeft: 5, marginRight: 5}}
      source={{
        uri: userCreditWithLevelName !== '盟主' ?
          `http://cdn09.ehaier.com/shunguang/H5/www/img/Rank Icon${userCurrentLevelId}@2x.png`
          : 'http://cdn09.ehaier.com/shunguang/H5/www/img/Rank Icon mengzhu@2x.png',
      }}
    />
    <Text style={isWhiteFont ? {color: 'white'} : null}>{userCreditWithLevelName}</Text>
  </View>
)
