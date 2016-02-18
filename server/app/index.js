'use strict'; 

var app = require('express')();
var path = require('path');
var session = require('express-session');
var User = require('../api/users/user.model');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
app.use(session({
    // this mandatory configuration ensures that session IDs are not predictable
    secret: 'tongiscool'
}));

// place right after the session setup middleware
app.use(function (req, res, next) {
    console.log('session', req.session);
    next();
});

// app.use(function (req, res, next) {
//   if (!req.session.counter) req.session.counter = 0;
//   console.log('counter', ++req.session.counter);
//   next();
// });

app.use(require('./logging.middleware'));

app.use(require('./requestState.middleware'));

app.use(require('./statics.middleware'));

app.use('/api', require('../api/api.router'));

app.use(passport.initialize());
app.use(passport.session());

// Google authentication and login 
app.get('/auth/google', passport.authenticate('google', { scope : 'email' }));

// handle the callback after Google has authenticated the user
app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect : '/',
    failureRedirect : '/' // or wherever
  })
);

passport.use(
    new GoogleStrategy({
        clientID: '596793924059-24f9iap80bpkm0seteaocgprnscdp80s.apps.googleusercontent.com',
        clientSecret: 'hRv2b8KyzatQ2pqDU4u1XfzV',
        callbackURL: 'http://127.0.0.1:8080/auth/google/callback'
    },
    // google will send back the token and profile
    function (token, refreshToken, profile, done) {
        console.log('---', 'in verification callback', profile, '---');
        done();
    })
);

app.post('/login', function (req, res, next) {
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
      res.status(200);
      res.send(user)
    }
  })
  .then(null, next);
})

app.post('/logout', function (req, res, next) {
  req.session.destroy()
  res.send('logged out')
})

app.post('/signup', function (req, res, next) {
  User.create(req.body)
  .then(function (user) {
      req.session.userId = user._id;
      res.sendStatus(200);
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