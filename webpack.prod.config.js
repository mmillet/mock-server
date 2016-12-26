var path = require('path'),
    webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    autoprefixer = require('autoprefixer'),
    precss = require('precss'),
    pages = require('./pages.config');

var SRC_PATH = path.join(__dirname, './assets/src'),
    DIST_PATH = path.join(__dirname, './assets/dist'),
    CHUNK_FILE_HASH_TAG = '_[chunkhash:5]';

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
    filename: `js/[name]${CHUNK_FILE_HASH_TAG}.js`,
    chunkFilename: `js/[name]${CHUNK_FILE_HASH_TAG}.js`
  },

  clearBeforeBuild: true,

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendors', 'manifest'],
      minChunks: Infinity
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      '__DEV__': false
    }),

    new ExtractTextPlugin(`css/[name]${CHUNK_FILE_HASH_TAG}.css`, {allChunks: true}),

    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      warnings: false
    })
  ].concat(pages.htmlWebpackPlugins),

  module: {
    noParse: [],

    loaders: [
      {test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel-loader']},

      // less url import issue
      // see:https://github.com/webpack/css-loader/issues/74
      // rewrite the publickPath of url
      // https://github.com/webpack/extract-text-webpack-plugin
      {
        test: /\.less$/,
        include: /src(\\|\/)(containers|components)/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!' +
          'postcss!' +
          'less'
          , {publicPath: '../'})
      },
      {
        test: /\.less$/,
        include: /src(\\|\/)layouts/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css!' +
          'postcss!' +
          'less'
          , {publicPath: '../'})
      },
      // css
      {
        test: /\.css$/,
        exclude: /src/,
        loader: 'style!css'
      },

      {
        test: /\.(png|jpg|gif|svg|webp|ico)$/,
        loader: 'url',
        query: {
          limit: 8192,
          name: `imgs/[name]${CHUNK_FILE_HASH_TAG}.[ext]`
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
    ]
  },

  //Fix react-hot-loader issue, see https://github.com/gaearon/react-hot-loader/issues/417
  // alias: {'react/lib/ReactMount': 'react-dom/lib/ReactMount'},

  postcss: function () {
    return {
      defaults: [precss, autoprefixer],
      cleaner:  [autoprefixer({ browsers: ['last 4 versions'] })]
    };
  }
};

console.log('initializing webpack production build....');

module.exports = config;
