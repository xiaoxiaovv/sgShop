import * as React from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { INavigation } from '../../../interface';
import { UltimateListView } from 'rn-listview';
import { priceFormatter } from './RevenueDetail';
import { List } from 'antd-mobile';
import { ExtraText } from './ShopRevenue';
import { getAppJSON } from '../../../netWork';

const Item = List.Item;
const Brief = Item.Brief;

interface IState {
  total: number;
  otherList: any[];
}

/**
 * 其他奖励
 */
export default class OtherReward extends React.Component<INavigation, IState> {
  public static navigationOptions = ({ navigation, screenProps }) => ({
    title: navigation.state.params.title,
    headerTintColor: '#878787',
    headerStyle: {backgroundColor: '#f6f6f6', justifyContent: 'center'},
    headerTitleStyle: { color: '#333333', alignSelf: 'center'},
    headerBackTitle: null,
  })
  private listView;
  public constructor(props) {
    super(props);
    this.state = {
      total: 0,
      otherList: [],
    };
  }
  public componentDidMount() {
    this.loadData();
  }
  public render(): JSX.Element {
    const { navigation } = this.props;
    const { code, earningType } = navigation.state.params;
    return (
      <ScrollView style={{
        flex: 1,
        backgroundColor: '#F4F4F4',
      }}>
        <List renderHeader={() => `合计：${priceFormatter(this.state.total)}`}>
          {
            this.state.otherList.map((item, index) => <Item
              arrow={'horizontal'}
              extra={<ExtraText text={item.brokerageDeductAmount}/>}
              onClick={() => {
                navigation.navigate('SomeReward', {
                  code,
                  title: codeToText(item.rewardType),
                  earningType,
                  rewardType: item.rewardType,
                });
              }}>
              {codeToText(item.rewardType)}
            </Item>)
          }
        </List>
      </ScrollView>
    );
  }
  private async loadData() {
    const { code: type, earningType } = this.props.navigation.state.params;
    const rewardType = 'OTHER';
    const page = 0;
    const pageSize = 10;
    const params = {
      earningType,
      type,
      rewardType,
      page,
      pageSize,
    };

    const resp = await getAppJSON('v3/mstore/sg/local/myRevenueList.json', params);
    const { success, data } = resp;
    if (success && data && data.rewardO && data.rewardO.expectOtherAmount && data.rewardOther) {
      this.setState({
        total: resp.data.rewardO.expectOtherAmount,
        otherList: data.rewardOther,
      })
    }
  }
}

const codeToText = (value): string => {
  let text = value;
  switch (value) {
    case 'YC':
      text = '育成奖励';
      break;
    case 'BC':
      text = '补差奖励';
      break;
    case 'ST':
      text = '生态奖励';
      break;
    case 'JY':
      text = '经营奖励';
      break;
    case 'FWB':
      text = '服务兵奖励';
      break;
    case 'PT':
      text = '平台奖励';
      break;
    case 'PX':
      text = '培训奖励';
      break;
    default:
      break;
  }

  return text;
}

const priceFormatter = (price: number) => '¥' + numberWithCommas(parseFloat(`${price}`).toFixed(2));
const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const dateFormatter = (timestamp): string => {
  if (!timestamp) {
    return '';
  }

  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const monthString = month < 10 ? `0${month}` : month;

  return `${year}-${monthString}`;
}

const styles = StyleSheet.create({
  label: {
    color: '#A0A0A0',
    fontSize: 15,
  },
  content: {
    fontSize: 15,
  },
  contentRow: {
    flexDirection: 'row',
    paddingBottom: 5,
  },
  line: {
    height: 0.5,
    backgroundColor: 'gray',
  },
});
