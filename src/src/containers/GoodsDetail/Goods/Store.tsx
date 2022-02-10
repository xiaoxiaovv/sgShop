import * as React from 'react';
import { IO2OStore, ICustomContain } from '../../../interface';
import { connect, createAction } from '../../../utils';
import {View, Image, Text, Linking, NativeModules} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Button from 'rn-custom-btn1';
import Item from '../../../components/ArrowItem';
import { cutImgUrl } from '../../../utils'

interface ISore {
  modelId?: string;
  vrUrl?: string;
  productAttribute?:number;
}

const Store: React.SFC<ISore & IO2OStore & ICustomContain> = ({ avatarImageFileId, O2OStoreName, productGrade, serviceGrade, logisticalGrade, mobile, o2oStoreId, vrUrl, dispatch ,productAttribute }) => {
  return (
    <View>
      {(O2OStoreName && productAttribute!=2 )? <View style={styles.contain}>
        <View style={styles.nameView}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex:1 }}>
            <Image
              source={{ uri: cutImgUrl(avatarImageFileId, 32) }}
              defaultSource={require('../../../images/default_icon.png')}
              style={styles.icon}
            />
            <Text style={styles.name}>{O2OStoreName}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 13, color: '#666' }}>商品描述 {productGrade}</Text>
            <Text style={{ fontSize: 13, color: '#666' }}>卖家服务 {serviceGrade}</Text>
            <Text style={{ fontSize: 13, color: '#666' }}>物流服务 {logisticalGrade}</Text>
          </View>
        </View>
        <View style={styles.btnView}>
          <Button
            style={styles.btn}
            textStyle={styles.btnText}
            title='进店逛逛'
            onPress={() => dispatch(createAction('router/apply')({
              type: 'Navigation/NAVIGATE', routeName: 'StoreHome', params: { storeId: o2oStoreId },
            }))}
          />
          {mobile
              ? <Button style={styles.btn} textStyle={styles.btnText} title='拨打电话' onPress={() => 
              Linking.openURL(`tel:${mobile}`)} />
              : null
          }
        </View>
      </View> : null}
      {!!vrUrl && [
        <View style={styles.separetor} />,
        <Item title='3D展示'
          onClick={() => {
              // dispatch(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'CustomWebView', params: { customurl: vrUrl, headerTitle: '3D展示' } }));
              NativeModules.ToolsModule.presentH5View([vrUrl, '3D展示']);
          }
          }
        />,
      ]}
    </View>
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
      vrUrl: goodsDetail.getIn([modelId, 'data', 'product', 'vrUrl']),
      avatarImageFileId: goodsDetail.getIn([modelId, 'O2OSData', 'avatarImageFileId']),
      O2OStoreName: goodsDetail.getIn([modelId, 'O2OSData', 'o2OStoreName']),
      productGrade: goodsDetail.getIn([modelId, 'O2OSData', 'productGrade']),
      serviceGrade: goodsDetail.getIn([modelId, 'O2OSData', 'serviceGrade']),
      logisticalGrade: goodsDetail.getIn([modelId, 'O2OSData', 'logisticalGrade']),
      mobile: goodsDetail.getIn([modelId, 'O2OSData', 'mobile']),
      o2oStoreId: goodsDetail.getIn([modelId, 'O2OSData', 'o2oStoreId']),
      productAttribute: goodsDetail.getIn([modelId, 'data', 'product', 'productAttribute']),
    };
  } catch (error) {
    Log('========Store=========', error);
    return {};
  }
};

export default connect(mapStateToProps)(Store);

const styles = EStyleSheet.create({
  contain: {
    borderTopWidth: 8,
    borderTopColor: '$lightgray',
    width: '375rem',
  },
  nameView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 16,
    marginRight: 16,
  },
  name: {
    margin: 16,
    marginLeft: 0,
    flex: 1,
    fontSize: '$fontSize3',
    color: '$darkblack',
    fontWeight: 'bold',
  },
  icon: {
    width: '32rem',
    height: '32rem',
    borderRadius: 4,
    margin: 16,
    marginRight: 8,
  },
  btnView: {
    width: '375rem',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    borderWidth: 1,
    borderRadius: '14rem',
    borderColor: '$darkred',
    height: '28rem',
    marginBottom: 16,
    marginLeft: 8,
    marginRight: 8,
  },
  btnText: {
    color: '$darkred',
  },
  separetor: {
    width: '375rem',
    height: 8,
    backgroundColor: '$lightgray',
  },
});
