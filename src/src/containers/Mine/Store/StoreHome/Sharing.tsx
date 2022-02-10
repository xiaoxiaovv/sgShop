import * as React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import ScreenUtil from '../../../Home/SGScreenUtil';

export const Sharing = ({showShare, showQrCode, isWhite = true}) => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
  }}>
    <TouchableOpacity
      style={{
        paddingLeft: 5,
        paddingRight: 5,
      }}
      activeOpacity={0.8}
      onPress={() => showShare()}
    >
      <Image
        style={{width: 20, height: 22}}
        source={
          isWhite ? require('../../../../images/ic_share_w.png') :
            require('../../../../images/ic_share_b.png')
        }
      />
    </TouchableOpacity>
    <TouchableOpacity
      style={{
        paddingLeft: 10,
        paddingRight: ScreenUtil.scaleSize(16),
      }}
      activeOpacity={0.8}
      onPress={() => showQrCode()}
    >
      <Image
        style={{width: 20, height: 20}}
        source={
          isWhite ? require('../../../../images/ic_erweima_w.png') :
            require('../../../../images/ic_erweima_b.png')
        }
      />
    </TouchableOpacity>
  </View>
)
