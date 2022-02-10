import * as React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Dimensions,
    Platform,
    Image,
} from 'react-native';
import PropTypes from 'prop-types';

import Button from 'rn-custom-btn1';
import { UltimateListView } from 'rn-listview';

import { getAppJSON } from '../../netWork';
import { ICustomContain } from '../../interface';
import CustomNaviBar from '../Home/SGHomeNavBar';
import Banner from '../../components/CustomBanner';
import {cutImgUrl} from '../../utils';
import {Font, Color} from 'consts';
import {goBanner} from '../../utils/tools';
import Swiper from 'react-native-swiper';

interface IState {
    data: any[];
    selectItem: string;
    headerData: any[];
    bannerKey: string;
    showHeader: boolean;
}

// tslint:disable-next-line:no-empty-interface
interface ICategoriesProps {
}

class Categories extends React.Component<ICategoriesProps & ICustomContain> {

    public state: IState = {
        data: [],
        selectItem: '',
        headerData: [],
        bannerKey: 'key',
        showHeader: false,
    };
    // tslint:disable-next-line:member-ordering
    // private static navigationOptions = ({ navigation }) => {
    //     // Log(navigation.state);
    //     const { params = {} } = navigation.state;
    //     // Log(params);

    //     // return {
    //     //     header: <CustomNaviBar isCategory navigation={navigation} />,
    //     // };
    // }

    private listView?: any;
    private list?: any;

    public componentWillMount() {
        this.loadData();
    }

    private loadData = async (callBack?) => {
        try {
            const { success, data } = await getAppJSON('sg/cms/navigation/getNavigations.json?parentId=0');
            Log(success, data);
            if (!success || !data) { return; }
            // Log('---loadData--data----');
            // Log(data);
            this.setState({ data, selectItem: data[0].id }, () => this.listView.onRefresh());
            callBack && callBack();
        } catch (error) {
            Log(error);
            callBack && callBack();
        }
    }

    private onFetch = async (page = 1, startFetch, abortFetch) => {
        try {
            if (!this.state.selectItem || this.state.selectItem.length === 0) {
                this.loadData(() => abortFetch());
            }
            const pageLimit = 24;
            // tslint:disable-next-line:max-line-length
            const { success, data } = await getAppJSON(
                `sg/cms/navigation/getNavigations.json?parentId=${this.state.selectItem}`,
                {}, {}, true,
            );
            Log(`---onFetch--data-parentId-${this.state.selectItem}--`);
            Log(data);
            if (!success || !data) { abortFetch(); }
            const headerData = [];
            const rowData = [];
            const rowItemMap = {};
            data.forEach((item) => {
                if (item.levels === '1') {
                    // level = 1 是头部信息
                    headerData.push(item);
                } else {
                    if (item.parentId === this.state.selectItem) {
                        // item.parentId === this.state.selectItem 是列表 cell 信息
                        rowData.push(item);
                    } else {
                        // tslint:disable-next-line:max-line-length
                        // 对象
                        rowItemMap[item.parentId] ? rowItemMap[item.parentId].push(item) : rowItemMap[item.parentId] = [item];
                    }
                }
            });
            Log(headerData);
            Log('------headerData---rowData---');
            Log(rowData);
            Log(rowItemMap);
            rowData.forEach((item) => {
                item.itemData = rowItemMap[item.id];
            });
            Log('------rowItemMap---rowData---');
            Log(rowData);
            this.setState({ headerData, showHeader: true }, () => startFetch(rowData, pageLimit));
        } catch (err) {
            abortFetch(); // manually stop the refresh or pagination if it encounters network error
            Log(err);
        }
    }
    private renderItem = ({ item }) => {
        const selected = this.state.selectItem === item.id;
        const containView = (
            <View style={[styles.leftRow, !selected && styles.unselectedContainer]}>
                {/* <View style={selected ? styles.leftRowLine : styles.leftNormalLine} /> */}
                <Text style={selected ? styles.selectText : styles.leftRowText}>{item.navigationName}</Text>
            </View>
        );
        return (
            <TouchableOpacity onPress={() => {
                // tslint:disable-next-line:max-line-length
                this.state.selectItem !== item.id && this.setState({ selectItem: item.id, headerData: [] }, () => this.listView.onRefresh());
            }}>
                {containView}
            </TouchableOpacity>
        );
    }

    private renderUListItem = (item) => {
        return (
            <View style={styles.rightRow}>
                <View style={styles.topView}>
                    <View style={styles.rightTopLine} />
                    <Text style={styles.topText}>{item.navigationName}</Text>
                    <View style={styles.rightTopLine} />
                </View>
                <View style={styles.rightRowBottom}>
                    {item.itemData && item.itemData.map(({ navigationName, imageUrl, url }) =>
                        <Button style={styles.rightRowItem}
                            key={imageUrl}
                            title={navigationName}
                            image={{ uri: cutImgUrl(imageUrl, RIGHTITEMWIDTH - 20 , RIGHTITEMWIDTH - 20) }||""}
                            imageStyle={{ width: RIGHTITEMWIDTH - 20, height: RIGHTITEMWIDTH - 20, resizeMode: 'contain' }}
                            textStyle={{ color: Color.GREY_1, fontSize: 13 }}
                            onPress={() => this.onItemPress(url)}
                        />,
                    )}
                </View>
            </View>
        );
    }

    private onItemPress = (url) => {
        const paramsArray = url.split('&');
        const params = {};
        if (paramsArray.length > 0) {
            for (const val of paramsArray) {
                params[val.split('=')[0]] = val.split('=')[1];
            }
        }
        // console.log('------------------------------------===== onItemPress =====---------------------------------------');
        // console.log(params);
        this.props.navigation.navigate('GoodsList', params);
    }
    private renderHeader = () => {
        return (this.state.headerData.length > 0 ? <View style={{ width: width - LEFTWIDTH - 16, height: 100 }}>
            <Swiper
            autoplay={true}
            loop={true}
            observer={true}
            observeParents={false}
            autoplayTimeout={3}
            pagingEnabled={true}
            showsPagination={true}
            paginationStyle={{bottom: 10}}
            dot={<View style={{
                backgroundColor: 'rgba(255,255,255,.5)',
                width: 7,
                height: 7,
                borderRadius: 3.5,
                marginRight: 8,
            }}/>}
            activeDot={<View style={{
                backgroundColor: '#FFFFFF',
                width: 9,
                height: 9,
                borderRadius: 4.5,
                marginRight: 8,
            }}/>}
        >
            {this.state.headerData.map(({ imageUrl, bannerId, url, linkType }, index) => (
                <View key={'key' + index} style={{ width: width - LEFTWIDTH - 16, height: 100 }}>
                    <TouchableOpacity
                        activeOpacity = {1}
                        style={{ flex: 1 }}
                        onPress={() => goBanner(this.state.headerData[index])}
                        // onPress={() => this.onPress()}
                    >
                        <Image
                            style={[{ resizeMode: 'stretch' }, { width: width - LEFTWIDTH - 16, height: 100 } ]}
                            source={{ uri: cutImgUrl(imageUrl, width - 90, 100) }}
                        />
                    </TouchableOpacity>
                </View>
            ))}
        </Swiper>
        </View> : <View />)
    }

    // tslint:disable-next-line:member-ordering
    public render(): JSX.Element {
        return (
            <View style={{ flex: 1 }}>
                <CustomNaviBar
                    // ref={(navbar) => this.navbar = navbar}
                    isCategory
                    navigation = {this.props.navigation}/>
                {/* <Text>Category</Text> */}
                <View style={styles.container}>
                    {/* tslint:disable-next-line:max-line-length */}
                    <FlatList
                        ref={(list) => this.list = list}
                        style={styles.leftList}
                        data={this.state.data}
                        ListFooterComponent={() => (<View style={{width: LEFTWIDTH, height: 34}}></View>)}
                        renderItem={this.renderItem}
                        keyExtractor={(item) => item.id}
                        extraData={this.state} />
                    <UltimateListView
                        key={this.state.selectItem}
                        style={styles.contentContainer}
                        header={this.state.showHeader && this.renderHeader}
                        footer={() => (<View style={{width, height: 34}}></View>)}
                        ref={(ref) => this.listView = ref}
                        onFetch={this.onFetch}
                        keyExtractor={(item, index) => `keys${index}`}
                        refreshableMode={Platform.OS === 'ios' ? 'advanced' : 'basic'}
                        item={this.renderUListItem}  // this takes two params (item, index)
                        numColumn={1} // to use grid layout, simply set gridColumn > 1
                        paginationAllLoadedView={() => <View />}
                        paginationFetchingView={() => <View />}
                    />
                </View>
            </View>
        );
    }
}

import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;

const isiPhoneX = (width === 375 && height === 812 && Platform.OS === 'ios');

const LEFTWIDTH = 90;
const RIGHTITEMWIDTH = (width - 90 - 2 - 16) / 3.0;
const barHeight = isiPhoneX ? 88 : 64;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Color.GREY_5,
    },
    viewForTextStyle: {
        height: 50,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'orange',
    },
    textStyle: {
        fontFamily: 'Cochin',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000',
    },
    leftList: {
        width: LEFTWIDTH,
        height: height - barHeight - 8,
        marginTop: 8,
    },
    leftRow: {
        width: LEFTWIDTH,
        height: 55,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: Color.GREY_5,
    },
    leftRowLine: {
        width: 3,
        height: 20,
        backgroundColor: '#2D69FA',
        marginRight: 5,
        marginLeft: 5,
    },
    leftNormalLine: {
        width: 3,
        height: 20,
        marginRight: 5,
        marginLeft: 5,
    },
    unselectedContainer: {
        backgroundColor: Color.WHITE
    },
    selectText: {
        color: Color.BLUE_1,
        fontSize: Font.NORMAL_1,
    },
    leftRowText: {
        color: '#333333',
        fontSize: 13,
        marginRight: 6,
    },
    contentContainer:{
        height: height - barHeight - 8,
        marginTop: 8,
        marginHorizontal: 8,
        width: width - LEFTWIDTH - 16,
        backgroundColor: Color.GREY_5,
    },
    rightRow: {
        width: width - LEFTWIDTH - 16,
        backgroundColor: Color.WHITE,
    },
    topView: {
        width: width - LEFTWIDTH - 16,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    rightTopLine: {
        width: 30,
        height: StyleSheet.hairlineWidth,
        backgroundColor: Color.GREY_1,
    },
    topText: {
        fontWeight: '300',
        fontSize: 13,
        marginLeft: 16,
        marginRight: 16,
        textAlign: 'center',
        color: Color.BLACK_1,
    },
    rightRowBottom: {
        width: width - LEFTWIDTH - 16,
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    rightRowItem: {
        width: RIGHTITEMWIDTH,
    },
});

// const mapStateToProps = (state) => ({
//     nav: state.nav
//   });
// const AppWithNavigationState = connect(mapStateToProps)(App);
export default Categories;
