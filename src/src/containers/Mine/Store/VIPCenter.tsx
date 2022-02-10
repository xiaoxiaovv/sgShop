import * as React from 'react';
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Popover, Icon, Button, Steps } from 'antd-mobile';
import { Header } from 'react-navigation';
import GradeStep from '../../../components/Mine/GradeStep';
import { INavigation } from '../../../interface/index';


const { Item } = Popover;
const { Step } = Steps;
import URL from './../../../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;
interface IState {
  visible: boolean;
  isMore: boolean;
}

let overlay = [1, 2, 3].map((i, index) => (
  <Item key={index} value={`option ${i}`}><Text>option {i}</Text></Item>
));
overlay = overlay.concat([
  <Item key='4' value='disabled' disabled><Text style={{ color: '#ddd' }}>disabled opt</Text></Item>,
  <Item key='6' value='button ct' style={{ backgroundColor: '#efeff4' }}><Text>关闭</Text></Item>,
]);

const customIcon = () => {
  return <Image
    style={{
      width: 50,
      height: 50,
    }}
    source={{uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/HeadImage5.png'}}
  />;
};

const levelOrder = 3;
const RightNavBar = ({onClick,onClickMore})=>{
  return (
        <View style={[styles.rowView]}>
            <TouchableOpacity style={{padding: 5}}
                          onPress={onClick}
            >
              <Image
                style={{
                  width: 20,
                  height: 20,
                }}
                source={{uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/Regulation.png'}}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{padding: 5}}
                            onPress={onClickMore}
            >
              <Image
                style={{
                  width: 20,
                  height: 20,
                }}
                source={require('../../../images/ellipsis_verti.png')}
              />
            </TouchableOpacity>
        </View>
  )
}
class VIPCenter extends React.Component<INavigation> {
  // public static navigationOptions = ({ navigation, screenProps }) => {
  //   return {
  //     header: <VIPCenterHeader navigation={navigation} />
  //   }
  // }
  public static navigationOptions = ({ navigation, screenProps }) => (
    {
    title: '会员中心',
    headerTintColor: 'white',
    headerStyle: {backgroundColor: '#2F69FB', justifyContent: 'center',borderBottomColor:'#2F69FB'},
    headerTitleStyle: { color: 'white', alignSelf: 'center'},
    headerRight: (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {/* <RightNavBar onClick={navigation.state.params.navigatePress()} onClickMore={navigation.state.params.navigatePress()}/> */}
      
      <View style={[styles.rowView]}>
            <TouchableOpacity 
                          onPress={()=>{
                            navigation.navigate('AgreementWebview',
                            { helpId: 609, title: '金币（积分）说明' })
                          }}
            >
              <Image
                style={{
                  width: 20,
                  height: 20,
                }}
                source={{uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/Regulation.png'}}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{padding: 5,marginRight:6}}
                            onPress={()=>navigation.state.params.navigatePress()}
            >
              <Image
                style={{
                  width: 20,
                  height: 20,
                }}
                source={require('../../../images/ellipsis_verti.png')}
              />
            </TouchableOpacity>
        </View>
      

        {/* <View style={styles.menuContainer}>
          <Popover
            name='m'
            style={{ backgroundColor: '#eee' }}
            overlay={overlay}
            contextStyle={styles.contextStyle}
            overlayStyle={[styles.overlayStyle, Platform.OS === 'android' && styles.androidOverlayStyle]}
            triggerStyle={styles.triggerStyle}
            onSelect={(item) => Log(item)}
          >
            <View style={{
              flex: 1,
              backgroundColor: 'green',
            }}>
              <Text>菜单</Text>
            </View>
          </Popover>
        </View> */}
      </View>
    ),
    headerBackTitle: null,
  }
)
  
  public state: IState = {
    visible: true,
    isMore: false
  };
  public componentDidMount() {
    let scrollLenth: number = 0;
    scrollLenth += (width / 2); // 将第一个最左侧边缘滑倒屏幕中央
    scrollLenth += (levelOrder - 1) * (50 + width / 4);
    scrollLenth += 40;
    setTimeout(() => this.scrollView && this.scrollView.scrollTo({ x: scrollLenth, y: 0 }) , 0);
    this.props.navigation.setParams({navigatePress:this._onClick})
  }
  
  private _onClick = ()=>{
     const isMore = this.state.isMore;
     this.setState({isMore:!isMore})
  }
  public render(): JSX.Element {
    return (<ScrollView style={{backgroundColor: '#F4F4F4'}}>
    
      <View style={{
        backgroundColor: '#2F69FB',
      }}>
      {
            this.state.isMore?
              <View style={{flexDirection:'column',position:'absolute',right:6,top:14,zIndex:99999}}>
                <View style={styles.triangle}></View>
                <View style={styles.rightBox}>
                    <TouchableOpacity style={styles.smBox} onPress={()=>{
                      const isMore = this.state.isMore;
                      this.setState({isMore:!isMore})
                      this.props.navigation.navigate('StoreHome',{storeId:dvaStore.getState().users.mid})}
                      }>
                       <Image source={{uri:'http://cdn09.ehaier.com/shunguang/H5/www/img/Store2x.png'}}
                              style={styles.pic}
                       />
                       <Text>小店</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  style={styles.smBox} onPress={()=>{
                      const isMore = this.state.isMore;
                      this.setState({isMore:!isMore})
                      this.props.navigation.navigate('MessageDetail')}
                      }>
                        <Image source={{uri:'http://cdn09.ehaier.com/shunguang/H5/www/img/Message2x.png'}}
                               style={styles.pic} 
                        />
                        <Text>消息</Text>
                    </TouchableOpacity>
                </View>
              </View>
            :
            null
          }
        <View style={[
          styles.outerViewPadding,
          styles.rowView,
          {
            justifyContent: 'space-between',
            position:'relative',
          },
        ]}>
         
          <View style={[
            styles.rowView,
            {
              justifyContent: 'space-between',
            },
          ]}>
            <Image
              style={{
                width: 50,
                height: 50,
                borderRadius: 30,
                marginRight: 10,
              }}
              source={{uri: 'http://www.ehaier.com/mstatic/wd/v2/img/icons/ic_default_avatar.png'}}
            />
            <Text style={{color: 'white'}}>Spring</Text>
          </View>
        </View>
        <View style={[
          styles.outerViewPadding,
          styles.rowView,
          {
            justifyContent: 'space-around',
            marginTop: 20,
          },
        ]}>
          <View style={[styles.halfBorderRadiusView, {marginRight: 10}]}>
            <Text style={styles.labelText}>成长值：68</Text>
          </View>
          <View style={[styles.halfBorderRadiusView, {marginLeft: 10}]}>
            <Text style={styles.labelText}>金币：68</Text>
          </View>
        </View>
      </View>
      <View style={{
        paddingBottom: 20,
        backgroundColor: 'white',
      }}>
        {this.renderTitle({title: '你的等级进度'})}
        <ScrollView
          horizontal={true}
          style={{
            marginTop: 20,
          }}
          showsHorizontalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
          ref={scrollView => this.scrollView = scrollView}
        >
          <View style={{width}}></View>
          <GradeStep levelOrder={levelOrder - 1} />
        </ScrollView>
        {this.postYourGrade({count: 172881, onClick: () => this.props.navigation.navigate('VIPCompetition')})}
      </View>
      <View style={[
        styles.outerViewPadding,
        {
          backgroundColor: 'white',
          paddingBottom: 20,
        },
      ]}>
        {this.renderTitle({title: '权益区'})}
        <View style={[
          styles.rowView,
          {
            justifyContent: 'space-around',
            marginTop: 20,
          },
        ]}>
          {this.renderAuthorityItem({
            iconUrl: 'http://cdn09.ehaier.com/shunguang/H5/www/img/goldgame@2x.png',
            middleText: '金币游戏',
            bottomText: '适用全级别',
            onClick: () => alert('cliekd'),
          })}
          {this.renderAuthorityItem({
            iconUrl: 'http://cdn09.ehaier.com/shunguang/H5/www/img/disduozhu@2x.png',
            middleText: '申请舵主',
            bottomText: '不可申请',
            onClick: () => alert('cliekd'),
          })}
          <View style={[
            styles.authorityView,
          ]}>
          </View>
        </View>
      </View>
    </ScrollView>);
  }

  private renderTitle = ({title}): JSX.Element => (
    <View style={[
      styles.outerViewPadding,
      styles.rowView,
      {
        justifyContent: 'center',
        marginTop: 10,
      },
    ]}>
      <Text>----</Text>
      <View style={[
        styles.rowView,
        {
          marginLeft: 20,
          marginRight: 20,
        },
      ]}>
        <Image
          style={{
            width: 13,
            height: 13,
            marginRight: 10,
          }}
          source={{uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/grade@2x.png'}}
        />
        <Text>{title}</Text>
      </View>
      <Text>-----</Text>
    </View>
  )
  private renderAuthorityItem =
    (item: {iconUrl: string, middleText: string, bottomText: string, onClick(): void}): JSX.Element => (
    <View style={[
      styles.authorityView,
    ]}>
      <TouchableOpacity onPress={() => item.onClick()}>
        <Image
          style={{
            width: 50,
            height: 50,
            marginTop: 10,
            marginBottom: 10,
          }}
          source={{uri: item.iconUrl}}
        />
      </TouchableOpacity>
      <Text style={{fontSize: 16, fontWeight: 'bold'}}>{item.middleText}</Text>
      <Text style={{fontSize: 15, color: '#E7E7E7', marginTop: 10, marginBottom: 10}}>{item.bottomText}</Text>
    </View>
  )

  private postYourGrade = (grade: {count: number, onClick(): void}): JSX.Element => (
    <View style={[
      styles.rowView,
      styles.outerViewPadding,
      {
        justifyContent: 'center',
      },
    ]}>
      <View style={[
        styles.rowView,
        {
          justifyContent: 'center',
          marginTop: 10,
          paddingLeft: 30,
          paddingRight: 30,
          paddingTop: 5,
          paddingBottom: 5,
          borderRadius: 15,
          borderColor: '#E7E7E7',
          borderWidth: 1,
        },
      ]}>
        <Text>有{grade.count}个小伙伴超过了你</Text>
        <TouchableOpacity
          style={[
            styles.rowView,
            {
              marginLeft: 5,
            },
          ]}
          onPress={() => grade.onClick()}
        >
          <Image
            style={{
              width: 10,
              height: 10,
              marginLeft: 5,
              marginRight: 5,
            }}
            source={{uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/cup@2x.png'}}
          />
          <Text style={{fontSize: 12, color: 'red'}}>晒战绩</Text>
          <Image
            style={{
              width: 10,
              height: 10,
              marginLeft: 5,
              marginRight: 5,
            }}
            source={{uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/go@2x.png'}}
          />
        </TouchableOpacity>
      </View>
    </View>
  )

  private line = () => (
    <View style={{
      height: 10,
      width: width / 4,
    }}>
      <View style={{
        flex: 1,
        borderBottomColor: '#97BDFC',
        borderBottomWidth: 1,
      }}></View>
      <View style={{
        flex: 1,
      }}></View>
    </View>
  )
}

const styles = StyleSheet.create({
  contextStyle: {
    flex: 1,
  },
  triangle: {
    width: 0,
    height: 0, 
    backgroundColor: 'transparent', 
    borderStyle: 'solid', 
    borderLeftWidth: 12, 
    borderRightWidth: 12, 
    borderBottomWidth: 26, 
    borderTopWidth: 12,
    borderLeftColor: 'transparent', 
    borderRightColor: 'transparent', 
    borderTopColor: 'transparent', 
    borderBottomColor: '#fff', 
    position:'absolute',
    top:-24,
    right:4,
    // borderLeftColor: '#fff', 
    // borderRightColor: 'transparent', 
    // borderTopColor: 'transparent', 
    // borderBottomColor: 'transparent',
  },
  rightBox: {
    width:118,
    height:100,
    backgroundColor:'#fff',
    flexDirection: 'column',
  },
  pic: {
    width:24,
    height:24,
    margin: 6,
  },
  smBox: {
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    height:50,
  },
  menuContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: 5,
    // paddingVertical: 10,
  },
  triggerStyle: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  overlayStyle: {
    // left: 90,
    flex: 1,
    // position: 'absolute',
    // top: Header.HEIGHT / 2,
    backgroundColor: 'blue',
  },
  androidOverlayStyle: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  outerViewPadding: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  halfBorderRadiusView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: '#1556C9',
    paddingTop: 10,
  },
  labelText: {
    color: 'white',
    paddingBottom: 10,
  },
  authorityView: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
export default VIPCenter;
