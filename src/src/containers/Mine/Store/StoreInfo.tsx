import * as React from 'react';
import { ScrollView } from 'react-native';
import { List, ActivityIndicator, Modal, Toast } from 'antd-mobile';
import { INavigation } from '../../../interface/index';
import Config from 'react-native-config';
import {getAppJSON} from '../../../netWork';

interface IStore {
  memberId: number;
  storeName: string;
  address: string;
  league: string;
    regionName: string;
}

const { Item } = List;
const { prompt } = Modal;

/**
 * 店铺详情
 */
class StoreInfo extends React.Component<INavigation, IStore> {
  public state: IStore = {
    memberId: 0,
    storeName: '',
    address: '',
    league: '',
  };
  public componentDidMount(): void {
    this.getStoreInfo();
  }
  public componentWillUnmount() {
    const { callBack } = this.props.navigation.state.params;
    if (callBack) {
        callBack();
    }
}
  public render(): JSX.Element {
    return (<ScrollView>
      {this.renderList()}
    </ScrollView>);
  }
  private renderList = (): JSX.Element => {
      return (<List>
        <Item  extra={this.state.memberId} >店主ID</Item>
        <Item arrow='horizontal' extra={this.state.storeName} onClick={
          () => prompt('店铺名称', '请输入新的店铺名称',
          [
            {
              text: '取消',
            },
            {
              text: '确定',
              // onPress: value => new Promise((resolve) => {
              //   Toast.info('修改成功', 1);
              //   setTimeout(() => {
              //     this.setState({storeName: value});
              //     resolve();
              //   }, 1000);
              // }),
              onPress: value => this.changeName(value),
            },
          ], 'default', null, [this.state.storeName])
        }>
          店铺名称
        </Item>
        <Item extra={`${this.state.regionName}${this.state.address}`} multipleLine wrap>地址</Item>
        <Item extra={this.state.league}>联盟</Item>
      </List>);
  }
  // http://m.ehaier.com/v3/mstore/sg/store/changeStoreName.html?wdName=stone1
  private getStoreInfo = async () => {
    try {
      const { success, data } = await getAppJSON(Config.STORE_INFO, {}, {}, true);
      Log( 'daata***************', data );
      if (!success || !data) { return; }
      this.setState({memberId: data.storeInfo.memberId, storeName: data.storeInfo.storeName,
        address: data.storeInfo.address, regionName: data.storeInfo.regionName, league: data.storeInfo.memberName});
        // data.storeInfo.regionName
      } catch (error) {
      Log(error);
    }
  }
  // 修改店铺名称
  private changeName = async (name) => {
    try {
      if (name === null || name === '' || name === undefined) {
        Toast.info('店铺名称不能为空');
      } else {
        const { success, data } = await getAppJSON(Config.STORE_CHANGNAME + '?wdName=' + name, {}, {}, true);
        if (success) {
        Toast.info('修改成功');
        this.setState({storeName: name});
        } else {
        Toast.info('修改失败');
        }
      }
    } catch (error) {
        Log(error);
    }
}

}

export default StoreInfo;
