var mongoose = require('mongoose');
var Supplier = require('../models/suppliers');
var Model = require('../models/models');
var Package = require('../models/packages');
var User = require('../models/users');

exports.getModelsAndPackages = function (req, res) {
  console.log(req.query.supplier);
  var data = {};
  Supplier.findOne({ name: req.query.supplier }, function (err, sup) {
    console.log(sup);

    Model.find({ supplier: sup._id }, function (err, models) {
      console.log('models: ' + models);
      data.models = models;

      Package.find({ supplier: sup._id }, function (err, packages) {
        console.log('packages: ' + packages);
        data.packages = packages;
        res.send(data);
      }); 
    });
  });
}

exports.login = function (req, res) {
  User.findOne({ userName: req.body.userName, password: req.body.password}, function (err, user) {
    if (err) throw err;
    if (user == null) {
      res.status(400).send({error: "No user found"});
    }
    res.send(user);
  }); 
}
