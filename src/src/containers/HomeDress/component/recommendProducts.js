import React from 'react';
import {View, TouchableOpacity, Text, Image, StyleSheet, ImageBackground} from 'react-native';
import {px, width, height} from './../../../utils/index';
import {moneyDisplay} from '../../../components/moneyDisplay.js';
import ThreeProducts from "./threeProducts";
import Separator from '../../../components/Separator';
import SecondTitle from '../../../components/SecondTitle';
import {Color, Font} from 'consts';

const cellWith = (width - 20) / 3 - 14;
export default class RecommendProducts extends React.PureComponent {

  static defaultProps={
    imageKey:'imgUrl',
  }

  componentDidMount() {

  }

  render() {
    const {topRecommendProducts, lowRecommendProducts} = this.props;
    return (
      <View>
        {
          topRecommendProducts && topRecommendProducts.length > 0 ?
          <View>
            <Separator/>
            <ThreeProducts
              products = {topRecommendProducts}
              onItemPress = {(item)=>{this.props.onItemPress && this.props.onItemPress(item)}}
            />
          </View>: null
        }
        {lowRecommendProducts && lowRecommendProducts.length > 0 ? lowRecommendProducts.map((item, index) => {
          return (
            <View style={styles.lowContainer} key={index}>
              <SecondTitle title={item.productCateName} onMorePress={()=>{this.props.onMorePress(item)}}/>
              <View style={styles.productsContainer}>
                {item.lowRecommendProducts.map((cell, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        this.props.onItemPress && this.props.onItemPress(cell)
                      }}
                      key={index} style={styles.itemProduct}>
                      <Image
                        resizeMode='contain'
                        source={{uri: cutImgUrl(cell[this.props.imageKey] || '', 200, 200, true)}}
                        style={{width: cellWith, height: cellWith}}/>
                      <Text
                        numberOfLines={2}
                        style={styles.productText}>{cell.productName}</Text>
                      {moneyDisplay(cell.productPrice, 0)}
                      {this.props.isHost > 0 ? 
                      <View style={styles.commissionContainer}>
                        <Image style={styles.commissionImage} source={require('../../../images/hongbao.png')}/>
                        <Text style={styles.commissionText}>¥{cell.productCommission}</Text>
                      </View>
                      : null}
                    </TouchableOpacity>
                  )
                })
                }
              </View>
            </View>
          )
        }) : null
        }
      </View>
    )
  }
}


const styles = StyleSheet.create({
  lowContainer: {
    width: width,
    alignItems: 'center'
  },
  productsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: width,
    marginLeft: 10,
    marginBottom: 5,
    marginTop: 10,
  },
  itemProduct: {
    width: (width - 20) / 3,
    alignItems: 'center',
    marginBottom: 8,
  },
  productText:{
    width: cellWith,
    fontSize: Font.SMALL_1,
    color: Color.GREY_1,
    textAlign: 'center',
    marginBottom: 4,
    marginTop: 4,
  },
  commissionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  commissionImage: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  commissionText: {
    color: Color.ORANGE_3,
    fontSize: Font.SMALL_1,
    marginLeft: 4,
  },
});



