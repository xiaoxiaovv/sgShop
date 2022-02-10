import * as React from 'react';
import { View, Modal, TouchableOpacity, TextInput, Text, KeyboardAvoidingView, StatusBar, Platform, Animated, Keyboard  } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Button from 'rn-custom-btn1';
import { Toast } from 'antd-mobile';
import ToastContainer from 'antd-mobile/lib/toast/ToastContainer.native';

import URL from './../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

const statusBarHeight = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

export interface ICountEditModalProps {
  modalVisible: boolean;
  value: number | string;
  maxValue?: number;
  minValue?: number;
  onValueChange?: (value: number) => void;
  handleVisible?: () => void;
  productAttribute?:number;
}

export interface ICountEditModalState {
  value: number;
  keyboardHeight: Animated.Value;
  bottomPadding: Animated.Value;
  toast: { show?: boolean, content?: string, duration?: number, type?: string };
}

export default class CountEditModal extends React.Component<ICountEditModalProps, ICountEditModalState> {
  constructor(props: ICountEditModalProps) {
    super(props);
    const value = typeof props.value === 'string' ? parseInt(props.value, 0) : props.value;
    this.state = {
      value,
      keyboardHeight: new Animated.Value(0),
      bottomPadding: new Animated.Value(height / 2 - 70),
      toast: { show: false },
    };
  }

  public componentWillMount() {
    console.log(this.props)
    this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', (e) => this.keyboardWillShow(e));
    this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', (e) => this.keyboardWillHide(e));
  }

  public componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  public componentWillReceiveProps(nextProps) {
    const {modalVisible} = nextProps;
    if (this.props.value !== nextProps.value) {
      this.setState({
        value: nextProps.value,
      });
    }
  }

  public render() {
    const {modalVisible, handleVisible,productAttribute} = this.props;
    return (
      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.bg}>
          <Animated.View style={[styles.container, {position: 'absolute', bottom: this.state.bottomPadding}]}>
            <Text>修改购买数量</Text>
            <View style={styles.subContainer}>
            {
              (this.props.productAttribute == 0 || this.props.productAttribute == 1 || this.props.productAttribute == undefined) ?
                <TouchableOpacity style={styles.button} onPress={() => this.onValueChangeAction(false)}>
                  <Text style={styles.text}>-</Text>
                </TouchableOpacity>
                :
               <TouchableOpacity style={styles.button}>
                  <Text style={styles.text}>-</Text>
                </TouchableOpacity>
            }
              
              <View style={styles.line}/>
              <TextInput
                style={[styles.input, styles.button]}
                underlineColorAndroid= 'transparent'
                multiline= {false}
                maxLength={3}
                onChangeText= {this.inputValue}
                value={this.state.value + ''}
                keyboardType= 'numeric'
                />
              <View style={styles.line}/>
              {
                 (this.props.productAttribute == 0 || this.props.productAttribute == 1 || this.props.productAttribute == undefined) ?
                  <TouchableOpacity style={styles.button} onPress={() => this.onValueChangeAction(true)}>
                    <Text style={styles.text}>+</Text>
                  </TouchableOpacity>
                  :
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.text}>+</Text>
                  </TouchableOpacity>
              }
              
            </View>
            <View style={{ marginTop: 20, height: 1, width: '100%', backgroundColor: '#EDEDED'}}/>
            <View style={{flexDirection: 'row', height: 40}}>
              <Button
                style={[styles.cancle]}
                title='取消'
                onPress={handleVisible}
                textStyle={{ color: 'black', fontSize: 14 }}
              />
              <Button
                style={styles.confirm}
                title='确定'
                onPress={this.handleConfirm}
                textStyle={{ color: 'white', fontSize: 14}}
              />
            </View>
          </Animated.View>
          {this.state.toast.show &&
            <ToastContainer
                content={this.state.toast.content}
                duration={this.state.toast.duration || 1}
                type={this.state.toast.type || 'info'}
                onAnimationEnd={() => {
                    this.setState({
                      toast: { show: false },
                    });
                }}
            />
          }
        </View>
      </Modal>
    );
  }

  private keyboardWillShow = (event) => {
    event.endCoordinates.height > height / 2 - 70 ?
      Animated.parallel([
        Animated.timing(this.state.bottomPadding, {
          // duration: event.duration,
          duration: 100,
          toValue: event.endCoordinates.height + statusBarHeight,
        }),
      ]).start() : null;
  }

  private keyboardWillHide = (event) => {
    Animated.parallel([
      Animated.timing(this.state.bottomPadding, {
        // duration: event.duration,
        duration: 100,
        toValue: height / 2 - 70,
      }),
    ]).start();
  }

  private handleConfirm = () => {
    const { onValueChange, handleVisible } = this.props;
    onValueChange ? onValueChange(this.state.value) : null;
    handleVisible();
  }
  private inputValue = (text: string) => {
    const { maxValue, minValue, onValueChange } = this.props;
    let temText = Number.parseInt(text) || 0;
    if (maxValue && temText > maxValue) {
      this.setState({ toast: { content: `最多购买${maxValue}件`, show: true }});

      temText = maxValue;
    }
    if (temText < minValue) {
      temText = minValue;
    }
    this.setState({
      value: temText >= maxValue ? maxValue : temText,
    });
  }

  private onValueChangeAction = (add: boolean) => {
    const { maxValue, minValue, onValueChange } = this.props;
    let value = this.state.value;
    if (add) {
      value += 1;
      if (value > maxValue) {
        this.setState({ toast: { content: `最多购买${maxValue}件`, show: true }});
        return;
      }
      typeof maxValue !== 'undefined' && (value = Math.min(maxValue, value));
    } else {
      value -= 1;
      if (value < minValue) {
        return;
      }
      typeof minValue !== 'undefined' && (value = Math.max(minValue, value));
    }
    this.setState({ value });
  }
}

const styles = EStyleSheet.create({
  $width: '305rem',
  $height: '205rem',
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
    paddingTop: '30rem',
    // paddingBottom: '32rem',
    width: '$width',
    // height: '$height',
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  title: {
    color: '#333333',
    width: '$width - 32',
    marginLeft: 16,
    marginRight: 16,
    marginTop: '40rem',
  },
  confirm: {
    flex: 1,
    backgroundColor: '#2979FF',
    // borderRadius: 6,
  },
  cancle: {
    flex: 1,
    backgroundColor: 'white',
    // borderRadius: 6,
    // borderWidth: 1,
    // borderColor: 'gray',
  },
  subContainer: {
    marginTop: '20rem',
    width: '150rem',
    height: '40rem',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    width: 1,
    height: '100%',
    backgroundColor: '#EDEDED',
  },
  text: {
    color: '#858585',
    margin: 3,
  },
  input: {
    flex: 1,
    textAlignVertical: 'center',
    padding: 0,
    color: '#E63025',
    alignItems: 'center',
    textAlign: 'center',
  },
});
