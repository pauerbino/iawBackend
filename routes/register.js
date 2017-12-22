var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
//var User = require('../model/userModel.js');
var User = mongoose.model('User');
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

router.get('/', function(req, res, next) {
    User.find(function (err, users) {
        if (err) return next(err);
        res.json(users);
    });
});

//Register
router.post('/', function(req, res, next) {
  // if(!req.body.name || !req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }

  User.find({"email" : req.body.email}).exec(function(err,u) {
    if (u.length > 0) {
      res.json({"error" : "The email is not valid. Please try a new one."});
    }
    else {
      var user = new User({
        name : req.body.name,
        email : req.body.email
      });

      user.setPassword(req.body.password);
      console.log("creo usuario");


      user.save(function(err) {
        if (err) throw err;
        var token;
        token = user.generateJwt();
        res.json({
          "token" : token
        });
      });
    }
  });
});

module.exports = router;