var mongoose = require('mongoose');
var Supplier = require('../models/suppliers'); 
var Package = require('../models/packages'); 
var Model = require('../models/models'); 
var Order = require('../models/orders'); 
var User = require('../models/users');

module.exports = function () {
  Supplier.create({ name: 'Acme' }, { name: 'Rainier' }, function (err, acme, rainier) {

    Model.create({ name: 'Anvil', supplier: acme }, { name: 'Wile', supplier: acme }, { name: 'Roadrunner', supplier: acme },
      { name: 'pugetsound', supplier: rainier }, { name: 'olympic', supplier: rainier }, function(err) {
        if (err) console.log('Model seed: ' + err);
    });
    
    Package.create({ name: 'std', supplier: acme }, { name: 'super', supplier: acme }, { name: 'elite', supplier: acme},
      { name: 'mtn', supplier: rainier }, { name: 'ltd', supplier: rainier }, { name: '14k', supplier: rainier }, function (err) {
        if (err) console.log('Package seed: ' + err);
    });

    User.create({ userName: 'employee', password: 'password', isEmployee: true }, { userName: 'customer', password: 'password', isEmployee: false }, function (err, emp, cus) {
      if (err) console.log('User seed: ' + err);
      Order.create({ supplier: acme._id, model: 'Anvil', package: 'super', customer_id: cus._id}, { supplier: rainier._id, model: 'olympic', package: '14k', customer_id: cus._id}, function (err, anvil, olympic) {
        if (err) console.log("Order seed: " + err);
      });
    });
  });
}
