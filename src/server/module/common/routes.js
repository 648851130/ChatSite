var router = require('express').Router();
var four0four = require('../../utils/404')();
var json = require('../../utils/json').json;
var pagination = require('../../utils/pagination').pagination;
var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var moment = require("moment");
var images = require("images");


router.post('/file', uploadFile);
router.post('/img', uploadImg);
router.get('/emoj', getEmoj);




module.exports = router;


function uploadFile(req,res){

    var posterData = req.files.upload_file;
    var filePath = posterData.path;
    var originalFilename = posterData.originalFilename;

    if(originalFilename){
        fs.readFile(filePath,function(err,data){
            var timestamp = moment().format("YYYYMMDDHms");
            var c_paths = posterData.path.split('/');
            var f_type = posterData.headers["content-type"].split('/')[0];
            var poster,newPath,realPath,static_path;


            if(f_type == "video"){
                poster = timestamp + '-' + c_paths[c_paths.length-1] + '.mp4';
                static_path = '/upload/video/';

            }else if(f_type == "audio"){
                poster = timestamp + '-' + c_paths[c_paths.length-1] + '.mp3';
                static_path = '/upload/audio/';

            }else if(f_type == "image"){
                poster = timestamp + '-' + c_paths[c_paths.length-1];
                static_path = '/upload/image/';

            }else{
                return json(res,0,"上传格式错误");
            }

            newPath = path.join(__dirname,'../../../','client' + static_path + poster);
            realPath = static_path + poster;

            fs.writeFile(newPath,data,function(err){
                return json(res,1,{
                    type:f_type,
                    path:realPath
                });
            })
        })
    }
}

function uploadImg(req,res){
    var posterData = req.files.upload_file;
    var filePath = posterData.path;
    var originalFilename = posterData.originalFilename;

    if(originalFilename){
        fs.readFile(filePath,function(err,data){
            var timestamp = moment().format("YYYYMMDDHms");
            var c_paths = posterData.path.split('/');
            var f_type = posterData.headers["content-type"].split('/')[0];
            var poster,newPath,realPath,static_path;


            if(f_type == "image"){
                poster = timestamp + '-' + c_paths[c_paths.length-1];
                static_path = '/upload/image/';

            }else{
                return json(res,0,"上传格式错误");
            }

            newPath = path.join(__dirname,'../../../','client' + static_path + poster);
            realPath = static_path + poster;

            //fs.writeFile(newPath,data,function(err){
            images(filePath)                     //Load image from file
                                                    //加载图像文件
                .size(350,200)                          //Geometric scaling the image to 400 pixels width
                                //在(10,10)处绘制Logo
                .save(newPath);

            return json(res,1,realPath);
            //})
        })
    }
}

function getEmoj(req,res){

    var dir = path.join(__dirname,'../../../','client/emoj');

    fs.readdir(dir, function(err,files){
        if(err){
            console.log(err);
        }else{
            return json(res,1,files);
        }

    })
}

