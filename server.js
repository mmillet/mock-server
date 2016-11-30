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
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(require('./middlewares/response.middleware')); // support res.success() / res.fail()
app.use(require('./middlewares/token.middleware')); // support res.success() / res.fail()

app.use('/~m', express.static('./assets/dist')); // management static path
app.use('/~m/setting', require('./routes/setting')); // management setting route
app.use('/~m/app', require('./routes/app')); // management app route
app.use('/~m/token', require('./routes/token')); // management token route

app.set('jsonp callback name', 'callback'); // support jsonp
app.use(require('./routes/mock')); // start mocking data

var port = process.argv.slice(2)[0] || 80; // listen port
var server = app.listen(port, () => {
  console.info('Mock server is listening at ' + port);
});

