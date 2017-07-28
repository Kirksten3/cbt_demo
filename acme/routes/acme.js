var express = require('express');
var router = express.Router()

var apiController = require('../controllers/acmeApiController');

router.post('/order', apiController.submitOrder);

module.exports = router;
