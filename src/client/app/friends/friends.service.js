(function() {
    'use strict';

    angular.module("app.friends")
        .factory("friendsService", friendsService);

    friendsService.$inject = [ '$http','DataService','config'];

    function friendsService( $http, DataService,config) {

        var success = DataService.success;
        var fail = DataService.fail;

        var service = {
            sendFriendMsg:sendFriendMsg,
            getFriendsMsg:getFriendsMsg,
            getFriends:getFriends,
            beToFriend:beToFriend,
            getFriendsTalkRecord:getFriendsTalkRecord,
            getEmoj:getEmoj
        };

        return service;

        function sendFriendMsg(params){
            return $http.post(config.friends.api_pre + config.friends.friend,params)
                .then(success)
                .catch(fail);
        }

        function getFriendsMsg(id){
            return $http.get(config.friends.api_pre + config.friends.friends_msg + '/' + id)
                .then(success)
                .catch(fail);
        }

        function getFriends(id){
            return $http.get(config.friends.api_pre + config.friends.friend + '/' + id)
                .then(success)
                .catch(fail);
        }

        function beToFriend(id,params){
            return $http.put(config.friends.api_pre + config.friends.friend + '/' + id,params)
                .then(success)
                .catch(fail);
        }

        function getFriendsTalkRecord(params){
            return $http.get(config.talk_record.api_pre + config.talk_record.friend,{params:params})
                .then(success)
                .catch(fail);
        }

        function getEmoj(){
            return $http.get(config.common.api_pre + config.common.emoj)
                .then(success)
                .catch(fail);
        }


    }

}());
