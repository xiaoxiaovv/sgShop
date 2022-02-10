import React from 'react';
import {View, Text, ImageBackground, TouchableOpacity, ScrollView,RefreshControl,Dimensions} from 'react-native';
import {action} from "../../../dva/utils";
import {connect, px, width,height} from "../../../utils";
import {goBanner} from "../../../utils/tools";
import {Banners} from '../../../components/index';
import SingleStore from "./component/SingleStore";
import ListSotre from "./component/ListSotre";

@connect(({ExperienceStoreModel: {data, bannerData, storeData},address:{cityId,latitude,longitude}}) =>
  ({data, bannerData, storeData,cityId,latitude,longitude}))
export default class ExperienceStore extends React.PureComponent {

  componentDidMount() {
    this.props.dispatch(action('ExperienceStoreModel/init'));

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cityId!==this.props.cityId) {
      this.props.dispatch(action('ExperienceStoreModel/init'));
      }
  }

  _renderItem = () => {
    return this.props.data.length > 0 && this.props.data.map((item, index) => {
      if(index>1){
        return;
      }
      return (
        <TouchableOpacity
          key={index}
          style={{flex: 1,padding:px(2)}}
          onPress={() => {
            this.props.navigation.navigate('ExperienceStorePage', {nearbyType: item.id, activeNum: index})
          }}
        >
          <ImageBackground
            resizeMode={'stretch'}
            source={{uri: item.iconUrl}}
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: px(20), color: '#fff',fontWeight:'bold'}}>{item.name}</Text>
          </ImageBackground>
        </TouchableOpacity>
      )
    })
  };

  _goStoreDetail=(item)=>{
    this.props.dispatch(action('ctjjModel/getStoreDetailFromTab',{
      nearbyId:item.id,latitude:this.props.latitude,longitude:this.props.longitude
    }));
    this.props.navigation.navigate('StoreDetail', {title: item.name});
  }

  render() {
    const storeData = this.props.storeData;
    return (
        <ListSotre
          onInit={()=>{
            this.props.dispatch(action('ExperienceStoreModel/init'));
          }}
          renderHeader={()=>{
            return(
              <View>
                <Banners
                  onBarnnerPress={(item) => goBanner(item, this.props.navigation)}
                  bannerData={this.props.bannerData}
                />
                <View style={{height: px(110), width: width, padding: px(5), flexDirection: 'row'}}>
                  {
                    this._renderItem()
                  }
                </View>
                {/*附近体验店*/}
                {
                  <View>
                    <View style={{width, height: px(8), backgroundColor: '#eee'}}/>
                    <SingleStore
                      emptyText={'      对不起，您当前所在城市\n' + '尚未有体验店入驻哦请稍后再来'}
                      onPress={() => {
                        this._goStoreDetail(storeData);
                      }}
                      storeData={storeData}/>
                  </View>
                }
                <View style={{width, height: px(8), backgroundColor: '#eee'}}/>
              </View>
            )
          }}
          singleData={storeData}
          onPress={(item) => {
            this._goStoreDetail(item);
          }}
          type={1}//首页传1，体验店详情页的时候传2 
        />
    )
  }
}
