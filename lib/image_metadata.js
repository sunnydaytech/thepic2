var IMAGE_METADATA_PREFIX = "image_metadata:";
var keystore = require('./keystore'),
    logger = require('winston');

function createImageObj(imageMetadata) {
  return {imageId: imageMetadata.imageId, 
      solvedBy: [{name: 'Nichola'}, {name: 'Adam'}]
  };
}
function key(imageId) {
  return IMAGE_METADATA_PREFIX + imageId;
}
module.exports = {
  setMetadata: function *(metadata) {
    logger.info('setting image metadata %s', metadata);
    yield keystore.set(key(metadata.imageId), metadata);
    return createImageObj(metadata);
  },
  getMetadata: function *(imageId) {
    metadata = yield keystore.get(key(imageId));
    return createImageObj(metadata);
  }
}
