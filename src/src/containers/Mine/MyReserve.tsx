import * as React from 'react';
import {Tabs} from 'antd-mobile';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
    Modal,
    TouchableOpacity, Platform,
} from 'react-native';
import {UltimateListView} from 'rn-listview';
import {getAppJSON} from '../../netWork';
import {NavigationScreenProp} from 'react-navigation';
import {connect, createAction} from '../../utils';
import moment from 'moment';
import {ICustomContain} from '../../interface';
import CountDownText from '../../components/CountDown/CountDownText';
import {MessageWithBadge} from '../../components/MessageWithBadge';
import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
import {NavBar, SafeView} from './../../components';
import Header from '../../components/Header';

/**
 * 我的预约
 */
@connect(({mine, users: {userName: user, mid: storeId, unread, gameId}}) => ({mine, user, storeId, unread, gameId}))
class MyReserve extends React.Component<ICustomContain> {
    public static navigationOptions = ({navigation, screenProps}) => {
        return {
            header: <Header
                goBack={() => navigation.goBack()}
                title="我的预约">
                <View style={{position: 'absolute', right: 0}}>
                    <MessageWithBadge
                        navigation={navigation}
                        badgeContainStyle={{top: 3, right: -3}}
                        unread={screenProps.unread}
                        isWhite={false}
                        badgeContainStyle={{top: 3, right: -3}}
                        imageStyle={{width: 22, height: 22}}
                        hidingText={true}
                    />
                </View>
            </Header>
        }
    };

    settime = ()=>{

    };
    // 获取预约商品数据
    private onFetch = async (page = 1, startFetch, abortFetch) => {
        // startFetch([], 100);
        try {
            const param = 'pageIndex=' + page;
            const url = 'sg/cms/reserve/myReserve.json?' + param;
            const {success, data} = await getAppJSON(url);
            if (!success) {
                abortFetch();
                return;
            } else {
                // let products;
                // products = data.productsList;
                // Log('====products======');
                // Log(data);
                // let bb = {
                //     id : 225,
                //     imageUrl: "http://cdn02.ehaier.com/product/59b61f310b575a8b3500000f.jpg",
                //     name: "XRWA006",
                //     price: 4,
                //     productId: 1000018,
                //     productName: "凯儿得乐 百货超市 XRWA006",
                //     productTitle: "副标题",
                //     purchaseEndTime: 1524143688000,
                //     purchaseStartTime: 1523604600000,
                //     reserveTime: 1523511612000,
                //     sku: "XRWA006" };
                // startFetch([bb, bb], 100);
                startFetch(data, 100);
            }
        } catch (err) {
            abortFetch();
            Log(err);
        }
    };
    private afterEnd = () => {
        console.log('-----afterEnd------');
        this.timer = setTimeout(()=>{
            this.listView.refresh();
        }, 5000);
    };

    componentWillUnmount (){
        this.timer && clearTimeout(this.timer);
    }

    private renderGListItem = (item, index) => {
        return (
            <GoodCard
                key={index}
                item={item}
                index={index}
                afterEnd={this.afterEnd}
                handlePress={this.handleGoodPress }
            />
        );
    };

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            now: new Date().getTime(),
        };
      }


    public render(): JSX.Element {
        return (
            <View style={{flex: 1}}>
                <UltimateListView
                    style={{paddingTop: 10, marginBottom: 10}}
                    onFetch={this.onFetch}
                    keyExtractor={(item, index) => `keys${index}`}
                    refreshableMode={Platform.OS === 'ios' ? 'advanced' : 'basic'}
                    item={this.renderGListItem}
                    ref={(ref) => this.listView = ref}
                    numColumn={1}
                    emptyView={() =>
                        <View style={{height, alignItems: 'center', flexDirection: 'column', marginTop: 50}}>
                            <Image style={{width: 120, height: 120, resizeMode: 'contain', alignSelf: 'center'}}
                                   source={require('../../images/ic_reserve_null.png')}/>
                            <Text style={{color: '#666', fontSize: 16, marginTop: 20, textAlign: 'center'}}>
                                您暂时还没有关注的项目，去预约首页逛逛吧。</Text>
                            <TouchableWithoutFeedback onPress={() => {
                                this.props.navigation.navigate('NewReservations');
                            }}>
                                <View style={{width: 190, height: 40, flexDirection: 'row', marginTop: 20}}>
                                    <View style={styles.circle}/>
                                    <View style={{
                                        height: 40, width: 150, position: 'absolute', left: 20,
                                        backgroundColor: '#307dfb', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Text style={{color: 'white', fontSize: 16}}>去逛逛</Text>
                                    </View>
                                    <View style={[styles.circle, {position: 'absolute', left: 150}]}/>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    }/>
            </View>
        );
    }

    private handleGoodPress = (item) => {
        this.props.navigation.navigate('GoodsDetail', {productId: item.productId});
        // alert('进入商品' + item.productId);
    }

}
const mwidth = width * 0.25;
const Swidth = width;
const GoodCard = ({item, index, handlePress, afterEnd}) => {
    console.log(moment(item.purchaseStartTime).format('YYYY/M/D H:m:s'));
    console.log(moment(item.purchaseEndTime).format('YYYY/M/D H:m:s'));

    return <TouchableWithoutFeedback onPress={() => {
        handlePress(item);
    } }>
        <View style={{height: 160, backgroundColor: '#fff', borderBottomColor: '#e4e4e4', borderBottomWidth: 1}}>
            <View style={{
                height: 120,
                marginHorizontal: 15,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Image
                    style={{
                        width: mwidth, height: mwidth, resizeMode: 'contain',
                        backgroundColor: 'lightgrey'
                    }}
                    source={{uri: item.imageUrl}}
                />
                <View style={{marginLeft: 15}}>
                    <Text style={{fontSize: 15, marginBottom: 15, maxWidth: Swidth - mwidth - 48 }} numberOfLines={3}>{item.productName}</Text>
                    <Text style={{fontSize: 12, marginBottom: 15, color: '#666'}}>预约价: <Text
                        style={{color: '#F40'}}>¥{item.price}</Text> 元</Text>
                    {item.purchaseEndTime > new Date().getTime() ?
                        (item.purchaseStartTime > new Date().getTime() ? <Text style={{fontSize: 12, color: '#666'}}>{'距开抢: '}<CountDownText
                            key={'purchaseStartTime'}
                            countType={'date'} // 计时类型：seconds / date
                            auto={true} // 自动开始
                            afterEnd={afterEnd} // 结束回调
                            // timeLeft={10} // 正向计时 时间起点为0秒
                            step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                            startTime={moment().format('YYYY/M/D H:m:s')}
                            endTime={moment(item.purchaseStartTime).format('YYYY/M/D H:m:s')}
                            startText='' // 开始的文本
                            endText='00天00时00分00秒' // 结束的文本
                            intervalText={(date, hour, min, sec) => date + '天' + hour + '时' + min + '分' + sec} // 定时的文本回调
                        /></Text> : <Text style={{fontSize: 12, color: '#666'}}>{'距结束: '}{<CountDownText
                            key={'purchaseEndTime'}
                            countType={'date'} // 计时类型：seconds / date
                            auto={true} // 自动开始
                            afterEnd={afterEnd} // 结束回调
                            // timeLeft={10} // 正向计时 时间起点为0秒
                            step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                            startTime={moment().format('YYYY/M/D H:m:s')}
                            endTime={moment(item.purchaseEndTime).format('YYYY/M/D H:m:s')}
                            startText='' // 开始的文本
                            endText='00天00时00分00秒' // 结束的文本
                            intervalText={(date, hour, min, sec) => date + '天' + hour + '时' + min + '分' + sec} // 定时的文本回调
                        />}</Text>) : <Text style={{fontSize: 12, color: '#666'}}>已结束</Text>
                    }
                </View>
            </View>
            { item.purchaseEndTime > new Date().getTime() ? <View style={{height: 35, alignItems: 'flex-end', justifyContent: 'center'}}>
                <View style={{
                    height: 25,
                    paddingHorizontal: 20,
                    paddingVertical: 5,
                    backgroundColor: '#F40',
                    marginRight: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 30
                }}>
                    <Text style={{
                        color: '#fff',
                        fontSize: 12
                    }}>{item.purchaseStartTime > new Date().getTime() ? '待抢购' : '立即抢购'}</Text>
                </View>
            </View>:null}
        </View>
    </TouchableWithoutFeedback>
};

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    subtitle: {
        marginTop: 10,
        marginRight: 30,
        fontSize: 12,
    },
    line: {
        height: 0.5,
        backgroundColor: 'gray',
    },
    price: {
        color: 'red',
    },
    circle: {
        width: 40,
        height: 40,
        backgroundColor: '#307dfb',
        borderRadius: 20,
    },
});
export default MyReserve;
