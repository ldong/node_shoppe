var http = require('http');
var path = require('path');
var fs = require('fs');
var express = require('express');
var _ = require('lodash');
var cons = require('consolidate');

var app = express();
var port = 3000;
var baseDir = __dirname;
var relativeToBaseDir = function(relPath) {return path.join(baseDir, relPath);};

var cartQuantities = {};
var products = JSON.parse(fs.readFileSync('data/products.json', {encoding:'utf8'}));
products = _.map(products, function(p, i) {
  p.id = i;
  p.picUrl = '/static/img/' + p.name.toLowerCase().replace(/\ /g, '_') + '.jpg';

  cartQuantities[p.id] = 0;

  return p;
});

// setup general static middleware
app.use('/static', express.static(relativeToBaseDir('public')));

// setup templating
app.set('engine', cons.ejs);
app.set('view engine', 'ejs');
app.set('views', relativeToBaseDir('views'));

// setup routing
app.route('/')
  .get(function(req, res) {
    res.render('index', {products: products});
  });

app.route('/products/:id')
  .get(function(req, res) {
    var id = req.params.id;
    var product = products[id];
    res.render('product', {product: product});
  });

app.route('/cart/:id?')
  .get(function(req, res) {
    var cart = _(products)
      .filter(function(p) {
        return cartQuantities[p.id] > 0;
      })
      .map(function(p) {
        var cartProduct = _.assign({quantity: cartQuantities[p.id]}, p);
        delete cartProduct.reviews;
        delete cartProduct.description;
        return cartProduct;
      })
      .value();

    res.render('cart', {cart: cart});
  })
  .post(function(req, res) {
    var id = req.params.id;
    if(id >= 0 && id < products.length) {
      cartQuantities[id]++;
      res.send({success: true});
    }
    else {
      res.send({success: false, message: 'id ' + id + ' is invalid'});
    }
  })
  .delete(function(req, res) {
    var id = req.params.id;
    if(id >= 0 && id < products.length) {
      cartQuantities[id] = 0;
      res.send({success: true});
    }
    else {
      res.send({success: false, message: 'id ' + id + ' is invalid'});
    }
  });

// start server
var server = http.Server(app);
server.listen(port);
console.log('Started on port ' + port);
