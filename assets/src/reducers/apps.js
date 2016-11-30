import {handleActions} from 'redux-actions';

const initialState = {
	
	appList: undefined,
	apiCollection: {},
	appMap: {}

};

export default handleActions({

	'GET_APP_LIST': (state, action) => {
		var list = !action.error ? action.payload : [];
		var appMap = list.reduce((pre, cur) => {
			pre[cur.id] = cur;
			return pre;
		}, {});
		return Object.assign({}, state, {
			appList: list,
			appMap: appMap
		});
	},

	'GET_API_LIST': (state, action) => {
		if(!action.error) {
			var apiCollection =  Object.assign({}, state.apiCollection, {
				[action.meta.appId]: action.payload
			});
			return Object.assign({}, state, {apiCollection});
		} else {
			return state;
		}
	}
}, initialState);
