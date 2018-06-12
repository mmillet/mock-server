/**
 * Created by zhengguo.chen on 16/11/23.
 * Setting model
 */

var fs = require('fs-extra');
var _ = require('lodash');
const CONFIG = require('../server.config');

const VALID_KEYS = ['managePassword', 'responseKeyStatus', 'responseKeyMessage', 'responseKeyData'];

var settingModel = {
  _cache: null, // Save cache data

  /**
   * Get settings
   * @returns {Promise}
   */
  get() {
    if(this._cache === null) {
      return fs.readJson(CONFIG.SETTING_FILENAME).then(res => {
        return this._cache = res;
      }).catch(err => {
        this._cache = null;
        return err;
      });
    } else {
      return Promise.resolve(this._cache);
    }
  },

  /**
   * Update settings
   * @param data
   * @returns {Promise}
   */
  update(data) {
    return this.get().then(settings => {
      settings = Object.assign(settings, _.pick(data, VALID_KEYS), {modifyTimestamp: Date.now()});
      return fs.writeJson(CONFIG.SETTING_FILENAME, settings).then(() => {
        return this._cache = settings;
      }).catch(err => {
        this._cache = null;
        return err;
      });
    });
  }

};

module.exports = settingModel;
