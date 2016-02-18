'use strict'; 

var app = require('express')();
var path = require('path');
var session = require('express-session');
var User = require('../api/users/user.model');

app.use(session({
    // this mandatory configuration ensures that session IDs are not predictable
    secret: 'tongiscool'
}));

// place right after the session setup middleware
app.use(function (req, res, next) {
    console.log('session', req.session);
    next();
});

app.use(function (req, res, next) {
  if (!req.session.counter) req.session.counter = 0;
  console.log('counter', ++req.session.counter);
  next();
});

app.use(require('./logging.middleware'));

app.use(require('./requestState.middleware'));

app.use(require('./statics.middleware'));

app.use('/api', require('../api/api.router'));

app.post('/login', function (req, res, next) {
  console.log('made it to route');
  User.findOne({
    email: req.body.email,
    password: req.body.password
  })
  .then(function (user) {
    if (!user) {
      res.sendStatus(401);
    } else {
      console.log('user found');
      req.session.userId = user._id;
      res.sendStatus(200);
    }
  })
  .then(null, next);
})

var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'public', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
	app.get(stateRoute, function (req, res) {
		res.sendFile(indexPath);
	});
});

app.use(require('./error.middleware'));

module.exports = app;