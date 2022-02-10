import { View, Text, Dimensions, TextInput, Image, StyleSheet,
    TouchableOpacity, DeviceEventEmitter, Modal,ScrollView } from 'react-native';
import React from 'react';
import ClearBtn  from './ClearBtn';
import { List, WhiteSpace, Toast} from 'antd-mobile';
import Config from 'react-native-config';
import axios from 'axios';
import { width } from '../../../utils';

const Item = List.Item;
class TelThird extends React.Component {
    
    constructor(props) {
      super(props);
      this.state = {
          input1:''
      }
    }

   nextSubmit = ()=>{
     // 从带过来的路由参数里面取值
     const { params } = this.props.navigation.state;
     const urlNext = Config.API_URL + Config.TELUERTORF;
     axios.get(urlNext, { params: { realName: params.realName, identityNo: this.state.input1, } })
       .then((res) => res.data)
       .then((res) => {
         if (res.data) {
           Toast.info(res.message,1);
           this.props.navigation.navigate('TelSecond', { realName: params.realName, identityNo: params.identityNo,});
         } else {
           Toast.info(res.message);
         }
       })
   }


    render() {
       // 从带过来的路由参数里面取值
       const { params } = this.props.navigation.state;
        return (
          <View style={styles.wrapper}>
              <ScrollView 
               style={{flex:1}}
               keyboardShouldPersistTaps="always" 
               keyboardDismissMode="on-drag"
               >
              
              <Text style={styles.hint}>请输入已认证或新手机号机主身份信息，该信息将作为顺逛账号的绑定身份信息</Text>
              <View style={styles.item}>
                <Text style={styles.litem}>证件类型</Text>
                <Text style={styles.ritem}>身份证</Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.litem}>姓名</Text>
              <Text style={styles.ritem}>{params.realName.replace(/.(?=.)/g, '*')}</Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.litem}>证件号</Text>
                <TextInput style={styles.input}
                  placeholder='填写对应身份证号'
                  underlineColorAndroid="transparent"
                  maxLength={18}
                  onChangeText={(text) => {
                    this.setState({ input1: text })
                  }}
                  />
              </View>
              <TouchableOpacity 
                onPress={this.nextSubmit}>
                <View style={styles.btnone}> 
                  <Text style={styles.texttwo}>下一步</Text>
                </View>
              </TouchableOpacity>
               
              </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    wrapper: {
        flex:1,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'center',
        height:'100%',
    },
    hint: {
      fontSize: 14,
      color: '#666',
      padding: 20,
      lineHeight: 22,
    },
    item: {
      flexDirection:'row',
      justifyContent: 'space-between',
      height:50,
      backgroundColor: '#fff',
      paddingLeft: 12,
      paddingRight: 12,
      borderBottomWidth: 1,
      borderColor:'#dfdfdf',
    },
    litem: {
      justifyContent: 'center',
      fontSize: 17,
      lineHeight: 50,
      color: '#333',
    },
    ritem: {
      lineHeight: 50,
      textAlign: 'right',
      flex:1,
      fontSize: 17,
      color: '#333',
    },
    formGroup:{
      height:50,
      paddingLeft:10,
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
      borderLeftWidth:1,
      borderColor:'#dfdfdf',
    },
    btn: {
      color:'#09f',
      fontSize:14,
    },
    texttwo: {
        color: '#fff',
        fontSize: 16,
    },
    btnone: {
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

export default TelThird;

