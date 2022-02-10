import * as React from 'react';
import {
    View,
    TouchableOpacity,
    Text, StyleSheet,
    Image,
    TextInput,
    AsyncStorage,
    DeviceEventEmitter,
    NativeModules, Keyboard,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Toast } from 'antd-mobile';
import {Color} from 'consts';
import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

interface ISearchProps {
    goBack: () => void;
    state: any;
}
class SearchTopBar extends React.Component<ISearchProps> {
    public state = {
        searchKey: '',
        searchPlaceholder: 'Haier',
        history: [],
    };
    private listener: any;
    public componentDidMount() {
        const { state } = this.props;
        const { params } = state;
        AsyncStorage.getItem('history', (eeror, result = '[]') => {
            try {
                if (result === null) {
                    this.setState({ history: [] });
                } else {
                    const json = eval('(' + result + ')');
                    this.setState({ history: json });
                }
            } catch (error) {
                Log(error);
            }
        });
        this.listener = DeviceEventEmitter.addListener('mhistory', () => {
            AsyncStorage.getItem('history', (eeror, result = '[]') => {
                try {
                    if (result === null) {
                        this.setState({ history: [] });
                    } else {
                        const json = eval('(' + result + ')');
                        this.setState({ history: json });
                    }
                } catch (error) {
                    Log(error);
                }
            });
        });
        this.setState({searchKey: params.searchKey ? params.searchKey : ''});
        this.setState({searchPlaceholder: dvaStore.getState().home.defaultSearchHotWord});
    }
    public render(): JSX.Element {
        const { state } = this.props;
        const { params } = state;
        return (
            <View style={styles.container}>
                <View style={{
                    flexDirection: 'row',
                    flex: 1,
                    borderBottomWidth: 0.2,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {this.props.goBack();}}
                        style={styles.backContainer}
                    >
                        <Image
                            source={require('../../images/icon_back_gray.png')}
                            style={{ height: 24, width: 24}}
                        />
                    </TouchableOpacity>
                    <View style={styles.searchBox}>
                        <Image
                            source={require('./../../images/search.png')}
                            style={styles.searchIcon}
                        />
                        <TextInput
                            style={styles.inputText}
                            underlineColorAndroid='transparent'
                            onChange={(event) => this.setState({ searchKey: event.nativeEvent.text })}
                            placeholder={this.state.searchPlaceholder}
                            placeholderTextColor={Color.GREY_2}
                            value={this.state.searchKey}
                            returnKeyType={'search'}
                            onSubmitEditing={()=>{
                                Keyboard.dismiss();
                                const mykey = this.state.searchKey ? this.state.searchKey : this.state.searchPlaceholder;
                                if (!IS_NOTNIL(mykey)) {
                                    Toast.show('请输入搜索内容');
                                    return;
                                }
                                if (mykey.length === 0) {
                                    Toast.show('请输入搜索内容');
                                } else {
                                    let keyValue = this.props.pageIndex == 1 ? '\"' + mykey+'\"店铺' : mykey;
                                    let mstate = this.state.history;
                                    // 去重
                                    let tmpObj = {};
                                    let myresult = [];
                                    mstate.forEach( (a) => {
                                        if (IS_NOTNIL(a) && a!=='') {
                                            let key = (typeof a) + a;
                                            if (!tmpObj[key]) {
                                                tmpObj[key] = true;
                                                myresult.push(a);
                                            }
                                        }
                                    });
                                    const mindex = myresult.findIndex((item)=> item == keyValue);
                                    if (mindex !== -1) {
                                        myresult.splice(mindex,1);
                                    }
                                    Log('打印出最后数组'+JSON.stringify(myresult)+mindex);
                                    myresult.push(keyValue);
                                    Log('打印出最后数组'+JSON.stringify(myresult));

                                    this.setState({ history: myresult }, () => {
                                        AsyncStorage.setItem('history', JSON.stringify(myresult), () => {
                                            DeviceEventEmitter.emit('mhistory');
                                        });
                                        this.props.navigate('GoodsList',
                                            {
                                                searchKey: mykey,
                                                keyword: mykey,
                                                pageIndex: this.props.pageIndex > 0 ? (this.props.pageIndex + 1) : 1,
                                            }
                                        );
                                        // gio 商品搜索 埋点 yl
                                        if(mykey){
                                            NativeModules.StatisticsModule.setEvar({
                                                source: 'Search',
                                                value: mykey
                                            });
                                        }
                                    });

                                }
                            }}
                        />
                    </View>
                    <TouchableOpacity
                        style={{ marginRight: 16 }}
                        onPress={() => {
                            Keyboard.dismiss();
                            const mykey = this.state.searchKey ? this.state.searchKey : this.state.searchPlaceholder;
                            if (!IS_NOTNIL(mykey)) {
                                Toast.show('请输入搜索内容');
                                return;
                            }
                            if (mykey.length === 0) {
                                Toast.show('请输入搜索内容');
                            } else {
                                let keyValue = this.props.pageIndex == 1 ? '\"' + mykey+'\"店铺' : mykey;
                                let mstate = this.state.history;
                                // 去重
                                let tmpObj = {};
                                let myresult = [];
                                mstate.forEach( (a) => {
                                    if (IS_NOTNIL(a) && a!=='') {
                                        let key = (typeof a) + a;
                                        if (!tmpObj[key]) {
                                            tmpObj[key] = true;
                                            myresult.push(a);
                                        }
                                    }
                                });
                                const mindex = myresult.findIndex((item)=> item == keyValue);
                                if (mindex !== -1) {
                                    myresult.splice(mindex,1);
                                }
                                Log('打印出最后数组'+JSON.stringify(myresult)+mindex);
                                myresult.push(keyValue);
                                Log('打印出最后数组'+JSON.stringify(myresult));

                                this.setState({ history: myresult }, () => {
                                    AsyncStorage.setItem('history', JSON.stringify(myresult), () => {
                                        DeviceEventEmitter.emit('mhistory');
                                    });
                                    this.props.navigate('GoodsList',
                                        {
                                            searchKey: mykey,
                                            keyword: mykey,
                                            pageIndex: this.props.pageIndex > 0 ? (this.props.pageIndex + 1) : 1,
                                        }
                                    );
                                    // gio 商品搜索 埋点 yl
                                    if(mykey){
                                        NativeModules.StatisticsModule.setEvar({
                                            source: 'Search',
                                            value: mykey
                                        });
                                    }
                                });

                            }
                        }}
                    >
                        <Text style={{color: '#999999'}}>搜索</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = EStyleSheet.create({
    container: {
        height: 64,
        width: '100%',
        backgroundColor: 'white',
        paddingTop: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: 'lightgray',
        '@media (width:375) and (height:812)': {
            height: 84,
            paddingTop: 40,
        },
        '@media android': {
            height: 44,
            paddingTop: 0,
        },

    },
    backContainer: {
        paddingLeft: 16,
        paddingVertical: 5,
        paddingRight: 10,
        marginRight: -10,
    },
    searchBox: {
        width: 0.7 * width,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
        marginTop: 8,
        marginBottom: 8,
        height: 28,
        borderRadius: 15,  // 设置圆角边
        backgroundColor: Color.GREY_6,
    },
    searchIcon: {
        marginLeft: 6,
        marginRight: 6,
        height: 24,
        width: 24,
        resizeMode: 'contain',
    },
    inputText: {
        flex: 1,
        marginRight: 2,
        backgroundColor: 'transparent',
        fontSize: 14,
        // fontFamily: '.PingFangSC-Medium',
        color: Color.GREY_2,
        padding: 0,
    },
});
export default SearchTopBar;
