import * as React from 'react';
import {ScrollView, View, Text, StyleSheet, Image, TouchableWithoutFeedback, Modal} from 'react-native';
import {UltimateListView} from 'rn-listview';
import {getAppJSON} from '../../netWork';
import {NavigationScreenProp} from 'react-navigation';
import {connect, naviBarHeight} from '../../utils';
import {ICustomContain} from '../../interface';
import {MessageWithBadge} from '../../components/MessageWithBadge';
import {NavBar, SafeView} from './../../components';
import SelectBar from 'rn-select-bar';
import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
import Header from '../../components/Header';
import {Font, Color} from 'consts';

const tabs = ['商品', '店铺/场馆'];

interface ICollectState {
    status: number;
}

interface IGoodsList {
    provinceId: string;
    cityId: string;
    areaId: string;
    streetId: string;
    unread: number;
}

const mapStateToProps = ({
                             address: {
                                 provinceId,
                                 cityId,
                                 areaId,
                                 streetId
                             }, users: {unread,isHost,CommissionNotice}
                         }) => {
    return {
        provinceId, cityId, areaId, streetId, unread,isHost,CommissionNotice
    }
}

/**
 * 我的收藏
 */
@connect(mapStateToProps)
class MyCollect extends React.Component<ICustomContain & IGoodsList> {
    public static navigationOptions = ({navigation, screenProps}) => ({
        header: <Header
            goBack={() => navigation.goBack()}
            title="我的收藏">
            <View style={{position: 'absolute', right: 0}}>
                <MessageWithBadge
                    navigation={navigation}
                    unread={screenProps.unread}
                    isWhite={false}
                    badgeContainStyle={{top: 3, right: -3}}
                    imageStyle={{width: 22, height: 22}}
                    hidingText={true}
                />
            </View>
        </Header>
    });

    public state: ICollectState;
    private listView?: any;

    constructor(props) {
        super(props);
        this.state = ({ status: 0});
        this.onFetch1 = this.onFetch1.bind(this);
        this.onFetch2 = this.onFetch2.bind(this);
    }

    public render(): JSX.Element {
        return (
            <View style={{flex: 3}}>
                <SelectBar
                    style={styles.barStyle}
                    selectTitleStyle={styles.selectTitleStyle}
                    normalTitleStyle={styles.normalTitleStyle}
                    selectLineStyle={styles.selectLineStyle}
                    content={tabs}
                    selectedItem={tabs[this.state.status]}
                    onPress={(item, index) => { this.setState({ status: index }, ()=>{
                        this.listView && this.listView.onRefresh();
                    });}}
                />
                <UltimateListView
                    style={{marginBottom: 10, flex: 1}}
                    key={`listKey${this.state.status}`}
                    ref={(ref) => this.listView = ref}
                    onFetch={this.state.status == 0 ? this.onFetch1 : this.onFetch2}
                    keyExtractor={(item, index) => `keys${index}`}
                    refreshableMode='advanced'
                    item={this.state.status == 0 ? this.renderUListItem : this.renderSListItem}
                    numColumn={1}
                    paginationAllLoadedView={() => <View />}
                    paginationFetchingView={() => <View />}
                    emptyView={()=>this.renderEmpty()}
                />
            </View>
        );
    }

    // 获取商品收藏数据
    private onFetch1 = async (page = 1, startFetch1, abortFetch) => {
        try {
            const param = 'provinceId=' + this.props.provinceId + '&cityId='
                + this.props.cityId + '&districtId=' + this.props.areaId + '&streetId='
                + this.props.streetId;
            const url = 'v3/mstore/sg/collections.html?' + param;
            const {success, data} = await getAppJSON(url);
            if (!success || !data) {
                abortFetch();
                return;
            } else {
                const products = data.productsList ? data.productsList : [];
                startFetch1(products, 100);
                Log('*********----获取商品收藏数据-----**********', data);
            }
        } catch (err) {
            abortFetch();
            Log(err);
        }
    }
    // 获取店铺收藏数据
    private onFetch2 = async (page = 1, startFetch2, abortFetch) => {
        try {
            const pageLimit = 5;
            const param = 'page=' + page + '&pageSize=5';
            const url = 'v3/mstore/sg/storeCollection.json?' + param;
            const json = await getAppJSON(url);
            if (json.success && json.data) {
                startFetch2(json.data, pageLimit);
                Log('*********----获取店铺收藏数据-----**********', json);
            }
        } catch (err) {
            abortFetch();
            Log(err);
        }
    }

    renderEmpty=()=>{
        return(
            <View style={styles.emptyContainer}>
                <Image
                    source={require('../../images/noCollect.png')}
                    style={styles.emptyImage}
                    resizeMode={'contain'}
                />
                <Text style={styles.emptyText}>暂无收藏{this.state.status == 0 ? '商品' : '店铺/场馆'}</Text>
            </View>
        );
    }

    private renderUListItem = (item, index) => {
        return (
            <GoodCard
                isHost={this.props.isHost>0&&this.props.CommissionNotice}//是否是微店主
                key={index}
                item={item}
                index={index}
                handlePress={this.handleGoodPress}
            />
        );
    }

    private renderSListItem = (item, index) => {
        return (
            <StoreCard
                key={index}
                item={item}
                index={index}
                handlePress={this.handleStorePress}
            />
        );
    }

    private handleGoodPress = (item) => {
        this.props.navigation.navigate('GoodsDetail', {productId: item.productId ,
            callBack: () => {
                this.listView && this.listView.onRefresh();
            }});
        // alert('进入商品' + item.productId);
    }

    private handleStorePress = (item) => {
        // alert('进入品牌馆' + item.collectId);
        this.props.navigation.navigate('CharaPage', {regionId: item.collectId , callBack: () => {
                this.listView && this.listView.onRefresh();
        }});
    }

}
const mwidth = width * 0.25;
const GoodCard = ({isHost,item, index, handlePress}) => (
    <TouchableWithoutFeedback onPress={() => {
        handlePress(item);
    }}>
        <View style={{
            height: 120, padding: 10, backgroundColor: '#fff',
            flexDirection: 'row', alignItems: 'center', borderBottomColor: '#e4e4e4', borderBottomWidth: 1
        }}>
            <Image
                style={{
                    width: mwidth, height: mwidth, resizeMode: 'contain',
                    backgroundColor: 'lightgrey', alignSelf: 'center'
                }}
                source={{uri: item.defaultImageUrl}}
            />
            <View style={{width: width - mwidth - 30, marginLeft: 10, marginRight: 10}}>
                <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>{item.productFirstName +' '+ item.productSecondName}</Text>
                {item.productTitle.length === 0 ?
                    null :
                    <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode='tail'>{item.productTitle}</Text>}
                <View style={{flexDirection: 'row', marginTop: 10}}>
                    <Text style={styles.price}>
                        {`¥${(item.finalPrice && item.finalPrice.toFixed(2))||
                        (item.saleGuidePrice && item.saleGuidePrice.toFixed(2))}`}
                    </Text>
                    {
                        isHost&&<View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image style={styles.commissionImage} source={require('../../images/hongbao.png')}/>
                            <Text style={styles.priceCommission}>{`¥${item.commission && item.commission.toFixed(2)}`}</Text>
                        </View>
                    }
                </View>
            </View>
        </View>
    </TouchableWithoutFeedback>
);

const StoreCard = ({item, index, handlePress}) => (
    <TouchableWithoutFeedback onPress={() => {
        handlePress(item);
    }}>
        <View style={{
            height: height / 5, marginBottom: 10, backgroundColor: '#fff',
            flexDirection: 'row', alignItems: 'center'
        }}>
            <Image
                style={{
                    width, height: height / 5, resizeMode: 'stretch',
                    backgroundColor: '#fff', alignSelf: 'center'
                }}
                source={{uri: item.pic}}
            />
            <View style={styles.store}>
                <Text style={{color: 'white', fontSize: 15}}>{item.name}</Text>
                <Text style={{color: 'white', fontSize: 12, flex: 1, textAlign: 'right'}}>{item.collectionNum}粉丝</Text>
            </View>
        </View>
    </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
    title: {
        fontSize: Font.LARGE_3,
        color: Color.BLACK_1,
    },
    subtitle: {
        marginTop: 10,
        marginRight: 30,
        fontSize: 12,
        color: Color.GREY_2,
    },
    barStyle: {
        width: width,
        height: 44,
        backgroundColor: Color.WHITE,
        borderBottomWidth: 1,
        borderBottomColor: Color.GREY_5,
    },
    selectTitleStyle: {
        color: Color.BLUE_1,
        fontSize: Font.NORMAL_1,
    },
    normalTitleStyle: {
        fontSize: Font.NORMAL_1,
        color: Color.GREY_1,
    },
    selectLineStyle: {
        height: 2,
        width: width/2,
    },
    line: {
        height: 0.5,
        backgroundColor: 'gray',
    },
    price: {
        fontSize: Font.LARGE_2,
        color: Color.ORANGE_1,
    },
    priceCommission:{
        fontSize: Font.NORMAL_1,
        color: Color.ORANGE_1, 
    },
    commissionImage: {
        width: 20,
        height: 20,
        marginLeft: 20,
        marginRight: 8,
    },
    stock: {
        marginTop: 5,
        color: 'blue',
        fontSize: 12,
    },
    store: {
        position: 'absolute',
        top: height / 5 - height / 17,
        width: mwidth * 4,
        height: height / 17,
        backgroundColor: 'rgba(30, 30, 30, 0.3)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
    },
    emptyContainer: {
        height: height - naviBarHeight,
        alignItems: 'center',
        paddingTop: 26,
        width: '100%',
        backgroundColor: Color.WHITE,
    },
    emptyImage: {
        height: 97,
        width: 124,
        marginTop: 26,
    },
    emptyText: {
        marginTop: 12,
        color: Color.GREY_2,
        fontSize: Font.NORMAL_1,
    },
});
export default MyCollect;
