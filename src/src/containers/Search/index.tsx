import * as React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    DeviceEventEmitter,
    AsyncStorage,
    ToastAndroid,
    TouchableWithoutFeedback,
} from 'react-native';
import SearchTopBar from './SearchTopBar';
import HistoryListHeader from './HistoryListHeader';
import EStyleSheet from 'react-native-extended-stylesheet';
import {INavigation} from '../../interface/index';
import {IS_NOTNIL} from '../../utils/index';
import {connect} from 'react-redux';
import sqzbs3 from './../../images/sqzbs3.jpg';
import {createAction} from '../../utils';
import { goToSQZBS } from '../../utils/tools';
import { fetchHotSearch } from '../../dvaModel/searchModel';
import {Color, Font} from 'consts';
import SelectBar from 'rn-select-bar';

import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

@connect()
class Search extends React.Component<INavigation> {
    public barContent = ['商品', '店铺'];
    public listener: any;
    public state = {
        data: [],
        hotSearchData: [],
        pageIndex: 0,
    };

    public constructor(props) {
        super(props);
        this.mgetHistory = this.getHistoty.bind(this);
    }

    public async componentDidMount() {
        const jso = await fetchHotSearch();
        let json = [];
        if (jso) {
            this.setState({ hotSearchData: jso });
            json = jso;
        }
        this.getHistoty();
        this.listener = DeviceEventEmitter.addListener('mhistory', () => {
            this.getHistoty();
        });
    }

    public render(): JSX.Element {
        return (<View style={styles.container}>
            {!this.props.noBar &&<SearchTopBar {...this.props.navigation} pageIndex={this.state.pageIndex}/>}
            {!this.props.noBar &&
                <TouchableWithoutFeedback  onPress={()=>{goToSQZBS();}} >
                    <Image style={{width: width, height: 0.32*width}} source={sqzbs3}/>
                </TouchableWithoutFeedback>
            }
            {!this.props.noBar &&
            <SelectBar
                style={styles.barStyle}
                selectTitleStyle={styles.selectTitleStyle}
                normalTitleStyle={styles.normalTitleStyle}
                selectLineStyle={styles.selectLineStyle}
                content={this.barContent}
                selectedItem={this.barContent[this.state.pageIndex]}
                onPress={(item, index) => {
                    this.setState({ pageIndex: index });
                }}
            />
            }
            <View style={{ width:"100%", backgroundColor: 'white'}}>
                <Text style={styles.titleHot}>热门搜索</Text>
                <View style={styles.containerHot}>
                    {
                        this.state.hotSearchData.map(({ hot_word }, index) => (
                            <TouchableOpacity
                                key={`key-${index}`}
                                style={styles.itemHot}
                                onPress={() => {
                                    this.props.dispatch(createAction('store/resetFirstOption')({hasStock: 0}));
                                    this.goSearch(hot_word);
                                }}
                            >
                                <Text style={styles.itemfontHot}>{hot_word}</Text>
                            </TouchableOpacity>))
                    }
                </View>
            </View>
            <FlatList
                ListHeaderComponent={() => <HistoryListHeader {...this.props} />}
                keyExtractor={(item, index) => {return index}}
                data={this.state.data}
                renderItem={({item}) => {
                    if (!IS_NOTNIL) {
                        return null;
                    }
                    return (
                        <TouchableOpacity
                            style={styles.item}
                            onPress={() => {
                                this.props.dispatch(createAction('store/resetFirstOption')({hasStock: 0}));
                                let mstate = this.state.data.reverse();//[3,1,2] [2,1,3]
                                // 去重
                                let tmpObj = {};
                                let myresult = [];
                                Log('打印出最后dsf数组');
                                mstate.forEach((a) => {
                                    if (IS_NOTNIL(a) && a !== '') {
                                        let key = (typeof a) + a;
                                        if (!tmpObj[key]) {
                                            tmpObj[key] = true;
                                            myresult.push(a);
                                        }
                                    }
                                });

                                let value;
                                let itemValue = item;
                                let isStoreSearch = false;
                                if(item.indexOf('\"')==0 && item.lastIndexOf('\"店铺') > 0){
                                    value = item;
                                    itemValue = item.substring(item.indexOf('\"')==0, item.lastIndexOf('\"店铺'));
                                    isStoreSearch = true;
                                }else{
                                    value = this.state.pageIndex == 1 ? '\"' + item +'\"店铺' : item;
                                }

                                // [1,2,3] [3,1,2]
                                const mindex = myresult.findIndex((myitem) => myitem == value);
                                if (mindex !== -1) {
                                    myresult.splice(mindex, 1);
                                }

                                myresult.push(value);
                                Log('打印出最后数组' + JSON.stringify(myresult));
                                AsyncStorage.setItem('history', JSON.stringify(myresult), () => {
                                    DeviceEventEmitter.emit('mhistory');
                                    this.props.navigation.navigate('GoodsList',
                                        {
                                            searchKey: itemValue,
                                            keyword: itemValue,
                                            pageIndex: isStoreSearch ? 2 : this.state.pageIndex + 1,
                                        }
                                    );
                                });
                            }
                            }
                        >
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={styles.itemText}>{item}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                ListEmptyComponent={() =>
                    <View style={styles.emptyRecordContainer}>
                        <Image resizeMode='contain' style={styles.emptyRecordImage} source={require('../../images/history_empty.png')}/>
                        <Text style={styles.emptyRecordText}>暂无搜索记录</Text>
                    </View>
                }
                ItemSeparatorComponent={() => <View style={styles.line}/>}
            />
        </View>);
    }

    private componentWillUnmount() {
        if(this.listener){
            this.listener.remove();
        }
    }

    public goSearch = (originValue) => {
        let value = this.state.pageIndex == 1 ? '\"'+originValue+'\"店铺' : originValue;
        const history = this.state.data;
        // 去重
        let tmpObj = {};
        let myresult = [];
        history.forEach((a) => {
            if (IS_NOTNIL(a) && a !== '') {
                let key = (typeof a) + a;
                if (!tmpObj[key]) {
                    tmpObj[key] = true;
                    myresult.push(a);
                }
            }
        });
        const mindex = myresult.findIndex((myitem) => myitem == value);
        if (mindex !== -1) {
            myresult.splice(mindex, 1);
        }
        myresult.push(value);
        AsyncStorage.setItem('history', JSON.stringify(myresult), () => {
            DeviceEventEmitter.emit('mhistory');
            this.props.navigation.navigate('GoodsList',
                { searchKey: originValue, keyword: originValue, pageIndex: this.state.pageIndex + 1});
        });
    };

    // tslint:disable-next-line:align
    private getHistoty() {
        // tslint:disable-next-line:no-empty
        AsyncStorage.getItem('history', (error, result) => {
            if (!error) {
                if (result === null) {
                    this.setState({data: []});
                } else {
                    const json = eval('(' + result + ')');
                    // 去重
                    let tmpObj = {};
                    let myresult = json;
                    myresult = myresult.reverse();
                    if (myresult.length > 10) {
                        myresult = myresult.slice(0, 10);
                    }
                    this.setState({data: myresult});
                }
            }
        });
    }
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        width: width,
        backgroundColor: 'white',
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
        backgroundColor: Color.GREY_4,
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    item: {
        height: 40,
        justifyContent: 'center',
        marginLeft: 10,
        marginRight: 15,
    },
    itemText: {
        height: 40,
        lineHeight: 40,
        fontSize: Font.NORMAL_1,
        color: Color.GREY_1,
    },
    emptyRecordContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
        marginBottom: 100,
    },
    emptyRecordImage:{
        height: 97,
        width: 124,
    },
    emptyRecordText: {
        textAlign: 'center',
        marginTop: 11,
        color: Color.GREY_2,
        fontSize: Font.NORMAL_1,
    },
    containerHot: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: 'white',
        marginBottom: 10,
    },
    itemHot: {
        backgroundColor: Color.GREY_7,
        margin: 4,
        paddingLeft: '10rem',
        paddingRight: '10rem',
        paddingBottom: '5rem',
        paddingTop: '5rem',
        borderRadius: '5rem',
    },
    titleHot: {
        fontSize: '16rem',
        color: '#333333',
        margin: '10rem',
        marginTop: 14,
    },
    itemfontHot: {
        fontSize: Font.NORMAL_2,
        color: Color.BLACK_1,
    },
});
export default Search;
