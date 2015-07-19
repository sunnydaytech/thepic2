var IMAGE_METADATA_PREFIX = "image_metadata:";
var keystore = require('./keystore'),
    config = require('./config/config');
    logger = require('winston');

function createImageObj(imageId, uploader) {
  logger.info('uploader is ' + uploader);  
  if (uploader) {
    return {imageId: imageId, 
        uploader: uploader,
        solvedBy: []
    };
  } else {
    return {imageId: imageId, 
        solvedBy: []
    };
  }
}
function key(imageId) {
  return config.objectKey(IMAGE_METADATA_PREFIX + imageId);
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
