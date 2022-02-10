import * as React from 'react';
import { UltimateListView } from 'rn-listview';
import CouponRow from './CouponRow';
import Empty from '../../components/Empty';
// import { connect } from '../../netWork';

interface ICouponListProps {
  style?: object;
  pageLimit?: number;
  loadFunc?: (page: number, pageSize: number) => any;
  constructData?: (data: any[]) => any[];
  fromCenter: boolean;
  beUsed?: boolean;
  beExpired?: boolean;
  pagination?: boolean;
}

interface ICouponListState {
  listData: any[];
  isRefresh: boolean;
}

class CouponList extends React.Component<ICouponListProps, ICouponListState> {
  public static defaultProps: ICouponListProps;
  private listView: any;
  constructor(props: ICouponListProps) {
    super(props);
    this.state = {
      listData: [],
      isRefresh: false,
    };
  }
  public render() {
    const { style, pageLimit, fromCenter, beUsed, beExpired, pagination } = this.props;
    const { listData, isRefresh } = this.state;
    return (
      <UltimateListView
        style={style}
        ref={ref => this.listView = ref}
        item={(item) => <CouponRow fromCenter={fromCenter} {...item} loadList={this.onRefresh} beUsed={beUsed} beExpired={beExpired}/>}
        emptyView={() =>  <Empty  title='没有该类优惠券' />}
        onFetch={this.onFetch}
        listData={listData}
        pageLimit={pageLimit || 5}
        isRefreshing={isRefresh}
        refreshableMode='advanced'
        pagination={pagination}
        keyExtractor={(item, index) => `keys${index}`}
        waitingSpinnerText={''}
      />
    );
  }
  private onRefresh = () => this.listView.onRefresh();
  private onFetch = async (page: number = 1, pageSize, abortFetch) => {
    try {
      const { loadFunc, constructData } = this.props;
      const { data: resultData } = await loadFunc(page, pageSize);
      const data = constructData(resultData || []);
      let listData;
      if (page === 1) {
        listData = [];
      } else {
        listData = JSON.parse(JSON.stringify(this.state.listData));
      }
      listData.push(...data);
      this.setState({ listData });
    } catch (error) {
      Log('=====sfa===error====', error);
      abortFetch();
    }
  }
}

CouponList.defaultProps = {
  constructData: data => data,
  fromCenter: false,
  beUsed: false,
  beExpired: false,
  pagination: true,
};

export default CouponList;
