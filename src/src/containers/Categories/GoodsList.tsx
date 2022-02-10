import * as React from 'react';
import {View, Image, StyleSheet, Text, TouchableWithoutFeedback,
    BackHandler, Platform, ImageBackground, TouchableOpacity} from 'react-native';
import {UltimateListView} from 'rn-listview';
import {NavigationScreenProp} from 'react-navigation';
import SecondMenu from '../../components/secondMenu/index';
import {fetchService, postAppJSON} from '../../netWork';
import {connect, createAction} from '../../utils';
import FilterList from '../../components/FilterList';
import {Drawer, List} from 'antd-mobile';
import {ICustomContain} from '../../interface';
import SearchTopBar from '../Search/SearchTopBar';
import Config from 'react-native-config';
import {cutImgUrl} from '../../utils';
import URL from './../../config/url';
import {GET, POST_JSON, GET_P, POST_FORM} from './../../config/Http';
import L from 'lodash';
import {Color, Font} from 'consts';
import Search from '../Search';
import SelectBar from 'rn-select-bar';
import Separator from '../../components/Separator';
import sqzbs3 from './../../images/sqzbs3.jpg';
import { goToSQZBS } from '../../utils/tools';

let width = URL.width;
let height = URL.height;

const PAGE_LIMIT = 10;

interface ISGoodsList {
    filterData: string;
    subFilter: string;
    docked: boolean;
    productCateId: string;
    attributeId: string;
    keyword: string;
    qs: string;
    isSearch: boolean;
    pageIndex: number;
    noData: boolean;
}

interface IGoodsList {
    provinceId: string;
    cityId: string;
    areaId: string;
    streetId: string;
    mid: string;
}


@connect(({users, store, address}) => ({...users, ...store, ...address}))
class GoodsList extends React.Component<ICustomContain & IGoodsList> {
    public state: ISGoodsList;

    private listView: UltimateListView;

    public barContent = ['商品', '店铺'];

    public constructor(props) {
        super(props);
        this.state = {
            keyword: props.navigation.state.params.keyword,
            filterData: '',
            qs: '',
            subFilter: '',
            docked: false,
            productCateId: props.navigation.state.params.productCateId || '',
            attributeId: props.navigation.state.params.attributeId || '',
            URL: URL.keyword_search,
            isSearch: true,
            pageIndex: (props.navigation.state.params.pageIndex || 0 ) - 1,
            showTopButton: false,
            startFetch: false,
            noData: false,
        };
    }

    public async componentWillMount() {
        // 识别是从搜索页进去还是其他
        // 姜峰说目前逻辑不走类目搜索
        let params = this.props.navigation.state.params;
        let hasStock = await global.getItem('hasStock');
        let productCateId = L.get(params, 'productCateId', false);
        let brandId = L.get(params, 'brandId', false);
        let attributeId = L.get(params, 'attributeId', false);
        if (productCateId || brandId || attributeId) {
            let filterData = `${hasStock ? "hasStock":"all"}@${brandId ? brandId : 'all'}@0${attributeId ? `@${this.state.attributeId}` : ''}`;
            this.setState({URL: URL.category_list, isSearch: false, filterData, startFetch: true}, () => {
                // 刷新
                this.listView.refresh();
            });
        } else {
            console.log(`----从搜索进入-GoodsList----列表URL:\n${this.state.URL}`);
            this.setState({URL: URL.category_list, filterData: hasStock ? "hasStock@all@0" :"",  startFetch: true}, () => {
                // 刷新
                this.listView.refresh()
            });
        }

        // 搜索接口进
        // search/wdCommonSearchNew.html
        // 分类列表进
        // search/commonLoadItemNew.html

        // this.setState({
        //     filterData: !this.state.attributeId ? 'hasStock' :
        //         `hasStock@all@0@${this.state.attributeId}`,
        //     subFilter: !this.state.attributeId ? '' :
        //         `@all@0@${this.state.attributeId}`,
        // });

        // console.log('----------==========GoodsList==componentWillMount==============------------')

        BackHandler.addEventListener('hardwareBackPress', this.backHandle);
    }

    public componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backHandle);
    }

    public render() {
        return (
            <View style={{flex: 1}}>
                <Drawer
                    position='right'
                    style={{height, zIndex: 3, backgroundColor: '#fff'}}
                    sidebar={<FilterList
                        key={'goodlist'}
                        attributeId={this.state.attributeId}
                        categoryId={this.state.productCateId}
                        keyword={this.state.keyword}
                        close={(filterString) => this.handleDrawerClose(filterString)}/>}
                    open={this.state.docked}
                    onOpenChange={(isopen) => {
                        this.setState({
                            docked: isopen,
                        });
                    }}
                >
                    <SearchTopBar {...this.props.navigation} pageIndex={this.state.pageIndex}/>
                    {this.state.pageIndex > -1 && this.state.noData &&
                        <TouchableWithoutFeedback  onPress={()=>{goToSQZBS();}} >
                            <Image style={{width: width, height: 0.32*width}} source={sqzbs3}/>
                        </TouchableWithoutFeedback>
                    }
                    {this.state.pageIndex > -1 &&
                    <SelectBar
                        style={styles.barStyle}
                        selectTitleStyle={styles.selectTitleStyle}
                        normalTitleStyle={styles.normalTitleStyle}
                        selectLineStyle={styles.selectLineStyle}
                        content={this.barContent}
                        selectedItem={this.barContent[this.state.pageIndex]}
                        onPress={(item, index) => {this.setState({ pageIndex: index });}}
                    />
                    }
                    {this.state.pageIndex <= 0 &&
                    <SecondMenu
                        attributeId={this.state.attributeId}
                        handleFilterDataUpdate={(type) => {
                            this.handleFilterDataUpdate(type);
                        }}
                        handleDrawerOpen={() => this.handleDrawerOpen()}
                    />
                    }
                    <UltimateListView
                        ref={(ref) => this.listView = ref}
                        onFetch={this.onFetch}
                        key={`listKey${this.state.pageIndex}`}
                        keyExtractor={(item, index) => `keys${index}`}
                        refreshableMode={Platform.OS === 'ios' ? 'advanced' : 'basic'}
                        item={this.renderUListItem}
                        numColumn={1}
                        separator={() => <View style={[styles.line, this.state.pageIndex == 1 && styles.separator]}/>}
                        emptyView={() =>
                            <View style={{alignItems: 'center', width: '100%'}}>
                                <View  style={styles.emptyContainer}>
                                    <Image source={this.state.pageIndex >= 0 ?
                                        require('../../images/noAddress.png') :
                                        require('../../images/no-product.png')}
                                           style={this.state.pageIndex >= 0 ? styles.emptyImage: styles.noProductImage}
                                           resizeMode={'contain'}
                                    />
                                    {this.state.pageIndex >= 0 && <Text style={styles.noDataText}>换个词试一下</Text>}
                                </View>
                                <Search {...this.props} noBar/>
                            </View>
                        }
                    />
                    {this.state.pageIndex == 1 && this.state.showTopButton &&
                    <TouchableOpacity
                        style={styles.toTopButton}
                        onPress={() => {this.onPressToTopButton()}}
                    >
                        <Image style={styles.toTopImage}
                               source={require('../../images/icon_totop.png')}/>
                    </TouchableOpacity>
                    }
                </Drawer>
            </View>
        );
    }

    private backHandle = () => {
        if (this.state.docked) {
            this.setState({
                docked: false,
            });
            return true;
        }
        return false;
    }

    // tslint:disable-next-line:member-ordering
    private static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state;
        return {
            header: null,
        };
    }

    private handleFilterDataUpdate(filterData) {
        console.log('-------filterData-----');
        console.log(filterData);
        this.setState({
            qs: filterData,
        }, () => {
            this.listView.refresh();
        });
    }

    private handleDrawerOpen() {
        this.setState({
            docked: true,
        });
    }

    private handleDrawerClose(filterString) {
        console.log('-------=========handleDrawerClose(filterString)========-----------');
        console.log(filterString)
        if (filterString) {
            this.setState({
                docked: false,
                filterData: filterString,
                subFilter: filterString,
            }, () => {
                this.listView.refresh();
            });
        } else {
            this.setState({docked: false});
        }
    }

    private serviceUrl = (page = 1, pageLimit = 10) => {
        const prefix = this.state.productCateId ?
            'search/commonLoadItemNew.html?' :
            `search/wdCommonSearchNew.html?keyword=${encodeURI(this.state.keyword)}&`;

        const productCateId = this.state.productCateId ? `&productCateId=${this.state.productCateId}&` : '';

        return prefix +
            `pholder=1&provinceId=${this.props.provinceId}&cityId=${this.props.cityId}&` +
            `districtId=${this.props.areaId}&streetId=${this.props.streetId}` +
            `&pageIndex=${page}&pageSize=${pageLimit}` + productCateId +
            `&memberId=${this.props.mid}&filterData=${this.state.filterData}&fromType=1&noLoading=true`;
    };

    private onFetch = async (page = 1, startFetch, abortFetch) => {
        try {
            if(!this.state.startFetch){
                abortFetch();
            }else{
                if (this.state.isSearch) {
                    console.log('------------------------------------===== onFetch isSearch =====---------------------------------------');
                    // 搜索页接口
                    console.log('filterData');
                    console.log(this.state.filterData);
                    let query = {
                        pageIndex: page,
                        pageSize: PAGE_LIMIT,
                        keyword: this.state.keyword,
                        memberId: this.props.mid || '',
                        productCateStr: '',
                        qs: this.state.qs,
                        filterData: this.state.filterData,
                        provinceId: this.props.provinceId,
                        cityId: this.props.cityId,
                        districtId: this.props.areaId,
                        streetId: this.props.streetId,
                        fromType: 1,
                        searchType: 0,
                    };

                    let result = await GET(URL.keyword_search, query, {}, 25000, true);
                    if(result.success && result.totalCount<= 0){
                        this.setState({noData: true});
                    }
                    
                    if(this.state.pageIndex == 1){
                        let queryStroe={k: this.state.keyword, p:page, s: PAGE_LIMIT};
                        result = await GET(URL.search_store, queryStroe, {}, 25000, true);
                        if (result.success) {
                            let stores = result.data;
                            if(page > 2){
                                this.setState({showTopButton: true});
                            }
                            startFetch(stores, PAGE_LIMIT);
                        }else {
                            abortFetch();
                        }
                    }else if (result.success) {
                        let products = [];
                        if (result.data.productCateIds) {
                            this.setState({productCateId: result.data.productCateIds});
                        }
                        if (result.data.isCanSyncGetPrice) {
                            // 查询价格在渲染列表
                            const priceList = await GET(URL.get_price_by_traceid, {traceId: result.data.traceId}, {}, 25000, true);
                            const {success: comSuccess} = priceList;
                            let productList1 = priceList.products;
                            if (!comSuccess || !productList1) {
                                return abortFetch();
                            }
                            let productList0 = result.data.productList;
                            for (let i = 0; i < productList0.length; i++) {
                                let item0 = productList0[i];
                                for (let j = 0; j < productList1.length; j++) {
                                    let item1 = productList1[j];
                                    if (item0['productId'] == item1['productId']) {
                                        products.push(Object.assign({}, item0, item1));
                                        break;
                                    }
                                }
                            }

                        } else {
                            products = result.data.productList;
                        }
                        startFetch(products, PAGE_LIMIT);
                    } else {
                        abortFetch();
                    }
                } else {
                    // 分类页接口
                    console.log('------------------------------------===== onFetch not search =====---------------------------------------');
                    let query = {
                        pageIndex: page,
                        pageSize: PAGE_LIMIT,
                        memberId: this.props.mid || '',
                        productCateId: this.state.productCateId || '',
                        qs: this.state.qs,
                        filterData: this.state.filterData,
                        provinceId: this.props.provinceId,
                        cityId: this.props.cityId,
                        districtId: this.props.areaId,
                        streetId: this.props.streetId,
                        fromType: 1
                    };

                    const result = await GET(URL.category_list, query);
                    let products = [];

                    if (result.success) {
                        if (result.data.isCanSyncGetPrice) {
                            // 查询价格在渲染列表
                            const priceList = await GET(URL.get_price_by_traceid, {traceId: result.data.traceId});
                            const {success: comSuccess} = priceList;
                            let productList1 = priceList.products;
                            if (!comSuccess || !productList1) {
                                return abortFetch();
                            }
                            let productList0 = result.data.productList;

                            for (let i = 0; i < productList0.length; i++) {
                                let item0 = productList0[i];
                                for (let j = 0; j < productList1.length; j++) {
                                    let item1 = productList1[j];
                                    if (item0['productId'] == item1['productId']) {
                                        products.push(Object.assign({}, item0, item1));
                                        break;
                                    }
                                }
                            }
                        } else {
                            products = result.data.productList;
                        }
                        startFetch(products, PAGE_LIMIT);
                    } else {
                        abortFetch();
                    }
                }
            }
        } catch (err) {
            abortFetch(); // manually stop the refresh or pagination if it encounters network error
            Log(err);
        }
    };

    private handleGoodPress = (item) => {
        this.props.navigation.navigate('GoodsDetail',
            {
                productId: item.productId,
                productFullName: item.productFullName,
                swiperImg: item.defaultImageUrl,
                price: item.finalPrice || item.defaultPrice,
            });
    };

    onPressToTopButton =()=>{
        this.listView.scrollToOffset(0, 0);
        this.setState({showTopButton: false});
    }

    onPressIntoStroe =(id)=>{
        this.props.navigation.navigate('StoreHome', {storeId: id});
    }

    onPressStoreGood =(value)=>{
        this.props.navigation.navigate('GoodsDetail',
            {
                productId: value.i,
                swiperImg: value.m,
                price: value.p,
            });
    }

    private renderUListItem = (item, index) => {
        if(this.state.pageIndex == 1){
            return(this.renderStoreItem(item, index));
        }else {
            return (
                <GoodCard
                    key={index}
                    item={item}
                    index={index}
                    handlePress={this.handleGoodPress}
                />
            );
        }
    }

    renderStoreItem = (item, index) => {
        return(
            <View style={styles.storeContainer}>
                <View style={styles.storeDetailContainer}>
                    <View style={styles.storeHeaderContainer}>
                        <Image style={styles.avatarImage} source={item.m ? {uri: item.m} :
                            require('../../images/store_avatar.png')} resizeMode='cover'/>
                        <View style={styles.nameContainer}>
                            <Text style={styles.nameText} numberOfLines={1}>{item.n}</Text>
                            <View style={styles.officialContianer}>
                                <Image style={styles.officialImage} source={require('../../images/official.png')}/>
                                <Text style={styles.officialText}>官方认证</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.storeIntoContainer} onPress={()=>{this.onPressIntoStroe(item.i)}}>
                        <Text style={styles.storeIntoText}>进店</Text>
                    </TouchableOpacity>
                </View>
                {item.p && <Separator style={styles.line}/>}
                {item.p &&
                <View style={styles.storeGoodsContainer}>
                    {item.p.map((value,index)=>{
                        if(index>2){
                            return;
                        }

                        return (
                            <TouchableOpacity onPress={()=>{this.onPressStoreGood(value)}}>
                                <ImageBackground style={styles.storeGoodsImage}
                                                 source={{uri: value.m}} resizeMode='contain'>
                                    <Text style={styles.storeGoodsText}>¥{value.p.toFixed(2)}</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                }
            </View>
        );
    }
}

export default GoodsList;

const mwidth = width * 0.25;
export const GoodCard = ({item, index, handlePress}) => (
    <TouchableWithoutFeedback onPress={() => {
        handlePress(item);
    }}>
        <View style={{
            padding: 5, backgroundColor: '#fff',
            flexDirection: 'row', alignItems: 'center'
        }}>
            <View style={{width: mwidth, height: mwidth, backgroundColor: 'lightgray', alignSelf: 'center'}}>
                <Image
                    style={{
                        width: mwidth, height: mwidth, resizeMode: 'contain',
                        backgroundColor: 'lightgray', alignSelf: 'center'
                    }}
                    source={{uri: cutImgUrl(item.defaultImageUrl, 450, 450, true) || ''}}
                />
            </View>
            {item.recommend ?
                <Text
                    style={{position: 'absolute', top: 3, left: 0, fontSize: 12, fontWeight: 'bold', color: 'white', backgroundColor: '#dc3f67', padding: 5, textAlign: 'center'}}
                >
                    推荐
                </Text> : null}
            <View style={{flex: 1, marginLeft: 8, marginRight: 10}}>
                <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>{item.productFirstName + ' ' + item.productSecondName}</Text>
                {item.productTitle.length === 0 ?
                    null :
                    <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode='tail'>{item.productTitle}</Text>}
                <View style={styles.bottomContainer}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.price}>{`¥${item.finalPrice || item.defaultPrice}`}</Text>
                        {(dvaStore.getState().users.isHost === 1 && dvaStore.getState().users.CommissionNotice) ? <Image style={{
                            width: 20,
                            height: 20,
                            marginLeft: 5,
                            marginRight: 5,
                        }} source={require('../../images/hongbao.png')}/> : null}
                        {(dvaStore.getState().users.isHost === 1 && dvaStore.getState().users.CommissionNotice) ? <Text style={styles.price}>{IS_NOTNIL(item.commission) ? `¥${item.commission}` : "佣金计算中"}</Text> : null}
                    </View>
                    {(item.hasStock && item.hasStock != '有货' && item.hasStock != '') ?
                        <Text style={[styles.stock, item.hasStock == '预订' && styles.reserveStock]}>{item.hasStock}</Text> : <View/>
                    }
                </View>
            </View>
        </View>
    </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
    title: {
        color: Color.BLACK_1,
        fontSize: 16,
    },
    subtitle: {
        marginTop: 6,
        marginRight: 30,
        fontSize: Font.NORMAL_1,
        color: Color.GREY_1,
    },
    barStyle: {
        width: width,
        height: 44,
        backgroundColor: Color.WHITE,
        borderBottomWidth: 1,
        borderBottomColor: Color.GREY_5,
    },
    selectTitleStyle: {
        fontSize: Font.NORMAL_1,
    },
    normalTitleStyle: {
        color: Color.GREY_1,
    },
    selectLineStyle: {
        height: 2,
        width: width/2,
    },
    line: {
        height: 1,
        marginVertical: 0.5,
        backgroundColor: Color.GREY_6,
    },
    price: {
        color: Color.ORANGE_1,
    },
    bottomContainer: {
        flexDirection: 'row',
        marginTop: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    stock: {
        color: Color.GREY_2,
        fontSize: Font.SMALL_2,
        borderWidth: 1,
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderColor: Color.GREY_2,
        borderRadius: 1,
    },
    reserveStock: {
        color: Color.BLUE_1,
        borderColor: Color.BLUE_1,
    },
    storeContainer: {
        paddingHorizontal: 16,
        width: width,
        backgroundColor: Color.WHITE,
    },
    storeDetailContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 80,
        alignItems: 'center',
    },
    storeHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarImage: {
        height: 48,
        width: 48,
        borderRadius: 24,
        backgroundColor: Color.WHITE,
    },
    avatarContainer: {
        height: 48,
        width: 48,
        borderRadius: 24,
        backgroundColor: Color.GREY_4,
    },
    nameContainer:{
        marginLeft: 16,
    },
    nameText: {
        fontSize: Font.NORMAL_1,
        color: Color.BLACK_1,
        width: width - 155
    },
    officialContianer: {
        flexDirection: 'row',
        marginTop: 5,
    },
    officialImage: {
        width: 12,
        height: 12,
        resizeMode: 'contain',
    },
    officialText: {
        fontSize: Font.SMALL_1,
        color: Color.BLUE_1,
        marginLeft: 6,
    },
    storeIntoContainer: {
        borderRadius: 100,
        width: 56,
        height: 24,
        borderColor: Color.BLUE_1,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    storeIntoText: {
        fontSize: Font.SMALL_1,
        color: Color.BLUE_1,
    },
    storeGoodsContainer: {
        flex: 1,
        flexDirection: 'row',
        height: 145,
        alignItems: 'center',
        marginHorizontal: - 1.5
    },
    storeGoodsImage: {
        width: (width-20)/3 - 3,
        height: (width-20)/3 - 3,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginHorizontal: 1.5,
        backgroundColor: Color.GREY_4,
    },
    storeGoodsText: {
        height: 16,
        fontSize: Font.SMALL_1,
        color: Color.WHITE,
        paddingHorizontal: 5,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    separator: {
        height: 8,
    },
    toTopButton: {
        position: 'absolute',
        right: 10,
        bottom: 20,
        height: 50,
        width: 50,
        opacity: 0.8,
    },
    toTopImage: {
        height: 50,
        width: 50,
    },
    emptyContainer:{
        alignItems: 'center',
        width: '100%',
        backgroundColor: Color.WHITE,
        marginBottom: 8
    },
    noProductImage:{
        width: 120,
        height: 150
    },
    emptyImage:{
        height: 97,
        width: 124,
        marginTop: 26,
    },
    noDataText: {
        color: '#999',
        fontSize: 14,
        marginTop: 12,
        marginBottom: 26,
        marginHorizontal: 80,
        textAlign: 'center',
    },
});
