import * as React from 'react';
import {ScrollView, View, Image, Text, TouchableOpacity} from 'react-native';
import {INavigation} from '../../../interface';
import {universalHeader} from '../../../utils';
import SupportingBanks from './SupportingBanks';
import Header from '../../../components/Header';


export default class BankCardManagement extends React.Component<INavigation> {

    public static navigationOptions = ({navigation}) => {
        return {
            header: <Header goBack={() => navigation.goBack()} title={"提现管理"}>
                <View style={{position: 'absolute', right: 5, flexDirection: 'row'}}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingRight: 10,
                        }}
                        onPress={() => navigation.navigate('SupportingBanks')}
                    >
                        <Text style={{color: 'gray'}}>支持银行</Text>
                    </TouchableOpacity>
                </View>
            </Header>
        };
    }

    public render(): JSX.Element {
        const {navigation} = this.props;
        return (
            <ScrollView style={{backgroundColor: '#E5E5E5'}}>
                <View style={{
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 20,
                    paddingBottom: 20,
                    backgroundColor: 'white',
                }}>
                    <BindButton
                        text={'添加银行卡'}
                        onPress={() => navigation.navigate('')}
                    />
                    <BindButton
                        text={'绑定快捷通'}
                        onPress={() => navigation.navigate('')}
                    />
                </View>
            </ScrollView>
        );
    }
}

const BindButton = ({text, onPress}: { text: string, onPress: () => void }): JSX.Element => (
    <TouchableOpacity
        style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#F5F5F5',
            borderWidth: 1,
            paddingTop: 10,
            paddingBottom: 10,
            marginTop: 5,
            marginBottom: 5,
        }}
        activeOpacity={0.9}
        onPress={onPress}
    >
        <Image style={{height: 20, width: 20}} source={require('../../../images/join.png')}/>
        <Text>{text}</Text>
    </TouchableOpacity>
)
