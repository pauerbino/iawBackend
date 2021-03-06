var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../model/userModel.js');
var List = require('../model/listModel.js');
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
                List.find({"user" : u}).populate('contacts').exec(function(err, list) {
                    console.log('entro en el get');
                    if (err) return next(err);
                    console.log(list);
                    res.json(list);
                });
            });
        } 
        catch (err) {
            return next();
        }
    } else {
        res.end('Access token required', 400);
    }
    //         console.log('paso por aca');
    //List.find(function (err, lists) {
    //    if (err) return next(err);
    //    res.json(lists);
    //});
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
                List.find({"_id" : req.params.id, "user" : u}).populate('contacts').exec(function(err, list) {
                    if (err) return next(err);
                    res.json(list[0]);
                });
            });
        } 
        catch (err) {
            return next();
        }
    } else {
        res.end('Access token required', 400);
    }
  //  List.findById(req.params.id).populate('contacts').exec(function(err, list) {
  //      if (err) return next(err);
  //      res.json(list);
  //  });
});

router.post('/', function(req, res, next) {
    var email = req.body.email;
    var name = req.body.name;
    var contacts = req.body.contacts;
    var token = req.headers['x-access-token'];
    var options = {};
    if (token) {
        try {
            var decoded = jws.decode(token, options);
            if (!decoded) { return null; }
            var payload = decoded.payload;
            var contactsList = [] ;
            for(var c of contacts) {
                contactsList.push(c._id);
            }
            User.find({"email": payload.email}).exec(function(err,u) {
                var newList = new List ({
                    name : name,
                    user : u[0]._id,
                    contacts : contactsList
                });
                newList.save(function(err) {
                    if (err) throw err;
                    res.json(newList);
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
    var name = req.body.name;
    var contacts = req.body.contacts;
    var token = req.headers['x-access-token'];
    var options = {};
    if (token) {
        try {
            var decoded = jws.decode(token, options);
            if (!decoded) { return null; }
            var payload = decoded.payload;
            User.find({"email": payload.email}).exec(function(err,u) {
                var contactsList = [] ;
                for(var c of contacts) {
                    contactsList.push(c._id);
                }
                var body = {
                    name: name,
                    contacts: contactsList
                }
                List.findByIdAndUpdate(req.params.id, body, function (err, put) {
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
                List.findByIdAndRemove(req.params.id, req.body, function (err, post) {
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
