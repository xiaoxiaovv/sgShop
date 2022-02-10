import * as React from 'react';
import {
    View,
    TouchableOpacity,
    Image,
    Animated,
    Easing,
} from 'react-native';
import { createAction, connect, width } from '../utils';
import { ICustomContain, IBannerItem } from '../interface';
import { goBanner } from '../utils/tools';
import Swiper from 'react-native-swiper';

interface Ibanner {
  contentArr: IBannerItem[];
  contentStyle?: object;
  style?: object;
}

@connect()
export default class Banner extends React.Component<Ibanner & ICustomContain> {

  public render(): JSX.Element {
      const { contentArr, contentStyle, style } = this.props;
      Log('Banner data ============', contentArr);
      if (contentArr.length === 0) {
          return null;
      }
      return (
          <View style={[style]}>
              <Swiper
                  autoplay={true}
                  loop={true}
                  observer={true}
                  observeParents={false}
                  autoplayTimeout={3}
                  pagingEnabled={true}
                  showsPagination={true}
                  paginationStyle={{bottom: 10}}
                  dot={<View style={{
                      backgroundColor: 'rgba(255,255,255,.5)',
                      width: 7,
                      height: 7,
                      borderRadius: 3.5,
                      marginRight: 8,
                  }}/>}
                  activeDot={<View style={{
                      backgroundColor: '#FFFFFF',
                      width: 9,
                      height: 9,
                      borderRadius: 4.5,
                      marginRight: 8,
                  }}/>}
              >
                  {contentArr.map(({ imageUrl, bannerId, url, linkType }, index) => (
                      <View key={'key' + index}>
                          <TouchableOpacity
                              activeOpacity = {1}
                              style={{ flex: 1 }}
                              onPress={() => goBanner(contentArr[index])}
                              // onPress={() => this.onPress()}
                          >
                              <Image
                                  style={[{ resizeMode: 'stretch' }, contentStyle || style ]}
                                  source={{ uri: cutImgUrl(imageUrl, width - 90, 100) }}
                              />
                          </TouchableOpacity>
                      </View>
                  ))}
              </Swiper>
          </View>
      );
  }

  private onPress = () => {
  }

//   private renderItem = ({ imageUrl, bannerId, url, linkType }, index, contentStyle, style) => {
//       return(
//       <View key={'key' + index}>
//         <TouchableOpacity
//             activeOpacity = {1}
//             style={{ flex: 1 }}
//             onPress={() => this.clickItem(this.props.contentArr[index])}
//         >
//             <Image
//                 style={[{ resizeMode: 'stretch' }, contentStyle || style ]}
//                 source={{ uri: imageUrl }}
//             />
//         </TouchableOpacity>
//     </View>);
//   }

//   private clickItem = (item): void => {
//       const {relationId, url, linkType} = item;
//       const tempArr = url.split('&');
//       switch (linkType) {
//           case -1: // 日常活动
//               break;
//           case 0: // 主体活动
//               break;
//           case 1: // 单品页
//               const productId = tempArr[0].slice(tempArr[0].indexOf('=') + 1);
//               this.props.navigation.navigate('GoodsDetail', { productId });
//               break;
//           case 2: // 领券中心/优惠券详情页
//               break;
//           case 3: // 游戏页
//               break;
//           case 4: // 活动页;热门推荐
//               goBanner(item);
//               break;
//           case 5: // 自定义类型页
//               break;
//           case 6: // 众筹
//               break;
//           case 7: // 新品
//               break;
//           case 8: // 社群
//               break;
//           default:
//               break;
//       }
//   }
}
