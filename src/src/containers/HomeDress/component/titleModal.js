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
        >ยทยทยท</Text>

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
                  <Text style={styles.txt}>ๅปๅไบซ</Text>
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
                  <Text style={[styles.txt, {marginRight: px(6)}]}>้ฆ้กต</Text>
                </TouchableOpacity>
              }
              {
                this.props.showXneng&&<TouchableOpacity style={styles.info} onPress={() => {
                  this.closeModal();
                  const chatparams = {
                    goods_id: '-1', // ๆถๆฏ้กต็ญๅถไป้กต้ขๅๅidๅบๅฎไผ?-1  ๅๅ้กตไผ?ๅๅidๆญฃๅธธไผ?  ่ฎขๅไผ?ๅๅidๆญฃๅธธไผ?
                    clientGoods_type: '1', // ไผ?1
                    // 0:ๅฎขๆ็ซฏไธๅฑ็คบๅๅไฟกๆฏ;1๏ผๅฎขๆ็ซฏไปฅๅๅIDๆนๅผ่ทๅๅๅไฟกๆฏ(goods_id:ๅๅID๏ผclientGoods_type = 1ๆถgoods_idๅๆฐไผ?ๅผไธ่ฝไธบ็ฉบ)
                    appGoods_type: '0', // ๅๅ้กตไผ?1  ่ฎขๅไผ?3 ๅนถๅงไธไธ้ข็ๅไธชๅๆฐไผ?้่ฟๆฅ
                  };
                  const command = [
                    'hg_1000_1508927913371',
                    'ๆฎ้ๅฎขๆ็ป',
                    chatparams,
                  ];
                  NativeModules.XnengModule.NTalkerStartChat(command)
                    .then(result => {
                      Log('่ฐ่ตทๅฐ่ฝๅฎขๆๆๅ');
                    })
                    .catch((errorCode, domain, error) => {
                      Log('่ฐ่ตทๅฐ่ฝๅฎขๆๅคฑ่ดฅ');
                    });
                }}>
                  <Image
                    resizeMode='stretch'
                    style={styles.selectedImg}
                    source={require('../../../images/custom.png')}/>
                  <Text style={[styles.txt, {marginRight: px(6)}]}>ๅฎขๆ</Text>
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

