(function() {
    'use strict';

    angular.module("app.user.manage")
        .factory("userManageService", userManageService);

    userManageService.$inject = [ '$http','DataService','config'];

    function userManageService( $http, DataService,config) {

        var success = DataService.success;
        var fail = DataService.fail;

        var service = {
            updateUser:updateUser,
            changePwd:changePwd

        };

        return service;

        function updateUser(params){
            return $http.put(config.user.api_pre + config.user.user,params)
                .then(success)
                .catch(fail);
        }

        function changePwd(params){
            return $http.put(config.user.api_pre + config.user.pwd,params)
                .then(success)
                .catch(fail);
        }



    }

}());
