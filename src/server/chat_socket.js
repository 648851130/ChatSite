var _ = require('underscore');
var util = require('./utils/json');
var four0four = require('./utils/404')();
var json = require('./utils/json').json;
var pagination = require('./utils/pagination').pagination;

var UserTalk = require('./module/talk-record/user.talk.model');
var Friend = require('./module/friend/friend.model');
var RoomTalk = require('./module/talk-record/room.talk.model');


var ioSocket = function(io){
    io.on('connection',function(socket){

        console.log('11111\n')

        socket.on('login',function(params){
            var client = {
                socket:socket,
                user:params.user
            }
            if(util.indexOf(global.clients,client) == -1){
                global.clients.push(client);
            }

            console.log("\nconnenct:\n")
            console.log(global.clients)

        });

        socket.on('say_private',function(params){


            var to_socket = "";
            for(var n in global.clients){
                if(global.clients[n].user._id == params.talk.to){     // get socket match
                    to_socket = global.clients[n].socket;
                    break;
                }
            }

            if(params.type == 'say'){
                var user_talk = new UserTalk(params.talk);

                user_talk.save(function(err,data){

                    if(err){
                        console.log(err);
                    }else{

                        UserTalk.findOne({_id:data._id})
                            .populate('from')
                            .populate('to')
                            .exec(function(err,say){
                                if(err){
                                    console.log(err);
                                }else{


                                    var sel = [
                                        {
                                            user:user_talk.from,
                                            friend:user_talk.to
                                        },
                                        {
                                            user:user_talk.to,
                                            friend:user_talk.from
                                        }
                                    ]


                                    Friend.update({$or:sel},{$set:{last:Date.now()}},function(err){
                                        if(err){
                                            console.log(err)
                                        }else{
                                            if(to_socket != ""){
                                                to_socket.emit("send_private",say);
                                            }
                                            socket.emit("send_private",say);
                                        }
                                    });


                                }

                            })

                    }

                });
            }else if(params.type = 'to_friend'){
                if(to_socket != ""){
                    to_socket.emit("getMsg");
                }
                socket.emit("getMsg");
            }else if(params.type = 'send_msg'){
                socket.emit('/','getMsg');
            }





        });   //私聊



        socket.on('joinRoom',function(room){

            var room_name = "room-" + room.roomId;


            socket.join(room_name);

            //socket.emit("test",io.sockets.adapter.rooms);
            io.sockets.in(room_name).emit('join_tip', {
                tip:room.user.nick_name + "进入了房间"
            });

        });

        socket.on('leaveRoom',function(room){

            var room_name = "room-" + room.roomId;


            socket.leave(room_name);

            socket.broadcast.to(room_name).emit('leave_tip', {
                tip:room.user.nick_name + "离开了房间"
            });


        });

        socket.on('getOnlineUsers',function(room){
            var room_name = "room-" + room.roomId;
            var room_users = io.sockets.adapter.rooms[room_name];

            var online_users = [];
            for(var key in room_users){

                online_users.push(getRoomUsers(key,global.clients))
            }


            io.sockets.in(room_name).emit("onlineUsers",{
                users:online_users
            })
        });



        socket.on('say_in_room',function(data){
            var room_talk = new RoomTalk(data);
            var room_name = "room-" + data.room;
            room_talk.save(function(err,room){
                if(err){
                    console.log(err);
                }else{

                    RoomTalk.findOne({_id:room._id})
                        .populate('from')
                        .exec(function(err,say){
                            if(err){
                                console.log(err);
                            }else{
                                io.sockets.in(room_name).emit("getSomeSay",say);
                            }

                        })

                }
            })

        });

        socket.on('upUserInfo',function(){
            socket.emit('getSession')
        })


        socket.on('disconnect',function(){       // Event:  disconnect



            for(var n in global.clients){
                if(_.isEqual(global.clients[n].socket, socket)){     // get socket match
                    global.clients.splice(n,1);
                    socket.emit('logout');
                }
            }
            console.log("\ndisconnenct:\n")
            console.log(global.clients)


        });


    });


}


function getRoomUsers(id,clients){

    var user;
    for(var j = 0;j < clients.length; j++){

        if(clients[j].socket.id == id){
            user = clients[j].user;

            break;
        }
    }
    return user;
}


module.exports = ioSocket;