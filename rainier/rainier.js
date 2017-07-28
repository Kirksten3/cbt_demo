var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');

var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
var StoreToken = require('./models/storeTokens');
var bodyParser = require('body-parser');

mockgoose.prepareStorage().then(function() {
  mongoose.connect('mongodb://localhost:27017/cbt_rainier_db');

  // running seed here, just needs the storefront
  StoreToken.create({ token: 'ccas-bb9630c04f' });
});

var app = express();
var port = process.env.PORT || 3051;

// general routing
var routes = require('./routes/rainier');

// Use Handlebars as the view engine for the app.
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use('/rainier/v10.0', routes);

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
})

// Listen on the specified port.
app.listen(port, function () {
  console.log("== Listening on port", port);
});
