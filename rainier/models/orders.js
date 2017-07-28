var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
  token: String,
  model: String,
  package: String,
});

module.exports =  mongoose.model('Orders', orderSchema);
