import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator
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
import { createGroupChatRoom } from '../store/actions/chat';

const GroupChatCreateScreen = ({
  navigation,
  route
}) => {
  const dispatch = useDispatch();
  const [competitors, setCompetitors] = useState([]);
  const [groupName, setgroupName] = useState('');
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const init = () => {
      const { params } = route;
      if (!params || !params.competitors) return navigation.goBack();

      setCompetitors(params.competitors);
    }

    init();
  }, []);

  const createGroup = async () => {
    if (!groupName || !groupName.trim()) return Alert.alert('Ошибка', 'Введите название беседы');
    setFetching(true);
    const { room, error } = await dispatch(await createGroupChatRoom({
      groupName,
      competitorsId: competitors.map(c => c.id),
    }))
    setFetching(false);

    if (error) return Alert.alert('Ошибка', error);

    navigation.navigate('room', { chatRoomId: room.id });
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.groupName}
        numberOfLines={2}
        placeholder="Название беседы"
        autoFocus
        value={groupName}
        onChangeText={setgroupName}
      />
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Участники</Text>
        <FlatList
          data={competitors}
          style={{ flexGrow: 1 }}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item: user }) => (
            <ListItem activeOpacity={1} key={user.id} onPressOut={() => {}} style={{ paddingLeft: 0, marginLeft: 0 }} avatar>
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
          style={[styles.footerBtn, !groupName || !groupName.trim() ? { backgroundColor: 'gray' } : null]}
          disabled={!groupName || !groupName.trim() || fetching}
          onPress={() => createGroup()}
          activeOpacity={0.8}
        >
          {fetching && (
            <ActivityIndicator size={22} color="#fff" />
          ) || (
            <Text style={styles.footerText}>Создать беседу</Text>
          )}
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