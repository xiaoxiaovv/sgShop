import * as React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { INavigation } from '../../../interface';
import EStylesheet from 'react-native-extended-stylesheet';
import CustomNaviBar from '../../../components/customNaviBar';
import { createAction , connect} from '../../../utils';
import { ICustomContain } from '../../../interface';

import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;

interface IState {
  idAuthed: boolean;
  staffAuthed: boolean;
}

const mapStateToProps =({
  authenticationModel:{isAuthentication,isHaierStaffAuthentication,data,haierStaffData}
})=>({
  isAuthentication,isHaierStaffAuthentication,data,haierStaffData
})
@connect(mapStateToProps)
class Authentication extends React.Component<INavigation & ICustomContain, IState> {
 
  public constructor(props) {
    super(props);
    // this.state = {
    //   idAuthed: this.props.isAuthentication,
    //   staffAuthed: this.props.isHaierStaffAuthentication,
    // };
  }

  public componentWillMount(){
    
  }
  public componentDidMount() {
    //this.getInfo();
    this.props.dispatch(createAction('authenticationModel/authenticationChange')())
  }
  public render(): JSX.Element {
    return (
      <ScrollView style={{backgroundColor: '#fff'}}> 
      <CustomNaviBar
          navigation={this.props.navigation} title={'我的认证'}
          style={{zIndex: 1000,
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',}}
            leftAction={() =>{
              this.props.navigation.goBack();    
            }                      
          }
          rightTitle='说明'
          rightAction={() => this.props.navigation.navigate('AgreementWebview',
              { helpId: 915, title: ' 实名认证服务协议' })}
          local={{
            leftStyle: { marginLeft: 8 },
          }}
        />
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          width,
          marginTop:14,
          backgroundColor:'#fff'
        }}>
         
          <TouchableOpacity onPress={() => this.handleIdAuthClick()}>
            <Image
              style={[
                styles.image,
                styles.mRight,
              ]}
              source={
                this.props.isAuthentication ? {uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/sfz_true.png'} :
                {uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/sfz_false.png'}
              }
            />
            <Text style={styles.msg}>身份证认证</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.handleStaffAuthClick()}>
            <Image
              style={[
                styles.image,
                styles.mLeft,
              ]}
              source={
                this.props.isHaierStaffAuthentication ? {uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/staff_true.png'} :
                {uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/staff_false.png'}
              }
            />
            <Text style={styles.msg}>海尔员工认证</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
  
  private handleIdAuthClick(): void {
    if (this.props.isAuthentication) {
      this.props.navigation.navigate('IdentityAuthenticated');
    } else {
      this.props.navigation.navigate('IdentityAuthentication');
    }
  }
  private handleStaffAuthClick(): void {
    if (this.props.isHaierStaffAuthentication) {
      this.props.navigation.navigate('HaierStaffAuthenticated');
    } else {
      this.props.navigation.navigate('HaierStaffAuthentication');
    }
  }
  // private getInfo = async ()=> {
  //   try{
  //     const url = 'v3/kjt/bank/isRealNameAuth.json';
  //     const res = await getAppJSON(url);
  //     console.log(res)
  //     if(res.success && res.data){
  //       if(res.data.identity!=null){ //已认证
  //         this.setState({
  //           idAuthed:true,
  //         })
  //         this.props.dispatch(createAction('authenticationModel/authenticationChange')())
  //       }else{
  //         this.setState({
  //           idAuthed:false,
  //         })
  //       }
  //       if(res.data.empInfo!=null){
  //         this.setState({
  //           staffAuthed:true,
  //         })
  //         this.props.dispatch(createAction('authenticationModel/authenticationChange')())
  //       }else{
  //         this.setState({
  //           staffAuthed:false,
  //         })
  //       }
  //     }else{
  //       this.setState({
  //         idAuthed:false,
  //         staffAuthed:false,
  //       })
  //       Toast.info(res.message);
  //     }
  //   }catch (error) {
  //     Log('实名认证错误：'+error)
  //   }
  // }
}

const styles = EStylesheet.create({
  image: {
    width: '155rem',
    height: '100rem',
  },
  mRight: {
    marginRight: '10rem',
  },
  mLeft: {
    marginLeft: '10rem',
  },
  msg: {
    marginTop: 8,
    paddingLeft: 10,
    color: '#333',
    fontSize: 14,
  }
});

export default Authentication;
