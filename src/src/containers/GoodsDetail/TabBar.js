import React from 'react';
import {ScrollView, TouchableOpacity, Text, View, Image, StyleSheet} from 'react-native';
import {connect, px, width} from "../../utils";


export default class TabBar extends React.PureComponent {

  static defaultProps = {
    tabbarData: [],
    isDress: false,
    activeNum:0,
    activeColor:'#2979FF',
    underLineColor:'#2979FF'
  }

  state = {
    activeNum: this.props.activeNum,
  }

  render() {
    const count = this.props.tabbarData.length;
    return (
      <View style={styles.container}>

        {this.props.tabbarData.length > 0 && this.props.tabbarData.map((item, index) => {
          const isSelect = this.state.activeNum === index;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (this.state.activeNum === index) return;
                this.setState({
                  activeNum: index,
                }, () => {
                  this.props.onTabClick(index)
                })
              }}
              style={styles.itemContainer}>
              <View style={{
                width: width / count - px(20),
                height: px(27),alignItems:'center'
              }}>
                <Text  numberOfLines={1}
                      style={[styles.itemText, isSelect && {color:this.props.activeColor}]}>{item.name}</Text>
              </View>
              <View style={{
                width: width / count - px(20),
                height: px(2),
                backgroundColor: this.state.activeNum === index ? this.props.underLineColor : '#fff'
              }}/>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: px(44),
    flexDirection: 'row',
    borderBottomColor:'#eee',
    borderBottomWidth:px(1),
  },
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    color: '#666666',
    fontSize: px(14),
    marginTop: px(3),
  },
});