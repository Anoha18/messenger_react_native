import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

export default ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Icon onPress={() => navigation.goBack()} name="arrowleft" color="black" size={25} style={{ width: 24, height: 24 }} />
      <Text>
        133 This is Room Screen
      </Text>
      <Text></Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: 'rgb(216, 216, 216)',
    borderBottomColor: 'rgb(216, 216, 216)',
    width: '100%',
    height: 56,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15
  }
})