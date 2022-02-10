import { View, Text, Button, Dimensions, TextInput, Image, StyleSheet,
    TouchableOpacity, DeviceEventEmitter, Modal } from 'react-native';
import React from 'react';
import ClearBtn  from './ClearBtn';
import Config from 'react-native-config';
import axios from 'axios';
import { connect, createAction } from '../../../utils';
import { Toast } from 'antd-mobile';
import { getAppJSON } from '../../../netWork';

@connect()
class TelSecond extends React.Component {
    
    constructor(props) {
      super(props);
      this.state = {
          input1:'',
      }
    }
    
  //下一步
  nextSubmit = () => {
    // 从带过来的路由参数里面取值
    const { params } = this.props.navigation.state;
    const urlNext = Config.API_URL + Config.CHANGETELOKGET;
    if (this.state.input1.length != 11) {
      Toast.info('手机号格式不对！');
      return;
    }
    if (this.state.input1.length == 11) {
      axios.get(urlNext, { params: { realName: params.realName, identityNo: params.identityNo, mobile: this.state.input1,} })
        .then((res) => res.data)
        .then((res) => {
          if (res.data) {
            this.props.navigation.navigate('BindNewTel', { realName: params.realName, identityNo: params.identityNo, mobile: this.state.input1});
          } else {
            Toast.info(res.message);
          }
        })
    }
  }

    render() {
        return (
            <View style={styles.wrapper}>
              <Text style={styles.hint}>请输入与认证身份信息一致的新手机号</Text>
              <View style={styles.formGroup}>
                <Text style={styles.btn}>手机号码</Text>
                <TextInput style={styles.input}
                  placeholder='请输入新手机号'
                  underlineColorAndroid="transparent"
                  maxLength={11}
                  onChangeText={(text) => {
                    this.setState({ input1: text })
                  }}
                  />
              </View>
              <TouchableOpacity 
                style={styles.btnone}
                onPress={ this.nextSubmit }>
                  <Text style={styles.texttwo}>下一步</Text>
              </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    wrapper: {
        flex:1,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    hint: {
      fontSize: 14,
      color: '#666',
      marginTop: 20,
      marginBottom: 20,
      marginLeft: 16,
    },
    formGroup:{
      height:50,
      paddingLeft:10,
      paddingRight:10,
      flexDirection:'row',
      borderBottomWidth:1,
      borderColor:'#dfdfdf',
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:'#fff'
    },
    input:{
      height:50,
      color:'#282828',
      borderRadius:3,
      paddingLeft:15,
      fontSize:17,
      flex:1,
      textAlign: 'right',
    },
    getBtn:{
      width:100,
      height:50,
      justifyContent:'center',
      alignItems:'center',
      marginLeft:6,
    },
    btn: {
      color:'#333',
      fontSize:14,
    },
    texttwo: {
        color: '#fff',
        fontSize: 16,
    },
    btnone: {
      alignSelf: 'center',
        marginTop: 60,
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 60,
        paddingRight: 60,
        backgroundColor: '#2979FF',
        borderRadius: 50,
        shadowColor: 'rgba(41,121,255,.5)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    useable: {
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      alignSelf: 'flex-end',
      padding: 10,
    },
    inner: {
      fontSize: 12,
      color: '#333',
    },
});

export default TelSecond;

