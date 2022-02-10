import * as React from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableWithoutFeedback,
} from 'react-native';
import {goBanner, bannerClick} from '../../../utils/tools';
import { cutImgUrl, IS_NOTNIL } from '../../../utils';
import Swiper from 'react-native-swiper';

import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

export const StoreHomeBanner: React.SFC<{ dataSource: any, key?: string, height: number }> = ({dataSource = [], height}) => {
    if (!IS_NOTNIL(dataSource)) {
        return null;
    }
    if (dataSource.length === 0) {
        return(<View style={{height: width}}></View>);
    }
    return (<View style={{ height: height, width: width}}>
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
                { dataSource.map((item, index) =>
                    (<View key={`key-${index}`}>
                            <TouchableWithoutFeedback onPress={() => bannerClick(item) }>
                                <Image source={{uri: cutImgUrl(item.imageUrl, width, height)}} resizeMode='stretch'
                                       style={{height, width}}/>
                            </TouchableWithoutFeedback>
                        </View>
                    ),
                )
                }
            </Swiper>
        </View>

//         <IndicatorViewPager
//     keyboardDismissMode='none'
//     style={{height, width, padding: 0}}
//     indicator={<PagerDotIndicator pageCount={dataSource.length}/>}
//     autoPlayEnable={true}
//         >
//         { dataSource.map((item, index) =>
//             (<View key={`key-${index}`}>
//                     <TouchableWithoutFeedback onPress={() => bannerClick(item) }>
//                         <Image source={{uri: cutImgUrl(item.imageUrl, width, height)}} resizeMode='stretch'
//                                style={{height, width}}/>
//                     </TouchableWithoutFeedback>
//                 </View>
//             ),
//         )
// }
// </IndicatorViewPager>
    );
};
