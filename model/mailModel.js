var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MailSchema = Schema({
    open: {type : Boolean, default: false}
    //user
});

var Mail = mongoose.model('Mail', MailSchema );

module.exports = Mail;
