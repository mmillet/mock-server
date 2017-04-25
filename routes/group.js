/**
 * Created by zhengguo.chen on 17/4/24.
 * Group routers
 */

var router = require('express').Router();

var groupModel = require('../models/group');

router.route('/')
  // get group list
  .get((req, res) => {
    res.handleResult(groupModel.getGroupList());
  })
  // create group
  .post((req, res) => {
    res.handleResult(groupModel.createGroup(req.body));
  });

router.route('/:groupId')
  // update group
  .put((req, res) => {
    res.handleResult(groupModel.updateGroup(req.params.groupId, req.body));
  })
  // delete group
  .delete((req, res) => {
    res.handleResult(groupModel.deleteGroup(req.params.groupId));
  });

module.exports = router;
