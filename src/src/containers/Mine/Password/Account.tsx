import { 
    View, 
    Text, 
    Dimensions, 
    StyleSheet,
    TouchableOpacity, 
    DeviceEventEmitter, 
    Modal 
} from 'react-native';
import React from 'react';
import { List, WhiteSpace, Button } from 'antd-mobile';
import CustomNaviBar from '../../../components/customNaviBar';

const Item = List.Item;


class AccountSafty extends React.Component {
    public static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: '账户安全',
            header: null,
        }
    }
    
  render() {
    // 从带过来的路由参数里面取值
    const { params } = this.props.navigation.state;

    return (
        <View style={styles.wrapper}>
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
                        账户安全
                                    </Text>}
            />
            <List style={styles.content}>                
            <Item 
                    extra={<Text style={styles.extraStyle}>{params.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</Text>}
                onClick={() => {
                    this.props.navigation.navigate('TelPhone', { phone: params.phone,});
                }}
                ><Text style={styles.listStyle}>手机</Text></Item>
                <Item extra={<Text style={styles.extraStyle}>{params.email}</Text>}><Text style={styles.listStyle}>邮箱</Text></Item>
            <Item 
                arrow='horizontal'
                onClick={() => {
                    this.props.navigation.navigate('PasswordReset');
                }}
                ><Text style={styles.listStyle}>修改密码</Text></Item>
            </List>
        </View>
    )
  }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    content: {
        marginTop: 20
    },
    extraStyle: {
        fontSize: 14,
        color: '#666',
    },
    listStyle: {
        fontSize: 14,
    },
});

export default AccountSafty;