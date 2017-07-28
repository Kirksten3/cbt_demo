var mongoose = require('mongoose');
var User = require('../models/users');
var Order = require('../models/orders');
var request = require('request');

exports.getOrders = function (req, res) {
  // get all orders, return JSON
  if (req.query.userId == null) {
    return res.status(400).send({error: "Must be logged in!"});
  }
  User.findOne({_id: req.query.userId }, function (err, user) {
    if (err) throw err;
    if (user == null) return res.status(400).send({ error: "No User found" });
    if (!user.isEmployee){
      return res.status(400).send({error: "NOT A VALID USER, must be employee"});
    }
    else {
      Order.find({}, function (err, orders) {
        if (err) throw err;
        console.log(orders);
        return res.send(orders);
      });
    }
  });
}

function prepRainier(order) {
  console.log("getting nonce token");
  var options = {
    url: "http://localhost:3051/rainier/v10.0/nonce_token?storefront=ccas-bb9630c04f",
    method: 'GET'
  }

  request(options, function (err, response, body) {
    var data = JSON.parse(body);
    if (data.nonce_token != null) {
      sendOrderToRainier(order, data.nonce_token);
    }
  });
}

function sendOrderToRainier(order, token) {
  //var token = getNonceToken();
  console.log("TOKEN: " + JSON.stringify(token));
  var headers = {
    "Content-Type": "application/json"
  }
  var options = {
    url: "http://localhost:3051/rainier/v10.0/request_customized_model",
    method: "POST",
    headers: headers,
    form: {
      'token': token,
      'model': order.model,
      'package': order.package
    }
  }

  request(options, function (err, response, body) {
    if (JSON.parse(body).order_id != null) {
      console.log("SUCCESS SENDING TO RAINIER");
      return false;
    }
    return true;;
  });

}

function sendOrderToAcme(order) {
  var headers = {
    "Content-Type": "application/x-www-form-urlencoded"
  }
  var options = {
    url: "http://localhost:3050/acme/api/v45.1/order",
    method: "POST",
    headers: headers,
    form: {
      'api_key': 'cascade.53bce4f1dfa0fe8e7ca126f91b35d3a6',
      'model': order.model,
      'package': order.package
    }
  }

  request(options, function (err, response, body) {
    if (JSON.parse(body).order != null) {
      console.log("SUCCESS SENDING TO ACME");
      return true;
    }
    return false;
  });

}

function sendOrderToSupplier(order) {
  console.log("Send order: " + order.make);
  if (order.make == "Acme")
    sendOrderToAcme(order);
  else
    prepRainier(order);
}

exports.addOrder = function (req, res) {
  // add new orders
  if (req.body.model == "" || req.body.package == "" || req.body.make == "") {
    return res.status(400).send({ error: "Must provide order detail information"});
  } 
  if (req.body.customer_id == "") {
    return res.status(400).json({error: "Must be Logged in!"});
  }

  console.log(req.body);

  Order.create({
    make: req.body.make,
    model: req.body.model,
    package: req.body.package,
    customer_id: req.body.customer_id
  }, function (err, order) {
    if (err) throw err;
    console.log(order);
    sendOrderToSupplier(order);
    return res.json({statusCode: 200, link: '/downloadOrder?id=' + order._id})
  });
}

exports.downloadOrder = function (req, res) {
  Order.findOne({ _id: req.query.id }, function (err, order) {
    if (err) throw err;
    if (order == null) res.status(400).send({ error: "Order not found"});
    res.json(order);
    //res.download('../public/' + order._id + ".json", 'order-' + order._id + '.json');
  });
}
