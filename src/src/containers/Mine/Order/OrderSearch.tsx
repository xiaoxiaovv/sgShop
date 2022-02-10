import {
    View,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import * as React from 'react';
import { INavigation } from '../../../interface/index';
import {postAppJSON, getAppJSON} from '../../../netWork';
import Config from 'react-native-config';
import CustomNaviBar from '../../../components/customNaviBar';
import { UltimateListView } from 'rn-listview';
import OrderCard from './OrderCard';
import EStyleSheet from 'react-native-extended-stylesheet';

import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

interface IOrderSearchState {
    data: any[];
    keyword: string;
    isShowEmpty: boolean;
}

class OrderSearch extends React.Component<INavigation, IOrderSearchState> {

    private listView?: any;

    public constructor(props) {
        super(props);

        this.state = {
            data: null,
            keyword: '',
            isShowEmpty: true,
        };
    }

    public render(): JSX.Element {
        return (
            <View style={{backgroundColor: '#f1f1f1', flex: 1}}>
                {/* 自定义导航栏 */}
                <CustomNaviBar
                    navigation = { this.props.navigation }
                    hiddenLeftBtn = { false }
                    containerStyle = {{ backgroundColor: 'transparent' }}
                    showBottomLine = {true}
                    leftViewStyle = {{marginLeft: 5}}
                    local = { {leftStyle: {width: '22', height: '22'}}}
                    titleView = {
                        <View style={styles.searchBox}>
                            <Image source={require('../../../images/searchicon.png')}
                                style={styles.searchIcon}/>
                            <TextInput style={styles.inputText}
                                    underlineColorAndroid='transparent'
                                    placeholder='输入商品名、订单号、收货人、手机号'
                                    onChangeText={(text) => {
                                        this.setState({keyword: text});
                                    }}
                            />
                        </View>
                    }
                    rightView = {
                        <TouchableOpacity
                            activeOpacity = {0.7}
                            onPress={() => {
                                // 点击一次搜索后,在也不显示空界面视图了
                                this.setState({isShowEmpty: false});
                                // if (this.state.keyword === null || this.state.keyword === '') {
                                //     // 把''转换成null
                                //     this.setState({keyword: null},
                                //                 () => {
                                //                     try {
                                //                         this.listView.onRefresh();
                                //                     } catch (err) {
                                //                         Log(err);
                                //                     }
                                //                 });
                                //     alert('请输入搜索内容');
                                // } else {
                                    // 说明搜索关键字不为空
                                try {
                                    this.listView.onRefresh();
                                } catch (err) {
                                    Log(err);
                                }
                                // }
                            }}
                            >
                                <View style={{ flex: 1, height: '100%', alignContent: 'center',
                                                marginTop: 12 , marginRight: 10}}>
                                    <Text style={styles.searchText}>搜索</Text>
                                </View>
                        </TouchableOpacity>
                    }
                />
                {
                    !this.state.isShowEmpty &&
                    <UltimateListView
                        style={{paddingTop: 10, marginBottom: 10}}
                        ref={(ref) => this.listView = ref}
                        onFetch={this.onFetch}
                        keyExtractor={(item, index) => `keys${index}`}
                        refreshableMode='advanced'
                        item={this.renderUListItem}
                        numColumn={1}
                        paginationAllLoadedView={() => <View />}
                        paginationFetchingView={() => <View/>}
                        emptyView={() =>
                                // 未输入搜索内容显示的界面
                                    <View style={{ height, alignItems: 'center', top: -40}}>
                                        <Image
                                            style={{width: 0.7 * width, height: width * 0.7, marginTop: 10}}
                                            source = {require('../../../images/basket.png')}
                                        />
                                        <Text style={[{color: 'black'}, styles.textStyle]}>没有找到符合条件的订单</Text>
                                        <Text style={[{color: '#666', marginTop: 10}, styles.textStyle]}>换个条件再搜一下吧</Text>
                                    </View>
                        }/>
                }
            </View>
        );
    }
    private renderUListItem = (item, index) => {
        return (
            <OrderCard
            navigation = {this.props.navigation}
            item = {item}
            index = {index}
            superListView = {this.listView}
            />
        );
    }

    // 获取搜索的订单数据
    private onFetch = async ( page = 1, startFetch, abortFetch) => {
        try {
            const pageLimit = 5;
            // 获取订单数据
            const json = await getAppJSON(Config.ORDER_LIST, {
                keyword: this.state.keyword,
                orderFlag: 0,
                pageIndex: (page - 1),
                pageSize: 5,
            });
            // Log('zhaoxincheng', json.data.orders);
            this.setState({data: json.data.orders}, () => {startFetch(json.data.orders, pageLimit); });
        } catch (err) {
            abortFetch(); // manually stop the refresh or pagination if it encounters network error
            Log(err);
        }
    }

}

const styles = EStyleSheet.create({
    searchBox: {
        width: 0.7 * width,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 5,
        marginLeft: -10,
        marginTop: 2,
        marginBottom: 2,
        height: '36rem',
        borderRadius: 2,  // 设置圆角边
        backgroundColor: '#eaeaea',
    },
    searchIcon: {
        marginLeft: 6,
        marginRight: 6,
        resizeMode: 'stretch',
    },
    searchText: {
        color: 'black',
        fontSize: '$fontSize5',
    },
    inputText: {
        flex: 1,
        marginRight: 2,
        backgroundColor: 'transparent',
        fontSize: '14rem',
        height: '16rem',
        fontFamily: '.PingFangSC-Medium',
        color: '#666666',
        padding: 0,
      },
      textStyle: {
          fontSize: '$fontSize4',
      },
});

export default OrderSearch;
