import * as React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, Modal, ImageBackground,
  Platform, BackHandler } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Carousel } from 'antd-mobile';
import StyleSheet from 'react-native-extended-stylesheet';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import { createAction, connect } from '../../../utils';
import { fromJS, Map, List } from 'immutable';
import { cutImgUrl } from '../../../utils';
import Swiper from 'react-native-swiper';
import {Color, Font} from 'consts';

interface IGoodsHeaderProps {
  imageArr?: string[];
  videoMap?: { video: string; img: string };
  title?: string;
  detail?: string;
  modelId: string;
  swiperResource?: object[];
}

export interface IGoodsHeaderState {
  showImageViewer: boolean;
  showVideoPlayer: boolean;
  imageIndex: number;
  videoIndex: number;
  autoPlay: boolean;
}

const mapStateToProps = (
  {
    goodsDetail,
  },
  { modelId },
) => {
  try {
    return {
      title: goodsDetail.getIn([modelId, 'data', 'product', 'productFullName']),
      detail: goodsDetail.getIn([modelId, 'data', 'product', 'productTitle']),
      imageArr: goodsDetail.getIn([modelId, 'data', 'swiperImgs']),
      videoMap: goodsDetail.getIn([modelId, 'data', 'swiperVideo']),
      swiperResource: goodsDetail.getIn([modelId, 'data', 'swiperResource']),
    };
  } catch (error) {
    Log('====GOODS_HEADER=====', error);
    return { imageArr: [] };
  }
};

@connect(mapStateToProps)
export default class GoodsHeader extends React.PureComponent<IGoodsHeaderProps, IGoodsHeaderState> {
  constructor(props: IGoodsHeaderProps) {
    super(props);

    this.state = {
      showImageViewer: false,
      showVideoPlayer: false,
      imageIndex: 0,
      videoIndex: 0,
      autoPlay: true,
    };
  }

  public render(): JSX.Element {
    const { imageArr = [], videoMap, title, detail, swiperResource } = this.props;
    let contentArr = [];
    contentArr = swiperResource && swiperResource.toJS();
    let autoPlay;
    if (contentArr && contentArr.length>1){
      autoPlay = true;
    }else{
      autoPlay = false;
    }
    
    return (
      <View>
        {autoPlay ? this.renderSwiper(contentArr, videoMap) :
          this.renderSingelViewer(contentArr && contentArr[0], videoMap)}
        <Text style={styles.title} selectable={true}>{title}</Text>
        {!!detail && <Text style={styles.detail} selectable={true}>{detail}</Text>}
        {imageArr.size > 0 &&         
          <Modal visible={this.state.showImageViewer} transparent={true}
            onRequestClose={() => {this.setModalVisible(false)}}>
            <ImageViewer
              imageUrls={(imageArr.map((url) => ({ url }))).toJS()}
              index={this.state.imageIndex}
              onClick={() => this.setState({ showImageViewer: false })}
            />
          </Modal>
        }
      </View>
    );
  }

  renderContent=(videoMap, image, index)=>{
    return(
      <TouchableOpacity  activeOpacity={1} key={'key' + index} onPress={() => {
        if (videoMap && videoMap.toJS().video) {
          if (index < 1) {
            dvaStore.dispatch(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'VideoPlayer', params: { uri: videoMap.toJS().video.replace(/(^\s*)|(\s*$)/g, "") } }));
          } else {
            this.setState({ imageIndex: index - 1, showImageViewer: true, showVideoPlayer: false });
          }
        } else {
          this.setState({ imageIndex: index, showImageViewer: true, showVideoPlayer: false });
        }
      }} >
        <ImageBackground
          style={[styles.bannaerCotainer, { width, height: 300 }]}
          resizeMode = 'contain'
          source={{uri: cutImgUrl(image, 500, 500, true)}}
        >
          {!!(videoMap && videoMap.toJS().video && index < 1) && <Image source={require('../../../images/bfVideo.png')} style={styles.videoPlay}/>}
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  renderSwiper=(contentArr, videoMap)=> {
    return(
      <View style={styles.swiper}>
        <Swiper
          autoplay={true}
          loop={true}
          autoplayTimeout={3}
          pagingEnabled={true}
          showsPagination={true}
          paginationStyle={{bottom: 10}}
          dot={<View style={styles.dot}/>}
          activeDot={<View style={styles.activeDot}/>}
        >
          {contentArr && contentArr.map(({ image }, index) => (
            this.renderContent(videoMap, image, index)
          ))}
        </Swiper>
      </View>
    );
  }

  renderSingelViewer=(contentArr, videoMap)=> {
    return(
      <TouchableOpacity  activeOpacity={1} onPress={() => {
        if (videoMap && videoMap.toJS().video) {
            dvaStore.dispatch(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'VideoPlayer', params: { uri: videoMap.toJS().video.replace(/(^\s*)|(\s*$)/g, "") } }));
        } else {
          this.setState({ imageIndex: 0, showImageViewer: true, showVideoPlayer: false });
        } 
      }} >
        <ImageBackground
          style={[styles.bannaerCotainer, { width, height: 300 }]}
          resizeMode = 'contain'
          source={ contentArr && contentArr.image && {uri: cutImgUrl(contentArr.image, 300, 300, true)}}
        >
          {!!(videoMap && videoMap.toJS().video) && <Image source={require('../../../images/bfVideo.png')} style={styles.videoPlay}/>}
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  setModalVisible=(visible)=> {
    this.setState({showImageViewer: visible});
  }
}

import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;

const styles = StyleSheet.create({
  bannaerCotainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swiper: {
    height: 300,
    width: width,
  },
  dot: {
    backgroundColor: 'rgba(204,204,204,0.5)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  activeDot:{
    backgroundColor: Color.GREY_8,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  videoPlay: {
    width: '66rem',
    height: '66rem',
  },
  title: {
    fontSize: '17rem',
    fontWeight: '300',
    padding: 16,
    paddingBottom: 0,
  },
  detail: {
    fontSize: '14rem',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 0,
    color: '#666666',
  },
});
