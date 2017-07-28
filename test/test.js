var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
var seed = require('../migrations/seed');
var chai = require('chai');
var chaiHttp = require('chai-http');
var OrderController = require('../controllers/orderController');
var User = require('../models/users');
var Order = require('../models/orders');
var should = chai.should();
var app = require('../app');

chai.use(chaiHttp);

describe('OrderController', function () {
  before(function() {
    mockgoose.helper.reset().then(function() {
      User.create({ userName: 'emp', password: 'test', isEmployee: true});
      var cus = User.create({ userName: 'cus', password: 'test', isEmployee: false});
      Order.create({ make: '123456abcd', model: 'Anvil', package: 'super', customer_id: cus._id});
    });
  });
  describe('#getOrders()', function () {
    it('should get all orders', function (done) {
      User.findOne({ isEmployee: true }, function (err, emp) {
        if (err) console.log(err);
        chai.request("http://localhost:3000")
          .get('/orders')
          .query({ userId: emp.id })
          .end(function(err, res) {
            console.log(res.body);
            res.should.have.status(200);
            res.body.should.be.a('array');
            done();
          });
      });
    });
    it('should get no orders', function (done) {
      User.findOne({ isEmployee: false }, function (err, cus) {
        console.log(cus);
        chai.request("http://localhost:3000")
          .get('/orders')
          .query({ userId: cus.id })
          .end(function(err, res) {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            done();
          });
      });
    });
    it('should require user id', function (done) {
      chai.request("http://localhost:3000")
        .get('/orders')
        .end(function(err, res){
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });
  });
  describe('#addOrder()', function () {
    it('should add an order', function (done) {
      User.findOne({ isEmployee: false }, function (err, cus) {
        chai.request("http://localhost:3000")
          .post('/order')
          .send({ make: "1234supplierid", model: "Anvil", package: "test", customer_id: cus.id })
          .end(function (err, res) {
            res.body.should.be.a('object');
            res.body.statusCode.should.be.eql(200);
            res.body.should.have.property("link");
          });
        done();
      });
    });
    //it('should fail to order', function (done) {
      //chai.request("http://localhost:3000")
        //.post('/order')
        //.send({ make: "1234supplierid", model: "Anvil", package: "", customer_id: "1234" })
        //.end(function (err, res) {
          //res.body.should.be.a('object');
          //res.body.should.have.property('error');
          //done();
        //});
    //});
  });
});
