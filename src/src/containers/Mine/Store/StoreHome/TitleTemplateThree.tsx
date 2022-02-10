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

import URL from './../../../../config/url.js';
let width = URL.width;
let height = URL.height;

export const TitleTemplateThree = ({
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
      style={{width, height: ScreenUtil.isiPhoneX ? 124 : 100}}
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
    </ImageBackground>
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'white',
      paddingLeft: ScreenUtil.scaleSize(16),
      paddingTop: 15,
      paddingBottom: 15,
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <Image
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
          }}
          source={{uri: cutImgUrl(avatarImageFileId, 100, 100, true)}}
        />
        <View style={{
          marginLeft: 10,
          backgroundColor: 'white',
        }}>
          <Text>{storeName}</Text>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 5,
            marginBottom: 5,
          }}>
            <Image
              style={{width: 12, height: 12, marginRight: 5}}
              source={require('../../../../images/official.png')}
            />
            <Text>官方认证</Text>
            <Image
              style={{width: 12, height: 14, marginLeft: 5, marginRight: 5}}
              source={{
                uri: userCreditWithLevelName !== '盟主' ?
                  `http://cdn09.ehaier.com/shunguang/H5/www/img/Rank Icon${userCurrentLevelId}@2x.png`
                  : 'http://cdn09.ehaier.com/shunguang/H5/www/img/Rank Icon mengzhu@2x.png',
              }}
            />
            <Text>{userCreditWithLevelName}</Text>
          </View>
        </View>
      </View>
      <Sharing
        showShare={showShare}
        showQrCode={showQrCode}
        isWhite={false}
      />
    </View>
  </View>
)
