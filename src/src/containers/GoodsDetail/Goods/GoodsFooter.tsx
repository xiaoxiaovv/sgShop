import * as React from 'react';
import { View, Text,Image, TouchableOpacity,ScrollView} from 'react-native';
import Button from 'rn-custom-btn1';
import EStyleSheet from 'react-native-extended-stylesheet';
import { IPreferential, IGoods, ICustomContain } from '../../../interface';
import { Modal } from 'antd-mobile';
import { connect, createIdAction, isiPhoneX } from '../../../utils';
import Item from '../../../components/ArrowItem';
import { Toast } from 'antd-mobile';
import { List } from 'immutable';
import { ctjjService } from './../../../dva/service';
import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
interface IGoodsFooterProps {
  number?: number;
  pcrName?: string;
  feeInfo?: string;
  modelId: string;
  svprmeData?: any;
  productAttribute: number;
  clickLocation: () => void;
  clickStoreMsg: () =>void;
}

interface IGoodsFooterState {
  showDetail: boolean;
  detailText: Array<{}>;
}

const mapStateToProps = (
  {
    goodsDetail,
  },
  { modelId },
) => {
  try {
    return {
      productAttribute: goodsDetail.getIn([modelId, 'data', 'product', 'productAttribute']),
      bookable: goodsDetail.getIn([modelId, 'data', 'product', 'bookable']),
      isB2C: goodsDetail.getIn([modelId, 'data', 'isB2C']) == 0 ? false : true,
      isActivityProduct: goodsDetail.getIn([modelId, 'data', 'isActivityProduct']),
      hasStock: goodsDetail.getIn([modelId, 'pfData', 'hasStock']),
      expectTime: goodsDetail.getIn([modelId, 'pfData', 'expectTime']),
      bigActivity: goodsDetail.getIn([modelId, 'pfData', 'bigActivity']),
      isSupportCOD: goodsDetail.getIn([modelId, 'pfData', 'isSupportCOD']),
      pcrName: goodsDetail.getIn([modelId, 'productInfo', 'location']),
      number: goodsDetail.getIn([modelId, 'productInfo', 'number']),
      feeInfo: goodsDetail.getIn([modelId, 'baiTiao', 'feeInfo']),
      svprmeData: goodsDetail.getIn([modelId, 'pfData', 'l']) || List(),
    };
  } catch (error) {
    Log('====GOODSFOOTER===', error);
    return { };
  }
};

@connect(mapStateToProps)
class GoodsFooter extends React.PureComponent<IGoodsFooterProps & ICustomContain & IGoods & IPreferential, IGoodsFooterState> {
  constructor(props) {
    super(props);
    this.state = {
      showDetail: false,
      detailText:[]
    };
  }
  public render(): JSX.Element {
    const {
      isB2C,isActivityProduct,hasStock, expectTime,isSupportCOD,pcrName, number,feeInfo, clickLocation, modelId,
      dispatch, clickStoreMsg, svprmeData, bookable, bigActivity, productAttribute
    } = this.props;
    const expectTimeStr = parseInt(expectTime, 0) >= 0 ?
    `??????????????????????????????${expectTime}?????????????????????????????????` :
    expectTime;
    let svprmeToArray;
    if(this.props.productAttribute!=2){
      svprmeToArray = svprmeData.toJS();
      if(isB2C || !isSupportCOD || isActivityProduct || !hasStock || number > 2){
        svprmeToArray.map((item,index)=>{
            if(item.n=='????????????'){
             svprmeToArray.splice(index,1)
            }
        })
      }
    }else{
      svprmeToArray = [];
    }
    return (
      <View>
        <Item style={styles.location} onClick={clickLocation}>
          <Text style={styles.locationTitle}>??????</Text>
          <Text numberOfLines={2} style={styles.locationContent}>{(pcrName && pcrName.toJS().pcrName) &&pcrName.toJS().pcrName}</Text>
        </Item>
        <View style={{width: width, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          {hasStock && <Text style={styles.hasStock}>??????</Text>}
          {hasStock && bigActivity && !isActivityProduct && !isB2C && productAttribute != 2 && expectTime && < Text style={[styles.expectTime, parseInt(expectTime, 0) >= 0 && styles.expectTimeRed]}>{expectTime}</Text>}
          {hasStock && isB2C && !isActivityProduct && !bookable && bigActivity && productAttribute != 2 && expectTime && < Text style={[styles.expectTime, parseInt(expectTime, 0) >= 0 && styles.expectTimeRed]}>??????????????????????????????</Text>}
          {bookable && !hasStock && bigActivity && productAttribute != 2 && expectTime && < Text style={[styles.expectTime, parseInt(expectTime, 0) >= 0 && styles.expectTimeRed]}>{expectTimeStr}</Text>}
        </View>
        {/* ???????????? */}
        {
          IS_NOTNIL(svprmeToArray)?
            <View style={styles.btnsContain}>
            {
              svprmeToArray.map((item)=>{
                return (
                  <Button
                    innerStyle={{ flexDirection: 'row' }}
                    textStyle={styles.modelBtnText}
                    imageStyle={styles.modelBtnImg}
                    image={{uri:item.m}}
                    title={item.n}
                    onPress={()=>this.loadDetail(svprmeToArray)}
                  />
                )
              })
            }
            </View>
          :
          <View></View>
        }
        {/* ???????????????????????? == 2 */}
        {
              this.props.productAttribute == 2?
              <View>
                <View style={{backgroundColor:'#F4F4F4',height:1,width:width-16,marginLeft:16,}}></View>
                    <Item
                      onClick={clickStoreMsg}
                      >
                      <Text style={[styles.itemTitle,{fontSize:14}]}>??????????????????</Text>
                      <Text style={styles.feeInfo}>{'????????????????????????????????????????????????'}</Text>
                    </Item>
                <View style={{width:width,height:10,backgroundColor:'#F4F4F4'}}></View>
              </View>
              :null
            }
        <Item
          onClick={() => {
            if (!dvaStore.getState().users.accessToken) {
              Toast.show('??????????????????????????????????????????????????????????????????????????????', 1);
            } else {
              dispatch(createIdAction('goodsDetail/loadingBaiTiao')({ modelId }));
            }
          }}
        >
          <Text style={styles.itemTitle}>???????????????</Text>
          <Text style={styles.feeInfo}>{feeInfo || '????????????'}</Text>
        </Item>
        {/* ?????????????????? */}
        <Modal 
        popup
        visible={this.state.showDetail} 
        maskClosable={true}
        onClose={() => this.setState({ showDetail: false })}
        animationType="slide-up"
        >
            <View style={{ flex:1,paddingBottom:isiPhoneX?40:20,paddingLeft:16,paddingRight:14,height:300}}>
              <View style={{height:42,borderBottomColor:'#eee',borderBottomWidth:1}}>
                <Text style={{height:40,lineHeight:40,textAlign:'center',fontSize:17}}>????????????</Text>
                <TouchableOpacity onPress={()=>this.setState({ showDetail: false })} style={{position:'absolute',right:0,top:14}}>
                  <Image style={{height: 18, width: 18}} source={require('../../../images/code_btn.png')}/>
                </TouchableOpacity>
              </View>
              <View style={{flex:1}}>
                <ScrollView style={{paddingTop:12}}>
                {
                  this.state.detailText.map((item)=>{
                    return (
                      <View style={{flexDirection:'row',marginBottom:15}}>
                        <Image source={{uri:item.m}} style={styles.modalImg}/>
                        <View style={{flex: 1}}>
                          <Text style={{marginBottom:5}}>{item.n}</Text>
                          <Text style={styles.detailText}>{item.s}</Text>
                        </View>
                      </View>
                      
                    )
                  })
                }
                </ScrollView> 
              </View>
            </View>
        </Modal>
      </View>
    );
  }
  private async loadDetail(data){
      let datailIds = '';
      data.map((item)=>{
        datailIds += (item.i+',')
      })
     try{
      const res = await ctjjService.getServicePromise({
        sid:datailIds
      })
      if(res.success){
        this.setState({
          showDetail:true,
          detailText:res.data
        })
      }
     }catch(e){

     }
  }
}

export default GoodsFooter;


const styles = EStyleSheet.create({
  location: {
    height: '48rem',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationTitle: {
    color: '#333333',
    fontSize: '14rem',
    width: '45rem',
    marginLeft: 16,
  },
  locationContent: {
    color: '#333333',
    fontSize: '14rem',
    marginLeft: 16,
    flex: 1,
  },
  btnsContain: {
    flexDirection: 'row',
    paddingLeft: 5,
    width: '375rem',
    flexWrap: 'wrap',
    backgroundColor: '$lightgray',
  },
  modelBtnText: {
    fontSize: '$fontSize2',
    color: '$black',
    marginLeft: 0,
  },
  modelBtnImg: {
    width: '24rem',
    height: '24rem',
    margin: 0,
  },
  modalImg: {
    width: '36rem',
    height: '36rem',
    marginTop: '-10rem',
    marginLeft: '-8rem'
  },
  itemTitle: {
    color: '$darkblack',
    fontSize: '$fontSize3',
    marginLeft: 16,
  },
  feeInfo: {
    color: '$black',
    marginLeft: 8,
    fontSize: '$fontSize2',
  },
  hasStock: {
    color: '$darkred',
    fontSize: '$fontSize3',
    width: 44,
    marginLeft: 16,
    marginBottom: 8,
  },
  expectTime: {
    width: width - 70,
    marginBottom: 8,
    marginRight: 10,
    color: '$black',
    fontSize: '$fontSize2',
  },
  expectTimeRed: {
    color: '$darkred',
    marginLeft:16,
  },
  payeMode: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 0,
    color: '#333333',
    fontSize: '14rem',
  },
  detailTitle: {
    fontSize: '$fontSize3',
    fontWeight: '400',
    lineHeight: '20rem',
  },
  detailText: {
    fontSize: '$fontSize2',
    color: '$black',
    lineHeight: '16rem',
    paddingLeft:2
  },
});
