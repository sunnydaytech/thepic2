var User = require('../../lib/identity/user_storage');
var assert = require('assert');
var FakeKeystore = {};
FakeKeystore.cache = {};
FakeKeystore.set_ = function(key, value, callback) {
  this.cache[key] = value;
};

FakeKeystore.get_ = function(key, callback) {
  callback(null, this.cache[key]);
};

User.setKeystoreForTesting(FakeKeystore);

describe('FakeKeystore', function() {
  it('Should find the data we set', function(done) {
    FakeKeystore.set_('key', 'value')
    FakeKeystore.get_('key', function(err, value) {
      assert.equal('value', value);
      done();
    });
  });
});

describe('auth', function() {
  var callBack = function(){};
  it('Should serialize facebook account correctly', function() {
    var userId = '10206340756268002';
    var fbUser = { id: userId,
      username: undefined,
      displayName: 'NichoIas Xu',
      name: 
        { familyName: 'Xu',
           givenName: 'NichoIas',
           middleName: undefined },
      gender: 'female',
      profileUrl: 'https://www.facebook.com/app_scoped_user_id/10206340756268002/',
      provider: 'facebook',
    }; 
    User.createOrUpdateUser(fbUser, callBack);
    var expectedNewUser = { id: '10206340756268002',
      displayName: 'NichoIas Xu',
      profilePic: 'https://graph.facebook.com/10206340756268002/picture?type=small' }
    User.findUser(userId, function(err, newUser) {
      assert.deepEqual(expectedNewUser, newUser);
    });
  });

  it('Should serialize twitter account correctly', function() {
    var userId = '46372497';
    var twitterUser = { id: userId,
      username: 'Nich01as_cn',
      displayName: 'Nicholas',
      photos: [ { value: 'https://pbs.twimg.com/profile_images/259741017/0418-2000-03_normal.JPG' } ],
      provider: 'twitter',
    };
    User.createOrUpdateUser(twitterUser, callBack);
    var expectedNewUser = {
      id: userId,
      displayName: 'Nicholas',
      profilePic: 'https://pbs.twimg.com/profile_images/259741017/0418-2000-03_normal.JPG'
    }
    User.findUser(userId, function(err, newUser) {
      assert.deepEqual(expectedNewUser, newUser);
    });
  });

  it('Should serialize weibo account correctly', function() {
    var userId = '1244037524';
    var weiboUser = { provider: 'weibo',
        id: userId,
        displayName: 'Nich01as',
        _raw: 
           { id: 1244037524,
             idstr: '1244037524',
             profile_image_url: 'http://tp1.sinaimg.cn/1244037524/50/5635646601/0',
           }
    };
    User.createOrUpdateUser(weiboUser, callBack);
    var expectedNewUser = {
      id: userId,
      displayName: 'Nich01as',
      profilePic: 'http://tp1.sinaimg.cn/1244037524/50/5635646601/0'
    };
    User.findUser(userId, function(err, newUser) {
      assert.deepEqual(expectedNewUser, newUser);
    });
  });
});
