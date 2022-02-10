import * as React from 'react';
import { ScrollView, Image, DeviceEventEmitter } from 'react-native';
import { List } from 'antd-mobile';
import { INavigation } from '../../../interface';
import { connect } from 'react-redux';
import { getAppJSON } from '../../../netWork';

interface IProps {
  mid: number;
}

interface IState {
  imgUrl: string;
}

import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

const Item = List.Item;

/**
 * 店铺装修
 */
@connect(({users: { mid }}) => ({mid}))
class ShopRenovate extends React.Component<INavigation & IProps, IState> {
  public constructor(props) {
    super(props);
    this.state = {
      imgUrl: '',
    };
  }
  public componentWillMount() {
    DeviceEventEmitter.addListener('afterSetShopCover', this.refreshCover);
  }
  public componentDidMount() {
    this.getShopCover();
  }
  public render(): JSX.Element {
    const { navigation } = this.props;
    return (
      <ScrollView>
        <List>
          <Item arrow={'horizontal'} onClick={() => navigation.navigate('ChoosingShopTemplate')}>
            店铺模版
          </Item>
          <Item
            arrow={'horizontal'}
            extra={
              <Image
                style={{
                  height: 50,
                  width: width * 0.3,
                }}
                source={{uri: this.state.imgUrl}}/>
            }
            onClick={() => navigation.navigate('SetShopCover')}
          >
            店铺封面
          </Item>
        </List>
      </ScrollView>
    );
  }
  public componentWillUnmount() {
    DeviceEventEmitter.removeListener('afterSetShopCover', this.refreshCover);
  }
  private getShopCover = async () => {
    const { mid: storeId } = this.props;
    const { success, data } = await getAppJSON('v3/mstore/sg/store/wdShopCover.html', {storeId});
    if (success && data) {
      if (data.shopCover.constructor === Array) {
        for (const cover of data.shopCover) {
          if (cover.selected) {
            this.setState({imgUrl: cover.coverUrl});
          }
        }
      }
    }
  }
  private refreshCover = () => this.getShopCover();
}

export default ShopRenovate;
