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
    Recent = require('./recent');

var TMP_IMG = 'tmp_img';
if (!fs.existsSync(TMP_IMG)) {
  fs.mkdirSync(TMP_IMG);
};

GAME_URL_NAME = 'game';

router.get('/', function *(next) {
  // Clear imageId session.
  this.session.imageId = null;
  var pageName = 'index';
  yield this.render(pageName, {
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
  logger.info('image upload result is ', result);
  logger.info('image %s uploaded.', result.public_id);
  var imgMetadata = yield image_metadata.setMetadata({imageId: result.public_id});
  yield Recent.addRecent(result.public_id);
  return this.redirect(router.url(GAME_URL_NAME, result.public_id));
});

router.post('/game/:imageId/comment', function *(next) {
  logger.info('body is ', this.request.body);
  var pageName = 'game';
  var comments = yield Comment.addComment(this.params.imageId, this.req.user, this.request.body.comment);
  var imageMetadata = yield image_metadata.getMetadata(this.params.imageId);
  yield this.render(pageName, {user: this.req.user,
    comments: comments,
    pageName: pageName,
    imageUrl: cloudinary.url(this.params.imageId),
    imageMetadata: imageMetadata
  });
  return this.redirect(router.url(GAME_URL_NAME, this.params.imageId));
});

router.get(GAME_URL_NAME, '/game/:imageId/play', function *(next) {
  this.session.imageId = this.params.imageId;
  var pageName = 'game';
  var imageMetadata = yield image_metadata.getMetadata(this.params.imageId);
  var comments = yield Comment.getComments(this.params.imageId);
  yield this.render(pageName, {user: this.req.user,
    comments: comments,
    pageName: pageName,
    imageUrl: cloudinary.url(this.params.imageId),
    imageId: this.params.imageId,  
    imageMetadata: imageMetadata
  });
});

router.get('/recent', function *(next) {
  var pageName = 'recent';
  var imageIds = yield Recent.getRecents();
  var recents = [];
  for (var i = 0; i < imageIds.length; i++) {
    recents.push({id: imageIds[i], url: router.url(GAME_URL_NAME, imageIds[i])});
  }
  logger.info('recents ', recents);
  yield this.render(pageName, {
    recents: recents
  });
});

module.exports = router;

