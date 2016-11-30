import {routeReducer} from 'react-router-redux';
import {combineReducers} from 'redux';
import apps from './apps';
import root from './root';

export default combineReducers({
	routeReducer, // react router
	apps,
	root,
})
