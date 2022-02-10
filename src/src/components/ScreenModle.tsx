import * as React from 'react';
import { View, Modal, Dimensions, ScrollView, TouchableOpacity, Image, Text, TextInput, NativeModules, Clipboard } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { width, sceenHeight } from '../utils';
import { Toast , Radio, List , Grid } from 'antd-mobile';
import Address from './Address';
import ScreenUtil from './../containers/Home/SGScreenUtil';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import URL from './../config/url';
import { GET, POST_JSON, GET_P, POST_FORM} from '../config/Http';
const height = sceenHeight;

export interface ICaseModleProps {
  visible?: boolean;
  title?: string;
  content?: any;
  onSelect: (ids: any) => void;
  ewmPress?: () => void;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export interface ICaseModleState {
  visible: boolean;
  data?: any;
  ids?: any;
  isrefresh?: number;
}

const RadioItem = Radio.RadioItem;

export default class ScreenModle extends React.PureComponent<ICaseModleProps, ICaseModleState> {
  constructor(props: ICaseModleProps) {
    super(props);
    this.state = {
      visible: props.visible,
      data: [],
      ids: [],
    };
  }

  public componentDidMount() {
    this.getData();
  }

  public componentWillReceiveProps(nexpProps) {
    nexpProps.visible !== this.state.visible && this.setState({ visible: nexpProps.visible });
  }

  public render(): JSX.Element {

    const data = this.state.data;
    // const list = [];
    // for (const item of datas) {
    //      const aitem = layouta(item,);
    //      list.push(aitem);
    // }
    return (
      <Modal
        animationType='fade'
        transparent={true}
        visible={this.state.visible}
      >
        <View style={styles.bg}>
            <TouchableOpacity style={{width: width - 274}} onPress={() => this.onClose()} />
            <View style={{width: 274, height: sceenHeight, backgroundColor: '#fff', paddingLeft: 16 , paddingTop: 16}}>
                <ScrollView>
                <View style={{flex: 1}}>
                {
                  data.map((item, index) => (
                    <View>
                    <Text style={{fontSize: 14, color: '#666666', paddingTop: 10}}>{item.name}</Text>
                    <View style={{width: 274 - 16, flexWrap: 'wrap', flexDirection: 'row'}}>
                    <Text onPress={() => {
                      const tmp = this.state.ids.concat();
                      tmp[index] = 0;
                      this.setState({ids: tmp.concat()});
                    }}
                    style={[styles.buttonStyle,
                    this.state.ids[index] === 0 ?
                    {color: '#fff', backgroundColor: '#2979FF'} :
                    {color: '#333', backgroundColor: '#eee'}]}>全部</Text>
                    {
                      item.labels.map((child, indexc) => (
                          // <Text onPress={() => alert('')} style={[styles.buttonStyle, {color: this.state.select2Id === 0 ? '#fff' : '#333', backgroundColor: this.state.select2Id === 0 ? '#2979FF' : '#eee'}]}>{index}-{indexc}</Text>
                          <Text onPress={() => {
                            const tmp = this.state.ids;
                            tmp[index] = child.id;
                            this.setState({ids: tmp.concat()});
                          }

                          } style={[styles.buttonStyle,
                              this.state.ids[index] === child.id ?
                              {color: '#fff', backgroundColor: '#2979FF'} :
                              {color: '#333', backgroundColor: '#eee'}]}>{child.name}</Text>
                    ))
                    }
                    </View>
                  </View>
                  ))
                }
                </View>
                </ScrollView>
                <View style={{width: 274, height:  44, backgroundColor: '#fff', flexDirection: 'row'}}>
                <View style={{width: 130, height:  44, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontSize: 14, color: '#999999'}} onPress={ () => {
                    const length = (this.state.ids).length;
                    const id = [];
                    for (let index = 0; index < length; index++) {
                      id.push(0);
                    }
                    this.setState({
                                ids: id,
                            });
                  }}>重置</Text>
                </View>
                <TouchableOpacity style={{width: 144, height:  44, backgroundColor: '#2979FF', justifyContent: 'center', alignItems: 'center'}}
                onPress={() => {
                        this.props.onSelect(this.state.ids);
                        this.onClose();
                }}>
                  <Text style={{fontSize: 14, color: '#fff' }}>确定</Text>
                </TouchableOpacity>
            </View>
            </View>
        </View>
      </Modal>
    );
  }

  private onClose = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    } else {
      this.setState({ visible: false });
    }
  }

   // 请求数据
  private getData = async () => {
    try {
        const json = await GET(URL.DIY_CASELABEL);
        if (json.success) {
            const id = [];
            const length = (json.data).length;
            for (let index = 0; index < length; index++) {
              id.push(0);
            }
            this.setState({
                        data: json.data,
                        ids: id,
                    });
        } else {
            Toast.fail(json.message, 2);
        }
    } catch (err) {
        Log(err);
    }
}
}

const styles = EStyleSheet.create({
  bg: {
    width,
    height,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  buttonStyle: {
    width: 73,
    fontSize: 14,
    textAlign: 'center',
    padding: 5,
    borderRadius: 5,
    marginRight: 12,
    marginTop: 10,
  },
});
