var mongoose = require('mongoose');
var Order = require('../models/orders');
var ApiToken = require('../models/apiTokens');

exports.submitOrder = function (req, res) {
  console.log(req.body);
  if (req.body == null || req.body.api_key == null) {
    return res.status(400).json({ error: "No API Key Provided, Request Ignored." });
  }
  ApiToken.findOne({ token: req.body.api_key }, function (err, token) {
    if (err) return res.status(500).json({ error: "Server Error getting API Key." });
    if (token == null) {
      return res.status(400).json({ error: "No API Key found, Request Ignored." });
    }
    Order.create({ token: token, model: req.body.model, package: req.body.package }, function(err, order) {
      if (err) return res.status(500).json({ error: "Server error creating Order" });
      return res.json({ order: order._id });
    });
  });
  

}
