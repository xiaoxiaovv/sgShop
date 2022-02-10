import {
    View, Text, Button, Dimensions, TextInput, Image, StyleSheet,
    TouchableOpacity, DeviceEventEmitter, Modal, Alert, TouchableHighlight
} from 'react-native';
import React from 'react';
import ClearBtn from './ClearBtn';
import axios from 'axios';
import Config from 'react-native-config';
import { Toast } from 'antd-mobile';
interface isFlag {
    isHostL: boolean;
}
class TelPhone extends React.Component<isFlag>{
    constructor(props) {
        super(props);
        this.state = {
            isHostL: true,
        };
    }
    public isUsers = () => {
        const { navigation } = this.props;
        const { params } = this.props.navigation.state;
        const urlCode = Config.API_URL + Config.HOMEPAGE_ISWDHOST;
        axios.get(urlCode)
            .then((res) => res.data)
            .then((res) => {
                if (res.success) {
                    if (res.data.o2o == null || res.data.o2o == true) {
                        Alert.alert(
                            '',
                            '尊贵的VIP商户，请前往商户中心修改手机号。',
                            [
                                {
                                    text: '好的，我知道了！', onPress: () => {
                                        navigation.goBack();
                                    }
                                },
                            ],
                            { cancelable: true },
                        );
                    } else {
                        if (res.data.isHost == 1) {//微店主
                            navigation.navigate('TelVerify', { phone: params.phone });
                        } else if (res.data.isHost == 0) {//普通用户
                            this.setState({ isHostL: false });
                        }
                    }
                } else {
                    Toast.info(res.message);
                }
            })
    };

    public componentWillMount() {
        this.setState({ isHostL: true });
    }

    render() {
        // 从带过来的路由参数里面取值
        const { params } = this.props.navigation.state;
        return (
            <View style={styles.wrapper}>
                <Image style={styles.img} source={{ uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/PhoneManage@2x.png' }} />
                <Text style={styles.textone}>现在绑定的手机 {params.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</Text>
                <TouchableOpacity
                    onPress={this.isUsers}>
                    <View style={styles.btnone}>
                        <Text style={styles.texttwo}>更换手机号</Text>
                    </View>
                </TouchableOpacity>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={!this.state.isHostL}
                >
                    <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ marginTop: -42 }}>
                            <TouchableHighlight
                                style={{ alignItems: 'flex-end' }}
                                onPress={() => {
                                    this.setState({ isHostL: true });
                                }}>
                                <Image style={{ height: 22, width: 22 }} source={{ uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/hisClose@2x.png' }} />
                            </TouchableHighlight>
                            <View style={{ alignItems: 'flex-end' }}>
                                <View style={{ width: 1, height: 20, backgroundColor: 'white', marginRight: 11 }} />
                            </View>
                            <View style={{ backgroundColor: '#fff', width: 300, alignItems: 'center', borderRadius: 8, }}>
                                <Text style={{ fontSize: 14, color: '#000', marginTop: 20 }}>亲，升级微店主才可变更手机号。</Text>
                                <TouchableHighlight
                                    style={{ width: 270, height: 34, backgroundColor: '#2464E6', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginTop: 20, marginBottom: 10 }}
                                    onPress={() => {
                                        this.setState({ isHostL: true });
                                        this.props.navigation.navigate('NewRegister', {step: 2, hiddenSetPassword: true});
                                    }}
                                >
                                    <Text style={{ fontSize: 14, color: '#fff' }}>升级微店主</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'center'
    },
    img: {
        height: 120,
        width: 120,
        marginTop: 100,
    },
    textone: {
        color: '#999',
        fontSize: 14,
        marginTop: 20,
        marginBottom: 30,
    },
    texttwo: {
        color: '#fff',
        fontSize: 16,
    },
    btnone: {
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 40,
        paddingRight: 40,
        backgroundColor: '#2979FF',
        borderRadius: 50,
        shadowColor: 'rgba(41,121,255,.5)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
});

export default TelPhone;

