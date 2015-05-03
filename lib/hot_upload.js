var keystore = require('./keystore'),
    logger = require('winston'),
    config = require('./config/config');

var HOT_UPLOAD = config.objectKey('hot_upload');

module.exports = {
  getHotUploads: function *() {
    var images = yield keystore.get(HOT_UPLOAD);
    if (!images) {
      return [];
    }
    return images;
  },
  
  addTemp: function *(imageId) {
    var images = yield this.getHotUploads();
    var foundImageIdx = -1;
    for (var i = 0; i < images.length; i++) {
      if (images[i].id == imageId) {
        foundImageIdx = i;
        break;
      }
    }
    if (foundImageIdx >= 0 && 
        foundImageIdx < images.length) {
      logger.info('found one ' + foundImageIdx);
      // Found one. Decrease the others.
      images.forEach(function(image, idx) {
        if (image.id !== imageId) {
          image.count--;
        } else {
          image.count += 2;
        }
      });
    } else {
      var newSolved = {id: imageId, count: 100}; 
      logger.info('adding new solved ' + newSolved);
      images.push(newSolved); 
      foundImageIdx = images.length - 1;
    }
    var idx = foundImageIdx;
    // sort.
    while (idx > 0 && images[idx].count > images[idx-1].count) {
      var tmp = images[idx-1];
      images[idx-1] = images[idx];
      images[idx] = tmp;
      idx--;
    }
    // Keep top 100.
    if (images.length > 100) {
      images = images.slice(0, -1);
    }
    images = yield this.setHotUploads(images);
    return images;
  },
  
  setHotUploads: function *(images) {
    yield keystore.set(HOT_UPLOAD, images);
    var imageIds = yield this.getHotUploads();
    return images;
  }
}
