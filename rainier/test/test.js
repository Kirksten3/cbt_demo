var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var apiController = ('../controllers/rainierApiController');
var Token = require('../models/tokens');
var StoreToken = require('../models/storeTokens');
var app = require('../rainier');

chai.use(chaiHttp);

describe('AcmeApiController', function () {
  before(function () {
    StoreToken.create({ token: "ccas-bb9630c04f" });
  });

  describe('#returnToken()', function () {
    it('should successfully return a token', function (done) {
        chai.request("http://localhost:3051")
          .get('/rainier/v10.0/nonce_token')
          .query({
            storefront: "ccas-bb9630c04f"
          })
          .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('nonce_token');
            res.body.nonce_token.should.be.a('string');
            done();
          });
      });
    it('should require storefront token', function (done) {
      chai.request("http://localhost:3051")
        .get('/rainier/v10.0/nonce_token')
        .end(function(err, res) {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should require a valid storefront token', function (done) {
      chai.request("http://localhost:3051")
        .get('/rainier/v10.0/nonce_token')
        .send({
          storefront: "invalidStoreFront"
        })
        .end(function(err, res) {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });
  });
  describe('#submitOrder()', function () {
    before(function() {
      Token.create({ token: '111111111111111111111', isUsed: false});
      Token.create({ token: '111111111111111111110', isUsed: true });
    });
    it('should successfully submit order', function (done) {
      chai.request("http://localhost:3051")
        .post('/rainier/v10.0/request_customized_model')
        .set("Content-Type", "application/json")
        .send({
          token: '111111111111111111111',
          model: 'olympic',
          package: '14k'
        })
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('order_id');
          done();
        });
    });
    it('should not accept used tokens', function (done) {
      chai.request("http://localhost:3051")
        .post('/rainier/v10.0/request_customized_model')
        .set("Content-Type", "application/json")
        .send({
          token: '111111111111111111110',
          model: 'olympic',
          package: '14k'
        })
        .end(function(err, res) {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });;
    it('should require a token', function (done) {
      chai.request("http://localhost:3051")
        .post('/rainier/v10.0/request_customized_model')
        .set("Content-Type", "application/json")
        .send({
          model: 'olympic',
          package: '14k'
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
