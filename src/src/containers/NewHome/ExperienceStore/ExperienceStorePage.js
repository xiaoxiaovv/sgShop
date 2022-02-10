import React from 'react';
import {View, ScrollView, SafeAreaView} from 'react-native';
import {NavBar, SafeView} from "../../../components";
import ListSotre from "./component/ListSotre";
import TabBar from "./component/TabBar";
import {connect, px, width} from "../../../utils";
import {SecondTitle} from '../../../components/index';
import SingleStore from "./component/SingleStore";
import {action} from "../../../dva/utils";


@connect(({ExperienceStoreModel: {data, singleStoreData},address:{latitude,longitude}}) => ({data, singleStoreData,latitude,longitude}))
export default class ExperienceStorePage extends React.PureComponent {

  static navigationOptions = {
    title: '体验店',
  }

  constructor(props) {
    super(props);
    const {nearbyType, activeNum} = this.props.navigation.state.params;

    this.state = {
      activeNum: activeNum,
      nearbyType: nearbyType,
    }
  }


  componentDidMount() {
    this.props.dispatch(action('ExperienceStoreModel/getNearbyDetialStore', {type: 2,nearbyType:this.state.nearbyType}));
  }

  _goStoreDetail=(item)=>{
    this.props.dispatch(action('ctjjModel/getStoreDetailFromTab',{
      nearbyId:item.id,latitude:this.props.latitude,longitude:this.props.longitude
    }));
    this.props.navigation.navigate('StoreDetail', {title: item.name});
  }


  render() {
    const {singleStoreData} = this.props;
    return (
      <SafeAreaView style={{backgroundColor: '#fff'}}>

        <ListSotre
          renderHeader={() => {
            return (
              <View>
                <TabBar
                  onTabClick={(index) => {
                    this.setState({
                      nearbyType: this.props.data[index].id
                    },()=>{
                      this.props.dispatch(action('ExperienceStoreModel/getNearbyDetialStore', {type: 2,nearbyType:this.state.nearbyType}));
                    })
                  }}
                  tabbarData={this.props.data}
                  activeNum={this.state.activeNum}
                />

                <SingleStore
                  emptyText={'您所在城市暂时没有此类型的体验店，\n    您可以试试其他类型的体验店'}
                  onPress={() => {
                   this._goStoreDetail(singleStoreData);
                  }}
                  storeData={singleStoreData}/>

                <View style={{width, height: px(8), backgroundColor: '#eee'}}/>
              </View>)
          }}
          singleData={singleStoreData}
          onPress={(item) => {
            this._goStoreDetail(item);
          }}
          nearbyType={this.state.nearbyType}
          type={2} //首页传1，体验店详情页的时候传2
        />

      </SafeAreaView>
    )
  }
}
