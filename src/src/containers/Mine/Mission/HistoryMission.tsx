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
    TouchableOpacity
} from 'react-native';
import { getAppJSON } from '../../../netWork';
import { connect, createAction } from '../../../utils';
import { ICustomContain } from '../../../interface';
import EStyleSheet from 'react-native-extended-stylesheet';
import Config from 'react-native-config';

import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

interface IHistoryMission {
    historyMissionList: any;
    hasHistoryMission: boolean;
}
const missionAm = require('../../../images/ic_am.png');
const missionPm = require('../../../images/ic_pm.png');
const missionShare = require('../../../images/ic_share.png');
const mission61 = require('../../../images/ic_61.png');
const missionGoldFight = require('../../../images/gold_fight.png');
const missionSharePic = require('../../../images/share_pic.png');
const missionME = require('../../../images/military_exploits.png');
const missionImg = ['', missionAm, missionPm, missionShare, mission61, missionGoldFight, missionSharePic, missionME];

// 历史任务列表
const MissionList = ({ dateTime, missionArr }) => {

    return (
        <View>
            <View>
                <Text style={styles.HistoryMissionDate}>{dateTime}</Text>
            </View>
            {missionArr.map((item, index) => {
                return [
                    <TouchableOpacity style={styles.missionBox} activeOpacity={1}>
                        <View style={{ width: 72, height: 72, justifyContent: 'center', alignItems: 'center' }}>
                            <Image style={styles.missionPic} source={missionImg[item.taskType]} />
                        </View>
                        <View>
                            <Text style={styles.missionTitle} numberOfLines={1}>{item.name}</Text>
                            <Text style={styles.missionContent} numberOfLines={1}>{item.content}</Text>
                        </View>
                        <View style={{ width: 143, flexDirection: 'row' }}>
                            <View style={{ width: 78, justifyContent: 'center', alignItems: 'center' }}>
                                {item.userTaskStatus !== -10 && <Text style={styles.unFinishedAwards}>+{item.userTaskAwards[0].awardNum}金币</Text>}
                                {item.userTaskStatus === -10 && <Text style={styles.unFinishedAwards}>失败</Text>}
                            </View>

                        </View>
                    </TouchableOpacity>,
                ];
            })
            }
        </View>
    );
};

class HistoryMission extends React.Component<ICustomContain> {
    public state: IHistoryMission;
    constructor(props) {
        super(props);
        this.state = {
            historyMissionList: {},
            hasHistoryMission: false,
        };
    }
    public componentWillMount() {
        this.getHistoryMission();
    }
    public render(): JSX.Element {
        return (
            <ScrollView style={styles.container}>
                {this.missionRender(this.state.historyMissionList)}
                {!this.state.hasHistoryMission &&
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Image style={{ width: 200 }} source={require('../../../images/coupon.png')} />
                        <Text style={{ opacity: 0.53, fontSize: 16, color: 'rgba(0,0,0,0.54)' }}>目前无历史任务</Text>
                    </View>
                }
            </ScrollView>
        );
    }
    public missionRender = (obj) => {
        const missionArr = [];
        if (this.state.hasHistoryMission) {
            for (const key in obj) {
                if (true) {
                    const temp = <MissionList dateTime={key} missionArr={obj[key]}></MissionList>;
                    missionArr.push(temp);
                }
            }
        }
        return missionArr;
    }
    public getHistoryMission = async () => {
        // const response = await getAppJSON(Config.HISTORY_TASK);
        const response = await getAppJSON('v3/mstore/sg/task/findHistoryTaskList.html');
        const historyMissionObj = response.data;
        if (Object.keys(historyMissionObj).length === 0) {
            this.setState({ hasHistoryMission: false });
            this.setState({ historyMissionList: {} });
        } else {
            this.setState({ hasHistoryMission: true });
            this.setState({ historyMissionList: historyMissionObj });
        }
    }
}
const styles = EStyleSheet.create({
    container: {
        width: deviceWidth,
        flex: 1,
        backgroundColor: '#f4f4f4',
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
        width: deviceWidth - 72 - 101 - 16,
        fontSize: 16,
        color: 'rgb(3, 3, 3)',
        marginBottom: 4,
    },
    missionContent: {
        width: deviceWidth - 72 - 101 - 16,
        fontSize: 14,
        color: 'rgba(0,0,0,0.54)',
    },
    awards: {
        fontSize: 12,
    },
    unFinishedAwards: {
        color: '#f56767',
    },
    HistoryMissionDate: {
        fontSize: 13,
        color: '#030303',
        paddingTop: 20,
        paddingRight: 8,
        paddingLeft: 8,
        opacity: 0.87,
    },
});
export default HistoryMission;
