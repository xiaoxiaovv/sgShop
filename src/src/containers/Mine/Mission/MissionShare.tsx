import * as React from 'react';
import { Tabs } from 'antd-mobile';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
    Modal,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native';
import { getAppJSON } from '../../../netWork';
import { connect, createAction } from '../../../utils';
import { ICustomContain } from '../../../interface';
import EStyleSheet from 'react-native-extended-stylesheet';
import Button from 'rn-custom-btn1';


import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;


interface IMissionShare {
    missionList: any;
    ajaxDone: boolean;
}
let missionListener;
const missionAm = require('../../../images/ic_am.png');
const missionPm = require('../../../images/ic_pm.png');
const missionShare = require('../../../images/ic_share.png');
const mission61 = require('../../../images/ic_61.png');
const missionGoldFight = require('../../../images/gold_fight.png');
const missionSharePic = require('../../../images/share_pic.png');
const missionME = require('../../../images/military_exploits.png');
const missionImg = [missionAm, missionAm, missionPm, missionShare, mission61, missionGoldFight, missionSharePic, missionME];
// 任务列表
const MissionList = ({ missionImgUrl, name, content, awardNum, isFinished, taskType, userTaskStatus, id, onClick }) => {

    return (
        <View>
            <TouchableOpacity style={styles.missionBox} activeOpacity={1} onPress={() => onClick(id, taskType)}>
                <View style={{ width: 72, height: 72, justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={styles.missionPic} source={missionImgUrl} />
                </View>
                <View>
                    <Text style={taskType === '5' ? styles.missionTitleAnother : styles.missionTitle} numberOfLines={1}>{name}</Text>
                    <Text style={styles.missionContent} numberOfLines={1}>{content}</Text>
                </View>
                <View style={{ width: 143, flexDirection: 'row' }}>
                    <View style={{ width: 78, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={!isFinished ? styles.unFinishedAwards : styles.finishedAwards}>+{awardNum}金币</Text>
                    </View>
                    {(!isFinished && taskType !== '5') &&
                    <View style={{ width: 65, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 53, height: 26, borderWidth: 1, borderRadius: 4, borderColor: '#f56767', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#f56767' }}>分享</Text>
                        </View>
                    </View>}
                    {(isFinished && taskType !== '5') &&
                    <View style={{ width: 65, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 53, height: 26, borderWidth: 1, borderRadius: 4, borderColor: '#6f6f6f', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#6f6f6f' }}>已完成</Text>
                        </View>
                    </View>}
                    {(!isFinished && taskType === '5' && userTaskStatus === undefined) &&
                    <View style={{ width: 65, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 53, height: 26, borderWidth: 1, borderRadius: 4, borderColor: 'blue', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'blue' }}>接招</Text>
                        </View>
                    </View>}

                    {(taskType === '5' && userTaskStatus === -10) &&
                    <View style={{ width: 65, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 53, height: 26, borderWidth: 1, borderRadius: 4, borderColor: 'blue', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'blue' }}>失败</Text>
                        </View>
                    </View>}
                    {(taskType === '5' && userTaskStatus === 20) &&
                    <View style={{ width: 65, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 53, height: 26, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'blue' }}>胜利</Text>
                        </View>
                    </View>}

                </View>
            </TouchableOpacity>
        </View>
    );
};
class MissionShare extends React.Component<ICustomContain> {
    private static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;

        return {
            title: '任务分享',
            headerTitleStyle: {fontSize: 18, flex: 1, textAlign: 'center', alignSelf: 'center'},
            headerRight: params.headerRight ? params.headerRight : <View></View>,
            headerLeft: (<Button
                style={{ width: 25, height: 25}}
                imageStyle={{ width: 25, height: 25, resizeMode: 'contain' }}
                image={require('../../../images/left.png')}
                onPress= { params.handleGoBack ? () => params.handleGoBack() : () => { navigation.goBack(); }}
            />),
        };
    }

    public state: IMissionShare;
    constructor(props) {
        super(props);
        this.state = {
            missionList: [],
            ajaxDone: false,
        };
        this.getMissionList = this.getMissionList.bind(this);
    }
    public async componentWillMount() {
        this.getMissionList(0, 100);
    }
    public componentDidMount() {
        missionListener = DeviceEventEmitter.addListener('missionShareSuccess', (e) => {
            this.getMissionList(0, 100);
        });
    }
    public componentWillUnmount() {
        if (missionListener) {
            missionListener.remove();
        }
        // 当前界面pop出栈,刷新前一个界面
        const { callBack } = this.props.navigation.state.params;
        if (callBack) {
            // 刷新我的界面
            callBack();
        }
    }
    public render(): JSX.Element {
        return (
            <View style={styles.container}>
                <ScrollView style={{ flex: 1 }}
                            bounces={false}>
                    {this.state.ajaxDone && this.state.missionList.map((item, index) => {
                        return [
                            <MissionList
                                missionImgUrl={missionImg[item.taskType]}
                                name={item.name}
                                content={item.content}
                                awardNum={item.taskAwards[0].awardNum}
                                isFinished={item.isFinished}
                                taskType={item.taskType}
                                userTaskStatus={item.userTaskStatus}
                                id={item.id}
                                onClick={this.goNext}>
                            </MissionList>,
                        ];
                    })}
                </ScrollView>
                <View style={styles.historyMission}>
                    <TouchableOpacity style={{ width: '93%', height: 40 }} onPress={() => this.props.navigation.navigate('HistoryMission')}>
                        <View style={styles.historyMissionItem}>
                            <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.5)' }}>历史任务</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    private getMissionList = async (index, page) => {
        const params = {
            startIndex: index,
            pageSize: page,
            t: new Date().getTime(),
        };
        // const response = await getAppJSON(Config.SHARE_TASK);
        const response = await getAppJSON('v3/mstore/sg/task/findTaskList.html', params);
        const resultMissionList = this.sortMission(response.data.rows);
        // let a = {beginTime:1525780896000,configData:"{}",content:"商品下单",createTime:1525781013000,createUser:"160",createUserName:"liurui",
        //     cycleBeginTime:1525780896000,cycleEndTime:1527768100000,cycleType:0,displayOrder:0,endTime:1527768100000,
        //     filterExpr:"#levelOrder>=2 and #sourceId=='SHUNGUANG' and #isStore==false and #type=='1'",id:4212,isFinished:false,isStore:false,
        //     name:"测试士兵突击",needTake:1,priority:10,shareTasks:"ALL",sourceId:"SHUNGUANG",taskStatus:1,taskType:"4",userTaskAwards:[],
        //     userTaskStatus:0, taskAwards:[{awardContent:"完成[分享商品]任务奖励",awardName:"完成[分享商品]任务奖励",awardNum:1,awardType:0,taskId:4194,}]};
        // let b = {beginTime:1525780896000,configData:"{}",content:"商品下单",createTime:1525781013000,createUser:"160",createUserName:"liurui",
        // cycleBeginTime:1525780896000,cycleEndTime:1527768100000,cycleType:0,displayOrder:0,endTime:1527768100000,
        // filterExpr:"#levelOrder>=2 and #sourceId=='SHUNGUANG' and #isStore==false and #type=='1'",id:4212,isFinished:false,isStore:false,
        // name:"测试士兵突击",needTake:1,priority:10,shareTasks:"ALL",sourceId:"SHUNGUANG",taskStatus:1,taskType:"6",userTaskAwards:[],
        // userTaskStatus:0,taskAwards:[{awardContent:"完成[分享商品]任务奖励",awardName:"完成[分享商品]任务奖励",awardNum:1,awardType:0,taskId:4194,}]};
        // let c = {beginTime:1525780896000,configData:"{}",content:"商品下单",createTime:1525781013000,createUser:"160",createUserName:"liurui",
        // cycleBeginTime:1525780896000,cycleEndTime:1527768100000,cycleType:0,displayOrder:0,endTime:1527768100000,
        // filterExpr:"#levelOrder>=2 and #sourceId=='SHUNGUANG' and #isStore==false and #type=='1'",id:4212,isFinished:false,isStore:false,
        // name:"测试士兵突击",needTake:1,priority:10,shareTasks:"ALL",sourceId:"SHUNGUANG",taskStatus:1,taskType:"7",userTaskAwards:[],
        // userTaskStatus:0,taskAwards:[{awardContent:"完成[分享商品]任务奖励",awardName:"完成[分享商品]任务奖励",awardNum:1,awardType:0,taskId:4194,}]};
        // resultMissionList.push(a);
        // resultMissionList.push(b);
        // resultMissionList.push(c);
        // console.log('===1:', response);
        // console.log('===12:', resultMissionList);
        this.setState({ missionList: resultMissionList, ajaxDone: false }, ()=>{
            this.setState({ ajaxDone: true });
        });
        // this.setState({missionList: testArr});
    }
    // 任务排序
    private sortMission = (missionArr) => {
        const tempArr = []; // 临时存放士兵突击意外的任务
        const tempArrPlus = []; // 存放 士兵突击
        for (let length = missionArr.length, i = length - 1; i >= 0; i--) {
            if (missionArr[i].taskType === 5) {
                tempArrPlus.push(missionArr[i]);
            } else if (missionArr[i].isFinished) {
                tempArr.push(missionArr[i]);
            } else {
                tempArr.unshift(missionArr[i]);
            }
        }
        return tempArrPlus.concat(tempArr);
    }
    private goNext = (id, type) => {
        if (type === '7') {
            // 去会员竞争页面
            const memberId = dvaStore.getState().users.mid;
            this.props.navigation.navigate('CustomWebView', { customurl: `${URL.H5_HOST}competition//${type}/${memberId}`, flag: true, headerTitle: '会员竞争力' });
        } else {
            this.props.navigation.navigate('MissionDetail', { taskId: id, taskType: type});
        }
    }
}
const styles = EStyleSheet.create({
    container: {
        width: deviceWidth,
        flex: 1,
        backgroundColor: '#f4f4f4',
        paddingBottom: 60,
    },
    missionBox: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 72,
        backgroundColor: '#ffffff',
        marginTop: 12,
        marginLeft: 8,
        marginRight: 8,
    },
    missionPic: {
        width: 32,
        height: 32,
    },
    missionTitle: {
        width: deviceWidth - 72 - 143 - 16,
        fontSize: 16,
        color: 'rgb(3, 3, 3)',
        marginBottom: 4,
    },
    missionTitleAnother: {
        width: deviceWidth - 72 - 143 - 16,
        fontSize: 16,
        color: 'blue',
        marginBottom: 4,
    },
    missionContent: {
        width: deviceWidth - 72 - 143 - 16,
        fontSize: 14,
        color: 'rgba(0,0,0,0.54)',
    },
    awards: {
        fontSize: 12,
    },
    finishedAwards: {
        color: '#6F6F6F',
    },
    unFinishedAwards: {
        color: '#f56767',
    },
    historyMission: {
        width: deviceWidth,
        height: 60,
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: '#f4f4f4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    historyMissionItem: {
        width: '100%',
        height: 40,
        backgroundColor: '#f8f8f8',
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#d2d2d2',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default MissionShare;
