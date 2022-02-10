import * as React from 'react';
import { View, WebView, StyleSheet, Platform } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import Header from '../../../components/Header';

interface IShunguangSchoolDetail {
  navigation: NavigationScreenProp;
  context: string;
  title: string;
}
/**
 * 微学堂详情
 */
export default class ShunguangSchoolDetail extends React.Component<IShunguangSchoolDetail> {
  public static navigationOptions = ({navigation}) => {
    return {
        header: <Header
            goBack={() => navigation.goBack()}
            title="微学堂详情">
            <View/>
        </Header>
    }
  }

  public render(): JSX.Element {
    const { params } = this.props.navigation.state;
    const context = params ? params.context : null;
    const title = params ? params.title : null;
    let html = `
    <!DOCTYPE html>\n
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style type="text/css">
        body{
        word-wrap:break-word;
    word-break:break-all;
    overflow: hidden;
        }
            img {
              width: 100% !important;
              height: auto !important;
            }
          </style>
      </head>
      <body>
      <h3 style="text-align: center">`+ title +`</h3>`
      + context +
      `</body>
    </html>
    `;
    return(<View style={{flex: 1, backgroundColor: '#fff'}}><WebView source={{html: html, baseUrl: ''}} style={styles.webView}/></View>);
  }
}

const styles = StyleSheet.create({
  webView: {
    flex: 1, marginHorizontal: 2,
  },
});
