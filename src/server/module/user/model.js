var mongoose = require('mongoose');

var UserSchema = require('./schema');
var User = mongoose.model('User', UserSchema);

module.exports = User;