import * as React from 'react';
import { View, Text } from 'react-native';
import AddSubtractor from '../../../components/CountEditor';
import EStylesheet from 'react-native-extended-stylesheet';
import Item from '../../../components/ArrowItem';
import { connect, createIdAction } from '../../../utils';
import { ICustomContain } from '../../../interface';
import { CountStyleType } from './CountStyle';

interface IGoodsCountProps {
  productAttribute:number;
  modelId?: string;
  count?: number | string;
  stockNum?: number;
  beModel?: boolean;
  attrValueName?: string;
}

const GoodsCount: React.SFC<IGoodsCountProps & ICustomContain> = ({productAttribute, modelId, count, stockNum, attrValueName, beModel, dispatch }) => (
  beModel ?
  <Item
    title={attrValueName ? `已选:${attrValueName}` : '选择数量/规格'}
    onClick={() => dispatch(createIdAction('goodsDetail/changeUIState')({ modelId, showCountType: CountStyleType.Show }))}
  /> :
  <View style={styles.container}>
    <View style={styles.countContain}>
      <Text>数量</Text>
      <AddSubtractor
        // maxValue={stockNum || 1}
        productAttribute={productAttribute}
        maxValue={ stockNum }
        style={styles.adds} value={count || 0}
        onValueChange={(number) => dispatch(createIdAction('goodsDetail/changeProductInfo')({ modelId, number }))}
        edited={(productAttribute==0||productAttribute==1||productAttribute==undefined)?true:false}
      />
    </View>
    {
        stockNum > 0 ? <Text>{`库存：${stockNum}`}</Text> : <Text style={styles.hasStock}>无货</Text>
    }
  </View>
);

GoodsCount.defaultProps = {
  count: 0,
};

const mapStateToProps = (
  {
    goodsDetail,
  },
  { modelId },
) => {
  try {
    return {
      productAttribute: goodsDetail.getIn([modelId, 'data', 'product', 'productAttribute']),
      stockNum: goodsDetail.getIn([modelId, 'pfData', 'stockNum']),
      count: goodsDetail.getIn([modelId, 'productInfo', 'number']),
      attrValueName: goodsDetail.getIn([modelId, 'productInfo', 'productAttInfo', 'attrValueName']),
      beModel: !!(goodsDetail.getIn([modelId, 'attData']) && goodsDetail.getIn([modelId, 'attData']).size > 0),
    };
  } catch (error) {
    Log(error);
    return { stockNum: 0, count: 1, attrValueName: '', beModel: false };
  }
};

export default connect(mapStateToProps)(GoodsCount);

const styles = EStylesheet.create({
  itemContian: {
    height: '48rem',
  },
  itemTitle: {
    color: '#333333',
    fontSize: '14rem',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 16,
    marginRight: 16,
    borderBottomWidth: 1,
    borderColor: '#EFEFEF',
    height: '48rem',
  },
  countContain: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  adds: {
    marginLeft: 8,
    width: '120rem',
    height: '26rem',
  },
  hasStock: {
    color: '$darkred',
    fontSize: '$fontSize3',
  }
});
