import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    NativeModules,
    ImageBackground,
    TouchableWithoutFeedback,
    Platform,
} from 'react-native';
import * as React from 'react';
import { Toast } from 'antd-mobile';
import { INavigation } from '../../../interface/index';
import EStyleSheet from 'react-native-extended-stylesheet';
import { NavBar } from '../../../components/NavBar';

import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

class ApplyForCard extends React.Component<INavigation> {

    public constructor(props) {
        super(props);
    }
    public render(): JSX.Element {
        return (
            <View style={{backgroundColor: '#f1f1f1', flex: 1}}>
                <NavBar title={'联名卡申请'}/>
                {
                    <View style={{backgroundColor: '#f1f1f1', flex: 1}}>
                    <ScrollView>
                    <ImageBackground style={styles.backImg} source={require('../../../images/lianminka/lm-background.png')}>
                        <View style={styles.kaContainer}>
                            <TouchableWithoutFeedback
                                    onPress={() => {
                                        this.toApplyForCard(1);
                                    }}
                                    >
                                    <View style={styles.card1}></View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback
                                    onPress={() => {
                                        this.toApplyForCard(2);
                                    }}
                                    >
                                    <View style={styles.card2}></View>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={styles.btnContainer}>
                            <TouchableOpacity
                                onPress = {() => {
                                    this.toApplyForCard(1);
                                }}>
                                <Image source={require('../../../images/lianminka/lm-11.png')}
                                    style={styles.imgBtnLeft}/>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress = {() => {
                                    this.toApplyForCard(2);
                                }}>
                                <Image source={require('../../../images/lianminka/lm-12.png')}
                                    style={styles.imgBtnRight}/>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                    <View style={styles.progressContainer}>
                        <TouchableOpacity
                                onPress = {() => {
                                    this.toApplyForCard(3);
                                }}>
                                <Image source={require('../../../images/lianminka/lm-13.png')}
                                    style={styles.progressBtn}/>
                            </TouchableOpacity>
                    </View>
                    </ScrollView>
                    </View>
                }
             </View>
        );
    }
    // 顺逛白条click
    private toApplyForCard = async (index) => {
        let url = null;
        if (index === 1) {
            url = 'https://xyk.cebbank.com/cebmms/apply/ps/card-index.htm?req_card_id=11753&pro_code=FHTG107707SJ01HESG';
        } else if (index === 2) {
            url = 'https://xyk.cebbank.com/cebmms/apply/ps/card-index.htm?req_card_id=11754&pro_code=FHTG107707SJ01HESG';
        } else if (index === 3) {
            url = 'https://xyk.cebbank.com/cebalipay/apply/fz/card-app-status.htm';
        }
        // 跳转
        if (index === 3) {
            NativeModules.ToolsModule.presentH5View([url, '查询联名卡进度']);
        } else {
            NativeModules.ToolsModule.presentH5View([url, '联名卡申请']);
        }
    }
}
const BackHeight = 1068;
const styles = EStyleSheet.create({
    backImg: {
        width,
        height: `${BackHeight}rem`,
    },
    kaContainer: {
        position: 'absolute',
        width: 0.44 * width,
        height: 0.3466 * width,
        left: 0.51 * width,
        top: `${0.285 * BackHeight}rem`,
    },
    card1: {
        position: 'absolute',
        width: (0.44 * 0.5) * width,
        height: 0.38 * width,
        left: 0,
        top: 0,
    },
    card2: {
        position: 'absolute',
        width: (0.44 * 0.5) * width,
        height: 0.38 * width,
        right: 0,
        top: 0,
    },
    btnContainer: {
        position: 'absolute',
        width: 0.8 * width,
        height: `${0.05 * BackHeight}rem`,
        right: 0.15 * width,
        bottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    imgBtnLeft: {
        width: (0.4 * 0.8) * width,
        height: (0.1813 * 0.5) * width,
        backgroundColor: 'red',
    },
    imgBtnRight: {
        width: (0.4 * 0.8) * width,
        height: (0.1813 * 0.5) * width,
        backgroundColor: 'blue',
    },
    progressContainer: {
        width,
        height: '132rem',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#feeacf',
    },
    progressBtn: {
        width: 0.6 * width,
        height: '22rem',
    },
});

export default ApplyForCard;
