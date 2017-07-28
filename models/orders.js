var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
  make: String,
  model: String,
  package: String,
  customer_id: String
});

module.exports =  mongoose.model('Orders', orderSchema);
