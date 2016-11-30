/**
 * Created by zhengguo.chen on 16/11/23.
 */


var path = require('path');

const DATA_PATH = path.join(__dirname, './data');

module.exports = {
  DATA_PATH: DATA_PATH,
  SETTING_FILENAME: path.join(DATA_PATH, 'setting.json'),
  APP_FILENAME: path.join(DATA_PATH, 'app.json')
}