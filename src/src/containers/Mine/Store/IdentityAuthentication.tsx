import * as React from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, StyleSheet, Keyboard } from 'react-native';
import { INavigation } from '../../../interface';
import { Row } from './IdentityAuthenticated';
import { Toast } from 'antd-mobile';
import Config from 'react-native-config';
import { getAppJSON, postAppJSON ,postAppForm} from '../../../netWork';
import { createAction , connect} from '../../../utils';
import axios from 'axios';
import { NavigationActions } from 'react-navigation';
import CustomNaviBar from '../../../components/customNaviBar';
import { ICustomContain } from '../../../interface';
import { ActivityIndicator } from 'antd-mobile';
//axios.defaults.headers.post['content-Type'] = 'appliction/x-www-form-urlencoded';
import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

interface IState {
  isLoading:boolean;
  phoneName:string;
  name: string;
  id: string;
  isOk: boolean;
}
@connect()

// @connect(({
//   AuthenticationModel: AuthenticationModel,
// }) => {return {
//   isAuth: AuthenticationModel.isAuth
// }})
class IdentityAuthentication extends React.Component<INavigation & ICustomContain, IState> {
 
  public constructor(props) {
    super(props);
    this.state = {
      isLoading:false,
      phoneName:dvaStore.getState().users.mobile ,//电话
      name: '', //姓名
      id: '',   //身份证号
      isOk: false,
    };
  }
  
  public componentDidMount(){
    
  }
  public render(): JSX.Element {
    return (
      
         <View style={{flex:1}}>
            <CustomNaviBar
              navigation={this.props.navigation} title={'身份证认证'}
              style={{zIndex: 1000,
                borderBottomWidth: 1,
                borderBottomColor: '#ccc',}}
                leftAction={() =>
                    this.props.navigation.goBack()      
              }
              //titleView={}
              rightTitle='说明'
              rightAction={() => this.props.navigation.navigate('AgreementWebview',
                  { helpId: 915, title: ' 实名认证服务协议' })}
              local={{
                leftStyle: { marginLeft: 8 },
              }}
            />
            <ScrollView  style={{flex:1}}
              keyboardShouldPersistTaps="always"
              keyboardDismissMode="on-drag"
            >
            <View style={{
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 10,
              paddingBottom: 10,
            }}>
              <Text style={{paddingTop: 5, paddingBottom: 5, color: '#B8B8B8'}}>
                请尽快完成身份认证，此决定后续佣金发放归属，一旦认证不能更换，身份认证信息必须与注册手机号身份信息一致。
              </Text>
            </View>
            <View style={{backgroundColor: 'white'}}>
              <Row label={'手机号'} content={this.state.phoneName} />
              <Row label={'证件类型'} content={'身份证'} />
              <EditingRow label={'姓名'} holder={'请填写您的真实姓名'} onChangeText={(name) => this.setState({name})} />
              <EditingRow label={'证件号'} holder={'填写对应真实名称的身份证号'} onChangeText={(id) => this.setState({id})} />
            </View>
            {
            ( this.state.name.length > 1  &&  this.state.id.length > 10)?
                <TouchableOpacity style={[styles.commitButton,{backgroundColor:'#2464E6'}]} onPress={this.onClick}>
                    <Text style={{color: 'white'}}>确定</Text>
                </TouchableOpacity>
              :
              <TouchableOpacity style={styles.commitButton}>
                <Text style={{color: 'white'}}>确定</Text>
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
  
  private onClick = async (navigation) => {
    Keyboard.dismiss();
    const that = this.props;
    const self = this;
    const params = {
      realName: this.state.name,
      identityNo: this.state.id,
      mobile: this.state.phoneName,
      channal: 'APP',
    }
    let url = Config.API_URL+'v3/kjt/bank/realNameAuth.json?realName='+this.state.name+'&identityNo='+this.state.id+'&mobile='+this.state.phoneName+'&channal='+"APP";
    this.setState({isLoading: true});
    axios({
        method:"POST",
        url:url,
        headers:{
          'Accept': 'application/json',
          "Content-type":"application/json"
        },
        data:params,
    }) 
    .then((res)=>{
      console.log(res)
      if(res.data.data){
        this.setState({isLoading: false});
        Toast.success(res.data.message, 4);
        this.props.dispatch(createAction('authenticationModel/authenticationChange')());
        this.props.dispatch(createAction('mine/fetchRealNameAuthStatus')());
        this.props.navigation.goBack();
       
      }else{
        this.setState({isLoading: false,isOk:false});
        Toast.info(res.data.message, 5);
      }
   })
   .catch((err)=>{
    this.setState({isLoading: false,isOk:false});
     Log(err)
   })
  }
}

const EditingRow = ({label, holder, onChangeText}: {label: string, holder: string, onChangeText: (text) => void}) => (
  <View style={{
    borderBottomColor: '#F4F4F4',
    borderBottomWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 14,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    height:48,
  }}>
    <Text style={{flex: 1, color: 'black',fontSize:12}}>{label}</Text>
    <TextInput
      style={{
        flex: 3,
        color: '#6E6E6E',
        height:48,
      }}
      placeholder={holder}
      underlineColorAndroid={'transparent'}
      onChangeText={(text) => onChangeText(text)}
    />
  </View>
);

const styles = StyleSheet.create({
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

export default IdentityAuthentication;
