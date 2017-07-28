var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var packageSchema = new Schema({
  name: String,
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' }
});

module.exports = mongoose.model('Package', packageSchema);
