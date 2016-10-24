(function () {
    'use strict';

    angular.module ("app.layout")
        .controller ("app.layout.SidebarController", SidebarController);

    SidebarController.$inject = ['$state', '$rootScope', 'layoutService', '$q','$scope','socket'];

    function SidebarController ($state, $rootScope, layoutService, $q,$scope,socket) {

        var vm = this;
        vm.logout = logout;
        vm.showSearch = showSearch;

        vm.cur_user = JSON.parse(sessionStorage.getItem("user"));


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

        function showSearch(){
            $('#my-search').modal('show');
        }


        socket.on('/','logout',function(data){
            logout();
        })

        socket.on('/','getSession',function(){
            vm.cur_user = JSON.parse(sessionStorage.getItem("user"));

        });




    }


} ());
