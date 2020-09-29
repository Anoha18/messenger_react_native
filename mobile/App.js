import React from 'react';
import { Provider } from 'react-redux';
import { Root } from 'native-base';
import store from './store';
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
