var User = {};
var cache = {};

module.exports = User;

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
  cache[user.id] = {
    id: user.id,
    displayName: user.displayName,
    emails: user.emails,
    photos: user.photos
  };
};
