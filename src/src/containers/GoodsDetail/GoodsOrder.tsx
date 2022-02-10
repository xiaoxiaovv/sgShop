import * as React from 'react';
import { View, Modal, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback,
  } from 'react-native';
import { width, sceenHeight, mobileNumberRegExp } from '../../utils';
import EStyleSheet from 'react-native-extended-stylesheet';
import Button from 'rn-custom-btn1';
import { getAppJSON } from '../../netWork';
import Config from 'react-native-config';
import { Toast } from 'antd-mobile';
import ToastContainer from 'antd-mobile/lib/toast/ToastContainer.native';

export interface IGoodsOrderProps {
  visible: boolean;
  phone: string;
  onCancle: () => void;
  onConfirm?: (mobile, vertifyStr) => void;
}

export interface IGoodsOrderState {
  cutDownTime: number;
  mobile: string;
  vertifyStr: string;
  toast: { show?: boolean, content?: string, duration?: number, type?: string };
}

export default class GoodsOrder extends React.Component<IGoodsOrderProps, IGoodsOrderState> {
  private timer: number;
  constructor(props: IGoodsOrderProps) {
    super(props);

    this.state = {
      cutDownTime: 0,
      mobile: props.phone,
      vertifyStr: '',
      toast: { show: false },
    };
  }

  public componentWillReceiveProps(nextProps) {
    (this.state.mobile !== nextProps.phone) && this.setState({ mobile: nextProps.phone });
  }

  public render(): JSX.Element {
    const { visible, phone, onCancle, onConfirm } = this.props;
    const { cutDownTime, mobile, vertifyStr } = this.state;
    return (
      <Modal
        animationType='fade'
        transparent={true}
        visible={visible}
        onRequestClose={() =>{Keyboard.dismiss()}}
      >
        <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
          <View style={styles.bg}>
            <View style={styles.contain}>
              <Text style={styles.title}>预约信息确认</Text>
              <View style={styles.line}/>
              <View style={styles.inputContain}>
                <Text style={styles.inputName}>手机号：</Text>
                <TextInput
                  style={styles.input}
                  value={mobile}
                  onChangeText={(text) => this.setState({ mobile: text })}
                  underlineColorAndroid='transparent'
                  clearButtonMode='while-editing'
                />
              </View>
              <View style={styles.inputContain}>
                <Text style={styles.inputName}>验证码：</Text>
                <TextInput
                  style={[styles.input, styles.inputSmall]}
                  value={vertifyStr}
                  underlineColorAndroid='transparent'
                  clearButtonMode='while-editing'
                  onChangeText={(text) => this.setState({ vertifyStr: text })}
                />
                <TouchableOpacity onPress={this.getSmss} disabled={cutDownTime > 0}>
                  <Text style={styles.vertify}>{cutDownTime > 0 ? `${cutDownTime}秒后可重发` : '获取验证码'}</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.remand}>温馨提示：</Text>
              <Text style={styles.remand}>1.我们会向此手机号发送抢购信息通知,请认真填写;</Text>
              <Text style={styles.remand}>2.提交后信息不可修改</Text>
              <Text style={styles.remand}>3.预约成功不代表购买成功</Text>
              <View style={styles.btnContain}>
                <Button title='取消' style={{ flex: 1}} textStyle={styles.btnText} onPress={onCancle}/>
                <View style={styles.lineColumn} />
                <Button title='确定' style={{ flex: 1}} textStyle={styles.btnText} onPress={this.confirm}/>
              </View>
            </View>
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
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
  private getSmss = async () => {
    const { success, message } = await getAppJSON(Config.GET_SMSS, { mobile: this.state.mobile });
    if (success) {
      this.setState({ cutDownTime: 60 });
      this.timer = setInterval(() => {
        const preCutDownTime = this.state.cutDownTime;
        if (preCutDownTime <= 0) {
          clearInterval(this.timer);
        } else {
          this.setState({ cutDownTime: preCutDownTime - 1 });
        }
      }, 1000);
    }
  }
  private confirm = async () => {
    const { mobile, vertifyStr } = this.state;
    if (!(mobileNumberRegExp.test(mobile))) {
      this.setState({ toast: { content: '请输入正确的手机号码！', show: true }});
      return;
    }
    if (!vertifyStr) {
      this.setState({ toast: { content: '请输入验证码！', show: true }});
      return;
    }
    this.props.onConfirm(mobile, vertifyStr);
  }
}

const styles = EStyleSheet.create({
  $width: '280rem',
  bg: {
    width,
    height: sceenHeight,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contain: {
    width: '$width',
    backgroundColor: 'white',
    // alignItems: 'center',
    borderRadius: 5,
  },
  title: {
    alignSelf: 'center',
    color: '$darkblack',
    fontSize: '$fontSize5',
    marginTop: 16,
  },
  line: {
    alignSelf: 'center',
    backgroundColor: '$lightgray',
    height: 1,
    marginTop: 8,
    marginBottom: 8,
    width: '200rem',
  },
  inputContain: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
    marginLeft: 16,
  },
  inputName: {
    color: '$darkblack',
    fontSize: '$fontSize4',
  },
  input: {
    color: '$darkblack',
    fontSize: '$fontSize3',
    width: '175rem',
    borderWidth: 1,
    height: '35rem',
    lineHeight: '35rem',
    padding: 0,
    borderColor: '$lightgray',
  },
  inputSmall: {
    width: '90rem',
  },
  vertify: {
    color: '$darkblue',
    fontSize: '$fontSize3',
    backgroundColor: '$gray',
    padding: 4,
    marginLeft: 8,
  },
  remand: {
    color: '$black',
    fontSize: '$fontSize4',
    marginLeft: 16,
    marginRight: 16,
  },
  btnContain: {
    borderColor: '$lightgray',
    borderTopWidth: 1,
    width: '100%',
    height: 44,
    flexDirection: 'row',
    marginTop: 16,
  },
  btnText: {
    color: 'green',
  },
  lineColumn: {
    height: '100%',
    width: 1,
    backgroundColor: '$lightgray',
  },
});
