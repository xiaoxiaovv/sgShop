import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Toast } from 'antd-mobile';
import CountEditModal from '../components/CountEditModal';

export interface IAddSubtractorProps {
  edited: boolean;
  style?: any;
  value: number | string;
  maxValue?: number;
  minValue?: number;
  onValueChange?: (value: number) => void;
  productAttribute?:number;
}

export interface IAddSubtractorState {
  value: number;
  modalVisible: boolean;
}

export default class CountEditor extends React.Component<IAddSubtractorProps, IAddSubtractorState> {
  public static defaultProps: IAddSubtractorProps;
  constructor(props: IAddSubtractorProps) {
    super(props);
    const value = typeof props.value === 'string' ? parseInt(props.value, 0) : props.value;
    this.state = {
      value,
      modalVisible: false,
    };
  }

  public componentWillReceiveProps(nextProps: IAddSubtractorProps) {
    const value = typeof nextProps.value === 'string' ? parseInt(nextProps.value, 0) : nextProps.value;
    if (value !== this.state.value) {
      this.setState({ value });
    }
  }

  public render(): JSX.Element {
    const { edited, maxValue, minValue, onValueChange,productAttribute } = this.props;
    return (
      <View style={[styles.container, this.props.style]}>
      {
          (this.props.productAttribute == 0 || this.props.productAttribute == 1 || this.props.productAttribute == undefined)?
          <TouchableOpacity style={styles.button} onPress={() => this.onValueChangeAction(false)}>
             <Text style={styles.text}>-</Text>
          </TouchableOpacity>
          :
          <TouchableOpacity style={styles.button}>
             <Text style={styles.text}>-</Text>
          </TouchableOpacity>
      }
        <View style={styles.line}/>
        {
          edited ? <TextInput
                    style={[styles.input, styles.button]}
                    underlineColorAndroid= 'transparent'
                    multiline= {false}
                    maxLength={3}
                    onChangeText={this.inputValue}
                    onEndEditing={this.onEndEditing}
                    value={this.state.value + ''}
                    keyboardType= 'numeric'
                    /> :
                          <TouchableOpacity style={styles.button} onPress={() => this.setState({modalVisible: true})}>
                            <Text style={styles.text}>{this.state.value}</Text>
                          </TouchableOpacity>
        }
        <View style={styles.line}/>
        {
          (this.props.productAttribute == 0 || this.props.productAttribute == 1 || this.props.productAttribute == undefined)?
          <TouchableOpacity style={styles.button} onPress={() => this.onValueChangeAction(true)}>
              <Text style={styles.text}>+</Text>
          </TouchableOpacity>
          :
          <TouchableOpacity style={styles.button}>
              <Text style={styles.text}>+</Text>
          </TouchableOpacity>
        }
        <CountEditModal
          handleVisible={this.handleModalVisible}
          onValueChange={onValueChange}
          maxValue={(this.props.productAttribute == 0 || this.props.productAttribute == 1 || this.props.productAttribute == undefined)?maxValue:1}
          minValue={ (this.props.productAttribute == 0 || this.props.productAttribute == 1 || this.props.productAttribute == undefined)?minValue:1}
          modalVisible={this.state.modalVisible}
          value={this.state.value}
          productAttribute={this.props.productAttribute}
          />
      </View>
    );
  }

  private handleModalVisible = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  }

  private inputValue = (text: string) => {
    const temText = Number.parseInt(text) || 0;
    if(this.props.productAttribute ==2 || this.props.productAttribute == 3){
       this.setState({value:1})
    }else{
      this.setState({ value: temText },()=>{
        this.props.onValueChange &&this.props.onValueChange(temText);
      });
    }


  }

  private onEndEditing = () => {
    const { maxValue, minValue, onValueChange, value } = this.props;
    let temText = this.state.value;
    if (maxValue && temText > Math.min(maxValue, 100)) { // 之前是校验库存，测试说不应该校验，最大数量限制为定值100，测试又说加上校验库存
      Toast.info(`最多购买${Math.min(maxValue, 100)}件`);
      temText = Math.min(maxValue, 100);
    }
    if (temText < minValue) {
      Toast.info(`数量不能少于${minValue}`);
      temText = minValue;
    }

    if (temText !== value) {
      onValueChange ? onValueChange(temText) : this.setState({ value: temText });
    } else if (temText !== this.state.value) {
      this.setState({ value: temText });
    }
  }

  private onValueChangeAction = (add: boolean) => {
    let value = this.state.value;
    const { maxValue, minValue, onValueChange } = this.props;
    if (add) {
      value += 1;
    } else {
      value -= 1;
    }
    if (value < minValue) {
      Toast.info(`数量不能少于${minValue}`);
      typeof minValue !== 'undefined' && (value = Math.max(minValue, value));
    } else if (maxValue && value > Math.min(maxValue, 100)) {
      value = Math.min(maxValue, 100);
      typeof maxValue !== 'undefined' && (value = Math.min(maxValue, 100));
      Toast.info(`最多购买${Math.min(maxValue, 100)}件`); 
      return;
    }
    onValueChange ? onValueChange(value) : this.setState({ value });
  }
}

CountEditor.defaultProps = {
  value: 1,
  minValue: 1,
  edited: false,
};

const styles = StyleSheet.create({
  container: {
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
    flex: 1,
    color: '#858585',
    margin: 3,
  },
  input: {
    flex: 1,
    textAlignVertical: 'center',
    padding: 0,
    color: '#858585',
    alignItems: 'center',
    textAlign: 'center',
  },
});
