import * as React from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  DeviceEventEmitter,
} from 'react-native';
import { Grid, Toast } from 'antd-mobile';
import { INavigation } from '../../../interface';
import EStyleSheet from 'react-native-extended-stylesheet';
import { getAppJSON, postAppForm } from '../../../netWork';
import { connect } from 'react-redux';

import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

interface IProps {
  mid: number;
}

interface IState {
  coverList: any[];
}

/**
 * 设置店铺封面
 */
@connect(({users: { mid }}) => ({mid}))
export default class SetShopCover extends React.Component<INavigation & IProps, IState> {
  public constructor(props) {
    super(props);
    this.state = {
      coverList: [],
    };
  }
  public componentDidMount() {
    this.getShopCover();
  }
  public render(): JSX.Element {
    return (
      <ScrollView>
        <View style={estyles.titleStyle}>
          <Text style={estyles.titleFontStyle}>选择店铺封面</Text>
        </View>
        <Grid data={this.state.coverList}
              columnNum={3}
              hasLine={false}
              renderItem={dataItem => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={estyles.gridPadding}
                  onPress={
                    () => this.setShopCover(dataItem.coverUrl)
                  }
                >
                  <View style={estyles.titleImageWrapperStyle}>
                    <Image source={{uri: dataItem.coverUrl}} style={estyles.titleImageStyle}/>
                    <View style={estyles.yuanquan}>
                      {
                        dataItem.selected === true && <Image
                          style={estyles.selectedImgStyle}
                          source={require('../../../images/ic_select.png')}
                        />
                      }
                    </View>
                  </View>
                </TouchableOpacity>
              )}
        />
      </ScrollView>
    );
  }
  private getShopCover = async () => {
    try {
      const {mid: storeId} = this.props;
      const { success, data } = await getAppJSON('v3/mstore/sg/store/wdShopCover.html', {storeId});
      if (success && data) {
        if (data.shopCover) {
          this.setState({coverList: data.shopCover});
        }
      }
    } catch (err) {
      Log(err);
    }
  }
  private setShopCover = async (coverUrl) => {
    try {
      if (!coverUrl) {
        return;
      }
      const { success } = await postAppForm('v3/mstore/sg/store/changeShopCover.json', {url: coverUrl});
      if (success) {
        Toast.info('修改店铺模板成功', 0.5, () => {
          this.getShopCover();
          DeviceEventEmitter.emit('afterSetShopCover',  {});
        });
      }
    } catch (err) {
      Log(err);
    }
  }
}
const estyles = EStyleSheet.create({
  gridPadding: {
    padding: '5rem',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleStyle: {
    width,
    height: '50rem',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingLeft: '16rem',
  },
  titleFontStyle: {
    fontSize: '16rem',
  },
  titleImageWrapperStyle: {
    width: '90rem',
    height: '60rem',
  },
  titleImageStyle: {
    width: '85rem',
    height: '55rem',
    padding: '5rem',
  },
  yuanquan: {
    position: 'absolute',
    height: 20,
    width: 20,
    backgroundColor: 'transparent',
    bottom: 4,
    right: 4,
    '@media android': {
      right: 0,
    },
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
  selectedImgStyle: {
    height: 18,
    width: 18,
  },
})
