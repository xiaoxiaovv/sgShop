import { Button } from 'antd-mobile';
import * as React from 'react';
import { Image, Text, View, AsyncStorage } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
import { createAction, connect } from '../../utils';
import { action } from '../../dva/utils';
import StyleSheet from 'react-native-extended-stylesheet';
import { ICustomContain } from '../../interface/';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        // tslint:disable-next-line:object-literal-sort-keys
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
    image: {
        width,
        height,
    },
    button: {
        position: 'absolute',
        backgroundColor: '#1F8EEA',
        height: 35,
        alignSelf: 'center',
        bottom: 60,
    },
    btnText: {
        color: 'white',
        fontSize: '$fontSize2',
    },
});

// create a component
const slides = [
    {
      key: 'somethun',
      title: 'bg_guide_1.jpg',
      text: '',
      image: require('../../images/bg_guide_1.jpg'),
      imageStyle: styles.image,
      backgroundColor: 'transparent',
    },
    {
      key: 'somethun-dos',
      title: 'bg_guide_2.jpg',
      text: '',
      image: require('../../images/bg_guide_2.jpg'),
      imageStyle: styles.image,
      backgroundColor: 'transparent',
    },
    {
      key: 'somethun1',
      title: 'bg_guide_3.jpg',
      text: '',
      image: require('../../images/bg_guide_3.jpg'),
      imageStyle: styles.image,
      backgroundColor: 'transparent',
    },
    {
        key: 'somethun3',
        title: 'bg_guide_4.jpg',
        text: '',
        image: require('../../images/bg_guide_4.jpg'),
        imageStyle: styles.image,
        backgroundColor: 'transparent',
      },
      {
        key: 'somethun5',
        title: 'bg_guide_5.jpg',
        text: '',
        image: require('../../images/bg_guide_5.jpg'),
        imageStyle: styles.image,
        backgroundColor: '#22bcb5',
      },

  ];

@connect()
class Guide extends React.Component <ICustomContain> {
    constructor(props) {
        super(props);

    }
    public onClick = async () => {
        this.props.dispatch(action('ADModel/closeAll'));
        await AsyncStorage.setItem('openSecond', 'true');
        // this.props.dispatch(createAction('mainReducer/adViewNext')());
    }
    public render(): JSX.Element {
        return (
            <View style={{ position: 'absolute', top: 0, left: 0, width, height }}>
                <AppIntroSlider
                    skipLabel=''
                    slides={slides}
                    doneLabel=''
                    nextLabel=''
                    showSkipButton
                    renderItem={(item, i) => {
                        return (<Image resizeMode='stretch'  style={{ width, height }} source={item.image}/>);
                    }}
                    onSlideChange={(a, b) => Log(`Active slide changed from ${b} to ${a}`)}
                />
                <Button style={styles.button} onClick={(): void => this.onClick()}>
                    <Text style={styles.btnText}> 立即体验 </Text>
                </Button>
            </View>

        );
    }
}
export default Guide;
