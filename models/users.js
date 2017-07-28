var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  userName: String,
  password: String,
  isEmployee: Boolean
});

module.exports = mongoose.model('User', userSchema);
