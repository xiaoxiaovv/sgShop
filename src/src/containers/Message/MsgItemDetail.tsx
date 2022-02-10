import React, { Component } from 'react';
import {
  WebView,
  Button,
  StyleSheet,
  View,
  Text,
  BackHandler,
} from 'react-native';

import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

import Header from '../../components/Header';
import Config from 'react-native-config';
export default class MsgItemDetail extends Component{

  constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {
            url: '',
        }
        // Log(state.params.url)
        // <WebView source={{uri:this.state.url}}></WebView>
        // http://m.ehaier.com/v3/mstore/sg/helpDetail.html?id=1065
    }

    public static navigationOptions = ({navigation}) => {
        return {
            header: <Header goBack={() => navigation.goBack()} title={navigation.state.params.user.title}/>
        };
    };

    // componentDidMount() {
    //     BackHandler.addEventListener('hardwareBackPress', this.goBack);
    // }
    // componentWillUnmount() {
    //     BackHandler.removeEventListener('hardwareBackPress', this.goBack);
    // }

    render(){
        const { navigation } = this.props;
        // Getting the user data from navigation params
        const { user } = navigation.state.params;
        const jsCode = `document.getElementsByClassName('help')[0].style.marginTop = '20px';
        document.getElementsByClassName('nav')[0].style.display = 'none';`;
        const url = `${Config.API_URL}v3/mstore/sg/helpDetail.html?id=${ user.relationId }`;
        console.log(url);
        return (
            <View style={styles.container}>
             <WebView 
                injectedJavaScript={jsCode}
                startInLoadingState={true}
                style={{width:deviceWidth, height:deviceHeight}}
                source={{uri: url}} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
