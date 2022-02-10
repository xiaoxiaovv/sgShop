import * as React from 'react';
import * as Progress from 'react-native-progress';
import { TouchableOpacity, Animated, View, ART, Easing, Text  } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import EStyleSheet from 'react-native-extended-stylesheet';
import Circle from './Circle';

const AnimatedSurface = Animated.createAnimatedComponent(Circle);

export interface ICountDownBtnProps {
  time?: number;
  style?: object;
  onPress: () => void;
}

export interface ICountDownBtnState {
  progress: Animated.Value;
}

export default class CountDownBtn extends React.Component<ICountDownBtnProps, ICountDownBtnState> {
  private circularProgress: any;
  private timer: any;
  constructor(props: ICountDownBtnProps) {
    super(props);

    this.state = {
      progress: new Animated.Value(0),
    };
  }

  public componentWillReceiveProps(nextProps) {
    if (nextProps.time !== this.props.time) {
      this.setState({ progress: new Animated.Value(0) }, () => this.resetAnim(nextProps.time));
    }
  }

  public componentDidMount() {
    this.resetAnim(this.props.time);
  }

  public render(): JSX.Element {
    const { time, style, onPress } = this.props;
    return (
      <TouchableOpacity style={style} onPress={onPress}>
        <AnimatedSurface percent={this.state.progress} />
        <View style={styles.containerStyle}>
          <Text style={styles.progressText}>{'跳过'}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  private resetAnim = (time) => {
    Animated.timing(
      this.state.progress,
      {
        toValue: 1,
        duration: time * 1000,
      },
    ).start();
  }
}

const styles = EStyleSheet.create({
  progressText: {
    color: 'white',
    fontSize: 12,
  },
  containerStyle: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
