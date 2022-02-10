import React from 'react';
import {View,Text,Image,TouchableOpacity} from 'react-native';
import {px,width} from "../../../../utils";
import PropTypes from 'prop-types'


export default class SingleStoreItem extends React.PureComponent{

  static defaultProps={
    showArrow:true,
  }

  static propTypes={
    showArrow:PropTypes.bool,
    onPress: PropTypes.func,
  };

  render(){
    const storeData = this.props.storeData;
    return(
      <TouchableOpacity
        onPress={()=>{
          this.props.onPress&&this.props.onPress();
        }}
        style={{flexDirection:'row',width,alignItems:'center', padding: px(14)}}>
        <View style={{flex:1, height: px(92), justifyContent: 'space-between',paddingVertical:px(16)}}>
          <View style={{flexDirection: 'row',}}>
            <Text style={{color: '#000', fontSize: px(14)}}>{storeData.name}</Text>

          </View>
          <Text style={{color: '#999', fontSize: px(12)}}>{storeData.address}</Text>
          <View style={{flexDirection: 'row',}}>
            <Image
              resizeMode={'stretch'}
              style={{width: px(16), height: px(16), tintColor: '#999'}}
              source={require('../../../../images/address.png')}
            />
            <Text style={{color: '#999', fontSize: px(12)}}>{storeData.distance}</Text>
          </View>
        </View>
        <View style={{
          marginLeft: px(8), backgroundColor: '#2979FF', width: px(70), height: px(17),
          alignItems:'center',justifyContent:'center',marginRight:px(10),
        }}>
          <Text style={{color: '#fff', fontSize: px(12)}}>{storeData.typeValue}</Text>
        </View>
        {
          this.props.showArrow&&<Image
            style={{height:px(16),width:px(10)}}
            resizeMode={'stretch'}
            source={require('../../../../images/arrow_right_w.png')}/>
        }
      </TouchableOpacity>
    )
  }
}
