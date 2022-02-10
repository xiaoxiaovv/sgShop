import * as React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { INavigation } from '../../../interface/index';
import { Toast, Tabs, List, WhiteSpace, Button, ActivityIndicator, Grid, Progress } from 'antd-mobile';
import VisitCount, { IVisitCount, IPersonalCount } from '../../../components/Mine/VisitCount';
import DataSummaryTwoRowListItem, { IListItem } from '../../../components/Mine/DataSummaryTwoRowListItem';
import TeamTrendency from '../../../components/Mine/TeamTrendency';
import DataSummaryProgress from '../../../components/Mine/DataSummaryProgress';
import axios from 'axios';
import Config from 'react-native-config';
import CustomAlert from '../../../components/CustomAlert';

interface IState {
  showHistory: boolean;
  isLoading: boolean;
  countOfLatestDays: number;
  numArray: IVisitCount[];
  visitList: IListItem[];
  teamData: object;
  storeMemberMonthReport: object;
  detailData: IPersonalCount[];
  teamLevel: object;
  teamLevelMap: Array<{}>;
  teamLevelMapList: Array<{}>;
  PersonalData: object;
}

const tabs = [
  { title: '店铺数据', sub: '1' },
  { title: '团队数据', sub: '2' },
  { title: '个人数据', sub: '3' },
];

const LATESTSEVENDAYS = 7;
const LATESTTHIRTYDAYS = 30;
const dataParams = {
  visitType: 'STORE',
  daysType: 'WEEK',
}

class DataSummary extends React.Component<INavigation, IState> {
  public static navigationOptions = ({ navigation, screenProps }) => ({
    title: '数据统计',
    headerTintColor: 'white',
    headerStyle: {backgroundColor: '#0089FB', justifyContent: 'center'},
    headerTitleStyle: { color: 'white', alignSelf: 'center'},
    headerRight: (
      <TouchableOpacity style={{
        width: 56, flexDirection: 'row', justifyContent: 'center',
        alignItems: 'center',
      }}
        onPress={() => navigation.navigate('RootTabs')}
      >
        <Image style={{ height: 20, width: 20 }} source={require('../../../images/message_gray.png')} />
      </TouchableOpacity>
    ),
    headerBackTitle: null,
  })
  public state: IState = {
    showHistory: false,
    isLoading: false,
    countOfLatestDays: LATESTSEVENDAYS,
    numArray: [
      {
        count: 0,
        iconPath: 'http://cdn09.ehaier.com/shunguang/H5/www/img/visiNum@2x.png',
        text: '访客数',
      },
      {
        count: 0,
        iconPath: 'http://cdn09.ehaier.com/shunguang/H5/www/img/browNum@2x.png',
        text: '浏览次数',
      },
      {
        count: 0,
        iconPath: 'http://cdn09.ehaier.com/shunguang/H5/www/img/produVisiNum@2x.png',
        text: '商品访客数',
      },
      {
        count: 0,
        iconPath: 'http://cdn09.ehaier.com/shunguang/H5/www/img/goodsBrowNum@2x.png',
        text: '商品浏览量',
      },
      {
        count: 0,
        iconPath: 'http://cdn09.ehaier.com/shunguang/H5/www/img/shareVisiNum@2x.png',
        text: '分享访问人数',
      },
      {
        count: 0,
        iconPath: 'http://cdn09.ehaier.com/shunguang/H5/www/img/shareBrowNum@2x.png',
        text: '分享访问次数',
      },
    ],
    visitList: [],
    teamData: [],
    storeMemberMonthReport: [],
    detailData: [
      {
        icon: 'http://cdn09.ehaier.com/shunguang/H5/www/img/monthlyOrderNum@2x.png',
        count: 0,
        text: '当月单量',
      },
      {
        icon: 'http://cdn09.ehaier.com/shunguang/H5/www/img/monthlySales@2x.png',
        count: 0,
        text: '当月销售额',
      },
      {
        icon: 'http://cdn09.ehaier.com/shunguang/H5/www/img/predictCommi@2x.png',
        count: 0,
        text: '当月预计佣金',
      },
      {
        icon: 'http://cdn09.ehaier.com/shunguang/H5/www/img/accumulatedOrderNum@2x.png',
        count: 0,
        text: '累计单量',
      },
      {
        icon: 'http://cdn09.ehaier.com/shunguang/H5/www/img/accumulatedSales@2x.png',
        count: 0,
        text: '累计销售额',
      },
      {
        icon: 'http://cdn09.ehaier.com/shunguang/H5/www/img/totalCommi@2x.png',
        count: 0,
        text: '累计佣金',
      },
    ],
    teamLevelMap:[],
    teamLevelMapList:[],
    teamLevel: [],
    PersonalData: [],
  };
  public constructor(props) {
    super(props);
  }
  public componentDidMount() {
    this.setState({isLoading: true});
    this.axiosData('WEEK');
  }
  public render(): JSX.Element {
    return (<ScrollView style={{ backgroundColor: '#F4F4F4' }}>
      <Tabs tabs={tabs}
        initialPage={0}
        onChange={(tabSub) => { this.axiosDataTeam(tabSub.sub)}}
        renderTab={tab => <Text>{tab.title}</Text>}
      >
        {/* 店铺数据Tab */}
        <View style={{
          flex: 1,
          paddingBottom: 20,
        }}>
          <View style={{
            flexDirection: 'row',
            backgroundColor: 'white',
          }}>
            <View style={
              this.state.countOfLatestDays === LATESTSEVENDAYS ?
                styles.latestDaysTabActive : styles.latestDaysTab
            }>
              <TouchableOpacity
                style={
                  this.state.countOfLatestDays === LATESTSEVENDAYS ?
                    styles.latestDaysButtonActive : styles.latestDaysButton
                }
                onPress={() => {
                  this.setState({
                    isLoading: true,
                    countOfLatestDays: LATESTSEVENDAYS,
                  });
                  this.axiosData('WEEK');
                }}
              >
                <Text style={
                  this.state.countOfLatestDays === LATESTSEVENDAYS ?
                    styles.latestDaysTextActive : styles.latestDaysText
                }>最近7天</Text>
              </TouchableOpacity>
            </View>
            <View style={
              this.state.countOfLatestDays === LATESTTHIRTYDAYS ?
                styles.latestDaysTabActive : styles.latestDaysTab
            }>
              <TouchableOpacity
                style={
                  this.state.countOfLatestDays === LATESTTHIRTYDAYS ?
                    styles.latestDaysButtonActive : styles.latestDaysButton
                }
                onPress={() => {
                  this.setState({
                    isLoading: true,
                    countOfLatestDays: LATESTTHIRTYDAYS,
                  });
                  this.axiosData('MONTH');
                }}
              >
                <Text style={
                  this.state.countOfLatestDays === LATESTTHIRTYDAYS ?
                    styles.latestDaysTextActive : styles.latestDaysText
                }>最近30天</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{backgroundColor: 'white'}}>
            <View style={styles.latestRow}>
              <VisitCount {...this.state.numArray[0]}/>
              <VisitCount {...this.state.numArray[1]}/>
              <VisitCount {...this.state.numArray[2]}/>
            </View>
            <View style={styles.latestRow}>
              <VisitCount {...this.state.numArray[3]}/>
              <VisitCount {...this.state.numArray[4]}/>
              <VisitCount {...this.state.numArray[5]}/>
            </View>
          </View>
          <View style={{
            marginTop: 5,
            backgroundColor: 'white',
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 10,
            }}>
              <Text>7天访客排行榜</Text>
              <Text style={{color: '#91BAFD'}}>*排行榜截止到昨天24点</Text>
            </View>
            {
              this.state.visitList.map((item, index) => {
                return <DataSummaryTwoRowListItem key={index} {...item} />
              })
            }
            { 
              this.state.visitList.length > 0 
                ? null 
                : <View style={{ alignItems:'center', justifyContent:'center', paddingBottom:16,}}>
                  <Image style={{ height: 200, width: 200 }} source={{ uri:'http://cdn09.ehaier.com/shunguang/H5/www/img/Coupon@2x.png'}} />
                  <Text>零访问，加油分享吧！</Text> 
                </View>
            }
          </View>
        </View>
        {/* 团队数据Tab */}
        <View style={{
          flex: 1,
          }}>
          <View style={{
            paddingLeft: 10,
            paddingTop: 15,
            paddingBottom: 15,
          }}>
            <Text>{this.state.teamData.beginDate} - {this.state.teamData.endDate}</Text>
            <Text style={{ color: '#909090', marginTop: 5 }}>最近更新：{this.state.teamData.lastUpdateTime}</Text>
          </View>
          <TeamTrendency
            label={'合伙人'}
            count={this.state.teamData}
            teamOrPartner={true}
            iconUrl={'http://cdn09.ehaier.com/shunguang/H5/www/img/partner_data@2x.png'}
            onClick={() => { alert('clicked!'); }}
            developmentChartUrl={'http://cdn09.ehaier.com/shunguang/H5/www/img/month_act@2x.png'}
            activeChartUrl={'http://cdn09.ehaier.com/shunguang/H5/www/img/month_act@2x.png'}
            accumulatedActiveChartUrl={'http://cdn09.ehaier.com/shunguang/H5/www/img/total_act@2x.png'}
            activeRateChartUrl={'http://cdn09.ehaier.com/shunguang/H5/www/img/month_act_rea@2x.png'}
          />
          <TeamTrendency
            label={'团队'}
            teamOrPartner={false}
            count={this.state.teamData}
            iconUrl={'http://cdn09.ehaier.com/shunguang/H5/www/img/team_data@2x.png'}
            onClick={() => { alert('clicked!'); }}
            developmentChartUrl={'http://cdn09.ehaier.com/shunguang/H5/www/img/month_act@2x.png'}
            activeChartUrl={'http://cdn09.ehaier.com/shunguang/H5/www/img/month_act@2x.png'}
            accumulatedActiveChartUrl={'http://cdn09.ehaier.com/shunguang/H5/www/img/total_act@2x.png'}
            activeRateChartUrl={'http://cdn09.ehaier.com/shunguang/H5/www/img/month_act_rea@2x.png'}
          />
        </View>
        {/* 个人数据Tab */}
        <View style={{flex: 1}}>
          <View style={{
            paddingLeft: 10,
            paddingTop: 15,
            paddingBottom: 15,
          }}>
            <Text>{this.state.PersonalData.beginDate} - {this.state.PersonalData.endDate}</Text>
            <Text style={{ color: '#909090', marginTop: 5 }}>最近更新：{this.state.PersonalData.lastUpdateTime}</Text>
          </View>
          <View style={{
            backgroundColor: 'white',
          }}>
            <Grid data={this.state.detailData}
              columnNum={3}
              renderItem={dataItem => (
                <View style={{
                  padding: 10,
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}>
                  <Image source={{uri: dataItem.icon}} style={{ width: 30, height: 30 }} />
                  <Text style={{
                    marginTop: 5,
                    marginBottom: 5,
                  }}>{dataItem.count}</Text>
                  <Text>{dataItem.text}</Text>
                </View>
              )}
            />
          </View>
          <View style={{
            marginTop: 5,
            backgroundColor: 'white',
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 15,
              paddingBottom: 10,
              paddingLeft: 10,
              paddingRight: 10,
            }}>
              <Text>你的数据/{this.state.teamLevel.name}标准</Text>
              <TouchableOpacity
                style={{
                  borderRadius: 20,
                  borderColor: '#639DFC',
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: 5,
                  paddingBottom: 5,
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
                onPress={
                  () => {
                    this.props.navigation.navigate('DataAnalysis');
                  }
                }
              >
                <Text style={{color: '#639DFC'}}>我的数据</Text>
              </TouchableOpacity>
            </View>
            <DataSummaryProgress
              label={'合伙人人数（已认证）'}
              numerator={this.state.storeMemberMonthReport.subLevelNum}
              denominator={this.state.teamLevel.needSubLevelNum}
              unit={'人'}
              percent={this.state.storeMemberMonthReport.teamLevelId / this.state.teamLevel.needSubLevelNum*100}
            />
            <DataSummaryProgress
              label={'团队人数（已认证）'}
              numerator={this.state.storeMemberMonthReport.teamSize}
              denominator={this.state.teamLevel.needTeamSize}
              unit={'人'}
              percent={this.state.storeMemberMonthReport.teamSize/this.state.teamLevel.needTeamSize*100}
          />
            <DataSummaryProgress
              label={'团队活跃度（本月）'}
              clickText={'历史'}
              onClick={() => this.setState({ showHistory: true })}
              numerator={this.state.storeMemberMonthReport.teamVitality}
              denominator={this.state.teamLevel.needTeamVitality}
              unit={'%'}
              percent={this.state.storeMemberMonthReport.teamVitality / this.state.teamLevel.needTeamVitality*100}
            />
            <CustomAlert
              visible={this.state.showHistory}
              onClose={() => this.setState({ showHistory: false })}
              confirm={() => this.setState({ showHistory: false })}
            >
              <Text style={{ fontSize:16, fontWeight:'800', marginBottom: 12 }}>历史团队活跃度</Text>
              <Text style={{ marginBottom: 26,fontSize: 12 }}>最近12个月</Text>
              <View style={{ flexDirection: 'row', marginBottom: 26 }}>
                <View style={ styles.historyViewStyle }>
                  <Text style={ styles.historyTextStyle }>年/月</Text> 
                </View>
                <View style={ styles.historyViewStyle }>
                  <Text style={ styles.historyTextStyle }>活跃度</Text>
                </View>
              </View>
              <FlatList
                data={this.state.teamLevelMapList}
                renderItem={({ item }) => <View style={{ flexDirection: 'row', paddingBottom: 8, }}>
                  <View style={styles.historyViewStyle}>
                    <Text style={styles.historyTextStyle}>{item}</Text>
                  </View>
                  <View style={styles.historyViewStyle}>
                    <Text style={styles.historyTextStyle}>{this.state.teamLevelMap[item]}</Text>
                  </View>
                </View>}
              />
            </CustomAlert>
          </View>
        </View>
      </Tabs>
      <ActivityIndicator
        toast
        text='加载中...'
        animating={this.state.isLoading}
      />
    </ScrollView>);
  }

  private axiosData = (days) => {
    dataParams.daysType = days;
    let getUrl = Config.API_URL + Config.STORE_DATA_GET;
    axios.get(getUrl, { params: dataParams })
      .then((res)=>{
        return res.data;
      })
      .then((res)=>{
        if (res.success){
          const newNumArray = this.state.numArray.map((item) => item);
          newNumArray[0].count = res.data.storeVisitInfo.storeUv;
          newNumArray[1].count = res.data.storeVisitInfo.storePv;
          newNumArray[2].count = res.data.storeVisitInfo.productUv;
          newNumArray[3].count = res.data.storeVisitInfo.productPv;
          newNumArray[4].count = res.data.storeVisitInfo.shareUv;
          newNumArray[5].count = res.data.storeVisitInfo.sharePv;

          const visitList = [];
          const visitListArray = res.data.commonVisitList;
          if (visitListArray.length > 0) {
            visitListArray.forEach(element => {
              visitList.push({
                iconUrl: element.avatarImageFileId,
                nickName: element.nickName,
                source: element.source,
                browseTime: element.browseTime,
              });
            });
          }
          this.setState({
            isLoading: false,
            numArray: newNumArray,
            visitList,
          });
        }else{
          this.setState({
            isLoading: false,
          });
          Toast.info(res.message, 1);
        }
      })
      .catch((error) => {
        Log('====================================');
        Log(error);
        Log('====================================');
      })
  } 

  private axiosDataTeam = (index) => {
    if ( index == 1 ){
      return;
    } else if ( index == 2){
      if (this.state.teamData.beginDate!=undefined){
        return;
      }
      this.setState({
        isLoading: true,
      });
      let getUrl = Config.API_URL + Config.TEAM_DATA_GET;
      axios.get(getUrl)
        .then((res) => {
          return res.data;
        })
        .then((res) => {
          if (res.success){
            this.setState({ 
              teamData: res.data, 
              isLoading: false,
            });
          }else{
            this.setState({
              isLoading: false,
            });
            Toast.info(res.message, 1);
          }
        })
        .catch((error) => {
          Log(error);
        })
    } else if ( index == 3){
      if (this.state.PersonalData.beginDate!=undefined){
          return;
      }
      this.setState({
        isLoading: true,
      });
      let getUrl = Config.API_URL + Config.PERSONAL_DATA_GET;
      let getUrlM = Config.API_URL + Config.ACCUMULATED_COMMISSION_GET;
      axios.get(getUrl)
        .then((res) => {
          return res.data;
        })
        .then((res) => {
          if(res.success){
            let newDetailData = this.state.detailData.map((item) => item);
            let teamLevelMapL = [];
            newDetailData[0].count = res.data.monthlyOrderNum;
            newDetailData[1].count = res.data.monthlySales;
            newDetailData[3].count = res.data.accumulatedOrderNum;
            newDetailData[4].count = res.data.accumulatedSales;
            for (let key in res.data.map) {
              teamLevelMapL.push(key);
            }
            teamLevelMapL = teamLevelMapL.reverse();
            this.setState({
              isLoading: false,
              storeMemberMonthReport: res.data.storeMemberMonthReport,
              detailData: newDetailData,
              teamLevel: res.data.teamLevel,
              teamLevelMap: res.data.map,
              PersonalData: res.data,
              teamLevelMapList: teamLevelMapL,
            });
          }else{
            this.setState({
              isLoading: false,
            });
            Toast.info(res.message, 1);
          }
        })
        .catch((error) => {
          Log(error);
        })

        axios.get(getUrlM)
          .then((res)=>{
            return res.data;
          })
          .then((res)=>{
            let newDetailData = this.state.detailData.map((item) => item);
            newDetailData[2].count = res.data.newBrokerageAmount;
            newDetailData[5].count = res.data.totalBrokerageAmount;
            this.setState({
              detailData: newDetailData,
            });
          })
          .catch((error)=>{
            Log(error);
          })
    }
  }
}

const styles = StyleSheet.create({
  latestDaysTab: {
    flex: 1,
    borderBottomColor: '#E7E7E7',
    borderBottomWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  latestDaysTabActive: {
    flex: 1,
    borderBottomColor: '#639DFC',
    borderBottomWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  latestDaysButton: {
    height: 40,
    borderRadius: 20,
    borderColor: '#E7E7E7',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  latestDaysButtonActive: {
    height: 40,
    borderRadius: 20,
    borderColor: '#307DFB',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  latestDaysText: {
    color: 'black',
    fontSize: 15,
  },
  latestDaysTextActive: {
    color: '#69A1FC',
    fontSize: 15,
  },
  latestRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 10,
  },
  historyViewStyle: {
    width: '50%',
    height: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  historyTextStyle: {
    fontSize: 12,
  },
});

export default DataSummary;
