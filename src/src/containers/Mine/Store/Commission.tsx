import * as React from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import { INavigation } from '../../../interface';

class Commission extends React.Component<INavigation> {
  public render(): JSX.Element {
    return (
      <ScrollView style={{backgroundColor: '#F4F4F4'}}></ScrollView>
    );
  }
}

const ListItem = () => (
  <View style={{
    marginTop: 10,
    backgroundColor: 'white',
    padding: 10,
    flexDirection: 'row',
  }}>
    <Image
      style={{}}
      source={{uri: ''}}
    />
    <View>
      <Text></Text>
      <Text></Text>
      <Text></Text>
      <View style={{
        flexDirection: 'row',
      }}>
        <Text></Text>
        <TouchableOpacity>查看详情</TouchableOpacity>
      </View>
    </View>
  </View>
)

export default Commission;
