import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';


export default class cell extends Component {

    constructor(props) {
        super(props);

        this.state = {
          loading: false,
          data: [],
          page: 1,
          seed: 1,
          error: null,
          refreshing: false,
          isRefreshing: false,
          users: [],
          truedata: [],
          searchtype: 2,//搜索类型
          startindex: 1,//默认页数
          pagesize: 10,//每次请求返回数据条数
        };
      }

    renderLoad(){
        const {loading} = styles
        return (
            <View style={loading}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    renderUserItem({ item }) {
        return (
            <View style={styles.list}>
                <View style={styles.subItem}>
                    <View style={styles.lpart}>
                        <Text style={styles.ltitle}>{item.desc}</Text>
                        <Text style={styles.lcontent}>{item.operTimeStr}</Text>
                    </View>
                    <View style={styles.rpart}>
                        <Text style={styles.sright}>{item.creditNumWithSign}</Text>
                    </View>
                </View>
            </View>
        )
    }

    componentDidMount() {

        const page = this.state.startindex;
        const type = this.state.searchtype;
        const userToken = dvaStore.getState().users.userToken;
        const newUrl = `${Config.API_URL}v3/mstore/sg/credit/findCreditDetail.html?searchType=${type}&startIndex=${page}&pageSize=20`;
        // 进入页面首先请求接口数据
        axios({
              method: "get",
              url: newUrl,
              headers:{
                  "TokenAuthorization": userToken,
              }
          })
        .then(response => {
              const newsList = response.data.data.rows;
              this.setState({ 
                truedata: newsList,
                startindex: this.state.startindex + 1,
              });
        })
        .catch(error => Log(error));
    }

  render() {
    const {isRefreshing} = this.state;
    const refershControl = (<RefreshControl
            onRefresh={() => {
                // console.log('这个是下拉加载')
                this.setState({isRefreshing: true});
                setTimeout(() => {
                    this.setState({isRefreshing: false});
                    // console.log('加载过程中需要执行的函数')
                }, 3000);
            }}
            refreshing={isRefreshing}
            title={'刷新中'}
            colors={['#EFEFEF']}
            progressBackgroundColor={"#DFDFDF"}/>);


    return(
      <View style={styles.wrapper}>
          {!this.state.truedata.length
              ? this.renderLoad() 
              : <FlatList
                  data={this.state.truedata}
                  // keyExtractor={item => item.id.value}
                  renderItem={this.renderUserItem}
                  contentContainerStyle={styles.container}
                  refreshControl={refershControl}
                  onEndReachedThreshold={0.5}
                  onEndReached={() => {
                    const userToken = dvaStore.getState().users.userToken;
                    const that = this;
                    const newPage = this.state.startindex;
                    const type = this.state.searchtype;
                    const myPage = `${Config.API_URL}v3/mstore/sg/credit/findCreditDetail.html?searchType=${type}&startIndex=${newPage}&pageSize=20`;
                    axios({
                          method:"get",
                          url: myPage,
                          headers:{
                              "TokenAuthorization": userToken,
                          }
                      })
                    .then(response => {
                          const newsList = response.data.data.rows;
                          this.setState({ 
                            truedata: this.state.truedata.concat(newsList),
                            startindex: this.state.startindex + 1,
                          });
                    })
                    .catch(error => Log(error));
                  }}
              />
          }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 10,
  },
  list: {
    flex: 1,
  },
  subItem: {
    backgroundColor: "#fff",
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 6,
    flexDirection: 'row',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  lpart: {
    flex: 6
  },
  rpart: {
    flex: 2,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  ltitle: {
    color: '#333',
    fontSize: 16,
    marginBottom: 8,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2'
  },
  lcontent: {
    color: '#666666',
    fontSize: 14,
    paddingTop: 8
  },
  img: {
    width: 46,
    height: 46,
    marginBottom: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center'
  }
});