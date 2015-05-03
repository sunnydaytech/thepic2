var MY_UPLOAD_PREFIX = "my_upload:";
var keystore = require('./keystore'),
    config = require('./config/config');

function key(userId) {
  return config.objectKey(MY_UPLOAD_PREFIX + userId);
};

module.exports = {
  getUploads: function *(userId) {
    var imageIds = yield keystore.get(key(userId));
    if (!imageIds) {
      return [];
    }
    return imageIds;
  },
  
  addUpload: function *(userId, imageId) {
    var imageIds = yield this.getUploads(userId);
    imageIds.unshift(imageId);
    imageIds = yield this.setUploads(userId, imageIds);
    return imageIds;
  },
  
  setUploads: function *(userId, imageIds) {
    yield keystore.set(key(userId), imageIds);
    var imageIds = yield this.getUploads(userId);
    return imageIds;
  }
};
