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
module.exports = function(app, config) {
  var cache = config.env == 'prod' ? true : false;
  var debug = config.env == 'prod' ? false : true;
  render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'layout',
    viewExt: 'ejs',
    cache: cache,
    debug: debug,
    locals: locals,
    filters: filters 
  });
};
