import * as React from 'react';
import {
  View,
  Image,
  ImageBackground,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import ScreenUtil from '../../../Home/SGScreenUtil';
import { MessageWithBadge } from '../../../../components/MessageWithBadge';
import { Sharing } from './Sharing';
import { BackButton } from './BackButton';
import { Level } from './Level';

import URL from './../../../../config/url.js';
let width = URL.width;
let height = URL.height;

export const TitleTemplateOne = ({
                                   coverUrl,
                                   navigation,
                                   unread,
                                   areaName,
                                   showShare,
                                   showQrCode,
                                   showPosition,
                                   avatarImageFileId,
                                   storeName,
                                   userCreditWithLevelName,
                                   userCurrentLevelId,
                                 }) => (
  <View>
    <ImageBackground
      style={{width, height: ScreenUtil.isiPhoneX ? 144 : 120}}
      source={{uri: coverUrl}}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: (ScreenUtil.isiPhoneX ? 44 : (Platform.OS === 'ios' ? 20 : 0)),
        height: 40,
      }}>
        <BackButton navigation={navigation}/>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <TouchableOpacity
            style={{
              paddingLeft: 10,
              paddingRight: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => showPosition()}
          >
            <Text style={{color: 'white'}}>{areaName}</Text>
            <Image
              style={{
                width: 22,
                height: 22,
              }}
              source={require('../../../../images/location.png')}
            />
          </TouchableOpacity>
          <View>
            <MessageWithBadge
              style={{
                height: 40,
                width: 38,
              }}
              messageBoxStyle={{justifyContent: 'center'}}
              badgeContainStyle={{top: 3, right: -7}}
              imageStyle={{height: 22, width: 22}}
              navigation={navigation}
              unread={unread}
              isWhite={true}
              hidingText={true}
            />
          </View>
        </View>
      </View>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: ScreenUtil.isiPhoneX ? 20 : Platform.select({ios: 24, android: 44}),
        height: 30,
      }}>
        <Sharing
          showShare={showShare}
          showQrCode={showQrCode}
        />
      </View>
    </ImageBackground>
    <Image
      style={{
        width: 80,
        height: 80,
        borderRadius: 40,
        position: 'absolute',
        top: ScreenUtil.isiPhoneX ? 104 : 80,
        left: width / 2 - 40,
        zIndex: 2,
      }}
      source={{uri: cutImgUrl(avatarImageFileId, 100, 100, true)}}
    />
    <View style={{
      alignItems: 'center',
      backgroundColor: 'white',
      paddingTop: 50,
      paddingBottom: 10,
    }}>
      <Text>{storeName}</Text>
      <Level
        userCreditWithLevelName={userCreditWithLevelName}
        userCurrentLevelId={userCurrentLevelId}
      />
    </View>
  </View>
)
