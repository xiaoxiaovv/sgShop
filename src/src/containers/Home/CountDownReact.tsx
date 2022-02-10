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
import { ICustomContain ,INavigation} from '../../interface/index';

interface ICountDownInterface {
  flag: number; //  1表示在预热中 2表示在进行中
  date?: number | Date;
  startTime?: number;
  systemTime?: number;
  endTime?: number;
  hours?: string;
  mins?: string;
  segs?: string;
  days?: { plural: string, singular: string };
  daysStyle?: StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;
  hoursStyle?: StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;
  minsStyle?: StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;
  secsStyle?: StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;
  firstColonStyle?: StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;
  secondColonStyle?: StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;
  containerStyle?: StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;
  onEnd?: () => void;
  changeTips?: () => void;
  setTips?: (value) => void;
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
    fontSize: 10,
    color: Color.GREY_1,
  },
});
/**
 * 首页限时抢购倒计时组件
 * @param {ICountDownInterface} props
 * @returns {JSX.Element}
 * @constructor
 */
class CountDown extends Component<ICountDownInterface&ICustomContain> {
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
  };

  private interval: any;
  private listenner: any;
  private listennerSpecialty :any;
  private flag: number;
  public componentDidMount() {
    console.log('CountDown',this.props)
    // Log(this.props.date);//"2017-03-29T00:00:00+00:00"
    if(this.props.navigation.state.routeName == 'Home'){
        this.listenner = DeviceEventEmitter.addListener('flashSaleFresh', (value) => {
          const falshSales = value.flashSales;
          console.log(value)
          if (falshSales.flashProductList === undefined || falshSales.flashProductList.length === 0 ||
            falshSales.systemTime - new Date(falshSales.flashProductList[0].endTime).getTime() > -1000 ||
            falshSales.systemTime < falshSales.preheatingTime) {
            this.stop();
            dvaStore.dispatch(createAction('home/changeFlashSales')({ flashSales: {} }));
            console.log('活动结束-----没有活动---清楚定时器---清楚监听');
          } else {
            console.log('触发监听-----启动定时器');
            this.flag = this.props.flag;
            if (this.props.setTips) {
              this.props.setTips(falshSales.startTime > falshSales.systemTime ? '开始' : '结束');
            }
            this.intervalFunc();
          }
        });
    }else{
      this.listennerSpecialty = DeviceEventEmitter.addListener('flash', (value) => {
        const falshSales = value.flash;
        console.log(value)
        if (falshSales.flashProductList === undefined || falshSales.flashProductList.length === 0 ||
          falshSales.systemTime - new Date(falshSales.flashProductList[0].endTime).getTime() > -1000 ||
          falshSales.systemTime < falshSales.preheatingTime) {
          this.stop();
          dvaStore.dispatch(createAction('LocalSpecialtyModel/getNewAndLimit')({flash:{}}));
          console.log('活动结束-----没有活动---清楚定时器---清楚监听');
        } else {
          console.log('触发监听-----启动定时器');
          this.flag = this.props.flag;
          if (this.props.setTips) {
            this.props.setTips(falshSales.startTime > falshSales.systemTime ? '开始' : '结束');
          }
          this.intervalFunc();
        }
      });
    }

  }
  public componentWillMount() {
    this.flag = this.props.flag;
    const systemTime = this.props.systemTime; // 拷贝接口返回的系统时间
    let result;
    if (this.flag === 1) { // 在预热中
      result = this.getDateData(this.props.startTime, systemTime, 1);
    } else { // 在进行中
      result = this.getDateData(this.props.endTime, systemTime, 2);
    }
    if (result) {
      this.setState(result);
    }
  }
  public componentWillUnmount() {
    this.stop();
    if(this.props.navigation.state.routeName == 'Home'){
      if(this.listenner){
          this.listenner.remove();
      }
    }else{
       this.listennerSpecialty.remove();
    }

  }
  public intervalFunc = () => {
    this.stop();
    let systemTime = this.props.systemTime; // 拷贝接口返回的系统时间
    this.interval = setInterval(() => {
      let result;
      systemTime += 1000;
      if (this.flag === 1) { // 在预热中
        result = this.getDateData(this.props.startTime, systemTime, 1);
      } else { // 在进行中
        result = this.getDateData(this.props.endTime, systemTime, 2);
      }
      if (result) {
        this.setState(result);
      } else {
        this.stop();
        this.props.onEnd();
      }
    }, 1000);
  }
  public getDateData(endDate, systemTime, flag) {
    let diff = (Date.parse(String(new Date(endDate))) - Date.parse(String(new Date()))) / 1000; // diff 单位是秒
    if (diff < 1) {
      if (flag === 1) { // 预热已经结束
        this.flag = 2;
        if (this.props.changeTips) {
          this.props.changeTips();
          console.log('修改文字');
        }
      } else { //  活动已经结束
        return false;
      }
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
      <View style={styles.container}>
        <Text style={styles.time}>{this.leadingZeros(countDown.hours)}</Text>
        <Text style={styles.time}>:</Text>
        <Text style={styles.time}>{this.leadingZeros(countDown.min)}</Text>
        <Text style={styles.time}>:</Text>
        <Text style={styles.time}>{this.leadingZeros(countDown.sec)}</Text>
      </View>
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
}

export default CountDown;
