import * as React from 'react';
import { View, Modal, Image, Text, FlatList } from 'react-native';
import { UltimateListView } from 'rn-listview';
import { getAppJSON } from '../../../netWork';
import { createIdAction, createAction, connect } from '../../../utils';
import { ICustomContain } from '../../../interface';
import Config from 'react-native-config';
import EStyleSheet from 'react-native-extended-stylesheet';
import Button from 'rn-custom-btn1';

interface IBaiTiaoProps {
  modelId: string;
  productId?: string;
  showBaitiao?: boolean;
  isRefresh?: boolean;
  costInfo?: any;
  crdComAvailAmt?: string;
  feeInfo?: string;
}

const mapStateToProps = ({ goodsDetail }, { modelId }) => {
  try {
    return {
      isRefresh: goodsDetail.getIn([modelId, 'baiTiao', 'isRefresh']),
      costInfo: goodsDetail.getIn([modelId, 'baiTiao', 'costInfo']),
      crdComAvailAmt: goodsDetail.getIn([modelId, 'baiTiao', 'crdComAvailAmt']),
      feeInfo: goodsDetail.getIn([modelId, 'baiTiao', 'feeInfo']),
      productId: goodsDetail.getIn([modelId, 'productId']),
      showBaitiao: goodsDetail.getIn([modelId, 'baiTiao', 'showBaitiao']),
    };
  } catch (error) {
    Log(error);
    return { costInfo: null };
  }
};
@connect(mapStateToProps)
export default class BaiTiao extends React.PureComponent<IBaiTiaoProps & ICustomContain> {
  private listView: any;

  constructor(props: IBaiTiaoProps) {
    super(props);
  }

  public render(): JSX.Element {
    if (!this.props.costInfo) { return null; }
    const { modelId, showBaitiao, dispatch, isRefresh, costInfo, crdComAvailAmt, feeInfo } = this.props;
    return (
      <Modal
        animationType='slide'
        transparent={true}
        visible={showBaitiao}
      >
        <View style={styles.bg}>
          <View style={styles.container}>
            <Button
              style={styles.closeBtn}
              image={require('../../../images/close_circle_black.png')}
              onPress={() => dispatch(createIdAction('goodsDetail/closeBaiTiaoModle')({ modelId}))}
              imageStyle={styles.closeImg}
            />
            <View style={styles.title}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../../../images/baitiao.png')} style={styles.baitiao} />
                <Text style={styles.baitiaoText}>{feeInfo}</Text>
              </View>
              <Text style={styles.baitiaoTitle}>打白条请到到支付页</Text>
            </View>
            <FlatList
              style={{flex: 1}}
              data={costInfo.toJS()}
              keyExtractor={(item, index) => `keys${index}`}
              renderItem={({ item }) => this.renderRow(item)}
            />
            {/* <UltimateListView
              style={{ flex: 1 }}
              ref={ref => this.listView = ref}
              refreshable={false}
              item={this.renderRow}
              onFetch={this.onFetch}
              listData={costInfo}
              pageLimit={10}
              isRefreshing={isRefresh}
              keyExtractor={(item, index) => `keys${index}`}
            /> */}
            {!!crdComAvailAmt ?
              <View style={styles.moneyView}>
                <Text style={styles.money}>{`可用额度：${crdComAvailAmt}`}</Text>
              </View> :
              <Button
                title={'申请激活'}
                style={styles.liveBtn}
                textStyle={styles.liveText}
                onPress={() => {
                  dispatch(createIdAction('goodsDetail/changeState')({ modelId, baiTiao: { showBaitiao: false } }));
                  dispatch(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'BaiTiao' }));
                }}
              />
            }
          </View>
        </View>
      </Modal>
    );
  }

  private renderRow = ({ num, rate, fee, eachPrinAndFee }) => {
    const title = num === 0 ? '不分期' : `￥${eachPrinAndFee} × ${num} 期`;
    const content = num === 0 ? '先用后付，无服务费' : `含服务费：每期￥${fee}，费率：${rate}%`;
    return (
      <View  style={styles.row}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowContent}>{content}</Text>
      </View>
    );
}

  private onFetch = async (page = 1, pageLimit, abortFetch) => {
    const { dispatch, productId, modelId } = this.props;
    if (this.props.costInfo.length > 0) {
      abortFetch();
      return;
    }
  }
}

const styles = EStyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flexDirection: 'column-reverse',
  },
  moneyView: {
    width: '375rem',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '$xBottom',
    backgroundColor:  'rgba(41, 121, 255, 0.3)',
  },
  money: {
    color: '$darkblue',
    fontSize: '$fontSize4',
  },
  closeBtn: {
    zIndex: 100,
    width: '32rem',
    height: '32rem',
    position: 'absolute',
    right: 8,
    top: 8,
  },
  closeImg: {
    width: '20rem',
    height: '20rem',
  },
  container: {
    height: '514rem',
    width: '375rem',
    backgroundColor: 'white',
  },
  title: {
    width: '375rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '$lightgray',
  },
  baitiao: {
    width: '30rem',
    height: '30rem',
    margin: 4,
  },
  baitiaoText: {
    fontSize: '$fontSize4',
    color: '$darkblack',
  },
  baitiaoTitle: {
    fontSize: '$fontSize2',
    color: '$black',
    marginBottom: 8,
  },
  row: {
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '$lightgray',
    // width: '375rem',
    // height: '50rem',
    // backgroundColor: 'red',
  },
  rowTitle: {
    margin: 8,
    fontSize: '$fontSize4',
    color: '$darkblack',
  },
  rowContent: {
    margin: 8,
    fontSize: '$fontSize2',
    color: '$black',
  },
  liveBtn: {
    width: '375rem',
    height: 44,
    backgroundColor: '$darkblue',
    marginBottom: '$xBottom',
  },
  liveText: {
    color: 'white',
    fontSize: '$fontSize2',
  },
});
