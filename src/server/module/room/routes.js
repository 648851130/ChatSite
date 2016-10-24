var router = require('express').Router();
var four0four = require('../../utils/404')();
var json = require('../../utils/json').json;
var pagination = require('../../utils/pagination').pagination;
var repagination = require('../../utils/pagination').repagination;
var _ = require('underscore');

var Room = require('./model');


router.post('/room', createRoom);
router.put('/room', updateRoom);
router.get('/room', getRooms);
router.get('/room/:id', getOneRoom);




module.exports = router;


//创建房间
function createRoom(req, res, next){

    var _params = req.body;
    var params = new Room(_params)

    params.save(function(err,user){
        if(err){
            console.log(err);
        }else{
            return json(res,1,'success');
        }

    });

}

function updateRoom(req, res, next){
    var _params = req.body;
    var _room;
    Room.findById(_params._id,function(err,room){
        if(err){
            console.log(err);
        }
        _room = _.extend(room,_params);
        _room.save(function(err,room){
            if(err){
                console.log(err);
            }else{
                return json(res,1,'success');
            }



        });
    });
}


function getRooms(req, res, next){
    Room.find({})
        .sort("-last")
        .populate('creator','nick_name')
        .exec(function(err,rooms){
            if(err){
                console.log(err);
            }else{
                return json(res,1,rooms);

            }



        });
}

function getOneRoom(req, res, next){
    var id = req.params.id;
    Room.findOne({_id:id})
        .exec(function(err,rooms){
            if(err){
                console.log(err);
            }else{
                return json(res,1,rooms);

            }



        });
}

