var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var User = require('../model/userModel.js');
var Campaign = require('../model/campaignModel.js');
var List = require('../model/listModel.js');
var Mail = require('../model/mailModel.js');


router.get('/:email', function(req, res, next) {
  User.find({"email": req.params.email}).exec(function(err,u) {
    Campaign.find({"user" : u}).exec(function (err, campaigns) {
        if (err) return next(err);
        res.json(campaigns);
    });
  });
});

router.get('/:id/:email', function(req, res, next) {
    User.find({"email": req.params.email}).exec(function(err,u) {
      Campaign.find({"_id" : req.params.id, "user" : u}).exec(function(err, campaign) {
          if (err) return next(err);
          res.json(campaign);
      });
    });
    //Campaign.findById(req.params.id).exec(function(err, campaign) {
    //      if (err) return next(err);
    //      res.json(campaign);
    //  });
});

router.get('/mailOpened/:id', function(req, res, next) {
    Mail.findByIdAndUpdate(req.params.id, {open: true}, function (err, put) {
        if (err) return next(err);
        res.sendFile(__dirname + '/example.png');
    });
});

router.post('/', function(req, res, next) {
    User.find({"email": req.body.userEmail}).exec(function(err,u) {
        var newCampaign = new Campaign ({
            title : req.body.title,
            subject : req.body.subject,
            from: req.body.from,
            list : req.body.list,
            mails : [],
            content : req.body.content,
            user : u[0]._id
        });

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'iaw2017final@gmail.com',
                pass: 'branca123'
            }
        });

        var nuevoMail = [];

        List.findById(req.body.list).populate('contacts').exec(function(err, list) {
            for (var i = 0; i < list.contacts.length; i++) {
                nuevoMail[i] = new Mail();
                console.log(nuevoMail);
                var mailOptions = {
                    from: req.body.from + '<noreply@noreply.com>',
                    to: list.contacts[i].email,
                    subject: req.body.subject,
                    text: req.body.content,
                    html: '<img src="http://localhost:3000/api/v1/campaigns/mailOpened/'+nuevoMail[i]._id+'">'
                };

                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        // console.log(nuevoMail[i]._id);
                        // newCampaign.mails.push(nuevoMail[i]._id);
                        // nuevoMail[i].save(function(er) {
                        //     if (er) throw er;
                        //     console.log('paso');
                        //     console.log(nuevoMail[i]);
                        // });
                    }
                });
            }

            for (var i = 0; i < nuevoMail.length; i++) {
                newCampaign.mails.push(nuevoMail[i]._id);
                nuevoMail[i].save(function(er) {
                    if (er) throw er;
                    console.log('paso');
                    console.log(nuevoMail[i]);
                });
            }

            newCampaign.save(function(err) {
                if (err) throw err;
                res.json(newCampaign);
            });
        });
    });
});

router.put('/:id', function(req, res, next) {
    Campaign.findByIdAndUpdate(req.params.id, req.body, function (err, put) {
        if (err) return next(err);
        res.json(put);
    });
});

router.delete('/:id', function(req, res, next) {
    Campaign.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;