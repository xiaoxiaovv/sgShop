import * as React from 'react';
import { View, Modal, Text, TextInput, ViewStyle, StyleProp, TouchableWithoutFeedback } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Button from 'rn-custom-btn1';

import URL from './../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

export interface IGoodsRemendProps {
  visible: boolean;
  detailText?: string;
  value?: string;
  children?: object;
  containerStyle?: StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;
  confirm?: (text: string) => void;
  placeholder?: string;
  onClose: () => void;
  alertMessage?: any;
}

export interface IGoodsRemendState {
  value: string;
}

export default class GoodsRemend extends React.Component<IGoodsRemendProps, IGoodsRemendState> {
  constructor(props: IGoodsRemendProps) {
    super(props);

    this.state = {
      value: props.value || '',
    };
  }

  public render(): JSX.Element {
    const { visible, confirm, detailText, placeholder, children, containerStyle, onClose, alertMessage} = this.props;

    let containerView: any = null;
    if (children) {
      containerView = (
        <View style={containerStyle ? containerStyle : styles.container}>
          {children}
        </View>
      );
    } else {
      containerView = (
        <View style={styles.container}>
          <Text style={styles.title}>{detailText || '活动开始前30分钟将短信提醒你'}</Text>
          <View style={styles.input}>
            {
              placeholder ? null : <Text>手机号：</Text>
            }
            <TextInput ref="textInputX" key='input' style={styles.textInput}  underlineColorAndroid='transparent' placeholder={placeholder || '请输入手机号'} value={this.state.value} onChangeText={this.onChangeText}/>
          </View>
          {alertMessage ? <Text style={{ color: 'red', marginTop: 16 }}>{alertMessage}</Text> : null}
          <Button
            key='confirmBtn'
            style={styles.confirm} title='确定'
            onPress={() => confirm ? confirm(this.state.value) : onClose()}
            local={{ textColor: 'white', fontSize: 17 }}
          />
        </View>
      );
    }
    return (
      <Modal
        animationType='fade'
        transparent={true}
        visible={visible}
      >
        <View style={styles.bg}>
          <TouchableWithoutFeedback onPress={() => { this.refs.textInputX && this.refs.textInputX.blur() }}>
            <View style={{ paddingBottom: 50 }}>
              <Button
                style={styles.closeBtn} title='×' onPress={onClose}
                textStyle={{ margin: 0, color: 'white', fontSize: 13 }}
                innerStyle={{ width: 26, height: 26, borderRadius: 13, borderColor: 'white', borderWidth: 1, margin: 0 }}
              />
              {containerView}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    );
  }

  private onChangeText = (value: string): void => {
    this.setState({ value });
  }
}

const styles = EStyleSheet.create({
  $width: '305rem',
  bg: {
    position: 'absolute',
    width,
    height,
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    paddingTop: '32rem',
    paddingBottom: '32rem',
    width: '$width',
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 10,
  },
  title: {
    color: '#333333',
    width: '$width - 32',
    marginLeft: 16,
    marginRight: 16,
    marginTop: '40rem',
  },
  input: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#D9D9D9',
    width: '$width - 32',
    height: '50rem',
    marginLeft: 16,
    marginRight: 16,
    marginTop: '16rem',
    flexDirection:'row',
    alignItems:'center',
  },
  textInput: {
    width: '$width - 92',
  },
  closeBtn: {
    zIndex: 100,
    width: 26,
    height: 26,
    padding: 0,
    marginBottom: 24,
    alignSelf: 'flex-end',
  },
  confirm: {
    width: '200rem',
    height: '48rem',
    backgroundColor: '#2979FF',
    marginTop: '16rem',
    borderRadius: 10,
  },
});
