var auth = require('../../lib/identity/auth');
var passport = require('koa-passport');
var assert = require('assert');

describe('auth', function() {
  it("Return url with out port when it's 80", function() {
    var router = {
      cache: {},
      get: function(path, handler) {
        this.cache[path] = handler;
      }
    };
    var config = { 
      host: 'thepicsquare.com', 
      port: 80,
      authConfig: {
        twitter: {
          consumerKey: 'consumerKey',
          consumerSecret: 'consumerSecret'
        },
        facebook: {
          clientID: 'clientId',
          clientSecret: 'clientSecret'
        }
      }};
    auth(router, config); 
    assert.equal('http://thepicsquare.com/auth/facebook/callback', passport._strategies.facebook._callbackURL);
  })
});
