/**
 * Created by zhengguo.chen on 16/11/23.
 * App model
 */

var fs = require('fs-promise');
var path = require('path');
var _ = require('lodash');
const CONFIG = require('../server.config');

const APP_VALID_KEYS = ['name', 'description', 'enabled', 'apiPrefix', 'responseTemplate'];
const ERROR_APP_NAME_INVALID = 'Name is invalid.';
const ERROR_APP_NAME_EXIST = 'Name already exists.';
const ERROR_APP_FOLDER_EXIST = 'Name folder already exists.';
const ERROR_APP_NOT_FOUND = 'App not found.';


var appModel = {
  _cache: null, // Save cache data

  /**
   * Check app name
   * @param name
   * @returns {boolean}
   * @private
   */
  _checkNameValid(name) {
    return true;
  },

  /**
   * Check app name not used, if id has set, not check self
   * @param name
   * @param list
   * @param id
   * @returns {boolean}
   * @private
   */
  _checkNameNotUsed(name, list, id) {
    var lowerCaseName = ('' + name).toLowerCase();
    return _.find(list, item => {
      if(id) {
        return item.id != id && lowerCaseName === item.name.toLowerCase();
      } else {
        return lowerCaseName === item.name.toLowerCase();
      }
    }) === undefined;
  },

  /**
   * Save data to file
   * @param data
   * @returns {Promise}
   * @private
   */
  _saveData(data) {
    // save file
    return fs.writeJson(CONFIG.APP_FILENAME, data).then(() => {
      return this._cache = data;
    });
  },

  /**
   * Get data from file or cache
   * @returns {Promise}
   * @private
   */
  _getData() {
    if(this._cache === null) {
      return fs.readJson(CONFIG.APP_FILENAME).then(result => {
        return this._cache = result;
      });
    } else {
      return Promise.resolve(this._cache);
    }
  },

  /**
   * Get app list
   * @returns {Promise}
   */
  getAppList() {
    return this._getData().then(result => _.toArray(result.list).filter(item => !item.deleted));
  },

  /**
   * Create app
   * @param data
   * @returns {Promise}
   */
  createApp(data) {
    return this._getData().then(result => {
      // check name valid and duplicate
      if(!this._checkNameValid(data.name)) {
        return Promise.reject(ERROR_APP_NAME_INVALID);
      }
      if(!this._checkNameNotUsed(data.name, result.list)) {
        return Promise.reject(ERROR_APP_NAME_EXIST);
      }

      result.currentId += 1;
      var newPath = path.join(CONFIG.DATA_PATH, '' + result.currentId);
      // check folder exist
      if(fs.existsSync(newPath)) {
        return Promise.reject(ERROR_APP_FOLDER_EXIST);
      }
      // add data
      var now = Date.now();
      var newApp = Object.assign({
        id: result.currentId,
        createTimestamp: now,
        modifyTimestamp: now,
        enabled: true,
        apiPrefix: '/',
        description: '',
        apiCount: 0
      }, _.pick(data, APP_VALID_KEYS));
      result.list[result.currentId] = newApp;
      // make api dir async and add data
      return fs.mkdirs(newPath).then(() => {
        return fs.writeJson(path.join(newPath, 'api.json'), {
          createTimestamp: now,
          modifyTimestamp: now,
          currentId: 0,
          list: {}
        });
      }).then(() => {
        console.log('Initialize api dir successfully:', newPath);
        return this._saveData(result).then(() => newApp);
      });
    });
  },

  /**
   * Get app by id
   * @param id
   * @returns {Promise}
   */
  getApp(id) {
    return this._getData().then(result => {
      return result.list[id] || Promise.reject(ERROR_APP_NOT_FOUND);
    });
  },

  /**
   * Update app by id
   * @param id
   * @param data
   * @returns {Promise}
   */
  updateApp(id, data) {
    return this._getData().then(result => {
      var origApp = result.list[id];
      if(!origApp) {
        return Promise.reject(ERROR_APP_NOT_FOUND);
      }
      // do check if name changed
      var nameChanged = data.name && data.name != origApp.name;
      if(nameChanged) {
        if(!this._checkNameValid(data.name)) {
          return Promise.reject(ERROR_APP_NAME_INVALID);
        }
        if(!this._checkNameNotUsed(data.name, result.list)) {
          return Promise.reject(ERROR_APP_NAME_EXIST);
        }
      }
      var modifyData = Object.assign(result.list[id], _.pick(data, APP_VALID_KEYS), {modifyTimestamp: Date.now()});
      result.list[id] = modifyData;
      return this._saveData(result).then(() => {
        return modifyData;
      });
    });
  },

  /**
   * Delete app by id
   * @param id
   * @returns {Promise}
   */
  deleteApp(id) {
    return this._getData().then(result => {
      var deleteApp = result.list[id];
      if(deleteApp) {
        var appPath = path.join(CONFIG.DATA_PATH, '' + deleteApp.id);
        // 假删除
        result.list[id].deleted = true;
        result.list[id].deletedTimestamp = Date.now();
        return this._saveData(result).then(() => {
          // move api to delete dir
          fs.move(appPath, path.join(CONFIG.DATA_PATH, `${deleteApp.id}_deleted`));
          return true;
        });
      } else {
        return Promise.reject(ERROR_APP_NOT_FOUND);
      }
    });
  }

};

module.exports = appModel;