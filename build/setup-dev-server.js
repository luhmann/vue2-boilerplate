const config = require('../config')
const path = require('path')
const webpack = require('webpack')
const MFS = require('memory-fs')
const proxyMiddleware = require('http-proxy-middleware')
const clientConfig = require('./webpack.client.conf')
const serverConfig = require('./webpack.server.conf')

// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable

module.exports = function setupDevServer (app, onUpdate, whenReady) {
  // setup on the fly compilation + hot-reload
  clientConfig.entry.app = ['webpack-hot-middleware/client', clientConfig.entry.app]
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  )

  const clientCompiler = webpack(clientConfig)
  const webpackDevMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  })

  app.use(webpackDevMiddleware)
  webpackDevMiddleware.waitUntilValid(whenReady)
  app.use(require('webpack-hot-middleware')(clientCompiler))

  // proxy api requests
  Object.keys(proxyTable).forEach(function (context) {
    var options = proxyTable[context]
    if (typeof options === 'string') {
      options = { target: options }
    }
    app.use(proxyMiddleware(context, options))
  })

  // TODO: If we keep static-dir then we need to host it

  // watch and update server renderer
  const serverCompiler = webpack(serverConfig)
  const mfs = new MFS()
  const outputPath = path.join(serverConfig.output.path, serverConfig.output.filename)
  serverCompiler.outputFileSystem = mfs
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    stats = stats.toJson()
    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(err => console.warn(err))
    onUpdate(mfs.readFileSync(outputPath, 'utf-8'))
  })
}
