import * as React from 'react';
import { View, Dimensions, Platform, NativeModules } from 'react-native';
import Button from 'rn-custom-btn1';
import StyleSheet from 'react-native-extended-stylesheet';
import { INavigation } from '../../interface/index';
import { connect, createAction, createIdAction, isLogin } from '../../utils';
import Config from 'react-native-config';
import { IGoods, IPreferential, ICustomContain, GoodsBuyType, IProduct } from '../../interface';
import CustomAlert from '../../components/CustomAlert';
import GoodsOrder from './GoodsOrder';
import { CountStyleType } from '../../containers/GoodsDetail/Goods/CountStyle';
import {Color, Font} from 'consts';
import URL from './../../config/url.js';

interface IGoodsBottom {
  modelId: string;
  productId: string;
  count?: number;
  buyBtnType?: GoodsBuyType;
  users?: any;
  showOrder?: boolean;
  loadingPF: boolean;
  productAttribute: number;
  productData: any;
  O2OSData: any;
}

interface IGoodsBottomState {
  showRemend: boolean;
}

class GoodsBottom extends React.Component<IGoodsBottom & ICustomContain & IPreferential & IGoods & IProduct, IGoodsBottomState> {
  constructor(props) {
    super(props);
    this.state = {
      showRemend: false,
    };
  }

  public render(): JSX.Element {
    const {
      hasStock, loadingPF, isPackage, count, users, productId, dispatch, modelId, buyBtnType, showOrder, isCollected, isActivityProduct, productFullName, acReserveType,
      o2oType, productAttribute, productData,
    } = this.props;
    console.log(this.props);
    const cartCount = count > 99 ? '99+' : count;
    const { showRemend } = this.state;
    const showAddCart = hasStock && !isActivityProduct && acReserveType!==1;
    const loveImg = isCollected ? require('../../images/shoucang_select.png') : require('../../images/shoucang.png');
    const bottomBtns = [
      { title: '客服', image: require('../../images/server.png'), onPress: () => this.goServer() },
      { title: '购物车', image: require('../../images/add_cart.png'), badge: cartCount || null,
        onPress: () => { dispatch(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'Cart', params: { showCartBackBtn: true } })); dispatch(createIdAction('goodsDetail/changeUIState')({ modelId, showCountType: CountStyleType.None }));} },
      { title: '收藏', image: loveImg, onPress: this.loveClick },
    ];
    const HomeDecorationBtns = [
      { title: '客服', image: require('../../images/server.png'), onPress: () => this.goServer() },
      { title: '收藏', image: loveImg, onPress: this.loveClick },
    ];
    const buyNowClick = () => {
      loadingPF && dispatch(createAction('goodsDetail/checkStockForNum')({ modelId }));
      // loadingPF && this.props.dispatch(createAction('order/putPageInfo')({ modelId, productId }));
    };
    // const btnType = this.getBuyBtnType();

    const buyBtnProps = [
      { title: '立即购买', style: styles.buyNow, textStyle: styles.buyText, onPress: buyNowClick },
      { title: '立即抢购', style: styles.buyNow, textStyle: styles.buyText, onPress: buyNowClick },
      { title: '马上预订', style: styles.buyNow, textStyle: styles.buyText, onPress: buyNowClick },
      { title: '到货通知', style: styles.stockNoti, textStyle: styles.buyText, onPress: this.showAlert },
      { title: '开抢通知', style: styles.buyNow, textStyle: styles.buyText, onPress: buyNowClick },
      { title: '立即预约', style: styles.buyNow, textStyle: styles.buyText, onPress: () => loadingPF && dispatch(createIdAction('goodsDetail/checkOrder')({ modelId })) },
      { title: '马上抢购', style: styles.buyNow, textStyle: styles.buyText, onPress: buyNowClick },
    ][buyBtnType];
    return (
      <View>
        <View style={styles.bottomView}>
          <View style={styles.bfView}>
            {
              (this.props.productAttribute == 0 || this.props.productAttribute == 1) ?
                bottomBtns.map((btnProps, index) =>
                  <Button
                    style={styles.bottomBtn}
                    key={`keys${index}`}
                    {...btnProps}
                    textStyle={styles.bottomBtnText}
                    imageStyle={styles.bottomBtnImg}
                    local={{badgeContainStyle: {backgroundColor:Color.ORANGE_1}}}
                  />,
                )
                :
                HomeDecorationBtns.map((btnProps, index) =>
                  <Button
                    style={styles.bottomBtn}
                    key={`keys${index}`}
                    {...btnProps}
                    textStyle={styles.bottomBtnText}
                    imageStyle={styles.bottomBtnImg}
                  />,
                )
            }
          </View>
          {showAddCart && (this.props.productAttribute == 0 || this.props.productAttribute == 1) &&
            <Button
              key='addCart'
              title='加入购物车'
              style={styles.addCart}
              textStyle={styles.cartText}
              onPress={() => loadingPF && dispatch(createIdAction('goodsDetail/addCart')({ modelId }))}
            />
          }
          <Button {...buyBtnProps} />
        </View>
        <View style={styles.xBottom} />
        <CustomAlert
          onClose={() => this.setState({ showRemend: false })}
          visible={showRemend}
          key={users.mobile || 'CustomAlert'}
          value={users.mobile || ''}
          detailText={buyBtnType === 3 ? `商品名称：${productFullName}` : ''}
          confirm={(mobile) => this.setState(
            { showRemend: false },
            () => {
              if (buyBtnType === 3) {
                dispatch(createIdAction('goodsDetail/arrivalNotice')({ modelId, productId, mobile }));
              } else {
                dispatch(createIdAction('goodsDetail/notifyMe')({ modelId, productId, mobile }));
              }
            },
          )}
        />
        <GoodsOrder
          visible={showOrder} phone={users.mobile || ''}
          onCancle={() => dispatch(createIdAction('goodsDetail/changeUIState')({ modelId, showOrder: false }))}
          onConfirm={(mobile, vertifyStr) => dispatch(createIdAction('goodsDetail/orderGoods')({ modelId, mobile, vertifyStr }))}
        />
      </View>
    );
  }

  private loveClick = () => {
    const {
      modelId,
      isCollected,
    } = this.props;
    this.props.dispatch(createIdAction('goodsDetail/collection')({
      modelId,
      beCollected: isCollected,
    }));
  }

  private showAlert = () => {
    this.props.loadingPF && this.setState({ showRemend: true });
  }

  private goServer = () => {
      this.props.stopVideo&&this.props.stopVideo();
    if (!isLogin()) { return; }
    const { users, productId, finalPrice, productData, O2OSData, o2oType, defaultImageUrl, productFullName } = this.props;
    const productModel = JSON.parse(JSON.stringify(productData));
    const o2oInfo = JSON.parse(JSON.stringify(O2OSData));
    const { mid: userId } = users;
    const fromType = '';
    // 咨询发起页url
    const baseUrl = Config.API_URL + 'www/index.html#';
    const stateName = '/productDetail/' + productId + '/' + o2oType +
      '/' + fromType + '/' + productModel.storeId + '/';
    const goodOrderUrl = baseUrl + stateName;
    const chatparams = {
      startPageTitle: '商品详情', // 咨询发起页标题(必填)
      startPageUrl: goodOrderUrl, // 咨询发起页URL，必须以"http://"开头 （必填）
      matchstr: '', // 域名匹配,企业特殊需求,可不传  (android需要的参数)
      erpParam: '', // erp参数, 被用参数,小能只负责经由SDK传到客服端,不做任何处理
      kfuid: '', // 传入指定客服的格式：siteid_ISME9754_T2D_指定客服的id
      clicktoshow_type: 1, // 点击商品的动作 默认传递1   说明：  0 小能内打开， 1 顺逛内打开
      goods_id: `${productId}`, // 消息页等其他页面商品id固定传-1  单品页传商品id正常传  订单传商品id正常传
      clientGoods_type: '1', // 传1
      // 0:客服端不展示商品信息;1：客服端以商品ID方式获取商品信息(goods_id:商品ID，clientGoods_type = 1时goods_id参数传值不能为空)
      appGoods_type: '1', // 单品页传1  订单传3 并吧三下面的四个参数传递过来
      // * 0:APP端不展示商品信息;
      // * 1：APP端以商品ID方式获取商品信息(appGoods=1时goods_id参数传值才生效);
      // * 3：自定义传入商品数据，展示到APP端,appGoods_type＝3时下面的4参数传值才会生效
      // *   以下四个参数不需要
      //    chatparams.goods_imageURL(商品图片url，订单里面就是订单商品的imageURl ，多个网单取第一个)、
      // *  chatparams.goodsTitle(商品标题、订单id)、
      // *  chatparams.goodsPrice(商品价格、订单金额)、
      // *  chatparams.goods_URL(商品链接 、 订单页面url地址)
      // *  chatparams.itemparam (“storeMemberId,street”) storeMemberId+","+street注意此字段事两个拼接在一起的，单品页传递，订单不传递
      itemparam: `${productModel.storeId},${productModel.streetId}`,
      // goods_imageURL: defaultImageUrl,
      // goodsTitle: productFullName,
      // goodsPrice: '价格：' + finalPrice,
      // isSingle: '0', // 0：请求客服组内客服；1：请求固定客服。(ios请求固定客服要求传入,android不需要)
    };
    if (Platform.OS === 'ios') { chatparams.isSingle = '0'; }
    // 小能客服
    if (o2oInfo.o2OStoreName) {
        // const codeArray = [8800037114, 8800214045, 8800256530, 8800262941, 8800268232, 8800194779, 8800284360, 8800267165, 8800267162, 8700095500];
        const codeArray = URL.get_KFarr;
      let codeFlag = true;
      for (const value of codeArray) {
        if (value == o2oInfo.storeCode) {
          NativeModules.XnengModule.NTalkerStartChat(['hg_' + o2oInfo.storeCode + '_9999', '商家客服', chatparams]);
          codeFlag = true;
          break;
        } else {
          codeFlag = false;
        }
      }
      if (codeFlag === false) {
        NativeModules.XnengModule.NTalkerStartChat(['hg_1000_1508927913371', '普通客服组', chatparams]);
      }
    } else {
      NativeModules.XnengModule.NTalkerStartChat(['hg_1000_1508927913371', '普通客服组', chatparams]);
    }
  }
}

const mapStateToProps = (
  {
    goodsDetail,
    cartModel: { cartSum: count },
    users,
  },
  { modelId },
) => {
  return {
    productAttribute: goodsDetail.getIn([modelId, 'data', 'product', 'productAttribute']),
    finalPrice: goodsDetail.getIn([modelId, 'pfData', 'finalPrice']),
    loadingPF: goodsDetail.getIn([modelId, 'uiState', 'loadingPF']),
    hasStock: goodsDetail.getIn([modelId, 'pfData', 'hasStock']),
    isPackage: goodsDetail.getIn([modelId, 'pfData', 'isPackage']),
    acReserveType: goodsDetail.getIn([modelId, 'pfData', 'acReserveType']),
    isCollected: goodsDetail.getIn([modelId, 'data', 'isCollected']),
    isActivityProduct: goodsDetail.getIn([modelId, 'data', 'isActivityProduct']),
    o2oType: goodsDetail.getIn([modelId, 'data', 'o2oType']),
    defaultImageUrl: goodsDetail.getIn([modelId, 'data', 'product', 'defaultImageUrl']),
    productFullName: goodsDetail.getIn([modelId, 'data', 'product', 'productFullName']),
    productId: goodsDetail.getIn([modelId, 'productId']),
    buyBtnType: goodsDetail.getIn([modelId, 'uiState', 'buyBtnType']),
    showOrder: goodsDetail.getIn([modelId, 'uiState', 'showOrder']),
    productData: goodsDetail.getIn([modelId, 'data']),
    O2OSData: goodsDetail.getIn([modelId, 'O2OSData']),
    users,
    count,
  };
};
export default connect(mapStateToProps)(GoodsBottom);

const BOTTOMHEIGHT = '44rem';
const styles = StyleSheet.create({
  bottomView: {
    width: '375rem',
    height: BOTTOMHEIGHT,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  xBottom: {
    height: '$xBottom',
    width: '375rem',
    backgroundColor: 'white',
  },
  bfView: {
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    width: '175rem',
    height: BOTTOMHEIGHT,
  },
  bottomBtn: {
  },
  bottomBtnText: {
    fontSize: '9rem',
    color: '#959595',
    margin: 0,
  },
  bottomBtnImg: {
    width: '18rem',
    height: '18rem',
  },
  buyNow: {
    flex: 1,
    backgroundColor: Color.ORANGE_1,
  },
  addCart: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: Color.GREY_4,
  },
  cartText: {
    color: '#393939',
    fontSize: '$fontSize3',
  },
  buyText: {
    color: 'white',
    fontSize: '$fontSize3',
  },
  stockNoti: {
    flex: 1,
    backgroundColor: '#FFB300',
  },
});
