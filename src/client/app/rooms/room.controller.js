(function () {
    'use strict';

    angular.module ('app.rooms')
        .controller ('app.rooms.RoomController', RoomController);

    RoomController.$inject = ['$q','roomsService','dialog','socket','$timeout','config','$scope','$sce','$stateParams','friendsService','$element'];

    function RoomController ($q,roomsService,dialog,socket,$timeout,config,$scope,$sce,$stateParams,friendsService,$element) {
        var vm = this;

        vm.msgRecord = {};
        vm.option = [
            '同事·同学',
            '粉丝',
            '生活休闲',
            '兴趣爱好',
            '游戏',
            '行业交流'
        ];
        vm.roomId = $stateParams.id;
        vm.cur_user = JSON.parse(sessionStorage.getItem("user"));
        vm.first = true;
        vm.cur_page = 1;
        vm.goPage = goPage;
        vm.getHeight = getHeight;
        vm.html = html;
        vm.addImg = addImg;
        vm.timeShow = timeShow;
        vm.moment = moment;
        vm.stopAndSend = stopAndSend;
        vm.submit = submit;
        vm.showOneUser = showOneUser;
        vm.closeOneUser = closeOneUser;

        activate ();

        function activate () {
            uploadFile();

            var promises = [
                getRoomTalkRecord(),
                getEmoj(),
                getOneRoom()
            ];

            $q.all (promises).then (function () {
                vm.page_loaded = true;
                var window_height = $(window).height();
                $('.content').outerHeight(window_height - 70);
                //$('.window').outerHeight(window_height - 270);
                vm.height = window_height - 270;
                $('.write').outerHeight($('.talk').outerHeight() - $('.operation').outerHeight() - 1)
                $('[data-toggle="tooltip"]').tooltip();

                recorder();
                initVideo();
                $timeout(function(){
                    initUploader();

                })

            });
        }

        function submit(){

            roomsService.editRoom(vm.room).then(function (res) {

                if (1 == res.status) {
                    $('#my-create-room').modal('hide');

                    dialog.customSuccess("修改成功");
                    getOneRoom();


                }
                else {
                    dialog.customFail(res.error_msg);
                }
            });
        }

        function getOneRoom(){
            roomsService.getOneRoom(vm.roomId).then(function(res){
                if(res.status == 1){
                    vm.room = res.data;

                }else{
                    dialog.customFail(res.error_msg);
                }
            })
        }

        function getRoomTalkRecord(){
            var params = {
                room_id:vm.roomId,
                page_size:20,
                page:vm.cur_page
            }


            roomsService.getRoomTalkRecord(params).then(function(res){
                if(res.status == 1){
                    if(vm.first){
                        vm.talkRecord = res.data;

                    }
                    vm.first = false;
                    vm.msgRecord = res.data;
                    $timeout(function(){
                        $("#window").animate({scrollTop: $("#window")[0].scrollHeight}, 300);
                        socket.emit('/','joinRoom',{
                            roomId:vm.roomId,
                            user:vm.cur_user
                        });
                    },500)



                }else{
                    dialog.customFail(res.error_msg);
                }
            })
        }

        function goPage(index){
            vm.cur_page = index;
            getRoomTalkRecord();
        }

        function html(str) {
            return $sce.trustAsHtml(str);
        }

        function timeShow(index){
            if(index > 0){
                var this_time = moment(vm.talkRecord.data[index].meta.createAt).format('YYYY-MM-DD H:m');
                var last_time = moment(vm.talkRecord.data[index - 1].meta.createAt).format('YYYY-MM-DD H:m');

                if(this_time == last_time){
                    return false
                }else{
                    return true;

                }
            }else{
                return true;
            }

        }

        function getHeight(index){
            var a = angular.element(".my-comment").eq(index).find(".name").outerHeight()
            var b = angular.element(".my-comment").eq(index).find(".am-comment-main").outerHeight();
            var c = angular.element(".my-comment").eq(index).find(".J-time").outerHeight();
            var d = angular.element(".my-comment").eq(index).find(".J-tip").outerHeight();
            return a + b + c + d + 50;
        }

        function getEmoj(){
            friendsService.getEmoj().then(function(res){
                if(res.status == 1){
                    vm.emoj = res.data;

                }else{
                    dialog.customFail(res.error_msg);
                }
            })
        }

        function addImg(url){
            var img = '<img class="kk-img-responsive" src="'+url+'"/>';
            $('.write').append(img);
        }

        function initUploader() {
            var uploader = simple.uploader({
                url: config.common.api_pre + config.common.img,
                connectionCount: 1
            });
            uploader.on('uploadsuccess', function (e, file, data) {
                if (data.status == 1) {

                    vm.room.pic = data.data;
                    vm.upload_msg = '上传成功';
                    $scope.$apply();

                } else {
                    vm.upload_msg = data.error_msg;
                    $scope.$apply();
                }
            });
            $element.find('.uploader').on('change', function (e) {
                uploader.upload(this.files);
            });
        }

        function uploadFile () {
            var uploader = simple.uploader ({
                url: config.common.api_pre + config.common.file,
                connectionCount: 1
            });

            $ ('.uploader').on ('change', function (e) {
                uploader.upload (this.files);
            });

            uploader.on ('uploadsuccess', function (e, file, res) {
                if (res.status === 1) {
                    if(res.data.type != "image"){
                        dialog.customFail("请上传一张图片");
                    }else{
                        addImg(res.data.path)
                    }
                } else {
                    dialog.customFail(res.error_msg);
                }
            })


        }

        $('.write').bind('keydown',function(event){



            if(event.ctrlKey && event.keyCode == 13){
                event.preventDefault();

                var content = $(this).html();
                if(content.trim()){
                    vm.talk = {
                        content:content,
                        from:vm.cur_user._id,
                        room:vm.roomId,
                        type:"text"
                    };

                    socket.emit('/','say_in_room',vm.talk);
                    $(this).html("");
                }



            }

        });

        $(".voice").bind('click',function(event){
            event.preventDefault();

            return false;


        });

        function recorder(){
            var RECORDER_APP_ID = "recorderApp";
            var $level = $('.level');

            var appWidth = 1;
            var appHeight = 1;
            var flashvars = {'upload_image': '/images/upload.png'};
            var params = {};
            var attributes = {'id': RECORDER_APP_ID, 'name': RECORDER_APP_ID};
            swfobject.embedSWF("/javascript/recorder.swf", "flashcontent", appWidth, appHeight, "11.0.0", "", flashvars, params, attributes);

            window.fwr_event_handler = function fwr_event_handler() {
                var name, $controls;
                switch (arguments[0]) {
                    case "ready":
                        console.log("ready");
                        FWRecorder.uploadFormId = "#uploadForm";
                        FWRecorder.uploadFieldName = "upload_file[filename]";
                        FWRecorder.connect(RECORDER_APP_ID, 0);
                        FWRecorder.recorderOriginalWidth = appWidth;
                        FWRecorder.recorderOriginalHeight = appHeight;
                        break;

                    case "microphone_user_request":
                        console.log("microphone_user_request");

                        FWRecorder.showPermissionWindow();
                        break;

                    case "permission_panel_closed":
                        console.log("permission_panel_closed");

                        FWRecorder.defaultSize();
                        break;

                    case "recording":
                        console.log("recording");

                        FWRecorder.hide();
                        FWRecorder.observeLevel();
                        break;

                    case "recording_stopped":
                        console.log("recording_stopped");

                        FWRecorder.show();
                        FWRecorder.stopObservingLevel();
                        $level.css({height: 0});
                        break;

                    case "microphone_level":
                        console.log("microphone_level");

                        $level.css({height: 32 * arguments[1] + 'px'});
                        break;

                    case "save_pressed":
                        console.log("save_pressed");
                        //$('#upload_form').serializeArray();
                        FWRecorder.updateForm();
                        break;

                    case "saving":
                        name = arguments[1];
                        console.info('saving started', name);
                        break;

                    case "saved":
                        name = arguments[1];
                        var response = arguments[2];
                        console.info('saving success', name, response);
                        break;

                    case "save_failed":
                        name = arguments[1];
                        var errorMessage = arguments[2];
                        console.info('saving failed', name, errorMessage);
                        break;

                    case "save_progress":
                        name = arguments[1];
                        var bytesLoaded = arguments[2];
                        var bytesTotal = arguments[3];
                        console.info('saving progress', name, bytesLoaded, '/', bytesTotal);
                        break;
                }
            };


            function recorderEl() {
                return $('#' + RECORDER_APP_ID);
            }
        }


        function stopAndSend(){

            FWRecorder.stopRecording('audio');


            var uploader = simple.uploader ({
                url: config.common.api_pre + config.common.file,
                connectionCount: 1
            });

            uploader.upload (FWRecorder.getBlob('audio'));

            uploader.on ('uploadsuccess', function (e, file, res) {
                if (res.status === 1) {
                    console.log(res.data);

                    vm.talk = {
                        content:res.data.path,
                        from:vm.cur_user._id,
                        room:vm.roomId,
                        type:"audio"
                    };

                    socket.emit('/','say_in_room',vm.talk);
                    //$scope.$apply ();
                } else {
                    vm.upload_msg = "上传失败,请重新上传";
                }
            })
        }



        function initVideo(){

            var player = videojs("myVideo",
                {
                    controls: true,
                    width: 320,
                    height: 240,
                    plugins: {
                        record: {
                            audio: true,
                            video: true,
                            maxLength: 10,
                            debug: true
                        }
                    }
                });
// error handling
            player.on('deviceError', function()
            {
                console.log('device error:', player.deviceErrorCode);
            });

// user clicked the record button and started recording
            player.on('startRecord', function()
            {
                console.log('started recording!');
            });

// user completed recording and stream is available
            player.on('finishRecord', function()
            {
                // the blob object contains the recorded data that
                // can be downloaded by the user, stored on server etc.
                console.log('finished recording: ', player.recordedData);
                var uploader = simple.uploader ({
                    url: config.common.api_pre + config.common.file,
                    connectionCount: 1
                });

                if(player.recordedData.video){
                    uploader.upload (player.recordedData.video);

                }else{
                    uploader.upload (player.recordedData);

                }

                uploader.on ('uploadsuccess', function (e, file, res) {
                    if (res.status === 1) {
                        console.log(res.data);
                        //player.recorder.destroy();
                        vm.talk = {
                            content:res.data.path,
                            from:vm.cur_user._id,
                            room:vm.roomId,
                            type:"video"
                        };

                        socket.emit('/','say_in_room',vm.talk);
                        //$scope.$apply ();
                    } else {
                        vm.upload_msg = "上传失败,请重新上传";
                    }
                })
            });

            $('.kk-video').on('show.bs.dropdown', function () {
                // do something…

                player.recorder.getDevice();


            })

            $('.kk-video').on('hide.bs.dropdown', function () {
                // do something…

                player.recorder.stopDevice();

            })




        }





        socket.on('/',"join_tip",function(data){
            vm.talkRecord.data.push({
                tip:data.tip,
                meta:{
                    createAt:new Date()
                }

            });
            $("#window").animate({scrollTop: $("#window")[0].scrollHeight}, 300);


            socket.emit('/',"getOnlineUsers",{
                roomId:vm.roomId
            })
        });

        socket.on('/',"leave_tip",function(data){
            vm.talkRecord.data.push({
                tip:data.tip,
                meta:{
                    createAt:new Date()
                }

            });
            $("#window").animate({scrollTop: $("#window")[0].scrollHeight}, 300);


            socket.emit('/',"getOnlineUsers",{
                roomId:vm.roomId
            })
        });

        socket.on('/',"onlineUsers",function(data){
            vm.onlineUsers = data.users;
        });

        socket.on('/',"getSomeSay",function(data){
            vm.talkRecord.data.push(data);
            $("#window").animate({scrollTop: $("#window")[0].scrollHeight}, 300);
        });

        //socket.on('/','test',function(data){
        //    console.log(data);
        //})

        function showOneUser(event,user){

            //return false;
            var x = event.pageX - 200 + 'px';
            var y = event.pageY + $(document).scrollTop() + 'px';
            dialog.showUser(x,y,user);
        }

        function closeOneUser(){
            $('#user-panel').remove();
        }

    }

} ());
