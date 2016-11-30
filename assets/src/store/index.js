import {createStore, applyMiddleware} from 'redux';

// middleware
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import loggerMiddleware from 'middleware/logger';
import {syncHistory} from 'react-router-redux';
import {hashHistory} from 'react-router';

// reducer
import rootReducer from '../reducers';

export default (initialState) => {
	const create = __DEV__ && window.devToolsExtension ? window.devToolsExtension()(createStore) : createStore;
	
	const createStoreWithMiddleware = applyMiddleware(
		thunkMiddleware,
		promiseMiddleware,
		// loggerMiddleware,
		syncHistory(hashHistory)
	)(create);
	
	const store = createStoreWithMiddleware(rootReducer, initialState);
	
	if (__DEV__) {
		module.hot && module.hot.accept('../reducers', () => {
			const nextReducer = require('../reducers');
			store.replaceReducer(nextReducer)
		});
	}
	return store;
}