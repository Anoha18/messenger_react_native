import { createStore, combineReducers } from 'redux';
import reducers from './reducers';

const rootReducres = combineReducers(reducers);

export default createStore(rootReducres);
