import * as React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { INavigation } from '../../../interface';
import { Row } from './IdentityAuthenticated';
import { getAppJSON, postAppJSON ,postAppForm} from '../../../netWork';
import Config from 'react-native-config';
import CustomNaviBar from '../../../components/customNaviBar';
import { ICustomContain } from '../../../interface';
import { createAction , connect} from '../../../utils';
import {GET} from '../../../config/Http';
import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;

interface IState {
  id: string;
  isActive: boolean;
}

@connect()

class HaierStaffAuthenticated extends React.Component<INavigation & ICustomContain,IState> {
 
  public constructor(props){
    super(props)
    this.state = {
        id:dvaStore.getState().authenticationModel.haierStaffData.empNo,
        isActive: false,
    }
  }
  public componentDidMount():void{
     //this.getOpenHotTime() //开门红入口
  }
  public render(): JSX.Element {
    return (
      <ScrollView>
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
        <View style={{
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
        }}>
          <Text style={{paddingTop: 5, paddingBottom: 5, color: '#B8B8B8',fontSize:12}}>员工认证已完成！</Text>
        </View>
        <View style={{backgroundColor: 'white'}}>
          <Row label={'员工编号'} content={this.state.id} />
        </View>
        <View>
          {
            this.state.isActive?
              <TouchableOpacity style={styles.btn}>
                  <Text>开门红抽奖入口</Text>
              </TouchableOpacity>
              :
              null
          }
        </View>
      </ScrollView>
    );
  }

  private getOpenHotTime = async ()=>{
    try{
      const url = URL.OPEN_HOT_LOTTERY;
      const res = await GET(url);
      if(res){
        this.setState({
          isActive: true
        })
      }else{
        this.setState({
          isActive: false
        })
      }
    }catch (error) {
      Log('实名认证错误：'+error)
    }
  }
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#FF4400',
    width: width - 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 20,
    marginTop: 20,
  },
})

export default HaierStaffAuthenticated;
