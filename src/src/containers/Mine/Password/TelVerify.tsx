import { 
    View, 
    Text, 
    TextInput, 
    Image, 
    StyleSheet,
    TouchableOpacity, 
} from 'react-native';
import React from 'react';
import ClearBtn  from './ClearBtn';
import { Toast } from 'antd-mobile';
import axios from 'axios';
import Config from 'react-native-config';
var codeTime = 60;//倒计时60s设定

class TelVerify extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            timerCount: codeTime,
            phone: '',
            code: '',
            btnBackColor: '#0076ff',
            text: '获取验证码',
            disabled: false,
            time: 60,
            smstext: '',
            onOff: false,
            isAuth: false,
            userData: '',
        }
    }

    runTimer = () => {
        this.timer = setTimeout(
            () => {
                if (this.state.time >= 1) {
                    let time = this.state.time - 1;
                    this.setState({ disabled: true, time: time, text: time + "秒后重新获取" }, ()=>{
                        this.runTimer();
                    });
                } else {
                    this.timer && clearTimeout(this.timer);
                    this.setState({ disabled: false, time: 60, text: "获取验证码" });
                }
            },
            1000
        );
    }

    public getAuthenticationState = () => {
        const urlIsAuth = Config.API_URL + Config.TRUE_REALNAMEAUTH;
        axios.get(urlIsAuth)
            .then((res) => res.data)
            .then((res) => {
                if (res.success) {
                    if (res.data.isAuth) {
                        //实名认证过
                        this.setState({ isAuth: true, userData: res.data.identity}); //认证

                    } else {
                        //没有实名认证
                        this.setState({ isAuth: false }); //没认证
                    }
                } else {
                    Toast.info(res.message);
                }
            })
    }

    //获取验证码
    registerVcode = ()=> {
        const urlCode = Config.API_URL + Config.CHANGETELCODEGET;
        axios.get(urlCode, { params: { mobileNum:this.state.phone}})
            .then((res)=>res.data)
            .then((res)=>{
                if (res.success){
                    Toast.info('验证码已发送，请查收');
                    this.setState({ disabled: true, time: 60, text: "60秒后重新获取" });
                    this.runTimer();
                }else{
                    Toast.info(res.message);
                }
            })
    }
    //下一步
    nextSubmit = ()=> {
        if(this.state.isAuth){
            const urlNext = Config.API_URL + Config.CHANGETELNEXTGET;
            if (this.state.smstext.length != 6){
                return;
            }
            if(this.state.smstext.length == 6) {
                axios.get(urlNext, { params: { captcha: this.state.smstext,mobileNum: this.state.phone } })
                    .then((res) => res.data)
                    .then((res) => {
                        if (res.success) {
                                this.props.navigation.navigate('TelSecond', { realName: this.state.userData.realName, identityNo: this.state.userData.identityNo, });
                        } else {
                            Toast.info(res.message);
                        }
                    })
            }
        }else{
            this.props.navigation.navigate('myIdCardAuthen');
        }
    }

    telCantUse = ()=>{
        if (this.state.isAuth){
            this.props.navigation.navigate('TelThird', { realName: this.state.userData.realName, identityNo: this.state.userData.identityNo,});
        }else{
            this.props.navigation.navigate('myIdCardAuthen');
        }
    }


    componentWillMount() {
        // 从带过来的路由参数里面取值
        const { params } = this.props.navigation.state;
        this.setState({ phone: params.phone});
        this.getAuthenticationState();
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
    render() {

        const {onOff} = this.state;

        return (
            <View style={styles.wrapper}>
                <Text style={styles.hint}>{this.state.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</Text>
              <View style={styles.formGroup}>
                <TextInput style={styles.input}
                  placeholder='请输入短信验证码'
                  underlineColorAndroid="transparent"
                  maxLength={6}
                  keyboardType ="numeric"
                  onChangeText={(text)=>{
                    (text.length == 6) ? this.setState({onOff: true}) : this.setState({onOff: false})
                    this.setState({smstext:text})
                  }}
                  ref="smscode"
                  />
                  <TouchableOpacity 
                      disabled={this.state.disabled}
                      onPress={() => this.registerVcode()}
                      style={styles.getBtn}>
                      <Text style={styles.btn}>{this.state.text}</Text>
                  </TouchableOpacity>
                  
              </View>
              <TouchableOpacity
              onPress={this.telCantUse}
              style={styles.useable}>
                <Text style={styles.inner}>手机号不可用?</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={this.nextSubmit}>
                <View style={[styles.btnone,{backgroundColor: (onOff ? "#2979FF" : "#C9C9C9")},{shadowColor: (onOff ? "#2979FF" : "#C9C9C9")}]}> 
                  <Text style={styles.texttwo}>下一步</Text>
                </View>
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
        alignItems: 'center'
    },
    hint: {
      fontSize: 24,
      color: '#666',
      marginTop: 80,
      marginBottom: 40,
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
      borderRightWidth:1,
      borderColor:'#dfdfdf',
    },
    getBtn:{
      width:120,
      height:50,
      justifyContent:'center',
      alignItems:'center',
      marginLeft:6,
      // borderLeftWidth:1,
      // borderColor:'#dfdfdf',
    },
    btn: {
      color:'#09f',
      fontSize:15,
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
        // backgroundColor: '#2979FF',
        //backgroundColor: '#C9C9C9',
        borderRadius: 50,
        // shadowColor: 'rgba(41,121,255,.5)',
        //shadowColor: '#C9C9C9',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
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

export default TelVerify;

