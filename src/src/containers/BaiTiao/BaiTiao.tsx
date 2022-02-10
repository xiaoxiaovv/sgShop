import * as React from 'react';
import {ImageBackground, NativeModules, Platform} from 'react-native';
import Button from 'rn-custom-btn1';
import EStyleSheet from 'react-native-extended-stylesheet';
import { ICustomContain } from '../../interface';
import { getAppJSON } from '../../netWork';
import Config from 'react-native-config';
import { Toast } from 'antd-mobile';
import { isLogin } from '../../utils';
import Header from '../../components/Header'

export interface IBaiTiaoProps {
}

export interface IBaiTiaoState {
}

export default class BaiTiao extends React.Component<IBaiTiaoProps & ICustomContain, IBaiTiaoState> {
  public static navigationOptions = ({navigation}) => {
    return {header: <Header goBack={() => navigation.goBack()} title={"顺逛白条"}/>};
};
  constructor(props: IBaiTiaoProps) {
    super(props);

    this.state = {
    };
  }

  public render(): JSX.Element {
    return (
      <ImageBackground style={styles.contain} source={require('../../images/baitiao_background.png')}>
        <Button image={require('../../images/baitiao_btn.png')} style={styles.baiTiaoBtn} imageStyle={styles.baiTiaoImg} onPress={this.clickApply}/>
      </ImageBackground>
    );
  }
  private clickApply = async () => {
    const { ucId, accessToken } = dvaStore.getState().users;
    if (!accessToken) {
      Toast.show('您的当前账号暂时无法访问此服务，请使用关联手机号登录');
      return;
    }
    try {
      const { data, errorCode } = await getAppJSON(Config.APPLY_BAITIAO, {
        backUrl: 'http://m.ehaier.com/www/#/applyForWhite',
        userId: ucId,
        token: accessToken,
      });
      if (errorCode === 100) {
        isLogin();
        return;
      }
      if( Platform.OS === 'android' ) {
          NativeModules.ToolsModule.presentH5View([data.redirectUrl, '顺逛白条']);
          console.log('presentH5View' , data.redirectUrl);
      }else {
          this.props.navigation.navigate( 'CustomWebView', { customurl: data.redirectUrl, headerTitle: '顺逛白条' });
      }
    } catch (error) {
      Log(error);
    }
  }
}

const styles = EStyleSheet.create({
  contain: {
    flex: 1,
    flexDirection: 'column-reverse',
    alignItems: 'center',

  },
  baiTiaoBtn: {
    marginBottom: '30%',
    width: '162rem',
    height: '49rem',
    padding: 0,
  },
  baiTiaoImg: {
    margin: 0,
    width: '162rem',
    height: '49rem',
    resizeMode: 'stretch',
  },
});
