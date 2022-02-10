import React from 'react';
import {View, Text} from 'react-native';
import {connect, px, width} from "../../../../utils";
import {UltimateListView} from "rn-listview";
import SingleStoreItem from "./SingleStoreItem";
import ExperienceStoreService from '../../../../dva/service/ExperienceStoreService';
import Empty from '../../../../components/Empty';
import {FooterView} from './../../../../components';

const pageLimit =4;
@connect(({address: {cityId, longitude, latitude}}) =>
  ({cityId, longitude, latitude}))
export default class ListSotre extends React.PureComponent {

  state = {
    nearbyType: this.props.nearbyType,
    data: [],
  }

  onFetch = async (page = 1, startFetch, abortFetch) => {
    try {
      /**
       * cityId 城市Id
       * itemsId  首页项目Id 1:成套家电 2:居家定制（当前业务中固定传1）
       * nearbyType 体验店类型
       * latitude 维度
       * longitude 经度
       * type 类型  1:首页 2:详情页
       */
      const {cityId, latitude, longitude, type} = this.props;
      let res;
      if (this.state.nearbyType === 0 || this.state.nearbyType) {
        res = await ExperienceStoreService.getNearbyList({
          cityId,
          itemsId: 1,
          pageIndex: page,
          nearbyType: this.state.nearbyType,
          pageSize: pageLimit,
          latitude,
          longitude,
          type
        });

      } else {
        res = await ExperienceStoreService.getNearbyList({
          cityId,
          itemsId: 1,
          pageIndex: page,
          pageSize: pageLimit,
          latitude,
          longitude,
          type
        });
      }
      if (res.success && res.data) {
        const list = res.data;
        if (page === 1) {
          this.setState({data: res.data});
          this.props.onInit&&this.props.onInit();
        }
        startFetch(list, pageLimit);
      } else {
        abortFetch();
      }
    } catch (e) {
      abortFetch();
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.nearbyType !== this.props.nearbyType ||//切换体验店类型 重新刷新
        nextProps.cityId!==this.props.cityId) {//切换城市 重新刷新
      this.setState({
        nearbyType: nextProps.nearbyType,
      }, () => {
        this.list && this.list.refresh();
      });
    }
  }

  render() {
    return (
      <UltimateListView
        header={() => this.props.renderHeader ? this.props.renderHeader() : null}
        ref={(ref) => this.list = ref}
        style={{width}}
        item={(item) => this._renderItem(item)}
        onFetch={this.onFetch}
        keyExtractor={(item, index) => `keys${index}`}
        pageLimit={pageLimit}
        separator={() => <View style={{
          alignSelf: 'center', height: px(1), width: width - px(30),
          backgroundColor: '#eee',
        }}/>}
        footer={()=>{return <View style={{backgroundColor: '#eee'}}><FooterView/></View>}}
      />
    )
  }


  _renderItem = (item) => {
    if (this.props.singleData && this.props.singleData.id === item.id) {
      return null;
    }
    return (<SingleStoreItem
      onPress={() => {
        this.props.onPress && this.props.onPress(item);
      }
      }
      storeData={item}/>)
  }
}
