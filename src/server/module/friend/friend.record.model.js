var mongoose = require('mongoose');

var FriendRecordSchema = require('./friend.record.schema');
var FriendRecord = mongoose.model('FriendRecord', FriendRecordSchema);

module.exports = FriendRecord;