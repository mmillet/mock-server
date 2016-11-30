/**
 * Created by zhengguo.chen on 16/11/23.
 * App model
 */

var fs = require('fs-promise');
var path = require('path');
var _ = require('lodash');
var appModel = require('./app');

const CONFIG = require('../server.config');
const API_VALID_KEYS = ['method', 'name', 'url', 'successStatus', 'failStatus', 'request', 'response', 'enabled', 'delay', 'failRate', 'description'];
const ERROR_API_NAME_INVALID = 'Name is invalid.';
const ERROR_API_NOT_FOUND = 'Api not found.';


var apiModel = {
  _cache: {}, // Save cache data

  /**
   * Check app exist by app model
   * @param appId
   * @returns {Promise}
   * @private
   */
  _checkAppExist(appId) {
    return appModel.getApp(appId);
  },

  /**
   * Get api.json path
   * @param appId
   * @returns {string}
   * @private
   */
  _getApiPath(appId) {
    return path.join(CONFIG.DATA_PATH, '' + appId, 'api.json');
  },

  /**
   * Check api name
   * @param name
   * @returns {boolean}
   * @private
   */
  _checkNameValid(name) {
    return true;
  },

  /**
   * Save api data to file (api.json)
   * @param data
   * @returns {Promise}
   * @private
   */
  _saveApiData(appId, data) {
    // save file
    return fs.writeJson(this._getApiPath(appId), data).then(() => {
      return this._cache = data;
    });
  },

  /**
   * Get api list from file or cache
   * @param appId
   * @private
   */
  _getApiData(appId) {
    var cacheKey = 'appInfo_' + appId;
    if(!this._cache[cacheKey]) {
      return this._checkAppExist(appId)
        .then(() => fs.readJson(this._getApiPath(appId)))
        .then(result => {
          return this._cache[cacheKey] = result;
        });
    } else {
      return Promise.resolve(this._cache[cacheKey]);
    }
  },

  /**
   * Get app list
   * @param appId
   * @param withResponse
   * @returns {Promise}
   */
  getApiList(appId, withResponse) {
    return this._getApiData(appId).then(result => {
      var list = _.toArray(result.list);
      return withResponse ? list : list.map(item => {
        return _.omit(item, 'request', 'response');
      });
    });
  },


  /**
   * Create api
   * @param appId
   * @param data
   * @returns {Promise}
   */
  createApi(appId, data) {
    return this._getApiData(appId).then(result => {
      // check name
      if(!this._checkNameValid(data.name)) {
        return Promise.reject(ERROR_API_NAME_INVALID);
      }
      result.currentId += 1;
      // add data
      var now = Date.now();
      var newApi = Object.assign({
        id: result.currentId,
        name: "",
        enabled: true,
        createTimestamp: now,
        modifyTimestamp: now
      }, _.pick(data, API_VALID_KEYS));

      result.list[result.currentId] = newApi;
      return this._saveApiData(appId, result).then(() => newApi);
    });
  },

  /**
   * Get app by id
   * @param appId
   * @param apiId
   * @returns {Promise}
   */
  getApi(appId, apiId) {
    return this._getApiData(appId).then(result => {
      return result.list[apiId] || Promise.reject(ERROR_API_NOT_FOUND);
    });
  },

  /**
   * Update api by id
   * @param id
   * @param data
   * @returns {Promise}
   */
  updateApi(appId, apiId, data) {
    return this._getApiData(appId).then(result => {
      var origApi = result.list[apiId];
      if(!origApi) {
        return Promise.reject(ERROR_API_NOT_FOUND);
      }
      var modifyData = Object.assign(origApi, _.pick(data, API_VALID_KEYS), {modifyTimestamp: Date.now()});
      result.list[apiId] = modifyData;
      return this._saveApiData(appId, result).then(() => modifyData);
    });
  },

  /**
   * Delete api by id
   * @param appId
   * @param apiId
   * @returns {Promise}
   */
  deleteApi(appId, apiId) {
    return this._getApiData(appId).then(result => {
      var deleteApi = result.list[apiId];
      if(deleteApi) {
        delete result.list[apiId];
        return this._saveApiData(appId, result).then(() => true);
      } else {
        return Promise.reject(ERROR_API_NOT_FOUND);
      }
    });
  }
};

module.exports = apiModel;