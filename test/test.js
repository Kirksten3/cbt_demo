var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
var seed = require('../migrations/seed');
var chai = require('chai');
var chaiHttp = require('chai-http');
var OrderController = require('../controllers/orderController');
var User = require('../models/users');
var should = chai.should();

mockgoose.prepareStorage().then(function() {
  mongoose.connect('mongodb://localhost:27017/cbt_test_db', function (err) {
    if (err) throw err;
  });
  seed();
});


chai.use(chaiHttp);

describe('OrderController', function () {
  describe('#getOrders()', function () {
    it('should get all orders', function (done) {
      User.create({ userName: 'emp', password: 'test', isEmployee: true }, function (err, emp) {
        if (err) console.log(err);
        chai.request("http://localhost:3000")
          .get('/orders')
          .send({ userId: emp._id })
          .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.length.should.be.eql(2);
          });
        done();
      });
    });
    it('should get no orders', function (done) {
      User.create({ userName: 'cus', password: 'test', isEmployee: false }, function (err, cus) {
        chai.request("http://localhost:3000")
          .get('/orders')
          .send({ userId: cus._id })
          .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.be.a('string');
            res.body.should.be.eql("NOT A VALID USER, must be employee");
          });
        done();
      });
    });
    it('should require user id', function (done) {
      chai.request("http://localhost:3000")
        .get('/orders')
        .end(function(err, res){
          res.should.have.status(200);
          res.body.should.be.a('string');
          res.body.should.be.eql("Must be logged in!");
        });
      done();
    });
  });
  describe('#addOrder()', function () {
    it('should add an order', function (done) {
      User.findOne({ isEmployee: false }, function (err, cus) {
        chai.request("http://localhost:3000")
          .post('/order')
          .send({ make: "1234supplierid", model: "Anvil", package: "test", customer_id: cus._id })
          .end(function (err, res) {
            res.body.should.be.a('object');
            res.body.statusCode.should.be.eql(200);
            res.body.should.have.property("link");
          });
        done();
      });
    });
    it('should fail to order', function (done) {
      chai.request("http://localhost:3000")
        .post('/order')
        .send({ make: "1234supplierid", model: "Anvil", package: "test", customer_id: "" })
        .end(function (err, res) {
          res.body.should.be.a("string");
          res.body.should.be.eql("Must be Logged in!");
        });
      done();
    });
  });
});
