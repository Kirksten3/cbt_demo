var mongoose = require('mongoose');
var Token = require('../models/tokens');
var Order = require('../models/orders');
var StoreToken = require('../models/storeTokens');
var crypto = require('crypto');

exports.returnToken = function (req, res) {
  console.log(req.query);
  if (req.query == null || req.query.storefront == null) {
    return res.status(400).json({ error: "No Storefront Token Provided."});
  }
  StoreToken.findOne({ token: req.query.storefront }, function (err, token) {
    if (err) throw err;
    if (token == null) {
      return res.status(400).json({ error: "Invalid Storefront Token "});
    }
    crypto.randomBytes(21, function (err, buf) {
      if (err) throw err;
      var token = buf.toString('hex');
      Token.create({ token: token, isUsed: false }, function (err, token) {
        if (err) throw err;
        return res.json({ nonce_token: token.token });
      });
    });
  });

}

exports.submitOrder = function (req, res) {
  if (req.body == null || req.body.token == null) {
    return res.status(400).json({ error: "No Token Provided, Request Ignored. "});
  }
  Token.findOne({ token: req.body.token }, function (err, token) {
    if (token.isUsed) {
      return res.status(400).json({ error: "Token has already been used, please get new token "});
    }
  });
  Order.create({ token: req.body.token, model: req.body.model, package: req.body.package }, function (err, order) {
    if (err) return res.status(500).json({ error: err });
    Token.findOneAndUpdate({ token: req.body.token }, { isUsed: true }, {upsert: false}, function (err, token) {
      if (err) return res.status(500).json({ error: err });
      if (token == null) {
        return res.status(400).json({ error: "Unable to update token." });
      }
      return res.json({ order_id: order._id });
    })
  });
}
