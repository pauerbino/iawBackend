var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ListSchema = Schema({
    name : {type : String, default: ''},
    user : { type: Schema.Types.ObjectId, ref: 'User' },
    contacts : [{ type: Schema.Types.ObjectId, ref: 'Contact' }]
});

var List = mongoose.model('List', ListSchema );

module.exports = List;