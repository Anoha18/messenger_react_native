import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Root } from 'native-base';
import store from './store';
import AppContainer from './screens';
import { checkServer } from './store/actions/server';
import { autoLogin } from './store/actions/user';
import SplashScreen from 'react-native-splash-screen';

const AppWrap = () => {
  useEffect(() => {
    store.dispatch(checkServer());

    const _autoLogin = async () => {
      await store.dispatch(await autoLogin());
    }

    _autoLogin();
    SplashScreen.hide();
  }, []);
  
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
