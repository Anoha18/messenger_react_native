import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import store from './store';
import { connectSocket } from './store/actions/socket';

const AppWrap = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(connectSocket());
  }, [])

  return (
    <View>
      <Text>
        Hello world
      </Text>
    </View>
  )
}

const App: () => React$Node = () => {
  return (
    <Provider store={store}>
      <AppWrap />
    </Provider>
  );
};

export default App;
