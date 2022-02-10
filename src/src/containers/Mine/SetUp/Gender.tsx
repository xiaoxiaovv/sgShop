import *as React from 'React';

import {
    Text,
    View,
    ScrollView,
    Image,
    StyleSheet,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native';

import axios from 'axios';

import { INavigation } from '../../../interface/index';
import { WhiteSpace } from 'antd-mobile';
import CustomNaviBar from '../../../components/customNaviBar';
import Config from 'react-native-config';
import { connect, createAction } from '../../../utils';

interface ICheckBox {
    text: string;
    flag: boolean;
    onButton: () => void;
}
interface IFlag {
    data: any[],
    falg1: boolean,
    falg2: boolean,
    falg3: boolean,
};

const CheckBox = ({ text, flag, onButton } : ICheckBox) => (
    <TouchableOpacity onPress={onButton} style={styles.box}>
        <Text>{text}</Text>
        <Image style={styles.image} source={{ uri: flag ? 'http://cdn09.ehaier.com/shunguang/H5/www/img/ic_select.png' :'http://cdn09.ehaier.com/shunguang/H5/www/img/ic_check.png' }} />
    </TouchableOpacity>
);

@connect()
class Gender extends React.Component<INavigation, IFlag >{
    public static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: '性别',
            header: null,
        }
    }

    public constructor(props) {
        super(props);
        this.state = {
            data: [],
            falg1: false,
            falg2: false,
            falg3: false,
        };
    }

    private sWitchX = (data) => {
        switch (data) {
            case 0:
            this.setState({
                falg1: true,
                falg2: false,
                falg3: false,
            });
            break;
            case 1:
                this.setState({
                    falg1: false,
                    falg2: true,
                    falg3: false,
                });
                break;
            case 2:
                this.setState({
                    falg1: false,
                    falg2: false,
                    falg3: true,
                });
                break;
            default:
                this.setState({
                    falg1: false,
                    falg2: true,
                    falg3: false,
                });
                break;
        };
    }

    private checkTab = (res) => {
        this.state.data.gender = res.data.data.gender;
        this.setState({ data: this.state.data });
        this.sWitchX(res.data.data.gender);
        DeviceEventEmitter.emit('updateX', '');
        this.props.navigation.goBack();
        this.props.dispatch(createAction('users/saveUsersMsg')(this.state.data));
        global.setItem('User', this.state.data);
    } 

    private GenderCheck = (gender) => {
        const urlUpdate = Config.API_URL + Config.JENDER_POST;
        const params = {
            birthday: this.state.data.birthday,
            gender: gender,
            nickName: this.state.data.nickName,
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
            if(res.data.success){
                this.checkTab(res);
            }else{
                alert(res.data.message);
            }
        })
    }

    public componentWillMount() {
        this.setState({ data: dvaStore.getState().users });
        this.sWitchX(dvaStore.getState().users.gender);
    }

    render(){
        const { params } = this.props.navigation.state;
        return (
            <ScrollView>
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
                            性别
                                </Text>}
                />

                <WhiteSpace size='lg' />
                <CheckBox 
                    text={'保密'} 
                    flag={this.state.falg1} 
                    onButton={() => { this.GenderCheck(0)}}
                />
                <CheckBox 
                    text={'男'} 
                    flag={this.state.falg2} 
                    onButton={() => { this.GenderCheck(1)}}
                />
                <CheckBox 
                    text={'女'} 
                    flag={this.state.falg3} 
                    onButton={() => { this.GenderCheck(2)}}
                />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    box:{
        height: 40,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 16,
        paddingRight: 16,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    image: {
        height: 20,
        width: 20,
    }
});

export default Gender;