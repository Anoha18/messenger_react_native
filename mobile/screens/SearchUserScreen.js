import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, StatusBar } from 'react-native';
import {
  Container,
  Header,
  Item,
  Input,
  Text,
  Icon,
  Button,
  Spinner,
  List,
  ListItem,
  Thumbnail,
  Left,
  Right,
  Body,
  Title
} from 'native-base';
import { connect } from 'react-redux';
import { searchUsers } from '../store/actions/user';
import EvilIcon from 'react-native-vector-icons/EvilIcons';

const SearchUsersScreen = (props) => {
  const { searchUsers, navigation } = props;
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false)

  const searchUser = async () => {
    if (!searchText.trim()) return;
    setLoading(true)
    const { userList, error } = await searchUsers({ searchText, offset: 0, limit: 20 });
    if (error) return Alert(error);

    setUsers(userList);
    setLoading(false);
    setIsFetching(true);
  }

  const renderUserList = () => (
    <ScrollView>
      <List>
        {users.map(user => (
          <ListItem key={user.id} onPressOut={() => navigation.push('room', { selectedUser: user })} avatar>
            <Left>
              {user.avatar
                ? <Thumbnail source={{ uri: 'Image URL' }} />
                : <EvilIcon name="user" size={40} />
              }
            </Left>
            <Body style={styles.listBody}>
              <Text>{user.name} {user.lastname || ''}</Text>
              <Text style={styles.listSubtitle}>{user.login}</Text>
            </Body>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
        ))}
      </List>
    </ScrollView>
  )

  const renderEmptyList = () => (
    <View style={styles.noUsersContainer}>
      <Text style={styles.noUsersText}>
        Пользователи не найдены
      </Text>
    </View>
  )

  return (
    <Container>
      <Header
        androidStatusBarColor="#fff"
        style={{ backgroundColor: '#fff' }}
        searchBar
        rounded
      >
        <Item style={{ backgroundColor: 'lightgray' }}>
          <Icon name="ios-search" />
          <Input value={searchText} returnKeyType="search" onSubmitEditing={() => searchUser()} onChangeText={(text) => setSearchText(text)} placeholder="Поиск" />
          <Icon name="ios-people" />
        </Item>
        <Button onPress={() => searchUser()} transparent>
          <Text>Поиск</Text>
        </Button>
        <StatusBar barStyle="dark-content" />
      </Header>
      { loading && <View style={styles.spinnerContainer}><Spinner /></View> }
      { (!loading && users.length && renderUserList()) || null }
      { (!loading && !users.length && isFetching && renderEmptyList()) || null }
    </Container>
  )
}

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listBody: {
    paddingBottom: 20
  },
  title: {
    fontSize: 24
  },
  listSubtitle: {
    fontSize: 12,
    color: 'blue'
  },
  noUsersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noUsersText: {
    color: 'gray'
  }
})

export default connect(
  null,
  {
    searchUsers
  }
)(SearchUsersScreen);