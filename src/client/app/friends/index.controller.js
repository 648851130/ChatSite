(function () {
    'use strict';

    angular.module ('app.friends')
        .controller ('app.friends.IndexController', IndexController);

    IndexController.$inject = ['$q','friendsService','dialog','socket','$timeout','config','$scope','$sce'];

    function IndexController ($q,friendsService,dialog,socket,$timeout,config,$scope,$sce) {
        var vm = this;

        vm.friends = [1,2,3,4,5]
        vm.isMsg = true;
        vm.getFriendsMsg = getFriendsMsg;
        vm.cur_user = JSON.parse(sessionStorage.getItem("user"));
        vm.beToFriend = beToFriend;
        vm.moment = moment;
        vm.goToTalk = goToTalk;
        vm.talk = {};
        vm.action = config.common.api_pre + config.common.file;
        vm.stopAndSend = stopAndSend;
        vm.getHeight = getHeight;
        vm.html = html;
        vm.addImg = addImg;
        vm.timeShow = timeShow;
        vm.cur_page = 1;
        vm.goPage = goPage;
        vm.first = true;
        vm.active = -1;
        vm.new_tip = {};
        vm.talkRecord = {};
        vm.showOneUser = showOneUser;
        vm.closeOneUser = closeOneUser;

        activate ();

        function activate () {
            uploadFile();

            var promises = [
                getFriends(),
                getEmoj()

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

            });
        }

        function goPage(index){
            vm.cur_page = index;
            vm.first = false;
            getFriendsTalkRecord();
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
            return a + b + c + 50;
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

        //发送语音
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
                        to:vm.friend._id,
                        type:"audio"
                    };
                    socket.emit('/','say_private',{
                        talk:vm.talk,
                        type:'say'
                    });
                    //$scope.$apply ();
                } else {
                    vm.upload_msg = "上传失败,请重新上传";
                }
            })
        }

        function getFriendsTalkRecord(){
            var params = {
                from:vm.cur_user._id,
                to:vm.friend._id,
                page_size:20,
                page:vm.cur_page
            };


            friendsService.getFriendsTalkRecord(params).then(function(res){
                if(res.status == 1){
                    if(vm.first){
                        vm.talkRecord = res.data;

                    }

                    vm.msgRecord = res.data;
                    $timeout(function(){
                        $("#window").animate({scrollTop: $("#window")[0].scrollHeight}, 300);
                    },500)


                }else{
                    dialog.customFail(res.error_msg);
                }
            })
        }

        function getFriendsMsg(){
            vm.isMsg = true;
            vm.now_id = -2;
            vm.new_tip.ff = false;
            var id = vm.cur_user._id;

            friendsService.getFriendsMsg(id).then(function(res){
                if(res.status == 1){
                    vm.friendsMsg = res.data;

                }else{
                    dialog.customFail(res.error_msg);
                }
            })
        }

        function beToFriend(id,state){

            var params = {
                state:state
            }

            friendsService.beToFriend(id,params).then(function(res){
                if(res.status == 1){

                    socket.emit('/','say_private',{
                        type:'to_friend',
                        talk:{
                            to:res.data.from
                        }
                    });

                }else{
                    dialog.customFail(res.error_msg);
                }
            })
        }

        socket.on('/','getMsg',function(){
            vm.new_tip.ff = true;

            getFriendsMsg();
            getFriends();
        })

        function getFriends(){
            var id = vm.cur_user._id;

            friendsService.getFriends(id).then(function(res){
                if(res.status == 1){
                    vm.friends = res.data;
                }else{
                    dialog.customFail(res.error_msg);
                }
            })
        }

        function goToTalk(index,friend){
            vm.isMsg = false;
            vm.now_id = friend._id;
            vm.new_tip[vm.now_id] = false;
            vm.active = index;
            vm.friend = friend;
            vm.first = true;
            getFriendsTalkRecord();

        }


        //
        $('.write').bind('keydown',function(event){



            if(event.ctrlKey && event.keyCode == 13){
                event.preventDefault();

                var content = $(this).html();
                if(content.trim()){
                    vm.talk = {
                        content:content,
                        from:vm.cur_user._id,
                        to:vm.friend._id,
                        type:"text"
                    };

                    socket.emit('/','say_private',{
                        type:'say',
                        talk:vm.talk
                    });
                    $(this).html("");
                }



            }

        });

        $(".voice").bind('click',function(event){
            event.preventDefault();

            return false;


        });



        socket.on('/',"send_private",function(params){
            if(vm.talkRecord.data){
                vm.talkRecord.data.push(params);

            }
            vm.new_tip[params.from._id] = true;
            //console.log(vm.new_tip);
            getFriends();
            $("#window").animate({scrollTop: $("#window")[0].scrollHeight}, 300);
        })


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




        //录像

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
                            to:vm.friend._id,
                            type:"video"
                        };
                        socket.emit('/','say_private',{
                            type:'say',
                            talk:vm.talk
                        });
                        //$scope.$apply ();
                    } else {
                        dialog.customFail("请选择一张图片");
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


        function showOneUser(event,user){

            console.log(111)
            //return false;
            var x = event.pageX + 'px';
            var y = event.pageY + $(document).scrollTop() + 'px';
            dialog.showUser(x,y,user);
        }

        function closeOneUser(){
            console.log(1)
            $('#user-panel').remove();
        }


    }

} ());
