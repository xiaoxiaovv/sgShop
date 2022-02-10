import React, { Component } from 'react';
import { WebView, View, StyleSheet, Platform } from 'react-native';
import renderChart from './renderChart';
import echarts from './echarts.min';

const source = (Platform.OS == 'ios') ? require('./tpl.html') : {'uri':'file:///android_asset/echarts/tpl.html'}

export default class App extends Component {
  componentWillReceiveProps(nextProps) {
      this.refs.chart.injectJavaScript(renderChart(nextProps, true));
  }

    componentDidMount() {
        this.refs.chart.injectJavaScript(renderChart(this.props, true));
    }


  render() {
    return (
      <View style={{flex: 1, height: this.props.height || 400,}}>
        <WebView
          ref="chart"
          scrollEnabled = {false}
          injectedJavaScript = {renderChart(this.props)}
          scalesPageToFit={Platform.OS === 'android' ? true : false}
          style={{
            height: this.props.height || 400,
          }}
          source={source}
          style={{backgroundColor: this.props.option.backgroundColor || 'rgba(0, 0, 0, 0)'}}
          onMessage={event => this.props.onPress ? this.props.onPress(JSON.parse(event.nativeEvent.data)) : null}
        />
      </View>
    );
  }
}
