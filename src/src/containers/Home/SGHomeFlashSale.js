import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,   // 点击时有透明度变化
    FlatList,
    Dimensions,
    ScrollView,
    NativeModules,
    DeviceEventEmitter
} from 'react-native';
import ScreenUtil from './SGScreenUtil';
import {connect} from 'react-redux';
import {Color, Font} from 'consts';
import {GET} from './../../config/Http';
import url from './../../config/url';
import Separator from '../../components/Separator';
import { toFloat } from '../../utils/MathTools';
import StorePrice from './StorePrice';

const {width, height} = Dimensions.get('window');
const mapStateToProps = ({
                             address: {
                                 regionName,
                                 provinceId,
                                 cityId,
                                 areaId,
                                 streetId,
                             },
                             users: {
                                 userId,
                                 mid,
                                 unread,
                                 CommissionNotice,
                                 isHost,
                             },
                         }) => ({
    regionName, provinceId, cityId, areaId, streetId,
    userId, mid, unread, CommissionNotice, isHost,
});
@connect(mapStateToProps)
export default class SGHomeFlashSale extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            list: [],
            systemTime: "",
            index: 0,
            timer: null,//定时器
            leadTime: 0,//本地时间和服务器的时间差
            hour: "00",//小时
            minute: "00",//分钟
            second: "00",//秒
            endTime: null,
        };
        this.endTimeValue;
        this.leadTimeValue;
    }

    componentWillUnmount() {
        if (this.state.timer) {
            clearInterval(this.state.timer);
            this.state.timer = null;
        }

        if (this.listener) {
            this.listener.remove();
        }
    }

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener('update_flash_sale',
            () => {this.getData();});
        this.state.timer = setInterval(this.upTime, 2000);
        this.getData();
    };

    upTime = () => {
        if (this.endTimeValue) {
            // let sysTime = new Date().getTime() - this.state.leadTime;
            // let lead = parseInt((this.state.endTime - sysTime) / 1000);

            let sysTime = new Date().getTime() - this.leadTimeValue;
            let lead = parseInt((this.endTimeValue - sysTime) / 1000);
            if (lead > 0) {
                // const second = lead % 60;
                // lead -= second;
                // let minute = lead % 3600;
                // lead -= minute;
                // minute /= 60;
                // const hour = lead / 3600;
                /*this.setState({
                    hour: hour < 10 ? "0" + hour : hour,//小时
                    minute: minute < 10 ? "0" + minute : minute,//分钟
                    second: second < 10 ? "0" + second : second,//秒
                })*/
            } else {
                this.state.endTime = null;
                this.endTimeValue = null;
                this.leadTimeValue= null;
                this.getData();
            }
        }
    };

    formatDate(str, formatStr) {
        let t;
        if (str instanceof Date) {
            t = str;
        } else {
            t = new Date(str);
        }
        str = formatStr;
        let Week = ['日', '一', '二', '三', '四', '五', '六'];
        str = str.replace(/yyyy|YYYY/, t.getFullYear());
        str = str.replace(/yy|YY/, (t.getYear() % 100) > 9 ? (t.getYear() % 100).toString() : '0' + (t.getYear() % 100));

        str = str.replace(/MM/, (t.getMonth() + 1) > 9 ? (t.getMonth() + 1).toString() : '0' + (t.getMonth() + 1));
        str = str.replace(/M/g, (t.getMonth() + 1));

        str = str.replace(/w|W/g, Week[t.getDay()]);

        str = str.replace(/dd|DD/, t.getDate() > 9 ? t.getDate().toString() : '0' + t.getDate());
        str = str.replace(/d|D/g, t.getDate());

        str = str.replace(/hh|HH/, t.getHours() > 9 ? t.getHours().toString() : '0' + t.getHours());
        str = str.replace(/h|H/g, t.getHours());
        str = str.replace(/mm/, t.getMinutes() > 9 ? t.getMinutes().toString() : '0' + t.getMinutes());
        str = str.replace(/m/g, t.getMinutes());

        str = str.replace(/ss|SS/, t.getSeconds() > 9 ? t.getSeconds().toString() : '0' + t.getSeconds());
        str = str.replace(/s|S/g, t.getSeconds());

        return str;
    }

    getData = async () => {
        try {
            let data;
            if (this.props.from === 2) {
                data = await GET(url.SPECIALTY_FALSHSALES, {
                    provinceId: this.props.provinceId,
                    cityId: this.props.cityId,
                    districtId: this.props.areaId,
                    streetId: this.props.streetId,
                });
            } else {
                data = await GET(url.HOMEPAGE_FALSHSALES, {
                    provinceId: this.props.provinceId,
                    cityId: this.props.cityId,
                    districtId: this.props.areaId,
                    streetId: this.props.streetId,
                });
            }
            data = data.data || data.data.flash;
            if (data) {
                if (data.flash) {
                    data = data.flash;
                }
                const systemTime = data.systemTime;
                if (!data.list) {
                    return;
                }
                //查找正在疯抢场次的结束时间,
                let endTime;
                let index = data.list.findIndex((item1, i1) => {
                    if (systemTime > item1.endTime) {
                        return false;
                    } else if (systemTime < item1.startTime) {
                        return false;
                    } else {
                        endTime = item1.endTime;
                        return true;
                    }
                });

                if (index === -1) {
                    this.state.leadStr = "距开始";
                    index = data.list.findIndex((item1, i1) => {
                        if (systemTime > item1.endTime) {
                            return false;
                        } else if (systemTime < item1.startTime) {
                            endTime = item1.startTime;
                            return true;
                        } else {
                            return false;
                        }
                    });
                }
                if (index === -1) {
                    index = 0;
                    //没有正在疯抢,查找最近一场的开始/结束时间
                    this.state.leadTime = new Date().getTime() - systemTime;
                    this.state.endTime = endTime;
                    this.upTime();
                }

                this.endTimeValue = endTime;
                this.leadTimeValue= new Date().getTime() - systemTime;
                if (data.list) {
                    this.setState({
                        isWd: data.isWd,
                        list: data.list,
                        timestamp: new Date().getTime(),
                        systemTime: systemTime,
                        index: index
                    });
                }
            }
        } catch (e) {
            console.log(e.message);
        }
    };


    render() {
        if (this.state.list.length === 0) {
            return null;
        }
        return (
            <View style={{
                backgroundColor: '#fff',
                marginTop: 10,
                flexDirection: 'column',
            }}>
                <View style={styles.flashSaleTopBox}>
                    <View style={styles.flashSaleRightContainer}>
                        <Image style={styles.flashSaleTitleImage} source={require('../../images/flash_sale_time.png')}
                               resizeMode='contain'/>
                        <Text style={styles.flashSaleTitleText}>限时抢购</Text>
                    </View>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row', justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onPress={() => {
                            this.props.navigation.navigate('FlashSale', {from: this.props.from})
                            NativeModules.StatisticsModule.track('HpAc_more', {});
                        }}>
                        <Text style={{color: "#999", fontSize: 14}}>更多</Text>
                        <Image
                            style={{
                                height: 24,
                                width: 24,
                                marginRight: 10,

                            }}
                            source={require('../../images/flash_sale_more.png')}/>
                    </TouchableOpacity>
                </View>
                <Separator style={styles.separator}/>
                <View style={styles.statusContainer}>
                    {this.state.list.map((item, i) => {
                        let str;
                        if (this.state.systemTime > item.endTime) {
                            str = "已结束";
                        } else if (this.state.systemTime < item.startTime) {
                            str = "即将开抢";
                        } else {
                            str = "正在疯抢";
                        }
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({index: i});
                                    const t = new Date(this.state.list[i].startTime);
                                    const Ac_StartDate = this.formatDate(t, "YYYY-MM-DD");//日期2018-07-21
                                    const Ac_StartTime = this.formatDate(t, "HH-mm-SS");//时间14:00:00
                                    NativeModules.StatisticsModule.track('HpAc_session', {
                                        Ac_StartDate,
                                        Ac_StartTime,
                                        UserId: this.props.userId,
                                        bannerId: item.flashSaleId,
                                    });
                                }}
                                style={{
                                    width: "25%", justifyContent: 'center', alignItems: 'center', height: 60,
                                    flexDirection: 'row',
                                }}>
                                <View
                                    style={{
                                        height: 36,
                                        backgroundColor: this.state.index === i ? "#FF6026" : "#fff",
                                        borderColor: "#FF6026",
                                        borderWidth: this.state.index === i ? 0 : 1,
                                        borderRadius: 4,
                                        flex: 1,
                                        marginHorizontal: 4,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                    <Text style={{
                                        fontSize: 12,
                                        color: this.state.index === i ? "#fff" : "#FF6026"
                                    }}>{item.timeStr}</Text>
                                    <Text style={{
                                        fontSize: 10,
                                        color: this.state.index === i ? "#fff" : "#FF6026"
                                    }}>{str}</Text>
                                </View>
                            </TouchableOpacity>);
                    })}


                </View>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={styles.flatListStyle}>
                    {this.state.list[this.state.index].products.map((item, i) => {
                        return (
                            <TouchableOpacity
                                onPress={async () => {
                                    let storId = await global.getItem('storeId');
                                    this.props.navigation.navigate("GoodsDetail", {
                                        productId: item.productId,
                                        storId
                                    });
                                    NativeModules.StatisticsModule.track('HpAc_location', {
                                        productId: item.productId,
                                        productFirstName: item.productName,
                                        location_order: i,
                                        UserId: this.props.userId,
                                    });
                                }}
                                style={styles.item}>
                                <Image
                                    style={styles.imgStyle}
                                    source={{uri: item.imageUrl}}
                                    resizeMode={"contain"}
                                />
                                <View style={styles.titleContainer}>
                                    <Text numberOfLines={2} style={styles.titleStyle}>{item.productName}</Text>
                                </View>
                                <Text style={styles.priceStyle}>{'¥' + toFloat(item.flashsalePrice)}</Text>
                                    {this.state.isWd ? <StorePrice commission={item.commission} /> : null}
                            </TouchableOpacity>);
                    })}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    more: {
        height: 40,
        justifyContent: 'center',
    },
    statusContainer:{
        height: 60,
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 6,
    },
    separator: {
        height: 1,
        marginHorizontal: 10,
    },
    flatListStyle: {
        marginTop: ScreenUtil.scaleSize(5),
        marginBottom: ScreenUtil.scaleSize(14),
        marginLeft: ScreenUtil.scaleSize(10),
        marginRight: ScreenUtil.scaleSize(4),
    },
    flashSaleTopBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: ScreenUtil.ScreenWidth,
        height: 40,
    },
    flashSaleRightContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: 10,
    },
    flashSaleTitleImage: {
        height: 16,
        width: 16,
    },
    flashSaleTitleText: {
        fontSize: 16,
        color: Color.ORANGE_1,
        margin: 4,
    },
    flashSaleLeftContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    whichHour: {
        backgroundColor: Color.ORANGE_1,
        color: Color.WHITE,
        padding: 2,
        fontSize: 10,
        marginRight: 6,
    },
    flashSaleTimeContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Color.ORANGE_1,
        paddingRight: 4,
        borderRadius: 2,
    },
    flashSaleStatusText: {
        color: Color.GREY_1,
        fontSize: 8,
        marginLeft: 2,
    },
  item: {
    alignItems: 'center',
    marginRight: ScreenUtil.scaleSize(6),
    width: (width - 20) / 3.5,
  },
  imgStyle: {
    width: (width - 38) / 3.5,
    height: (width - 38) / 3.5,
  },
  titleContainer: {
    marginTop: ScreenUtil.scaleSize(5),
    minHeight: ScreenUtil.scaleSize(30),
    justifyContent: 'center',
  },
  titleStyle: {
    maxWidth: (width - 38) / 3.5,
    alignSelf: 'flex-start',
    marginTop: ScreenUtil.scaleSize(6),
    fontSize: ScreenUtil.scaleText(13),
    textAlign: 'center',
    color: '#333333',
    fontFamily: '.PingFangSC-Regular',
  },
  priceStyle: {
    marginTop: 6,
    fontSize: ScreenUtil.scaleText(15),
    color: '#FF6026',
    fontFamily: '.PingFangSC-Regular',
  },
    zPriceStyle: {
        marginLeft: ScreenUtil.scaleSize(5),
        marginRight: ScreenUtil.scaleSize(5),
        marginTop: ScreenUtil.scaleSize(2.5),
        marginBottom: ScreenUtil.scaleSize(2.5),
        fontSize: ScreenUtil.scaleText(11),
        lineHeight: ScreenUtil.scaleText(11),
        color: '#FFFFFF',
        fontFamily: '.PingFangSC-Regular',
        backgroundColor: 'transparent',
    },
});
