import * as React from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    ImageBackground,
    View, ScrollView,
    TouchableOpacity, Modal,FlatList
} from 'react-native';


import { createAction,connect } from '../../../../utils';
import { ICustomContain ,INavigation} from '../../../../interface/index';
import ScreenUtil from '../../../Home/SGScreenUtil';
import Color from '../../../../consts/Color';
import { goGoodsDetail } from '../../../../utils/tools';

import URL from './../../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

const mapStateToProps =(
    {LocalSpecialtyModel:{linkNavData,linkData},
    users: {mid: storeId, isLogin, isHost, CommissionNotice}
    }
     )=>(
         {linkNavData,linkData,isLogin, isHost, CommissionNotice}
        );

@connect(mapStateToProps)
class LinkNav extends React.Component<INavigation&ICustomContain>{
   
   constructor(props){
        super(props);
        this.state = {
            index:0
        }
   }
   componentWillMount(){
   }
   componentDidMount(){
      
   }
   public render():JSX.Element {
       console.log(this.props)
        return (
            <View style={{width,flex:1,}}>
              {/* 猜你喜欢 类目 */}
               <View style={{width,height:44,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#fff',marginTop:8,}}>
               <FlatList
                    style={{width:width,}}
                    data={this.props.linkNavData}
                    horizontal
                    keyExtractor={(item,index) => item}
                    showsHorizontalScrollIndicator={false}
                    renderItem={(item)=>{
                        return (
                            <TouchableOpacity key={item.index}  onPress={()=>{
                                this.setState({index:item.index});
                                 this.props.dispatch(createAction('LocalSpecialtyModel/getLinkArr')({
                                     cId: item.item.cId
                                 }))
                            }}>
                               <Text style={[{textAlign:'center',width:100},item.index==this.state.index?{color:'#2979FF'}:{color:'#666'}]}>{item.item.name}</Text>
                            </TouchableOpacity>
                        )
                    }}
                        />
               </View>

               {/* 猜你喜欢数据  */}
               <View>
               <FlatList
                showsVerticalScrollIndicator={false}
                horizontal={false}
                style={styles.flatListStyle}
                // 两列显示
                numColumns ={2}
                // columnWrapperStyle={{}}
                data={this.props.linkData}
                keyExtractor = {(item, index) => ('index' + index + item)}
                renderItem={({item}) => (
                        <TouchableOpacity activeOpacity={1} onPress={() => goGoodsDetail(item.pId, undefined, item.name, undefined, item.price, item.pic)}>
                          <View style={styles.item_Box}>
                              <Image style={styles.imgStyle} source={{uri: cutImgUrl(item.pic, 450, 450, true)}}/>
                              <Text numberOfLines={2}
                                    style={{marginLeft: ScreenUtil.scaleSize(8), marginTop: ScreenUtil.scaleSize(8),
                                            fontSize: ScreenUtil.scaleText(13), lineHeight: ScreenUtil.scaleText(15),
                                            alignSelf: 'flex-start'}}>{item.name}</Text>
                              <View style={styles.bottom_Box}>
                                <View style={styles.price_styleBox}>
                                  <Text numberOfLines={1}
                                        style={{fontSize: ScreenUtil.scaleText(15), color: Color.ORANGE_1}}>
                                        {'￥' + item.price}</Text>
                                </View>
                                {(this.props.isHost > 0 && this.props.CommissionNotice) ? (
                                  <View style={styles.price_styleBox}>
                                    <View style={styles.zhuan_Box}>
                                      <Text style={styles.zhuan_Text}>赚</Text>
                                    </View>
                                    <Text style={{fontSize: ScreenUtil.scaleText(15), color: Color.ORANGE_1}}>￥{item.comm}</Text>
                                  </View>)
                                    : 
                                  null
                                  }
                              </View>
                          </View>
                        </TouchableOpacity>
                )}
               // ListHeaderComponent={() =>  <SectionTitle title='猜你喜欢' color={Color.BLACK} backgroundColor={Color.WHITE} hasTitle={false}/>}
                getItemLayout={(data, index) => (
                    // 193 是被渲染 item 的高度 ITEM_HEIGHT。
                  {length: ScreenUtil.scaleSize(266), offset: (ScreenUtil.scaleSize(266 + 10)) * index, index}
                )}
              />
               </View>
            </View>
        )
   }


}

const styles = StyleSheet.create({
    flatListStyle: {
        flexDirection: 'column',  // 子元素垂直布局
        width: '100%',
        backgroundColor: '#f4f4f4',
        paddingBottom: ScreenUtil.scaleSize(10),
      },
      item_Box: {
        width: 173 * ScreenUtil.ScaleX,
        height: 241 * ScreenUtil.ScaleX,
        flexDirection: 'column',  // 子元素垂直布局
        alignItems: 'center',  // 使元素垂直居中排布, 当flexDirection为column时, 为水平居中
        marginLeft: ScreenUtil.scaleSize(10),
        marginTop: ScreenUtil.scaleSize(10),
        backgroundColor: '#FFFFFF',
        // borderStyle: 'solid',     // 不设置边框类型在7Pluse有bug
        // borderWidth: 1,
        // borderColor: 'rgba(228, 228, 228, 0.5)',
      },
      imgStyle: {
        width: 171 * ScreenUtil.ScaleX,
        height: 171 * ScreenUtil.ScaleX,
      },
      bottom_Box: {
        marginTop: ScreenUtil.scaleSize(6),
        marginLeft: ScreenUtil.scaleSize(8),
        marginRight: ScreenUtil.scaleSize(2),
        marginBottom: ScreenUtil.scaleSize(4),
        flexDirection: 'row',  // 子元素水平布局
        flexWrap: 'wrap' ,  // 允许换行
        width: '100%',
        backgroundColor: 'transparent',
      },
      price_styleBox: {
        height: ScreenUtil.scaleSize(20),
        width: '50%',
        flexDirection: 'row',  // 子元素水平排布(默认垂直排布)
        alignItems: 'center',
        backgroundColor: 'transparent',
      },
      zhuan_Box: {
        alignItems: 'center',
        justifyContent: 'center',
        width: ScreenUtil.scaleSize(18),
        height: ScreenUtil.scaleSize(18),
        borderRadius: ScreenUtil.scaleSize(9),
        backgroundColor: Color.ORANGE_1,
        marginRight: 4,
      },
      zhuan_Text: {
        color: Color.WHITE,
        textAlign: 'center',
        fontSize: ScreenUtil.scaleText(11),
      },
});

export default LinkNav;