import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    FlatList,
    RefreshControl, TouchableOpacity,
} from 'react-native';
import React from 'react';
import axios from 'axios';
import ListItem from './ListItem';
import Newempty from './Newempty';
import Header from '../../components/Header';
import Config from 'react-native-config';
import {Toast} from 'antd-mobile';

import url from '../../config/url';
import {GET} from '../../config/Http';
import { connect } from 'react-redux';
// 获取从dva里获取
const mapStateToProps = ({ users: { unread } }) => ({ unread });
@connect(mapStateToProps)
class orderMsg extends React.Component {
  private page = 0;
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: [],
            page: 1,
            seed: 1,
            error: null,
            refreshing: false,
            users: [],
            truedata: [],
            emptydata: false,
            newdata: [],
            startindex: 1,//默认页数
            isRefreshing: false,
        };
        this.renderUserItem = this.renderUserItem.bind(this);
        this.onUserItemPress = this.onUserItemPress.bind(this);
    }

    public static navigationOptions = ({navigation}) => {
        return {
            header: <Header goBack={() => navigation.goBack()} title={"订单消息"}>
                <View style={{position: 'absolute', right: 5, flexDirection: 'row'}}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingRight: 10,
                        }}
                        onPress={() => {
                            GET(url.READ_ALL_MESSAGE).then(data => {
                                Toast.success('已读成功', 2);
                            })
                        }}>
                        <Text style={{color: 'gray'}}>全部已读</Text>
                    </TouchableOpacity>
                </View>
            </Header>
        };
    };

    reference() {
        goDetail = function(obj){
          //将该消息制成已读
          var params = {
            id:obj.id
          };
          MESSAGECENTERService.checkRead(params).success(function(response){
            MESSAGECENTERService.unreadMessage();//查看 未读信息
          });
          var u = navigator.userAgent;

          if(obj.type ==1){//帮助
            if (u.indexOf('iPhone') != -1) {
              var ref = InAppBrowserService.open(UrlService.getHead() + 'mstore/sg/helpDetail.html?id=' + obj.relationId,obj.title);
              ref.addEventListener('exit', function (event) {
              });
            } else {
              $state.go('helpDetail', {'helpId': obj.relationId,'content':obj.title});
            }

          }else if(obj.type == 2){//佣金
            $state.go('shopRevenue');

          }else if(obj.type == 3 || obj.type == 51){//退款
            $state.go('orderDetail', {'orderSn':'','cOrderSn':'','cOrderId': obj.relationId});
          }else if(obj.type == 4){//微信学堂
            if (u.indexOf('iPhone') != -1) {
              var ref = InAppBrowserService.open(UrlService.getHead() + 'mstore/sg/helpDetail.html?id=' + obj.relationId,obj.title);
              ref.addEventListener('exit', function (event) {
              });
            } else {
              $state.go('helpDetail', {'helpId': obj.relationId,'content':obj.title});
            }
          }else if(obj.type == 5){//订单完成
            $state.go('orderManage',{orderStatus:4});
          }else if(obj.type == 7){//后台测试使用
            if (u.indexOf('iPhone') != -1) {
              var ref = InAppBrowserService.open(UrlService.getHead() + 'mstore/sg/helpDetail.html?id=' + obj.relationId,obj.title);
              ref.addEventListener('exit', function (event) {
              });
            } else {
              $state.go('helpDetail', {'helpId': obj.relationId,'content':obj.title});
            }
          }
          else if(obj.type == 601){//社群消息
            if (obj.relationId) {
              $state.go('noteDetails',{noteId: obj.relationId, isShortStory: 1});//普通帖话题详情，评论赞
            } else {
              $state.go('goldRecord');
            }
          } else if(obj.type == 602) {
            $state.go('noteDetails',{noteId: obj.relationId, isShortStory: 0});//普通帖话题详情，评论赞
          } else if(obj.type == 603) {
            if (obj.relationId) {
              $state.go('classNoteDetails',{noteId: obj.relationId});//微学堂话题详情，评论赞
            } else {
              $state.go('goldRecord');
            }

          } else if(obj.type == 604) {
            $state.go('myFans');//我的粉丝
          } else if(obj.type == 0){
            var memberId=UserService.getUser().mid;
            $state.go('goldRecord');
            // -1 积分变动消息
            // -2 O2O店铺等级变动消息
          }else if(obj.type == -3){//订单评价消息 productId
            $state.go('productRated', {'productId': obj.relationId});
          }else if(obj.type == -4){//物流配送消息 orderId
            //将orderId转为orderSn
            var url = UrlService.getUrl('ORDER_INFO');

            var serializedData = $.param({'orderId':obj.relationId});

            $http({
              method: 'POST',
              url: url,
              data: serializedData,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }}).then(function(response){
                if(response.data.success) {
                  var orderSn = response.data.data.ordersn;
                  console.log('orderSn='+orderSn);
                  $state.go('orderTracking', {'orderSn': orderSn});
                }
            }, function(error) {
              console.log(error);
            });
          }else if(obj.type == -5){//订单退货消息 orderProductId
            var memberId=UserService.getUser().userId;
            $state.go('refundDetail', {'orderProductId': obj.relationId,'memberId':memberId});
          }else if(obj.type == -6){//订单金额累计消息
            $state.go('orderManage');
          }else if (obj.type == -12||obj.type == -11) {
            $state.go('myCouponsList');
          }else if (obj.type == -13||obj.type == -15||obj.type == -21) {
            $state.go('shopRevenue');
          }else if (obj.type == -14) {
            $state.go('walletDiamonds');
          }else{
            $scope.init();
          }
        };
    }
    renderLoading() {
        const {smallLoad} = styles;
        return (
            <View style={smallLoad}>
                <ActivityIndicator size="large"/>
            </View>
        )
    }

    renderUserItem({item}) {
        // return <View><Text>{JSON.stringify(item)}</Text></View>
        return <ListItem user={item} onPress={() => this.onUserItemPress({user: item})}/>;
    }

    onUserItemPress({user}) {
        const {navigation} = this.props;
        if(user.type == 5){
            // 订单签收
            navigation.navigate('OrderList', {orderFlag: 0, orderStatus: 4});
        }else if(user.type == 3 || user.type == 51){//退款
          // 跳转到订单详情页
          this.props.navigation.navigate('OrderDetail', {
            unread: this.props.unread,
            cOrderSn: '',
            cOrderId: user.relationId,
          });
        } else if (user.type == -5){
            //订单退货消息
            navigation.navigate('RefundDetail', {memberId: user.memberId, orderProductId: user.relationId});
        } else if (user.type == -6){
            //订单金额累计消息
          navigation.navigate('OrderList');
        } else if (user.type == -3){
          navigation.navigate('GoodsDetail', { productId: user.relationId });
        }
    }

    public componentWillUnmount() {
        // 点击了返回,当前界面pop出栈,刷新前一个界面
        const {callBack} = this.props.navigation.state.params;
        if (callBack) {
            // 刷新我的界面
            callBack();
        }
    }


    componentDidMount() {
      this.loadData(true);
      //this.page = this.state.startindex;
      // const userToken = dvaStore.getState().users.userToken;
      // const newUrl = `${Config.API_URL}v3/mstore/sg/messageCenter.html?messageType=1&page=${this.page}&size=10`;
      // axios({
      //     method: "get",
      //     url: newUrl,
      //     headers: {
      //         "TokenAuthorization": userToken,
      //     }
      // })
      // .then(response => {
      //     if (response.data.data.orderCount != 0 && response.data.data.orderMesagesList != null ) {
      //         const orderMesagesList = response.data.data.orderMesagesList;
      //         this.setState({
      //             truedata: orderMesagesList,
      //             startindex: this.state.startindex + 1,
      //         });
      //     } else {
      //         this.setState({emptydata: true})
      //     };
      // })
      // .catch(error => Log(error));
    }


    render() {
        const {isRefreshing} = this.state;
        const refershControl = (<RefreshControl
            onRefresh={() => {
                this.setState({isRefreshing: true});
                setTimeout(() => {
                    this.setState({isRefreshing: false});
                }, 3000);
            }}
            refreshing={isRefreshing}
            title={'刷新中'}
            colors={['#EFEFEF']}
            progressBackgroundColor={"#DFDFDF"}/>);

    return (
      <View style={styles.wrapper}>
        {!this.state.truedata.length
            ? (this.state.emptydata ? <Newempty /> : this.renderLoading() )
            : <FlatList
                data={this.state.truedata}
                keyExtractor={(item,index) => {
                  return index+"";
                }}
                renderItem={this.renderUserItem}
                contentContainerStyle={styles.container}
                refreshControl={refershControl}
                onEndReachedThreshold={0.5}
                onEndReached={this.loadData.bind(this)}
            />
        }
      </View>
    )
  }

  loadData(init) {
    if(this.page >= this.state.startindex){
        return;
    }

    const userToken = dvaStore.getState().users.userToken;
    this.page = this.state.startindex;
    const url = `${Config.API_URL}v3/mstore/sg/messageCenter.html?messageType=1&page=${this.page}&size=10`;
    axios({
        method: "get",
        url: url,
        headers: {
            "TokenAuthorization": userToken,
        }
    })
        .then(response => {
            const orderMesagesList = response.data.data.orderMesagesList;
            if(init && response.data.data.orderCount == 0) {
              this.setState({emptydata: true});
            }else if(orderMesagesList){
              this.setState({
                  truedata: this.state.truedata.concat(orderMesagesList),
                  startindex: this.state.startindex + 1,
              });
          }
        })
        .catch(error => Log(error));
  }
}
const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingTop: 14,
        backgroundColor: "#f2f2f2",
    },
    hints: {
        marginTop: 12,
        marginLeft: 20,
        marginRight: 20,
        fontSize: 15,
        color: '#333333',
        lineHeight: 22,
    },
    smallLoad: {
        flex: 1,
        justifyContent: 'center'
    },
    empty: {
        fontSize: 22,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
});

export default orderMsg;


