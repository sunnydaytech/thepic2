var router = require('koa-router')(),
    cloudinary = require('cloudinary'),
    parse = require('co-busboy'),
    fs  = require('fs'),
    formidable = require('formidable'),
    thunkify = require('thunkify'),
    co = require('co');

var TMP_IMG = 'tmp_img';
if (!fs.existsSync(TMP_IMG)) {
  fs.mkdirSync(TMP_IMG);
};

router.get('/', function *(next) {
  var pageName = 'index';
  yield this.render(pageName, {
    pageName: pageName
  });
});

upload = function(file) {
  return function(callback) {
    cloudinary.uploader.upload(file, function(result) {
      console.log(result);
      callback(null, result);
    });
  };
};

router.post('/upload', function *(next) {
  var form = new formidable.IncomingForm();
  form.uploadDir = 'tmp_img/';
  form.maxFieldsSize = 2 * 1024 * 1024;
  form.keepExtensions = true;
  console.log('parse function');
  console.log(form.parse);
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
  console.log('Received posting');
  var fileInfo = yield parse(this.req);
  console.log('file info is ');
  console.log(fileInfo);
  var result = yield upload(fileInfo.files.file.path);
  console.log('Uploaded pic to cloudinary');
  console.log(result);
  return this.redirect('/' + result.public_id);
});

router.get('/:imageId', function *(next) {
  console.log('logged in user');
  console.log(this.req.user);
  var pageName = 'game';
  yield this.render(pageName, {user: this.req.user,
    pageName: pageName,
    imageUrl: cloudinary.url(this.params.imageId,
      {width: 600, height: 600, crop: "crop", gravity: "faces:center"})
  });
});


module.exports = router;

