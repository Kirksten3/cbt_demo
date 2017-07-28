var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelSchema = new Schema({
  name: String,
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' }
});

module.exports = mongoose.model('Model', modelSchema);
