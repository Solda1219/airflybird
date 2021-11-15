const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const webRoute = require('./app/route/web');
const axios = require('axios');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');
//10080 cookie
live_key = '';
//baidubuce token
baidubuce_token = '';
//system start_time
system_time = new Date();
//set dist folder
app.use(express.static(path.join(__dirname, '')));
app.use(express.static(path.resolve(__dirname, "dist")));
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
// Logging
// app.use(morgan('dev'));
//routing
app.use('/_api', webRoute);
//Proxy endpoints
app.use('/live_api', createProxyMiddleware({
  target: 'http://117.21.178.59:18000',
  changeOrigin: true,
  pathRewrite: {
      [`^/live_api`]: '',
  },
}));
//export dist html
app.get("*", function (req, res) {
  res.sendFile(path.resolve(__dirname, "dist","index.html"));
});
module.exports = app;