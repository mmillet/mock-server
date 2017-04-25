/**
 * Created by chenzhengguo on 2015/7/30.
 * Updated by chenzhengguo on 2016/1/28.
 * Updated by zhengguo.chen on 2016/6/30.
 * Updated by zhengguo.chen on 2016/9/18.
 * Updated by zhengguo.chen at 2016/11/23.
 */

var path = require('path');
var fs = require('fs');
var express = require('express');
var favicon = require('express-favicon');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var basicAuth = require('basic-auth-connect');

app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(require('./middlewares/response.middleware')); // support res.success() / res.fail()
app.use(require('./middlewares/token.middleware')); // support res.success() / res.fail()

app.use(favicon(__dirname + '/assets/favicon.ico', /\/favicon\.ico/));

var auth = (req, res, next) => {
  var settingModel = require('./models/setting');
  settingModel.get().then(config => {
    basicAuth(function(user, pass){
      return config.manageUsername == user && config.managePassword == pass;
    })(req, res, next)
  });
};

app.use('/~m', auth);
app.use('/~m', express.static('./assets/dist')); // management static path
app.use('/~m/setting', require('./routes/setting')); // management setting route
app.use('/~m/group', require('./routes/group')); // management group route
app.use('/~m/app', require('./routes/app')); // management app route
app.use('/~m/token', require('./routes/token')); // management token route

app.set('jsonp callback name', 'callback'); // support jsonp
app.use(require('./routes/mock')); // start mocking data

var port = process.argv.slice(2)[0] || 80; // listen port
var server = app.listen(port, () => {
  console.info('Mock server is listening at ' + port);
});

