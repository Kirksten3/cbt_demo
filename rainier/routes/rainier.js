var express = require('express');
var router = express.Router()

var apiController = require('../controllers/rainierApiController');

router.get('/nonce_token', apiController.returnToken);

router.post('/request_customized_model', apiController.submitOrder);

module.exports = router;
