/**
 * Created by zhengguo.chen on 16/11/23.
 * This is the mock controller for all applications
 */


var _ = require('lodash');
var mock = require("mockjs");
var routeMatcher = require("route-matcher").routeMatcher;

var appModel = require('../models/app');
var apiModel = require('../models/api');

module.exports = (req, res, next) => {

  var path = req.path,
      originalUrl = req.originalUrl,
      method = req.method;

  appModel.getAppList().then(appList => {
    return appList.filter(app => {
        return app.enabled && path.startsWith(app.apiPrefix);
      }).map(app => {
        return apiModel.getApiList(app.id, true).then(apiList => {
          return _.map(apiList, api => {
            if(!api.enabled || (api.method && api.method !== 'ALL' && api.method != method)) {
              return false;
            } else {
              var apiUrl = app.apiPrefix + api.url;
              var params = routeMatcher(apiUrl).parse(path);

              if(!params) {
                return false;
              }
              // compute API match score.
              // each /\:[^\/]+/ -10
              // no method -5
              console.log(api.method);
              var score = 100 - Object.keys(params).length * 10 - (!api.method || api.method == 'ALL' ? 5 : 0);
              return Object.assign({}, api, {
                _appId: app.id,
                _appName: app.name,
                _apiPrefix: app.apiPrefix,
                _score: score,
                _params: params
              });
            }
          }).filter(item => item !== false);
        })
      });
  }).then(promises => {
    if(!promises.length) {
      throw new Error('Not matched any app');
    }
    return Promise.all(promises);
  }).then(apiCollections => {
    // sort by api match score
    var apis = _.flatten(apiCollections);
    var api = null;
    if(req.query.__run_test__ !== undefined) {
      res.send(_.orderBy(apis, ['_score'], ['desc'])).end();
      return;
    } else {
      api = _.maxBy(apis, '_score');
    }
    // console.info('Mock api is matched:', method, originalUrl, api);
    if(api) {
      if(api.failRate > 0 && Math.random() * 100 < api.failRate) {
        res.status(api.failStatus || 500).send(`This is a fake server error with ${parseInt(api.failRate)}% rate`);
      } else {
        try {
          var response;
          if(api.response) {
            // todo security eval
            try {
              eval(`response = ${api.response}`);
            } catch (e) {
              response = api.response;
            }
            if(typeof response === 'function') {
              req.params = api._params;
              response = mock.mock(response(req, res));
            } else {
              response = mock.mock(response);
              res.status(api.successStatus || 200);
            }
          }

          setTimeout(() => {
            typeof response === 'string' ? res.send(response) : res.jsonp(response);
          }, api.delay);

        } catch(e) {
          throw new Error('Response is invalid');
        }
      }

    } else {
      throw new Error('Not matched any api');
    }
  }).catch(e => {
    console.warn(method, originalUrl, e.message);
    if(method === 'GET' && originalUrl === '/') {
      res.redirect('/~m');
    } else {
      res.status(500).send(e.message);
    }
    next();
  });

};

