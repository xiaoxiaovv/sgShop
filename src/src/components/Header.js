/**
 * Created by Administrator on 2017/6/7.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Platform,
    Image,
} from "react-native";
import {isiPhoneX} from "../utils";

const statusBarPadding = Platform.OS === "ios" ? (isiPhoneX ? 44 : 20) : 0;

class Header extends Component {

    render() {
        return (
            <View style={{
                backgroundColor: "#fff",
                width: "100%",
                paddingTop: statusBarPadding,
                ...this.props.StatusBarStyle,
            }}>
                <View
                    {...this.props}
                    style={{
                        width: "100%",
                        flexDirection: 'row',
                        justifyContent: 'center',
                        height: 50,
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        borderColor: "#ddd",
                        ...this.props.style,
                    }}>
                    {this.props.isShowBackBtn === false ? null :

                        <View style={{height: "100%", position: 'absolute', left: 0, zIndex: 1000}}>
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: "100%",
                                    width: "100%",
                                    zIndex: 1000
                                }}
                                onPress={() => {
                                    if (this.props.goBack) {
                                        this.props.goBack();
                                    } else {
                                        this.props.navigation.goBack();
                                    }
                                }}>
                                {this.props.backBtn ? this.props.backBtn :
                                    <Image style={{height: 24, width: 24, marginLeft: 16}}
                                           source={require('../images/icon_back_gray.png')}/>}
                                {/* <View style={{
                                    borderLeftWidth: 3,
                                    borderBottomWidth: 3,
                                    width: 16,
                                    height: 16,
                                    borderColor: "#666",
                                    zIndex: 1000,
                                    transform: [{rotate: '45deg'}],
                                    backgroundColor: '#ff0000',
                                }}>
                                </View> */}
                            </TouchableOpacity>
                        </View>

                    }
                    {this.props.title ?
                        <Text style={{
                            fontSize: 17,
                            marginLeft: 30,
                            marginRight: 30,
                            flex: 1,
                            textAlign: "center",
                            ...this.props.titleStyle
                        }}
                              numberOfLines={1}>{this.props.title}</Text> : null}
                    {this.props.children}
                </View>
            </View>
        )
    }
}

export default Header;
