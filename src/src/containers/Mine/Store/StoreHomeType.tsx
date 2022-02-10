import * as React from 'react';
import { View, ScrollView, Text, StyleSheet, Platform } from 'react-native';
import { ICustomContain } from '../../../interface/index';
import { Radio, Flex } from 'antd-mobile';
import EStyleSheet from 'react-native-extended-stylesheet';

const RadioItem = Radio.RadioItem;

interface IState {
  types: IType[];
}

interface IType {
  productCateId: string;
  text: string;
  onChoose?: (productCateId: string) => any;
}

class StoreHomeType extends React.Component<ICustomContain, IState> {
  public constructor(props) {
    super(props);
    this.state = {
      types: [{text: '全部', productCateId: '0'}],
    };
  }
  public componentDidMount() {
    this.setState({
      types: [
        ...this.state.types,
        ...[
          {text: '冰箱', productCateId: '2723'},
          {text: '洗衣机', productCateId: '2725'},
          {text: '空调', productCateId: '2729'},
          {text: '彩电', productCateId: '2743'},
          {text: '热水器', productCateId: '2741'},
          {text: '厨房电器', productCateId: '2742'},
          {text: '冷柜', productCateId: '2724'},
          {text: '智能产品', productCateId: '2973'},
          {text: '生活家电', productCateId: '2737'},
          {text: '水家电', productCateId: '2774'},
          {text: '冰吧酒柜', productCateId: '2862'},
          {text: '家庭医疗', productCateId: '2736'},
          {text: '家用中央空调', productCateId: '2811'},
          {text: '农产品', productCateId: '3093'},
          {text: '顺逛超市', productCateId: '3099'},
          {text: '健康器材', productCateId: '3329'},
          {text: '3C数码', productCateId: '2739'},
          {text: '生活服务', productCateId: '3315'},
        ],
      ],
    });
  }
  public render(): JSX.Element {
    return (
      <ScrollView style={{backgroundColor: '#F6F6F6'}}>
        {
          this.state.types.map(
            (item, index) =>
              <RadioRow
                {...item}
                activeId={this.props.navigation.state.params.productCateId}
                key={index}
                onChoose={() => this.onChoose(item.productCateId)}
              />,
          )
        }
      </ScrollView>
    );
  }
  private onChoose = (productCateId: string) => {
    this.props.navigation.state.params.setProductCateId(productCateId);
    this.props.navigation.goBack();
  }
}

const RadioRow = ({productCateId, text, onChoose, activeId}) => (
  <View>
    <RadioItem
      key={productCateId}
      styles={estyles.itemText}
      checked={ activeId === productCateId }
      onChange={() => onChoose(productCateId)}>
      <View style={{flex: 1}}>
        <Text style={{marginTop: 8}}>{text}</Text>
        {
          Platform.OS === 'android' && <View style={[estyles.yuanquan, {right: activeId === productCateId ? -20 : -5}]}/>
        }
        {
          Platform.OS === 'ios' && <View style={estyles.yuanquan}/>
        }

      </View>
    </RadioItem>
  </View>
);

const estyles = EStyleSheet.create({
  itemText: {
    fontSize: 15,
    backgroundColor: 'red',
  },
  yuanquan: {
    position: 'absolute',
    height: 26,
    width: 26,
    backgroundColor: 'transparent',
    top: 4,
    right: -20,
    '@media android': {
      right: 0,
    },
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'gray',
  },
});

export default StoreHomeType;
