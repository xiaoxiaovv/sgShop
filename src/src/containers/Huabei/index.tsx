import * as React from 'react';
import { View, Text, FlatList, Platform } from 'react-native';
import { connect } from 'react-redux';
import Button from 'rn-custom-btn1';
import EStyleSheet from 'react-native-extended-stylesheet';
import {ICustomContain} from '../../interface';
import { accAdd, accMul, accSub } from '../../utils/MathTools';
import { NavigationActions } from 'react-navigation';
import URL from '../../config/url';
import { GET, POST_JSON, GET_P, POST_FORM} from '../../config/Http';
import Header from '../../components/Header'

export interface IHuabeiProps {
  payList: [any];
  totalFee: number;
}

export interface IHuabeiState {
  tipsShow: boolean;
  selectedValue: number;
}

@connect(({payModel}) => payModel)
export default class Huabei extends React.Component<IHuabeiProps&ICustomContain, IHuabeiState> {
  public static navigationOptions = ({navigation}) => {
    return {header: <Header goBack={() => navigation.goBack()} title={'花呗分期'}/>};
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
      type: 'payModel/fetchHuabeiList',
      payload: params,
    });
  }

  public render() {
    const { payList, totalFee } = this.props;
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <Text style={{margin: 10}}>应付金额</Text>
          <Text style={{margin: 10, color: 'red'}}>{`￥${totalFee}`}</Text>
        </View>
        <View style={{backgroundColor: '#EEEEEE', width: '100%', height: 1}}/>
        <Text
          style={{margin: 8, fontSize: 12, color: '#8bcef8', alignSelf: 'flex-end'}}
          onPress={this.handleTipsShow}>
          什么是花呗分期？
        </Text>
        {this.state.tipsShow &&
          <Text style={{padding: 10, backgroundColor: '#8bcef8', color: 'white', fontSize: 10 , lineHeight: 18}}>
            花呗分期是阿里集团旗下蚂蚁小贷提供的先消费后分期还款的网购服务，您将进入支付宝的页面，完成最后的支付。
          </Text>}
        <View style={{backgroundColor: '#EEEEEE', width: '100%', height: 1}}/>
        <FlatList
          data={payList}
          extraData={this.state}
          keyExtractor={(item) => item.eachPrin + ''}
          renderItem={this.renderItem}
          ItemSeparatorComponent={() => <View style={{backgroundColor: '#EEEEEE', width: '100%', height: 1}}/>}
          />
        <Button
          title='立即支付'
          onPress={this.handlePay}
          textStyle={{color: 'white', fontWeight: 'bold', fontSize: 14}}
          style={{margin: 20, height: 40, borderRadius: 40, backgroundColor: '#3c7cf6'}}
          />
      </View>
    );
  }

  private handlePay = async () => {
    // 库存校验 yl
    const rs = await GET(URL.PAYCHECK, {
        orderSn: this.props.orderSn
    });
    if(!rs.success){ // 库存不足
        Toast.fail(rs.message, 2);
        return
    }
    Log('handlePay==========', this.props);
    this.props.dispatch({
      type: 'payModel/fetchHuabeiTradeInfo',
      payload: {
        orderSn: this.props.orderSn,
        number: this.props.payList[this.state.selectedValue].number,
        success: this.navigateToSuccessPage,
        fail: this.navigateToFailPage,
      },
    });
  }
    private navigateToSuccessPage = (result) => {
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'PaymentResult',
            params: { info: result },
          }),
        ],
      });
      this.props.navigation.dispatch(resetAction);
    }

    private navigateToFailPage = () => {
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'PaymentFailed',
            params: null,
          }),
        ],
      });
      this.props.navigation.dispatch(resetAction);
    }


  private renderItem = ({item, index}) => {
    const selectBtnBg = this.state.selectedValue === index ?
      require('../../images/ic_select.png') : require('../../images/ic_check.png');
    const textContent = `￥${accAdd(item.eachPrin , item.eachFee)}x${item.number}期\n含服务费：每期￥${item.eachFee},费率${item.feeRate}%`;
    return(
      <View style={styles.row}>
        <Button
          style={styles.selectedBtn}
          image={selectBtnBg}
          imageStyle={styles.selectedImg}
          onPress={() => this.handleSelected(index)}
        />
        <View>
          <Text style={{padding: 10, lineHeight: 25}}>
            {textContent}
          </Text>
        </View>
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
    height: ROWHEIGHT,
    alignItems: 'center',
    flexDirection: 'row',
  },
  selectedBtn: {
    height: ROWHEIGHT,
    width: '48rem',
  },
  selectedImg: {
    width: '16rem',
    height: '16rem',
  },
});
