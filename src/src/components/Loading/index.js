import * as React from 'react';
import { View, ActivityIndicator } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {width, sceenHeight} from '../../utils';
import {Color} from 'consts';

interface IEmptyProps {
  containerStyle?: object;
  loadingStyle?: object;
}

const Loading: React.SFC<IEmptyProps> = ({ containerStyle, loadingStyle}) => {
  return (
    <View style={[styles.loadingContainer, containerStyle]}>
        <ActivityIndicator
            style={[styles.loading, loadingStyle]}
            animating={true}
            size="large"
            color={Color.GRAY_2}
        />
    </View>
  );
};

export default Loading;

const styles = EStyleSheet.create({
    loadingContainer: {
        height: sceenHeight,
        width: width,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        alignSelf: 'center',
    },
    loading: {
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        width: 40,
        height: 40,
        borderRadius: 25,
    },
});