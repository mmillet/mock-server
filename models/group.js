/**
 * Created by zhengguo.chen on 17/4/24.
 * Group model
 */

var fs = require('fs-extra');
var path = require('path');
var _ = require('lodash');

const CONFIG = require('../server.config');
const GROUP_VALID_KEYS = ['name', 'description'];
const ERROR_GROUP_NOT_FOUND = 'Group not found.';
const ERROR_GROUP_NAME_EXIST = 'Group name is exist.';
const GROUP_PATH = path.join(CONFIG.DATA_PATH, 'group.json');

var groupModel = {
  _cache: {}, // Save cache data

  /**
   * Save group data to file (group.json)
   * @param data
   * @returns {Promise}
   * @private
   */
  _saveGroupData(data) {
    // save file
    return fs.writeJson(GROUP_PATH, data).then(() => {
      return this._cache = data;
    });
  },

  /**
   * Get group list from file or cache
   * @private
   */
  _getGroupData() {
    var cacheKey = 'groupData';
    if(!this._cache[cacheKey]) {
      return fs.readJson(GROUP_PATH).then(result => {
        return this._cache[cacheKey] = result;
      });
    } else {
      return Promise.resolve(this._cache[cacheKey]);
    }
  },

  /**
   * Check group name not used, if id has set, not check self
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
   * Get group list
   * @returns {Promise}
   */
  getGroupList() {
    return this._getGroupData().then(result => _.toArray(result.list));
  },


  /**
   * Create group
   * @param data
   * @returns {Promise}
   */
  createGroup(data) {
    return this._getGroupData().then(result => {
      result.currentId += 1;

      // do check if name changed
      if(!this._checkNameNotUsed(data.name, result.list)) {
        return Promise.reject(ERROR_GROUP_NAME_EXIST);
      }

      // add data
      var now = Date.now();
      var newGroup = Object.assign({
        id: result.currentId,
        name: "",
        enabled: true,
        createTimestamp: now,
        modifyTimestamp: now
      }, _.pick(data, GROUP_VALID_KEYS));

      result.list[result.currentId] = newGroup;
      return this._saveGroupData(result).then(() => newGroup);
    });
  },

  /**
   * Update group by id
   * @param id
   * @param data
   * @returns {Promise}
   */
  updateGroup(id, data) {
    return this._getGroupData().then(result => {
      var origGroup = result.list[id];
      if(!origGroup) {
        return Promise.reject(ERROR_GROUP_NOT_FOUND);
      }
      // do check if name changed
      var nameChanged = data.name && data.name != origGroup.name;
      if(nameChanged) {
        if(!this._checkNameNotUsed(data.name, result.list)) {
          return Promise.reject(ERROR_GROUP_NAME_EXIST);
        }
      }
      var modifyData = Object.assign(result.list[id], _.pick(data, GROUP_VALID_KEYS), {modifyTimestamp: Date.now()});
      result.list[id] = modifyData;
      return this._saveData(result).then(() => modifyData);
    });
  },

  /**
   * Delete Group by id
   * @param id
   * @returns {Promise}
   */
  deleteGroup(id) {
    return this._getGroupData().then(result => {
      var deleteGroup = result.list[id];
      if(deleteGroup) {
        delete result.list[id];
        return this._saveGroupData(result).then(() => true);
      } else {
        return Promise.reject(ERROR_GROUP_NOT_FOUND);
      }
    });
  }
};

module.exports = groupModel;