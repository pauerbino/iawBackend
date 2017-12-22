var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../model/userModel.js');
var List = require('../model/listModel.js');

router.get('/:email', function(req, res, next) {
    var token = req.headers['x-access-token'];
    console.log(token);
    if (token) {
        try {
            User.find({"email": req.params.email}).exec(function(err,u) {
                console.log(u);
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
    if (token) {
        try {
            User.find({"email": req.params.email}).exec(function(err,u) {
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
    var token = req.headers['x-access-token'];
    var email = req.body.email;
    var name = req.body.name;
    var contacts = req.body.contacts;
    if (token) {
            console.log(token);
            var contactsList = [] ;
            for(var c of contacts) {
                contactsList.push(c._id);
            }
            ///FIJATE QUE NO IMPRIME ESTO
            console.log(email);
            User.find({"email": email}).exec(function(err,u) {
                var newList = new List ({
                    name : name,
                    user : u[0]._id,
                    contacts : contactsList
                });
                console.log(newList);
                newList.save(function(err) {
                    if (err) throw err;
                    res.json(newList);
                });
            });
    } else {
        res.end('Access token required', 400);
    }
});

router.put('/:id', function(req, res, next) {
    var token = req.headers['x-access-token'];
    var name = req.body.name;
    var contacts = req.body.contacts;
    if (token) {
        try {
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
    if (token) {
        try {
            List.findByIdAndRemove(req.params.id, req.body, function (err, post) {
                if (err) return next(err);
                res.json(post);
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
