import React from 'react';
import {StyleSheet, Text, View, WebView, ActivityIndicator, BackHandler, Platform} from 'react-native';
import Header from '../../components/Header';
import axios from 'axios';



var patchPostMessageJsCode = `(${String(function () {
    var originalPostMessage = window.postMessage;
    var patchedPostMessage = function (message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer);
    };
    patchedPostMessage.toString = function () {
        return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')
    };

    function setCookie(name, value, expires) {
        var oDate = new Date();
        oDate.setDate(oDate.getDate() + expires);
        document.cookie = name + '=' + value + ';expires=' + oDate + ';path=/'
    }

    window.postMessage = patchedPostMessage;
})})();`;

export default class HelpWebview extends React.Component {

    public static navigationOptions = ({navigation}) => {
        return {
            header: <Header goBack={() => navigation.goBack()} title={'海尔大学'}/>
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            source: {
                //html: '',
                //baseUrl: this.props.navigation.state.params.baby,
                uri:this.props.navigation.state.params.baby
            }
        }
    }

    componentWillMount(){
        //const url="http://learning.haier.net/wx/haier/toSpecialSubject.do?loginName=15900000016&employeeCode=1821106477&userName=4642540000&token=cf919c71ede6ed935184eef1d7804519&subjectName=%E9%A1%BA%E9%80%9B%E5%95%86%E5%AD%A6%E9%99%A2%E7%B2%BE%E5%93%81%E8%AF%BE&organizeName=%E6%B5%B7%E5%B0%94%E5%9C%A8%E7%BA%BF%E5%9F%B9%E8%AE%AD%E5%B9%B3%E5%8F%B0.%E6%B5%B7%E5%B0%94%E5%A4%96%E9%83%A8.%E9%A1%BA%E9%80%9B%E5%BE%AE%E5%BA%97%E4%B8%BB";
        const url=this.props.navigation.state.params.baby;
        console.log(url);

        /*axios.get(url, {maxRedirects:-1}).then(response => {
            console.log('response', response);
        });*/




       /* var request = new XMLHttpRequest();
        request.onreadystatechange = (e) => {
            console.log('response1111', e);

            if (request.readyState !== 4) {
                return;
            }

            if (request.status === 200) {
                console.log('success', request.responseText);
            } else {
                console.warn('error');
            }
        };

        request.open('GET', url);
        request.send();*/
    }

    renderLoad() {
        const {loading} = styles;
        return (
            <View style={loading}>
                <ActivityIndicator size="large"/>
            </View>
        )
    }

    render() {
        //
        return (
            <WebView
                source={this.state.source}
                startInLoadingState={true}
                renderLoading={this.renderLoad}
                renderError={() => <Text align="center">加载失败</Text>}
                ref={(webview) => {
                    this.webview = webview;
                }}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loading: {
        flex: 1,
        justifyContent: 'center'
    }
});


