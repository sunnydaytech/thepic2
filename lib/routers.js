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
    Recent = require('./recent'),
    HotUpload = require('./hot_upload'),
    MyUpload = require('./my_upload');

var TMP_IMG = 'tmp_img';
if (!fs.existsSync(TMP_IMG)) {
  fs.mkdirSync(TMP_IMG);
};

var GAME_URL_NAME = 'game';

function *showGame (context, imageId, showOriginalImage, title) {
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
    showOriginalImage: showOriginalImage,
    title: title  
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
  var user = this.req.user;
  if (user) {
    yield MyUpload.addUpload(user.id, result.public_id);
  }
  return this.redirect('/#game?id=' + result.public_id);
});

router.post('/_/solve/:imageId', function *(next) {
  var imageMetadata = yield image_metadata.getMetadata(
      this.params.imageId);
  var user = this.req.user;
  if (imageMetadata && user) {
    user.stepCount = this.request.body.stepCount;
    logger.info('Request body is ' + JSON.stringify(this.request.body));
    logger.info('Getting stepCount ' + this.request.body.stepCount);
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
    logger.info('updating imageMetadata ' + JSON.stringify(imageMetadata));
    yield image_metadata.setMetadata(imageMetadata);
    yield HotUpload.addTemp(this.params.imageId);
    this.body = '{"status": "success"}';
  } else {
    this.body = '{"status": "not logged"}';
  }
});

router.get('/game/:imageId/solved', function *(next) {
  return this.redirect(router.url(GAME_URL_NAME, this.params.imageId));
});

router.get('/_/comment/:imageId', function *(next) {
  var imageId = this.params.imageId;
  var comments = yield Comment.getComments(imageId);
  this.body = comments;
});

router.post('/_/comment/:imageId', function *(next) {
  console.log(this.request.body);

  var comments = yield Comment.addComment(
      this.params.imageId,
      this.req.user,
      this.request.body.comment);
  var imageMetadata = yield image_metadata.getMetadata(
      this.params.imageId);
  var notifiedUsers = {};
  var addComment = function *(userId, sender, imageId, comment) {
  if (!notifiedUsers[userId]) {
    var notifi = yield Notification.addCommentNotification(
        userId, sender, imageId, comment);
      notifiedUsers[userId] = true;
    }
  }
  if (imageMetadata.uploader) {
    var notifi = yield addComment(
      imageMetadata.uploader.id,
      this.req.user,
        imageMetadata.imageId,
        this.request.body.comment);
  }
  for (var i = 0; i < comments.length; i++) {
    var notifi = yield addComment(
      comments[i].user.id,
        this.req.user,
        imageMetadata.imageId,
        this.request.body.comment);
  }
  this.body = comments;
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
    var notifiedUsers = {};
    var addComment = function *(userId, sender, imageId, comment) {
      if (!notifiedUsers[userId]) {
        var notifi = yield Notification.addCommentNotification(
            userId, sender, imageId, comment);
        notifiedUsers[userId] = true;
      }
    }
    if (imageMetadata.uploader) {
      var notifi = yield addComment(
          imageMetadata.uploader.id,
          this.req.user,
          imageMetadata.imageId,
          this.request.body.comment);
    }
    for (var i = 0; i < comments.length; i++) {
      var notifi = yield addComment(
          comments[i].user.id,
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

_getImagesByIds = function *(imageIds) {
  var images = [];
  for (var i = 0; i < imageIds.length; i++) {
    var imageMetadata = yield image_metadata.getMetadata(imageIds[i]);
    if (imageMetadata.solvedBy) {
      imageMetadata.solvedBy = imageMetadata.solvedBy.slice(0, 4);
    }
    images.push({id: imageIds[i], 
      imageMetadata: imageMetadata,
      url: router.url(GAME_URL_NAME, imageIds[i])});
  }
  return images;
};

router.get('/_/hot', function *(next) {
  var images = yield HotUpload.getHotUploads();
  logger.info('images ' + images);
  var imageIds = [];
  images.forEach(function(image, idx) {
    imageIds.push(image.id);
  });
  var hots = yield _getImagesByIds(imageIds);
  this.body = hots;
});

router.get('/_/recent', function *(next) {
  var imageIds = yield Recent.getRecents();
  var recents = yield _getImagesByIds(imageIds);
  this.body = recents;
});

router.get('/_/user/:id', function *(next) {
  var imageIds = yield MyUpload.getUploads(this.params.id);
  var images = yield _getImagesByIds(imageIds);
  this.body = images;
});

router.get('/_/notification', function *(next) {
  var notifi = yield Notification.getNotification(this.req.user.id);
  notifi.newCount = 0;
  yield Notification.setNotifications(this.req.user.id, notifi);
  // TODO: require login.
  var notifi = yield Notification.getNotification(this.req.user.id);
  this.req.user.notificationCount = 0;
  this.body = notifi;
});

module.exports = router;

