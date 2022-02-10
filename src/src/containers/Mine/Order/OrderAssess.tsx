import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    InteractionManager,
    Easing,
    Modal,
    NativeModules,
    Platform,
} from 'react-native';
import * as React from 'react';
import {TextareaItem, Toast} from 'antd-mobile';
import {INavigation} from '../../../interface/index';
import {postAppJSON, getAppJSON, postAppForm} from '../../../netWork';
import Config from 'react-native-config';
import {isiPhoneX} from '../../../utils';
import StarRating from '../../../components/StarRating';
import SYImagePicker from 'react-native-syan-image-picker';
import ImageViewer from 'react-native-image-zoom-viewer';

import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
import EStyleSheet from 'react-native-extended-stylesheet';
import {NavBar} from '../../../components/NavBar';

interface IOrderAssessProps {
    cOrderSn: string;
    // 未用到
    orderId: string;
    // 前一个界面的路由key
    // routeKey: string;
}

interface IOrderAssessState {
    data: any;
    // 选择的照片数组
    photosData: any[];
    // 选择的买家影响数组
    selectedBuyerItemData: any[];
    // 输入框中输入的文字
    textareaText: string;
    // 总评分
    star: number;
    // 商品评分
    productStar: number;
    // 服务评分
    serviceStar: number;
    // 物流评分
    shippingStar: number;
    // 能够添加几张图片
    canAddCount: number;
    // 是否显示轮播视图
    showImageViewer: boolean;
    imageIndex: number;
    popViewShow: boolean;
    placeholderText: string;
}

const grade = [
    {star: 5, label: '好评'},
    {star: 3, label: '中评'},
    {star: 1, label: '差评'},
];

const selectMenuHeight = 50;
const photoWAndH = (width - 60) * 0.25;

class OrderAssess extends React.Component<INavigation & IOrderAssessProps, IOrderAssessState> {

    public constructor(props) {
        super(props);

        this.state = {
            data: null,
            photosData: [],
            selectedBuyerItemData: [],
            textareaText: '',
            // 总评分
            star: 5,
            // 商品评分
            productStar: 5,
            // 服务评分
            serviceStar: 5,
            // 物流评分
            shippingStar: 5,
            // 默认能够添加9张图片
            canAddCount: 9,
            showImageViewer: false,
            imageIndex: 0,
            popViewShow: false,
            placeholderText: '您可以写下您的购物体验，供其他小伙伴参考哦！',
        };
    }

    public componentDidMount() {
        // 可以让导航切换页面动画完成后再执行请求数据的操作
        // InteractionManager.runAfterInteractions( () => {
        //     // 请求数据
        //     this.getData();
        // });
        this.getData();
    }

    public componentWillUnmount() {
        // 点击了返回,当前界面pop出栈,刷新前一个界面
        const {callBack} = this.props.navigation.state.params;
        if (callBack) {
            // 刷新我的界面
            callBack();
        }
    }

    public render(): JSX.Element {

        // 照片
        const photoCard = ({phtotoItem, index}) => {
            // base64Img
            // const base64Img = `data:image/png;base64,${phtotoItem.base64}`;
            return (
                <View key={index} style={styles.photoContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            // 放大图片
                            this.setState({imageIndex: index, showImageViewer: true});
                        }}>
                        <Image
                            style={{width: photoWAndH, height: photoWAndH}}
                            source={{uri: phtotoItem.uri}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{position: 'absolute', top: -7, right: 3}}
                        onPress={() => {
                            // 删除图片
                            const tempPhotoData = this.state.photosData;
                            tempPhotoData.splice(index, 1);
                            this.setState({
                                photosData: tempPhotoData.concat(),
                                canAddCount: 9 - tempPhotoData.length,
                            });
                        }}>
                        <Image
                            style={styles.photoStyle}
                            source={require('../../../images/addressdelete.png')}
                        />
                    </TouchableOpacity>
                </View>
            );
        };
        const Photos = [];
        if (this.state.photosData.length > 0) {
            this.state.photosData.forEach((phtotoItem, index) => {
                if (phtotoItem) {
                    const Card = photoCard({phtotoItem, index});
                    Photos.push(Card);
                }
            });
        }

        // 买家影响item
        const BuyerItemCard = ({item, index}) => {
            let isSelected: boolean = false;
            if (this.state.selectedBuyerItemData.length > 0) {
                // 说明保存选中的item的数组里面有值
                if (this.state.selectedBuyerItemData.indexOf(item.impressionsProdTypeId) !== -1) {
                    isSelected = true;
                } else {
                    isSelected = false;
                }
            }
            return (
                <TouchableOpacity
                    key={index}
                    style={[styles.BuyerItemContainer,
                        {borderColor: '#eee', backgroundColor: isSelected ? 'rgba(255, 68, 0, 0.05)' : 'white'}]}
                    onPress={() => {
                        let tempArray = [];
                        if (this.state.selectedBuyerItemData.length > 0) {
                            // 已经添加有数据
                            tempArray = this.state.selectedBuyerItemData.concat();

                            if (tempArray.indexOf(item.impressionsProdTypeId) !== -1) {
                                // 移除
                                tempArray.splice(tempArray.indexOf(item.impressionsProdTypeId), 1);
                            } else {
                                // 继续添加
                                tempArray.push(item.impressionsProdTypeId);
                            }
                        } else {
                            // 添加
                            tempArray.push(item.impressionsProdTypeId);
                        }
                        this.setState({
                            selectedBuyerItemData: tempArray.concat(),
                        });
                    }}>
                    <Text style={{
                        fontSize: 13, color: isSelected ? 'rgb(255, 68, 0)' : '#999',
                        marginTop: 7, marginBottom: 7
                    }}>{item.impressionName}</Text>
                </TouchableOpacity>
            );
        };
        const BuyerItems = [];
        if (this.state.data !== null && this.state.data.impression !== null) {
            this.state.data.impression.forEach((item, index) => {
                if (item) {
                    const Card = BuyerItemCard({item, index});
                    BuyerItems.push(Card);
                }
            });
        }
        const AssessData = this.state.data;

        return (
            <View style={{backgroundColor: 'white', flex: 1}}>
                <NavBar title={'发表评价'}/>
                {
                    AssessData !== null &&
                    <View style={{backgroundColor: 'white', flex: 1}}>
                        <ScrollView>
                            {/* 第一部分 */}
                            <View style={styles.allAssess}>
                                <View style={{justifyContent: 'center', marginTop: 40, marginBottom: 40}}>
                                    <Image
                                        style={styles.productImg}
                                        source={{uri: AssessData.productInfo.productImg}}
                                    />
                                </View>
                                <View style={{marginLeft: 20}}>
                                    <Text style={styles.allAssessTitle}>整体评价</Text>
                                    {/* 评价单选框模块 */}
                                    <View style={{flexDirection: 'row'}}>
                                        {   // 评价单选框
                                            grade.map(item => (
                                                <TouchableOpacity
                                                    activeOpacity={1}
                                                    onPress={() => {
                                                        this.setState({
                                                            star: item.star,
                                                        });
                                                    }}
                                                    key={item.star}
                                                >
                                                    <View style={{flexDirection: 'row', marginRight: 5, marginTop: 15}}>
                                                        <Image
                                                            style={styles.selectedImg}
                                                            source={
                                                                this.state.star === item.star ?
                                                                    require('../../../images/ic_select.png') :
                                                                    require('../../../images/ic_check.png')}/>
                                                        <Text style={styles.selectedText}>{item.label}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            ))
                                        }
                                    </View>
                                </View>
                            </View>
                            {/* 第二部分: 输入框 */}
                            <View style={{backgroundColor: '#f4f4f4', paddingRight: 12.5, paddingTop: 10}}>
                                <TextareaItem
                                    style={styles.textAreaItem}
                                    placeholder={this.state.placeholderText}
                                    rows={5}
                                    count={500}
                                    onChange={(val) => {
                                        this.setState({textareaText: val});
                                    }}
                                />
                            </View>
                            {/* 第三部分 (这部分可能会被隐藏)*/}
                            <View style={{backgroundColor: 'rgb(241,241,241)', alignItems: 'center', marginTop: -0.5}}>
                                {/* 选择图片 */}
                                {
                                    ((AssessData.isMyOrder === 1) || (AssessData.isStoreMember === 0)) &&
                                    <View style={styles.selectPhotoContainer}>
                                        {Photos}
                                        {/* 选择图片按钮 */}
                                        {
                                            this.state.canAddCount > 0 &&
                                            <TouchableOpacity
                                                style={styles.selectPhoto}
                                                onPress={() => {
                                                    // 添加照片数据
                                                    this.popView();
                                                }}>
                                                <Image
                                                    style={{width: 22, height: 22}}
                                                    source={require('../../../images/fd_camera.png')}
                                                />
                                                <Text style={styles.addText}>
                                                    {(9 - this.state.canAddCount) > 0 ? `${9 - this.state.canAddCount}/9` : '添加'}
                                                </Text>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                }
                                {/* 分割线 */}
                                {
                                    ((AssessData.isMyOrder === 1) || (AssessData.isStoreMember === 0)) &&
                                    <View style={{width, backgroundColor: 'white', alignItems: 'center'}}>
                                        <View style={styles.separatorLine}></View>
                                    </View>
                                }
                                {/* 星级评级 */}
                                {
                                    ((AssessData.isMyOrder === 1) || (AssessData.isStoreMember === 0)) &&
                                    <View style={{width, backgroundColor: 'white', paddingBottom: 10}}>
                                        <View style={{paddingLeft: 20, paddingTop: 15, paddingBottom: 10}}>
                                            <Text style={styles.fontsize15}>综合评分</Text>
                                        </View>
                                        <View style={{
                                            flexDirection: 'row', alignItems: 'center',
                                            paddingLeft: 20, paddingRight: 20
                                        }}>
                                            <Text style={styles.assesstext}>商品评分</Text>
                                            <StarRating
                                                initial={5}
                                                containerStyle={{flexDirection: 'row'}}
                                                onChange={rating => {
                                                    this.setState({
                                                        productStar: rating,
                                                    });
                                                }}
                                                config={{
                                                    easing: Easing.inOut(Easing.ease),
                                                    duration: 350,
                                                }}
                                                stagger={80}
                                                maxScale={1.4}
                                                starStyle={{
                                                    width: 30,
                                                    height: 30,
                                                    marginLeft: 5,
                                                    marginRight: 5,
                                                }}
                                            />
                                        </View>
                                        <View style={{
                                            flexDirection: 'row', alignItems: 'center',
                                            paddingLeft: 20, paddingRight: 20
                                        }}>
                                            <Text style={styles.assesstext}>物流配送</Text>
                                            <StarRating
                                                initial={5}
                                                containerStyle={{flexDirection: 'row'}}
                                                onChange={rating => {
                                                    this.setState({
                                                        shippingStar: rating,
                                                    });
                                                }}
                                                config={{
                                                    easing: Easing.inOut(Easing.ease),
                                                    duration: 350,
                                                }}
                                                stagger={80}
                                                maxScale={1.4}
                                                starStyle={{
                                                    width: 30,
                                                    height: 30,
                                                    marginLeft: 5,
                                                    marginRight: 5,
                                                }}
                                            />
                                        </View>
                                        <View style={{
                                            flexDirection: 'row', alignItems: 'center',
                                            paddingLeft: 20, paddingRight: 20
                                        }}>
                                            <Text style={styles.assesstext}>服务态度</Text>
                                            <StarRating
                                                initial={5}
                                                containerStyle={{flexDirection: 'row'}}
                                                onChange={rating => {
                                                    this.setState({
                                                        serviceStar: rating,
                                                    });
                                                }}
                                                config={{
                                                    easing: Easing.inOut(Easing.ease),
                                                    duration: 350,
                                                }}
                                                stagger={80}
                                                maxScale={1.4}
                                                starStyle={{
                                                    width: 30,
                                                    height: 30,
                                                    marginLeft: 5,
                                                    marginRight: 5,
                                                }}
                                            />
                                        </View>
                                    </View>
                                }
                                {/* 买家印象 */}
                                {
                                    ((AssessData.isMyOrder === 1) ||
                                        (AssessData.isStoreMember === 0)) &&
                                    AssessData.impression.length > 0 &&
                                    <View style={styles.buyerContainer}>
                                        <View style={{paddingTop: 15, paddingBottom: 10}}>
                                            <Text style={{fontSize: 15}}>买家印象</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                                            {BuyerItems}
                                        </View>
                                    </View>
                                }
                            </View>
                            {/* 第四部分 提交按钮 */}
                            <View style={[styles.submitContainer, {
                                backgroundColor:
                                    ((AssessData.isMyOrder === 1) ||
                                        (AssessData.isStoreMember === 0)) &&
                                    AssessData.impression.length > 0 ? 'rgb(241,241,241)' : 'white'
                            }]}>
                                <TouchableOpacity
                                    style={styles.submitBtn}
                                    onPress={() => {
                                        this.submitAssess();
                                    }}
                                >
                                    <Text style={styles.submitTitle}>发表评价</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                        {
                            // 图片放大视图
                            this.state.photosData.length > 0 &&
                            <Modal visible={this.state.showImageViewer} transparent={true}>
                                <ImageViewer
                                    imageUrls={
                                        this.state.photosData.map((phtotoItem) => {
                                            const url = phtotoItem.uri;
                                            return ({url});
                                        })
                                    }
                                    index={this.state.imageIndex}
                                    onClick={() => this.setState({showImageViewer: false})}
                                />
                            </Modal>
                        }
                        {
                            <Modal
                                // 设置Modal组件的呈现方式
                                animationType='slide'
                                // 它决定 Modal 组件是否是透明的
                                transparent={true}
                                // 它决定 Modal 组件何时显示、何时隐藏
                                visible={this.state.popViewShow}
                                // 当 Modal组件在屏幕上完成显示后，这个回调函数将被执行
                                onShow={() => Log('onShow')}
                                // 这是 Android 平台独有的回调函数类型的属性
                                // 开发者必须要写一个函数来处理当 Modal 显示在界面时且android物理返回键被按下时的业务逻辑
                                onRequestClose={() => Log('RequestClose')}
                            >
                                <View style={styles.backGroundView}>
                                    <TouchableOpacity
                                        style={styles.missClickView}
                                        activeOpacity={1} onPress={() => this.dismissView()}>
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
                                            <View style={{width: '100%', height: 1, backgroundColor: 'rgb(200,202,205)'}}></View>
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
                                            <View style={{width: '100%', height: 1, backgroundColor: 'rgb(200,202,205)'}}></View>
                                            <View style={{height: selectMenuHeight, justifyContent: 'center', borderRadius: 8}}>
                                                <View style={{alignItems: 'center', padding: 10}}>
                                                    <Text style={{fontSize: 18, color: 'rgb(12,96,254)'}}>从相册选取</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    {/* 取消按钮按钮 */}
                                    <TouchableOpacity
                                        style={styles.bottomCancleBtn}
                                        onPress={() => {
                                            this.dismissView();
                                        }}
                                    >
                                        <View style={{width: width * 0.95, height: selectMenuHeight, justifyContent: 'center', borderRadius: 8}}>
                                            <View style={{alignItems: 'center', padding: 10}}>
                                                <Text style={{fontSize: 18, color: 'rgb(12,96,254)'}}>取消</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Modal>
                        }
                    </View>
                }
            </View>
        );
    }

    private dismissView() {
        this.setState({
            popViewShow: false,
        });
    }

    private popView() {
        this.setState({
            popViewShow: true,
        });
    }

    // 从相机拍照
    private handleTakePicturePhoto = async () => {
        // 还能添加的数量
        if (this.state.canAddCount <= 0) {
            Toast.info('最多只能添加9张图片', 2);
            return;
        }
        try {
            const options = {
                isCrop: Platform.OS == 'ios' ? true : false,
                quality: 80,
                CropW: width,
                CropH: height,
                enableBase64: true,
            };

            if (Platform.OS === 'android') {
                NativeModules.PhotoModule.openCamera(options, (err, pictureItems) => {
                    this.getResultFromCamera(err, pictureItems);
                });
            } else {
                SYImagePicker.openCamera(options, (err, pictureItems) => {
                    this.getResultFromCamera(err, pictureItems);
                });
            }

        } catch (err) {
            // 取消选择，err.message为"取消"
            Toast.info(err.message, 2);
        }
    };
    // 拍照回调结果
    private getResultFromCamera = async (err, pictureItems) => {
        if (err) {
            // 取消选择
            Toast.info('取消拍照', 2);
            return;
        }
        // 拼装图片数组
        const TempPhotoData = [...this.state.photosData, ...pictureItems];
        this.setState({
            photosData: TempPhotoData.concat(),
            canAddCount: 9 - TempPhotoData.length,
        });
    };
    // 从相册选择图片
    private handleSelectPhoto = async () => {
        // 还能添加的数量
        if (this.state.canAddCount <= 0) {
            Toast.info('最多只能添加9张图片', 2);
            return;
        }
        try {
            const options = {
                imageCount: this.state.canAddCount,
                isCamera: false,
                isCrop: Platform.OS == 'ios' ? true : false,
                quality: 80,
                CropW: width,
                CropH: height,
                isGif: false,
                enableBase64: true,
            };
            if (Platform.OS === 'android') {
                NativeModules.PhotoModule.asyncShowImagePicker(options)
                    .then(result => {
                        this.getResultFromPhoto(result);
                    })
                    .catch((errorCode, domain, error) => {
                        // Log('失败');
                    });
            } else {
                const photos = await SYImagePicker.asyncShowImagePicker(options);
                this.getResultFromPhoto(photos);
            }

        } catch (err) {
            // 取消选择，err.message为"取消"
            Toast.info(err.message, 2);

        }
    };
    // 相册回调结果
    private getResultFromPhoto = async (photos) => {
        // 拼装图片数组
        const TempPhotoData = [...this.state.photosData, ...photos];
        this.setState({
            photosData: TempPhotoData.concat(),
            canAddCount: 9 - TempPhotoData.length,
        });
    };

    // 提交评价前,检测评价字数是否符合要求
    private submitAssess = () => {
        if (this.state.textareaText.length < 2) {
            Toast.info('请输入2～500字的评价！', 2);
        } else {
            // 先校验敏感词
            this.checkSensitiveWords();
        }
    };

    // 校验敏感词
    private checkSensitiveWords = async () => {
        try {
            const isCanSubit = await getAppJSON(Config.CHECKSENSITIVEWORDS, {
                checkword: encodeURI(this.state.textareaText),
                noLoading: true,
            });
            if (isCanSubit) {
                // 是否有图片
                if (this.state.photosData.length > 0) {
                    // 上传图片完成后,在上传图片完成后的回调里提交评价
                    this.postPhoto();
                } else {
                    // 没图片直接提交评价
                    this.submitAssessPost([]);
                }
            } else {
                Toast.fail('您的评论里面包含敏感词！', 2);
            }
        } catch (err) {
            Log(err);
        }
    };

    // 提交评价
    private submitAssessPost = async (fileIds) => {
        try {
            const {params} = this.props.navigation.state;
            const fullUrl = `${Config.SUBMITCOMMENT}?cOrderSn=${params.cOrderSn}&commentContent=${encodeURI(this.state.textareaText)}` +
                `&fileIds=${fileIds.join(',')}&impressions=${this.state.selectedBuyerItemData.join(',')}` +
                `&productStar=${this.state.productStar}&serviceStar=${this.state.serviceStar}&shippingStar=${this.state.shippingStar}&star=${this.state.star}`;
            console.log('zhaoxincheng>>>>fullUrl', fullUrl);
            // 在这里关闭发表评价按钮可点击功能
            const json = await postAppJSON(fullUrl, {});
            console.log('zhaoxincheng发表评价****', json);
            if (json.success && json.data) {
                // 在这里开启发表评价按钮可点击功能
                Toast.success('评价成功', 2);
                // 刷新订单详情界面
                const {callBack} = this.props.navigation.state.params;
                if (callBack) {
                    // 刷新订单详情界面
                    callBack();
                }
                if (Platform.OS === 'ios') {
                    // 评价成功,清除图片缓存
                    SYImagePicker.deleteCache();
                } else {
                    // 评价成功,清除图片缓存
                    NativeModules.PhotoModule.deleteCache();
                }
                // 跳转到评价成功界面
                this.props.navigation.navigate('AssessSuccess', {
                    cOrderSn: params.cOrderSn,
                    // 前一个界面的key
                    routeKey: this.props.navigation.state.key,
                });
            } else {
                // 在这里开启发表评价按钮可点击功能
                Toast.fail(json.message, 2);
            }
        } catch (err) {
            // 在这里开启发表评价按钮可点击功能
            Log(err);
        }
    };

    // 上传图片
    private postPhoto = async () => {
        const url = `${Config.API_URL}${Config.UPLOAD_ASSESS_IMG_NEW}`;
        // Log('zhaoxincheng>>>>', url);
        const userToken = await global.getItem('userToken');
        const imagePaths = [];
        if (this.state.photosData.length > 0) {
            this.state.photosData.forEach((phtotoItem, index) => {
                if (phtotoItem) {
                    const uri = phtotoItem.uri;
                    imagePaths.push(uri);
                }
            });
            const command = [url, userToken, 0, 0, 50, imagePaths];
            Toast.loading('正在上传图片...');
            NativeModules.PhotoModule.uploadImg(command)
                .then(result => {
                    // Log('图片上传成功');
                    // Log('zhaoxincheng>>>result', result.fileIds);
                    Toast.hide();
                    // 提交评价
                    this.submitAssessPost(result.fileIds);
                })
                .catch((errorCode, domain, error) => {
                    // Log('图片上传失败');
                    Toast.hide();
                    Toast.fail('图片上传失败', 2);
                });
        }
    };

    // 获取数据
    private getData = async () => {
        try {
            const {params} = this.props.navigation.state;
            const json = await getAppJSON(Config.COMMENTPAGE, {
                cOrderSn: params.cOrderSn,
            });
            if (json.success) {
                const AssessData = json.data;
                if (!(AssessData.isMyOrder === 1) && !(AssessData.isStoreMember === 0)) {
                    //不是自己的订单并且是微店主
                    this.setState({placeholderText: '您写下购物体验后，收货人会自动收到邀评短信，可进行详细的图文评价！', data: json.data})
                } else {
                    this.setState({placeholderText: '您可以写下您的购物体验，供其他小伙伴参考哦！', data: json.data})
                }
            } else {
                Toast.fail(json.message, 1);
            }
        } catch (err) {
            Log(err);
        }
    }
}

const styles = EStyleSheet.create({
    allAssess: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: 'white',
    },
    selectPhotoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width,
        paddingLeft: 20,
        paddingTop: 10,
        backgroundColor: 'white',
    },
    selectPhoto: {
        justifyContent: 'center',
        alignItems: 'center',
        width: photoWAndH,
        height: photoWAndH,
        marginRight: 10,
        marginBottom: 10,
        borderStyle: 'dashed',
        borderColor: 'rgb(234,234,234)',
        borderWidth: 1,
    },
    photoContainer: {
        paddingRight: 10,
        paddingBottom: 10,
    },
    separatorLine: {
        height: 1,
        width: 0.9 * width,
        backgroundColor: 'rgb(234,234,234)',
    },
    buyerContainer: {
        paddingLeft: 20,
        paddingRight: 20,
        width,
        backgroundColor: 'white',
        marginTop: 8,
    },
    BuyerItemContainer: {
        borderWidth: 1,
        borderRadius: 3,
        paddingLeft: 20,
        paddingRight: 20,
        marginRight: 8,
        marginBottom: 15,
    },
    submitContainer: {
        width,
        height: '90rem',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(241,241,241)',
    },
    submitBtn: {
        backgroundColor: '#2979ff',
        borderRadius: 25,
        width: 0.9 * width,
        alignItems: 'center',
    },
    submitTitle: {
        color: 'white',
        fontSize: '14rem',
        marginTop: 12,
        marginBottom: 12,
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
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: 'transparent',
    },
    popContainer: {
        position: 'absolute',
        bottom: isiPhoneX ? (34 + 10 + selectMenuHeight + 10) : (10 + selectMenuHeight + 10),
        left: 0.025 * width,
        width: width * 0.95,
        backgroundColor: 'rgb(237,239,240)',
        borderRadius: 8,
    },
    bottomCancleBtn: {
        position: 'absolute',
        width: width * 0.95,
        left: 0.025 * width,
        bottom: isiPhoneX ? (34 + 10) : 10,
        marginTop: 10,
        height: selectMenuHeight,
        borderRadius: 8,
        backgroundColor: 'white',
    },
    photoStyle: {
        width: '20rem',
        height: '20rem',
    },
    addText: {
        color: '#999',
        fontSize: '10rem',
        lineHeight: '12rem',
    },
    productImg: {
        width: '84rem',
        height: '84rem',
    },
    allAssessTitle: {
        fontSize: '15rem',
        color: 'black',
    },
    selectedImg: {
        width: '18rem',
        height: '18rem',
    },
    selectedText: {
        marginLeft: 5,
        fontSize: '14rem',
    },
    textAreaItem: {
        fontSize: '13rem',
        marginLeft: 0,
        width: '100%',
        backgroundColor: '#f4f4f4',
        paddingBottom: 20,
    },
    fontsize15: {
        fontSize: '15rem',
    },
    assesstext: {
        fontSize: '14rem',
        marginRight: 10,
    },
});

export default OrderAssess;
