import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Button, Text } from 'native-base';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto'

export default ({ navigation }) => {
  const [login, setLogin] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const submit = () => {
    console.log('login: ', login);
    console.log('password: ', password);
  }

  return (
    <View style={styles.container}>
      <View style={{
        flexShrink: 0,
        flexGrow: 1,
        paddingTop: 10
      }}>
        <View style={{ marginTop: 15 }}>
          <Item floatingLabel>
            <Label style={styles.formLabel}>Логин</Label>
            <Input textContentType={'username'} onChangeText={(text) => setLogin(text)} />
          </Item>
          <Item style={{ marginTop: 7 }} floatingLabel>
            <Label style={styles.formLabel}>Имя</Label>
            <Input textContentType={'name'} onChangeText={(text) => setName(text)} />
          </Item>
          <Item style={{ marginTop: 7 }} floatingLabel>
            <Icon name="locked" />
            <Label style={styles.formLabel}>Пароль</Label>
            <Input textContentType={'password'} secureTextEntry={true} onChangeText={(text) => setPassword(text)} />
          </Item>
          <Item style={{ marginTop: 7 }} floatingLabel>
            <Icon name="locked" />
            <Label style={styles.formLabel}>Подтверждение пароля</Label>
            <Input textContentType={'password'} secureTextEntry={true} onChangeText={(text) => setConfirmPassword(text)} />
          </Item>
        </View>
      </View>
      <View style={{ paddingBottom: 15 }}>
        <Button onPress={submit} style={[styles.footerButton, { marginBottom: 10 }]}>
          <Text style={{ textAlign: 'center' }}>
            Регистрация
          </Text>
        </Button>
        <Button onPress={() => navigation.goBack()} style={[styles.footerButton, { backgroundColor: '#fff' }]}>
          <Text style={{ textAlign: 'center', color: 'black'  }}>
            Назад
          </Text>
        </Button>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
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
