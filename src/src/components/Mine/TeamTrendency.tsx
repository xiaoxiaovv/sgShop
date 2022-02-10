import * as React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface ITeamTrendency {
  teamOrPartner: boolean;
  label: string;
  iconUrl: string;
  onClick: () => any;
  count: object;
  developmentChartUrl: string; // 当月发展
  activeChartUrl: string; // 当月活跃
  accumulatedActiveChartUrl: string; // 累计激活
  activeRateChartUrl: string; // 当月活跃率
}

const TeamTrendency = (props: ITeamTrendency): JSX.Element => {
  return (
    <View style={{
      backgroundColor: 'white',
      marginTop: 5,
    }}>
      <View style={{
        justifyContent: 'center',
        height: 40,
        borderBottomColor: '#E7E7E7',
        borderBottomWidth: 1,
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 5,
      }}>
        <Text>{props.label}</Text>
      </View>
      <View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 20,
          paddingBottom: 20,
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            paddingTop: 10,
            paddingBottom: 10,
          }}>
            <Image
              style={{
                height: 55,
                width: 55,
              }}
              source={{ uri: props.iconUrl }}
            />
            <View style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'space-around',
              paddingLeft: 15,
            }}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
              }}>{props.teamOrPartner ? props.count.accumulatedPartnersNum : props.count.accumulatedTeamMemberNum}</Text>
              <Text>累计发展</Text>
            </View>
          </View>
          <View style={{
            justifyContent: 'center',
          }}>
            <TouchableOpacity onPress={() => props.onClick()}>
              <Image
                style={{
                  height: 20,
                  width: 20,
                }}
                source={{ uri: 'http://cdn09.ehaier.com/shunguang/H5/www/img/go@2x.png' }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingTop: 10,
          paddingBottom: 20,
        }}>
          <View style={styles.lineChartView}>
            <Image
              style={{
                width: 20,
                height: 20,
              }}
              source={{ uri: props.developmentChartUrl }}
            />
            <Text style={styles.lineChartMiddleText}>{props.teamOrPartner ? props.count.partnersNum : props.count.teamMemberNum}</Text>
            <Text style={styles.lineChartLabel}>当月发展</Text>
          </View>
          <View style={styles.lineChartView}>
            <Image
              style={{
                width: 20,
                height: 20,
              }}
              source={{ uri: props.activeChartUrl }}
            />
            <Text style={styles.lineChartMiddleText}>{props.teamOrPartner ? props.count.activePartnersNum : props.count.activeTeamMemberNum}</Text>
            <Text style={styles.lineChartLabel}>当月活跃</Text>
          </View>
          <View style={styles.lineChartView}>
            <Image
              style={{
                width: 20,
                height: 20,
              }}
              source={{ uri: props.accumulatedActiveChartUrl }}
            />
            <Text style={styles.lineChartMiddleText}>{props.teamOrPartner ? props.count.accumulatedActivePartnersNum : props.count.accumulatedActiveTeamNum}</Text>
            <Text style={styles.lineChartLabel}>累计激活</Text>
          </View>
          <View style={styles.lineChartView}>
            <Image
              style={{
                width: 20,
                height: 20,
              }}
              source={{ uri: props.activeRateChartUrl }}
            />
            <Text style={styles.lineChartMiddleText}>{props.teamOrPartner ?props.count.partnerActivityRate:props.count.teamMemberActivityRate}%</Text>
            <Text style={styles.lineChartLabel}>当月活跃率</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  lineChartView: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  lineChartLabel: {
    color: '#AFAFAF',
  },
  lineChartMiddleText: {
    marginBottom: 5,
  },
});

export default TeamTrendency;
