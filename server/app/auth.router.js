//'use strict'; 
//
//var app = require('express')();
//var User = require('../api/users/user.model');
//var router = require('express').Router();
//
//app.post('/login', function (req, res, next) {
//  User.findOne({
//    email: req.body.email,
//    password: req.body.password
//  })
//  .then(function (user) {
//    if (!user) {
//      res.sendStatus(401);
//    } else {
//      console.log('user found');
//      req.session.userId = user._id;
//      res.sendStatus(200);
//    }
//  })
//  .then(null, next);
//})
//
//app.post('/signup', function (req, res, next) {
//  User.create(req.body)
//  .then(function (user) {
//      req.session.userId = user._id;
//      res.sendStatus(200);
//  })
//  .then(null, next);
//})