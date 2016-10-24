(function () {
    'use strict';

    angular.module("app.layout")
        .controller("app.layout.RegController", RegController);

    RegController.$inject = ['layoutService', '$state','$rootScope','dialog'];

    function RegController(layoutService, $state,$rootScope,dialog) {

        var vm = this;

        vm.user = {};
        vm.postReg = postReg;



        function postReg(){

            if(vm.user.password != vm.cpwd){
                dialog.customFail("密码不一致！");
                return;
            }
            var params = {
                user:vm.user
            };
            layoutService.postReg(params).then(function (res) {

                if (1 == res.status) {

                    dialog.customSuccess(res.data);
                }
                else {
                    dialog.customFail(res.error_msg);
                }
            });
        }

    }
}());
