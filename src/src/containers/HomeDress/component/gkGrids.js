import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {width, px,} from "../../../utils";

const margin = px(6);

export default class GkGrids extends React.Component {

  static defaultProps = {
    gkItem: [],
    horizeNum: 2,//默认横向item数
  }

  render() {

    const cellWith = Math.floor(width / this.props.horizeNum);
    return (
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: width,
        backgroundColor: '#fff'
      }}>
        {this.props.gkItem.map((cell, index) => {
          if (index > 1) return;
          return (
            <TouchableOpacity
              onPress={() => {
                this.props.onItemPress && this.props.onItemPress(cell)
              }}
              key={index} style={{width: cellWith, paddingHorizontal: margin}}>
              <Image
                resizeMode='stretch'
                source={{uri: cell.pic}}
                style={{width: cellWith - margin * 2, height: cellWith - margin * 2}}/>
              {cell.title && <Text style={{width: cellWith - margin * 2}}>{cell.title}</Text>}
              {/*{cell.titleDecription && <Text style={{color: '#999'}}>{cell.titleDecription}</Text>}*/}
              <View style={{flexDirection: 'row', width: cellWith - margin * 2, alignItems: 'center'}}>
                {cell.avatar&& cell.avatar!=""? <Image
                  source={{uri: cell.avatar}}
                  resizeMode='stretch'
                  style={{width: px(26), height: px(26), borderRadius: px(13)}}
                />:null}
                {cell.storeName &&
                <Text
                  numberOfLines={1}
                  style={{
                    height: px(26), width: px(70), textAlign: 'center',
                    lineHeight: px(26),
                    fontSize: px(12),
                  }}>{cell.storeName}</Text>}
              </View>
            </TouchableOpacity>
          )
        })
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({});
