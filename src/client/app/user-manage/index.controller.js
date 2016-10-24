(function () {
    'use strict';

    angular.module ('app.user.manage')
        .controller ('app.user.manage.IndexController', IndexController);

    IndexController.$inject = ['$q','userManageService','layoutService','config','dialog','$scope','socket','$state','$timeout'];

    function IndexController ($q,userManageService,layoutService,config,dialog,$scope,socket,$state,$timeout) {
        var vm = this;

        vm.styles = {};
        vm.index = 0;
        vm.submit = submit;
        vm.cur_user = JSON.parse(sessionStorage.getItem("user"));
        vm.submitPwd = submitPwd;

        activate ();

        function activate () {

            var promises = [
                getCurUser()

            ];

            $q.all (promises).then (function () {
                vm.page_loaded = true;
                vm.styles.height = $(window).height();

                uploadFile();

            });
        }

        function getCurUser(){
            layoutService.isLogined().then(function(res){
                if(res.status == 1){
                    vm.user = res.data;
                }else{
                    dialog.customFail(res.error_msg);
                }
            })
        }

        function logout(){

            layoutService.logout().then(function (res) {

                if (1 == res.status) {
                    socket.emit('disconnect');
                    $state.go('login');
                }
                else {
                    alert(res.error_msg);
                }
            });
        }

        function submitPwd(){
            if(!vm.form2.$valid){
                return false;
            }
            if(vm.nuser.password !== vm.nuser.cpwd){
                return false;
            }
            userManageService.changePwd(vm.nuser).then(function(res){
                if(res.status == 1){
                    dialog.customSuccess("修改成功！请重新登录");
                    $timeout(function(){
                        logout();
                    },1000)
                }else{
                    dialog.customFail(res.error_msg);
                }
            })

        }

        function submit(){


            if(!vm.form.$valid){
                return false;
            }


            userManageService.updateUser(vm.user).then(function(res){
                if(res.status == 1){
                    dialog.customSuccess("修改成功！");

                    sessionStorage.setItem('user',JSON.stringify(res.data));
                    socket.emit('/','login',{
                        user:res.data
                    });
                    socket.emit('/','upUserInfo');
                    vm.cur_user = JSON.parse(sessionStorage.getItem("user"));
                    getCurUser();
                }else{
                    dialog.customFail(res.error_msg);
                }
            })
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
                        dialog.customFail("请选择一张图片");
                    }else{
                        vm.user.head = res.data.path;
                        $scope.$apply();
                    }
                } else {
                    dialog.customFail("请选择一张图片");
                }
            })


        }




    }

} ());
