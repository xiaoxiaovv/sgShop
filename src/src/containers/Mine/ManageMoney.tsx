import * as React from 'react';
import { View, ScrollView, Image, Text, FlatList, TouchableOpacity, NativeModules } from 'react-native';
import { INavigation } from '../../interface';
import EStyleSheet from 'react-native-extended-stylesheet';
import CustomButton from 'rn-custom-btn1';
import { IS_NOTNIL } from '../../utils';
import Config from 'react-native-config';
import { getAppJSON, postAppForm, postForm } from '../../netWork';
import { Modal, Button } from 'antd-mobile';
import QRCode from 'react-native-qrcode';

let pageNo = 1; // 分页索引
const pageSize = 5; // 每页返回数据条数
const partnerId = 200000030019; // 快捷通商户ID准生产
let token = ''; // 获取到的快捷通token
const serverHead = Config.API_URL + 'www/';
interface IManageMoneyState {
    promotionList: any; // 好友投资列表
    activityInfo: [string]; // 活动说明信息
    activityRule: string; // 活动规则
    hasMoreData: boolean; // 控制查看更多是否显示
    promoCode: number; // 推荐码
    qrCodeUrl: string; // 二维码图片url
    showQrCodeModal: boolean; // 是否显示二维码modal
    showShareModal: boolean; // 是否显示分享modal
}
export default class ManageMoney extends React.Component<INavigation, IManageMoneyState> {
    public static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            headerStyle: { backgroundColor: '#f6f6f6', justifyContent: 'center' },
            headerTitleStyle: {
                color: '#333333',
                alignSelf: 'center',
                fontSize: 17,
                letterSpacing: -0.41,
            },
            headerRight: (<View style={{ width: 40 }} />),
            headerTintColor: '#878787',
            headerBackTitle: null,
            headerLeft: (<CustomButton
                style={{ width: 25, height: 25 }}
                imageStyle={{ width: 25, height: 25, resizeMode: 'contain' }}
                image={require('../../images/left.png')}
                onPress={() => navigation.navigate('MyInvestment', { frontPage: 'manageMoney' })}
            />),
        };
    }
    constructor(props) {
        super(props);
        this.state = {
            promotionList: [],
            activityInfo: [''],
            activityRule: '',
            hasMoreData: true,
            promoCode: 0,
            qrCodeUrl: '',
            showQrCodeModal: false,
            showShareModal: false,
        };
    }
    public componentDidMount() {
        pageNo = 1;
        this.checkLogin();
    }
    public checkLogin = async () => {
        try {
            const response = await getAppJSON(Config.CHECK_KJT_LOGIN);
            if (response.data.isLogin) {
                token = response.data.token;
                this.getActivityInfo(token);
                this.getPromoteReward(token, 1, pageSize);
                this.getRefCode(token);
            } else {
                Log('kjt登录失效');
            }
        } catch (error) {
            Log(error);
        }
    }
    // 查询活动规则信息
    public getActivityInfo = async (ptoken) => {
        try {
            const params = {
                token: ptoken,
            };
            const response = await postForm(Config.GET_HAIRONGYI_ACTIVITYIFNO, params);
            if (response.success) {
                this.setState({
                    activityInfo: response.data.promotionActivityList,
                    activityRule: response.data.description,
                });
            }
        } catch (error) {
            Log(error);
        }
    }
    // 查询好友投资记录
    public getPromoteReward = async (ptoken, ppageNo, ppageSize) => {
        try {
            const params = {
                token: ptoken,
                pageNo: ppageNo,
                pageSize: ppageSize,
            };
            const response = await postForm(Config.GET_PROMOTE_REWARD, params);
            if (response.success) {
                this.setState({
                    promotionList: this.state.promotionList.concat(response.data.promotionList),
                });
                const length = this.state.promotionList.length;
                this.setState({
                    hasMoreData: length !== response.totalCount,
                });
            } else {
                this.setState({
                    hasMoreData: false,
                });
            }
        } catch (error) {
            Log(error);
        }
    }
    // 获取推荐码以及二维码图片
    public getRefCode = async (ptoken) => {
        try {
            const params = {
                token: ptoken,
            };
            const response = await postForm(Config.GET_REF_CODE, params);
            if (response.success) {
                this.setState({
                    promoCode: response.data.promoCode,
                    qrCodeUrl: response.data.qrCodeUrl,
                });
            }
        } catch (error) {
            Log(error);
        }
    }
    public loadMore = () => {
        pageNo++;
        this.getPromoteReward(pageNo, token, pageSize);
    }
    public renderActivityInfo = ({ item, separators }) => {
        return <View style={styles.activityInfo}>
            <View style={styles.infoLeft}>
                <Text style={{ fontSize: 12, color: '#333' }}>好友</Text>
                {item.paymentType === 1 && <Text style={{ fontSize: 12, color: '#333' }}>首笔</Text>}
                {item.paymentType === 2 && <Text style={{ fontSize: 12, color: '#333' }}>累计</Text>}
                <Text style={{ fontSize: 12, color: '#333' }}>投资：￥</Text>
                <Text style={{ fontSize: 12, color: '#333' }}>{item.minPayment}</Text>
                <Text style={{ fontSize: 12, color: '#333' }}>-￥</Text>
                <Text style={{ fontSize: 12, color: '#333' }}>{item.maxPayment}</Text>
            </View>
            <View style={styles.infoRight}>
                <Image source={require('../../images/icon_earn.png')}
                    style={{ width: 18, height: 18 }} />
                <Text style={{ fontSize: 12, color: '#333' }}>￥</Text>
                <Text style={{ fontSize: 12, color: '#333' }}>{item.promoterRewards}</Text>
            </View>
        </View>;
    }
    public renderPromotionList = ({ item, separators }) => {
        return <View style={styles.promotionListItem}>
            <View style={styles.listItemLeft}>
                <Text style={{ color: '#666' }}>{item.rewardsDate}</Text>
                <Text style={{ color: '#666', marginLeft: 5 }}>{item.userName}</Text>
                <Text style={{ color: '#666' }}>完成投资</Text>
            </View>
            <Text style={styles.listItemRight}>{item.rewardsValue}</Text>
        </View>;
    }
    public share = (platform) => {
        this.setState({showShareModal: false});
        setTimeout( () => {
            const title = '快来领￥688红包！'; // 分享标题
            const content = '好友力邀您来海融易，海融易为您准备了一份688大礼，快来领取吧！';
            const pic = 'http://m.ehaier.com/www/img/icon_inside_qrcode.png'; // 分享图片，写绝对路径
            const url = this.state.qrCodeUrl; // 分享链接，绝对路径
            const type = 0; // 分享类型：链接分享
            const shareInfo = [title, content, pic, url, type];
            switch (platform) {
                case 'wx': {
                    NativeModules.UmengModule.shareToWechatSession(shareInfo)
                        .then(result => {
                            Log('分享成功', result);
                        })
                        .catch((errorCode, domain, error) => {
                            Log('分享失败', error);
                        });
                    break;
                }
                case 'pyq': {
                    NativeModules.UmengModule.shareToWechatTimeline(shareInfo)
                        .then(result => {
                            Log('分享成功', result);
                        })
                        .catch((errorCode, domain, error) => {
                            Log('分享失败', error);
                        });
                    break;
                }
            }
        }, 0);
    }
    public render() {
        return (<View style={{ flex: 1 }}>
            <ScrollView>
                <View style={styles.subheader}>
                    <Image source={require('../../images/icon_mm_recommend.png')}
                        style={{ width: 12, height: 15, marginHorizontal: 5 }} />
                    <Text style={{ fontSize: 16, color: '#333' }}>推荐好友投资返佣金（海融易）</Text>
                </View>
                <FlatList
                    data={this.state.activityInfo}
                    renderItem={(item) => this.renderActivityInfo(item)} />
                <View style={styles.rules}>
                    <Text style={{ color: '#333', marginBottom: 10 }}>活动规则</Text>
                    <Text style={{ fontSize: 12, color: '#999' }}>{this.state.activityRule}
                    </Text>
                </View>
                <View style={styles.codeFiled}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: '#999', fontSize: 12, marginRight: 5 }}>我的推荐码</Text>
                        <Text style={{ fontSize: 12 }}>{this.state.promoCode}</Text>
                    </View>
                    <TouchableOpacity onPress={() => this.setState({ showQrCodeModal: true })}>
                        <View style={styles.qrCodeBtn}>
                            <Text style={{ color: '#2979FF', fontSize: 12 }}>我的二维码</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.titleItem}>
                    <Text>好友七日投资记录</Text>
                    <Text>我获得的佣金（元）</Text>
                </View>
                <View style={styles.promotionList}>
                    <FlatList
                        data={this.state.promotionList}
                        renderItem={(item) => this.renderPromotionList(item)} />
                </View>
                {this.state.hasMoreData ? <TouchableOpacity onPress={() => this.loadMore()}>
                    <View style={styles.lookMoreBtn}>
                        <Text style={{ color: '#333', fontSize: 12 }}>查看更多</Text>
                        <Image source={require('../../images/icon_lookmore.png')}
                            style={{ width: 16, height: 16 }} />
                    </View>
                </TouchableOpacity> : null}
            </ScrollView>
            <TouchableOpacity onPress={() => this.setState({ showShareModal: true })}>
                <View style={styles.shareBtn}>
                    <Text style={{ fontSize: 17, color: '#fff' }}>分享</Text>
                </View>
            </TouchableOpacity>
            <Modal popup={true}
                visible={this.state.showQrCodeModal}
                animationType='slide-up'>
                <View>
                    <View
                        style={{
                            height: 60,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text style={{ fontSize: 14, color: '#333' }}>好友在身边，请他扫一扫</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', margin: 10 }}>
                        <QRCode
                            value={this.state.qrCodeUrl}
                            size={106}
                            bgColor='#000'
                            fgColor='white' />
                        <Text style={{ fontSize: 12, color: '#999', marginTop: 10 }}>我的推荐码</Text>
                    </View>
                    <TouchableOpacity onPress={() => this.setState({ showQrCodeModal: false })}>
                        <View
                            style={{
                                height: 44,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderTopColor: '#F2F2F2',
                                borderTopWidth: 1,
                            }}>
                            <Text style={{ fontSize: 18 }}>取消</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
            <Modal popup={true}
                visible={this.state.showShareModal}
                animationType='slide-up'>
                <View>
                    <View
                        style={{
                            height: 60,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text style={{ fontSize: 14, color: '#333' }}>同意
                        <Text style={{ color: '#4979FF' }}>《自动开通天天聚服务协议》</Text>
                        </Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', margin: 10, flexDirection: 'row', justifyContent: 'space-around' }}>
                        <TouchableOpacity onPress={() => this.share('wx')}>
                            <View style={{ alignItems: 'center' }}>
                                <Image source={require('../../images/im_wx.png')}
                                    style={{ width: 46, height: 46 }} />
                                <Text style={{ color: '#999', fontSize: 12, marginTop: 15 }}>分享给好友</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.share('pyq')}>
                            <View style={{ alignItems: 'center' }}>
                                <Image source={require('../../images/im_pyq.png')}
                                    style={{ width: 46, height: 46 }} />
                                <Text style={{ color: '#999', fontSize: 12, marginTop: 15 }}>分享到朋友圈</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => this.setState({ showShareModal: false })}>
                        <View
                            style={{
                                height: 44,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderTopColor: '#F2F2F2',
                                borderTopWidth: 1,
                            }}>
                            <Text style={{ fontSize: 18 }}>取消</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>);
    }
}
const styles = EStyleSheet.create({
    subheader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#DDD',
        backgroundColor: '#FFF',
    },
    activityInfo: {
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        height: 44,
        justifyContent: 'space-between',
        borderBottomColor: '#DDD',
        borderBottomWidth: 1,
    },
    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16,
    },
    infoRight: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 16,
    },
    rules: {
        backgroundColor: '#FFF',
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    codeFiled: {
        backgroundColor: '#FFF',
        marginVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 44,
        paddingHorizontal: 16,
    },
    qrCodeBtn: {
        borderWidth: 1,
        borderColor: '#2979FF',
        width: 90,
        height: 26,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleItem: {
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        height: 44,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
    },
    promotionList: {
        backgroundColor: '#FFF',
    },
    promotionListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 44,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
    },
    listItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 16,
    },
    listItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
        color: '#666',
    },
    shareBtn: {
        backgroundColor: '#2979FF',
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
        marginVertical: 15,
        marginHorizontal: 17,
    },
    lookMoreBtn: {
        height: 44,
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
