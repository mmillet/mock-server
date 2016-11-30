require('es6-promise').polyfill();
require('isomorphic-fetch');

import {message} from 'antd';
import qs from 'querystring';
import isEmpty from 'lodash.isempty';

const SUCCESS_CODE = 200;

export const METHODS = {
	GET: 'get',
	POST: 'post',
	PUT: 'put',
	DELETE: 'delete'
};

/**
 * 统一发起请求
 * @param url
 * @param params
 * @param method
 * @param jsonType 是否为json类型
 * @returns {*}
 */
const request = (url, params, method = METHODS.GET, jsonType = true) => {
	var options = {
		headers: {
			'Content-Type': jsonType ? 'application/json' : 'application/x-www-form-urlencoded'
		},
		method: method,
		credentials: 'include'
	};
	if (method !== METHODS.GET && !isEmpty(params)) {
		options.body = jsonType ? JSON.stringify(params) : qs.stringify(params)
	} else if (method === METHODS.GET && !isEmpty(params)) {
		url += ('?' + qs.stringify(params));
	}
	return fetch(url, options).then(checkRespStatus);
};

/**
 * 统一响应检查
 * @param respPromise
 * @returns {*}
 */
const checkRespStatus = (respPromise) => {
	if (respPromise.status !== 200) {
		return Promise.reject('Server error occurred');
	}
	return respPromise.json().then(resp => {
		if (resp && resp.code == SUCCESS_CODE) {
			return Promise.resolve(resp.data);
		} else if (typeof(resp) === 'string' && resp.indexOf('InvalidSession') > -1) {
			window.location.reload();
		} else {
			resp.msg && message.error(resp.msg);
			return Promise.reject(resp);
		}
	});
};

export default request;


