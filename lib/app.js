
var render = require('./render');
var routers = require('./routers');

var koa = require('koa');
var static = require('koa-static-cache');

var app = koa();

render(app);

var cacheOption = {maxAge: 365 * 24 * 60 * 60};

app
  .use(routers.routes())
  .use(static('static', cacheOption))
  .use(routers.allowedMethods());

module.exports = app;
