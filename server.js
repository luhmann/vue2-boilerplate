process.env.VUE_ENV = 'server'
const isProd = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test'
const config = require('./config')
const fs = require('fs')
const path = require('path')
const resolve = file => path.resolve(__dirname, file)
const express = require('express')
const favicon = require('serve-favicon')
const serialize = require('serialize-javascript')

// https://github.com/vuejs/vue/blob/next/packages/vue-server-renderer/README.md#why-use-bundlerenderer
const createBundleRenderer = require('vue-server-renderer').createBundleRenderer

const app = express()

// setup the server renderer, depending on dev/prod environment
let renderer
if (isProd) {
  // create server renderer from real fs
  const bundlePath = resolve('./dist/server-bundle.js')
  renderer = createRenderer(fs.readFileSync(bundlePath, 'utf-8'))
} else {
  require('./build/setup-dev-server')(app, bundle => {
    renderer = createRenderer(bundle)
  })
}

function createRenderer (bundle) {
  return createBundleRenderer(bundle, {
    // cache: require('lru-cache')({
    //   max: 1000,
    //   maxAge: 1000 * 60 * 15
    // })
  })
}

// TODO: take from config
app.use('/dist', express.static(resolve('./dist')))
// app.use(favicon(resolve('./src/assets/logo.png')))

// parse index.html template
// NOTE: Make sure this stays after the renderer init, as the dev build needs
// to create the index.html in dist first
const html = (() => {
  const template = fs.readFileSync(resolve('./dist/index.html'), 'utf-8')
  const i = template.indexOf('{{ APP }}')
  // styles are injected dynamically via vue-style-loader in development
  return {
    head: template.slice(0, i),
    tail: template.slice(i + '{{ APP }}'.length)
  }
})()

app.get('*', (req, res) => {
  if (!renderer) {
    return res.end('waiting for compilation... refresh in a moment.')
  }

  var s = Date.now()
  const context = { url: req.url }
  const renderStream = renderer.renderToStream(context)
  let firstChunk = true

  res.write(html.head)

  renderStream.on('data', chunk => {
    if (firstChunk) {
      // embed initial store state
      if (context.initialState) {
        res.write(
          `<script>window.__INITIAL_STATE__=${
            serialize(context.initialState, { isJSON: true })
          }</script>`
        )
      }
      firstChunk = false
    }
    res.write(chunk)
  })

  renderStream.on('end', () => {
    res.end(html.tail)
    console.log(`whole request: ${Date.now() - s}ms`)
  })

  renderStream.on('error', err => {
    return res
      .status(500)
      .send('Server Error')
    })
})

const port = config.port || 8080
module.exports = app.listen(port, (err) => {
  if (err) {
    console.log(err)
  }

  console.log(`server started at localhost:${port}`)
})
