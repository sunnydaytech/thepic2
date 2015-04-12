var User = require('../../lib/identity/user_storage');
var assert = require('assert');

describe('auth', function() {
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
    User.createOrUpdateUser(fbUser);
    var expectedNewUser = { id: '10206340756268002',
      displayName: 'NichoIas Xu',
      profilePic: 'https://graph.facebook.com/10206340756268002/picture?type=small' }
    var newUser = User.findUser(userId);
    assert.deepEqual(expectedNewUser, newUser);
  });

  it('Should serialize twitter account correctly', function() {
    var userId = '46372497';
    var twitterUser = { id: userId,
      username: 'Nich01as_cn',
      displayName: 'Nicholas',
      photos: [ { value: 'https://pbs.twimg.com/profile_images/259741017/0418-2000-03_normal.JPG' } ],
      provider: 'twitter',
    };
    User.createOrUpdateUser(twitterUser);
    var expectedNewUser = {
      id: userId,
      displayName: 'Nicholas',
      profilePic: 'https://pbs.twimg.com/profile_images/259741017/0418-2000-03_normal.JPG'
    }
    var newUser = User.findUser(userId);
    assert.deepEqual(expectedNewUser, newUser);
  });
});

