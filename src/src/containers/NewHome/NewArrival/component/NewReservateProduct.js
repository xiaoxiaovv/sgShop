import React from 'react';
import {View, Text, ImageBackground,TouchableOpacity} from 'react-native';
import CountDownText from '../../../../components/CountDown/CountDownText';
import moment from "moment";
import {px, width} from "../../../../utils";
import {moneyDisplay} from "../../../../components/moneyDisplay";
import {NavigationUtils} from "../../../../dva/utils";
import {connect} from "react-redux";


@connect()
export default class NewReservateProduct extends React.PureComponent {

  render() {
    const item = this.props.item;
    return (
      <TouchableOpacity
        onPress={()=> {
          this.props.dispatch(NavigationUtils.navigateAction("GoodsDetail", {
            productId: item.productId,
            productFullName: item.productName,
            swiperImg: item.imageUrl,
            price: item.price,
          }));
        }}
        style={{marginTop: this.props.index == 0 ? 0: !this.props.hidden ? px(20): px(5), width: width,backgroundColor: '#fff'}}>
        <ImageBackground
          style={{width: width, height: px(190),}}
          resizeMode='stretch'
          source={{uri: item.imageUrl}}>
          <View style={{
            width: px(200),
            height: px(40),
            backgroundColor: 'red',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {item.reserveEndTime > new Date().getTime() ?
              <Text style={{
                fontSize: px(13),
                color: '#fff',
              }}>{'剩余时间'}<CountDownText

                countType={'date'}
                auto={true}
                afterEnd={() => {
                }}
                textStyle={{color: '#fff',}}
                step={-1}
                startTime={moment().format('YYYY/M/D H:m:s')}
                endTime={moment(item.reserveStartTime > new Date().getTime() ? item.reserveStartTime : item.reserveEndTime).format('YYYY/M/D H:m:s')}
                startText=''
                endText='00天00时00分00秒'
                intervalText={(date, hour, min, sec) => date + '天' + hour + '时' + min + '分' + sec} // 定时的文本回调
              /></Text> :
              <Text style={{fontSize: 12, color: '#666'}}>已结束</Text>
            }
          </View>
        </ImageBackground>
          {!this.props.hidden && <View>
        <Text style={{
          fontSize: px(15), paddingLeft: px(15), marginTop: px(15),
        }}>{item.productName}</Text>
        <Text style={{
          color:'#999',fontSize: px(15), paddingLeft: px(15), marginTop: px(15),
        }}>{item.productTitle}</Text>
        </View>}
        <View style={{width: width, flexDirection: 'row',marginHorizontal:px(15),alignItems:'center'}}>
          <View
            style={{flex: 2}}
          >
            <View style={{flexDirection: 'row',alignItems:'center',}}>
              <Text style={{fontSize:px(14),color:'#333'}}>预约价:</Text>
              {moneyDisplay(item.price, 0)}
              {
                (this.props.isHost > 0 && item.commission != null && item.commission >= 0) ? < ImageBackground
                resizeMode='stretch'
                source={require('../../../../images/zhuan.png')}
                style={{
                  paddingLeft: px(12),
                  paddingTop: px(2),
                  width: px(60),
                  marginLeft:px(10),
                  height: px(20),

                }}
              >
                {moneyDisplay(item.commission)}
              </ImageBackground> : null}
            </View>
            <Text style={{color:'#999',fontSize:px(12)}}>{`已预约：${item.reserveNum} 人`}</Text>
          </View>
          <TouchableOpacity
            onPress={()=>{
                this.props.dispatch(NavigationUtils.navigateAction("GoodsDetail", {
                    productId: item.productId,
                    productFullName: item.productName,
                    swiperImg: item.imageUrl,
                    price: item.price,
                }));
            }}
            style={{
            flex: 1, height: px(40), borderRadius: px(30),margin:px(20),
            backgroundColor: '#2979ff', justifyContent: 'center', alignItems: 'center',
          }}>
            <Text style={{
              fontWeight: 'bold',
              fontSize: px(16), color: '#fff',
            }}>立即预约</Text>
          </TouchableOpacity>

        </View>
      </TouchableOpacity>
    )
  }
}
