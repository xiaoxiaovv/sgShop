import * as React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  Modal,
  TouchableOpacity,
    KeyboardAvoidingView,
  NativeModules
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Address from '../../components/Address';
import ScreenUtil from '../Home/SGScreenUtil';
import { INavigation } from '../../interface';
import { getAppJSON, postAppForm, postAppJSON } from '../../netWork';
import Config from 'react-native-config';
import { Toast } from 'antd-mobile';
import { createAction, connect } from '../../utils';
import { NavigationActions } from 'react-navigation';

interface IState {
  avatarImage: string;
  showAddress: boolean;
  storeName: string;
  baseAddress: string;
  detailAddress: string;
  unionInfo: { label: string, value: string };
  hrCode: string;
  promotionCode: string;
  provinceId: number;
  cityId: number;
  areaId: number;
  provinceName: string;
  cityName: string;
  areaName: string;
}

interface IShopApply {
  regionName: string;
  provinceId: number;
  cityId: number;
  areaId: number;
  streetId: number;
  provinceName: string;
  cityName: string;
  areaName: string;
  streetName: string;
}

import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

const mapStateToProps = ({
  address: { provinceId, cityId, areaId, streetId, provinceName, cityName, areaName, streetName },
}) => ({
  provinceId, cityId, areaId, streetId, provinceName, cityName, areaName, streetName,
});

const UnionText = (params) => { // 联盟分类内容显示组件
  return (params.union.label.length === 0 ?
    <Text style={[styles.textSize, { flex: 1, color: '#ccc' }]}>请选择</Text> :
    <Text style={[styles.textSize, { flex: 1, color: '#000' }]}>{params.union.label}</Text>);
};
const AddressText = (params) => { // 地址内容选择组件
  const address = params.addressInfo;
  return (address.areaName.length === 0 ?
    <Text style={[styles.textSize, { flex: 1, color: '#ccc' }]}>请选择</Text> :
    <Text style={[styles.textSize, { flex: 1, color: '#000' }]}>
      {address.provinceName + ' ' + address.cityName + ' ' + address.areaName}
    </Text>);
};
let throttleFlag = true; // 函数节流标识，防止短时间重复请求
@connect(mapStateToProps)
export default class OpenStore extends React.Component<INavigation & IShopApply, IState> {
  constructor(props) {
    super(props);
    this.state = {
      avatarImage: dvaStore.getState().users.avatarImageFileId, // 用户头像
      showAddress: false, // 是否展示店址modal
      storeName: '', // 店铺名称
      baseAddress: '', // 省市区地址
      detailAddress: '', // 详细地址
      unionInfo: { label: '', value: '' }, // 联盟分类信息
      hrCode: null, // 上岗证号，只在人人服务分类下需要
      promotionCode: '', // 推荐码
      provinceId: null,
      cityId: null,
      areaId: null,
      provinceName: '',
      cityName: '',
      areaName: '',
    };
  }

  public render() {
    return <ScrollView>
      <View style={styles.header}>
        <View style={styles.imgBox}>
          {dvaStore.getState().users.avatarImageFileId ? <Image source={{ uri: dvaStore.getState().users.avatarImageFileId }}
            style={styles.avatarImage} /> : <Image source={require('../../images/registersuccess.png')}
              style={styles.avatarImage} />}
        </View>
        <Text style={styles.headerText}>亲,还差一步您就可以开店成功了!</Text>
      </View>
      <KeyboardAvoidingView>
        <View style={styles.inputField}>
          <View style={styles.inputBox}>
            <Text style={styles.inputTitle}>*店铺名称</Text>
            <TextInput style={[styles.textSize, { flex: 1 }]}
              placeholder={'百年老店从店铺名称开始吧~'}
              underlineColorAndroid='transparent'
              autoCapitalize='none'
              maxLength={20}
              onChangeText={(value) => this.setState({ storeName: value })}></TextInput>
          </View>
          <TouchableOpacity onPress={() => this.setState({ showAddress: true })}
            activeOpacity={1}>
            <View style={styles.inputBox}>
              <Text style={styles.inputTitle}>*地址</Text>
              <AddressText
                addressInfo={this.state}
                hasHeader={true} />
              <Image source={require('../../images/arrow_right_w.png')}
                style={{ width: 8, height: 13, marginRight: 10 }} />
            </View>
          </TouchableOpacity>
          <View style={styles.inputBox}>
            <Text style={styles.inputTitle}>*详细地址</Text>
            <TextInput style={[styles.textSize, { flex: 1 }]}
              placeholder={'请输入您的详细地址'}
              underlineColorAndroid='transparent'
              autoCapitalize='none'
              onChangeText={(value) => this.setState({ detailAddress: value })}></TextInput>
          </View>
          <TouchableOpacity onPress={() => this.chooseUnion()}
            activeOpacity={1}>
            <View style={styles.inputBox}>
              <Text style={styles.inputTitle}>*类别</Text>
              <UnionText union={this.state.unionInfo} />
              <Image source={require('../../images/arrow_right_w.png')}
                style={{ width: 8, height: 13, marginRight: 10 }} />
            </View>
          </TouchableOpacity>
          {this.state.unionInfo.label.substring(0, 4) === '人人服务' ? <View style={styles.inputBox}>
            <Text style={styles.inputTitle}>上岗证号</Text>
            <TextInput style={[styles.textSize, { flex: 1 }]}
              placeholder={'请填写上岗证号'}
              underlineColorAndroid='transparent'
              autoCapitalize='none'
              onChangeText={(value) => this.setState({ hrCode: value })}></TextInput>
          </View> : null}
          <View style={styles.inputBox}>
            <Text style={styles.inputTitle}>*推荐码</Text>
            <TextInput style={[styles.textSize, { flex: 1 }]}
              placeholder={'请输入推荐码'}
              underlineColorAndroid='transparent'
              autoCapitalize='none'
              value={this.state.promotionCode}
              onChangeText={(value) => this.setState({ promotionCode: value })}></TextInput>
          </View>
          <View style={styles.promotion}>
            <Text style={styles.textSize}>没有推荐码？</Text>
            <TouchableOpacity onPress={() => this.getPromotionCode()}>
              <Text style={styles.promotionButton}>点击获取</Text>
            </TouchableOpacity>
            <Text style={styles.textSize}>当地顺逛总监的推荐码吧</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
      {IS_NOTNIL(this.state.storeName) && IS_NOTNIL(this.state.promotionCode) &&
        IS_NOTNIL(this.state.unionInfo.label) ?
        <TouchableOpacity onPress={() => this.nextBtnClick()}>
          <View style={[styles.nextButton, { backgroundColor: '#2979FF' }]}>
            <Text style={{ color: 'white' }}>下一步</Text>
          </View>
        </TouchableOpacity> :
        <View style={[styles.nextButton, { backgroundColor: '#75A8FF' }]}>
          <Text style={{ color: 'white' }}>下一步</Text>
        </View>}
      <Modal
        // 设置Modal组件的呈现方式
        animationType='slide'
        // 它决定 Modal 组件是否是透明的
        transparent
        // 它决定 Modal 组件何时显示、何时隐藏
        visible={this.state.showAddress}
        // 当 Modal组件在屏幕上完成显示后，这个回调函数将被执行
        onShow={() => Log('onShow')}
        // 这是 Android 平台独有的回调函数类型的属性
        // 开发者必须要写一个函数来处理当 Modal 显示在界面时且android物理返回键被按下时的业务逻辑
        onRequestClose={() => Log('Android backbutton')}
      >
        <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
          <TouchableOpacity
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: height - 400,
            }}
            activeOpacity={1} onPress={() => this.setState({ showAddress: false })}>
            <View style={{
              position: 'absolute', top: 0, left: 0, width: '100%',
              height: height - 400,
            }}></View>
          </TouchableOpacity>
          <Address
            hasHeader={true}
            notSelectStreet={true}
            onclick={() => {
              this.setState({ showAddress: false });
            }}
            onSelect={(addressObj) => {
              Log('onSelect -> addressObj', addressObj);
              this.addressFinished(addressObj);
            }}
            onFinish={(addressObj) => {
              Log('onFinish -> addressObj', addressObj);
              this.setState({
                showAddress: false,
                baseAddress: `${addressObj.province.text} ${addressObj.city.text} ${addressObj.district.text}`,
              });
            }}
          />
        </View>
      </Modal>
    </ScrollView>;
  }

  public async componentDidMount() {
    // if (dvaStore.getState().users.isLogin) {
    //   const userRole = dvaStore.getState().users.isHost;
    //   if (userRole === 1) {// 判断用户角色信息；0为买家；1为卖家
    //     Toast.info('您已经是店主了,进店看看吧', 2.5, () => {
    //       const resetAction = NavigationActions.reset({
    //         index: 0,
    //         actions: [
    //           NavigationActions.navigate({
    //             routeName: 'RootTabs',
    //             params: null,
    //           }),
    //         ],
    //       });
    //       this.props.navigation.dispatch(resetAction);
    //     });
    //   }
    // }
  }

  // 校验店铺敏感词方法
  // 有延迟，不能及时监测到输入框内容变化，改至下一步时判断
  // public async changeStoreName(name) {
  //   const params = { checkword: name };
  //   if (throttleFlag) {
  //     try {
  //       const results = await getAppJSON(Config.CHECK_SENSITIVE_WORDS, params, {}, true);
  //       throttleFlag = false;
  //       if (!results.data && name !== '') {
  //         Toast.info('请不要使用违禁词！');
  //         this.setState({
  //           storeName: '',
  //         });
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //     this.setState({ storeName: name });
  //     setTimeout(() => throttleFlag = true, 300);
  //   }
  // }

  // 选择联盟分类方法
  public chooseUnion() {
    if (this.state.baseAddress === '请选择') {
      Toast.info('请选择所在地区！');
    } else {
      this.props.navigation.navigate('CommonUnion', { callback: (data) => this.setState({ unionInfo: data }) });
    }
  }

  // 地址选择回传方法
  public addressFinished(addressInfo) {
    this.setState({
      provinceId: addressInfo.province.value,
      cityId: addressInfo.city.value,
      areaId: addressInfo.district.value,
      provinceName: addressInfo.province.text,
      cityName: addressInfo.city.text,
      areaName: addressInfo.district.text,
    });
  }

  // 获取推荐码
  public async getPromotionCode() {
    const { provinceId, cityId, areaId, promotionCode } = this.state;
    if (!provinceId && !cityId && !areaId) {
      Toast.info('请选择地址');
    } else {
      if (promotionCode.length !== 0) {
        Toast.info('您已有推荐码，快快完成注册吧。');
      } else {
        try {
          const params = {
            regionId: areaId,
          };
          const response = await postAppForm(Config.GET_PROMOTION_CODE, params);
          if (response.success) {
            if (IS_NOTNIL(response.data)) {
              this.setState({
                promotionCode: response.data,
              });
            }
          } else {
            Toast.fail(response.message);
          }
        } catch (error) {
          Log(error);
        }
      }

    }
  }

  // 下一步按钮事件
  public async nextBtnClick() {
    const { users } = dvaStore.getState();
    const {
      storeName, baseAddress, unionInfo, hrCode, promotionCode, provinceId, cityId, areaName,
      areaId, detailAddress,
    } = this.state;
    const pattern = /[\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\]\^\_\`\{\|\}\~]/;
    // 验证违禁词
    if (throttleFlag) {
      try {
        const results = await getAppJSON(Config.CHECK_SENSITIVE_WORDS, { checkword: storeName }, {}, true);
        throttleFlag = false;
        if (!results.data && name !== '') {
          Toast.info('请不要使用违禁词！');
          this.setState({
            storeName: '',
          });
        }
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => throttleFlag = true, 300);
    }
    
    if (storeName.trim().length <= 1) {
      Toast.info('店铺名字为2～20的常用字符！');
    } else if ((/[\ud800-\udbff][\udc00-\udfff]/g).test(storeName)) {
      Toast.info('亲，不可以使用表情喔!');
    } else if (pattern.test(storeName)) {
      Toast.info('店铺名称不能包含特殊字符!');
    } else if (!baseAddress.trim()) {
      Toast.info('请选择所在地区！');
    } else if (!detailAddress.trim()) {
      Toast.info('请填写详细地址！');
    } else if (!IS_NOTNIL(unionInfo.label)) {
      Toast.info('请选择类别！');
    } else if (!(/^(HR|hr|Hr|hR).{6,18}$/.test(hrCode)) && unionInfo.value === '10') {
      Toast.info('上岗证号必须为HR开头，总长度8-20位！');
    } else if (promotionCode.length === 0) {
      Toast.info('请填写推荐码!');
    } else {
      if (users.mid) { // 我要开店，我的页面入口
        try {
          const params = {
            memberId: users.mid,
            storeName: storeName.trim(),
            memberType: unionInfo.value,
            promotionCode,
            hrCode,
            provinceId,
            cityId,
            regionId: areaId,
            regionName: baseAddress,
            address: detailAddress,
          };
          const response = await postAppForm(Config.SHOP_STORE, params);
          if (response.success) {
            if (IS_NOTNIL(response.data.memberId)) {
              // 存用户信息
              await global.setItem('User', { mid: response.data.memberId, isLogin: true, isHost: 1 });
              this.props.dispatch(createAction('users/saveUsersMsg')({
                mid: response.data.memberId,
                isLogin: true,
                isHost: 1,
              }));
               // 统计埋点代码 gio yl
              const userInfo = dvaStore.getState().users;
              const memberId = userInfo.mid||'';
              NativeModules.StatisticsModule.setUserId(memberId.toString());
              NativeModules.StatisticsModule.setPeopleVariable({
                  name: userInfo.userName||'',
                  mobile: userInfo.mobile||'',
                  email: userInfo.email||'',
                  gender: userInfo.gender||'',
                  birthday: userInfo.birthday||''
                });
              // // 更新token
              // await global.setItem('userToken', 'Bearer' + response.data.member.sessionValue);
              // this.props.dispatch(createAction('users/saveUsersMsg')({
              //   userToken: response.data.member.sessionValue,
              // }));
            }
            // 开店成功后发给社区
            const { params } = this.props.navigation.state;
            const info = {type: 1, tag: 'OpenStore', success: 1};
            if (params && params.callBack) {
                params.callBack(info);
            }
            Toast.success('开店成功', 2, () => this.props.navigation.navigate('ShopApplySuccess'));
          }
        } catch (error) {
          Log(error);
        }
      } else { // 直接注册开店
        try {
          const { mobileNum, password, captcha, imgCaptcha } = this.props.navigation.state.params;
          const params = {
            storeName,
            memberType: unionInfo.value,
            promotionCode,
            hrCode,
            provinceId,
            cityId,
            regionId: areaId,
            regionName: baseAddress,
            address: detailAddress,
            mobileNum,
            password: encodeURIComponent(password),
            captcha,
            imgCaptcha,
          };
          const response = await postAppForm(Config.NEW_SHOP_STORE, params);
          if (response.success) {
            if (IS_NOTNIL(response.data.member)) {
              // 存用户信息
              await global.setItem('User', { ...response.data.member, isLogin: true, isHost: 1 });
              this.props.dispatch(createAction('users/saveUsersMsg')({
                ...response.data.member,
                isLogin: true,
                isHost: 1,
              }));
              // 更新token
              await global.setItem('userToken', 'Bearer' + response.data.member.sessionValue);
              this.props.dispatch(createAction('users/saveUsersMsg')({
                userToken: response.data.member.sessionValue,
              }));
              // 统计埋点代码 gio yl
              const userInfo = dvaStore.getState().users;
              const memberId = userInfo.mid||'';
              NativeModules.StatisticsModule.setUserId(memberId.toString());
              NativeModules.StatisticsModule.setPeopleVariable({
                  name: userInfo.userName||'',
                  mobile: userInfo.mobile||'',
                  email: userInfo.email||'',
                  gender: userInfo.gender||'',
                  birthday: userInfo.birthday||''
                });

              // 开店成功后发给社区
              const { params } = this.props.navigation.state;
              const info = {type: 1, tag: 'OpenStore', success: 1};
              if (params && params.callBack) {
                params.callBack(info);
              }
              Toast.success('开店成功', 2, () => this.props.navigation.navigate('ShopApplySuccess'));
            }
          } else {
            Toast.fail(response.message);
          }
        } catch (error) {
          Log(error);
        }
      }
    }
  }
}
const styles = EStyleSheet.create({
  header: {
    backgroundColor: '#2979FF',
    height: 186,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgBox: {
    width: 80,
    height: 80,
  },
  avatarImage: {
    borderColor: '#84CBFF',
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 4,
  },
  headerText: {
    fontSize: '$fontSize2',
    color: '#FFF',
    marginTop: 20,
  },
  inputField: {
    backgroundColor: '#FFF',
    paddingHorizontal: 5,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '$lightgray',
    height: 48,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  textSize: {
    fontSize: '$fontSize2',
  },
  inputTitle: {
    fontSize: '$fontSize2',
    width: 70,
  },
  promotion: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  promotionButton: {
    color: '#0000fe',
    marginHorizontal: 5,
  },
  nextButton: {
    width: '343rem',
    height: 44,
    alignSelf: 'center',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 22,
  },
});
