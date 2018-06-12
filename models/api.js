/**
 * Created by zhengguo.chen on 16/11/23.
 * App model
 */

var fs = require('fs-extra');
var path = require('path');
var shell = require('shelljs');
var klaw = require('klaw');
var _ = require('lodash');
var moment = require('moment');
var appModel = require('./app');

const CONFIG = require('../server.config');
const API_VALID_KEYS = ['method', 'name', 'url', 'tagVersion', 'successStatus', 'failStatus', 'request', 'response', 'enabled', 'delay', 'failRate', 'description'];
const ERROR_API_NAME_INVALID = 'Name is invalid.';
const ERROR_API_NOT_FOUND = 'Api not found.';

const CURRENT_TAG = '_no_version_';

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
   * Get tags path 
   * @param {*} appId 
   */
  _getApiTagsPath(appId, apiId, tag = '') {
    return path.join(CONFIG.DATA_PATH, '' + appId,  '' + apiId, tag);
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
  _saveApiData(appId, apiId, data) {
    // save file
    return fs.writeJson(this._getApiPath(appId), data).then(() => {
      return this._cache = data;
    });
  },

  /**
   * Get tag id by version and date
   * @param {*} version 
   */
  _getTagId(version) {
    return tag = `v${version}_${moment().format('YYYYMMDD')}`;
  },

  /**
   * Create tag file
   * @param {number} appId 
   * @param {number} apiId 
   * @param {object} apiData 
   * @param {number} version 
   */
  _createTag(appId, apiId, apiData, version) {
    var currentTagPath = this._getApiTagsPath(appId, apiId, CURRENT_TAG);
    if(version !== undefined) {
      fs.remove(currentTagPath);
      currentTagPath = this._getApiTagsPath(appId, apiId, this._getTagId(version));
    }
    var rrString = 
      `\n################ REQUEST ################\n${apiData.request || ''}\n################ REQUEST ################\n\n` + 
      `\n################ RESPONSE ################\n${apiData.response || ''}\n################ RESPONSE ################`;
    
    // save tag
    return fs.ensureFile(currentTagPath).then(() => {
      return fs.writeFile(currentTagPath, rrString);
    });
  },
  
  /**
   * Create tag
   * @param {*} appId 
   * @param {*} apiId 
   */
  createTag(appId, apiId) {
    return this.getApi(appId, apiId).then(apiData => {
      var tagVersion = (apiData.tagVersion || 0) + 1;
      return this._createTag(appId, apiId, apiData, tagVersion).then(res => {
        return this.updateApi(appId, apiId, {...apiData, tagVersion});
      });
    });
  },

  /**
   * Delete tag
   * @param {*} appId 
   * @param {*} apiId 
   */
  deleteTag(appId, apiId, tag) {
    var tagPath = this._getApiTagsPath(appId, apiId, tag);
    var currentTagPath = this._getApiTagsPath(appId, apiId, CURRENT_TAG);
    if(fs.existsSync(currentTagPath)) {
      return fs.remove(tagPath).then(res => 'ok');
    } else {
      return fs.rename(tagPath, currentTagPath).then(res => 'ok');
    }
  },

  /**
   * Get tag list
   * @param {*} appId 
   * @param {*} apiId 
   */
  getTagList(appId, apiId) {
    var tagFolderPath = this._getApiTagsPath(appId, apiId);
    return new Promise(resolve => {
      var tags = [];
      fs.ensureDirSync(tagFolderPath);
      klaw(tagFolderPath).on('data', item => {
        var tagName = path.basename(item.path);
        if(tagName === CURRENT_TAG || /^v\d+_\d{8}$/.test(tagName)) {
          tags.push(tagName);
        }
      }).on('end', () => {
        if(tags.length === 0) {
          this.createTag(appId, apiId).then(res => {
            resolve([this._getTagId(1)]);
          })
        } else {
          resolve(tags.sort((item1, item2) => {
            if(item1 === CURRENT_TAG) { 
              return -1; 
            } else if (item2 === CURRENT_TAG) {
              return 1;
            } else { 
              return item1.match(/^v(\d+)_/)[1] * 1 > item2.match(/^v(\d+)_/)[1] * 1 ? -1 : 1;
            }
          }));
        }
      })
    });
  },

  /**
   * Get api tag diff by tag name
   * @param {*} appId 
   * @param {*} apiId 
   * @param {*} tag 
   * @param {*} tagPrev 
   */
  getTagDiff(appId, apiId, tag, tagPrev) {
    var rootPath = this._getApiTagsPath(appId, apiId);
    var tagPath = this._getApiTagsPath(appId, apiId, tag);
    var tagPrevPath = this._getApiTagsPath(appId, apiId, tagPrev);
    return new Promise(resolve => {
      shell.exec(`diff '${tagPrevPath}' '${tagPath}' -U 100000`, {async: true}, (code, stdout, stderr) => {
        if(!stderr) {
          stdout = stdout.replace(new RegExp(rootPath + '/' , 'g'), '').replace('\\ No newline at end of file', '');
        }
        resolve(stdout);
      });
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
        modifyTimestamp: now,
        tagVersion: 0,
      }, _.pick(data, API_VALID_KEYS));

      result.list[result.currentId] = newApi;
      return this._saveApiData(appId, result.currentId, result).then(() => {
        this._createTag(appId, result.currentId, newApi);
        return newApi;
      });
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
      var modifyData = Object.assign({}, origApi, _.pick(data, API_VALID_KEYS), {modifyTimestamp: Date.now()});
      result.list[apiId] = modifyData;
      return this._saveApiData(appId, apiId, result).then(() => {
        // if request or reposonse changed, create a tag
        if(origApi.request !== modifyData.request || origApi.response !== modifyData.response) {
          this._createTag(appId, apiId, modifyData);
        }
        return modifyData;
      });
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
        return this._saveApiData(appId, apiId, result).then(() => true);
      } else {
        return Promise.reject(ERROR_API_NOT_FOUND);
      }
    });
  }
};

module.exports = apiModel;