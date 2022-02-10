import * as React from 'react';
import {View, Image, Dimensions, StyleSheet, Text, TouchableWithoutFeedback, BackHandler, Platform} from 'react-native';
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
import noProduct from './../../images/no-product.png';
import {GET, POST_JSON, GET_P, POST_FORM} from './../../config/Http';
import L from 'lodash';
import {Color, Font} from 'consts';
import Search from '../Search';

let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
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
}

interface IGoodsList {
    provinceId: string;
    cityId: string;
    areaId: string;
    streetId: string;
    mid: string;
}

const mapStateToProps = ({
                             address: {
                                 provinceId,
                                 cityId,
                                 areaId,
                                 streetId
                             }
                         }) =>
    ({
        provinceId, cityId, areaId, streetId,
    });

@connect(mapStateToProps)
@connect(({users}) => users)
class GoodsList extends React.Component<ICustomContain & IGoodsList> {
    public state: ISGoodsList;

    private listView: UltimateListView;

    public constructor(props) {
        super(props);
        // Log('props.navigation.state.params', this.props.navigation.state.params);
        this.state = {
            // filterData: 'isHotDesc',
            keyword: props.navigation.state.params.keyword,
            filterData: '',
            qs: '',
            subFilter: '',
            docked: false,
            productCateId: props.navigation.state.params.productCateId || '',
            attributeId: props.navigation.state.params.brandId || '',
            URL: URL.keyword_search,
            isSearch: true
        };
    }

    public componentWillMount() {
        // 识别是从搜索页进去还是其他
        // 姜峰说目前逻辑不走类目搜索
        let params = this.props.navigation.state.params;
        let productCateId = L.get(params, 'productCateId', false);
        let brandId = L.get(params, 'brandId', false);
        if (productCateId || brandId) {
            let filterData = '';
            if (brandId) {
                filterData = `hasStock@${brandId}@0`;
            }
            this.setState({URL: URL.category_list, isSearch: false, filterData}, () => {
            });
        } else {
            console.log(`----从搜索进入-GoodsList----列表URL:\n${this.state.URL}`);
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
                    <SearchTopBar {...this.props.navigation}/>
                    <SecondMenu
                        attributeId={this.state.attributeId}
                        handleFilterDataUpdate={(type) => {
                            this.handleFilterDataUpdate(type);
                        }}
                        handleDrawerOpen={() => this.handleDrawerOpen()}
                    />
                    <UltimateListView
                        ref={(ref) => this.listView = ref}
                        onFetch={this.onFetch}
                        keyExtractor={(item, index) => `keys${index}`}
                        refreshableMode={Platform.OS === 'ios' ? 'advanced' : 'basic'}
                        item={this.renderUListItem}
                        numColumn={1}
                        separator={() => <View style={styles.line}/>}
                        emptyView={() =>
                            <View style={{alignItems: 'center', width: '100%'}}>
                                <View  style={{alignItems: 'center', width: '100%', backgroundColor: Color.WHITE, marginBottom: 8}}>
                                    <Image source={noProduct} style={{width: 120, height: 150}} resizeMode={'contain'}/>
                                </View>
                                <Search {...this.props} noBar/>
                            </View>
                        }
                    />
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
            // filterData: filterData + this.state.subFilter,
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
            if (this.state.isSearch) {
                console.log('------------------------------------===== onFetch isSearch =====---------------------------------------');
                // 搜索页接口
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

                const result = await GET(URL.keyword_search, query, {}, 25000, true);

                let products = [];

                if (result.success) {
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
                    productCateId: this.props.navigation.state.params.productCateId || '',
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
        } catch (err) {
            abortFetch(); // manually stop the refresh or pagination if it encounters network error
            Log(err);
        }
    };

    private onFetch2 = async (page = 1, startFetch, abortFetch) => {
        try {
            const pageLimit = 10;

            const resp = await fetchService(this.serviceUrl(page, pageLimit), {}, Config.API_SEARCH_URL);
            Log(resp);
            const {success, data} = await resp.json();
            if (!success || !data) {
                abortFetch();
                return;
            } else {
                let products;
                if (data.traceId) {
                    const respComission = await postAppJSON('search/getPriceByProductList.html',
                        data.traceId, Config.API_SEARCH_URL);

                    Log(respComission);

                    products = respComission.products;
                    const {comSuccess} = respComission;

                    if (!comSuccess || !products) {
                        abortFetch();
                    }
                } else {
                    products = data.productList;
                }

                Log(products);

                startFetch(products, pageLimit);
            }
        } catch (err) {
            abortFetch(); // manually stop the refresh or pagination if it encounters network error
            Log(err);
        }
    }
    private handleGoodPress = (item) => {
        this.props.navigation.navigate('GoodsDetail',
            {
                productId: item.productId,
                productFullName: item.productFullName,
                swiperImg: item.defaultImageUrl,
                price: item.finalPrice || item.defaultPrice,
            });
    };

    private renderUListItem = (item, index) => {
        return (
            <GoodCard
                key={index}
                item={item}
                index={index}
                handlePress={this.handleGoodPress}
                // changeDefaultAddress={this.handleChangeDefaultAddress}
                // handleDeleteAddress={this.handleDeleteAddress}
                // handleSelect={this.handleSelect}
            />
        );
    }
}

export default GoodsList;

const mwidth = width * 0.25;
export const GoodCard = ({item, index, handlePress/*, changeDefaultAddress, handleDeleteAddress, handleSelect*/}) => (
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
                    source={{uri: cutImgUrl(item.defaultImageUrl, 600, 600, true) || ''}}
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
        // paddingRight: 10,
    },
    subtitle: {
        marginTop: 6,
        marginRight: 30,
        fontSize: Font.NORMAL_1,
        color: Color.GREY_1,
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
});
