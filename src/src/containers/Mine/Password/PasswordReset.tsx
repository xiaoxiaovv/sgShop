import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import React from 'react';
import axios from 'axios'
import CustomNaviBar from '../../../components/customNaviBar'
import Spinner from '../../../components/Spinner'
import { INavigation } from '../../../interface/index'
import { Toast } from 'antd-mobile'
import ClearBtn from './ClearBtn'
import Config from 'react-native-config';
import { getAppJSON } from '../../../netWork';
import { NavigationActions } from 'react-navigation';
import { connect, createAction, passwordRegExp } from '../../../utils';
import { ShowAdType } from '../../../interface';

@connect()
class PasswordReset extends React.Component <INavigation> {
    
    public static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: '修改密码',
            header: null,
        }
    }
    
    constructor(props) {
      super(props);
      this.state = {
          old:false,
          newone: false,
          newtwo: false,
          clear: false,
          oldPsd: '',
          newPsdOne: '',
          newPsdTwo: '',
          data: [],
      }
    }

    componentDidMount() {
        this.setState({data:dvaStore.getState().users});
    }
    
    showClearBtn(show, item, inputValue) {
        // 当前的imput框选中后会显示删除的按钮
        // 记得看一下参数的传递
        if (show) {
            return (
                <ClearBtn
                    onPress={() => {
                        this.refs[item].setNativeProps({text: ''});
                        this.state[inputValue] = '';
                    }}
                />);
        } else {
            return null;
        }
    }

    private logout = async () => {
        const res = await getAppJSON(Config.LOGOUT);
        if (res.success) {
            this.props.dispatch({ type: 'users/clearUserLoginInfo' });
            this.props.dispatch({ type: 'cartModel/clearCartInfo' });
            global.setItem('User', null);
            global.setItem('roleInfo', null);
            this.props.navigation.navigate('Login');
        }else{
            Toast.info('退出登录失败', 1);
        }
    }

    passwordVertify() {

        const oldPsd = this.state.oldPsd;
        const newPsdOne = this.state.newPsdOne;
        const newPsdTwo = this.state.newPsdTwo;
        // 还差对新输入的密码进行校验
        if (!passwordRegExp.test(newPsdOne)){
            Toast.info('密码不符合规则！');
        }else if(!oldPsd.length || !newPsdOne.length || !newPsdTwo.length){
            Toast.info('密码不能为空');
        }else if( newPsdOne.length < 6 && newPsdOne.length > 1 ) {
            Toast.info('请输入正确密码格式');
        }else if( newPsdOne != newPsdTwo ) {
            Toast.info('两次密码输的不一样');
        }else{
            this.refs.spinner.loading();
            const Url = `${Config.API_URL}v3/platform/web/member/updatePassword.json`;
            let params = {
                oldPassword: oldPsd,
                password: newPsdTwo,
                token: this.state.data.token,
                userName: this.state.data.userName,
            }
            axios({
                method: "post",
                url: Url,
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded',
                    // 'TokenAuthorization': '',
                },
                data: params,
                transformRequest: [function (data) {
                    let ret = ''
                    for (let it in data) {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                    }
                    return ret
                }],
            }).then(response => {
                this.refs.spinner.done();
                // 正常修改密码后跳转到登录页面，暂时为了测试 跳转到上一个页面
                const { results } = response.data;
                if(response.data.success) {
                    Toast.info('密码修改成功', 2);
                    this.logout();
                }else{
                    Toast.info(response.data.message);
                    this.refs.old.setNativeProps({text: ''});
                    this.refs.newone.setNativeProps({text: ''});
                    this.refs.newtwo.setNativeProps({text: ''});
                    this.setState({
                        oldPsd: '',
                        newPsdOne: '',
                        newPsdTwo: '',
                    })
                }
            })
            .catch(error => Log(error));
        }

        

    }

    render() {
        return (
            <View style={styles.wrapper}>
            <Spinner ref="spinner" />
                <CustomNaviBar
                    style={{ backgroundColor: '#FFF' }}
                    navigation={this.props.navigation}
                    hiddenLeftBtn={false}
                    containerStyle={{ backgroundColor: 'transparent' }}
                    leftViewStyle={{ marginLeft: 5 }}
                    local={{ leftStyle: { width: 22, height: 22 } }}
                    titleView={
                        <Text style={{
                            color: '#000',
                            fontFamily: 'PingFangSC-Light',
                            fontSize: 20
                        }}>修改密码</Text>}
                    rightView={
                        <Text onPress={()=>{ this.passwordVertify() }} style={{
                            color: '#2577e3',
                            fontFamily: 'PingFangSC-Light',
                            fontSize: 17,
                            marginTop: 10,
                            marginRight: 16,
                        }}>保存</Text>
                    }
                />
                <View style={styles.wrap}>
                    <View style={[styles.formGroup]}>
                      <TextInput style={styles.input}
                        placeholder='请输入原始密码'
                        underlineColorAndroid="transparent"
                        secureTextEntry={true}
                        onChangeText={(text)=>{
                            this.setState({oldPsd:text})
                        }}
                        autoCapitalize='none'
                        ref="old"
                        maxLength={20}
                        onFocus={() => this.setState({old: true})}
                        onBlur={() => this.setState({old: false})}/>
                        {this.showClearBtn(this.state.old, 'old', 'oldPsd')}
                    </View>
                  <View style={[styles.formGroup]}>
                    <TextInput style={styles.input}
                      secureTextEntry={true}
                      placeholder='请输入新密码'
                      autoCapitalize='none'
                      underlineColorAndroid="transparent"
                      onChangeText={(text)=>{this.setState({newPsdOne:text})}}
                      ref="newone"
                      maxLength={20}
                      onFocus={() => this.setState({newone: true})}
                      onBlur={() => this.setState({newone: false})}/>
                      {this.showClearBtn(this.state.newone, 'newone', 'newPsdOne')}
                  </View>
                  <View style={[styles.formGroup,styles.phone]}>
                    <TextInput style={styles.input}
                      secureTextEntry={true}
                      placeholder='确认新密码'
                      autoCapitalize='none'
                      maxLength={20}
                      underlineColorAndroid="transparent"
                      onChangeText={(text)=>{this.setState({newPsdTwo:text})}}
                      ref="newtwo"
                      onFocus={() => this.setState({newtwo: true})}
                      onBlur={() => this.setState({newtwo: false})}
                      />
                      {this.showClearBtn(this.state.newtwo, 'newtwo', 'newPsdTwo')}
                  </View>
                </View>
                <View>
                    <Text style={styles.hints}>提示：密码为数字、字母、特殊符号中的两种组合，长度6位~20位(字母区分大小写)</Text>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    wrapper: {
        flex:1,
    },
    wrap:{
        backgroundColor:'#f1f1f1',
        marginTop: 20,
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
    company:{
        marginTop:20,
        marginBottom:15,
    },
    phone:{
        borderColor:'#dfdfdf',
    },
    input:{
        height:50,
        color:'#282828',
        borderRadius:3,
        paddingLeft:15,
        fontSize:17,
        flex:1,
    },
    hints: {
        marginTop: 12,
        marginLeft: 20,
        marginRight: 20,
        fontSize: 15,
        color: '#333333',
        lineHeight: 22,
    },
    loading: {
        flex: 1,
        justifyContent: 'center'
    },
});

export default PasswordReset;

