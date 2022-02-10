import * as React from 'react';
import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Button from 'rn-custom-btn1';
import CountEditor from '../../components/CountEditor';
import {getAppJSON} from '../../netWork';
import { ICustomContain } from '../../interface';
import { createAction, cutImgUrl, width} from '../../utils/index';
import {Color} from 'consts';
import { Font } from '../../consts';

export interface ICartRowProps {
  sku: string;
  skku: string;
  edited: boolean;
  productId?: string|number;
  productName: string;
  productTitle: string;
  productCateId: string;
  brandId: string;
  couponList: any;
  o2oAttrId: string;
  imageId: string;
  attrValueNames: string;
  price: string|number;
  nowPrice: string|number;
  number: string|number;
  selected: boolean;
  selectAction?: (selected: boolean, productId: string|number) => void;
  handleCouponShow?: (params) => void;
  refreshList?: () => {};
  deleteItem?: (productId: string|number, sku: string) => void;
}

interface ISCartRow {
  number: string|number;
}
export default class CartRow extends React.Component<ICartRowProps&ICustomContain> {
  public state: ISCartRow;

  constructor(props: ICartRowProps) {
    super(props);
    this.state = {
      number: props.number,
    };
  }

  public render(): JSX.Element {
    // tslint:disable-next-line:variable-name
    const { sku, productId, productName,
       productTitle, imageId, price, nowPrice, o2oAttrId, attrValueNames,
       number, edited, selected, productCateId, skku,
      selectAction, deleteItem, brandId, couponList} = this.props;
    const selectBtnBg = selected ? require('../../images/ic_select.png') : require('../../images/ic_check.png');
    return (
      <View style={styles.row}>
        <Button
          style={styles.selectedBtn}
          image={selectBtnBg}
          imageStyle={styles.selectedImg}
          local={styles.selectedImg}
          onPress={() => selectAction(selected, productId, skku)}
        />
        <View style={{flex: 1}}>
          <TouchableWithoutFeedback onPress =  {() => this.handlePress(productId)}>
            <View style={styles.subRow}>
              <View style={styles.productImgView}>
              <Image style={styles.productImg} source={{ uri: cutImgUrl(imageId, 80 * rem, 80 * rem)}}/>
              </View>
                <View style={styles.content}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.title}>
                      <Text style={styles.titleText} numberOfLines={1}>{productName}</Text>
                    {couponList == 1 ?
                      <TouchableOpacity
                        onPress={() => this.props.handleCouponShow({productId, brandId, nowPrice, productCateId, o2oAttrId})}
                        style= {styles.discountContainer}
                      >
                        <Image style={styles.discount} source={require('../../images/coupons.png')}  />
                        </TouchableOpacity>
                    : null}
                    </View>
                    <Text style={styles.detail} numberOfLines={1}>{productTitle}</Text>
                    {attrValueNames ? <Text style={[styles.detail, styles.attrValueNames]} numberOfLines={1}>{`规格：${attrValueNames}`}</Text> : null }
                    <View style={[styles.priceCount, !attrValueNames  && styles.priceCountWithAttr]}>
                    <Text style={styles.price}>{`￥${nowPrice}`}</Text>
                    {edited ?
                      <View style = {{flexDirection: 'row', marginRight: 8}}>
                        <CountEditor
                          maxValue={100}
                          minValue={1}
                          edited={false}
                          onValueChange={this.handleGoodCountChanged}
                          value={number}
                          style={styles.addSub}/>
                        <Button
                          style={styles.deleteBtn}
                          textStyle={{color: 'gray', fontSize: 12}}
                          title='删除'
                          onPress={() => deleteItem(productId, skku || sku)}
                        />
                      </View>
                        :
                      <Text style={styles.count}>{`×${number}`}</Text>
                    }
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <View style={{ width: '100%', height: 1, backgroundColor: '#E4E4E4' }} />
        </View>
      </View>
    );
  }

  private handlePress = (productId) => {
      const {edited} = this.props;
      !edited && dvaStore.dispatch(createAction('router/apply')({type: 'Navigation/NAVIGATE', routeName: 'GoodsDetail', params: {productId}}));
  }

  private handleGoodCountChanged = async ( goodsCount ) => {
    const { refreshList } = this.props;
    const sku = this.props.skku ? this.props.skku : this.props.sku;
    try {
      const resp = await getAppJSON(`v3/h5/cart/update.json?` +
    `sku=${sku}&productId=${this.props.productId}&number=${goodsCount}&noLoading=true`,
     {}, {}, true);

      if (resp.success) {
        this.setState({number: goodsCount,});
        refreshList();
      }
    } catch (error) {
      console.error(error);
    }
  }
}

const ROWHEIGHT = '110rem';
const styles = EStyleSheet.create({
  row: {
    width: '375rem',
    backgroundColor: 'white',
    height: ROWHEIGHT,
    alignItems: 'center',
    flexDirection: 'row',
  },
  subRow: {
    // width: '375rem',
    flex: 1,
    backgroundColor: Color.WHITE,  
    height: ROWHEIGHT,
    alignItems: 'center',
    flexDirection: 'row',
  },
  selectedBtn: {
    height: ROWHEIGHT,
    width: '42rem',
    // paddingLeft: 10,
    //backgroundColor: 'red',
  },
  selectedImg: {
    width: '16rem',
    height: '16rem',
  },
  productImgView: {
    height: '80rem',
    width: '80rem',
    marginRight: 8,
      backgroundColor: '#eee'
  },
  productImg: {
    height: '80rem',
    width: '80rem',
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
  },
  title: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleText: {
    marginRight: 8,
    marginTop: '12rem',
    fontSize: '14rem',
    width: '190rem',
    color: '#333333',
  },
  discountContainer: {
    paddingTop: 12,
    paddingRight: 8,
  },
  discount: {
    width: '32rem',
    height: '24rem',
    resizeMode: 'contain',
  },
  detail: {
    marginRight: 8,
    marginTop: '2rem',
    fontSize: Font.SMALL_1,
    color: Color.GREY_2,
  },
  attrValueNames: {
    fontSize: 12,
  },
  priceCount: {
    marginRight: 8,
    marginBottom: '10rem',
    marginTop: 2,
    height: '26rem',
    alignItems: 'center',
    flexDirection: width >= 320 ? 'row' : 'column',
    justifyContent: 'space-between',
  },
  priceCountWithAttr: {
    marginTop: 6,
  },
  price: {
    marginRight: 8,
    fontSize: '14rem',
    color: '#FF6026',
  },
  addSub: {
    width: '120rem',
    height: '26rem',
  },
  count: {
    marginRight: 8,
    fontSize: '12rem',
    color: '#666666',
  },
  deleteBtn: {
    marginLeft: (width < 329 || width >= 320)  ? 1.5 : 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
});
