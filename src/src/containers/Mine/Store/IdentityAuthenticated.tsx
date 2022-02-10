import * as React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { INavigation } from '../../../interface';
import { Toast } from 'antd-mobile';
import { getAppJSON, postAppJSON ,postAppForm} from '../../../netWork';
import CustomNaviBar from '../../../components/customNaviBar';
import {getPrevRouteName ,connect, createAction} from '../../../utils';
import { ICustomContain } from '../../../interface';

interface IState {
  mobile:string;
  name: string;
  id: string;
}
@connect()

class IdentityAuthenticated extends React.Component<INavigation & ICustomContain, IState> {
 
  
  public constructor(props) {
    super(props);
    this.state={ 
        mobile: dvaStore.getState().authenticationModel.data.mobile,
        name: dvaStore.getState().authenticationModel.data.realName.replace(/.{1}/,"*"),
        id: dvaStore.getState().authenticationModel.data.identityNo.replace(/(\d{6})(\d+)(\d{2})/,function(x,y,z,p){
            var i="";
            while(i.length<z.length){i+="*"}
            return y+i+p;
      })
    }
  }
  public componentDidMount (): void{
   // console.log(dvaStore.getState().authenticationModel.data)
  }
  public render(): JSX.Element {
    return (
      <ScrollView style={{backgroundColor: '#F4F4F4'}}>
        <CustomNaviBar
          navigation={this.props.navigation} title={'身份证认证'}
          style={{zIndex: 1000,
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',}}
            leftAction={() =>{
              this.props.navigation.goBack() 
            }              
          }
          //titleView={}
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
          <Text style={{paddingTop: 5, paddingBottom: 5, color: '#B8B8B8'}}>身份认证已完成！</Text>
        </View>
        <View style={{backgroundColor: 'white'}}>
          <Row label={'手机号'} content={this.state.mobile} />
          <Row label={'证件类型'} content={'身份证'} />
          <Row label={'姓名'} content={this.state.name} />
          <Row label={'证件号'} content={this.state.id} />
        </View>
      </ScrollView>
    );
  }
  
}

export const Row = ({label, content}: {label: string, content: string}) => (
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
    <Text style={{flex: 3, color: '#6E6E6E',fontSize:12}}>{content}</Text>
  </View>
);

export default IdentityAuthenticated;
