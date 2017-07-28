var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// keep a record of tokens even after use
var storeTokenSchema = new Schema({
  token: String,
});

module.exports = mongoose.model('StoreTokens', storeTokenSchema)
