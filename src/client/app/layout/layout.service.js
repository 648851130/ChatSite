(function() {
    'use strict';

    angular.module("app.layout")
        .factory("layoutService", layoutService);

    layoutService.$inject = [ '$http','DataService','config'];

    function layoutService( $http, DataService,config) {

        var success = DataService.success;
        var fail = DataService.fail;

        var service = {
            isLogined:isLogined,
            postReg:postReg,
            login:login,
            logout:logout,
            searchUser:searchUser,
            getOneUser:getOneUser
        };

        return service;

        function isLogined(){
            return $http.get(config.user.api_pre + config.user.isLogined)
                .then(success)
                .catch(fail);
        }

        function postReg(params){
            return $http.post(config.user.api_pre + config.user.reg,params)
                .then(success)
                .catch(fail);
        }

        function login(params){
            return $http.post(config.user.api_pre + config.user.login,params)
                .then(success)
                .catch(fail);
        }

        function logout(){
            return $http.post(config.user.api_pre + config.user.logout)
                .then(success)
                .catch(fail);
        }

        function searchUser(params){
            return $http.get(config.user.api_pre + config.user.searchUser,{params:params})
                .then(success)
                .catch(fail);
        }

        function getOneUser(id){
            return $http.get(config.user.api_pre + config.user.user + '/' + id)
                .then(success)
                .catch(fail);
        }

    }

}());
