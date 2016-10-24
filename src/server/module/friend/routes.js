var router = require('express').Router();
var four0four = require('../../utils/404')();
var json = require('../../utils/json').json;
var pagination = require('../../utils/pagination').pagination;
var repagination = require('../../utils/pagination').repagination;
var _ = require('underscore');

var Friend = require('./friend.model');
var FriendRecord = require('./friend.record.model');


router.post('/friend', sendFriendMsg);
router.get('/friends-msg/:id', getFriendsMsg);
router.get('/friend/:id', getFriends);
router.put('/friend/:id', beToFriend);



module.exports = router;


//发送好友请求
function sendFriendMsg(req, res, next){

    var _params = req.body;
    var params = new FriendRecord(_params)

    params.save(function(err,user){
        if(err){
            console.log(err);
        }

        return json(res,1,user);
    });

}


//获取好友申请信息
function getFriendsMsg(req, res, next){
    var _id = req.params.id;

    FriendRecord.find({"$or" : [
        {
            from:_id
        },
        {
            to:_id
        }
    ] })
        .populate('from')
        .populate('to')
        .sort('-meta.createAt')
        .exec(function(err,friends){
            if(err){
                console.log(err);
            }
            return json(res,1,friends);
        })


}

//获取好友列表
function getFriends(req, res, next){
    var _id = req.params.id;
    Friend.find({user:_id})
        .populate('user','nick_name')
        .populate('friend')
        .sort('-last')
        .exec(function(err,friends){
            if(err){
                console.log(err);
            }
            return json(res,1,friends);
        })


}



//成为好友
function beToFriend(req, res, next){

    var state = req.body.state;
    var _id = req.params.id;

    FriendRecord.findByIdAndUpdate(_id,{$set:{state:state}},function(err,friend){
        if(err){
            return json(res,0,"fail");
        }else{
            if(state == 1){

                var friends = [
                    {
                        user:friend.from,
                        friend:friend.to
                    },
                    {
                        user:friend.to,
                        friend:friend.from
                    }
                ];
                Friend.find({"$or" :  friends })
                    .exec(function(err,isHave){
                        if(err){
                            return json(res,0,"fail");
                        }else{
                            if(isHave.length){
                                return json(res,1,"success");
                            }else{
                                Friend.create(friends,function(err,friends){
                                    if(err){
                                        return json(res,0,"fail");
                                    }else{
                                        return json(res,1,friend);
                                    }
                                })
                            }
                        }

                    })



            }else{
                return json(res,1,"success");
            }

        }
    });

}



