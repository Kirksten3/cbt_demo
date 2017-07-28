var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');

var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
var ApiToken = require('./models/apiTokens');
var bodyParser = require('body-parser');

mockgoose.prepareStorage().then(function() {
  mongoose.connect('mongodb://localhost:27017/cbt_acme_db');

  //running seed here, just needs api token
  ApiToken.create({ token: "cascade.53bce4f1dfa0fe8e7ca126f91b35d3a6" });
});

var app = express();
var port = process.env.PORT || 3050;

// general routing
var routes = require('./routes/acme');

// Use Handlebars as the view engine for the app.
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use('/acme/api/v45.1', routes);

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
