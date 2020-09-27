import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Button, Text } from 'native-base';
import Icon from 'react-native-vector-icons/Fontisto'
import { View } from 'react-native';

export default (props) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = () => {
    console.log('login: ', login);
    console.log('password: ', password);
  }

  return (
    <View style={styles.container}>
      <View style={{
        flexShrink: 0,
        flexGrow: 1,
        justifyContent: 'center',
      }}>
        <View>
          <Text style={{ textAlign: 'center', textTransform: 'uppercase', fontSize: 30, fontWeight: 'bold' }}>Вход</Text>
        </View>
        <View style={{ marginTop: 15 }}>
          <Item floatingLabel>
            <Label style={styles.formLabel}>Логин</Label>
            <Input textContentType={'username'} onChangeText={(text) => setLogin(text)} />
          </Item>
          <Item style={{ marginTop: 7 }} floatingLabel>
            <Icon name="locked" />
            <Label style={styles.formLabel}>Пароль</Label>
            <Input textContentType={'password'} secureTextEntry={true} onChangeText={(text) => setPassword(text)} />
          </Item>
        </View>
      </View>
      <View style={{ paddingBottom: 15 }}>
        <Button onPress={submit} style={styles.footerButton}>
          <Text style={{ textAlign: 'center' }}>
            Войти
          </Text>
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    // flexDirection: 'column',
    // justifyContent: 'center',
    backgroundColor: '#fff'
  },
  footerButton: {
    alignSelf: 'center',
    width: '100%',
    justifyContent: 'center'
  },
  formLabel: {
    paddingLeft: 10,
  }
});
