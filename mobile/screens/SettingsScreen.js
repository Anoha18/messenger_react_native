import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Text, View, StyleSheet } from 'react-native'
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Thumbnail, Button, Icon } from 'native-base';
import { logoutUser } from '../store/actions/user';
import { SERVER } from '../config';

const SettingsScreen = (props) => {
  const { user, navigation } = props;
  console.log(user);
  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        { user.avatar && user.avatar.file_path
          ? <Thumbnail
              source={{ uri: `${SERVER.URL}${user.avatar.file_path}` }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50
              }}
            />
          : <EvilIcon name="user" size={150} />
        }
        <Text style={styles.userInfoName}>{user.name} {user.lastname || ''}</Text>
        <Text style={styles.userInfoLogin}>@{user.login}</Text>
      </View>
      <View style={styles.exitButtonContainer}>
        <Button onPress={() => navigation.navigate('edit_user')} block light iconRight>
          <Text style={styles.exitText}>Редактировать</Text>
        </Button>
        <Button style={{ marginTop: 5 }} onPress={() => props.logoutUser()} block danger iconRight>
          <Text style={styles.exitText}>Выход</Text>
          {/* <Icon name="cog" fontSize={20} /> */}
          <Ionicon name="exit-outline" color="#fff" size={23} />
        </Button>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 10
  },
  userInfoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    flex: 1
  },
  userInfoName: {
    marginTop: 10,
    fontSize: 18,
  },
  userInfoLogin: {
    fontSize: 14,
    marginTop: 3
  },
  exitButtonContainer: {
    marginTop: 'auto',
    width: '100%',
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 15
  },
  exitText: {
    fontSize: 17,
    color: '#fff',
    marginRight: 5
  }
})

export default connect(
  state => ({
    user: state.user.user
  }),
  {
    logoutUser
  }
) (SettingsScreen);
