import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import {width, sceenHeight} from '../../utils';
import {Color, Font} from 'consts';

export default class SecondTitle extends Component {
  static defaultProps = {
    title: '',
    onMorePress: null,
    titleImage: null,
  };

  render() {
    return (
      <View style={[styles.container, this.props.titleImage && styles.mainContainer,this.props.containerStyle]}>
        <View style={styles.titleContainer}>
        {this.props.titleImage ?
          <Image style={styles.titleImage} source={this.props.titleImage}/> :
          <View style={styles.formerTitle}/>
        }
          <Text style={[styles.title, this.props.titleImage && styles.mainTitle]}>{this.props.title}</Text>
        </View>
        {this.props.onMorePress &&
          <TouchableOpacity onPress={() => {
            this.props.onMorePress()
          }} style={styles.moreContainer}>
            <Text style={styles.moreText}>更多</Text>
            <Image
              resizeMode='contain'
              style={styles.moreImage}
              source={require('../../images/flash_sale_more.png')}/>
          </TouchableOpacity>
        }
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Color.GREY_6,
  },
  mainContainer: {
    backgroundColor: Color.WHITE,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleImage: {
    height: 18,
    width: 18,
    marginLeft: 16,
  },
  formerTitle: {
    marginLeft: 10,
    width: 3,
    height: 14,
    backgroundColor: Color.BLACK_1,
  },
  title: {
    marginLeft: 9,
    fontSize: Font.LARGE_3,
    color: Color.BLACK_1,
  },
  mainTitle: {
    marginLeft: 4,
    color: Color.BLACK,
  },
  moreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 10,
    height: 40,
    width: 100,
  },
  moreText:{
    color: Color.GREY_2,
    fontSize: Font.NORMAL_1,
    marginRight: -10,
  },
  moreImage:{
    width: 24,
    height: 24,
  },
});