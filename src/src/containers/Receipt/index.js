import * as React from 'react';
import {View, Text, TextInput, DeviceEventEmitter} from 'react-native';
import {Modal, Toast} from 'antd-mobile';
import ReceiptTitle from './ReceiptTitle';
import NormalReceipt from './NormalReceipt';
import ExtraReceipt from './ExtraReceipt';
import invoiceTips from '../../common/invoiceTips'
import {connect} from 'react-redux';
import {createAction} from '../../utils/index';
import {ICustomContain} from '../../interface';
import ReceiptList from "./ReceiptList";


let skku, attrValueNames, o2oAttrId;

@connect(({receiptModel}) => receiptModel)
class Receipt extends React.Component<ICustomContain, IReceiptState> {

    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state;
        return {
            title: params.headerTitle ? params.headerTitle : '开具发票',
            headerStyle: {justifyContent: 'center'},
            headerTitleStyle: {color: '#33333', alignSelf: 'center', fontWeight: 'normal', flex: 1, textAlign: 'center'},
            headerRight: (params.headerRight ? params.headerRight : null),
            headerTintColor: '#666',
            headerBackTitle: null,
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            invoiceType: 2, // 默认普通发票
            select: null
        };
    }

    // componentWillReceiveProps(nextProps) {
    //   if (this.props !== nextProps) {
    //     const {ordersCommitWrapM} = nextProps;
    //     this.setState({
    //       invoiceType: ordersCommitWrapM.memberInvoices.it,
    //     });
    //   }
    // }

    componentDidMount() {
        const {state: {params}} = this.props.navigation;
        skku = params.skku;
        attrValueNames = params.attrValueNames;
        o2oAttrId = params.o2oAttrId;
        this.props.dispatch({
            type: 'receiptModel/fetchReceipt',
        });
    }

    componentWillMount() {
        this.props.navigation.setParams({
            headerRight: <Text style={{fontSize: 14, marginRight: 15, color: '#666666'}}
                               onPress={this.showNotice}>发票须知</Text>,
        });
    }

    componentWillUnmount(){
        this.props.dispatch({type: 'receiptModel/clearData'});
    }

    _onSelect=(params)=>{
        // this.setState({select: params});
        DeviceEventEmitter.emit('onSelect', params);
        this.props.dispatch({
            type: 'receiptModel/save',
            payload: {
                bankCardNumber: params.bankCardNumber, //银行卡号
                bankName: params.bankName, //开户行
                invoiceTitle: params.invoiceTitle, //发票标题（增值税发票为公司名称）
                invoiceType: params.invoiceType, //1：增值税，2：普票
                receiptAddress: params.receiptAddress, //发票邮寄地址
                // "rcc": params.receiptConsignee, //发票邮寄收件人
                // "rcm": params.receiptMobile, //发票邮寄电话
                // "rcz": params.receiptZipcode, //发票邮寄邮编
                registerAddress: params.registerAddress, //公司注册地
                registerPhone: params.registerPhone, //公司注册电话
                taxPayerNumber: params.taxPayerNumber //公司注册税号},
            },
        })
    }

    render() {

        const {modalVisible} = this.state;
        const {ordersCommitWrapM} = this.props;
        return (
            <View style={{backgroundColor: '#eeeeee', flex: 1}}>

                <ReceiptTitle
                    {...ordersCommitWrapM}
                    invoiceType={this.state.invoiceType}
                    showNotice={this.showNotice}
                    changeReceiptType={this.changeReceiptType}
                    goReceiptList={()=>this.props.navigation.navigate('ReceiptList',{onSelect:(item)=>this._onSelect(item)})}
                />
                {this.state.invoiceType === 1?<ExtraReceipt
                    handleChanged={this.handleChanged}
                    visible={this.state.invoiceType === 1}
                    {...ordersCommitWrapM}
                    handleCommit={this.handleCommit}
                />:<NormalReceipt visible={this.state.invoiceType === 2} {...ordersCommitWrapM} handleCommit={this.handleCommit}/>}
                <Modal
                    visible={modalVisible}
                    transparent
                    maskClosable={false}
                    onClose={() => {
                        this.setState({modalVisible: false});
                    }}
                    footer={[{
                        text: '确定', onPress: () => {
                            this.setState({modalVisible: false});
                        }
                    }]}
                >
                    <Text>
                        {invoiceTips}
                    </Text>
                </Modal>
            </View>
        );
    }

    handleChanged=( {key, value})=>{
        this.props.dispatch({
            type: 'receiptModel/saveChange',
            payload: {
                key, value,
            }});

    }

    handleCommit = (value) => {
        console.log('commit-value=========', value);
        this.props.dispatch(createAction('receiptModel/commitReceipt')({
            params: {
                ...value,
                invoiceType: this.state.invoiceType
            }, skku, attrValueNames, o2oAttrId
        }));
    }

    showNotice = () => {
        this.setState({
            modalVisible: true,
        });
    }

    changeReceiptType = (value) => {
        Log('e============', value);
        if (value === '增值税发票') {
            this.setState({
                invoiceType: 1,
            });
        } else {
            this.setState({
                invoiceType: 2,
            });
        }
    }
}

export default Receipt;
