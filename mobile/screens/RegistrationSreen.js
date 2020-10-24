import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Button, Text } from 'native-base';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto'
import { connect } from 'react-redux';
import { registerUser } from '../store/actions/user';
import Loader from '../components/Loader';

const RegistrationScreen = ({ navigation, registerUser }) => {
  const [login, setLogin] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const submit = async () => {
    if (!login.trim() || !name.trim() || !password.trim() || !confirmPassword.trim()) return Alert.alert('Не все поля заполнены')
    if (password !== confirmPassword) return Alert.alert('Пароли не совпадают')
    setLoading(true);
    const params = {
      login,
      name,
      password
    }
    const { error } = await registerUser(params)
    if (error) {
      Alert.alert('Ошибка', error)
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={{
        flexShrink: 0,
        flexGrow: 1,
        paddingTop: 10,
        marginBottom: 50
      }}>
        <View style={{ marginTop: 15 }}>
          <Item floatingLabel>
            <Label style={styles.formLabel}>Логин*</Label>
            <Input textContentType={'username'} onChangeText={(text) => setLogin(text)} />
          </Item>
          <Item style={{ marginTop: 7 }} floatingLabel>
            <Label style={styles.formLabel}>Имя*</Label>
            <Input textContentType={'name'} onChangeText={(text) => setName(text)} />
          </Item>
          <Item style={{ marginTop: 7 }} floatingLabel>
            <Icon name="locked" />
            <Label style={styles.formLabel}>Пароль*</Label>
            <Input textContentType={'password'} secureTextEntry={true} onChangeText={(text) => setPassword(text)} />
          </Item>
          <Item error={confirmPassword !== password} style={{ marginTop: 7 }} floatingLabel>
            <Icon name="locked" />
            <Label style={styles.formLabel}>Подтверждение пароля*</Label>
            <Input textContentType={'password'} secureTextEntry={true} onChangeText={(text) => setConfirmPassword(text)} />
          </Item>
        </View>
      </View>
      <View style={{ paddingBottom: 15 }}>
        <Button onPress={() => submit()} style={[styles.footerButton, { marginBottom: 10 }]}>
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
      <Loader visible={loading} />
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

export default connect(
  null,
  {
    registerUser
  }
)(RegistrationScreen);
