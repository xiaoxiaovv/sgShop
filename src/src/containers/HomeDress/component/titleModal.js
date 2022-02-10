import React from 'react';
import {Modal, View, Text, findNodeHandle, UIManager, TouchableOpacity, Image, StyleSheet,NativeModules} from 'react-native';
import {connect, createAction, px, width} from "../../../utils";

/**
 * Example
 * <TitleModal
 showGohome ={true}
 navigation ={navigation}
 onSharePress={onSharePress}
 />
 */

export default class TitleModal extends React.Component {

  state = {
    modalShow: false,
    modalPosition: {},
  }

  openModal = () => {
    if (!this.btnRef) return;
    const handle = findNodeHandle(this.btnRef);
    UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
      this.setState({
        modalShow: true,
        modalPosition: {
          x, y, width, height, pageX, pageY
        }
      });
    });
  }

  addRef = (ref) => {
    this.btnRef = ref
  }

  closeModal = () => {
    this.setState({
      modalShow: false,
    });
  }

  render() {

    const {modalShow, modalPosition} = this.state;

    return (
      <View>
        <Text
          onPress={this.openModal}
          ref={this.addRef}
        >···</Text>

        <Modal
          visible={modalShow}
          onRequestClose={this.closeModal}
          transparent={true}
        >
          <View
            onStartShouldSetResponder={() => true}
            onResponderRelease={this.closeModal}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
            }}
          >
            <View style={{
              width: px(100),
              backgroundColor: 'rgba(0,0,0,0.5)',
              marginTop: modalPosition.pageY + modalPosition.height + px(10),
              marginLeft: modalPosition.pageX - px(80),
            }}
            >
              {
                this.props.onSharePress &&
                <TouchableOpacity
                  onPress={() => {
                    this.closeModal();
                    this.props.onSharePress()
                  }}
                  style={styles.info}
                >
                  <Image
                    resizeMode='stretch'
                    style={styles.selectedImg}
                    source={require('../../../images/toshare.png')}/>
                  <Text style={styles.txt}>去分享</Text>
                </TouchableOpacity>
              }
              {
                this.props.showGohome&&<TouchableOpacity
                  style={styles.info}
                  onPress={() => {
                    this.closeModal();
                    this.props.navigation.navigate('RootTabs');
                  }}>
                  <Image
                    resizeMode='stretch'
                    style={styles.selectedImg}
                    source={require('../../../images/gohomePage.png')}/>
                  <Text style={[styles.txt, {marginRight: px(6)}]}>首页</Text>
                </TouchableOpacity>
              }
              {
                this.props.showXneng&&<TouchableOpacity style={styles.info} onPress={() => {
                  this.closeModal();
                  const chatparams = {
                    goods_id: '-1', // 消息页等其他页面商品id固定传-1  单品页传商品id正常传  订单传商品id正常传
                    clientGoods_type: '1', // 传1
                    // 0:客服端不展示商品信息;1：客服端以商品ID方式获取商品信息(goods_id:商品ID，clientGoods_type = 1时goods_id参数传值不能为空)
                    appGoods_type: '0', // 单品页传1  订单传3 并吧三下面的四个参数传递过来
                  };
                  const command = [
                    'hg_1000_1508927913371',
                    '普通客服组',
                    chatparams,
                  ];
                  NativeModules.XnengModule.NTalkerStartChat(command)
                    .then(result => {
                      Log('调起小能客服成功');
                    })
                    .catch((errorCode, domain, error) => {
                      Log('调起小能客服失败');
                    });
                }}>
                  <Image
                    resizeMode='stretch'
                    style={styles.selectedImg}
                    source={require('../../../images/custom.png')}/>
                  <Text style={[styles.txt, {marginRight: px(6)}]}>客服</Text>
                </TouchableOpacity>
              }
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  selectedImg: {
    width: px(16),
    height: px(16),
    marginRight: px(8),
  },
  txt: {
    color: '#fff',
    fontSize: px(14),
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: px(28),
    marginHorizontal: px(10),
  }

});

