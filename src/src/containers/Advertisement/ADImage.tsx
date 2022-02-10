import * as React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { clickAdImage } from '../../utils/tools';
import EStylesheet from 'react-native-extended-stylesheet';
import CountDownBtn from '../../components/CountDownBtn';
import { cutImgUrl } from '../../utils';

import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;

export interface IADImageProps {
  adData?: any;
  skipPress: () => void;
}

export default class ADImage extends React.Component<IADImageProps, any> {
  public componentDidMount() {
    setTimeout(() => {
      this.props.skipPress();
    }, 6000);
  }

  public render(): JSX.Element {
    const { adData, skipPress } = this.props;
    return (
      <View style={{ position: 'absolute', top: 0, left: 0, width, height }}>
        <TouchableOpacity
              style={{ width, height }}
              activeOpacity={1}
              onPress={() => {
                skipPress();
                clickAdImage(adData[0]);
              }}
            >
              <Image
                resizeMode='stretch'
                style={{ width, height }}
                source={{uri: cutImgUrl(adData[0].image)}}
              />
            </TouchableOpacity>
        <CountDownBtn time={5} style={styles.skipBtn} onPress={() => skipPress()}/>
      </View>
    );
  }
}

const styles = EStylesheet.create({
  skipBtn: {
    position: 'absolute',
    top: 32,
    right: 16,
    height: 30,
    width: 30,
    backgroundColor: 'transparent',
  },
});
