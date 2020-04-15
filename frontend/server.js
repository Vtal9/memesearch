const express = require("express");
const proxy = require('express-http-proxy');
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");
const app = express();

webpackConfig.mode = 'development'
webpackConfig.output.publicPath = '/'
webpackConfig.entry = './main.tsx'
const compiler = webpack(webpackConfig);

app.use(
  webpackDevMiddleware(compiler, {
    hot: true,
    stats: {
      colors: true
    },
    historyApiFallback: true
  })
);

['/api', '/media', '/emails', '/search', '/accounts', '/tags'].forEach(path => {
  app.use(path, proxy('localhost:8000', {
    proxyReqPathResolver: req => path + req.url
  }))
})

const server = app.listen(process.env.PORT || 3000, function() {
  const host = server.address().address;
  const port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
