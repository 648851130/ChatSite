var mongoose = require('mongoose');

var RoomSchema = require('./schema');
var Room = mongoose.model('Room', RoomSchema);

module.exports = Room;