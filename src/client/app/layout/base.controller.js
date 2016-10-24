(function () {
    'use strict';

    angular.module("app.layout")
        .controller("app.layout.BaseController", BaseController);

    BaseController.$inject = [ '$scope','$state','layoutService','$rootScope','dialog','friendsService','socket'];

    function BaseController( $scope,$state,layoutService,$rootScope,dialog,friendsService,socket) {

        var vm = this;
        vm.users = {};
        vm.cur_user = JSON.parse(sessionStorage.getItem("user"));

        vm.index = 0;
        vm.searchUser = searchUser;
        vm.cur_page = 1;
        vm.goPage = goPage;
        vm.step = 1;

        vm.params = {
            msg:'我是'
        };
        vm.sendFriendMsg = sendFriendMsg;
        vm.goToStep2 = goToStep2;
        vm.showOneUser = showOneUser;
        vm.closeOneUser = closeOneUser;

        activate();

        function activate() {

            $("#jquery_jplayer_1").jPlayer({
                ready: function () {
                    $(this).jPlayer("setMedia", {
                        mp3: "/javascript/tip.mp3"
                    });
                },
                supplied: "mp3"
            });
            socket.emit('/','con');
            stateEvent();

        }


        function stateEvent() {

            $rootScope.$on('$stateChangeStart',
                function (event, toState, toParams, fromState, fromParams) {
                    if(fromState.name == 'rooms.room'){

                        socket.emit('/','leaveRoom',{
                            roomId:fromParams.id,
                            user:vm.cur_user
                        });

                    }

                });

            $rootScope.$on('$stateChangeSuccess',
                function (event, toState, toParams, fromState, fromParams) {
                    if ($state.is('login') || $state.is('reg')) {
                        vm.special = true;
                    } else if ($state.is('four0four')) {
                        vm.special = true;
                    } else {
                        vm.special = false;
                        vm.cur_user = JSON.parse(sessionStorage.getItem("user"));
                    }
                    if($state.current.name!='login' && $state.current.name!='reg'){
                        getSession();
                    }
                });

        }

        function getSession() {
            layoutService.isLogined().then(function(res){
                if(res.status == 1){
                    socket.emit('/','login',{
                        user:res.data
                    })

                }else{
                    $state.go('login');

                }
            })
        }

        function searchUser(){
            vm.cur_page = 1;
            getSpUsers();
        }

        function getSpUsers(){
            var params = {
                condition:vm.condition,
                page_size:6,
                page:vm.cur_page
            }
            layoutService.searchUser(params).then(function(res){
                if(res.status == 1){
                    vm.users = res.data;
                }else{
                    dialog.customFail(res.error_msg);
                }
            })
        }

        function goPage(index){
            vm.cur_page = index;
            getSpUsers();
        }

        function goToStep2(id){

            if(vm.cur_user._id == id){
                dialog.customFail("不能和自己成为好友");

            }else{
                var _id = vm.cur_user._id;

                friendsService.getFriends(_id).then(function(res){
                    if(res.status == 1){
                        var friends = res.data;
                        if(isFriend(id,friends)){
                            dialog.customFail("对方已经是您的好友");
                        }else{
                            vm.step = 2;
                            vm.params.to = id;
                        }
                    }else{
                        dialog.customFail(res.error_msg);
                    }
                })

            }
        }

        function isFriend(id,data){
            var boo = false;
            for(var d in data){
                if(data[d].friend._id == id){
                    boo = true;
                    break;
                }
            }

            return boo;
        }



        function sendFriendMsg(){

            vm.params.from = vm.cur_user._id;
            var params = vm.params;
            friendsService.sendFriendMsg(params).then(function(res){
                if(res.status == 1){
                    dialog.customSuccess('发送成功');
                    vm.step = 1;
                    socket.emit('/','say_private',{
                        type:'to_friend',
                        talk:res.data
                    });
                }else{
                    dialog.customFail(res.error_msg);
                }
            })
        }

        function showOneUser(event,user){

            //return false;
            var x = event.pageX + 'px';
            var y = event.pageY + $(document).scrollTop() + 'px';
            dialog.showUser(x,y,user);
        }

        function closeOneUser(){
            $('#user-panel').remove();
        }

    }


}());
