import { View, Text, Button, TextInput, Image, StyleSheet,
    TouchableOpacity, DeviceEventEmitter, Modal, ScrollView } from 'react-native';
import * as React from 'react';
import { Toast } from 'antd-mobile';
import CustomButton from 'rn-custom-btn1';
import { UltimateListView } from 'rn-listview';
import { INavigation } from '../../interface/index';
import Address from '../../components/Address';
import URL from '../../config/url';
import { GET, POST_JSON, GET_P, POST_FORM } from '../../config/Http';

let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

interface IState {
    id: string;
    name: string;
    address: string;
    phone: string;
    show: boolean;
    locationInfo: any;
    de: string,
}

interface INewAddress {
    locationInfo: any;
}

class EditAddress extends React.Component<INavigation & INewAddress> {
    private static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;

        return {
            title: '修改收货地址',
            headerStyle: { justifyContent: 'center'},
            headerTitleStyle: { color: 'black', alignSelf: 'center'},
            headerRight: (params.headerRight ? params.headerRight : null),
            headerTintColor: '#666',
            headerBackTitle: null,
        };
    }

    public state: IState;
    constructor(props) {
        super(props);
        const item = props.navigation.state.params.item;
        // Log(item);

        // const addressValues = item.regionName.split(' ');
        // this.state = {
        //     id: item.id,
        //     show: false,
        //     name: item.consignee,
        //     phone: item.mobile,
        //     address: item.address,
        //     locationInfo: {
        //         province: {
        //             value: item.provinceId,
        //             text: addressValues[0],
        //         },
        //         city: {
        //             value: item.cityId,
        //             text: addressValues[1],
        //         },
        //         district: {
        //             value: item.regionId,
        //             text: addressValues[2],
        //         },
        //         street: {
        //             value: item.streetId,
        //             text: addressValues[3],
        //         },
        //     },
        // };
        this.state = {
            id: '',
            show: false,
            name: '',
            phone: '',
            address: '',
            de: '',   //是否默认收获地址
            locationInfo: {
                province: {
                    value: '',
                    text: '',
                },
                city: {
                    value: '',
                    text: '',
                },
                district: {
                    value: '',
                    text: '',
                },
                street: {
                    value: '',
                    text: '',
                },
            },
        };
    }
    public componentWillMount(){
        const item = this.props.navigation.state.params.item;
        // 初始化话数据接口 yl
        const initData = async()=>{
            const {data} = await POST_JSON(URL.ADDRESS+'?id='+item.id);
            const addressValues = data.rn? data.rn.split(' '): '';
            this.setState({
                id: data.id,
                show: false,
                name: data.co,
                phone: data.mo,
                address: data.ar,
                de: data.de,
                locationInfo: {
                    province: {
                        value: data.pi,
                        text: addressValues[0],
                    },
                    city: {
                        value: data.ci,
                        text: addressValues[1],
                    },
                    district: {
                        value: data.ri,
                        text: addressValues[2],
                    },
                    street: {
                        value: data.si,
                        text: addressValues[3],
                    },
                },
            })
            console.log(this.state)
        }
        initData();
    }
    public componentDidMount() {
        this.props.navigation.setParams({headerRight: <TouchableOpacity
            activeOpacity={1}
            style={{marginRight: 10}}
            onPress={ () => {
                this.saveEditAddress()
            }}>
            <Text>保存</Text>
        </TouchableOpacity>});
    }

    public render() {
        console.log(this.state)
        return(this.state ?
            <View style={{height: '100%'}}>
                <ScrollView
                    style={{paddingTop: 30}}
                    keyboardShouldPersistTaps="always"
                    keyboardDismissMode="on-drag"
                >
                    <TextInput
                        onChangeText={ (text) => { this.handleTextChanged('name', text); }}
                        style={[styles.inputStyle, {borderTopWidth: 0}]}
                        placeholder='收货人'
                        underlineColorAndroid='transparent'
                        value={this.state.name}/>
                    <TextInput
                        onChangeText={ (text) => { this.handleTextChanged('phone', text); }}
                        style={styles.inputStyle}
                        placeholder='手机号'
                        keyboardType={'numeric'}
                        underlineColorAndroid='transparent'
                        value={this.state.phone}/>
                    <CustomButton
                        title={ this.state.locationInfo ?
                            this.getLocationInString() : '所在地区'}
                        style={[styles.inputStyle]}
                        innerStyle={styles.selectStyle}
                        imageStyle={{width: 25, height: 25, resizeMode: 'contain' }}
                        image={require('../../images/clear.png')}
                        onPress={this.showView}
                    />
                    <TextInput style={styles.inputStyle}
                                onChangeText={ (text) => { this.handleTextChanged('address', text); }}
                                placeholder='详细地址'
                                underlineColorAndroid='transparent'
                                value={this.state.address}
                    />
                    </ScrollView>
                    <CustomButton
                        title='设为默认收货地址'
                        style={{
                            zIndex: 3, height: 40, width: width * 0.7, position: 'absolute',
                            backgroundColor: '#2979FF', alignSelf: 'center', bottom: 23, borderRadius: 40,
                        }}
                        innerStyle={{ flexDirection: 'row'}}
                        textStyle={{ color: '#fff', fontSize: 17 }}
                        onPress={ () => this.saveEditAddress(()=>{
                            this.handleUpdateDefaultAddress() 
                        })}
                    />
                    <Modal
                        transparent={true}
                        visible={this.state.show}
                        animationType='slide'
                        >
                            <View style={{width: '100%', height: '100%',backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 10}}>
                                <TouchableOpacity
                                    style={{position: 'absolute', top: 0, left: 0,
                                            width: '100%', height: height - 400}}
                                    activeOpacity={1} onPress={() => this.dismissView()}>
                                <View style={{position: 'absolute', top: 0, left: 0, width: '100%',
                                        height: height - 400}}></View>
                                </TouchableOpacity>
                                <Address
                                    hasHeader={true}
                                    onclick={() => this.setState({show: false})}
                                    onSelect = {(location) => {
                                        this.setState({
                                            show: false,
                                            locationInfo: {...location},
                                        });
                                        // Log(location);
                                        // Log(this.state.locationInfo);
                                    }}
                                />
                            </View>
                    </Modal>
                </View>
        :null);
    }
    // 保存收获地址 yl
    private saveEditAddress = (callback)=>{
        let error = '';
        if (this.state.name.length === 0) {
            error = '收货人不能为空';
        } else if (!/^1([3578][0-9]|4[01356789]|66|9[89])\d{8}$/.test(this.state.phone)) {
            error = '手机号格式不正确';
        } else if (this.state.address.length === 0) {
            error = '地址不能为空';
        }

        if (!error) {
            this.postChangedAddress(callback);
        } else {
            Toast.info(error, 3);
        }
    }
    private handleUpdateDefaultAddress = async () => {
        // const {success, message} = await getAppJSON(`v3/h5/sg/shippingAddress/updateDefaultAddr.html?addrId=${this.state.id}`);
        const {success, message} = await POST_JSON(URL.UPDATEDEFAULTADDRESS+'?m='+this.state.id);

        if (success) {
            
        } else {
            // Toast.info(`更改默认收货地址失败, 错误码: ${data.errorCode}`, 3);
            Toast.info(message, 3);
        }
    }

    private getLocationInString() {
        const worker = (source) => {
            return `${source.province.text} ${source.city.text } ${source.district.text } ${source.street.text }`;
        };

        return worker( this.state.locationInfo );
    }

    private async postChangedAddress(callback) {
        const location = this.state.locationInfo;

        // const url = 'v3/h5/sg/shippingAddress/update.html?' +
        // `addrId=${this.state.id}&consignee=${this.state.name}` +
        // `&mobile=${this.state.phone}&address=${this.state.address}&` +
        // // `regionName=${encodeURI(this.getLocationInString())}&` +
        // `regionName=${this.getLocationInString()}&` +
        // `areaId=${location.district.value}&cityId=${location.city.value}&` +
        // `provinceId=${location.province.value}&streetId=${location.street.value}`;
        
        // Log(url);
        // const resp = await postAppJSON(url, {});
        // Log(resp);
        const resp = await POST_JSON(URL.UPDATEADDRESS, {
            "id": this.state.id,
            "co": this.state.name,
            "pi": location.province.value,
            "ci": location.city.value,
            "ri": location.district.value,
            "si": location.street.value,
            "rn": this.getLocationInString(),
            "ar": this.state.address,
            "zc": "",
            "mo": this.state.phone,
            "ph": "",
            "de": this.state.de
        })
        if (resp.success) {
            if(callback){await callback()}
            DeviceEventEmitter.emit('addressChanged', {toReload: true});
            this.props.navigation.goBack();
        } else {
            resp.message && Toast.info(`${resp.message}`, 1);
        }
    }

    private showView = () => {
        this.setState({show: true});
    }
    private dismissView = () => {
        this.setState({show: false});
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

export default EditAddress;
