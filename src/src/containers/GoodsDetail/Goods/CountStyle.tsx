import * as React from 'react';
import { View, Modal, Image, Text, ScrollView, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Button from 'rn-custom-btn1';
import Filter from '../../../components/Filter';
import AddSubtractor from '../../../components/CountEditor';
import { connect, createAction, createIdAction } from '../../../utils';
import { IGoodsAttribute, ICustomContain, IProductInfo } from '../../../interface';
import GoodsBottom from '../GoodsBottom';

export enum CountStyleType { None, Show, AddCart, BuyNow }
export interface ICountStyleProps {
  confirm?: () => void;
  productId?: string;
  sgAttributeArr: any;
  hasStockSgItems: any;
  showCountType?: CountStyleType;
  modelId: string;
  commissionRate?: number;
  isHost?: boolean;
  CommissionNotice?: boolean;
  price: number;
  stockNum: number;
  pic: string;
  attrValueName: string;
  skkuArray: any;
  attrArray: any;
  isChoseSkku: any;
  productAttribute?:number;
}

export interface ICountStyleState {
  id?: string;
  colorIndex: number;
  sizeIndex: number;
  bigPic: boolean;
}

let disableFunList = [];
let hasChecked = '';
let hasCheckedPid = [];
Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
function sortNumber(a, b) {
  return a - b
}

const mapStateToProps = ({ goodsDetail, users }, { modelId }) => {
  try {
    const { isHost, CommissionNotice } = users || { isHost : 0, CommissionNotice: false };
    return {
      sgAttributeArr: goodsDetail.getIn([modelId, 'attData', 'sgAttributeArr']),
      isChoseSkku: goodsDetail.getIn([modelId, 'productInfo', 'isChoseSkku']),
      hasStockSgItems: goodsDetail.getIn([modelId, 'attData', 'hasStockSgItems']),
      skkuArray: goodsDetail.getIn([modelId, 'attData', 'skkuArray']),
      attrArray: goodsDetail.getIn([modelId, 'attData', 'attrArray']),
      attrValueNames: goodsDetail.getIn([modelId, 'productInfo', 'attrValueNames']),
      productDefaultIcon: goodsDetail.getIn([modelId, 'productInfo', 'productDefaultIcon']),
      price: goodsDetail.getIn([modelId, 'productInfo', 'productAttInfo', 'price']),
      stockNum: goodsDetail.getIn([modelId, 'productInfo', 'productAttInfo', 'num']),
      pic: goodsDetail.getIn([modelId, 'productInfo', 'productAttInfo', 'pic']),
      attrValueName: goodsDetail.getIn([modelId, 'productInfo', 'productAttInfo', 'attrValueName']),
      number: goodsDetail.getIn([modelId, 'productInfo', 'number']),
      showCountType: goodsDetail.getIn([modelId, 'uiState', 'showCountType']),
      productId: goodsDetail.getIn([modelId, 'productId']),
      commissionRate: goodsDetail.getIn([modelId, 'pfData', 'commissionRate']),
      isHost,
      CommissionNotice,
      productAttribute: goodsDetail.getIn([modelId, 'data', 'product', 'productAttribute']),
    };
  } catch (error) {
    Log(error);
    return { sgAttributeArr: null };
  }
};
@connect(mapStateToProps)
export default class CountStyle extends React.PureComponent<
  ICountStyleProps & ICustomContain & IProductInfo,
  ICountStyleState
> {
  constructor(props: ICountStyleProps) {
    super(props);

    this.state = {
      colorIndex: 0,
      sizeIndex: 0,
      bigPic: true,
    };
  }

  public componentDidMount() {
    hasChecked = '';
    hasCheckedPid = [];
  }

  public render(): JSX.Element {
    const {
      sgAttributeArr, hasStockSgItems, showCountType, confirm, attrValueNames, productDefaultIcon, number, price, productId, modelId, commissionRate, isHost, CommissionNotice, stockNum, pic, attrValueName, skkuArray, attrArray, isChoseSkku,productAttribute
    } = this.props;
    if (!sgAttributeArr) { return null; }
    return (
      this.state.bigPic?
      <Modal
        animationType='slide'
        transparent={true}
        visible={showCountType !== CountStyleType.None}
      >
        <View style={styles.bg}>
          <View style={styles.container}>
            <Button
              style={styles.closeBtn}
              image={require('../../../images/close_circle_black.png')}
              onPress={() => this.props.dispatch(createIdAction('goodsDetail/changeUIState')({ modelId, showCountType: CountStyleType.None }))}
              imageStyle={styles.closeImg}
            />
            <CSHeader
              onChange={() => { this.setState({ bigPic: false }) }}
              defaultSource={productDefaultIcon}
              price={price}
              stockNum={stockNum}
              pic={pic}
              attrValueName={attrValueName}
              commissionRate={commissionRate}
              isHost={isHost && CommissionNotice}
            />
            <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>
              <View style={styles.separator} />
              {sgAttributeArr && sgAttributeArr.map((item,index) => [
                <Filter
                  key={item.get('attrCode')}
                  title={item.get('attrName')}
                  selectItem={attrValueNames.getIn([item.get('attrCode'), 'id'])}
                  contentArr={item.get('attItemArr')}
                  disableFun={(itemId) => {
                      const willAttMap = { [item.get('attrCode')]: { id: itemId } };
                      const willAttrValueNames = attrValueNames.merge(willAttMap);
                      let keyName = '';
                      let valueName = '';
                      willAttrValueNames.map((value, key) => {
                        if (value && value.toJS().id.id) {
                          keyName = keyName + key + ',';
                          valueName = valueName + value.toJS().id.id + ',';
                        }
                      });
                    let keyValue = (keyName + valueName);
                    keyValue = keyValue.substring(0, keyValue.length - 1);
                    if(disableFunList.indexOf(valueName) == -1){
                      disableFunList.push(valueName);
                    }
                    let nowhasCheckedPid = [];
                    nowhasCheckedPid = [].concat(hasCheckedPid); 
                    if (nowhasCheckedPid.join(',').indexOf(keyValue) == -1){
                      if (nowhasCheckedPid.join(',').split(',').indexOf(keyName.split(',')[0]) == -1) {
                        keyValue =  keyName.split(',')[0] + ',' + valueName.split(',')[0] + ',' + nowhasCheckedPid.join(',');
                      }else{
                        nowhasCheckedPid.splice(nowhasCheckedPid.join(',').split(',').indexOf(keyName.split(',')[0]) / 2, 1);
                        keyValue = keyName.split(',')[0] + ',' + valueName.split(',')[0] + ',' + nowhasCheckedPid.join(',');
                      }
                    }else{
                      keyValue = nowhasCheckedPid.join(',');
                    }

                    hasChecked = '';
                    for (let a = 0; a < keyValue.split(',').length; a++) {
                      if (a % 2 != 0) {
                        if (hasChecked.indexOf(keyValue.split(',')[a]) == -1) {
                          hasChecked = hasChecked + ',' + keyValue.split(',')[a];
                        }
                      }
                    }
                    let sortList = hasChecked.split(',');
                    hasChecked = sortList.sort(sortNumber).join(',');
                    if (hasStockSgItems.indexOf(hasChecked) === -1) {
                      return true;
                    } else {
                      return false;
                    }
                  }}
                  onPress={(beSelected, ftItem) => {
                    if (!beSelected){
                      if (hasCheckedPid.join(',').split(',').indexOf(item.get('attrCode')) == -1){
                        hasCheckedPid.push(item.get('attrCode') + ',' +ftItem.id);
                      } else {
                        hasCheckedPid.splice(hasCheckedPid.join(',').split(',').indexOf(item.get('attrCode')) / 2, 1);
                        hasCheckedPid.push(item.get('attrCode') + ',' + ftItem.id);
                      }
                    }else{
                      hasCheckedPid.remove(item.get('attrCode') + ',' + ftItem.id);
                    }

                    let hasD = [];
                    for (let a = 0; a < hasCheckedPid.join(',').split(',').length; a++) {
                      if (a % 2 != 0) {
                        if (hasD.indexOf(hasCheckedPid.join(',').split(',')[a]) == -1) {
                          hasD.push(hasCheckedPid.join(',').split(',')[a]);
                        }
                      }
                    }
                    let listSort = '';
                    listSort = hasD.sort(sortNumber).join(',');
                    if (attrArray.toJS().indexOf(listSort) != -1){
                      this.props.dispatch(createIdAction('goodsDetail/pressProductAttrSkku')({
                        modelId,isChoseSkku:skkuArray.toJS()[attrArray.toJS().indexOf(listSort)],
                      }));
                    }else{
                      this.props.dispatch(createIdAction('goodsDetail/pressProductAttrSkku')({
                        modelId, isChoseSkku:'',
                      }));
                    }

                    
                    this.props.dispatch(createIdAction('goodsDetail/pressProductAtt')({
                      modelId,
                      [item.get('attrCode')]: beSelected ? {} : { id: ftItem.id, attrValueName: ftItem.attrValueName, indexAVN: item.get('attrName') },
                    }));
                  }}
                />,
                <View style={styles.separator} />,
              ])}
              <View style={styles.separator} />
              <View style={styles.countContain}>
                <Text style={styles.buyCount}>购买数量</Text>
                <AddSubtractor
                  style={styles.addSub}
                  value={number}
                  edited={true}
                  productAttribute={productAttribute}
                  // maxValue={stockNum || 1}
                  maxValue={ stockNum }
                  onValueChange={(value) =>
                    this.props.dispatch(createIdAction('goodsDetail/changeProductInfo')({ modelId, number: value }))
                  }
                />
              </View>
              <View style={styles.separator} />
              <View style={{ flex: 1 }}/>
              </ScrollView>
              {showCountType !== CountStyleType.Show ?
                <Button
                  style={styles.confirm} title='确定'
                  onPress={() => this.confirm()}
                  local={{ textColor: 'white', fontSize: 17 }}
                /> :
                <GoodsBottom modelId={modelId} />
              }
            </View>
          </View>
        </View>
      </Modal>
      :
        <Modal> 
          <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.setState({ bigPic: true }) }}>
            <Image style={{flex:1}} resizeMode='contain' source={{ uri: pic || productDefaultIcon}} />
          </TouchableOpacity>
       </Modal>
    );
  }

  private confirm = () => {
    const { dispatch, showCountType, modelId, productId } = this.props;
    if (showCountType === CountStyleType.Show) {
      dispatch(createIdAction('goodsDetail/changeUIState')({ modelId, showCountType: CountStyleType.None }));
    } else if (showCountType === CountStyleType.AddCart) {
      // dispatch(createIdAction('goodsDetail/changeState')({ productId, showCountType: CountStyleType.None }));
      dispatch(createIdAction('goodsDetail/addCart')({ modelId }));
    } else if (showCountType === CountStyleType.BuyNow) {
      // dispatch(createIdAction('goodsDetail/changeState')({ productId, showCountType: CountStyleType.None }));
      // dispatch(createAction('order/putPageInfo')({ modelId, productId}));
      dispatch(createAction('goodsDetail/checkStockForNum')({ modelId }));
    }
  }
}

interface ICSHeaderProps {
  onChange: ()=>void;
  defaultSource: any;
  source?: any;
  price?: number;
  stockNum?: string|number;
  pic: string;
  attrValueName: string;
  commissionRate: number;
  isHost: boolean;
  style?: object;
}

const CSHeader: React.SFC<ICSHeaderProps> = ({source, defaultSource, price, stockNum, pic, attrValueName, commissionRate, isHost, style, onChange }) => (
  <View style={[styles.cshContain, style]}>
    <TouchableOpacity style={styles.cshImageContain} onPress={onChange}>
        <Image style={styles.cshImage} resizeMode='contain' source={{uri: cutImgUrl((pic || defaultSource), 92)}} />
    </TouchableOpacity>
    <View style={styles.cshBg}>
      <View style={styles.cshContent}>
      {(price ||price===0)&&
        <View style={styles.cshpriceView}>
          <Text style={styles.cshprice}>{`￥${price}`}</Text>
          {!!(isHost && price * commissionRate > 0) && [
            <Image style={styles.hongbaoImage} source={require('../../../images/hongbao.png')}/>,
            <Text style={styles.cshprice}>{`￥${(price * commissionRate).toFixed(2)}`}</Text>,
          ]}
        </View>
      }
        {stockNum > 0 && <Text style={styles.cshText}>{`库存 ${stockNum}`}</Text>}
        {attrValueName ? <Text style={styles.cshText}>已选:{attrValueName}</Text> : <Text style={styles.cshText}>'请选择参数'</Text>  }
      </View>
    </View>
  </View>
);

const styles = EStyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flexDirection: 'column-reverse',
  },
  container: {
    height: '514rem',
    width: '375rem',
  },
  closeBtn: {
    zIndex: 100,
    width: '32rem',
    height: '32rem',
    position: 'absolute',
    right: 8,
    top: 16,
  },
  closeImg: {
    width: '20rem',
    height: '20rem',
  },
  separator: {
    marginLeft: 8,
    width: '375rem - 16',
    height: 1,
    backgroundColor: '#E4E4E4',
  },
  confirm: {
    width: '375rem',
    height: '48rem',
    backgroundColor: '#2979FF',
    marginBottom: '$xBottom',
  },
  countContain: {
    alignItems: 'center',
    width: '375rem',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  buyCount: {
    fontSize: '13rem',
  },
  addSub: {
    width: '96rem',
    height: '27rem',
  },

  // header
  cshContain: {
    height: '102rem + 16',
    width: '375rem',
  },
  cshBg: {
    marginTop: 16,
    height: '102rem',
    width: '375rem',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  cshImageContain: {
    borderRadius: 5,
    padding: 8,
    backgroundColor: 'white',
    left: 8,
    top: 0,
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#E4E4E4',
    zIndex: 1,
  },
  cshImage: {
    width: '92rem',
    height: '92rem',
  },
  cshContent: {
    marginLeft: '107rem + 20',
  },
  cshpriceView: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 4,
  },
  hongbaoImage: {
    width: '18rem',
    height: '18rem',
    marginLeft: 8,
  },
  cshprice: {
    fontSize: '16rem',
    color: '$darkred',
  },
  cshText: {
    fontSize: '13rem',
    margin: 4,
  },
});
