import * as React from 'react';
import {ScrollView, View, TouchableOpacity} from 'react-native';
import Header from '../../components/Header';
import Image from 'react-native-scalable-image';
import URL from '../../config/url';


interface IMyLearn {
    locationInfo: any;
    goBack?: () => void;
}

interface IMyLearnProps {
    goBack?: () => void;
    navigation?: void;
}

interface IMyLearnState {
    height: number;
    width: number;
    imgArr: any
}

// let imgArr = [];
import URL from './../../config/url.js';
let Swidth = URL.width;
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

class MyLearn extends React.Component<IMyLearn, IMyLearnState, IMyLearnProps> {

    public static navigationOptions = ({navigation, screenProps}) => ({
        header: <Header
            goBack={() => navigation.goBack()}
            title="新手必读">
        </Header>
    });

    constructor(props) {
        super(props);
        this.state = {
            width: 100,
            height: 20,
            imgArr: []
        };
    }

   async componentWillMount() {
        const token = await global.getItem('userToken');//获取用户token  
        
        let imgArr = [
            {'img': 'http://cdn50.ehaier.com/mobilemall-admin-web/storerichtypecontroller/image/2018/07/3c43875eb8b947ffa76eee513b06a1c1.jpg', 'url': 'http://learn.ihaier.me/index.html?u='+token},
            {'img': 'http://cdn50.ehaier.com/mobilemall-admin-web/storerichtypecontroller/image/2018/07/1b4138a52b024a9d98fa1469f9af6e56.jpg', 'url': `${URL.H5_HOST}noteDetails/55436//`},
            {'img': 'http://cdn50.ehaier.com/mobilemall-admin-web/storerichtypecontroller/image/2018/07/0888ebc6d08f4546858ea592dd241bb3.jpg', 'url': `${URL.H5_HOST}noteDetails/55465//`},
            {'img': 'http://cdn50.ehaier.com/mobilemall-admin-web/storerichtypecontroller/image/2018/07/582cbbe61c884393a320a7765dad14bc.jpg', 'url': `${URL.H5_HOST}noteDetails/55474//`},
            {'img': 'http://cdn50.ehaier.com/mobilemall-admin-web/storerichtypecontroller/image/2018/07/3a9f550567ae42a387a14fe16b2181ba.jpg', 'url': `${URL.H5_HOST}noteDetails/55475//`},
            {'img': 'http://cdn50.ehaier.com/mobilemall-admin-web/storerichtypecontroller/image/2018/07/405ddbf93ab24ec79d074d0054e0b3dd.jpg', 'url': `${URL.H5_HOST}noteDetails/55478//`},
            {'img': 'http://cdn50.ehaier.com/mobilemall-admin-web/storerichtypecontroller/image/2018/07/1eb0b8c8147b4dc482f35b98e396d951.jpg', 'url': `${URL.H5_HOST}noteDetails/68436//`},
            {'img': 'http://cdn50.ehaier.com/mobilemall-admin-web/storerichtypecontroller/image/2018/07/0e48b830e7b645ec81a31d90b9c433da.jpg', 'url': `${URL.H5_HOST}noteDetails/50200//`},
        ]
        this.setState({imgArr});
    }

    _onPressButton = (url) => {
        if(!url){
            return;
        }

        this.props.navigation.navigate('CustomWebView', {customurl: url, headerTitle: '顺逛考试中心'});
    };

    public render(): JSX.Element {
        return (
            <ScrollView>
                {this.state.imgArr.map((item, i) => {
                    return (
                        <View>
                            <TouchableOpacity
                                onPress={()=>this._onPressButton(item.url)} activeOpacity={0.8}>
                                <Image source={{uri: item.img}} width={Swidth}/>
                            </TouchableOpacity>
                        </View>
                    )
                })}
            </ScrollView>
        )
    }
}

export default MyLearn;