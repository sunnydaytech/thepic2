var auth = require('../../lib/identity/auth');
var passport = require('koa-passport');
var assert = require('assert');

describe('auth', function() {
  var router = {
      cache: {},
      get: function(path, handler) {
        this.cache[path] = handler;
      }
    };

  it("Return url with out port when it's 80", function() {
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
        },
        weibo: {
          clientID: 'clientID',
          clientSecret: 'clientSecret'
        }
      }};
    auth(router, config); 
    assert.equal('http://thepicsquare.com/auth/facebook/callback', 
        passport._strategies.facebook._callbackURL);
  });

  it("Return url with port when it's not 80", function() {
    var config = { 
      host: 'thepicsquare.com', 
      port: 8080,
      authConfig: {
        twitter: {
          consumerKey: 'consumerKey',
          consumerSecret: 'consumerSecret'
        },
        facebook: {
          clientID: 'clientId',
          clientSecret: 'clientSecret'
        },
        weibo: {
          clientID: 'clientID',
          clientSecret: 'clientSecret'
        }
      }};
    auth(router, config); 
    assert.equal('http://thepicsquare.com:8080/auth/facebook/callback', 
        passport._strategies.facebook._callbackURL);
  });

})
