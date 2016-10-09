const merge = require('webpack-merge')
const base = require('./webpack.base.conf')
const devConfig = require('./webpack.client.dev.conf.js')
const prodConfig = require('./webpack.client.prod.conf.js')

module.exports = merge(base, (process.env.NODE_ENV === 'production') ? prodConfig : devConfig)

