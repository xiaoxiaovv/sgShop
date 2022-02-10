import * as React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';

export const NavBar = ({
                         navigation,
                         productCateId,
                         totalCount,
                         setProductCateId}) => (
  <View style={{
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 10,
  }}>
    <TouchableOpacity
      style={[
        styles.tabView,
        styles.tabBorder,
      ]}
      onPress={() => {
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'RootTabs',
              params: null,
            }),
          ],
        });

        navigation.dispatch(resetAction);
      }}
    >
      <Image
        style={{
          width: 24,
          height: 24,
        }}
        source={require('../../../../images/ic_home_select.png')}
      />
      <Text style={[
        styles.hilightText,
        styles.tabText,
      ]}>
        首页
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[
        styles.tabView,
        styles.tabBorder,
      ]}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('CouponCenter')}
    >
      <Image
        style={{
          width: 24,
          height: 24,
        }}
        source={require('../../../../images/icon_coupon2.png')}
      />
      <Text style={[
        styles.hilightText,
        styles.tabText,
      ]}>
        优惠券
      </Text>
    </TouchableOpacity>
    <View style={[
      styles.tabView,
      styles.tabBorder,
    ]}>
      <View style={{height: 24, justifyContent: 'center'}}>
        <Text>{totalCount}</Text>
      </View>
      <Text style={[styles.tabText]}>全部商品</Text>
    </View>
    <TouchableOpacity
      style={[styles.tabView]}
      onPress={
        () => navigation.navigate('StoreHomeType', {
          setProductCateId,
          productCateId,
        })
      }
    >
      <Image
        style={{
          width: 24,
          height: 24,
        }}
        source={require('../../../../images/btn_category.png')}
      />
      <Text style={[styles.tabText]}>分类</Text>
    </TouchableOpacity>
  </View>
)

const styles = StyleSheet.create({
  tabView: {
    flex: 1,
    paddingTop: 2,
    paddingBottom: 2,
    alignItems: 'center',
  },
  tabBorder: {
    borderColor: '#D9D9D9',
    borderRightWidth: 1,
  },
  tabText: {
    marginTop: 5,
  },
  hilightText: {
    color: '#73D1FD',
  },
})
