var logger = require('winston');

var config_suffix = process.env.ENV == 'prod' ? 'prod' : 'dev';
logger.info('loading config with ' + config_suffix + ' suffix.');

var CONFIG = require('./lib/config/config_' + config_suffix);
var app = require('./lib/app');

app.start(CONFIG);
