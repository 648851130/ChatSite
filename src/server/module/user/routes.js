var router = require('express').Router();
var four0four = require('../../utils/404')();
var json = require('../../utils/json').json;
var pagination = require('../../utils/pagination').pagination;
var User = require('./model');
var _ = require('underscore');

router.get('/isLogined', isLogined);
router.post('/reg', reg);
router.post('/login', login);
router.post('/logout', logout);
router.get('/searchUser', searchUser);
router.put('/user', upUser);
router.get('/user/:id', getOneUser);
router.put('/pwd', pwd);


module.exports = router;



function isLogined(req, res, next){
    var user = req.session.user;
    //console.log(user);
    if(!user){
        return json(res,0,"没登录");
    }else{
        return json(res,1,user);
    }

}

function reg(req, res, next){

    var _user = req.body.user;
    var phone = _user.phone;

    var reguser = new User(_user);
    reguser.nick_name = phone;

    //console.log(reguser);
    User.findOne({phone:phone},function(err,user){
        if(err){
            console.log(err);
        }
        if(!user){
            reguser.save(function(err,user){
                if(err){
                    console.log(err);
                }

                return json(res,1,'注册成功');
            });

        }else{
            return json(res,0,'用户已存在');

        }

    });
}

function pwd(req, res, next){
    var _user = req.body;
    var phone = req.session.user.phone;
    var password = _user.opwd;

    User.findOne({phone:phone},function(err,user){
        if(err){
            console.log(err);
        }
        if(!user){
            return json(res,0,'不存在的用户');
        }else{
            user.comparePassword(password,function(err,isMatch){
                if(err){
                    console.log(err);
                }
                if(isMatch){
                    user.password = _user.password;
                    user.save(function(err,data){
                        if(err){
                            console.log(err);
                        }else{
                            return json(res,1,'success');

                        }

                    });

                }else{
                    return json(res,0,'旧密码错误');
                }
            });
        }

    });
}

function login(req, res, next){

    var _user = req.body.user;
    var phone = _user.phone;
    var password = _user.password;

    User.findOne({phone:phone},function(err,user){
        if(err){
            console.log(err);
        }
        if(!user){
            return json(res,0,'用户名或密码错误');
        }else{
            user.comparePassword(password,function(err,isMatch){
                if(err){
                    console.log(err);
                }
                if(isMatch){
                    User.findByIdAndUpdate(user._id,{$set: {status: 'up'}},function(err,doc){
                        if(err){
                            console.log(err);
                        }else{
                            doc.status = 'up';
                            //console.log(doc)
                            req.session.user = doc;
                            return json(res,1,doc);
                        }
                    });

                }else{
                    return json(res,0,'用户名或密码错误');
                }
            });
        }

    });
}

function logout(req,res){

    User.findByIdAndUpdate(req.session.user._id,{$set: {status: 'down'}},function(err,doc){
        if(err){
            return json(res,0,err);
        }else{
            delete req.session.user;
            return json(res,1,'登出成功');
        }
    });


    //delete app.locals.user;

}

function searchUser(req,res){
    //console.log(req.query)
    var condition = req.query.condition || "";
    var qu = new RegExp(condition);

        User.find({"$or" : [ {phone:qu} , {nick_name:qu} ] },function(err,user){
            if(err){
                console.log(err);
            }

            return json(res,1,pagination(req.query,user));


        });


}

function upUser(req,res){
    var _user = req.body;

    //var _params;
    //User.findById(_user._id,function(err,user){
    //    if(err){
    //        console.log(err);
    //    }
    //    _params = _.extend(user,_user);
    //    console.log(_params)
    //    _params.save(function(err,data){
    //        if(err){
    //            console.log(err);
    //        }else{
    //            return json(res,1,'success');
    //        }
    //
    //
    //
    //    });
    //});

    User.findByIdAndUpdate(_user._id,_user,function(err,person){
        if(err){
            console.log(err)
        }else{
            req.session.user = _user;
            return json(res,1,_user);
        }
    });

}

function getOneUser(req,res){
    var id = req.params.id;

    User.findOne({_id:id})
        .exec(function(err,data){
            if(err){
                return json(res,0,err);
            }else{
                return json(res,1,data);
            }
        })
}