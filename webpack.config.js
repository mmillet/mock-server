var removeDir = function(path) {
  var fs = require('fs-extra');
  fs.removeSync(path, function(err) {
    err && console.error(err);
    console.info('Clean path', path);
  });
  return config;
};


var config = {};
if (process.env.NODE_ENV != 'production') {
  config = require('./webpack.dev.config.js');
} else {
  config = require('./webpack.prod.config.js');
}

config.clearBeforeBuild && removeDir(config.output.path);

module.exports = config;