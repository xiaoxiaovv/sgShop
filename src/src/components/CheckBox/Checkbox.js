import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import PropTypes from 'prop-types';



export default class Checkbox extends React.Component {


  static defaultProps = {
    checked: false,
  };

  static propTypes = {
    checked: PropTypes.boolean,
  }

  state = {
    checked: this.props.checked || this.props.defaultChecked || false,
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      checked: !!nextProps.checked,
    });
  }

  handleClick = () => {
    if (this.props.disabled) {
      return;
    }
    const checked = !this.props.checked;
    this.setState({
      checked,
    });
    if (this.props.onChange) {
      this.props.onChange({target: {checked: checked}});
    }
  }

  render() {
    const {style, disabled, children} = this.props;
    const checked = this.state.checked;
    let imgSrc;
    if (checked) {
      imgSrc = disabled
        ? require('./image/checked_disable.png')
        : require('./image/checked.png');
    } else {
      imgSrc = disabled
        ? require('./image/normal_disable.png')
        : require('./image/normal.png');
    }

    return (
      <TouchableWithoutFeedback onPress={this.handleClick}>
        <View style={styles.wrapper}>
          <Image source={imgSrc} style={[styles.icon, style]}/>
          {
            typeof children === 'string' ? (
              <Text style={styles.iconRight}>{this.props.children}</Text>
            ) : children
          }
        </View>
      </TouchableWithoutFeedback>)

  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 21,
    height: 21,
    borderRadius:10,
  },
  iconRight: {
    marginLeft: 8,
  },
});
