import React, { useState, useEffect } from 'react';
import {
  View,
  // Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import {
  Text,
  Icon,
  ListItem,
  Thumbnail,
  Left,
  Right,
  Body,
  Spinner
} from 'native-base';
import { useDispatch } from 'react-redux';
import { searchUsers } from '../store/actions/user';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SERVER } from '../config';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    },
    [value]
  );

  return debouncedValue;
}

const SelectCompetitorsScreen = ({
  navigation
}) => {
  const dispatch = useDispatch();
  const [competitors, setCompetitors] = useState([]);
  const [users, setUsers] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText, 300);

  useEffect(() => {
    search();
  }, [debouncedSearch]);

  const search = async () => {
    setFetching(true);
    const { userList, error } = await dispatch(await searchUsers({ searchText, offset: 0, limit: 20 }));
    setFetching(false);
    if (error) return Alert(error);
    setUsers(userList);
  };

  return (
    <View style={styles.container}>
      <TextInput
        numberOfLines={1}
        style={styles.searchInput}
        placeholder="Поиск"
        onChangeText={setSearchText}
        autoFocus
      />
      {(competitors.length && (
          <FlatList
            style={{
              flexDirection: 'row',
              flexGrow: 0,
              marginTop: 20,
              marginBottom: 10,
            }}
            horizontal
            data={competitors}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item: user }) => (
              <TouchableOpacity
                style={{
                  position: 'relative',
                }}
                activeOpacity={1}
                onPress={() => setCompetitors(competitors.filter(c => c.id !== user.id))}
              >
                <Ionicons
                  name="ios-close-circle"
                  size={20}
                  style={{
                    position: 'absolute',
                    zIndex: 2,
                    top: -2,
                    left: -2
                  }}
                />
                {user.avatar && user.avatar.file_path
                  ? <Thumbnail source={{ uri: `${SERVER.URL}${user.avatar.file_path}` }} style={{ height: 50, width: 50 }} />
                  : <EvilIcon name="user" size={65} />
                }
              </TouchableOpacity>
            )}
          />
        )) || <></>}
      <View style={{ flexGrow: 1, flex: 1 }}>
        {fetching && (
          <View style={styles.spinnerContainer}><Spinner /></View>
        ) || (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            style={{
              marginTop: 10
            }}
            ListEmptyComponent={() => (
              <Text
                style={{ textAlign: 'center', color: 'gray' }}
              >
                Пользователи не найдены
              </Text>
            )}
            renderItem={({ item: user }) => (
              <ListItem key={user.id} onPressOut={() => {}} style={{ paddingLeft: 0, marginLeft: 0 }} avatar>
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
                <Right style={{ alignItems: 'center', justifyContent: 'center' }}>
                  {competitors.find(c => c.id === user.id)
                    ? (
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => setCompetitors(competitors.filter(c => c.id !== user.id))}
                      >
                        <Ionicons
                          name="ios-checkmark-circle"
                          color="blue"
                          size={30}
                        />
                      </TouchableOpacity>
                    )
                    : (
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => setCompetitors([...competitors, user])}
                        style={{
                          height: 25,
                          width: 25,
                          borderWidth: 2,
                          borderColor: 'blue',
                          borderRadius: 30/2
                        }}
                      />
                  )}
                </Right>
              </ListItem>
            )}
          />
        )}
      </View>
      {(competitors.length && (
        <TouchableOpacity onPress={() => navigation.navigate('create_group', { competitors })} style={styles.footerBtn}>
          <Text style={styles.footerText}>Далее</Text>
        </TouchableOpacity>
      )) || <></>}
    </View>
  )
};

export default SelectCompetitorsScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flexGrow: 1
  },
  competitorsTitle: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 20
  },
  searchInput: {
    backgroundColor: 'lightgray',
    borderRadius: 7,
    fontSize: 15,
    paddingHorizontal: 10,
    marginTop: 20,
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
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: 'lightgray',
    paddingHorizontal: 30
  },
  footerBtn: {
    backgroundColor: 'blue',
    width: '100%',
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    color: '#fff',
    fontSize: 16
  }
});
