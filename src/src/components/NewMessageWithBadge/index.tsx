import * as React from 'react';
import { Image, View, Text, Platform, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import ScreenUtil from '../../containers/Home/SGScreenUtil';
import { NavigationScreenProp } from 'react-navigation';
import {Color} from 'consts';

interface IMessageBadge {
  navigation: NavigationScreenProp;
  unread: number;
  isWhite: boolean;
  hidingText?: boolean;
  // 控制消息数量图标的样式
  badgeContainStyle?: StyleProp<ViewStyle>;
  // 控制整个消息容器的样式
  messageBoxStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ViewStyle>;
  marginRightStyle?: StyleProp<ViewStyle>;
}

/**
 * 带徽标数的消息
 * @param {any} navigation
 * @param {any} unread
 * @returns {any}
 * @constructor
 */
export const MessageWithBadge = ({
                                   navigation,
                                   unread,
                                   isWhite,
                                   hidingText = false,
                                   style = {width: 40, height: 45},
                                   badgeContainStyle = {},
                                   messageBoxStyle = {},
                                   imageStyle = styles.messageImage,
                                   marginRightStyle = {marginRight: ScreenUtil.scaleSize(16)},
                                 }: IMessageBadge): JSX.Element => (
  <TouchableOpacity style={style} activeOpacity={0.7} onPress={() => navigation.navigate('MessageDetail')}>
    <View style={[styles.messageBox, marginRightStyle, messageBoxStyle]}>
      {
        Platform.OS === 'android' ?
        <Image style={{width: 22, height: 22}}
               source={isWhite ? require('./../../images/messagelogo.png') :
                 require('./../../images/messagelogogray.png')}/>
        :<Image style={{width: 28, height: 28}}
             source={isWhite ? require('./../../images/messagelogo.png') :
               require('./../../images/messagelogogray.png')}/>
      }
      {
        unread > 0 ?
          <View style={[styles.badgeContain, badgeContainStyle]}>
            <Text style={styles.badgeTitle}>{Number(unread) > 99 ? '99+' : unread}</Text>
          </View> : null
      }
      {!hidingText && <Text style={[styles.messageText, {color: isWhite ? '#fff' : '#666'}]}>消息</Text>}
    </View>
  </TouchableOpacity>
)
const styles = StyleSheet.create({
  messageBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageImage: {
    // 图标不要设置比例
    marginTop: 3,
  },
  messageText: {
    fontSize: ScreenUtil.scaleText(10),
    marginTop: ScreenUtil.scaleSize(-2),
    color: 'white',
    backgroundColor: 'transparent',
      minWidth: 30,
      textAlign: 'center',
  },
  badgeContain: {
    position: 'absolute',
    right: 0,
    top: 0,
    minWidth: 16,
    height: 16,
    paddingLeft: 2,
    paddingRight: 2,
    borderRadius: 8,
    backgroundColor: Color.ORANGE_1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeTitle: {
    color: 'white',
    fontSize: 8,
    textAlign: 'center',
    marginBottom: 1,
  },
});
