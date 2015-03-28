var router = require('koa-router')();

router.get('/', function *(next) {
  console.log('logged in user');
  console.log(this.req.user);
  yield this.render('index', {user: this.req.user});
});

module.exports = router;

