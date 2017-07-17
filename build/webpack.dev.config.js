/**
 * Created by zxf on 2017/6/22/0022.
 */
var webpack = require('webpack')
var path = require('path')
var glob = require('glob');
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.config')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var devConfig = {
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        { loader: 'style-loader' }, {
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        }
      ]
    }]
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor'],
      minChunks: 2
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']

    }),

    new ExtractTextPlugin({
      allChunks: true,
      filename: path.posix.join(config.dev.assetsSubDirectory, 'css/[name].[contenthash].css')

    })
  ],
  devServer: {
    publicPath: '/',
    inline: true,
    proxy: {
      "/Gre": {
        target: 'http://gmat.1gre.cn/',
        changeOrigin: true,
        pathRewrite: {
          '^/Gre': '/Gre'
        }
      }
    }
  }
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
var entries = entries('src/assets/js/*.js');

Object.keys(entries).forEach(function (name) {
  // 每个页面生成一个entry，如果需要HotUpdate，在这里修改entry


  // 每个页面生成一个html
  var plugin = new HtmlWebpackPlugin({
    // 生成出来的html文件名
    filename: name + '.html',
    // 每个html的模版，这里多个页面使用同一个模版
    template: 'html-withimg-loader!./src/' + name + '.html',
    // 自动将引用插入html
    inject: true,
    // 每个html引用的js模块，也可以在这里加上vendor等公用模块
    chunks: [name, 'vendor', 'manifest'],
    chunksSortMode: 'dependency'
  });
  devConfig.plugins.push(plugin);
});

module.exports = merge(baseWebpackConfig, devConfig);
