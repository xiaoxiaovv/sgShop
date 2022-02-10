import * as React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { ICustomContain } from '../../../interface';
import { Grid, Modal } from 'antd-mobile';
import EStyleSheet from 'react-native-extended-stylesheet';
import { createAction, iPhoneXPaddingTopStyle, universalHeader } from '../../../utils';
import { getAppJSON, postAppForm } from '../../../netWork';
import { connect } from 'react-redux';
import { ListTemplate, TitleTemplate } from '../../../dvaModel/storeModel';

import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

interface IState {
  titleData: object[];
  listData: object[];
  titleId: string;
  listId: string;
  showPreviewModal: boolean;
  previewUrl: string;
}

/**
 * 选择店铺模版
 */
@connect()
export default class ChoosingShopTemplate extends React.Component<ICustomContain, IState> {
  public constructor(props) {
    super(props);
    this.state = {
      titleData: [
        {
          icon: 'http://www.ehaier.com/mstatic/test/wd/v2/img/pages/wdStyleChoice/tit-01.jpg',
          selected: true,
        },
      ],
      listData: [
        {
          icon: 'http://www.ehaier.com/mstatic/test/wd/v2/img/pages/wdStyleChoice/list-01.jpg',
          selected: true,
        },
      ],
      titleId: '',
      listId: '',
      showPreviewModal: false,
      previewUrl: '',
    };
  }
  public componentDidMount() {
    this.loadTemplate();
  }
  public render(): JSX.Element {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{backgroundColor: '#F4F4F4'}}>
          <View style={[
            {
              backgroundColor: universalHeader.headerStyle.backgroundColor,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: 20,
            },
            iPhoneXPaddingTopStyle,
          ]}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}
                              style={{paddingLeft: 10, paddingRight: 10}}
            >
              <Image
                style={{
                  width: 20,
                  height: 20,
                }}
                source={require('../../../images/black_back.png')}
              />
            </TouchableOpacity>
            <View>
              <Text style={{color: universalHeader.headerTitleStyle.color, fontWeight: 'bold', fontSize: 18}}>
                选择店铺模版
              </Text>
            </View>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <TouchableOpacity
                style={{paddingLeft: 5, paddingRight: 15}}
                activeOpacity={0.8}
                onPress={
                  () => this.resolvePreviewUrl()
                }
              >
                <Text style={{fontSize: 18, fontWeight: 'bold', color: '#337DE1'}}>预览</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={estyles.titleStyle}>
            <Text style={estyles.titleFontStyle}>顶部模版样式</Text>
          </View>
          <Grid data={this.state.titleData}
                columnNum={2}
                hasLine={false}
                renderItem={dataItem => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={estyles.gridPadding}
                    onPress={
                      () => this.onSelectTitleTemplate(dataItem.tit)
                    }
                  >
                    <View style={estyles.titleImageWrapperStyle}>
                      <Image source={{uri: dataItem.tempUrl}} style={estyles.titleImageStyle}/>
                      <View style={estyles.yuanquan}>
                        {
                          dataItem.selected === true && <Image
                            style={estyles.selectedImgStyle}
                            source={require('../../../images/ic_select.png')}
                          />
                        }
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
          />
          <View style={estyles.titleStyle}>
            <Text style={estyles.titleFontStyle}>商品列表模版样式</Text>
          </View>
          <Grid data={this.state.listData}
                columnNum={2}
                hasLine={false}
                square={false}
                itemStyle={estyles.listGridStyle}
                renderItem={dataItem => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[estyles.gridPadding]}
                    onPress={
                      () => this.onSelectListTemplate(dataItem.layout)
                    }
                  >
                    <View style={estyles.listImageWrapperStyle}>
                      <Image source={{uri: dataItem.tempUrl}} style={estyles.listImageStyle}/>
                      <View style={estyles.yuanquan}>
                        {
                          dataItem.selected === true && <Image
                            style={estyles.selectedImgStyle}
                            source={require('../../../images/ic_select.png')}
                          />
                        }
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
          />
        </ScrollView>
        <Modal
          visible={this.state.showPreviewModal}
          transparent
          maskClosable={true}
          onClose={this.closePreviewModal}
        >
          <Image
            resizeMode={'stretch'}
            style={styles.preivewImgStyle}
            source={{uri: this.state.previewUrl}}
          />
        </Modal>
      </View>
    );
  }
  private resolvePreviewUrl = () => {
    let previewImgIndex;
    switch (`${this.state.listId}${this.state.titleId}`) {
      case 'layout-dftit-df':
        previewImgIndex = '01';
        break;
      case 'layout-dftit-bp':
        previewImgIndex = '02';
        break;
      case 'layout-dftit-colum2':
        previewImgIndex = '03';
        break;
      case 'layout-bptit-df':
        previewImgIndex = '04';
        break;
      case 'layout-bptit-bp':
        previewImgIndex = '05';
        break;
      case 'layout-bptit-colum2':
        previewImgIndex = '06';
        break;
      case 'layout-colum2tit-df':
        previewImgIndex = '07';
        break;
      case 'layout-colum2tit-bp':
        previewImgIndex = '08';
        break;
      case 'layout-colum2tit-colum2':
        previewImgIndex = '09';
        break;
    }

    if (previewImgIndex) {
      this.setState({
        previewUrl: `http://www.ehaier.com/mstatic/wd/v2/img/pages/wdHome/tempImg${previewImgIndex}.jpg`,
      }, () => setTimeout(
        () => this.setState({showPreviewModal: true}),
        500),
      );
    }
  }
  private closePreviewModal = () => this.setState({showPreviewModal: false})
  private loadTemplate = async () => {
    const { success, data } = await getAppJSON('v3/mstore/sg/store/wdStyleChoice.html');
    if (success && data) {
      if (data.titleTemplate) {
        this.setState({titleData: data.titleTemplate});
        for (const title of data.titleTemplate) {
          if (title.selected) {
            this.setState({titleId: title.tit});
          }
        }
      }
      if (data.listTemplate) {
        this.setState({listData: data.listTemplate});
        for (const list of data.listTemplate) {
          if (list.selected) {
            this.setState({listId: list.layout});
          }
        }
      }
    }
  }
  private onSelectTitleTemplate = async (titleId) => {
    if (titleId && this.state.listId) {
      const {success, data} = await this.updateTemplates(titleId, this.state.listId);
      if (success && data) {
        for (const key of Object.keys(TitleTemplate)) {
          const titleTemp: string = TitleTemplate[key];
          if (titleTemp === titleId) {
            this.props.dispatch(createAction('store/loadData')({
              titleTemplate: titleTemp,
            }));
          }
        }

        this.setState({titleId}, () => this.loadTemplate());
      }
    }
  }
  private onSelectListTemplate = async (listId) => {
    if (listId && this.state.titleId) {
      const {success, data} = await this.updateTemplates(this.state.titleId, listId);
      if (success && data) {
        for (const key of Object.keys(ListTemplate)) {
          const listTemp: string = ListTemplate[key];
          if (listTemp === listId) {
            this.props.dispatch(createAction('store/loadData')({
              listTemplate: listTemp,
            }));
          }
        }

        this.setState({listId}, () => this.loadTemplate());
      }
    }
  }
  private updateTemplates = async (titleId, listId) => {
    const templateId = `${titleId}-${listId}`;
    return await postAppForm('v3/mstore/sg/store/changeStoreStyle.json', {
      templateId,
    });
  }
}

const styles = StyleSheet.create({
  preivewImgStyle: {
    width: width * 0.6,
    height: width * 0.6 * 2.0,
  }
});

const estyles = EStyleSheet.create({
  gridPadding: {
    padding: '10rem',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleImageWrapperStyle: {
    width: '140rem',
    height: '55rem',
  },
  titleImageStyle: {
    width: '135rem',
    height: '50rem',
    padding: '5rem',
  },
  listGridStyle: {
    width: `${375 / 2}rem`,
    height: '120rem',
  },
  listImageWrapperStyle: {
    width: '140rem',
    height: '110rem',
  },
  listImageStyle: {
    width: '135rem',
    height: '105rem',
    padding: '5rem',
  },
  yuanquan: {
    position: 'absolute',
    height: 20,
    width: 20,
    backgroundColor: 'transparent',
    bottom: 4,
    right: 4,
    '@media android': {
      right: 0,
    },
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
  selectedImgStyle: {
    height: 18,
    width: 18,
  },
  titleStyle: {
    width,
    height: '50rem',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingLeft: '16rem',
  },
  titleFontStyle: {
    fontSize: '16rem',
  },
})
