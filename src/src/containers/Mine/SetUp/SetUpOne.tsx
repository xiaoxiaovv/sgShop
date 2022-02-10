import *as React from 'react';

import {
    View,
    Text,
    ScrollView,
    Switch,
    StyleSheet,
    Linking,
    Platform,
    DeviceEventEmitter,
} from 'react-native';
import Config from 'react-native-config';
import URL from './../../../config/url.js';

import { INavigation } from '../../../interface/index';
import CustomNaviBar from '../../../components/customNaviBar';
import { List, WhiteSpace, Toast } from 'antd-mobile';
import CustomWebView from '../../webview/CustomWebView';
import {connect, createAction} from '../../../utils';
import {action} from '../../../dva/utils';

import DeviceInfo from "react-native-device-info";

interface flagBoole {
    flagT: boolean;
    clickTimes: number;
}

const Item = List.Item;
@connect(({users: {CommissionNotice}}) => ({CommissionNotice,}))
class SetUpOne extends React.Component<INavigation, flagBoole>{
    public constructor(props) {
        super(props);
        // 初始化state
        this.state = {
            flagT: true,
            clickTimes: 0,
        };
    }

    private static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: '设置',
            header: null,
        };
    }

    public OnChangeValue = (value,index)=>{
        if(index==1){
            this.props.dispatch(action('users/changeCommission', {CommissionNotice: value }));
        }
        if(index==2){
            this.setState({ flagT: value });
            global.setItem('ReflectedNotice', value);
            dvaStore.dispatch(createAction('users/changeReflectedNotice')({ReflectedNotice: value }));
            DeviceEventEmitter.emit('Setting');
        }
    }

    public componentWillMount() {
        global.getItem('ReflectedNotice')
            .then((res) => {
                if (res != null) {
                    this.setState({ flagT: res });
                }
        })
    }

    render() {
        console.log('CustomNaviBar',this.props.CommissionNotice)
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
                            设置
                                    </Text>}
                />
                <WhiteSpace size='lg'/>
                <View style={styles.container}>
                    <Text style={styles.textC}>佣金</Text>
                    <Switch
                        onValueChange={(value) => this.OnChangeValue(value,1)}
                        style={styles.checkB}
                        value={this.props.CommissionNotice} />
                </View>
                <View style={styles.container}>
                    <Text style={styles.textC}>提现通知</Text>
                    <Switch
                        onValueChange={(value) => this.OnChangeValue(value, 2)}
                        style={styles.checkB}
                        value={this.state.flagT} />
                </View>
                <WhiteSpace size='lg'/>
                <View style={{ flex: 4 }}>
                    <List>
                        <Item 
                        arrow='horizontal' 
                            onClick={() => this.props.navigation.navigate('CustomWebView', {
                                customurl: URL.GET_NEW_HAND_URL, flag: true, headerTitle: '顺逛帮助',
                            })}
                        >
                            <Text style={styles.listStyle}>顺逛帮助</Text>
                        </Item>
                        <Item 
                        arrow='horizontal' 
                            onClick={() => this.props.navigation.navigate('CustomWebView', {
                                customurl: URL.GET_ABOUT_US_URL, flag: true, headerTitle: '关于我们',
                            })}>                        
                            <Text style={styles.listStyle}>关于我们</Text>
                        </Item>
                        <Item 
                        arrow='horizontal' 
                            onClick={
                                () => {
                                    if (Platform.OS === 'android'){
                                        Linking.canOpenURL(`http://app.qq.com/#id=detail&appid=1104761357`).then(supported => {
                                            if (supported) {
                                                Linking.openURL(`http://app.qq.com/#id=detail&appid=1104761357`);
                                            } else {
                                                Log('无法打开该链接');
                                            }
                                        })
                                    }else{
                                        Linking.canOpenURL(`https://itunes.apple.com/cn/app/shun-guang-wei-dian/id1035160364?mt=8`).then(supported => {
                                            if (supported) {
                                                Linking.openURL(`https://itunes.apple.com/cn/app/shun-guang-wei-dian/id1035160364?mt=8`);
                                            } else {
                                                Log('无法打开该链接');
                                            }
                                        })
                                    }
                                    }}>
                            <Text style={styles.listStyle}>评分</Text>
                        </Item>
                        <Item onClick={() => {
                            if (this.state.clickTimes > 5) {
                                this.setState({clickTimes: 0});
                                this.props.navigation.navigate('AppHotStatus');
                            } else {
                                if (this.state.clickTimes == 3) {
                                    Toast.info('再点击 3 次进入 App 版本信息', 1);
                                }
                                if (this.state.clickTimes == 4) {
                                    Toast.info('再点击 2 次进入 App 版本信息', 1);
                                }
                                if (this.state.clickTimes == 5) {
                                    Toast.info('再点击 1 次进入 App 版本信息', 1);
                                }
                                this.setState({clickTimes: this.state.clickTimes + 1});
                            }
                                    }}>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Text style={styles.listStyle}>App 版本</Text>
                            <Text style={styles.listStyle}>V{ DeviceInfo.getVersion()}</Text>
                            </View>
                        </Item>
                    </List>

                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff', 
        height: 44, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingLeft: 16, 
        paddingRight: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    checkB: {
        marginBottom: 10, 
        marginTop: 10, 
        backgroundColor: '#fff', 
    },
    textC: {
        fontSize: 14,
    },
    listStyle: {
        fontSize: 14,
    },
})

export default SetUpOne;