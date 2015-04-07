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
      emails: undefined,
      photos: undefined,
      profilePic: 'https://graph.facebook.com/10206340756268002/picture?type=small' }
    var newUser = User.findUser(userId);
    assert.deepEqual(expectedNewUser, newUser);
  });
});

