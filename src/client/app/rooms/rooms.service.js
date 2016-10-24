(function() {
    'use strict';

    angular.module("app.rooms")
        .factory("roomsService", roomsService);

    roomsService.$inject = [ '$http','DataService','config'];

    function roomsService( $http, DataService,config) {

        var success = DataService.success;
        var fail = DataService.fail;

        var service = {
            addRoom:addRoom,
            editRoom:editRoom,
            getOneRoom:getOneRoom,
            getRooms:getRooms,
            getRoomTalkRecord:getRoomTalkRecord

        };

        return service;

        function addRoom(params){
            return $http.post(config.rooms.api_pre + config.rooms.room,params)
                .then(success)
                .catch(fail);
        }

        function editRoom(params){
            return $http.put(config.rooms.api_pre + config.rooms.room,params)
                .then(success)
                .catch(fail);
        }

        function getOneRoom(id){
            return $http.get(config.rooms.api_pre + config.rooms.room + '/' + id)
                .then(success)
                .catch(fail);
        }

        function getRooms(){
            return $http.get(config.rooms.api_pre + config.rooms.room)
                .then(success)
                .catch(fail);
        }

        function getRoomTalkRecord(params){
            return $http.get(config.talk_record.api_pre + config.talk_record.room,{params:params})
                .then(success)
                .catch(fail);
        }



    }

}());
