



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
    TouchableOpacity, Modal
} from 'react-native';

import { UltimateListView } from 'rn-listview';
import { connect } from 'react-redux';
import Button from 'rn-custom-btn1';
import CaseYYModle from '../../../components/CaseYYModle';

import ImageViewer from 'react-native-image-zoom-viewer';
import ScreenUtil from '../../Home/SGScreenUtil';

import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

const Sip = StyleSheet.hairlineWidth;

import ic_select from './../../../images/ic_select.png';
import ic_check from './../../../images/ic_check.png';
import ShareModle from './../../../components/ShareModle';

import yysj from './../../../images/yysj.png';
import { NavBar, SafeView } from './../../../components';
import L from "lodash";
import {ctjjService} from "../../../dva/service";
import {Toast} from "antd-mobile/lib/index";
import {createAction} from "../../../utils";


@connect(({ctjjModel, address, users}) => ({...ctjjModel, ...address, ...users}))
export default class CaseDetail extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            selected: false,
            selectAll: false,
            footerTitle: '已选商品: 0件',
            seletedRows: [],
            listData: [],
            allCount: 0.00,
            totalPrice: 0.00,
            totalCommosion: 0.00,

            first: false,

            showYYModal: false,
            title: '',
            id: '',
            memberId: '',
            showImageViewer: false,
            url: '',
            showShare: false,
            shareIcon: '',
            showMoreChoice:false,
            groupProductsList:[],
            moreList:[],
            itemMoreList:[],
            num: -1,
        };
        this.listView;
        this.onFetch = this.onFetch.bind(this);
        this.header = this.header.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.calculateTotalPrice = this.calculateTotalPrice.bind(this);
        this.selectAction = this.selectAction.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.getShareContent = this.getShareContent.bind(this);
        this.toOrder = this.toOrder.bind(this);
        this.updateData = this.updateData.bind(this);
    }
    componentWillMount() {
        // 请求头部内容 dva 操作, header 数据
        const params = this.props.navigation.state.params;
        const memberId = L.get(this.props, 'mid');
        const id = L.get(params, 'id');
        const title = L.get(params, 'title');
        this.setState({title, id, memberId});
    }
    componentDidMount() {
        // 请求头部内容 dva 操作
        this.props.dispatch({
            type: 'ctjjModel/getProgramsDetail',
            payload: {id: this.state.id},
            callback: () => {
                // 设置列表刷新
                this.setState({first: true}, ()=> this.listView.refresh());
            }
        });
    }
    updateData = (listData)=> {
        this.listView.updateDataSource(listData);
        this.calculateTotalPrice();
    };

    getShareContent = () => {
        /**
         * 分享到微信好友
         * @param command 数组
         * @param title {String} 分享标题
         * @param content {String} 分享内容
         * @param pic {String} 分享图片url
         * @param url {String} 分享内容跳转链接
         * @param type {Integer} 分享类型 0 链接分享 1 多图分享（目前仅支持微信和微博，且无成功回调） 2 单图分享
         * 回调Promises
         */
        const { programDetail, mid } = this.props;
        const title = this.state.title;
        const content = this.state.title;
        const pic = L.get(programDetail, "imageUrl", '');
        const url = `${URL.get_ctjj_share_itsolutedetail}${this.state.id}/${mid}`;

        return [ title, content, pic, url, 0 ];
    };
    onFetch = async (page = 1, startFetch, abortFetch)=>{

        try{
            if(page === 1 && this.props.productsIds){
                const streetId = this.props.streetId;
                const cityId = this.props.cityId;
                const provinceId = this.props.provinceId;
                const regionId = this.props.areaId;
                const memberId = L.get(this.props, 'mid', '');
                const productsIds = this.props.productsIds;
                const programs = await ctjjService.getCompleteList({productsIds, streetId, provinceId, regionId, memberId, cityId});
                const success = L.get(programs, 'success', false);
                const data = L.get(programs, 'data', false);
                const groupProducts = L.get(this.props.programDetail, "groupProducts");
                var groupProductsList = [];
                var itemList = [];
                for(var i in groupProducts){
                    groupProductsList.push(groupProducts[i][0].productId);
                    itemList.push(groupProducts[i])
                }
                if(itemList && itemList.length!=0){
                    this.setState({moreList:itemList});
                }

                if(success){
                    let sum = 0.00;
                    if(data){
                        for (const item of data) {
                            sum += Number(item.price) * Number(1);
                        }
                        //var arr = [];
                        //if(data && data.length!=0){
                        // for(var i=0;i<groupProductsList.length;i++){
                        //     for(var j=0;j<data.length;j++){
                        //         if(groupProductsList[i] == data[j].id ){
                        //             arr.push(data[j]);
                        //             break;
                        //         }
                        //      }
                        //   }

                        //}
                        // if(arr && arr.length!=0){
                        //     for(var i=0;i<arr.length;i++){
                        //         arr[i].isMore  = false;
                        //         if(groupProducts[i+1].length>1){
                        //            arr[i].isMore = true;
                        //         }
                        //     }

                        // }

                        this.setState({allCount: sum});
                        var cartDatas = !data ? [] : data;
                        if(cartDatas && cartDatas.length!=0){
                            for(var i=0;i<cartDatas.length;i++){
                                cartDatas[i].isMore  = false;
                                if(itemList[i].length>1){
                                    cartDatas[i].isMore = true;
                                }
                            }
                        }

                        this.setState({ listData: cartDatas }, () => {
                            if(this.state.first) {
                                this.selectAll(false);
                            }else{
                                this.updateData(cartDatas);
                            }

                        });

                        abortFetch();
                    }else{
                        abortFetch();
                    }
                }else{
                    abortFetch();
                }
            }else{
                abortFetch();
            }
        }catch (e) {
            console.log(e);
            abortFetch();
        }

    };

    selectMoreChoice = async (index,id)=>{
        this.setState({showMoreChoice:true,num:index});
        var idList = [];
        if(this.state.moreList && this.state.moreList.length!=0){
            for(var i=0;i<this.state.moreList[index].length;i++){
                idList.push(this.state.moreList[index][i].productId)
            }
        }
        const productsIds = idList.join(',');
        const streetId = this.props.streetId;
        const cityId = this.props.cityId;
        const provinceId = this.props.provinceId;
        const regionId = this.props.areaId;
        const memberId = L.get(this.props, 'mid', '');

        const programs = await ctjjService.getCompleteList({productsIds, streetId, provinceId, regionId, memberId, cityId});
        const success = L.get(programs, 'success', false);
        const data = L.get(programs, 'data', false);
        if(success){
            if(data){

                const datas = data;
                if(datas && datas.length!=0){
                    for(var i=0;i<datas.length;i++){
                        datas[i].isChecked = false;
                        if(id == datas[i].id){
                            datas[i].isChecked = true;
                        }
                    }
                }

                this.setState({itemMoreList:datas});
            }
        }
    }

    header = ()=>{
        const { programDetail, productsIds, completeList } = this.props;
        const expert_name = L.get(programDetail, "expert.name", '');
        const expert_avatar = L.get(programDetail, "expert.avatar", '');
        const imageUrl = L.get(programDetail, "imageUrl", '');
        const introduction = L.get(programDetail, "introduction", '');
        const name = L.get(programDetail, "name", '');
        const isRecommend = L.get(programDetail, "isRecommend");


        return <View style={[styles.container]}>
            <View style={[styles.banner]}>
                <TouchableOpacity activeOpacity={0.9}  onPress={()=>{
                    this.setState({url: imageUrl || '',
                        showImageViewer: true});
                }}>
                    <Image source={{uri: cutImgUrl(imageUrl || '', 360, 360)}} style={[styles.banner]} resizeMode={'cover'}/>
                </TouchableOpacity>
            </View>
            <View style={{height: 114, backgroundColor: '#fff'}}>
                <View style={[{marginLeft: 16, marginTop: 9}]}>
                    <Text style={{color: '#333', fontSize: 16, maxWidth: SWidth - 32, marginTop: 16}} numberOfLines={1}>{name || ''}</Text>
                    <Text style={{color: '#999', fontSize: 12, maxWidth: SWidth - 32, marginTop: 9}} numberOfLines={2}>{introduction || ''}</Text>
                    <View style={[styles.row, styles.aCenter, {marginTop: 9}]}>
                        <View style={{height: 16, width: 16, borderRadius: 8}}>
                            <Image style={{height: 16, width: 16, borderRadius: 8}}
                                   source={{uri: cutImgUrl(expert_avatar || '', 80, 80)}}
                                   resizeMode={'cover'}/>
                        </View>
                        <Text style={{fontSize: 12, marginLeft: 6, color: '#999'}} numberOfLines={1}>{expert_name || ''}</Text>
                    </View>
                </View>
            </View>
            {isRecommend > 0 && <View style={[{backgroundColor: '#fff', marginTop: 4}]}>
                <View style={[styles.aCenter, styles.row,{height: 44}]}>
                    <View style={{height: 13, width: 3, backgroundColor: '#2979FF', marginLeft: 16}}/>
                    <Text style={{fontSize: 14, marginLeft: 8}}>成套清单</Text>
                </View>
                <View style={[styles.row, {height: 30, marginLeft: 15, justifyContent: 'space-between', borderBottomWidth: Sip, borderBottomColor: '#E4E4E4'}]}>
                    <View style={[styles.row, {height: 30}]}>
                        <Button
                            style={styles.selectedBtn}
                            image={this.state.seletedRows.length === this.state.listData.length ? ic_select : ic_check}
                            imageStyle={styles.selectedImg}
                            onPress={() => {
                                this.selectAll(this.state.seletedRows.length === this.state.listData.length);
                            }}
                        />
                        <Text style={{fontSize:14,color: '#333', lineHeight:20}}>全套</Text>
                    </View>
                    <Text style={{fontSize:14,color: '#333', lineHeight:20, marginRight: 16}}>商品总价：<Text style={{fontSize:16,color: '#FF6026'}}>{`￥${Number(this.state.allCount).toFixed(2)}`}</Text></Text>
                </View>
            </View>}
        </View>
    };
    selectAll = (selected) => {
        // this.setState({ seletedRows: selected ? [] : this.state.listData.map(({ id, skku}) => id + skku) }
        // this.setState({ seletedRows: selected ? [] : this.state.listData.map(({ id}) => id) }
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
    selectMoreAction = (item)=>{
        var selectList = this.state.seletedRows;
        var moreArr = this.state.itemMoreList;
        const arr = this.state.listData;
        const num = this.state.num;
        var prices = 0.00;
        var isCheckedList = '';
        if(moreArr && moreArr.length!=0){
            for(var i=0;i<moreArr.length;i++){
                moreArr[i].isChecked = false;
                if(item.id == moreArr[i].id){
                    moreArr[i].isChecked = true;

                }
                if(moreArr[i].isChecked == true){
                    isCheckedList = moreArr[i];

                }
            }
        }


        arr[num] = isCheckedList;
        arr[num].isMore=true;
        for(var i=0;i<arr.length;i++){
            prices+= Number(arr[i].price) * Number(1);
        }

        this.setState({
            itemMoreList:moreArr,
            showMoreChoice:false,
            listData:arr,
            allCount:prices,
        })


        this.selectAll(false)

    }
    calculateTotalPrice = () => {

        const data = this.state.listData;
        const selectedRows = this.state.seletedRows;
        let sum = 0.00;
        let csum = 0.00;
        // for (const item of data) {
        //     const index = selectedRows.indexOf(item.id);
        //     // const index = selectedRows.indexOf(item.id + item.skku);

        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const index = selectedRows.indexOf(item.id + "key" + i);
            sum += (index > -1 ? Number(item.price) * Number(1) : 0.00);
            csum += (index > -1 ? Number(item.commission) * Number(1) : 0.00);
        }
        this.setState({
            totalPrice: sum, // 总价
            totalCommosion: csum, // 佣金
            footerTitle: `已选商品: ${selectedRows.length}件`,
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
            payload,
        });
    };
    renderItem = (item, index)=>{

        return <View key={index} style={[styles.row, {height: 104, backgroundColor: '#fff'}]}>
            <View style={[styles.allCenter, {width: 48}]}>
                <Button
                    style={styles.selectedBtn}
                    // image={this.state.seletedRows.indexOf(item.id) !== -1 ? ic_select : ic_check}
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
                this.props.navigation.navigate('GoodsDetail',
                    {
                        productId: item.id,
                        productFullName: item.name,
                        swiperImg: item.imageUrl,
                        price: item.price,
                    });
            }}>
                <View style={[styles.row, styles.aCenter, {height: 104, width: SWidth-48, borderBottomWidth: Sip, borderBottomColor: '#E4E4E4'}]}>
                    <ImageBackground style={{height: 80, width: 80}} source={{uri: cutImgUrl(item.imageUrl || '', 200, 200, true)}}>
                        {!item.stock ? <View style={[styles.allCenter, {position: 'absolute', left: 0, right: 0, bottom: 0, height: 16, backgroundColor: 'rgba(41,121,255,0.7)'}]}>
                            <Text style={{color: '#fff', fontSize: 10}}>无货  可预定</Text>
                        </View>: null}
                    </ImageBackground>
                    <View style={[{marginLeft: 10, width: SWidth - 153, height: 80}]}>
                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                            <Text style={[item.isMore?{maxWidth: SWidth - 210}:{maxWidth: SWidth - 153},{fontSize: 14, color:'#333',  lineHeight: 20}]} numberOfLines={1}>{item.name || ''}</Text>
                            {
                                item.isMore ?
                                    <TouchableOpacity
                                        style={{borderColor:'#2979FF',borderWidth:1,}}
                                        onPress={()=>{this.selectMoreChoice(index,item.id)}}
                                    >
                                        <Text style={{fontSize: 10, color:'#2979FF',lineHeight:20,paddingLeft:4,paddingRight:4}} numberOfLines={1}>更多选择</Text>
                                    </TouchableOpacity>
                                    :
                                    null
                            }
                        </View>
                        <Text style={{fontSize: 14, color:'#666', maxWidth: SWidth - 153, lineHeight: 20}} numberOfLines={1}>{item.title || ''}</Text>
                        <View style={[styles.row, styles.jCenter, {position: 'absolute', bottom: 0, height: 18}]}>
                            <Text style={{fontSize:10, color: '#FF6026', lineHeight: 20, alignSelf: 'flex-end'}}>¥<Text style={{fontSize:14}}>{item.price ? Number(item.price).toFixed(2): '0.00'}</Text></Text>
                            {this.props.isHost > 0  && this.props.CommissionNotice && IS_NOTNIL(item.commission) && <View style={[styles.allCenter, {
                                height: 18,
                                width: 18,
                                backgroundColor: '#FF6026',
                                borderRadius: 9,
                                marginHorizontal: 8
                            }]}>
                                <Text style={{color: '#fff', fontSize: 10}}>赚</Text>
                            </View>}
                            {this.props.isHost > 0 && this.props.CommissionNotice && IS_NOTNIL(item.commission) && <Text style={{fontSize:10, color: '#FF6026', lineHeight: 20, alignSelf: 'flex-end'}}>
                                ¥<Text style={{fontSize:14}}>{IS_NOTNIL(item.commission) ? Number(item.commission).toFixed(2): "0.00"}</Text>
                            </Text>}
                        </View>
                        <Text style={{lineHeight: 17, fontSize: 12, color:'#666', position: 'absolute', right: 0, bottom:0}}>x1</Text>

                    </View>
                </View>
            </TouchableOpacity>

        </View>
    };
    render() {
        return (
            <SafeView showBottom={true}>
                <View style={[styles.container]}>
                    <NavBar title={this.state.title || 'case'} rightFun={()=>{
                        if(this.props.isLogin){
                            this.setState({showShare: true});
                        }else {
                            dvaStore.dispatch(createAction('router/apply')({
                                type: 'Navigation/NAVIGATE', routeName: 'Login',
                            }));
                        }
                    }}/>
                    <UltimateListView
                        style={{ flex: 1, marginBottom: 118 }}
                        header={this.header}
                        item={this.renderItem}
                        ref={(ref) => this.listView = ref}
                        onFetch={this.onFetch}
                        keyExtractor={(item, index) => `keys${index}`}
                        footer={()=>{return <View style={{height: 10}}/>}}
                        refreshableMode={Platform.OS === 'ios' ? 'advanced' : 'basic'} // basic or advanced
                    />

                    <View style={[{height: 118, backgroundColor: '#fff', position: 'absolute', bottom: 0, left:0, right:0}]}>
                        <View style={[styles.row, {height: 70, borderBottomColor: '#eee', borderBottomWidth:1, justifyContent: 'space-between'}]}>
                            <View>
                                <Text style={{marginLeft:15, marginTop:10, lineHeight:20}}>{this.state.footerTitle || '已选商品: 0件'}</Text>
                            </View>
                            <View style={{marginRight: 15}}>
                                <View style={[styles.row, {marginTop: 10, justifyContent: 'space-between'}]}>
                                    <Text style={{fontSize:14, color: '#333', lineHeight:20}}>已选商品总计：</Text>
                                    <Text style={{fontSize:16,color: '#FF6026', lineHeight:20}}>{`￥${Number(this.state.totalPrice).toFixed(2)}`}</Text>
                                </View>
                                {this.props.isHost > 0 && this.props.CommissionNotice && <View style={[styles.row, {marginTop: 10, justifyContent: 'space-between'}]}>
                                    <Text style={{fontSize:14, color: '#333', lineHeight:20}}>佣金总计：</Text>
                                    <Text style={{fontSize:16,color: '#FF6026', lineHeight:20}}>{`￥${Number(this.state.totalCommosion).toFixed(2)}`}</Text>
                                </View>}
                            </View>
                        </View>
                        <View style={[styles.row, {height: 48, }]}>
                            <TouchableOpacity activeOpacity={0.9}  style={{flex:1.4}} onPress={()=>{
                                this.setState({ showYYModal: true });
                            }}>
                                <View style={[styles.allCenter, styles.row, {flex:1}]}>
                                    <Image style={[{height: 15, width: 15}]} source={yysj}/>
                                    <Text style={{fontSize: 14, color: '#999', marginLeft: 7}}>预约免费设计</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.9}  style={{flex:1}} onPress={this.toOrder}>
                                <View style={[styles.allCenter,{flex:1, backgroundColor: '#2979FF'}]}>
                                    <Text style={{fontSize: 14, color: '#fff'}}>一键下单</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
                <CaseYYModle
                    visible={this.state.showYYModal}
                    onCancel={() => this.setState({ showYYModal: false })}
                    hiddenEwm={true}
                    hidingTitle={true}
                    designerId={''}
                    detailsId={this.state.id}
                    itemsId={1}
                />
                <Modal visible={this.state.showImageViewer} transparent={true}>
                    <ImageViewer
                        imageUrls={[{url: this.state.url || ''}]}
                        onClick={() => this.setState({ showImageViewer: false })}
                    />
                </Modal>

                <Modal
                    // 设置Modal组件的呈现方式
                    animationType='slide'
                    // 它决定 Modal 组件是否是透明的
                    transparent
                    // 它决定 Modal 组件何时显示、何时隐藏
                    visible={this.state.showMoreChoice}
                    // 当 Modal组件在屏幕上完成显示后，这个回调函数将被执行
                    onShow={() =>  Log('onShow')  }
                    // 这是 Android 平台独有的回调函数类型的属性
                    // 开发者必须要写一个函数来处理当 Modal 显示在界面时且android物理返回键被按下时的业务逻辑
                    onRequestClose={() => Log('onShow')}
                >

                    <View style={{width: '100%', height: '100%'}}>
                        <TouchableOpacity
                            style={{position: 'absolute', top: 0, left: 0,
                                width: '100%', height: height - ScreenUtil.scaleSize(400)}}
                            activeOpacity={0.4} onPress={() => this.setState({showMoreChoice: false})}>
                            <View style={{position: 'absolute', top: 0, left: 0, width: '100%',backgroundColor:'rgba(0,0,0,0.5)',
                                height: height - ScreenUtil.scaleSize(400)}}></View>
                        </TouchableOpacity>
                        <View style={{height: ScreenUtil.scaleSize(400), width: '100%',position:'relative',
                            backgroundColor: 'white', marginTop: height - ScreenUtil.scaleSize(400)}}>

                            <View style={{width:width,height:48,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomColor:'#eee',borderBottomWidth:1}}>
                                <Text></Text>
                                <Text style={{fontSize:18,color:'#333'}}>更多选择</Text>
                                <Button
                                    imageStyle={{width:20,height:20,}}
                                    image={require('./../../../images/close_circle_black.png')}
                                    onPress={() => this.setState({ showMoreChoice: false })}
                                />
                            </View>

                            <ScrollView>
                                <View style={{flexDirection:'column',width}}>

                                    {
                                        this.state.itemMoreList && this.state.itemMoreList.length!=0 &&
                                        this.state.itemMoreList.map((item,index)=>{
                                            return (
                                                <View key={index} style={[styles.row, {height: 104, backgroundColor: '#fff'}]}>
                                                    <View style={[styles.allCenter, {width: 48}]}>
                                                        <Button
                                                            style={styles.selectedBtn}
                                                            // image={this.state.seletedRows.indexOf(item.id) !== -1 ? ic_select : ic_check}
                                                            image={item.isChecked? ic_select : ic_check}
                                                            // image={this.state.seletedRows.indexOf(item.id + item.skku) !== -1 ? ic_select : ic_check}
                                                            imageStyle={styles.selectedImg}
                                                            onPress={() => {
                                                                this.selectMoreAction(item)
                                                                //   this.selectAction((this.state.seletedRows.indexOf(item.id + "key" + index) !== -1), item.id, null, index);
                                                            }}
                                                        />
                                                    </View>
                                                    <TouchableOpacity activeOpacity={0.9}  onPress={()=>{
                                                        this.setState({showMoreChoice:false,})
                                                        this.props.navigation.navigate('GoodsDetail',
                                                            {
                                                                productId: item.id,
                                                                productFullName: item.name,
                                                                swiperImg: item.imageUrl,
                                                                price: item.price,
                                                            });
                                                    }}>
                                                        <View style={[styles.row, styles.aCenter, {height: 104, width: SWidth-48, borderBottomWidth: Sip, borderBottomColor: '#E4E4E4'}]}>
                                                            <ImageBackground style={{height: 80, width: 80}} source={{uri: cutImgUrl(item.imageUrl || '', 200, 200, true)}}>
                                                                {!item.stock ? <View style={[styles.allCenter, {position: 'absolute', left: 0, right: 0, bottom: 0, height: 16, backgroundColor: 'rgba(41,121,255,0.7)'}]}>
                                                                    <Text style={{color: '#fff', fontSize: 10}}>无货  可预定</Text>
                                                                </View>: null}
                                                            </ImageBackground>
                                                            <View style={[{marginLeft: 10, width: SWidth - 153, height: 80}]}>
                                                                <Text style={[{fontSize: 14, color:'#333',  lineHeight: 20}]} numberOfLines={1}>{item.name || ''}</Text>
                                                                <Text style={{fontSize: 14, color:'#666', maxWidth: SWidth - 153, lineHeight: 20}} numberOfLines={1}>{item.title || ''}</Text>
                                                                <View style={[styles.row, styles.jCenter, {position: 'absolute', bottom: 0, height: 18}]}>
                                                                    <Text style={{fontSize:10, color: '#FF6026', lineHeight: 20, alignSelf: 'flex-end'}}>¥<Text style={{fontSize:14}}>{item.price ? Number(item.price).toFixed(2): '0.00'}</Text></Text>
                                                                    {this.props.isHost > 0  && this.props.CommissionNotice && IS_NOTNIL(item.commission) && <View style={[styles.allCenter, {
                                                                        height: 18,
                                                                        width: 18,
                                                                        backgroundColor: '#FF6026',
                                                                        borderRadius: 9,
                                                                        marginHorizontal: 8
                                                                    }]}>
                                                                        <Text style={{color: '#fff', fontSize: 10}}>赚</Text>
                                                                    </View>}
                                                                    {this.props.isHost > 0 && this.props.CommissionNotice && IS_NOTNIL(item.commission) && <Text style={{fontSize:10, color: '#FF6026', lineHeight: 20, alignSelf: 'flex-end'}}>
                                                                        ¥<Text style={{fontSize:14}}>{IS_NOTNIL(item.commission) ? Number(item.commission).toFixed(2): "0.00"}</Text>
                                                                    </Text>}
                                                                </View>
                                                                <Text style={{lineHeight: 17, fontSize: 12, color:'#666', position: 'absolute', right: 0, bottom:0}}>x1</Text>

                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>

                                                </View>
                                            )
                                        })
                                    }
                                    <View style={{width,height:Platform.OS =='ios'?10:114,}}></View>

                                </View>
                            </ScrollView>

                        </View>

                    </View>

                </Modal>

                <ShareModle
                    visible={this.state.showShare} content={this.getShareContent()}
                    onCancel={() => this.setState({ showShare: false })}
                    hiddenEwm
                />
            </SafeView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
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
    banner: {
        width: SWidth, height: 0.48 * SWidth
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
