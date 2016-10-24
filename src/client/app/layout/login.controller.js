(function () {
    'use strict';

    angular.module("app.layout")
        .controller("app.layout.LoginController", LoginController);

    LoginController.$inject = ['layoutService', '$state','$rootScope','dialog','socket'];

    function LoginController(layoutService, $state,$rootScope,dialog,socket) {

        var vm = this;

        vm.login = login;

        vm.user = {};

        function login(){
            var params = {
                user:vm.user
            };
            layoutService.login(params).then(function (res) {

                if (1 == res.status) {
                    sessionStorage.setItem('user',JSON.stringify(res.data));
                    socket.emit('/','upUserInfo');
                    //window.location.href = "/#/friends/index"
                    $state.go('friends.index');
                }
                else {
                    dialog.customFail(res.error_msg);
                }
            });
        }


    }
}());
