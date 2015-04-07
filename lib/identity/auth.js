var passport = require('koa-passport');
var User = require('./user_storage.js');

console.log('Register serizliaze user function');
passport.serializeUser(function(user, done) {
  console.log('Serializing user ' + user.id);
  console.log(user);
  User.createOrUpdateUser(user);
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  console.log('deserializing ' + id);
  var user = User.findUser(id);
  if (user) {
    done(null, User.findUser(id));
  } else {
    done(null, null);
  }
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
      successRedirect: '/',
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
      successRedirect: '/',
      failureRedirect: '/auth/error'
  }));
};

