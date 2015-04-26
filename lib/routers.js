var router = require('koa-router')(),
    cloudinary = require('cloudinary'),
    parse = require('co-busboy'),
    fs  = require('fs'),
    formidable = require('formidable'),
    thunkify = require('thunkify'),
    co = require('co'),
    image_metadata = require('./image_metadata'),
    logger = require('winston'),
    Comment = require('./comment'),
    Notification = require('./notification'),
    Recent = require('./recent');

var TMP_IMG = 'tmp_img';
if (!fs.existsSync(TMP_IMG)) {
  fs.mkdirSync(TMP_IMG);
};

GAME_URL_NAME = 'game';

function *showGame (context, imageId, showOriginalImage) {
  context.session.imageId = imageId;
  var pageName = 'game';
  var imageMetadata = yield image_metadata.getMetadata(imageId);
  var comments = yield Comment.getComments(imageId);
  var user = context.req.user;
  yield context.render(pageName, {
    user: user,
    comments: comments,
    pageName: pageName,
    imageUrl: cloudinary.url(imageId),
    imageId: imageId,  
    imageMetadata: imageMetadata,
    showOriginalImage: showOriginalImage
  });
}

router.get('/', function *(next) {
  // Clear imageId session.
  this.session.imageId = null;
  var pageName = 'index';
  yield this.render(pageName, {
    user: this.req.user,
    pageName: pageName
  });
});

router.get('/auth/success', function *(next) {
  logger.info('imageId is ', this.session.imageId);
  if (this.session.imageId) {
    return this.redirect(router.url(GAME_URL_NAME, this.session.imageId));
  } else {
    return this.redirect('/');
  }
});

router.get('/index/wechat', function *(next) {
  var pageName = 'index';
  yield this.render(pageName, {
    pageName: pageName
  });
});

upload = function(file) {
  return function(callback) {
    cloudinary.uploader.upload(file, function(result) {
      callback(null, result);
    });
  };
};

router.get('/upload', function *(next) {
  return this.redirect('/');
});

router.post('/upload', function *(next) {
  var form = new formidable.IncomingForm();
  form.uploadDir = 'tmp_img/';
  form.maxFieldsSize = 2 * 1024 * 1024;
  form.keepExtensions = true;
  var parse = function(req) {
    return function(callback) {
      form.parse(req, function(err, fields, files) {
        if (err) {
          return callback(err); 
        }
        return callback(null, {fields: fields, files: files});
      });
    };
  };
  var fileInfo = yield parse(this.req);
  var result = yield upload(fileInfo.files.file.path);
  var imgMetadata = yield image_metadata.newMetadata(
      result.public_id, this.req.user);
  yield Recent.addRecent(result.public_id);
  return this.redirect(router.url(GAME_URL_NAME, result.public_id));
});

router.post('/game/:imageId/solved', function *(next) {
  var imageMetadata = yield image_metadata.getMetadata(
      this.params.imageId);
  var user = this.req.user;
  user.stepCount = this.request.body.step;
  imageMetadata.solvedBy.unshift(user);
  // Add new notification to the uploader.
  if (imageMetadata.uploader) {
    var notifi = yield Notification.addSolvedNotification(
        imageMetadata.uploader.id,
        user,
        imageMetadata.imageId,
        user.stepCount);
  } else {
    logger.info('no uploader');
  }
  yield image_metadata.setMetadata(imageMetadata);
  yield showGame(this, this.params.imageId, true /* showOriginalImage*/);
});

router.get('/game/:imageId/solved', function *(next) {
  return this.redirect(router.url(GAME_URL_NAME, this.params.imageId));
});

router.post('/game/:imageId/comment', function *(next) {
  var pageName = 'game';
  if (this.request.body.comment.length < 1000) {
    var comments = yield Comment.addComment(
        this.params.imageId, 
        this.req.user, 
        this.request.body.comment);
    var imageMetadata = yield image_metadata.getMetadata(
        this.params.imageId);
    if (imageMetadata.uploader) {
      var notifi = yield Notification.addCommentNotification(
          imageMetadata.uploader.id,
          this.req.user,
          imageMetadata.imageId,
          this.request.body.comment);
    }
  }
  return this.redirect(router.url(GAME_URL_NAME, this.params.imageId));
});

router.get(GAME_URL_NAME, '/game/:imageId/play', function *(next) {
  yield showGame(this, this.params.imageId);
});

router.get('/recent', function *(next) {
  var pageName = 'recent';
  var imageIds = yield Recent.getRecents();
  var recents = [];
  for (var i = 0; i < imageIds.length; i++) {
    recents.push({id: imageIds[i], url: router.url(GAME_URL_NAME, imageIds[i])});
  }
  yield this.render(pageName, {
    user: this.req.user,
    recents: recents,
    pageName: pageName
  });
});

router.get('/notification', function *(next) {
  var pageName = 'notification';
  var notifi = yield Notification.getNotification(this.req.user.id);
  notifi.newCount = 0;
  yield Notification.setNotifications(this.req.user.id, notifi);
  // TODO: require login.
  var notifi = yield Notification.getNotification(this.req.user.id);
  this.req.user.notificationCount = 0;
  yield this.render(pageName, {
    user: this.req.user,
    notifi: notifi,
    pageName: pageName
  });
});

module.exports = router;

