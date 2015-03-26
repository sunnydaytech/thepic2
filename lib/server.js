
var render = require('./render');
var routers = require('./routers');

var koa = require('koa');
var static = require('koa-static-cache');

var app = koa();

var cacheOption = {maxAge: 365 * 24 * 60 * 60};

app
  .use(routers.routers())
  .use(static('static', cacheOption))
  .use(router.allowdMethods());

module.exports = app;
