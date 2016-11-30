/**
 * Created by zhengguo.chen on 16/11/23.
 * Login controller
 */

var router = require('express').Router();

router.route('/')
  .post((req, res, next) => {
    res.success('logined');
  });

module.exports = router;