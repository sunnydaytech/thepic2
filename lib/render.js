var path = require('path');
var render = require('koa-ejs');

var locals = {
  currentUrl: function() {
    return this.request.url;
  }
};

var filters = {
  attachContinue: function(url, continueUrl) {
    return url + '?continue=' + continueUrl;
  }
};
module.exports = function(app) {
  render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'layout',
    viewExt: 'ejs',
    cache: false,
    debug: true,
    locals: locals,
    filters: filters 
  });
};
