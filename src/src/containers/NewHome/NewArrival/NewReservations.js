import React from 'react';
import {View, SafeAreaView} from 'react-native';
import {MessageWithBadge} from '../../../components/MessageWithBadge';
import {UltimateListView} from "rn-listview";
import {connect, createAction, px, width,getPrevRouteName} from "../../../utils";
import Empty from '../../../components/Empty';
import NewReservateProduct from "./component/NewReservateProduct";
import {CrowdFundingService} from "../../../dva/service";
import {SafeView, NavBar} from "../../../components";


@connect(({users: {unread, isHost, CommissionNotice}, address: {streetId, areaId, cityId, provinceId}}) =>
  ({
    isHost,
    CommissionNotice,
    unread,
    streetId, areaId, cityId, provinceId
  }))
export default class NewReservations extends React.Component {

  state = {
    listData: [],
    isRefresh:false,
  }

  onFetch = async (page = 1, startFetch, abortFetch) => {
    try {
      this.setState({
        isRefresh:true,
      });
      //http://mobiletest.ehaier.com:38080/sg/cms/reserve/index.json?
      // provinceId=2&cityId=716&districtId=944&streetId=12024726&pageIndex=1&from=1
      const routerName =getPrevRouteName();
      const num = 1;
      if(routerName == 'LocalSpecialty'){
           num = 2;
      }
      const data = [];
      const res = await CrowdFundingService.getCrowdFundingReserve({
        provinceId: this.props.provinceId,
        cityId: this.props.cityId,
        districtId: this.props.areaId,
        streetId: this.props.streetId,
        pageIndex: page,
        from: num,
      });
      if (res.success && res.data.acReserveList.length > 0) {
        const list = res.data.acReserveList;
        this.setState({listData:data.concat(list)},()=>{
          this.listView.updateDataSource(this.state.listData);
        })
      }
    } catch (e) {
      console.log(e);
      abortFetch();
    }finally {
      this.setState({
        isRefresh:false,
      })
    }
  };


  render() {
    return (
      <SafeView>
        <NavBar
          title={'新品预约'}
          rightView={
            <MessageWithBadge
              badgeContainStyle={{top: 3, right: -3}}
              hidingText={true}
              badgeContainStyle={{top: 3, right: -3}}
              navigation={this.props.navigation}
              unread={this.props.unread}
              imageStyle={{width: 22, height: 22}}
            />}
        />
        {
          <UltimateListView
            isRefreshing={this.state.isRefresh}
            ref={ref => this.listView = ref}
            style={{width, flex: 1}}
            item={(item) => this._renderItem(item)}
            onFetch={this.onFetch}
            keyExtractor={(item, index) => `keys${index}`}
            pageLimit={5}
            listData={this.state.listData}
            emptyView={() => <Empty style={{width, height: 100}} title='暂时没有新品'/>}
          />
        }

      </SafeView>
    )
  }

  _renderItem = (item) => {
    return (<NewReservateProduct
      navigation={this.props.navigation}
      isHost={this.props.isHost > 0 && this.props.CommissionNotice}
      item={item}/>)
  }
}
