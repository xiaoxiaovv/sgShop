import {
    View, Text, TextInput, Image, StyleSheet,
    TouchableOpacity, DeviceEventEmitter, Modal, Alert, Platform, NativeModules,ScrollView
} from 'react-native';
import * as React from 'react';
import { Toast } from 'antd-mobile';
import CustomButton from 'rn-custom-btn1';
import { UltimateListView } from 'rn-listview';
import { INavigation } from '../../interface/index';
import ContactsWrapper from 'react-native-contacts-wrapper';
import Address from '../../components/Address';
import { connect, doubleClick, createAction } from '../../utils';
import { getStreetName } from '../../utils/tools';
import URL from '../../config/url';
import { GET, POST_JSON, GET_P, POST_FORM } from '../../config/Http';

let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
let streetList = [];

interface IState {
    beFrom: string,
    isDefault: boolean;
    name: string;
    address: string;
    phone: string;
    city: string;
    street: any;
    show: boolean;
    alertShow: boolean;
    saveDisable: boolean;
    locationInfo: any;
    hasAddressHeader: boolean;
}

interface INewAddress {
    locationInfo: any;
}
@connect(({ order }) => order)
class NewAddress extends React.Component<INavigation & INewAddress> {
    private static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;

        return {
            title: '新建收货地址',
            headerStyle: { justifyContent: 'center' },
            headerTitleStyle: { color: 'black', alignSelf: 'center' },
            headerRight: (params.headerRight ? params.headerRight : null),
            headerTintColor: '#666',
            headerBackTitle: null,
        };
    }

    public state: IState;

    public constructor(props) {
        super(props);
        const {
            pageInfo:
            {
                ordersCommitWrapM: { orderProductList },
            },
            productInfo = {},
        } = props;
        let productDetailLocation = {}; // 商品详情页带入的默认收货地址
        if(dvaStore.getState().goodsDetail){
            for(let key in dvaStore.getState().goodsDetail.toJS()){
                productDetailLocation = dvaStore.getState().goodsDetail.toJS()[key].productInfo.location;
            }
        }
        console.log(productDetailLocation)
        this.state = {
            beFrom: '',
            isDefault: false,
            city: '',
            street: {
                text: '',
                value: '',
            },
            show: false,
            alertShow: false,
            name: '',
            phone: '',
            // address: productInfo[orderProductList[0].productId] ? productInfo[orderProductList[0].productId].location.pcrName : '',
            address: '',
            locationInfo: {
                province: {
                    value: productDetailLocation.provinceId?productDetailLocation.provinceId: '',
                    text: productDetailLocation.pcrName? productDetailLocation.pcrName.split(' ')[0]:'',
                },
                city: {
                    value: productDetailLocation.cityId?productDetailLocation.cityId: '',
                    text: productDetailLocation.pcrName? productDetailLocation.pcrName.split(' ')[1]:'',
                },
                district: {
                    value: productDetailLocation.regionId?productDetailLocation.regionId: '',
                    text: productDetailLocation.pcrName? productDetailLocation.pcrName.split(' ')[2].split('/')[0]:'',
                },
                street: {
                    value: productDetailLocation.streetId?productDetailLocation.streetId: '',
                    text: productDetailLocation.pcrName? productDetailLocation.pcrName.split(' ')[2].split('/')[1]:'',
                },
            },
            hasAddressHeader: true,
        };

        Log(this.state);
    }

    public componentDidMount() {
        this.props.navigation.setParams({
            headerRight: <TouchableOpacity
                disabled={this.state.saveDisable}
                activeOpacity={1}
                style={{ marginRight: 10 }}
                onPress={this.saveInfo}>
                <Text>保存</Text>
            </TouchableOpacity>
        });
        this.getRouterName();
        let productDetailLocation = {}; // 商品详情页带入的默认收货地址
        if(dvaStore.getState().goodsDetail){
            for(let key in dvaStore.getState().goodsDetail.toJS()){
                productDetailLocation = dvaStore.getState().goodsDetail.toJS()[key].productInfo.location;
            }
            if(productDetailLocation.regionId){
                GET(URL.GET_REGIONBYPIDANDRETYPE, {parentId: productDetailLocation.regionId, regionType: 2}).then((res)=>{
                    if(res.data){
                        this.setState({

                            locationInfo: {
                                province: {
                                    value: productDetailLocation.provinceId?productDetailLocation.provinceId: '',
                                    text: productDetailLocation.pcrName? productDetailLocation.pcrName.split(' ')[0]:'',
                                },
                                city: {
                                    value: productDetailLocation.cityId?productDetailLocation.cityId: '',
                                    text: productDetailLocation.pcrName? productDetailLocation.pcrName.split(' ')[1]:'',
                                },
                                district: {
                                    value: productDetailLocation.regionId?productDetailLocation.regionId: '',
                                    text: productDetailLocation.pcrName? productDetailLocation.pcrName.split(' ')[2].split('/')[0]:'',
                                    children: res.data
                                },
                                street: {
                                    value: productDetailLocation.streetId?productDetailLocation.streetId: '',
                                    text: productDetailLocation.pcrName? productDetailLocation.pcrName.split(' ')[2].split('/')[1]:'',
                                },
                            },

                        });

                    }
                });
            }
        }
    }

    public render() {
        return (
            <ScrollView
                keyboardShouldPersistTaps="always"
                keyboardDismissMode="on-drag"
            >
                <View style={{ flex: 1, width, marginTop: 20}}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <TextInput
                                onChangeText={(text) => { this.handleTextChanged('name', text); }}
                                style={[styles.inputStyle, { borderTopWidth: 0, padding: 0 }]}
                                placeholder='收货人'
                                underlineColorAndroid='transparent'
                                value={this.state.name} />
                            <TextInput
                                onChangeText={(text) => { this.handleTextChanged('phone', text); }}
                                style={[styles.inputStyle, { padding: 0 }]}
                                underlineColorAndroid='transparent'
                                placeholder='手机号'
                                keyboardType={'numeric'}
                                value={this.state.phone} />
                        </View>
                        <View style={{
                            borderLeftWidth: 1,
                            borderLeftColor: 'lightgrey',
                            backgroundColor: '#fff',
                            width: 80,
                            height: 80,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <TouchableOpacity
                                activeOpacity={1}
                                style={{ marginRight: 10 }}
                                onPress={() => this.getContact()}>
                                <Image
                                    style={{
                                        width: 30,
                                        height: 30,
                                    }}
                                    source={require('../../images/maillist.png')}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <CustomButton
                        title={this.state.locationInfo.province.text ?
                            this.getLocationInStringNew() : '所在地区'}
                        style={[styles.inputStyle, { paddingLeft: 10 }]}
                        innerStyle={styles.selectStyle}
                        imageStyle={{ width: 25, height: 25, resizeMode: 'contain' }}
                        image={require('../../images/clear.png')}
                        onPress={() => this.showView(1)}
                    />
                    <CustomButton
                        title={this.state.locationInfo.street.text ?
                            this.state.locationInfo.street.text : '街道'}
                        style={[styles.inputStyle, { paddingLeft: 10 }]}
                        innerStyle={styles.selectStyle}
                        imageStyle={{ width: 25, height: 25, resizeMode: 'contain' }}
                        image={require('../../images/clear.png')}
                        onPress={() => this.showView(2)}
                    />
                    <TextInput
                        style={[styles.inputStyle, { padding: 0 }]}
                        underlineColorAndroid='transparent'
                        onChangeText={(text) => { this.handleTextChanged('address', text); }}
                        placeholder='详细地址'
                        value={this.state.address}
                    />
                    <TouchableOpacity
                        activeOpacity={1}
                        style={[
                            styles.inputStyle,
                            { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
                        onPress={this.handleDefaultAddress}>
                        <Text>{'默认地址'}</Text>
                        {this.state.isDefault ?
                            <Image
                                style={{ width: 25, height: 25, resizeMode: 'contain' }}
                                source={require('../../images/ic_select.png')} /> : null}
                        {/* <Image
                                    style={{width: 25, height: 25, resizeMode: 'contain'}}
                                    source={require('../../images/default_icon.png')}/>} */}
                    </TouchableOpacity>
                    <Modal
                        transparent={true}
                        visible={this.state.show}
                        animationType='slide'
                    >
                        <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                            <TouchableOpacity
                                style={{
                                    position: 'absolute', top: 0, left: 0,
                                    width: '100%', height: height - 400,
                                }}
                                activeOpacity={1} onPress={() => this.dismissView()}>
                                <View style={{
                                    position: 'absolute', top: 0, left: 0, width: '100%',
                                    height: height - 400,
                                }}></View>
                            </TouchableOpacity>
                            <Address
                                // notSelectStreet={true}
                                nowAddress={!this.state.hasAddressHeader && this.state.locationInfo}
                                renderData={!this.state.hasAddressHeader && this.state.locationInfo.district.children}
                                hasHeader={this.state.hasAddressHeader}
                                onCityChanged={this.saveStreet}
                                onclick={() => this.setState({ show: false })}
                                onSelect={(location) => this.setState({ show: false, locationInfo: { ...location } })}
                                onFinish={(locationInfo) => {
                                    Log(locationInfo);
                                    this.setState({ locationInfo });
                                }}
                            />
                        </View>
                    </Modal>
                </View>
            </ScrollView>
        );
    }

    private saveInfo = () => {
        if (doubleClick()) {
            return;
        }
        let error = '';
        if (this.state.name.length === 0) {
            error = '收货人不能为空';
        } else if (!/^([\u4E00-\u9FA5]|\w)*$/.test(this.state.name)) {
            error = '收货人不能包括特殊字符';
        } else if (this.state.name.length <2 || this.state.name.length > 10) {
            error = '收货人为2-10个字符';
        }else if (this.state.phone === '') {
            error = '手机号码不能为空';
        }  else if (!/^1([3578][0-9]|4[01356789]|66|9[89])\d{8}$/.test(this.state.phone)) {
            error = '手机号格式不正确';
        }else if (this.state.locationInfo.province.text == '' || this.state.locationInfo.province.value == '') {
            error = '请选择所在地区';
        } else if (this.state.address.length === 0) {
            error = '详细地址不能为空';
        }  else if (!/^.[^&<>]{2,29}$/.test(this.state.address)) {
            error = '详细地址为3～30个字符，且不能包含特殊字符！';
        } 

        if (!error) {
            // this.postNewAddress();
            if (this.state.locationInfo.street.text == '' || this.state.locationInfo.street.value == '') {
                this.checkStreetInfo();
            } else {
                this.postNewAddress();
            }

        } else {
            Toast.info(error, 3);
        }
    }
    // 调取手机联系人
    private getContact = () => {
        if (Platform.OS === 'android') {
            // 安卓6.0以上权限默认不提示，需要单独封装
            NativeModules.ToolsModule.getPhoneContacts()
                .then((contact) => {
                    let newPhone = contact.number.replace(/\s+/g, '');
                    newPhone = newPhone.replace(/-/g, '');
                    this.setState({
                        name: contact.name?contact.name.replace(/^\s+|\s+$/g, ''):'',
                        phone: newPhone,
                    });
                })
                .catch((errorCode, domain, error) => {
                    Log('ERROR CODE: ', errorCode);
                    Log('ERROR MESSAGE: ', error);
                });
        } else {
            ContactsWrapper.getContact()
                .then((contact) => {
                    let newPhone = contact.phone.replace(/\s+/g, '');
                    newPhone = newPhone.replace(/-/g, '');
                    this.setState({
                        name: contact.name?contact.name.replace(/^\s+|\s+$/g, ''):'',
                        phone: newPhone,
                    });
                })
                .catch((error) => {
                    Log('ERROR CODE: ', error.code);
                    Log('ERROR MESSAGE: ', error.message);
                });
        }
    }
    // 四级地址对象 转换成 字符串
    private getLocationInString() {
        // tslint:disable-next-line:max-line-length
        const locationStr = `${this.state.locationInfo.province.text} ${this.state.locationInfo.city.text} ${this.state.locationInfo.district.text} ${this.state.locationInfo.street.text}`;
        return locationStr;
    }
    // 前三级地址对象 转换成 字符串
    private getLocationInStringNew() {
        // tslint:disable-next-line:max-line-length
        const locationStr = `${this.state.locationInfo.province.text} ${this.state.locationInfo.city.text} ${this.state.locationInfo.district.text}`;
        return locationStr;
    }

    private saveStreet = (value) => {
        streetList = value;
    }

    private checkStreetInfo = async () => {
        getStreetName({
            city: this.state.locationInfo.city.text,
            keywords: this.state.address,
        }, this.handleStreetData);
    }

    private handleStreetData = (resp) => {
        if (resp === 'error') {
            Toast.info('请选择街道', 3);
            return;
        }
        const streetValues = streetList.map(item => item.value);
        const streetTexts = streetList.map(item => item.text);

        if (resp !== this.state.locationInfo.street.text && streetTexts.indexOf(resp) !== -1) {
            this.setState({
                street: {
                    value: streetValues[streetTexts.indexOf(resp)],
                    text: resp,
                },
            }, this.showAlert);
        } else {
            this.postNewAddress();
        }
    }

    private showAlert = () => {
        Alert.alert(
            '提示',
            `根据国家最新行政区域划分，我们识别到您的地址对应街道为${this.state.street.text}，是否保存？`,
            [
                { text: '否', style: 'cancel' },
                { text: '是', onPress: () => this.postMsgGD() },
            ],
            { cancelable: true },
        );
    }
    //  从订单页来的
    private async getRouterName() {
        const routerState = dvaStore.getState().router;
        const routesArrlength = dvaStore.getState().router.routes.length;
        if (routerState.index === 0) {
            return null;
        } else {
            let routerName = routerState.routes[routesArrlength - 3].routeName;
            if (routerName == 'CommitOrder') {
                this.setState({
                    beFrom: 'CommitOrder'
                })
                //如果是从订单页来的 获取本地存储
                // global.getItem('GetAddress')
                // .then((res)=>{
                //     if(res == null){
                //         console.log('1'+res)
                //     }else{
                //         console.log('2'+res)
                //     }
                // })

            }
        }
    }
    // 点击弹窗中的确认
    private async postMsgGD() {
        this.setState({
            locationInfo: {
                ...this.state.locationInfo,
                street: {
                    text: this.state.street.text,
                    value: this.state.street.value,
                },
            },
        })
        this.postNewAddress();
    }
    private async postNewAddress() {

        // const resp = await postAppJSON('v3/h5/sg/shippingAddress/addSAddr.html?' +
        //     `address=${this.state.address}&consignee=${this.state.name}&isDefault=${this.state.isDefault ? 1 : 0}` +
        //     `&mobile=${this.state.phone}&` +
        //     `regionName=${this.getLocationInString()}&` +
        //     `areaId=${this.state.locationInfo.district.value}&cityId=${this.state.locationInfo.city.value}&` +
        //     `provinceId=${this.state.locationInfo.province.value}&streetId=${this.state.locationInfo.street.value}`,
        //     {});
        const resp = await POST_JSON(URL.INSERTADDRESS, {
            "co": this.state.name,
            "pi": this.state.locationInfo.province.value,
            "ci": this.state.locationInfo.city.value,
            "ri": this.state.locationInfo.district.value,
            "si": this.state.locationInfo.street.value,
            "rn": this.getLocationInString(),
            "ar": this.state.address,
            "zc": "", //区号
            "mo": this.state.phone,
            "ph": "", //电话
            "de": this.state.isDefault ? 1 : 0 //0不是默认1默认
        })
        if (resp.success) {
            // 判断页面来源
            if(this.state.beFrom == 'CommitOrder'){
                dvaStore.dispatch(createAction('order/fetchPageInfo')({isRefresh: true}));
                dvaStore.dispatch(createAction('router/apply')({
                    type: 'Navigation/NAVIGATE', routeName: 'CommitOrder', params: {isRefresh:true},
                }));
            }else{
                DeviceEventEmitter.emit('addressChanged', { toReload: true });
                this.props.navigation.goBack();
            }
            // console.log(this.props)
        } else {
            resp.message && Toast.info(`${resp.message}`, 1);
        }
    }

    private showView = (type) => {
        if (type === 1) {
            this.setState({ show: true, hasAddressHeader: true });
        } else {
            if (this.state.locationInfo.province.text == '' || this.state.locationInfo.province.value == '') {
                Toast.info('请选择所在地区');
            } else {
                this.setState({ show: true, hasAddressHeader: false });
            }

        }
    }
    private dismissView = () => {
        this.setState({ show: false });
    }

    private handleDefaultAddress = () => {
        const isDefault = !this.state.isDefault;
        this.setState({ isDefault });
    }

    private handleTextChanged = (key, value) => {
        if(key === 'phone') {
            const vv = value.replace(/[^\d]/g, '');
            this.setState({
                [key]: vv,
            });
        }else{
            this.setState({
                [key]: value,
            });
        }
    }
}

const styles = StyleSheet.create({
    inputStyle: {
        height: 40,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: 'lightgrey',
        paddingLeft: 15,
        paddingRight: 15,
    },
    selectStyle: {
        width,
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 15,
    },
});

export default NewAddress;
