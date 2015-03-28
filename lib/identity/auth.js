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
    done(null, {id: 'pass'});
  }
});


/*
 * router The koa-router.
 */
module.exports = function(router, authConfig) {
  console.log('Configure auth endpoints with:');
  console.log(authConfig);
  var TwitterStrategy = require('passport-twitter').Strategy;
  passport.use(new TwitterStrategy({
      consumerKey: authConfig.twitter.consumerKey,
      consumerSecret: authConfig.twitter.consumerSecret,
      callbackURL: "http://localhost:8080/auth/twitter/callback"
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
      callbackURL: "http://localhost:8080/auth/facebook/callback"
    },
    function(token, tokenSecret, profile, done) {
      done(null, profile)
    }
  ));

  router.get('/auth/facebook', passport.authenticate('facebook'));
  router.get('/auth/facebook/callback',
      passport.authenticate('facekbook', {
      successRedirect: '/',
      failureRedirect: '/auth/error'
  }));
};




