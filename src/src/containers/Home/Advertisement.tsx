import * as React from 'react';
import { Image, View, TouchableOpacity, Text, Modal } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { IAdvertisement } from './HomeInterface';
import { INavigation } from '../../interface';
import Button from 'rn-custom-btn1';
import { NavigationScreenProp } from 'react-navigation';
import { clickAdImage } from '../../utils/tools';

import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

interface IProps {
  advertisement: IAdvertisement;
  onClose: (type: string) => void;
  storeId?: number;
}

/**
 * 首页广告弹窗
 * @param {IProps & INavigation} props
 * @returns {JSX.Element}
 * @constructor
 */
export const Advertisement = (props: IProps & INavigation) => {
  const {advertisement, onClose, storeId, navigation} = props;

  if (Object.keys(advertisement).length === 0
    || (!advertisement.bannerInfotJson && !advertisement.bannerNewGriftJson)
    || (!(advertisement.bannerInfotJson.length > 0) && !(advertisement.bannerNewGriftJson.length > 0))
  ) {
    return null;
  }

  const bannerInfotJson = advertisement.bannerInfotJson[0];
  const bannerNewGriftJson = advertisement.bannerNewGriftJson[0];

  if (bannerInfotJson && bannerNewGriftJson) {
    return <AlertComponent
      onClose={() => onClose('newPerson')}
      advertisement={bannerNewGriftJson}
      navigation={navigation}
      storeId={storeId}
    />;
  } else if (bannerNewGriftJson) {
    return <AlertComponent
      onClose={() => onClose('newPerson')}
      advertisement={bannerNewGriftJson}
      navigation={navigation}
      storeId={storeId}
    />;
  } else if (bannerInfotJson) {
    return <AlertComponent
      onClose={() => onClose('noMsg')}
      advertisement={bannerInfotJson}
      navigation={navigation}
      storeId={storeId}
    />;
  }
};

const AlertComponent = (props: {
  onClose: () => void,
  advertisement: any,
  storeId: number,
  navigation: NavigationScreenProp,
}) => {
  const { onClose, advertisement, navigation } = props;
  return (
      <View style={estyles.bg}>
        <View style={{paddingBottom: 50}}>
          <Button
            style={estyles.closeBtn} title='×' onPress={onClose}
            textStyle={{margin: 0, color: 'white', fontSize: 13}}
            innerStyle={{width: 26, height: 26, borderRadius: 13, borderColor: 'white', borderWidth: 1, margin: 0}}
          />
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              onClose();
              clickAdImage(advertisement, props.storeId);
            }}
          >
            <Image
              style={estyles.advertiseStyle}
              source={{uri: cutImgUrl(advertisement.image, 600, 600, true)}}
            />
          </TouchableOpacity>
        </View>
      </View>
  );
};

const estyles = EStyleSheet.create({
  $width: '305rem',
  containerStyle: {
    width: '$width',
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 10,
  },
  advertiseStyle: {
    width: '$width',
    height: '360rem',
    borderRadius: 10,
  },
  bg: {
    position: 'absolute',
    width,
    height,
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    zIndex: 100,
    width: 26,
    height: 26,
    padding: 0,
    marginBottom: 24,
    alignSelf: 'flex-end',
  },
});
