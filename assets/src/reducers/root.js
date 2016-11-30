import {handleActions} from 'redux-actions';

const initialState = {
	pageLoading: false,
	user: {
		email: 'anonymous@mail.dealmoon.com'
	},
	defaultApp: {}
};
export default handleActions({
	
	'SHOW_PAGE_LOADING': (state, action) => Object.assign({}, state, {pageLoading: true}),

	'HIDE_PAGE_LOADING': (state, action) => Object.assign({}, state, {pageLoading: false}),

	'GET_CURRENT_USER': (state, action) => {
		return Object.assign({}, state, {user: {email: action.payload}});
	},
	
	'CHANGE_DEFAULT_APP': (state, action)=> {
		return Object.assign({}, state, {defaultApp: action.payload})
	}

}, initialState);