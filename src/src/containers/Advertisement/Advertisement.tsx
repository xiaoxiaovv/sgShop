import * as React from 'react';
import { View, AsyncStorage } from 'react-native';
import EStylesheet from 'react-native-extended-stylesheet';
import Video from 'react-native-video';
import { connect, createAction } from '../../utils';
import {  action } from '../../dva/utils';
import { ICustomContain, ShowAdType } from '../../interface';
import ADVideo from './ADVideo';
import ADImage from './ADImage';
import SplashScreen from 'react-native-splash-screen';
import Guide from '../GuidePage/Guide';

interface IAdvertisementProps {
  adData?: any;
  videoUrl?: any;
  showAdType?: ShowAdType;
}

interface IAdvertisementState {
  showImage: boolean;
}

// const mapStateToProps = ({ adModel: { adData, videoUrl }, mainReducer: { showAdType } }) => {
//   return { adData, videoUrl, showAdType };
// };

const mapStateToProps = ({ ADModel: { adData, videoUrl, showAdType } }) => {
  return { adData, videoUrl, showAdType };
};

@connect(mapStateToProps)
export default class Advertisement extends React.Component<IAdvertisementProps & ICustomContain, any> {

  constructor(props) {
    super(props);
    this.state = {
      showImage: !props.videoUrl,
    };
  }

  public componentWillReceiveProps(nexProps) {
    this.setState({ showImage: !nexProps.videoUrl });
  }

  public componentWillUnmount() {
    // Log('componentWillUnmount');
  }

  public render(): JSX.Element {
    const { adData, videoUrl, showAdType } = this.props;
    return (
      <View style={styles.contain}>
        {(showAdType === ShowAdType.Video) && <ADVideo videoUrl={videoUrl} onEnd={this.goNext} onPlay={this.videoOnPlay}/>}
        {(showAdType === ShowAdType.Guide) && <Guide />}
        {(showAdType === ShowAdType.Image) && <ADImage adData={adData} skipPress={this.goNext} />}
      </View>
    );
  }

  private videoOnPlay = () => {
    SplashScreen.hide();
  }

  private goNext = () => {
    this.props.dispatch(action('ADModel/closeAll'));
    // this.props.dispatch(createAction('mainReducer/adViewNext')());
  }
}

const styles = EStylesheet.create({
  contain: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
  },
});
