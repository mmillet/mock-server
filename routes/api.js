/**
 * Created by zhengguo.chen on 16/11/24.
 */

var _ = require('lodash');
var router = require('express').Router();
var apiModel = require('../models/api');

router.route('/')

// get app list
  .get((req, res) => {
    res.handleResult(apiModel.getAppList());
  })

  // add app
  .post((req, res) => {
    res.handleResult(apiModel.createApp(req.body));
  });

router.route('/:appId')

// get app
  .get((req, res) => {
    res.handleResult(apiModel.getApi(req.params.appId));
  })

  // update app
  .put((req, res) => {
    res.handleResult(apiModel.updateApp(req.params.appId, req.body));
  })

  // delete app
  .delete((req, res) => {
    res.handleResult(apiModel.deleteApp(req.params.appId));
  });

module.exports = router;