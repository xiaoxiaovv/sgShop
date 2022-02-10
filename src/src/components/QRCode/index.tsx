import * as React from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity
} from 'react-native';
import QRScannerView from './QRScannerView';
import { INavigation } from '../../interface/index';
import { isiPhoneX } from '../../utils';
import { NavBar, SafeView } from './../index';
import URL from './../../config/url.js';
let width = URL.width;
let height = URL.height;
const SWidth = 0.8 *width;

interface IQRCodeScannerState {
  data: string;
}
class QRCodeScannerView extends React.Component<INavigation, IQRCodeScannerState> {
    public constructor(props) {
        super(props);
        this.state = {
            data: '',
        };
    }
    public render(): JSX.Element {

        return (
            <SafeView>
                <NavBar title={'扫一扫'}/>
              <QRScannerView
                  rectHeight={SWidth}
                  rectWidth={SWidth}
                  maskColor={'#0000004D'}
                  cornerColor={'#005aab'}
                  scanBarColor={'#32beff'}
                onScanResultReceived={this.barcodeReceived.bind(this)}

                renderTopBarView={() => this._renderTitleBar()}

                renderBottomMenuView={() => this._renderMenu()}
              />
            </SafeView >
        );
    }

    private _renderTitleBar() {
        return;
      // return (
      //   <View style={{alignItems: 'flex-start', zIndex: 1, position: 'absolute', paddingTop: isiPhoneX ? 44 : 0}}>
      //     <TouchableOpacity
      //         onPress={() => {
      //             this.props.navigation.goBack();
      //         }}>
      //             <Image
      //                 style={styles.image_top_close}
      //                 source={require('../../images/remove.png')}
      //             >
      //             </Image>
      //     </TouchableOpacity>
      //   </View>
      // );
  }

  private _renderMenu() {
        return;
      // return (
      //   <View style={{alignItems: 'center'}}>
      //     <Text style={{fontSize: 14, color: 'red'}}>扫码内容如下:</Text>
      //     <Text style={{fontSize: 14, color: 'white'}}>{this.state.data}</Text>
      //   </View>
      // );
  }
  // 扫描的结果
  private barcodeReceived(e) {
      // alert(e.data);
      this.setState({
        data: e.data,
      });
      // Toast.show('Type: ' + e.type + '\nData: ' + e.data);
  }
}

const styles = StyleSheet.create({
      image_top_close: {
        height: 28,
        width: 28,
        resizeMode: 'contain',
        margin: 16,
      },
  });

export default QRCodeScannerView;
