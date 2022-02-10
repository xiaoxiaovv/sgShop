import * as React from 'react';
import {View} from 'react-native';
import EStylesheet from 'react-native-extended-stylesheet';
import Video from 'react-native-video';
import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
import CountDownBtn from '../../components/CountDownBtn';

interface IADVideoProps {
  videoUrl?: string;
  onEnd: () => void;
  onPlay: () => void;
  skipPress?: () => void;
}
interface IADVideoState {
  duration: number;
}

export default class ADVideo extends React.Component<IADVideoProps, any> {
  constructor(props) {
    super(props);
    this.state = {
      duration: 0,
    };
  }
  public componentDidMount() {

  }
  public render(): JSX.Element {
    const { videoUrl, onEnd, skipPress, onPlay } = this.props;
    return (
      <View style={[styles.contain, { position: 'absolute', top: 0, left: 0, width, height }]}>
        <Video
          source={{ uri: videoUrl }}
          style={{ flex: 1 }}
          resizeMode='cover'
          // repeat
          key='video2'          // Callback when video starts to load
          onLoad={(data) => {
            this.setState({ duration: Math.ceil(data.duration) });
            onPlay();
          }}               // Callback when video loads
          // onProgress={(aa) => { }}               // Callback every ~250ms with currentTime
          onEnd={(aa) => {
            onEnd();
          }}                      // Callback when playback finishes
          // onError={(aa, bb) => { }}               // Callback when video cannot be loaded
          // onBuffer={(aa, bb) => { }}               // Callback when remote video is buffering
          // onTimedMetadata={(aa, bb) => { }}
        />
        <CountDownBtn time={this.state.duration} style={styles.skipBtn} onPress={() => skipPress ? skipPress() : onEnd()}/>
      </View>
    );
  }
}

const styles = EStylesheet.create({
  contain: {
    flex: 1,
  },
  skipBtn: {
    position: 'absolute',
    top: 32,
    right: 16,
    height: 30,
    width: 30,
    backgroundColor: 'transparent',
  },
});
