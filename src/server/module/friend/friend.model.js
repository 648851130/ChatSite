var mongoose = require('mongoose');

var FriendSchema = require('./friend.schema');
var Friend = mongoose.model('Friend', FriendSchema);

module.exports = Friend;