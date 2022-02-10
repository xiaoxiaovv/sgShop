import * as React from 'React';

import {
    Text,
    View,
    ScrollView,
    Image,
    StyleSheet,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native';
import { getAppJSON } from '../../../netWork';

import axios from 'axios';
import Config from 'react-native-config';
import { INavigation } from '../../../interface/index';
import CustomNaviBar from '../../../components/customNaviBar';
import { connect} from '../../../utils';

@connect()
class Gender extends React.Component<INavigation, IFlag>{
    public static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: '绑定手机',
            header: null,
        }
    }

    private logout = async () => {
        const res = await getAppJSON(Config.LOGOUT);
        if (res.success) {
            this.props.dispatch({ type: 'users/clearUserLoginInfo' });
            this.props.dispatch({ type: 'cartModel/clearCartInfo' });
            global.setItem('User', null);
            global.setItem('roleInfo', null);
            this.props.navigation.navigate('Login');
        } else {
            Toast.info('退出登录失败', 1);
        }
    }

    render() {
        const { params } = this.props.navigation.state;
        return (
            <ScrollView style={{backgroundColor:'#fff'}}>
                <CustomNaviBar
                    style={{ backgroundColor: '#f4f4f4' }}
                    navigation={this.props.navigation}
                    hiddenLeftBtn={true}
                    containerStyle={{ backgroundColor: 'transparent' }}
                    leftViewStyle={{ marginLeft: 5 }}
                    local={{ leftStyle: { width: 22, height: 22 } }}
                    titleView={
                        <Text style={{
                            color: '#000',
                            fontFamily: 'PingFangSC-Light',
                            fontSize: 20
                        }}>
                            绑定手机
                                </Text>}
                />
                <View style={styles.imageV}>
                    <Image style={styles.image} source={{ uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/myPhoneManage@2x.png'}} />
                </View>
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',}}>
                    <Text style={{ color:'#2979FF',fontSize:20,marginTop:30,}}>绑定成功</Text>
                    <Text style={{ color: '#999', fontSize: 14, marginTop: 30, }}>验证通过，已绑定手机号{params.mobile}</Text>
                    <TouchableOpacity
                        onPress={this.logout}>
                        <View style={styles.btnone}>
                            <Text style={styles.texttwo}>确定</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    imageV: {
        height: 126,
        marginTop: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        height: 126,
        width: 126,
    },
    btnone: {
        marginTop: 60,
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 60,
        paddingRight: 60,
        backgroundColor: '#2979FF',
        borderRadius: 50,
        shadowColor: '#C9C9C9',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    texttwo: {
        color: '#fff',
        fontSize: 16,
    },
});

export default Gender;