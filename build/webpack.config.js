const path = require('path');
const config = require('../config');
var glob = require('glob');
var merge = require('webpack-merge');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir);
}

function entries(globPath) {
  var files = glob.sync(globPath);
  var entries = {},
    entry, basename;
  files.forEach(function (entry) {
    basename = path.basename(entry, path.extname(entry));
    entries[basename] = entry;
  });
  return entries;
}

module.exports = {
  entry: merge({}, entries('./src/assets/js/*.js')),
  output: {
    path: config.build.assetsRoot,
    filename: path.posix.join(config.dev.assetsSubDirectory, 'js/[name].[chunkhash].js'),
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,

  },
  resolve: {
    extensions: ['.js', '.art'],
    alias: {
      'static': path.resolve(__dirname, './static/'),
      'assets': path.resolve(__dirname, './src/assets/')
    }
  },
  module: {
    rules: [{
        test: /\.art$/,
        use: ['art-template-loader']
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [{
          loader: "babel-loader",
          options: {
            cacheDirectory: true
          }
        }]
      },


      {
        test: /\.(png|jpe?g|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: '[path].[name].[hash:7].[ext]'
          }
        }]
      }
    ]
  },
  externals: {
    jquery: 'jQuery'
  },
  plugins: [
    new webpack.ProvidePlugin({
      'template': 'art-template/lib/template-web'
    })
  ]
}
