import {
    StyleSheet,
    Platform,
    View,
    Text,
    ImageBackground,
    Dimensions,
    Image,
    ScrollView,
    NativeModules,
    DeviceEventEmitter,
    TouchableOpacity,
    Modal,
} from 'react-native';
import * as React from 'react';
import {isiPhoneX, px} from '../../utils';
import {getAppJSON} from '../../netWork';
import {width, height} from '../../utils';
import {ICustomContain} from '../../interface';
import Config from 'react-native-config';
import {connect, createAction} from '../../utils';
import config from '../../config';
import url from '../../config/url';
import {Toast} from 'antd-mobile';
import {action} from '../../dva/utils';
import URL from '../../config/url';

@connect(({mine}) => ({...mine}))
class ClassRoom extends React.Component <ICustomContain> {
    public constructor(props) {
        super(props);
    }

    public render(): JSX.Element {
        return (
                <ScrollView style={{backgroundColor: '#FFFFFF'}}>
                    {/* 顺逛帮助 */}
                    <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                this.goShunGuangHelp();
                            }}>
                        <Image style={styles.imageStyle}
                                source={require('../../images/shunguanghelp.png')}
                        />
                    </TouchableOpacity>
                    {/* 顺逛课堂 */}
                    <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                this.goShunGuangKeTang();
                            }}>
                        <Image style={styles.imageStyle}
                                source={require('../../images/shunguangketang.png')}
                        />
                    </TouchableOpacity>
                    {/* 新手必读 */}
                    <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                this.goNewHand();
                            }}>
                        <Image style={styles.imageStyle}
                                source={require('../../images/newbidu.png')}
                        />
                    </TouchableOpacity>
                    {/* 学习进阶 */}
                    <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                this.goLearningHaier();
                            }}>
                        <Image style={styles.imageStyle}
                                source={require('../../images/learnGoUp.png')}
                        />
                    </TouchableOpacity>
                </ScrollView>
        );
    }
    // 顺逛帮助
    private goShunGuangHelp = () => {
        this.props.navigation.navigate('CustomWebView', {
            customurl: URL.GET_NEW_HAND_URL, flag: true, headerTitle: '顺逛帮助',
        });
    }
    // 顺逛课堂
    private goShunGuangKeTang = () => {
        this.props.navigation.navigate('SuperSecondView', {
            url: '/html/community/business_school_win.html',   // 去社群的页面路径,该参数为必传参数
            },
        );
    }
    // 新手必读click
    private goNewHand = async () => {
        this.props.navigation.navigate('MyLearn');
    }

    // 学习进阶按钮click
    private goLearningHaier = async () => {
        try {
            const json = await getAppJSON(Config.GET_learningHaier);
            if (json.success) {
                if (json.data !== -100) {
                    /******注意要转码********/
                    // const url = encodeURI(json.data);
                    const newurl = json.data;
                    if ( isiPhoneX ) {
                        this.props.navigation.navigate('CommonWebview', {title: '海尔大学', isShowTitle: true, url: newurl});
                    } else {
                        this.props.navigation.navigate('HelpWebview', {baby: newurl});
                    }
                } else {
                    // 去登录页面
                    this.props.navigation.navigate('Login');
                }
            } else {
                Toast.fail(json.message, 1);
            }
        } catch (err) {
            Log(err);
        }
    }
}

const styles = StyleSheet.create({
    imageStyle: {
        width,
        height: width * 0.4,
        marginBottom: 7,
    },
});

export default ClassRoom;
