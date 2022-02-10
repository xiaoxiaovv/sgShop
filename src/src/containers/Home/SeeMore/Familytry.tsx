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
    ImageBackground,
    TouchableWithoutFeedback,
} from 'react-native';
import * as React from 'react';
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

class Familytry extends React.Component<INavigation> {

    public constructor(props) {
        super(props);
    }
    public render(): JSX.Element {
        return (
            <View style={{backgroundColor: '#f1f1f1', flex: 1}}>
                <NavBar title={'智能家庭体验'}/>
                {
                    <View style={{backgroundColor: '#f1f1f1', flex: 1}}>
                    <ScrollView>
                        {/* 第一张图 */}
                        <View style={styles.Container}>
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    this.toNextDetail(1);
                                }}
                                >
                                <ImageBackground style={styles.BackImg} source={require('../../../images/homepage/familycity.png')}>
                                        <TouchableWithoutFeedback
                                            onPress={() => {
                                                this.toNextDetail(1);
                                            }}
                                            >
                                            <Image style={styles.xuanzhuanSty} source={require('../../../images/homepage/xuanzhuan.png')}/>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback
                                            onPress={() => {
                                                this.toNextDetail(1);
                                            }}
                                            >
                                            <ImageBackground style={styles.yinyingSty} source={require('../../../images/homepage/yinying.png')}>
                                                <Text style={styles.yinyingText} onPress={() => this.toNextDetail(1)}>城市智慧生活</Text>
                                            </ImageBackground>
                                        </TouchableWithoutFeedback>
                                </ImageBackground>
                            </TouchableWithoutFeedback>
                        </View>
                        {/* 第二张图 */}
                        <View style={styles.Container}>
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    this.toNextDetail(2);
                                }}
                                >
                                <ImageBackground style={styles.BackImg} source={require('../../../images/homepage/jianyuetwo.jpg')}>
                                        <TouchableWithoutFeedback
                                            onPress={() => {
                                                this.toNextDetail(2);
                                            }}
                                            >
                                            <Image style={styles.xuanzhuanSty} source={require('../../../images/homepage/xuanzhuan.png')}/>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback
                                            onPress={() => {
                                                this.toNextDetail(2);
                                            }}
                                            >
                                            <ImageBackground style={styles.yinyingSty} source={require('../../../images/homepage/yinying.png')}>
                                                <Text style={styles.yinyingText} onPress={() => this.toNextDetail(2)}>现代田园风格</Text>
                                            </ImageBackground>
                                        </TouchableWithoutFeedback>
                                </ImageBackground>
                            </TouchableWithoutFeedback>
                        </View>
                        {/* 第三张图 */}
                        <View style={styles.Container}>
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    this.toNextDetail(3);
                                }}
                                >
                                <ImageBackground style={styles.BackImg} source={require('../../../images/homepage/jianyuethree.jpg')}>
                                        <TouchableWithoutFeedback
                                            onPress={() => {
                                                this.toNextDetail(3);
                                            }}
                                            >
                                            <Image style={styles.xuanzhuanSty} source={require('../../../images/homepage/xuanzhuan.png')}/>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback
                                            onPress={() => {
                                                this.toNextDetail(3);
                                            }}
                                            >
                                            <ImageBackground style={styles.yinyingSty} source={require('../../../images/homepage/yinying.png')}>
                                                <Text style={styles.yinyingText} onPress={() => this.toNextDetail(3)}>现代混搭风格</Text>
                                            </ImageBackground>
                                        </TouchableWithoutFeedback>
                                </ImageBackground>
                            </TouchableWithoutFeedback>
                        </View>
                        {/* 第四张图 */}
                        <View style={styles.Container}>
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    this.toNextDetail(4);
                                }}
                                >
                                <ImageBackground style={styles.BackImg} source={require('../../../images/homepage/jianyueone.jpg')}>
                                        <TouchableWithoutFeedback
                                            onPress={() => {
                                                this.toNextDetail(4);
                                            }}
                                            >
                                            <Image style={styles.xuanzhuanSty} source={require('../../../images/homepage/xuanzhuan.png')}/>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback
                                            onPress={() => {
                                                this.toNextDetail(4);
                                            }}
                                            >
                                            <ImageBackground style={styles.yinyingSty} source={require('../../../images/homepage/yinying.png')}>
                                                <Text style={styles.yinyingText} onPress={() => this.toNextDetail(4)}>现代简约风格</Text>
                                            </ImageBackground>
                                        </TouchableWithoutFeedback>
                                </ImageBackground>
                            </TouchableWithoutFeedback>
                        </View>
                    </ScrollView>
                    </View>
                }
             </View>
        );
    }
    // 顺逛白条click
    private toNextDetail = async (index) => {
        let url = null;
        let title = null;
        if (index === 1) {
            title = '城市智慧生活';
            url = 'http://3d.fuwo.com/pano/series/ecfb1b94e17911e78c1e00163e0018da/';
        } else if (index === 2) {
            title = '田园风格';
            url = 'http://3d.haier.net/ifuwo/pano/design/882f1e94cd0c11e79de600163e127a92/';
        } else if (index === 3) {
            title = '混搭风格';
            url = 'http://3d.haier.net/ifuwo/pano/design/0cc5660c771f11e7b94b00163e127a92/';
        } else if (index === 4) {
            title = '简约风格';
            url = 'http://3d.haier.net/ifuwo/pano/design/82eb468ac50d11e7af3000163e127a92/';
        }
        // 跳转
        NativeModules.ToolsModule.presentH5View([url, title]);

    }
}
const BackHeight = 1200;
const styles = EStyleSheet.create({
    Container: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
    },
    BackImg: {
        width: 0.92 * width,
        height: 0.36 * width,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    xuanzhuanSty: {
        width: '40rem',
        height: '40rem',
    },
    yinyingSty: {
        width: '100%',
        height: '30rem',
        position: 'absolute',
        left: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    yinyingText: {
        fontSize: '12rem',
        color: '#fff',
        textAlign: 'center',
    },
});

export default Familytry;
