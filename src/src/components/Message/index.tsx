import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from 'rn-custom-btn1';
import { NavigationScreenProp } from 'react-navigation';

interface IOrderDetailProps {
  // 导航
  navigation: NavigationScreenProp;
  // 是白色还是灰色,不传默认是true
  isLightIcon?: boolean;
  // 是否显示红点,不传默认是true
  isShowRedDot?: boolean;
  // 是否在下面显示消息两个字,不传默认是false
  isShowText?: boolean;
}
export default class Message extends React.Component<IOrderDetailProps> {
  // 设置属性默认值
  private static defaultProps = {
    // 是白色还是灰色
  isLightIcon: true,
  // 是否显示红点
  isShowRedDot: true,
  // 是否在下面显示消息两个字
  isShowText: false,
};  // 注意这里有分号
  public render(): JSX.Element {
    return (
      <View style={{alignItems: 'center', marginRight: 10}}>
        <CustomButton
                style={{width: 22, height: 22}}
                imageStyle = {{ width: 22, height: 22, resizeMode: 'contain' }}
                image={this.props.isLightIcon ?
                    require('./message.png') :
                    require('./message_gray.png')}
                onPress= {() => { this.props.navigation.navigate('MessageDetail'); }}
                />
        {this.props.isShowText &&
            <Text style={[styles.messageText, {color: this.props.isLightIcon ? '#fff' : '#666'}]}>消息</Text>}
        {this.props.isShowRedDot && <View style={styles.topRightIcon}></View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topRightIcon: {
    backgroundColor: 'red',
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    right: -1,
    top: 4,
},
messageText: {
  fontSize: 10,
  marginTop: 3,
  color: 'white',
  backgroundColor: 'transparent',
},
});
