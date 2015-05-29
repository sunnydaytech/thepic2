var NOTIFICATION_PREFIX = "notification:";
var keystore = require('./keystore'),
    logger = require('winston');

var TYPE_SOLVED = 1;
var TYPE_COMMENT = 2;

function createSolvedNotification(sender, imageId, stepCount) {
  return {
    type: TYPE_SOLVED,
    sender: sender,
    stepCount: stepCount,
    imageId: imageId  
  };
};

function createCommentOnImageNotification(sender, imageId, comment) {
  return {
    type: TYPE_COMMENT,
    sender: sender,
    comment: comment,
    imageId: imageId
  }
};

function *addNewNotification(self, userId, newItem) {
  var notifi = yield self.getNotification(userId);
  notifi.notifications.unshift(newItem);
  notifi.newCount += 1;
  logger.info('setting item ' + notifi)
  yield self.setNotifications(userId, notifi);
  return notifi;
};

function key(userId) {
  return NOTIFICATION_PREFIX + userId;
}
module.exports = {
  getNotification: function *(userId) {
    var notifi = yield keystore.get(key(userId));
    if (!notifi || !notifi.notifications) {
      return {
        newCount: 0,
        notifications: []
      }
    }
    return notifi;
  },
  addSolvedNotification: function *(
    userId, sender, imageId, stepCount) {
    if (userId == sender.id) {
      return;
    }
    var newItem = createSolvedNotification(
        sender, imageId, stepCount);
    var notifi = yield addNewNotification(
        this, userId, newItem);
    return notifi;
  },
  addCommentNotification: function *(
    userId, sender, imageId, comment) {
    if (userId == sender.id) {
      return;
    }
    var newItem = createCommentOnImageNotification(
        sender, imageId, comment);
    var notifi = yield addNewNotification(
        this, userId, newItem);
    return notifi;
  },
  setNotifications: function *(userId, notifi) {
    yield keystore.set(key(userId), notifi);
  }
}
