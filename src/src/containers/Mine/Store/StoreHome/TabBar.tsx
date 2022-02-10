import * as React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { ISHOTDESC, SALEDESC } from './index';

export const TabBar = ({filterData, setStateAndRefresh}) => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
  }}>
    <TouchableOpacity
      style={[
        styles.tabButton,
        {
          backgroundColor: SALEDESC === filterData ? '#3CBFFC' : 'white',
        },
      ]}
      onPress={() => {
        setStateAndRefresh({qs: SALEDESC, isTogglingTab: true, tabBarFocusedOn: SALEDESC}, true);
      }}
    >
      <Text style={{color: SALEDESC === filterData ? 'white' : 'black'}}>销量优先</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[
        styles.tabButton,
        {
          backgroundColor: ISHOTDESC === filterData ? '#3CBFFC' : 'white',
        },
      ]}
      onPress={() => {
        setStateAndRefresh({qs: ISHOTDESC, isTogglingTab: true, tabBarFocusedOn: ISHOTDESC}, true);
      }}
    >
      <Text style={{color: ISHOTDESC === filterData ? 'white' : 'black'}}>人气优先</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[
        styles.tabButton,
        {
          backgroundColor: filterData.indexOf('@') > -1 ? '#3CBFFC' : 'white',
        },
      ]}
      onPress={() => setStateAndRefresh({drawerOpen: true})}
    >
      <Text style={{color: filterData.indexOf('@') > -1 ? 'white' : 'black'}}>筛选</Text>
    </TouchableOpacity>
  </View>
)

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    borderRadius: 20,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    marginBottom: 10,
  },
})
