import React from 'react';
import { Text, TextInput, TouchableWithoutFeedback, View ,StyleSheet} from 'react-native';


const SPEED = 200;
const DELAY = 600;
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;


//将除数字与字母以外的转化为 数字，小数点不转
function defaultParser(input) {
  return input.replace(/[^\w\.-]+/g, '');
}

export default class InputNumber extends React.Component {

  static defaultProps = {
    max: MAX_SAFE_INTEGER,
    min: -MAX_SAFE_INTEGER,
    step: 1,
    style: {},
    parser: defaultParser,
  };

  autoStepTimer = undefined;
  _stepDown= undefined;
  _stepDownText= undefined;
  _stepUp= undefined;
  _stepUpText= undefined;

  constructor(props) {
    super(props);

    let value;
    if ('value' in props) {
      value = props.value;
    } else {
      value = props.defaultValue;
    }
    value = this.toNumber(value);
    this.state = {
      inputValue: this.toPrecisionAsStep(value),
      value,
      focused: props.autoFocus,
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = this.state.focused
        ? nextProps.value : this.getValidValue(nextProps.value);
      this.setState({
        value,
        inputValue: value,
      });
    }
  }

  componentWillUnmount() {
    this.stop();
  }

  onChange = (e: any) => {
    const { parser, onChange } = this.props;
    const input = parser && parser(this.getValueFromEvent(e).trim());
    this.setState({ inputValue: input });
    onChange && onChange(this.toNumberWhenUserInput(input)); // valid number or invalid string
  }

  onFocus = (...args) => {
    this.setState({
      focused: true,
    });
    const { onFocus } = this.props;
    onFocus && onFocus(...args);
  }

  onBlur = (e, ...args) => {
    this.setState({
      focused: false,
    });
    const value = this.getCurrentValidValue(this.state.inputValue);
    e.persist();
    this.setValue(value, () => {
      const { onBlur } = this.props;
      onBlur && onBlur(e, ...args);
    });
  }

  getCurrentValidValue = (value) => {
    let val = value;
    if (val === '') {
      val = '';
    } else if (!this.isNotCompleteNumber(val)) {
      val = this.getValidValue(val);
    } else {
      val = this.state.value;
    }
    return this.toNumber(val);
  }

  getValidValue = (value) => {
    let val = parseFloat(value);
    if (isNaN(val)) {
      return value;
    }
    if (val < this.props.min) {
      val = this.props.min ;
    }
    if (val > this.props.max) {
      val = this.props.max ;
    }
    return val;
  }

  setValue = (v, callback) => {
    const newValue = this.isNotCompleteNumber(parseFloat(v)) ? undefined : parseFloat(v);
    const changed = newValue !== this.state.value ||
      `${newValue}` !== `${this.state.inputValue}`; // https://github.com/ant-design/ant-design/issues/7363
    if (!('value' in this.props)) {
      this.setState({
        value: newValue,
        inputValue: this.toPrecisionAsStep(v),
      } , callback);
    } else {
      this.setState({
        inputValue: this.toPrecisionAsStep(this.state.value),
      }, callback);
    }
    if (changed) {
      const { onChange } = this.props;
      onChange && onChange(newValue);
    }
  }

  getPrecision = (value) => {
    if ('precision' in this.props) {
      return this.props.precision;
    }
    const valueString = value.toString();
    if (valueString.indexOf('e-') >= 0) {
      return parseInt(valueString.slice(valueString.indexOf('e-') + 2), 10);
    }
    let precision = 0;
    if (valueString.indexOf('.') >= 0) {
      precision = valueString.length - valueString.indexOf('.') - 1;
    }
    return precision;
  }


  /**
   * 保留的小数点位数
   * @param currentValue
   * @param ratio
   * @returns {*}
   */
  getMaxPrecision = (currentValue, ratio = 1) => {
    if ('precision' in this.props) {
      return this.props.precision ;
    }
    const { step } = this.props;
    const ratioPrecision = this.getPrecision(ratio);
    const stepPrecision = this.getPrecision(step);
    const currentValuePrecision = this.getPrecision(currentValue);
    if (!currentValue) {
      return ratioPrecision + stepPrecision;
    }
    return Math.max(currentValuePrecision, ratioPrecision + stepPrecision);
  }

  getPrecisionFactor = (currentValue, ratio = 1) => {
    const precision = this.getMaxPrecision(currentValue, ratio);
    return Math.pow(10, precision);
  }

  /**
   * 将num 转成 string
   * @param num
   * @returns {*}
   */
  toPrecisionAsStep = (num) => {
    if (this.isNotCompleteNumber(num) || num === '') {
      return num;
    }
    const precision = Math.abs(this.getMaxPrecision(num));
    if (!isNaN(precision)) {
      return Number(num).toFixed(precision);
    }
    return num.toString();
  }

  isNotCompleteNumber = (num) => {
    return (
      isNaN(num) ||
      num === '' ||
      num === null ||
      (num && num.toString().indexOf('.') === num.toString().length - 1)
    );
  }

  toNumber = (num) => {
    if (this.isNotCompleteNumber(num)) {
      return num;
    }
    if ('precision' in this.props) {
      return Number(Number(num).toFixed(this.props.precision));
    }
    return Number(num);
  }

  // '1.0' '1.00'  => may be a inputing number
  toNumberWhenUserInput = (num) => {
    // num.length > 16 => prevent input large number will became Infinity
    if ((/\.\d*0$/.test(num) || num.length > 16) && this.state.focused) {
      return num;
    }
    return this.toNumber(num);
  }

  /**
   *
   * @param type: 'up' | 'down'
   * @param val
   * @param rat
   */
  stepCompute = (type, val, rat) => {
    const { step, min } = this.props;
    const precisionFactor = this.getPrecisionFactor(val, rat);
    const precision = Math.abs(this.getMaxPrecision(val, rat));
    let result;
    const direct = type === 'up' ? 1 : -1;
    if (typeof val === 'number') {
      result =
        ((precisionFactor * val + direct * precisionFactor * +step * rat) /
          precisionFactor).toFixed(precision);
    } else {
      result = min === -Infinity ? direct * +step : min;
    }
    return this.toNumber(result);
  }

  /**
   *
   * @param type: 'up' | 'down'
   * @param e
   * @param ratio
   */
  step = (type, e, ratio = 1) => {
    if (e) {
      e.preventDefault();
    }
    const props = this.props;
    if (props.disabled) {
      return false;
    }
    const value = this.getCurrentValidValue(this.state.inputValue) || 0;
    if (this.isNotCompleteNumber(value)) {
      return false;
    }
    let val = this.stepCompute(type, value, ratio);
    const outOfRange = val > props.max || val < props.min;
    if (val > props.max) {
      val = props.max;
    } else if (val < props.min) {
      val = props.min;
    }
    this.setValue(val);
    this.setState({
      focused: true,
    });
    return !outOfRange;
  }

  stop = () => {
    if (this.autoStepTimer) {
      clearTimeout(this.autoStepTimer);
    }
  }

  /**
   *
   * @param type: 'up' | 'down'
   * @param e
   * @param ratio
   * @param recursive
   */
  action = (type, e, ratio, recursive) => {
    if (e.persist) {
      e.persist();
    }
    this.stop();
    if (this.step(type, e, ratio)) {
      this.autoStepTimer = setTimeout(() => {
        this.action(type, e, ratio, true);
      }, recursive ? SPEED : DELAY);
    }
  }

  down = (e, ratio, recursive) => {
    this.action('down', e, ratio, recursive);
  }

  up = (e, ratio, recursive) => {
    this.action('up', e, ratio, recursive);
  }

  onPressIn(type) {
    if (this.props.disabled) {
      return;
    }
    this[type].setNativeProps({
      style: [styles.stepWrap, styles.highlightStepBorderColor],
    });
    (this)[`${type}Text`].setNativeProps({
      style: [styles.stepText, styles.highlightStepTextColor],
    });
  }

  onPressOut(type) {
    if (this.props.disabled) {
      return;
    }
    this[type].setNativeProps({
      style: [styles.stepWrap],
    });
    this[`${type}Text`].setNativeProps({
      style: [styles.stepText],
    });
  }

  onPressInDown = (e) => {
    this.onPressIn('_stepDown');
    this.down(e, true);
  }
  onPressOutDown = () => {
    this.onPressOut('_stepDown');
    this.stop();
  }

  onPressInUp = (e) => {
    this.onPressIn('_stepUp');
    this.up(e, true);
  }

  onPressOutUp = () => {
    this.onPressOut('_stepUp');
    this.stop();
  }

  getValueFromEvent(e) {
    return e.nativeEvent.text;
  }

  render() {
    const { props, state } = this;
    const { style, upStyle, downStyle, inputStyle } = this.props;
    const editable = !this.props.readOnly && !this.props.disabled;

    let upDisabledStyle = null;
    let downDisabledStyle = null;
    let upDisabledTextStyle = null;
    let downDisabledTextStyle = null;
    const value = +state.value;
    if (!isNaN(value)) {
      const val = Number(value);
      if (val >= (props.max)) {
        upDisabledStyle = styles.stepDisabled;
        upDisabledTextStyle = styles.disabledStepTextColor;
      }
      if (val <= (props.min)) {
        downDisabledStyle = styles.stepDisabled;
        downDisabledTextStyle = styles.disabledStepTextColor;
      }
    } else {
      upDisabledStyle = styles.stepDisabled;
      downDisabledStyle = styles.stepDisabled;
      upDisabledTextStyle = styles.disabledStepTextColor;
      downDisabledTextStyle = styles.disabledStepTextColor;
    }

    let inputDisabledStyle = null;
    if (props.disabled) {
      upDisabledStyle = styles.stepDisabled;
      downDisabledStyle = styles.stepDisabled;
      upDisabledTextStyle = styles.disabledStepTextColor;
      downDisabledTextStyle = styles.disabledStepTextColor;
      inputDisabledStyle = styles.disabledStepTextColor;
    }

    let inputDisplayValue;
    if (state.focused) {
      inputDisplayValue = `${state.inputValue}`;
    } else {
      inputDisplayValue = `${state.value}`;
    }

    if (inputDisplayValue === undefined) {
      inputDisplayValue = '';
    }

    return (
      <View style={[styles.container, style]}>
        <TouchableWithoutFeedback
          onPressIn={(editable && !downDisabledStyle) ? this.onPressInDown : undefined}
          onPressOut={(editable && !downDisabledStyle) ? this.onPressOutDown : undefined}
          accessible
          accessibilityLabel="Decrease Value"
          accessibilityComponentType="button"
          accessibilityTraits={(editable && !downDisabledStyle) ? 'button' : 'disabled'}
        >
          <View
            ref={component => this._stepDown = component}
            style={[styles.stepWrap, downDisabledStyle, downStyle]}
          >
            <Text
              ref={component => this._stepDownText = component}
              style={[styles.stepText, downDisabledTextStyle]}
            >-</Text>
          </View>
        </TouchableWithoutFeedback>
        <TextInput
          style={[styles.input, inputDisabledStyle, inputStyle]}
          value={inputDisplayValue}
          autoFocus={props.autoFocus}
          editable={editable}
          onFocus={this.onFocus}
          onEndEditing={this.onBlur}
          onChange={this.onChange}
          underlineColorAndroid="transparent"
          keyboardType={props.keyboardType}
        />
        <TouchableWithoutFeedback
          onPressIn={(editable && !upDisabledStyle) ? this.onPressInUp : undefined}
          onPressOut={(editable && !upDisabledStyle) ? this.onPressOutUp : undefined}
          accessible
          accessibilityLabel="Increase Value"
          accessibilityComponentType="button"
          accessibilityTraits={(editable && !upDisabledStyle) ? 'button' : 'disabled'}
        >
          <View
            ref={component => this._stepUp = component}
            style={[styles.stepWrap, upDisabledStyle, upStyle]}
          >
            <Text
              ref={component => this._stepUpText = component}
              style={[styles.stepText, upDisabledTextStyle]}
            >+</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#222',
  },
  stepWrap: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 6,
    backgroundColor: 'white',
  },
  stepText: {
    textAlign: 'center',
    fontSize: 20,
    color: '#999',
    backgroundColor: 'transparent',
  },
  stepDisabled: {
    borderColor: '#d9d9d9',
    backgroundColor: 'rgba(239, 239, 239, 0.72)',
  },
  disabledStepTextColor: {
    color: '#ccc',
  },
  highlightStepTextColor: {
    color: '#2DB7F5',
  },
  highlightStepBorderColor: {
    borderColor: '#2DB7F5',
  },
});