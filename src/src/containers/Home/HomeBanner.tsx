import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableWithoutFeedback,  // 这种按钮点击没有透明度变化
} from 'react-native';
import {goBanner} from '../../utils/tools';
import {IS_NOTNIL} from '../../utils';

import Swiper from 'react-native-swiper';

import Carousel from './../../components/Carousel';

import URL from './../../config/url.js';
let width = URL.width;

const HomeBanner: React.SFC<{ dataSource: any, key?: string, height: number }> = ({dataSource = [], height}) => {
    if (!IS_NOTNIL(dataSource)) {
        return null;
    }
    if (dataSource.length == 0) {
        return(<View style={{height: height}}></View>);
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
                (<View key={`key-${index}`} style={{width, height}}>
                        <TouchableWithoutFeedback
                            onPress={() => goBanner(item) }>
                            <Image source={{uri: cutImgUrl(item.pic, width, height)}} resizeMode='contain'
                                   style={{height, width}}/>
                        </TouchableWithoutFeedback>
                    </View>
                ),
            )
            }
        </Swiper>
        </View>

        // <IndicatorViewPager
        //     keyboardDismissMode='none'
        //     style={{height, width, padding: 0}}
        //     indicator={<PagerDotIndicator pageCount={dataSource.length}/>}
        //     autoPlayEnable={true}
        // >
        //     { dataSource.map((item, index) =>
        //         (<View key={`key-${index}`}>
        //                 <TouchableWithoutFeedback
        //                     onPress={() => goBanner(item) }>
        //                     <Image source={{uri: cutImgUrl(item.pic, width, height)}} resizeMode='stretch'
        //                            style={{height, width}}/>
        //                 </TouchableWithoutFeedback>
        //             </View>
        //         ),
        //     )
        //     }
        // </IndicatorViewPager>
    );
};

export default HomeBanner;
