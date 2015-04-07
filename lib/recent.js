var RECENT_UPLOAD = 'recent_images';
var keystore = require('./keystore'),
    logger = require('winston');


module.exports = {
  addRecent: function *(imageId) {
    var recents = yield this.getRecents();
    recents.unshift(imageId);
    yield keystore.set(RECENT_UPLOAD, recents);
    logger.info('new recents ', recents);
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
