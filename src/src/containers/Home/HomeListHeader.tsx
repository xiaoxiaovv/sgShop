import * as React from 'react';
import {View, ImageBackground, TouchableOpacity, Image, Text, StyleSheet} from 'react-native';
import HomeBanner from './HomeBanner';
import SGSay from './SGHomeSGSay';
import FlashSale from './SGHomeFlashSale';
import HomeFavBanner from './SGHomeFavBanner';
import HomeTopFeature from './SGHomeTopFeature';
import MenuGroup from './MenuGroup';
import {IHomesInterface, ICommonstate} from './HomeInterface';
import {addPosition, fetchPosition, ITop} from '../../dvaModel/homeModel';
import {DefaultMenuData} from './DefaultData/index';
import Announcement from './Announcement';
import {width} from '../../utils/index';
import HomePicPortal from './HomePicPortal';

const HomeListHeader: React.SFC<IHomesInterface & ITop> = (props) => {
    return (
        <View style={{width: '100%', backgroundColor: '#f4f4f4'}}>
            <HomeBanner
                dataSource={props.topBannerList}
                height={0.544*width}
            />
            {/* {/* 功能按钮模块模块 */}
                <MenuGroup  {...props.middleImageConfig} {...props.iconConfig} navigation={props.navigation}/>
            {/* 顺逛公告模块 */}
                <Announcement {...props.msgCenter} navigation={props.navigation}/>
            {/* 四个图片按钮视图模块 */}
                <HomePicPortal {...props}/>
            {/* 限时抢购 */}
            {/*
        <FlashSale navigation={props.navigation} CommissionNotice = {props.CommissionNotice} {...props.flashSales} isHost={props.isHost}/>
*/}
                <FlashSale from={1} {...props}/>

            {/* 逛客怎么说模块 */}
                <SGSay dataSource={props.midCommList} navigation={props.navigation}/>
            {/* 优惠推荐模块 */}
            {global.IS_NOTNIL(props.midActivtyList) && props.midActivtyList.length > 0 && <HomeFavBanner
                dataSource={props.midActivtyList}
                navigation={props.navigation}/>}
            {/* 主题特色模块 */}
                <HomeTopFeature
                midBannerList={props.midBannerList}
                crowdFunding={props.crowdFunding}
                navigation={props.navigation}/>
                </View>);
            };

            export default HomeListHeader;
