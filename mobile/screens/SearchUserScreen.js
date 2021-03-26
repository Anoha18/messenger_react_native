import React, { useEffect, useState, useRef } from 'react';
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
import { useIsFocused } from '@react-navigation/native';
import { searchUsers } from '../store/actions/user';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import { SERVER } from '../config';

const SearchUsersScreen = (props) => {
  const isFocused = useIsFocused();
  const searchInput = useRef();
  const { searchUsers, navigation } = props;
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    const init = async() => {
      setLoading(true)
      const { userList, error } = await searchUsers({ searchText: '', offset: 0, limit: 20 });
      if (error) return Alert(error);

      setUsers(userList);
      setLoading(false);
      setIsFetching(true);
    }

    init();
  }, []);

  useEffect(() => {
    if (isFocused && searchInput.current) {
      searchInput.current._root.focus();
    }
  }, [isFocused]);

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
              {user.avatar && user.avatar.file_path
                ? <Thumbnail source={{ uri: `${SERVER.URL}${user.avatar.file_path}` }} style={{ height: 40, width: 40 }} />
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
          <Input
            ref={searchInput}
            value={searchText}
            returnKeyType="search"
            onSubmitEditing={() => searchUser()}
            onChangeText={(text) => setSearchText(text)}
            placeholder="Поиск"
          />
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