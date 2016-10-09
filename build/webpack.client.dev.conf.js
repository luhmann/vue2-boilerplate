// The part of the webpack config different for building the client files in dev-mode
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const config = require('../config')
const utils = require('./utils')

module.exports = {
  module: {
    loaders: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // eval-source-map is faster for development
  devtool: '#eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      alwaysWriteToDisk: true
    }),
    // needed to write index.html to "dist", so server can pick it up
    new HtmlWebpackHarddiskPlugin()
  ]
}
