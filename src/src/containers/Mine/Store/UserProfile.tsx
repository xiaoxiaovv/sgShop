import * as React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native';
import { INavigation } from '../../../interface';
import { UltimateListView } from 'rn-listview';
import { getAppJSON } from '../../../netWork';
import { iPhoneXPaddingTopStyle } from '../../../utils';

/**
 * 用户详细信息
 */
class UserProfile extends React.Component<INavigation> {
  private listView;
  public render(): JSX.Element {
    return (
      <UltimateListView
        ref={(ref) => this.listView = ref}
        header={this.renderHeader}
        onFetch={this.onFetch}
        keyExtractor={(item, index) => `keys${index}`}
        refreshableMode={Platform.OS === 'ios' ? 'advanced' : 'basic'}
        refreshableTitle='数据更新中……'
        refreshableTitleRelease='释放刷新'
        // 下拉刷新箭头图片的高度
        arrowImageStyle={{ width: 20, height: 20, resizeMode: 'contain' }}
        dateStyle={{ color: 'lightgray' }}
        // 刷新视图的样式(注意ios必须设置高度和top距离相等,android只需要设置高度)
        refreshViewStyle={Platform.OS === 'ios' ? { height: 80, top: -80 } : { height: 80 }}
        // 刷新视图的高度
        refreshViewHeight={80}
        item={this.renderItem}  // this takes two params (item, index)
        numColumn={1} // to use grid layout, simply set gridColumn > 1
        emptyView={() => <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Image
              style={{
                width: 200,
                height: 200,
              }}
              source={require('../../../images/coupon.png')}
            />
            <Text>暂无数据</Text>
          </View>
        }
      />
    );
  }
  private renderHeader = () => {
    const { navigation } = this.props;
    const { memberId, name, mobile, isTeamNum, avatarImageFileId } = navigation.state.params;
    return <View>
      <View style={[
        {
          backgroundColor: '#307DFB',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        iPhoneXPaddingTopStyle,
      ]}>
        <TouchableOpacity onPress={() => navigation.goBack()}
                          style={{paddingLeft: 10, paddingRight: 10}}
        >
          <Image
            style={{
              width: 20,
              height: 20,
            }}
            source={require('../../../images/back.png')}
          />
        </TouchableOpacity>
        <View><Text style={{color: 'white', fontSize: 18}}>{'用户详细信息'}</Text></View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={{ paddingLeft: 5, paddingRight: 5 }}
            onPress={() => navigation.navigate('RootTabs')}
          >
            <Text style={{color: 'white'}}>首页</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#307DFB',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 40,
        paddingBottom: 40,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Image
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              borderColor: '#76A9FC',
              borderWidth: 1,
            }}
            source={{uri: avatarImageFileId}}
          />
          <View style={{
            marginLeft: 15,
          }}>
            <Text style={{color: 'white', fontSize: 16, marginBottom: 10}}>{name}</Text>
            <Text style={{color: 'white', fontSize: 14}}>手机号：{mobile}</Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}>
              <Text style={{color: 'white', fontSize: 14}}>{isTeamNum === 2 ? '属于我的团队' : isTeamNum === 1 ? '属于我的合伙人' : ''}</Text>
              {
                isTeamNum !== 0 && <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: 'white',
                    borderRadius: 25,
                    paddingTop: 3,
                    paddingBottom: 3,
                    paddingLeft: 8,
                    paddingRight: 8,
                    marginLeft: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  activeOpacity={0.7}
                  onPress={() => this.props.navigation.navigate('TeamateProfile', {memberId})}
                >
                  <Text style={{color: 'white', fontSize: 14}}>查看详情</Text>
                </TouchableOpacity>
              }
            </View>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={
            () => {
              const url = `tel:${mobile}`;
              Linking.canOpenURL(url).then(supported => {
                if (!supported) {
                  Log('Can\'t handle url: ' + url);
                } else {
                  return Linking.openURL(url);
                }
              }).catch(err => console.error('An error occurred', err));
            }
          }
        >
          <Image
            style={{
              height: 25,
              width: 25,
            }}
            source={require('../../../images/iphone_w_2x.png')}
          />
        </TouchableOpacity>
      </View>
      <View style={{
        marginTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: 'white',
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#EDEDED',
        }}>
          <View style={styles.labelView}>
            <Text style={{
              color: '#307DFB',
            }}>商品品类</Text>
          </View>
          <View style={styles.labelView}>
            <Text style={{
              flex: 1,
              color: '#307DFB',
            }}>数量</Text>
          </View>
          <View style={styles.priceRangeView}>
            <Text style={{
              flex: 1,
              color: '#307DFB',
            }}>价位段</Text>
          </View>
          <View style={styles.labelView}>
            <Text style={{
              flex: 1,
              color: '#307DFB',
            }}>购买时间</Text>
          </View>
        </View>
      </View>
    </View>;
  }
  private onFetch = async (page = 1, startFetch, abortFetch) => {
    try {
      const pageLimit = 10;
      const param = {
        mobile: this.props.navigation.state.params.mobile,
        pageNumber: page,
        pageSize: pageLimit,
      };

      const resp = await getAppJSON('v3/mstore/sg/mechanism/findOrderProductUserInfoDetail.json', param);

      const { success, data } = await resp;

      if (!success || !data) {
        abortFetch();
        return;
      } else {
        startFetch(data.rows, pageLimit);
      }
    } catch (err) {
      abortFetch(); // manually stop the refresh or pagination if it encounters network error
      Log(err);
    }
  }
  private renderItem = (item) => (
    <View style={styles.contentView}>
      <View style={styles.labelView}><Text>{item.cateName}</Text></View>
      <View style={styles.labelView}><Text>{item.number}</Text></View>
      <View style={styles.priceRangeView}><Text>{priceRange(item.price)}</Text></View>
      <View style={styles.labelView}><Text>{unixTimeStampToYearMonth(item.addTime)}</Text></View>
    </View>
  )
}

const priceRange = (price) => {
  const base = 1000;
  const num = Math.floor(price / base);
  if (num >= 20) {
    return num * base + '~';
  }
  return (num * base) + '~' + (num * base + 1000);
}

const unixTimeStampToYearMonth = (unixTimeStamp: number): string => {
  const date = new Date(unixTimeStamp * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const monthString = month < 10 ? `0${month}` : `${month}`;

  return `${year}.${monthString}`;
};

const styles = StyleSheet.create({
  labelView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  priceRangeView: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  contentView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 14,
    color: '#2979FF',
  },
});

export default UserProfile;
