import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension'
import reduxThunk  from 'redux-thunk';
import reducers from './reducers';

const rootReducres = combineReducers(reducers);
const middleware = composeWithDevTools(applyMiddleware(reduxThunk));

export default createStore(rootReducres, middleware);
