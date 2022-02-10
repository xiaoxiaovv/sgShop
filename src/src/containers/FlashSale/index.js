import React from 'react';
import {
    View, ScrollView,
    Image, Text,
    TouchableOpacity,
    Dimensions,
    NativeModules,
    DeviceEventEmitter,
} from 'react-native';
import {connect} from 'react-redux';
import {getAppJSON} from '../../netWork';
import HomeBanner from '../Home/HomeBanner'; //轮播
import Header from '../../components/Header';
import {GET} from './../../config/Http';
import url from './../../config/url';
import {width} from '../../utils';

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
export default class FlashSale extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dates: [],
            dateIndex: 0,
            listIndex: 0,
            loading: true,
            timer: null,//定时器
            leadTime: 0,//本地时间和服务器的时间差
            timestamp: 0,
            isWd: false,
            topBanner: [],
            bannerHeight: Math.round(width * 0.373333333333)
        };
    }

    upTime = () => {
        if (this.state.dates && this.state.dates.length > 0) {
            if (!this.state.timer) {
                this.state.timer = setInterval(this.upTime, 1000);
            }
            const timestamp = new Date().getTime();
            let sysTime = timestamp - this.state.leadTime;
            this.state.dates.map((item1, i1) => {
                if (item1.list && item1.list.length > 0) {
                    item1.list.map((item, i) => {
                        switch (item.promotionState) {
                            case 0: {
                                //即将开始
                                let lead = parseInt((item.startTime - sysTime) / 1000);
                                if (lead > 0) {
                                    const second = lead % 60;
                                    lead -= second;
                                    let minute = lead % 3600;
                                    lead -= minute;
                                    minute /= 60;
                                    let hour = lead % 86400;
                                    lead -= hour;
                                    hour /= 3600;
                                    const day = lead / 86400;
                                    item.day = day < 10 ? "0" + day : day;//天
                                    item.hour = hour < 10 ? "0" + hour : hour;//小时
                                    item.minute = minute < 10 ? "0" + minute : minute;//分钟
                                    item.second = second < 10 ? "0" + second : second;//秒
                                } else {
                                    clearInterval(this.state.timer);
                                    this.getData();
                                    return;
                                }
                                break;
                            }
                            case 1: {
                                //正在疯抢
                                let lead = parseInt((item.endTime - sysTime) / 1000);
                                if (lead > 0) {
                                    const second = lead % 60;
                                    lead -= second;
                                    let minute = lead % 3600;
                                    lead -= minute;
                                    minute /= 60;
                                    const hour = lead / 3600;
                                    item.day = "";
                                    item.hour = hour < 10 ? "0" + hour : hour;//小时
                                    item.minute = minute < 10 ? "0" + minute : minute;//分钟
                                    item.second = second < 10 ? "0" + second : second;//秒
                                } else {
                                    clearInterval(this.state.timer);
                                    this.getData();
                                    return;
                                }
                                break;
                            }
                            case 2: {
                                //已结束
                                break;
                            }
                        }
                    });
                }
            });
            this.setState({timestamp: timestamp});
        }
    };

    componentWillUnmount() {
        if (this.state.timer) {
            clearInterval(this.state.timer);
            this.state.timer = null;
        }
    }

    componentDidMount() {
        this.getData();
        this.getBanner();
    };

    getData = async () => {
        try {
            let data = await GET(url.FALSHSALES, {
                provinceId: this.props.provinceId,
                cityId: this.props.cityId,
                districtId: this.props.areaId,
                streetId: this.props.streetId,
                from: this.props.navigation.getParam("from")
            });
            data = data.data;
            const systemTime = data.systemTime;
            this.state.leadTime = new Date().getTime() - systemTime;
            data.dates.map((item, i) => {
                if (item.list && item.list.length > 0) {
                    item.list.map((item1, i1) => {
                        if (item1.systemTime > item1.endTime) {
                            //已结束
                            item1.promotionState = 2;
                        } else if (item1.systemTime < item1.startTime) {
                            //即将开始
                            item1.promotionState = 0;
                        } else {
                            //正在疯抢
                            item1.promotionState = 1;
                        }
                    });
                }
            });
            this.state.dates = data.dates;
            this.upTime();

            //默认选中今天正在疯抢的,如果没有就选中第一个即将开始的,如果也没有就选中第一个
            let listIndex;
            if (data.dates.length > 0) {
                listIndex = data.dates[0].list.findIndex((item1, i1) => {
                    if (item1.systemTime > item1.endTime) {
                        //已结束
                        return false;
                    } else if (item1.systemTime < item1.startTime) {
                        //即将开始
                        return false;
                    } else {
                        //正在疯抢
                        return true;
                    }
                });
                if (listIndex === -1) {
                    listIndex = data.dates[0].list.findIndex((item1, i1) => {
                        if (item1.systemTime > item1.endTime) {
                            //已结束
                            return false;
                        } else if (item1.systemTime < item1.startTime) {
                            //即将开始
                            return true;
                        } else {
                            //正在疯抢
                            return true;
                        }
                    });
                }
                if (listIndex === -1) {
                    listIndex = 0;
                }
            }

            this.setState({
                isWd: data.isWd,
                loading: false,
                listIndex: listIndex,
                timestamp: new Date().getTime()
            });
        } catch (e) {
            alert(e.message);
        }
    };
    getBanner = async () => {
        const data = await getAppJSON("/sg/cms/secondPageBanner.json", {
            type: 2,
        });
        if (data.data && data.data.topBanner) {
            const topBanner = data.data.topBanner.map((item, i) => {
                item.pic = item.imageUrl;
            });
            this.setState({topBanner: data.data.topBanner})
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

    goBack=()=>{
        this.props.navigation.goBack();
        DeviceEventEmitter.emit('update_flash_sale');
    }

    getSale = (sale) => {
        if (this.state.dates[this.state.dateIndex].list[this.state.listIndex].promotionState !== 1) {
            return null;
        }
        if (sale >= 98) {
            return (<View style={{
                width: 80,
                height: 16,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 5,
            }}>
                <View style={{
                    width: 80,
                    height: 12,
                    backgroundColor: "#F1A5B2",
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: "#EA7283",
                    position: 'absolute',
                }}>

                    <View style={{
                        width: sale + "%",
                        height: 10,
                        backgroundColor: "#EA4B62",
                        borderRadius: 6,
                        position: 'absolute',
                        left: 0
                    }}>
                    </View>
                </View>

                <Image
                    style={{height: 16, width: 16, marginBottom: 8,}}
                    source={require('../../images/hot.png')}/>
                <Text
                    style={{
                        color: "#fff",
                        fontSize: 9
                    }}>即将售空</Text>
            </View>);
        } else {
            return (<View style={{
                width: 80,
                height: 12,
                backgroundColor: "#F1A5B2",
                borderRadius: 6,
                borderWidth: 1,
                borderColor: "#EA7283",
                position: 'relative',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 4,
            }}>
                <View style={{
                    width: sale + "%",
                    height: 10,
                    backgroundColor: "#EA4B62",
                    borderRadius: 6,
                    position: 'absolute',
                    left: 0
                }}>
                </View>
                <Text
                    style={{
                        color: "#fff",
                        fontSize: 9
                    }}>已售{sale}%</Text>
            </View>);
        }
    };
    getButton = () => {
        switch (this.state.dates[this.state.dateIndex].list[this.state.listIndex].promotionState) {
            case 0: {
                return (<View
                    style={{
                        width: 80, height: 28,
                        backgroundColor: "#FFA280",
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 14
                    }}>
                    <Text
                        style={{
                            color: "#fff",
                            fontSize: 12
                        }}>即将开始</Text>
                </View>);
                break;
            }
            default: {
                return (<View
                    style={{
                        width: 80, height: 28,
                        backgroundColor: "#FF6026",
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 14
                    }}>
                    <Text
                        style={{
                            color: "#fff",
                            fontSize: 12
                        }}>立即抢购</Text>
                </View>);
                break;
            }
        }
    };

    render() {
        let stateDescribe, leadStr;
        if (!this.state.loading && this.state.dates && this.state.dates.length > 0) {
            switch (this.state.dates[this.state.dateIndex].list[this.state.listIndex].promotionState) {
                case 0: {
                    stateDescribe = "即将开始，先下单先得";
                    leadStr = "距开始";
                    break;
                }
                case 1: {
                    stateDescribe = "疯抢中，好价总在犹豫中错过";
                    leadStr = "距结束";
                    break;
                }
                case 2: {
                    stateDescribe = "抢购中，先下单先得哦~";
                    break;
                }
            }
        }
        return (
            <View style={{flex: 1, flexDirection: 'column', backgroundColor: "#fff"}}>
                <Header
                    style={{backgroundColor: "#ff7300", borderBottomWidth: 0}}
                    StatusBarStyle={{backgroundColor: "#ff7300"}}
                    titleStyle={{color: "#fff"}}
                    {...this.props}
                    backBtn={<Image style={{height: 22, width: 22, marginLeft: 16}}
                                    source={require('../../images/back.png')}/>}
                    title={"限时抢购"}
                    goBack={()=>this.goBack()}
                />

                {!this.state.loading && (!this.state.dates || this.state.dates.length === 0) ? <View style={{
                    flex: 1,
                    alignItems: 'center', justifyContent: 'center',
                }}><Text style={{color: "#ff7300", fontSize: 17}}>当前没有抢购活动</Text></View> : null}

                {!this.state.loading && this.state.dates && this.state.dates.length > 0 ?
                    [<View key={0} style={{
                        flexDirection: 'column',
                        backgroundColor: "#eee",
                    }}>
                        <View style={{height: 75, flexDirection: 'column',}}>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                style={{backgroundColor: "#ff7300"}}>
                                <View style={{width: (width-60)/4, marginLeft: 16,
                                    justifyContent: 'center', alignItems: 'center',
                                    height: 45, paddingHorizontal: 5, marginRight: 5}}
                                >
                                    <Image
                                        style={{height: 30,width: (width-60)/4-10,}}
                                        source={require('../../images/promotion.png')}/>
                                </View>

                                {this.state.dates.map((item, i) => {
                                    const date = this.formatDate(item.date, "MM月DD日");
                                    return (
                                        <View style={{
                                            alignItems: 'center',
                                            flexDirection: 'column',
                                            marginHorizontal: 5,
                                            width: 78.75,
                                            opacity: this.state.dateIndex === i ? 1 : 0.6
                                        }}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    if (this.state.dateIndex === i) {
                                                        return;
                                                    }
                                                    //默认选中今天正在疯抢的,如果没有就选中第一个即将开始的,如果也没有就选中第一个
                                                    let listIndex;
                                                    if (item.list.length > 0) {
                                                        listIndex = item.list.findIndex((item1, i1) => {
                                                            if (item1.systemTime > item1.endTime) {
                                                                //已结束
                                                                return false;
                                                            } else if (item1.systemTime < item1.startTime) {
                                                                //即将开始
                                                                return false;
                                                            } else {
                                                                //正在疯抢
                                                                return true;
                                                            }
                                                        });
                                                        if (listIndex === -1) {
                                                            listIndex = item.list.findIndex((item1, i1) => {
                                                                if (item1.systemTime > item1.endTime) {
                                                                    //已结束
                                                                    return false;
                                                                } else if (item1.systemTime < item1.startTime) {
                                                                    //即将开始
                                                                    return true;
                                                                } else {
                                                                    //正在疯抢
                                                                    return true;
                                                                }
                                                            });
                                                        }
                                                        if (listIndex === -1) {
                                                            listIndex = 0;
                                                        }
                                                    }
                                                    this.setState({
                                                        dateIndex: i,
                                                        listIndex: listIndex
                                                    });
                                                    NativeModules.StatisticsModule.track('ListAc_Date', {
                                                        Ac_StartDate: this.formatDate(item.date, "YYYY-MM-DD"),
                                                        UserId: this.props.userId,
                                                    });
                                                }}
                                                style={{
                                                    alignItems: 'center',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    borderBottomWidth: 1,
                                                    borderColor: "#fff",
                                                    paddingBottom: 3,
                                                }}>
                                                <Text style={{
                                                    fontSize: 15,
                                                    color: "#FFFFFF",
                                                    paddingTop: 2,
                                                    paddingBottom: 2
                                                }}>{date}</Text>
                                                <Text
                                                    style={{
                                                        fontSize: 12,
                                                        color: "#FFFFFF",
                                                        paddingBottom: 2
                                                    }}>{item.status ? "抢购中" : "即将开始"}</Text>
                                            </TouchableOpacity>
                                        </View>)

                                })}
                            </ScrollView>
                        </View>

                        <View style={{
                            height: 44,
                            zIndex: 2,
                            position: 'absolute',
                            top: 65,
                            width: "100%"
                        }}>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{
                                    paddingHorizontal: 10,
                                }}>
                                {this.state.dates.length > 0 && this.state.dates[this.state.dateIndex].list.map((item, i) => {
                                    let str;
                                    if (item.promotionState === 2) {
                                        str = "已开抢";
                                    } else if (item.promotionState === 0) {
                                        str = "即将开抢";
                                    } else {
                                        str = "正在疯抢";
                                    }
                                    return (<TouchableOpacity
                                        onPress={() => {
                                            if (this.state.listIndex === i) {
                                                return;
                                            }
                                            this.setState({listIndex: i});
                                            NativeModules.StatisticsModule.track('ListAc_session', {
                                                Ac_StartDate: this.formatDate(item.startTime, "YYYY-MM-DD"),
                                                Ac_StartTime: this.formatDate(item.startTime, "HH-mm-SS"),
                                                UserId: this.props.userId,
                                                bannerId: item.flashSaleId,
                                            });
                                        }}
                                        style={{
                                            alignItems: 'center',
                                            flexDirection: 'column',
                                            height: 44,
                                            backgroundColor: "#fff",
                                            justifyContent: 'center',
                                            borderRadius: 4,
                                            marginRight: 5, marginLeft: 5,
                                            width: (width-60)/4
                                        }}>
                                        <Text style={{
                                            fontSize: 15,
                                            color: this.state.listIndex === i ? "#FF6026" : "#333",
                                        }}>{item.timeStr}</Text>
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                color: this.state.listIndex === i ? "#FF6026" : "#333"
                                            }}>{str}</Text>
                                    </TouchableOpacity>);
                                })}
                            </ScrollView>
                        </View>

                        <View
                            style={{
                                backgroundColor: "#EEE",
                                height: 35,
                                width: "100%",
                                marginBottom: this.state.topBanner.length > 0 ? 5 : 0,
                            }}>
                        </View>
                        {this.state.topBanner.length > 0 ?
                            <HomeBanner
                                dataSource={this.state.topBanner}
                                height={this.state.bannerHeight}
                            /> : null}
                        <View
                                style={{
                                    height: 28,
                                    paddingLeft: 15,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: "space-between",
                                    paddingRight: 13,
                                    backgroundColor: "#EEE"
                                }}>
                                <Text style={{color: "#666", fontSize: 12}}>{stateDescribe}</Text>
                                {this.state.dates[this.state.dateIndex].list[this.state.listIndex].promotionState !== 2 ?
                                    <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                        <Text
                                            style={{color: "#666", fontSize: 12, paddingRight: 8,}}>{leadStr}</Text>

                                        {this.state.dates[this.state.dateIndex].list[this.state.listIndex].day ? [<View
                                                style={{
                                                    borderRadius: 2,
                                                    paddingTop: 1,
                                                    paddingBottom: 1,
                                                    paddingRight: 2,
                                                    paddingLeft: 2,
                                                    backgroundColor: "#333",
                                                }}>
                                                <Text style={{
                                                    color: "#fff",
                                                    fontSize: 10,
                                                }}>{this.state.dates[this.state.dateIndex].list[this.state.listIndex].day}</Text>
                                            </View>
                                                ,
                                                <Text style={{
                                                    color: "#666",
                                                    fontSize: 10,
                                                    paddingRight: 2, paddingLeft: 2,
                                                }}>天</Text>]
                                            : null}

                                        <View style={{
                                            borderRadius: 2,
                                            paddingTop: 1,
                                            paddingBottom: 1,
                                            paddingRight: 2,
                                            paddingLeft: 2,
                                            backgroundColor: "#333",
                                        }}>
                                            <Text style={{
                                                color: "#fff",
                                                fontSize: 10,
                                            }}>{this.state.dates[this.state.dateIndex].list[this.state.listIndex].hour}</Text>
                                        </View>

                                        <Text style={{
                                            color: "#666",
                                            fontSize: 10,
                                            paddingRight: 2, paddingLeft: 2,
                                        }}>:</Text>


                                        <View style={{
                                            borderRadius: 2,
                                            paddingTop: 1,
                                            paddingBottom: 1,
                                            paddingRight: 2,
                                            paddingLeft: 2,
                                            backgroundColor: "#333",
                                        }}>
                                            <Text style={{
                                                color: "#fff",
                                                fontSize: 10,
                                            }}>{this.state.dates[this.state.dateIndex].list[this.state.listIndex].minute}</Text>
                                        </View>
                                        <Text style={{
                                            color: "#666",
                                            fontSize: 10,
                                            paddingRight: 2, paddingLeft: 2,
                                        }}>:</Text>
                                        <View style={{
                                            borderRadius: 2,
                                            paddingTop: 1,
                                            paddingBottom: 1,
                                            paddingRight: 2,
                                            paddingLeft: 2,
                                            backgroundColor: "#333",
                                        }}>
                                            <Text style={{
                                                color: "#fff",
                                                fontSize: 10,
                                            }}>{this.state.dates[this.state.dateIndex].list[this.state.listIndex].second}</Text>
                                        </View>
                                    </View> : null}
                            </View>
                    </View>
                        ,
                        <ScrollView key={1} style={{backgroundColor: "#fff"}}>
                            {this.state.dates.length > 0 &&
                            this.state.dates[this.state.dateIndex].list.length > 0 &&
                            this.state.dates[this.state.dateIndex].list[this.state.listIndex].products.map((item, i) => {
                                let promotionState = this.state.dates[this.state.dateIndex].list[this.state.listIndex].promotionState;
                                //item.commission = 12.00;
                                //item.flashsalePrice = 6789.08;
                                const sale = item.sale;

                                const flashsalePrice = parseInt(item.flashsalePrice);
                                let flashsalePriceFractional = parseInt((item.flashsalePrice * 100) % 100);
                                if (flashsalePriceFractional === 0) {
                                    flashsalePriceFractional = "00";
                                } else if (flashsalePriceFractional < 10) {
                                    flashsalePriceFractional = "0" + flashsalePriceFractional;
                                }

                                const commission = parseInt(item.commission);
                                let commissionFractional = parseInt((item.commission * 100) % 100);
                                if (commissionFractional === 0) {
                                    commissionFractional = "00";
                                } else if (commissionFractional < 10) {
                                    commissionFractional = "0" + commissionFractional;
                                }
                                let miniPrice = parseInt(item.miniPrice);
                                let miniPriceFractional = parseInt((item.miniPrice * 100) % 100);
                                if (miniPriceFractional === 0) {
                                    miniPriceFractional = "00";
                                } else if (miniPriceFractional < 10) {
                                    miniPriceFractional = "0" + miniPriceFractional;
                                }
                                let originMiniPrice = miniPrice;
                                miniPrice = miniPrice + "." + miniPriceFractional;


                                return (<TouchableOpacity
                                    onPress={async () => {
                                        let storId = await global.getItem('storeId');
                                        this.props.navigation.navigate("GoodsDetail", {
                                            productId: item.productId,
                                            storId
                                        });
                                        NativeModules.StatisticsModule.track('ListAc_location', {
                                            productFirstName: item.productName,
                                            location_order: i,
                                            UserId: this.props.userId,
                                        });
                                    }}
                                    style={{
                                        backgroundColor: "#fff",
                                        paddingLeft: 17
                                    }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        borderBottomWidth: 1,
                                        borderColor: "#f1f1f1",
                                        flex: 1,
                                    }}>
                                        <Image
                                            style={{height: 100, width: 100, marginTop: 15, marginBottom: 15,}}
                                            resizeMode={"contain"}
                                            source={{uri: item.imageUrl}}/>

                                        <View style={{
                                            marginLeft: 11,
                                            flexDirection: 'column',
                                            marginRight: 14,
                                            flex: 1,
                                            marginTop: 15,
                                            marginBottom: 15,
                                        }}>
                                            <Text
                                                numberOfLines={2}
                                                style={{
                                                    color: "#333",
                                                    fontSize: 16,
                                                    height: 40,
                                                }}>{item.productName}</Text>
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: "space-between",
                                                flex: 1,
                                            }}>
                                                <View style={[{flexDirection: 'column',
                                                    justifyContent: "flex-end"},
                                                    promotionState == 2 && 
                                                    {justifyContent: "flex-start", marginTop: 5}]}
                                                >
                                                    {promotionState == 2 ?
                                                        this.renderPrice(originMiniPrice, miniPriceFractional, '商品价'):
                                                        this.renderPrice(flashsalePrice, flashsalePriceFractional, '抢购价')
                                                    }
                                                    {this.state.isWd ?
                                                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 3}}>
                                                            <Image
                                                                style={{height: 18, width: 18}}
                                                                source={require('../../images/hongbao.png')}/>
                                                            {this.renderPrice(commission, commissionFractional)}
                                                        </View> : null}
                                                    {promotionState != 2 &&
                                                        <Text
                                                            style={{
                                                                color: "#666",
                                                                fontSize: 12,
                                                            }}>
                                                            原价
                                                            <Text
                                                                style={{
                                                                    color: "#666",
                                                                    fontSize: 12,
                                                                    textDecorationLine: "line-through"
                                                                }}>￥{miniPrice}</Text>
                                                        </Text>
                                                    }
                                                </View>

                                                <View
                                                    style={[{flexDirection: 'column', justifyContent: 'flex-end'},
                                                    promotionState == 2 && {justifyContent: 'flex-start', marginTop: 5}]}>
                                                    {this.getButton(item)}
                                                    {this.getSale(sale)}
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>);
                            })}
                        </ScrollView>] : null}
            </View>
        );
    }

    renderPrice=(price, priceFractional, title)=>{
        return(
            <View style={{flexDirection: 'row', marginBottom: 3, alignItems:'flex-end'}}>
                {title &&<Text style={{color: "#666", fontSize: 12, marginBottom: 1}}>{title}</Text>}
                <Text style={{color: "#f40", fontSize: 16, marginLeft: -1}}>￥</Text>
                <Text style={{ color: "#f40", fontSize: 16, marginLeft: -3, marginBottom: -1}}>{price}</Text>
                <Text style={{color: "#f40", fontSize: 12, marginLeft: -1}}>.{priceFractional}</Text>
            </View>
        );
    }
}