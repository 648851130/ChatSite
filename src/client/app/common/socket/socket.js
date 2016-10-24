(function () {
    'use strict';

    angular
        .module ('common.socket')
        .factory ('socket', socket);

    socket.$inject = ['$rootScope','$location'];


    /* @ngInject */
    function socket ($rootScope,$location) {



        var modal = {
            on: on,
            emit: emit
        };


        return modal;

        function on(url,eventName,callback){
            var socket = io.connect(location.host+url);
            socket.on(eventName,function(){
                var args = arguments;
                $rootScope.$apply(function(){
                    callback.apply(socket,args);
                })
            })
        }

        function emit(url,eventName,data,callback){
            var socket = io.connect(location.host+url);
            socket.emit(eventName,data,function(){
                var args = arguments;
                $rootScope.$apply(function(){
                    if(callback){
                        callback.apply(socket,args);
                    }
                })
            });
        }
    }
}) ();
