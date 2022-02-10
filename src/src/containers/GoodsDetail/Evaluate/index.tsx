import * as React from 'react';
import { View, Platform, StatusBar } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import EvaluateHeader from './ListHeader';
import { UltimateListView } from 'rn-listview';
import RowItem from './ListItem';
import { connect, isiPhoneX, createAction, createIdAction } from '../../../utils';
import { IEvaluateAbstract, ICustomContain } from '../../../interface';
import Empty from '../../../components/Empty';
import { List } from 'immutable';

import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

export interface IEvaluateProps {
  modelId: string;
  productId?: string;
  positiveRate?: number;
  evaluateImpression?: List<{ title: string }>;
  listData?: any;
  isRefresh?: boolean;
}

export interface IEvaluateState {
  selectFirstItem: string;
}

const mapStateToProps = (
  {
    goodsDetail,
  },
  { modelId },
) => {
  try {
    return {
      positiveRate: goodsDetail.getIn([modelId, 'evaluate', 'evaluateCount', 'positiveRate']) || 100,
      totalNum: goodsDetail.getIn([modelId, 'evaluate', 'evaluateAbstract', 'totalNum']) || 0,
      hasPicNum: goodsDetail.getIn([modelId, 'evaluate', 'evaluateAbstract', 'hasPicNum']) || 0,
      negativeNum: goodsDetail.getIn([modelId, 'evaluate', 'evaluateAbstract', 'negativeNum']) || 0,
      neutralNum: goodsDetail.getIn([modelId, 'evaluate', 'evaluateAbstract', 'neutralNum']) || 0,
      positiveNum: goodsDetail.getIn([modelId, 'evaluate', 'evaluateAbstract', 'positiveNum']) || 0,
      evaluateImpression: goodsDetail.getIn([modelId, 'evaluate', 'evaluateImpression']),
      isRefresh: goodsDetail.getIn([modelId, 'evaluate', 'evaluateRefresh']),
      listData: goodsDetail.getIn([modelId, 'evaluate', 'evaluateData']) || List(),
    };
  } catch (error) {
    Log('======Evaluate======', error);
    return { listData: List(), positiveRate: 100 };
  }
};

@connect(mapStateToProps)
export default class Evaluate extends React.PureComponent<IEvaluateProps & IEvaluateAbstract & ICustomContain, IEvaluateState> {
  private listView: any;

  constructor(props: IEvaluateProps) {
    super(props);

    this.state = {
      selectFirstItem: 'all',
    };
  }

  public render(): JSX.Element {
    const { positiveRate, totalNum, hasPicNum, negativeNum, neutralNum, positiveNum, evaluateImpression, isRefresh, listData } = this.props;
    const cstTitle = (num, title) => (num && num > 0) ? `${title}(${num})` : title;
    const headerArr = [
      { title: cstTitle(totalNum, '全部'), key: 'all' },
      { title: cstTitle(positiveNum, '好评'), key: 'praise' },
      { title: cstTitle(neutralNum, '中评'), key: 'neutral' },
      { title: cstTitle(negativeNum, '差评'), key: 'poor' },
      { title: cstTitle(hasPicNum, '有图'), key: 'image' },
    ];

    let listHeight = height - (Platform.OS === 'android' ? 56 + StatusBar.currentHeight : 64) - (44 + 190 ) * rem;
    listHeight = isiPhoneX ? listHeight - 34 - 20 : listHeight;

    return (
      <View style={{ width, flex: 1 }}>
        <UltimateListView
          style={styles.list}
          header={() =>
            <EvaluateHeader
              positiveRate={positiveRate}
              contentArr={headerArr}
              selectItem={this.state.selectFirstItem}
              onPress={this.selectFirstTabs}
              evaluateImpression={evaluateImpression}
            />
          }
          ref={ref => this.listView = ref}
          item={(item) => <RowItem {...item} />}
          onFetch={this.onFetch}
          keyExtractor={(item, index) => `keys${index}`}
          isRefreshing={isRefresh}
          listData={listData.toJS()}
          pageLimit={5}
          emptyView={() =>  <Empty style={{ width, height: listHeight }} title='暂时没有评价' />}
        />
      </View>
    );
  }

  private selectFirstTabs = (index, key) => {
    this.setState({ selectFirstItem: key }, () => this.listView.onRefresh());
  }

  private onFetch = async (page = 1, pageLimit) => {
    this.props.dispatch(createIdAction('goodsDetail/loadingEvaluate')({
      modelId: this.props.modelId,
      commentType: this.state.selectFirstItem,
      noLoading: false,
      pageIndex: page,
      pageSize: pageLimit,
    }));
  }
}

const styles = EStyleSheet.create({
  list: {
    backgroundColor: '$lightgray',
  },
});
