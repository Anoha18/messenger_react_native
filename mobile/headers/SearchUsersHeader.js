import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Container, Header, Item, Input, Text, Icon, Button } from 'native-base';

const SearchUsersHeader = (props) => {
  return (
    <Container>
      <Header searchBar rounded>
        <Item>
          <Icon name="ios-search" />
          <Input placeholder="Поиск" />
          <Icon name="ios-people" />
        </Item>
        <Button transparent>
          <Text>Search</Text>
        </Button>
      </Header>
    </Container>
    // <View style={styles.container}>
    //   <Text style={styles.title}>
    //     Поиск
    //   </Text>
    // </View>
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