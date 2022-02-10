import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    InteractionManager,
    Modal,
} from 'react-native';
import * as React from 'react';
import { Toast } from 'antd-mobile';
import { INavigation } from '../../../interface/index';
import {postAppJSON, getAppJSON} from '../../../netWork';
import Config from 'react-native-config';
import ImageViewer from 'react-native-image-zoom-viewer';
import { timestampToTime, isiPhoneX } from '../../../utils';
import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
import EStyleSheet from 'react-native-extended-stylesheet';
import { NavBar } from '../../../components/NavBar';
import ExpandText from '../../../components/ExpandText';

interface ILookAssessProps {
    orderId: string;
    cOrderSn: string;
}

interface ILookAssessState {
    assessList: any;
    stateList: any;
    timeIsOrNo: boolean;
    imageArr: any[];
    showImageViewer: boolean;
    imageIndex: number;
}

class LookAssess extends React.Component<INavigation & ILookAssessProps, ILookAssessState> {

    public constructor(props) {
        super(props);

        this.state = {
            assessList: null,
            stateList: null,
            timeIsOrNo: false,
            imageArr: [],
            showImageViewer: false,
            imageIndex: 0,
        };
    }

    public componentDidMount() {

        // this.props.navigation.setParams({headerRight: this.chaseAssessBtn()});

        // 可以让导航切换页面动画完成后再执行请求数据的操作
        // InteractionManager.runAfterInteractions( () => {
        //     // 请求数据
        //     this.getData();
        // });
        this.getData();
    }

    public render(): JSX.Element {
        return (
            <View style={{backgroundColor: 'rgb(241,241,241)', flex: 1}}>
                <NavBar title={'查看评价'} />
                {
                    this.state.assessList !== null &&
                <View style={{backgroundColor: 'rgb(241,241,241)', flex: 1}}>
                    <ScrollView>
                            <View style={{backgroundColor: 'white', padding: 10, marginBottom: 10}}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10}}>
                                    {
                                        this.state.assessList.star === 5 &&
                                        <Text style={styles.AssessTextStyle}>好评</Text>
                                    }
                                    {
                                        this.state.assessList.star === 3 &&
                                        <Text style={styles.AssessTextStyle}>中评</Text>
                                    }
                                    {
                                        this.state.assessList.star === 1 &&
                                        <Text style={styles.AssessTextStyle}>差评</Text>
                                    }
                                    <Text style={styles.titleTime}>
                                        {timestampToTime(this.state.assessList.createTime)}
                                    </Text>
                                </View>
                                <View style={{marginTop: 10, paddingLeft: 10}}>
                                    <ExpandText style={styles.content} titleStyle={styles.assessContent} title={this.state.assessList.commentContent} />
                                </View>
                                <View style={styles.selectPhotoContainer}>
                                    {
                                        this.state.assessList !== null &&
                                        this.state.assessList.commentPics.length > 0 &&
                                        this.AssessView(this.state.assessList.commentPics)
                                    }
                                </View>
                            </View>
                            {// 用户使用心得模块
                                this.state.stateList.isMyOrder === 0 &&
                                this.state.stateList.isUserCommented === 1 &&
                                <View style={{backgroundColor: 'white', padding: 10, marginBottom: 10}}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10}}>
                                            <Text style={styles.titleStyle}>用户使用心得</Text>
                                        <Text style={styles.contentTextSty}>
                                            {this.state.assessList.userCommentCreateTime.split('.')[0]}
                                            {/* {timestampToTime(this.state.assessList.userCommentCreateTime)} */}
                                        </Text>
                                    </View>
                                    <View style={{marginTop: 10, paddingLeft: 10}}>
                                        <ExpandText style={styles.content}
                                                    titleStyle={styles.assessContent}
                                                    title={this.state.assessList.userCommentContent} />
                                    </View>
                                    <View style={styles.selectPhotoContainer}>
                                        {
                                            this.state.assessList !== null &&
                                            this.state.assessList.userCommentPics.length > 0 &&
                                            this.AssessView(this.state.assessList.userCommentPics)
                                        }
                                    </View>
                                </View>
                            }
                            {// 追加评论
                                this.state.stateList.isExperienced === 1 &&
                                <View style={{backgroundColor: 'white', padding: 10, marginBottom: 10}}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10}}>
                                            <Text style={styles.titleStyle}>追加评论</Text>
                                        <Text style={styles.contentTextSty}>
                                            {timestampToTime(this.state.assessList.experienceTime)}
                                        </Text>
                                    </View>
                                    <View style={{marginTop: 10, paddingLeft: 10}}>
                                    <ExpandText style={styles.content}
                                                titleStyle={styles.assessContent}
                                                title={this.state.assessList.experienceContent} />
                                    </View>
                                    <View style={styles.selectPhotoContainer}>
                                        {
                                            this.state.assessList !== null &&
                                            this.state.assessList.experiencePics.length > 0 &&
                                            this.AssessView(this.state.assessList.experiencePics)
                                        }
                                    </View>
                                </View>
                            }
                            {// 小海回复
                                this.state.assessList !== null &&
                                this.state.assessList.serviceCommentReplies.length > 0 &&
                                AssessItem('小海回复', this.state.assessList.serviceCommentReplies)
                            }
                            {// 商家回复
                                this.state.assessList !== null &&
                                this.state.assessList.storeCommentReplies.length > 0 &&
                                AssessItem('商家回复', this.state.assessList.storeCommentReplies)
                            }
                    </ScrollView>
                    {
                        this.state.stateList.isUserCommented === 0 &&
                        this.state.stateList.isMyOrder === 0 &&
                        this.state.stateList.isCanExperience === 1 &&
                        this.state.timeIsOrNo &&
                        this.state.stateList.isStoreMember === 1 &&
                            <View style={{backgroundColor: 'white', flexDirection: 'row', paddingBottom: isiPhoneX ? 34 : 0}}>
                                    <TouchableOpacity
                                            style={{flex: 1, height: 48, justifyContent: 'center', alignItems: 'center'}}
                                            activeOpacity = {0.8}
                                            onPress={() => {
                                                this.shcseAssessClick();
                                            }}
                                        >
                                        <View style={{flex: 1, height: 48, justifyContent: 'center', alignItems: 'center'}}>
                                            <Text style={{color: '#333', fontSize: 14}}>追加评价</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                            style={{backgroundColor: '#2979FF', flex: 1, height: 48, justifyContent: 'center', alignItems: 'center'}}
                                            activeOpacity = {0.8}
                                            onPress={() => {
                                                // 邀请评价就是跳转到评价成功界面
                                                this.props.navigation.navigate('AssessSuccess', {
                                                    cOrderSn: this.props.navigation.state.params.cOrderSn,
                                                    title: '邀请评价',
                                                    // //  前一个界面的key
                                                    // routeKey: this.props.navigation.state.key,
                                                });
                                            }}
                                        >
                                        <View style={{backgroundColor: '#2979FF', flex: 1, height: 48, justifyContent: 'center', alignItems: 'center'}}>
                                            <Text style={{color: 'white', fontSize: 14}}>邀请评价</Text>
                                        </View>
                                    </TouchableOpacity>

                            </View>
                    }
                    {
                        this.state.stateList.isCanExperience === 1 &&
                        (this.state.stateList.isUserCommented !== 0 ||
                            this.state.stateList.isMyOrder !== 0 ||
                            !this.state.timeIsOrNo ||
                            this.state.stateList.isStoreMember !== 1) &&
                        <TouchableOpacity
                                style={styles.addAeeseeBtn}
                                activeOpacity = {0.8}
                                onPress={() => {
                                    this.shcseAssessClick();
                                }}
                            >
                                <Text style={{fontSize: 17, color: 'white'}}>追加评价</Text>
                        </TouchableOpacity>
                    }
                    {
                        this.state.stateList.isCanExperience !== 1 &&
                        this.state.stateList.isUserCommented === 0 &&
                        this.state.stateList.isMyOrder === 0 &&
                        this.state.timeIsOrNo &&
                        this.state.stateList.isStoreMember === 1 &&
                        <TouchableOpacity
                                style={styles.addAeeseeBtn}
                                activeOpacity = {0.8}
                                onPress={() => {
                                    // 邀请评价就是跳转到评价成功界面
                                    this.props.navigation.navigate('AssessSuccess', {
                                        cOrderSn: this.props.navigation.state.params.cOrderSn,
                                        title: '邀请评价',
                                        // //  前一个界面的key
                                        // routeKey: this.props.navigation.state.key,
                                    });
                                }}
                            >
                                <Text style={{fontSize: 17, color: 'white'}}>邀请评价</Text>
                        </TouchableOpacity>
                    }
                    {
                        this.state.imageArr.length > 0 &&
                        <Modal visible={this.state.showImageViewer} transparent={true}>
                            <ImageViewer
                                imageUrls={
                                    this.state.imageArr.map((item) => {
                                        const url = item.picUrl;
                                        return ({ url });
                                    })
                                }
                                index={this.state.imageIndex}
                                onClick={() => this.setState({ showImageViewer: false })}
                            />
                        </Modal>
                    }
                    </View>
                }
             </View>
        );
    }

    // private chaseAssessBtn = () => (
    //     <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginRight: 10}}>
    //         <Text
    //             style={{fontSize: 14, color: 'rgb(146,146,146)'}}
    //             onPress={() => {
    //                 this.shcseAssessClick();
    //             }}
    //             >追加评价
    //         </Text>
    //             </View>
    // )

    private shcseAssessClick = () => {
        const { params } = this.props.navigation.state;
        // 追加评价
        const isMeorder = 1;
        this.props.navigation.navigate('ChaseAssess', {
            cOrderSn: params.cOrderSn,
            isMeorder,
            callBack: () => {
                this.getData();
            },
        });
    }

    private AssessView = (picData) => {
        // 照片
        const photoCard = ({ item, index }) => {
            return (
                <View  style={{width: 60, height: 60, marginRight: 10, marginBottom: 12, borderWidth: 1, borderColor: 'rgb(241,241,241)'}}  key = {index}>
                    <TouchableOpacity
                        style={styles.photoContainer}
                        onPress = {() => {
                                this.setState({ imageIndex: index, showImageViewer: true, imageArr: picData.concat() });
                        }}>
                        <Image
                            style={{width: 60, height: 60}}
                            source = {{uri: item.picUrl}}
                        />
                    </TouchableOpacity>
                </View>
            );
        };
        const Photos = [];
        picData.forEach( ( item, index ) => {
                if (item) {
                    const Card = photoCard({item, index});
                    Photos.push(Card);
                }
        });
        return Photos;
    }

    // 获取数据
    private  getData = async () => {
        try {
            // 获取订单详情数据 navigation.state.params.
            // /v3/h5/sg/comment/getComment.json
            const { params } = this.props.navigation.state;
            const json = await getAppJSON(Config.GETCOMMENT, {
                cOrderSn: params.cOrderSn,
            });
            console.log('zhaoxincheng****>>>>>>', json);
            if (json.success) {
                this.setState({
                    assessList: json.data.comment,
                    stateList: json.data,
                    timeIsOrNo: ((Date.parse(new Date()) - json.data.comment.createTime) / 1000 / 60 / 60 / 24) < 90,
                });
            } else {
                Toast.fail(json.message, 1);
            }
        } catch (err) {
            Log(err);
        }
    }
}

const AssessItem = (title, data) => {
        const xiaoHaiPhotos = [];
        data.forEach( ( item, index ) => {
            if (item) {
                const itemContainer = (
                    <View style={{backgroundColor: 'white', padding: 10, marginBottom: 10}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10}}>
                                <Text style={styles.titleStyle}>{title}</Text>
                            <Text style={styles.contentTextSty}>
                                {timestampToTime(item.createTime)}
                            </Text>
                        </View>
                        <View style={{marginTop: 10, paddingLeft: 10}}>
                            <ExpandText style={styles.content}
                                        titleStyle={styles.assessContent}
                                        title={item.replyContent} />
                            </View>
                    </View>
                );
                xiaoHaiPhotos.push(itemContainer);
            }
        });
        return xiaoHaiPhotos;
};

const styles = EStyleSheet.create({
    addAeeseeBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: isiPhoneX ? 54 : 20,
        height: '44rem',
        marginLeft: 16,
        marginRight: 16,
        backgroundColor: '#2979FF',
        borderRadius: 10,
    },
    selectPhotoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width,
        paddingLeft: 10,
        paddingTop: 10,
        backgroundColor: 'white',
    },
    photoContainer: {
        width: '50rem',
        height: '50rem',
    },
    openTextSty: {
        color: 'blue',
        fontSize: '14rem',
        marginTop: 5,
    },
    AssessTextStyle: {
        fontSize: '15rem',
        color: 'rgb(243,44,16)',
      },
    titleStyle: {
        fontSize: '15rem',
        color: 'rgb(243,44,16)',
    },
    titleTime: {
        fontSize: '13rem',
        color: 'rgb(128,128,128)',
    },
    content: {
        marginTop: 0,
        marginBottom: -4,
    },
    assessContent: {
        fontSize: '17rem',
        color: 'black',
    },
    contentTextSty: {
        fontSize: '13rem',
        color: 'rgb(128,128,128)',
    },
});

export default LookAssess;
