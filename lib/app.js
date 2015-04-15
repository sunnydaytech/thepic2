var render = require('./render');

var koa = require('koa');
var session = require('koa-session');
var static = require('koa-static-cache');
var session = require('koa-session');
var passport = require('koa-passport');
var bodyParser = require('koa-bodyparser');
var cloudinary = require('cloudinary');



module.exports.start = function(config) {
  var app = koa();


  cloudinary.config(config.cloudinaryConfig);

  var winston = require('winston');

  //
  // Requiring `winston-papertrail` will expose
  // `winston.transports.Papertrail`
  //
  require('winston-papertrail').Papertrail;

  var logger = new winston.Logger({
    transports: [
        new winston.transports.Papertrail({
            host: 'logs2.papertrailapp.com',
            port: 54966
        })
    ]
  });

  // Catch all errors.
  app.use(function *(next) {
    try {
      yield next;
    } catch (err) {
      this.status = err.status || 500;
      this.body = err.message;
      logger.error(err);
      this.app.emit('error', err, this);
    }
  });

  app.use(bodyParser());

  app.keys = ['some secret hurr'];

  app.use(session(app));
  app.use(passport.initialize());
  app.use(passport.session());

  render(app, config);

  var cacheOption = {
    maxAge: 365 * 24 * 60 * 60,
    gzip: true
  };

  var routers = require('./routers');

  // Register authentication urls.
  require('./identity/auth')(routers, config);

  app
    .use(static('static', cacheOption))
    .use(static('bower_components', cacheOption))
    .use(routers.routes())
    .use(routers.allowedMethods());

  var DEFAULT_PORT = 8080;
  var port = config.port || DEFAULT_PORT;
  app.listen(port);
};
