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
import {List, WhiteSpace, ActivityIndicator} from 'antd-mobile';
import SYImagePicker from 'react-native-syan-image-picker';
import CustomButton from 'rn-custom-btn1';
import {isiPhoneX, px} from '../../utils';
import {UltimateListView} from 'rn-listview';
import CustomNaviBar from '../../components/customNaviBar';
import {getAppJSON} from '../../netWork';
import {width, height} from '../../utils';
import {ICustomContain, ShowAdType} from '../../interface';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Config from 'react-native-config';
import {connect, createAction} from '../../utils';
import config from '../../config';
import url from '../../config/url';
import {fetchService} from '../../config/Http';
import {NavigationActions} from 'react-navigation';
import axios from 'axios';
import {Toast} from 'antd-mobile';
import {action} from '../../dva/utils';
import {Font, Color} from 'consts';

const selectMenuHeight = px(50);

interface IAccountSetUpState {
    data: any[];
    isDateTimePickerVisible: boolean;
    isUploadingPic: boolean;
}

const Item = List.Item;

@connect(({mine}) => ({...mine}))
class AccountSetUp extends React.Component <ICustomContain, IAccountSetUpState> {

    private static navigationOptions = ({navigation}) => {
        // Log(navigation.state);
        const {params = {}} = navigation.state;
        Log(params);

        return {
            title: '账户设置',
            header: null,
        };
    }

    private listenX :any;

    public constructor(props) {
        super(props);
        // 初始化state
        this.state = {
            // 是否到达底部
            data: [],
            isDateTimePickerVisible: false,
            popViewShow: false,
            isUploadingPic: false,
        };
    }

    public componentDidMount() {
        this.setState({data: dvaStore.getState().users});
        this.listenX = DeviceEventEmitter.addListener('updateX', (e) => {
            this.setState({data: dvaStore.getState().users});
        })
    }

    public componentWillUnmount() {
        this.listenX.remove();
    };

    // 从相机拍照
    public handleTakePicturePhoto = async () => {
        // 还能添加的数量
        if (this.state.canAddCount <= 0) {
            Toast.info('最多只能添加9张图片', 2);
            return;
        }
        try {
            const options = {
                isCrop: Platform.OS == "ios" ? true:false,
                CropW: 200,
                CropH: 200,
                showCropCircle: true,
                circleCropRadius: 100,
                quality: 80,
            };
            SYImagePicker.openCamera(options, (err, pictureItems) => {
                if (err) {
                    // throw err;
                } else {
                    const path = pictureItems[0].uri;
                    this.uploadImage(path);
                }
            });
        } catch (err) {
            // 取消选择，err.message为"取消"
            // Toast.info(err.message, 2);
        }
    };

    // 从相册选择图片
    public handleSelectPhoto = async () => {
        try {
            const options = {
                imageCount: 1,
                isCamera: true,
                isCrop: Platform.OS == "ios" ? true:false,
                showCropCircle: true,
                circleCropRadius: 100,
                CropW: 200,
                CropH: 200,
                quality: 80,
                isGif: false,
            };
            const photos = await SYImagePicker.asyncShowImagePicker(options);
            const path = photos[0].uri;
            this.uploadImage(path);
        } catch (err) {
            // 取消选择，err.message为"取消"
            Toast.info(err.message, 2);

        }
    };
    public uploadImage = async (path) => {
        try {
            this.setState({isUploadingPic: true});
            if (!path) {
                return;
            }
            const body = new FormData();
            body.append('imageFile', {
                uri: path,
                type: 'image/jpeg',
                name: 'imageFile.jpg',
            });
            const settings = {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'multipart/form-data',
                },
                body,
            };
            // alert(`path = ${path}`);
            const fetchResult = await fetchService(url.UPLOAD_IMAGE, settings, 60000, true);
            // alert(`fetchResult = ${JSON.stringify(await fetchResult.json())}`);
            const fetchResultJson = await fetchResult.json();
            const {success, data, message} = fetchResultJson;
            if (success && data && data.avatarImageFileId) {
                // 更新图像成功,发个通知告诉APICloud刷新APICloudtag标识对应的界面
                const info = {type: 13, tag: 'refresh_header'};
                NativeModules.APICloudModule.RNCallNaviteMethod(info);
                this.setState({
                    data: {
                        ...this.state.data,
                        avatarImageFileId: data.avatarImageFileId,
                    },
                    isUploadingPic: false,
                }, async () => {
                    this.props.dispatch(
                        createAction('users/updateAvatarImageFileId')({avatarImageFileId: data.avatarImageFileId}));
                    const user = await global.getItem('User');
                    await global.setItem('User', {
                        ...user,
                        avatarImageFileId: data.avatarImageFileId,
                    });
                });
            } else {
                this.setState({isUploadingPic: false});
                Toast.info(message, 2);
            }
        } catch (err) {
            console.log(err.message);
            this.setState({isUploadingPic: false});
            Toast.info(err.message, 2);
        }
    };

    public render(): JSX.Element {
        return (
            <View style={{flex: 1}}>
                <ScrollView style={{backgroundColor: '#EEEEEE'}}>
                    <View style={{backgroundColor: '#ffffff'}}>
                        <ImageBackground source={require('../../images/doimg.png')} style={styles.header}>
                            <CustomNaviBar
                                style={{backgroundColor: 'transparent'}}
                                navigation={this.props.navigation}
                                hiddenLeftBtn={false}
                                containerStyle={{backgroundColor: 'transparent'}}
                                leftViewImage={require('../../images/fanhui.png')}
                                leftViewStyle={{marginLeft: 5}}
                                local={{leftStyle: {width: 22, height: 22}}}
                                titleView={
                                    <Text style={{
                                        color: '#FFFFFF',
                                        fontFamily: 'PingFangSC-Light',
                                        fontSize: 18
                                    }}>
                                        账户设置
                                    </Text>}
                            />
                            {
                                Platform.OS === 'ios'
                                    ? <View style={{height: px(16)}}></View>
                                    : <View style={{height: px(36)}}></View>
                            }
                            <View style={{width, alignItems: 'center'}}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({popViewShow: true});
                                    }}>
                                    <Image style={styles.icon} source={{uri: this.state.data.avatarImageFileId}}/>
                                </TouchableOpacity>
                                <Text style={{
                                    marginTop: 5,
                                    fontFamily: 'PingFangSC-Light',
                                    fontSize: 14
                                }}>{this.state.data.userName}</Text>
                            </View>
                        </ImageBackground>
                    </View>
                    <View style={{flex: 4}}>
                        {/* <List> */}
                        <Item extra={<Text style={styles.extraStyle}>{this.state.data.nickName}</Text>}
                              arrow='horizontal' onClick={() => {
                            this.props.navigation.navigate('NickName');
                        }}
                        >
                            <Text style={styles.listStyle}>昵称</Text>
                        </Item>
                        <Item extra={this.state.data.gender == 0 ?
                            <Text style={styles.extraStyle}>保密</Text> : this.state.data.gender == 1 ?
                                <Text style={styles.extraStyle}>男</Text> : <Text style={styles.extraStyle}>女</Text>}
                              arrow='horizontal' onClick={() => {
                            this.props.navigation.navigate('Gender', {fasfa: '33', bababa: '44'});
                        }}><Text style={styles.listStyle}>性别</Text></Item>
                        <Item extra={<Text style={styles.extraStyle}>{this.state.data.birthday}</Text>}
                              arrow='horizontal' onClick={this._showDateTimePicker}><Text
                            style={styles.listStyle}>出生日期</Text></Item>
                        {/* </List> */}
                        <WhiteSpace size='md'/>
                        {/* <List> */}

                        <Item arrow='horizontal' onClick={() => {
                            this.props.navigation.navigate('AccountSafty', {
                                phone: this.state.data.mobile,
                                email: this.state.data.email
                            });
                        }}><Text style={styles.listStyle}>账户安全</Text></Item>
                        <Item arrow='horizontal'
                              onClick={() => {
                                  this.props.navigation.navigate('Address', {from: 'zhsz'});
                              }}><Text style={styles.listStyle}>收货地址</Text></Item>
                        <Item arrow='horizontal' onClick={() => {
                            this.props.navigation.navigate('SetUpOne');
                        }}><Text style={styles.listStyle}>通用</Text></Item>
                        {/* </List> */}
                    </View>
                    <TouchableOpacity
                        style={styles.logoutContianer}
                        onPress={() => {this.logout()}}
                    >
                        <Text style={styles.logoutText}>退出登录</Text>
                    </TouchableOpacity>
                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this._handleDatePicked}
                        onCancel={this._hideDateTimePicker}
                        confirmTextIOS={'确认'}
                        cancelTextIOS={'取消'}
                    />

                    <Modal
                        // 设置Modal组件的呈现方式
                        animationType='fade'
                        // 它决定 Modal 组件是否是透明的
                        transparent={true}
                        // 它决定 Modal 组件何时显示、何时隐藏
                        visible={this.state.popViewShow}
                        // 当 Modal组件在屏幕上完成显示后，这个回调函数将被执行
                        onShow={() => Log('onShow')}
                        // 这是 Android 平台独有的回调函数类型的属性
                        // 开发者必须要写一个函数来处理当 Modal 显示在界面时且android物理返回键被按下时的业务逻辑
                        onRequestClose={() => this.setState({popViewShow: false})}
                    >
                        <View style={styles.backGroundView}>
                            <TouchableOpacity
                                style={styles.missClickView}
                                activeOpacity={1} onPress={() => this.setState({popViewShow: false})}>
                                <View style={styles.missClickView}></View>
                            </TouchableOpacity>
                            <View style={styles.popContainer}>
                                {/* 标题 */}
                                <View style={{height: selectMenuHeight, justifyContent: 'center'}}>
                                    <View style={{alignItems: 'center', padding: 15}}>
                                        <Text style={{fontSize: 13, color: '#7c7c7c'}}>照片选取方式</Text>
                                    </View>
                                </View>
                                {/* 拍照按钮 */}
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            popViewShow: false,
                                        }, () => {
                                            setTimeout(() => {
                                                this.handleTakePicturePhoto();
                                            }, 500);
                                        });
                                    }}
                                    style={{height: selectMenuHeight}}
                                >
                                    <View style={{width: '100%', height: 0.5, backgroundColor: 'rgb(200,202,205)'}}></View>
                                    <View style={{height: selectMenuHeight, justifyContent: 'center'}}>
                                        <View style={{alignItems: 'center', padding: 10}}>
                                            <Text style={{fontSize: 18, color: 'rgb(12,96,254)'}}>拍照</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                {/* 从相册选取按钮 */}
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            popViewShow: false,
                                        }, () => {
                                            setTimeout(() => {
                                                this.handleSelectPhoto();
                                            }, 500);
                                        });
                                    }}
                                    style={{height: selectMenuHeight}}
                                >
                                    <View style={{width: '100%', height: 0.5, backgroundColor: 'rgb(200,202,205)'}}></View>
                                    <View style={{height: selectMenuHeight, justifyContent: 'center', borderRadius: 8}}>
                                        <View style={{alignItems: 'center', padding: 10}}>
                                            <Text style={{fontSize: 18, color: 'rgb(12,96,254)'}}>从相册选取</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {/* 取消按钮按钮 */}
                            <TouchableOpacity
                                style={{
                                    width: width * 0.95,
                                    marginTop: 10,
                                    marginBottom: isiPhoneX ? (34 + width * 0.05) : width * 0.05,
                                    height: selectMenuHeight,
                                    borderRadius: 8,
                                    backgroundColor: 'white'
                                }}
                                onPress={() => {
                                    this.setState({popViewShow: false})
                                }}
                            >
                                <View style={{
                                    width: width * 0.95,
                                    height: selectMenuHeight,
                                    justifyContent: 'center',
                                    borderRadius: 8
                                }}>
                                    <View style={{alignItems: 'center', padding: 10}}>
                                        <Text style={{fontSize: 18, color: 'rgb(12,96,254)'}}>取消</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </ScrollView>
                <ActivityIndicator
                    toast
                    size={'large'}
                    text='上传头像中，请稍等...'
                    animating={this.state.isUploadingPic}
                />
            </View>
        )
            ;
    }

    private CheckDate = (res, date) => {
        if (res.success) {
            this.state.data.birthday = moment(date).format('YYYY-MM-DD');
            this.setState({data: this.state.data});
            this.props.dispatch(createAction('users/saveUsersMsg')(this.state.data));
            global.setItem('User', this.state.data);
        } else {
            // alert(res.message);
        }
    }

    private _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

    private _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

    private _handleDatePicked = async (date) => {
        this._hideDateTimePicker();
        const paramsList = {
            birthday: moment(date).format('YYYY-MM-DD'),
            gender: this.state.data.gender,
            nickName: this.state.data.nickName,
            userName: this.state.data.userName,
        }
        const urlUpdate = Config.API_URL + Config.JENDER_POST;

        axios({
            method: 'post',
            url: urlUpdate,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
                // 'TokenAuthorization': '',
            },
            data: paramsList,
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
        }).then((res) => {
            this.CheckDate(res.data, date);
        })
    };

    private loadData = async () => {
        try {
            const {success, data} = await getAppJSON('sg/cms/navigation/getNavigations.json?parentId=0');
            if (!success || !data) {
                return;
            }
            this.setState({data});
        } catch (error) {
            Log(error);
        }
    }
    private logout = async () => {
        const res = await getAppJSON(Config.LOGOUT);
        if (res.success) {
            this.props.dispatch({type: 'users/clearUserLoginInfo'});
            this.props.dispatch({type: 'cartModel/clearCartInfo'});
            this.props.dispatch(action('users/changeCommission', {CommissionNotice: true }));

            // 退出登录替换token
            global.setItem('userToken', 'Bearer' + res.data);
            global.setItem('User', null);
            global.setItem('roleInfo', null);
            global.setItem('storeId', '');
            const info = {type: 2, tag: 'main', success: 1, token: 'Bearer' + res.data};
            NativeModules.APICloudModule.RNCallNaviteMethod(info); // 告诉社区loginout
            if (Platform.OS === 'android') {
                NativeModules.APICloudModule.LoginOut();
            }
            // 更新用户 token,发个通知告诉APICloud
            const refreshToken = {type: 13, tag: 'refresh_token'};
            NativeModules.APICloudModule.RNCallNaviteMethod(refreshToken);
            this.props.dispatch((createAction('mainReducer/stateChange')({showAdType: ShowAdType.Guide})));
            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({routeName: 'RootTabs'})],
            });
            this.props.navigation.dispatch(resetAction);

            // 小熊客服 yl
            NativeModules.XnengModule.NTalkerLogOut();
        } else {
            Toast.info(res.message);
        }
    }
}

const styles = StyleSheet.create({
    header: {
        width,
        height: px(190),
    },
    icon: {
        width: px(70),
        height: px(70),
        borderRadius: px(35),
    },
    logoutContianer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 45,
        marginLeft: 16,
        marginRight: 16,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#2979FF',
    },
    logoutText:{
        color: Color.WHITE,
        fontSize: Font.LARGE_2,
    },
    extraStyle: {
        fontSize: px(14),
        color: '#666',
    },
    listStyle: {
        fontSize: px(14),
    },
    backGroundView: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    missClickView: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: isiPhoneX ? px((height - (selectMenuHeight * 4 + 10) - 34)) : px(height - (selectMenuHeight * 4 + 10)),
        backgroundColor: 'transparent',
    },
    popContainer: {
        width: width * 0.95,
        backgroundColor: 'rgb(237,239,240)',
        marginTop: isiPhoneX ? px((height - (selectMenuHeight * 4 + 10) - 34)) : px(height - (selectMenuHeight * 4 + 10)),
        borderRadius: px(8),
    },
});

export default AccountSetUp;
