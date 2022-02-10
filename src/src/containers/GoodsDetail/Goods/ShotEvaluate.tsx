import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Button from 'rn-custom-btn1';
import EvaluateRow from '../Evaluate/ListItem';
import { IEvaluateProps, IEvaluateCount } from '../../../interface';
import EStyleSheet from 'react-native-extended-stylesheet';
import Item from '../../../components/ArrowItem';
import { connect } from '../../../utils';

interface IShotEvaluateProps {
  rowData?: IEvaluateProps;
  modelId?: string;
  checkClick?: () => void;
}

const ShotEvaluate: React.SFC<IShotEvaluateProps & IEvaluateCount> = ({
  rowData, checkClick, totalNum, positiveRate,
}) => {
  if (!rowData) { return null; }
  const titleText = totalNum > 0 ? `商品评价（${totalNum}）` : '商品评价';
  return (
    <TouchableOpacity
        activeOpacity={1}
        onPress={() => checkClick()}>
      <View style={styles.container}>
        <Item>
          <View style={styles.title}>
            <Text style={styles.titleText}>{titleText}</Text>
            <Text style={styles.positiveRate}>{`${positiveRate}%好评`}</Text>
          </View>
        </Item>
        <EvaluateRow {...rowData.toJS()} style={{ borderTopWidth: 0 }} />
        <Button title='查看全部评价' textStyle={styles.checkText} style={styles.checkBtn} onPress={() => checkClick() }/>
      </View>
    </TouchableOpacity>
  );
};

const mapStateToProps = (
  {
    goodsDetail,
  },
  { modelId },
) => {
  try {
    return {
      rowData: goodsDetail.getIn([modelId, 'evaluate', 'shortEvaluate']),
      totalNum: goodsDetail.getIn([modelId, 'evaluate', 'evaluateCount', 'totalNum']) || 0,
      positiveRate: goodsDetail.getIn([modelId, 'evaluate', 'evaluateCount', 'positiveRate']) || 100,
    };
  } catch (error) {
    Log(error);
    return {};
  }
};

export default connect(mapStateToProps)(ShotEvaluate);

const styles = EStyleSheet.create({
  container: {
    alignItems: 'center',
    width: '375rem',
    borderTopWidth: 8,
    borderTopColor: '#EBECF3',
  },
  title: {
    flex: 1,
    flexDirection: 'row',
    height: '48rem',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
  },
  titleText: {
    color: '$darkblack',
    fontSize: '$fontSize3',
    height:'48rem',
    lineHeight:'48rem',
  },
  positiveRate: {
    color: '$black',
    fontSize: '$fontSize2',
    height: '48rem',
    lineHeight: '48rem',
  },
  checkBtn: {
    borderWidth: 1,
    borderRadius: '17rem',
    borderColor: '$darkred',
    height: '33rem',
    paddingHorizontal: '16rem',
    marginBottom: 16,
  },
  checkText: {
    color: '$darkred',
  },
});
