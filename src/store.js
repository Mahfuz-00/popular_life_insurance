import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import { authReducer } from './reducers/userReducers';
import { loadingReducer } from './reducers/commonReducers';

const reducer = combineReducers({
    auth: authReducer,
    loading : loadingReducer
})

let initialState = {
    
}

const middleware = [thunk];
const store = createStore(reducer, initialState, applyMiddleware(
    ...middleware));

export default store;
