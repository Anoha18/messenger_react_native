import React from 'react';
import { connect } from 'react-redux';
import { Text, View, StyleSheet } from 'react-native'
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Thumbnail, Button, Icon } from 'native-base';
import { logoutUser } from '../store/actions/user';

const SettingsScreen = (props) => {
  const { user } = props;

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <EvilIcon name="user" size={150} />
        <Text style={styles.userInfoName}>{user.name} {user.lastname || ''}</Text>
        <Text style={styles.userInfoLogin}>@{user.login}</Text>
        {/* <Thumbnail /> */}
      </View>
      <View style={styles.exitButtonContainer}>
        <Button onPress={() => props.logoutUser()} full danger iconRight>
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
    marginTop: 15
  },
  userInfoName: {
    fontSize: 18,
  },
  userInfoLogin: {
    fontSize: 14
  },
  exitButtonContainer: {
    marginTop: 'auto'
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
