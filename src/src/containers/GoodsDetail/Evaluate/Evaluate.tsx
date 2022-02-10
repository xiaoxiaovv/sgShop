import * as React from 'react';
import { View, Platform, StatusBar } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import EvaluateHeader from './ListHeader2';
import { UltimateListView } from 'rn-listview';
import RowItem from './ListItem';
import { NavBar, SafeView, FooterView } from './../../../components';
import { connect, isiPhoneX, createAction, createIdAction } from '../../../utils';
import { IEvaluateAbstract, ICustomContain } from '../../../interface';
import Empty from '../../../components/Empty';
import { List } from 'immutable';
import L from "lodash";

import URL from './../../../config/url.js';
import { GET } from './../../../config/Http.js';
import {ctjjService} from '../../../dva/service';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
const PAGE_SIZE = 5;

export interface IEvaluateProps {
  modelId: string;
  productId?: string;
  positiveRate?: number;
  evaluateImpression?: any;
  listData?: any;
  isRefresh?: boolean;
}

export interface IEvaluateState {
  selectFirstItem: string;
    modelId: string;
    count: string;
}


@connect()
export default class Evaluate extends React.PureComponent<IEvaluateProps & IEvaluateAbstract & ICustomContain, IEvaluateState> {
  private listView: any;

  constructor(props: IEvaluateProps) {
    super(props);

    this.state = {
      selectFirstItem: 'all',
        totalNum: '',
        positiveNum: '',
        neutralNum: '',
        negativeNum: '',
        hasPicNum: '',
        positiveRate: '100',
        evaluateImpression: [],
        // modelId: 13411 ,
        modelId: props.navigation.state.params.modelId ? props.navigation.state.params.modelId : "" ,
    };
  }

    public async componentDidMount (){

        const list1 = GET(URL.GET_TOASSESSLIST, {productId: this.state.modelId});
        const list2 = GET(URL.GET_PRODUCTIMPRESSIONS, {productId: this.state.modelId});
     Promise.all([list1, list2]).then(results=>{
       console.log(results);
       const list1 = results[0];
       const list2 = results[1];
         const success1 = L.get(list1, 'success', false);
         const data1 = L.get(list1, 'data', false);
         if(success1 && data1){
           const { totalNum, positiveNum, neutralNum, negativeNum, hasPicNum } = data1;
           this.setState({totalNum, positiveNum, neutralNum, negativeNum, hasPicNum, positiveRate: (positiveNum / totalNum * 100).toFixed(2) });
         }
          const success2 = L.get(list2, 'success', false);
         const data2 = L.get(list2, 'data', false);
         if(success2 && data2){
           const evaluateImpression = data2.map(({ impressionName, labelNum }) => (
                 { title: labelNum > 0 ? `${impressionName}(${labelNum})` : impressionName }
             ));
             this.setState({evaluateImpression});
         }
     }).catch(err=>{
       console.log(err);
     });



  }


  public render(): JSX.Element {
    const { totalNum, positiveNum, neutralNum, negativeNum, hasPicNum, positiveRate, evaluateImpression, } = this.state;
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
        <SafeView>
            <View style={[styles.container]}>
                <NavBar title={`商品评价${this.state.totalNum ? `(${this.state.totalNum})`: ''}`} />
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
          pageLimit={5}
          emptyView={() =>  <Empty style={{ width, height: listHeight }} title='暂时没有评价' />}
        />
            </View>
        </SafeView>
    );
  }

  private selectFirstTabs = (index, key) => {
    this.setState({ selectFirstItem: key }, () => this.listView.onRefresh());
  }

  private onFetch = async (page = 1, startFetch, abortFetch) => {
      try {
          const list = await GET(URL.GET_COMMENTSBYCONDITION, {pageIndex: page, pageSize: PAGE_SIZE, productId: this.state.modelId, commentType: this.state.selectFirstItem, noLoading: false});
          const success = L.get(list, 'success', false);
          const data = L.get(list, 'data', false);
          if (success && data) {
              startFetch(data, PAGE_SIZE);
          } else {
              abortFetch();
          }
      } catch (e) {
          console.log(e);
          abortFetch();
      }
  }
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
    },
  list: {
    backgroundColor: '$lightgray',
  },
});
