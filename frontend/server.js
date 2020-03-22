const express = require("express");
const proxy = require('express-http-proxy');
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");
const app = express();

const compiler = webpack(webpackConfig);

app.use(
  webpackDevMiddleware(compiler, {
    hot: true,
    filename: "bundle.js",
    publicPath: "/",
    stats: {
      colors: true
    },
    historyApiFallback: true
  })
);

app.use(express.static(__dirname + "/www"));
app.use('/api', proxy('localhost:8000', {
  proxyReqPathResolver: req => '/api' + req.url
}))
app.use('/media', proxy('localhost:8000', {
  proxyReqPathResolver: req => '/media' + req.url
}))
app.use('/emails', proxy('localhost:8000', {
  proxyReqPathResolver: req => '/emails' + req.url
}))

const server = app.listen(process.env.PORT || 3000, function() {
  const host = server.address().address;
  const port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
