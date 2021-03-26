import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  ListItem,
  Thumbnail,
  Left,
  Right,
  Body,
} from 'native-base';
import { useDispatch } from 'react-redux';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import { SERVER } from '../config';

const GroupChatCreateScreen = ({
  navigation,
  route
}) => {
  const dispatch = useDispatch();
  const [competitors, setCompetitors] = useState([]);
  const [nameGroup, setNameGroup] = useState('');

  useEffect(() => {
    const init = () => {
      const { params } = route;
      if (!params || !params.competitors) return navigation.goBack();

      setCompetitors(params.competitors);
    }

    init();
  }, []);

  const createGroup = () => {
    // TODO: Добавить создание беседы
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.groupName}
        numberOfLines={2}
        placeholder="Название беседы"
        autoFocus
        value={nameGroup}
        onChangeText={setNameGroup}
      />
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Участники</Text>
        <FlatList
          data={competitors}
          style={{ flexGrow: 1 }}
          keyExtractor={(item) => item.id.toString()}
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
            </ListItem>
          )}
        />
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerBtn, !nameGroup || !nameGroup.trim() ? { backgroundColor: 'gray' } : null]}
          disabled={!nameGroup || !nameGroup.trim()}
          onPress={() => {}}
          activeOpacity={0.8}
        >
          <Text style={styles.footerText}>Создать беседу</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GroupChatCreateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  groupName: {
    backgroundColor: 'lightgray',
    borderRadius: 7,
    fontSize: 17,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    marginTop: 20,
    marginHorizontal: 20
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
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: 'lightgray',
    paddingHorizontal: 30
  },
  listTitle: {
    color: 'gray',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20
  },
  footerBtn: {
    backgroundColor: 'blue',
    width: '100%',
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerText: {
    color: '#fff',
    fontSize: 16
  }
})