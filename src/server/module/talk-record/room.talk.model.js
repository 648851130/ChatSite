var mongoose = require('mongoose');

var RoomTalkSchema = require('./room.talk.schema');
var RoomTalk = mongoose.model('RoomTalk', RoomTalkSchema);

module.exports = RoomTalk;