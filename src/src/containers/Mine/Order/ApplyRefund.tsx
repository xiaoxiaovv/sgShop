import {
    StyleSheet,
    View,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    Modal,
    TextInput,
    Keyboard,
    Platform,
    InteractionManager,
} from 'react-native';
import * as React from 'react';
import {Button, Toast, TextareaItem} from 'antd-mobile';
import {INavigation} from '../../../interface/index';
import {isiPhoneX, width, height} from '../../../utils';
import {postAppJSON, getAppJSON} from '../../../netWork';
import EStyleSheet from 'react-native-extended-stylesheet';
import Config from 'react-native-config';
import {NavBar} from '../../../components/NavBar';

interface IOrderTrackProps {
    cOrderSn: string;
}

interface IOrderTrackState {
    data: any;
    show: boolean;
    refundCause: string;
    refundText: string;
}

const popOptions = [
    {title: '七天无理由', index: 0},
    {title: '大小尺寸', index: 1},
    {title: '颜色款式', index: 2},
    {title: '质量问题', index: 3},
    {title: '配送问题', index: 4},
    {title: '库存问题', index: 5},
    {title: '地址问题', index: 6},
    {title: '其他', index: 7},
];

class ApplyRefund extends React.Component<INavigation & IOrderTrackProps, IOrderTrackState> {
    private timer: any;

    public constructor(props) {
        super(props);

        this.state = {
            data: null,
            show: false,
            refundCause: '',
            refundText: '',
        };
    }

    public componentDidMount() {
        // 可以让导航切换页面动画完成后再执行请求数据的操作
        // InteractionManager.runAfterInteractions(() => {
        //     // 请求数据
        //
        // });
        this.getData();
    }

    public componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }

    public render(): JSX.Element {

        const optionCard = ({option}) => {
            return (
                <TouchableOpacity
                    key={option.index}
                    onPress={() => {
                        this.setState({refundCause: option.title}, () => {
                            this.dismissView();
                        });
                    }}
                    style={{flex: 1}}
                >
                    <View style={{width: '100%', height: 0.5, backgroundColor: 'rgb(200,202,205)'}}></View>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <View style={{alignItems: 'center', padding: 10}}>
                            <Text>{option.title}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        };
        const optionCards = [];
        for (const option of popOptions) {
            if (option) {
                const Card = optionCard({option});
                optionCards.push(Card);
            }
        }

        return (
            <View style={{backgroundColor: '#f1f1f1', flex: 1}}>
                <NavBar title={'申请退款'}/>
                {this.state.data !== null &&
                <View style={{backgroundColor: '#f1f1f1', flex: 1}}>
                    <ScrollView contentContainerStyle={{paddingBottom: 20}}
                                style={{backgroundColor: '#f1f1f1', flex: 1}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: 'white'}}>
                            <Image
                                source={require('../../../images/smallbell.png')}
                            />
                            <Text>退货完成后, 系统将自动扣减佣金</Text>
                        </View>
                        <View>
                            <View style={{flexDirection: 'row', alignItems: 'center', padding: 15}}>
                                <Text>退款类型</Text>
                                <Text style={{color: 'red'}}> *</Text>
                            </View>
                            <View style={{
                                justifyContent: 'center',
                                padding: 15, paddingTop: 20, paddingBottom: 20, backgroundColor: 'white'
                            }}>
                                <Text style={{color: '#a4a4a4'}}>
                                    {
                                        this.state.data.orderType === 1 ? '退货退款' : '退货不退款'
                                    }
                                </Text>
                            </View>
                        </View>
                        <View>
                            <View style={{flexDirection: 'row', alignItems: 'center', padding: 15}}>
                                <Text>退款原因</Text>
                                <Text style={{color: 'red'}}> *</Text>
                            </View>
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row', justifyContent: 'space-between',
                                    padding: 15, paddingTop: 20, paddingBottom: 20, backgroundColor: 'white'
                                }}
                                activeOpacity={0.7}
                                onPress={() => this.popView()}>
                                <Text style={{color: '#a4a4a4'}}>
                                    {this.state.refundCause ? this.state.refundCause : '请选择退款原因'}</Text>
                                <Image
                                    source={require('../../../images/ic_other_arrow.png')}
                                />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <View style={{flexDirection: 'row', alignItems: 'center', padding: 15}}>
                                <Text>退款金额</Text>
                                <Text style={{color: 'red'}}> *</Text>
                            </View>
                            <View style={{
                                justifyContent: 'center', padding: 15,
                                paddingTop: 20, paddingBottom: 20, backgroundColor: 'white'
                            }}>
                                <Text style={{color: '#a4a4a4'}}>¥{this.state.data.orderAmount.toFixed(2)}</Text>
                            </View>
                        </View>
                        <View style={{paddingBottom: 20}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', padding: 15}}>
                                <Text>退款说明 (选填)</Text>
                            </View>
                            <View style={{justifyContent: 'center', padding: 10, backgroundColor: 'white'}}>
                                <TextareaItem
                                    rows={5}
                                    count={100}
                                    placeholder='请输入退款说明'
                                    onChange={(text) => {
                                        this.setState({refundText: text});
                                    }}
                                />
                                {/* <TextInput style={styles.inputText}
                                 underlineColorAndroid='transparent'
                                 placeholder='请输入退款说明'
                                 maxLength = {100}
                                 numberOfLines ={0}
                                 multiline = {true}
                                 onChangeText={(text) => {
                                 this.setState({refundText: text});
                                 }}
                                 onSubmitEditing={Keyboard.dismiss}
                                 /> */}
                            </View>
                        </View>
                    </ScrollView>
                    <View style={styles.bottomBar}>
                        <Button type='primary'
                                onClick={() => {
                                    if (this.state.refundCause !== null) {
                                        this.postData();
                                    } else {
                                        Toast.info('请选择退款原因', 1);
                                    }
                                }}
                                style={{
                                    backgroundColor: 'rgb(45,175,254)',
                                    height: 35, borderColor: 'rgb(45,175,254)'
                                }}
                        >提交</Button>
                    </View>
                    <Modal
                    // 设置Modal组件的呈现方式
                      animationType='slide'
                    // 它决定 Modal 组件是否是透明的
                      transparent={true}
                    // 它决定 Modal 组件何时显示、何时隐藏
                      visible={this.state.show}
                    // 当 Modal组件在屏幕上完成显示后，这个回调函数将被执行
                      onShow={() => Log('onShow')  }
                    // 这是 Android 平台独有的回调函数类型的属性
                    // 开发者必须要写一个函数来处理当 Modal 显示在界面时且android物理返回键被按下时的业务逻辑
                      onRequestClose={() => Log('onShow')}
                >
                    <View style={styles.backGroundView}>
                        <TouchableOpacity
                            style={styles.missClickView}
                            activeOpacity={1} onPress={() => this.dismissView()}>
                            <View style={styles.missClickView}></View>
                        </TouchableOpacity>
                        <View style={styles.popContainer}>
                            <View style={{flex: 1, justifyContent: 'center'}}>
                                <View style={{alignItems: 'center', padding: 15}}>
                                    <Text style={{fontSize: 13, color: '#7c7c7c'}}>请选择退款原因</Text>
                                </View>
                            </View>
                            {optionCards}
                        </View>
                    </View>
                </Modal>
                    </View>
                }
            </View>
        );
    }

    private dismissView() {
        this.setState({
            show: false,
        });
    }

    private popView() {
        this.setState({
            show: true,
        });
    }

    // 获取数据
    private getData = async () => {
        try {
            // 获取订单详情数据
            const {params} = this.props.navigation.state;
            const json = await getAppJSON(Config.ORDER_REFUND, {
                cOrderSn: params.cOrderSn,
            });
            // Log('zhaoxincheng data', json);
            if (json.success) {
                this.setState({data: json.data});
            } else {
                Toast.fail(json.message, 1);
            }
        } catch (err) {
            Log(err);
        }
    }

    // 提交数据
    private postData = async () => {
        try {
            const {params} = this.props.navigation.state;
            const json = await getAppJSON(Config.ORDER_SUBMITORDER_REPAIR,
                {
                    cOrderSn: params.cOrderSn,
                    typeActual: this.state.data.orderType,
                    description: this.state.refundText,
                    reason: this.state.refundCause,
                });
            // Log('zhaoxincheng data', json);
            if (json.success) {
                // console.log('zhaoxincheng>>>>>', json);
                if (json.data.state === 'S') {
                    Toast.success('提交成功', 1);
                    this.timer = setTimeout(
                        () => {
                            // 点击了返回,当前界面pop出栈,刷新前一个界面
                            const {callBack} = this.props.navigation.state.params;
                            if (callBack) {
                                // 刷新我的界面
                                callBack();
                            }
                            this.props.navigation.goBack();
                        },
                        2000,
                    );
                } else if (json.data.message) {
                    Toast.fail(json.data.message, 1);
                    this.timer = setTimeout(
                        () => {
                            // 点击了返回,当前界面pop出栈,刷新前一个界面
                            const {callBack} = this.props.navigation.state.params;
                            if (callBack) {
                                // 刷新订单详情界面
                                callBack();
                            }
                            this.props.navigation.goBack();
                        },
                        2000,
                    );
                } else {
                    Toast.fail('提交失败' + json.message, 1);
                }
            } else {
                Toast.fail('提交失败' + json.message, 1);
            }
        } catch (err) {
            Log(err);
        }
    }
}

const styles = EStyleSheet.create({
    topHeaderStyle: {
        backgroundColor: '#5fc5ff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        alignItems: 'center',
    },
    backGroundView: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    missClickView: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: height * 0.17,
        backgroundColor: 'transparent',
    },
    popContainer: {
        height: isiPhoneX ? (height * 0.83 - width * 0.025 - 34) : (height * 0.83 - width * 0.025),
        width: width * 0.95,
        backgroundColor: 'rgb(237,239,240)',
        marginTop: height * 0.17,
        marginBottom: isiPhoneX ? (width * 0.025 + 34) : width * 0.025,
        borderRadius: 8,
    },
    inputText: {
        flex: 1,
        height: '100rem',
        backgroundColor: 'transparent',
        fontSize: '14rem',
        fontFamily: '.PingFangSC-Medium',
        color: '#666666',
        padding: 0,
        borderWidth: 1,
        borderColor: 'rgb(242,242,242)',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    bottomBar: {
        position: 'absolute',
        backgroundColor: 'white',
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: isiPhoneX ? (34 + 5) : 5,
        left: 0,
        bottom: 0,
        borderTopWidth: 0.5,
        borderColor: 'rgb(242,242,242)',
    },
    titleStyle: {
        fontSize: '18rem',
        color: 'rgb(12,96,254)',
    },
});

export default ApplyRefund;
