var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CampaignSchema = Schema({
    title : {type : String, default: '', required: true},
    subject : {type : String, default: '', required: true},
    from: {type : String, default: '', required: true},
    list : { type: Schema.Types.ObjectId, ref: 'List' },
    mails : [{ type: Schema.Types.ObjectId, ref: 'Mail' }],
    content : {type : String, default: ''},
    user : { type: Schema.Types.ObjectId, ref: 'User' }
});

var Campaign = mongoose.model('Campaign', CampaignSchema );

module.exports = Campaign;
