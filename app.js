var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');

var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
var seed = require('./migrations/seed');
var bodyParser = require('body-parser');

mockgoose.prepareStorage().then(function() {
  mongoose.connect('mongodb://localhost:27017/cbt_db');
  seed();
});

var app = express();
var port = process.env.PORT || 3000;

// general routing
var routes = require('./routes/index');

// Use Handlebars as the view engine for the app.
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use('/', routes);

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
})

// Listen on the specified port.
app.listen(port, function () {
  console.log("== Listening on port", port);
});

module.exports = app;
