var router = require('koa-router')(),
    cloudinary = require('cloudinary'),
    parse = require('co-busboy'),
    fs  = require('fs'),
    formidable = require('formidable'),
    thunkify = require('thunkify'),
    co = require('co'),
    image_metadata = require('./image_metadata'),
    logger = require('winston'),
    comment = require('./comment');

var TMP_IMG = 'tmp_img';
if (!fs.existsSync(TMP_IMG)) {
  fs.mkdirSync(TMP_IMG);
};

GAME_URL_NAME = 'game';

router.get('/', function *(next) {
  var pageName = 'index';
  yield this.render(pageName, {
    pageName: pageName
  });
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
  var imgMetadata = yield image_metadata.setMetadata(result.public_id, {imageId: result.public_id});
  return this.redirect(router.url(GAME_URL_NAME, result.public_id));
});

router.get(GAME_URL_NAME, '/game/:imageId', function *(next) {
  var pageName = 'game';
  var imageMetadata = yield image_metadata.getMetadata(this.params.imageId);
  var comments = yield comment.addComment(this.params.imageId, {name: 'nicholas'}, "Hello world");
  logger.info(comments);
  yield this.render(pageName, {user: this.req.user,
    pageName: pageName,
    imageUrl: cloudinary.url(this.params.imageId),
    imageMetadata: imageMetadata
  });
});


module.exports = router;

