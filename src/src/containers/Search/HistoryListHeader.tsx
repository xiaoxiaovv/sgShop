import * as React from 'react';
import { View, Text, FlatList, TouchableOpacity, AsyncStorage, DeviceEventEmitter, Image } from 'react-native';
import EStylesheet from 'react-native-extended-stylesheet';
import { NavigationScreenProp } from 'react-navigation';
import { connect } from 'react-redux';

interface ISearchListHeaderProps {
    navigation: NavigationScreenProp;
    CanFind?: boolean;
}

@connect()
class HistoryListHeader extends React.Component<ISearchListHeaderProps> {
    public state = {
        history: [],
    };
    public listener: any;
    public async componentDidMount() {
        AsyncStorage.getItem('history', (eeror, result = '[]') => {
            try {
                if (result === null) {
                    this.setState({ history: [] });
                } else {
                    const json = eval('(' + result + ')');
                    this.setState({ history: json });
                }
            } catch (error) {
            }
        });
        this.listener = DeviceEventEmitter.addListener('mhistory', () => {
            AsyncStorage.getItem('history', (eeror, result = '[]') => {
                try {
                    if (result === null) {
                        this.setState({ history: [] });
                    } else {
                        const json = eval('(' + result + ')');
                        this.setState({ history: json });
                    }
                } catch (error) {
                }
            });
        });
    }
    public render(): JSX.Element {
        return (
            <View style={styles.container}>
                <View style={{ backgroundColor: '#EFEFF4', height: 8 }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.title}>历史搜索</Text>
                    <TouchableOpacity
                        onPress={() => AsyncStorage.setItem('history', '', () => {
                            this.setState({ history: [] });
                            DeviceEventEmitter.emit('mhistory');
                        })}
                        style={{ height: 44, width: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../../images/clear_history.png')} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = EStylesheet.create({
    container: {
        width:"100%",
        backgroundColor: 'white',
        borderBottomColor: 'lightgray',
        borderBottomWidth: 0.5 },
    title: {
        fontSize: '16rem',
        color: '#333333',
        marginHorizontal: 10,
    },
});
export default HistoryListHeader;
