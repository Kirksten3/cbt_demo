var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var supplierSchema = new Schema({
  name: String
});

module.exports = mongoose.model('Supplier', supplierSchema);
