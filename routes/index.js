var express = require('express');
var router = express.Router()

var orderController = require('../controllers/orderController');
var serviceController = require('../controllers/serviceController');

router.get('/', function(req, res) {
  res.render('index');
});

// orders
router.get('/orders', orderController.getOrders);

router.post('/order', orderController.addOrder);

router.get('/downloadOrder', orderController.downloadOrder);

router.get('/getModelsAndPackages', serviceController.getModelsAndPackages);

router.post('/login', serviceController.login);

module.exports = router;
