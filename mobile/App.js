import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Root } from 'native-base';
import store from './store';
import AppContainer from './screens';
import { checkServer } from './store/actions/server';

const AppWrap = () => {
  useEffect(() => {
    store.dispatch(checkServer());
  })
  
  return (
    <Provider store={store}>
      <Root>
        <AppContainer />
      </Root>
    </Provider>
  );
}

const App: () => React$Node = () => <AppWrap />

export default App;
