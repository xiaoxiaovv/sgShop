import * as React from 'react';
  import {
    View,
    TouchableHighlight,
    Text,
    Image,
    ScrollView,
    FlatList,
  } from 'react-native';
  import { getAppJSON } from '../../../netWork';
import LinearGradient from 'react-native-linear-gradient';
import EStyleSheet from 'react-native-extended-stylesheet';
import { getUserInfo } from '../../../dvaModel/userUtil';
import Header from '../../../components/Header'

interface IState {
  data: Array<{}>,
  walletDate:any,
  pageNo:number,
  totalPage:number,
  type:any,
  emptys:boolean
}
  class WalletIntegral extends React.Component<IState> {
    public state:IState;
    public static navigationOptions = ({navigation}) => {
      return {header: <Header
        goBack={() => {navigation.goBack();}}
        title='积分明细'/>};
    }

    constructor(props) {
      super(props);
      this.state = {
          data:[],
          totalPage:0,
          walletDate:{},
          pageNo:1,
          type:null,
          emptys:false
      }
    }
    public componentDidMount() {
      this.totalData();
      this.loadData(null,1);
    }

    private async totalData(){
      const res= await getAppJSON(
        '/v3/h5/sg/getBenefitMember.json'
  );
        if (res.success === true) {
            if (res.data) {
                this.setState({walletDate: res.data});
            }
        }
    }
    private async loadData(type,pageNo){
       const json = await getUserInfo();
       Log(json.mid,type);
       const res = await getAppJSON(
        '/v3/h5/sg/getBenefitDetails.json',
        type==null?{
          memberId:json.mid,
			benefitType:'seashell',
			pageNo:pageNo,
			pageSize:10
        }:{
          memberId:json.mid,
      benefitType:'seashell',
      transType:type,
			pageNo:pageNo,
			pageSize:10
        },
      ); 
      Log(res);
      if(res.success&&res.data.paymentList){
        this.setState({
          data:this.state.data.concat(res.data.paymentList),
          totalPage:res.data.totalCount/res.data.pageSize,
          emptys:false
        });
      }
      if(!res.success){
        alert('服务器发生未知错误')
      }
      if(res.success&&res.data.paymentList.length==0){
            this.setState({
                emptys:true
            })
      }
    }
    private loadDefaultData(type){
          this.setState({
            pageNo:1,
            type:type,
            dada:this.state.data.splice(0, this.state.data.length)
          },()=>{
            this.loadData(type,this.state.pageNo);
          })
          
          
    }
    render():JSX.Element {
      return (
        <ScrollView
         onScroll={this._onEndReached.bind(this)}
         scrollEventThrottle={50}
        >
            <LinearGradient
            colors={['#63C8FF', '#3963FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            >
              <View style={styles.topCont}>
                <View style={{paddingLeft:20}}>
                  <Text style={{color:'#fff',fontSize:14,marginTop:21,height:20}}>
                  <Image 
                  style={styles.Igimg}
                  source={require('../../../images/haibeijifen.png')}
                  />&nbsp;&nbsp;当前积分</Text>
                  <Text style={{color:'#fff'}}><Text  style={{fontSize:36}}>{this.state.walletDate.seashellPoint}</Text>分</Text>
                  <View style={styles.Igdicout}><Text style={styles.IgdiText}>可抵现金{this.state.walletDate.seashellPointAmt}元</Text></View>
                </View>
                <View style={styles.tagcont}>
                  <Text style={[styles.fontColor,this.state.type==null?styles.pressTagcont:{}]} onPress={()=>this.loadDefaultData(null)}>全部</Text>
                  <Text style={[styles.fontColor,this.state.type=='1'?styles.pressTagcont:{}]} onPress={()=>this.loadDefaultData('1')}>收入</Text>
                  <Text style={[styles.fontColor,this.state.type=='0'?styles.pressTagcont:{}]} onPress={()=>this.loadDefaultData('0')}>支出</Text>
                </View>
              </View>
            </LinearGradient> 
            <View>
              {
                this.state.emptys?
                (<Text style={{color:'#999',fontSize:14,marginTop:110,textAlign:'center'}}>暂无积分明细～</Text>)
                :
                <FlatList 
              data={this.state.data}
              renderItem={this._renderItem}
              /> 
              }
            </View>
        </ScrollView>
      );
    }
    private _renderItem = ({item}) => (
      <View style={styles.dataItem}>
        <Text>{item.payTime.substring(4,6)+'月'+item.payTime.substring(6,8)+'日'}</Text>
        <Text>{item.transType==0?'支出':'收入'}</Text>
        <View>
          <Text>{item.transType==0?'-':'+'}{item.changeCount}</Text>
        <Text style={{color:'#999',fontSize:12}}>{item.remark}</Text>
        </View>
    </View>
    )
    private _renderFooter(){

    }
    private _onEndReached(event){
      let y = event.nativeEvent.contentOffset.y;
        let height = event.nativeEvent.layoutMeasurement.height;
        let contentHeight = event.nativeEvent.contentSize.height;
        if(y+height>=contentHeight-20){
          if(this.state.pageNo>=this.state.totalPage){
            return;
        } else {
            this.setState({
              pageNo:this.state.pageNo+1
            })
        }
        this.loadData(this.state.type,this.state.pageNo)
        }
      
    }
  }
  const styles = EStyleSheet.create({
    topCont:{
        height:'200rem',
        width:'100%'

    },
    Igimg:{
      height:'15rem',
      width:'14rem',
      marginTop:3
    },
    Igdicout:{
      marginTop:90,
      position:'absolute',
      left:20,
      paddingLeft:10,
      paddingRight:10,
      paddingTop:3,
      paddingBottom:3,
      borderRadius:18,
      backgroundColor:'#fff'
    },
    IgdiText:{
      color:'#4E96E9',
      fontSize:12,
    },
    tagcont:{
      height:45,
      position:'absolute',
      bottom:0,
      left:0,
      right:0,
      flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    },
    pressTagcont:{
      backgroundColor:'rgba(0,0,0,0.34)',
      opacity:1
    },
    fontColor:{
      height:45,
      lineHeight:45,
      backgroundColor:'#000',
      opacity:0.34,
      color:'#fff',
      fontSize:14,
      flex:1,
      textAlign:'center'
    },
    dataItem:{
      height:65,
      fontSize:14,
      flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    }
  });
  export default WalletIntegral;