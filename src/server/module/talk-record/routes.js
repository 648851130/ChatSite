var router = require('express').Router();
var four0four = require('../../utils/404')();
var json = require('../../utils/json').json;
var pagination = require('../../utils/pagination').pagination;
var repagination = require('../../utils/pagination').repagination;
var _ = require('underscore');

var UserTalk = require('./user.talk.model');
var RoomTalk = require('./room.talk.model');



router.get('/friend', getFriendTalkRecord);
router.get('/room', getRoomTalkRecord);




module.exports = router;


//获取好友聊天记录
function getFriendTalkRecord(req, res, next){

    var user = req.query;

    var params = [
        {
            from:user.from,
            to:user.to
        },
        {
            from:user.to,
            to:user.from
        }
    ]

    UserTalk.find({"$or" :  params })
        .populate('from')
        .populate('to')
        .sort("meta.createAt")
        .exec(function(err,isHave){
            if(err){
                return json(res,0,"fail");
            }else{
                return json(res,1,repagination(req.query,isHave));
            }

        })


}

function getRoomTalkRecord(req,res){
    var room = req.query;
    RoomTalk.find({room :  room.room_id })
        .populate('from')
        .sort("meta.createAt")
        .exec(function(err,isHave){
            if(err){
                return json(res,0,"fail");
            }else{
                return json(res,1,repagination(req.query,isHave));
            }

        })
}

