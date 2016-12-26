var path = require("path"),
    HtmlWebpackPlugin = require('html-webpack-plugin');

var SRC_PATH = path.join(__dirname, './assets/src');

// 配置入口
var entry = {
  vendors: [
    // css
    path.join(SRC_PATH, 'layouts/css/common.less'),

    // 通用三方代码
    'react',
    'react-dom',
    'react-redux',
    'react-router',
    'react-router-redux',

    'antd',

    'lodash',
    'classnames',
    'querystring',

    'redux',
    'redux-actions',
    'redux-promise',
    'redux-thunk',
  ],

  // 页面入口添加在这里
  index: path.join(SRC_PATH, 'index.js')
};

// 配置各个页面依赖
var htmlWebpackPlugins = [
  // 配置各个页面依赖
  new HtmlWebpackPlugin({
    inject: true,
    filename: './index.html',
    template: path.join(SRC_PATH, 'index.html'),
    chunks: ['vendors', 'index', 'manifest']
  })
];

module.exports = {
  entry: entry,
  htmlWebpackPlugins: htmlWebpackPlugins
};
