/**
 * Created by chenzhengguo on 2015/7/30.
 * Updated by chenzhengguo on 2016/1/28.
 * Updated by zhengguo.chen on 2016/6/30.
 * Updated by zhengguo.chen on 2016/9/18.
 */
var path = require('path');
var fs = require('fs');
var mock = require("mockjs");
var app = require('express')();
var proxy = require('express-http-proxy');
var proxy2 = require('http-proxy-middleware');
var URL = require('url-parse');

var port = process.argv.slice(2)[0] || 8080;

const API_FILE = path.join(__dirname, './api.config.js');

var api = require(API_FILE);

//查看API管理
//静态目录
var express = require('express');
app.use('', express.static(path.join(__dirname, './asset')));
app.use('/~m/cp', (req, res) => {
  // 创建读取流
  var readable = fs.createReadStream(path.join(__dirname, './api.config.js'));
  // 创建写入流
  var writable = fs.createWriteStream(path.join(__dirname, './asset/api.config.js'));
  // 通过管道来传输流
  readable.pipe(writable);
  res.send('OK');
});
app.use('/~m/all', (req, res) => {
  res.contentType("application/json; charset=UTF-8");
  fs.stat(API_FILE, (err, state) => {
    res.json(Object.assign(api, {lastModify: state.mtime.getTime()}));
  });
});
app.use('/~m/download', (req, res) => {
  res.contentType('application/javascript; charset=UTF-8');
  res.sendFile(path.join(__dirname, './api.config.js'));
});


// 代理请求
// see https://github.com/chimurai/http-proxy-middleware
app.use('/proxy/:url', proxy2({
  target: 'SET-IN-ROUTER',
  changeOrigin: true,
  router: function (req) { 
    var url = new URL(req.param('url'));
    return url.origin;
  },
  pathRewrite: function (path, req) { 
    var url = new URL(req.param('url'));
    console.log(url);
    return url.pathname;
  },
  onProxyRes(proxyRes, req, res) {
    // 支持跨域
    proxyRes.headers['Access-Control-Allow-Headers'] = 'x-requested-with, content-type, accept, origin, authorization, x-csrftoken, user-agent, accept-encoding';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET';
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
}));

// 支持jsonp
app.set('jsonp callback name', 'callback');

// 注册API
api.groups.forEach(group => {
  group.data.forEach(reqData => {
    if(reqData.deprecated) return;
    reqData.forward ?
      app.use(api.prefix + reqData.url,
        proxy('localhost:' + port, {
          forwardPath: () => {
            console.log(`Forward => ${api.prefix + reqData.forward}`);
            return api.prefix + reqData.forward;
          }
        })
      )
      :
      app.use(api.prefix + reqData.url, (req, res) => {
        console.log(`[${req.ip}] Request: ${decodeURIComponent(req.originalUrl)}`);
        var apiRes = mock.mock(reqData.res);
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Credentials', true);
        res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        res.set('Access-Control-Allow-Headers', 'x-requested-with, content-type, accept, origin, authorization, x-csrftoken, user-agent, accept-encoding');
        if(req.method !== 'OPTIONS' && (reqData.status && reqData.status !== 200)) {
          res.status(reqData.status).send(reqData.res).end();
        }
        setTimeout(() => res.jsonp(apiRes), reqData.delay || 0);
      });
  })
});

// 404
app.use((req, res) => {
  res.sendStatus(404);
});

var server = app.listen(port, () => {
  console.info('Mock server is listening at ' + port);
});
