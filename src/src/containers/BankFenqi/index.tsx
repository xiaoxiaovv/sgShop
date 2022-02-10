import * as React from 'react';
import { View, Text, FlatList, Platform, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import Button from 'rn-custom-btn1';
import EStyleSheet from 'react-native-extended-stylesheet';
import {ICustomContain} from '../../interface';
import { accAdd, accMul, accSub } from '../../utils/MathTools';
import { getAppJSON } from '../../netWork';
import { Toast } from 'antd-mobile';
import { NavBarConfig } from '../RootContainers/rootNavigator';
import { isiPhoneX } from '../../utils';
import Header from '../../components/Header'

export interface IHuabeiProps {
  payList: [any];
  totalFee: number;
}

export interface IHuabeiState {
  tipsShow: boolean;
  selectedValue: number;
}

let fenqiHelp = '';
let fenqiTips = '';
@connect(({payModel}) => payModel)
export default class BankFenqi extends React.Component<IHuabeiProps&ICustomContain, IHuabeiState> {
  public static navigationOptions = ({navigation}) => {
    return {header: <Header goBack={() => navigation.goBack()} title={navigation.state.params.title}/>};
  }

  public constructor(props: IHuabeiProps) {
    super(props);
    this.state = {
      tipsShow: false,
      selectedValue: 0,
    };
  }

  public componentWillMount() {
    const { params } = this.props.navigation.state;
    this.props.dispatch({
      type: 'payModel/fetchBankFenqiList',
      payload: params,
    });
    if (params.payType === 'ccb_fenqi') {
      fenqiHelp = '什么是建设银行分期？';
      fenqiTips = '建设银行信用卡支付(分期需要500元以上可以使用)使用的建设银行信用卡由建设银行保证。归还方式也是与普通信用卡保持一致。由建设银行统一对用户解释和负责';
    } else {
      fenqiHelp = '什么是光大银行分期？';
      fenqiTips = '光大银行信用卡支付(分期需要500元以上可以使用)使用的光大银行信用卡由光大银行保证。归还方式也是与普通信用卡保持一致。由光大银行统一对用户解释和负责';
    }
  }

  public render() {
    const { bankFenqiData, navigation: { state: { params } } } = this.props;
    const costInfo = bankFenqiData ? bankFenqiData.costInfo : null; 
    return (
      <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <Text style={{margin: 10}}>应付金额</Text>
          <Text style={{margin: 10, color: 'red'}}>{`￥${bankFenqiData.totalFee}`}</Text>
        </View>
        <View style={{height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <Text style={{margin: 10}}>优惠金额</Text>
          <Text style={{margin: 10, color: 'red'}}>{`￥${bankFenqiData.benefitFee}`}</Text>
        </View>
        <View style={{height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <Text style={{margin: 10}}>实付金额</Text>
          <Text style={{margin: 10, color: 'red'}}>{`￥${bankFenqiData.payFee}`}</Text>
        </View>
        <View style={{backgroundColor: '#EEEEEE', width: '100%', height: 1}}/>
        <View
          style={{
            backgroundColor: 'white',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 10,
            paddingTop: 10,
            paddingBottom: 10,
          }}>
            <Image
              style={{height: 20, width: 20, resizeMode: 'contain'}}
              source={
                'ccb_fenqi' === params.payType ? require('../../images/ccb1.png') :
                require('../../images/12ceb1.png')
              }
            />
            <Text style={{marginLeft: 10}}>{'ccb_fenqi' === params.payType ? '建行信用卡分期' : '光大信用卡分期'}</Text>
          </View>
          <Text
            style={{margin: 8, fontSize: 12, color: '#8bcef8'}}
            onPress={this.handleTipsShow}>
            {fenqiHelp}
          </Text>
        </View>
        {this.state.tipsShow &&
        <Text style={{padding: 10, backgroundColor: '#8bcef8', color: 'white', fontSize: 10, lineHeight: 18}}>
          {fenqiTips}
        </Text>}
        <View style={{backgroundColor: '#EEEEEE', width: '100%', height: 1}}/>
        {
          costInfo && costInfo.map((item, index) => this.renderItem(item, index))
        }
        {
          'ccb_fenqi' === params.payType && <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: '#519BF8'}}>实付金额大于等于500元可以使用分期</Text>
          </View>
        }
        <Button
          title='立即支付'
          onPress={this.handlePay}
          textStyle={{color: 'white', fontWeight: 'bold', fontSize: 14}}
          style={{margin: 20, height: 40, borderRadius: 40, backgroundColor: '#3c7cf6'}}
        />
        {
          this.props.bankFenqiData.feeInfo ? <View style={{
            paddingLeft: 20,
            paddingBottom: isiPhoneX ? 54 : 20,
          }}>
            <Text style={{color: '#f02864', marignBottom: 15}}>活动介绍</Text>
            <Text>{ this.props.bankFenqiData.feeInfo }</Text>
          </View> : null
        }
      </ScrollView>
    );
  }
  private handlePay = async () => {
    const { params } = this.props.navigation.state;
    const number = this.props.bankFenqiData.costInfo[this.state.selectedValue].number;
    if (!number) {
      Toast.fail('请选择一种分期方式');
    }
    const { errorCode, message } = await getAppJSON('v3/h5/sg/orderPayCheckNew.html', {orderSn: params.orderSn});

    if (errorCode == -200) {
      Toast.fail(message, 2);
    } else {
      this.props.dispatch({
        type: 'payModel/fetchBankPayInfo',
        payload: {
          orderSn: params.orderSn,
          num: number,
          channel: 'sg',
          payType: params.payType,
          cfgMark: this.props.bankFenqiData.cfgMark,
          memberId: params.memberId,
          // joinActivity: 1, // 存疑
        },
      });
    }
  }

  private renderItem = (item, index) => {
    const selectBtnBg = this.state.selectedValue === index ?
      require('../../images/ic_select.png') : require('../../images/ic_check.png');
    return(
      <View
        style={[
          styles.row,
          index > 0 ? {
            borderTopWidth: 1,
            borderTopColor: '#EEEEEE',
          } : null,
        ]}
        key={index}>
        <Button
          title={item.number === 1 ? `不分期` : `分${item.number}期`}
          style={styles.selectedBtn}
          image={selectBtnBg}
          innerStyle={{flexDirection: 'row'}}
          imageStyle={styles.selectedImg}
          onPress={() => this.handleSelected(index)}
        />
          {
            item.number === 1 ?
            <View style={{flexDirection: 'row', flex: 1}}>
              <Text style={{textAlign: 'right', flex: 1, paddingRight: 10}}>
                {`${item.desc}`}
              </Text>
            </View> :
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between', padding: 10, paddingBottom: 0}}>
                <Text style={{}}>
                  {`首期还款(含手续费)`}
                </Text>
                <Text style={{ textAlign: 'right'}}>
                  {`￥${item.prinAndFee}`}
                </Text>
              </View>
              <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between', padding: 10}}>
                <Text style={{flex: 1}}>
                  {`2-${item.number}期每期还款`}
                </Text>
                <Text style={{flex: 1, textAlign: 'right'}}>
                  {`￥${item.eachPrin}`}
                </Text>
              </View>
              <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between', padding: 10, paddingTop: 0}}>
                <Text style={{}}>
                  {`总共还款`}
                </Text>
                <Text style={{textAlign: 'right', flex: 1}}>
                  {`￥${item.totalPrinAndFee}`}
                </Text>
              </View>
            </View>
          }
      </View>
    );
  }

  private handleSelected = (index) => {
    this.setState({
      selectedValue: index,
    });
  }

  private handleTipsShow = () => {
    this.setState({
      tipsShow: !this.state.tipsShow,
    });
  }
}

const ROWHEIGHT = '90rem';
const styles = EStyleSheet.create({
  row: {
    width: '100%',
    // height: ROWHEIGHT,
    alignItems: 'center',
    flexDirection: 'row',
  },
  selectedBtn: {
    // height: ROWHEIGHT,
    width: '100rem',
  },
  selectedImg: {
    width: '16rem',
    height: '16rem',
  },
});
