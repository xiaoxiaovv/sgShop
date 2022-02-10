import React from 'react';
import {View, SafeAreaView, Text} from 'react-native';
import {MessageWithBadge} from '../../../components/MessageWithBadge';
import {UltimateListView} from "rn-listview";
import {connect, createAction, px, width} from "../../../utils";
import Empty from '../../../components/Empty';
import NewReservateProduct from "./component/NewReservateProduct";
import PreSaleProduct from "./component/PreSaleProduct";
import {CrowdFundingService} from "../../../dva/service";
import {SafeView, NavBar} from "../../../components";


@connect(({users: {unread}}) =>
  ({
    unread,
  }))
export default class QualityPreSale extends React.Component {


  onFetch = async (page = 1, startFetch, abortFetch) => {
    try {
      const res = await CrowdFundingService.getCrowdFundingPreSale({pageIndex: page, pageSize: 5,});
      if (res.success && res.data) {
        const list = res.data;
        if (page === 1) {
          this.setState({data: res.data});
        }
        startFetch(list, 5);
      } else {
        abortFetch();
      }
    } catch (e) {
      console.log(e);
      abortFetch();
    }
  };



  render() {
    return (
      <SafeView>
        <NavBar
          title={'品质预售'}
          rightView={<MessageWithBadge
            badgeContainStyle={{top: 3, right: -3}}
            hidingText={true}
            navigation={this.props.navigation}
            unread={this.props.unread}
            imageStyle={{width: 22, height: 22}}
          />}
        />
        <UltimateListView
          style={{width, flex: 1}}
          item={(item) => this._renderItem(item)}
          onFetch={this.onFetch}
          keyExtractor={(item, index) => `keys${index}`}
          pageLimit={5}
          emptyView={() => <Empty style={{width, height: 100}} title='暂时没有新品'/>}
        />
      </SafeView>
    )
  }

  _renderItem = (item) => {
    return (<PreSaleProduct
      navigation={this.props.navigation}
      item={item}/>)
  }
}
