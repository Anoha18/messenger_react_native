import React from 'react';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import store from './store';

const App: () => React$Node = () => {
  console.log('HIIIIII');

  return (
    <Provider store={store}>
      <View>
        <Text>Hello world</Text>
      </View>
    </Provider>
  );
};

export default App;
