var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var apiSchema = new Schema({
  token: String,
});

module.exports =  mongoose.model('ApiTokens', apiSchema);
