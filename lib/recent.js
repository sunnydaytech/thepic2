var keystore = require('./keystore'),
    config = require('./config/config');
    logger = require('winston');


var RECENT_UPLOAD = config.objectKey('recent_images');

module.exports = {
  addRecent: function *(imageId) {
    var recents = yield this.getRecents();
    recents.unshift(imageId);
    yield keystore.set(RECENT_UPLOAD, recents);
    return recents;
  },

  /**
   * Returns a list of recent uploaded image ids.
   */
  getRecents: function *() {
    var recents = yield keystore.get(RECENT_UPLOAD);
    if (!recents) {
      return [];
    }
    return recents;
  }
};
