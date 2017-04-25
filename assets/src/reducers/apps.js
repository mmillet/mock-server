import {handleActions} from 'redux-actions';
import _ from 'lodash';

const initialState = {
	
	appList: undefined,
	apiCollection: {},
	appMap: {},
	groupList: [],
	currentGroupId: window.localStorage.getItem('currentGroupId') || ''

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
			var appId = action.meta.appId;
			var apiCollection = Object.assign({}, state.apiCollection, {
				[appId]: action.payload
			});
			return Object.assign({}, state, {apiCollection});
		} else {
			return state;
		}
	},

	'GET_GROUP_LIST': (state, action) => {
		if(!action.error) {

			var groupList = [{id: '', name: 'All Applications'}, ...action.payload];

			var {currentGroupId} = state;
			if(_.findIndex(groupList, group => group.id == currentGroupId) === -1) {
				currentGroupId = `${groupList[groupList.length - 1].id}`;
			}

			return {...state, currentGroupId, groupList: [{id: '', name: '所有项目'}, ...action.payload]};
		} else {
			return state;
		}
	},

	'SELECT_GROUP': (state, action) => {
		var currentGroupId = action.payload;
		window.localStorage.setItem('currentGroupId', currentGroupId);
		return {...state, currentGroupId};
	}

}, initialState);
