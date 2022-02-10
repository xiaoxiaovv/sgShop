import * as React from 'react';
import { connect } from 'react-redux';
import { Tabs, List, WhiteSpace } from 'antd-mobile';
import {
    StyleSheet,
    Text,
    ScrollView,
    View,
    Image,
    Modal,
    FlatList,
    ActivityIndicator,
    TouchableWithoutFeedback,//加载指示器
    TouchableOpacity,
} from 'react-native';
import { getAppJSON } from '../../../netWork';
import { INavigation } from '../../../interface/index';
import CustomNaviBar from '../../../components/customNaviBar';
interface IState {
    Allgold: Array<{}>,
    showFoot: Number,
    AllgoldPage: Number,
    Comegold: Array<{}>,
    showFootC: Number,
    ComegoldPage: Number,
    Togold: Array<{}>,
    showFootT: Number,
    TogoldPage: Number,
    showModal: boolean
}
const tabs2 = [
    { title: '全部', sub: '0' },
    { title: '来源', sub: '1' },
    { title: '使用', sub: '2' },
];
let allpageNo = 1;//初始页码
let comepageNo = 1;//初始页码
let topageNo = 1;//初始页码
let allclickFlag = 1;//点击次数
let comeclickFlag = 1;//点击次数
let toclickFlag = 1;//点击次数
class MyGold extends React.Component<IState & INavigation> {
    public state: IState;
    constructor(props) {
        super(props);
        this.state = {
            Allgold: [],
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            AllgoldPage: 0,
            Comegold: [],
            showFootC: 0,
            ComegoldPage: 0,
            Togold: [],
            showFootT: 0,
            TogoldPage: 0,
            showModal: false
        }
    }
    public componentDidMount() {
        this.loadData(0, 1);
        allpageNo = 1; // 初始页码
        comepageNo = 1; // 初始页码
        topageNo = 1; // 初始页码
        allclickFlag = 1; // 点击次数
        comeclickFlag = 1; // 点击次数
        toclickFlag = 1; // 点击次数
    }

    public render(): JSX.Element {

        return (
            <View style={{ height: '100%' }}>
                <CustomNaviBar
                    navigation={this.props.navigation}
                    title="金币记录"
                    showBottomLine
                    rightImage={require('../../../images/moreCp.png')}
                    leftAction={()=>{this.props.navigation.goBack();}}
                    rightAction={this._onClick}
                />
                <Modal
                    animationType={"none"}
                    transparent={true}
                    visible={this.state.showModal}
                    onRequestClose={() => { alert("Modal has been closed.") }}
                >
                    <View style={{ backgroundColor: 'rgba(0,0,0,.2)', height: '100%', width: '100%' }}>
                        <TouchableWithoutFeedback onPress={() => this.closeModal()}>
                            <View style={{ height: '100%', width: '100%' }}>
                                <View style={{ flexDirection: 'column', position: 'absolute', right: 6, top: 65 }}>
                                    <View style={{
                                        width: 0,
                                        height: 0,
                                        backgroundColor: 'transparent',
                                        borderStyle: 'solid',
                                        borderLeftWidth: 12,
                                        borderRightWidth: 12,
                                        borderBottomWidth: 26,
                                        borderTopWidth: 12,
                                        borderLeftColor: 'transparent',
                                        borderRightColor: 'transparent',
                                        borderTopColor: 'transparent',
                                        borderBottomColor: '#fff',
                                        position: 'absolute',
                                        top: -24,
                                        right: 4,
                                    }}></View>
                                    <View style={{
                                        width: 118,
                                        height: 100,
                                        backgroundColor: '#fff',
                                        flexDirection: 'column',
                                    }}>
                                        <TouchableOpacity style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: 50,
                                        }} onPress={() => {
                                            this.setState({
                                                showModal: false
                                            })
                                            this.props.navigation.navigate('StoreHome', { storeId: dvaStore.getState().users.mid })
                                        }
                                        }>
                                            <Image source={{ uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/Store2x.png' }}
                                                style={{
                                                    width: 24,
                                                    height: 24,
                                                    margin: 6,
                                                }}
                                            />
                                            <Text>小店</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: 50,
                                        }}
                                            onPress={() => {
                                                this.setState({
                                                    showModal: false
                                                })
                                                this.props.navigation.navigate('MessageDetail')
                                            }
                                            }>
                                            <Image source={{ uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/Message2x.png' }}
                                                style={{
                                                    width: 24,
                                                    height: 24,
                                                    margin: 6,
                                                }}
                                            />
                                            <Text>消息</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </Modal>
                <Tabs tabs={tabs2}
                    initialPage={0}
                    tabBarBackgroundColor='transparent'
                    renderTab={tab => <Text>{tab.title}</Text>}
                    onTabClick={(tab, index) => this.pageOneDate(index, 1)}
                >
                    <View>
                        <FlatList
                            data={this.state.Allgold}
                            renderItem={this._renderItem}
                            ListFooterComponent={this._renderFooter.bind(this)}
                            onEndReached={this._onEndReached.bind(this)}
                            onEndReachedThreshold={0.1}
                        />
                    </View>
                    <View>
                        <FlatList
                            data={this.state.Comegold}
                            renderItem={this._renderItem}
                            ListFooterComponent={this._renderFooterC.bind(this)}
                            onEndReached={this._onEndReachedC.bind(this)}
                            onEndReachedThreshold={0.1}
                        />
                    </View>
                    <View>
                        <FlatList
                            data={this.state.Togold}
                            renderItem={this._renderItem}
                            ListFooterComponent={this._renderFooterT.bind(this)}
                            onEndReached={this._onEndReachedT.bind(this)}
                            onEndReachedThreshold={0.1}
                        />
                    </View>
                </Tabs>
            </View>

        );
    }
    private _onClick = () => {
        console.log('点击了图片')
        this.setState({
            showModal: true
        })
    }
    private closeModal() {
        console.log('点击了遮罩')
        this.setState({
            showModal: false
        })
    }
    private pageOneDate(type, startIndex) {
        if (type == 0 && allclickFlag == 2) {
            return;
        }
        if (type == 1 && comeclickFlag == 2) {
            return;
        }
        if (type == 2 && toclickFlag == 2) {
            return;
        }
        if (type == 0 && allclickFlag == 1) {
            this.loadData(type, startIndex);
            allclickFlag = 2;
        }
        if (type == 1 && comeclickFlag == 1) {
            this.loadData(type, startIndex);
            comeclickFlag = 2;
        }
        if (type == 2 && toclickFlag == 1) {
            this.loadData(type, startIndex);
            toclickFlag = 2;
        }
    }
    private async loadData(type, startIndex) {
        switch (type) {
            case 0:
                Log(type);
                const res = await getAppJSON(
                    '/v3/mstore/sg/credit/findCreditDetail.html',
                    {
                        searchType: type,
                        startIndex: startIndex,
                        pageSize: 9,
                    },
                    {},
                    true,
                );

                if (res.success && res.data && res.data.rows) {
                    //消除其它标签跳转至全部重复加载数据问题
                    if(startIndex == 1){
                        this.setState({
                            Allgold:[]
                        });
                    }
                    this.setState({
                        Allgold: this.state.Allgold.concat(res.data.rows),
                        AllgoldPage: res.data.total / res.data.pageSize
                    });
                }
                if (startIndex >= (res.data.total / res.data.pageSize)) {
                    this.setState({
                        showFoot: 1
                    })//listView底部显示没有更多数据了
                } else {
                    this.setState({
                        showFoot: 0
                    })
                }
                break;
            case 1:
                const resC = await getAppJSON(
                    '/v3/mstore/sg/credit/findCreditDetail.html',
                    {
                        searchType: type,
                        startIndex: startIndex,
                        pageSize: 9,
                    },
                    {},
                    true,
                );

                if (resC.success && resC.data && resC.data.rows) {
                    this.setState({
                        Comegold: this.state.Comegold.concat(resC.data.rows),
                        ComegoldPage: resC.data.total / resC.data.pageSize
                    });
                }
                if (startIndex >= (resC.data.total / resC.data.pageSize)) {
                    this.setState({
                        showFootC: 1
                    })//listView底部显示没有更多数据了
                } else {
                    this.setState({
                        showFootC: 0
                    })
                };
                break;
            case 2:
                const resT = await getAppJSON(
                    '/v3/mstore/sg/credit/findCreditDetail.html',
                    {
                        searchType: type,
                        startIndex: startIndex,
                        pageSize: 9,
                    },
                    {},
                    true,
                );

                if (resT.success && resT.data && resT.data.rows) {
                    this.setState({
                        Togold: this.state.Togold.concat(resT.data.rows),
                        TogoldPage: resT.data.total / resT.data.pageSize
                    });
                }
                if (startIndex >= (resT.data.total / resT.data.pageSize)) {
                    this.setState({
                        showFootT: 1
                    })//listView底部显示没有更多数据了
                } else {
                    this.setState({
                        showFootT: 0
                    })
                }
        }

    }
    private _renderItem = ({ item }) => (
        <View style={{ height: 66, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', width: '100%', borderBottomWidth: 0.5, borderBottomColor: '#ccc', paddingLeft: '5%', paddingRight: '5%' }}>
            <View>
                <Text style={{ marginTop: 13, marginBottom: 8, fontSize: 16, width: 230, }} numberOfLines={1}>{item.desc}</Text>
                <Text style={{ fontSize: 13, opacity: 0.5 }}>{item.operTimeStr}</Text>
            </View>
            <View>
                <Text style={{ marginTop: 13, fontSize: 16 }}>{item.creditNumWithSign}</Text>
            </View>

        </View>
    );
    private _renderFooter() {
        if (this.state.showFoot === 1 && this.state.Allgold) {
            return (
                <View style={{ height: 30, alignItems: 'center', justifyContent: 'flex-start', }}>
                    <Text style={{ color: '#999999', fontSize: 13, marginTop: 5, marginBottom: 5, }}>
                        没有更多数据了
                    </Text>
                </View>
            );
        } else if (this.state.showFoot === 2) {
            return (
                <View>
                    <ActivityIndicator
                        animating={true}
                        size="small"
                    />
                </View>
            );
        } else if (this.state.showFoot === 0 || !this.state.Allgold) {
            return (
                <View>
                    <Text></Text>
                </View>
            );
        }
    }
    private _renderFooterC() {
        if (this.state.showFootC === 1 && this.state.Comegold) {
            return (
                <View style={{ height: 30, alignItems: 'center', justifyContent: 'flex-start', }}>
                    <Text style={{ color: '#999999', fontSize: 13, marginTop: 5, marginBottom: 5, }}>
                        没有更多数据了
                    </Text>
                </View>
            );
        } else if (this.state.showFootC === 2) {
            return (
                <View>
                    <ActivityIndicator
                        animating={true}
                        size="small"
                    />
                </View>
            );
        } else if (this.state.showFootC === 0 || !this.state.Comegold) {
            return (
                <View>
                    <Text></Text>
                </View>
            );
        }
    }
    private _renderFooterT() {
        if (this.state.showFootT === 1 && this.state.Togold) {
            return (
                <View style={{ height: 30, alignItems: 'center', justifyContent: 'flex-start', }}>
                    <Text style={{ color: '#999999', fontSize: 13, marginTop: 5, marginBottom: 5, }}>
                        没有更多数据了
                    </Text>
                </View>
            );
        } else if (this.state.showFootT === 2) {
            return (
                <View>
                    <ActivityIndicator
                        animating={true}
                        size="small"
                    />
                </View>
            );
        } else if (this.state.showFootT === 0 || !this.state.Togold) {
            return (
                <View>
                    <Text></Text>
                </View>
            );
        }
    }
    private _onEndReached() {
        //如果是正在加载中或没有更多数据了，则返回
        if (this.state.showFoot !== 0) {
            return;
        }
        if (this.state.AllgoldPage === 0) {
            return;
        }
        // 如果当前页大于或等于总页数，那就是到最后一页了，返回
        if ((allpageNo !== 1) && (allpageNo >= this.state.AllgoldPage)) {
            return;
        } else {
            allpageNo++;
        }
        //底部显示正在加载更多数据
        this.setState({ showFoot: 2 });
        //获取数据
        this.loadData(0, allpageNo);
    }
    private _onEndReachedC() {
        //如果是正在加载中或没有更多数据了，则返回
        if (this.state.showFootC != 0) {
            return;
        }
        if (this.state.ComegoldPage === 0) {
            return
        }
        //如果当前页大于或等于总页数，那就是到最后一页了，返回
        if ((comepageNo !== 1) && (comepageNo >= this.state.ComegoldPage)) {
            return;
        } else {
            comepageNo++;
        }
        //底部显示正在加载更多数据
        this.setState({ showFootC: 2 });
        //获取数据
        this.loadData(1, comepageNo);
    }
    private _onEndReachedT() {
        //如果是正在加载中或没有更多数据了，则返回
        if (this.state.showFootT !== 0) {
            return;
        }
        if (this.state.TogoldPage === 0) {
            return
        }
        //如果当前页大于或等于总页数，那就是到最后一页了，返回
        if ((topageNo !== 1) && (topageNo >= this.state.TogoldPage)) {
            return;
        } else {
            topageNo++;
        }
        //底部显示正在加载更多数据
        this.setState({ showFootT: 2 });
        //获取数据
        this.loadData(2, topageNo);
    }
}

export default MyGold;