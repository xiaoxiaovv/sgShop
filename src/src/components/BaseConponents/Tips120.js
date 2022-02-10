/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {Image, Text, TouchableWithoutFeedback, View} from 'react-native';

export default class Tips120 extends Component {
    timeOut = (scends)=>{
          if(scends > 0){

              this.timer = setTimeout(()=>{
                  this.setState({time: scends - 1}, ()=>{
                      this.timeOut(this.state.time);
                  });
              }, 1000)
          } else{
              this.setState({showTime: false, time: '确定'});
        }
    };

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            showTime: true,
            time: 10
        };
          this.timer;
      }

    componentDidMount() {
        // 设置倒计时
        this.timeOut(this.state.time);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        return (
            <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center'}}>
                <View style={{width: 300, height: 250, backgroundColor: '#fff', borderRadius: 8}}>
                    <View style={{height: 210, width: 300, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: '#2979FF', fontSize: 18, marginTop: 8}}>人数太多,请稍后……</Text>
                        <Text style={{color: '#111', marginHorizontal: 16, marginTop: 10, textAlign: 'center', lineHeight: 20}}>俗话说：好饭不怕晚，好腰不怕闪，大奖都在后面！</Text>
                        <Image source={require('./../../images/img120.gif')} style={{height: 100, width: 280}}/>
                    </View>
                    <TouchableWithoutFeedback onPress={()=>{
                        this.props.close();
                    }} disabled={this.state.showTime}>
                    <View style={{height: 40, width: 300, alignItems: 'center', justifyContent: 'center', borderTopWidth: 1, borderTopColor: '#E4E4E4'}}>
                        <Text style={{color: this.state.showTime ? '#111': '#2979FF'}}>{`${this.state.time}${this.state.showTime ? 's': ''}`}</Text>
                    </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }
}


