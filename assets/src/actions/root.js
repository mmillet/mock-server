import {createAction} from 'redux-actions';

export default {
	showPageLoading: createAction('SHOW_PAGE_LOADING'),
	hidePageLoading: createAction('HIDE_PAGE_LOADING'),
	changeDefaultApp: createAction('CHANGE_DEFAULT_APP', appId => Promise.resolve(appId))
}