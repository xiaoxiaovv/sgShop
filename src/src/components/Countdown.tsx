import * as React from 'react';
import { View, Text } from 'react-native';
import EStylesheet from 'react-native-extended-stylesheet';
import {Color} from 'consts';

interface ICountdownProps {
  timeDiff: number;
  stop?: () => void;
}

const getTimeFromDiff = (diff) => {
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
};

function PrefixInteger(num, n = 2) {
  return (Array(n).join('0') + num).slice(-n);
}
class Countdown extends React.Component<ICountdownProps, any> {

  public state = {
    days: 0,
    hours: 0,
    min: 0,
    sec: 0,
  };

  private interval: any;
  private timeDiff: number;

  public componentWillMount() {
    this.timeDiff = this.props.timeDiff / 1000;
    const date = getTimeFromDiff(this.timeDiff);
    if (date) {
      this.setState(date);
    }
  }

  public componentDidMount() {
    // Log(this.props.date);//"2017-03-29T00:00:00+00:00"
    this.interval = setInterval(() => {
      this.timeDiff -= 1;
      const date = getTimeFromDiff(this.timeDiff);
      if (this.timeDiff >= 0) {
        this.setState(date);
      } else {
        this.stop();
        this.props.stop && this.props.stop();
      }
    }, 1000);
  }

  public componentWillUnmount() {
   this.stop();
  }

  public stop() {
    clearInterval(this.interval);
  }

  public render(): JSX.Element {
    const { timeDiff } = this.props;
    const { days, hours, min, sec } = this.state;
    return (
      <View style={{ flexDirection: 'row' }}>
        {[days, hours, min, sec].map((item, index) => [
          index > 0 && <Text key={`colonKeys${index}`} style={styles.colon}>:</Text>,
          (
            <View key={`itemKeys${index}`} style={styles.timeItem}>
              <Text style={styles.itemContent}>{PrefixInteger(item)}</Text>
            </View>
          ),
        ] )}
      </View>
    );
  }
}

const styles = EStylesheet.create({
  colon: {
    fontSize: '10rem',
    color: '#E74025',
    marginLeft: '4rem',
    marginRight: '4rem',
  },
  timeItem: {
    backgroundColor: Color.ORANGE_1,
    width: '18rem',
    height: '18rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  itemContent: {
    fontSize: '10rem',
    color: 'white',
  },
});
export default Countdown;
