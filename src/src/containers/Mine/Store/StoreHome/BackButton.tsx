import * as React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';

export const BackButton = ({navigation}) => (
  <TouchableOpacity onPress={() => navigation.goBack()}
                    style={{paddingLeft: 16, paddingRight: 10, height: 40, justifyContent: 'center'}}
  >
    <Image
      style={{
        width: 25,
        height: 25,
      }}
      source={require('../../../../images/ic_back_white.png')}
    />
  </TouchableOpacity>
)
