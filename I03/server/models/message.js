var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Message', new Schema({
    text: String,
    isPublic: {type: Boolean, default: false},
    upvoters: [{name: String}],
    uploader: String,
    added: { type: Date, default: Date.now }
}));