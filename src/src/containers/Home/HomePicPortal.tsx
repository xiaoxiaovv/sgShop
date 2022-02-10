import * as React from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity, Platform,
} from 'react-native';
import { goBanner, goToSQZBS } from '../../utils/tools';
import { width, height} from '../../utils';
import L from 'lodash';
import {connect} from 'react-redux';
import {NavigationUtils} from '../../dva/utils';


@connect()
export default class HomePicPortal extends React.Component {

    public render(): JSX.Element {
        const { good, askEvery, mustBuy, wiki} = this.props;
        const data = (this.props.good && this.props.askEvery && this.props.mustBuy && this.props.wiki) ? [good, askEvery, mustBuy, wiki] : [];

        return <View style={styles.picFour_box}>
            {
                data.map((item, index) => {
                    // if (item === null || item === {} || item.id === undefined) {
                    let id = L.get(item, 'id', false);
                    let pic = L.get(item, 'pic', '');
                    // if (id) {
                    //    return null;
                    //  }
                    return (
                        <TouchableOpacity activeOpacity={1.0} key={index} onPress={() => {
                            // goBanner(item)

                            // 0 跳转社区首页
                            // 1 跳转社区顺逛学院
                            // 2 新品众筹
                            // 3 顺逛微学堂



                            if(index == 0){
                                // 跳转社群争霸赛 3期
                                goToSQZBS();
                                // this.props.dispatch(NavigationUtils.navigateAction("Community"));
                            }else if(index == 1){
                                // this.props.dispatch(NavigationUtils.navigateAction("SuperSecondView", {
                                //     url: '/html/community/business_school_win.html'
                                // }));
                                // console.log(item);
                                goBanner(item)
                            }else if(index == 2){
                                this.props.dispatch(NavigationUtils.navigateAction("CrowdFunding"));
                            }else if(index == 3){
                                this.props.dispatch(NavigationUtils.navigateAction("SuperSecondView", {
                                    url: '/html/community/business_school_win.html'
                                }));
                            }



                        }}>
                            <View style={{justifyContent: 'center', alignItems: 'center', width: width / 2}}>
                                <Image
                                    style={index === 1 || index === 3 ? [styles.picFourImage, styles.picFourImageSpecial] : styles.picFourImage}
                                    source={{ uri: cutImgUrl(pic ? pic : '', (width - 3) / 2 , (width - 3) / 3.72)}}
                                    resizeMode='contain'
                                />
                            </View>
                        </TouchableOpacity>
                    );
                })
            }
                </View>
    }
}
const styles = StyleSheet.create({
  // 功能视图模块样式结
  picFour_box: {
    flexDirection: 'row',  // 子元素水平排布(默认垂直排布)
    flexWrap: 'wrap',      // 是否换行(默认不换行)
    flex: 1,   // 作用是让宽度铺满
    backgroundColor: 'white',
    paddingTop: 4,
    paddingBottom: 4,
  },
  picFourImage: {
    marginBottom: 3,
    width: (width - 3) / 2,
    height: (width - 3) / 3.72,
  },
  picFourImageSpecial: {
    marginLeft: 3,
  },
});

