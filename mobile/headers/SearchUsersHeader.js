import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SearchUsersHeader = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Поиск
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    elevation: 4,
    borderBottomColor: 'rgb(216, 216, 216)',
    shadowColor: 'rgb(216, 216, 216)',
    alignSelf: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 24
  }
})

export default SearchUsersHeader;