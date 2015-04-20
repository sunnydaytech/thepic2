var NOTIFICATION_PREFIX = "notification:";
var keystore = require('./keystore'),
    logger = require('winston');

var TYPE_SOLVED = 1;
var TYPE_COMMENT = 2;

function createSolvedNotification(sender, stepCount) {
  return {
    type: TYPE_SOLVED,
    sender: sender,
    stepCount: stepCount
  };
};

function createCommentNotification(sender, comment) {
  return {
    type: TYPE_COMMENT,
    sender: sender,
    comment: comment
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
    var notifications = yield keystore.get(key(userId));
    if (!notifications) {
      return {
        newCount: 0,
        notifications: []
      }
    }
    return notifications;
  },
  addSolvedNotification: function *(userId, sender, stepCount) {
    var newItem = createSolvedNotification(sender, stepCount);
    var notifi = yield addNewNotification(this, userId, newItem);
    return notifi;
  },
  addCommentNotification: function *(userId, sender, comment) {
    var newItem = createCommentNotification(sender, comment);
    var notifi = yield addNewNotification(this, userId, newItem);
    return notifi;
  },
  setNotifications: function *(userId, notifi) {
    yield keystore.set(key(userId), notifi);
  }
}
