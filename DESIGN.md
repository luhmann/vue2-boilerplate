### Build Setup

1. `server.js` for server and client site rendering is called, `NODE_ENV`
decides which mode is active
1. Template is loaded and parsed for injection points for app and styles `{{ STYLE }}` and `{{ APP }}`. In production mode
styles are replaced for rendered style sheet in `dist`. Injection point is removed in Dev-Mode
2. In prod and dev `vue-server-renderer` is used for initial render. It creates a render function which is then used
to render the application into a string. This render function is derived differently for dev and prod. In dev
the express app is handed of to webpack which sets up hot-reloading and reloads whenever the express app changes. It also
uses the `webpack.server.config` to execute the same logic as in the server.
3. Within the express app, for any route, but static assets, the render function is called.
4. The render function gets the url of the request as an parameter.
5. The render function uses the application router to determine any pre-fetching that needs to be done and resolves it, this is how the initial state is created within the store.
6. The express response is then written out, the aforementioned injection point of `app` serves as a split in the template. First everything up to the point of where `{{APP}}` is found in the template gets written out.
7. The render function returns a stream of data that gets returned as it is rendered. If a router prefetch has been done, the router state is echoed out within a `script` tag, a serialize function is used.
8. Afterwards the new chunks of rendered code get written onto the stream.
9. When the stream indicates that it has finished the rest of the template as indicated by the injection point (everything after) is written onto the stream.
10. Contained in there are the rendered webpack bundles of the application as their readily rendered versions. In Dev-Mode these are replaced by the webpack mechanism.
11. The process ends

### Webpack Config

Besides the usual `wepbpack.base.config` only a client and a server config exists, which have a distinction by current `NODE_ENV` for dev and production.
