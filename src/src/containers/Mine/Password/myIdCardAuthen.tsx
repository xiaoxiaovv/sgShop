import {
    View, Text, Button, Dimensions, TextInput, Image, StyleSheet,
    TouchableOpacity, DeviceEventEmitter, Modal,ScrollView
} from 'react-native';
import React from 'react';
import ClearBtn from './ClearBtn';
import Config from 'react-native-config';
import axios from 'axios';
import { connect, createAction } from '../../../utils';
import { Toast } from 'antd-mobile';
import { getAppJSON } from '../../../netWork';
import CustomNaviBar from '../../../components/customNaviBar';
interface AuthenFlag {
    flag: boolean;
    input1: string;
    input2: string;
    message: string;
};

@connect()
class myIdCardAuthen extends React.Component< AuthenFlag >{
    public static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: '身份认证',
            header: null,
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            flag: false,
            input1: '',
            input2: '',
            message:'',
        }
    }

    //下一步
    nextSubmit = () => {
        if (this.state.flag){
            if(this.state.input1.length<1){
                Toast.show('请输入姓名',2);
                return;
            }
            // GETNAMEAUTH
            const urlNext = Config.API_URL + Config.GETNAMEAUTH;
            axios.get(urlNext, { params: { realName: this.state.input1, identityNo: this.state.input2 } })
                .then((res) => res.data)
                .then((res) => {
                    if (res.data) {
                        this.props.navigation.navigate('TelSecond', { realName: this.state.input1, identityNo: this.state.input2, });
                    } else {
                        this.setState({ message: res.message})
                    }
                })
        }else{
            return;
        }
    }

    render() {
        const { flag, message} = this.state;
        const { navigation } = this.props;
        return (
            <View style={styles.wrapper}>
                <CustomNaviBar
                    style={{ backgroundColor: '#FFF' }}
                    navigation={navigation}
                    hiddenLeftBtn={false}
                    containerStyle={{ backgroundColor: 'transparent' }}
                    leftViewStyle={{ marginLeft: 5 }}
                    local={{ leftStyle: { width: 22, height: 22 } }}
                    titleView={
                        <Text style={{
                            color: '#000',
                            fontFamily: 'PingFangSC-Light',
                            fontSize: 20
                        }}>
                            身份认证
                                </Text>}
                />
                <ScrollView 
                    style={{flex:1}}
                    keyboardShouldPersistTaps="always" 
                    keyboardDismissMode="on-drag"
                    >
                <Text style={styles.hint}>请输入已认证或新手机号机主身份信息，该信息将作为顺逛账号的绑定身份信息</Text>
                <View style={styles.formGroup}>
                    <Text style={styles.btn}>证件类型</Text>
                    <Text style={[styles.input,{lineHeight:50}]}>身份证</Text>
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.btn}>姓名</Text>
                    <TextInput style={styles.input}
                        placeholder='填写你的真实姓名'
                        underlineColorAndroid="transparent"
                        maxLength={11}
                        onChangeText={(text) => {
                            this.setState({ input1: text })
                        }}
                    />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.btn}>证件号</Text>
                    <TextInput style={styles.input}
                        placeholder='填写对应身份证号'
                        underlineColorAndroid="transparent"
                        maxLength={18}
                        onChangeText={(text) => {
                            this.setState({ input2: text });
                            //输入身份证号验证
                            let reg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //18位身份证验证 最后一位可以是X;
                            if (reg.test(text)) {
                                this.setState({ flag: true });
                            }else{
                                this.setState({ flag: false });
                            }
                        }}
                    />
                </View>
                {message.length > 0 ? <Text style={{padding:16,fontSize:12,color:'#333'}}>{message}</Text> : null}
                <TouchableOpacity
                    style={[styles.btnone, { backgroundColor: (flag ? "#2979FF" : "#C9C9C9") }, { shadowColor: (flag ? "#2979FF" : "#C9C9C9") }]}
                    onPress={this.nextSubmit}>
                    <Text style={styles.texttwo}>下一步</Text>
                </TouchableOpacity>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    hint: {
        fontSize: 14,
        color: '#666',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 16,
    },
    formGroup: {
        height: 50,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#dfdfdf',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    input: {
        height: 50,
        color: '#282828',
        borderRadius: 3,
        paddingLeft: 15,
        fontSize: 17,
        flex: 1,
        textAlign: 'right',
    },
    getBtn: {
        width: 100,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 6,
    },
    btn: {
        color: '#333',
        fontSize: 14,
    },
    texttwo: {
        color: '#fff',
        fontSize: 16,
    },
    btnone: {
        alignSelf: 'center',
        marginTop: 60,
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 60,
        paddingRight: 60,
        backgroundColor: '#2979FF',
        borderRadius: 50,
        shadowColor: 'rgba(41,121,255,.5)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
      alignItems:'center',
      justifyContent:'center',
    },
    useable: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        alignSelf: 'flex-end',
        padding: 10,
    },
    inner: {
        fontSize: 12,
        color: '#333',
    },
});

export default myIdCardAuthen;

