var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var apiController = ('../controllers/acmeApiController');
var Token = require('../models/apiTokens');
var app = require('../acme');

chai.use(chaiHttp);

describe('AcmeApiController', function () {
  before(function () {
    Token.create({ token: "cascade.53bce4f1dfa0fe8e7ca126f91b35d3a6" });
  });

  describe('#submitOrder()', function () {
    it('should successfully submit an order', function (done) {
        chai.request("http://localhost:3050")
          .post('/acme/api/v45.1/order')
          .type('form')
          .send({
            api_key: "cascade.53bce4f1dfa0fe8e7ca126f91b35d3a6",
            model: "Anvil",
            package: "super"
          })
          .end(function(err, res) {
            console.log(res.body.error);
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('order');
            done();
          });
      });
    it('should require api token', function (done) {
        chai.request("http://localhost:3050")
          .post('/acme/api/v45.1/order')
          .type('form')
          .send({
            model: "Anvil",
            package: "super"
          })
          .end(function(err, res) {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            done();
          });
    });
    it('should require a valid api token', function (done) {
        chai.request("http://localhost:3050")
          .post('/acme/api/v45.1/order')
          .type('form')
          .send({
            api_key: "invalidToken1234",
            model: "Anvil",
            package: "super"
          })
          .end(function(err, res) {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
        done();
          });
    });
  });
});
