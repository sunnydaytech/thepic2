var logger = require('winston');
var config_suffix = process.argv[2] == 'prod' ? 'prod' : 'dev';
logger.info('loading config with ' + config_suffix + ' suffix.');
logger.info(process.argv);

var CONFIG = require('./config_' + config_suffix);

module.exports.CONFIG = CONFIG;
module.exports.objectKey = function(key) {
  return CONFIG.env + ':' + key;
};

