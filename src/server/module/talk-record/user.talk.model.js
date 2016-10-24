var mongoose = require('mongoose');

var UserTalkSchema = require('./user.talk.schema');
var UserTalk = mongoose.model('UserTalk', UserTalkSchema);

module.exports = UserTalk;