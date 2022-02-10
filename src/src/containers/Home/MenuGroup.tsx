import * as React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ImageBackground, Platform, NativeModules,
} from 'react-native';
import PropTypes from 'prop-types';
import ScreenUtil from './SGScreenUtil';
import {DefaultMenuData, HostMenuData} from './DefaultData/index';
import {width, IS_NOTNIL, height, px} from '../../utils/index';
import {goBanner} from '../../utils/tools';
import {ICustomContain} from '../../interface/index';
import Config from 'react-native-config';
import {MessageWithBadge} from '../../components/MessageWithBadge';
import {createAction, NavigationUtils} from '../../dva/utils';
import {connect} from 'react-redux';
import URL from '../../config/url';

interface IPropsInterface {
    key: number;
    renderIcon: any;
    showText: string;
    tag: string;
    onClick: any;
    showTips: boolean;
    mcolor: string;
    picUrl: string;
}

const mapStateToProps = ({users: {unread,isLogin, isHost}, home: {defaultSearchHotWord}, address: {cityId}}) => ({
    unread,
    isLogin,
    isHost,
    cityId,
    defaultSearchHotWord,
});
const MenuButton: React.SFC<IPropsInterface> = (props) => {
    return (
        <View style={styles.menuButton_Box}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => props.onClick()}>
                {
                    props.picUrl ?
                        <Image style={styles.iconImg}
                               source={{uri: cutImgUrl(props.picUrl, ScreenUtil.scaleSize(40))}}/>
                        :
                        <Image style={styles.iconImg} source={props.renderIcon}/>
                }
            </TouchableOpacity>
            {/* 这里原来一直报警告,是因为showTips为false时没有返回任何视图 */}
            {props.showTips ?
                <View style={styles.tips_box}>
                    <Text style={styles.new_tips}>New</Text>
                </View> : <View/>}
            <Text style={[styles.menuText, {color: props.mcolor ? props.mcolor : 'black'}]}>{props.showText}</Text>
        </View>
    );
};

@connect(mapStateToProps)
export default class MenuGroup extends React.Component<ICustomContain & { unread?: number; defaultSearchHotWord: string; }> {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
        this._onMenuClick = this._onMenuClick.bind(this);
    }

    public render() {
        const datas = this.props.isHost === 1 ? HostMenuData : DefaultMenuData;
        let configIcons = {};
        let configFont = {};
        // iconFontConfig
        if (IS_NOTNIL(this.props.iconImageConfig)) {
            configIcons = this.props.iconImageConfig;
        }
        if (IS_NOTNIL(this.props.iconFontConfig)) {
            configFont = this.props.iconFontConfig;
        }
        return (
            <View style={styles.menuView_top}>
                {
                    IS_NOTNIL(this.props.middleImagePart1) &&
                    <TouchableOpacity onPress={() => goBanner(this.props.middleImagePart1, this.props.navigation)}>
                        <Image
                            resizeMode='stretch'
                            style={{width, height: 128}}
                            source={{uri: this.props.middleImagePart1.pic}}
                        />
                    </TouchableOpacity>
                }
                {IS_NOTNIL(this.props.middleImagePart2) ? <ImageBackground
                    resizeMode='stretch'
                    source={{uri: this.props.middleImagePart2.pic}}
                    style={{width, height: 183, flexDirection: 'row', flexWrap: 'wrap'}}
                >
                    {
                        datas.map((item, i) => {
                                const picurl = configIcons[item.tag] ? configIcons[item.tag] : '';
                                // 下一行的正则是 有时候后台返回的文字颜色 字符串 两边有空格，正则去掉两边的空格
                                const mstyle = configFont[`${item.tag}FontColor`] ? configFont[`${item.tag}FontColor`].replace(/(^\s*)|(\s*$)/g, '') : '';
                                return (
                                    <MenuButton key={i}
                                                renderIcon={item.pic}
                                                picUrl={picurl}
                                                showText={item.showText}
                                                tag={item.tag}
                                                mcolor={mstyle}
                                                onClick={() => this._onMenuClick(item)}
                                                showTips={item.showTip ? item.showTip : false}/>)
                            },
                        )
                    }
                </ImageBackground> : <View style={{width, height: 183, flexDirection: 'row', flexWrap: 'wrap'}}>
                    {
                        datas.map((item, i) => {
                                const picurl = configIcons[item.tag] ? configIcons[item.tag] : '';
                                const mstyle = configFont[`${item.tag}FontColor`] ? configFont[`${item.tag}FontColor`] : '';
                                return (
                                    <MenuButton key={i}
                                                renderIcon={item.pic}
                                                picUrl={picurl}
                                                showText={item.showText}
                                                tag={item.tag}
                                                mcolor={mstyle}
                                                onClick={() => this._onMenuClick(item)}
                                                showTips={item.showTip ? item.showTip : false}/>)
                            },
                        )
                    }
                </View>}

                {
                    IS_NOTNIL(this.props.middleImagePart3) &&
                    <TouchableOpacity onPress={() => goBanner(this.props.middleImagePart3)}>
                        <Image
                            resizeMode='stretch'
                            style={{width, height: 0.133 * width }} source={{uri: this.props.middleImagePart3.pic}}/>
                    </TouchableOpacity>
                }
            </View>
        );
    }

    // 去云缴费界面
    private goToCloudPay = () => {
        const systemType = Platform.OS === 'ios' ? 'ios' : 'android';
        const userToken = dvaStore.getState().users.userToken;
        const cityId = this.props.cityId;
        // 打开云缴费界面
        const LivingUrl = URL.LIVING + '?flag='+userToken+'&systemType='+systemType+'&cityId='+cityId;
        NativeModules.ToolsModule.presentH5View([LivingUrl, "生活缴费"]);
    }

    private _onMenuClick(item): void {
        switch (item.tag) {
            case 'jydq':
                this.props.navigation.navigate('HouseholdAppliances');
                break;
            case 'jjjz':
                this.props.navigation.navigate('HomeDress');
                break;
            case 'bhcs':
                this.props.navigation.navigate('SuperMaket', {
                    customurl: `${URL.H5_HOST}superMarket`,
                    flag: true,
                    headerTitle: '百货超市'
                });
                break;
            case 'shjf':
                this.props.isLogin ?  this.goToCloudPay() : this.props.navigation.navigate('Login');
                break;
            case 'shfw':
                this.props.dispatch(NavigationUtils.navigateAction("LocalSpecialty"));
                break;
            case 'zcsf':
                // 众创首发
                this.props.dispatch(NavigationUtils.navigateAction("CrowdFunding"));
                break;
            case 'wddp': {
                if (this.props.isHost === 1) {
                    this.props.navigation.navigate('StoreHome');
                } else if (this.props.isHost === 0) {
                    this.props.navigation.navigate('NewRegister', {step: 2, hiddenSetPassword: true});
                } else {
                    this.props.navigation.navigate('Login');
                }
                break;
            }
            // 投资
            case 'jrlc':
                if (this.props.isLogin) {
                    // 已登录,进入投资界面
                    this.props.navigation.navigate('MyInvestment', {frontPage: 'Home'});
                } else {
                    dvaStore.dispatch(createAction('router/apply')({
                        type: 'Navigation/NAVIGATE', routeName: 'Login',
                    }));
                }
                break;
            case 'gd':
                this.props.navigation.navigate('Category');
                break;
            case 'xpzc':
                this.props.navigation.navigate('SeeMore');
                break;
            default:
                break;
        }
    }
}

const styles = StyleSheet.create({
    menuView_top: {
        flexDirection: 'row',  // 水平排布
        flexWrap: 'wrap',     // 换行
        flex: 1,
        // paddingTop: 16,
        backgroundColor: 'transparent',
    },
    menuView_Bottom: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',  // 两端对齐
        backgroundColor: 'transparent',
    },
    menuButton_Box: {
        width: ScreenUtil.ScreenWidth / 4,
        height: 80,
        alignItems: 'center',  // 水平居中
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    iconImg: {
        width: ScreenUtil.scaleSize(40),
        height: ScreenUtil.scaleSize(40),
        marginTop: ScreenUtil.scaleSize(8),
    },
    menuText: {
        marginTop: 6,
        color: 'black',
        fontFamily: '.PingFangSC-Regular',
        fontSize: ScreenUtil.scaleText(12),
        lineHeight: ScreenUtil.scaleText(14),
    },
    tips_box: {
        position: 'absolute',  // (绝对定位不占空间)
        width: ScreenUtil.scaleSize(20),
        height: ScreenUtil.scaleSize(10),
        borderRadius: ScreenUtil.scaleSize(5),  // 设置圆角边
        backgroundColor: 'red',
        top: ScreenUtil.scaleSize(10),
        right: ScreenUtil.scaleSize(20),
        flexDirection: 'row',
        alignItems: 'center',
    },
    new_tips: {
        fontSize: ScreenUtil.scaleText(8),
        color: 'white',
        paddingLeft: 1,
        backgroundColor: 'transparent',
    },
});
