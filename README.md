# Vue2-Boilerplate

> A minimal setup for an universal vue2 app


## Features

* Vue2
* Webpack2 with Tree Shaking Support
* Webpack Dev-Server with HMR
* vue-router
* vuex
* Server Side Rendering
* Karma for Unit Tests
* NightWatch for E2E-Tests

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

## webpack-proxy

You can define routes you want to proxy during development (e.g local mockes api-endpoints) by specifying them in `config/index.js` under `proxyTable` like this:

``` javascript
    proxyTable: {
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },

```
