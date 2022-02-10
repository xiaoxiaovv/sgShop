import React, {
  Component,
} from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
  StyleProp,
  ViewStyle,
  ImageURISource,
  DeviceEventEmitter,
} from 'react-native';
import PropTypes from 'prop-types';
import { createAction } from '../../utils/index';
import Color from '../../consts/Color';

interface ICountDownInterface {
  date: string | Date;
  startDate: string | Date;
  hours: string;
  mins: string;
  segs: string;
  days?: { plural: string, singular: string };
  daysStyle: StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;
  hoursStyle: StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;
  minsStyle: StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;
  secsStyle: StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;
  firstColonStyle: StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;
  secondColonStyle: StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;
  containerStyle?: StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;
  onEnd?: () => void;
}

const styles = StyleSheet.create({
  secondColonStyle: {
    color: 'gray',
    fontSize: 14,
    marginTop: 2,
    marginLeft: 0,
    marginRight: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  cardItemTimeRemainTxt: {
    fontSize: 20,
    color: '#ee394b',
  },
  text: {
    fontSize: 30,
    color: '#FFF',
    marginLeft: 7,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 时间文字
  defaultTime: {
    paddingHorizontal: 3,
    backgroundColor: 'rgba(85, 85, 85, 1)',
    fontSize: 12,
    color: 'white',
    marginHorizontal: 3,
    borderRadius: 2,
  },
  // 冒号
  defaultColon: {
    fontSize: 12, color: 'rgba(85, 85, 85, 1)',
  },
  hoursStyle: {
    height: 22,
    lineHeight: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'gray',
    marginLeft: 6,
    marginRight: 6,
    paddingLeft: 3,
    paddingRight: 3,
    color: 'red',
    fontSize: 14,
  },
  time: {
    fontSize: 12,
    color: Color.GREY_1,
  },
});
/**
 * 限时抢购页面倒计时组件
 * @param {ICountDownInterface} props
 * @returns {JSX.Element}
 * @constructor
 */
class CountDownTimer extends Component<ICountDownInterface> {
  private static displayName = 'Simple countDown';
  private static defaultProps = {
    date: new Date(),
    days: {
      plural: '天',
      singular: '天',
    },
    hours: ':',
    mins: ':',
    segs: ':',
    onEnd: () => Log(''),

    containerStyle: styles.container, // container 的style
    daysStyle: styles.defaultTime, // 天数 字体的style
    hoursStyle: styles.defaultTime, // 小时 字体的style
    minsStyle: styles.defaultTime, // 分钟 字体的style
    secsStyle: styles.defaultTime, // 秒数 字体的style
    firstColonStyle: styles.defaultColon, // 从左向右 第一个冒号 字体的style
    secondColonStyle: styles.defaultColon, // 从左向右 第2个冒号 字体的style
  };
  public state = {
    days: 0,
    hours: 0,
    min: 0,
    sec: 0,
    isDispalying: false,
  };

  private interval: any;
  public componentDidMount() {
    const { date: endTime } = this.props;
    if (new Date() > new Date(endTime)) {
      this.props.onEnd();
    } else {
      this.intervalFunc();
    }
  }
  public componentWillMount() {
    const date = this.getDateData(this.props.date);
    if (date) {
      this.setState(date);
    }

  }
  public componentWillUnmount() {
    this.stop();
  }
  public intervalFunc = () => {
    this.stop();
    this.interval = setInterval(() => {
      console.log('calling getDateData...');
      const date = this.getDateData(this.props.date);
      console.log('calling getDateData..., the result is ', date);
      if (date) {
        this.setState({
          ...date,
          ...{ isDispalying: this.flashHasBegun() },
        });
      } else {
        this.stop();
        this.props.onEnd();
      }
    }, 1000);
  }
  public getDateData(endDate) {
    let diff = (Date.parse(String(new Date(endDate))) - Date.parse(String(new Date()))) / 1000; // diff 单位是秒
    console.log('spring -> diff = ', diff);
    if (diff < 0) { // 表示活动已经结束 或者 活动已经开始
      return false;
    }

    const timeLeft = {
      years: 0,
      days: 0,
      hours: 0,
      min: 0,
      sec: 0,
      millisec: 0,
    };

    if (diff >= (365.25 * 86400)) {
      timeLeft.years = Math.floor(diff / (365.25 * 86400));
      diff -= timeLeft.years * 365.25 * 86400;
    }
    if (diff >= 86400) {
      timeLeft.days = Math.floor(diff / 86400);
      diff -= timeLeft.days * 86400;
    }
    if (diff >= 3600) {
      timeLeft.hours = Math.floor(diff / 3600);
      diff -= timeLeft.hours * 3600;
    }
    if (diff >= 60) {
      timeLeft.min = Math.floor(diff / 60);
      diff -= timeLeft.min * 60;
    }
    timeLeft.sec = diff;
    console.log('spring -> timeLeft = ', timeLeft);
    return timeLeft;
  }
  public render(): JSX.Element {
    const countDown = this.state;
    let days;
    if (countDown.days === 1) {
      days = this.props.days.singular;
    } else {
      days = this.props.days.plural;
    }
    return (
      this.state.isDispalying ? <View style={this.props.containerStyle}>
        <Image
          style={{
            height: 14,
            width: 14,
            marginRight: 5,
          }}
          resizeMode={'stretch'}
          source={require('../../images/count_clock.png')}
        />
        <Text style={{
            color: '#666',
            fontSize: 14,
        }}>距离结束还有 </Text>
        <Text style={styles.time}>{this.leadingZeros(countDown.hours)}</Text>
        <Text style={styles.time}>:</Text>
        <Text style={styles.time}>{this.leadingZeros(countDown.min)}</Text>
        <Text style={styles.time}>:</Text>
        <Text style={styles.time}>{this.leadingZeros(countDown.sec)}</Text>
      </View> : <View/>
    );
  }
  public stop() {
    clearInterval(this.interval);
  }
  public leadingZeros(num, length = null) {

    let lengthh = length;
    let numm = num;
    if (lengthh === null) {
      lengthh = 2;
    }
    numm = String(numm);
    while (numm.length < lengthh) {
      numm = '0' + numm;
    }
    return numm;
  }
  private flashHasBegun = (): boolean => {
    const startDate = new Date(this.props.startDate);
    if (new Date() > startDate) {
      return true;
    }

    return false;
  }
}

export default CountDownTimer;
