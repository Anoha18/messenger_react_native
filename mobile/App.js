import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import { Root } from 'native-base';
import store from './store';
import { connectSocket } from './store/actions/socket';
import AppContainer from './screens';

const App: () => React$Node = () => {
  return (
    <Provider store={store}>
      <Root>
        <AppContainer />
      </Root>
    </Provider>
  );
};

export default App;
