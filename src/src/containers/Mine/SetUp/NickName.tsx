import *as React from 'react';

import {
    View,
    Text,
    Image,
    ScrollView,
    TextInput,
    DeviceEventEmitter,
} from 'react-native';

import CustomNaviBar from '../../../components/customNaviBar';
import { WhiteSpace, Toast } from 'antd-mobile';
import { INavigation } from '../../../interface/index';
import Config from 'react-native-config';
import { connect, createAction } from '../../../utils';
import axios from 'axios';

interface Itext {
    text: string,
    data: any[],
}

@connect()
class NickName extends React.Component < INavigation, Itext >{
    public constructor(props) {
        super(props);
        this.state = {
            data: [],
            text: '顺逛',
        };
    }

    private static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: '昵称',
            header: null,
        };
    }

    private changeText = (res) => {
        if (res.data.success) {
        this.state.data.nickName = res.data.data.nickName;
        this.setState({ data: this.state.data });
        DeviceEventEmitter.emit('updateX', '');
        this.props.navigation.goBack();
        this.props.dispatch(createAction('users/saveUsersMsg')(this.state.data));
        global.setItem('User', this.state.data);
        } else {
            alert(res.data.message);
        }
    } 

    private storage = (nickname) => {
        if (nickname.length <= 0){
            Toast.fail('昵称不可为空', 1);
            return;
        }
        const urlUpdate = Config.API_URL + Config.JENDER_POST;
        const params = {
            birthday: this.state.data.birthday,
            gender: this.state.data.gender,
            nickName: nickname,
            userName: this.state.data.userName,
        }
        axios({
            method: "post",
            url: urlUpdate,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
                // 'TokenAuthorization': '',
            },
            data: params,
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
        }).then((res) => {
            this.changeText(res);
        })
    }

    public componentWillMount() {
        this.setState({ data: dvaStore.getState().users });
        this.setState({ text: dvaStore.getState().users.nickName });
    }

    render() {
        return (
            <ScrollView style={{ backgroundColor: '#EEEEEE' }}>
                <CustomNaviBar
                    style={{ backgroundColor: '#FFF' }}
                    navigation={this.props.navigation}
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
                            昵称
                                </Text>}
                    rightView={
                        <Text onPress={()=>{this.storage(this.state.text)}} style={{
                            color: '#2577e3',
                            fontFamily: 'PingFangSC-Light',
                            fontSize: 17,
                            marginTop: 10,
                            marginRight: 16,
                        }}>
                            保存
                                </Text>
                    }
                />

                <WhiteSpace size='lg'/>

                <TextInput
                    style={{ 
                            height: 40, 
                            backgroundColor: '#FFF', paddingLeft:16,
                          }}
                            onChangeText={(text) => this.setState({ text })}
                            value={this.state.text}
                            maxLength={25}
                            placeholder="请输入昵称"
                            // placeholderTextColor={'red'}
                            // keyboardType="number-pad"
                />
            </ScrollView>
        );
    }
}

export default NickName;