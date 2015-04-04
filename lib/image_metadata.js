var IMAGE_METADATA_PREFIX = "image_metadata:";
var keystore = require('./keystore');

function createImageObj(imageMetadata) {
  return {imageId: imageMetadata.imageId, 
      solvedBy: [{name: 'Nichola'}, {name: 'Adam'}]
  };
}
function key(imageId) {
  return IMAGE_METADATA_PREFIX + imageId;
}
module.exports = {
  setMetadata: function *(imageId, metadata) {
    yield keystore.set(key(imageId), metadata);
    return createImageObj(metadata);
  },
  getMetadata: function *(imageId) {
    metadata = yield keystore.get(key(imageId));
    return createImageObj(metadata);
  }
}
