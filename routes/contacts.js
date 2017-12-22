var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../model/userModel.js');
var Contact = require('../model/contactModel.js');


router.get('/:email', function(req, res, next) {
    User.find({"email": req.params.email}).exec(function(err,u) {
        Contact.find({"user" : u}).exec(function (err, contacts) {
            if (err) return next(err);
            res.json(contacts);
        });
    });
});

router.get('/:id/:email', function(req, res, next) {
    User.find({"email": req.params.email}).exec(function(err,u) {
        Contact.find({"_id" : req.params.id, "user" : u}).exec(function (err, contact) {
            if (err) return next(err);
            res.json(contact[0]);
        });
    });
    //Contact.findById(req.params.id, function (err, contact) {
    //    if (err) return next(err);
    //    res.json(contact);
    //});
});

router.post('/', function(req, res, next) {
    console.log(req);
    User.find({"email": req.body.userEmail}).exec(function(err,u) {
        console.log('entro');
        var newContact = new Contact ({
            name : req.body.name,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            tags : req.body.tags,
            user : u[0]._id
        });

        newContact.save(function(err) {
            if (err) throw err;
            res.json(newContact);
        });
    });
});

router.put('/:id', function(req, res, next) {
    Contact.findByIdAndUpdate(req.params.id, req.body, function (err, put) {
        if (err) return next(err);
        res.json(put);
    });
});

router.delete('/:id', function(req, res, next) {
    Contact.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;
