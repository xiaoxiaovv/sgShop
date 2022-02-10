import * as React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Platform,
    StatusBar,
    PermissionsAndroid,
    BackHandler,
    StyleSheet as ES,
} from 'react-native';
import RNFS from 'react-native-fs';
import DeviceInfo from 'react-native-device-info';


const Sip = ES.hairlineWidth;
import StyleSheet from 'react-native-extended-stylesheet';
import CustomNaviBar from '../../components/customNaviBar';
import {INavigation, IProduct} from '../../interface';
import {Tabs, ActionSheet, Toast} from 'antd-mobile';
import Button from 'rn-custom-btn1';
import SelectBar from 'rn-select-bar';
import Goods from './Goods';
import GoodsBottom from './GoodsBottom';
import DetailsWeb from './Detail/DetailsWeb.js';
import Specifications from './Detail/Specifications.js';
import Evaluate from './Evaluate';
import {createAction, createIdAction, connect, isiPhoneX, cutImgUrl} from '../../utils';
import {ICustomContain, IGoods, IPreferential} from '../../interface';
import CustomAlert from '../../components/CustomAlert';
import ShareModle from '../../components/ShareModle';
import Config from 'react-native-config';
import {isLogin, getPrevRouteName} from '../../utils';
import {getAppJSON} from '../../netWork';
import URL from './../../config/url';
import {NavigationActions, NavigationUtils} from '../../dva/utils';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import L from 'lodash';

interface IGoodsDetailProps {
    productId: string;
    storeId: string;
    streetId: number | string;
    goodsShare: { shareImg: string; shareVisible: boolean };
    url: string;
    urlCanshu: string;
    hasProgram: any;
    sqzbsData: any;
    users: any;
    modelId: string;
    o2oType: string;
    loadingPF: boolean;
    stroeMsgData: [];
    params: any;
}

interface IGoodsDetailState {
    pageIndex: number;
    showDetail: boolean;
    showRemend: boolean;
    showShare: boolean;
    onPause: boolean;
    urlT: any;
    currentIndex:number;
}

const mapStateToProrps = (
    {
        goodsDetail,
        users,
    },
    {navigation: {state: {params: {productId, storeId}, key}}},
) => {
    const modelId = `${key}/${productId}`;
    return {
        modelId,
        productId,
        storeId: storeId || users.mid,
        streetId: goodsDetail.getIn([modelId, 'productInfo', 'location', 'streetId']),
        users,
        loadingPF: goodsDetail.getIn([modelId, 'uiState', 'loadingPF']),
        productFullName: goodsDetail.getIn([modelId, 'data', 'product', 'productFullName']),
        productTitle: goodsDetail.getIn([modelId, 'data', 'product', 'productTitle']),
        defaultImageUrl: goodsDetail.getIn([modelId, 'data', 'product', 'defaultImageUrl']),
        o2oType: goodsDetail.getIn([modelId, 'data', 'o2oType']),
        url: goodsDetail.getIn([modelId, 'url']),
        urlCanshu: goodsDetail.getIn([modelId, 'urlCanshu']),
        hasProgram: goodsDetail.getIn([modelId, 'hasProgram']),
        sqzbsData: goodsDetail.getIn([modelId, 'sqzbsData']),
        goodsShare: {
            shareImg: goodsDetail.getIn([modelId, 'uiState', 'goodsShare', 'shareImg']),
            shareVisible: goodsDetail.getIn([modelId, 'uiState', 'goodsShare', 'shareVisible']),
        },
        stroeMsgData: goodsDetail.getIn([modelId, 'productInfo', 'stroeMsgData']) ? goodsDetail.getIn([modelId, 'productInfo', 'stroeMsgData']).toJS() : goodsDetail.getIn([modelId, 'productInfo', 'stroeMsgData']),//硬装店铺信息
    };
};

@connect(mapStateToProrps)
class GoodsDetail extends React.Component<IGoodsDetailProps & IProduct & ICustomContain & IPreferential, IGoodsDetailState> {
    private swiper: any;
    private switchScroll: any;

    public constructor(props: IGoodsDetailProps & IProduct & ICustomContain & IPreferential) {
        super(props);
        this.state = {
            pageIndex: 0,
            showDetail: false,
            showRemend: false,
            showShare: false,
            onPause: true,
            urlT: '',
            currentIndex:0,
        };
    }

    public componentWillMount() {
        const params = this.props.navigation.state.params;
        this.props.dispatch(createIdAction('goodsDetail/loadingData')({
            ...params,
            modelId: this.props.modelId,
            storeId: this.props.storeId,
            isFirstLoad: true,
        }));
        // let pArr = L.get(global, 'pidArr', []);
        // pArr.push(this.props.productId);
        // global.pidArr = pArr;
        // console.log('------componentWillMount-----pidArr-');
        // console.log(global.pidArr);
    }

    public componentDidMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.leftAction);
        }
    }

    public componentWillUnmount() {
        this.props.dispatch(createIdAction('goodsDetail/clear')({modelId: this.props.modelId}));
        if (this.props.navigation.state.params && this.props.navigation.state.params.callBack) {
            this.props.navigation.state.params.callBack();
        }
        this.timer && clearTimeout(this.timer);
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.leftAction);
        }
    }

    private leftAction = ()=>{
        if(this.state.pageIndex === 0){
            // let pArr = L.get(global, 'pidArr', []);
            // console.log(pArr);
            // console.log('==0=========pop======productId=====');
            // pArr.pop();
            // console.log(pArr);
            // global.pidArr = pArr;
            this.goBack();
            return true;
        }else{
            // let pArr = L.get(global, 'pidArr', []);
            // console.log('----!=0 -------------------productId---');
            // console.log(pArr[pArr.length - 1], this.props.productId);
            // if(pArr[pArr.length - 1] == this.props.productId){
            //     this.scrollToIdex(0);
            // }
            this.scrollToIdex(0);
         return false;
        }
    };

    public goBack = () => {
        // if (getPrevRouteName() == 'GoodsDetail') {
        //     this.props.navigation.goBack();
        // } else {
        //     this.props.navigation.goBack();
        // }
        // console.log('---goBack----');
        // console.log(this.props.navigation);
        // this.props.navigation.goBack();
        this.props.dispatch(NavigationActions.back());
    };

    public stopVideo = () => {
        console.log('------------stopVideo-----------');
            this.setState({onPause: false}, ()=>{
                this.setState({onPause: true});
            });
    };

    public render() {
        const params = this.props.navigation.state.params;
        const {modelId, loadingPF, navigation, url, urlCanshu, hasProgram, sqzbsData, productId, storeId, streetId, users, goodsShare: {shareImg, shareVisible}, stroeMsgData} = this.props;
        const barContent = ['商品', '详情', '评价'];
        const tabsCanshu = [
            {name: '商品介绍',},
            {name: '产品参数', },
        ];
        let goodsHeight = height - (Platform.OS === 'android' ? 56 + StatusBar.currentHeight : 64) - (44 * rem);
        goodsHeight = isiPhoneX ? goodsHeight - 34 - 20 : goodsHeight;
        const command = this.getShareContent();
        return (
            <View style={styles.contain}>
                <CustomNaviBar
                    navigation={this.props.navigation} title={'商品详情'}
                    style={styles.navi}
                    leftAction={this.leftAction}
                    titleView={<SelectBar
                                style={styles.naviTitle}
                                itemWidth={70 * rem}
                                content={barContent}
                                selectedItem={barContent[this.state.pageIndex]}
                                normalTitleStyle={styles.itemText}
                                selectTitleStyle={styles.itemText}
                                selectLineStyle={styles.nvaiLine}
                                onPress={(item, index) => {
                                        this.scrollToIdex(index);
                                }}
                            />}
                    rightImage={require('../../images/share.png')}
                    rightAction={() => this.clickRight()}
                />
                <View style={{flex: 1}}>
                    <ScrollableTabView
                        page={this.state.pageIndex}
                        onChangeTab={(item) => {
                            // console.log(item);
                            let index = item.i;
                            index !== this.state.pageIndex && this.setState({pageIndex: index});
                        }}
                        renderTabBar={() => <View/>}
                    >
                        <View style={{flex: 1}} tabLabel='商品基础'>
                            <ScrollView onScrollEndDrag={(e)=>{
                                    // console.log('-------------onScrollEndDrag-------------')
                                    // alert(JSON.stringify(e.nativeEvent));
                                    // console.log(e.nativeEvent);
                                    // console.log(e.nativeEvent.contentSize.height)
                                    // console.log(e.nativeEvent.layoutMeasurement.height)
                                    // console.log(e.nativeEvent.targetContentOffset.y)
                                    // let dd = e.nativeEvent.contentSize.height - e.nativeEvent.layoutMeasurement.height;
                                    // if(Platform.OS === 'ios'){
                                    //     if(dd - e.nativeEvent.targetContentOffset.y < 0.00001){
                                    //         console.log('---------------到底了------');
                                    //         this.timer = setTimeout(() => {
                                    //             1 !== this.state.pageIndex && this.setState({pageIndex: 1});
                                    //         }, 500);
                                    //     }
                                    // }else{
                                    //     if(dd - e.nativeEvent.contentOffset.y < 0.00001){
                                    //         console.log('---------------到底了------');
                                    //         this.timer = setTimeout(() => {
                                    //             1 !== this.state.pageIndex && this.setState({pageIndex: 1});
                                    //         }, 500);
                                    //     }
                                    // }
                                }}
                            >
                            <Goods
                                params={params}
                                modelId={modelId}
                                stroeMsgData={stroeMsgData}
                                hasProgram={hasProgram}
                                navigation={navigation}
                                checkEvaluate={() => {
                                    this.scrollToIdex(2);
                                }}
                            />
                                <View style={{height: 8, backgroundColor: '#eee'}}/>
                                {/*<TouchableOpacity activeOpacity={0.9}*/}
                                    {/*onPress={()=>{*/}
                                        {/*this.timer = setTimeout(() => {*/}
                                            {/*1 !== this.state.pageIndex && this.setState({pageIndex: 1});*/}
                                        {/*}, 500);*/}
                                    {/*}}*/}
                                    {/*style={{ width, height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee'}}>*/}
                                    {/*<Text style={{color: '#999', fontSize: 15}}>继续拖动或点击查看图文详情</Text>*/}
                                {/*</TouchableOpacity>*/}
                            </ScrollView>
                        </View>
                        <View tabLabel='商品详情' style={{flex: 1}}>
                            <ScrollableTabView
                            initialPage={0}
                            onChangeTab={(item) => {
                            }}
                            tabBarUnderlineStyle={{height: 2, backgroundColor: '#2979FF'}}
                            tabBarActiveTextColor={'#2979FF'}
                            tabBarTextStyle={{fontSize: 16}}
                            tabBarInactiveTextColor={'#666666'}
                            locked={true}
                        >
                            <DetailsWeb tabLabel='商品介绍' navigation={navigation} onPause={this.state.onPause}
                                        productId={this.props.productId}/>
                            <Specifications tabLabel='产品参数'
                                            productId={this.props.productId}/>
                        </ScrollableTabView>
                        </View>
                        <View tabLabel='评价' style={{flex: 1}}><Evaluate modelId={modelId}/></View>
                    </ScrollableTabView>
                </View>
                <GoodsBottom modelId={modelId} stopVideo={this.stopVideo}/>
                <ShareModle
                    visible={this.state.showShare} content={command}
                    onCancel={() => this.setState({showShare: false})}
                    ewmPress={() => {
                        this.setState({showShare: false});
                        if (shareImg) {
                            this.props.dispatch(createIdAction('goodsDetail/changeUIState')({
                                modelId,
                                goodsShare: {shareVisible: true}
                            }));
                        } else {
                            this.props.dispatch(createIdAction('goodsDetail/showShareImg')({
                                modelId,
                                productId,
                                storeId,
                                streetId
                            }));
                        }
                    }}
                    onSuccess={
                        () => {
                            getAppJSON(Config.SHARE_SUCCESS, {productId: this.props.productId})
                                .then(res => {
                                    if (res.success) {
                                        Log('调用微店主金币接口成功');
                                    }
                                })
                                .catch(err => Log('调用微店主金币接口失败'));
                        }
                    }
                />
                <CustomAlert
                    visible={shareVisible}
                    onClose={() => this.props.dispatch(createIdAction('goodsDetail/changeUIState')({
                        modelId,
                        goodsShare: {shareVisible: false}
                    }))}
                >
                    <Image source={{uri: cutImgUrl(shareImg, 300, 350)}} style={styles.shareImg}/>
                    <Button
                        title='保存到手机'
                        style={styles.saveBtn}
                        onPress={() => {
                            this.props.dispatch(createIdAction('goodsDetail/changeUIState')({
                                modelId,
                                goodsShare: {shareVisible: false}
                            }));
                            setTimeout(async () => {
                                try {
                                    if (Platform.OS == 'android') {
                                        if (DeviceInfo.getAPILevel() >= 23) {
                                            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
                                            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                                                Toast.fail('没有权限', 2);
                                                return;
                                            }
                                        }

                                        const ret = RNFS.downloadFile({
                                            fromUrl: shareImg,
                                            toFile: RNFS.CachesDirectoryPath + '/shareImg.jpg',
                                            begin: (res) => {
                                                console.log('begin', res);
                                                console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
                                            }
                                        });
                                        await ret.promise;
                                        const exist = await RNFS.exists(RNFS.CachesDirectoryPath + '/shareImg.jpg');
                                        if (!exist) {
                                            Toast.fail('图片下载失败', 2);
                                        }
                                        this.props.dispatch(createAction('goodsDetail/saveShareImg')({
                                            modelId,
                                            productId,
                                            shareImg: 'file://' + RNFS.CachesDirectoryPath + '/shareImg.jpg'
                                        }));
                                    } else {
                                        this.props.dispatch(createAction('goodsDetail/saveShareImg')({
                                            modelId,
                                            productId,
                                            shareImg
                                        }))
                                    }
                                } catch (e) {
                                    Toast.fail('保存失败:' + e.message, 2);
                                }
                            }, 500);
                        }}/>
                </CustomAlert>
                {/*{sqzbsData && sqzbsData.toJS().showSQZBS &&*/}
                {/*<TouchableOpacity style={{position: 'absolute', bottom: 150, right: 16, width: 62, height: 62}}*/}
                                  {/*onPress={() => {*/}
                                      {/*this.props.dispatch(NavigationUtils.navigateAction('CommunityWeb', {url: sqzbsData.toJS().communityUrl}));*/}
                                  {/*}}>*/}
                    {/*<View style={{*/}
                        {/*height: 62,*/}
                        {/*width: 62,*/}
                        {/*borderRadius: 31,*/}
                        {/*borderColor: '#999',*/}
                        {/*borderWidth: Sip,*/}
                        {/*alignItems: 'center',*/}
                        {/*justifyContent: 'center'*/}
                    {/*}}>*/}
                        {/*<Image source={SQZBS} style={{height: 60, width: 60, borderRadius: 30}}/>*/}
                    {/*</View>*/}
                {/*</TouchableOpacity>}*/}
            </View>
        )
            ;
    }

    private scrollToIdex = (index) => {
        // this.swiper.scrollBy(index - this.state.pageIndex, true);
        index !== this.state.pageIndex && this.setState({pageIndex: index});
        this.stopVideo();
    };

    private clickRight = () => {
        const {users, loadingPF} = this.props;
        if (!loadingPF || !isLogin()) {
            return;
        }
        this.setState({showShare: true});
    };

    private getShareContent = () => {
        const {users, loadingPF, productId} = this.props;
        if (!loadingPF || !users) {
            return null;
        }
        const {o2oType = '', productFullName: title = '', productTitle = '', defaultImageUrl: pic = ''} = this.props;
        const {mid: userId = ''} = users;
        const fromType = '';
        const url = Config.API_URL + 'www/index.html#/' + 'productDetail/' + productId + '/' + o2oType +
            '/' + fromType + '/' + userId + '/' + userId + '?fs';
        const url2 = `${URL.GET_GOODS_SHARE_URL}${productId}/${o2oType}/${fromType}/${userId}/${userId}?fs`;
        // 分享到微信好友
        const content = productTitle || title;

        return [title, content, pic, url2, 0];
    }
}

export default GoodsDetail;

let width = URL.width;
let height = URL.height;

const styles = StyleSheet.create({
    navi: {
        zIndex: 1000,
        borderBottomWidth: 1,
        borderBottomColor: '$lightgray',
    },
    contain: {
        flex: 1,
        backgroundColor: 'white',
    },
    naviTitle: {
        width: '210rem',
        height: 44,
    },
    remark: {
        fontSize: 12,
        padding: '8rem',
        color: '#666666',
    },
    itemText: {
        fontSize: 16,
        color: '$black',
    },
    nvaiLine: {
        backgroundColor: '$darkblack',
    },
    saveBtn: {
        backgroundColor: '$lightgray',
        borderWidth: 1,
        borderRadius: '17rem',
        borderColor: '$gray',
        height: '33rem',
        width: '180rem',
        padding: '16rem',
    },
    shareImg: {
        width: '300rem',
        height: '350rem',
        resizeMode: 'contain',
    },
    detailStyle: {
        width: '50%',
        height: 40,
        textAlign: 'center',
        lineHeight: 40,
    },
});
