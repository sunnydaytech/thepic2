var IMAGE_METADATA_PREFIX = "image_metadata:";
var keystore = require('./keystore'),
    logger = require('winston');

function createImageObj(imageId) {
  return {imageId: imageId, 
      solvedBy: []
  };
}
function key(imageId) {
  return IMAGE_METADATA_PREFIX + imageId;
}
module.exports = {
  newMetadata: function *(imageId) {
    yield this.setMetadata(createImageObj(imageId));
  },
  setMetadata: function *(metadata) {
    logger.info('setting image metadata %s', metadata);
    yield keystore.set(key(metadata.imageId), metadata);
    return metadata;
  },
  getMetadata: function *(imageId) {
    metadata = yield keystore.get(key(imageId));
    return metadata;
  }
}
