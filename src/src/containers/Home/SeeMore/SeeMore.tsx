import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    InteractionManager,
    Clipboard,
    NativeModules,
    Platform,
} from 'react-native';
import * as React from 'react';
import { Toast } from 'antd-mobile';
import { INavigation } from '../../../interface/index';
import EStyleSheet from 'react-native-extended-stylesheet';
import { NavBar } from '../../../components/NavBar';
import { connect } from 'react-redux';
import URL from '../../../config/url';
import { GET, POST_JSON, GET_P, POST_FORM} from '../../../config/Http';
import { getEnviroment } from '../../../config';
import {createAction} from '../../../utils';

let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

// 智能物联
const wulianData = [
    {
        id: 0,
        icon: require('../../../images/hometry.png'),
        title: '智慧家庭',
    },
    // {
    //     id: 1,
    //     icon: require('../../../images/szd.png'),
    //     title: '水之道',
    // },
    {
        id: 2,
        icon: require('../../../images/hkq.png'),
        title: '好空气',
    },
    // {
    //     id: 3,
    //     icon: require('../../../images/yxtt.png'),
    //     title: '游戏头条',
    // },
    // {
    //     id: 4,
    //     icon: require('../../../images/hexy.png'),
    //     title: '海尔洗衣',
    // },
    {
        id: 5,
        icon: require('../../../images/icon_xinxiaochu.png'),
        title: '馨小厨',
    },
    {
        id: 6,
        icon: require('../../../images/icon_jiuzhidao.png'),
        title: '酒知道',
    },
    {
        id: 7,
        icon: require('../../../images/icon_shequxi.png'),
        title: '社区洗',
    },
];

// 特色频道
let tesheData = [];
if (URL.IS_STORE  && Platform.OS === 'ios') {
    tesheData = [
        {
            id: 0,
            icon: require('../../../images/qiyegou.png'),
            title: '企业购',
        },
        {
            id: 1,
            icon: require('../../../images/shenghuofuwu.png'),
            // title: '生活服务',
            title: '售后服务',
        },
        {
            id: 2,
            icon: require('../../../images/dz.png'),
            title: '定制',
        },
        {
            id: 3,
            icon: require('../../../images/HaoKang.png'),
            title: '好慷在家',
        },
        // {
        //     id: 4,
        //     icon: require('../../../images/sd.png'),
        //     title: '顺贷',
        // },
        // {
        //     id: 5,
        //     icon: require('../../../images/bt.png'),
        //     title: '白条',
        // },
        {
            id: 6,
            icon: require('../../../images/lmk_sq.png'),
            title: '联名卡申请',
        },
        // {
        //     id: 7,
        //     icon: require('../../../images/living.png'),
        //     title: '云缴费',
        // },
        // {
        //     id: 7,
        //     icon: require('../../../images/touzi.png'),
        //     title: '投资',
        // },
    ];
}else{
    tesheData =  [
        {
            id: 0,
            icon: require('../../../images/qiyegou.png'),
            title: '企业购',
        },
        {
            id: 1,
            icon: require('../../../images/shenghuofuwu.png'),
            // title: '生活服务',
            title: '售后服务',
        },
        {
            id: 2,
            icon: require('../../../images/dz.png'),
            title: '定制',
        },
        {
            id: 3,
            icon: require('../../../images/HaoKang.png'),
            title: '好慷在家',
        },
        // {
        //     id: 4,
        //     icon: require('../../../images/sd.png'),
        //     title: '顺贷',
        // },
        // {
        //     id: 5,
        //     icon: require('../../../images/bt.png'),
        //     title: '白条',
        // },
        {
            id: 6,
            icon: require('../../../images/lmk_sq.png'),
            title: '联名卡申请',
        },
        // {
        //     id: 7,
        //     icon: require('../../../images/living.png'),
        //     title: '云缴费',
        // },
        {
            id: 7,
            icon: require('../../../images/touzi.png'),
            title: '投资',
        },
    ];
}

interface ISeeMoreInterface {
    isLogin: boolean;
    isHost: number;
    accessToken: string;
    userCount: string;
    password: string;
    cityId: number;
    longitude: number;  // 经度
    latitude: number; // 维度
  }
@connect(({users:{isLogin, isHost, accessToken, userCount, password}, address:{streetId, cityId , longitude, latitude}}) => ({isLogin, isHost, accessToken, userCount, password, streetId, cityId, longitude, latitude}))
class SeeMore extends React.Component<INavigation & ISeeMoreInterface> {
    public constructor(props) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <View style={{backgroundColor: '#f1f1f1', flex: 1}}>
                <NavBar title={'更多服务'}/>
                {
                    <View style={{backgroundColor: '#f1f1f1', flex: 1}}>
                    <ScrollView>
                        <View style={{backgroundColor: '#f1f1f1', flex: 1}}>
                            {/* 智能物联 */}
                            <View style={{backgroundColor: 'white'}}>
                                <View style={styles.wulianHeaderCon}><Text style={styles.wulianHeader}>智能物联</Text></View>
                                <View style={styles.menuContianer}>
                                    { wulianData.map((item, index) =>
                                        (
                                        <View key = {`${index} + ${item.id}`} style={styles.menuCard}>
                                            <TouchableOpacity
                                                style={{alignItems: 'center'}}
                                                onPress = {() => {
                                                    this.menuClick(item.title);
                                                }}>
                                                <Image
                                                    style={styles.menuImg}
                                                    source = {item.icon}
                                                />
                                                <Text style={styles.menuTitle}>{item.title}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        ),
                                        )
                                    }
                                </View>
                            </View>
                            {/* 特色频道 */}
                            <View style={{backgroundColor: 'white', marginTop: 8}}>
                            <View style={styles.wulianHeaderCon}><Text style={styles.wulianHeader}>特色频道</Text></View>
                                <View style={styles.menuContianer}>
                                    { tesheData.map((item, index) =>
                                        (
                                        <View key = {`${index} + ${item.id}`} style={styles.menuCard}>
                                            <TouchableOpacity
                                                style={{alignItems: 'center'}}
                                                onPress = {() => {
                                                    this.menuClick(item.title);
                                                }}>
                                                <Image
                                                    style={styles.menuImg}
                                                    source = {item.icon}
                                                />
                                                <Text style={styles.menuTitle}>{item.title}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        ),
                                        )
                                    }
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    </View>
                }
             </View>
        );
    }

    private menuClick = (title) => {
        switch (title) {
            // 智慧家庭
            case '智慧家庭':
                this.props.navigation.navigate('Familytry');
                break;
            // 水之道
            case '水之道':
                this.gotoSzd();
                break;
            // 好空气
            case '好空气':
                // 好空气入口url
                const hkqEntryUrl = 'http://uhome.haier.net:8470/acbizCms/aircircle/indexAirCircle.do';
                NativeModules.ToolsModule.presentH5View([hkqEntryUrl, '好空气']);
                break;
            // 游戏头条
            case '游戏头条':
                NativeModules.ToolsModule.presentH5View(['http://m.shenyou.tv/index.php', '游戏头条']);
                break;
            // 海尔洗衣
            case '海尔洗衣':
                this.goToWash();
                break;
            // 馨小厨
            case '馨小厨':
                const xxcUrl = 'http://linkcook.cn/quanquan/ulist.html';
                NativeModules.ToolsModule.presentH5View([xxcUrl, '馨小厨']);
                break;
            // 酒知道
            case '酒知道':
                const jzdUrl = 'http://jiuzhidao.com/wap/';
                NativeModules.ToolsModule.presentH5View([jzdUrl, '酒知道']);
                break;
            // 社区洗
            case '社区洗':
                const sqxUrl = 'http://www.saywash.com/saywash/WashCallWx/page/index.html';
                NativeModules.ToolsModule.presentH5View([sqxUrl, '社区洗']);
                break;
            // 企业购
            case '企业购':
                const qygdUrl = 'http://b2b.haier.com/mobiles/index.html';
                NativeModules.ToolsModule.presentH5View([qygdUrl, '海尔企业购']);
                break;
            // 生活服务
            case '生活服务':
                this.goToEmc();
                break;
            // 生活服务 -> 售后服务
            case '售后服务':
                this.goToEmc();
                break;
            // 定制
            case '定制':
                this.gotoDZ();
                break;
            // 投资
            case '投资':
                if (this.props.isLogin) {
                    this.props.navigation.navigate('MyInvestment', {frontPage: 'Home'});
                } else {
                    dvaStore.dispatch(createAction('router/apply')({
                        type: 'Navigation/NAVIGATE', routeName: 'Login',
                    }));
                }
                break;
            // 好慷在家
            case '好慷在家':
                this.toHomeking();
                break;
            // 顺贷
            case '顺贷':
                alert('顺贷');
                break;
            // 白条
            case '白条':
                alert('白条');
                break;
            // 联名卡申请
            case '联名卡申请':
                this.props.navigation.navigate('ApplyForCard');
                break;
            // 云缴费
            case '云缴费':
                if (this.props.isHost === -1) {
                    this.props.navigation.navigate('Login');
                } else {
                    const systemType = Platform.OS === 'ios' ? 'ios' : 'android';
                    const userToken = dvaStore.getState().users.userToken;
                    const cityId = this.props.cityId;
                    // 打开云缴费界面
                    const LivingUrl = URL.LIVING + '?flag=' + userToken + '&systemType=' + systemType + '&cityId=' + cityId;
                    NativeModules.ToolsModule.presentH5View([LivingUrl, '生活缴费']);
                }
                break;
            default:
                break;
        }
    }
    // 去水之道界面
    private gotoSzd = () => {
        if (this.props.isHost === -1) {
            this.props.navigation.navigate('Login');
        } else {
            const cityCode = this.props.cityId;
            const SZDURL = URL.SZD_URL;
            const tocken = dvaStore.getState().users.userToken;
            const finalUrl = SZDURL + '?token=' + tocken + '&alt=' + this.props.latitude + '&lng=' + this.props.longitude + '&cityCode=' + cityCode;
            NativeModules.ToolsModule.presentH5View([finalUrl, '水之道']);
        }
    }
    // 去海尔洗衣
    private goToWash = () => {
        if (this.props.isHost === -1) {
            this.props.navigation.navigate('Login');
        } else {
            const accessToken = this.props.accessToken;
            const userCount = this.props.userCount;
            const password = this.props.password;
            NativeModules.ToolsModule.presentWashView([userCount, password, accessToken]);
        }
    }

    // 去原生活服务界面
    private goToEmc = async () => {
            if (this.props.isHost === -1) {
                this.props.navigation.navigate('Login');
            } else {
                try {
                    // 获取生活服务的token
                    const json =  await POST_JSON(URL.TOKEN_GET, null);
                    if (json.success) {
                        const accessToken = json.data;
                        if (accessToken) {
                           NativeModules.ToolsModule.presentEmcView([getEnviroment(), accessToken, '']);
                        } else {
                            Toast.fail('您当前账号暂无法访问此服务,请使用关联手机号登录。', 2);
                        }
                    } else {
                            Toast.fail('您当前账号暂无法访问此服务,请使用关联手机号登录。', 2);
                    }
                  } catch (error) {
                    Log(error);
                  }
            }
        }
    // 去定制界面
    private gotoDZ = () => {
        if (this.props.isHost === -1) {
            this.props.navigation.navigate('Login');
        } else {
            const flag = dvaStore.getState().users.userToken.substring(6);
            const DINGZHI_ZHONGCHUANGHUI = 'http://m.ehaier.com/v3/mstore/sg/diy/login/request.html' + '?flag=' + flag;
            NativeModules.ToolsModule.presentH5View([DINGZHI_ZHONGCHUANGHUI, '海尔交互定制平台']);
        }
    }
    // 好康在家
    private toHomeking = async () => {
        try {
            const json =  await GET(URL.HAOKANG, null);
            if (json.success) {
                if (json.data !== -100) {
                    /******注意要转码********/
                   const url = encodeURI(json.data);
                   NativeModules.ToolsModule.presentH5View([url, '好慷在家']);
                 } else {
                    this.props.navigation.navigate('Login');
                 }
            } else {
                Toast.fail( json.message, 2);
            }
          } catch (error) {
            Log(error);
          }
    }
}

const styles = EStyleSheet.create({
    wulianHeaderCon: {
        paddingTop: 16,
        paddingLeft: 24,
    },
    wulianHeader: {
        fontSize: '16rem',
        color: '#333',
    },
    menuContianer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: 10,
        paddingBottom: 5,
        marginBottom: 5,
    },
    menuCard: {
        width: width / 4,
        height: '80rem',
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    menuImg: {
        width: '46rem',
        height: '46rem',
    },
    menuTitle: {
        marginTop: 8,
        fontSize: '14rem',
        color: '#666666',
    },
});

export default SeeMore;
