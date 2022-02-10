import * as React from 'react';
import { Platform, View, WebView, Image, TouchableOpacity } from 'react-native';
import Config from 'react-native-config';
import { INavigation } from '../../../interface';
import { iPhoneXMarginTopStyle } from '../../../utils';
import ScreenUtil from '../../Home/SGScreenUtil';

interface IRevenueRule {
  helpid: string;
  content: string;
}

class RevenueRule extends React.Component<INavigation & IRevenueRule> {
  public render(): JSX.Element {
    const { helpid } = this.props.navigation.state.params;
    const content = encodeURI(this.props.navigation.state.params.content);
    Log(`${Config.API_URL}www/#/helpDetail/${helpid}/${content}`);
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            zIndex: 2,
            paddingLeft: 10,
            paddingRight: 10,
            marginTop: 10 + (ScreenUtil.isiPhoneX ? 44 : (Platform.OS === 'ios' ? 20 : 0)),
          }}
          onPress={() => this.props.navigation.goBack()}
        >
          <Image
            style={{
              width: 20,
              height: 20,
            }}
            source={require('../../../images/black_back.png')}
          />
        </TouchableOpacity>
        <WebView
          onError={(err) => Log('err: ', err)}
          source={{uri: `${Config.API_URL}www/#/helpDetail/${helpid}/${content}`}}
          style={[iPhoneXMarginTopStyle]}
        />
      </View>
    );
  }
}

export default RevenueRule;
