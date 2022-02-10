import * as React from 'react';
import { View } from 'react-native';
import SelectBar from 'rn-select-bar';
import EStyleSheet from 'react-native-extended-stylesheet';
import CouponList from './CouponList';
import { getAppJSON } from '../../netWork';
import Config from 'react-native-config';
import { NavBarConfig } from '../RootContainers/rootNavigator';
import { ICustomContain } from '../../interface';
import Button from 'rn-custom-btn1';
import moment from 'moment';
import CustomNaviBar from '../../components/customNaviBar';

export interface IMyCouponProps {
}

export interface IMyCouponState {
  pageIndex: number;
  listData: any;
}

export default class MyCoupon extends React.Component<IMyCouponProps & ICustomContain, IMyCouponState> {
  private list: any;
  constructor(props: IMyCouponProps) {
    super(props);

    this.state = {
      pageIndex: 0,
      listData: [],
    };
  }

//   public componentWillUnmount() {
//     // 点击了返回,当前界面pop出栈,如果前一个界面是Mine,刷新前一个界面
//     const { callBack } = this.props.navigation.state.params;
//     if (callBack) {
//         // 刷新我的界面
//         callBack();
//     }
// }

  public render() {
    const barContent = ['未使用', '已使用', '即将过期', '已过期'];
    return (
      <View style={{ flex: 1 }}>
        <CustomNaviBar
            navigation={this.props.navigation}
            title="我的优惠券"
            showBottomLine
            rightTitle="领券中心"
            leftAction={()=>{this.props.navigation.goBack()}}
            rightAction={()=>{this.props.navigation.navigate('CouponCenter');}}
        />
        <SelectBar
          style={styles.naviTitle}
          content={barContent}
          selectedItem={barContent[this.state.pageIndex]}
          onPress={(item, index) => {
              this.setState({ pageIndex: index });
          }}
        />
        <CouponList
          ref={(list) => this.list = list}
          key={`listKey${this.state.pageIndex}`}
          style={{ flex: 1 }}
          loadFunc={this.loadFunc}
          constructData={this.constructData}
          fromCenter={false}
          beUsed={this.state.pageIndex === 1 || this.state.pageIndex === 3}
          beExpired={this.state.pageIndex === 3}
        />
      </View>
    );
  }

  private constructData = (data: any[]) => {
    return data;
    //下面的代码之前是用来兼容即将过期的接口返回不同的
    // if (this.state.pageIndex === 2) {
    //   return data.map((item) => ({
    //     activityStartTime: 0,
    //     couponValue: item.amount,
    //     minAmountDoc: item.amountDoc,
    //     platformCoupon: item.fullCutPriceDoc,
    //     startTime: moment(item.beginDate).format('MM-DD HH:mm'),
    //     endTime: moment(item.endDate).format('MM-DD HH:mm'),
    //     CouponType: item.CouponType,
    //     id: item.id,
    //   }));
    // } else {
    //   return data;
    // }
  }

  private loadFunc = async (page: number, pageSize: number) => {
    const startIndex = page;
    let params: any = {
      areaId: '',
      cityId: '',
      provinceId: '',
      streetId: '',
      pageSize,
      startIndex,
      status: this.state.pageIndex + 1,
    };
    const url = this.state.pageIndex === 2 ? Config.COUPON_ONE_DAY : Config.COUPON_MY;
    if (this.state.pageIndex === 2) {
      const startIndex = page;
      const pageSize = 100;
      params = {
        status: 1,
        startIndex,
        pageSize,
      };
    } else if (this.state.pageIndex === 3 ) {
      params.status = 3;
    }
    return await getAppJSON(url, params, {}, true, Config.API_URL, true);
  }

}

const styles = EStyleSheet.create({
  naviTitle: {
    width: '375rem',
    height: 44,
    backgroundColor: 'white',
  },
});
