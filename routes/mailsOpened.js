var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var User = require('../model/userModel.js');
var Campaign = require('../model/campaignModel.js');
var List = require('../model/listModel.js');
var Mail = require('../model/mailModel.js');

router.get('/:id', function(req, res, next) {
    Mail.findByIdAndUpdate(req.params.id, {open: true}, function (err, put) {
        if (err) return next(err);
        res.sendFile(__dirname + '/example.png');
    });
});

module.exports = router;