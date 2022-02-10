import * as React from 'react';
import {View, Text, TextInput, StyleSheet, ScrollView, Modal, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import {Toast} from 'antd-mobile';
import Button from 'rn-custom-btn1';
import EStyleSheet from 'react-native-extended-stylesheet';
import CustomButton from 'rn-custom-btn1';
import Address from '../../components/Address';
import {connect} from 'react-redux';
import { GET } from '../../config/Http';
import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
let streetList = [];
export interface AppProps {
    handleCommit?: (value) => void;
    invoiceType?: number;
    visible: boolean;
}

export interface AppState {
    invoiceTitle?: string;
    taxPayerNumber?: string;
    registerAddress?: string;
    registerPhone?: string;
    bankName?: string;
    bankCardNumber?: string;
    receiptMobile?: string;
    receiptConsignee?: string;
    receiptAddress?: string;
    receiptZipcode?: string;
    visible?: boolean;
    submitParams: any;
    show: boolean;
    alertShow: boolean;
    saveDisable: boolean;
    locationInfo: any;
    hasAddressHeader: boolean;
}

@connect(({
              receiptModel: {
                  invoiceTitle,
                  taxPayerNumber,
                  registerAddress,
                  registerPhone,
                  bankName,
                  bankCardNumber
              }
          }) => ({
    invoiceTitle,
    taxPayerNumber,
    registerAddress,
    registerPhone,
    bankName,
    bankCardNumber
}))
export default class ExtraReceipt extends React.Component<AppProps, AppState> {
    public constructor(props) {
        super(props);
        console.log('----super(props);-----');
        console.log(props);
        let productDetailLocation = {}; // 商品详情页带入的默认收货地址
        if(dvaStore.getState().goodsDetail){
            for(let key in dvaStore.getState().goodsDetail.toJS()){
                productDetailLocation = dvaStore.getState().goodsDetail.toJS()[key].productInfo.location;
            }
        }
        let receiptAddress = props.memberInvoices.rca || '';
        // if(props.memberInvoices.rca){
        //     let rca = props.memberInvoices.rca;
        //     let p = productDetailLocation.pcrName ? productDetailLocation.pcrName.split(' ')[0]: "";
        //     let c = productDetailLocation.pcrName ? productDetailLocation.pcrName.split(' ')[1]: "";
        //     let d = productDetailLocation.pcrName? productDetailLocation.pcrName.split(' ')[2].split('/')[0]:'';
        //     let s = productDetailLocation.pcrName? productDetailLocation.pcrName.split(' ')[2].split('/')[1]:'';
        //     console.log(p,c,d,s);
        //     let s1 = rca.replace(p, '');
        //     let s2 = s1.replace(c, '');
        //     let s3 = s2.replace(d, '');
        //     receiptAddress = s3.replace(s, '');
        // }
        this.state = {
            show: false,
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


            // invoiceTitle: null,
            // taxPayerNumber: null,
            // registerAddress: null,
            // registerPhone: null,
            // bankName: null,
            // bankCardNumber: null,

            // invoiceTitle: props.invoiceTitle || '',
            // taxPayerNumber: props.taxPayerNumber || '',
            // registerAddress: props.registerAddress || '',
            // registerPhone: props.registerPhone || '',
            // bankName: props.bankName || '',
            // bankCardNumber: props.bankCardNumber || '',
            // submitParams: props.submitParams || {},

            invoiceTitle: props.memberInvoices.bc || '',
            taxPayerNumber: props.memberInvoices.tpn || '',
            registerAddress: props.memberInvoices.rga || '',
            registerPhone: props.memberInvoices.rgp || '',
            bankName: props.memberInvoices.bn || '',
            bankCardNumber: props.memberInvoices.cbn || '',
            receiptMobile: props.memberInvoices.rcm || '',
            receiptConsignee: props.memberInvoices.rcc || '',
            receiptAddress: receiptAddress || '',
            receiptZipcode: props.memberInvoices.rcz || '',
            submitParams: props.memberInvoices || {},



            // receiptMobile: '',
            // receiptConsignee: '',
            // receiptAddress: '',
            // receiptZipcode: '',
            visible: false,
            // submitParams: {}, //提交发票时的其它信息
        };
    }

    public componentDidMount(){
        this.subscription = DeviceEventEmitter.addListener('onSelect', params=>{
            console.log('------onSelect   ---componentDidMount--------');
            console.log(params);
            this.setState({
                bankCardNumber: params.bankCardNumber, //银行卡号清华
                bankName: params.bankName, //开户行
                invoiceTitle: params.invoiceTitle, //发票标题（增值税发票为公司名称）
                registerAddress: params.registerAddress, //公司注册地
                registerPhone: params.registerPhone, //公司注册电话
                taxPayerNumber: params.taxPayerNumber ,//公司注册税号})
            });
        });
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
    public componentWillUnmount(){
        this.subscription.remove();
    }
    public componentWillReceiveProps(nextProps) {

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
        this.setState({
            [key]: value,
        });
    }

    private handleChanged =(key, value) => {
        this.props.handleChanged({key, value})
    }
    public render() {
        const { handleCommit, visible} = this.props;
        return (
            visible ?
                <ScrollView style={[styles.container]} keyboardDismissMode={'on-drag'} keyboardShouldPersistTaps={'always'}>
                    <View style={styles.rowContainer}>
                        <Text style={{color: 'red', margin: 10}}>*</Text>
                        <Text style={styles.title}>公司名称</Text>
                        <TextInput
                            onChangeText={ (text) => { this.handleTextChanged('invoiceTitle', text); }}
                            style={[styles.inputStyle, {borderTopWidth: 0}]}
                            placeholder='公司名称'
                            underlineColorAndroid='transparent'
                            value={this.state.invoiceTitle}
                            // defaultValue={this.props.invoiceTitle}
                            placeholderTextColor='#999999'
                        />
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.rowContainer}>
                        <Text style={{color: 'red', margin: 10}}>*</Text>
                        <Text style={styles.title}>纳税人识别号</Text>
                        <TextInput
                            onChangeText={ (text) => { this.handleTextChanged('taxPayerNumber', text); }}
                            style={[styles.inputStyle, {borderTopWidth: 0}]}
                            placeholder='长度为15位或18位或20位'
                            underlineColorAndroid='transparent'
                            value={this.state.taxPayerNumber}
                            // defaultValue={this.props.taxPayerNumber}
                            placeholderTextColor='#999999'
                        />
                    </View>
                    <View style={{backgroundColor: '#eeeeee', height: 4}}/>
                    <View style={styles.rowContainer}>
                        <Text style={{color: 'red', margin: 10}}>*</Text>
                        <Text style={styles.title}>注册地址</Text>
                        <TextInput
                            onChangeText={ (text) => { this.handleTextChanged('registerAddress', text); }}
                            style={[styles.inputStyle, {borderTopWidth: 0}]}
                            // placeholder='注册地址'
                            underlineColorAndroid='transparent'
                            value={this.state.registerAddress}
                            // defaultValue={this.props.registerAddress}
                        />
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.rowContainer}>
                        <Text style={{color: 'red', margin: 10}}>*</Text>
                        <Text style={styles.title}>注册电话</Text>
                        <TextInput
                            onChangeText={ (text) => { this.handleTextChanged('registerPhone', text); }}
                            style={[styles.inputStyle, {borderTopWidth: 0}]}
                            // placeholder='座机(区号-号码)或手机'
                            underlineColorAndroid='transparent'
                            value={this.state.registerPhone}
                            // defaultValue={this.props.registerPhone}
                        />
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.rowContainer}>
                        <Text style={{color: 'red', margin: 10}}>*</Text>
                        <Text style={styles.title}>开户银行</Text>
                        <TextInput
                            onChangeText={ (text) => { this.handleTextChanged('bankName', text); }}
                            style={[styles.inputStyle, {borderTopWidth: 0}]}
                            underlineColorAndroid='transparent'
                            // placeholder='开户银行'
                            value={this.state.bankName}
                            // defaultValue={this.props.bankName}
                        />
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.rowContainer}>
                        <Text style={{color: 'red', margin: 10}}>*</Text>
                        <Text style={styles.title}>开户账号</Text>
                        <TextInput
                            onChangeText={ (text) => { this.handleTextChanged('bankCardNumber', text); }}
                            style={[styles.inputStyle, {borderTopWidth: 0}]}
                            underlineColorAndroid='transparent'
                            // placeholder='开户账号'
                            value={this.state.bankCardNumber}
                            // defaultValue={this.props.bankCardNumber}
                        />
                    </View>
                    <Text
                        style={styles.tips}>
                        发票邮寄地址：如发票与商品发往同一地址，可不填
                    </Text>
                    <View style={styles.rowContainer}>
                        <Text style={[styles.title, {marginLeft: 10}]}>收件人姓名</Text>
                        <TextInput
                            onChangeText={ (text) => { this.handleTextChanged('receiptConsignee', text); }}
                            style={[styles.inputStyle, {borderTopWidth: 0}]}
                            underlineColorAndroid='transparent'
                            // placeholder='收件人姓名'
                            value={this.state.receiptConsignee}
                            // defaultValue={this.state.receiptConsignee}
                        />
                    </View>
                    <View style={styles.line}/>
                    <CustomButton
                        title={this.state.locationInfo.province.text ?
                            this.getLocationInStringNew() : '所在地区'}
                        style={[styles.inputStyle2 ]}
                        innerStyle={styles.selectStyle}
                        imageStyle={{ width: 25, height: 25, resizeMode: 'contain' }}
                        image={require('../../images/clear.png')}
                        onPress={() => this.showView(1)}
                    />
                    <CustomButton
                        title={this.state.locationInfo.street.text ?
                            this.state.locationInfo.street.text : '街道'}
                        style={[styles.inputStyle2]}
                        innerStyle={styles.selectStyle}
                        imageStyle={{ width: 25, height: 25, resizeMode: 'contain' }}
                        image={require('../../images/clear.png')}
                        onPress={() => this.showView(2)}
                    />
                    <View style={styles.rowContainer}>
                        <Text style={{color: 'red', margin: 10}}>*</Text>
                        <Text style={[styles.title]}>详细地址</Text>
                        <TextInput
                            onChangeText={ (text) => { this.handleTextChanged('receiptAddress', text); }}
                            style={[styles.inputStyle, {borderTopWidth: 0}]}
                            underlineColorAndroid='transparent'
                            placeholder='请输入详细地址[包含省市区]'
                            value={this.state.receiptAddress}
                            defaultValue={this.state.receiptAddress}
                            placeholderTextColor='#999999'
                        />
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.rowContainer}>
                        <Text style={[styles.title, {marginLeft: 10}]}>收件人邮编</Text>
                        <TextInput
                            onChangeText={ (text) => { this.handleTextChanged('receiptZipcode', text); }}
                            style={[styles.inputStyle, {borderTopWidth: 0}]}
                            underlineColorAndroid='transparent'
                            // placeholder='收件人邮编'
                            value={this.state.receiptZipcode}
                            defaultValue={this.state.receiptZipcode}
                        />
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.rowContainer}>
                        <Text style={{color: 'red', margin: 10}}>*</Text>
                        <Text style={[styles.title]}>收件人手机</Text>
                        <TextInput
                            onChangeText={ (text) => { this.handleTextChanged('receiptMobile', text); }}
                            style={[styles.inputStyle, {borderTopWidth: 0}]}
                            underlineColorAndroid='transparent'
                            // placeholder='收件人电话'
                            value={this.state.receiptMobile}
                            dataDetectorTypes={'phoneNumber'}
                            defaultValue={this.state.receiptMobile}
                        />
                    </View>
                    <View style={styles.line}/>
                    <Button
                        title='确定'
                        onPress={this.handleCommitExtra}
                        textStyle={{color: 'white', fontWeight: 'bold', fontSize: 14}}
                        style={{margin: 20, height: 40, borderRadius: 40, backgroundColor: '#3c7cf6'}}
                    />
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
                </ScrollView> :
                null
        );
    }

    private checkInfo = (): boolean => {
        let errMessage = false;
        if (!( /^.[^&<>]{1,}$/.test(this.state.invoiceTitle )) || (!this.state.invoiceTitle )) {
            errMessage = '公司名称必填,且不能包含特殊字符';
        } else if (!(/^[0-9A-Za-z]{18}$|^[0-9A-Za-z]{15}$|^[0-9A-Za-z]{20}$/.test(this.state.taxPayerNumber))) {
            errMessage = '纳税人识别号为15位或18位或20位的数字或字母';
        } else if (!( /^.[^&<>]{4,}$/.test(this.state.registerAddress)) || (!this.state.registerAddress)) {
            errMessage = '注册地址至少5个字符，且不能包含特殊字符';
        } else if ((this.state.registerPhone&&this.state.registerPhone.length < 8) || (!this.state.registerPhone)) {
            errMessage = '注册电话格式：0532-12345678';
        } else if (!this.state.bankName) {
            errMessage = '开户银行为必填';
        } else if (!this.state.bankCardNumber) {
            errMessage = '开户账号为必填';
        }else if(!this.state.receiptAddress){
            errMessage = '发票邮寄详细地址为必填';
        }else if(!this.state.receiptMobile){
            errMessage = '发票邮寄收件人手机号为必填';
        }else if(!global.mobileNumberRegExp.test(this.state.receiptMobile)){
            errMessage = '发票邮寄收件人手机号格式不对';
        }

        if (errMessage) {
            console.log('checkInfo','return false')
            Toast.info(errMessage, 2);
            return false;
        } else {
            console.log('checkInfo','return true')
            return true;
        }
    }


    private handleCommitExtra = (): void => {

        console.log('locationInfo',this.state.locationInfo)
        if(this.checkInfo()){
            const {handleCommit} = this.props;
            handleCommit({
                bankCardNumber: this.state.bankCardNumber, //银行卡号清华
                bankName: this.state.bankName, //开户行
                invoiceTitle: this.state.invoiceTitle, //发票标题（增值税发票为公司名称）
                registerAddress: this.state.registerAddress, //公司注册地
                registerPhone: this.state.registerPhone, //公司注册电话
                taxPayerNumber: this.state.taxPayerNumber ,//公司注册税号})

                invoiceType: this.props.invoiceType, //1：增值税，2：普票
                receiptConsignee: this.state.receiptConsignee, //发票邮寄收件人
                receiptMobile: this.state.receiptMobile, //发票邮寄电话
                receiptZipcode: this.state.receiptZipcode, //发票邮寄邮编
                locationInfo: this.state.locationInfo,
                receiptAddress: this.state.receiptAddress,
                submitParams: this.state.submitParams,
            });

            const arr = [
                {key: "bankCardNumber" , value: this.state.bankCardNumber},
                {key: "bankName", value: this.state.bankName},
                {key: "invoiceTitle", value: this.state.invoiceTitle},
                {key: "registerAddress", value: this.state.registerAddress},
                {key: "registerPhone", value: this.state.registerPhone},
                {key: "taxPayerNumber", value: this.state.taxPayerNumber},
            ];
            console.log(arr);
            for (let i =0; i< arr.length; i++){
                const item = arr[i];
                this.handleChanged(item['key'], item['value'])
            }

        }
    }
}

const styles = EStyleSheet.create({
    container: {
        backgroundColor: '#eeeeee',
    },
    title: {color: '#333333', backgroundColor: 'white', margin: 10, marginLeft: 0},
    inputStyle: {
        flex: 1,
        height: 40,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: 'lightgrey',
        padding: 0,
        paddingLeft: 15,
        paddingRight: 15,
        color: '#333333',
    },
    tips: {
        flex: 1,
        width: '375rem',
        height: 40,
        lineHeight: 40,
        fontSize: 12,
        backgroundColor: '#EEEEEE',
        textAlignVertical: 'center',
        alignSelf: 'center',
        textAlign: 'left',
        margin: 0,
        paddingLeft: 10,
        color: '#999999',
    },
    rowContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
    },
    line: {
        marginLeft: 10,
        height: 1,
        backgroundColor: '#EEEEEE',
        marginRight: 10,
    },
    inputStyle2: {
        height: 40,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
        paddingLeft: 0,
        paddingRight: 15,
    },
    selectStyle: {
        width,
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        paddingLeft: 0,
        paddingRight: 15,
    },
});
