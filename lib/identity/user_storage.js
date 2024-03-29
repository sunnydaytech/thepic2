var User = {};
var cache = {};
var keystore = require('../keystore'),
    logger = require('winston'),
    config = require('../config/config');

function key(id) {
  return config.objectKey('user:' + id);
};

function getFacekbookProfilePic(userId) {
  return 'https://graph.facebook.com/' + userId.split(':')[1] + '/picture?type=small';
};

/**
 * id The user id.
 * Return found user.
 */
User.findUser = function (id, done) {
  logger.info('findUser ' + id);
  keystore.get_(key(id), function(err, user) {
    if (err || !user) {
      done(null, null);
    } else {
      logger.info('found user ' + user);      
      done(null, user);
    } 
  });
};

/**
 * user The user to create.
 */
User.createOrUpdateUser = function (user, done) {
  logger.log('create or update user');
  var profilePic;
  if (user.provider == 'twitter') {
    profilePic = user.photos[0].value;
  }
  if (user.provider == 'facebook') {
    profilePic = getFacekbookProfilePic(user.id);
  }
  if (user.provider == 'weibo') {
    profilePic = user._raw.profile_image_url;
  }
  var userToUpdate = {
    id: user.id,
    displayName: user.displayName,
    profilePic: profilePic  
  };
  keystore.set_(key(user.id), userToUpdate, function() {
    done(null, user.id);
  });
};

User.setKeystoreForTesting = function(fakeKeyStore) {
  keystore = fakeKeyStore; 
};

module.exports = User;
