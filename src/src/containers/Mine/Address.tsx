import {
    View,
    Text,
    Button,
    Image,
    DeviceEventEmitter,
    TouchableOpacity,
    EmitterSubscription,
    Platform,
    Alert,
    TextInput,
    StyleSheet,
    Keyboard,
} from 'react-native';
import * as React from 'react';
import { Modal, Toast } from 'antd-mobile';
import CustomButton from 'rn-custom-btn1';
import { UltimateListView } from 'rn-listview';
import { INavigation } from '../../interface/index';
import URL from '../../config/url';
import CustomNaviBar from '../../components/customNaviBar';
import { GET, POST_JSON, GET_P, POST_FORM } from '../../config/Http';
import { createAction } from '../../utils';
import L from 'lodash';
import empty from '../../images/noAddress.png';
import {Color, Font} from 'consts';

import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

interface IState {
    isEdit: boolean;
    data: any[];
    searchKey: string,
}

class Address extends React.Component<INavigation & { onSelect: (item: any) => void }> {

    private static navigationOptions = ({ navigation }) => {
        return {
            header: null
        };
    }

    public state: IState = {
        isEdit: false,
        data: [],
        searchKey: '',
    };

    private listView?: any;
    private subscription: EmitterSubscription;

    constructor(props) {
        super(props);
        this.state = {
            headerRight: this.deleteBtn(),
            canSelect: true,
        };
        this.renderUListItem = this.renderUListItem.bind(this);
        this.onPicker = this.onPicker.bind(this);
    }

    public componentWillMount() {
        const params = this.props.navigation.state.params;
        let from = L.get(params, 'from', 'order');

        if (from === 'zhsz') {
            console.log('--------------从账户设置进入-选择为 false-----------------');
            this.setState({ canSelect: false });
        }

    }

    public componentDidMount() {
        // this.listView.onRefresh();
        this.subscription = DeviceEventEmitter.addListener('addressChanged', this.addressChanged);
    }

    public componentWillUnmount() {
        this.subscription.remove();
    }

    public render() {
        return (
            <View style={{ height: '100%', flexDirection: 'column' }}>
                <CustomNaviBar
                    navigation = { this.props.navigation }
                    leftAction={() => {this.goBack()}}
                    title={this.props.navigation.state.params
                    && this.props.navigation.state.params.headerTitle ?
                        this.props.navigation.state.params.headerTitle : '管理收货地址'}
                    showBottomLine = {false}
                    rightView = {<View style={styles.rightViewContainer}>{this.state.headerRight}</View>}
                />
                <View style={[styles.searchContainer,
                    (this.state.data && this.state.data.length == 0) && styles.searchSeparator]}>
                    <View style={styles.searchBox}>
                        <Image
                            source={require('../../images/search.png')}
                            style={styles.searchIcon}
                        />
                        <TextInput
                            style={styles.inputText}
                            underlineColorAndroid='transparent'
                            placeholderTextColor={Color.GREY_2}
                            onChangeText={(text) => this.setState({ searchKey: text })}
                            value={this.state.searchKey}
                        />
                        {(this.state.searchKey && this.state.searchKey != '') ?
                            <TouchableOpacity
                                style={styles.clearContainer}
                                onPress={this.onPressClearSearch}
                            >
                                <Image
                                    source={require('../../images/clear_search.png')}
                                    style={styles.clearImage}
                                />
                            </TouchableOpacity>: null
                        }
                    </View>
                    <TouchableOpacity onPress={this.onPressSearch}>
                        <Text style={styles.searchText}>搜索</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1,}}>
                    <UltimateListView
                        ref={(ref) => this.listView = ref}
                        onFetch={this.onFetch}
                        keyExtractor={(item, index) => `keys${index}`}
                        refreshable={false}
                        refreshableMode={Platform.OS === 'ios' ? 'advanced' : 'basic'}
                        item={this.renderUListItem}
                        numColumn={1}
                        emptyView={() =>
                            <View style={{ height, alignItems: 'center', paddingTop: 100,backgroundColor: Color.WHITE }}>
                                <Image style={[{ height: 97, width: 124, }]} source={empty} />
                                <Text style={styles.noDataText}>
                                    暂无搜索结果，请输入收货人姓名或手机号码重新搜索
                                </Text>
                            </View>
                        }
                        footer={() => (
                            <View style={{ height: 0 }} />
                        )}
                    />
                </View>
                {(!this.state.searchKey || this.state.isEdit) &&
                <View style={{ width: width, height: 86, }}>
                    <CustomButton
                        title={this.state.isEdit ? '删除' : '新建收货地址'}
                        style={{
                            height: 40, width: width * 0.7,
                            backgroundColor: '#2979FF', alignSelf: 'center', borderRadius: 40,
                            marginTop: 23, marginBottom: 23,
                        }}
                        innerStyle={{ flexDirection: 'row' }}
                        textStyle={{ color: '#fff', fontSize: 17 }}
                        onPress={this.state.isEdit ?
                            () => this.handleDeleteButton() :
                            () => {
                                this.props.navigation.navigate('NewAddress');
                            }}
                    />
                </View>
                }
            </View>
        )
            ;
    }

    onPressClearSearch = () =>{
        Keyboard.dismiss();
        this.setState({ searchKey: '',});
        this.onFetch(1, null, null, '');
    }

    onPressSearch = () => {
        Keyboard.dismiss();
        const mykey = this.state.searchKey && this.state.searchKey.trim();
        if (!IS_NOTNIL(mykey)) {
            Toast.show('请输入搜索内容');
            return;
        }
        if (mykey.length === 0) {
            Toast.show('请输入搜索内容');
        } else {
            this.onFetch(1, null, null, mykey);
        }
    }

    private goBack = () => {
        if (this.state.isEdit) {
            const newData = this.state.data.map((item) => {
                return {
                    ...item,
                    toDelete: false,
                };
            });
            this.setState({ headerRight: this.deleteBtn(), isEdit: false, data: newData }, () => {
                this.listView.postRefresh(this.state.data, 24);
            });
            return;
        }
        const params = this.props.navigation.state.params;
        if (params && params.from && params.from === 'commitOrder') {
            this.props.navigation.dispatch(createAction('order/fetchPageInfo')({ isRefresh: true }));
        }
        this.props.navigation.goBack();
    }

    onPicker = (item) => {
        // 选取地址
        const { state: { params } } = this.props.navigation;
        if (params.onSelect) {
            params.onSelect(item);
        }
        this.props.navigation.goBack();
    }

    private renderUListItem = (item, index) => {
        const key = this.state.searchKey ? this.state.searchKey.trim() : '';
        let nameValues = this.getHighLightValues(item.co, key);
        let mobileValues = this.getHighLightValues(item.mo, key);

        return (
            <AddressCard
                key={index}
                item={item}
                searchKey={key}
                nameValues={nameValues.length > 0 ? nameValues : item.co}
                mobileValues={mobileValues.length > 0 ? mobileValues : item.mo}
                index={index}
                canSelect={this.state.canSelect}
                changeDefaultAddress={this.handleChangeDefaultAddress}
                handleDeleteAddress={this.handleDeleteAddress}
                handleSelect={this.handleSelect}
                handlePicker={this.onPicker}
                navigation={...this.props.navigation} />
        );
    }

    getHighLightValues = (originValue, key) => {
        let hightLightValues = new Array();
        if(key && originValue != key && originValue.indexOf(key) >=0 ){
            hightLightValues = originValue.split(key);
            for ( var i = 0; i <hightLightValues.length; i++){
                if(hightLightValues[i] == ''){
                    hightLightValues[i] = key;
                    if(hightLightValues.length > 2 && i != 0 && i!= (hightLightValues.length -1)
                        &&!(hightLightValues.length > (i+1) && hightLightValues[i+1] == '')){
                        hightLightValues.splice(i+1, 0, key);
                    }
                }else if (hightLightValues.length > (i+1) && hightLightValues[i+1] != ''
                    && hightLightValues[i] != key ){
                    hightLightValues.splice(i+1, 0, key);
                }
            }

            if(hightLightValues.length > 1 &&hightLightValues[0] == key && hightLightValues[1] == key){
                hightLightValues.splice(0, 1);
            }
        }
        return hightLightValues;
    }

    private onFetch = async (page = 1, startFetch, abortFetch, key) => {
        try {
            if (page > 1) { return }
            const pageLimit = 24;
            let url = key ? URL.MEMBERADDRESSES + '?k=' + key : URL.MEMBERADDRESSES;
            let { data: addressList } = await POST_JSON(url);
            //默认地址第一位排序处理
            if (addressList && addressList.length > 0) {
                var arr = [];
                for (var i = 0; i < addressList.length; i++) {
                    if (addressList[i].de == '1') {
                        arr.push(addressList[i])
                    }
                }
                for (var j = 0; j < addressList.length; j++) {
                    if (addressList[j].de == '0') {
                        arr.push(addressList[j])
                    }
                }
                addressList = arr;
            }

            this.setState({
                data: addressList,
                headerRight: this.deleteBtn(),
                isEdit: false,
            }, (key || key == '') ?
                () => {this.listView.postRefresh(addressList, pageLimit)}:
                () => startFetch(addressList, pageLimit));
        } catch (err) {
            abortFetch && abortFetch(); // manually stop the refresh or pagination if it encounters network error
            Log(err);
        }
    }

    private addressChanged = (data) => {
        Log('addressChanged=========', data);
        if (data.toReload) {
            setTimeout(() => this.listView.refresh(), 500);
        }
    }

    private handleDeleteButton = () => {
        Log(...this.state.data);

        const toDelete = [];
        this.state.data.map((item, index) => {
            if (item.isSelected) {
                toDelete.push({ index, id: item.id });
            }
        });

        Log(toDelete);

        if (toDelete.length > 0) {
            this.handleDeleteAddress(toDelete);
        } else {
            Toast.info('请选择要删除的地址');
        }
    }

    private handleDeleteAddress = (selectedIndexArray) => {
        Alert.alert(
            '您确认要删除吗？',
            '',
            [
                { text: '否', onPress: () => Log('Cancel Pressed'), style: 'cancel' },
                {
                    text: '是', onPress: async () => {
                        const oldData = this.state.data;
                        for (let i = selectedIndexArray.length - 1; i > -1; i--) {
                            oldData.splice(selectedIndexArray[i].index, 1);
                        }

                        if (selectedIndexArray.length === 1) {
                            // const {data} = await getAppJSON(`v3/h5/sg/shippingAddress/delete/${selectedIndexArray[0].id}.html`);
                            const { data } = await POST_JSON(URL.DELITEADDRESS + '?m=' + selectedIndexArray[0].id);
                            // Log(data);
                        } else {
                            const addrids = selectedIndexArray.map(item => item.id);
                            console.log(addrids)
                            // const {data} =
                            //     await getAppJSON(`v3/h5/sg/shippingAddress/deleteAddrIds.html?addrIds=${addrids.join(',')}`);
                            const { data } = await POST_JSON(URL.DELETEBATCHADDRESS + '?m=' + addrids.join(','));
                            // Log(data);
                        }

                        this.setState(
                            { data: [...oldData] },
                            () => this.listView.postRefresh(this.state.data, 24));
                        // () => {this.listView.refresh(); });
                    },
                },
            ],
            { cancelable: false },
        );
    }

    // default state
    private deleteBtn = () => (
        <TouchableOpacity
            onPress={this.handleDelete}
            style={{ position: 'absolute', right: 16, flexDirection: 'row' }}>
            <Text >批量删除</Text>
        </TouchableOpacity>
    )

    // next state
    private selectAllBtn = () => (
        <TouchableOpacity
            onPress={this.handleSelectAll}
            style={{ position: 'absolute', right: 16, flexDirection: 'row' }}>
            <Text >全选</Text>
        </TouchableOpacity>
    )

    // final state
    private deselectAllBtn = () => (
        <TouchableOpacity
            onPress={this.handleDeselectAll}
            style={{ position: 'absolute', right: 16, flexDirection: 'row' }}>
            <Text >取消全选</Text>
        </TouchableOpacity>
    )

    private handleDelete = () => {
        this.setState({ headerRight: this.selectAllBtn() });
        const newData = this.state.data.map((item) => {
            return {
                ...item,
                toDelete: true,
            };
        });
        // const newData = this.state.data.map( (item) => item.toDelete = true );
        this.setState({ isEdit: true, data: newData }, () => {
            this.listView.postRefresh(this.state.data, 24);
        });
    }

    private handleSelect = (selectedIndex) => {

        const newData = this.state.data.map((item, index) => {
            const oldValue = item.isSelected;
            const newValue = selectedIndex === index ? !oldValue : oldValue;

            return {
                ...item,
                isSelected: newValue,
            };
        });

        this.setState(
            { data: newData },
            () => {
                this.listView.postRefresh(this.state.data, 24);
            },
        );
    }

    private handleSelectAll = () => {
        this.setState({ headerRight: this.deselectAllBtn() });
        const newData = this.state.data.map((item) => {
            // Log(item);
            return {
                ...item,
                isSelected: true,
            };
        });

        this.setState(
            { data: newData },
            () => {
                this.listView.postRefresh(this.state.data, 24);
            },
        );
    }

    private handleDeselectAll = () => {
        this.setState({ headerRight: this.selectAllBtn() });
        const newData = this.state.data.map((item) => {
            Log(item);
            return {
                ...item,
                isSelected: false,
            };
        });

        this.setState(
            { data: newData },
            () => {
                this.listView.postRefresh(this.state.data, 24);
            },
        );
    }

    private handleChangeDefaultAddress = async (selected) => {
        const oldData = this.state.data;
        let item = oldData.splice(selected.index, 1);
        // const {data} = await getAppJSON(`v3/h5/sg/shippingAddress/updateDefaultAddr.html?addrId=${selected.id}`);
        const { data, message } = await POST_JSON(URL.UPDATEDEFAULTADDRESS + '?m=' + selected.id);
        if (data) {
            if (item && item.length > 0) {
                item[0] = Object.assign(item[0], { de: 1 })
            }
            this.setState({
                data: [...item, ...oldData],
            }, () => {
                this.listView.postRefresh(this.state.data, 100);
            });
        } else {
            Toast.info(message);
        }
        // Log(data);
        // Log(selectedIndex);
    }
}

const AddressCard = ({ item, searchKey,nameValues,mobileValues,index, changeDefaultAddress, canSelect, handleDeleteAddress, handlePicker, handleSelect, navigation }) => (
    <TouchableOpacity onPress={() => {
        if (item.toDelete) {
            handleSelect(index);
        } else {
            if (canSelect) {
                handlePicker(item);
            }
        }
    }}>
        <View style={{ backgroundColor: '#fff', marginBottom: 10, flexDirection: 'row', width, flex: 1 }}>
            {item.toDelete && <View style={{ width: 30, alignSelf: 'center', marginLeft: 7, marginRight: -5}}>
                <CustomButton
                    innerStyle={{ flexDirection: 'row' }}
                    imageStyle={{ width: 15, height: 15, resizeMode: 'contain' }}
                    image={item.isSelected ? require('../../images/ic_select.png') : require('../../images/ic_check.png')}
                    onPress={() => {
                        handleSelect(index);
                    }}
                />
            </View>}
            <View style={{ flex: 1}}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10}}>
                    {(typeof(nameValues) == 'object')?
                        <View style={styles.hightLightContianer}>
                            {nameValues.map(function(value,index){
                                return (<Text style={ value== searchKey&& styles.hightLightText}>
                                    {value}</Text>);
                            })
                            }
                        </View>:
                        <Text style={nameValues == searchKey && styles.hightLightText}>{nameValues}</Text>
                    }
                    {(typeof(mobileValues) == 'object')?
                        <View style={styles.hightLightContianer}>
                            {mobileValues.map(function(value,index){
                                return (<Text style={ value== searchKey&& styles.hightLightText}>
                                    {value}</Text>);
                            })
                            }
                        </View>:
                        <Text style={mobileValues == searchKey && styles.hightLightText}>{mobileValues}</Text>
                    }
                </View>
                <Text style={{margin: 10 }}>{`${item.rn}  ${item.ar}`}</Text>
                {!item.toDelete &&
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10}}>
                    <CustomButton
                        title='默认地址'
                        innerStyle={{ flexDirection: 'row' }}
                        imageStyle={{ width: 15, height: 15, resizeMode: 'contain' }}
                        image={(index === 0 && item.de == 1) ? require('../../images/ic_select.png') : require('../../images/ic_check.png')}
                        onPress={() => {
                            if (index === 0 && item.de == 1) { return }
                            changeDefaultAddress({ index, id: item.id });
                        }}
                    />
                    <View style={{ flexDirection: 'row' }}>
                        {(index > 0 || item.de != 1) && <CustomButton
                            title='删除'
                            innerStyle={{ flexDirection: 'row' }}
                            imageStyle={{ width: 15, height: 15, resizeMode: 'contain' }}
                            image={require('../../images/addressdelete.png')}
                            onPress={() => {
                                handleDeleteAddress([{ index, id: item.id }]);
                            }}
                        />}
                        <CustomButton
                            title='编辑'
                            innerStyle={{ flexDirection: 'row' }}
                            imageStyle={{ width: 15, height: 15, resizeMode: 'contain' }}
                            image={require('../../images/addressedit.png')}
                            onPress={() => {
                                navigation.navigate('EditAddress', { item });
                            }}
                        />
                    </View>
                </View>}
            </View>
        </View>
    </TouchableOpacity>
);

export default Address;

const styles = StyleSheet.create({
    rightViewContainer:{
        justifyContent: 'center',
    },
    searchContainer: {
        width: width,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.WHITE,
        flexDirection: 'row',
        marginBottom: 8,
    },
    searchSeparator: {
        marginBottom: 1,
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 16,
        height: 28,
        borderRadius: 15,  // 设置圆角边
        backgroundColor: Color.GREY_6,
    },
    searchIcon: {
        marginLeft: 6,
        marginRight: 6,
        height: 24,
        width: 24,
        resizeMode: 'contain',
    },
    inputText: {
        flex: 1,
        marginRight: 2,
        backgroundColor: 'transparent',
        fontSize: 14,
        color: Color.GREY_2,
        padding: 0,
    },
    clearContainer: {
        height: 28,
        justifyContent: 'center',
    },
    clearImage: {
        width: 12,
        height: 12,
        marginHorizontal: 10,
    },
    searchText: {
        marginHorizontal: 16,
        color: Color.GREY_2,
    },
    hightLightContianer:{
        flexDirection: 'row',
    },
    hightLightText: {
        color: Color.BLUE_1,
    },
    noDataText: {
        color: '#999',
        fontSize: 14,
        marginTop: 12,
        marginHorizontal: 80,
        textAlign: 'center',
    },
});