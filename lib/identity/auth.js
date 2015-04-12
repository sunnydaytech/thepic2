var passport = require('koa-passport');
var User = require('./user_storage.js'),
    co = require('co');

console.log('Register serizliaze user function');
passport.serializeUser(function (user, done) {
  console.log('Serializing user ' + user.id);
  user.id = user.provider + ':' + user.id;
  User.createOrUpdateUser(user, done);
});
passport.deserializeUser(function (id, done) {
  console.log('deserializing ' + id);
  User.findUser(id, done);
});

var getUrl = function(host, port, path) {
  if (port == 80) {
    return 'http://' + host + path;
  }
  return 'http://' + host + ':' + port + path;
}


/*
 * router The koa-router.
 */
module.exports = function(router, config) {
  var authConfig = config.authConfig;
  console.log('Configure auth endpoints with:');
  console.log(authConfig);
  var TwitterStrategy = require('passport-twitter').Strategy;
  passport.use(new TwitterStrategy({
      consumerKey: authConfig.twitter.consumerKey,
      consumerSecret: authConfig.twitter.consumerSecret,
      callbackURL: getUrl(config.host, config.port, '/auth/twitter/callback')
    },
    function(token, tokenSecret, profile, done) {
      done(null, profile);
    }
  ));

  router.get('/auth/twitter', passport.authenticate('twitter'));
  router.get('/auth/twitter/callback',
      passport.authenticate('twitter', {
      successRedirect: '/auth/success',
      failureRedirect: '/auth/error'
  }));

  var FacebookStrategy = require('passport-facebook').Strategy
  passport.use(new FacebookStrategy({
      clientID: authConfig.facebook.clientID,
      clientSecret: authConfig.facebook.clientSecret,
      callbackURL: getUrl(config.host, config.port, '/auth/facebook/callback')
    },
    function(token, tokenSecret, profile, done) {
      done(null, profile)
    }
  ));

  router.get('/auth/facebook', passport.authenticate('facebook'));
  router.get('/auth/facebook/callback',
      passport.authenticate('facebook', {
      successRedirect: '/auth/success',
      failureRedirect: '/auth/error'
  }));
};

