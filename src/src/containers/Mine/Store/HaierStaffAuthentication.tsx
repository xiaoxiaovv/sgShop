import * as React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet,Keyboard } from 'react-native';
import { INavigation } from '../../../interface';
import axios from 'axios';
import { Toast } from 'antd-mobile';
import Config from 'react-native-config';
import { createAction , connect} from '../../../utils';
import CustomNaviBar from '../../../components/customNaviBar';
import { ICustomContain } from '../../../interface';
import { ActivityIndicator } from 'antd-mobile';
import { getAppJSON, postAppJSON ,postAppForm} from '../../../netWork';

import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

interface IState {
  isLoading: boolean;
  id: string;
  verifyCode: string;
  canGetICode: boolean;
  timerTxt: string;
}
@connect()
class HaierStaffAuthentication extends React.Component<INavigation & ICustomContain, IState> {
 
  public constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      id: '',
      verifyCode: '',
      canGetICode: true,
      timerTxt: '获取验证码'
    };
  }
 
  public render(): JSX.Element {
    return (
      
         <View style={{backgroundColor: '#F4F4F4',flex:1}}>
            <CustomNaviBar
                navigation={this.props.navigation} title={'海尔员工认证'}
                style={{zIndex: 1000,
                  borderBottomWidth: 1,
                  borderBottomColor: '#ccc',}}
                  leftAction={() =>
                      this.props.navigation.goBack()   
                  }
                rightTitle='说明'
                rightAction={() => this.props.navigation.navigate('AgreementWebview',
                    { helpId: 915, title: ' 实名认证服务协议' })}
                local={{
                  leftStyle: { marginLeft: 8 },
                }}
              />
              <ScrollView style={{flex:1}} 
                keyboardShouldPersistTaps="always"
                keyboardDismissMode="on-drag"
              >
              
              <View style={{
                paddingLeft: 10,
                backgroundColor: 'white',
                flexDirection:'column',
              }}>
                <View>
                    <TextInput
                      underlineColorAndroid={'transparent'}
                      maxLength={8}
                      style={[
                        styles.textInputStyle,
                        {
                          width,
                          borderBottomColor: '#E4E4E4',
                          borderBottomWidth: 1,
                        },
                      ]}
                      placeholder='请输入8位员工编号'
                      onChangeText={(id) => this.setState({id})}
                    />
                </View>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderBottomColor: '#E4E4E4',
                  borderBottomWidth: 1,
                }}>
                  <TextInput
                    underlineColorAndroid={'transparent'}
                    maxLength={6}
                    style={[
                      styles.textInputStyle,
                      {
                        flex: 2,  
                      },
                    ]}
                    placeholder='输入验证码'
                    onChangeText={(verifyCode) => this.setState({verifyCode})}
                  />
                  <View style={styles.verifyButton}>
                    {
                          this.state.canGetICode?
                          <TouchableOpacity onPress={this.timeClick}
                              style={{width:100,height:30,borderWidth: 1,borderColor:'#2979FF',borderRadius:20,}}
                          >
                            <Text style={{textAlign:'center',paddingTop:6,fontSize:14,color:'#2979FF'}}>{this.state.timerTxt}</Text>
                          </TouchableOpacity>
                          :
                          <TouchableOpacity 
                              style={{width:100,height:30,borderWidth: 1,borderColor:'#ccc',borderRadius:20,}}
                          >
                              <Text  style={{textAlign:'center',paddingTop:6,fontSize:14,color:'#333'}}>{this.state.timerTxt}</Text>
                          </TouchableOpacity>
                        }
                  </View>
                </View>
              </View>
              <View style={{
                marginLeft: 20,
                marginTop: 20,
              }}>
                <Text style={{color: '#767676'}}>提示：每日有三次认证机会！</Text>
              </View>
              {
                (this.state.id.length >6 && this.state.verifyCode.length ==6 )?
                  <TouchableOpacity style={[styles.commitButton,{backgroundColor:'#2464E6'}]} onPress={this.onClick}>
                    <Text style={{color: 'white'}}>提交</Text>
                  </TouchableOpacity>
                :
                  <TouchableOpacity style={styles.commitButton}>
                    <Text style={{color: 'white'}}>提交</Text>
                  </TouchableOpacity>
              }
              <ActivityIndicator
              toast
              text='加载中...'
              animating={this.state.isLoading}
            />
             </ScrollView>
            </View>
     

    );
  }
  // 倒计时
  private timeClick = async ()=>{
    
    if(this.state.id.length>6 && this.state.canGetICode){
      
     try{
      let empNo = this.state.id.toLowerCase();
      const params = {
        empNo:empNo
      }
     // let url = Config.API_URL+'v3/kjt/bank/sendSmsForEmp.json?empNo='+empNo;
     let url ='v3/kjt/bank/sendSmsForEmp.json'; 
     const res = await getAppJSON(url, params);
     if(res.success){
      let timeCount = 60;
      const timer = setInterval(()=>{
         if(timeCount -1 <0){
            clearInterval(timer)
            this.setState({canGetICode:true})
            this.setState({timerTxt:'获取验证码'})
         }else{
            timeCount--;
            this.setState({canGetICode:false})
            this.setState({timerTxt:'重发'+timeCount+'s'})
         }
      },1000)
      Toast.info('短信已发送 请注意查收', 3);
      }else{
        Toast.info(res.message, 3);
      }
     }catch(err){
        console.log('报错了'+err)
     }
      
      // axios({
      //   method:"GET",
      //   url:url,
      // })
      // .then((res)=>{
      //    console.log(res)
      //     if(res.data.success){
      //       let timeCount = 60;
      //       const timer = setInterval(()=>{
      //          if(timeCount -1 <=1){
      //             clearInterval(timer)
      //             this.setState({canGetICode:true})
      //             this.setState({timerTxt:'获取验证码'})
      //          }else{
      //             timeCount--;
      //             this.setState({canGetICode:false})
      //             this.setState({timerTxt:'重发'+timeCount+'s'})
      //          }
      //       },1000)
      //     }else{
      //         Toast.info(res.data.message, 2);
      //     }
      // })
      // .catch((err)=>{
      //   Toast.info('获取验证码失败', 2);
      //   Log(err)
      // })
        
    }else{
      Toast.info('请输入正确的员工编号', 2);
    }
  }
  private onClick = ()=>{
    Keyboard.dismiss();
    const params = {
      empNo: this.state.id.toLowerCase(),
      captcha: this.state.verifyCode
    }
    let Url = Config.API_URL+'v3/kjt/bank/employerAuth.json?empNo='+this.state.id.toLowerCase()+'&captcha='+this.state.verifyCode;
    this.setState({isLoading: true});
    axios({
      method:"POST",
      url:Url,
      headers:{
        'Accept': 'application/json',
        "Content-type":"application/json"
      },
      data:params,
    }) 
    .then((res)=>{
      //console.log(res)
    if(res.data.success && res.data.data!=null){
      this.setState({isLoading: false});
      Toast.success('恭喜员工认证成功', 3);
      this.props.dispatch(createAction('authenticationModel/authenticationChange')())
      this.props.dispatch(createAction('mine/fetchRealNameAuthStatus')());
      this.props.navigation.goBack();
    }else{
      this.setState({isLoading: false});
      Toast.info(res.data.message, 3);
    }
    })
    .catch((err)=>{
      console.log('出错了'+err)
      this.setState({isLoading: false});
      Toast.info('获取失败 请稍后再试', 3);
    })
      }
}

const styles = StyleSheet.create({
  textInputStyle: {
    height: 50,
  },
  verifyButton: {
    // borderColor: '#307DFB',
    // borderWidth: 1,
    // borderRadius: 25,
    // paddingTop: 5,
    // paddingBottom: 5,
    // paddingLeft: 15,
    // paddingRight: 15,
    // marginRight: 16,
    //flex: 1,
    width:140,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commitButton: {
    backgroundColor: '#77AAFC',
    width: width - 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 20,
    marginTop: 20,
  },
});

export default HaierStaffAuthentication;
