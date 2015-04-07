var IMAGE_COMMENT_PREFIX = "image_comments:";
var keystore = require('./keystore'),
    logger = require('winston');

function key(imageId) {
  return IMAGE_COMMENT_PREFIX + imageId;
};

/*
 * Create a comment object.
 * user: The account who comments.
 * comment: A string of comment content.
 */
function createComment(user, comment) {
  return {
    user: user,
    comment: comment
  }
};

module.exports = {
  /*
   * imageId The imageId.
   * profile The account who comments.
   * comment A string of comment.
   */
  addComment: function *(imageId, user, comment) {
    var comments = yield this.getComments(imageId);

    comments.push(createComment({displayName: user.displayName, profilePic: user.profilePic}, comment));
    comments = yield this.setComments(imageId, comments);
    return comments;
  },

  /**
   * imageId The imageId.
   * comments A array of comment object.
   */
  setComments: function *(imageId, comments) {
    yield keystore.set(key(imageId), comments);
    var comments = yield this.getComments(imageId);
    return comments;
  },
  
  /*
   * Return a array of comment object.
   */
  getComments: function *(imageId) {
    var comments = yield keystore.get(key(imageId));
    if (!comments) {
      return [];
    }
    return comments;
  }
};
