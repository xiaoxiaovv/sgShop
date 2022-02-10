import * as React from 'react';
import { connect } from 'react-redux';
import { Tabs, List, WhiteSpace } from 'antd-mobile';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  TouchableOpacity,
  ActivityIndicator, // 加载指示器
} from 'react-native';
import { getAppJSON, postAppForm, postAppJSON } from '../../../netWork';
import { INavigation } from '../../../interface/index';
import WalletCards from './walletCards';
import Config from 'react-native-config';
import CustomNaviBar from '../../../components/customNaviBar';


interface IState {
  walletDate: any;
  applyStatus: string;
  crdComAmt: number;
  crdComAvailAmt: number;
}

interface IProps {
  userId: number;
  token: string;
}

@connect(({users: {userId, token}}) => ({userId, token}))
class Mywallet extends React.Component<INavigation & IProps, IState> {
  public state: IState;
  public listener: any;
  constructor(props) {
    super(props);
    this.state = {
      walletDate: {
        seashellPoint: 0,
        consumedSeashellCount: 0,
        consumedSeashellPoint: 0,
        usableDiamond: 0,
        consumDiamond: 0,
        consumDiamondPoint: 0,
      },
      applyStatus: '2',
      crdComAmt: 0,
      crdComAvailAmt: 0,
    };
  }

  public componentDidMount() {
    this.getWallet();
    this.queryIousStatus();
  }

  public render(): JSX.Element {
    return (
      <View style={{flex: 1, backgroundColor: '#fff', opacity: 0.9}}>
        <CustomNaviBar
            navigation={this.props.navigation}
            title="我的钱包"
            rightTitle="帮助"
            leftAction={()=>{this.props.navigation.goBack()}}
            rightAction={()=>this.props.navigation.navigate('AgreementWebview', {title: '顺逛钱包相关说明', helpId: 883})}
        />
        <View style={{paddingLeft: 16, paddingRight: 16, backgroundColor: '#f4f4f4', height: '100%'}}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('WalletIntegral')} activeOpacity={0.8}>
            <WalletCards
              text='积分'
              total={this.state.walletDate.seashellPoint}
              consume={this.state.walletDate.consumedSeashellCount}
              duct={this.state.walletDate.consumedSeashellPoint}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('WalletDiamonds')} activeOpacity={0.8}>
            <WalletCards
              text='钻石'
              total={this.state.walletDate.usableDiamond}
              consume={this.state.walletDate.consumDiamond}
              duct={this.state.walletDate.consumDiamondPoint}
            />
          </TouchableOpacity>
          {
            this.renderApplyStatus()
          }
        </View>
      </View>
    );
  }

  private renderApplyStatus = (): JSX.Element => {
    if ('2' === this.state.applyStatus || '3' === this.state.applyStatus) {
      return <ApplyStatusBackground
        imageSrc={require('../../../images/pay_group_5.png')}
        onPress={() => this.routingToIous()}
      />;
    } else if ('1' === this.state.applyStatus) {
      return <TouchableOpacity onPress={() => this.routingToIous()} activeOpacity={0.8}>
        <WalletCards
          text='顺逛白条'
          total={this.state.walletDate.usableDiamond}
          consume={this.state.walletDate.consumDiamond}
          duct={this.state.walletDate.consumDiamondPoint}
          crdComAmt={this.state.crdComAmt}
          crdComAvailAmt={this.state.crdComAvailAmt}
        />
      </TouchableOpacity>;
    } else if ('0' === this.state.applyStatus) {
      return <ApplyStatusBackground
        imageSrc={require('../../../images/baitiao-shengqingzhong.png')}
        onPress={() => this.routingToIous()}
      />;
    }
  }

  private routingToIous = async () => {
      if (!dvaStore.getState().users.accessToken) {
          Toast.fail('您的当前帐号暂时无法访问此服务,请使用关联手机号登录', 2);
          return;
      }

      const userId = dvaStore.getState().users.ucId;
      const token = dvaStore.getState().users.accessToken;
      const res = await postAppJSON(Config.WHITE_SHOWS_QUERY_STATUS, {userId, token});
      if (res.success) {
          if (res.data.applyStatus === 2 ||
              res.data.applyStatus === '2' ||
              res.data.applyStatus === '3' ||
              res.data.applyStatus === 3) {
              // 跳转到applyForWhite页面
              this.props.navigation.navigate('BaiTiao');
          } else {
              // 申请中直接打开消费金融
              const backUrl = `${Config.API_URL}index.html`;
              const resData = await postAppForm(
                `${Config.WHITE_SHOWS_APPLY}?backUrl=${backUrl}&token=${token}&userId=${userId}`,
                {backUrl, userId, token},
              );
              if (resData.success) {
                  // 打开顺逛白条H5
                  this.props.navigation.navigate('CustomWebView', {
                      customurl: resData.data.redirectUrl,
                      headerTitle: '顺逛白条',
                      flag: true,
                    });
              }
              if (resData.errorCode === '-100') {
                  // 去登录页面
                  this.props.navigation.navigate('Login');
              }
          }
      }
      if (res.errorCode === 100) {
          this.props.navigation.navigate('Login');
      }
  }
  private async getWallet() {
    const res = await getAppJSON(
      '/v3/h5/sg/getBenefitMember.json',
    );
    Log('...............', res, 'cuicuicuicucicuicuci');
    if (res.success === true) {
        if (res.data) {
            this.setState({walletDate: res.data});
        }
    }
  }

  private queryIousStatus = async () => {
    const params = {
      userId: this.props.userId,
      token: this.props.token,
    };
    const {success, data} = await postAppJSON('v3/kjt/queryIousStatus.json', params);
    if (success && data) {
      const { applyStatus } = data;
      if (applyStatus) {
        this.setState({applyStatus});
        if ('1' === applyStatus) {
          const resp = await postAppJSON('v3/kjt/queryAvaliAmt.json', {token: this.props.token});
          if (resp.success && resp.data) {
            const {crdComAmt, crdComAvailAmt} = resp.data;
            this.setState({crdComAmt, crdComAvailAmt});
          }
        }
      }
    }
  }
}

const ApplyStatusBackground = ({onPress, imageSrc}: {onPress: () => void, imageSrc: any}) => (
  <View>
    <Text style={{marginTop: 16, marginBottom: 5}}>顺逛白条</Text>
    <View style={{position: 'relative'}}>
      <Image source={require('../../../images/pay_group.png')}
             style={{height: 120, width: '100%', borderRadius: 3}}/>
      <TouchableOpacity
        onPress={onPress}
        style={{
          width: 200,
          height: 50,
          marginTop: -25,
          marginLeft: -100,
          position: 'absolute',
          top: '50%',
          left: '50%',
        }}>
        <Image source={imageSrc} style={{width: 200, height: 50}}/>
      </TouchableOpacity>
    </View>
  </View>
)

export default Mywallet;
