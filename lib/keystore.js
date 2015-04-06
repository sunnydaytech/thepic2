var thunkify = require('thunkify'),
    keystore = require('gcloud-keystore');
var option =  { projectId: "nich01as-com", keyFilename: 'gcloud_client_secret.json'};
var gcloud = require('gcloud')(option);
var dataset = gcloud.datastore.dataset();
var KEY_STORE = keystore(dataset);

module.exports.set = thunkify(KEY_STORE.set.bind(KEY_STORE));
module.exports.get = thunkify(KEY_STORE.get.bind(KEY_STORE));
module.exports.delete = thunkify(KEY_STORE.delete.bind(KEY_STORE));

