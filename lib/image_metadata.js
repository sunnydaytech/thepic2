var IMAGE_METADATA_PREFIX = "image_metadata:";
var keystore = require('./keystore'),
    logger = require('winston');

function createImageObj(imageId, uploader) {
  return {imageId: imageId, 
      uploader: uploader,
      solvedBy: []
  };
}
function key(imageId) {
  return IMAGE_METADATA_PREFIX + imageId;
}
module.exports = {
  newMetadata: function *(imageId, uploader) {
    yield this.setMetadata(createImageObj(imageId, uploader));
  },
  setMetadata: function *(metadata) {
    yield keystore.set(key(metadata.imageId), metadata);
    return metadata;
  },
  getMetadata: function *(imageId) {
    metadata = yield keystore.get(key(imageId));
    if (metadata && !metadata.hasOwnProperty('solvedBy')) {
      metadata.solvedBy = [];
    }
    return metadata;
  }
}
