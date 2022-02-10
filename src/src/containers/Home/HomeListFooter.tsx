import * as React from 'react';
import { Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import HomeGuessInteresting from './SGHomeGuessInteresting';
import { IHomesInterface, IHomestate } from './HomeInterface';
import EStyleSheet from 'react-native-extended-stylesheet';
import { width, height } from '../../utils/index';
import SectionTitle from './SectionTitle';
import { goBanner } from '../../utils/tools';
import Separator from '../../components/Separator';
import Color from '../../consts/Color';

const styles = EStyleSheet.create({
   image: {
       width: 0.6 * width,
       height : 142,
   },
   title: {
       fontSize: 12,
       marginTop: 10,
       marginBottom: 10,
       width: 0.6 * width,
   },
   line: {
       backgroundColor: '#F4F4F4',
       width: width,
       height: 10,
   },
});

const Item: React.SFC<any> = ({item}) => {
    return (<TouchableOpacity onPress={() => goBanner(item)} style={{width: 0.6 * width, marginLeft: 10}}>
                <View>
                    <Image resizeMode ='stretch' style={styles.image} source={{uri: cutImgUrl(item.pic , 0.6 * width, 0.5 * width)}}/>
                    <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
                </View>
            </TouchableOpacity>
            );
};

const HomeListFooter: React.SFC<IHomesInterface> = (props) => {
 const { navigation, bottomData, rid,isHost, CommissionNotice, fCommunity} = props;
 return (
    <View style={{flex: 1, marginTop: 10}}>
        <Separator/>
        {/* <View style={styles.line}/> */}
        <SectionTitle title='逛客那些事' color={Color.BLACK} hasTitle={false}/>
        <FlatList
            data={fCommunity}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={(dataItem) => <Item {...dataItem}/>}
        />
    {/* <View style={{height: 10, backgroundColor: '#F4F4F4'}}/> */}
        <Separator/>
        {/* <View style={styles.line}/> */}
        <HomeGuessInteresting
            dataSource={bottomData}
            rid={rid}
            navigation = {navigation}
            isHost = {isHost}
            CommissionNotice = {CommissionNotice}
            topicTitle = {'猜你喜欢'}/>
    </View>
);
};
export default HomeListFooter;
