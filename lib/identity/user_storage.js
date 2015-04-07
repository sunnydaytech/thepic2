var User = {};
var cache = {};

module.exports = User;



function getFacekbookProfilePic(userId) {
  return 'https://graph.facebook.com/' + userId + '/picture?type=small';
}

/**
 * id The user id.
 * Return found user.
 */
User.findUser = function(id) {
  var user = cache[id];
  return cache[id];
};

/**
 * user The user to create.
 */
User.createOrUpdateUser = function(user) {
  var profilePic;
  if (user.provider == 'twitter') {
    console.log('****\n\n**');
    profilePic = user.photos[0].value;
  }
  if (user.provider == 'facebook') {
    profilePic = getFacekbookProfilePic(user.id);
  }
  cache[user.id] = {
    id: user.id,
    displayName: user.displayName,
    emails: user.emails,
    profilePic: profilePic  
  };
};
