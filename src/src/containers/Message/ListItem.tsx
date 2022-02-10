import React from 'react';
import { 
    Image, 
    Platform, 
    Text, 
    TouchableOpacity, 
    StyleSheet,
    View,
} from 'react-native';

const ListItem = ({ user, onPress }) => {
    if(!user) {
      return null;
    }
    return (
        <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
            <View style={styles.subItem}>
              <View style={styles.lpart}>
              <View style={styles.border}>
                  <Text style={styles.ltitle}>{user.title}</Text>
              </View>
            <Text style={styles.lcontent}>{user.content}</Text>
              </View>
            <View style={styles.rpart}>
              <Text style={styles.sright}>{user.date}</Text>
            </View>
            </View>
        </TouchableOpacity>
    );
};

export default ListItem;

const styles = StyleSheet.create({
    subItem: {
      backgroundColor: "#fff",
      marginLeft: 10,
      marginRight: 10,
      padding: 12,
      borderRadius: 6,
      flexDirection: 'row',
      marginBottom: 8
    },
    lpart: {
      flex: 6
    },
    rpart: {
      flex: 2,
      justifyContent: 'flex-end'
    },
    ltitle: {
      color: '#333',
      fontSize: 16,
      marginBottom: 10,
    },
    border: {
      borderBottomWidth: 1,
      borderBottomColor: '#f2f2f2'
    },
    lcontent: {
      color: '#32BEFF',
      fontSize: 14,
      paddingTop: 10
    },
});