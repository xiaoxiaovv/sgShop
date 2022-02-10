import * as React from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet, NativeModules } from 'react-native';
import { toFloat } from '../../../../utils/MathTools';
import {cutImgUrl} from '../../../../utils';
export const ListTemplateOne = ({item, navigation, commissionNotice}) => (
  <TouchableOpacity
    style={{
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 15,
      paddingBottom: 15,
      backgroundColor: 'white',
    }}
    onPress={() => {
      // gio 点击商品 埋点 yl
      NativeModules.StatisticsModule.track('prodClickInStore', {
        productId:	item.productId,		//	商品	SKU	ID
        o2oType:	item.o2oType,
        productFirstName:	item.productFirstName,
        productSecondName:	item.productFullName,
        storeId:	dvaStore.getState().store.storeId,
        storeName:	dvaStore.getState().store.storeName,
        hasStock:	item.hasStock
      });
      navigation.navigate('GoodsDetail', { productId: item.productId });
    }}
  >
    {
      item.recommend && <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EE4277',
        position: 'absolute',
        top: 15,
        width: 60,
        height: 30,
        zIndex: 99,
      }}>
        <Text style={{color: 'white'}}>推荐</Text>
      </View>
    }
    <Image
      style={{
        height: 90,
        width: 90,
        marginRight: 10,
      }}
      source={{uri: cutImgUrl(item.defaultImageUrl, 600, 600, true) || ''}}
    />
    <View style={{flex: 1}}>
      <Text style={styles.title}>{item.productFirstName}</Text>
      <View style={styles.wrappingTextViewWrapper}>
        <Text style={styles.title}>{item.productSecondName}</Text>
      </View>
      {item.productTitle.length === 0 ?
        null :
        <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode='tail'>{item.productTitle}</Text>}
      <Text style={styles.price}>
        ¥{
          (item.finalPrice && item.finalPrice.toFixed(2))
            ||
          (item.defaultPrice && item.defaultPrice.toFixed(2))
        }
      </Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {
          commissionNotice && <Text style={{fontSize: 12}}>赚： ¥</Text>
        }
        {
          commissionNotice && <Text style={[styles.price, {marginRight: 10}]}>{toFloat(item.commission)}</Text>
        }
        <Text style={{color: 'blue', fontSize: 12,marginTop:2}}>{item.hasStock}</Text>
      </View>
    </View>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  wrappingTextViewWrapper: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  subtitle: {
    marginTop: 10,
    marginRight: 30,
    fontSize: 12,
  },
  price: {
    color: 'red',
    fontSize: 12,
    paddingTop: 5,
    paddingBottom: 5,
  },
})
