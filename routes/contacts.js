var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../model/userModel.js');
var Contact = require('../model/contactModel.js');
var jws = require('jws');


router.get('/:email', function(req, res, next) {
    var token = req.headers['x-access-token'];
    var options = {};
    if (token) {
        try {
            var decoded = jws.decode(token, options);
            if (!decoded) { return null; }
            var payload = decoded.payload;
            User.find({"email": payload.email}).exec(function(err,u) {
                Contact.find({"user" : u}).exec(function (err, contacts) {
                    if (err) return next(err);
                    res.json(contacts);
                });
            });
        }
        catch (err) {
            return next();
        }
    } else {
        res.end('Access token required', 400);
    }
});

router.get('/:id/:email', function(req, res, next) {
    var token = req.headers['x-access-token'];
    var options = {};
    if (token) {
        try {
            var decoded = jws.decode(token, options);
            if (!decoded) { return null; }
            var payload = decoded.payload;
            User.find({"email": payload.email}).exec(function(err,u) {
                Contact.find({"_id" : req.params.id, "user" : u}).exec(function (err, contact) {
                    if (err) return next(err);
                    res.json(contact[0]);
                });
            });
        }
        catch (err) {
            return next();
        }
    } else {
        res.end('Access token required', 400);
    }
    //Contact.findById(req.params.id, function (err, contact) {
    //    if (err) return next(err);
    //    res.json(contact);
    //});
});

router.post('/', function(req, res, next) {
    var token = req.headers['x-access-token'];
    var options = {};
    console.log(req);
    if (token) {
        try {
            var decoded = jws.decode(token, options);
            if (!decoded) { return null; }
            var payload = decoded.payload;
            User.find({"email": payload.email}).exec(function(err,u) {
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
        }
        catch (err) {
            return next();
        }
    } else {
        res.end('Access token required', 400);
    }
});

router.put('/:id', function(req, res, next) {
    var token = req.headers['x-access-token'];
    var options = {};
    if (token) {
        try {
            var decoded = jws.decode(token, options);
            if (!decoded) { return null; }
            var payload = decoded.payload;
            User.find({"email": payload.email}).exec(function(err,u) {
                Contact.findByIdAndUpdate(req.params.id, req.body, function (err, put) {
                    if (err) return next(err);
                    res.json(put);
                });
            });
        }
        catch (err) {
            return next();
        }
    } else {
        res.end('Access token required', 400);
    }
});

router.delete('/:id', function(req, res, next) {
    var token = req.headers['x-access-token'];
    var options = {};
    if (token) {
        try {
            var decoded = jws.decode(token, options);
            if (!decoded) { return null; }
            var payload = decoded.payload;
            User.find({"email": payload.email}).exec(function(err,u) {
                Contact.findByIdAndRemove(req.params.id, req.body, function (err, post) {
                    if (err) return next(err);
                    res.json(post);
                });
            });
        }
        catch (err) {
            return next();
        }
    } else {
        res.end('Access token required', 400);
    }
});

module.exports = router;
