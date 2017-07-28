var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// keep a record of tokens even after use
var tokenSchema = new Schema({
  token: String,
  isUsed: Boolean
});

module.exports = mongoose.model('Tokens', tokenSchema)
