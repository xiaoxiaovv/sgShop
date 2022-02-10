import * as React from 'react';
import {View, ScrollView, Image, Text, Platform, TouchableOpacity, NativeModules, StyleSheet as ES, TouchableWithoutFeedback} from 'react-native';
import { INavigation } from '../../interface';
import { isiPhoneX } from '../../utils';
import { NavBar } from './../../components';
import {NavigationUtils} from '../../dva/utils';
import sqzbs3 from './../../images/sqzbs3.jpg';

import { GET } from './../../config/Http';
import URL from './../../config/url';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
const Sip = ES.hairlineWidth;
import SQZBS from './../../images/compare.png';
import { goToSQZBS } from '../../utils/tools';
import {connect} from 'react-redux';

@connect()
export default class PaymentResult extends React.Component<INavigation> {

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            showTop: false,
            showSQZBS: false,
            communityUrl: '',
        };
      }
      componentWillMount(){
          // 获取是否显示社群争霸赛按钮
          // const param = {
          //     productId: '',
          //     storeId: '',
          //     type: 3,
          // };
          // GET(URL.GET_IF_CIRCLEPAGE, param).then((res)=>{
          //     if(res.success && res.data){
          //         this.setState({showSQZBS: true, communityUrl: res.data});
          //     }
          // }).catch((err)=>{
          //     console.log(err);
          // });
      }
    componentDidMount() {
      const { navigation : { state: {params: {orderSn, price}}} } = this.props;
      const mid = dvaStore.getState().order.pageInfo.mid;
      const productList = dvaStore.getState().order.pageInfo.ordersCommitWrapM.orderProductList;
      let itemId = [];
      let baifendprice = [];
      let baifendnumber = [];
      if(productList){
        for(var i = 0; i<productList.length;i++){
            itemId[i] = productList[i].sku + '';
            baifendprice[i] = Number(productList[i].price);
            baifendnumber[i] = Number(productList[i].number);
        }
    }
    const params = {
      uid: mid + '',
      total: price + '',
    };
      // 小熊客服  yl
      /**
       * 支付成功页轨迹标准接口
       * @param command 数组
              * @param title 商品页的名字
              * @param url 商品页的url
              * @param ref 上一页url
              * @param orderid 订单id
              * @param orderprice 订单价格
              * @param sellerid 商户id
      */
      NativeModules.XnengModule.NTalkerPaySuccessAction([
        '支付成功',
        'rn:#/PaymentResult',
        '',
        (orderSn+''),
        (price+''),
        '',
      ]);
      //baifend  maidian cxw
      NativeModules.BfendModule.onPay([mid + '',orderSn+'',itemId,baifendprice,baifendnumber, Number(price)],params);

    }



  public render(): JSX.Element {
    const { navigation } = this.props;
    return (
        <View style={{flex: 1}}>
            <NavBar title={'付款成功'} defaultBack={false} />
            <ScrollView >
        <View style={{flex: 1, justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F5F4F4'}}>

        <View style={{
          paddingTop: Platform.OS === 'android' ? 70 : isiPhoneX ? 134 : 90,
          alignItems: 'center',
        }}>
          <Image
            style={{
              width: 105,
              height: 105,
            }}
            source={{uri: 'http://www.ehaier.com/mstatic//wd/img/pages/msg/pay.png'}}
          />
          <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 10}}>付款成功</Text>
          <Text style={{
            fontSize: 16,
            marginTop: 10,
          }}>
            主人，您的宝物正加急呈送中
          </Text>
          <Text style={{
            fontSize: 16,
          }}>
            若无劫匪出没，不日便可到达
          </Text>
          <Text style={{
            fontSize: 15,
            marginTop: 20,
            color: '#666',
          }}>
            关注微信公众号：“顺逛微店”，
          </Text>
          <Text style={{
            fontSize: 16,
            color: '#666',
          }}>
            享一手资讯，拿幸运好礼！
          </Text>
        </View>
        <View style={{
          marginBottom: isiPhoneX ? 54 : 20,
        }}>
          <TouchableOpacity
            style={{
              width: width - 80,
              paddingTop: 15,
              paddingBottom: 15,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#007aff',
                marginTop: 20
            }}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('OrderList', {orderStatus: 0, orderFlag: 0})}
          >
            <Text style={{color: 'white'}}>查看订单</Text>
          </TouchableOpacity>
        </View>
      </View>
                <View style={{marginTop: 20}}>
                    <TouchableWithoutFeedback  onPress={()=>{
                        goToSQZBS();
                    }} >
                        <Image style={{width: width, height: 0.32*width}} source={sqzbs3}/>
                    </TouchableWithoutFeedback>
                </View>
            </ScrollView>
        </View>
    );
  }
}
