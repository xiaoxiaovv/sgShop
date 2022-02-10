import * as React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import {Grid} from 'antd-mobile';
import {Color} from 'consts';
// 每个分组的头
const Header = ({title, buttonImage, buttonTitle, style}) => (
    <View style={[styles.header, style]}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 16}}>
                <Text style={{color: '#333', fontFamily: 'PingFangSC-Regular', fontSize: 15, lineHeight: 21}}>{title}</Text>
            </View>
            {
                buttonImage &&
                <View style={{flexDirection: 'row-reverse', alignItems: 'center'}}>
                    <Image source={buttonImage} style={{marginLeft: 10, marginRight: 10}}/>
                    {
                        buttonTitle &&
                        <Text style={{color: '#999', fontSize: 14, lineHeight: 20}}>{buttonTitle}</Text>
                    }
                </View>
            }
        </View>
  </View>
);

const renderText = (title) => (
    <Text style={[title.style, {fontSize: 16}]}>{title.text}</Text>
);

const IconGrid = ({data, columnSize, hasLine, onClick, tipData = null}) => {
    return (
        <Grid itemStyle={{borderColor: '#eee'}} data={data} columnNum={columnSize} hasLine={hasLine}
            renderItem={(dataItem, itemIndex) => {
                let orderCount = 0;
                if (tipData !== null) {
                    switch (itemIndex) {
                        case 0:
                            orderCount = tipData.waitPay;
                            break;
                        case 1:
                            orderCount = tipData.waitShipping;
                            break;
                        case 2:
                            orderCount = tipData.waitReceipt;
                            break;
                        case 3:
                            orderCount = tipData.waitComment;
                            break;
                        case 4:
                        // 售后维修不显示tips
                            orderCount = 0;
                            break;
                        default:
                            break;
                    }
                }
                return (
                    <View style={[{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1},
                                    {opacity: dataItem.opacity}]}>
                        {/* <Image source={require(dataItem.icon)} style={{ width: 75, height: 75 }}/> */}
                        <View>
                            {/* 图标 */}
                            {dataItem.icon}
                            {/* 不是图标就是文字 */}
                            {dataItem.title && renderText(dataItem.title)}
                        </View>
                        {/* 图标下面的文字 */}
                        <Text style={{marginTop: 10, fontSize: 13, lineHeight: 18, color: '#666'}}>{dataItem.text}</Text>
                        {/* 订单数量的tips */}
                        {   tipData !== null &&
                            orderCount !== 0 &&
                            <View style={styles.tipContainer}>
                                <Text style={{color: '#fff', fontSize: 10, margin: 2,textAlign:'center',lineHeight:12 }}>
                                    {orderCount > 99 ? 99 : orderCount}
                                </Text>
                            </View>
                        }
                    </View>
                );
            }
            }
            onClick= {(element, index) => onClick(element, index)}
        />
    );
};

const CustomGrid = (
    {
        data,
        columnSize,
        hasLine,
        headerClick= (): void => Log(),
        onClick= {},
        tipData = null,
    }) => {
        const headerData = data.header;
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => headerClick()}
                    >
                    <Header
                        title={headerData.title}
                        buttonImage={headerData.buttonImage}
                        buttonTitle={headerData.buttonTitle}
                        style={ hasLine ? null : styles.headerBottomBorder}/>
                </TouchableOpacity>
                <IconGrid
                    tipData = {tipData}
                    data={data.child}
                    columnSize={columnSize}
                    hasLine={hasLine}
                    onClick={onClick}/>
            </View>
        );
};

const styles = StyleSheet.create({
    container: {
        alignSelf: 'stretch',
        backgroundColor: '#fff',
        marginTop: 10,
    },
    header: {
        backgroundColor: '#fff',
        paddingTop: 12,
        paddingBottom: 12,
        borderColor: '#eee',
        borderTopWidth: 1,
    },
    headerBottomBorder: {
        borderColor: '#eee',
        borderBottomWidth: 1,
    },
    tipContainer: {
        backgroundColor: Color.ORANGE_1,
        borderRadius: 10,
        position: 'absolute',
        width: 20,
        height: 20,
        top: 10,
        right: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CustomGrid;
