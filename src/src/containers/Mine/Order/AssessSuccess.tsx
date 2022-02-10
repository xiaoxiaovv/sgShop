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
} from 'react-native';
import * as React from 'react';
import { Toast } from 'antd-mobile';
import { INavigation } from '../../../interface/index';
import {postAppJSON, getAppJSON} from '../../../netWork';
import Config from 'react-native-config';
import EStyleSheet from 'react-native-extended-stylesheet';
import { NavBar } from '../../../components/NavBar';
import config from '../../../config';
import {Base64} from '../../../utils/tools';
interface IOrderAssessProps {
    cOrderSn: string;
    routeKey: string;
}

interface IOrderAssessState {
    data: any;
}

const shareList = [{
    img: require('../../../images/mm_wechat.png'),
    text: '微信',
  }, {
    img: require('../../../images/btn_qq.png'),
    text: 'QQ',
  }, {
    img: require('../../../images/btn_link.png'),
    text: '复制链接',
  }];

class AssessSuccess extends React.Component<INavigation & IOrderAssessProps, IOrderAssessState> {
    public constructor(props) {
        super(props);

        this.state = {
            data: null,
        };
    }

    public componentDidMount() {
        // 可以让导航切换页面动画完成后再执行请求数据的操作
        // InteractionManager.runAfterInteractions( () => {
        //     // 请求数据
        //
        // });
        this.getData();
    }

    public render(): JSX.Element {
        const { params = {} } = this.props.navigation.state;
        return (
            <View style={{backgroundColor: 'white', flex: 1}}>
                <NavBar title={params.title ? params.title : '评价成功'}
                        defaultBack={false}
                        leftFun={() => {
                            if (params.routeKey) {
                                this.props.navigation.goBack(params.routeKey);
                            } else {
                                this.props.navigation.goBack();
                            }
                        }}/>
                {
                    IS_NOTNIL(this.state.data) &&
                    <View style={{backgroundColor: 'white', flex: 1}}>
                    <ScrollView>
                            <View style={styles.topContainer}>
                                <Text style={styles.topTitle}>感谢您为其他小伙伴购物决策提供线索</Text>
                            </View>
                            {/* 分享模块 */}
                            {
                                this.state.data.isMyOrder === 0 && this.state.data.isStoreMember === 1 &&
                                    <View>
                                    <View style={styles.shareTopContainer}>
                                        <View style={styles.line}></View>
                                        <Text style={styles.topTitle}>邀请用户评价</Text>
                                        <View style={styles.line}></View>
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent: 'center' }}>
                                                {
                                                    shareList.map((item, index) => {
                                                        return (
                                                            <View key={`share${index}`}
                                                                    style={{padding: 25}}>
                                                                <TouchableOpacity
                                                                    style={{alignItems: 'center'}}
                                                                    activeOpacity={1.0}
                                                                    onPress={() => this.goShare(index)}
                                                                >
                                                                <Image source={item.img}
                                                                        style={styles.share_img}/>
                                                                <Text style={styles.shareText}>
                                                                    {item.text}
                                                                </Text>
                                                            </TouchableOpacity>
                                                            </View>
                                                        );
                                                    })
                                                }
                                    </View>
                                </View>
                            }
                            {/* 待评价商品视图 */}
                            {
                                this.state.data.waitComments !== null && this.state.data.waitComments.length > 0 &&
                                <View style={{paddingBottom: 20}}>
                                    <View style={styles.waitAssesssTop}>
                                        <View style={styles.line}></View>
                                        <Text style={styles.topTitle}>你还可以评价</Text>
                                        <View style={styles.line}></View>
                                    </View>
                                    {/* item */}
                                    {
                                        this.state.data.waitComments.map((item, i) => {
                                            return (
                                                <View key = {i} style={styles.waitAssessItem}>
                                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                        <Image
                                                            style={styles.itemImg}
                                                            source = {{uri: item.productImgUrl}}
                                                        />
                                                        <Text style={styles.itemText}
                                                            numberOfLines={1}
                                                        >
                                                            {item.productName}
                                                        </Text>
                                                    </View>
                                                    <TouchableOpacity
                                                        activeOpacity={1.0}
                                                        onPress={() => this.goAssess(item.cOrderSn)}
                                                        >
                                                        <View style={styles.goAssessbtn}>
                                                            <Text style={styles.goAssessText}>
                                                            去评价
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            );
                                        })
                                    }
                                </View>
                            }
                    </ScrollView>
                    </View>
                }
            </View>
        );
    }

    private goShare = (index) => {
        const { params } = this.props.navigation.state;

        // const wdOrderSnBase = encodeURI(params.cOrderSn);
        const baseEncode = new Base64();
        const wdOrderSnBase = encodeURIComponent(baseEncode.encode(params.cOrderSn));
        const title = '邀请评价'; // 分享标题
        const content = this.state.data.productInfo.productName; // 分享内容
        const pic = this.state.data.productInfo.productImg; // 分享图片，写绝对路径

        const url = config.API_HOST + '/www/index.html#/' + 'useExperience/' + wdOrderSnBase; // 分享链接，绝对路径
        const commd = [title, content, pic, url, 0, null];
        if (index === 0) {
            // 分享到微信
            NativeModules.UmengModule.shareToWechatSession(commd)
                .then(result => {
                    Log('分享成功', result);
                })
                .catch((errorCode, domain, error) => {
                    Log('分享失败', error);
                });
        } else if (index === 1) {
            // 分享到QQ
            NativeModules.UmengModule.shareToQQ(commd)
            .then(result => {
                Log('分享成功', result);
            })
            .catch((errorCode, domain, error) => {
                Log('分享失败', error);
            });
        } else {
            Clipboard.setString(url);
            Toast.info('复制成功', 1);
        }
    }

    private goAssess = (cOrderSn) => {
        this.props.navigation.navigate('OrderAssess', {
            cOrderSn,
            callBack: () => {
                this.getData();
            },
        });

    }
    // 待评价的商品
    private  getData = async () => {
        try {
            // /v3/h5/sg/comment/commentSuccessPage.json
            const { params } = this.props.navigation.state;
            const json = await getAppJSON(Config.COMMENTSUCCESSPAGE, {
                cOrderSn: params.cOrderSn,
            });
            // Log('zhaoxincheng****', json);
            if (json.success) {
                this.setState({data: json.data});
            } else {
                Toast.fail(json.message, 1);
            }
        } catch (err) {
            Log(err);
        }
    }
}

const styles = EStyleSheet.create({
    topContainer: {
        backgroundColor: 'rgb(241,241,241)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 30,
        paddingBottom: 30,
    },
    topTitle: {
        fontSize: '14rem',
        color: 'rgb(114,114,114)',
    },
    shareTopContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 45,
        paddingBottom: 25,
    },
    shareText: {
        fontSize: '12rem',
        color: 'black',
        marginTop: 5,
    },
    line: {
        flex: 1,
        height: 1,
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: 'rgb(234,232,232)',
    },
    share_img: {
        width: '45rem',
        height: '45rem',
    },
    waitAssesssTop: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 25,
        paddingBottom: 25,
    },
    waitAssessItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        paddingLeft: 25,
        paddingRight: 25,
    },
    goAssessbtn: {
        borderRadius: 5,
        backgroundColor: 'rgb(236,80,83)',
    },
    itemImg: {
        width: '40rem',
        height: '40rem',
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgb(223,223,223)',
    },
    itemText: {
        fontSize: '13rem',
        color: 'black',
        maxWidth: '200rem',
    },
    goAssessText: {
        fontSize: '12rem',
        color: 'white',
        margin: 5,
        marginLeft: 15,
        marginRight: 15,
    },
});

export default AssessSuccess;
