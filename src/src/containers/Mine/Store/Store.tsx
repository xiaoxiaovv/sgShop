import * as React from 'react';
import {
    ScrollView, StyleSheet, ImageBackground, View, Text, Image,
    TouchableHighlight, TouchableOpacity, NativeModules, Platform, Alert
} from 'react-native';
import {List, Button, Modal, Toast} from 'antd-mobile';
import {INavigation} from '../../../interface/index';
import {getAppJSON} from '../../../netWork';
import Config from 'react-native-config';
import ShareModle from '../../../components/ShareModle';
import CustomNaviBar from '../../../components/customNaviBar';
import {connect} from 'react-redux';
import ScreenUtil from '../../Home/SGScreenUtil';
import EStylesheet from 'react-native-extended-stylesheet';
import ShopRenovate from './ShopRenovate';
import {Color, Font} from 'consts';

const Item = List.Item;
import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

interface IProps {
    mid: number;
    userId: number;
}

interface IState {
    isHost: number;
    storeName: string;
    level: number;
    qrCode: string;
    showQrCodeModal: boolean;
    showShareModal: boolean;
}
/**
 * 我的店铺
 */
@connect(({users: {mid, userId,avatarImageFileId}}) => ({mid, userId,avatarImageFileId}))
class Store extends React.Component<INavigation & IProps, IState> {
    public state: IState = {
        isHost: 0,
        storeName: '',
        level: 1,
        qrCode: '',
        showQrCodeModal: false,
        showShareModal: false,
    };

    public componentWillUnmount() {
        const {callBack} = this.props.navigation.state.params;
        if (callBack) {
            callBack();
        }
    }

    public componentDidMount() {
        this.loadData();
    }

    public loadData = async () => {
        try {
            const {success, data} = await getAppJSON(Config.MY_STORE);
            if (!success || !data) {
                return;
            }
            this.setState({
                isHost: data.isHost, storeName: data.storeName, level: data.level,
                qrCode: data.qrCode
            });
        } catch (error) {
            Log(error);
        }
    }

    public render(): JSX.Element {
        const {navigation} = this.props;
        return (
            <ScrollView>
                <ImageBackground source={require('../../../images/personalbg.png')} style={styles.header}>
                    <CustomNaviBar
                        navigation={this.props.navigation}
                        style={{backgroundColor: 'tranparent'}}
                        containerStyle={{backgroundColor: 'tranparent'}}
                        local = {{titleStyle: {color: Color.WHITE}}}
                        title={'店铺管理'}
                        leftViewImage={require('../../../images/ic_back_white.png')}
                        leftAction={() =>this.props.navigation.goBack()}
                        rightView={(
                        <Button type='ghost' inline size='small' style={styles.showStoreButton}>
                            <Text style={{color: 'white'}} 
                            onPress={() => {
                                this.props.navigation.navigate('StoreHome', {storeId: dvaStore.getState().users.mid})
                            }}>店铺预览</Text>
                        </Button>)}
                    />
                    <View style={{marginTop: 20, flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{marginLeft: 20, marginRight: 10}}>
                            <Image
                                source={{uri: this.props.avatarImageFileId}}
                                style={styles.avatar}/>
                        </View>
                        <View>
                            <Text style={{fontSize: 18, color: 'white'}}>{this.state.storeName}</Text>
                            {
                                this.state.level === 1 &&
                                <Image source={require('../../../images/level_1.png')}
                                       style={styles.level}/>
                            }
                            {
                                this.state.level === 2 &&
                                <Image source={require('../../../images/level_2.png')}
                                       style={styles.level}/>
                            }
                            {
                                this.state.level === 3 &&
                                <Image source={require('../../../images/level_3.png')}
                                       style={styles.level}/>
                            }
                            {
                                this.state.level === 4 &&
                                <Image source={require('../../../images/level_4.png')}
                                       style={styles.level}/>
                            }
                            {
                                this.state.level === 5 &&
                                <Image source={require('../../../images/level_5.png')}
                                       style={styles.level}/>
                            }
                            {
                                this.state.level === 6 &&
                                <Image source={require('../../../images/level_6.png')}
                                       style={styles.level}/>
                            }
                            {
                                this.state.level === 7 &&
                                <Image source={require('../../../images/level_7.png')}
                                       style={styles.level}/>
                            }
                            {
                                this.state.level === 8 &&
                                <Image source={require('../../../images/level_8.png')}
                                       style={styles.level}/>
                            }
                            {
                                this.state.level === 9 &&
                                <Image source={require('../../../images/level_9.png')}
                                       style={styles.level}/>
                            }
                            {
                                this.state.level === 10 &&
                                <Image source={require('../../../images/level_10.png')}
                                       style={styles.level}/>
                            }
                            {
                                this.state.level === 11 &&
                                <Image source={require('../../../images/level_11.png')}
                                       style={styles.level}/>
                            }
                        </View>
                    </View>
                </ImageBackground>
                <List>
                    <Item
                        thumb='http://cdn09.ehaier.com/shunguang/H5/www/img/Group2-1@2x.png'
                        arrow='horizontal'
                        onClick={() => {
                            navigation.navigate('StoreInfo', {
                                callBack: () => {
                                    this.loadData();
                                }
                            });
                        }}
                    >
                        店铺信息
                    </Item>
                    <Item
                        thumb='http://cdn09.ehaier.com/shunguang/H5/www/img/Group3-1@2x.png'
                        onClick={() => navigation.navigate('ShopRenovate')}
                        arrow='horizontal'
                    >
                        店铺装修
                    </Item>
                    <Item
                        thumb='http://cdn09.ehaier.com/shunguang/H5/www/img/Group4-1@2x.png'
                        onClick={() => {
                            this.setState({showQrCodeModal: true});
                        }}
                        arrow='horizontal'
                    >
                        店铺二维码
                    </Item>
                    <Item
                        thumb='http://cdn09.ehaier.com/shunguang/H5/www/img/Group5-1@2x.png'
                        onClick={() => this.setState({showShareModal: true})}
                        arrow='horizontal'
                    >
                        分享店铺
                    </Item>
                </List>
                <Modal
                    popup
                    visible={this.state.showQrCodeModal}
                    animationType='slide-up'
                >
                    <View>
                        <View
                            style={{
                                height: 60,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderBottomColor: '#F2F2F2',
                                borderBottomWidth: 1,
                            }}
                        >
                            <Text style={{fontSize: 18}}>扫描二维码，分享我的顺逛店铺</Text>
                            <TouchableOpacity
                                style={{position: 'absolute', top: 20, right: 10}}
                                onPress={() => {
                                    this.setState({showQrCodeModal: false});
                                }}>
                                <Image
                                    style={{width: 20, height: 20}}
                                    source={{uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/code-btn.png'}}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, alignItems: 'center', margin: 10}}>
                            <Image
                                style={{width: 200, height: 200}}
                                source={{uri: this.state.qrCode}}
                            />
                            <Button
                                style={{
                                    borderRadius: 25,
                                    width: 180,
                                    borderColor: '#639DFC',
                                }}
                                onClick={() => {
                                    if(this.state.qrCode) {
                                        this.saveImg(this.state.qrCode);
                                    }else {
                                        Alert.alert('提示：', '二维码图片不存在', [{text: '确定'}] );
                                    }
                                }}
                            ><Text style={{color: '#639DFC', fontSize: 16}}>保存二维码</Text></Button>
                        </View>
                    </View>
                </Modal>
                <ShareModle
                    visible={this.state.showShareModal} content={this.resolveSharingCommand()}
                    onCancel={() => this.setState({showShareModal: false})}
                    hiddenEwm={true}
                    hidingTitle={true}
                />
            </ScrollView>
        );
    }

    private resolveSharingCommand = () => {
        const title = this.state.storeName + '的顺逛店铺'; // 分享标题
        const content = '我的顺逛店铺，精选好货，快来逛逛吧'; // 分享内容
        const pic = this.props.avatarImageFileId; // 分享图片，写绝对路径
        // const url = `${Config.API_URL}www/index.html#/myStore/${this.props.mid}/${this.props.userId}/?fs`;
        const url = `${URL.GET_MY_STORE_SHARE_URL}${this.props.mid}/${this.props.userId}/?fs`;
        return [title, content, pic, url, 0];
    }
    private saveImg = (img) => {
        const command = [img];
        NativeModules.PhotoModule.downloadImg(command)
            .then(result => {
                this.setState({showQrCodeModal: false});
                Toast.success('保存成功!', 2);
            })
            .catch((errorCode, domain, error) => {
                this.setState({showQrCodeModal: false});
                Toast.fail('保存失败!', 2);
            });
    }
}

const styles = EStylesheet.create({
    headerNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: width,
        paddingTop: ScreenUtil.isiPhoneX ? 44 : (Platform.OS === 'ios' ? 20 : 0), // 处理ios状态栏,普通ios设备是20,iPhone X是44
        height: 44,
        '@media android': {
            height: 44,
        },
        '@media (width: 375) and (height: 812)': {
            height: 64,
        },
    },
    header: {
        width,
        height: 180,
    },
    headerButton: {
        width: 25,
        height: 25,
        marginRight: 10,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    levelWrapper: {
        backgroundColor: '#FEB407',
        borderRadius: 40,
        top: -9,
    },
    level: {
        width: 70,
        height: 20,
        marginTop: 10,
        borderRadius: 2,
        resizeMode: 'contain',
    },
    showStoreButton: {
        width: 80,
        height: 24,
        borderColor: Color.WHITE,
        borderRadius: 10,
        marginRight: 16,
        marginTop: 10,
        marginBottom: 10,
    },
});

export default Store;
