import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Item, Input, Label, Button, Text } from 'native-base';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { authUser } from '../store/actions/user';
import { disconnectSocket } from '../store/actions/socket';
import Loader from '../components/Loader';

export default ({ navigation }) => {
  const dispatch = useDispatch();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(disconnectSocket())
  })

  const submit = async() => {
    setLoading(true);
    const { error } = await dispatch(await authUser({ login, password }))
    console.log(result);
    setLoading(false);
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
            <Label>Логин</Label>
            <Input textContentType={'username'} onChangeText={(text) => setLogin(text)} />
          </Item>
          <Item style={{ marginTop: 7 }} floatingLabel>
            <Label>Пароль</Label>
            <Input textContentType={'password'} secureTextEntry={true} onChangeText={(text) => setPassword(text)} />
          </Item>
        </View>
      </View>
      <View style={{ paddingBottom: 15 }}>
        <Button onPress={submit} style={[styles.footerButton, { marginBottom: 10 }]}>
          <Text style={{ textAlign: 'center' }}>
            Войти
          </Text>
        </Button>
        <Button onPress={() => navigation.push('registration', { transition: 'vertical' })} style={[styles.footerButton, { backgroundColor: '#fff' }]}>
          <Text style={{ textAlign: 'center', color: 'black'  }}>
            Регистрация
          </Text>
        </Button>
      </View>
      <Loader visible={loading} />
    </View>
  )
}

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
});
