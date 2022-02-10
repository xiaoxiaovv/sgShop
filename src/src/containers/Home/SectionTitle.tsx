import * as React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Color from '../../consts/Color';

const styles = EStyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Color.WHITE,
        height: 40,
       },
      line: {
        height: 0.5,
        width: 35,
        backgroundColor: Color.GREY_2,
      },
      guangke: {
        color: Color.BLACK,
        fontSize: '16rem',
        marginLeft: '10rem',
        marginRight: '10rem',
       },
       emptyContianer: {
           width: 24,
       },
       backImage: {
           height: 24,
           width: 24,
           marginRight: 14,
       },
});
/**
 * 首页楼层头部视图组件
 * @param {ICountDownInterface} props
 * @returns {JSX.Element}
 * @constructor
 */
class SectionTitle extends React.Component<{backgroundColor?: string; title: string; color: string; hasTitle?: boolean; clickMore?: () => void; Icon?: boolean }> {
    public render(): JSX.Element {
        return (
            <View style={[styles.headerContainer,{backgroundColor:this.props.backgroundColor?this.props.backgroundColor:Color.WHITE}]}>
                <View style={styles.emptyContianer}/>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={styles.line}/>
                        {
                            this.props.Icon &&
                            <Image
                                style={{marginLeft: 10, height: 23, width: 23}}
                                source={require('../../images/deadline.png')}
                                />
                        }
                        <Text style={[styles.guangke, {color: this.props.color}]}>{this.props.title}</Text>
                    <View style={styles.line}/>
                </View>
                {
                    this.props.hasTitle ?
                        <TouchableOpacity onPress={() => this.props.clickMore()}>
                            <Image style={styles.backImage} source={require('../../images/flash_sale_more.png')}/>
                        </TouchableOpacity>
                        : <View style={styles.emptyContianer}/>
                }
            </View>);
    }
}

export default SectionTitle;
