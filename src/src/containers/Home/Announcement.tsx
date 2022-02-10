import * as React from 'react';
import { TouchableOpacity, View, Image, Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { ICustomContain } from '../../interface/index';
import L from 'lodash';

const styles = EStyleSheet.create({
    BulletinView_box: {
        flex: 1,
        flexDirection: 'row',  // 子元素水平排布(默认垂直排布)
        alignItems: 'center',  // 使元素垂直居中排布, 当flexDirection为column时, 为水平居中
        height: 40,
        paddingRight: 24,
        backgroundColor: 'white',
        // marginTop: 12,
        marginBottom: 10,
    },
    borderTop: {
        borderWidth: 0,
        borderTopWidth: 1,
        borderTopColor: '#e4e4e4',
    },
});

const Announcement: React.SFC<ICustomContain> = (props) => {
    let bulletinMessage = '';
    // const middleImageConfig3 = dvaStore.getState().home.middleImageConfig.middleImagePart3;
    const middleImageConfig = dvaStore.getState().home.middleImageConfig;
    const middleImageConfig3 = L.get(middleImageConfig, 'middleImageConfig3', false);

    if (props.list !== undefined) {
        const contents = props.list[0];
        bulletinMessage = contents.content;
    }
    return (
        <TouchableOpacity activeOpacity={0.7} onPress={() => props.navigation.navigate('MessageDetail')}>
            <View style={middleImageConfig3 ? styles.BulletinView_box : [styles.BulletinView_box, styles.borderTop]}>
                <Image
                    style={{
                        marginTop: -1,
                        width: 75,
                        height: 20,
                    }}
                    resizeMode={'contain'}
                    source={require('./../../images/announcement.png')}>
                </Image>
                <Text numberOfLines={1}
                    style={
                        {
                            marginRight: 10,
                            flex: 1,
                            fontSize: 12,
                            color: '#333333',
                            fontFamily: '.PingFangSC-Regular',
                        }
                        }>
                     {bulletinMessage}
                </Text>
                </View>
        </TouchableOpacity>);
};
export default Announcement;
