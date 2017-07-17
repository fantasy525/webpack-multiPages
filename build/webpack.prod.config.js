/**
 * Created by zxf on 2017/6/22/0022.
 */
var path = require('path')
var webpack = require('webpack')
var config = require('../config')
var glob = require('glob');
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.config')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var env = config.build.env;
var prodConfig = {
  module: {
    rules: [{
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: {
          loader: 'css-loader',
          query: {
            sourceMap: true
          }
        }
      })
    }]
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: path.posix.join(config.build.assetsSubDirectory, 'js/[name].[chunkhash].js'),
    chunkFilename: path.posix.join(config.build.assetsSubDirectory, 'js/[id].[chunkhash].js')
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    new ExtractTextPlugin({
      filename: path.posix.join(config.build.assetsSubDirectory, 'css/[name].[contenthash].css')
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: 2
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']

    })
    // new CopyWebpackPlugin([{
    //     from: path.resolve(__dirname, 'static'),
    //     to: config.build.assetsSubDirectory,
    //     ignore: ['.*']
    // }])
  ]
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
  prodConfig.plugins.push(plugin);
});
module.exports = merge(baseWebpackConfig, prodConfig);
