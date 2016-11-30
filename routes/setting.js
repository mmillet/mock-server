/**
 * Created by zhengguo.chen on 16/11/23.
 * Config controller
 */

var router = require('express').Router();

var settingModel = require('../models/setting');

router.route('/')

  // get settings
  .get((req, res) => {
    res.handleResult(settingModel.get());
  })

  // update setting
  .put((req, res) => {
    res.handleResult(settingModel.update(req.body));
  });

module.exports = router;
