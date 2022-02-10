import * as React from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    ImageBackground,
    View, ScrollView,
    TouchableOpacity, Modal
} from 'react-native';


import { createAction,connect ,px} from '../../../../utils';
import { ICustomContain ,INavigation} from '../../../../interface/index';

import HomeBanner from '../../../Home/HomeBanner'; //轮播
import SpecialtyNav from '../specialtyNav'; // 省级导航
import FlashSale from '../../../Home/SGHomeFlashSale'; //限时抢购
import NewSend from '../childrenMod/newSend';
import CrowdFunding from '../childrenMod/crowdFunding'; //众筹
import SpecialtyDrink from '../childrenMod/specialtyDrink';//特产饮品
import SpecialtyFood from '../childrenMod/specialtyFood';//特产饮品
import SGSay from '../../../Home/SGHomeSGSay'; //逛客怎么说
import LinkNav from '../childrenMod/linkNav'; //猜你喜欢类目

import URL from './../../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

const mapStateToProps =(
    {LocalSpecialtyModel:{bannerList,navList,flash,newSendList,CrowdFunding,drinkList,foodList,communityList,linkNavData,linkData,},
    users: {mid: storeId, isLogin, isHost, CommissionNotice}
    }
     )=>(
         {bannerList,navList,flash,newSendList,CrowdFunding,drinkList,foodList,communityList,linkNavData,linkData,isLogin, isHost, CommissionNotice}
        );

@connect(mapStateToProps)
class SpecialtyDetail extends React.Component<INavigation&ICustomContain>{

   constructor(props){
        super(props);
   }
   componentWillMount(){
    //   this.props.dispatch(createAction('LocalSpecialtyModel/getCharaIndex')());
    //   console.log('>>>>>>>>>>>>>>>>>>>>>>>>')
    //   console.log(this.props)
   }
   componentDidMount(){
      this.props.dispatch(createAction('LocalSpecialtyModel/getCharaIndex')());
      this.props.dispatch(createAction('LocalSpecialtyModel/getNewAndLimit')());
      this.props.dispatch(createAction('LocalSpecialtyModel/getFooterList')());
      this.props.dispatch(createAction('LocalSpecialtyModel/getLinkList')());
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>')
      console.log(this.props)
   }
   public render():JSX.Element {
        return (
            <View style={{flex:1,width,}}>
                {/* 轮播 */}
                    <HomeBanner
                        dataSource={this.props.bannerList}
                        height={0.426 * width}
                    />
                {/* 省特产馆 */}
                <SpecialtyNav
                    navigation={this.props.navigation}
                    dataSource={this.props.navList}
                />
                 {/* 限时抢购 */}
                 {
                     <FlashSale {...this.props} from={2}/>
                 }
                 {/* 新品预约 */}
                 {
                     this.props.newSendList && this.props.newSendList.length>0 &&
                     <NewSend navigation={this.props.navigation} dataSource={this.props.newSendList}/>
                 }
                 {/* 众筹 */}
                 {
                     this.props.CrowdFunding && ((this.props.CrowdFunding.zcnow && this.props.CrowdFunding.zcnow.length>0)||(this.props.CrowdFunding.zcold && this.props.CrowdFunding.zcold.length >0)||(this.props.CrowdFunding.zcpre && this.props.CrowdFunding.zcpre.length>0)) &&
                     <CrowdFunding navigation={this.props.navigation} dataSource={this.props.CrowdFunding} from={this.props.from}/>
                 }
                  {/* 特产饮品 */}
                  {
                      this.props.drinkList &&
                      <SpecialtyDrink
                          navigation={this.props.navigation}
                          dataSource={this.props.drinkList}
                      />
                  }
                  {/* 特产吃食 */}
                  {
                      this.props.foodList &&
                       <SpecialtyFood
                            navigation={this.props.navigation}
                            dataSource={this.props.foodList}
                        />
                  }
                  {/* 逛客怎么说 */}
                  {
                      this.props.communityList && this.props.communityList.bannerList && this.props.communityList.bannerList.length>0 &&
                      <SGSay
                        navigation={this.props.navigation}
                        dataSource={this.props.communityList.bannerList}
                        fromSpecial
                      />
                  }
                  {/* 猜你喜欢类目 猜你喜欢数据*/}
                  {
                       this.props.linkNavData && this.props.linkNavData.length>0 &&
                      <LinkNav
                              navigation={this.props.navigation}
                      />
                  }

            </View>
        )
   }

}

const styles = StyleSheet.create({

});

export default SpecialtyDetail;