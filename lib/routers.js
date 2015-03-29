var router = require('koa-router')();
var cloudinary = require('cloudinary');
var parse = require('co-busboy');

router.get('/', function *(next) {
  var pageName = 'index';
  yield this.render(pageName, {
    pageName: pageName
  });
});

router.post('/upload', function *(next) {
  var parts = parse(this);
  var part;
  while (part = yield parts) {
    console.log(part.filename);
  }
  console.log('done');
  this.redirect('/');
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

