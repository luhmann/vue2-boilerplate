// https://github.com/shelljs/shelljs
require('shelljs/global')
env.NODE_ENV = 'production'

const path = require('path')
const config = require('../config')
const webpack = require('webpack')
const webpackClientConfig = require('./webpack.client.conf')
const webpackServerConfig = require('./webpack.server.conf')

const triggerWebpack = (config, callback) => {
  webpack(config, (err, stats) => {
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n')

    callback && callback()
  })
}

const assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
rm('-rf', assetsPath)
mkdir('-p', assetsPath)
cp('-R', 'static/*', assetsPath)

console.log('Building client and server assets')
triggerWebpack(webpackClientConfig, triggerWebpack.bind(this, webpackServerConfig))
