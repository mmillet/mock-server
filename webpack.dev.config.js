var path = require('path'),
    webpack = require('webpack'),
    autoprefixer = require('autoprefixer'),
    precss = require('precss'),
    pages = require('./pages.config');

var SRC_PATH = path.join(__dirname, './assets/src'),
    DIST_PATH = path.join(__dirname, '../static');

var config = {

  entry: pages.entry,

  resolve: {
    root: [SRC_PATH],
    alias: {},
    extensions: ['', '.less', '.css', '.js', '.json']
  },

  output: {
    path: DIST_PATH,
    publicPath: '',
    filename: 'js/[name].js'
  },

  clearBeforeBuild: false,

  plugins: [
    new webpack.optimize.CommonsChunkPlugin(
      'vendors',
      'js/vendors.' + pages.vendorVersion + '.js', // vendor date
      Infinity
    ),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      '__DEV__': true
    })
  ].concat(pages.htmlWebpackPlugins),

  module: {
    noParse: [],

    loaders: [
      {test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel-loader']},

      // less url import issue
      // see:https://github.com/webpack/css-loader/issues/74
      {
        test: /\.less$/,
        include: /src(\\|\/)(containers|components)/,
        loader: 'style!' +
                'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!' +
                'postcss!' +
                'less'
      },
      {
        test: /\.less$/,
        include: /src(\\|\/)layouts/,
        loader: 'style!' +
                'css!' +
                'postcss!' +
                'less'
      },
      // css
      {
        test: /\.css$/,
        exclude: /src/,
        loader: 'style!css'
      },

      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url',
        query: {
          limit: 8192,
          name: 'images/[name].[ext]'
        }
      },

      {
        test: /\.(eot|woff|woff2|ttf|svg)((\?|\#)[\?\#\w\d_-]+)?$/,
        loader: 'url',
        query: {
          limit: 100,
          name: 'fonts/[name].[ext]'
        }
      }
    ],
  },

  //Fix react-hot-loader issue, see https://github.com/gaearon/react-hot-loader/issues/417
  // alias: {'react/lib/ReactMount': 'react-dom/lib/ReactMount'},

  postcss: function () {
    return {
      defaults: [precss, autoprefixer],
      cleaner:  [autoprefixer({ browsers: ['last 4 versions'] })]
    };
  },

  devServer: {
    hot: true,
    inline: true,
    proxy: {
      // 配置代理，开发环境下以 /api 开头的请求被代理到 target
      '/~m/*': {
        target: 'http://127.0.0.1:8081',
        secure: false
      }
    }
  }
};


console.log('initializing webpack development build....');

module.exports = config;
