var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var apiController = ('../controllers/acmeApiController');
var Token = require('../models/apiTokens');

mockgoose.prepareStorage().then(function() {
  mongoose.connect('mongodb://localhost:27017/cbt_test_acme_db', function (err) {
    if (err) throw err;
  });
});


chai.use(chaiHttp);

describe('AcmeApiController', function () {
  before(function () {
    Token.create({ token: "cascade.53bce4f1dfa0fe8e7ca126f91b35d3a6" });
  });

  describe('#submitOrder()', function () {
    it('should successfully submit an order', function (done) {
        chai.request("http://localhost:3050")
          .post('/acme/api/v45.1/order')
          .set("Content-Type", "x-www-form-urlencoded")
          .send(JSON.stringify({
            token: "cascade.53bce4f1dfa0fe8e7ca126f91b35d3a6",
            model: "Anvil",
            package: "super"
          }))
          .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('order');
          });
        done();
      });
    it('should require api token', function (done) {
        chai.request("http://localhost:3050")
          .get('/acme/api/v45.1/order')
          .set("Content-Type", "x-www-form-urlencoded")
          .send(JSON.stringify({
            model: "Anvil",
            package: "super"
          }))
          .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
          });
        done();
    });
    it('should require a valid api token', function (done) {
        chai.request("http://localhost:3050")
          .get('/acme/api/v45.1/order')
          .set("Content-Type", "x-www-form-urlencoded")
          .send(JSON.stringify({
            token: "invalidToken1234",
            model: "Anvil",
            package: "super"
          }))
          .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
          });
        done();
    });
  });
});
