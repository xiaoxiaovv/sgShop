import * as React from 'react';
import VideoControls from 'react-native-video-controls';
import { ICustomContain } from '../../interface';

// export interface IVideoPlayerProps {
// }

// export interface IVideoPlayerState {
// }

export default class VideoPlayer extends React.Component<ICustomContain> {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  public render(): JSX.Element {
    const { navigation } = this.props;
    const uri = navigation.state.params.uri || '';
    return (
      <VideoControls
        source={{ uri }}
        navigator={ navigation }
        onBack={() => navigation.goBack()}
      />
    );
  }
}
