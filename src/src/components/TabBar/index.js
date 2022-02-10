import React from 'react';
import {ScrollView, TouchableOpacity, Text, View, Image, StyleSheet} from 'react-native';
import {px, width} from "../../utils";
import {Color, Font} from 'consts';

import icon1 from './icon/super1.png';
import icon2 from './icon/super2.png';
import icon3 from './icon/super3.png';
import icon4 from './icon/super4.png';
import icon5 from './icon/super5.png';
import icon6 from './icon/super6.png';
import icon7 from './icon/super7.png';
import icon8 from './icon/super8.png';
import icon9 from './icon/super9.png';
import icon10 from './icon/super10.png';
import icon11 from './icon/super11.png';
import icon12 from './icon/super12.png';
import icon13 from './icon/super13.png';
import icon14 from './icon/super14.png';
import icon15 from './icon/super15.png';

import icon21 from './icon/dress1.png';
import icon22 from './icon/dress2.png';
import icon23 from './icon/dress3.png';
import icon24 from './icon/dress4.png';
import icon25 from './icon/dress5.png';
import icon26 from './icon/dress6.png';
import icon27 from './icon/dress7.png';

const icon = [icon1, icon2, icon3, icon4, icon5, icon6, icon7, icon8, icon9,
    icon10, icon11, icon12, icon13, icon14, icon15];

const iconDress = [icon21, icon22, icon23, icon24, icon25, icon26, icon27];

export default class TabBar extends React.PureComponent {

  static defaultProps = {
    tabbarData: [],
    isDress: false,
  }

  state = {
    activeNum: 0,
  }

  render() {
    let imageSource = this.props.isDress ? iconDress : icon;
    return (
      <View style={styles.container}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {this.props.tabbarData.length > 0 && this.props.tabbarData.map((item, index) => {
            const isSelect = this.state.activeNum === index;
            return (
              <TouchableOpacity
                onPress={() => {
                  if (this.state.activeNum === index) return;
                  this.setState({
                    activeNum: index,
                  }, () => {
                    this.props.onTabClick(index)
                  })
                }}
                style={styles.itemContainer}>
                  <Image source={imageSource[index]} style={styles.itemImage}/>
                  <Text key={index} numberOfLines={1} style={[styles.itemText, isSelect && styles.selectText]}>{item.name}</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 84,
    flexDirection: 'row',
  },
  itemContainer: {
    height: 84,
    width: width / 4.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    height: 40,
    width: 40,
  },
  itemText: {
    color: Color.GREY_2,
    fontSize: Font.NORMAL_1,
    marginTop: 3,
  },
  selectText: {
    color: Color.ORANGE_2,
  },
});