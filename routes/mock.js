/**
 * Created by zhengguo.chen on 16/11/23.
 * This is the mock controller for all applications
 */


var _ = require('lodash');
var URL = require('url-parse');
var mock = require("mockjs");
var routeMatcher = require("route-matcher").routeMatcher;

var appModel = require('../models/app');
var apiModel = require('../models/api');

const getMatches = (url, matcher) => {
  var matches = routeMatcher(matcher);
  return matches.parse(url);
};

module.exports = (req, res, next) => {

  var path = req.path,
      originalUrl = req.originalUrl,
      method = req.method;

  var lastMathes = {};

  appModel.getAppList().then(appList => {
    return appList.filter(item => {
        return item.enabled && path.startsWith(item.apiPrefix);
      }).map(item => {
        return apiModel.getApiList(item.id, true).then(apiList => {
          return _.find(apiList, _api => {
            if(!_api.enabled) {
              return false;
            }
            if(_api.method && _api.method != method) {
              return false;
            }
            // Match api method url, support
            // 1. /xxx/:id/yyy [OK]
            // 2. regex [OK]
            // _api.isRegexUrl && console.log(path, new RegExp(_api.url).test(path));
            var matcher = _api.isRegexUrl ? new RegExp(_api.url) : item.apiPrefix + _api.url;
            lastMathes = getMatches(path, matcher);
            return lastMathes !== null;
          });
        })
      });
  }).then(promises => {
    if(!promises.length) {
      throw new Error('Not matched any app');
    }
    return Promise.race(promises);
  }).then(api => {
    console.info('Mock api is matched:', method, originalUrl);
    if(api) {

      if(api.failRate > 0 && Math.random() * 100 < api.failRate) {
        res.status(api.failStatus || 500).send(`This is a fake server error with ${parseInt(api.failRate)}% rate`);
      } else {
        try {

          var response = {};

          // todo security eval
          eval(`response = ${api.response}`);

          if(typeof response === 'object') {
            response = mock.mock(response);
            res.status(api.successStatus || 200);
          } else if(typeof response === 'function') {
            req.params = lastMathes;
            response = mock.mock(response(req, res));
          }

          setTimeout(() => {
            res.jsonp(response);
          }, api.delay);

        } catch(e) {
          throw new Error('Response is invalid');
        }
      }

    } else {
      throw new Error('Not matched any api');
    }
  }).catch(e => {
    console.warn(e, method, originalUrl);
    res.status(500).send(e.message);
    next();
  });

};

