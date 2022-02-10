

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    ImageBackground,
    View, ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,DeviceEventEmitter,
} from 'react-native';

import { connect } from 'react-redux';
const Sip = StyleSheet.hairlineWidth;
import EStyleSheet from 'react-native-extended-stylesheet';
import { isiPhoneX, IS_NOTNIL } from '../../../../utils';
import URL from '../../../../config/url';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
import { GET, POST_JSON, GET_P, POST_FORM} from '../../../../config/Http';
import { toFloat } from '../../../../utils/MathTools';
import { Toast } from 'antd-mobile';

import Button from 'rn-custom-btn1';
import { UltimateListView } from 'rn-listview';

import ic_select from './../../../../images/ic_select.png';
import ic_check from './../../../../images/ic_check.png';
import closeBtnGray from './../../../../images/closeBtnGray.png';
import barline from './../../../../images/barline.png';
import nodata from './../../../../images/nodata.png';
import Orientation from 'react-native-orientation';

import { getCurrentScreen } from './../../../../dvaModel/navigationHelper';


const backImgSize = {
    width: height,
    height: width,
};
@connect(({address, users, router}) => ({ ...address, ...users, router}))
export default class ScenePage extends Component {
      componentWillMount() {

      }

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            scenesData: [],
            ScenesTagData: null,
            productoData: null,
            menuData: [],
            selectedMenuIndex: 0,
            selectedImageUrl: null,
            selectedIntroduction: null,
            SelectedProductsIds: null,
            spaceId: null,
            // 商品
            modal1: false,
            tag: null,
            // 场景介绍
            modal2: false,
            // 商品列表
            modal3: false,

            all: true,


            selected: false,
            selectAll: false,
            footerTitle: '已选商品: 0件',
            seletedRows: [],
            listData: [],
            totalPrice: 0.00,
            totalCommosion: 0.00,
        };
          this.listView;
          this.selectAll = this.selectAll.bind(this);
          this.calculateTotalPrice = this.calculateTotalPrice.bind(this);
          this.selectAction = this.selectAction.bind(this);
          this.renderItem = this.renderItem.bind(this);
          this.toOrder = this.toOrder.bind(this);
          this.updateData = this.updateData.bind(this);
      }

    componentDidMount() {
        // console.log('-------componentDidMount----智家场景-----');
        this.getScenesData();
    }

    componentWillUnmount() {
    }

    updateData = (listData)=> {
          if(this.state.all){
              this.listView.updateDataSource(listData);
              this.selectAll(false);
              this.setState({all: false});
              this.calculateTotalPrice();
          }else {
              this.listView.updateDataSource(listData);
              this.calculateTotalPrice();
          }
    };
    selectAll = (selected) => {
        // this.setState({ seletedRows: selected ? [] : this.state.listData.map(({ id, skku}) => id + skku) }
        this.setState({ seletedRows: selected ? [] : this.state.listData.map(({ id}, index) => id + "key" + index) }
            , () => {
                this.updateData(this.state.listData);
            });
    };
    selectAction = (selected, productId, skku = 0, oindex) => {
        const seletedRows = this.state.seletedRows;
        // const index = seletedRows.indexOf(productId + skku);
        // const index = seletedRows.indexOf(productId);
        const index = seletedRows.indexOf(productId + "key" + oindex);
        if (selected) {
            index !== -1 && seletedRows.splice(index, 1);
        } else {
            // index === -1 && seletedRows.push(productId + skku);
            // index === -1 && seletedRows.push(productId);
            index === -1 && seletedRows.push(productId + "key" + oindex);
        }
        this.setState({ seletedRows }, () => this.calculateTotalPrice());
    };
    calculateTotalPrice = () => {

        const data = this.state.listData;
        const selectedRows = this.state.seletedRows;
        let sum = 0.00;
        let csum = 0.00;
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const index = selectedRows.indexOf(item.id + "key" + i);
            sum += (index > -1 ? Number(item.price) * Number(1) : 0.00);
            csum += (index > -1 ? Number(item.commission) * Number(1) : 0.00);
        }
        this.setState({
            totalPrice: sum, // 总价
            totalCommosion: csum, // 佣金
            footerTitle: `${selectedRows.length}`,
        });
    };
    toOrder = () => {
        const { seletedRows, listData } = this.state;
        if (!dvaStore.getState().users.isLogin) {
            return this.props.navigation.navigate('Login');
        }
        if (listData.length <= 0) {
            Toast.info('当前成套清单没有产品,不能下单!', 2);
            return;
        }
        if (seletedRows.length <= 0) {
            Toast.info('您还没有选择产品', 2);
            return;
        }

        // 调转到订单填写页面所需参数  yl
        let orderInitParams = {
            "proList": [],
            "street": ''
        };
        for (let i = 0; i < listData.length; i++) {
            const item = listData[i];
            if (seletedRows.indexOf(item.id + "key" + i) !== -1) {
                orderInitParams.proList.push({
                    "proId": item.id,
                    "num": 1
                })
            }
        }
        let payload = {
            orderInitParams
        };
        this.props.dispatch({
            type: 'order/putPageInfo',
            payload
        });

    };

    renderItem = (item, index)=>{
        return <View key={index} style={[styles.row, {height: 104, backgroundColor: '#fff'}]}>
            <View style={[styles.allCenter, {width: 48}]}>
                <Button
                    style={styles.selectedBtn}
                    image={this.state.seletedRows.indexOf(item.id + "key" + index) !== -1 ? ic_select : ic_check}
                    // image={this.state.seletedRows.indexOf(item.id + item.skku) !== -1 ? ic_select : ic_check}
                    imageStyle={styles.selectedImg}
                    onPress={() => {
                        // this.selectAction((this.state.seletedRows.indexOf(item.id + item.skku) !== -1), item.id, item.skku);
                        this.selectAction((this.state.seletedRows.indexOf(item.id + "key" + index) !== -1), item.id, null, index);
                    }}
                />
            </View>
            <TouchableOpacity activeOpacity={0.9}  onPress={()=>{
                this.props.navigation.navigate('GoodsDetail', {
                    productId: item.id,
                    productFullName: item.name,
                    swiperImg: item.imageUrl,
                    price: item.price
                });

            }}>
                <View style={[styles.row, styles.aCenter, {height: 104, width: SWidth-48, borderBottomWidth: Sip, borderBottomColor: '#E4E4E4'}]}>

                    <ImageBackground style={{height: 80, width: 80}} source={{uri: cutImgUrl(item.imageUrl || '', 200, 200, true)}}>
                        {!item.stock && <View style={[styles.allCenter, {position: 'absolute', left: 0, right: 0, bottom: 0, height: 16, backgroundColor: 'rgba(41,121,255,0.7)'}]}>
                            <Text style={{color: '#fff', fontSize: 10}}>无货  可预定</Text>
                        </View>}
                    </ImageBackground>

                    <View style={[{marginLeft: 10, width: SWidth - 153, height: 80}]}>
                        <Text style={{fontSize: 14, color:'#333', maxWidth: SWidth - 153, lineHeight: 20}} numberOfLines={1}>{item.name || ''}</Text>
                        <Text style={{fontSize: 14, color:'#666', maxWidth: SWidth - 153, lineHeight: 20}} numberOfLines={1}>{item.title || ''}</Text>
                        <View style={[styles.row, styles.jCenter, {position: 'absolute', bottom: 0, height: 18}]}>
                            <Text style={{fontSize:10, color: '#FF6026', lineHeight: 20, alignSelf: 'flex-end'}}>¥<Text style={{fontSize:14}}>{item.price ? Number(item.price).toFixed(2): '0.00'}</Text></Text>
                            {this.props.isHost > 0 && this.props.CommissionNotice && <View style={[styles.allCenter, {
                                height: 18,
                                width: 18,
                                backgroundColor: '#FF6026',
                                borderRadius: 9,
                                marginHorizontal: 8
                            }]}>
                                <Text style={{color: '#fff', fontSize: 10}}>赚</Text>
                            </View>}
                            {this.props.isHost > 0 && this.props.CommissionNotice &&  <Text style={{fontSize:10, color: '#FF6026', lineHeight: 20, alignSelf: 'flex-end'}}>
                                ¥<Text style={{fontSize:14}}>{item.commission ? Number(item.commission).toFixed(2): "0.00"}</Text>
                            </Text>}
                        </View>
                        <Text style={{lineHeight: 17, fontSize: 12, color:'#666', position: 'absolute', right: 0, bottom:0}}>x1</Text>

                    </View>
                </View>
            </TouchableOpacity>
        </View>
    };
    onFetch = async (page = 1, startFetch, abortFetch)=>{abortFetch();};

    render() {
        return (
            <View style={[styles.container ]}>
            {
                (this.state.scenesData.length > 0 && this.state.menuData.length > 0) ? <View style={[styles.container ]}>
                    {
                        IS_NOTNIL(this.state.selectedImageUrl) ?
                        <ImageBackground source={{uri: this.state.selectedImageUrl}} resizeMode={'stretch'}
                            style={{width: backImgSize.width,height: backImgSize.height}}>
                                {   IS_NOTNIL(this.state.ScenesTagData) &&
                                    this.state.ScenesTagData.map((item, index) =>
                                        {
                                            if(item.direction === 0){
                                                // 文字在左边
                                                return (
                                                        // 左展示tag标签
                                                        <View style={[styles.tagLeftCon,{top: (backImgSize.height * item.y - (7 + 5)),left: (backImgSize.width * item.x - (item.name.length * 8 + 2 * 5 + 20 + 8))}]}>
                                                            <TouchableWithoutFeedback
                                                                onPress={() => {
                                                                    // 显示modal1

                                                                    // 请求商品数据,请求成功后,显示modal1
                                                                    this.getOneProductofTag(item.productId);
                                                                }}>
                                                                <View style={styles.tagTextCon}>
                                                                    <Text style={styles.tagTextSty}>{item.name}</Text>
                                                                </View>
                                                            </TouchableWithoutFeedback>
                                                            {/* 线条 */}
                                                            <View style={styles.tagLine}></View>
                                                            {/* 圆心 */}
                                                            <View style={styles.yuanxin}></View>
                                                        </View>
                                                );
                                            } else {
                                                // 文字在左边
                                                return (
                                                    // 右展示tag标签
                                                    <View style={[styles.tagRightCon,{ top: (backImgSize.height * item.y - (7 + 5)),left: backImgSize.width * item.x - 4}]}>
                                                        {/* 圆心 */}
                                                        <View style={styles.yuanxin}></View>
                                                        <View style={styles.tagLine}></View>
                                                        <TouchableWithoutFeedback
                                                            onPress={() => {
                                                                // 显示modal1
                                                                this.setState({
                                                                    modal1: true,
                                                                });
                                                                // 请求商品数据,请求成功后,显示modal1
                                                                this.getOneProductofTag(item.productId);
                                                                }}>
                                                            <View style={styles.tagTextCon}>
                                                                <Text style={styles.tagTextSty}>{item.name}</Text>
                                                            </View>
                                                        </TouchableWithoutFeedback>
                                                    </View>
                                                );
                                            }                                   
                                        }
                                        )
                                }
                        </ImageBackground>:<View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
                        <Image style={{height: 97, width: 124}} source={nodata}/>
                        <Text style={{color: '#999', fontSize: 14, marginTop: 12}}>暂无图片数据</Text>
                        </View>
                    }

                    {/* menu切换菜单 */}
                    <View style={styles.menuContainer}>
                        {
                            this.state.menuData.length >0 &&
                            this.state.menuData.map((item, index) =>
                                        (
                                        <TouchableOpacity activeOpacity={0.9}  
                                            key={index}
                                            opacity={0.8} 
                                            onPress={() => {
                                                const imageUrl = item.imageUrl;
                                                const introduction = item.introduction;
                                                const spaceId = item.id;
                                                this.setState({
                                                        selectedMenuIndex: index,
                                                        selectedImageUrl: imageUrl,
                                                        selectedIntroduction: introduction,
                                                        spaceId: spaceId,
                                                }, () => {
                                                    // 从新获取tag数据
                                                    this.getScenesTagData();
                                                });
                                                }}>
                                            <View style={this.state.selectedMenuIndex === index ? styles.menuBtnConSelected : styles.menuBtnCon}>
                                                <Text style={this.state.selectedMenuIndex === index ? styles.menuTextSelected : styles.menuText}
                                                      numberOfLines={1}>{item.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        ),
                                        )
                        }
                    </View>
                    {/* 商品/场景按钮 */}
                    <View style={styles.bottomBtnCon}>
                        <TouchableOpacity activeOpacity={0.9}  opacity={0.8} onPress={() => {
                            if(!IS_NOTNIL(this.state.SelectedProductsIds)){
                                Toast.fail('此场景无商品数据可展示', 1);
                            }else {
                                // 展示右侧商品列表视图
                                this.setState({modal3: true})
                                // 请求右侧商品列表数据
                                this.getProductofTagData(this.state.SelectedProductsIds);
                            }
                            
                            }}>
                            <Image style={styles.productBtn} source={require('../../../../images/qdh.png')}/> 
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.9}  opacity={0.8} onPress={() => {
                                this.setState({
                                    modal2: true,
                                  });
                            }}>
                            <Image style={styles.sceneIntroduce} source={require('../../../../images/cjjs.png')}/> 
                        </TouchableOpacity>
                    </View>
                </View>:<View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
                    <Image style={{height: 97, width: 124}} source={nodata}/>
                    <Text style={{color: '#999', fontSize: 14, marginTop: 12}}>暂无数据</Text>
                </View>
            }

            {/* tag商品Modal */}
            {  this.state.modal1 &&
                <View style={styles.tagModal1}>
                    <TouchableOpacity activeOpacity={0.9}  style={{flex: 1,alignItems: 'center', justifyContent: 'center'}} onPress={()=>{
                        this.setState({modal1: false})
                    }}>
                        <View style={styles.tagInfo}>
                        { 
                            IS_NOTNIL(this.state.tag) && <TouchableOpacity activeOpacity={0.9}  style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}
                                onPress={()=>{
                                    this.props.navigation.navigate('GoodsDetail', { 
                                        productId: this.state.tag.id
                                    });
                                }}>
                                {/* 右上角关闭按钮模块 */}
                                <View style={styles.productCloseCon}>
                                    <TouchableOpacity activeOpacity={0.9}  opacity={0.8} onPress={() => {
                                            // 隐藏modal2
                                            this.setState({modal1: false})
                                        }}>
                                        <Image style={styles.closeBtnImg} source={require('../../../../images/closeBtnGray.png')}/> 
                                    </TouchableOpacity>
                                </View>
                                {/* 商品图 */}
                                <Image 
                                    style={styles.productImg}
                                    source={{uri: cutImgUrl(this.state.tag.imageUrl || '', 200, 200, true)}}/>
                                {/* 商品信息 */}
                                <View style={styles.productInfo}>
                                    <Text numberOfLines={1} style={styles.productName}>{this.state.tag.name || ''}</Text>
                                    <Text numberOfLines={1} style={styles.productTitle}>{this.state.tag.title || ''}</Text>
                                    {/* 价钱与佣金 */}
                                    <View style={styles.commissionCon}>
                                        <Text style={styles.priceStyle}>{'¥' + toFloat(this.state.tag.price)}</Text>
                                        {
                                            IS_NOTNIL(this.state.tag.commission) && this.props.isHost > 0 && this.props.CommissionNotice && <View style={styles.zhuanContainer}>
                                                <View style={styles.zhuanView}>
                                                <Text style={styles.zhuanText}>赚</Text>
                                                </View> 
                                                <Text style={styles.zhuanPrice}>{'¥' + toFloat(this.state.tag.commission)}</Text>
                                            </View>
                                        }
                                    </View>
                                </View>
                            </TouchableOpacity>
                        }
                        </View>
                    </TouchableOpacity>
                </View>
            }

            {/* 场景介绍Modal */}
            {
                this.state.modal2 &&
                <View style={styles.modal2Sty}>
                    <TouchableOpacity activeOpacity={0.9}  style={{flex: 1}} onPress={()=>{
                        // 隐藏modal2
                        this.setState({modal2: false})
                    }}/>
                    <View style={[styles.sceneInfo]}>
                    {/* 关闭按钮模块 */}
                    <View style={styles.closeCon}>
                        <TouchableOpacity activeOpacity={0.9}  opacity={0.8} onPress={() => {
                                // 隐藏modal2
                                this.setState({modal2: false})
                            }}>
                            <Image style={styles.closeBtnImg} source={require('../../../../images/closeBtnWhite.png')}/> 
                        </TouchableOpacity>
                    </View>
                    {/* 文字模块 */}
                        <ScrollView style={styles.sceneInfoScroll} contentContainerStyle={styles.scrollContentCon}>
                            <Text 
                                style={styles.sceneInfoTextSty}
                                numberOfLines={0}
                                >
                                {IS_NOTNIL(this.state.selectedIntroduction) ? this.state.selectedIntroduction : '暂无此场景页介绍'}
                                </Text>
                        </ScrollView>
                    </View>
                </View>
            }

                {/* 返回叉号 */}
                    <View style={[styles.closeCon]}>
                        <TouchableOpacity activeOpacity={0.9}  opacity={0.8} onPress={() => {
                            // 回到上一个界面

                            this.props.navigation.goBack();
                        }}>
                            <View style={{height: 40, width: 40, backgroundColor: 'rgba(49, 49, 49, 0.5)', borderRadius: 22, alignItems: 'center', justifyContent: 'center'}}>
                            <Image style={styles.closeBtnImg} source={require('../../../../images/closeBtnWhite.png')}/>
                            </View>
                        </TouchableOpacity>
                    </View>


            {/* 左下角商品按钮Modal */}
            {  this.state.modal3 &&
                <View style={styles.tagModal3}>
                    <TouchableOpacity activeOpacity={0.9}  opacity={0.1} style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}} onPress={()=>{
                        this.setState({modal3: false})
                    }} />
                        <View style={[styles.productListCon]}>
                            <View style={[{height: 44, justifyContent: 'space-between',  borderBottomColor: '#E4E4E4', borderBottomWidth: Sip}, styles.row]}>
                                <View style={[styles.row, styles.aCenter, {height: 44, marginLeft: 10}]}>
                                    <Button
                                        style={styles.selectedBtn}
                                        image={this.state.seletedRows.length === this.state.listData.length ?  ic_select : ic_check}
                                        imageStyle={styles.selectedImg}
                                        onPress={() => {
                                            this.selectAll(this.state.seletedRows.length === this.state.listData.length);
                                        }}
                                    />
                                    <Text style={{fontSize:14,color: '#999', lineHeight:20, marginLeft: 10}}>{this.state.seletedRows.length === this.state.listData.length ? "全套":`已选${this.state.seletedRows.length}`}</Text>
                                </View>
                                <TouchableOpacity activeOpacity={0.9}  opacity={0.8} style={[{height: 44, width: 44}, styles.allCenter]} onPress={() => {
                                 this.setState({modal3: false});
                                }}>
                                    <Image style={styles.closeBtnImg} source={closeBtnGray}/>
                                </TouchableOpacity>
                            </View>
                            <UltimateListView
                                style={{ flex: 1}}
                                item={this.renderItem}
                                ref={(ref) => this.listView = ref}
                                keyExtractor={(item, index) => `keys${index}`}
                                onFetch={this.onFetch}
                                footer={()=>{return <View style={{height: 10}}/>}}
                                refreshableMode={Platform.OS === 'ios' ? 'advanced' : 'basic'} // basic or advanced
                            />
                            <View style={[{height: 48, borderTopColor: '#E4E4E4', borderTopWidth: Sip}, styles.row]}>
                                <View style={[styles.row, styles.aCenter, {height: 48, marginLeft: 10, flex: 1}]}>
                                        <Text style={{fontSize:12, color: '#999', lineHeight:17}}>总计:<Text style={{fontSize:16,color: '#FF6026', lineHeight:22}}>{`￥${this.state.totalPrice.toFixed(2)}`}</Text></Text>
                                    {this.props.isHost > 0 && this.props.CommissionNotice && <Text style={{fontSize:12, color: '#999', lineHeight:17, marginLeft: 8}}>佣金:<Text style={{fontSize:12,color: '#FF6026', lineHeight:17}}>{`￥${this.state.totalCommosion.toFixed(2)}`}</Text></Text>}
                                </View>
                                <TouchableOpacity activeOpacity={0.9}  opacity={0.8} style={[{height: 48, width: 110}, styles.allCenter]} onPress={() => {
                                    this.toOrder();
                                }}>
                                    <View style={[styles.allCenter, {height: 48, width: 110, backgroundColor: '#2979FF'}]}>
                                        <Text style={{fontSize:14,color: '#fff', lineHeight:20}}>一键下单</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                </View>
            }

            </View>
        );
    }
    // 请求Scenes数据
    getScenesData =  async () => {
        try {
            const { params } = this.props.navigation.state;
            const json = await GET(URL.ZHSCENE, {
                channel: 1,
                scenesId: params.scenesId,
            });
            if (json.success) {
                const menuData = json.data[0];
                const imageUrl = IS_NOTNIL(menuData) && IS_NOTNIL(menuData.spaces) && IS_NOTNIL(menuData.spaces[0]) && IS_NOTNIL(menuData.spaces[0].imageUrl) ? menuData.spaces[0].imageUrl : '';
                const introduction = IS_NOTNIL(menuData) && IS_NOTNIL(menuData.spaces) && IS_NOTNIL(menuData.spaces[0]) && IS_NOTNIL(menuData.spaces[0].imageUrl) ? menuData.spaces[0].introduction : '';
                const spaceId = IS_NOTNIL(menuData) && IS_NOTNIL(menuData.spaces) && IS_NOTNIL(menuData.spaces[0]) && IS_NOTNIL(menuData.spaces[0].imageUrl) ? menuData.spaces[0].id : '';
                this.setState({
                        scenesData: json.data,
                        spaceId: spaceId,
                        menuData: menuData.spaces,
                        selectedImageUrl: imageUrl,
                        selectedIntroduction: introduction,
                        },() =>{
                            // 初始化获取打点数据
                    if(json.data.length > 0){
                        this.getScenesTagData();
                    }
                        });
            } else {
                Toast.fail(json.message, 1);
            }
        } catch (err) {
            Log(err);
        }
    }
    // 请求ScenesTag打点数据需要在获取Scenes数据之后
    getScenesTagData =  async () => {
        try {
            const json = await GET(URL.SPACE, {
                spaceId: this.state.spaceId,
            });
            // console.log('zhaoxincheng>>ScenesTag>>', json);
            if (json.success) {
                this.setState({
                        ScenesTagData: json.data.labels.concat(),
                        SelectedProductsIds: json.data.productsIds,
                        });
            } else {
                Toast.fail(json.message, 1);
            }
        } catch (err) {
            Log(err);
        }
    }
    // 获取选中的tag对应的商品id的商品信息/获取右侧商品列表信息
    getProductofTagData =  async (productId) => {
        try {
            const streetId = this.props.streetId;
            const cityId = this.props.cityId;
            const provinceId = this.props.provinceId;
            const regionId = this.props.areaId;
            const memberId = this.props.mid;
            const json = await GET(URL.get_ctjj_products_list, {
                cityId: cityId,
                memberId: memberId,
                productsIds: productId + '',
                provinceId: provinceId,
                regionId: regionId,
                streetId: streetId,
            });
            console.log('zhaoxincheng>>ProductofTagData>>', json);
            if (json.success) {
                // 去除商品数据
                this.setState({
                            productoData: json.data.concat(),
                            listData: json.data.concat(),
                        });
                this.setState({all: true}, ()=>{
                    this.updateData(json.data.concat());
                });
            } else {
                Toast.fail(json.message, 1);
            }
        } catch (err) {
            Log(err);
        }
    };
    getOneProductofTag =  async (productId) => {
        try {
            const streetId = this.props.streetId;
            const cityId = this.props.cityId;
            const provinceId = this.props.provinceId;
            const regionId = this.props.areaId;
            const memberId = this.props.mid;
            const json = await GET(URL.get_ctjj_products_list, {
                cityId: cityId,
                memberId: memberId,
                productsIds: productId + '',
                provinceId: provinceId,
                regionId: regionId,
                streetId: streetId,
            });
            if (json.success) {
                // 去除商品数据
                    this.setState({
                        tag: json.data[0]
                    },()=>{
                        this.setState({
                            modal1: true
                        });
                    });
            } else {
                Toast.fail(json.message, 1);
            }
        } catch (err) {
            Log(err);
        }
    };
}

const styles = EStyleSheet.create({
    container: {
      position: 'absolute',
        top:0,
        right: 0,
      width:height,
      height:width,
        backgroundColor: '#fff'
    },
    tagLeftCon: {
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 2,
        position: 'absolute', 
    },
    tagRightCon: {
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 2,
        position: 'absolute',
    },
    tagTextCon: {
        padding: 5,
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.70)',
    },
    tagTextSty: {
        fontSize: 8,
        color: 'white',
        lineHeight: 14,
    },
    tagLine: {
        width: 20,
        height: 1,
        backgroundColor: 'white',
    },
    yuanxin: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'white',
    },
    closeCon: {
        position: 'absolute',
        zIndex: 2,
        top: 10,
        right: 50,
    },
    productCloseCon: {
        position: 'absolute',
        zIndex: 2,
        top: 10,
        right: 10,
    },
    closeBtnImg: {
        width: '30rem',
        height: '30rem',
    },
    menuContainer: {
        position: 'absolute',
        zIndex: 2,
        top: 44,
        left: isiPhoneX ? (44 + 22) : 22,
        alignItems: 'center',
        opacity: 0.8,
    },
    menuBtnCon: {
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: 'white',
        width: 100,
        height: 28
    },
    menuBtnConSelected: {
        backgroundColor: '#2979FF',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: 'white',
        width: 100,
        height: 28
    },
    menuText: {
        color: '#666666',
        fontSize: '13rem',
        lineHeight: '19rem',
        maxWidth: 80
    },
    menuTextSelected: {
        color: '#FFFFFF',
        fontSize: '13rem',
        lineHeight: '19rem',
        maxWidth: 80
    },
    bottomBtnCon: {
        position: 'absolute',
        zIndex: 2,
        bottom: 22,
        left: isiPhoneX ? (44 + 22) : 22,
        flexDirection: 'row',
        alignItems: 'center',
    },
    productBtn: {
        width: '44rem',
        height: '44rem',
        marginRight: 6,
    },
    sceneIntroduce: {
        width: '44rem',
        height: '44rem',
    },
    tagModal1: {
        width: height,
        height: width,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 3,
        backgroundColor:'rgba(0,0,0,0.3)',
    },
    tagInfo: {
        width: '375rem',
        height: '130rem',
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    productImg: {
        width: '80rem',
        height: '80rem',
        marginLeft: 16,
    },
    productInfo: {
        width: '221rem',
        marginLeft: 16,
        marginRight: 42,
    },
    productName: {
        color: '#333333',
        fontSize: 16,
        lineHeight: 22,
    },
    productTitle: {
        color: '#666666',
        fontSize: 14,
        lineHeight: 20,
        marginTop: 1,
    },
    commissionCon: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    priceStyle: {
        fontSize: '17rem',
        color: '#FF6026',
        fontFamily: 'PingFangSC-Medium',
    },
    zhuanContainer: {
        marginLeft: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    zhuanView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 6,
        marginBottom: 6,
        width: '20rem',
        height: '20rem',
        borderRadius: 10,
        backgroundColor: '#FF6026',
    },
    zhuanText: {
        fontSize: '10rem',
        color: '#FFF',
    },
    zhuanPrice: {
        marginLeft: 3,
        fontSize: '14rem',
        color: '#FF6026',
    },
    modal2Sty: {
        width: height,
        height: width,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 3,
        backgroundColor:'rgba(0,0,0,0.3)',
    },
    sceneInfo: {
        width: height,
        height: '144rem',
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    sceneInfoScroll: {
        marginLeft: isiPhoneX ? (22 + 44) : 22,
        marginTop: 22,
        marginBottom: 22,
        marginRight: isiPhoneX ? (42 + 34) : 42,
    },
    scrollContentCon: {
        marginRight: 10
    },
    sceneInfoTextSty: {
        color: '#fff',
        fontSize: 14,
        lineHeight: 22,
        letterSpacing: 1,
        padding: 2,
    },
    tagModal3: {
        width: height,
        height: width,
        position: 'absolute',
        top: 0,
        zIndex: 3,
        left: 0,
        backgroundColor:'rgba(0,0,0,0.3)',
    },
    productListCon: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'white',
        width: isiPhoneX ? '400rem' : '375rem',
        height: width,
        paddingRight: isiPhoneX ? 34 : 0,
    },
    allCenter: {
        justifyContent: 'center', alignItems: 'center'
    },
    jCenter: {
        justifyContent: 'center'
    },
    aCenter: {
        alignItems: 'center'
    },
    row:{
        flexDirection: 'row'
    },
    selectedBtn: {
        height: 23,
        width: 22,
        // paddingLeft: 10,
        // backgroundColor: 'red',
    },
    selectedImg: {
        width: 16,
        height: 16,
    },
});
