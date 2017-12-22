var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var User = require('../model/userModel.js');
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

router.get('/', function(req, res, next) {
    User.find(function (err, users) {
        if (err) return next(err);
        res.json(users);
    });
});

//View my profile
router.get('/:id', function(req, res, next) {
  userId = req.params.id;
  //if (!req.payload._id) {
  //  res.status(401).json({
  //    "message" : "UnauthorizedError: private profile"
  //  });
  //} else {
    User
      .findById(req.payload._id)
      .exec(function(err, user) {
        res.status(200).json(user);
      });
  //}
});


router.get('/premium/:email', function(req, res, next) {
    User.find({"email": req.params.email}).exec(function(err,u) {
        if (err) throw er;
        var body = {
            premium: u[0].premium
        }
        res.json(body);
    });
});

router.put('/', function(req, res, next) {
    User.find({"email": req.body.email}).exec(function(err,u) {
        if (err) throw er;
        u[0].premium = true;
        u[0].save(function(er) {
            if (er) throw er;
            res.json(u[0]);
        });
    });
});


//Log in
router.post('/', function(req, res, next) {

  // if(!req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }
  console.log("Entrooo");

  passport.authenticate('local', function(err, user, info){
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }
    console.log(user);

    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    // res.redirect('/users/' + req.user.username);

    // If a user is founds
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

});

module.exports = router;
