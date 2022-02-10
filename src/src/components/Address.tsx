import * as React from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, Geolocation, Alert, Platform,StyleSheet } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { getAppJSON } from '../netWork';
import { getLocation } from '../utils/tools';
import { ICustomContain, IProvince } from '../interface/index';
import { createAction, connect, IS_NOTNIL } from '../utils/index';
import { Toast, Modal } from 'antd-mobile';
import {action} from '../dva/utils';
import {Color} from 'consts';
import { GET } from './../config/Http.js';
import URL from './../config/url.js';

const AntAlert = Modal.alert;
interface IAddressProps {
    notStoreDva?: boolean;
    onclick: () => void;
    onSelect: (location: any) => void;
    onCityChanged?: (streetList: any) => void;
    notSelectStreet?: boolean;
    onFinish?: (location: IAddressState) => void;
    hasHeader?: boolean;
    renderData?: any;
    nowAddress?: any;
}
interface IAddressState {
    province: IProvince;
    city: IProvince;
    district: IProvince;
    street: IProvince;
    Regions: IProvince;
    currentAddress: string;
}

const initState: IProvince = {
    value: '',
    text: '',
    children: [],
};
let locationAddress = undefined;
@connect()
class Address extends React.Component<IAddressProps & ICustomContain, IAddressState> {
    public state: IAddressState = {
        currentAddress: '正在定位中……',
        city: {
            value: '',
            text: '',
            children: [],
            grade: '',
        },
        province: {
            value: '',
            text: '',
            grade: '',
            children: [],
        },
        district: {
            value: '',
            text: '',
            grade: '',
        },
        street: {
            value: '',
            text: '',
            grade: '',
        },
        // 省做个默认,但是还是以请求为主
        Regions: [{"value":2,"text":"北京","grade":1},{"value":10,"text":"上海","grade":1},{"value":3,"text":"天津","grade":1},{"value":23,"text":"重庆","grade":1},{"value":13,"text":"安徽","grade":1},{"value":14,"text":"福建","grade":1},{"value":29,"text":"甘肃","grade":1},{"value":20,"text":"广东","grade":1},{"value":21,"text":"广西","grade":1},{"value":25,"text":"贵州","grade":1},{"value":22,"text":"海南","grade":1},{"value":4,"text":"河北","grade":1},{"value":17,"text":"河南","grade":1},{"value":9,"text":"黑龙江","grade":1},{"value":18,"text":"湖北","grade":1},{"value":19,"text":"湖南","grade":1},{"value":8,"text":"吉林","grade":1},{"value":11,"text":"江苏","grade":1},{"value":15,"text":"江西","grade":1},{"value":7,"text":"辽宁","grade":1},{"value":6,"text":"内蒙古","grade":1},{"value":31,"text":"宁夏","grade":1},{"value":30,"text":"青海","grade":1},{"value":16,"text":"山东","grade":1},{"value":5,"text":"山西","grade":1},{"value":28,"text":"陕西","grade":1},{"value":24,"text":"四川","grade":1},{"value":27,"text":"西藏","grade":1},{"value":32,"text":"新疆","grade":1},{"value":26,"text":"云南","grade":1},{"value":12,"text":"浙江","grade":1}]
    };
    public componentDidMount() {
        getLocation((address) => {
            if (IS_NOTNIL(address)) {
                const maddress = Object.assign({}, address);
                const { provinceName, cityName } = address;
                if (provinceName.endsWith('市')) {
                    maddress.provinceName = provinceName.substring(0, provinceName.length - 1);
                }
                if (cityName.length === 0) {
                    maddress.cityName = address.provinceName;
                }
                locationAddress = maddress;
                this.setState({ currentAddress: `定位地址(${maddress.regionName}${maddress.streetName})`});
                // this.props.dispatch(action('ctjjModel/getNearby'));
            } else {
                this.setState({ currentAddress: `定位地址(定位失败,默认定位到崂山区/中韩街道)` });
                // this.props.dispatch(action('ctjjModel/getNearby'));
            }
        });
        // 获取省
        this.getList('', 0).then(list=>{
            this.setState({Regions: list});
        }).catch(err=>{
            Toast.fail('获取省接口返回异常', 1);
            console.log(err);
        });
    }
    public getList = (parentId, regionType)=>{
        return new Promise((resolve, reject)=>{
            GET(URL.GET_REGIONBYPIDANDRETYPE, {parentId: parentId, regionType: regionType}).then((res)=>{
                if(res.data){
                    resolve(res.data);
                }else {
                    reject();
                }
            }).catch(err=>{
                reject();
            });
        });
    }
    public renderFooter = () => {
        // 解决安卓的地址列表显示不全的bug 增加一个底部高度为40的空View
         if (Platform.OS === 'android') {
            return (
                <View style={{height: 40, backgroundColor: 'transparent'}}></View>
            );
         } else {
            return null;
         }
    }
    public renderHeader = () => {
        return (
            <View style={styles.header}>
                <Text style={styles.headerTitle}>配送至</Text>
                <View style={styles.line} />
                <TouchableOpacity onPress={() => {
                    if (IS_NOTNIL(locationAddress)) {
                        console.log(locationAddress);
                        !this.props.notStoreDva && this.props.dispatch(createAction('address/changeAddress')(locationAddress));
                        const myaddress = {
                            province: {
                                value: locationAddress.provinceId,
                                text: locationAddress.provinceName,
                            },
                            city: {
                                value: locationAddress.cityId,
                                text: locationAddress.cityName,
                            },
                            district: {
                                value: locationAddress.areaId,
                                text: locationAddress.areaName,
                            },
                            street: {
                                value: locationAddress.streetId,
                                text: locationAddress.streetName,
                            },
                        };
                        this.props.onSelect(myaddress);
                    }
                }}>
                    <View style={{ flexDirection: 'row', height: 40, alignItems: 'center' }}>
                        <Image style={styles.location} source={require('../images/address.png')} />
                        <Text style={styles.locationText}>{this.state.currentAddress}</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.line} />
                <View style={{ flexDirection: 'row', height: 40 }}>
                    <TouchableOpacity
                        onPress={() => this.setState({
                            province: initState,
                            city: initState,
                            district: initState,
                            street: initState,
                        })}
                        style={{ paddingLeft: this.state.province.text.length > 0 ? 15 : 0 }}
                    >
                        <Text style={[styles.locationText]}>{this.state.province.text}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ paddingLeft: this.state.city.text.length > 0 ? 15 : 0 }}
                        onPress={() => this.setState({
                            city: initState,
                            district: initState,
                            street: initState,
                        })}
                    >
                        <Text style={[styles.locationText]}>{this.state.city.text}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ paddingLeft: this.state.district.text.length > 0 ? 15 : 0 }}
                        onPress={() => this.setState({
                            district: initState,
                            street: initState,
                        })}
                    >
                        <Text style={[styles.locationText]}>{this.state.district.text}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ paddingLeft: 15 }}>
                        <Text style={[styles.locationText, { color: Color.BLUE_1 }]}>请选择</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.line} />
                <TouchableOpacity style={styles.button} onPress={this.props.onclick}>
                    <Image style={styles.close} source={require('../images/close.png')} />
                </TouchableOpacity>
            </View>
        );
    }
    public render(): JSX.Element {
        Log(this.props);
        Log('打印当前状态省份：' +
            this.state.province.text + '城市：' + this.state.city.text + '区域：' +
            this.state.district.text + '街道：' + this.state.street.text);
        let datas: IProvince[] = this.state.Regions;
        // 添加收货地址 点击街道 弹出地址modal 的标识
        let addressFlag = false;
        if (this.props.renderData) {
            datas = this.props.renderData;
            addressFlag = true;
        } else {
            if (this.state.province.text.length === 0) {
                datas = this.state.Regions;
                // 如果是选择城市
            } else if (this.state.city.text.length === 0) {
                datas = this.state.province.children;
            } else if (this.state.district.text.length === 0) {
                datas = this.state.city.children;
            } else if (this.state.street.text.length === 0) {
                datas = this.state.district.children;
            } else {
                datas = this.state.district.children;
            }
        }
        return (
            <View style={{ height: 400, position: 'absolute', bottom: 0, left: 0, backgroundColor: 'white',
            width: '100%' }}>
                {
                    this.props.hasHeader && this.renderHeader()
                }
                <FlatList
                    ref="flatlist"
                    style={{ height: 280 }}
                    data={datas}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.text}
                    ItemSeparatorComponent={() => <View style={styles.line}/>}
                    // ListFooterComponent={this.renderFooter}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity style={{ paddingLeft: 15 }} onPress={async () => {
                                // 如果是在新建收货地址页面引入的 并且点击的是街道
                                if (addressFlag) {
                                    this.setState({ street: { value: item.value, text: item.text } }, () => {
                                        this.props.onSelect({ ...this.props.nowAddress, ...{ street: this.state.street } });
                                    });
                                    return;
                                }
                                this.refs.flatlist.scrollToIndex({animated: false, index: 0, viewPosition: 0});
                                // 如果是选择省份
                                if (this.state.province.text.length === 0) {
                                    // this.setState({ province: item });

                                    this.getList(item.value, item.grade).then(list=>{
                                        this.setState({ province: { value: item.value, text: item.text, children: list } });
                                    }).catch(err=>{
                                        Toast.fail('获取市接口返回异常', 1);
                                        console.log(err);
                                    });
                                    // 如果是选择城市
                                } else if (this.state.city.text.length === 0) {
                                    // const json = await getAppJSON(`v3/mstore/sg/getRegionByPIdAndReType.html?parentId=${item.value}&regionType=2`);
                                    // this.setState({ city: { value: item.value, text: item.text, children: json.data } });

                                    this.getList(item.value, item.grade).then(list=>{
                                        this.setState({ city: { value: item.value, text: item.text, children: list } });
                                    }).catch(err=>{
                                        Toast.fail('获取市接口返回异常', 1);
                                        console.log(err);
                                    });

                                    // 如果是选择区
                                } else if (this.state.district.text.length === 0) {
                                    // const grade = item.grade === 1 ? 2 : item.grade;
                                    // const json = await getAppJSON(`v3/mstore/sg/getRegionByPIdAndReType.html?parentId=${item.value}&regionType=${item.grade}`);

                                    this.getList(item.value, item.grade).then(list=>{

                                        // 如果是在新建收货地址页面引入的地址组价
                                        if (this.props.onCityChanged) {
                                            this.props.onCityChanged(list);
                                            this.setState({ district: { value: item.value, text: item.text, children: list } }, ()=>{
                                                this.props.onSelect(this.state);
                                            });
                                        } else {
                                            // 如果是在开店地址页面引入的地址组价
                                            if (this.props.notSelectStreet) {
                                                this.setState({
                                                    district: { value: item.value, text: item.text, children: list },
                                                    street: { value: list[0].value, text: list[0].text }
                                                }, () => {
                                                    this.props.onSelect(this.state);
                                                    this.props.onFinish(this.state);
                                                });
                                            } else {
                                                this.setState({ district: { value: item.value, text: item.text, children: list } });
                                            }
                                        }


                                    }).catch(err=>{
                                        Toast.fail('获取取接口返回异常', 1);
                                        console.log(err);
                                    });

                                    // 选择街道
                                } else if (this.state.street.text.length === 0) {
                                    try {
                                        this.setState({ street: { value: item.value, text: item.text } }, () => {
                                            const mjson = {
                                                provinceId: this.state.province.value,
                                                cityId: this.state.city.value,
                                                areaId: this.state.district.value,
                                                streetId: this.state.street.value,
                                                provinceName: this.state.province.text,
                                                cityName: this.state.city.text,
                                                areaName: this.state.district.text,
                                                streetName: this.state.street.text,
                                                regionName: this.state.district.text + '/' + this.state.street.text,
                                            };
                                            // 地址选择完毕后 存入address model
                                            !this.props.notStoreDva && this.props.dispatch(createAction('address/changeAddress')(mjson));
                                            this.props.onSelect(this.state);
                                        });
                                    } catch (error) {
                                        Log('====================================');
                                        Log('输出');
                                        Log('====================================');
                                    }
                                    //
                                } else {
                                    this.props.onSelect(this.state);
                                }
                            }}>
                                <Text style={styles.item}>{item.text}</Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
        );
    }
}
// const mapStateToProps = (state) => ({
//     address: state.address,
//   });

const styles = EStyleSheet.create({
    header: {
        height: 120,
        width: '100%',
    },
    headerTitle: {
        fontSize: '18rem',
        width: '100%',
        textAlign: 'center',
        height: 40,
        lineHeight: 40,
    },
    line: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: Color.GREY_4,
    },
    close: {
        width: 20,
        height: 20,
    },
    button: {
        position: 'absolute',
        right: 20,
        top: 10,
    },
    location: {
        width: 25,
        height: 25,
        margin: 5,
    },
    locationText: {
        height: 40,
        textAlign: 'center',
        lineHeight: 40,
    },
    item: {
        height: 40,
        lineHeight: 40,
    },
});

export default Address;
