'use strict'; 

var app = require('express')();
var path = require('path');
var session = require('express-session');
var User = require('../api/users/user.model');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

passport.use(
    new GoogleStrategy({
        clientID: '133071954173-qv5l20657f26k1c31h9rbc7iipi60pgq.apps.googleusercontent.com',
        clientSecret: 'rZ4_BxJB8k_uNPjjwc4HX8KF',
        callbackURL: 'http://127.0.0.1:8080/auth/google/callback'
    },
    // google will send back the token and profile
    function (token, refreshToken, profile, done) {
        User.findOne({ 'google.id' : profile.id }, function (err, user) {
    // if there is an error, stop everything and return that
    // ie an error connecting to the database
    if (err) return done(err);
    // if the user is found, then log them in
    if (user) {
        return done(null, user); // user found, pass along that user
    } else {
        // if there is no user found with that google id, create them
        var newUser = new User();
        // set all of the google information in our user model
        newUser.google.id = profile.id; // set the users google id                   
        newUser.google.token = token; // we will save the token that google provides to the user                    
        newUser.google.name = profile.displayName; // look at the passport user profile to see how names are returned
        newUser.google.email = profile.emails[0].value; // google can return multiple emails so we'll take the first
        // don't forget to include the user's email, name, and photo
        newUser.email = newUser.google.email; // required field
        newUser.name = newUser.google.name; // nice to have
        newUser.photo = profile.photos[0].value; // nice to have
        // save our user to the database
        newUser.save(function (err) {
            if (err) done(err);
            // if successful, pass along the new user
            else done(null, newUser);
        });
    }
});
    })
);


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