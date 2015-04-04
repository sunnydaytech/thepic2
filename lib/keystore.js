var thunkify = require('thunkify');
var keystore = require('gcloud-keystore');
var gcloud = require('gcloud')({
  projectId: "nich01as-com",
  keyFilename: 'gcloud_client_secret.json'
  });
var dataset = gcloud.datastore.dataset();
var KEY_STORE = keystore(dataset);

module.exports.set = thunkify(KEY_STORE.set.bind(KEY_STORE));
module.exports.get = thunkify(KEY_STORE.get.bind(KEY_STORE));
module.exports.delete = thunkify(KEY_STORE.delete.bind(KEY_STORE));

